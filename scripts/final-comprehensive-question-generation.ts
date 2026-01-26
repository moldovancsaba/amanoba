/**
 * Final Comprehensive Question Generation - All Courses (Quality-First Regeneration)
 *
 * Purpose: Regenerate 7 perfect questions for ALL lessons across ALL active courses.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/final-comprehensive-question-generation.ts [--course COURSE_ID] [--dry-run]
 *
 * Hard rules:
 * - 0 RECALL (disallowed)
 * - 5 APPLICATION + 2 CRITICAL_THINKING per lesson (7 total)
 * - Always regenerate (quality-first), even if a lesson already has 7 questions
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { validateQuestionQuality, validateLessonQuestions } from './question-quality-validator';
import { generateContentBasedQuestions } from './content-based-question-generator';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const ONLY_COURSE_ID = getArgValue('--course');
const DRY_RUN = process.argv.includes('--dry-run');

async function regenerateAll() {
  try {
    await connectDB();
    console.log(`🔧 FINAL COMPREHENSIVE QUESTION REGENERATION${DRY_RUN ? ' [DRY RUN]' : ''}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const courseFilter: any = { isActive: true };
    if (ONLY_COURSE_ID) courseFilter.courseId = ONLY_COURSE_ID;

    const courses = await Course.find(courseFilter).sort({ name: 1 }).lean();
    console.log(`📚 Found ${courses.length} course(s)\n`);

    let totalLessons = 0;
    let lessonsSucceeded = 0;
    let lessonsFailed = 0;
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
        const existingCount = await QuizQuestion.countDocuments({
          lessonId: lesson.lessonId,
          courseId: course._id,
          isCourseSpecific: true,
          isActive: true,
        });

        console.log(`Day ${lesson.dayNumber}: ${String(lesson.title).substring(0, 60)}... (${existingCount} existing)`);

        const generated = generateContentBasedQuestions(
          lesson.dayNumber,
          lesson.title || '',
          lesson.content || '',
          course.language,
          course.courseId,
          [],
          7
        );

        const validated: any[] = [];
        for (const q of generated) {
          const validation = validateQuestionQuality(
            q.question,
            q.options,
            q.questionType,
            q.difficulty,
            course.language,
            lesson.title,
            lesson.content
          );
          if (validation.isValid) validated.push(q);
        }

        const finalQuestions = validated.slice(0, 7);
        const batchValidation = validateLessonQuestions(finalQuestions, course.language, lesson.title);

        if (finalQuestions.length !== 7 || !batchValidation.isValid) {
          lessonsFailed++;
          console.log(`   ❌ Failed validation: ${batchValidation.errors[0] || 'Could not produce 7 valid questions'}`);
          continue;
        }

        if (!DRY_RUN) {
          const deleteResult = await QuizQuestion.deleteMany({
            lessonId: lesson.lessonId,
            courseId: course._id,
            isCourseSpecific: true,
          });
          totalDeleted += deleteResult.deletedCount || 0;

          const questionsToInsert = finalQuestions.map(q => ({
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
              auditedBy: 'quiz-audit-regenerator',
            },
          }));

          await QuizQuestion.insertMany(questionsToInsert);
          totalInserted += questionsToInsert.length;
        }

        lessonsSucceeded++;
        console.log(`   ✅ ${DRY_RUN ? 'Validated' : 'Replaced'} with 7 questions (0 recall)`);
      }
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`📊 FINAL SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`📚 Courses processed: ${courses.length}`);
    console.log(`📝 Lessons processed: ${totalLessons}`);
    console.log(`✅ Lessons succeeded: ${lessonsSucceeded}`);
    console.log(`❌ Lessons failed: ${lessonsFailed}`);
    if (!DRY_RUN) {
      console.log(`🗑️  Questions deleted: ${totalDeleted}`);
      console.log(`✅ Questions inserted: ${totalInserted}`);
    }
    console.log(`🎯 Target: ${totalLessons} lessons × 7 = ${totalLessons * 7} questions\n`);

    process.exit(lessonsFailed > 0 ? 2 : 0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

regenerateAll();

