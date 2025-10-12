import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import { startGameSession } from '@/lib/gamification';
import { Player, Game } from '@/lib/models';

// Why: Validate incoming request data to ensure type safety and data integrity
// What: Zod schema for starting a new game session
const StartSessionSchema = z.object({
  playerId: z.string().min(1, 'Player ID is required'),
  gameId: z.string().min(1, 'Game ID is required'),
  brandId: z.string().min(1, 'Brand ID is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).optional(),
});

/**
 * POST /api/game-sessions/start
 * 
 * Why: Allow players to start a new game session with full gamification tracking
 * What: Creates a new game session and returns the session ID and initial state
 * 
 * Request Body:
 * - playerId: MongoDB ObjectId of the player
 * - gameId: MongoDB ObjectId of the game
 * - brandId: MongoDB ObjectId of the brand
 * - difficulty: Optional difficulty level
 * 
 * Response:
 * - sessionId: MongoDB ObjectId of the created session
 * - session: Full session object with player and game details
 * - availableFeatures: Progressive disclosure features available to the player
 */
export async function POST(request: NextRequest) {
  try {
    // Why: Parse and validate the request body
    const body = await request.json();
    const validatedData = StartSessionSchema.parse(body);

    // Why: Connect to database before any operations
    await connectToDatabase();

    // Why: Verify that the player and game exist
    const [player, game] = await Promise.all([
      Player.findById(validatedData.playerId),
      Game.findById(validatedData.gameId),
    ]);

    if (!player) {
      logger.warn({ playerId: validatedData.playerId }, 'Player not found');
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    if (!game) {
      logger.warn({ gameId: validatedData.gameId }, 'Game not found');
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Why: Use the session manager to handle all gamification logic
    const sessionId = await startGameSession({
      playerId: new mongoose.Types.ObjectId(validatedData.playerId),
      gameId: new mongoose.Types.ObjectId(validatedData.gameId),
      brandId: new mongoose.Types.ObjectId(validatedData.brandId),
    });

    logger.info(
      {
        sessionId,
        playerId: validatedData.playerId,
        gameId: validatedData.gameId,
      },
      'Game session started successfully'
    );

    return NextResponse.json(
      {
        success: true,
        sessionId: sessionId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    // Why: Handle validation errors separately for better error messages
    if (error instanceof z.ZodError) {
      logger.warn({ errors: error.issues }, 'Validation error starting session');
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    // Why: Log unexpected errors for debugging
    logger.error({ error }, 'Error starting game session');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
