/**
 * Course Leaderboard API
 *
 * GET /api/leaderboards/course/[courseId]
 * Query: period (daily|weekly|monthly|all_time), metric (course_points|course_completion_speed), limit, playerId (optional)
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { logger } from '@/lib/logger';
import { LeaderboardEntry, Player } from '@/lib/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await props.params;
    const searchParams = request.nextUrl.searchParams;
    const periodParam = (searchParams.get('period') || 'all_time').toString().toLowerCase();
    const periodMap: Record<string, 'daily' | 'weekly' | 'monthly' | 'all_time'> = {
      daily: 'daily',
      weekly: 'weekly',
      monthly: 'monthly',
      alltime: 'all_time',
      'all_time': 'all_time',
      all: 'all_time',
    };
    const period = periodMap[periodParam] || 'all_time';
    const metricParam = (searchParams.get('metric') || 'course_points').toString().toLowerCase();
    const metric = metricParam === 'course_completion_speed' ? 'course_completion_speed' : 'course_points';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);
    const playerId = searchParams.get('playerId');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    await connectDB();

    const courseIdUpper = courseId.toUpperCase();

    const topEntries = await LeaderboardEntry.find({
      courseId: courseIdUpper,
      period,
      metric,
    })
      .sort({ rank: 1 })
      .limit(limit)
      .lean();

    const playerIds = topEntries.map((e) => e.playerId);
    const players = await Player.find({ _id: { $in: playerIds } }).lean();
    const playersMap = new Map(players.map((p) => [p._id.toString(), p]));

    const entriesWithPlayers = topEntries.map((entry) => {
      const player = playersMap.get(entry.playerId.toString());
      return {
        rank: entry.rank,
        score: entry.value,
        metric: entry.metric,
        previousRank: entry.previousRank,
        player: player
          ? { id: player._id, displayName: player.displayName, isPremium: player.isPremium }
          : null,
        updatedAt: entry.metadata?.updatedAt,
      };
    });

    let playerRank: typeof entriesWithPlayers[0] | null = null;
    if (playerId) {
      const playerEntry = await LeaderboardEntry.findOne({
        courseId: courseIdUpper,
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
            ? { id: player._id, displayName: player.displayName, isPremium: player.isPremium }
            : null,
          updatedAt: playerEntry.metadata?.updatedAt,
        };
      }
    }

    const totalEntries = await LeaderboardEntry.countDocuments({
      courseId: courseIdUpper,
      period,
      metric,
    });

    logger.info(
      { courseId: courseIdUpper, period, metric, entriesReturned: entriesWithPlayers.length },
      'Course leaderboard fetched'
    );

    return NextResponse.json(
      {
        entries: entriesWithPlayers,
        playerRank,
        metadata: {
          period,
          metric,
          totalEntries,
          limit,
          lastUpdated: topEntries[0]?.metadata?.updatedAt ?? null,
        },
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  } catch (error) {
    logger.error({ error }, 'Error fetching course leaderboard');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
