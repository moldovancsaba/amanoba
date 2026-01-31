/**
 * Comprehensive Question Fix - All Courses
 * 
 * Purpose: Systematically review and fix ALL questions for ALL courses
 * Goal: 7 perfect questions per lesson (3990+ total)
 * 
 * Process:
 * 1. For each course
 * 2. For each lesson
 * 3. Read lesson content
 * 4. Check existing questions
 * 5. Generate/fix to 7 perfect questions
 * 6. Use batch API to create/update
 * 
 * Quality Requirements:
 * - Context-rich (not too short)
 * - 100% related to lesson content
 * - Educational (teaches, not just tests)
 * - Proper language match
 * - Good wrong answers (plausible, educational)
 * - Proper metadata (questionType, hashtags, difficulty)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';

/**
 * Generate 7 perfect questions for a lesson based on its actual content
 * This is a placeholder - will be enhanced to read actual lesson content
 */
function generatePerfectQuestions(
  day: number,
  title: string,
  content: string,
  language: string,
  courseId: string
): Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}> {
  // This function needs to be implemented to read actual lesson content
  // and generate context-rich, content-specific questions
  // For now, return empty array - will be implemented lesson by lesson
  return [];
}

async function fixAllCourses() {
  try {
    await connectDB();
    console.log(`🔧 COMPREHENSIVE QUESTION FIX - ALL COURSES\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const courses = await Course.find({ isActive: true }).sort({ name: 1 }).lean();
    
    console.log(`📖 Found ${courses.length} active courses\n`);

    let totalLessons = 0;
    const totalFixed = 0;
    let totalCreated = 0;

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

      console.log(`   📝 Found ${lessons.length} lessons\n`);

      for (const lesson of lessons) {
        totalLessons++;
        
        const existingQuestions = await QuizQuestion.find({
          lessonId: lesson.lessonId,
          courseId: course._id,
          isCourseSpecific: true,
          isActive: true,
        }).lean();

        console.log(`   Day ${lesson.dayNumber}: ${lesson.title.substring(0, 50)}...`);
        console.log(`      Current: ${existingQuestions.length}/7 questions`);

        // Check if we need to generate questions
        if (existingQuestions.length < 7) {
          // Generate perfect questions based on lesson content
          const questions = generatePerfectQuestions(
            lesson.dayNumber,
            lesson.title,
            lesson.content || '',
            course.language,
            course.courseId
          );

          if (questions.length > 0) {
            // Delete existing if regenerating
            if (existingQuestions.length > 0) {
              await QuizQuestion.deleteMany({
                lessonId: lesson.lessonId,
                courseId: course._id,
                isCourseSpecific: true,
              });
            }

            // Create new questions
            const questionsToInsert = questions.map(q => ({
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
            console.log(`      ✅ Created ${questionsToInsert.length} questions`);
          } else {
            console.log(`      ⚠️  Question generation not implemented yet for this lesson`);
          }
        } else {
          // Check quality of existing questions
          const shortQuestions = existingQuestions.filter(q => q.question.length < 40);
          const missingType = existingQuestions.filter(q => !q.questionType);
          
          if (shortQuestions.length > 0 || missingType.length > 0) {
            console.log(`      ⚠️  Quality issues: ${shortQuestions.length} too short, ${missingType.length} missing type`);
            // TODO: Fix these questions
          } else {
            console.log(`      ✅ All 7 questions present`);
          }
        }
      }
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`📊 SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`✅ Courses processed: ${courses.length}`);
    console.log(`✅ Lessons processed: ${totalLessons}`);
    console.log(`✅ Questions created: ${totalCreated}`);
    console.log(`✅ Questions fixed: ${totalFixed}`);
    console.log(`\n💡 This is a framework - question generation needs to be implemented`);
    console.log(`   for each lesson type based on actual content\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAllCourses();
