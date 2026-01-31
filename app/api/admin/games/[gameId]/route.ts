/**
 * Admin Game Update API
 *
 * What: Update a game (e.g. isActive) for admin management
 * Why: Admin games page needs to toggle game status
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
 * PATCH /api/admin/games/[gameId]
 *
 * Body: { isActive?: boolean }
 * Updates the game by gameId (unique string id). Admin only.
 */
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ gameId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    const { gameId } = await props.params;
    if (!gameId) {
      return NextResponse.json(
        { success: false, error: 'Game ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { isActive } = body as { isActive?: boolean };

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isActive (boolean) is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const game = await Game.findOneAndUpdate(
      { gameId: gameId.toUpperCase() },
      { $set: { isActive, updatedAt: new Date() } },
      { new: true }
    )
      .select('gameId name isActive updatedAt')
      .lean();

    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      );
    }

    logger.info({ gameId: game.gameId, isActive: game.isActive }, 'Admin: game status updated');

    return NextResponse.json({
      success: true,
      game: { gameId: game.gameId, name: game.name, isActive: game.isActive, updatedAt: game.updatedAt },
    });
  } catch (error) {
    logger.error({ error }, 'Admin: failed to update game');
    return NextResponse.json(
      { success: false, error: 'Failed to update game' },
      { status: 500 }
    );
  }
}
