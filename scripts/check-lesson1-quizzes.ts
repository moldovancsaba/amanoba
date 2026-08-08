import connectDB from '../app/lib/mongodb';
import Lesson from '../app/lib/models/lesson';

async function checkQuizzes() {
  await connectDB();
  const lesson = await Lesson.findOne({ lessonId: 'AI_ESSENTIALS_3DAY_EN_L01' }).lean();
  
  console.log('Quiz questions:', lesson?.quizQuestions?.length || 0);
  if (lesson?.quizQuestions && lesson.quizQuestions.length > 0) {
    lesson.quizQuestions.forEach((q: any, i: number) => {
      console.log(`  Q${i+1}: ${q.questionText.substring(0, 60)}...`);
    });
  }
  
  process.exit(0);
}

checkQuizzes().catch(console.error);
