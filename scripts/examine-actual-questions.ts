/**
 * Examine Actual Questions in Database
 * Get REAL data to start actual enhancement work
 */

import connectDB from '../app/lib/mongodb';
import Lesson from '../app/lib/models/lesson';
import QuizQuestion from '../app/lib/models/quiz-question';

async function examineLesson1() {
  try {
    await connectDB();
    console.log('🔍 EXAMINING ACTUAL LESSON 1 QUESTIONS FROM DATABASE\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Find Hungarian Day 1
    const lesson = await Lesson.findOne({ 
      lessonId: 'PRODUCTIVITY_2026_HU_DAY_01' 
    });

    if (!lesson) {
      console.log('❌ Lesson not found');
      process.exit(1);
    }

    console.log(`📚 LESSON DETAILS:`);
    console.log(`   ID: ${lesson.lessonId}`);
    console.log(`   Title: ${lesson.title}`);
    console.log(`   Day: ${lesson.dayNumber}`);
    console.log(`\n📖 Lesson Content (first 300 chars):`);
    console.log(`   ${lesson.content?.substring(0, 300)}...\n`);

    // Get quiz questions
    const questions = await QuizQuestion.find({ 
      lessonId: 'PRODUCTIVITY_2026_HU_DAY_01' 
    }).sort({ question: 1 });

    console.log(`═══════════════════════════════════════════════════════════════`);
    console.log(`\n📝 QUIZ QUESTIONS: ${questions.length} found\n`);

    // Display each question with analysis
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`❓ Q${i+1}: ${q.question.substring(0, 80)}${q.question.length > 80 ? '...' : ''}`);
      console.log(`${'─'.repeat(60)}`);
      
      console.log(`\n📋 Options:`);
      q.options.forEach((opt, idx) => {
        const marker = idx === q.correctIndex ? ' ✅ CORRECT' : '';
        console.log(`   ${idx+1}. ${opt}${marker}`);
      });
      
      console.log(`\n📊 Metadata:`);
      console.log(`   Category: ${q.category}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Question Type: ${q.questionType || 'NOT SET'}`);
      console.log(`   UUID: ${q.uuid?.substring(0, 8) || 'NOT SET'}...`);
      console.log(`   Hashtags: ${q.hashtags?.join(', ') || 'NONE'}`);
      
      // Analysis
      console.log(`\n🔍 ANALYSIS:`);
      if (q.question.toLowerCase().includes('define') || q.question.toLowerCase().includes('what is')) {
        console.log(`   ⚠️  Q4 CANDIDATE: Definition-based question (should rewrite to purpose/application)`);
      }
      const questionLength = q.question.length;
      if (questionLength < 20) {
        console.log(`   ⚠️  SHORT: Very brief question (${questionLength} chars)`);
      }
      const optionLengths = q.options.map(o => o.length);
      const maxLen = Math.max(...optionLengths);
      const minLen = Math.min(...optionLengths);
      if (maxLen - minLen > 100) {
        console.log(`   ⚠️  UNBALANCED: Option lengths vary significantly (${minLen}-${maxLen} chars)`);
      }
    }

    console.log(`\n${'═'.repeat(60)}\n`);
    console.log(`✅ EXAMINATION COMPLETE\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

examineLesson1();
