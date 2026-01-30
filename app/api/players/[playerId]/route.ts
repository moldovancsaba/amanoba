import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/rbac';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import {
  Player,
  PlayerProgression,
  PointsWallet,
  Streak,
  Achievement,
  AchievementUnlock,
  PlayerSession,
  CourseProgress,
} from '@/lib/models';

/**
 * GET /api/players/[playerId]
 * 
 * Why: Fetch comprehensive player profile data including progression, points, and achievements
 * What: Returns player details with nested progression, wallet, streaks, and achievement count
 * 
 * Security: Sensitive data (wallet balances, email, lastLoginAt) is only exposed to:
 * - The profile owner (self)
 * - Admins
 * 
 * Response:
 * - player: Core player information (email, lastLoginAt only for self/admin)
 * - progression: Level, XP, titles, and progression stats
 * - wallet: Current points balance (only for self/admin)
 * - streaks: Active win and login streaks
 * - achievementStats: Count of unlocked vs total achievements
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ playerId: string }> }
) {
  // Rate limiting: 100 requests per 15 minutes per IP
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const params = await props.params;
    const { playerId } = params;

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Check authentication and authorization
    const session = await auth();
    const currentUserId = session?.user?.id;
    const isViewingOwnProfile = currentUserId === playerId;
    const isAdminUser = session ? isAdmin(session) : false;
    const canViewPrivateData = isViewingOwnProfile || isAdminUser;

    logger.info({ 
      playerId, 
      currentUserId, 
      isViewingOwnProfile, 
      isAdminUser, 
      canViewPrivateData 
    }, 'Fetching player profile via /api/players/[playerId]');

    // Why: Connect to database before any operations
    await connectToDatabase();

    // Why: Fetch all player-related data in parallel for performance
    const [player, progressionRaw, walletRaw, streaks, achievementCount, totalAchievements, courseProgresses] =
      await Promise.all([
        Player.findById(playerId),
        PlayerProgression.findOne({ playerId }),
        PointsWallet.findOne({ playerId }),
        Streak.find({ playerId, currentStreak: { $gt: 0 } }),
        AchievementUnlock.countDocuments({ playerId }),
        Achievement.countDocuments({ 'metadata.isActive': true }),
        CourseProgress.find({ playerId }).lean(),
      ]);

    let progression = progressionRaw;
    let wallet = walletRaw;

    // Backfill: if progression or wallet are missing or zeroed, rebuild from PlayerSession history
    try {
      const completedSessions = await PlayerSession.find({ playerId, status: 'completed' })
        .select('rewards duration gameData.outcome')
        .lean();

      if (completedSessions.length > 0 && (!progression || progression.totalXP === 0)) {
        // Aggregate totals
        type SessionData = { rewards?: { xpEarned?: number; pointsEarned?: number }; duration?: number; gameData?: { outcome?: string } };
        const totalXP = completedSessions.reduce((sum: number, s: SessionData) => sum + (s.rewards?.xpEarned || 0), 0);
        const totalPoints = completedSessions.reduce((sum: number, s: SessionData) => sum + (s.rewards?.pointsEarned || 0), 0);
        const totalPlayTime = completedSessions.reduce((sum: number, s: SessionData) => sum + (s.duration || 0), 0);
        const totalGamesPlayed = completedSessions.length;
        const totalWins = completedSessions.filter((s: SessionData) => s.gameData?.outcome === 'win').length;
        const totalLosses = completedSessions.filter((s: SessionData) => s.gameData?.outcome === 'loss').length;
        const totalDraws = completedSessions.filter((s: SessionData) => s.gameData?.outcome === 'draw').length;

        // Recompute level/currentXP/xpToNextLevel from totalXP using xp-progression utilities
        const { calculateXPToNextLevel, processXPGain } = await import('@/lib/gamification');
        const level = 1;
        const currentXP = 0;
        const xpToNextLevel = calculateXPToNextLevel(level);
        const res = processXPGain({ level, currentXP, xpToNextLevel }, totalXP);

        const baseDoc = progression || new PlayerProgression({ playerId });
        baseDoc.level = res.finalLevel;
        baseDoc.currentXP = res.finalCurrentXP;
        baseDoc.xpToNextLevel = res.finalXPToNextLevel;
        baseDoc.totalXP = totalXP;
        baseDoc.unlockedTitles = baseDoc.unlockedTitles || [];
        baseDoc.statistics = {
          totalGamesPlayed,
          totalWins,
          totalLosses,
          totalDraws,
          totalPlayTime,
          averageSessionTime: totalGamesPlayed > 0 ? Math.floor(totalPlayTime / totalGamesPlayed) : 0,
          bestStreak: baseDoc.statistics?.bestStreak || 0,
          currentStreak: baseDoc.statistics?.currentStreak || 0,
          dailyLoginStreak: baseDoc.statistics?.dailyLoginStreak || 0,
          lastLoginDate: baseDoc.statistics?.lastLoginDate || new Date(),
        };
        baseDoc.gameSpecificStats = baseDoc.gameSpecificStats || new Map();
        baseDoc.achievements = baseDoc.achievements || { totalUnlocked: 0, totalAvailable: 0, recentUnlocks: [] };
        baseDoc.milestones = baseDoc.milestones || [];
        baseDoc.metadata = baseDoc.metadata || { createdAt: new Date(), updatedAt: new Date(), lastXPGain: new Date() };
        await baseDoc.save();
        progression = baseDoc;

        // Ensure wallet exists; if missing, initialize with lifetimeEarned from sessions
        if (!wallet) {
          wallet = new PointsWallet({
            playerId,
            currentBalance: totalPoints,
            lifetimeEarned: totalPoints,
            lifetimeSpent: 0,
            pendingBalance: 0,
            lastTransaction: new Date(),
            metadata: { createdAt: new Date(), updatedAt: new Date(), lastBalanceCheck: new Date() },
          });
          await wallet.save();
        }
      }
    } catch (e) {
      logger.warn({ e, playerId }, 'Backfill progression/wallet from sessions failed');
    }

    if (!player) {
      logger.warn({ playerId }, 'Player not found');
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const visibility = (player as { profileVisibility?: string }).profileVisibility ?? 'private';
    if (visibility === 'private' && !canViewPrivateData) {
      return NextResponse.json(
        { error: 'Profile not available' },
        { status: 404 }
      );
    }

    // Calculate course statistics
    // Why: Show actual learning progress from courses (quizzes, lessons, courses)
    // Note: When using .lean(), assessmentResults is a plain object, not a Map
    const courseStats = {
      quizzesCompleted: courseProgresses.reduce((sum, cp) => {
        // Count assessment results (quizzes completed)
        // assessmentResults is stored as a Map in DB, but lean() returns it as a plain object
        if (!cp.assessmentResults) return sum;
        if (cp.assessmentResults instanceof Map) {
          return sum + cp.assessmentResults.size;
        }
        // When using lean(), Map becomes a plain object
        return sum + Object.keys(cp.assessmentResults).length;
      }, 0),
      lessonsCompleted: courseProgresses.reduce((sum, cp) => {
        // Count completed days (lessons completed)
        return sum + (cp.completedDays?.length || 0);
      }, 0),
      coursesEnrolled: courseProgresses.length,
      coursesCompleted: courseProgresses.filter(cp => {
        const status = cp.status?.toUpperCase();
        return status === 'COMPLETED';
      }).length,
      totalCourseXP: courseProgresses.reduce((sum, cp) => sum + (cp.totalXPEarned || 0), 0),
      totalCoursePoints: courseProgresses.reduce((sum, cp) => sum + (cp.totalPointsEarned || 0), 0),
    };

    // Why: Structure response for easy frontend consumption
    // Security: Only include sensitive data (email, lastLoginAt, wallet) for self/admin
    const response: Record<string, unknown> = {
      player: {
        id: player._id,
        displayName: player.displayName,
        profilePicture: player.profilePicture,
        ...(canViewPrivateData && { email: player.email }),
        isPremium: player.isPremium,
        premiumExpiresAt: player.premiumExpiresAt,
        surveyCompleted: player.surveyCompleted || false,
        skillLevel: player.skillLevel || null,
        interests: player.interests || [],
        createdAt: player.createdAt,
        ...(canViewPrivateData && { lastLoginAt: player.lastLoginAt }),
        ...(canViewPrivateData && {
          profileVisibility: (player as { profileVisibility?: string }).profileVisibility ?? 'private',
          profileSectionVisibility: (player as { profileSectionVisibility?: Record<string, string> }).profileSectionVisibility ?? {
            about: 'private',
            courses: 'private',
            achievements: 'private',
            certificates: 'private',
            stats: 'private',
          },
        }),
      },
      progression: progression
        ? {
            level: progression.level,
            currentXP: progression.currentXP,
            xpToNextLevel: progression.xpToNextLevel,
            totalXP: progression.totalXP,
            currentTitle: progression.title || null,
            unlockedTitles: progression.unlockedTitles,
            totalGamesPlayed: progression.statistics.totalGamesPlayed,
            totalGamesWon: progression.statistics.totalWins,
            winRate:
              progression.statistics.totalGamesPlayed > 0
                ? (progression.statistics.totalWins / progression.statistics.totalGamesPlayed) * 100
                : 0,
            bestStreak: progression.statistics.bestStreak,
            currentStreak: progression.statistics.currentStreak,
          }
        : null,
      // Wallet data is private - only include if viewing own profile or admin
      ...(canViewPrivateData && {
        wallet: wallet
          ? {
              currentBalance: wallet.currentBalance,
              lifetimeEarned: wallet.lifetimeEarned,
              lifetimeSpent: wallet.lifetimeSpent,
            }
          : null,
      }),
      streaks: streaks.map((streak) => ({
        type: streak.type,
        count: streak.currentStreak,
        bestCount: streak.bestStreak,
        lastUpdated: streak.lastActivity,
        bonusMultiplier: streak.bonusMultiplier,
      })),
      achievementStats: {
        unlocked: achievementCount,
        total: totalAchievements,
        percentage:
          totalAchievements > 0
            ? Math.round((achievementCount / totalAchievements) * 100)
            : 0,
      },
      courseStats,
    };

    logger.info({ playerId }, 'Player profile fetched successfully');

    // Why: Prevent caching to ensure fresh data after games
    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    // Why: Log unexpected errors for debugging
    logger.error({ error }, 'Error fetching player profile');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
