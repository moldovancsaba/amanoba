/**
 * Update Course Thumbnail to use Brand Default
 */

import connectDB from '../app/lib/mongodb';
import Course from '../app/lib/models/course';

async function updateCourseThumbnail() {
  console.log('🖼️  Updating course thumbnail...\n');
  
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });
  if (!course) {
    console.log('❌ Course not found');
    process.exit(1);
  }
  
  console.log('Current course thumbnail:', course.thumbnail);
  console.log('\nSetting thumbnail to undefined to use brand default...');
  
  course.thumbnail = undefined;
  await course.save();
  
  console.log('✅ Course thumbnail cleared - will now use brand default thumbnail');
  console.log('   Brand default: https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80');
  
  process.exit(0);
}

updateCourseThumbnail().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
