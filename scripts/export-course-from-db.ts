/**
 * Export course from DB into package v2 JSON (admin export equivalent, no auth).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/export-course-from-db.ts <courseId> <outPath>
 *
 * Example:
 *   npx tsx --env-file=.env.local scripts/export-course-from-db.ts SPORT_SALES_NETWORK_USA_2026_EN docs/course/SPORT_SALES_NETWORK_USA_2026_EN_export_2026-02-06_DB.json
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, Brand } from '../app/lib/models';
import { contentToMarkdown } from '../app/lib/lesson-content';

const mapToObject = (
  map: Map<string, unknown> | Record<string, unknown> | null | undefined
): Record<string, unknown> => {
  if (!map) return {};
  if (map instanceof Map) return Object.fromEntries(map);
  if (typeof map === 'object') return map as Record<string, unknown>;
  return {};
};

async function main() {
  const courseId = process.argv[2];
  const outPath = process.argv[3];
  if (!courseId || !outPath) {
    console.error('Usage: npx tsx --env-file=.env.local scripts/export-course-from-db.ts <courseId> <outPath>');
    process.exit(1);
  }

  await connectDB();

  const course = await Course.findOne({ courseId }).lean();
  if (!course) {
    console.error(`Course not found: ${courseId}`);
    process.exit(1);
  }

  // Optional brand lookup for default thumbnail in UI exports; not required for package
  if (course.brandId) {
    try {
      await Brand.findById(course.brandId).lean();
    } catch {
      // ignore
    }
  }

  const lessons = await Lesson.find({ courseId: course._id })
    .sort({ dayNumber: 1, displayOrder: 1 })
    .lean();

  const quizQuestions = await QuizQuestion.find({
    courseId: course._id,
    isCourseSpecific: true,
  }).lean();

  const exportData = {
    packageVersion: '2.0',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    exportedBy: 'scripts/export-course-from-db',
    course: {
      courseId: course.courseId,
      name: course.name || '',
      description: course.description || '',
      language: course.language || 'hu',
      thumbnail: course.thumbnail || undefined,
      durationDays: course.durationDays || 30,
      isActive: course.isActive !== undefined ? course.isActive : true,
      requiresPremium: course.requiresPremium !== undefined ? course.requiresPremium : false,
      pointsConfig: course.pointsConfig || {
        completionPoints: 1000,
        lessonPoints: 50,
        perfectCourseBonus: 500,
      },
      xpConfig: course.xpConfig || {
        completionXP: 500,
        lessonXP: 25,
      },
      metadata: course.metadata || {},
      translations: mapToObject(course.translations),
      discussionEnabled: course.discussionEnabled ?? false,
      leaderboardEnabled: course.leaderboardEnabled ?? false,
      studyGroupsEnabled: course.studyGroupsEnabled ?? false,
      ccsId: course.ccsId ?? undefined,
      prerequisiteCourseIds:
        Array.isArray(course.prerequisiteCourseIds) && course.prerequisiteCourseIds.length > 0
          ? course.prerequisiteCourseIds.map((id: unknown) => String(id))
          : undefined,
      prerequisiteEnforcement: course.prerequisiteEnforcement ?? undefined,
      quizMaxWrongAllowed: (course as { quizMaxWrongAllowed?: number }).quizMaxWrongAllowed ?? undefined,
      defaultLessonQuizQuestionCount: (course as { defaultLessonQuizQuestionCount?: number }).defaultLessonQuizQuestionCount ?? undefined,
      certification: course.certification ?? undefined,
    },
    lessons: lessons.map((lesson) => {
      const lessonQuestions = quizQuestions.filter((q) => q.lessonId === lesson.lessonId);
      const rawTranslations = mapToObject(lesson.translations) as Record<
        string,
        { content?: string; emailBody?: string; [k: string]: unknown }
      >;
      const translationsMarkdown: Record<string, unknown> = {};
      for (const [loc, val] of Object.entries(rawTranslations)) {
        if (val && typeof val === 'object') {
          translationsMarkdown[loc] = {
            ...val,
            ...(typeof val.content === 'string' && { content: contentToMarkdown(val.content) }),
            ...(typeof val.emailBody === 'string' && { emailBody: contentToMarkdown(val.emailBody) }),
          };
        } else {
          translationsMarkdown[loc] = val;
        }
      }

      return {
        lessonId: lesson.lessonId,
        dayNumber: lesson.dayNumber || 1,
        language: lesson.language || 'hu',
        title: lesson.title || '',
        content: contentToMarkdown(lesson.content),
        emailSubject: lesson.emailSubject || '',
        emailBody: contentToMarkdown(lesson.emailBody),
        quizConfig: lesson.quizConfig || null,
        unlockConditions: lesson.unlockConditions || {},
        pointsReward: lesson.pointsReward || 0,
        xpReward: lesson.xpReward || 0,
        isActive: lesson.isActive !== undefined ? lesson.isActive : true,
        displayOrder: lesson.displayOrder || lesson.dayNumber || 1,
        metadata: lesson.metadata || {},
        translations: translationsMarkdown,
        quizQuestions: lessonQuestions.map((q) => ({
          uuid: q.uuid ?? undefined,
          questionType: q.questionType ?? undefined,
          hashtags: q.hashtags ?? undefined,
          question: q.question || '',
          options: q.options || [],
          correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
          correctAnswer: (q as { correctAnswer?: string }).correctAnswer ?? undefined,
          wrongAnswers: Array.isArray((q as { wrongAnswers?: string[] }).wrongAnswers)
            ? (q as { wrongAnswers: string[] }).wrongAnswers
            : undefined,
          difficulty: q.difficulty || 'MEDIUM',
          category: q.category || 'Course Specific',
          isActive: q.isActive !== undefined ? q.isActive : true,
        })),
      };
    }),
    canonicalSpec: null,
    courseIdea: null,
  };

  writeFileSync(outPath, JSON.stringify(exportData, null, 2) + '\n', 'utf8');
  console.log(`Exported ${courseId} to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
