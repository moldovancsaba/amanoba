import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PlayerProgression } from '@/lib/models';
import logger from '@/lib/logger';

/**
 * GET /api/players/[playerId]/rank
 *
 * What: Returns player's Madoku ELO, rank, percentile, and recommended Ghost tier
 * Why: Enables rank-based matchmaking and Ghost Chili auto-difficulty
 */
export async function GET(
  request: NextRequest,
  context: { params: { playerId: string } }
) {
  try {
    const { playerId } = context.params;
    await connectDB();

    // Fetch player's progression
    const progression = await PlayerProgression.findOne({ playerId });
    if (!progression) {
      return NextResponse.json({ error: 'Progression not found' }, { status: 404 });
    }

    const gameKey = 'MADOKU';
    const stats = (progression.gameSpecificStats as Map<string, unknown>).get?.(gameKey) as Record<string, unknown> || {};
    const elo: number = typeof stats.elo === 'number' ? stats.elo : 1200;

    // Total players with an ELO entry for Madoku
    const total = await PlayerProgression.countDocuments({ [`gameSpecificStats.${gameKey}.elo`]: { $exists: true } });

    // Players with higher ELO (strictly greater) for rank
    const higher = await PlayerProgression.countDocuments({ [`gameSpecificStats.${gameKey}.elo`]: { $gt: elo } });
    const rank = higher + 1;
    const percentile = total > 0 ? rank / total : null;

    // Recommend Ghost tier
    const { getRecommendedMadokuSettings } = await import('@/lib/games/ghost-config');
    const rec = getRecommendedMadokuSettings(percentile ?? 1);

    return NextResponse.json({
      elo,
      totalPlayers: total,
      rank,
      percentile,
      recommended: {
        aiLevel: rec.aiLevel,
        isGhost: rec.isGhost,
        tier: rec.tier,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to get player rank');
    return NextResponse.json({ error: 'Failed to get rank' }, { status: 500 });
  }
}