/**
 * Admin Course Import API
 * 
 * What: Imports a complete course from a JSON file
 * Why: Allows admins to restore or share complete courses
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
import { QuestionDifficulty } from '@/lib/models';

/**
 * POST /api/admin/courses/import
 * 
 * What: Import a complete course from JSON
 * Body: { courseData: {...}, overwrite: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { courseData, overwrite = false } = body;

    if (!courseData || !courseData.course) {
      return NextResponse.json({ error: 'Invalid course data' }, { status: 400 });
    }

    // Get default brand (amanoba)
    const brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const { course: courseInfo, lessons = [] } = courseData;
    const courseId = courseInfo.courseId;

    // Check if course exists
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse && !overwrite) {
      return NextResponse.json(
        { error: `Course ${courseId} already exists. Use overwrite=true to replace it.` },
        { status: 409 }
      );
    }

    // If overwrite, delete existing course data
    if (existingCourse && overwrite) {
      // Delete existing lessons
      await Lesson.deleteMany({ courseId: existingCourse._id });
      // Delete existing quiz questions
      await QuizQuestion.deleteMany({ courseId: existingCourse._id, isCourseSpecific: true });
      logger.info({ courseId }, 'Deleted existing course data for overwrite');
    }

    // Create or update course
    const course = await Course.findOneAndUpdate(
      { courseId },
      {
        $set: {
          courseId: courseInfo.courseId,
          name: courseInfo.name,
          description: courseInfo.description,
          language: courseInfo.language,
          thumbnail: courseInfo.thumbnail,
          durationDays: courseInfo.durationDays,
          isActive: courseInfo.isActive !== undefined ? courseInfo.isActive : true,
          requiresPremium: courseInfo.requiresPremium !== undefined ? courseInfo.requiresPremium : false,
          brandId: brand._id,
          pointsConfig: courseInfo.pointsConfig,
          xpConfig: courseInfo.xpConfig,
          metadata: courseInfo.metadata || {},
          // Convert translations object to Map if it exists
          translations: courseInfo.translations ? new Map(Object.entries(courseInfo.translations)) : new Map(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    logger.info({ courseId, overwrite }, 'Course created/updated during import');

    // Create/update lessons
    let lessonsCreated = 0;
    let lessonsUpdated = 0;
    let questionsCreated = 0;
    let questionsUpdated = 0;

    for (const lessonData of lessons) {
      const lesson = await Lesson.findOneAndUpdate(
        { lessonId: lessonData.lessonId },
        {
          $set: {
            lessonId: lessonData.lessonId,
            courseId: course._id,
            dayNumber: lessonData.dayNumber,
            language: lessonData.language,
            title: lessonData.title,
            content: lessonData.content,
            emailSubject: lessonData.emailSubject,
            emailBody: lessonData.emailBody,
            quizConfig: lessonData.quizConfig || null,
            unlockConditions: lessonData.unlockConditions || {},
            pointsReward: lessonData.pointsReward,
            xpReward: lessonData.xpReward,
            isActive: lessonData.isActive !== undefined ? lessonData.isActive : true,
            displayOrder: lessonData.displayOrder || lessonData.dayNumber,
            metadata: lessonData.metadata || {},
            // Convert translations object to Map if it exists
            translations: lessonData.translations ? new Map(Object.entries(lessonData.translations)) : new Map(),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (lesson.isNew) {
        lessonsCreated++;
      } else {
        lessonsUpdated++;
      }

      // Create/update quiz questions for this lesson
      const quizQuestions = lessonData.quizQuestions || [];
      for (const questionData of quizQuestions) {
        // Check if question already exists
        const existingQuestion = await QuizQuestion.findOne({
          lessonId: lessonData.lessonId,
          courseId: course._id,
          question: questionData.question,
        });

        if (existingQuestion) {
          // Update existing question
          await QuizQuestion.findOneAndUpdate(
            { _id: existingQuestion._id },
            {
              $set: {
                question: questionData.question,
                options: questionData.options,
                correctIndex: questionData.correctIndex,
                difficulty: questionData.difficulty as QuestionDifficulty,
                category: questionData.category,
                isActive: questionData.isActive !== undefined ? questionData.isActive : true,
                lessonId: lessonData.lessonId,
                courseId: course._id,
                isCourseSpecific: true,
                'metadata.updatedAt': new Date(),
              },
            }
          );
          questionsUpdated++;
        } else {
          // Create new question
          const quizQuestion = new QuizQuestion({
            question: questionData.question,
            options: questionData.options,
            correctIndex: questionData.correctIndex,
            difficulty: questionData.difficulty as QuestionDifficulty,
            category: questionData.category,
            isActive: questionData.isActive !== undefined ? questionData.isActive : true,
            lessonId: lessonData.lessonId,
            courseId: course._id,
            isCourseSpecific: true,
            showCount: 0,
            correctCount: 0,
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: session.user.email || 'import',
            },
          });
          await quizQuestion.save();
          questionsCreated++;
        }
      }
    }

    logger.info(
      {
        courseId,
        lessonsCreated,
        lessonsUpdated,
        questionsCreated,
        questionsUpdated,
        overwrite,
      },
      'Admin imported course'
    );

    return NextResponse.json({
      success: true,
      message: overwrite ? 'Course imported and overwritten' : 'Course imported',
      course: {
        courseId: course.courseId,
        name: course.name,
      },
      stats: {
        lessonsCreated,
        lessonsUpdated,
        questionsCreated,
        questionsUpdated,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to import course');
    return NextResponse.json({ error: 'Failed to import course', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
