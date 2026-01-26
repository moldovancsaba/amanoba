/**
 * Process All Courses - Quality Secured (Final)
 * 
 * Purpose: Generate all missing questions and fix broken/generic questions
 * WITH STRICT QUALITY VALIDATION for ALL courses
 * 
 * This script:
 * 1. Processes ALL courses automatically
 * 2. Deletes broken/generic questions
 * 3. Generates content-based questions (reads lesson content)
 * 4. Validates every question before saving
 * 5. Only saves questions that pass ALL quality checks
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

async function processAllCourses() {
  try {
    await connectDB();
    console.log(`🔧 PROCESSING ALL COURSES - QUALITY SECURED\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('This script will:\n');
    console.log('  ✅ Delete all broken/generic questions');
    console.log('  ✅ Generate content-based questions (reads lesson content)');
    console.log('  ✅ Validate every question before saving');
    console.log('  ✅ Only save questions that pass ALL quality checks');
    console.log('  ✅ Process ALL courses automatically\n');

    const courses = await Course.find({ isActive: true }).sort({ name: 1 }).lean();
    
    console.log(`📖 Found ${courses.length} courses to process\n`);
    console.log('Starting processing...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const course of courses) {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`Processing: ${course.name} (${course.courseId})`);
      console.log(`${'═'.repeat(70)}`);
      
      try {
        execSync(`npx tsx --env-file=.env.local scripts/process-course-questions-generic.ts ${course.courseId}`, {
          stdio: 'inherit',
          cwd: process.cwd()
        });
        successCount++;
      } catch (error: any) {
        console.error(`❌ Error processing ${course.courseId}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`✅ PROCESSING COMPLETE`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`✅ Successfully processed: ${successCount} courses`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} courses`);
    }
    console.log(`\n💡 Run audit to verify: npx tsx scripts/audit-question-coverage.ts\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

processAllCourses();
