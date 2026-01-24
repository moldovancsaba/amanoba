/**
 * Seed Productivity 2026 Course - Lessons 2-30
 * 
 * Creates lessons 2-30 for all 10 languages in batches:
 * - Process 2 languages at a time per lesson
 * - Seed after each batch
 * - Complete all languages for a lesson before moving to next
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Brand, Course, Lesson, QuizQuestion, QuestionDifficulty } from '../app/lib/models';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';
const LANGUAGES = ['hu', 'en', 'tr', 'bg', 'pl', 'vi', 'id', 'ar', 'pt', 'hi'];
const LANGUAGE_PAIRS = [
  ['hu', 'en'],
  ['tr', 'bg'],
  ['pl', 'vi'],
  ['id', 'ar'],
  ['pt', 'hi']
];

// Course names (from existing seed script)
const COURSE_NAMES: Record<string, string> = {
  hu: 'Termelékenység 2026: Hogyan kezelj csapatokat és időt',
  en: 'Productivity 2026: How to Manage Teams and Time',
  tr: 'Verimlilik 2026: Ekipler ve Zaman Nasıl Yönetilir',
  bg: 'Продуктивност 2026: Как да управляваме екипи и време',
  pl: 'Produktywność 2026: Jak zarządzać zespołami i czasem',
  vi: 'Năng suất 2026: Cách quản lý nhóm và thời gian',
  id: 'Produktivitas 2026: Cara Mengelola Tim dan Waktu',
  ar: 'الإنتاجية 2026: كيفية إدارة الفرق والوقت',
  pt: 'Produtividade 2026: Como Gerenciar Equipes e Tempo',
  hi: 'उत्पादकता 2026: टीमों और समय का प्रबंधन कैसे करें',
};

// Lesson plan from blueprint
interface LessonPlan {
  day: number;
  title: Record<string, string>;
  content: Record<string, string>;
  emailSubject: Record<string, string>;
  emailBody: Record<string, string>;
  quiz: Record<string, Array<{
    question: string;
    options: string[];
    correctIndex: number;
  }>>;
}

// This will be populated with lesson content
const LESSON_PLANS: LessonPlan[] = [];

// Function to generate lesson content for a specific day
function generateLessonContent(day: number, lang: string): {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
} {
  // This is a placeholder - in production, this would generate full content
  // For now, creating structured placeholders that can be filled
  const courseName = COURSE_NAMES[lang];
  const courseId = `${COURSE_ID_BASE}_${lang.toUpperCase()}`;
  
  // Base content structure - will be expanded with actual content
  const title = `Day ${day} - Lesson Title (${lang})`;
  const content = `<h1>Day ${day} Content</h1><p>Lesson content for day ${day} in ${lang}</p>`;
  const emailSubject = `${courseName} – Day ${day}`;
  const emailBody = `<h1>${courseName}</h1><h2>Day ${day}</h2><p>Your daily lesson is ready!</p><p><a href="{{APP_URL}}/${lang}/courses/${courseId}/day/${day}">Open lesson →</a></p>`;
  
  return { title, content, emailSubject, emailBody };
}

// Function to generate quiz questions for a specific day
function generateQuizQuestions(day: number, lang: string): Array<{
  question: string;
  options: string[];
  correctIndex: number;
}> {
  // Placeholder quiz - in production, this would generate proper questions
  return [
    {
      question: `Question 1 for Day ${day} (${lang})?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0
    },
    {
      question: `Question 2 for Day ${day} (${lang})?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 1
    },
    {
      question: `Question 3 for Day ${day} (${lang})?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 2
    },
    {
      question: `Question 4 for Day ${day} (${lang})?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0
    },
    {
      question: `Question 5 for Day ${day} (${lang})?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 1
    }
  ];
}

// Seed a lesson for specific languages
async function seedLessonForLanguages(
  day: number,
  languages: string[],
  brand: any,
  appUrl: string
) {
  for (const lang of languages) {
    const courseId = `${COURSE_ID_BASE}_${lang.toUpperCase()}`;
    const course = await Course.findOne({ courseId });
    
    if (!course) {
      console.log(`⚠️  Course ${courseId} not found, skipping...`);
      continue;
    }

    const lessonContent = generateLessonContent(day, lang);
    const lessonId = `${courseId}_DAY_${String(day).padStart(2, '0')}`;

    // Create/update lesson
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: day,
          language: lang,
          isActive: true,
          title: lessonContent.title,
          content: lessonContent.content,
          emailSubject: lessonContent.emailSubject.replace(/\{\{APP_URL\}\}/g, appUrl),
          emailBody: lessonContent.emailBody.replace(/\{\{APP_URL\}\}/g, appUrl),
          quizConfig: {
            enabled: true,
            successThreshold: 70,
            questionCount: 5,
            poolSize: 5,
            required: true
          },
          pointsReward: 50,
          xpReward: 25,
          metadata: {
            estimatedMinutes: 25,
            difficulty: 'medium'
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`  ✅ Lesson ${day} for ${lang} created/updated`);

    // Create quiz questions
    const quizQuestions = generateQuizQuestions(day, lang);
    for (const q of quizQuestions) {
      await QuizQuestion.findOneAndUpdate(
        {
          lessonId: lesson.lessonId,
          question: q.question
        },
        {
          $set: {
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            difficulty: QuestionDifficulty.MEDIUM,
            category: `Day ${day} - Productivity`,
            lessonId: lesson.lessonId,
            courseId: course._id,
            isCourseSpecific: true,
            isActive: true,
            showCount: 0,
            correctCount: 0,
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`  ✅ Quiz ${day} (${quizQuestions.length} questions) for ${lang} created/updated`);
  }
}

// Main seed function
async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  await connectDB();
  console.log('✅ Connected to MongoDB\n');

  // Get brand
  let brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    console.log('⚠️  Brand not found, creating...');
    brand = await Brand.create({
      name: 'Amanoba',
      slug: 'amanoba',
      displayName: 'Amanoba',
      description: 'Unified Learning Platform',
      logo: '/AMANOBA.png',
      themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
      allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
      supportedLanguages: LANGUAGES,
      defaultLanguage: 'hu',
      isActive: true
    });
  }

  // Process lessons 2-30
  for (let day = 2; day <= 30; day++) {
    console.log(`\n📚 Processing Lesson ${day}...`);
    
    // Process in batches of 2 languages
    for (const [pairIndex, pair] of LANGUAGE_PAIRS.entries()) {
      console.log(`  Batch ${pairIndex + 1}/5: ${pair.join(', ')}`);
      await seedLessonForLanguages(day, pair, brand, appUrl);
    }
    
    console.log(`✅ Lesson ${day} completed for all languages`);
  }

  console.log('\n✅ All lessons 2-30 seeded successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
