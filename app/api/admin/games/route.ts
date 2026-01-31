/**
 * Admin Games API
 *
 * What: List all games (including inactive) for admin management
 * Why: Admin games page needs to see and toggle isActive for every game
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Game } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/games
 *
 * Returns all games (no isActive filter). Admin only.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const games = await Game.find({})
      .select('gameId name description type isActive isPremium isAssessment thumbnail createdAt updatedAt')
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      games,
      count: games.length,
    });
  } catch (error) {
    logger.error({ error }, 'Admin: failed to fetch games');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
