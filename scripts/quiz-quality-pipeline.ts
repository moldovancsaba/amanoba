/**
 * Quiz Quality Pipeline (Repeatable)
 *
 * Goal: Provide a single, repeatable process:
 *   Audit lessons → Quality-gate → Produce refinement tasks → Rewrite quizzes (0 recall) → Report
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts [--course COURSE_ID] [--min-lesson-score 70] [--dry-run]
 *   npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course COURSE_ID --lesson-id LESSON_ID [--question-index I] [--dry-run]
 *
 * Tiny-loop (per question): use --lesson-id and --question-index to validate/replace only one question.
 *
 * TINY LOOP (default): All quiz fixes run one question at a time. For each invalid question we generate
 * a replacement, validate it, replace in DB, then move to the next. For each missing slot we generate
 * one question, validate, insert, then move to the next. No batch delete/batch insert — quality is higher
 * when each question is managed individually.
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
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course');
const LESSON_ID = getArgValue('--lesson-id');
const QUESTION_INDEX = (() => {
  const v = getArgValue('--question-index');
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
})();
const MIN_LESSON_SCORE = Number(getArgValue('--min-lesson-score') || '70');
const DRY_RUN = process.argv.includes('--dry-run');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const BACKUP_DIR = getArgValue('--backup-dir') || join(process.cwd(), 'scripts', 'quiz-backups');
const GENERATE_TARGET_MIN = Number(getArgValue('--generate-target-min') || '40');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function writeQuizBackup(params: {
  backupDir: string;
  stamp: string;
  course: any;
  lesson: any;
  existingQuestions: any[];
}) {
  const { backupDir, stamp, course, lesson, existingQuestions } = params;
  const courseFolder = join(backupDir, course.courseId);
  mkdirSync(courseFolder, { recursive: true });
  const backupPath = join(courseFolder, `${lesson.lessonId}__${stamp}.json`);
  writeFileSync(
    backupPath,
    JSON.stringify(
      {
        backedUpAt: new Date().toISOString(),
        course: { courseId: course.courseId, name: course.name, language: course.language },
        lesson: { dayNumber: lesson.dayNumber, title: lesson.title, lessonId: lesson.lessonId },
        questionCount: existingQuestions.length,
        questions: existingQuestions.map(q => ({
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
  return backupPath;
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
    lessonFilter: LESSON_ID || null,
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
      .select({ lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, language: 1, createdAt: 1 })
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
      if (LESSON_ID && lesson.lessonId !== LESSON_ID) continue;
      pipelineReport.totals.lessonsEvaluated++;

      const lessonQuality = assessLessonQuality({
        title: lesson.title || '',
        content: lesson.content || '',
        language: course.language || lesson.language || 'en',
      });
      const languageIntegrity = validateLessonRecordLanguageIntegrity({
        language: String(course.language || lesson.language || 'en'),
        content: lesson.content || '',
        emailSubject: (lesson as any).emailSubject || null,
        emailBody: (lesson as any).emailBody || null,
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
        languageIntegrity,
        action: 'SKIP',
        rewrite: null as any,
      };

      if (!languageIntegrity.ok) {
        pipelineReport.totals.lessonsNeedingRefine++;
        lessonRow.action = 'REFINE_LESSON_FIRST';
        lessonRow.reason = `Language integrity failed: ${languageIntegrity.errors[0] || 'unknown'}`;
        refineTasks.push(
          `- [ ] **${course.courseId}** Day ${lesson.dayNumber} — ${lesson.title} (lessonId: \`${lesson.lessonId}\`)\n` +
            `  - Reason: **LANGUAGE INTEGRITY FAIL**\n` +
            `  - Error: ${languageIntegrity.errors[0] || 'unknown'}\n` +
            (languageIntegrity.findings?.[0]?.snippet ? `  - Example: ${languageIntegrity.findings[0].snippet}\n` : '')
        );
        pipelineReport.lessons.push(lessonRow);
        continue;
      }

      if (lessonQuality.score < MIN_LESSON_SCORE) {
        pipelineReport.totals.lessonsNeedingRefine++;
        lessonRow.action = 'REFINE_LESSON_FIRST';
        refineTasks.push(
          `- [ ] **${course.courseId}** Day ${lesson.dayNumber} — ${lesson.title} (lessonId: \`${lesson.lessonId}\`)\n` +
            `  - Score: **${lessonQuality.score}/100**\n` +
            `  - Issues: ${lessonQuality.issues.join(', ') || 'none'}\n`
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
        .sort({ displayOrder: 1, _id: 1 })
        .lean();

      // Tiny-loop: validate or replace only one question by index.
      if (LESSON_ID && QUESTION_INDEX !== undefined) {
        const atIndex = existing[QUESTION_INDEX];
        if (!atIndex) {
          lessonRow.action = 'NO_QUESTION_AT_INDEX';
          lessonRow.rewrite = { questionIndex: QUESTION_INDEX, existingCount: existing.length };
          pipelineReport.lessons.push(lessonRow);
          continue;
        }
        const singleValidation = validateQuestionQuality(
          atIndex.question || '',
          atIndex.options || [],
          (atIndex.questionType as any) || 'application',
          (atIndex.difficulty as any) || 'MEDIUM',
          course.language,
          lesson.title,
          lesson.content
        );
        if (singleValidation.isValid) {
          lessonRow.action = DRY_RUN ? 'VALIDATED_ONE' : 'VALIDATED_ONE';
          lessonRow.rewrite = { questionIndex: QUESTION_INDEX, validated: true, errors: [] };
          pipelineReport.lessons.push(lessonRow);
          continue;
        }
        // Generate one replacement and replace only this question.
        const generated = generateContentBasedQuestions(
          lesson.dayNumber,
          lesson.title || '',
          lesson.content || '',
          course.language,
          course.courseId,
          existing.filter((_, i) => i !== QUESTION_INDEX),
          15,
          { seed: `${course.courseId}::${lesson.lessonId}::q${QUESTION_INDEX}::${isoStamp()}` }
        );
        let replaced = false;
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
          if (!v.isValid) continue;
          if (!DRY_RUN) {
            await QuizQuestion.deleteOne({ _id: atIndex._id });
            await QuizQuestion.insertMany([
              {
                uuid: randomUUID(),
                lessonId: lesson.lessonId,
                courseId: course._id,
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                difficulty: q.difficulty,
                category: q.category ?? 'Course Specific',
                isCourseSpecific: true,
                questionType: q.questionType as string,
                hashtags: q.hashtags,
                isActive: true,
                displayOrder: QUESTION_INDEX + 1,
                showCount: 0,
                correctCount: 0,
                metadata: {
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  auditedAt: new Date(),
                  auditedBy: 'quiz-quality-pipeline-single',
                },
              },
            ]);
            pipelineReport.totals.questionsDeleted += 1;
            pipelineReport.totals.questionsInserted += 1;
          }
          replaced = true;
          lessonRow.action = DRY_RUN ? 'WOULD_REPLACE_ONE' : 'REPLACED_ONE';
          lessonRow.rewrite = { questionIndex: QUESTION_INDEX, validated: false, errors: singleValidation.errors, replaced: true };
          pipelineReport.lessons.push(lessonRow);
          break;
        }
        if (!replaced) {
          lessonRow.action = 'REPLACE_ONE_FAILED';
          lessonRow.rewrite = { questionIndex: QUESTION_INDEX, errors: singleValidation.errors, replaced: false };
          pipelineReport.lessons.push(lessonRow);
        }
        continue;
      }

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

      const normalizeQuestionText = (text: string) =>
        String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');

      // Duplicate detection among valid questions (normalized question text).
      // Keep the first by _id, delete the rest (never delete just to cap >7).
      const duplicatesToDelete: any[] = [];
      const dedupedValidExisting: any[] = [];
      {
        const byText = new Map<string, any[]>();
        for (const q of validExisting) {
          const key = normalizeQuestionText(q.question);
          if (!key) continue;
          const bucket = byText.get(key);
          if (bucket) bucket.push(q);
          else byText.set(key, [q]);
        }
        for (const [, qs] of byText) {
          qs.sort((a, b) => String(a._id).localeCompare(String(b._id)));
          if (qs.length > 0) dedupedValidExisting.push(qs[0]);
          if (qs.length > 1) duplicatesToDelete.push(...qs.slice(1));
        }
      }

      const dedupedCounts = {
        total: existing.length,
        valid: dedupedValidExisting.length,
        invalid: invalidExisting.length,
        application: dedupedValidExisting.filter(q => q.questionType === 'application').length,
        critical: dedupedValidExisting.filter(q => q.questionType === 'critical-thinking').length,
        recall: dedupedValidExisting.filter(q => q.questionType === 'recall').length,
        duplicates: duplicatesToDelete.length,
      };

      // If we already have enough valid questions (>=7), enough application (>=5),
      // and enough critical thinking (>=2), don't rewrite.
      if (dedupedCounts.valid >= 7 && dedupedCounts.application >= 5 && dedupedCounts.critical >= 2 && dedupedCounts.recall === 0) {
        // Optionally clean up invalid questions and duplicates (do not delete just because there are >7).
        let backupPath: string | null = null;
        if (!DRY_RUN && (dedupedCounts.invalid > 0 || dedupedCounts.duplicates > 0)) {
          backupPath = writeQuizBackup({
            backupDir: BACKUP_DIR,
            stamp,
            course,
            lesson,
            existingQuestions: existing,
          });
          if (invalidExisting.length > 0) {
            const delInvalid = await QuizQuestion.deleteMany({ _id: { $in: invalidExisting.map(q => q._id) } });
            pipelineReport.totals.questionsDeleted += delInvalid.deletedCount || 0;
          }
          if (duplicatesToDelete.length > 0) {
            const delDup = await QuizQuestion.deleteMany({ _id: { $in: duplicatesToDelete.map(q => q._id) } });
            pipelineReport.totals.questionsDeleted += delDup.deletedCount || 0;
          }
        }

        lessonRow.action = DRY_RUN
          ? 'VALIDATED_EXISTING'
          : (dedupedCounts.invalid > 0 || dedupedCounts.duplicates > 0 ? 'CLEANED_INVALID' : 'PASS');
        lessonRow.rewrite = {
          existingCounts: dedupedCounts,
          cleanedInvalid: dedupedCounts.invalid > 0,
          cleanedDuplicates: dedupedCounts.duplicates > 0,
          backupPath,
        };
        pipelineReport.lessons.push(lessonRow);
        continue;
      }

      // ——— TINY LOOP: one question at a time. Replace each invalid individually, then fill missing slots one by one. ———
      const MAX_REPLACE_ATTEMPTS = 5;
      const MAX_FILL_ATTEMPTS_PER_SLOT = 25;
      const CANDIDATES_PER_ATTEMPT = 12;

      const backupPath = writeQuizBackup({
        backupDir: BACKUP_DIR,
        stamp,
        course,
        lesson,
        existingQuestions: existing,
      });

      if (!DRY_RUN) {
        if (duplicatesToDelete.length > 0) {
          const delDup = await QuizQuestion.deleteMany({ _id: { $in: duplicatesToDelete.map(q => q._id) } });
          pipelineReport.totals.questionsDeleted += delDup.deletedCount || 0;
        }
      }

      let insertedCount = 0;
      let replacedCount = 0;
      let currentValid = [...dedupedValidExisting];
      const existingTextKeys = new Set<string>(currentValid.map(q => normalizeQuestionText(q.question)));

      // Phase 1: Replace each invalid question one at a time (generate → validate → replace).
      for (let i = 0; i < invalidExisting.length; i++) {
        const invalidQ = invalidExisting[i];
        const displayOrder = (invalidQ as any).displayOrder ?? currentValid.length + i + 1;
        let replaced = false;
        for (let attempt = 0; attempt < MAX_REPLACE_ATTEMPTS && !replaced; attempt++) {
          const candidates = generateContentBasedQuestions(
            lesson.dayNumber,
            lesson.title || '',
            lesson.content || '',
            course.language,
            course.courseId,
            currentValid,
            CANDIDATES_PER_ATTEMPT,
            { seed: `${course.courseId}::${lesson.lessonId}::replace${i}::${stamp}::a${attempt}` }
          );
          for (const q of candidates) {
            const v = validateQuestionQuality(
              q.question,
              q.options,
              q.questionType as any,
              q.difficulty as any,
              course.language,
              lesson.title,
              lesson.content
            );
            if (!v.isValid) continue;
            const key = normalizeQuestionText(q.question);
            if (!key || existingTextKeys.has(key)) continue;
            if (!DRY_RUN) {
              await QuizQuestion.deleteOne({ _id: invalidQ._id });
              await QuizQuestion.insertMany([
                {
                  uuid: randomUUID(),
                  lessonId: lesson.lessonId,
                  courseId: course._id,
                  question: q.question,
                  options: q.options,
                  correctIndex: q.correctIndex,
                  difficulty: q.difficulty,
                  category: q.category ?? 'Course Specific',
                  isCourseSpecific: true,
                  questionType: q.questionType as string,
                  hashtags: q.hashtags,
                  isActive: true,
                  displayOrder,
                  showCount: 0,
                  correctCount: 0,
                  metadata: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    auditedAt: new Date(),
                    auditedBy: 'quiz-quality-pipeline-tiny-loop',
                  },
                },
              ]);
              pipelineReport.totals.questionsDeleted += 1;
              pipelineReport.totals.questionsInserted += 1;
            }
            existingTextKeys.add(key);
            currentValid.push({ ...q, displayOrder, _id: null });
            replaced = true;
            replacedCount++;
            break;
          }
        }
        if (!replaced && !DRY_RUN) {
          await QuizQuestion.deleteOne({ _id: invalidQ._id });
          pipelineReport.totals.questionsDeleted += 1;
        }
      }

      // Phase 2: Fill missing slots one at a time until we meet 7 total, 5 application, 2 critical.
      let remainingNeededTotal = Math.max(0, 7 - currentValid.length);
      let remainingNeededApp = Math.max(0, 5 - currentValid.filter(q => q.questionType === 'application').length);
      let remainingNeededCritical = Math.max(0, 2 - currentValid.filter(q => q.questionType === 'critical-thinking').length);
      let nextDisplayOrder = Math.max(0, ...currentValid.map(q => (q as any).displayOrder ?? 0)) + 1;
      let fillAttempts = 0;
      const maxFillAttempts = (remainingNeededTotal + 2) * MAX_FILL_ATTEMPTS_PER_SLOT;

      while ((remainingNeededTotal > 0 || remainingNeededApp > 0 || remainingNeededCritical > 0) && fillAttempts < maxFillAttempts) {
        fillAttempts++;
        const preferApp = remainingNeededApp > 0;
        const preferCritical = !preferApp && remainingNeededCritical > 0;
        const candidates = generateContentBasedQuestions(
          lesson.dayNumber,
          lesson.title || '',
          lesson.content || '',
          course.language,
          course.courseId,
          currentValid,
          CANDIDATES_PER_ATTEMPT,
          { seed: `${course.courseId}::${lesson.lessonId}::fill::${stamp}::${fillAttempts}` }
        );
        let added = false;
        for (const q of candidates) {
          const v = validateQuestionQuality(
            q.question,
            q.options,
            q.questionType as any,
            q.difficulty as any,
            course.language,
            lesson.title,
            lesson.content
          );
          if (!v.isValid) continue;
          const key = normalizeQuestionText(q.question);
          if (!key || existingTextKeys.has(key)) continue;
          if (preferApp && q.questionType !== 'application') continue;
          if (preferCritical && q.questionType !== 'critical-thinking') continue;
          if (!DRY_RUN) {
            await QuizQuestion.insertMany([
              {
                uuid: randomUUID(),
                lessonId: lesson.lessonId,
                courseId: course._id,
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                difficulty: q.difficulty,
                category: q.category ?? 'Course Specific',
                isCourseSpecific: true,
                questionType: q.questionType as string,
                hashtags: q.hashtags,
                isActive: true,
                displayOrder: nextDisplayOrder++,
                showCount: 0,
                correctCount: 0,
                metadata: {
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  auditedAt: new Date(),
                  auditedBy: 'quiz-quality-pipeline-tiny-loop',
                },
              },
            ]);
            pipelineReport.totals.questionsInserted += 1;
          }
          existingTextKeys.add(key);
          currentValid.push({ ...q, displayOrder: nextDisplayOrder - 1, _id: null });
          insertedCount++;
          if (q.questionType === 'application' && remainingNeededApp > 0) remainingNeededApp--;
          if (q.questionType === 'critical-thinking' && remainingNeededCritical > 0) remainingNeededCritical--;
          if (remainingNeededTotal > 0) remainingNeededTotal--;
          added = true;
          break;
        }
        if (!added) continue;
      }

      const combinedForValidation = currentValid.map(q => ({
        question: q.question,
        options: q.options ?? [],
        questionType: (q as any).questionType ?? 'application',
        difficulty: (q as any).difficulty ?? 'MEDIUM',
        correctIndex: (q as any).correctIndex ?? 0,
      }));
      const batchValidation = validateLessonQuestions(combinedForValidation as any, course.language, lesson.title);

      if (!batchValidation.isValid) {
        pipelineReport.totals.lessonsFailedRewrite++;
        lessonRow.action = 'REWRITE_FAILED';
        lessonRow.rewrite = { errors: batchValidation.errors, warnings: batchValidation.warnings, existingCounts: dedupedCounts };
        rewriteFailureTasks.push(
          `- [ ] **${course.courseId}** Day ${lesson.dayNumber} — ${lesson.title} (lessonId: \`${lesson.lessonId}\`)\n` +
            `  - Failed quiz rewrite under strict QC\n` +
            `  - First error: ${batchValidation.errors[0] || 'Unknown'}\n`
        );
        pipelineReport.lessons.push(lessonRow);
        continue;
      }

      pipelineReport.totals.lessonsRewritten++;
      lessonRow.action = DRY_RUN ? 'VALIDATED' : 'ENRICHED';
      lessonRow.rewrite = {
        backupPath,
        insertedCount,
        replacedCount,
        deletedInvalidCount: invalidExisting.length,
        deletedDuplicateCount: duplicatesToDelete.length,
        warnings: batchValidation.warnings,
        existingCounts: dedupedCounts,
      };
      pipelineReport.lessons.push(lessonRow);
    }
  }

  const reportPath = join(OUT_DIR, `quiz-quality-pipeline__${stamp}.json`);
  writeFileSync(reportPath, JSON.stringify(pipelineReport, null, 2));

  const tasksPath = join(OUT_DIR, `quiz-quality-pipeline__${stamp}__lesson-refine-tasks.md`);
  writeFileSync(
    tasksPath,
    `# Lesson Refinement Tasks\n\n` +
      `Generated: ${new Date().toISOString()}\n` +
      `Min lesson score: ${MIN_LESSON_SCORE}\n` +
      `Course filter: ${COURSE_ID || 'ALL'}\n\n` +
      (refineTasks.length ? refineTasks.join('\n') : '✅ No lessons flagged for refinement.\n')
  );

  const rewriteTasksPath = join(OUT_DIR, `quiz-quality-pipeline__${stamp}__rewrite-failures.md`);
  writeFileSync(
    rewriteTasksPath,
    `# Quiz Rewrite Failures (Generator Improvements Needed)\n\n` +
      `Generated: ${new Date().toISOString()}\n` +
      `Strict QC: ON\n` +
      `Course filter: ${COURSE_ID || 'ALL'}\n\n` +
      (rewriteFailureTasks.length ? rewriteFailureTasks.join('\n') : '✅ No rewrite failures.\n')
  );

  console.log('✅ Quiz quality pipeline complete');
  console.log(`- Report: ${reportPath}`);
  console.log(`- Lesson refine tasks: ${tasksPath}`);
  console.log(`- Rewrite failure tasks: ${rewriteTasksPath}`);
  console.log(`- Backups: ${BACKUP_DIR}`);
  console.log(JSON.stringify(pipelineReport.totals, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
