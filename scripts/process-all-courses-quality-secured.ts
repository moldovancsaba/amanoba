/**
 * Process All Courses - Quality Secured
 * 
 * Purpose: Generate all missing questions and fix broken/generic questions
 * WITH STRICT QUALITY VALIDATION to ensure no generic templates pass through
 * 
 * This script:
 * 1. Finds all missing questions
 * 2. Finds and DELETES all broken/generic questions
 * 3. Generates proper questions with quality validation
 * 4. Only saves questions that pass ALL quality checks
 * 5. Processes ALL courses automatically
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

async function processAllCoursesQualitySecured() {
  try {
    await connectDB();
    console.log(`🔧 PROCESSING ALL COURSES - QUALITY SECURED\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('This script will:\n');
    console.log('  1. Delete all broken/generic questions');
    console.log('  2. Generate missing questions with quality validation');
    console.log('  3. Only save questions that pass ALL quality checks');
    console.log('  4. Process ALL courses automatically\n');
    console.log('⚠️  Quality checks include:\n');
    console.log('  - No generic templates');
    console.log('  - No placeholder answers');
    console.log('  - Minimum 40 characters (context-rich)');
    console.log('  - Proper metadata');
    console.log('  - Proper cognitive mix\n');

    const courses = await Course.find({ isActive: true }).sort({ name: 1 }).lean();
    
    console.log(`📖 Found ${courses.length} courses to process\n`);
    console.log('Starting processing...\n');

    // Process each course using the quality-validated script
    for (const course of courses) {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`Processing: ${course.name} (${course.courseId})`);
      console.log(`${'═'.repeat(70)}`);
      
      // Use child process to run the quality-validated script
      const { execSync } = require('child_process');
      try {
        execSync(`npx tsx --env-file=.env.local scripts/process-course-questions-generic.ts ${course.courseId}`, {
          stdio: 'inherit',
          cwd: process.cwd()
        });
      } catch (error: any) {
        console.error(`❌ Error processing ${course.courseId}:`, error.message);
      }
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`✅ ALL COURSES PROCESSED WITH QUALITY VALIDATION`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log('💡 Run audit to verify: npx tsx scripts/audit-question-coverage.ts\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

processAllCoursesQualitySecured();
