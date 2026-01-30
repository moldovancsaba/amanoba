/**
 * Leaderboard Calculator
 * 
 * What: Calculates and updates player rankings across different leaderboards
 * Why: Provides competitive rankings to drive engagement and retention
 * 
 * Features:
 * - Multiple leaderboard types (points, XP, wins, streaks)
 * - Time period support (daily, weekly, monthly, all-time)
 * - Brand-specific and global leaderboards
 * - Efficient bulk update operations
 */

import type { PipelineStage } from 'mongoose';
import { LeaderboardEntry, PlayerProgression, PointsWallet, Streak, Player } from '@/lib/models';
import logger from '@/lib/logger';

/**
 * Leaderboard Types
 * 
 * Why: Different competitive metrics for different player motivations
 */
export type LeaderboardType = 
  | 'points_balance'      // Current points balance
  | 'points_lifetime'     // Lifetime points earned
  | 'xp_total'           // Total XP accumulated
  | 'level'              // Current level
  | 'win_streak'         // Current win streak
  | 'daily_streak'       // Current daily login streak
  | 'games_won'          // Total games won
  | 'win_rate'           // Win percentage
  | 'elo';               // Madoku ELO rating

/**
 * Time Period Types
 * 
 * Why: Different time frames for leaderboards (daily resets, weekly, etc.)
 */
export type LeaderboardPeriod =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'all_time';

/**
 * Leaderboard Calculation Input
 * 
 * Why: Defines which leaderboards to calculate
 */
export interface LeaderboardCalculationOptions {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  brandId?: string;  // Optional: brand-specific leaderboard
  gameId?: string;   // Optional: game-specific leaderboard
  limit?: number;    // Max number of entries (default: 100)
}

/**
 * Calculate Leaderboard Rankings
 * 
 * What: Computes rankings for a specific leaderboard type and period
 * Why: Updates LeaderboardEntry collection with current rankings
 * 
 * @param options - Leaderboard calculation parameters
 * @returns Number of entries updated
 */
