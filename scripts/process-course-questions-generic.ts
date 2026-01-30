/**
 * Process Course Questions - Generic Script (Quality-First Regeneration)
 *
 * Purpose: Regenerate 7 perfect questions for any course (per lesson).
 * Usage:
 *   npx tsx --env-file=.env.local scripts/process-course-questions-generic.ts COURSE_ID [--dry-run]
 *
 * TINY LOOP: Each question is managed individually. Invalid questions are replaced one at a time
 * (generate → validate → replace); missing slots are filled one at a time (generate → validate → insert).
 * No batch delete/batch insert — quality is higher when each question is handled separately.
 *
 * Hard rules:
 * - 0 RECALL (disallowed)
 * - 5 APPLICATION + 2 CRITICAL_THINKING per lesson (7 total)
 * - Always regenerate (quality-first), even if the lesson already has 7 questions
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { validateQuestionQuality, validateLessonQuestions } from './question-quality-validator';
import { generateContentBasedQuestions } from './content-based-question-generator';
import { mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const COURSE_ID = process.argv[2];
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE_REWRITE = process.argv.includes('--force-rewrite');
const DAY_ONLY = (() => {
  const idx = process.argv.indexOf('--day');
  if (idx === -1) return undefined;
  const v = Number(process.argv[idx + 1]);
  return Number.isFinite(v) ? v : undefined;
})();
const BACKUP_DIR = (() => {
  const idx = process.argv.indexOf('--backup-dir');
  if (idx === -1) return join(process.cwd(), 'scripts', 'quiz-backups');
  return process.argv[idx + 1] ? resolve(process.argv[idx + 1]) : join(process.cwd(), 'scripts', 'quiz-backups');
})();

if (!COURSE_ID) {
  console.error('❌ Please provide a course ID');
  console.log('Usage: npx tsx --env-file=.env.local scripts/process-course-questions-generic.ts COURSE_ID [--day 1] [--force-rewrite] [--backup-dir path] [--dry-run]');
  process.exit(1);
}

async function processCourse() {
  try {
    await connectDB();
    console.log(`🔧 PROCESSING COURSE (QUALITY-FIRST): ${COURSE_ID}${DRY_RUN ? ' [DRY RUN]' : ''}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const course = await Course.findOne({ courseId: COURSE_ID });
    if (!course) {
      console.error(`❌ Course not found: ${COURSE_ID}`);
      process.exit(1);
    }

    console.log(`📖 Course: ${course.name}`);
    console.log(`   Language: ${String(course.language).toUpperCase()}\n`);

    const lessons = await Lesson.find({ courseId: course._id, isActive: true })
      .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
      .lean();

    console.log(`📝 Found ${lessons.length} lessons\n`);

    let lessonsSucceeded = 0;
    let lessonsFailed = 0;
    let totalDeleted = 0;
    let totalInserted = 0;
    let lessonsProcessed = 0;

    // Some courses contain duplicate lessons for the same dayNumber.
    // When targeting a specific day via --day, pick the oldest lesson for that day.
    const selectedLessonIds = new Set<string>();
    if (DAY_ONLY !== undefined) {
      const sameDay = lessons.filter(l => l.dayNumber === DAY_ONLY);
      if (sameDay.length === 0) {
        console.log(`❌ No lesson found for day ${DAY_ONLY}`);
        process.exit(1);
      }
      sameDay.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (aTime !== bTime) return aTime - bTime;
        return String(a._id).localeCompare(String(b._id));
      });
      selectedLessonIds.add(String(sameDay[0].lessonId));
    }

    for (const lesson of lessons) {
      if (DAY_ONLY !== undefined && !selectedLessonIds.has(String(lesson.lessonId))) continue;
      lessonsProcessed++;
      console.log(`Day ${lesson.dayNumber}: ${String(lesson.title).substring(0, 60)}...`);

      const existingQuestions = await QuizQuestion.find({
        lessonId: lesson.lessonId,
        courseId: course._id,
        isCourseSpecific: true,
        isActive: true,
      }).lean();

      console.log(`   Current: ${existingQuestions.length}/7 questions`);

      // Backup existing questions before deletion (even if dry-run, for inspection)
      try {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const courseFolder = join(BACKUP_DIR, COURSE_ID);
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
        console.log(`   🧾 Backup: ${backupPath}`);
      } catch (e) {
        console.log(`   ⚠️  Backup failed: ${String((e as any)?.message || e)}`);
      }

      // Validate existing; keep valid, delete invalid only (do not delete just because there are >7).
      const validExisting: any[] = [];
      const invalidExisting: any[] = [];
      for (const q of existingQuestions) {
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
      if (FORCE_REWRITE) {
        invalidExisting.push(...validExisting);
        validExisting.length = 0;
      }

      const existingCounts = {
        valid: validExisting.length,
        invalid: invalidExisting.length,
        application: validExisting.filter(q => q.questionType === 'application').length,
        recall: validExisting.filter(q => q.questionType === 'recall').length,
      };

      // If already meets minimum requirements, skip rewrite.
      if (!FORCE_REWRITE && existingCounts.valid >= 7 && existingCounts.application >= 5 && existingCounts.recall === 0) {
        if (!DRY_RUN && existingCounts.invalid > 0) {
          const delInvalid = await QuizQuestion.deleteMany({ _id: { $in: invalidExisting.map(q => q._id) } });
          totalDeleted += delInvalid.deletedCount || 0;
          console.log(`   ✅ Kept existing pool (>=7). Deleted ${delInvalid.deletedCount} invalid questions.`);
        } else {
          console.log(`   ✅ Kept existing pool (>=7)${existingCounts.invalid > 0 ? ' (invalid present; use non-dry-run to clean)' : ''}.`);
        }
        lessonsSucceeded++;
        continue;
      }

      const normalizeQuestionText = (text: string) =>
        String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const MAX_REPLACE_ATTEMPTS = 5;
      const MAX_FILL_ATTEMPTS_PER_SLOT = 10;
      const CANDIDATES_PER_ATTEMPT = 8;
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');

      let currentValid = [...validExisting];
      const existingTextKeys = new Set<string>(currentValid.map(q => normalizeQuestionText(q.question)));
      let insertedCount = 0;
      let replacedCount = 0;

      // Phase 1: Replace each invalid question one at a time.
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
            COURSE_ID,
            currentValid,
            CANDIDATES_PER_ATTEMPT,
            { seed: `${COURSE_ID}::${lesson.lessonId}::replace${i}::${stamp}::a${attempt}` }
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
                    auditedBy: 'process-course-questions-generic-tiny-loop',
                  },
                },
              ]);
              totalDeleted += 1;
              totalInserted += 1;
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
          totalDeleted += 1;
        }
      }

      // Phase 2: Fill missing slots one at a time (7 total, 5 application, 2 critical).
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
          COURSE_ID,
          currentValid,
          CANDIDATES_PER_ATTEMPT,
          { seed: `${COURSE_ID}::${lesson.lessonId}::fill::${stamp}::${fillAttempts}` }
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
                  auditedBy: 'process-course-questions-generic-tiny-loop',
                },
              },
            ]);
            totalInserted += 1;
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

      const combined = currentValid.map(q => ({
        question: q.question,
        options: q.options,
        questionType: q.questionType,
        difficulty: q.difficulty,
        correctIndex: q.correctIndex,
      }));
      const batchValidation = validateLessonQuestions(combined as any, course.language, lesson.title);
      if (!batchValidation.isValid) {
        lessonsFailed++;
        console.log(`   ❌ Failed validation: ${batchValidation.errors[0] || 'Unknown'}`);
        continue;
      }

      lessonsSucceeded++;
      console.log(`   ✅ ${DRY_RUN ? 'Validated' : 'Enriched'}: kept ${validExisting.length} valid, replaced ${replacedCount}, added ${insertedCount}\n`);
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`📊 SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`✅ Lessons processed: ${lessonsProcessed}`);
    console.log(`✅ Lessons succeeded: ${lessonsSucceeded}`);
    console.log(`❌ Lessons failed: ${lessonsFailed}`);
    if (!DRY_RUN) {
      console.log(`🗑️  Questions deleted: ${totalDeleted}`);
      console.log(`✅ Questions inserted: ${totalInserted}`);
    }
    console.log(`🎯 Target: ${lessons.length} lessons × 7 = ${lessons.length * 7} questions\n`);

    process.exit(lessonsFailed > 0 ? 2 : 0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

processCourse();
