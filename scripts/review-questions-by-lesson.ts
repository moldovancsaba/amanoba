/**
 * Review Questions By Lesson
 * 
 * Purpose: List all questions for each lesson to enable systematic review
 * Why: Need to review each question one by one to ensure quality
 * 
 * Output: Lists all questions grouped by lesson for manual review
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

const COURSE_ID = process.argv[2] || 'GEO_SHOPIFY_30';

async function reviewQuestions() {
  try {
    await connectDB();
    console.log(`📋 REVIEWING QUESTIONS FOR: ${COURSE_ID}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const course = await Course.findOne({ courseId: COURSE_ID });
    if (!course) {
      console.error(`❌ Course not found: ${COURSE_ID}`);
      process.exit(1);
    }

    console.log(`📖 Course: ${course.name}`);
    console.log(`   Language: ${course.language.toUpperCase()}\n`);

    const lessons = await Lesson.find({
      courseId: course._id,
      isActive: true,
    })
      .sort({ dayNumber: 1 })
      .lean();

    console.log(`📝 Found ${lessons.length} lessons\n`);

    for (const lesson of lessons) {
      const questions = await QuizQuestion.find({
        lessonId: lesson.lessonId,
        courseId: course._id,
        isCourseSpecific: true,
        isActive: true,
      })
        .sort({ 'metadata.createdAt': 1 })
        .lean();

      console.log(`\n${'═'.repeat(70)}`);
      console.log(`📅 Day ${lesson.dayNumber}: ${lesson.title}`);
      console.log(`${'═'.repeat(70)}`);
      console.log(`\nQuestions (${questions.length}):\n`);

      if (questions.length === 0) {
        console.log('  ⚠️  NO QUESTIONS FOUND\n');
        continue;
      }

      questions.forEach((q, index) => {
        console.log(`${index + 1}. [${q.questionType || 'NO TYPE'}] ${q.difficulty || 'NO DIFFICULTY'}`);
        console.log(`   Q: ${q.question}`);
        console.log(`   Options:`);
        q.options.forEach((opt, i) => {
          const marker = i === q.correctIndex ? '✓' : ' ';
          console.log(`     ${marker} ${opt.substring(0, 80)}${opt.length > 80 ? '...' : ''}`);
        });
        
        // Check for quality issues
        const issues: string[] = [];
        if (q.question.length < 30) issues.push('TOO SHORT');
        if (!q.questionType) issues.push('MISSING TYPE');
        if (q.question.includes('Mi a fő célja a(z)') || q.question.includes('Mit ellenőriznél a(z)')) {
          issues.push('GENERIC TEMPLATE');
        }
        if (issues.length > 0) {
          console.log(`   ⚠️  Issues: ${issues.join(', ')}`);
        }
        console.log('');
      });
    }

    console.log(`\n${'═'.repeat(70)}`);
    console.log(`📊 SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`✅ Review complete for ${COURSE_ID}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   - Review each question for context and quality`);
    console.log(`   - Fix questions that are too short or generic`);
    console.log(`   - Ensure all questions are content-specific\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

reviewQuestions();
