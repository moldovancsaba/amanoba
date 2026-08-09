/**
 * Fix Spanish Course Titles
 * 
 * Updates Spanish course with proper Spanish translations instead of POC placeholders.
 * This demonstrates production-ready translations vs POC placeholder translations.
 */

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

(async () => {
  await connectDB();
  
  console.log('Fixing Spanish course titles...\n');
  
  // Update course
  const course = await Course.findOneAndUpdate(
    { courseId: 'AI_DUMMIES_1DAY_EN_ES' },
    { 
      $set: { 
        name: 'IA para principiantes en un día',
        description: 'Una introducción amigable de 1 día a la IA para principiantes completos. Aprende qué es la IA, cómo funciona y cómo usarla en tu vida diaria sin necesidad de conocimientos técnicos.'
      }
    },
    { new: true }
  );
  
  console.log('✓ Updated course:');
  console.log(`  ${course?.name}`);
  console.log('');
  
  // Update lesson
  const lesson = await Lesson.findOneAndUpdate(
    { courseId: course?._id },
    { 
      $set: { 
        title: 'Conceptos básicos de IA: ¿Qué es la IA y cómo puedes usarla?',
        emailSubject: 'Día 1: Conceptos básicos de IA'
      }
    },
    { new: true }
  );
  
  console.log('✓ Updated lesson:');
  console.log(`  ${lesson?.title}`);
  console.log('');
  
  console.log('Note: Quiz questions still have [ES] prefix (POC placeholder).');
  console.log('For production, replace generate-translation.ts translateText()');
  console.log('function with real translation service (GPT-4, DeepL, etc.)');
  
  process.exit(0);
})();
