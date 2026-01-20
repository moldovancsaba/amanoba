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
import { requireAdmin } from '@/lib/rbac';

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
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { courseId } = await params;

    // Find course
    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get brand info (optional - export should work even if brand is missing)
    let brand = null;
    if (course.brandId) {
      try {
        brand = await Brand.findById(course.brandId).lean();
      } catch (error) {
        logger.warn({ courseId, brandId: course.brandId, error }, 'Failed to fetch brand for export, continuing without brand info');
      }
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

    // Helper function to safely convert Map to object
    const mapToObject = (map: any): Record<string, any> => {
      if (!map) return {};
      if (map instanceof Map) {
        return Object.fromEntries(map);
      }
      if (typeof map === 'object') {
        return map;
      }
      return {};
    };

    // Build export structure
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      exportedBy: session.user.email || 'admin',
      course: {
        courseId: course.courseId,
        name: course.name || '',
        description: course.description || '',
        language: course.language || 'hu',
        thumbnail: course.thumbnail || undefined,
        durationDays: course.durationDays || 30,
        isActive: course.isActive !== undefined ? course.isActive : true,
        requiresPremium: course.requiresPremium !== undefined ? course.requiresPremium : false,
        pointsConfig: course.pointsConfig || {
          completionPoints: 1000,
          lessonPoints: 50,
          perfectCourseBonus: 500,
        },
        xpConfig: course.xpConfig || {
          completionXP: 500,
          lessonXP: 25,
        },
        metadata: course.metadata || {},
        // Convert translations Map to object if it exists
        translations: mapToObject(course.translations),
      },
      lessons: lessons.map((lesson) => {
        // Get quiz questions for this lesson
        const lessonQuestions = quizQuestions.filter(
          (q) => q.lessonId === lesson.lessonId
        );

        return {
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber || 1,
          language: lesson.language || 'hu',
          title: lesson.title || '',
          content: lesson.content || '',
          emailSubject: lesson.emailSubject || '',
          emailBody: lesson.emailBody || '',
          quizConfig: lesson.quizConfig || null,
          unlockConditions: lesson.unlockConditions || {},
          pointsReward: lesson.pointsReward || 0,
          xpReward: lesson.xpReward || 0,
          isActive: lesson.isActive !== undefined ? lesson.isActive : true,
          displayOrder: lesson.displayOrder || lesson.dayNumber || 1,
          metadata: lesson.metadata || {},
          // Convert translations Map to object if it exists
          translations: mapToObject(lesson.translations),
          quizQuestions: lessonQuestions.map((q) => ({
            question: q.question || '',
            options: q.options || [],
            correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
            difficulty: q.difficulty || 'MEDIUM',
            category: q.category || 'Course Specific',
            isActive: q.isActive !== undefined ? q.isActive : true,
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
    const courseId = (await params).courseId;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ error, courseId, errorMessage }, 'Failed to export course');
    return NextResponse.json(
      { 
        error: 'Failed to export course',
        details: errorMessage,
        courseId 
      },
      { status: 500 }
    );
  }
}
