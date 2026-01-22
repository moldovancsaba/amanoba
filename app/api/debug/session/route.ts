/**
 * Session Debug Endpoint
 * 
 * What: Returns current session data including role for debugging
 * Why: Help diagnose why admin roles are not appearing
 * 
 * GET /api/debug/session
 */

import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        message: 'Not authenticated',
      });
    }

    // Fetch player from database to compare
    await connectDB();
    const player = await Player.findById(session.user.id).lean();

    return NextResponse.json({
      authenticated: true,
      session: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role,
        authProvider: (session.user as any).authProvider,
        ssoSub: (session.user as any).ssoSub,
        isAnonymous: (session.user as any).isAnonymous,
        locale: (session.user as any).locale,
      },
      database: player ? {
        playerId: player._id,
        displayName: player.displayName,
        email: player.email,
        role: player.role,
        authProvider: player.authProvider,
        ssoSub: player.ssoSub,
        isAnonymous: player.isAnonymous,
        lastLoginAt: player.lastLoginAt,
      } : null,
      roleMatch: player ? (session.user as any).role === player.role : 'player_not_found',
      isAdmin: (session.user as any).role === 'admin',
      databaseIsAdmin: player?.role === 'admin',
    });
  } catch (error) {
    logger.error({ error }, 'Session debug endpoint failed');
    return NextResponse.json(
      {
        error: 'Failed to fetch session data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
