import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import {
  Player,
  PlayerProgression,
  PointsWallet,
  Streak,
  AchievementUnlock,
  PlayerSession,
} from '@/lib/models';

/**
 * GET /api/players/[playerId]
 * 
 * Why: Fetch comprehensive player profile data including progression, points, and achievements
 * What: Returns player details with nested progression, wallet, streaks, and achievement count
 * 
 * Response:
 * - player: Core player information
 * - progression: Level, XP, titles, and progression stats
 * - wallet: Current points balance
 * - streaks: Active win and login streaks
 * - achievementStats: Count of unlocked vs total achievements
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ playerId: string }> }
) {
  try {
    const params = await props.params;
    const { playerId } = params;

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Why: Connect to database before any operations
    await connectToDatabase();

    // Why: Fetch all player-related data in parallel for performance
    const [player, progressionRaw, walletRaw, streaks, achievementCount, totalAchievements] =
      await Promise.all([
        Player.findById(playerId),
        PlayerProgression.findOne({ playerId }),
        PointsWallet.findOne({ playerId }),
        Streak.find({ playerId, currentStreak: { $gt: 0 } }),
        AchievementUnlock.countDocuments({ playerId }),
        // TODO: Replace with Achievement.countDocuments when model is final
        17,
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

    // Why: Structure response for easy frontend consumption
    const response = {
      player: {
        id: player._id,
        displayName: player.displayName,
        email: player.email,
        isPremium: player.isPremium,
        premiumExpiresAt: player.premiumExpiresAt,
        createdAt: player.createdAt,
        lastLoginAt: player.lastLoginAt,
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
      wallet: wallet
        ? {
            currentBalance: wallet.currentBalance,
            lifetimeEarned: wallet.lifetimeEarned,
            lifetimeSpent: wallet.lifetimeSpent,
          }
        : null,
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
