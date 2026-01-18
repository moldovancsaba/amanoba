/**
 * Admin Course Export API
 * 
 * What: Exports a complete course with all lessons and quiz questions to a JSON file
 * Why: Allows admins to backup and share complete courses
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/courses/[courseId]/export
 * 
 * What: Export a complete course to JSON
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId } = await params;

    // Find course
    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get brand info
    const brand = await Brand.findById(course.brandId).lean();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Get all lessons for this course
    const lessons = await Lesson.find({ courseId: course._id })
      .sort({ dayNumber: 1, displayOrder: 1 })
      .lean();

    // Get all quiz questions for this course
    const quizQuestions = await QuizQuestion.find({
      courseId: course._id,
      isCourseSpecific: true,
    }).lean();

    // Build export structure
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      exportedBy: session.user.email || 'admin',
      course: {
        courseId: course.courseId,
        name: course.name,
        description: course.description,
        language: course.language,
        thumbnail: course.thumbnail,
        durationDays: course.durationDays,
        isActive: course.isActive,
        requiresPremium: course.requiresPremium,
        pointsConfig: course.pointsConfig,
        xpConfig: course.xpConfig,
        metadata: course.metadata || {},
        // Convert translations Map to object if it exists
        translations: course.translations ? Object.fromEntries(course.translations) : {},
      },
      lessons: lessons.map((lesson) => {
        // Get quiz questions for this lesson
        const lessonQuestions = quizQuestions.filter(
          (q) => q.lessonId === lesson.lessonId
        );

        return {
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          language: lesson.language,
          title: lesson.title,
          content: lesson.content,
          emailSubject: lesson.emailSubject,
          emailBody: lesson.emailBody,
          quizConfig: lesson.quizConfig || null,
          unlockConditions: lesson.unlockConditions || {},
          pointsReward: lesson.pointsReward,
          xpReward: lesson.xpReward,
          isActive: lesson.isActive,
          displayOrder: lesson.displayOrder,
          metadata: lesson.metadata || {},
          // Convert translations Map to object if it exists
          translations: lesson.translations ? Object.fromEntries(lesson.translations) : {},
          quizQuestions: lessonQuestions.map((q) => ({
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            difficulty: q.difficulty,
            category: q.category,
            isActive: q.isActive,
            // Note: We don't export showCount, correctCount as they are usage stats
          })),
        };
      }),
    };

    logger.info({ courseId, lessonsCount: lessons.length, questionsCount: quizQuestions.length }, 'Admin exported course');

    // Return as JSON with proper headers for download
    return NextResponse.json(exportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${course.courseId}_export_${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to export course');
    return NextResponse.json({ error: 'Failed to export course' }, { status: 500 });
  }
}
