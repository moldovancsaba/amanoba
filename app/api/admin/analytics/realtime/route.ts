/**
 * Real-time Analytics API
 * 
 * Provides live stats calculated directly from EventLog for real-time dashboard display.
 * Used for "last 24 hours" or "today" metrics that need up-to-the-minute data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import mongoose from 'mongoose';
import { EventLog, PlayerSession } from '../../../../lib/models';
import { logger } from '../../../../lib/logger';
import connectDB from '../../../../lib/mongodb';
import { requireAdmin } from '../../../../lib/rbac';

/**
 * GET /api/admin/analytics/realtime?brandId=xxx
 * 
 * Fetches real-time stats for the last 24 hours.
 * 
 * Query params:
 * - brandId: Brand ID (required)
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication and admin role check
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: brandId' },
        { status: 400 }
      );
    }

    logger.info({ brandId }, 'Fetching real-time analytics');

    // Calculate time windows
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last1Hour = new Date(now.getTime() - 60 * 60 * 1000);

    // Run aggregations in parallel for performance
    const [
      activeUsersLast24h,
      activeUsersLast1h,
      gameSessionsLast24h,
      gameSessionsLast1h,
      achievementUnlocksLast24h,
      rewardRedemptionsLast24h,
      activeSessions,
    ] = await Promise.all([
      // Active users last 24 hours
      EventLog.distinct('playerId', {
        brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
        timestamp: { $gte: last24Hours },
      }),

      // Active users last 1 hour
      EventLog.distinct('playerId', {
        brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
        timestamp: { $gte: last1Hour },
      }),

      // Game sessions last 24 hours
      EventLog.countDocuments({
        eventType: 'game_played',
        brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
        timestamp: { $gte: last24Hours },
      }),

      // Game sessions last 1 hour
      EventLog.countDocuments({
        eventType: 'game_played',
        brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
        timestamp: { $gte: last1Hour },
      }),

      // Achievement unlocks last 24 hours
      EventLog.countDocuments({
        eventType: 'achievement_unlocked',
        brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
        timestamp: { $gte: last24Hours },
      }),

      // Reward redemptions last 24 hours
      EventLog.countDocuments({
        eventType: 'reward_redeemed',
        brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
        timestamp: { $gte: last24Hours },
      }),

      // Currently active game sessions
      PlayerSession.countDocuments({
        brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
        status: 'in_progress',
      }),
    ]);

    // Calculate points earned in last 24 hours
    const pointsResult = await EventLog.aggregate([
      {
        $match: {
          eventType: 'points_earned',
          brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
          timestamp: { $gte: last24Hours },
        },
      },
      {
        $group: {
          _id: null,
          totalPoints: { 
            $sum: { 
              $ifNull: ['$metadata.amount', 0] 
            } 
          },
        },
      },
    ]);

    const totalPointsLast24h = pointsResult.length > 0 ? pointsResult[0].totalPoints : 0;

    // Get top games by sessions in last 24 hours
    const topGames = await EventLog.aggregate([
      {
        $match: {
          eventType: 'game_played',
          brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
          timestamp: { $gte: last24Hours },
        },
      },
      {
        $group: {
          _id: '$metadata.gameId',
          sessionCount: { $sum: 1 },
          totalPoints: { 
            $sum: { 
              $ifNull: ['$metadata.pointsEarned', 0] 
            } 
          },
        },
      },
      { $sort: { sessionCount: -1 } },
      { $limit: 5 },
    ]);

    // Get recent events for activity feed (last 20)
    const recentEvents = await EventLog.find({
      brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
    })
      .sort({ timestamp: -1 })
      .limit(20)
      .select('eventType playerId timestamp metadata')
      .lean();

    logger.info({ brandId }, 'Real-time analytics fetched successfully');

    return NextResponse.json({
      success: true,
      data: {
        last24Hours: {
          activeUsers: activeUsersLast24h.length,
          gameSessions: gameSessionsLast24h,
          achievementUnlocks: achievementUnlocksLast24h,
          rewardRedemptions: rewardRedemptionsLast24h,
          totalPointsEarned: totalPointsLast24h,
        },
        last1Hour: {
          activeUsers: activeUsersLast1h.length,
          gameSessions: gameSessionsLast1h,
        },
        current: {
          activeSessions,
        },
        topGames,
        recentEvents,
      },
      timestamp: now.toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch real-time analytics');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
