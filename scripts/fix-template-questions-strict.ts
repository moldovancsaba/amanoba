/**
 * Fix Template Questions - Strict
 * 
 * Purpose: Find and fix/delete questions with generic templates like:
 * - "Mit jelent a "X" a leckében tárgyalt kontextusban?"
 * - Questions with invalid/fragment terms
 * - Questions with generic template answers
 * 
 * These are completely unacceptable and must be fixed or deleted.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { validateQuestionQuality } from './question-quality-validator';
import { QuestionDifficulty, QuestionType } from '../app/lib/models';

// Template patterns that are unacceptable
const TEMPLATE_PATTERNS = [
  /^Mit jelent a ".*?" a leckében tárgyalt kontextusban\?/i,
  /^What does ".*?" mean in the context discussed in the lesson\?/i,
  /^Что означает ".*?" в контексте, обсуждаемом в уроке\?/i,
  /^Ne anlama gelir ".*?" ders içinde tartışılan bağlamda\?/i,
  /^Co oznacza ".*?" w kontekście omówionym w lekcji\?/i,
  /^O que significa ".*?" no contexto discutido na lição\?/i,
  /^Có nghĩa là gì ".*?" trong ngữ cảnh được thảo luận trong bài học\?/i,
  /^Apa arti ".*?" dalam konteks yang dibahas dalam pelajaran\?/i,
  /^Какво означава ".*?" в контекста, обсъден в урока\?/i,
  /^का मतलब है ".*?" पाठ में चर्चा किए गए संदर्भ में\?/i
];

// Invalid/fragment terms
const INVALID_TERMS = ['mestere', 'ra', 're', 'ban', 'ben', 'bol', 'ből', 'val', 'vel'];

// Generic template answer patterns
const TEMPLATE_ANSWER_PATTERNS = [
  /a leckében részletesen (magyarázott|leírt).*?vonatkozó specifikus/i,
  /the specific definition and usage.*?as explained.*?in the lesson/i,
  /конкретное определение.*?как.*?объяснено.*?в уроке/i,
  /specifikus definíció és használat/i,
  /specific definition and usage/i
];

async function fixTemplateQuestions() {
  try {
    await connectDB();
    console.log('🔍 Finding template questions...\n');

    const allQuestions = await QuizQuestion.find({
      isActive: true,
      isCourseSpecific: true
    }).lean();

    console.log(`📊 Total questions to check: ${allQuestions.length}\n`);

    const questionsToDelete: string[] = [];
    const questionsToFix: Array<{ id: string; question: any; course: any; lesson: any }> = [];

    for (const q of allQuestions) {
      let shouldDelete = false;
      const shouldFix = false;
      const issues: string[] = [];

      // Check for template question patterns
      for (const pattern of TEMPLATE_PATTERNS) {
        if (pattern.test(q.question)) {
          shouldDelete = true;
          issues.push('Template question pattern');
          break;
        }
      }

      // Check for invalid terms in quotes
      const quotedTermMatch = q.question.match(/"([^"]+)"/);
      if (quotedTermMatch) {
        const quotedTerm = quotedTermMatch[1].trim().toLowerCase();
        if (quotedTerm.length < 4 || INVALID_TERMS.includes(quotedTerm)) {
          shouldDelete = true;
          issues.push(`Invalid/fragment term: "${quotedTerm}"`);
        }
      }

      // Check for template answers
      if (q.options && Array.isArray(q.options)) {
        for (const option of q.options) {
          for (const pattern of TEMPLATE_ANSWER_PATTERNS) {
            if (pattern.test(option)) {
              shouldDelete = true;
              issues.push('Template answer pattern');
              break;
            }
          }
        }
      }

      // Also validate with the quality validator
      let course: any = null;
      let lesson: any = null;
      
      try {
        course = await Course.findById(q.courseId).lean();
        lesson = await Lesson.findOne({ lessonId: q.lessonId }).lean();
      } catch (err) {
        // Skip if course/lesson lookup fails
      }
      
      if (course && lesson) {
        const validation = validateQuestionQuality(
          q.question,
          q.options || [],
          (q.questionType as QuestionType) || QuestionType.RECALL,
          (q.difficulty as QuestionDifficulty) || QuestionDifficulty.MEDIUM,
          course.language || 'en',
          lesson.title,
          lesson.content
        );

        if (!validation.isValid) {
          shouldDelete = true;
          issues.push(...validation.errors);
        }
      } else if (shouldDelete) {
        // Already marked for deletion, just log
      }

      if (shouldDelete) {
        questionsToDelete.push(q._id.toString());
        console.log(`❌ Question to delete: ${q.question.substring(0, 60)}...`);
        console.log(`   Issues: ${issues.join(', ')}`);
        console.log(`   Course: ${course?.name || 'Unknown'}`);
        console.log(`   Lesson: ${lesson?.title || 'Unknown'}\n`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Questions to delete: ${questionsToDelete.length}`);

    if (questionsToDelete.length > 0) {
      console.log(`\n🗑️  Deleting ${questionsToDelete.length} template questions...`);
      const result = await QuizQuestion.deleteMany({
        _id: { $in: questionsToDelete }
      });
      console.log(`✅ Deleted ${result.deletedCount} questions\n`);
    } else {
      console.log(`✅ No template questions found!\n`);
    }

    // Now we need to regenerate questions for affected lessons
    if (questionsToDelete.length > 0) {
      console.log(`\n🔄 Affected lessons need question regeneration.`);
      console.log(`   Run: npx tsx scripts/process-all-courses-quality-secured-final.ts\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTemplateQuestions();
