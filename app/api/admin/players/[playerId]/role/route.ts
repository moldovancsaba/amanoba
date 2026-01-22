/**
 * Admin Player Role API
 *
 * What: Update a player's role (user/admin)
 * Why: Roles are managed locally in MongoDB; admins need a UI to change roles
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { checkRateLimit, adminRateLimiter } from '@/lib/security';
import { checkAdminAccess } from '@/lib/auth/admin';

type RoleUpdatePayload = {
  role?: 'user' | 'admin';
};

export async function PATCH(
  request: NextRequest,
  context: { params: { playerId: string } }
) {
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await checkAdminAccess(session, '/api/admin/players/[playerId]/role');
    if (adminCheck) {
      return adminCheck;
    }

    const { playerId } = context.params;
    if (!mongoose.isValidObjectId(playerId)) {
      return NextResponse.json({ error: 'Invalid player ID' }, { status: 400 });
    }

    const body = (await request.json()) as RoleUpdatePayload;
    const nextRole = body.role;
    if (nextRole !== 'user' && nextRole !== 'admin') {
      return NextResponse.json({ error: 'Invalid role value' }, { status: 400 });
    }

    await connectDB();
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const previousRole = player.role;
    player.role = nextRole;
    await player.save();

    logger.info(
      {
        playerId,
        previousRole,
        newRole: player.role,
        updatedBy: session.user.id,
      },
      'Admin role updated'
    );

    return NextResponse.json({
      success: true,
      playerId,
      role: player.role,
      previousRole,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to update player role');
    return NextResponse.json({ error: 'Failed to update player role' }, { status: 500 });
  }
}
