/**
 * Assign Random Thumbnail to AI Dummies Course
 */

import connectDB from '../app/lib/mongodb';
import Course from '../app/lib/models/course';
import { getRandomThumbnail } from '../app/lib/course-thumbnail-pool';

async function assignRandomThumbnail() {
  console.log('🎨 Assigning random thumbnail to course...\n');
  
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });
  if (!course) {
    console.log('❌ Course not found');
    process.exit(1);
  }
  
  console.log('Current thumbnail:', course.thumbnail || 'None');
  
  // Get deterministic thumbnail based on course ID (same course = same thumbnail)
  const thumbnail = getRandomThumbnail(course.courseId);
  
  console.log('New thumbnail:', thumbnail);
  
  course.thumbnail = thumbnail;
  await course.save();
  
  console.log('\n✅ Course thumbnail updated!');
  console.log('   The course will now show a random image from the thumbnail pool.');
  
  process.exit(0);
}

assignRandomThumbnail().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
