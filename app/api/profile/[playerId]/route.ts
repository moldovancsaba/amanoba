/**
 * Player Public Profile API
 * 
 * Provides public-facing player profile data including stats, achievements,
 * recent activity, and badges. Used for profile pages and social features.
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import {
  Player,
  PlayerProgression,
  PointsWallet,
  AchievementUnlock,
  Achievement,
  PlayerSession,
  Streak,
} from '@/lib/models';
import type { IAchievement } from '@/lib/models/achievement';
import { logger } from '@/lib/logger';

/**
 * GET /api/profile/[playerId]
 * 
 * Fetches comprehensive public profile data for a player.
 * 
 * Response includes:
 * - Basic player info (name, avatar, join date, premium status)
 * - Progression stats (level, XP, title)
 * - Game statistics (games played, win rate, total playtime)
 * - Points wallet (current balance, lifetime earned)
 * - Achievement showcase (total unlocks, featured achievements)
 * - Recent activity (last 10 game sessions)
 * - Streaks (current and best)
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await props.params;

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      );
    }

    logger.info({ playerId }, 'Fetching player profile');

    await connectDB();

    // Fetch all profile data in parallel
    const [player, progression, wallet, achievements, recentSessions, streaks] = await Promise.all([
      Player.findById(playerId).lean(),
      PlayerProgression.findOne({ playerId }).lean(),
      PointsWallet.findOne({ playerId }).lean(),
      AchievementUnlock.find({ playerId })
        .populate('achievementId')
        .sort({ unlockedAt: -1 })
        .limit(20)
        .lean(),
      PlayerSession.find({ playerId, status: 'completed' })
        .sort({ sessionEnd: -1 })
        .limit(10)
        .populate('gameId', 'name icon')
        .lean(),
      Streak.find({ playerId }).lean(),
    ]);

    if (!player) {
      logger.warn({ playerId }, 'Player not found');
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const totalAchievements = await Achievement.countDocuments({ 'availability.isActive': true });
    const unlockedAchievements = achievements.length;
    const achievementProgress = totalAchievements > 0
      ? Math.round((unlockedAchievements / totalAchievements) * 100)
      : 0;

    // Get featured achievements (highest tier, most recent)
    const featuredAchievements = achievements
      .slice(0, 6)
      .map((unlock) => {
        const achievement = unlock.achievementId as unknown as IAchievement & { display?: { icon?: string } };
        return {
          id: (achievement._id as mongoose.Types.ObjectId).toString(),
          name: achievement.name,
          description: achievement.description,
          tier: achievement.tier,
          icon: achievement.display?.icon,
          unlockedAt: unlock.unlockedAt,
        };
      });

    // Calculate win rate
    const totalGames = progression?.statistics?.totalGamesPlayed || 0;
    const wins = progression?.statistics?.totalWins || 0;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

    // Get current streaks
    const winStreak = streaks.find((s) => s.type === 'win');
    const dailyStreak = streaks.find((s) => s.type === 'daily_login');

    // Format recent activity
    const recentActivity = recentSessions.map((session) => {
      const gameInfo = (typeof session.gameId === 'object' && session.gameId !== null && '_id' in session.gameId)
        ? session.gameId as unknown as { _id: mongoose.Types.ObjectId; name: string; icon?: string }
        : null;
      return {
        gameId: gameInfo?._id?.toString(),
        gameName: gameInfo?.name || 'Unknown Game',
        gameIcon: gameInfo?.icon,
        outcome: session.gameData?.outcome,
        score: session.gameData?.score,
        pointsEarned: session.rewards?.pointsEarned || 0,
        playedAt: session.sessionEnd,
        duration: session.duration,
      };
    });

    // Build response
    const profileData = {
      player: {
        id: player._id,
        displayName: player.displayName,
        profilePicture: player.profilePicture,
        isPremium: player.isPremium || false,
        createdAt: player.createdAt,
        lastSeenAt: player.lastSeenAt,
      },
      progression: {
        level: progression?.level || 1,
        currentXP: progression?.currentXP || 0,
        xpToNextLevel: progression?.xpToNextLevel || 100,
        totalXP: progression?.totalXP || 0,
        title: progression?.title || 'Rookie',
        nextTitle: getNextTitle(progression?.level || 1),
      },
      statistics: {
        totalGamesPlayed: totalGames,
        totalWins: wins,
        totalLosses: progression?.statistics?.totalLosses || 0,
        totalDraws: progression?.statistics?.totalDraws || 0,
        winRate,
        totalPlayTime: progression?.statistics?.totalPlayTime || 0,
        averageSessionTime: progression?.statistics?.averageSessionTime || 0,
        highestScore: 0, // TODO: Add to model if needed
        perfectGames: 0, // TODO: Add to model if needed
      },
      wallet: {
        currentBalance: wallet?.currentBalance || 0,
        lifetimeEarned: wallet?.lifetimeEarned || 0,
        lifetimeSpent: wallet?.lifetimeSpent || 0,
      },
      achievements: {
        total: totalAchievements,
        unlocked: unlockedAchievements,
        progress: achievementProgress,
        featured: featuredAchievements,
      },
      streaks: {
        win: {
          current: winStreak?.currentStreak || 0,
          longest: winStreak?.bestStreak || 0,
          lastActivity: winStreak?.lastActivity,
        },
        daily: {
          current: dailyStreak?.currentStreak || 0,
          longest: dailyStreak?.bestStreak || 0,
          lastActivity: dailyStreak?.lastActivity,
        },
      },
      recentActivity,
    };

    logger.info({ playerId }, 'Player profile fetched successfully');

    return NextResponse.json({
      success: true,
      profile: profileData,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch player profile');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Helper: Get next title based on level
 */
function getNextTitle(currentLevel: number): string | null {
  const titles: Record<number, string> = {
    1: 'Rookie',
    5: 'Novice',
    10: 'Apprentice',
    15: 'Adept',
    20: 'Expert',
    25: 'Master',
    30: 'Champion',
    35: 'Legend',
    40: 'Mythic',
    45: 'Immortal',
    50: 'Godlike',
  };

  // Find next milestone
  const levels = Object.keys(titles).map(Number).sort((a, b) => a - b);
  const nextLevel = levels.find((level) => level > currentLevel);

  return nextLevel ? titles[nextLevel] : null;
}
