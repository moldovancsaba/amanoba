/**
 * Backfill course.lessonQuizPolicy from legacy course fields and lesson quizConfig.
 *
 * Decisions:
 * - Conflict precedence: most-common lesson behavior per field; ties use strictest rule.
 * - Persistence: writes course.lessonQuizPolicy only (does not scrub lesson.quizConfig).
 * - Report: JSON artifact under scripts/reports/.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backfill-course-quiz-policy.ts
 *   npx tsx --env-file=.env.local scripts/backfill-course-quiz-policy.ts --apply
 *   npx tsx --env-file=.env.local scripts/backfill-course-quiz-policy.ts --apply --force
 */

import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB, { disconnectDB } from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { buildCourseQuizPolicyBackfillPlan } from '../app/lib/course-quiz-policy-backfill';

async function main() {
  const apply = process.argv.includes('--apply');
  const force = process.argv.includes('--force');
  const reportDir = join(process.cwd(), 'scripts', 'reports');
  mkdirSync(reportDir, { recursive: true });

  if (!apply) {
    console.log('Dry-run (no DB writes). Use --apply to persist course.lessonQuizPolicy.\n');
  }

  await connectDB();

  const courses = await Course.find({})
    .select('courseId lessonQuizPolicy quizMaxWrongAllowed defaultLessonQuizQuestionCount')
    .lean();
  const lessons = await Lesson.find({})
    .select('lessonId courseId quizConfig')
    .lean();

  const lessonsByCourse = new Map<string, Array<{ lessonId: string; quizConfig?: unknown }>>();
  for (const lesson of lessons) {
    const courseKey = String((lesson as { courseId?: { toString(): string } }).courseId ?? '');
    const bucket = lessonsByCourse.get(courseKey) ?? [];
    bucket.push({
      lessonId: String((lesson as { lessonId: string }).lessonId),
      quizConfig: (lesson as { quizConfig?: unknown }).quizConfig,
    });
    lessonsByCourse.set(courseKey, bucket);
  }

  const plans = courses.map((course) =>
    buildCourseQuizPolicyBackfillPlan({
      courseId: String((course as { courseId: string }).courseId),
      course: course as Parameters<typeof buildCourseQuizPolicyBackfillPlan>[0]['course'],
      lessons: lessonsByCourse.get(String((course as { _id?: { toString(): string } })._id)) ?? [],
      force,
    })
  );

  const toApply = plans.filter(
    (plan) => plan.changed && plan.action !== 'skip_has_explicit_policy' && plan.action !== 'skip_no_sources'
  );
  const conflictCourses = plans.filter((plan) => plan.conflicts.length > 0 || plan.divergentLessonIds.length > 0);

  console.log(`Courses scanned: ${plans.length}`);
  console.log(`Would apply: ${toApply.length}`);
  console.log(`With conflicts: ${conflictCourses.length}`);
  console.log(`Skipped (explicit policy): ${plans.filter((p) => p.action === 'skip_has_explicit_policy').length}`);
  console.log(`Skipped (no sources): ${plans.filter((p) => p.action === 'skip_no_sources').length}`);

  if (apply) {
    for (const plan of toApply) {
      await Course.updateOne(
        { courseId: plan.courseId },
        { $set: { lessonQuizPolicy: plan.proposedPolicy } }
      );
      console.log(`Updated ${plan.courseId}`);
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = join(reportDir, `course-quiz-policy-backfill__${timestamp}.json`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        apply,
        force,
        summary: {
          coursesScanned: plans.length,
          wouldApply: toApply.length,
          withConflicts: conflictCourses.length,
        },
        plans,
      },
      null,
      2
    )
  );

  console.log(`Report: ${reportPath}`);

  await disconnectDB();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
