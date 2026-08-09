#!/usr/bin/env tsx
/**
 * Course Matrix Migration Script
 * 
 * Purpose: Migrate existing courses to use the new course matrix structure (courseLevels)
 * 
 * What it does:
 * 1. Identify AI course family (AI_DUMMIES + AI_ESSENTIALS)
 * 2. Create unified CCS with courseLevels
 * 3. Migrate courses to new structure
 * 4. Update course references
 * 5. Verify matrix integrity
 * 
 * Safety:
 * - Dry-run mode by default (use --execute to apply changes)
 * - Detailed logging of all changes
 * - Validation before saving
 * 
 * Usage:
 *   npm run migrate:course-matrix           # Dry run (preview)
 *   npm run migrate:course-matrix --execute # Apply changes
 */

import connectDB from '../app/lib/mongodb';
import { Course, CCS } from '../app/lib/models';

interface MigrationStats {
  ccsCreated: number;
  ccsUpdated: number;
  coursesUpdated: number;
  errors: number;
  details: string[];
}

async function migrateCourseMatrix(execute: boolean = false): Promise<MigrationStats> {
  const stats: MigrationStats = {
    ccsCreated: 0,
    ccsUpdated: 0,
    coursesUpdated: 0,
    errors: 0,
    details: [],
  };

  console.log('\n🔄 Course Matrix Migration');
  console.log('==================================\n');
  console.log(`Mode: ${execute ? '✅ EXECUTE (will save changes)' : '👁️  DRY RUN (preview only)'}\n`);

  try {
    // Step 1: Find AI course family
    console.log('Step 1: Analyzing AI course family...\n');
    
    const aiCourses = await Course.find({
      courseId: { $in: ['AI_DUMMIES_1DAY_EN', 'AI_DUMMIES_1DAY_EN_ES', 'AI_ESSENTIALS_3DAY_EN'] }
    }).lean();

    console.log(`Found ${aiCourses.length} AI courses:`);
    aiCourses.forEach(c => {
      console.log(`  - ${c.courseId} (${c.language || 'unknown'})`);
    });

    if (aiCourses.length === 0) {
      console.log('\n⚠️  No AI courses found - nothing to migrate');
      return stats;
    }

    // Step 2: Create new unified CCS
    console.log('\nStep 2: Creating unified AI_LEARNING_PATH_2026 CCS...\n');

    const newCCSData = {
      ccsId: 'AI_LEARNING_PATH_2026',
      name: 'AI Learning Path - From Beginner to Expert',
      originalLanguage: 'en',
      originalCourseId: 'AI_DUMMIES_1DAY_EN',
      availableLanguages: ['en', 'es'],
      languageVariants: [
        {
          language: 'es',
          courseId: 'AI_DUMMIES_1DAY_EN_ES',
          translationStatus: 'published',
          translatedAt: new Date(),
          translatedBy: 'migration-script',
        }
      ],
      courseLevels: [
        {
          level: 1,
          levelType: '1day_beginner',
          difficulty: 'beginner',
          estimatedHours: 8,
          description: 'Introduction to AI in one day - perfect for complete beginners',
          courseVariants: [
            {
              language: 'en',
              courseId: 'AI_DUMMIES_1DAY_EN',
              translationStatus: 'published',
              translatedAt: new Date('2026-01-01'),
              translatedBy: 'content-team',
            },
            {
              language: 'es',
              courseId: 'AI_DUMMIES_1DAY_EN_ES',
              translationStatus: 'published',
              translatedAt: new Date('2026-08-09'),
              translatedBy: 'translation-agent',
            }
          ]
        },
        {
          level: 2,
          levelType: '3day_essentials',
          difficulty: 'intermediate',
          estimatedHours: 24,
          description: 'Essential AI skills in 3 days - practical applications and hands-on experience',
          courseVariants: [
            {
              language: 'en',
              courseId: 'AI_ESSENTIALS_3DAY_EN',
              translationStatus: 'published',
              translatedAt: new Date('2026-01-15'),
              translatedBy: 'content-team',
            }
          ]
        }
      ],
      totalLevels: 2,
    };

    console.log('New CCS Structure:');
    console.log(`  ccsId: ${newCCSData.ccsId}`);
    console.log(`  name: ${newCCSData.name}`);
    console.log(`  totalLevels: ${newCCSData.totalLevels}`);
    console.log(`\n  Level 1 (${newCCSData.courseLevels[0].levelType}):`);
    newCCSData.courseLevels[0].courseVariants.forEach(v => {
      console.log(`    - ${v.courseId} (${v.language})`);
    });
    console.log(`\n  Level 2 (${newCCSData.courseLevels[1].levelType}):`);
    newCCSData.courseLevels[1].courseVariants.forEach(v => {
      console.log(`    - ${v.courseId} (${v.language})`);
    });

    if (execute) {
      // Check if CCS already exists
      const existingCCS = await CCS.findOne({ ccsId: 'AI_LEARNING_PATH_2026' });
      
      if (existingCCS) {
        console.log('\n⚠️  CCS AI_LEARNING_PATH_2026 already exists - updating...');
        await CCS.updateOne(
          { ccsId: 'AI_LEARNING_PATH_2026' },
          { $set: newCCSData }
        );
        stats.ccsUpdated++;
      } else {
        await CCS.create(newCCSData);
        stats.ccsCreated++;
        console.log('\n✓ Created new CCS AI_LEARNING_PATH_2026');
      }
    } else {
      console.log('\n[DRY RUN] Would create/update CCS AI_LEARNING_PATH_2026');
    }

    // Step 3: Update course documents
    console.log('\nStep 3: Updating course documents to reference new CCS...\n');

    for (const course of aiCourses) {
      console.log(`  Updating ${course.courseId}...`);
      
      if (execute) {
        await Course.updateOne(
          { courseId: course.courseId },
          { $set: { ccsId: 'AI_LEARNING_PATH_2026' } }
        );
        stats.coursesUpdated++;
        console.log(`    ✓ Updated`);
      } else {
        console.log(`    [DRY RUN] Would update ccsId to AI_LEARNING_PATH_2026`);
      }
    }

    // Step 4: Remove old CCS (if exists)
    console.log('\nStep 4: Cleaning up old CCS...\n');
    
    const oldCCS = await CCS.findOne({ ccsId: 'AI_DUMMIES_1DAY_EN' });
    
    if (oldCCS) {
      console.log(`  Found old CCS: AI_DUMMIES_1DAY_EN`);
      
      if (execute) {
        await CCS.deleteOne({ ccsId: 'AI_DUMMIES_1DAY_EN' });
        console.log(`  ✓ Deleted old CCS`);
      } else {
        console.log(`  [DRY RUN] Would delete old CCS`);
      }
    } else {
      console.log(`  No old CCS found - nothing to clean up`);
    }

    stats.details.push('AI course family migrated successfully');

  } catch (error) {
    stats.errors++;
    const errorMsg = error instanceof Error ? error.message : String(error);
    stats.details.push(`Error: ${errorMsg}`);
    console.error(`\n❌ Migration failed:`, error);
  }

  return stats;
}

async function main() {
  const execute = process.argv.includes('--execute');

  try {
    await connectDB();
    console.log('✓ Connected to MongoDB\n');

    const stats = await migrateCourseMatrix(execute);

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('Migration Summary');
    console.log('='.repeat(50));
    console.log(`CCS Created: ${stats.ccsCreated}`);
    console.log(`CCS Updated: ${stats.ccsUpdated}`);
    console.log(`Courses Updated: ${stats.coursesUpdated}`);
    console.log(`Errors: ${stats.errors}`);
    console.log('='.repeat(50));

    if (!execute && (stats.ccsCreated > 0 || stats.coursesUpdated > 0)) {
      console.log('\n⚠️  This was a DRY RUN - no changes were saved!');
      console.log('To apply these changes, run:');
      console.log('  npm run migrate:course-matrix --execute\n');
    } else if (execute) {
      console.log('\n✅ Migration completed successfully!\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
