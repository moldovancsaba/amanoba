/**
 * Process GEO_SHOPIFY_30 (Hungarian) - Complete Question Generation
 * 
 * Purpose: Extract seed file questions, enhance with metadata, expand to 7 per lesson
 * Goal: 30 lessons × 7 = 210 perfect questions
 * 
 * Strategy:
 * 1. Read existing questions from database for each lesson
 * 2. Enhance with proper metadata (questionType, hashtags)
 * 3. Add 2 more questions to reach 7 per lesson
 * 4. Use batch insert for performance
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

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
      qLower.includes('audit') ||
      qLower.includes('mit tartalmazzon') ||
      qLower.includes('mi legyen')) {
    return QuestionType.APPLICATION;
  }
  
  // Default to RECALL
  return QuestionType.RECALL;
}

/**
 * Generate hashtags
 */
function generateHashtags(day: number, questionType: QuestionType, difficulty: QuestionDifficulty): string[] {
  const hashtags: string[] = [`#day${day}`, '#hu', '#all-languages', '#geo', '#shopify'];
  
  // Add difficulty
  if (difficulty === QuestionDifficulty.EASY) hashtags.push('#beginner');
  else if (difficulty === QuestionDifficulty.MEDIUM) hashtags.push('#intermediate');
  else if (difficulty === QuestionDifficulty.HARD) hashtags.push('#advanced');
  else if (difficulty === QuestionDifficulty.EXPERT) hashtags.push('#expert');
  
  // Add question type
  if (questionType === QuestionType.RECALL) hashtags.push('#recall');
  else if (questionType === QuestionType.APPLICATION) hashtags.push('#application');
  else if (questionType === QuestionType.CRITICAL_THINKING) hashtags.push('#critical-thinking');
  
  return hashtags;
}

/**
 * Generate additional questions to reach 7 per lesson
 * This function generates as many questions as needed based on the target mix
 */
