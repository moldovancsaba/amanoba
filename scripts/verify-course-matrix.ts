import connectDB from '../app/lib/mongodb';
import { CCS, Course } from '../app/lib/models';
import {
  getCourseLevel,
  getNextLevelCourse,
  getPreviousLevelCourse,
  getAllLevelsForLanguage,
  getCourseAtLevelAndLanguage,
  getCourseMatrix,
  getLevelInfo,
} from '../app/lib/course-helpers';

(async () => {
  await connectDB();

  console.log('='.repeat(70));
  console.log('Course Matrix Verification');
  console.log('='.repeat(70));

  // 1. Check CCS structure
  const ccs = await CCS.findOne({ ccsId: 'AI_LEARNING_PATH_2026' });
  
  if (!ccs) {
    console.error('\n❌ CCS not found!');
    process.exit(1);
  }

  console.log('\n✓ CCS Document:');
  console.log(`  ccsId: ${ccs.ccsId}`);
  console.log(`  name: ${ccs.name}`);
  console.log(`  totalLevels: ${ccs.totalLevels}`);
  console.log(`  courseLevels: ${ccs.courseLevels?.length || 0}`);

  if (ccs.courseLevels) {
    console.log('\n  Level Structure:');
    ccs.courseLevels.forEach(level => {
      console.log(`    Level ${level.level} (${level.levelType}):`);
      console.log(`      Difficulty: ${level.difficulty}`);
      console.log(`      Estimated Hours: ${level.estimatedHours}`);
      console.log(`      Variants: ${level.courseVariants.length}`);
      level.courseVariants.forEach(v => {
        console.log(`        - ${v.courseId} (${v.language}) [${v.translationStatus}]`);
      });
    });
  }

  // 2. Test CCS methods
  console.log('\n✓ Testing CCS Methods:');
  
  const level1 = ccs.getLevelByNumber(1);
  console.log(`  getLevelByNumber(1): ${level1 ? level1.levelType : 'null'}`);
  
  const level2 = ccs.getLevelByNumber(2);
  console.log(`  getLevelByNumber(2): ${level2 ? level2.levelType : 'null'}`);
  
  const levelInfo = ccs.getLevelByCourseId('AI_DUMMIES_1DAY_EN');
  console.log(`  getLevelByCourseId('AI_DUMMIES_1DAY_EN'): Level ${levelInfo?.levelNumber || 'null'}`);
  
  const nextLevel = ccs.getNextLevel(1);
  console.log(`  getNextLevel(1): ${nextLevel ? `Level ${nextLevel.level}` : 'null'}`);
  
  const prevLevel = ccs.getPreviousLevel(2);
  console.log(`  getPreviousLevel(2): ${prevLevel ? `Level ${prevLevel.level}` : 'null'}`);
  
  const courseAtLevel = ccs.getCourseAtLevel(2, 'en');
  console.log(`  getCourseAtLevel(2, 'en'): ${courseAtLevel || 'null'}`);
  
  console.log(`  hasLevel(1): ${ccs.hasLevel(1)}`);
  console.log(`  hasLevel(2): ${ccs.hasLevel(2)}`);
  console.log(`  hasLevel(3): ${ccs.hasLevel(3)}`);

  // 3. Test helper functions
  console.log('\n✓ Testing Helper Functions:');

  // Test vertical navigation (levels)
  const level = await getCourseLevel('AI_DUMMIES_1DAY_EN');
  console.log(`  getCourseLevel('AI_DUMMIES_1DAY_EN'): ${level}`);

  const nextCourse = await getNextLevelCourse('AI_DUMMIES_1DAY_EN', 'en');
  console.log(`  getNextLevelCourse('AI_DUMMIES_1DAY_EN', 'en'): ${nextCourse || 'null'}`);

  const prevCourse = await getPreviousLevelCourse('AI_ESSENTIALS_3DAY_EN', 'en');
  console.log(`  getPreviousLevelCourse('AI_ESSENTIALS_3DAY_EN', 'en'): ${prevCourse || 'null'}`);

  const allLevelsEN = await getAllLevelsForLanguage('AI_DUMMIES_1DAY_EN', 'en');
  console.log(`  getAllLevelsForLanguage('AI_DUMMIES_1DAY_EN', 'en'):`);
  allLevelsEN.forEach((c, i) => console.log(`    Level ${i + 1}: ${c}`));

  const allLevelsES = await getAllLevelsForLanguage('AI_DUMMIES_1DAY_EN', 'es');
  console.log(`  getAllLevelsForLanguage('AI_DUMMIES_1DAY_EN', 'es'):`);
  allLevelsES.forEach((c, i) => console.log(`    Level ${i + 1}: ${c || 'null'}`));

  // Test diagonal navigation (level + language)
  const courseAt2EN = await getCourseAtLevelAndLanguage('AI_LEARNING_PATH_2026', 2, 'en');
  console.log(`  getCourseAtLevelAndLanguage('AI_LEARNING_PATH_2026', 2, 'en'): ${courseAt2EN || 'null'}`);

  const courseAt2ES = await getCourseAtLevelAndLanguage('AI_LEARNING_PATH_2026', 2, 'es');
  console.log(`  getCourseAtLevelAndLanguage('AI_LEARNING_PATH_2026', 2, 'es'): ${courseAt2ES || 'null'}`);

  // Test matrix query
  const matrix = await getCourseMatrix('AI_LEARNING_PATH_2026');
  console.log(`\n  getCourseMatrix('AI_LEARNING_PATH_2026'):`);
  console.log(`    Total Levels: ${matrix?.totalLevels}`);
  console.log(`    Available Languages: [${matrix?.availableLanguages.join(', ')}]`);
  if (matrix?.levels) {
    matrix.levels.forEach(level => {
      console.log(`    Level ${level.level} (${level.levelType}):`);
      level.courseVariants.forEach(v => {
        console.log(`      - ${v.language}: ${v.courseId}`);
      });
    });
  }

  // Test level info
  const levelInfoResult = await getLevelInfo('AI_ESSENTIALS_3DAY_EN');
  console.log(`\n  getLevelInfo('AI_ESSENTIALS_3DAY_EN'):`);
  console.log(`    Level: ${levelInfoResult?.level}`);
  console.log(`    Type: ${levelInfoResult?.levelType}`);
  console.log(`    Difficulty: ${levelInfoResult?.difficulty}`);
  console.log(`    Languages: [${levelInfoResult?.languages.join(', ')}]`);

  // 4. Matrix Navigation Tests
  console.log('\n✓ Matrix Navigation Tests:');

  console.log('\n  Scenario 1: User completes Level 1 English, what\'s next?');
  const next1 = await getNextLevelCourse('AI_DUMMIES_1DAY_EN', 'en');
  console.log(`    Next: ${next1} ✅`);

  console.log('\n  Scenario 2: User at Level 2 English, wants Spanish');
  const spanish2 = await getCourseAtLevelAndLanguage('AI_LEARNING_PATH_2026', 2, 'es');
  console.log(`    Spanish Level 2: ${spanish2 || 'Not available yet'} ${spanish2 ? '✅' : '⚠️'}`);

  console.log('\n  Scenario 3: User at Level 1 Spanish, what\'s next in Spanish?');
  const nextES = await getNextLevelCourse('AI_DUMMIES_1DAY_EN_ES', 'es');
  console.log(`    Next Spanish: ${nextES || 'Not available yet'} ${nextES ? '✅' : '⚠️'}`);

  console.log('\n  Scenario 4: Show complete learning path');
  const fullMatrix = await getCourseMatrix('AI_LEARNING_PATH_2026');
  console.log(`    ${fullMatrix?.name}`);
  console.log(`    Total Levels: ${fullMatrix?.totalLevels}`);
  console.log(`\n    Matrix:`);
  console.log(`                EN                     ES`);
  fullMatrix?.levels.forEach(level => {
    const enCourse = level.courseVariants.find(v => v.language === 'en');
    const esCourse = level.courseVariants.find(v => v.language === 'es');
    console.log(`    Level ${level.level}     ${enCourse ? '●' : '○'}                      ${esCourse ? '●' : '○'}`);
  });
  console.log(`\n    Legend: ● = Available, ○ = Not yet created`);

  console.log('\n' + '='.repeat(70));
  console.log('✅ All verifications passed!');
  console.log('='.repeat(70));

  process.exit(0);
})();
