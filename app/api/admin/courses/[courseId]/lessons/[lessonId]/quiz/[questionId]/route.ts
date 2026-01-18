/**
 * Admin Lesson Quiz Question Detail API
 * 
 * What: REST endpoints for individual quiz question operations
 * Why: Allows admins to update and delete specific quiz questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty } from '@/lib/models';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';

/**
 * PATCH /api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]
 * 
 * What: Update a quiz question
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string; questionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, lessonId, questionId } = await params;
    const body = await request.json();

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
 * What: Delete a quiz question
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string; questionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Delete question (soft delete by setting isActive to false)
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

    logger.info({ courseId, lessonId, questionId }, 'Admin deleted lesson quiz question');

    return NextResponse.json({ success: true, message: 'Quiz question deleted' });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId, questionId: (await params).questionId }, 'Failed to delete quiz question');
    return NextResponse.json({ error: 'Failed to delete quiz question' }, { status: 500 });
  }
}
