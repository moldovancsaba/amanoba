/**
 * Compare Hungarian vs English - Quality Analysis
 * Show what needs to be fixed
 */

import connectDB from '../app/lib/mongodb';
import QuizQuestion from '../app/lib/models/quiz-question';

async function compareLanguages() {
  try {
    await connectDB();
    console.log('🔍 COMPARING HUNGARIAN vs ENGLISH - QUALITY ANALYSIS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Get Hungarian questions
    const huQuestions = await QuizQuestion.find({ 
      lessonId: 'PRODUCTIVITY_2026_HU_DAY_01' 
    }).sort({ question: 1 });

    // Get English questions
    const enQuestions = await QuizQuestion.find({ 
      lessonId: 'PRODUCTIVITY_2026_EN_DAY_01' 
    }).sort({ question: 1 });

    console.log(`📊 Found ${huQuestions.length} Hungarian questions`);
    console.log(`📊 Found ${enQuestions.length} English questions\n`);

    // Compare each pair
    for (let i = 0; i < Math.min(huQuestions.length, enQuestions.length); i++) {
      const hu = huQuestions[i];
      const en = enQuestions[i];

      console.log(`\n${'═'.repeat(60)}`);
      console.log(`❓ QUESTION ${i+1}\n`);

      console.log(`🇭🇺 HUNGARIAN:\n${hu.question}\n`);
      console.log(`🇬🇧 ENGLISH:\n${en.question}\n`);

      // Analyze Hungarian
      console.log(`📝 HU Analysis:`);
      console.log(`   Length: ${hu.question.length} chars`);
      console.log(`   Quality Signals:`);
      if (hu.question.includes('?')) console.log(`   ✓ Has question mark`);
      if (hu.question.toLowerCase().includes('define') || hu.question.toLowerCase().includes('mit')) {
        console.log(`   ⚠️  Definition-based (consider rewrite)`);
      }
      
      // Analyze English
      console.log(`\n📝 EN Analysis:`);
      console.log(`   Length: ${en.question.length} chars`);
      console.log(`   Quality Signals:`);
      if (en.question.includes('?')) console.log(`   ✓ Has question mark`);
      if (en.question.toLowerCase().includes('define') || en.question.toLowerCase().includes('what')) {
        console.log(`   ⚠️  Definition-based (consider rewrite)`);
      }

      // Compare options
      console.log(`\n📋 OPTIONS COMPARISON:`);
      console.log(`   HU Options:`);
      hu.options.forEach((opt, idx) => {
        const marker = idx === hu.correctIndex ? ' ✓' : '';
        console.log(`     ${idx+1}. ${opt.substring(0, 60)}${opt.length > 60 ? '...' : ''}${marker}`);
      });

      console.log(`\n   EN Options:`);
      en.options.forEach((opt, idx) => {
        const marker = idx === en.correctIndex ? ' ✓' : '';
        console.log(`     ${idx+1}. ${opt.substring(0, 60)}${opt.length > 60 ? '...' : ''}${marker}`);
      });

      // Check if translations are accurate
      if (hu.correctIndex !== en.correctIndex) {
        console.log(`\n   ⚠️  WARNING: Correct answers don't match! (HU: ${hu.correctIndex+1}, EN: ${en.correctIndex+1})`);
      }
    }

    console.log(`\n${'═'.repeat(60)}\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

compareLanguages();
