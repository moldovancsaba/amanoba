/**
 * QUIZZZ Questions Tracking API
 * 
 * What: POST endpoint that updates correctCount for answered questions
 * Why: Tracks question difficulty metrics for intelligent selection algorithm
 * 
 * Updates:
 * - Increments correctCount for correctly answered questions
 * - Enables Priority 2 sorting (harder questions get shown more)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/mongodb';
import { QuizQuestion } from '@/app/lib/models';
import logger from '@/app/lib/logger';

/**
 * Request Body Schema
 * Why: Type-safe validation of tracking data
 */
const TrackingSchema = z.object({
  questionIds: z.array(z.string()).min(1).max(50),
  correctAnswers: z.array(z.string()),
});

/**
 * POST /api/games/quizzz/questions/track
 * 
 * Body:
 * - questionIds: string[] - All question IDs shown in game
 * - correctAnswers: string[] - IDs of questions answered correctly
 * 
 * Returns: Success confirmation with update counts
 */
export async function POST(request: NextRequest) {
  try {
    // Why: Parse and validate request body
    const body = await request.json();
    const validation = TrackingSchema.safeParse(body);

    if (!validation.success) {
      logger.warn({ error: validation.error }, 'Invalid tracking data');
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'INVALID_BODY',
            message: 'Invalid tracking data',
            details: validation.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { questionIds, correctAnswers } = validation.data;

    // Why: Validate that correctAnswers are subset of questionIds
    const questionIdSet = new Set(questionIds);
    const invalidAnswers = correctAnswers.filter(id => !questionIdSet.has(id));
    
    if (invalidAnswers.length > 0) {
      logger.warn(
        { invalidAnswers, questionIds, correctAnswers }, 
        'Correct answers contain IDs not in question list'
      );
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'INVALID_ANSWER_IDS',
            message: 'Some correct answer IDs are not in the question list',
            details: { invalidAnswers },
          },
        },
        { status: 400 }
      );
    }

    // Why: Connect to database
    await connectDB();

    // Why: Filter out invalid ObjectIDs (fallback questions)
    // Only track real database questions to prevent CastError
    const validCorrectAnswers = correctAnswers.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validCorrectAnswers.length === 0) {
      // Why: No valid database questions to track (using fallback questions)
      logger.info(
        {
          totalQuestions: questionIds.length,
          correctCount: correctAnswers.length,
          validCount: 0,
          message: 'Skipped tracking - using fallback questions',
        },
        'Question tracking skipped (fallback mode)'
      );

      return NextResponse.json({
        ok: true,
        data: {
          tracked: {
            totalQuestions: questionIds.length,
            correctAnswers: correctAnswers.length,
            updatedCount: 0,
            fallbackMode: true,
          },
        },
      });
    }

    // Why: Use bulkWrite for efficient batch updates
    // Only increment correctCount for correctly answered questions
    const result = await QuizQuestion.bulkWrite(
      validCorrectAnswers.map(id => ({
        updateOne: {
          filter: { _id: id },
          update: { $inc: { correctCount: 1 } },
        },
      }))
    );

    logger.info(
      {
        totalQuestions: questionIds.length,
        correctCount: correctAnswers.length,
        validCount: validCorrectAnswers.length,
        accuracy: Math.round((correctAnswers.length / questionIds.length) * 100),
        modifiedCount: result.modifiedCount,
      },
      'Question tracking completed'
    );

    return NextResponse.json({
      ok: true,
      data: {
        tracked: {
          totalQuestions: questionIds.length,
          correctAnswers: validCorrectAnswers.length,
          updatedCount: result.modifiedCount,
        },
      },
    });
  } catch (error) {
    logger.error({ error }, 'Error tracking quiz questions');
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to track questions',
        },
      },
      { status: 500 }
    );
  }
}
