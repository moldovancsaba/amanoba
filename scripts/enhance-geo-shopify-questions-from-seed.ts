/**
 * Enhance GEO_SHOPIFY_30 Questions from Seed File
 * 
 * This script uses the content-specific questions from seed-geo-shopify-course.ts
 * and enhances them to 7 questions per lesson with proper metadata.
 * 
 * Since the seed file has good content-specific questions for all 30 days,
 * we'll use those as a base and add 2 more questions per lesson.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';
import mongoose from 'mongoose';

const COURSE_ID = 'GEO_SHOPIFY_30';

// Import the seed file's question data structure
// We'll read the actual lesson content from DB and generate proper questions

/**
 * Generate 2 additional content-specific questions based on lesson content
 * to expand from 5 to 7 questions per lesson
 */
function generateAdditionalQuestions(
  day: number,
  title: string,
  content: string,
  existingQuestions: string[]
): Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}> {
  const questions: Array<{
    question: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    difficulty: QuestionDifficulty;
    category: string;
    questionType: QuestionType;
    hashtags: string[];
  }> = [];

  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();

  // Generate 1 APPLICATION question
  if (titleLower.includes('audit') || titleLower.includes('ellenőrzés')) {
    questions.push({
      question: `Hogyan végeznéd el a(z) "${title}" leckében leírt auditálást a saját boltodon?`,
      options: [
        'Lépésről lépésre követem a leckében leírt checklistet és dokumentálom a hiányosságokat',
        'Csak átfutom a termékoldalakat',
        'Nem végzek auditot',
        'Csak a képeket ellenőrzöm'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuestionType.APPLICATION,
      hashtags: [`#day${day}`, '#audit', '#intermediate', '#application', '#hu', '#all-languages']
    });
  } else if (titleLower.includes('checklist') || titleLower.includes('readiness')) {
    questions.push({
      question: `A(z) "${title}" leckében tanult checklist alapján, mit javítanál elsőként a boltodon?`,
      options: [
        'A checklist legfontosabb, hiányzó elemeit prioritás szerint',
        'Véletlenszerűen választok elemet',
        'Nem javítok semmit',
        'Csak a design-t változtatom'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuestionType.APPLICATION,
      hashtags: [`#day${day}`, '#checklist', '#intermediate', '#application', '#hu', '#all-languages']
    });
  } else if (titleLower.includes('capsule') || titleLower.includes('answer')) {
    questions.push({
      question: `Hogyan készítenéd el az answer capsule-t a(z) "${title}" leckében leírtak szerint?`,
      options: [
        '5 sorban, tartalmazza: kinek, mire jó, mire nem, ár/készlet, policy link',
        'Hosszú, részletes leírást írok',
        'Csak egy marketing szlogent',
        'Nem készítek answer capsule-t'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuestionType.APPLICATION,
      hashtags: [`#day${day}`, '#answer-capsule', '#intermediate', '#application', '#hu', '#all-languages']
    });
  } else {
    questions.push({
      question: `Hogyan alkalmaznád a(z) "${title}" leckében tanultakat a saját Shopify boltodon?`,
      options: [
        'Azonnal alkalmazom a leckében leírt módszereket és dokumentálom az eredményeket',
        'Csak olvasom, nem alkalmazom',
        'Várok, amíg valaki más csinálja',
        'Nem értem, mit kellene csinálni'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuestionType.APPLICATION,
      hashtags: [`#day${day}`, '#intermediate', '#application', '#hu', '#all-languages']
    });
  }

  // Generate 1 CRITICAL_THINKING question
  if (contentLower.includes('kockázat') || contentLower.includes('risk')) {
    questions.push({
      question: `Miért fontos a(z) "${title}" leckében említett kockázatok elkerülése a GEO szempontjából?`,
      options: [
        'A kockázatok (pl. félreértett adatok, hamis ígéretek) csökkentik az AI válaszokban való szereplés minőségét és bizalmát',
        'Nem fontosak a kockázatok',
        'Csak SEO miatt számítanak',
        'Csak design miatt'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific',
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: [`#day${day}`, '#risk', '#advanced', '#critical-thinking', '#hu', '#all-languages']
    });
  } else if (contentLower.includes('feed') || contentLower.includes('adatcsatorna')) {
    questions.push({
      question: `Hogyan befolyásolja a feed és a PDP közötti adatkonzisztencia az AI válaszok minőségét?`,
      options: [
        'Az eltérő adatok (ár, készlet, policy) félrevezető AI ajánlásokhoz vezetnek, ami rossz felhasználói élményt és bizalomvesztést okoz',
        'Nincs hatás',
        'Csak SEO miatt számít',
        'Csak design miatt'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific',
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: [`#day${day}`, '#feed', '#consistency', '#advanced', '#critical-thinking', '#hu', '#all-languages']
    });
  } else {
    questions.push({
      question: `Hogyan járul hozzá a(z) "${title}" leckében tanultak a boltod GEO optimalizálásához és az AI válaszokban való szereplés minőségéhez?`,
      options: [
        'A leckében tanultak növelik az idézhetőséget, csökkentik a kockázatot, és javítják az AI válaszok pontosságát',
        'Nincs hatás',
        'Csak SEO miatt számít',
        'Csak design miatt'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific',
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: [`#day${day}`, '#advanced', '#critical-thinking', '#hu', '#all-languages']
    });
  }

  return questions;
}

async function enhanceQuestions() {
  try {
    await connectDB();
    console.log(`🔧 ENHANCING QUESTIONS FOR: ${COURSE_ID}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const course = await Course.findOne({ courseId: COURSE_ID });
    if (!course) {
      console.error(`❌ Course not found: ${COURSE_ID}`);
      process.exit(1);
    }

    console.log(`📖 Course: ${course.name}`);
    console.log(`   Language: ${course.language.toUpperCase()}\n`);

    const lessons = await Lesson.find({
      courseId: course._id,
      isActive: true,
    })
      .sort({ dayNumber: 1 })
      .lean();

    console.log(`📝 Found ${lessons.length} lessons\n`);

    // For now, we'll need to manually enhance questions
    // The seed file has good questions but we need to ensure 7 per lesson with proper metadata
    // This script will be a starting point - we may need to manually review and enhance
    
    console.log('⚠️  This script is a template.');
    console.log('   To properly fix all questions, we need to:');
    console.log('   1. Read the seed file\'s question structure');
    console.log('   2. Expand each lesson from 5 to 7 questions');
    console.log('   3. Add proper metadata (questionType, hashtags)');
    console.log('   4. Ensure proper cognitive mix\n');
    
    console.log('📋 Next steps:');
    console.log('   - Review the seed file questions (days 1-30)');
    console.log('   - Create comprehensive question sets for all days');
    console.log('   - Run the fix script to update the database\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

enhanceQuestions();
