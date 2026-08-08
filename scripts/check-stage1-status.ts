import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

async function checkStage1() {
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });
  
  if (!course) {
    console.log('❌ Stage 1 course not found');
    process.exit(1);
  }
  
  console.log('\n📚 Stage 1: AI for Dummies in a Day');
  console.log('='.repeat(70));
  console.log(`\nCourse: ${course.name}`);
  console.log(`Description: ${course.description}`);
  console.log(`Thumbnail: ${course.thumbnail || 'none'}`);
  
  const lessons = await Lesson.find({ courseId: course._id }).sort({ dayNumber: 1 });
  console.log(`\nLessons: ${lessons.length}`);
  
  if (lessons.length > 0) {
    for (const lesson of lessons) {
      console.log(`\n  Day ${lesson.dayNumber}: ${lesson.title}`);
      console.log(`    Quiz questions: ${lesson.quizQuestions?.length || 0}`);
      console.log(`    Content length: ${lesson.content?.length || 0} chars`);
      console.log(`    Has bibliography: ${lesson.content?.includes('## Bibliography') ? 'Yes' : 'No'}`);
      console.log(`    Has 5W1H structure: ${lesson.content?.includes('## Who') && lesson.content?.includes('## What') && lesson.content?.includes('## How') ? 'Yes' : 'No'}`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  process.exit(0);
}

checkStage1();
