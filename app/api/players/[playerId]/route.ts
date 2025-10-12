import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import {
  Player,
  PlayerProgression,
  PointsWallet,
  Streak,
  AchievementUnlock,
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
    const [player, progression, wallet, streaks, achievementCount, totalAchievements] =
      await Promise.all([
        Player.findById(playerId),
        PlayerProgression.findOne({ playerId }),
        PointsWallet.findOne({ playerId }),
        Streak.find({ playerId, currentStreak: { $gt: 0 } }),
        AchievementUnlock.countDocuments({ playerId }),
        // Why: Count achievements from a hypothetical Achievement model
        // Note: This assumes achievements are defined; adjust if needed
        17, // Placeholder: total achievements in system
      ]);

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

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // Why: Log unexpected errors for debugging
    logger.error({ error }, 'Error fetching player profile');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
