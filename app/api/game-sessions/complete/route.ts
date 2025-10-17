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
    
    // Why: Get actual game data to determine maxScore and other config
    const { Game } = await import('@/lib/models');
    const game = await Game.findById(session.gameId);
    
    if (!game) {
      logger.error({ gameId: session.gameId }, 'Game not found for session');
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }
    
    // Why: Determine maxScore based on game type and metadata
    // Different games have different scoring systems
    let maxScore = 1000; // Default fallback
    
    if (game.gameId === 'QUIZZZ') {
      // QUIZZZ: maxScore is always 100 per question
      // Frontend sends actual score (number of correct answers * 100)
      maxScore = validatedData.score <= 100 ? 100 : Math.ceil(validatedData.score / 100) * 100;
    } else if (game.gameId === 'WHACKPOP') {
      // WHACKPOP: Variable maxScore based on difficulty and duration
      maxScore = validatedData.metadata?.maxScore as number || 1000;
    } else if (game.gameId === 'MADOKU') {
      // MADOKU: Fixed maxScore
      maxScore = 500;
    } else if (game.gameId === 'SUDOKU') {
      // SUDOKU: Score based on time, maxScore is ideal completion
      maxScore = 1000;
    } else if (game.gameId === 'MEMORY') {
      // MEMORY: Score based on moves and time
      maxScore = 1000;
    } else if (game.metadata?.maxScore) {
      // Use game-specific maxScore from metadata if available
      maxScore = game.metadata.maxScore as number;
    }
    
    logger.info(
      { 
        gameId: game.gameId, 
        gameName: game.name,
        score: validatedData.score, 
        maxScore,
        outcome 
      }, 
      'Processing game completion with calculated maxScore'
    );
    
    // Why: Use the session manager to handle all reward calculations and updates
    const result = await completeGameSession({
      sessionId: new mongoose.Types.ObjectId(validatedData.sessionId),
      score: validatedData.score,
      maxScore, // Now using calculated maxScore per game type
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
