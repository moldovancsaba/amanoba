import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

async function verify() {
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });
  
  if (!course) {
    console.log('❌ Course not found');
    process.exit(1);
  }
  
  console.log('\n✅ Stage 2 Course Created Successfully!\n');
  console.log('='.repeat(70));
  console.log(`\nCourse: ${course.name}`);
  console.log(`ID: ${course.courseId}`);
  console.log(`Description: ${course.description}`);
  console.log(`Difficulty: ${course.difficulty}`);
  console.log(`Language: ${course.language}`);
  console.log(`Estimated Hours: ${course.estimatedHours}`);
  console.log(`\nProgression:`);
  console.log(`  Stage: ${course.progressionMetadata?.stage}`);
  console.log(`  Parent: ${course.progressionMetadata?.parentCourseId}`);
  console.log(`  Topic: ${course.progressionMetadata?.topicName}`);
  console.log(`\nCertification:`);
  console.log(`  Enabled: ${course.certification.enabled}`);
  console.log(`  Pass Threshold: ${course.certification.passThresholdPercent}%`);
  console.log(`  Max Error: ${course.certification.maxErrorPercent ?? 'None (calculate at end)'}`);
  console.log(`\nLessons: ${course.lessons?.length || 0}`);
  
  if (course.lessons && course.lessons.length > 0) {
    console.log('\nFirst 3 lessons:');
    course.lessons.slice(0, 3).forEach(lesson => {
      console.log(`  - Day ${lesson.dayNumber}: ${lesson.title}`);
    });
  }
  
  console.log(`\nQuiz Pool: ${course.lessons?.reduce((sum, l) => sum + (l.quizQuestions?.length || 0), 0) || 0} questions`);
  console.log(`Certification Ready: ${(course.lessons?.reduce((sum, l) => sum + (l.quizQuestions?.length || 0), 0) || 0) >= 100 ? '✅ YES' : '❌ NO (need 100 questions)'}`);
  
  console.log('\n' + '='.repeat(70));
  console.log('\n📝 Next: Add quiz questions to reach 100+ pool size\n');
  
  process.exit(0);
}

verify();
