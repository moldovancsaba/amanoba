/**
 * Fix Course Language Mismatch Script
 * 
 * Finds and deletes courses where language field doesn't match courseId
 * Example: courseId=PRODUCTIVITY_2026_AR with language='hu' is WRONG
 * 
 * Rules:
 * - courseId must end with language code matching the language field
 * - PRODUCTIVITY_2026_HU → language must be 'hu'
 * - PRODUCTIVITY_2026_AR → language must be 'ar'
 * - If mismatch, DELETE the record (it's a duplicate/broken entry)
 */

import mongoose from 'mongoose';

async function fixCourseLanguageMismatch() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✓ Connected to database');

    const Course = mongoose.model('Course');
    
    // Find all courses
    const allCourses = await Course.find({});
    console.log(`\nFound ${allCourses.length} total courses\n`);

    // Map language codes to their shorthand
    const languageMap: Record<string, string> = {
      'hu': 'HU',
      'en': 'EN',
      'ar': 'AR',
      'ru': 'RU',
      'pt': 'PT',
      'vi': 'VI',
      'id': 'ID',
      'hi': 'HI',
      'tr': 'TR',
      'bg': 'BG',
      'pl': 'PL',
    };

    const reverseMap: Record<string, string> = {
      'HU': 'hu',
      'EN': 'en',
      'AR': 'ar',
      'RU': 'ru',
      'PT': 'pt',
      'VI': 'vi',
      'ID': 'id',
      'HI': 'hi',
      'TR': 'tr',
      'BG': 'bg',
      'PL': 'pl',
    };

    let mismatchCount = 0;
    const mismatchedCourses: any[] = [];

    // Check each course
    for (const course of allCourses) {
      // Extract language code from courseId (last 2 chars after last underscore)
      const parts = course.courseId.split('_');
      const courseIdLanguageCode = parts[parts.length - 1]; // e.g., "HU", "AR"
      const expectedLanguage = reverseMap[courseIdLanguageCode]; // e.g., "hu", "ar"
      
      if (expectedLanguage && course.language !== expectedLanguage) {
        console.log(`❌ MISMATCH FOUND:`);
        console.log(`   Course ID: ${course.courseId}`);
        console.log(`   Expected language: ${expectedLanguage}`);
        console.log(`   Actual language: ${course.language}`);
        console.log(`   MongoDB ID: ${course._id}\n`);
        
        mismatchedCourses.push({
          _id: course._id,
          courseId: course.courseId,
          expectedLanguage,
          actualLanguage: course.language,
        });
        mismatchCount++;
      }
    }

    if (mismatchCount === 0) {
      console.log('✅ No mismatches found! All courses have correct language/courseId pairing');
      process.exit(0);
    }

    // Delete mismatched courses
    console.log(`\n⚠️  Found ${mismatchCount} mismatched courses`);
    console.log('Deleting mismatched records...\n');

    for (const course of mismatchedCourses) {
      await Course.deleteOne({ _id: course._id });
      console.log(`✓ Deleted: ${course.courseId} (was language: ${course.actualLanguage}, expected: ${course.expectedLanguage})`);
    }

    console.log(`\n✅ Cleanup complete! Deleted ${mismatchCount} mismatched courses`);
    
    // Verify
    const remaining = await Course.find({});
    console.log(`\nRemaining courses: ${remaining.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixCourseLanguageMismatch();
