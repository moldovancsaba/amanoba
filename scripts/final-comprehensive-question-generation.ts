/**
 * Final Comprehensive Question Generation - All Courses (Quality-First Regeneration)
 *
 * Purpose: Enforce strict quiz QC for ALL lessons across ALL active courses.
 *
 * IMPORTANT (updated):
 * - Do NOT delete valid questions just because there are >7.
 * - Keep valid questions, delete invalid ones, and add new valid ones until minimums are met.
 * - TINY LOOP: Replace each invalid question one at a time; fill each missing slot one at a time.
 *   No batch delete/batch insert — quality is higher when each question is managed individually.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/final-comprehensive-question-generation.ts [--course COURSE_ID] [--min-lesson-score 70] [--dry-run]
 *
 * Hard rules:
 * - 0 RECALL (disallowed)
 * - >= 7 valid questions per lesson (can be more)
 * - >= 5 APPLICATION per lesson
 * - Standalone wording; no lesson-referential text; no ✅/… snippet crutches
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { validateQuestionQuality, validateLessonQuestions } from './question-quality-validator';
import { generateContentBasedQuestions } from './content-based-question-generator';
import { assessLessonQuality } from './lesson-quality';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const ONLY_COURSE_ID = getArgValue('--course');
const DRY_RUN = process.argv.includes('--dry-run');
const MIN_LESSON_SCORE = Number(getArgValue('--min-lesson-score') || '70');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const BACKUP_DIR = getArgValue('--backup-dir') || join(process.cwd(), 'scripts', 'quiz-backups');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function normalizeQuestionText(text: string) {
  return String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

async function regenerateAll() {
  try {
    await connectDB();
    console.log(`🔧 FINAL COMPREHENSIVE QUESTION REGENERATION${DRY_RUN ? ' [DRY RUN]' : ''}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const courseFilter: any = { isActive: true };
    if (ONLY_COURSE_ID) courseFilter.courseId = ONLY_COURSE_ID;

    mkdirSync(OUT_DIR, { recursive: true });
    mkdirSync(BACKUP_DIR, { recursive: true });
    const stamp = isoStamp();

    const courses = await Course.find(courseFilter).sort({ name: 1 }).lean();
    console.log(`📚 Found ${courses.length} course(s)\n`);

    let totalLessons = 0;
    let lessonsSucceeded = 0;
    let lessonsFailed = 0;
    let lessonsSkippedLowQuality = 0;
    let totalDeleted = 0;
    let totalInserted = 0;

    for (const course of courses) {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`📚 Course: ${course.name} (${course.courseId})`);
      console.log(`   Language: ${String(course.language).toUpperCase()}`);
      console.log(`${'═'.repeat(70)}\n`);

      const lessons = await Lesson.find({ courseId: course._id, isActive: true })
        .sort({ dayNumber: 1 })
        .lean();

      console.log(`📝 Lessons: ${lessons.length}\n`);

      for (const lesson of lessons) {
        totalLessons++;

        const lessonQuality = assessLessonQuality({
          title: lesson.title || '',
          content: lesson.content || '',
          language: course.language || lesson.language || 'en',
        });

        if (lessonQuality.score < MIN_LESSON_SCORE) {
          lessonsSkippedLowQuality++;
          console.log(
            `Day ${lesson.dayNumber}: ${String(lesson.title).substring(0, 60)}... (SKIP lesson score ${lessonQuality.score}/${MIN_LESSON_SCORE})`
          );
          continue;
        }

        const existing = await QuizQuestion.find({
          lessonId: lesson.lessonId,
          courseId: course._id,
          isCourseSpecific: true,
          isActive: true,
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

        console.log(
          `Day ${lesson.dayNumber}: ${String(lesson.title).substring(0, 60)}... (${existingCounts.total} existing; ${existingCounts.valid} valid, ${existingCounts.invalid} invalid)`
        );

        // If we already have enough valid questions (>=7) and enough application (>=5), don't rewrite.
        if (existingCounts.valid >= 7 && existingCounts.application >= 5 && existingCounts.recall === 0) {
          if (!DRY_RUN && existingCounts.invalid > 0) {
            const ids = invalidExisting.map(q => q._id);
            const del = await QuizQuestion.deleteMany({ _id: { $in: ids } });
            totalDeleted += del.deletedCount || 0;
          }
          lessonsSucceeded++;
          console.log(`   ✅ ${DRY_RUN ? 'Validated' : 'Cleaned invalid'} (kept valid pool; no rewrite)`);
          continue;
        }

        // ——— TINY LOOP: replace each invalid one at a time, then fill missing slots one at a time. ———
        const MAX_REPLACE_ATTEMPTS = 5;
        const MAX_FILL_ATTEMPTS_PER_SLOT = 10;
        const CANDIDATES_PER_ATTEMPT = 8;

        if (!DRY_RUN) {
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
        }

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
                      auditedBy: 'final-comprehensive-tiny-loop',
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

        // Phase 2: Fill missing slots one at a time.
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
                    auditedBy: 'final-comprehensive-tiny-loop',
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

        const combinedForValidation = currentValid.map(q => ({
          question: q.question,
          options: q.options,
          questionType: q.questionType,
          difficulty: q.difficulty,
          correctIndex: q.correctIndex,
        }));
        const batchValidation = validateLessonQuestions(combinedForValidation as any, course.language, lesson.title);

        if (!batchValidation.isValid) {
          lessonsFailed++;
          console.log(`   ❌ Failed validation: ${batchValidation.errors[0] || 'Strict QC failed'}`);
          continue;
        }

        lessonsSucceeded++;
        console.log(
          `   ✅ ${DRY_RUN ? 'Validated' : 'Enriched'} (replaced ${replacedCount}, added ${insertedCount})`
        );
      }
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`📊 FINAL SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`📚 Courses processed: ${courses.length}`);
    console.log(`📝 Lessons processed: ${totalLessons}`);
    console.log(`✅ Lessons succeeded: ${lessonsSucceeded}`);
    console.log(`❌ Lessons failed: ${lessonsFailed}`);
    console.log(`⏭️  Lessons skipped (low quality): ${lessonsSkippedLowQuality}`);
    if (!DRY_RUN) {
      console.log(`🗑️  Questions deleted: ${totalDeleted}`);
      console.log(`✅ Questions inserted: ${totalInserted}`);
    }
    console.log(`🎯 Minimum target enforced: >=7 total + >=5 application per lesson\n`);

    process.exit(lessonsFailed > 0 ? 2 : 0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

regenerateAll();
