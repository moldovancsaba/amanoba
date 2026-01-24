/**
 * PHASE 1 EXTRACTION SCRIPT
 * Extract current quiz data for Productivity 2026 - Lesson 1 - All Languages
 * For audit and enhancement process
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import Lesson from '../app/lib/models/lesson';
import QuizQuestion from '../app/lib/models/quiz-question';

async function extractLesson1Data() {
  await connectDB();
  
  console.log('🔍 EXTRACTING PHASE 1 DATA - PRODUCTIVITY 2026 - LESSON 1\n');
  
  const languages = ['hu', 'en', 'tr', 'bg', 'pl', 'vi', 'id', 'ar', 'pt', 'hi'];
  const lessonData = {};
  
  for (const lang of languages) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📖 LANGUAGE: ${lang.toUpperCase()}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    const lesson = await Lesson.findOne({
      lessonId: `PRODUCTIVITY_2026_${lang.toUpperCase()}_DAY_1`
    });
    
    if (!lesson) {
      console.log(`❌ Lesson not found for ${lang}`);
      continue;
    }
    
    console.log(`✅ Lesson Found:`);
    console.log(`   Title: ${lesson.title}`);
    console.log(`   Lesson ID: ${lesson.lessonId}`);
    
    const questions = await QuizQuestion.find({ lessonId: lesson.lessonId });
    console.log(`\n   Current Questions: ${questions.length}\n`);
    
    lessonData[lang] = {
      lessonId: lesson.lessonId,
      title: lesson.title,
      questions: []
    };
    
    questions.forEach((q, idx) => {
      const questionData = {
        id: q._id.toString(),
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        difficulty: q.difficulty
      };
      lessonData[lang].questions.push(questionData);
      
      console.log(`   Q${idx + 1}: ${q.question.substring(0, 70)}...`);
      console.log(`        Options: [`);
      q.options.forEach((opt, i) => {
        const mark = i === q.correctIndex ? '✓' : '✗';
        console.log(`          ${mark} ${i}: ${opt.substring(0, 50)}...`);
      });
      console.log(`        ]`);
      console.log('');
    });
  }
  
  console.log('\n\n✅ DATA EXTRACTION COMPLETE\n');
  process.exit(0);
}

extractLesson1Data().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