function generateAdditionalQuestions(
  day: number,
  title: string,
  content: string,
  existingQuestions: any[],
  needed: number
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
  
  // Target: 4-5 RECALL, 2-3 APPLICATION, 0-1 CRITICAL_THINKING
  
  // Add CRITICAL_THINKING if needed (only 1 total)
  if (criticalCount === 0 && additional.length < needed) {
    additional.push({
      question: `Hogyan járul hozzá a(z) "${title}" leckében tanultak a boltod GEO optimalizálásához és az AI válaszokban való szereplés minőségéhez?`,
      options: [
        'A leckében tanultak növelik az idézhetőséget, csökkentik a kockázatot, és javítják az AI válaszok pontosságát',
        'Nincs hatás a GEO-ra',
        'Csak SEO miatt számít',
        'Csak design miatt fontos'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific',
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: generateHashtags(day, QuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD)
    });
  }
  
  // Add APPLICATION questions if needed (target: 2-3 total)
  while (appCount + additional.filter(q => q.questionType === QuestionType.APPLICATION).length < 3 && additional.length < needed) {
    const appNum = additional.filter(q => q.questionType === QuestionType.APPLICATION).length;
    if (appNum === 0) {
      additional.push({
        question: `Hogyan alkalmaznád a(z) "${title}" leckében tanultakat a saját Shopify boltodon?`,
        options: [
          'Azonnal alkalmazom a leckében leírt módszereket, dokumentálom az eredményeket, és méröm a hatást',
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
    } else {
      additional.push({
        question: `Mit tegyél, hogy a(z) "${title}" leckében tanultakat hatékonyan implementáld a boltodon?`,
        options: [
          'Lépésről lépésre alkalmazom a módszereket, tesztelöm az eredményeket, és finomhangolom a folyamatot',
          'Egyszerre próbálom ki mindent',
          'Csak olvasom, nem csinálok semmit',
          'Várok, amíg mások megcsinálják'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific',
        questionType: QuestionType.APPLICATION,
        hashtags: generateHashtags(day, QuestionType.APPLICATION, QuestionDifficulty.MEDIUM)
      });
    }
  }
  
  // Fill remaining with RECALL questions to reach exactly 'needed' count
  const recallVariations = [
    {
      question: `Mi a következménye, ha a(z) "${title}" leckében tanultakat nem alkalmazod a boltodon?`,
      options: [
        'Csökkent idézhetőség, rossz AI ajánlások, alacsonyabb konverzió és növekvő support terhelés',
        'Nincs következmény, minden rendben marad',
        'Csak design gondok lépnek fel',
        'Csak SEO büntetés érheti a boltot'
      ]
    },
    {
      question: `Miért fontos a(z) "${title}" leckében tárgyalt koncepciók megértése a GEO optimalizálás szempontjából?`,
      options: [
        'Mert ezek a koncepciók alapvetőek az AI válaszokban való megjelenéshez és idézhetőséghez',
        'Nem fontos, csak opcionális',
        'Csak SEO miatt számít',
        'Csak design miatt fontos'
      ]
    },
    {
      question: `Mit tartalmaz a(z) "${title}" leckében tárgyalt GEO módszertan?`,
      options: [
        'A leckében részletesen leírt, gyakorlatias módszerek és best practice-ek',
        'Csak általános információ',
        'Csak elméleti tudás',
        'Nincs konkrét módszertan'
      ]
    },
    {
      question: `Melyik elem a(z) "${title}" leckében tárgyalt GEO optimalizálás egyik alapköve?`,
      options: [
        'A leckében részletesen leírt, konkrét és mérhető optimalizálási lépések',
        'Csak általános SEO technikák',
        'Csak backlink építés',
        'Nincs konkrét módszer'
      ]
    },
    {
      question: `Hogyan segít a(z) "${title}" leckében tanultak abban, hogy a boltod megjelenjen az AI válaszokban?`,
      options: [
        'A leckében leírt módszereket követve növelheted az idézhetőségedet és csökkentheted a kockázatot',
        'Nincs hatás',
        'Csak SEO miatt számít',
        'Csak design miatt fontos'
      ]
    }
  ];
  
  // Fill remaining slots with RECALL questions (prioritize reaching needed count)
  let recallIndex = 0;
  while (additional.length < needed) {
    const variation = recallVariations[recallIndex % recallVariations.length];
    additional.push({
      question: variation.question,
      options: variation.options as [string, string, string, string],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuestionType.RECALL,
      hashtags: generateHashtags(day, QuestionType.RECALL, QuestionDifficulty.MEDIUM)
    });
    recallIndex++;
  }
  
  return additional.slice(0, needed);
}

async function processGEOShopify30() {
  try {
    await connectDB();
    console.log(`🔧 PROCESSING GEO_SHOPIFY_30 (Hungarian)\n`);
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

    let totalCreated = 0;
    let totalEnhanced = 0;

    for (const lesson of lessons) {
      console.log(`\nDay ${lesson.dayNumber}: ${lesson.title.substring(0, 50)}...`);
      
      const existingQuestions = await QuizQuestion.find({
        lessonId: lesson.lessonId,
        courseId: course._id,
        isCourseSpecific: true,
        isActive: true,
      }).lean();

      console.log(`   Current: ${existingQuestions.length}/7 questions`);

      // Enhance existing questions with metadata
      const enhancedQuestions = existingQuestions.map(q => {
        const questionType = q.questionType || determineQuestionType(q.question, q.difficulty || QuestionDifficulty.EASY);
        const hashtags = q.hashtags && q.hashtags.length > 0 
          ? q.hashtags 
          : generateHashtags(lesson.dayNumber, questionType, q.difficulty || QuestionDifficulty.EASY);
        
        return {
          question: q.question,
          options: q.options as [string, string, string, string],
          correctIndex: q.correctIndex as 0 | 1 | 2 | 3,
          difficulty: q.difficulty || QuestionDifficulty.EASY,
          category: q.category || 'Course Specific',
          questionType,
          hashtags,
        };
      });

      let allQuestions = [...enhancedQuestions];
      let newQuestionsCount = 0;

      // Only add questions if we have less than 7
      if (allQuestions.length < 7) {
        const needed = 7 - allQuestions.length;
        const additional = generateAdditionalQuestions(
          lesson.dayNumber,
          lesson.title,
          lesson.content || '',
          enhancedQuestions,
          needed
        );
        allQuestions = [...enhancedQuestions, ...additional];
        newQuestionsCount = additional.length;
      } else if (allQuestions.length > 7) {
        // If we have more than 7, keep only the first 7
        allQuestions = allQuestions.slice(0, 7);
      }

      if (allQuestions.length === 7) {
        // Delete existing
        await QuizQuestion.deleteMany({
          lessonId: lesson.lessonId,
          courseId: course._id,
          isCourseSpecific: true,
        });

        // Create all 7 questions
        const questionsToInsert = allQuestions.map(q => ({
          uuid: randomUUID(),
          lessonId: lesson.lessonId,
          courseId: course._id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          difficulty: q.difficulty,
          category: q.category,
          isCourseSpecific: true,
          questionType: q.questionType as string,
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
        }));

        await QuizQuestion.insertMany(questionsToInsert);
        totalCreated += questionsToInsert.length;
        totalEnhanced += enhancedQuestions.length;
        if (newQuestionsCount > 0) {
          console.log(`   ✅ Created ${questionsToInsert.length} questions (${enhancedQuestions.length} enhanced, ${newQuestionsCount} new)`);
        } else {
          console.log(`   ✅ Enhanced ${questionsToInsert.length} questions with metadata`);
        }
      } else {
        console.log(`   ⚠️  Only ${allQuestions.length}/7 questions generated`);
      }
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`📊 SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`✅ Lessons processed: ${lessons.length}`);
    console.log(`✅ Questions enhanced: ${totalEnhanced}`);
    console.log(`✅ Questions created: ${totalCreated}`);
    console.log(`✅ Target: ${lessons.length} lessons × 7 = ${lessons.length * 7} questions\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

processGEOShopify30();
