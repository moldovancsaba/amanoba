/**
 * Admin Lesson Quiz Question Detail API
 * 
 * What: REST endpoints for individual quiz question operations
 * Why: Allows admins to update and delete specific quiz questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';

/**
 * PATCH /api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]
 *
 * What: Update a quiz question (admins and editors with course access)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string; questionId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();
    const { courseId, lessonId, questionId } = await params;
    const body = await request.json();

    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    const lesson = await Lesson.findOne({ 
      courseId: course._id,
      lessonId 
    }).lean();

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Find and update question
    const question = await QuizQuestion.findOneAndUpdate(
      {
        _id: questionId,
        lessonId,
        courseId: course._id,
        isCourseSpecific: true,
      },
      {
        $set: {
          ...body,
          'metadata.updatedAt': new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!question) {
      return NextResponse.json({ error: 'Quiz question not found' }, { status: 404 });
    }

    logger.info({ courseId, lessonId, questionId }, 'Admin updated lesson quiz question');

    return NextResponse.json({ success: true, question });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId, questionId: (await params).questionId }, 'Failed to update quiz question');
    return NextResponse.json({ error: 'Failed to update quiz question' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]
 *
 * What: Soft delete a quiz question (admins and editors with course access)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string; questionId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();
    const { courseId, lessonId, questionId } = await params;

    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    const lesson = await Lesson.findOne({ 
      courseId: course._id,
      lessonId 
    }).lean();

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Soft delete question (set isActive to false)
    const question = await QuizQuestion.findOneAndUpdate(
      {
        _id: questionId,
        lessonId,
        courseId: course._id,
        isCourseSpecific: true,
      },
      {
        $set: {
          isActive: false,
          'metadata.updatedAt': new Date(),
        },
      },
      { new: true }
    );

    if (!question) {
      return NextResponse.json({ error: 'Quiz question not found' }, { status: 404 });
    }

    logger.info({ courseId, lessonId, questionId }, 'Admin deactivated lesson quiz question');

    return NextResponse.json({ success: true, message: 'Quiz question deactivated' });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId, questionId: (await params).questionId }, 'Failed to deactivate quiz question');
    return NextResponse.json({ error: 'Failed to deactivate quiz question' }, { status: 500 });
  }
}
