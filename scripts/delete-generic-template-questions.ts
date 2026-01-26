/**
 * Delete Generic Template Questions
 * 
 * Purpose: Remove all unacceptable generic template questions that:
 * - Use template patterns like "Mi a kulcsfontosságú koncepció a [title] témakörből?"
 * - Have language mismatches (e.g., Hungarian question for Russian course)
 * - Don't test actual understanding
 * 
 * These questions are completely unacceptable and must be deleted.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

// Generic template patterns that are unacceptable
const GENERIC_PATTERNS = [
  'kulcsfontosságú koncepció',
  'Mi a fő célja a(z)',
  'Mit ellenőriznél a(z)',
  'Mi a következménye, ha a(z)',
  'Miért fontos a(z)',
  'Hogyan alkalmazod a(z)',
  'Egy Shopify boltod van. Hogyan alkalmazod a(z)',
  'A(z) "',
  'leckében tanultak alapján',
  'témakörből'
];

async function deleteGenericQuestions() {
  try {
    await connectDB();
    console.log(`🗑️  DELETING GENERIC TEMPLATE QUESTIONS\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Find all generic template questions
    const allQuestions = await QuizQuestion.find({ 
      isCourseSpecific: true, 
      isActive: true 
    }).lean();

    const courses = await Course.find({}).lean();
    const courseMap = new Map(courses.map(c => [c._id.toString(), c]));

    console.log(`📊 Analyzing ${allQuestions.length} questions...\n`);

    const toDelete: any[] = [];

    for (const q of allQuestions) {
      const isGeneric = GENERIC_PATTERNS.some(pattern => q.question.includes(pattern));
      
      if (isGeneric) {
        const course = courseMap.get(q.courseId?.toString() || '');
        const lesson = q.lessonId ? await Lesson.findOne({ lessonId: q.lessonId }).lean() : null;
        
        // Check for language mismatch
        let languageMismatch = false;
        if (course && lesson) {
          const courseLang = course.language.toLowerCase();
          const questionHasRussian = /[а-яА-Я]/.test(q.question);
          const questionHasHungarian = /[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(q.question);
          
          if (courseLang === 'ru' && questionHasHungarian) languageMismatch = true;
          if (courseLang === 'hu' && questionHasRussian && !questionHasHungarian) languageMismatch = true;
        }
        
        toDelete.push({
          id: q._id,
          question: q.question,
          courseId: course?.courseId || 'unknown',
          courseLang: course?.language || 'unknown',
          day: lesson?.dayNumber || 'unknown',
          languageMismatch
        });
      }
    }

    console.log(`❌ Found ${toDelete.length} generic template questions to delete\n`);

    if (toDelete.length === 0) {
      console.log('✅ No generic questions found. All questions are acceptable.\n');
      process.exit(0);
    }

    // Show sample
    console.log('Sample questions to be deleted:\n');
    toDelete.slice(0, 10).forEach((q, i) => {
      console.log(`${i + 1}. [${q.courseId}] Day ${q.day} (${q.courseLang})`);
      console.log(`   "${q.question.substring(0, 80)}..."`);
      if (q.languageMismatch) {
        console.log(`   ⚠️  LANGUAGE MISMATCH!`);
      }
      console.log('');
    });

    if (toDelete.length > 10) {
      console.log(`... and ${toDelete.length - 10} more\n`);
    }

    // Delete all generic questions
    const idsToDelete = toDelete.map(q => q.id);
    const deleteResult = await QuizQuestion.deleteMany({
      _id: { $in: idsToDelete }
    });

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📊 DELETION SUMMARY`);
    console.log(`${'═'.repeat(60)}\n`);
    console.log(`✅ Deleted ${deleteResult.deletedCount} generic template questions`);
    console.log(`\n⚠️  IMPORTANT: These questions need to be replaced with proper, content-specific questions!`);
    console.log(`   - Questions must be in the same language as the course`);
    console.log(`   - Questions must be 100% related to actual lesson content`);
    console.log(`   - Questions must test actual understanding, not use templates\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteGenericQuestions();
