#!/usr/bin/env tsx
import connectDB from '../app/lib/mongodb';
import { CCS } from '../app/lib/models';

async function cleanup() {
  await connectDB();
  
  const ccs = await CCS.findOne({ ccsId: 'AI_LEARNING_PATH_2026' });
  
  if (!ccs) {
    console.error('CCS not found');
    process.exit(1);
  }
  
  console.log('\nRemoving test courses...');
  
  let removed = 0;
  
  for (const level of (ccs.courseLevels || [])) {
    const initialLength = level.courseVariants.length;
    level.courseVariants = level.courseVariants.filter((v: any) => 
      !v.courseId.startsWith('TEST_')
    );
    removed += (initialLength - level.courseVariants.length);
  }
  
  if (removed > 0) {
    await ccs.save();
    console.log(`✓ Removed ${removed} test course(s)`);
  } else {
    console.log('✓ No test courses found');
  }
  
  // Show cleaned matrix
  console.log('\nCleaned Matrix:');
  console.log('                EN          ES          ZH');
  ccs.courseLevels?.forEach((level: any) => {
    const enCourse = level.courseVariants.find((v: any) => v.language === 'en');
    const esCourse = level.courseVariants.find((v: any) => v.language === 'es');
    const zhCourse = level.courseVariants.find((v: any) => v.language === 'zh');
    console.log(`    Level ${level.level}     ${enCourse ? '●' : '○'}           ${esCourse ? '○' : '○'}           ${zhCourse ? '○' : '○'}`);
  });
  
  process.exit(0);
}

cleanup();
