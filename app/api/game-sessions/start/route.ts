import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose, { Document } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { startGameSession } from '@/lib/gamification';
import { Player, Game } from '@/lib/models';
import type { IGame } from '@/lib/models/game';

// Why: Validate incoming request data to ensure type safety and data integrity
// What: Zod schema for starting a new game session
const StartSessionSchema = z.object({
  playerId: z.string().min(1, 'Player ID is required'),
  gameId: z.string().min(1, 'Game ID or key is required'), // Accepts Game._id, Game.gameId (e.g., QUIZZZ), or route key (e.g., quizzz)
  brandId: z.string().optional(), // If omitted, derived from player.brandId
  difficulty: z.string().optional(), // Flexible difficulty string (EASY, MEDIUM, HARD, EXPERT, AI_LEVEL_1, etc.)
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

// Why: Verify that the player exists
    const player = await Player.findById(validatedData.playerId);

    if (!player) {
      logger.warn({ playerId: validatedData.playerId }, 'Player not found');
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Why: Resolve game by ObjectId, gameId (enum), or route key
    let game: (Document<unknown, object, IGame> & IGame & { _id: mongoose.Types.ObjectId }) | null = null;
    const rawGameId = validatedData.gameId;
    const isObjectId = mongoose.isValidObjectId(rawGameId);

    if (isObjectId) {
      game = await Game.findById(rawGameId);
    } else {
      const keyUpper = rawGameId.trim().toUpperCase();
      // Try by gameId, exact name, or case-insensitive name
      game = await Game.findOne({
        $or: [
          { gameId: keyUpper },
          { name: keyUpper },
          { name: { $regex: `^${keyUpper}$`, $options: 'i' } },
        ],
      });

      // Auto-create known games if missing (SUDOKU, MEMORY, MADOKU, QUIZZZ, WHACKPOP)
      if (!game && ['SUDOKU', 'MEMORY', 'MADOKU', 'QUIZZZ', 'WHACKPOP'].includes(keyUpper)) {
        const defaults: Record<string, {
          name: string;
          description: string;
          averageDurationSeconds: number;
          pointsConfig: Record<string, number>;
          xpConfig: Record<string, number>;
          difficultyLevels: string[];
        }> = {
          SUDOKU: {
            name: 'Sudoku',
            description: 'Number puzzle — complete the grid',
            averageDurationSeconds: 600,
            pointsConfig: { winPoints: 50, losePoints: 0, participationPoints: 5, perfectGameBonus: 50 },
            xpConfig: { winXP: 40, loseXP: 5, participationXP: 5 },
            difficultyLevels: ['easy','medium','hard','expert'],
          },
          MEMORY: {
            name: 'Memory Match',
            description: 'Flip cards to find matching pairs',
            averageDurationSeconds: 180,
            pointsConfig: { winPoints: 40, losePoints: 0, participationPoints: 5, perfectGameBonus: 30 },
            xpConfig: { winXP: 30, loseXP: 5, participationXP: 5 },
            difficultyLevels: ['EASY','MEDIUM','HARD','EXPERT'],
          },
          MADOKU: {
            name: 'Madoku',
            description: 'Competitive number-picking strategy game against AI',
            averageDurationSeconds: 240,
            pointsConfig: { winPoints: 60, losePoints: 10, participationPoints: 5, perfectGameBonus: 40 },
            xpConfig: { winXP: 50, loseXP: 10, participationXP: 5 },
            difficultyLevels: ['AI_LEVEL_1','AI_LEVEL_2','AI_LEVEL_3'],
          },
          QUIZZZ: {
            name: 'QUIZZZ',
            description: 'Rapid-fire trivia quiz',
            averageDurationSeconds: 180,
            pointsConfig: { winPoints: 45, losePoints: 5, participationPoints: 5, perfectGameBonus: 25 },
            xpConfig: { winXP: 35, loseXP: 5, participationXP: 5 },
            difficultyLevels: ['EASY','MEDIUM','HARD','EXPERT'],
          },
          WHACKPOP: {
            name: 'WHACKPOP',
            description: 'Fast-action target clicking game',
            averageDurationSeconds: 60,
            pointsConfig: { winPoints: 50, losePoints: 5, participationPoints: 5, perfectGameBonus: 20 },
            xpConfig: { winXP: 40, loseXP: 5, participationXP: 5 },
            difficultyLevels: ['EASY','MEDIUM','HARD','EXPERT'],
          },
        };

        const def = defaults[keyUpper];
        const createdGame = await Game.create({
          gameId: keyUpper,
          name: def.name,
          type: keyUpper,
          description: def.description,
          isActive: true,
          requiresAuth: true,
          isPremium: false,
          minPlayers: 1,
          maxPlayers: 1,
          averageDurationSeconds: def.averageDurationSeconds,
          pointsConfig: def.pointsConfig,
          xpConfig: def.xpConfig,
          difficultyLevels: def.difficultyLevels,
        });
        // Cast to correct type after creation
        game = createdGame as unknown as (Document<unknown, object, IGame> & IGame & { _id: mongoose.Types.ObjectId });
      }
    }

    if (!game) {
      logger.warn({ gameKey: validatedData.gameId }, 'Game not found');
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Why: Determine brandId (prefer request body, else player's brand, else fallback to first brand)
    let brandObjectId: mongoose.Types.ObjectId | null = null;
    if (validatedData.brandId && mongoose.isValidObjectId(validatedData.brandId)) {
      brandObjectId = new mongoose.Types.ObjectId(validatedData.brandId);
    } else if (player.brandId) {
      brandObjectId = player.brandId as mongoose.Types.ObjectId;
    } else {
      const { default: Brand } = await import('@/lib/models/brand');
      const fallbackBrand = await Brand.findOne({ isActive: true });
      if (!fallbackBrand) {
        return NextResponse.json({ error: 'No brand available' }, { status: 500 });
      }
      brandObjectId = fallbackBrand._id as mongoose.Types.ObjectId;
      // Persist brand to player for future sessions
      player.brandId = brandObjectId;
      await player.save();
    }

    // Why: Use the session manager to handle all gamification logic
    const sessionId = await startGameSession({
      playerId: new mongoose.Types.ObjectId(validatedData.playerId),
      gameId: (game._id as mongoose.Types.ObjectId),
      brandId: brandObjectId as mongoose.Types.ObjectId,
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
