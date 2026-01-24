/**
 * Delete incorrectly seeded lessons 12-30 (English template used for all languages)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import Lesson from '../app/lib/models/lesson';
import QuizQuestion from '../app/lib/models/quiz-question';

async function deleteLessons() {
  await connectDB();
  console.log('🗑️ DELETING INCORRECTLY SEEDED LESSONS 12-30...\n');
  
  let deletedLessons = 0;
  let deletedQuestions = 0;
  
  for (let day = 12; day <= 30; day++) {
    const lessons = await Lesson.find({ dayNumber: day });
    
    for (const lesson of lessons) {
      const qCount = await QuizQuestion.countDocuments({ lessonId: lesson.lessonId });
      await QuizQuestion.deleteMany({ lessonId: lesson.lessonId });
      await Lesson.deleteOne({ _id: lesson._id });
      deletedQuestions += qCount;
      deletedLessons++;
    }
    
    if (lessons.length > 0) {
      console.log(`✅ Day ${day}: Deleted ${lessons.length} lessons + ${lessons.length * 5} questions`);
    }
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Deletion Complete:`);
  console.log(`   Lessons Deleted: ${deletedLessons}`);
  console.log(`   Questions Deleted: ${deletedQuestions}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  process.exit(0);
}

deleteLessons().catch((error) => {
  console.error('❌ Deletion failed:', error);
  process.exit(1);
});
