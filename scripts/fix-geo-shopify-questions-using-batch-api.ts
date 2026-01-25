/**
 * Fix GEO_SHOPIFY_30 Questions Using Batch API
 * 
 * Purpose: Extract seed file questions, enhance with metadata, expand to 7 per lesson,
 * and use batch API to create them
 * 
 * Requirements:
 * - 7 questions per quiz (exactly)
 * - 100% related to lesson content
 * - Native Hungarian quality
 * - Proper cognitive mix: 4-5 RECALL, 2-3 APPLICATION, 0-1 CRITICAL_THINKING
 * - Proper metadata: UUID, hashtags, questionType, difficulty
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';
import mongoose from 'mongoose';

const COURSE_ID = 'GEO_SHOPIFY_30';

// Import seed file questions structure
// We'll need to manually map the seed file's questions to proper format
// For now, let's create a comprehensive solution

/**
 * Map difficulty from seed file to QuestionDifficulty enum
 */
function mapDifficulty(difficulty: string): QuestionDifficulty {
  switch (difficulty) {
    case 'EASY': return QuestionDifficulty.EASY;
    case 'MEDIUM': return QuestionDifficulty.MEDIUM;
    case 'HARD': return QuestionDifficulty.HARD;
    case 'EXPERT': return QuestionDifficulty.EXPERT;
    default: return QuestionDifficulty.MEDIUM;
  }
}

/**
 * Determine questionType based on question content and difficulty
 */
function determineQuestionType(question: string, difficulty: QuestionDifficulty, day: number): QuestionType {
  const qLower = question.toLowerCase();
  
  // Critical thinking indicators
  if (difficulty === QuestionDifficulty.HARD && (
    qLower.includes('miért') || 
    qLower.includes('hogyan befolyásol') ||
    qLower.includes('kockázat') ||
    qLower.includes('következmény')
  )) {
    return QuestionType.CRITICAL_THINKING;
  }
  
  // Application indicators
  if (qLower.includes('hogyan') || 
      qLower.includes('mit tegyél') ||
      qLower.includes('alkalmaz') ||
      qLower.includes('ellenőriz') ||
      qLower.includes('készíts') ||
      qLower.includes('végezz')) {
    return QuestionType.APPLICATION;
  }
  
  // Default to RECALL
  return QuestionType.RECALL;
}

/**
 * Generate hashtags for a question
 */
function generateHashtags(day: number, questionType: QuestionType, difficulty: QuestionDifficulty): string[] {
  const hashtags: string[] = [`#day${day}`, '#hu', '#all-languages', '#geo-shopify'];
  
  // Add difficulty hashtag
  if (difficulty === QuestionDifficulty.EASY) hashtags.push('#beginner');
  else if (difficulty === QuestionDifficulty.MEDIUM) hashtags.push('#intermediate');
  else if (difficulty === QuestionDifficulty.HARD) hashtags.push('#advanced');
  else if (difficulty === QuestionDifficulty.EXPERT) hashtags.push('#expert');
  
  // Add question type hashtag
  if (questionType === QuestionType.RECALL) hashtags.push('#recall');
  else if (questionType === QuestionType.APPLICATION) hashtags.push('#application');
  else if (questionType === QuestionType.CRITICAL_THINKING) hashtags.push('#critical-thinking');
  
  return hashtags;
}

/**
 * Add 2 additional questions to reach 7 per lesson
 */
function generateAdditionalQuestions(
  day: number,
  title: string,
  content: string,
  existingQuestions: any[]
): any[] {
  const additional: any[] = [];
  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // Determine what type of questions we need
  const recallCount = existingQuestions.filter(q => q.questionType === QuestionType.RECALL).length;
  const appCount = existingQuestions.filter(q => q.questionType === QuestionType.APPLICATION).length;
  const criticalCount = existingQuestions.filter(q => q.questionType === QuestionType.CRITICAL_THINKING).length;
  
  // We need 4-5 RECALL, 2-3 APPLICATION, 0-1 CRITICAL_THINKING
  // Add missing types
  
  // Add 1 APPLICATION if we have less than 2
  if (appCount < 2) {
    if (titleLower.includes('audit') || titleLower.includes('ellenőrzés')) {
      additional.push({
        question: `Hogyan végeznéd el a(z) "${title}" leckében leírt auditálást a saját Shopify boltodon?`,
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
        hashtags: generateHashtags(day, QuestionType.APPLICATION, QuestionDifficulty.MEDIUM)
      });
    } else {
      additional.push({
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
        hashtags: generateHashtags(day, QuestionType.APPLICATION, QuestionDifficulty.MEDIUM)
      });
    }
  }
  
  // Add 1 CRITICAL_THINKING if we have 0 and difficulty allows
  if (criticalCount === 0 && additional.length < 2) {
    additional.push({
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
      hashtags: generateHashtags(day, QuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD)
    });
  }
  
  // Fill remaining slots with RECALL if needed
  while (additional.length < 2 && recallCount + additional.length < 5) {
    additional.push({
      question: `Mi a következménye, ha a(z) "${title}" leckében tanultakat nem alkalmazod?`,
      options: [
        'Csökkent idézhetőség, rossz AI ajánlások, alacsonyabb konverzió',
        'Nincs következmény',
        'Csak design gond',
        'Csak SEO büntetés'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuestionType.RECALL,
      hashtags: generateHashtags(day, QuestionType.RECALL, QuestionDifficulty.MEDIUM)
    });
  }
  
  return additional.slice(0, 2); // Ensure max 2 additional
}

async function fixAllQuestionsUsingBatchAPI() {
  try {
    await connectDB();
    console.log(`🔧 FIXING ALL QUESTIONS FOR: ${COURSE_ID} USING BATCH API\n`);
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

    // For now, we'll need to manually process each lesson
    // The seed file has questions but we need to extract and enhance them
    // This is a placeholder - we need to actually read the seed file structure
    
    console.log('⚠️  This script needs to be enhanced to:');
    console.log('   1. Extract questions from seed-geo-shopify-course.ts');
    console.log('   2. Enhance with proper metadata (questionType, hashtags)');
    console.log('   3. Expand to 7 questions per lesson');
    console.log('   4. Use batch API to create them\n');
    
    console.log('📋 Next steps:');
    console.log('   - Parse seed file question structure');
    console.log('   - Map to proper format with metadata');
    console.log('   - Use /api/admin/questions/batch to create\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAllQuestionsUsingBatchAPI();
