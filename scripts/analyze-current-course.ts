import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

async function analyzeCourse() {
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' })
    .select('courseId name description language lessons')
    .lean();
  
  if (!course) {
    console.log('❌ Course not found');
    process.exit(1);
  }

  console.log('\n📚 Current Course: AI for Dummies in a Day');
  console.log('='.repeat(70));
  console.log(`Name: ${course.name}`);
  console.log(`Description: ${course.description?.substring(0, 150)}...`);
  console.log(`Language: ${course.language}`);
  console.log(`Total Lessons: ${course.lessons?.length || 0}`);
  
  if (course.lessons && course.lessons.length > 0) {
    console.log('\n📖 Lesson Topics:');
    course.lessons.forEach((lesson: any, idx: number) => {
      const quizCount = lesson.quizQuestions?.length || 0;
      console.log(`  Day ${idx + 1}: ${lesson.title}`);
      console.log(`          └─ Quiz questions: ${quizCount}`);
    });
    
    const totalQuestions = course.lessons.reduce((sum: number, lesson: any) => 
      sum + (lesson.quizQuestions?.length || 0), 0);
    console.log(`\n📊 Total Quiz Pool: ${totalQuestions} questions`);
    
    console.log('\n💡 Course Content Analysis:');
    console.log('  - Foundation level (1-day rapid course)');
    console.log('  - Introduction to AI concepts');
    console.log('  - Beginner-friendly content');
    console.log('  - Multiple choice quizzes');
    console.log(`  - ${totalQuestions} questions for assessment`);
  }
  
  process.exit(0);
}

analyzeCourse();
