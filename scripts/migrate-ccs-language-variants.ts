#!/usr/bin/env tsx
/**
 * CCS Language Variant Migration Script
 * 
 * Purpose: Backfill existing CCS documents with language variant tracking fields
 * 
 * What it does:
 * 1. Find all CCS documents
 * 2. For each CCS, find all linked courses
 * 3. Identify the original course (English or oldest)
 * 4. Build languageVariants array from other courses
 * 5. Set originalLanguage, originalCourseId, availableLanguages
 * 6. Save updated CCS
 * 
 * Safety:
 * - Dry-run mode by default (use --execute to apply)
 * - Detailed logging of all changes
 * - Skips CCS without linked courses
 * 
 * Usage:
 *   npm run migrate:ccs-language-variants           # Dry run (preview)
 *   npm run migrate:ccs-language-variants --execute # Apply changes
 */

import connectDB from '../app/lib/mongodb';
import CCS from '../app/lib/models/ccs';
import { Course } from '../app/lib/models';

interface MigrationStats {
  totalCCS: number;
  updated: number;
  skipped: number;
  errors: number;
  details: {
    ccsId: string;
    status: 'updated' | 'skipped' | 'error';
    reason?: string;
    original?: string;
    variants?: string[];
  }[];
}

async function migrateCCSLanguageVariants(execute: boolean = false): Promise<MigrationStats> {
  const stats: MigrationStats = {
    totalCCS: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    details: [],
  };

  console.log('\n🔄 CCS Language Variant Migration');
  console.log('==================================\n');
  console.log(`Mode: ${execute ? '✅ EXECUTE (will save changes)' : '👁️  DRY RUN (preview only)'}\n`);

  // Find all CCS documents
  const allCCS = await CCS.find({}).lean();
  stats.totalCCS = allCCS.length;

  console.log(`Found ${stats.totalCCS} CCS documents\n`);

  for (const ccs of allCCS) {
    try {
      // Find all courses linked to this CCS
      const linkedCourses = await Course.find({ ccsId: ccs.ccsId })
        .select('courseId language name createdAt')
        .lean();

      if (linkedCourses.length === 0) {
        stats.skipped++;
        stats.details.push({
          ccsId: ccs.ccsId,
          status: 'skipped',
          reason: 'No linked courses found',
        });
        console.log(`⚠️  ${ccs.ccsId}`);
        console.log(`   Skipped: No linked courses\n`);
        continue;
      }

      // Check if already migrated
      if (ccs.originalCourseId && ccs.originalLanguage) {
        stats.skipped++;
        stats.details.push({
          ccsId: ccs.ccsId,
          status: 'skipped',
          reason: 'Already migrated',
        });
        console.log(`ℹ️  ${ccs.ccsId}`);
        console.log(`   Skipped: Already migrated\n`);
        continue;
      }

      // Identify original course
      // Priority: 1) English course, 2) Oldest course
      let originalCourse = linkedCourses.find(c => c.language === 'en');
      if (!originalCourse) {
        originalCourse = linkedCourses.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )[0];
      }

      const originalLanguage = originalCourse.language || 'en';
      const originalCourseId = originalCourse.courseId;

      // Build language variants array (exclude original)
      const languageVariants = linkedCourses
        .filter(c => c.courseId !== originalCourseId)
        .map(c => ({
          language: c.language || 'en',
          courseId: c.courseId,
          translationStatus: 'published' as const,
          translatedAt: c.createdAt,
          translatedBy: 'migration-script',
        }));

      // Build available languages array
      const availableLanguages = [
        originalLanguage,
        ...languageVariants.map(v => v.language),
      ];

      // Log the changes
      console.log(`✓ ${ccs.ccsId}`);
      console.log(`  Original: ${originalCourseId} (${originalLanguage})`);
      if (languageVariants.length > 0) {
        console.log(`  Variants: ${languageVariants.map(v => `${v.courseId} (${v.language})`).join(', ')}`);
      } else {
        console.log(`  Variants: None`);
      }
      console.log(`  Available: ${availableLanguages.join(', ')}\n`);

      // Update the CCS document if in execute mode
      if (execute) {
        await CCS.updateOne(
          { ccsId: ccs.ccsId },
          {
            $set: {
              originalLanguage,
              originalCourseId,
              availableLanguages,
              languageVariants,
            },
          }
        );
      }

      stats.updated++;
      stats.details.push({
        ccsId: ccs.ccsId,
        status: 'updated',
        original: `${originalCourseId} (${originalLanguage})`,
        variants: languageVariants.map(v => `${v.courseId} (${v.language})`),
      });

    } catch (error) {
      stats.errors++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      stats.details.push({
        ccsId: ccs.ccsId,
        status: 'error',
        reason: errorMsg,
      });
      console.error(`❌ ${ccs.ccsId}`);
      console.error(`   Error: ${errorMsg}\n`);
    }
  }

  return stats;
}

async function main() {
  const execute = process.argv.includes('--execute');

  try {
    await connectDB();
    console.log('✓ Connected to MongoDB\n');

    const stats = await migrateCCSLanguageVariants(execute);

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('Migration Summary');
    console.log('='.repeat(50));
    console.log(`Total CCS documents: ${stats.totalCCS}`);
    console.log(`✅ Updated: ${stats.updated}`);
    console.log(`⚠️  Skipped: ${stats.skipped}`);
    console.log(`❌ Errors: ${stats.errors}`);
    console.log('='.repeat(50));

    if (!execute && stats.updated > 0) {
      console.log('\n⚠️  This was a DRY RUN - no changes were saved!');
      console.log('To apply these changes, run:');
      console.log('  npm run migrate:ccs-language-variants --execute\n');
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
