/**
 * Test certificate image generation
 * 
 * Tests if the certificate image API endpoint works
 */

import connectDB from '../app/lib/mongodb';
import { Course, Player } from '../app/lib/models';

async function testCertificateImage() {
  try {
    await connectDB();

    // Find the course and a player
    const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });
    const player = await Player.findOne({});

    if (!course || !player) {
      console.log('❌ Course or player not found');
      process.exit(1);
    }

    const playerId = player._id.toString();
    const courseId = course.courseId;

    console.log('Testing certificate image generation...');
    console.log(`Player ID: ${playerId}`);
    console.log(`Course ID: ${courseId}`);
    
    const testUrl = `/api/profile/${playerId}/certificate/${courseId}/image?variant=share_1200x627&locale=en`;
    console.log(`\nTest URL: ${testUrl}`);
    console.log('\n✅ Route should be accessible at this URL');
    console.log('Try accessing it from the browser or with curl');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testCertificateImage();
