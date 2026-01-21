/**
 * Admin Stats API
 * 
 * What: REST endpoint for admin dashboard statistics
 * Why: Provides real-time statistics for the admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Player, PlayerSession, AchievementUnlock, PointsTransaction, CourseProgress, Game, RewardRedemption } from '@/lib/models';
import { logger } from '@/lib/logger';
import { checkRateLimit, adminRateLimiter } from '@/lib/security';
import { checkAdminAccess } from '@/lib/auth/admin';

/**
 * GET /api/admin/stats
 * 
 * What: Get dashboard statistics
 */
export async function GET(request: NextRequest) {
  // Rate limiting for admin endpoints
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();
    
    // Admin role check
    const adminCheck = checkAdminAccess(session, '/api/admin/stats');
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    // Get current date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch statistics in parallel
    const [
      totalPlayers,
      activePlayersLast24h,
      totalSessions,
      sessionsThisMonth,
      achievementsUnlocked,
      achievementsThisMonth,
      totalPointsEarned,
      pointsThisMonth,
      activeSessionsNow,
    ] = await Promise.all([
      // Total players
      Player.countDocuments({}),
      
      // Active players (logged in within last 24 hours)
      Player.countDocuments({
        lastLoginAt: { $gte: oneDayAgo },
      }),
      
      // Total game sessions
      PlayerSession.countDocuments({}),
      
      // Sessions this month
      PlayerSession.countDocuments({
        sessionStart: { $gte: startOfMonth },
      }),
      
      // Total achievements unlocked
      AchievementUnlock.countDocuments({}),
      
      // Achievements unlocked this month
      AchievementUnlock.countDocuments({
        unlockedAt: { $gte: startOfMonth },
      }),
      
      // Total points earned (from transactions)
      PointsTransaction.aggregate([
        {
          $match: {
            type: 'earn',
            amount: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
      
      // Points earned this month
      PointsTransaction.aggregate([
        {
          $match: {
            type: 'earn',
            amount: { $gt: 0 },
            'metadata.createdAt': { $gte: startOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
      
      // Active sessions right now (sessions started in last hour)
      PlayerSession.countDocuments({
        sessionStart: { $gte: new Date(now.getTime() - 60 * 60 * 1000) },
        status: { $in: ['in_progress'] },
      }),
    ]);

    // Calculate growth rates (comparing this month to last month)
    const sessionsLastMonth = await PlayerSession.countDocuments({
      sessionStart: { $gte: oneMonthAgo, $lt: startOfMonth },
    });
    const sessionsGrowthRate = sessionsLastMonth > 0
      ? ((sessionsThisMonth - sessionsLastMonth) / sessionsLastMonth) * 100
      : 0;

    const achievementsLastMonth = await AchievementUnlock.countDocuments({
      unlockedAt: { $gte: oneMonthAgo, $lt: startOfMonth },
    });
    const achievementsGrowthRate = achievementsLastMonth > 0
      ? ((achievementsThisMonth - achievementsLastMonth) / achievementsLastMonth) * 100
      : 0;

    const playersLastMonth = await Player.countDocuments({
      createdAt: { $gte: oneMonthAgo, $lt: startOfMonth },
    });
    const playersThisMonth = await Player.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const playersGrowthRate = playersLastMonth > 0
      ? ((playersThisMonth - playersLastMonth) / playersLastMonth) * 100
      : 0;

    const pointsLastMonth = await PointsTransaction.aggregate([
      {
        $match: {
          type: 'earn',
          amount: { $gt: 0 },
          'metadata.createdAt': { $gte: oneMonthAgo, $lt: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    const pointsLastMonthTotal = pointsLastMonth[0]?.total || 0;
    const pointsThisMonthTotal = pointsThisMonth[0]?.total || 0;
    const pointsGrowthRate = pointsLastMonthTotal > 0
      ? ((pointsThisMonthTotal - pointsLastMonthTotal) / pointsLastMonthTotal) * 100
      : 0;

    const totalPointsEarnedValue = totalPointsEarned[0]?.total || 0;

    // Get total games count
    const totalGames = await Game.countDocuments({ isActive: true });

    // Fetch recent activity
    const recentPlayers = await Player.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('displayName createdAt')
      .lean();

    const recentAchievements = await AchievementUnlock.find({})
      .populate('achievementId', 'name')
      .populate('playerId', 'displayName')
      .sort({ unlockedAt: -1 })
      .limit(5)
      .lean();

    const recentSessions = await PlayerSession.aggregate([
      {
        $match: {
          sessionStart: { $gte: oneDayAgo },
        },
      },
      {
        $group: {
          _id: '$gameId',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'games',
          localField: '_id',
          foreignField: '_id',
          as: 'game',
        },
      },
      {
        $unwind: '$game',
      },
    ]);

    const recentRewards = await RewardRedemption.countDocuments({
      redemptionDate: { $gte: startOfToday },
    });

    // Format recent activity
    const recentActivity = [
      ...recentPlayers.slice(0, 1).map((p: any) => ({
        type: 'player',
        message: `Új játékos regisztrálva: ${p.displayName}`,
        time: getTimeAgo(p.createdAt),
      })),
      ...recentAchievements.slice(0, 1).map((a: any) => ({
        type: 'achievement',
        message: `Eredmény feloldva: ${a.achievementId?.name || 'Ismeretlen'} (${a.playerId?.displayName || 'Ismeretlen'})`,
        time: getTimeAgo(a.unlockedAt),
      })),
      ...recentSessions.slice(0, 1).map((s: any) => ({
        type: 'game',
        message: `${s.game?.name || 'Játék'} játszva ${s.count} alkalommal az elmúlt órában`,
        time: '1 órája',
      })),
      {
        type: 'reward',
        message: `${recentRewards} jutalom beváltva ma`,
        time: 'Ma',
      },
    ].slice(0, 4);

    return NextResponse.json({
      success: true,
      stats: {
        totalPlayers,
        activePlayers: activePlayersLast24h,
        totalGames,
        totalSessions,
        sessionsThisMonth,
        pointsEarned: totalPointsEarnedValue,
        pointsThisMonth: pointsThisMonthTotal,
        achievementsUnlocked,
        achievementsThisMonth,
        revenueThisMonth: 0, // Not monetized yet
        growthRate: {
          players: playersGrowthRate,
          sessions: sessionsGrowthRate,
          achievements: achievementsGrowthRate,
          points: pointsGrowthRate,
        },
        activeSessions: activeSessionsNow,
        recentActivity,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch admin stats');
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

/**
 * Helper function to get time ago string
 */
function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Éppen most';
  if (diffMins < 60) return `${diffMins} perce`;
  if (diffHours < 24) return `${diffHours} órája`;
  if (diffDays < 7) return `${diffDays} napja`;
  return past.toLocaleDateString('hu-HU');
}
