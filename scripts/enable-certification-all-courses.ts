/**
 * Enable certification and final exam for all courses
 * 
 * Sets certification.enabled = true for all courses that currently have it disabled or undefined
 */

import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function enableCertificationForAllCourses() {
  try {
    await connectDB();

    console.log('Starting certification enablement for all courses...');

    // Find all courses where certification is disabled or undefined
    const result = await Course.updateMany(
      {
        $or: [
          { 'certification.enabled': false },
          { 'certification.enabled': { $exists: false } },
          { certification: { $exists: false } },
        ],
      },
      {
        $set: {
          'certification.enabled': true,
        },
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} courses`);
    console.log(`   Matched: ${result.matchedCount} courses`);

    // Verify the update
    const totalCourses = await Course.countDocuments();
    const enabledCourses = await Course.countDocuments({ 'certification.enabled': true });

    console.log(`\n📊 Summary:`);
    console.log(`   Total courses: ${totalCourses}`);
    console.log(`   Certification enabled: ${enabledCourses}`);
    console.log(`   Certification disabled: ${totalCourses - enabledCourses}`);

    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error enabling certification for courses');
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

enableCertificationForAllCourses();
