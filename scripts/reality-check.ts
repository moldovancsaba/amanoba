/**
 * Reality Check: What's Actually in the Database?
 * Are the questions actually different per language?
 */

import connectDB from '../app/lib/mongodb';
import QuizQuestion from '../app/lib/models/quiz-question';

async function realityCheck() {
  await connectDB();
  
  const languages = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];
  
  console.log('🔍 REALITY CHECK: First question of Day 1 in each language\n');
  console.log('═════════════════════════════════════════════════════════════════\n');
  
  for (const lang of languages) {
    const qs = await QuizQuestion.find({ 
      lessonId: `PRODUCTIVITY_2026_${lang}_DAY_01` 
    }).sort({ question: 1 }).limit(1);
    
    if (qs.length > 0) {
      const q = qs[0];
      console.log(`🌍 ${lang}:`);
      console.log(`   Question: "${q.question.substring(0, 70)}${q.question.length > 70 ? '...' : ''}"`);
      console.log(`   First option: "${q.options[0].substring(0, 50)}${q.options[0].length > 50 ? '...' : ''}"`);
      console.log();
    }
  }
  
  process.exit(0);
}

realityCheck();
