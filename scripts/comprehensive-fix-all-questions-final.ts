/**
 * Comprehensive Fix All Questions - Final Implementation
 * 
 * Purpose: Generate 7 perfect questions for ALL 446 lessons
 * Goal: Reach 3122 perfect questions (446 lessons × 7)
 * 
 * This script will:
 * 1. Process all courses systematically
 * 2. For each lesson, read content and generate 7 perfect questions
 * 3. Use batch insert for performance
 * 4. Ensure all questions are context-rich, content-specific, and educational
 * 
 * Quality Requirements (MANDATORY):
 * - Context-rich (minimum 40 chars, provide full context)
 * - 100% related to actual lesson content
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
 * Determine questionType from question content
 */
function determineQuestionType(question: string, difficulty: QuestionDifficulty): QuestionType {
  const qLower = question.toLowerCase();
  
  if (difficulty === QuestionDifficulty.HARD && (
    qLower.includes('miért') || 
    qLower.includes('hogyan befolyásol') ||
    qLower.includes('kockázat') ||
    qLower.includes('következmény') ||
    qLower.includes('járul hozzá') ||
    qLower.includes('why') ||
    qLower.includes('how does') ||
    qLower.includes('impact')
  )) {
    return QuestionType.CRITICAL_THINKING;
  }
  
  if (qLower.includes('hogyan') || 
      qLower.includes('mit tegyél') ||
      qLower.includes('alkalmaz') ||
      qLower.includes('ellenőriz') ||
      qLower.includes('készíts') ||
      qLower.includes('végezz') ||
      qLower.includes('audit') ||
      qLower.includes('how do') ||
      qLower.includes('how would') ||
      qLower.includes('what would you') ||
      qLower.includes('apply')) {
    return QuestionType.APPLICATION;
  }
  
  return QuestionType.RECALL;
}

/**
 * Generate hashtags
 */
function generateHashtags(day: number, questionType: QuestionType, difficulty: QuestionDifficulty, language: string, courseId: string): string[] {
  const hashtags: string[] = [`#day${day}`, `#${language}`, '#all-languages'];
  
  // Add course-specific hashtag
  if (courseId.includes('GEO')) hashtags.push('#geo');
  if (courseId.includes('SHOPIFY')) hashtags.push('#shopify');
  if (courseId.includes('PRODUCTIVITY')) hashtags.push('#productivity');
  if (courseId.includes('SALES')) hashtags.push('#sales');
  if (courseId.includes('AI')) hashtags.push('#ai');
  
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
 * Generate 7 perfect questions for a lesson
 * This is the core function that needs to be implemented for each lesson type
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
  const courseId = course.courseId || '';
  
  // This function needs to be implemented to read actual lesson content
  // and generate context-rich, content-specific questions
  // For now, return empty - will be implemented systematically
  
  return questions;
}

async function processAllCourses() {
  try {
    await connectDB();
    console.log(`🔧 COMPREHENSIVE QUESTION FIX - ALL COURSES\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const courses = await Course.find({ isActive: true }).sort({ name: 1 }).lean();
    
    console.log(`📖 Found ${courses.length} active courses\n`);

    let totalLessons = 0;
    let totalQuestionsCreated = 0;
    const totalQuestionsFixed = 0;

    for (const course of courses) {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`📚 Course: ${course.name} (${course.courseId})`);
      console.log(`   Language: ${course.language.toUpperCase()}`);
      console.log(`${'═'.repeat(70)}\n`);

      const lessons = await Lesson.find({
        courseId: course._id,
        isActive: true,
      })
        .sort({ dayNumber: 1 })
        .lean();

      console.log(`   📝 Processing ${lessons.length} lessons...\n`);

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
          q.question.includes('Mit ellenőriznél a(z)') ||
          q.question.includes('kulcsfontosságú koncepció')
        );

        if (needsQuestions || needsFix) {
          // Generate perfect questions
          const perfectQuestions = await generatePerfectQuestionsForLesson(lesson, course);
          
          if (perfectQuestions.length === 7) {
            // Delete existing
            if (existingQuestions.length > 0) {
              await QuizQuestion.deleteMany({
                lessonId: lesson.lessonId,
                courseId: course._id,
                isCourseSpecific: true,
              });
            }

            // Create new questions
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
            totalQuestionsCreated += questionsToInsert.length;
            console.log(`   ✅ Day ${lesson.dayNumber}: Created ${questionsToInsert.length} questions`);
          }
        }
      }
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`📊 SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`✅ Courses processed: ${courses.length}`);
    console.log(`✅ Lessons processed: ${totalLessons}`);
    console.log(`✅ Questions created: ${totalQuestionsCreated}`);
    console.log(`\n💡 Framework ready - question generation needs implementation\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

processAllCourses();