export async function calculateLeaderboard(
  options: LeaderboardCalculationOptions
): Promise<number> {
  const { type, period, brandId, gameId, limit = 100 } = options;

  try {
    logger.info({ type, period, brandId }, 'Calculating leaderboard');

    // Get date range for period
    const dateRange = getDateRangeForPeriod(period);

    // Calculate rankings based on type
    let rankings: Array<{
      playerId: string;
      value: number;
      rank: number;
    }> = [];

    switch (type) {
      case 'points_balance':
        rankings = await calculatePointsBalanceLeaderboard(brandId, limit);
        break;
      case 'points_lifetime':
        rankings = await calculatePointsLifetimeLeaderboard(brandId, limit);
        break;
      case 'xp_total':
        rankings = await calculateXPLeaderboard(brandId, limit);
        break;
      case 'level':
        rankings = await calculateLevelLeaderboard(brandId, limit);
        break;
      case 'win_streak':
        rankings = await calculateWinStreakLeaderboard(brandId, limit);
        break;
      case 'daily_streak':
        rankings = await calculateDailyStreakLeaderboard(brandId, limit);
        break;
      case 'games_won':
        rankings = await calculateGamesWonLeaderboard(brandId, limit, dateRange);
        break;
      case 'win_rate':
        rankings = await calculateWinRateLeaderboard(brandId, limit, dateRange);
        break;
      case 'elo':
        rankings = await calculateEloLeaderboard(brandId, limit);
        break;
      default:
        throw new Error(`Unknown leaderboard type: ${type}`);
    }

    // Update or create leaderboard entries
    const bulkOps = rankings.map((entry, index) => ({
      updateOne: {
        filter: {
          playerId: entry.playerId,
          metric: type,
          period,
          ...(gameId && { gameId }),
        },
        update: {
          $set: {
            value: entry.value,
            rank: index + 1,
            lastCalculated: new Date(),
            'metadata.lastCalculated': new Date(),
            'metadata.periodStart': dateRange.start,
            'metadata.periodEnd': dateRange.end,
          },
          $setOnInsert: {
            playerId: entry.playerId,
            ...(gameId && { gameId }),
            metric: type,
            period,
            'metadata.createdAt': new Date(),
            'metadata.updatedAt': new Date(),
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await LeaderboardEntry.bulkWrite(bulkOps);
    }

    logger.info(
      { type, period, brandId, count: rankings.length },
      'Leaderboard calculated successfully'
    );

    return rankings.length;
  } catch (error) {
    logger.error({ error, type, period, brandId }, 'Error calculating leaderboard');
    throw error;
  }
}

/**
 * Calculate All Leaderboards
 * 
 * What: Runs all leaderboard calculations (typically via cron)
 * Why: Keeps all leaderboards up-to-date
 * 
 * @param brandId - Optional brand filter
 * @returns Summary of calculations
 */
export async function calculateAllLeaderboards(brandId?: string): Promise<{
  success: boolean;
  calculated: number;
  errors: number;
}> {
  const results = {
    success: true,
    calculated: 0,
    errors: 0,
  };

  const leaderboards: LeaderboardCalculationOptions[] = [
    // All-time leaderboards
    { type: 'points_balance', period: 'all_time', brandId },
    { type: 'points_lifetime', period: 'all_time', brandId },
    { type: 'xp_total', period: 'all_time', brandId },
    { type: 'level', period: 'all_time', brandId },
    { type: 'win_streak', period: 'all_time', brandId },
    { type: 'daily_streak', period: 'all_time', brandId },

    // Weekly leaderboards
    { type: 'games_won', period: 'weekly', brandId },
    { type: 'win_rate', period: 'weekly', brandId },

    // Monthly leaderboards
    { type: 'games_won', period: 'monthly', brandId },
    { type: 'win_rate', period: 'monthly', brandId },

    // Madoku ELO (all-time)
    { type: 'elo', period: 'all_time', brandId },
  ];

  for (const config of leaderboards) {
    try {
      await calculateLeaderboard(config);
      results.calculated++;
    } catch (error) {
      logger.error({ error, config }, 'Failed to calculate leaderboard');
      results.errors++;
      results.success = false;
    }
  }

  return results;
}

// ============================================================================
// HELPER FUNCTIONS FOR EACH LEADERBOARD TYPE
// ============================================================================

/**
 * Madoku ELO Leaderboard
 * 
 * Why: Shows top champions by ELO
 */
/**
 * ELO Rating Leaderboard (Madoku)
 * 
 * Why: Shows competitive rankings for Madoku based on ELO rating system
 */
async function calculateEloLeaderboard(
  brandId?: string,
  limit: number = 100
): Promise<Array<{ playerId: string; value: number; rank: number }>> {
  // Find all player progressions with Madoku ELO ratings
  const progressions = await PlayerProgression.find({})
    .populate('playerId', 'displayName isActive isBanned brandId')
    .lean();

  // Extract ELO ratings for Madoku game
  const eloData: Array<{ playerId: string; value: number }> = [];
  
  for (const prog of progressions) {
    const player = prog.playerId as { _id: unknown; displayName?: string; isActive?: boolean; isBanned?: boolean; brandId?: unknown };
    
    // Skip inactive or banned players
    if (!player || !player.isActive || player.isBanned) {
      continue;
    }
    
    // Filter by brand if specified
    if (brandId && player.brandId?.toString() !== brandId) {
      continue;
    }
    
    // Look for Madoku ELO in gameSpecificStats
    // gameSpecificStats is a Map, but when lean() is used, it becomes a plain object
    const gameStats = (prog.gameSpecificStats as Map<string, { elo?: number }> | Record<string, { elo?: number }>) || {};
    
    // Try both 'MADOKU' key and any key that might represent Madoku
    let madokuElo: number | undefined;
    
    // Check if it's a Map or plain object
    if (gameStats instanceof Map) {
      madokuElo = gameStats.get('MADOKU')?.elo || gameStats.get('madoku')?.elo;
    } else {
      // Plain object from lean()
      madokuElo = gameStats['MADOKU']?.elo || gameStats['madoku']?.elo;
      
      // If not found, iterate through all game stats to find any ELO
      if (!madokuElo) {
        for (const key of Object.keys(gameStats)) {
          if (gameStats[key]?.elo) {
            madokuElo = gameStats[key].elo;
            break;
          }
        }
      }
    }
    
    // Only include players who have played Madoku (have an ELO rating)
    if (madokuElo !== undefined && madokuElo > 0) {
      eloData.push({
        playerId: String(player._id),
        value: madokuElo,
      });
    }
  }
  
  // Sort by ELO descending
  eloData.sort((a, b) => b.value - a.value);
  
  // Limit results
  const limitedResults = eloData.slice(0, limit);
  
  // Add rank
  return limitedResults.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

/**
 * Points Balance Leaderboard
 * 
 * Why: Shows who has the most points right now
 */
async function calculatePointsBalanceLeaderboard(
  brandId?: string,
  limit: number = 100
): Promise<Array<{ playerId: string; value: number; rank: number }>> {
  const pipeline: Record<string, unknown>[] = [
    {
      $lookup: {
        from: 'players',
        localField: 'playerId',
        foreignField: '_id',
        as: 'player',
      },
    },
    { $unwind: '$player' },
    ...(brandId ? [{ $match: { 'player.brandId': brandId } }] : []),
    { $match: { 'player.isActive': true, 'player.isBanned': false } },
    { $sort: { currentBalance: -1 } },
    { $limit: limit },
    {
      $project: {
        playerId: '$playerId',
        value: '$currentBalance',
      },
    },
  ];

  const results = await PointsWallet.aggregate(pipeline as unknown as PipelineStage[]);
  return results.map((r, index) => ({ ...r, playerId: r.playerId.toString(), rank: index + 1 }));
}

/**
 * Lifetime Points Leaderboard
 * 
 * Why: Shows who has earned the most points historically
 */
async function calculatePointsLifetimeLeaderboard(
  brandId?: string,
  limit: number = 100
): Promise<Array<{ playerId: string; value: number; rank: number }>> {
  const pipeline: Record<string, unknown>[] = [
    {
      $lookup: {
        from: 'players',
        localField: 'playerId',
        foreignField: '_id',
        as: 'player',
      },
    },
    { $unwind: '$player' },
    ...(brandId ? [{ $match: { 'player.brandId': brandId } }] : []),
    { $match: { 'player.isActive': true, 'player.isBanned': false } },
    { $sort: { lifetimeEarned: -1 } },
    { $limit: limit },
    {
      $project: {
        playerId: '$playerId',
        value: '$lifetimeEarned',
      },
    },
  ];

  const results = await PointsWallet.aggregate(pipeline as unknown as PipelineStage[]);
  return results.map((r, index) => ({ ...r, playerId: r.playerId.toString(), rank: index + 1 }));
}

/**
 * Total XP Leaderboard
 * 
 * Why: Shows who has earned the most experience
 */
async function calculateXPLeaderboard(
  brandId?: string,
  limit: number = 100
): Promise<Array<{ playerId: string; value: number; rank: number }>> {
  const pipeline: Record<string, unknown>[] = [
    {
      $lookup: {
        from: 'players',
        localField: 'playerId',
        foreignField: '_id',
        as: 'player',
      },
    },
    { $unwind: '$player' },
    ...(brandId ? [{ $match: { 'player.brandId': brandId } }] : []),
    { $match: { 'player.isActive': true, 'player.isBanned': false } },
    { $sort: { totalXP: -1 } },
    { $limit: limit },
    {
      $project: {
        playerId: '$playerId',
        value: '$totalXP',
      },
    },
  ];

  const results = await PlayerProgression.aggregate(pipeline as unknown as PipelineStage[]);
  return results.map((r, index) => ({ ...r, playerId: r.playerId.toString(), rank: index + 1 }));
}

/**
 * Level Leaderboard
 * 
 * Why: Shows who has reached the highest level
 */
async function calculateLevelLeaderboard(
  brandId?: string,
  limit: number = 100
): Promise<Array<{ playerId: string; value: number; rank: number }>> {
  const pipeline: Record<string, unknown>[] = [
    {
      $lookup: {
        from: 'players',
        localField: 'playerId',
        foreignField: '_id',
        as: 'player',
      },
    },
    { $unwind: '$player' },
    ...(brandId ? [{ $match: { 'player.brandId': brandId } }] : []),
    { $match: { 'player.isActive': true, 'player.isBanned': false } },
    { $sort: { level: -1, currentXP: -1 } }, // Sort by level, then XP as tiebreaker
    { $limit: limit },
    {
      $project: {
        playerId: '$playerId',
        value: '$level',
      },
    },
  ];

  const results = await PlayerProgression.aggregate(pipeline as unknown as PipelineStage[]);
  return results.map((r, index) => ({ ...r, playerId: r.playerId.toString(), rank: index + 1 }));
}

/**
 * Win Streak Leaderboard
 * 
 * Why: Shows who has the longest active win streak
 */
async function calculateWinStreakLeaderboard(
  brandId?: string,
  limit: number = 100
): Promise<Array<{ playerId: string; value: number; rank: number }>> {
  const pipeline: Record<string, unknown>[] = [
    { $match: { type: 'win' } },
    {
      $lookup: {
        from: 'players',
        localField: 'playerId',
        foreignField: '_id',
        as: 'player',
      },
    },
    { $unwind: '$player' },
    ...(brandId ? [{ $match: { 'player.brandId': brandId } }] : []),
    { $match: { 'player.isActive': true, 'player.isBanned': false } },
    { $sort: { currentStreak: -1 } },
    { $limit: limit },
    {
      $project: {
        playerId: '$playerId',
        value: '$currentStreak',
      },
    },
  ];

  const results = await Streak.aggregate(pipeline as unknown as PipelineStage[]);
  return results.map((r, index) => ({ ...r, playerId: r.playerId.toString(), rank: index + 1 }));
}

/**
 * Daily Login Streak Leaderboard
 * 
 * Why: Shows who has the longest active daily login streak
 */
async function calculateDailyStreakLeaderboard(
  brandId?: string,
  limit: number = 100
): Promise<Array<{ playerId: string; value: number; rank: number }>> {
  const pipeline: Record<string, unknown>[] = [
    { $match: { type: 'daily_login' } },
    {
      $lookup: {
        from: 'players',
        localField: 'playerId',
        foreignField: '_id',
        as: 'player',
      },
    },
    { $unwind: '$player' },
    ...(brandId ? [{ $match: { 'player.brandId': brandId } }] : []),
    { $match: { 'player.isActive': true, 'player.isBanned': false } },
    { $sort: { currentStreak: -1 } },
    { $limit: limit },
    {
      $project: {
        playerId: '$playerId',
        value: '$currentStreak',
      },
    },
  ];

  const results = await Streak.aggregate(pipeline as unknown as PipelineStage[]);
  return results.map((r, index) => ({ ...r, playerId: r.playerId.toString(), rank: index + 1 }));
}

/**
 * Games Won Leaderboard
 * 
 * Why: Shows who has won the most games in a time period
 */
async function calculateGamesWonLeaderboard(
  brandId?: string,
  limit: number = 100,
  dateRange?: { start: Date; end: Date }
): Promise<Array<{ playerId: string; value: number; rank: number }>> {
  const pipeline: Record<string, unknown>[] = [
    {
      $lookup: {
        from: 'players',
        localField: 'playerId',
        foreignField: '_id',
        as: 'player',
      },
    },
    { $unwind: '$player' },
    ...(brandId ? [{ $match: { 'player.brandId': brandId } }] : []),
    { $match: { 'player.isActive': true, 'player.isBanned': false } },
    { $sort: { 'statistics.totalWins': -1 } },
    { $limit: limit },
    {
      $project: {
        playerId: '$playerId',
        value: '$statistics.totalWins',
      },
    },
  ];

  const results = await PlayerProgression.aggregate(pipeline as unknown as PipelineStage[]);
  return results.map((r, index) => ({ ...r, playerId: r.playerId.toString(), rank: index + 1 }));
}

/**
 * Win Rate Leaderboard
 * 
 * Why: Shows who has the best win percentage
 */
async function calculateWinRateLeaderboard(
  brandId?: string,
  limit: number = 100,
  dateRange?: { start: Date; end: Date }
): Promise<Array<{ playerId: string; value: number; rank: number }>> {
  const pipeline: Record<string, unknown>[] = [
    {
      $lookup: {
        from: 'players',
        localField: 'playerId',
        foreignField: '_id',
        as: 'player',
      },
    },
    { $unwind: '$player' },
    ...(brandId ? [{ $match: { 'player.brandId': brandId } }] : []),
    { $match: { 
      'player.isActive': true, 
      'player.isBanned': false,
      'statistics.totalGamesPlayed': { $gte: 10 } // Minimum 10 games for win rate
    } },
    {
      $addFields: {
        winRate: {
          $multiply: [
            { $divide: ['$statistics.totalWins', '$statistics.totalGamesPlayed'] },
            100
          ]
        }
      }
    },
    { $sort: { winRate: -1 } },
    { $limit: limit },
    {
      $project: {
        playerId: '$playerId',
        value: { $round: ['$winRate', 2] },
      },
    },
  ];

  const results = await PlayerProgression.aggregate(pipeline as unknown as PipelineStage[]);
  return results.map((r, index) => ({ ...r, playerId: r.playerId.toString(), rank: index + 1 }));
}

/**
 * Get Date Range for Period
 * 
 * Why: Calculates start/end dates for time-based leaderboards
 */
function getDateRangeForPeriod(period: LeaderboardPeriod): { start: Date; end: Date } {
  const now = new Date();
  let start: Date;

  switch (period) {
    case 'daily':
      start = new Date(now);
      start.setHours(0, 0, 0, 0); // Start of today
      break;
    case 'weekly':
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      start.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1); // Start of month
      break;
    case 'all_time':
    default:
      start = new Date(0); // Unix epoch
      break;
  }

  return { start, end: now };
}
