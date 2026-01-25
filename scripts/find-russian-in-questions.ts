/**
 * Find Questions with Russian Text
 * 
 * What: Searches for questions containing Cyrillic/Russian text
 * Why: To identify and fix mixed language questions
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { QuizQuestion, Course, Lesson } from '../app/lib/models';

async function findRussianQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('🔍 SEARCHING FOR QUESTIONS WITH CYRILLIC/RUSSIAN TEXT\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Find all questions containing Cyrillic characters
    // Using a simpler pattern that MongoDB supports
    const questions = await QuizQuestion.find({
      isActive: true,
    }).lean();
    
    // Filter in JavaScript to find Cyrillic text
    const questionsWithCyrillic = questions.filter(q => {
      const hasCyrillic = /[А-Яа-яЁё]/.test(q.question);
      return hasCyrillic;
    });

    console.log(`📊 Found ${questionsWithCyrillic.length} questions with Cyrillic text:\n`);

    for (const q of questionsWithCyrillic) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Question ID: ${q._id}`);
      console.log(`UUID: ${q.uuid || 'N/A'}`);
      console.log(`Lesson ID: ${q.lessonId || 'N/A'}`);
      console.log(`Course ID: ${q.courseId || 'N/A'}`);
      
      // Get course info
      if (q.courseId) {
        const course = await Course.findById(q.courseId).lean();
        if (course) {
          console.log(`Course: ${course.name} (${course.courseId})`);
          console.log(`Course Language: ${course.language}`);
        }
      } else if (q.lessonId) {
        const lesson = await Lesson.findOne({ lessonId: q.lessonId }).lean();
        if (lesson && lesson.courseId) {
          const course = await Course.findById(lesson.courseId).lean();
          if (course) {
            console.log(`Course: ${course.name} (${course.courseId})`);
            console.log(`Course Language: ${course.language}`);
          }
        }
      }
      
      console.log(`\nQuestion Text:`);
      console.log(`  ${q.question}`);
      console.log(`\nOptions:`);
      q.options.forEach((opt, idx) => {
        console.log(`  ${idx + 1}. ${opt}`);
      });
      console.log(`Correct Answer: ${q.options[q.correctIndex]}`);
      console.log(`Hashtags: ${q.hashtags?.join(', ') || 'N/A'}`);
      console.log(`Category: ${q.category}`);
      console.log(`Difficulty: ${q.difficulty}`);
      console.log(`Question Type: ${q.questionType || 'N/A'}`);
    }

    if (questionsWithCyrillic.length === 0) {
      console.log('✅ No questions with Cyrillic text found.');
    } else {
      console.log(`\n\n⚠️  Found ${questionsWithCyrillic.length} question(s) with Cyrillic text.`);
      console.log('   These should be reviewed and fixed in the admin UI.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

findRussianQuestions();
