/**
 * Process All Lessons - Systematic Question Generation
 * 
 * Purpose: Generate 7 perfect questions for ALL 446 lessons across ALL courses
 * Goal: Reach 3122 perfect questions (446 lessons × 7)
 * 
 * Strategy:
 * 1. Process courses one by one
 * 2. For each lesson, read full content
 * 3. Generate 7 context-rich, content-specific questions
 * 4. Use batch insert for performance
 * 
 * Quality Requirements (MANDATORY):
 * - Context-rich (not too short - minimum 40 characters, provide full context)
 * - 100% related to actual lesson content
 * - Educational (teaches, not just tests)
 * - Proper language match
 * - Good wrong answers (plausible, educational)
 * - Proper cognitive mix (4-5 RECALL, 2-3 APPLICATION, 0-1 CRITICAL_THINKING)
 * - Proper metadata (questionType, hashtags, difficulty)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';

/**
 * Generate 7 perfect questions based on actual lesson content
 * This function reads the lesson content and creates context-rich questions
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
  
  // This is a framework - each lesson needs specific question generation
  // based on actual content analysis
  // For now, return empty - will be implemented lesson by lesson
  
  return questions;
}

async function processAllLessons() {
  try {
    await connectDB();
    console.log(`🔧 SYSTEMATIC QUESTION GENERATION - ALL LESSONS\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const courses = await Course.find({ isActive: true }).sort({ name: 1 }).lean();
    
    console.log(`📖 Found ${courses.length} active courses\n`);

    let totalLessons = 0;
    let totalQuestionsCreated = 0;
    const totalQuestionsFixed = 0;
    const results: Array<{
      courseId: string;
      courseName: string;
      lessonsProcessed: number;
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
          q.question.includes('Mit ellenőriznél a(z)') ||
          q.question.includes('kulcsfontosságú koncepció')
        );

        if (needsQuestions || needsFix) {
          console.log(`   Day ${lesson.dayNumber}: ${lesson.title.substring(0, 50)}...`);
          console.log(`      Current: ${existingQuestions.length}/7 questions`);
          
          if (needsQuestions) {
            console.log(`      ⚠️  Needs ${7 - existingQuestions.length} more questions`);
          }
          if (needsFix) {
            const shortCount = existingQuestions.filter(q => q.question.length < 40).length;
            const genericCount = existingQuestions.filter(q => 
              q.question.includes('Mi a fő célja a(z)') ||
              q.question.includes('Mit ellenőriznél a(z)')
            ).length;
            console.log(`      ⚠️  Needs fixes: ${shortCount} too short, ${genericCount} generic`);
          }

          // Generate perfect questions
          const perfectQuestions = await generatePerfectQuestionsForLesson(lesson, course);
          
          if (perfectQuestions.length === 7) {
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
            console.log(`      ⚠️  Question generation returned ${perfectQuestions.length}/7 questions`);
            console.log(`      💡 Need to implement question generation for this lesson type`);
          }
        } else {
          console.log(`   Day ${lesson.dayNumber}: ✅ All 7 questions present and quality-checked`);
        }
      }

      results.push({
        courseId: course.courseId,
        courseName: course.name,
        lessonsProcessed: lessons.length,
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

processAllLessons();
