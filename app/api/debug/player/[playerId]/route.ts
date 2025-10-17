import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import {
  Player,
  PlayerProgression,
  PointsWallet,
  PlayerSession,
} from '@/lib/models';

/**
 * GET /api/debug/player/[playerId]
 * 
 * Why: Debug endpoint to see raw database values
 * What: Returns unprocessed database documents for troubleshooting
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ playerId: string }> }
) {
  try {
    const params = await props.params;
    const { playerId } = params;

    await connectToDatabase();

    const [player, progression, wallet, recentSessions] = await Promise.all([
      Player.findById(playerId).lean(),
      PlayerProgression.findOne({ playerId }).lean(),
      PointsWallet.findOne({ playerId }).lean(),
      PlayerSession.find({ playerId, status: 'completed' })
        .sort({ sessionEnd: -1 })
        .limit(5)
        .lean(),
    ]);

    return NextResponse.json(
      {
        debug: true,
        timestamp: new Date().toISOString(),
        player: player || 'NOT_FOUND',
        progression: progression || 'NOT_FOUND',
        wallet: wallet || 'NOT_FOUND',
        recentSessions: recentSessions.map(s => ({
          id: s._id,
          gameId: s.gameId,
          outcome: s.gameData?.outcome,
          score: s.gameData?.score,
          pointsEarned: s.rewards?.pointsEarned,
          xpEarned: s.rewards?.xpEarned,
          sessionEnd: s.sessionEnd,
          status: s.status,
        })),
        sessionCount: recentSessions.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug failed', details: String(error) },
      { status: 500 }
    );
  }
}
