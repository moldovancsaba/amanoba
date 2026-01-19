/**
 * Course Lessons API
 * 
 * What: REST endpoint to get all lessons for a course (for table of contents)
 * Why: Allows students to see what lessons are included in a course
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Course, Lesson } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/courses/[courseId]/lessons
 * 
 * What: Get all lessons for a course (public endpoint for table of contents)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await connectDB();
    const { courseId } = await params;

    // Find course
    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get all active lessons for this course, sorted by dayNumber
    const lessons = await Lesson.find({
      courseId: course._id,
      isActive: true,
    })
      .select('lessonId dayNumber title metadata.estimatedMinutes quizConfig')
      .sort({ dayNumber: 1 })
      .lean();

    logger.info({ courseId, lessonCount: lessons.length }, 'Fetched course lessons for table of contents');

    return NextResponse.json({
      success: true,
      lessons: lessons.map((lesson) => ({
        lessonId: lesson.lessonId,
        dayNumber: lesson.dayNumber,
        title: lesson.title,
        estimatedMinutes: lesson.metadata?.estimatedMinutes,
        hasQuiz: lesson.quizConfig?.enabled || false,
      })),
      count: lessons.length,
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to fetch course lessons');
    return NextResponse.json({ error: 'Failed to fetch course lessons' }, { status: 500 });
  }
}
