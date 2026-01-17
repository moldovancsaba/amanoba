/**
 * Games API
 * 
 * What: REST endpoint to list all available games
 * Why: Used by admin to select games for assessments
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/games
 * 
 * What: Get list of all games
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const games = await Game.find({ isActive: true })
      .select('gameId name description type isAssessment thumbnail')
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      games,
      count: games.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch games');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
