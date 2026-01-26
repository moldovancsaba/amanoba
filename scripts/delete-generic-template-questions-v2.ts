/**
 * Delete Generic Template Questions V2
 * 
 * Purpose: Find and delete ALL unacceptable generic template questions including:
 * - "What is a key concept from..."
 * - "A fundamental principle related to this topic"
 * - Any questions with placeholder/generic answers
 * 
 * These are completely unacceptable and must be deleted.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

// Generic template patterns that are unacceptable
const GENERIC_QUESTION_PATTERNS = [
  'What is a key concept from',
  'Mi a kulcsfontosságú koncepció',
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

// Generic placeholder answer patterns
const GENERIC_ANSWER_PATTERNS = [
  'A fundamental principle related to this topic',
  'An advanced technique not covered here',
  'A completely unrelated concept',
  'A basic misunderstanding',
  'Egy alapvető elv, amely kapcsolódik ehhez a témához',
  'Egy fejlett technika, amelyet itt nem tárgyalunk',
  'Egy teljesen kapcsolatban nem álló koncepció',
  'Egy alapvető félreértés'
];

async function deleteGenericQuestions() {
  try {
    await connectDB();
    console.log(`🗑️  DELETING GENERIC TEMPLATE QUESTIONS V2\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const allQuestions = await QuizQuestion.find({ 
      isCourseSpecific: true, 
      isActive: true 
    }).lean();

    const courses = await Course.find({}).lean();
    const courseMap = new Map(courses.map(c => [c._id.toString(), c]));

    console.log(`📊 Analyzing ${allQuestions.length} questions...\n`);

    const toDelete: any[] = [];

    for (const q of allQuestions) {
      const questionText = q.question || '';
      const options = q.options || [];
      
      // Check if question matches generic patterns
      const hasGenericQuestion = GENERIC_QUESTION_PATTERNS.some(pattern => 
        questionText.includes(pattern)
      );
      
      // Check if any answer matches generic patterns
      const hasGenericAnswer = options.some((opt: string) =>
        GENERIC_ANSWER_PATTERNS.some(pattern => opt.includes(pattern))
      );
      
      if (hasGenericQuestion || hasGenericAnswer) {
        const course = courseMap.get(q.courseId?.toString() || '');
        const lesson = q.lessonId ? await Lesson.findOne({ lessonId: q.lessonId }).lean() : null;
        
        toDelete.push({
          id: q._id,
          question: questionText,
          courseId: course?.courseId || 'unknown',
          courseLang: course?.language || 'unknown',
          day: lesson?.dayNumber || 'unknown',
          reason: hasGenericQuestion ? 'generic_question' : 'generic_answer'
        });
      }
    }

    console.log(`❌ Found ${toDelete.length} generic template questions to delete\n`);

    if (toDelete.length === 0) {
      console.log('✅ No generic questions found. All questions are acceptable.\n');
      process.exit(0);
    }

    console.log('Sample questions to be deleted:\n');
    toDelete.slice(0, 15).forEach((q, i) => {
      console.log(`${i + 1}. [${q.courseId}] Day ${q.day} (${q.courseLang})`);
      console.log(`   "${q.question.substring(0, 100)}${q.question.length > 100 ? '...' : ''}"`);
      console.log(`   Reason: ${q.reason}\n`);
    });

    if (toDelete.length > 15) {
      console.log(`... and ${toDelete.length - 15} more\n`);
    }

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
    console.log(`   - Questions must test actual understanding, not use templates`);
    console.log(`   - Answers must be educational and plausible\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteGenericQuestions();
