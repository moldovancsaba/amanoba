/**
 * Extract and Enhance Seed File Questions
 * 
 * Purpose: Extract questions from seed-geo-shopify-course.ts, enhance with metadata,
 * expand to 7 per lesson, and create using batch API
 * 
 * This script processes the seed file's existing good questions and enhances them
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

// Import seed file questions - we'll need to parse the seed file structure
// For now, this is a framework that will be enhanced

/**
 * Determine questionType from question content
 */
function determineQuestionType(question: string, difficulty: QuestionDifficulty): QuestionType {
  const qLower = question.toLowerCase();
  
  // Critical thinking indicators
  if (difficulty === QuestionDifficulty.HARD && (
    qLower.includes('miért') || 
    qLower.includes('hogyan befolyásol') ||
    qLower.includes('kockázat') ||
    qLower.includes('következmény') ||
    qLower.includes('járul hozzá')
  )) {
    return QuestionType.CRITICAL_THINKING;
  }
  
  // Application indicators
  if (qLower.includes('hogyan') || 
      qLower.includes('mit tegyél') ||
      qLower.includes('alkalmaz') ||
      qLower.includes('ellenőriz') ||
      qLower.includes('készíts') ||
      qLower.includes('végezz') ||
      qLower.includes('audit')) {
    return QuestionType.APPLICATION;
  }
  
  // Default to RECALL
  return QuestionType.RECALL;
}

/**
 * Generate hashtags for a question
 */
function generateHashtags(day: number, questionType: QuestionType, difficulty: QuestionDifficulty, language: string): string[] {
  const hashtags: string[] = [`#day${day}`, `#${language}`, '#all-languages', '#geo-shopify'];
  
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
 * Enhance a question from seed file with proper metadata
 */
function enhanceQuestion(
  seedQuestion: any,
  day: number,
  language: string
): {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
} {
  const questionType = determineQuestionType(seedQuestion.question, seedQuestion.difficulty);
  const hashtags = generateHashtags(day, questionType, seedQuestion.difficulty, language);
  
  return {
    question: seedQuestion.question,
    options: seedQuestion.options as [string, string, string, string],
    correctIndex: seedQuestion.correctIndex as 0 | 1 | 2 | 3,
    difficulty: seedQuestion.difficulty,
    category: seedQuestion.category || 'Course Specific',
    questionType,
    hashtags,
  };
}

/**
 * Add 2 additional questions to reach 7 per lesson
 */
function generateAdditionalQuestions(
  day: number,
  title: string,
  content: string,
  existingQuestions: any[],
  language: string
): Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}> {
  const additional: any[] = [];
  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // Count existing types
  const recallCount = existingQuestions.filter(q => q.questionType === QuestionType.RECALL).length;
  const appCount = existingQuestions.filter(q => q.questionType === QuestionType.APPLICATION).length;
  const criticalCount = existingQuestions.filter(q => q.questionType === QuestionType.CRITICAL_THINKING).length;
  
  // We need 4-5 RECALL, 2-3 APPLICATION, 0-1 CRITICAL_THINKING
  
  // Add 1 APPLICATION if needed
  if (appCount < 2) {
    if (language === 'hu') {
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
        hashtags: generateHashtags(day, QuestionType.APPLICATION, QuestionDifficulty.MEDIUM, language)
      });
    }
  }
  
  // Add 1 CRITICAL_THINKING if needed
  if (criticalCount === 0 && additional.length < 2) {
    if (language === 'hu') {
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
        hashtags: generateHashtags(day, QuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD, language)
      });
    }
  }
  
  // Fill remaining with RECALL if needed
  while (additional.length < 2 && recallCount + additional.length < 5) {
    if (language === 'hu') {
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
        hashtags: generateHashtags(day, QuestionType.RECALL, QuestionDifficulty.MEDIUM, language)
      });
    }
  }
  
  return additional.slice(0, 2);
}

async function extractAndEnhance() {
  try {
    await connectDB();
    console.log(`🔧 EXTRACTING AND ENHANCING SEED QUESTIONS FOR: ${COURSE_ID}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const course = await Course.findOne({ courseId: COURSE_ID });
    if (!course) {
      console.error(`❌ Course not found: ${COURSE_ID}`);
      process.exit(1);
    }

    console.log(`📖 Course: ${course.name}`);
    console.log(`   Language: ${course.language.toUpperCase()}\n`);

    // This script needs to:
    // 1. Parse seed-geo-shopify-course.ts to extract questions
    // 2. Enhance each with metadata
    // 3. Expand to 7 per lesson
    // 4. Use batch API to create
    
    console.log('⚠️  This script needs to parse the seed file structure');
    console.log('   and extract the existing good questions.\n');
    console.log('💡 Next step: Implement seed file parsing to extract questions\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

extractAndEnhance();
