import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import { completeGameSession } from '@/lib/gamification';
import { PlayerSession } from '@/lib/models';

// Why: Validate incoming game completion data with comprehensive performance metrics
// What: Zod schema for completing a game session
const CompleteSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  score: z.number().min(0, 'Score must be non-negative'),
  isWin: z.boolean().optional(), // Optional if outcome is provided
  outcome: z.enum(['win', 'loss', 'draw']).optional(), // Accept explicit outcome
  duration: z.number().min(0, 'Duration must be non-negative'),
  moves: z.number().int().min(0).optional(),
  accuracy: z.number().min(0).max(100).optional(),
  hintsUsed: z.number().int().min(0).optional(),
  powerUpsUsed: z.number().int().min(0).optional(),
  difficulty: z.string().optional(), // Accept difficulty level
  metadata: z.record(z.string(), z.any()).optional(),
});

/**
 * POST /api/game-sessions/complete
 * 
 * Why: Process game completion with full gamification rewards (points, XP, achievements, streaks)
 * What: Completes a game session and returns all earned rewards and progression updates
 * 
 * Request Body:
 * - sessionId: MongoDB ObjectId of the session
 * - score: Player's final score
 * - isWin: Whether the player won
 * - duration: Session duration in seconds
 * - moves: Optional number of moves made
 * - accuracy: Optional accuracy percentage
 * - hintsUsed: Optional number of hints used
 * - powerUpsUsed: Optional number of power-ups used
 * - metadata: Optional additional game-specific data
 * 
 * Response:
 * - session: Updated session object
 * - rewards: Object containing earned points, XP, achievements, level-ups, and streaks
 * - newFeatures: Array of newly unlocked features via progressive disclosure
 */
export async function POST(request: NextRequest) {
  try {
    // Why: Parse and validate the request body
    const body = await request.json();
    const validatedData = CompleteSessionSchema.parse(body);

    // Why: Connect to database before any operations
    await connectToDatabase();

    // Why: Verify that the session exists and is still in progress
    const session = await PlayerSession.findById(validatedData.sessionId);

    if (!session) {
      logger.warn({ sessionId: validatedData.sessionId }, 'Session not found');
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (session.status !== 'in_progress') {
      logger.warn(
        { sessionId: validatedData.sessionId, status: session.status },
        'Session is not in progress'
      );
      return NextResponse.json(
        { error: 'Session is not in progress' },
        { status: 400 }
      );
    }

    // Why: Determine outcome from explicit outcome field or isWin boolean
    let outcome: 'win' | 'loss' | 'draw';
    if (validatedData.outcome) {
      outcome = validatedData.outcome;
    } else if (validatedData.isWin !== undefined) {
      outcome = validatedData.isWin ? 'win' : 'loss';
    } else {
      // Default to loss if neither provided
      outcome = 'loss';
    }
    
    // Why: Use the session manager to handle all reward calculations and updates
    const result = await completeGameSession({
      sessionId: new mongoose.Types.ObjectId(validatedData.sessionId),
      score: validatedData.score,
      maxScore: 1000, // TODO: Get from game config
      outcome,
      accuracy: validatedData.accuracy,
      moves: validatedData.moves,
      hints: validatedData.hintsUsed,
      difficulty: validatedData.difficulty,
      rawData: validatedData.metadata,
    });

    logger.info(
      {
        sessionId: validatedData.sessionId,
        playerId: session.playerId,
        isWin: validatedData.isWin,
        pointsEarned: result.rewards.points,
        xpEarned: result.rewards.xp,
        levelsGained: result.progression.levelsGained,
      },
      'Game session completed successfully'
    );

    return NextResponse.json(
      {
        success: true,
        sessionId: result.sessionId.toString(),
        rewards: result.rewards,
        progression: result.progression,
        achievements: result.achievements,
        streak: result.streak,
        newFeatures: result.newFeatures,
      },
      { status: 200 }
    );
  } catch (error) {
    // Why: Handle validation errors separately for better error messages
    if (error instanceof z.ZodError) {
      logger.warn({ errors: error.issues }, 'Validation error completing session');
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    // Why: Log unexpected errors for debugging
    logger.error({ error }, 'Error completing game session');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
