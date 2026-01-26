/**
 * Quiz Quality Pipeline (Repeatable)
 *
 * Goal: Provide a single, repeatable process:
 *   Audit lessons → Quality-gate → Produce refinement tasks → Rewrite quizzes (0 recall) → Report
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts [--course COURSE_ID] [--min-lesson-score 70] [--dry-run]
 *
 * Notes:
 * - Does NOT invent lesson content; if a lesson is too weak, it is flagged for refinement and quiz rewrite is skipped.
 * - Deduplicates duplicate day lessons by choosing the oldest lesson per dayNumber.
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { generateContentBasedQuestions } from './content-based-question-generator';
import { validateLessonQuestions, validateQuestionQuality } from './question-quality-validator';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course');
const MIN_LESSON_SCORE = Number(getArgValue('--min-lesson-score') || '70');
const DRY_RUN = process.argv.includes('--dry-run');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const BACKUP_DIR = getArgValue('--backup-dir') || join(process.cwd(), 'scripts', 'quiz-backups');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  await connectDB();

  const courseFilter: any = { isActive: true };
  if (COURSE_ID) courseFilter.courseId = COURSE_ID;

  const courses = await Course.find(courseFilter).sort({ createdAt: 1, _id: 1 }).lean();
  const stamp = isoStamp();
  mkdirSync(OUT_DIR, { recursive: true });

  const pipelineReport: any = {
    generatedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    minLessonScore: MIN_LESSON_SCORE,
    courseFilter: COURSE_ID || null,
    totals: {
      courses: courses.length,
      lessonsEvaluated: 0,
      lessonsNeedingRefine: 0,
      lessonsRewritten: 0,
      lessonsFailedRewrite: 0,
      questionsDeleted: 0,
      questionsInserted: 0,
    },
    lessons: [] as any[],
  };

  const refineTasks: string[] = [];
  const rewriteFailureTasks: string[] = [];

  for (const course of courses) {
    const lessons = await Lesson.find({ courseId: course._id, isActive: true })
      .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
      .select({ lessonId: 1, dayNumber: 1, title: 1, content: 1, language: 1, createdAt: 1 })
      .lean();

    // Deduplicate by dayNumber (keep oldest record per day)
    const byDay = new Map<number, any>();
    for (const lesson of lessons) {
      const existing = byDay.get(lesson.dayNumber);
      if (!existing) {
        byDay.set(lesson.dayNumber, lesson);
        continue;
      }
      const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
      const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
      if (b < a) byDay.set(lesson.dayNumber, lesson);
    }

    for (const lesson of byDay.values()) {
      pipelineReport.totals.lessonsEvaluated++;

      const lessonQuality = assessLessonQuality({
        title: lesson.title || '',
        content: lesson.content || '',
        language: course.language || lesson.language || 'en',
      });

      const lessonRow: any = {
        courseId: course.courseId,
        courseName: course.name,
        language: course.language,
        dayNumber: lesson.dayNumber,
        lessonId: lesson.lessonId,
        title: lesson.title,
        lessonCreatedAt: lesson.createdAt,
        lessonQuality,
        action: 'SKIP',
        rewrite: null as any,
      };

      if (lessonQuality.score < MIN_LESSON_SCORE) {
        pipelineReport.totals.lessonsNeedingRefine++;
        lessonRow.action = 'REFINE_LESSON_FIRST';
        refineTasks.push(
          `- [ ] **${course.courseId}** Day ${lesson.dayNumber} — ${lesson.title} (lessonId: \`${lesson.lessonId}\`)\\n` +
            `  - Score: **${lessonQuality.score}/100**\\n` +
            `  - Issues: ${lessonQuality.issues.join(', ') || 'none'}\\n`
        );
        pipelineReport.lessons.push(lessonRow);
        continue;
      }

      // Load and validate existing questions first.
      const existing = await QuizQuestion.find({
        isActive: true,
        isCourseSpecific: true,
        courseId: course._id,
        lessonId: lesson.lessonId,
      })
        .sort({ _id: 1 })
        .lean();

      const validExisting: any[] = [];
      const invalidExisting: any[] = [];
      for (const q of existing) {
        const v = validateQuestionQuality(
          q.question || '',
          q.options || [],
          (q.questionType as any) || 'application',
          (q.difficulty as any) || 'MEDIUM',
          course.language,
          lesson.title,
          lesson.content
        );
        if (v.isValid) validExisting.push(q);
        else invalidExisting.push(q);
      }

      const existingCounts = {
        total: existing.length,
        valid: validExisting.length,
        invalid: invalidExisting.length,
        application: validExisting.filter(q => q.questionType === 'application').length,
        critical: validExisting.filter(q => q.questionType === 'critical-thinking').length,
        recall: validExisting.filter(q => q.questionType === 'recall').length,
      };

      // If we already have enough valid questions (>=7) and enough application (>=5), don't rewrite.
      if (existingCounts.valid >= 7 && existingCounts.application >= 5 && existingCounts.recall === 0) {
        // Optionally clean up invalid questions (do not delete just because there are >7).
        if (!DRY_RUN && existingCounts.invalid > 0) {
          const ids = invalidExisting.map(q => q._id);
          await QuizQuestion.deleteMany({ _id: { $in: ids } });
        }

        lessonRow.action = DRY_RUN ? 'VALIDATED_EXISTING' : (existingCounts.invalid > 0 ? 'CLEANED_INVALID' : 'PASS');
        lessonRow.rewrite = { existingCounts, cleanedInvalid: existingCounts.invalid > 0 };
        pipelineReport.lessons.push(lessonRow);
        continue;
      }

      // Generate additional questions (do not delete valid ones; only remove invalid ones).
      const neededTotal = Math.max(0, 7 - existingCounts.valid);
      const neededApp = Math.max(0, 5 - existingCounts.application);
      const generateTarget = Math.max(neededTotal, neededApp, 7);

      const generated = generateContentBasedQuestions(
        lesson.dayNumber,
        lesson.title || '',
        lesson.content || '',
        course.language,
        course.courseId,
        validExisting,
        generateTarget
      );

      const validatedNew: any[] = [];
      for (const q of generated) {
        const v = validateQuestionQuality(
          q.question,
          q.options,
          q.questionType as any,
          q.difficulty as any,
          course.language,
          lesson.title,
          lesson.content
        );
        if (v.isValid) validatedNew.push(q);
      }

      const toAdd = validatedNew.slice(0, Math.max(neededTotal, neededApp));
      const combinedForValidation = [
        ...validExisting.map(q => ({
          question: q.question,
          options: q.options,
          questionType: q.questionType,
          difficulty: q.difficulty,
        })),
        ...toAdd.map(q => ({
          question: q.question,
          options: q.options,
          questionType: q.questionType,
          difficulty: q.difficulty,
        })),
      ];

      const batchValidation = validateLessonQuestions(combinedForValidation as any, course.language, lesson.title);

      if (!batchValidation.isValid) {
        pipelineReport.totals.lessonsFailedRewrite++;
        lessonRow.action = 'REWRITE_FAILED';
        lessonRow.rewrite = { errors: batchValidation.errors, warnings: batchValidation.warnings, existingCounts, generateTarget };
        rewriteFailureTasks.push(
          `- [ ] **${course.courseId}** Day ${lesson.dayNumber} — ${lesson.title} (lessonId: \`${lesson.lessonId}\`)\\n` +
            `  - Failed quiz rewrite under strict QC\\n` +
            `  - First error: ${batchValidation.errors[0] || 'Unknown'}\\n`
        );
        pipelineReport.lessons.push(lessonRow);
        continue;
      }

      // Backup existing questions (before deleting invalid ones or inserting new ones)
      const courseFolder = join(BACKUP_DIR, course.courseId);
      mkdirSync(courseFolder, { recursive: true });
      const backupPath = join(courseFolder, `${lesson.lessonId}__${stamp}.json`);
      writeFileSync(
        backupPath,
        JSON.stringify(
          {
            backedUpAt: new Date().toISOString(),
            course: { courseId: course.courseId, name: course.name, language: course.language },
            lesson: { dayNumber: lesson.dayNumber, title: lesson.title, lessonId: lesson.lessonId },
            questionCount: existing.length,
            questions: existing.map(q => ({
              _id: String(q._id),
              uuid: q.uuid,
              questionType: q.questionType,
              difficulty: q.difficulty,
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              hashtags: q.hashtags,
            })),
          },
          null,
          2
        )
      );

      if (!DRY_RUN) {
        // Delete only invalid questions (never delete just for being >7)
        if (invalidExisting.length > 0) {
          const delInvalid = await QuizQuestion.deleteMany({ _id: { $in: invalidExisting.map(q => q._id) } });
          pipelineReport.totals.questionsDeleted += delInvalid.deletedCount || 0;
        }

        const toInsert = toAdd.map(q => ({
          uuid: randomUUID(),
          lessonId: lesson.lessonId,
          courseId: course._id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          difficulty: q.difficulty,
          category: q.category,
          isCourseSpecific: true,
          questionType: q.questionType as string,
          hashtags: q.hashtags,
          isActive: true,
          showCount: 0,
          correctCount: 0,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            auditedAt: new Date(),
            auditedBy: 'quiz-quality-pipeline',
          },
        }));

        if (toInsert.length > 0) {
          await QuizQuestion.insertMany(toInsert);
          pipelineReport.totals.questionsInserted += toInsert.length;
        }
      }

      pipelineReport.totals.lessonsRewritten++;
      lessonRow.action = DRY_RUN ? 'VALIDATED' : 'ENRICHED';
      lessonRow.rewrite = {
        backupPath,
        insertedCount: toAdd.length,
        deletedInvalidCount: invalidExisting.length,
        warnings: batchValidation.warnings,
        existingCounts,
      };
      pipelineReport.lessons.push(lessonRow);
    }
  }

  const reportPath = join(OUT_DIR, `quiz-quality-pipeline__${stamp}.json`);
  writeFileSync(reportPath, JSON.stringify(pipelineReport, null, 2));

  const tasksPath = join(OUT_DIR, `quiz-quality-pipeline__${stamp}__lesson-refine-tasks.md`);
  writeFileSync(
    tasksPath,
    `# Lesson Refinement Tasks\\n\\n` +
      `Generated: ${new Date().toISOString()}\\n` +
      `Min lesson score: ${MIN_LESSON_SCORE}\\n` +
      `Course filter: ${COURSE_ID || 'ALL'}\\n\\n` +
      (refineTasks.length ? refineTasks.join('\\n') : '✅ No lessons flagged for refinement.\\n')
  );

  const rewriteTasksPath = join(OUT_DIR, `quiz-quality-pipeline__${stamp}__rewrite-failures.md`);
  writeFileSync(
    rewriteTasksPath,
    `# Quiz Rewrite Failures (Generator Improvements Needed)\\n\\n` +
      `Generated: ${new Date().toISOString()}\\n` +
      `Strict QC: ON\\n` +
      `Course filter: ${COURSE_ID || 'ALL'}\\n\\n` +
      (rewriteFailureTasks.length ? rewriteFailureTasks.join('\\n') : '✅ No rewrite failures.\\n')
  );

  console.log('✅ Quiz quality pipeline complete');
  console.log(`- Report: ${reportPath}`);
  console.log(`- Lesson refine tasks: ${tasksPath}`);
  console.log(`- Rewrite failure tasks: ${rewriteTasksPath}`);
  console.log(`- Backups: ${BACKUP_DIR}`);
  console.log(JSON.stringify(pipelineReport.totals, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
