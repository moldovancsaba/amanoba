#!/usr/bin/env tsx
/**
 * Test Course Matrix Rules
 * 
 * Purpose: Verify that matrix building rules are enforced correctly
 * 
 * Tests:
 * 1. Origin Rule - Must start with English L1
 * 2. Level Prerequisite - English L(N-1) required for Level N
 * 3. Language Variant - English at level N required for other languages at N
 * 4. Vertical Progression - Same language L(N-1) required for level N
 */

import connectDB from '../app/lib/mongodb';
import { CCS } from '../app/lib/models';

async function testMatrixRules() {
  await connectDB();

  console.log('='.repeat(70));
  console.log('Matrix Rules Validation Tests');
  console.log('='.repeat(70));

  // Create a test CCS
  const testCCSId = 'TEST_MATRIX_RULES_2026';
  
  // Clean up any existing test CCS
  await CCS.deleteOne({ ccsId: testCCSId });

  const testCCS = await CCS.create({
    ccsId: testCCSId,
    name: 'Test Matrix Rules',
    originalLanguage: 'en',
    originalCourseId: 'TEST_EN_L1',
    courseLevels: [],
    totalLevels: 0,
  });

  console.log(`\n✓ Created test CCS: ${testCCSId}\n`);

  let testsRun = 0;
  let testsPassed = 0;
  let testsFailed = 0;

  // Helper to run tests
  async function runTest(
    testName: string,
    testFn: () => Promise<void>,
    shouldFail: boolean = false
  ) {
    testsRun++;
    console.log(`\nTest ${testsRun}: ${testName}`);
    
    try {
      await testFn();
      
      if (shouldFail) {
        console.log(`  ❌ FAILED - Expected error but succeeded`);
        testsFailed++;
      } else {
        console.log(`  ✅ PASSED`);
        testsPassed++;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (shouldFail) {
        console.log(`  ✅ PASSED - Got expected error:`);
        console.log(`     "${errorMsg}"`);
        testsPassed++;
      } else {
        console.log(`  ❌ FAILED - Unexpected error:`);
        console.log(`     "${errorMsg}"`);
        testsFailed++;
      }
    }
  }

  // TEST GROUP 1: Origin Rule
  console.log('\n' + '='.repeat(70));
  console.log('TEST GROUP 1: Origin Rule (Must start with English L1)');
  console.log('='.repeat(70));

  await runTest(
    'Attempt to create Spanish L1 without English L1 (should FAIL)',
    async () => {
      await testCCS.createLevel(1, '1day_beginner', 'beginner', 8);
      await testCCS.addCourseToLevel(1, 'TEST_ES_L1', 'es');
    },
    true // Should fail
  );

  await runTest(
    'Create English L1 (origin) - should SUCCEED',
    async () => {
      // Reload CCS
      const ccs = await CCS.findOne({ ccsId: testCCSId });
      await ccs.addCourseToLevel(1, 'TEST_EN_L1', 'en', 'content-team');
    },
    false // Should succeed
  );

  // TEST GROUP 2: Level Prerequisite Rule
  console.log('\n' + '='.repeat(70));
  console.log('TEST GROUP 2: Level Prerequisite (English L(N-1) required)');
  console.log('='.repeat(70));

  await runTest(
    'Attempt to create English L2 without English L1 published (should FAIL)',
    async () => {
      const ccs = await CCS.findOne({ ccsId: testCCSId });
      // Set English L1 to draft
      const level1 = ccs.getLevelByNumber(1);
      const enL1 = level1.courseVariants.find((v: any) => v.language === 'en');
      enL1.translationStatus = 'draft';
      await ccs.save();
      
      await ccs.createLevel(2, '3day_essentials', 'intermediate', 24);
      await ccs.addCourseToLevel(2, 'TEST_EN_L2', 'en');
    },
    true // Should fail
  );

  await runTest(
    'Publish English L1 and create English L2 - should SUCCEED',
    async () => {
      const ccs = await CCS.findOne({ ccsId: testCCSId });
      // Set English L1 to published
      const level1 = ccs.getLevelByNumber(1);
      const enL1 = level1.courseVariants.find((v: any) => v.language === 'en');
      enL1.translationStatus = 'published';
      await ccs.save();
      
      // Now create level 2
      const ccsReloaded = await CCS.findOne({ ccsId: testCCSId });
      await ccsReloaded.createLevel(2, '3day_essentials', 'intermediate', 24);
      await ccsReloaded.addCourseToLevel(2, 'TEST_EN_L2', 'en');
    },
    false // Should succeed
  );

  // TEST GROUP 3: Language Variant Rule
  console.log('\n' + '='.repeat(70));
  console.log('TEST GROUP 3: Language Variant (English at level N required)');
  console.log('='.repeat(70));

  await runTest(
    'Create Spanish L1 now that English L1 published - should SUCCEED',
    async () => {
      const ccs = await CCS.findOne({ ccsId: testCCSId });
      await ccs.addCourseToLevel(1, 'TEST_ES_L1', 'es', 'translation-agent');
    },
    false // Should succeed
  );

  await runTest(
    'Attempt to create Spanish L2 without English L2 published (should FAIL)',
    async () => {
      const ccs = await CCS.findOne({ ccsId: testCCSId });
      // Set English L2 to draft
      const level2 = ccs.getLevelByNumber(2);
      const enL2 = level2.courseVariants.find((v: any) => v.language === 'en');
      enL2.translationStatus = 'draft';
      await ccs.save();
      
      const ccsReloaded = await CCS.findOne({ ccsId: testCCSId });
      await ccsReloaded.addCourseToLevel(2, 'TEST_ES_L2', 'es');
    },
    true // Should fail
  );

  // TEST GROUP 4: Vertical Language Progression Rule
  console.log('\n' + '='.repeat(70));
  console.log('TEST GROUP 4: Vertical Progression (Same language L(N-1) required)');
  console.log('='.repeat(70));

  await runTest(
    'Attempt to create Chinese L2 without Chinese L1 (should FAIL)',
    async () => {
      const ccs = await CCS.findOne({ ccsId: testCCSId });
      // Publish English L2 first
      const level2 = ccs.getLevelByNumber(2);
      const enL2 = level2.courseVariants.find((v: any) => v.language === 'en');
      enL2.translationStatus = 'published';
      await ccs.save();
      
      const ccsReloaded = await CCS.findOne({ ccsId: testCCSId });
      await ccsReloaded.addCourseToLevel(2, 'TEST_ZH_L2', 'zh');
    },
    true // Should fail
  );

  await runTest(
    'Create Chinese L1, then Chinese L2 - should SUCCEED',
    async () => {
      const ccs = await CCS.findOne({ ccsId: testCCSId });
      // First create Chinese L1
      await ccs.addCourseToLevel(1, 'TEST_ZH_L1', 'zh', 'translation-agent');
      
      // Now create Chinese L2
      const ccsReloaded = await CCS.findOne({ ccsId: testCCSId });
      await ccsReloaded.addCourseToLevel(2, 'TEST_ZH_L2', 'zh', 'translation-agent');
    },
    false // Should succeed
  );

  await runTest(
    'Create Spanish L2 now that Spanish L1 published - should SUCCEED',
    async () => {
      const ccs = await CCS.findOne({ ccsId: testCCSId });
      await ccs.addCourseToLevel(2, 'TEST_ES_L2', 'es', 'translation-agent');
    },
    false // Should succeed
  );

  // SUMMARY
  console.log('\n' + '='.repeat(70));
  console.log('Test Summary');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${testsRun}`);
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log('='.repeat(70));

  // Show final matrix state
  const finalCCS = await CCS.findOne({ ccsId: testCCSId });
  console.log('\nFinal Matrix State:');
  console.log(`  ${testCCSId}`);
  console.log(`  Total Levels: ${finalCCS.totalLevels}`);
  
  if (finalCCS.courseLevels) {
    console.log('\n  Matrix:');
    console.log('                EN          ES          ZH');
    finalCCS.courseLevels.forEach((level: any) => {
      const enCourse = level.courseVariants.find((v: any) => v.language === 'en');
      const esCourse = level.courseVariants.find((v: any) => v.language === 'es');
      const zhCourse = level.courseVariants.find((v: any) => v.language === 'zh');
      console.log(`    Level ${level.level}     ${enCourse ? '●' : '○'}           ${esCourse ? '●' : '○'}           ${zhCourse ? '●' : '○'}`);
    });
    console.log('\n  Legend: ● = Published, ○ = Not created');
  }

  // Clean up test CCS
  await CCS.deleteOne({ ccsId: testCCSId });
  console.log(`\n✓ Cleaned up test CCS\n`);

  if (testsFailed === 0) {
    console.log('✅ ALL TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.log(`❌ ${testsFailed} TEST(S) FAILED\n`);
    process.exit(1);
  }
}

testMatrixRules().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
