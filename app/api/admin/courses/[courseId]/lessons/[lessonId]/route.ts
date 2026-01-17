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
import mongoose from 'mongoose';

/**
 * GET /api/admin/courses/[courseId]/lessons/[lessonId]
 * 
 * What: Get a specific lesson
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, lessonId } = await params;

    // Find course by courseId to get its ObjectId
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

    return NextResponse.json({ success: true, lesson });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId }, 'Failed to fetch lesson');
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/courses/[courseId]/lessons/[lessonId]
 * 
 * What: Update a specific lesson
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, lessonId } = await params;
    const body = await request.json();

    // Handle assessmentGameId conversion if provided
    if (body.assessmentGameId) {
      body.assessmentGameId = new mongoose.Types.ObjectId(body.assessmentGameId);
    }

    // Find course by courseId to get its ObjectId
    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
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
 * What: Delete a specific lesson
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, lessonId } = await params;

    // Find course by courseId to get its ObjectId
    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
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
