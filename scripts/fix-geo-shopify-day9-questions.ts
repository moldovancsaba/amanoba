/**
 * Fix Day 9 Questions - Proper Content-Based Questions
 * 
 * Purpose: Replace generic template questions with proper, content-specific questions
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';
const DAY_NUMBER = 9;

// Proper questions based on actual lesson content
const DAY9_QUESTIONS = [
  // RECALL questions (4-5)
  {
    question: 'Miért fontos, hogy a SKU minden variánsnál egyedi legyen?',
    options: [
      'Az AI és a feed azonosítóval különbözteti meg a termékeket - hibás ID rossz ajánláshoz vezet',
      'A SKU csak díszítés, nem fontos',
      'A SKU csak a belső rendszerekhez kell',
      'A SKU csak a készlet számoláshoz fontos'
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EASY,
    category: 'Course Specific',
    questionType: QuestionType.RECALL,
    hashtags: ['#sku', '#identifiers', '#beginner', '#recall', '#hu', '#all-languages']
  },
  {
    question: 'Mit kell ellenőrizni a GTIN-nél?',
    options: [
      'Helyes-e és nem duplikált-e',
      'Csak azt, hogy létezik-e',
      'Csak a hosszát',
      'Nem kell ellenőrizni'
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EASY,
    category: 'Course Specific',
    questionType: QuestionType.RECALL,
    hashtags: ['#gtin', '#identifiers', '#beginner', '#recall', '#hu', '#all-languages']
  },
  {
    question: 'Mit jelent a "variáns név tisztasága" a GEO szempontjából?',
    options: [
      'A variáns név egyértelmű legyen (pl. "férfi, kék, 42"), ne legyen keverés (pl. "42 kék vagy fekete?")',
      'A variáns név rövid legyen',
      'A variáns név angolul legyen',
      'A variáns név nem fontos'
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuestionType.RECALL,
    hashtags: ['#variants', '#identifiers', '#intermediate', '#recall', '#hu', '#all-languages']
  },
  {
    question: 'Mi a brand mező követelménye?',
    options: [
      'Kitöltve legyen és következetes legyen',
      'Opcionális, nem fontos',
      'Csak prémium termékeknél kell',
      'Csak nagy márkáknál kell'
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EASY,
    category: 'Course Specific',
    questionType: QuestionType.RECALL,
    hashtags: ['#brand', '#identifiers', '#beginner', '#recall', '#hu', '#all-languages']
  },
  {
    question: 'Mi a következménye, ha az azonosítók hibásak vagy hiányoznak?',
    options: [
      'Az AI és a feed rossz ajánlást adhat, mert nem tudja megkülönböztetni a termékeket',
      'Nincs következmény',
      'Csak a belső rendszerekben van probléma',
      'Csak a készlet számolásban van probléma'
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuestionType.RECALL,
    hashtags: ['#identifiers', '#geo', '#intermediate', '#recall', '#hu', '#all-languages']
  },
  // APPLICATION questions (2)
  {
    question: 'Egy terméknél a variáns neve "42 kék vagy fekete?". Mit kell javítanod?',
    options: [
      'Tisztáznod kell a variáns nevet, hogy egyértelmű legyen (pl. "férfi, kék, 42" vagy "férfi, fekete, 42")',
      'Nem kell javítani, rendben van',
      'Törölni kell a variáns nevet',
      'Csak a színt kell megadni'
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuestionType.APPLICATION,
    hashtags: ['#variants', '#application', '#intermediate', '#application', '#hu', '#all-languages']
  },
  {
    question: 'Egy termék auditálásakor találsz duplikált SKU-t két különböző variánsnál. Mit csinálsz?',
    options: [
      'Javítod a SKU-kat, hogy minden variánsnál egyedi legyen',
      'Nem csinálsz semmit, nem fontos',
      'Törlöd az egyik variánst',
      'Csak a GTIN-t javítod'
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuestionType.APPLICATION,
    hashtags: ['#sku', '#audit', '#intermediate', '#application', '#hu', '#all-languages']
  }
];

async function fixDay9Questions() {
  try {
    await connectDB();
    console.log(`🔧 FIXING DAY ${DAY_NUMBER} QUESTIONS FOR: ${COURSE_ID}\n`);

    const course = await Course.findOne({ courseId: COURSE_ID });
    if (!course) {
      console.error(`❌ Course not found: ${COURSE_ID}`);
      process.exit(1);
    }

    const lesson = await Lesson.findOne({
      courseId: course._id,
      dayNumber: DAY_NUMBER,
      isActive: true,
    });

    if (!lesson) {
      console.error(`❌ Lesson not found for day ${DAY_NUMBER}`);
      process.exit(1);
    }

    console.log(`📅 Day ${DAY_NUMBER}: ${lesson.title}\n`);

    // Delete existing questions
    const deleteResult = await QuizQuestion.deleteMany({
      lessonId: lesson.lessonId,
      courseId: course._id,
      isCourseSpecific: true,
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} old questions\n`);

    // Create new questions
    console.log(`📝 Creating ${DAY9_QUESTIONS.length} proper questions...\n`);
    for (const q of DAY9_QUESTIONS) {
      const newQuestion = new QuizQuestion({
        uuid: randomUUID(),
        lessonId: lesson.lessonId,
        courseId: course._id,
        question: q.question,
        options: q.options as [string, string, string, string],
        correctIndex: q.correctIndex,
        difficulty: q.difficulty,
        category: q.category,
        isCourseSpecific: true,
        questionType: q.questionType,
        hashtags: q.hashtags,
        isActive: true,
        showCount: 0,
        correctCount: 0,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          auditedAt: new Date(),
          auditedBy: 'AI-Developer',
        },
      });

      await newQuestion.save();
      const typeStr = q.questionType === QuestionType.RECALL ? 'RECALL' : 
                     q.questionType === QuestionType.APPLICATION ? 'APPLICATION' : 
                     'CRITICAL_THINKING';
      console.log(`   ✅ [${typeStr}] ${q.question.substring(0, 60)}...`);
    }

    console.log(`\n✅ Day ${DAY_NUMBER} questions fixed!\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixDay9Questions();
