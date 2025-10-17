import mongoose from 'mongoose';
import QuizQuestion from '../app/lib/models/quiz-question';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const total = await QuizQuestion.countDocuments();
  console.log('Total quiz questions:', total);
  
  if (total > 0) {
    const byDifficulty = await QuizQuestion.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log('By difficulty:', byDifficulty);
    
    const sample = await QuizQuestion.findOne().lean();
    console.log('\nSample question:', {
      id: sample?._id,
      difficulty: sample?.difficulty,
      category: sample?.category,
      question: sample?.question?.substring(0, 50) + '...',
    });
  } else {
    console.log('❌ NO QUIZ QUESTIONS - QUIZZZ game will fail to load!');
    console.log('Run: npm run seed:quiz-questions');
  }
  
  await mongoose.disconnect();
}

check().catch(console.error);
