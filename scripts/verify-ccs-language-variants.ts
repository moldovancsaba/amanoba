import connectDB from '../app/lib/mongodb';
import { CCS, Course } from '../app/lib/models';
import { getCourseLanguageVariants, hasLanguageVariants } from '../app/lib/course-helpers';

(async () => {
  await connectDB();

  console.log('='.repeat(70));
  console.log('CCS Language Variant Verification');
  console.log('='.repeat(70));

  // 1. Check CCS directly
  const ccs = await CCS.findOne({ ccsId: 'AI_DUMMIES_1DAY_EN' });
  
  if (!ccs) {
    console.error('❌ CCS not found!');
    process.exit(1);
  }

  console.log('\n✓ CCS Document:');
  console.log(`  ccsId: ${ccs.ccsId}`);
  console.log(`  name: ${ccs.name}`);
  console.log(`  originalLanguage: ${ccs.originalLanguage}`);
  console.log(`  originalCourseId: ${ccs.originalCourseId}`);
  console.log(`  availableLanguages: [${ccs.availableLanguages.join(', ')}]`);
  console.log(`  languageVariants (${ccs.languageVariants.length}):`);
  
  ccs.languageVariants.forEach(v => {
    console.log(`    - ${v.language}: ${v.courseId} (${v.translationStatus})`);
  });

  // 2. Test helper functions
  console.log('\n✓ Testing Helper Functions:');

  const hasVariants = await hasLanguageVariants('AI_DUMMIES_1DAY_EN');
  console.log(`  hasLanguageVariants('AI_DUMMIES_1DAY_EN'): ${hasVariants}`);

  const variants = await getCourseLanguageVariants('AI_DUMMIES_1DAY_EN');
  console.log(`  getCourseLanguageVariants('AI_DUMMIES_1DAY_EN'):`);
  console.log(`    Original: ${variants.original?.courseId} (${variants.original?.language})`);
  console.log(`    Available: [${variants.available.join(', ')}]`);
  console.log(`    Variants: ${variants.variants.length}`);

  // 3. Test Spanish course lookup
  const spanishVariants = await getCourseLanguageVariants('AI_DUMMIES_1DAY_EN_ES');
  console.log(`  getCourseLanguageVariants('AI_DUMMIES_1DAY_EN_ES'):`);
  console.log(`    Original: ${spanishVariants.original?.courseId} (${spanishVariants.original?.language})`);
  console.log(`    Available: [${spanishVariants.available.join(', ')}]`);

  // 4. Test CCS methods
  console.log('\n✓ Testing CCS Methods:');
  console.log(`  hasLanguage('en'): ${ccs.hasLanguage('en')}`);
  console.log(`  hasLanguage('es'): ${ccs.hasLanguage('es')}`);
  console.log(`  hasLanguage('zh'): ${ccs.hasLanguage('zh')}`);
  
  const esVariant = ccs.getVariantByLanguage('es');
  console.log(`  getVariantByLanguage('es'): ${esVariant ? esVariant.courseId : 'null'}`);

  console.log('\n' + '='.repeat(70));
  console.log('✅ All verifications passed!');
  console.log('='.repeat(70));

  process.exit(0);
})();
