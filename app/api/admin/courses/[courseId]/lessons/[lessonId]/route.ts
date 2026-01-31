/**
 * Admin Lesson Detail API
 * 
 * What: REST endpoints for individual lesson operations
 * Why: Allows admins to get, update, and delete specific lessons
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';
import { resetVotesForLesson } from '@/lib/content-votes';
import mongoose from 'mongoose';

/**
 * GET /api/admin/courses/[courseId]/lessons/[lessonId]
 *
 * What: Get a specific lesson (admins and editors with course access)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();
    const { courseId, lessonId } = await params;

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

    return NextResponse.json({ success: true, lesson });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId }, 'Failed to fetch lesson');
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/courses/[courseId]/lessons/[lessonId]
 *
 * What: Update a specific lesson (admins and editors with course access)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();
    const { courseId, lessonId } = await params;

    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    const body = await request.json();

    // Handle assessmentGameId conversion if provided
    // If empty string, set to null/undefined to remove the assessment
    if (body.assessmentGameId === '' || body.assessmentGameId === null) {
      body.assessmentGameId = undefined;
    } else if (body.assessmentGameId && mongoose.Types.ObjectId.isValid(body.assessmentGameId)) {
      body.assessmentGameId = new mongoose.Types.ObjectId(body.assessmentGameId);
    } else if (body.assessmentGameId) {
      // Invalid ObjectId format
      return NextResponse.json(
        { error: 'Invalid assessmentGameId format' },
        { status: 400 }
      );
    }

    const lesson = await Lesson.findOneAndUpdate(
      { 
        courseId: course._id,
        lessonId 
      },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    try {
      await resetVotesForLesson(lesson, course._id as mongoose.Types.ObjectId);
    } catch (voteErr) {
      logger.warn({ error: voteErr, courseId, lessonId }, 'Vote reset on lesson update failed');
    }

    logger.info({ courseId, lessonId }, 'Admin updated lesson');

    return NextResponse.json({ success: true, lesson });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId }, 'Failed to update lesson');
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/courses/[courseId]/lessons/[lessonId]
 *
 * What: Delete a specific lesson (admins and editors with course access)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();
    const { courseId, lessonId } = await params;

    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    const lesson = await Lesson.findOneAndDelete({ 
      courseId: course._id,
      lessonId 
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    logger.info({ courseId, lessonId }, 'Admin deleted lesson');

    return NextResponse.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId }, 'Failed to delete lesson');
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
