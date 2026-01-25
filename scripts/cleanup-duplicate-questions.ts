/**
 * Cleanup Duplicate Questions
 * 
 * Purpose: Remove duplicate/extra questions to ensure exactly 7 per quiz
 * Usage: npx tsx --env-file=.env.local scripts/cleanup-duplicate-questions.ts <courseId>
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

const COURSE_ID = process.argv[2] || 'ALL';

async function cleanupDuplicates() {
  try {
    await connectDB();
    console.log(`🧹 CLEANING UP DUPLICATE QUESTIONS\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    let courses;
    if (COURSE_ID === 'ALL') {
      courses = await Course.find({ isActive: true }).lean();
      console.log(`📚 Processing all ${courses.length} active courses\n`);
    } else {
      const course = await Course.findOne({ courseId: COURSE_ID }).lean();
      if (!course) {
        console.error(`❌ Course not found: ${COURSE_ID}`);
        process.exit(1);
      }
      courses = [course];
    }

    let totalRemoved = 0;
    let totalFixed = 0;

    for (const course of courses) {
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`📖 Course: ${course.courseId} (${course.name})`);
      console.log(`${'─'.repeat(60)}`);

      const lessons = await Lesson.find({
        courseId: course._id,
        isActive: true,
      })
        .sort({ dayNumber: 1 })
        .lean();

      for (const lesson of lessons) {
        const questions = await QuizQuestion.find({
          lessonId: lesson.lessonId,
          isCourseSpecific: true,
          isActive: true,
        })
          .sort({ 'metadata.createdAt': 1 }) // Keep oldest first
          .lean();

        if (questions.length > 7) {
          console.log(`   Day ${lesson.dayNumber}: ${questions.length} questions (need 7)`);
          
          // Keep the 7 most recent questions with metadata, or oldest if no metadata
          const withMetadata = questions.filter(q => q.uuid && q.hashtags && q.questionType);
          const withoutMetadata = questions.filter(q => !q.uuid || !q.hashtags || !q.questionType);

          let toKeep: typeof questions = [];
          let toRemove: typeof questions = [];

          if (withMetadata.length >= 7) {
            // Keep 7 most recent with metadata
            toKeep = withMetadata.slice(-7);
            toRemove = [...withMetadata.slice(0, -7), ...withoutMetadata];
          } else {
            // Keep all with metadata, then fill with oldest without metadata
            toKeep = [...withMetadata, ...withoutMetadata.slice(0, 7 - withMetadata.length)];
            toRemove = withoutMetadata.slice(7 - withMetadata.length);
          }

          // Remove duplicates (same question text)
          const seen = new Set<string>();
          const finalKeep: typeof questions = [];
          const finalRemove: typeof questions = [];

          for (const q of toKeep) {
            const key = q.question.toLowerCase().trim();
            if (!seen.has(key)) {
              seen.add(key);
              finalKeep.push(q);
            } else {
              finalRemove.push(q);
            }
          }

          // If we still have more than 7, remove oldest
          if (finalKeep.length > 7) {
            const extra = finalKeep.splice(0, finalKeep.length - 7);
            finalRemove.push(...extra);
          }

          // Remove all duplicates and extras
          for (const q of [...finalRemove, ...toRemove]) {
            await QuizQuestion.deleteOne({ _id: q._id });
            totalRemoved++;
          }

          console.log(`      ✅ Removed ${finalRemove.length + toRemove.length} duplicates/extra questions`);
          totalFixed++;
        } else if (questions.length < 7) {
          console.log(`   Day ${lesson.dayNumber}: ${questions.length} questions (need 7) - will be fixed by fix-course-quizzes.ts`);
        }
      }
    }

    console.log(`\n\n${'═'.repeat(60)}`);
    console.log(`📊 SUMMARY`);
    console.log(`${'═'.repeat(60)}\n`);
    console.log(`✅ Questions removed: ${totalRemoved}`);
    console.log(`✅ Quizzes fixed: ${totalFixed}`);
    console.log(`\n🎉 Cleanup complete!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupDuplicates();
