/**
 * Lesson Quiz Submit API
 * 
 * What: Submit quiz answers and get results
 * Why: Allows students to take quizzes and get immediate feedback
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '@/lib/models';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';

/**
 * POST /api/courses/[courseId]/lessons/[lessonId]/quiz/submit
 * 
 * What: Submit quiz answers and calculate results
 */
export async function POST(
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

    // Find course and lesson
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const lesson = await Lesson.findOne({
      courseId: course._id,
      lessonId,
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Check if quiz is enabled
    if (!lesson.quizConfig?.enabled) {
      return NextResponse.json(
        { error: 'Quiz is not enabled for this lesson' },
        { status: 400 }
      );
    }

    const { answers } = body; // Array of { questionId, selectedIndex }

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    // Fetch questions to verify answers
    const questionIds = answers.map((a: { questionId: string }) => a.questionId);
    const questions = await QuizQuestion.find({
      _id: { $in: questionIds.map((id: string) => new mongoose.Types.ObjectId(id)) },
      lessonId,
      courseId: course._id,
      isCourseSpecific: true,
      isActive: true,
    }).lean();

    if (questions.length !== answers.length) {
      return NextResponse.json(
        { error: 'Some questions not found' },
        { status: 400 }
      );
    }

    // Calculate score
    let correct = 0;
    const results = answers.map((answer: { questionId: string; selectedIndex: number }) => {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (!question) return null;

      const isCorrect = question.correctIndex === answer.selectedIndex;
      if (isCorrect) correct++;

      return {
        questionId: answer.questionId,
        question: question.question,
        selectedIndex: answer.selectedIndex,
        correctIndex: question.correctIndex,
        isCorrect,
      };
    }).filter(Boolean);

    const total = answers.length;
    const score = correct;
    const percentage = Math.round((score / total) * 100);
    const threshold = lesson.quizConfig.successThreshold || 70;
    const passed = percentage >= threshold;

    // Update question statistics
    for (const result of results) {
      if (result) {
        await QuizQuestion.updateOne(
          { _id: new mongoose.Types.ObjectId(result.questionId) },
          {
            $inc: {
              showCount: 1,
              correctCount: result.isCorrect ? 1 : 0,
            },
            $set: {
              'metadata.lastShownAt': new Date(),
            },
          }
        );
      }
    }

    logger.info({
      courseId,
      lessonId,
      score,
      total,
      percentage,
      passed,
      threshold,
    }, 'Quiz submitted');

    return NextResponse.json({
      success: true,
      score,
      total,
      percentage,
      passed,
      threshold,
      results,
    });
  } catch (error) {
    logger.error(
      { error, courseId: (await params).courseId, lessonId: (await params).lessonId },
      'Failed to submit quiz'
    );
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
  }
}
