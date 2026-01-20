/**
 * Admin Lesson Quiz Question Permanent Delete API
 * 
 * What: Permanently deletes an inactive quiz question
 * Why: Allows admins to permanently remove questions that have been deactivated
 * 
 * Note: This endpoint only works on inactive questions (isActive: false)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';

/**
 * DELETE /api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]/permanent
 * 
 * What: Permanently delete an inactive quiz question
 * Why: Allows admins to permanently remove deactivated questions
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string; questionId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { courseId, lessonId, questionId } = await params;

    // Find course and lesson
    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const lesson = await Lesson.findOne({ 
      courseId: course._id,
      lessonId 
    }).lean();

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Check if question exists and is inactive
    const question = await QuizQuestion.findOne({
      _id: questionId,
      lessonId,
      courseId: course._id,
      isCourseSpecific: true,
    }).lean();

    if (!question) {
      return NextResponse.json({ error: 'Quiz question not found' }, { status: 404 });
    }

    if (question.isActive) {
      return NextResponse.json(
        { error: 'Cannot permanently delete active questions. Please deactivate first.' },
        { status: 400 }
      );
    }

    // Permanently delete the question
    await QuizQuestion.findByIdAndDelete(questionId);

    logger.info({ courseId, lessonId, questionId }, 'Admin permanently deleted lesson quiz question');

    return NextResponse.json({ success: true, message: 'Quiz question permanently deleted' });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId, questionId: (await params).questionId }, 'Failed to permanently delete quiz question');
    return NextResponse.json({ error: 'Failed to permanently delete quiz question' }, { status: 500 });
  }
}
