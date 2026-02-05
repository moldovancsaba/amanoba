/**
 * Lesson Quiz Submit API
 * 
 * What: Submit quiz answers and get results
 * Why: Allows students to take quizzes and get immediate feedback
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion, Player, CourseProgress } from '@/lib/models';
import { getCorrectAnswerString } from '@/app/lib/quiz-questions';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

/**
 * POST /api/courses/[courseId]/lessons/[lessonId]/quiz/submit
 * 
 * What: Submit quiz answers and calculate results
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  // Rate limiting: 100 requests per 15 minutes per IP
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

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
    }).lean();

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
    
    // Convert question IDs to ObjectIds, filtering out invalid ones
    const validQuestionIds = questionIds
      .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
      .map((id: string) => new mongoose.Types.ObjectId(id));
    
    if (validQuestionIds.length === 0) {
      logger.warn({ questionIds }, 'No valid question IDs provided');
      return NextResponse.json(
        { error: 'Invalid question IDs provided' },
        { status: 400 }
      );
    }
    
    // Find questions - match by ID and ensure they belong to this lesson/course
    const questions = await QuizQuestion.find({
      _id: { $in: validQuestionIds },
      lessonId: lessonId,
      courseId: course._id,
      isCourseSpecific: true,
      isActive: true,
    }).lean();
    
    logger.info({
      courseId,
      lessonId,
      requestedQuestionIds: questionIds.length,
      validQuestionIds: validQuestionIds.length,
      foundQuestions: questions.length,
    }, 'Quiz question lookup');

    if (questions.length !== answers.length) {
      logger.warn({
        courseId,
        lessonId,
        requestedCount: answers.length,
        foundCount: questions.length,
        questionIds: questionIds,
      }, 'Some questions not found when submitting quiz');
      return NextResponse.json(
        { 
          error: 'Some questions not found',
          errorCode: 'QUESTIONS_NOT_FOUND',
          details: {
            requested: answers.length,
            found: questions.length,
          }
        },
        { status: 400 }
      );
    }

    // Calculate score (grade by selected option value vs correct answer string; supports 3-option display)
    let correct = 0;
    const results = answers.map((answer: { questionId: string; selectedIndex?: number; selectedOption?: string }) => {
      const question = questions.find((q) => q._id.toString() === answer.questionId);
      if (!question) return null;

      const correctAnswerValue = getCorrectAnswerString(question);
      const selectedOptionValue =
        typeof (answer as { selectedOption?: string }).selectedOption === 'string'
          ? (answer as { selectedOption: string }).selectedOption?.trim()
          : Array.isArray(question.options) && typeof answer.selectedIndex === 'number'
            ? question.options[answer.selectedIndex]
            : undefined;
      const isCorrect =
        correctAnswerValue != null && selectedOptionValue != null
          ? selectedOptionValue === correctAnswerValue
          : false;
      if (isCorrect) correct++;

      return {
        questionId: answer.questionId,
        question: question.question,
        selectedIndex: answer.selectedIndex,
        isCorrect,
      };
    }).filter(Boolean);

    const total = answers.length;
    const score = correct;
    const wrongCount = total - correct;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const threshold = lesson.quizConfig.successThreshold ?? 70;
    const quizMaxWrongAllowed = (course as { quizMaxWrongAllowed?: number }).quizMaxWrongAllowed;
    const passed =
      typeof quizMaxWrongAllowed === 'number' && quizMaxWrongAllowed >= 0
        ? wrongCount <= quizMaxWrongAllowed
        : percentage >= threshold;

    // Track quiz completion in CourseProgress if passed
    if (passed && lesson.dayNumber) {
      try {
        const player = await Player.findOne({ email: session.user.email });
        if (player) {
          // Find course progress
          const progress = await CourseProgress.findOne({
            playerId: player._id,
            courseId: course._id,
          });

          if (progress) {
            const dayNumberStr = lesson.dayNumber.toString();
            
            // Only update if this quiz hasn't been completed yet
            // We use a simple marker ObjectId to track completion
            // Since AssessmentResult requires gameId/sessionId which quizzes don't have,
            // we'll use a placeholder ObjectId to mark completion
            const assessmentResults = progress.assessmentResults || new Map();
            if (!assessmentResults.has(dayNumberStr)) {
              // Create a placeholder ObjectId to mark quiz completion
              // This is a simple way to track without requiring full AssessmentResult
              const placeholderId = new mongoose.Types.ObjectId();
              assessmentResults.set(dayNumberStr, placeholderId);
              progress.assessmentResults = assessmentResults;
              await progress.save();
              
              logger.info({
                courseId,
                lessonId,
                dayNumber: lesson.dayNumber,
                playerId: (player as { _id: { toString(): string } })._id.toString(),
              }, 'Quiz completion tracked in CourseProgress');
            }
          }
        }
      } catch (progressError) {
        // Don't fail the quiz submission if progress tracking fails
        logger.warn({ error: progressError, courseId, lessonId }, 'Failed to track quiz completion in CourseProgress');
      }
    }

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
      wrongCount,
      percentage,
      passed,
      threshold,
      quizMaxWrongAllowed: (course as { quizMaxWrongAllowed?: number }).quizMaxWrongAllowed,
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
