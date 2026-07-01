/**
 * Games API
 * 
 * What: REST endpoint to list all available games
 * Why: Used by admin to select games for assessments
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Game } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdminOrEditor } from '@/lib/rbac';

/**
 * GET /api/games
 *
 * What: Get list of all games (game catalog for admin/editor tooling).
 * Why: Only admin/editor surfaces consume this (achievement builder, course editor);
 *      gate it so internal game metadata is not publicly enumerable. (AUDIT-010)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const denied = await requireAdminOrEditor(request, session);
    if (denied) return denied;

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
