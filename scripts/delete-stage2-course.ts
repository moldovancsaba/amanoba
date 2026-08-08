import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

async function deleteStage2Course() {
  console.log('\n🗑️  Deleting Stage 2 Course (Garbage Placeholder Content)\n');
  console.log('='.repeat(70));
  
  await connectDB();

  // Find the course
  const course = await Course.findOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });
  
  if (!course) {
    console.log('⚠️  Course not found - may already be deleted');
    process.exit(0);
  }

  console.log(`Found course: ${course.name}`);
  console.log(`Course ID: ${course.courseId}`);

  // Delete all lessons for this course
  const deletedLessons = await Lesson.deleteMany({ courseId: course._id });
  console.log(`✓ Deleted ${deletedLessons.deletedCount} lessons`);

  // Delete the course itself
  await Course.deleteOne({ _id: course._id });
  console.log(`✓ Deleted course`);

  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Stage 2 course deleted');
  console.log('\nReason: Placeholder content violated quality standards');
  console.log('  - Did NOT follow 5W1H structure');
  console.log('  - No bibliography or real sources');
  console.log('  - No proper exercises');
  console.log('  - No concrete deliverables');
  console.log('  - Did NOT pass content quality enforcement');
  console.log('\nNext: Create properly when ready with full quality pipeline\n');
  
  process.exit(0);
}

deleteStage2Course();
