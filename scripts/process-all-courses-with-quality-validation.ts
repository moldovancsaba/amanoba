/**
 * Process All Courses with Quality Validation
 *
 * Purpose: Generate all missing questions and fix broken/generic questions
 * WITH QUALITY VALIDATION to ensure no generic templates or poor quality.
 *
 * TINY LOOP: Each question is managed individually. Broken questions are replaced
 * one at a time (generate → validate → replace); missing slots are filled one at a time.
 * No batch delete/batch insert — quality is higher when each question is handled separately.
 *
 * This script:
 * 1. Finds broken/generic questions per lesson
 * 2. Replaces each broken question one at a time with a validated replacement
 * 3. Fills missing slots one at a time until 7 total (5 application, 2 critical)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';
import { validateQuestionQuality, validateLessonQuestions } from './question-quality-validator';
import { generateContentBasedQuestions } from './content-based-question-generator';

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

        const brokenQuestions: any[] = [];
        const validQuestions: any[] = [];
        for (const q of existingQuestions) {
          const validation = validateQuestionQuality(
            q.question ?? '',
            q.options || [],
            (q.questionType as QuestionType) || QuestionType.RECALL,
            (q.difficulty as QuestionDifficulty) || QuestionDifficulty.EASY,
            course.language,
            lesson.title ?? '',
            lesson.content ?? ''
          );
          if (!validation.isValid) brokenQuestions.push(q);
          else validQuestions.push(q);
        }

        const normalizeQuestionText = (text: string) =>
          String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
        const MAX_REPLACE_ATTEMPTS = 5;
        const MAX_FILL_ATTEMPTS_PER_SLOT = 10;
        const CANDIDATES_PER_ATTEMPT = 8;
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');

        const currentValid = [...validQuestions];
        const existingTextKeys = new Set<string>(currentValid.map(q => normalizeQuestionText(q.question ?? '')));
        let insertedCount = 0;
        let replacedCount = 0;

        // Phase 1: Replace each broken question one at a time.
        for (let i = 0; i < brokenQuestions.length; i++) {
          const invalidQ = brokenQuestions[i];
          const displayOrder = (invalidQ as any).displayOrder ?? currentValid.length + i + 1;
          let replaced = false;
          for (let attempt = 0; attempt < MAX_REPLACE_ATTEMPTS && !replaced; attempt++) {
            const candidates = generateContentBasedQuestions(
              lesson.dayNumber,
              lesson.title ?? '',
              lesson.content ?? '',
              course.language,
              course.courseId,
              currentValid,
              CANDIDATES_PER_ATTEMPT,
              { seed: `${course.courseId}::${lesson.lessonId}::replace${i}::${stamp}::a${attempt}` }
            );
            for (const q of candidates) {
              const v = validateQuestionQuality(
                q.question,
                q.options,
                q.questionType as any,
                q.difficulty as any,
                course.language,
                lesson.title ?? '',
                lesson.content ?? ''
              );
              if (!v.isValid) continue;
              const key = normalizeQuestionText(q.question);
              if (!key || existingTextKeys.has(key)) continue;
              await QuizQuestion.deleteOne({ _id: invalidQ._id });
              await QuizQuestion.insertMany([
                {
                  uuid: randomUUID(),
                  lessonId: lesson.lessonId,
                  courseId: course._id,
                  question: q.question,
                  options: q.options,
                  correctIndex: q.correctIndex,
                  difficulty: q.difficulty,
                  category: q.category ?? 'Course Specific',
                  isCourseSpecific: true,
                  questionType: q.questionType as string,
                  hashtags: q.hashtags,
                  isActive: true,
                  displayOrder,
                  showCount: 0,
                  correctCount: 0,
                  metadata: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    auditedAt: new Date(),
                    auditedBy: 'process-all-courses-tiny-loop',
                  },
                },
              ]);
              courseQuestionsDeleted += 1;
              totalQuestionsDeleted += 1;
              courseQuestionsCreated += 1;
              totalQuestionsCreated += 1;
              existingTextKeys.add(key);
              currentValid.push({ ...q, displayOrder, _id: null });
              replaced = true;
              replacedCount++;
              break;
            }
          }
          if (!replaced) {
            await QuizQuestion.deleteOne({ _id: invalidQ._id });
            courseQuestionsDeleted += 1;
            totalQuestionsDeleted += 1;
          }
        }

        // Phase 2: Fill missing slots one at a time (7 total, 5 application, 2 critical).
        let remainingNeededTotal = Math.max(0, 7 - currentValid.length);
        let remainingNeededApp = Math.max(0, 5 - currentValid.filter(q => q.questionType === 'application').length);
        let remainingNeededCritical = Math.max(0, 2 - currentValid.filter(q => q.questionType === 'critical-thinking').length);
        let nextDisplayOrder = Math.max(0, ...currentValid.map(q => (q as any).displayOrder ?? 0)) + 1;
        let fillAttempts = 0;
        const maxFillAttempts = (remainingNeededTotal + 2) * MAX_FILL_ATTEMPTS_PER_SLOT;

        while ((remainingNeededTotal > 0 || remainingNeededApp > 0 || remainingNeededCritical > 0) && fillAttempts < maxFillAttempts) {
          fillAttempts++;
          const preferApp = remainingNeededApp > 0;
          const preferCritical = !preferApp && remainingNeededCritical > 0;
          const candidates = generateContentBasedQuestions(
            lesson.dayNumber,
            lesson.title ?? '',
            lesson.content ?? '',
            course.language,
            course.courseId,
            currentValid,
            CANDIDATES_PER_ATTEMPT,
            { seed: `${course.courseId}::${lesson.lessonId}::fill::${stamp}::${fillAttempts}` }
          );
          let added = false;
          for (const q of candidates) {
            const v = validateQuestionQuality(
              q.question,
              q.options,
              q.questionType as any,
              q.difficulty as any,
              course.language,
              lesson.title ?? '',
              lesson.content ?? ''
            );
            if (!v.isValid) continue;
            const key = normalizeQuestionText(q.question);
            if (!key || existingTextKeys.has(key)) continue;
            if (preferApp && q.questionType !== 'application') continue;
            if (preferCritical && q.questionType !== 'critical-thinking') continue;
            await QuizQuestion.insertMany([
              {
                uuid: randomUUID(),
                lessonId: lesson.lessonId,
                courseId: course._id,
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                difficulty: q.difficulty,
                category: q.category ?? 'Course Specific',
                isCourseSpecific: true,
                questionType: q.questionType as string,
                hashtags: q.hashtags,
                isActive: true,
                displayOrder: nextDisplayOrder++,
                showCount: 0,
                correctCount: 0,
                metadata: {
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  auditedAt: new Date(),
                  auditedBy: 'process-all-courses-tiny-loop',
                },
              },
            ]);
            courseQuestionsCreated += 1;
            totalQuestionsCreated += 1;
            existingTextKeys.add(key);
            currentValid.push({ ...q, displayOrder: nextDisplayOrder - 1, _id: null });
            insertedCount++;
            if (q.questionType === 'application' && remainingNeededApp > 0) remainingNeededApp--;
            if (q.questionType === 'critical-thinking' && remainingNeededCritical > 0) remainingNeededCritical--;
            if (remainingNeededTotal > 0) remainingNeededTotal--;
            added = true;
            break;
          }
          if (!added) continue;
        }

        const allQuestions = currentValid.map(q => ({
          question: q.question,
          options: q.options,
          questionType: q.questionType,
          difficulty: q.difficulty,
          correctIndex: q.correctIndex,
        }));
        const lessonValidation = validateLessonQuestions(allQuestions as any, course.language, lesson.title ?? '');

        if (!lessonValidation.isValid) {
          console.log(`   Day ${lesson.dayNumber}: ⚠️  Validation issues (${lessonValidation.errors.length} errors)`);
          courseErrors += lessonValidation.errors.length;
        } else if (currentValid.length >= 7) {
          courseQuestionsFixed += validQuestions.length;
          totalQuestionsFixed += validQuestions.length;
          console.log(`   Day ${lesson.dayNumber}: ✅ Replaced ${replacedCount}, added ${insertedCount} (7 questions)`);
        } else {
          console.log(`   Day ${lesson.dayNumber}: ⚠️  Only ${currentValid.length}/7 questions`);
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

processAllCoursesWithQuality();
