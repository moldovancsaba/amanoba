/**
 * Verify Spanish Lesson Content
 * 
 * Reads the Spanish lesson from database to verify it's properly translated.
 */

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

(async () => {
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN_ES' });
  
  if (!course) {
    console.error('Spanish course not found!');
    process.exit(1);
  }
  
  const lesson = await Lesson.findOne({ courseId: course._id });
  
  if (!lesson) {
    console.error('Spanish lesson not found!');
    process.exit(1);
  }
  
  console.log('🇪🇸 SPANISH COURSE VERIFICATION');
  console.log('================================\n');
  
  console.log('Course Details:');
  console.log(`  ID: ${course.courseId}`);
  console.log(`  Name: ${course.name}`);
  console.log(`  Description: ${course.description}`);
  console.log(`  Language: ${course.language}`);
  console.log('');
  
  console.log('Lesson Details:');
  console.log(`  Title: ${lesson.title}`);
  console.log(`  Email Subject: ${lesson.emailSubject}`);
  console.log('');
  
  console.log('Lesson Content (first 1000 chars):');
  console.log('-----------------------------------');
  console.log(lesson.content.substring(0, 1000));
  console.log('...');
  console.log('');
  
  // Check for Spanish indicators
  const spanishIndicators = [
    '¿Qué es la IA?',
    'Lección',
    'Objetivo de aprendizaje',
    'Serás capaz de',
    'Criterios de éxito'
  ];
  
  const foundIndicators = spanishIndicators.filter(indicator => 
    lesson.content.includes(indicator)
  );
  
  console.log('Spanish Language Verification:');
  console.log(`  ✓ Found ${foundIndicators.length}/${spanishIndicators.length} Spanish indicators`);
  foundIndicators.forEach(indicator => {
    console.log(`    - "${indicator}"`);
  });
  
  // Check for English leakage
  const englishIndicators = ['Learning goal', 'Success criteria', 'What is AI?'];
  const foundEnglish = englishIndicators.filter(indicator => 
    lesson.content.includes(indicator)
  );
  
  if (foundEnglish.length > 0) {
    console.log('');
    console.log('⚠ English leakage detected:');
    foundEnglish.forEach(indicator => {
      console.log(`    - "${indicator}"`);
    });
  } else {
    console.log('  ✓ No English leakage detected');
  }
  
  console.log('');
  console.log('✅ Verification complete!');
  
  process.exit(0);
})();
