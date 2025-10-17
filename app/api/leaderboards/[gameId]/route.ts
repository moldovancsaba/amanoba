import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import { LeaderboardEntry, Player } from '@/lib/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/leaderboards/[gameId]
 * 
 * Why: Display competitive rankings for a specific game
 * What: Returns top players with scores, ranks, and player details
 * 
 * Query Parameters:
 * - period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' (default: ALL_TIME)
 * - limit: Number of entries to return (default: 100, max: 500)
 * - playerId: Optional player ID to include their rank even if not in top N
 * 
 * Response:
 * - entries: Array of leaderboard entries with player details
 * - playerRank: Optional - specific player's rank if playerId provided
 * - metadata: Period, total entries, last updated timestamp
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ gameId: string }> }
) {
  try {
    const params = await props.params;
    const { gameId } = params;
    const searchParams = request.nextUrl.searchParams;
    
    const periodParam = (searchParams.get('period') || 'ALL_TIME').toString().toLowerCase();
    const periodMap: Record<string, 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME'> = {
      daily: 'DAILY',
      weekly: 'WEEKLY',
      monthly: 'MONTHLY',
      alltime: 'ALL_TIME',
      'all_time': 'ALL_TIME',
      all: 'ALL_TIME',
    };
    const period = periodMap[periodParam] || 'ALL_TIME';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
    const playerId = searchParams.get('playerId');
    const metric = (searchParams.get('metric') || 'score').toString();

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Why: Connect to database before any operations
    await connectToDatabase();

    // Why: Fetch top entries sorted by rank for score metric
    const topEntries = await LeaderboardEntry.find({
      gameId,
      period,
      metric,
    })
      .sort({ rank: 1 })
      .limit(limit)
      .lean();

    // Why: Fetch player details for all entries in one query
    const playerIds = topEntries.map((entry) => entry.playerId);
    const players = await Player.find({ _id: { $in: playerIds } }).lean();

    // Why: Create a map for quick player lookup
    const playersMap = new Map(
      players.map((player) => [player._id.toString(), player])
    );

    // Why: Combine leaderboard entries with player information
    const entriesWithPlayers = topEntries.map((entry) => {
      const player = playersMap.get(entry.playerId.toString());
      return {
        rank: entry.rank,
        score: entry.value, // value is the generic metric field
        metric: entry.metric,
        previousRank: entry.previousRank,
        player: player
          ? {
              id: player._id,
              displayName: player.displayName,
              isPremium: player.isPremium,
            }
          : null,
        updatedAt: entry.metadata.updatedAt,
      };
    });

    // Why: If playerId provided, fetch their specific rank
    let playerRank = null;
    if (playerId) {
      const playerEntry = await LeaderboardEntry.findOne({
        gameId,
        period,
        metric,
        playerId,
      }).lean();

      if (playerEntry) {
        const player = await Player.findById(playerId).lean();
        playerRank = {
          rank: playerEntry.rank,
          score: playerEntry.value,
          metric: playerEntry.metric,
          previousRank: playerEntry.previousRank,
          player: player
            ? {
                id: player._id,
                displayName: player.displayName,
                isPremium: player.isPremium,
              }
            : null,
        };
      }
    }

    // Why: Count total entries for the period
    const totalEntries = await LeaderboardEntry.countDocuments({
      gameId,
      period,
      metric: 'score',
    });

    logger.info(
      { gameId, period, entriesReturned: entriesWithPlayers.length },
      'Leaderboard fetched successfully'
    );

    return NextResponse.json(
      {
        entries: entriesWithPlayers,
        playerRank,
        metadata: {
          period,
          totalEntries,
          limit,
          lastUpdated: topEntries[0]?.metadata?.updatedAt || null,
        },
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    // Why: Log unexpected errors for debugging
    logger.error(
      { error },
      'Error fetching leaderboard'
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
