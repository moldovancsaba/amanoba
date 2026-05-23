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
import type { Session } from 'next-auth';
import { quizEditableFields, getEditorActorId } from '../utils';
import { resolveCourseQuizPolicy } from '@/lib/course-quiz-policy';
import { validateQuestionAuthoringInput } from '@/lib/quiz-question-authoring';

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
    const session = (await auth()) as Session | null;
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

    const courseQuizPolicy = resolveCourseQuizPolicy(course as Parameters<typeof resolveCourseQuizPolicy>[0]);
    const body = (await request.json()) as Record<string, unknown>;
    const hasOwnProperty = (prop: string) => Object.prototype.hasOwnProperty.call(body, prop);
    const updatePayload: Record<string, unknown> = {};

    const mergedInput = {
      options: hasOwnProperty('options') ? (body.options as string[]) : undefined,
      correctIndex: hasOwnProperty('correctIndex') ? Number(body.correctIndex) : undefined,
      correctAnswer: hasOwnProperty('correctAnswer') ? String(body.correctAnswer) : undefined,
      wrongAnswers: hasOwnProperty('wrongAnswers') ? (body.wrongAnswers as string[]) : undefined,
    };
    if (
      hasOwnProperty('options') ||
      hasOwnProperty('correctIndex') ||
      hasOwnProperty('correctAnswer') ||
      hasOwnProperty('wrongAnswers')
    ) {
      const validation = validateQuestionAuthoringInput(mergedInput, courseQuizPolicy.shownAnswerCount);
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    if (hasOwnProperty('options')) {
      const options = body.options;
      if (!Array.isArray(options)) {
        return NextResponse.json({ error: 'options must be an array' }, { status: 400 });
      }
      if (!options.every((opt) => typeof opt === 'string' && opt.trim().length > 0)) {
        return NextResponse.json(
          { error: 'Each option must be a non-empty string' },
          { status: 400 }
        );
      }
      updatePayload.options = options;
    }

    if (hasOwnProperty('correctIndex')) {
      updatePayload.correctIndex = Number(body.correctIndex);
    }

    if (hasOwnProperty('correctAnswer')) {
      updatePayload.correctAnswer =
        typeof body.correctAnswer === 'string' && body.correctAnswer.trim()
          ? body.correctAnswer.trim()
          : undefined;
    }

    if (hasOwnProperty('wrongAnswers')) {
      updatePayload.wrongAnswers = Array.isArray(body.wrongAnswers) ? body.wrongAnswers : undefined;
    }

    for (const field of quizEditableFields) {
      if (field === 'options' || field === 'correctIndex' || field === 'correctAnswer' || field === 'wrongAnswers') {
        continue;
      }
      if (hasOwnProperty(field)) {
        updatePayload[field] =
          field === 'explanation' && typeof body[field] === 'string'
            ? body[field].trim() || undefined
            : body[field];
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 });
    }

    const lesson = await Lesson.findOne({ 
      courseId: course._id,
      lessonId 
    }).lean();

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Find and update question
    const actor = getEditorActorId(session);
    const question = await QuizQuestion.findOneAndUpdate(
      {
        _id: questionId,
        lessonId,
        courseId: course._id,
        isCourseSpecific: true,
      },
      {
        $set: {
          ...updatePayload,
          'metadata.updatedAt': new Date(),
          'metadata.updatedBy': actor,
        },
      },
      { new: true, runValidators: true }
    );

    if (!question) {
      return NextResponse.json({ error: 'Quiz question not found' }, { status: 404 });
    }

    logger.info({ courseId, lessonId, questionId, updatedBy: actor }, 'Admin updated lesson quiz question');

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
    const session = (await auth()) as Session | null;
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
    const actor = getEditorActorId(session);
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
          'metadata.updatedBy': actor,
        },
      },
      { new: true }
    );

    if (!question) {
      return NextResponse.json({ error: 'Quiz question not found' }, { status: 404 });
    }

    logger.info({ courseId, lessonId, questionId, updatedBy: actor }, 'Admin deactivated lesson quiz question');

    return NextResponse.json({ success: true, message: 'Quiz question deactivated' });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId, questionId: (await params).questionId }, 'Failed to deactivate quiz question');
    return NextResponse.json({ error: 'Failed to deactivate quiz question' }, { status: 500 });
  }
}
