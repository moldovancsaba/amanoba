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
import { requireAdmin } from '@/lib/rbac';
import mongoose from 'mongoose';

/**
 * GET /api/admin/courses/[courseId]/lessons/[lessonId]/quiz
 * 
 * What: Get all quiz questions for a lesson
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { courseId, lessonId } = await params;

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
        quizConfig: lesson.quizConfig,
      },
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, lessonId: (await params).lessonId }, 'Failed to fetch lesson quiz questions');
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}

/**
 * POST /api/admin/courses/[courseId]/lessons/[lessonId]/quiz
 * 
 * What: Create a new quiz question for a lesson
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { courseId, lessonId } = await params;
    const body = await request.json();

    // Find course and lesson
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const lesson = await Lesson.findOne({ 
      courseId: course._id,
      lessonId 
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const {
      question,
      options,
      correctIndex,
      difficulty = QuestionDifficulty.MEDIUM,
      category = 'General Knowledge',
    } = body;

    // Validate required fields
    if (!question || !options || correctIndex === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: question, options, correctIndex' },
        { status: 400 }
      );
    }

    // Validate options
    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json(
        { error: 'Must provide exactly 4 options' },
        { status: 400 }
      );
    }

    // Validate correctIndex
    if (correctIndex < 0 || correctIndex > 3) {
      return NextResponse.json(
        { error: 'correctIndex must be between 0 and 3' },
        { status: 400 }
      );
    }

    // Create quiz question
    const quizQuestion = new QuizQuestion({
      question,
      options,
      correctIndex,
      difficulty: difficulty as QuestionDifficulty,
      category,
      lessonId,
      courseId: course._id,
      isCourseSpecific: true,
      showCount: 0,
      correctCount: 0,
      isActive: true,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.email || session.user.id,
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
