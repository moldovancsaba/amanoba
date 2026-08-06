/**
 * Update certification settings for all courses
 * 
 * - Set passThresholdPercent to 60% (default)
 * - Set maxErrorPercent to null (calculate at end, not during exam)
 */

import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function updateCertificationSettings() {
  try {
    await connectDB();

    console.log('Updating certification settings for all courses...');

    // Update all courses with certification enabled
    const result = await Course.updateMany(
      {
        'certification.enabled': true,
      },
      {
        $set: {
          'certification.passThresholdPercent': 60,
          'certification.maxErrorPercent': null,
        },
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} courses`);
    console.log(`   Matched: ${result.matchedCount} courses`);

    // Verify the update
    const courses = await Course.find({ 'certification.enabled': true });

    console.log(`\n📊 Verification:`);
    for (const course of courses) {
      console.log(`   ${course.courseId}:`);
      console.log(`      Pass threshold: ${course.certification?.passThresholdPercent}%`);
      console.log(`      Max error percent: ${course.certification?.maxErrorPercent === null ? 'null (calculate at end)' : course.certification?.maxErrorPercent + '%'}`);
    }

    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error updating certification settings');
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateCertificationSettings();
