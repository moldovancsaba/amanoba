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

async function updateQuestionInPlace(params: {
  id: any;
  course: any;
  lesson: any;
  displayOrder: number;
  generated: any;
  auditedBy: string;
}) {
  const { id, course, lesson, displayOrder, generated, auditedBy } = params;
  await QuizQuestion.updateOne(
    { _id: id },
    {
      $set: {
        lessonId: lesson.lessonId,
        courseId: course._id,
        question: generated.question,
        options: generated.options,
        correctIndex: generated.correctIndex,
        difficulty: generated.difficulty,
        category: generated.category ?? 'Course Specific',
        isCourseSpecific: true,
        questionType: generated.questionType,
        hashtags: generated.hashtags,
        isActive: true,
        displayOrder,
        'metadata.updatedAt': new Date(),
        'metadata.auditedAt': new Date(),
        'metadata.auditedBy': auditedBy,
      },
    }
  );
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

    // Enforce course-wide uniqueness (mandatory): no identical question text inside a course.
    // We dedupe option-sets within a lesson (to reduce repetition), but don't enforce course-wide
    // option-set uniqueness because the generator template space isn't large enough yet.
    const courseSeenTextKeys = new Set<string>();
    const courseSeenOptionSigs = new Set<string>();

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
        // Still proceed to ensure the lesson has at least 7 valid questions (no trimming if extra).
      }

      if (lessonQuality.score < MIN_LESSON_SCORE) {
        pipelineReport.totals.lessonsNeedingRefine++;
        lessonRow.action = 'REFINE_LESSON_FIRST';
        refineTasks.push(
          `- [ ] **${course.courseId}** Day ${lesson.dayNumber} — ${lesson.title} (lessonId: \`${lesson.lessonId}\`)\n` +
            `  - Score: **${lessonQuality.score}/100**\n` +
            `  - Issues: ${lessonQuality.issues.join(', ') || 'none'}\n`
        );
        // Still proceed to ensure the lesson has at least 7 valid questions (no trimming if extra).
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
            await updateQuestionInPlace({
              id: atIndex._id,
              course,
              lesson,
              displayOrder: QUESTION_INDEX + 1,
              generated: q,
              auditedBy: 'quiz-quality-pipeline-single',
            });
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
      const normalizeOptionText = (text: string) =>
        String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const optionSig = (options: any) => {
        const opts = Array.isArray(options) ? options : [];
        return opts.map(normalizeOptionText).sort().join('||');
      };

      // Duplicate detection among valid questions (normalized question text).
      // Keep the first by _id, and replace the duplicates in-place with newly generated unique questions.
      // Never trim just because there are >7.
      const duplicatesToReplace: any[] = [];
      const dedupedValidExisting: any[] = [];
      {
        const dupIds = new Set<string>();
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
          if (qs.length > 1) {
            for (const d of qs.slice(1)) {
              const id = String(d._id);
              if (dupIds.has(id)) continue;
              dupIds.add(id);
              duplicatesToReplace.push(d);
            }
          }
        }

        // Also treat repeated option-sets as duplicates (even if question text differs).
        // This prevents "same answers, rephrased question" within a quiz experience.
        const byOpt = new Map<string, any[]>();
        for (const q of dedupedValidExisting) {
          const sig = optionSig(q.options);
          if (!sig) continue;
          const bucket = byOpt.get(sig);
          if (bucket) bucket.push(q);
          else byOpt.set(sig, [q]);
        }
        for (const [, qs] of byOpt) {
          if (qs.length <= 1) continue;
          qs.sort((a, b) => String(a._id).localeCompare(String(b._id)));
          for (const d of qs.slice(1)) {
            const id = String(d._id);
            if (dupIds.has(id)) continue;
            dupIds.add(id);
            duplicatesToReplace.push(d);
          }
        }

        // Course-level uniqueness (mandatory): replace later duplicates by question text, never trim/delete.
        for (const q of dedupedValidExisting) {
          const id = String(q._id);
          if (dupIds.has(id)) continue;
          const key = normalizeQuestionText(q.question);
          const isDupByText = Boolean(key) && courseSeenTextKeys.has(key);
          if (isDupByText) {
            dupIds.add(id);
            duplicatesToReplace.push(q);
            continue;
          }
          if (key) courseSeenTextKeys.add(key);
        }
      }

      const dedupedCounts = {
        total: existing.length,
        valid: dedupedValidExisting.length,
        invalid: invalidExisting.length,
        application: dedupedValidExisting.filter(q => q.questionType === 'application').length,
        critical: dedupedValidExisting.filter(q => q.questionType === 'critical-thinking').length,
        recall: dedupedValidExisting.filter(q => q.questionType === 'recall').length,
        duplicates: duplicatesToReplace.length,
      };

      // If we already have enough valid questions (>=7), enough application (>=5),
      // and enough critical thinking (>=2), don't rewrite.
      if (
        dedupedCounts.valid >= 7 &&
        dedupedCounts.application >= 5 &&
        dedupedCounts.critical >= 2 &&
        dedupedCounts.recall === 0 &&
        dedupedCounts.invalid === 0 &&
        dedupedCounts.duplicates === 0
      ) {
        lessonRow.action = 'PASS';
        lessonRow.rewrite = { existingCounts: dedupedCounts };
        pipelineReport.lessons.push(lessonRow);
        continue;
      }

      // ——— TINY LOOP: one question at a time. Replace each invalid individually, then fill missing slots one by one. ———
      // Higher candidate volume improves variety and reduces rewrite failures when we enforce
      // course-wide uniqueness (question text + option sets).
      const MAX_REPLACE_ATTEMPTS = 7;
      const MAX_FILL_ATTEMPTS_PER_SLOT = 40;
      const CANDIDATES_PER_ATTEMPT = 24;

      const backupPath = writeQuizBackup({
        backupDir: BACKUP_DIR,
        stamp,
        course,
        lesson,
        existingQuestions: existing,
      });

      let insertedCount = 0;
      let replacedCount = 0;
      let currentValid = [...dedupedValidExisting];
      const existingTextKeys = new Set<string>(currentValid.map(q => normalizeQuestionText(q.question)));
      const existingOptionSigs = new Set<string>(currentValid.map(q => optionSig(q.options)).filter(Boolean));

      // Phase 1: Replace each invalid question AND each duplicate-in-lesson one at a time (generate → validate → update-in-place).
      const replaceQueue = [...invalidExisting, ...duplicatesToReplace];
      for (let i = 0; i < replaceQueue.length; i++) {
        const targetQ = replaceQueue[i];
        const displayOrder = (targetQ as any).displayOrder ?? currentValid.length + i + 1;
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
            if (!key || existingTextKeys.has(key) || courseSeenTextKeys.has(key)) continue;
            const sig = optionSig(q.options);
            if (!sig || existingOptionSigs.has(sig)) continue;
            if (!DRY_RUN) {
              await updateQuestionInPlace({
                id: targetQ._id,
                course,
                lesson,
                displayOrder,
                generated: q,
                auditedBy: 'quiz-quality-pipeline-tiny-loop',
              });
            }
            const targetIdx = currentValid.findIndex(x => String((x as any)?._id) === String(targetQ._id));
            if (targetIdx >= 0) {
              const oldKey = normalizeQuestionText(currentValid[targetIdx]?.question);
              const oldSig = optionSig(currentValid[targetIdx]?.options);
              if (oldKey) existingTextKeys.delete(oldKey);
              if (oldSig) existingOptionSigs.delete(oldSig);
              currentValid[targetIdx] = { ...q, displayOrder, _id: targetQ._id };
            } else {
              currentValid.push({ ...q, displayOrder, _id: targetQ._id });
            }
            existingTextKeys.add(key);
            existingOptionSigs.add(sig);
            courseSeenTextKeys.add(key);
            replaced = true;
            replacedCount++;
            break;
          }
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
          if (!key || existingTextKeys.has(key) || courseSeenTextKeys.has(key)) continue;
          const sig = optionSig(q.options);
          if (!sig || existingOptionSigs.has(sig)) continue;
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
          existingOptionSigs.add(sig);
          courseSeenTextKeys.add(key);
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
        invalidFound: invalidExisting.length,
        duplicatesFound: dedupedCounts.duplicates,
        // We never trim extras; invalid/duplicate items are replaced in-place when possible.
        questionsDeleted: 0,
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
