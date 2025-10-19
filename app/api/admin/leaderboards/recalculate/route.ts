/**
 * Admin Leaderboards Recalculate API
 * 
 * What: Manually triggers leaderboard recalculation
 * Why: Provides admin control over leaderboard updates and repair
 * 
 * POST /api/admin/leaderboards/recalculate
 * 
 * Request Body:
 * - type?: LeaderboardType - Optional specific leaderboard type
 * - period?: LeaderboardPeriod - Optional specific period
 * - brandId?: string - Optional brand filter
 * - calculateAll?: boolean - If true, calculate all leaderboards
 * - immediate?: boolean - If true, calculate synchronously (default: false, uses queue)
 * 
 * Response:
 * - 200: Recalculation triggered successfully
 * - 401: Unauthorized
 * - 500: Internal error
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import logger from '@/lib/logger';
import { 
  enqueueLeaderboardUpdate, 
  enqueueAllLeaderboardsUpdate,
  LeaderboardJobPayload 
} from '@/lib/queue/workers/leaderboard-worker';
import { 
  calculateLeaderboard, 
  calculateAllLeaderboards,
  LeaderboardType,
  LeaderboardPeriod 
} from '@/lib/gamification/leaderboard-calculator';

/**
 * POST - Recalculate Leaderboards
 * 
 * What: Triggers leaderboard recalculation either immediately or via queue
 * Why: Allows admins to fix stale leaderboards or force updates
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Auth check (basic example - implement proper admin auth)
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      type,
      period,
      brandId,
      gameId,
      limit,
      calculateAll = false,
      immediate = false,
    } = body;

    logger.info(
      { type, period, brandId, gameId, calculateAll, immediate },
      'Admin leaderboard recalculation requested'
    );

    if (immediate) {
      // Synchronous calculation (blocking)
      if (calculateAll) {
        const result = await calculateAllLeaderboards(brandId);
        
        return NextResponse.json({
          success: result.success,
          message: `Calculated ${result.calculated} leaderboards with ${result.errors} errors`,
          calculated: result.calculated,
          errors: result.errors,
          duration: Date.now() - startTime,
          method: 'immediate',
        });
      } else {
        if (!type || !period) {
          return NextResponse.json(
            { error: 'Missing required fields: type and period' },
            { status: 400 }
          );
        }

        const entriesUpdated = await calculateLeaderboard({
          type: type as LeaderboardType,
          period: period as LeaderboardPeriod,
          brandId,
          gameId,
          limit: limit || 100,
        });

        return NextResponse.json({
          success: true,
          message: `Leaderboard recalculated: ${type} (${period})`,
          type,
          period,
          brandId,
          gameId,
          entriesUpdated,
          duration: Date.now() - startTime,
          method: 'immediate',
        });
      }
    } else {
      // Async calculation via job queue (non-blocking)
      if (calculateAll) {
        const jobId = await enqueueAllLeaderboardsUpdate(brandId, 1); // High priority
        
        return NextResponse.json({
          success: true,
          message: 'Leaderboard recalculation jobs enqueued',
          jobId,
          calculateAll: true,
          brandId,
          duration: Date.now() - startTime,
          method: 'queued',
        });
      } else {
        if (!type || !period) {
          return NextResponse.json(
            { error: 'Missing required fields: type and period' },
            { status: 400 }
          );
        }

        const payload: LeaderboardJobPayload = {
          type: type as LeaderboardType,
          period: period as LeaderboardPeriod,
          brandId,
          gameId,
          limit: limit || 100,
        };

        const jobId = await enqueueLeaderboardUpdate(payload, 1); // High priority

        return NextResponse.json({
          success: true,
          message: `Leaderboard recalculation job enqueued: ${type} (${period})`,
          jobId,
          type,
          period,
          brandId,
          gameId,
          duration: Date.now() - startTime,
          method: 'queued',
        });
      }
    }
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error(
      {
        error,
        duration,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Admin leaderboard recalculation failed'
    );

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        duration,
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Check Leaderboard Staleness
 * 
 * What: Returns information about leaderboard freshness
 * Why: Helps admins identify which leaderboards need recalculation
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Auth check
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { LeaderboardEntry } = await import('@/lib/models');

    // Find oldest leaderboard entries by metric
    const staleLeaderboards = await LeaderboardEntry.aggregate([
      {
        $group: {
          _id: { metric: '$metric', period: '$period' },
          oldestUpdate: { $min: '$lastCalculated' },
          totalEntries: { $sum: 1 },
        },
      },
      {
        $project: {
          metric: '$_id.metric',
          period: '$_id.period',
          oldestUpdate: 1,
          totalEntries: 1,
          staleHours: {
            $divide: [
              { $subtract: [new Date(), '$oldestUpdate'] },
              3600000, // ms to hours
            ],
          },
        },
      },
      {
        $sort: { staleHours: -1 },
      },
    ]);

    return NextResponse.json({
      success: true,
      staleLeaderboards,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error(
      {
        error,
        duration,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      'Failed to check leaderboard staleness'
    );

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        duration,
      },
      { status: 500 }
    );
  }
}
