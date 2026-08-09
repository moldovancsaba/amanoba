import connectDB from '../app/lib/mongodb';
import { Course, CCS } from '../app/lib/models';

(async () => {
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });
  if (!course) {
    console.error('Course not found: AI_DUMMIES_1DAY_EN');
    process.exit(1);
  }
  
  console.log(`Found course: ${course.name}`);
  console.log(`Current ccsId: ${course.ccsId || '(none)'}`);
  
  // Create or find CCS
  let ccs = await CCS.findOne({ ccsId: 'AI_DUMMIES_1DAY_EN' });
  
  if (!ccs) {
    console.log('Creating new CCS...');
    ccs = await CCS.create({
      ccsId: 'AI_DUMMIES_1DAY_EN',
      name: course.name,
      originalLanguage: course.language || 'en',
      originalCourseId: course.courseId,
      availableLanguages: [course.language || 'en'],
      languageVariants: [],
    });
    console.log(`✓ Created CCS: ${ccs.ccsId}`);
  } else {
    console.log(`✓ CCS already exists: ${ccs.ccsId}`);
  }
  
  // Update course to link to CCS
  if (course.ccsId !== ccs.ccsId) {
    await Course.updateOne(
      { _id: course._id },
      { $set: { ccsId: ccs.ccsId } }
    );
    console.log(`✓ Updated course to reference CCS`);
  }
  
  console.log('\n✅ CCS setup complete');
  process.exit(0);
})();
