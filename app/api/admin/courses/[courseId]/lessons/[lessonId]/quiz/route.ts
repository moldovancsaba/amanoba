/**
 * Admin Lesson Quiz Questions API
 * 
 * What: REST endpoints for managing quiz questions for a specific lesson
 * Why: Allows admins to create, read, update, and delete quiz questions for lesson assessments
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';
import type { Session } from 'next-auth';
import { getEditorActorId } from './utils';
import { resolveCourseQuizPolicy } from '@/lib/course-quiz-policy';
import { validateQuestionAuthoringInput } from '@/lib/quiz-question-authoring';

/**
 * GET /api/admin/courses/[courseId]/lessons/[lessonId]/quiz
 *
 * What: Get all quiz questions for a lesson (admins and editors with course access)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = (await auth()) as Session | null;
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) return accessCheck;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Get all quiz questions for this lesson (both active and inactive)
    const questions = await QuizQuestion.find({
      lessonId,
      courseId: course._id,
      isCourseSpecific: true,
    })
      .sort({ isActive: -1, 'metadata.createdAt': 1 }) // Active questions first, then by creation date
      .lean();

    return NextResponse.json({ 
      success: true, 
      questions,
      count: questions.length,
      lesson: {
        lessonId: lesson.lessonId,
        // Compatibility-only lesson payload; admin clients should prefer courseQuizPolicy below.
        quizConfig: lesson.quizConfig,
      },
      courseQuizPolicy: resolveCourseQuizPolicy(course as Parameters<typeof resolveCourseQuizPolicy>[0]),
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId }, 'Failed to fetch lesson quiz questions');
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}

/**
 * POST /api/admin/courses/[courseId]/lessons/[lessonId]/quiz
 *
 * What: Create a new quiz question for a lesson (admins and editors with course access)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = (await auth()) as Session | null;
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) return accessCheck;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, lessonId } = await params;
    const body = await request.json();

    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    const courseDoc = await Course.findOne({ courseId });
    if (!courseDoc) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const lesson = await Lesson.findOne({ 
      courseId: courseDoc._id,
      lessonId 
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const {
      question,
      explanation,
      options,
      correctIndex,
      correctAnswer,
      wrongAnswers,
      difficulty = QuestionDifficulty.MEDIUM,
      category = 'General Knowledge',
    } = body;

    const courseQuizPolicy = resolveCourseQuizPolicy(course as Parameters<typeof resolveCourseQuizPolicy>[0]);

    const validation = validateQuestionAuthoringInput(
      {
        options,
        correctIndex,
        correctAnswer,
        wrongAnswers,
      },
      courseQuizPolicy.shownAnswerCount
    );
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!question) {
      return NextResponse.json({ error: 'Missing required field: question' }, { status: 400 });
    }

    const usesLegacyOptions =
      Array.isArray(options) &&
      options.filter((entry) => typeof entry === 'string' && entry.trim()).length >= 4 &&
      correctIndex !== undefined &&
      !(typeof correctAnswer === 'string' && correctAnswer.trim());

    // Create quiz question
    const actor = getEditorActorId(session);
    const quizQuestion = new QuizQuestion({
      question,
      explanation: typeof explanation === 'string' && explanation.trim().length > 0 ? explanation.trim() : undefined,
      options: usesLegacyOptions ? options : undefined,
      correctIndex: usesLegacyOptions ? correctIndex : undefined,
      correctAnswer: typeof correctAnswer === 'string' && correctAnswer.trim() ? correctAnswer.trim() : undefined,
      wrongAnswers: Array.isArray(wrongAnswers) ? wrongAnswers : undefined,
      difficulty: difficulty as QuestionDifficulty,
      category,
      lessonId,
      courseId: courseDoc._id,
      isCourseSpecific: true,
      showCount: 0,
      correctCount: 0,
      isActive: true,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: actor,
        updatedBy: actor,
      },
    });

    await quizQuestion.save();

    logger.info({ courseId, lessonId, questionId: quizQuestion._id }, 'Admin created lesson quiz question');

    return NextResponse.json({
      success: true,
      question: quizQuestion,
    }, { status: 201 });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId }, 'Failed to create quiz question');
    return NextResponse.json({ error: 'Failed to create quiz question' }, { status: 500 });
  }
}
