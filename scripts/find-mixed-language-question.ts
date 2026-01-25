/**
 * Find Specific Mixed Language Question
 * 
 * What: Searches for the specific question pattern: Hungarian template with Russian text
 * Why: User reported seeing "Mi a kulcsfontosságú koncepció a "Вопросы квалификации...""
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { QuizQuestion, Course, Lesson } from '../app/lib/models';

async function findMixedLanguageQuestion() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('🔍 SEARCHING FOR MIXED LANGUAGE QUESTION\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Get all questions
    const allQuestions = await QuizQuestion.find({ isActive: true }).lean();
    console.log(`📊 Total questions: ${allQuestions.length}\n`);

    // Look for questions that:
    // 1. Start with "Mi a kulcsfontosságú koncepció" (Hungarian)
    // 2. Contain Cyrillic characters (Russian)
    const mixedQuestions = allQuestions.filter(q => {
      const question = q.question;
      const hasHungarianStart = question.includes('Mi a kulcsfontosságú koncepció');
      const hasCyrillic = /[А-Яа-яЁё]/.test(question);
      return hasHungarianStart && hasCyrillic;
    });

    console.log(`\n❌ Found ${mixedQuestions.length} mixed language question(s):\n`);

    for (const q of mixedQuestions) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Question ID: ${q._id}`);
      console.log(`UUID: ${q.uuid || 'N/A'}`);
      console.log(`Lesson ID: ${q.lessonId || 'N/A'}`);
      console.log(`Course ID: ${q.courseId || 'N/A'}`);
      
      // Get course info
      let courseLanguage = '';
      if (q.courseId) {
        const course = await Course.findById(q.courseId).lean();
        if (course) {
          console.log(`Course: ${course.name} (${course.courseId})`);
          console.log(`Course Language: ${course.language}`);
          courseLanguage = course.language || '';
        }
      } else if (q.lessonId) {
        const lesson = await Lesson.findOne({ lessonId: q.lessonId }).lean();
        if (lesson && lesson.courseId) {
          const course = await Course.findById(lesson.courseId).lean();
          if (course) {
            console.log(`Course: ${course.name} (${course.courseId})`);
            console.log(`Course Language: ${course.language}`);
            courseLanguage = course.language || '';
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
      
      // Check if course language is Hungarian but question has Russian
      if (courseLanguage === 'hu' && /[А-Яа-яЁё]/.test(q.question)) {
        console.log(`\n⚠️  ISSUE: Hungarian course but question contains Russian text!`);
        console.log(`   This question needs to be fixed.`);
      }
    }

    if (mixedQuestions.length === 0) {
      console.log('✅ No mixed language questions found with this pattern.');
      console.log('\nSearching for any Hungarian questions with Cyrillic...\n');
      
      // Broader search: Hungarian course with any Cyrillic
      const hungarianCourses = await Course.find({ language: 'hu' }).lean();
      const hungarianCourseIds = hungarianCourses.map(c => c._id);
      
      const hungarianQuestionsWithCyrillic = allQuestions.filter(q => {
        if (!hungarianCourseIds.some(id => id.toString() === q.courseId?.toString())) {
          return false;
        }
        return /[А-Яа-яЁё]/.test(q.question);
      });
      
      if (hungarianQuestionsWithCyrillic.length > 0) {
        console.log(`\n❌ Found ${hungarianQuestionsWithCyrillic.length} Hungarian course question(s) with Cyrillic:\n`);
        hungarianQuestionsWithCyrillic.forEach((q, idx) => {
          console.log(`${idx + 1}. ${q.question.substring(0, 100)}...`);
          console.log(`   ID: ${q._id}\n`);
        });
      } else {
        console.log('✅ No Hungarian course questions with Cyrillic found.');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

findMixedLanguageQuestion();
