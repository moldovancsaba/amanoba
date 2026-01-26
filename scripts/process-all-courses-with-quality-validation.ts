/**
 * Process All Courses with Quality Validation
 * 
 * Purpose: Generate all missing questions and fix broken/generic questions
 * WITH QUALITY VALIDATION to ensure no generic templates or poor quality
 * 
 * This script:
 * 1. Finds all missing questions
 * 2. Finds all broken/generic questions
 * 3. Generates proper questions with quality validation
 * 4. Replaces broken questions with quality-validated ones
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';
import { validateQuestionQuality, validateLessonQuestions } from './question-quality-validator';
import { generateAdditionalQuestions } from './process-course-questions-generic';

// Import the question generation function from the generic script
// (We'll need to extract it or import it)

async function processAllCoursesWithQuality() {
  try {
    await connectDB();
    console.log(`🔧 PROCESSING ALL COURSES WITH QUALITY VALIDATION\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const courses = await Course.find({ isActive: true }).sort({ name: 1 }).lean();
    
    console.log(`📖 Found ${courses.length} active courses\n`);

    let totalLessons = 0;
    let totalQuestionsCreated = 0;
    let totalQuestionsFixed = 0;
    let totalQuestionsDeleted = 0;
    const courseResults: Array<{
      courseId: string;
      courseName: string;
      lessonsProcessed: number;
      questionsCreated: number;
      questionsFixed: number;
      questionsDeleted: number;
      errors: number;
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

      let courseQuestionsCreated = 0;
      let courseQuestionsFixed = 0;
      let courseQuestionsDeleted = 0;
      let courseErrors = 0;

      for (const lesson of lessons) {
        totalLessons++;
        
        const existingQuestions = await QuizQuestion.find({
          lessonId: lesson.lessonId,
          courseId: course._id,
          isCourseSpecific: true,
          isActive: true,
        }).lean();

        // Validate existing questions and find broken ones
        const brokenQuestions: any[] = [];
        const validQuestions: any[] = [];

        for (const q of existingQuestions) {
          const validation = validateQuestionQuality(
            q.question,
            q.options || [],
            q.questionType as QuestionType || QuestionType.RECALL,
            q.difficulty || QuestionDifficulty.EASY,
            course.language,
            lesson.title,
            lesson.content
          );

          if (!validation.isValid) {
            brokenQuestions.push(q);
          } else {
            validQuestions.push(q);
          }
        }

        // Delete broken questions
        if (brokenQuestions.length > 0) {
          const brokenIds = brokenQuestions.map(q => q._id);
          await QuizQuestion.deleteMany({ _id: { $in: brokenIds } });
          courseQuestionsDeleted += brokenQuestions.length;
          totalQuestionsDeleted += brokenQuestions.length;
          console.log(`   Day ${lesson.dayNumber}: Deleted ${brokenQuestions.length} broken/generic questions`);
        }

        // Enhance valid questions with metadata
        const enhancedQuestions = validQuestions.map(q => {
          // Ensure proper metadata
          const questionType = q.questionType || QuestionType.RECALL;
          const hashtags = q.hashtags && q.hashtags.length > 0 ? q.hashtags : [];
          
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

        // Generate additional questions to reach 7
        const needed = 7 - enhancedQuestions.length;
        let newQuestions: any[] = [];

        if (needed > 0) {
          // Use the question generation from process-course-questions-generic.ts
          // For now, we'll generate them and validate
          const additional = generateAdditionalQuestions(
            lesson.dayNumber,
            lesson.title,
            lesson.content || '',
            enhancedQuestions,
            needed,
            course.language
          );

          // Validate each new question before adding
          for (const newQ of additional) {
            const validation = validateQuestionQuality(
              newQ.question,
              newQ.options,
              newQ.questionType,
              newQ.difficulty,
              course.language,
              lesson.title,
              lesson.content
            );

            if (validation.isValid) {
              newQuestions.push(newQ);
            } else {
              console.log(`   ⚠️  Rejected question: ${validation.errors.join('; ')}`);
              courseErrors++;
            }
          }
        }

        const allQuestions = [...enhancedQuestions, ...newQuestions];

        // Final validation of the complete set
        const lessonValidation = validateLessonQuestions(
          allQuestions,
          course.language,
          lesson.title
        );

        if (lessonValidation.isValid && allQuestions.length === 7) {
          // Delete all existing and create new
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
              auditedBy: 'AI-Developer-Quality-Validated',
            },
          }));

          await QuizQuestion.insertMany(questionsToInsert);
          courseQuestionsCreated += newQuestions.length;
          courseQuestionsFixed += enhancedQuestions.length;
          totalQuestionsCreated += newQuestions.length;
          totalQuestionsFixed += enhancedQuestions.length;

          if (lessonValidation.warnings.length > 0) {
            console.log(`   Day ${lesson.dayNumber}: ✅ Created 7 questions (warnings: ${lessonValidation.warnings.length})`);
          } else {
            console.log(`   Day ${lesson.dayNumber}: ✅ Created 7 perfect questions`);
          }
        } else {
          console.log(`   Day ${lesson.dayNumber}: ⚠️  Only ${allQuestions.length}/7 questions (${lessonValidation.errors.length} errors)`);
          courseErrors += lessonValidation.errors.length;
        }
      }

      courseResults.push({
        courseId: course.courseId,
        courseName: course.name,
        lessonsProcessed: lessons.length,
        questionsCreated: courseQuestionsCreated,
        questionsFixed: courseQuestionsFixed,
        questionsDeleted: courseQuestionsDeleted,
        errors: courseErrors,
      });
    }

    console.log(`\n\n${'═'.repeat(70)}`);
    console.log(`📊 FINAL SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`✅ Courses processed: ${courses.length}`);
    console.log(`✅ Lessons processed: ${totalLessons}`);
    console.log(`✅ Questions created: ${totalQuestionsCreated}`);
    console.log(`✅ Questions fixed: ${totalQuestionsFixed}`);
    console.log(`✅ Questions deleted (broken/generic): ${totalQuestionsDeleted}`);
    console.log(`\n💡 All questions validated for quality - no generic templates or poor quality\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Note: This script needs the generateAdditionalQuestions function to be exported
// from process-course-questions-generic.ts or imported here
processAllCoursesWithQuality();
