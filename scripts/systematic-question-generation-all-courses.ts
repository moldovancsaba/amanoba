/**
 * Systematic Question Generation - All Courses
 * 
 * Purpose: Generate 7 perfect questions for ALL 446 lessons
 * Goal: Reach 3122 perfect questions (446 lessons × 7)
 * 
 * Strategy:
 * 1. Process courses one by one
 * 2. For each lesson, read full content
 * 3. Generate 7 context-rich, content-specific questions
 * 4. Use batch API to create them
 * 
 * Quality Requirements:
 * - Context-rich (not too short)
 * - 100% related to lesson content
 * - Educational (teaches, not just tests)
 * - Proper language match
 * - Good wrong answers (plausible, educational)
 * - Proper cognitive mix (4-5 RECALL, 2-3 APPLICATION, 0-1 CRITICAL_THINKING)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';

/**
 * Generate 7 perfect questions based on actual lesson content
 * This reads the lesson content and creates context-rich, content-specific questions
 */
async function generatePerfectQuestionsForLesson(
  lesson: any,
  course: any
): Promise<Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> {
  const questions: Array<{
    question: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    difficulty: QuestionDifficulty;
    category: string;
    questionType: QuestionType;
    hashtags: string[];
  }> = [];

  const content = lesson.content || '';
  const title = lesson.title || '';
  const day = lesson.dayNumber || 0;
  const language = course.language || 'en';
  
  // Remove HTML tags for analysis
  const cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const contentLower = cleanContent.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // Extract key information from lesson
  const hasGEO = contentLower.includes('geo') || contentLower.includes('generatív');
  const hasSEO = contentLower.includes('seo') || contentLower.includes('keresőmotor');
  const hasShopify = contentLower.includes('shopify') || contentLower.includes('bolt');
  const hasAI = contentLower.includes('ai') || contentLower.includes('mesterséges');
  const hasProduct = contentLower.includes('termék') || contentLower.includes('product');
  const hasSchema = contentLower.includes('schema') || contentLower.includes('strukturált');
  const hasFeed = contentLower.includes('feed') || contentLower.includes('adatcsatorna');
  const hasPolicy = contentLower.includes('policy') || contentLower.includes('szabályzat');
  const hasPrice = contentLower.includes('ár') || contentLower.includes('price');
  const hasReview = contentLower.includes('review') || contentLower.includes('értékelés');
  const hasVariant = contentLower.includes('variáns') || contentLower.includes('variant');
  const hasSKU = contentLower.includes('sku');
  const hasGTIN = contentLower.includes('gtin');
  const hasImage = contentLower.includes('kép') || contentLower.includes('image');
  const hasVideo = contentLower.includes('videó') || contentLower.includes('video');
  const hasGuide = contentLower.includes('guide') || contentLower.includes('útmutató');
  const hasMeasurement = contentLower.includes('mérés') || contentLower.includes('measurement');
  
  // Determine language-specific question generation
  const isHungarian = language === 'hu';
  const isRussian = language === 'ru';
  const isEnglish = language === 'en' || (!isHungarian && !isRussian);
  
  // Generate questions based on actual lesson content
  // This is a framework - each lesson type needs specific question generation
  
  // For now, return empty array - this needs to be implemented
  // lesson by lesson based on actual content analysis
  
  return questions;
}

async function processAllCourses() {
  try {
    await connectDB();
    console.log(`🔧 SYSTEMATIC QUESTION GENERATION - ALL COURSES\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const courses = await Course.find({ isActive: true }).sort({ name: 1 }).lean();
    
    console.log(`📖 Found ${courses.length} active courses\n`);

    let totalLessons = 0;
    let totalQuestionsCreated = 0;
    const totalQuestionsFixed = 0;
    const courseStats: Array<{
      courseId: string;
      courseName: string;
      lessons: number;
      questionsCreated: number;
      questionsFixed: number;
    }> = [];

    for (const course of courses) {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`📚 Processing: ${course.name} (${course.courseId})`);
      console.log(`   Language: ${course.language.toUpperCase()}`);
      console.log(`${'═'.repeat(70)}\n`);

      const lessons = await Lesson.find({
        courseId: course._id,
        isActive: true,
      })
        .sort({ dayNumber: 1 })
        .lean();

      console.log(`   📝 Found ${lessons.length} lessons\n`);

      let courseQuestionsCreated = 0;
      const courseQuestionsFixed = 0;

      for (const lesson of lessons) {
        totalLessons++;
        
        const existingQuestions = await QuizQuestion.find({
          lessonId: lesson.lessonId,
          courseId: course._id,
          isCourseSpecific: true,
          isActive: true,
        }).lean();

        const needsQuestions = existingQuestions.length < 7;
        const needsFix = existingQuestions.some(q => 
          !q.questionType || 
          q.question.length < 40 ||
          q.question.includes('Mi a fő célja a(z)') ||
          q.question.includes('Mit ellenőriznél a(z)')
        );

        if (needsQuestions || needsFix) {
          console.log(`   Day ${lesson.dayNumber}: ${lesson.title.substring(0, 50)}...`);
          console.log(`      Current: ${existingQuestions.length}/7 questions`);
          
          if (needsQuestions) {
            console.log(`      ⚠️  Needs ${7 - existingQuestions.length} more questions`);
          }
          if (needsFix) {
            console.log(`      ⚠️  Needs quality fixes`);
          }

          // Generate perfect questions
          const perfectQuestions = await generatePerfectQuestionsForLesson(lesson, course);
          
          if (perfectQuestions.length > 0) {
            // Delete existing if regenerating
            if (existingQuestions.length > 0) {
              await QuizQuestion.deleteMany({
                lessonId: lesson.lessonId,
                courseId: course._id,
                isCourseSpecific: true,
              });
            }

            // Create new questions using batch insert
            const questionsToInsert = perfectQuestions.map(q => ({
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
            courseQuestionsCreated += questionsToInsert.length;
            totalQuestionsCreated += questionsToInsert.length;
            console.log(`      ✅ Created ${questionsToInsert.length} perfect questions`);
          } else {
            console.log(`      ⚠️  Question generation not yet implemented for this lesson type`);
          }
        }
      }

      courseStats.push({
        courseId: course.courseId,
        courseName: course.name,
        lessons: lessons.length,
        questionsCreated: courseQuestionsCreated,
        questionsFixed: courseQuestionsFixed,
      });
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`📊 FINAL SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`✅ Courses processed: ${courses.length}`);
    console.log(`✅ Lessons processed: ${totalLessons}`);
    console.log(`✅ Questions created: ${totalQuestionsCreated}`);
    console.log(`✅ Questions fixed: ${totalQuestionsFixed}`);
    console.log(`\n💡 Framework created - question generation needs to be implemented`);
    console.log(`   for each lesson type based on actual content analysis\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

processAllCourses();
