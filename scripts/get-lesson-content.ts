/**
 * STEP 1: Get the complete Day 1 lesson content
 * We need to understand what we're teaching before creating questions
 */

import connectDB from '../app/lib/mongodb';
import Lesson from '../app/lib/models/lesson';

async function getLessonContent() {
  await connectDB();
  
  console.log('📚 READING DAY 1 LESSON CONTENT\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const lesson = await Lesson.findOne({ 
    lessonId: 'PRODUCTIVITY_2026_HU_DAY_01' 
  });
  
  if (!lesson) {
    console.log('Lesson not found');
    process.exit(1);
  }
  
  console.log(`📖 TITLE: ${lesson.title}\n`);
  console.log(`📖 DAY: ${lesson.dayNumber}\n`);
  console.log(`📖 FULL CONTENT:\n`);
  console.log(lesson.content);
  console.log('\n' + '═'.repeat(60) + '\n');
  
  process.exit(0);
}

getLessonContent();
