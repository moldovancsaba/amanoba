/**
 * Analytics Aggregation Pipelines
 * 
 * MongoDB aggregation pipelines for computing analytics metrics from EventLog.
 * Used by cron jobs to pre-calculate metrics and store in AnalyticsSnapshot.
 * 
 * Key capabilities:
 * - Daily/Weekly/Monthly active users (DAU/WAU/MAU)
 * - Game session metrics (count, duration, completion rate)
 * - Revenue metrics (redemptions, point economy health)
 * - Retention cohorts (1-day, 7-day, 30-day retention)
 * - Engagement metrics (sessions per user, time per session)
 * - Conversion metrics (free to premium, achievement completion)
 */

import { EventLog } from '../models';
import { logger } from '../logger';

/**
 * Time period type for analytics queries
 */
export type TimePeriod = 'daily' | 'weekly' | 'monthly';

/**
 * Date range for analytics queries
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Active users metric result
 */
export interface ActiveUsersMetric {
  period: TimePeriod;
  date: Date;
  brandId: string;
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  premiumUsers: number;
}

/**
 * Game session metric result
 */
export interface GameSessionMetric {
  period: TimePeriod;
  date: Date;
  brandId: string;
  gameId: string;
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  averageDuration: number;
  totalPoints: number;
  averagePoints: number;
}

/**
 * Revenue metric result
 */
export interface RevenueMetric {
  period: TimePeriod;
  date: Date;
  brandId: string;
  totalRedemptions: number;
  pointsRedeemed: number;
  uniqueRedeemers: number;
  averageRedemptionValue: number;
  topRewards: Array<{ rewardId: string; count: number }>;
}

/**
 * Retention cohort result
 */
export interface RetentionCohort {
  cohortDate: Date;
  brandId: string;
  newUsers: number;
  retained1Day: number;
  retained7Day: number;
  retained30Day: number;
  retention1DayRate: number;
  retention7DayRate: number;
  retention30DayRate: number;
}

/**
 * Engagement metric result
 */
export interface EngagementMetric {
  period: TimePeriod;
  date: Date;
  brandId: string;
  totalSessions: number;
  uniqueUsers: number;
  sessionsPerUser: number;
  averageSessionDuration: number;
  totalPlayTime: number;
  achievementUnlocks: number;
  achievementRate: number;
}

/**
 * Conversion metric result
 */
export interface ConversionMetric {
  period: TimePeriod;
  date: Date;
  brandId: string;
  freeUsers: number;
  premiumConversions: number;
  conversionRate: number;
  achievementCompleters: number;
  achievementCompletionRate: number;
}

/**
 * Calculate Daily/Weekly/Monthly Active Users (DAU/WAU/MAU)
 * 
 * Counts unique players who performed any event in the time period.
 * Segments by new vs returning, premium vs free.
 */
export async function aggregateActiveUsers(
  brandId: string,
  period: TimePeriod,
  dateRange: DateRange
): Promise<ActiveUsersMetric[]> {
  try {
    logger.info({ brandId, period, dateRange }, 'Aggregating active users');

    // Determine grouping format based on period
    const dateFormat = {
      daily: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
      weekly: { $dateToString: { format: '%Y-W%V', date: '$timestamp' } },
      monthly: { $dateToString: { format: '%Y-%m', date: '$timestamp' } },
    }[period];

    const results = await EventLog.aggregate([
      // Match events in date range and brand
      {
        $match: {
          'metadata.brandId': brandId,
          timestamp: { $gte: dateRange.start, $lte: dateRange.end },
        },
      },
      // Group by period and player
      {
        $group: {
          _id: {
            period: dateFormat,
            playerId: '$playerId',
          },
          isPremium: { $max: '$metadata.isPremium' },
          firstEventEver: { $min: '$timestamp' },
        },
      },
      // Group by period to count users
      {
        $group: {
          _id: '$_id.period',
          totalUsers: { $sum: 1 },
          premiumUsers: {
            $sum: { $cond: ['$isPremium', 1, 0] },
          },
          users: {
            $push: {
              playerId: '$_id.playerId',
              firstEvent: '$firstEventEver',
            },
          },
        },
      },
      // Sort by period
      { $sort: { _id: 1 } },
    ]);

    // Transform results to typed format
    return results.map((r) => ({
      period,
      date: parsePeriodToDate(r._id, period),
      brandId,
      totalUsers: r.totalUsers,
      newUsers: r.users.filter((u: { playerId: string; firstEvent: Date }) => 
        u.firstEvent >= dateRange.start && u.firstEvent <= dateRange.end
      ).length,
      returningUsers: r.totalUsers - r.users.filter((u: { playerId: string; firstEvent: Date }) =>
        u.firstEvent >= dateRange.start && u.firstEvent <= dateRange.end
      ).length,
      premiumUsers: r.premiumUsers,
    }));
  } catch (error) {
    logger.error({ error, brandId, period }, 'Failed to aggregate active users');
    throw error;
  }
}

/**
 * Calculate game session metrics
 * 
 * Aggregates session count, completion rate, duration, and points earned per game.
 */
export async function aggregateGameSessions(
  brandId: string,
  period: TimePeriod,
  dateRange: DateRange
): Promise<GameSessionMetric[]> {
  try {
    logger.info({ brandId, period, dateRange }, 'Aggregating game sessions');

    const dateFormat = {
      daily: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
      weekly: { $dateToString: { format: '%Y-W%V', date: '$timestamp' } },
      monthly: { $dateToString: { format: '%Y-%m', date: '$timestamp' } },
    }[period];

    const results = await EventLog.aggregate([
      // Match game_played events in date range
      {
        $match: {
          eventType: 'game_played',
          'metadata.brandId': brandId,
          timestamp: { $gte: dateRange.start, $lte: dateRange.end },
        },
      },
      // Group by period and game
      {
        $group: {
          _id: {
            period: dateFormat,
            gameId: '$metadata.gameId',
          },
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: { $cond: ['$metadata.completed', 1, 0] },
          },
          totalDuration: { $sum: '$metadata.duration' },
          totalPoints: { $sum: '$metadata.pointsEarned' },
        },
      },
      // Calculate averages
      {
        $project: {
          _id: 1,
          totalSessions: 1,
          completedSessions: 1,
          completionRate: {
            $cond: [
              { $gt: ['$totalSessions', 0] },
              { $multiply: [{ $divide: ['$completedSessions', '$totalSessions'] }, 100] },
              0,
            ],
          },
          averageDuration: {
            $cond: [
              { $gt: ['$totalSessions', 0] },
              { $divide: ['$totalDuration', '$totalSessions'] },
              0,
            ],
          },
          totalPoints: 1,
          averagePoints: {
            $cond: [
              { $gt: ['$totalSessions', 0] },
              { $divide: ['$totalPoints', '$totalSessions'] },
              0,
            ],
          },
        },
      },
      // Sort by period and game
      { $sort: { '_id.period': 1, '_id.gameId': 1 } },
    ]);

    return results.map((r) => ({
      period,
      date: parsePeriodToDate(r._id.period, period),
      brandId,
      gameId: r._id.gameId,
      totalSessions: r.totalSessions,
      completedSessions: r.completedSessions,
      completionRate: Math.round(r.completionRate * 100) / 100,
      averageDuration: Math.round(r.averageDuration),
      totalPoints: r.totalPoints,
      averagePoints: Math.round(r.averagePoints),
    }));
  } catch (error) {
    logger.error({ error, brandId, period }, 'Failed to aggregate game sessions');
    throw error;
  }
}

/**
 * Calculate revenue metrics from reward redemptions
 */
export async function aggregateRevenue(
  brandId: string,
  period: TimePeriod,
  dateRange: DateRange
): Promise<RevenueMetric[]> {
  try {
    logger.info({ brandId, period, dateRange }, 'Aggregating revenue');

    const dateFormat = {
      daily: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
      weekly: { $dateToString: { format: '%Y-W%V', date: '$timestamp' } },
      monthly: { $dateToString: { format: '%Y-%m', date: '$timestamp' } },
    }[period];

    const results = await EventLog.aggregate([
      // Match reward_redeemed events in date range
      {
        $match: {
          eventType: 'reward_redeemed',
          'metadata.brandId': brandId,
          timestamp: { $gte: dateRange.start, $lte: dateRange.end },
        },
      },
      // Group by period
      {
        $group: {
          _id: dateFormat,
          totalRedemptions: { $sum: 1 },
          pointsRedeemed: { $sum: '$metadata.pointsCost' },
          uniqueRedeemers: { $addToSet: '$playerId' },
          rewardCounts: {
            $push: { rewardId: '$metadata.rewardId' },
          },
        },
      },
      // Calculate unique redeemers count
      {
        $project: {
          _id: 1,
          totalRedemptions: 1,
          pointsRedeemed: 1,
          uniqueRedeemers: { $size: '$uniqueRedeemers' },
          averageRedemptionValue: {
            $cond: [
              { $gt: ['$totalRedemptions', 0] },
              { $divide: ['$pointsRedeemed', '$totalRedemptions'] },
              0,
            ],
          },
          rewardCounts: 1,
        },
      },
      // Sort by period
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => {
      // Count reward occurrences
      const rewardMap = new Map<string, number>();
      r.rewardCounts.forEach((rc: any) => {
        const count = rewardMap.get(rc.rewardId) || 0;
        rewardMap.set(rc.rewardId, count + 1);
      });

      // Get top 5 rewards
      const topRewards = Array.from(rewardMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([rewardId, count]) => ({ rewardId, count }));

      return {
        period,
        date: parsePeriodToDate(r._id, period),
        brandId,
        totalRedemptions: r.totalRedemptions,
        pointsRedeemed: r.pointsRedeemed,
        uniqueRedeemers: r.uniqueRedeemers,
        averageRedemptionValue: Math.round(r.averageRedemptionValue),
        topRewards,
      };
    });
  } catch (error) {
    logger.error({ error, brandId, period }, 'Failed to aggregate revenue');
    throw error;
  }
}

/**
 * Calculate retention cohorts
 * 
 * Tracks what percentage of new users return after 1, 7, and 30 days.
 */
export async function aggregateRetentionCohorts(
  brandId: string,
  cohortStartDate: Date
): Promise<RetentionCohort> {
  try {
    logger.info({ brandId, cohortStartDate }, 'Aggregating retention cohorts');

    // Find new users in cohort period (e.g., users who registered on cohortStartDate)
    const cohortEndDate = new Date(cohortStartDate);
    cohortEndDate.setDate(cohortEndDate.getDate() + 1);

    const newUsersResult = await EventLog.aggregate([
      {
        $match: {
          eventType: 'player_registered',
          'metadata.brandId': brandId,
          timestamp: { $gte: cohortStartDate, $lt: cohortEndDate },
        },
      },
      {
        $group: {
          _id: null,
          userIds: { $addToSet: '$playerId' },
        },
      },
    ]);

    if (newUsersResult.length === 0) {
      return {
        cohortDate: cohortStartDate,
        brandId,
        newUsers: 0,
        retained1Day: 0,
        retained7Day: 0,
        retained30Day: 0,
        retention1DayRate: 0,
        retention7DayRate: 0,
        retention30DayRate: 0,
      };
    }

    const newUserIds = newUsersResult[0].userIds;
    const newUsers = newUserIds.length;

    // Calculate retention windows
    const day1Start = new Date(cohortStartDate);
    day1Start.setDate(day1Start.getDate() + 1);
    const day1End = new Date(day1Start);
    day1End.setDate(day1End.getDate() + 1);

    const day7Start = new Date(cohortStartDate);
    day7Start.setDate(day7Start.getDate() + 7);
    const day7End = new Date(day7Start);
    day7End.setDate(day7End.getDate() + 1);

    const day30Start = new Date(cohortStartDate);
    day30Start.setDate(day30Start.getDate() + 30);
    const day30End = new Date(day30Start);
    day30End.setDate(day30End.getDate() + 1);

    // Count retained users for each window
    const [retained1Day, retained7Day, retained30Day] = await Promise.all([
      countRetainedUsers(brandId, newUserIds, day1Start, day1End),
      countRetainedUsers(brandId, newUserIds, day7Start, day7End),
      countRetainedUsers(brandId, newUserIds, day30Start, day30End),
    ]);

    return {
      cohortDate: cohortStartDate,
      brandId,
      newUsers,
      retained1Day,
      retained7Day,
      retained30Day,
      retention1DayRate: Math.round((retained1Day / newUsers) * 10000) / 100,
      retention7DayRate: Math.round((retained7Day / newUsers) * 10000) / 100,
      retention30DayRate: Math.round((retained30Day / newUsers) * 10000) / 100,
    };
  } catch (error) {
    logger.error({ error, brandId, cohortStartDate }, 'Failed to aggregate retention cohorts');
    throw error;
  }
}

/**
 * Helper to count retained users in a time window
 */
async function countRetainedUsers(
  brandId: string,
  userIds: string[],
  windowStart: Date,
  windowEnd: Date
): Promise<number> {
  const result = await EventLog.aggregate([
    {
      $match: {
        'metadata.brandId': brandId,
        playerId: { $in: userIds },
        timestamp: { $gte: windowStart, $lt: windowEnd },
      },
    },
    {
      $group: {
        _id: null,
        retainedUsers: { $addToSet: '$playerId' },
      },
    },
  ]);

  return result.length > 0 ? result[0].retainedUsers.length : 0;
}

/**
 * Calculate engagement metrics
 */
export async function aggregateEngagement(
  brandId: string,
  period: TimePeriod,
  dateRange: DateRange
): Promise<EngagementMetric[]> {
  try {
    logger.info({ brandId, period, dateRange }, 'Aggregating engagement');

    const dateFormat = {
      daily: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
      weekly: { $dateToString: { format: '%Y-W%V', date: '$timestamp' } },
      monthly: { $dateToString: { format: '%Y-%m', date: '$timestamp' } },
    }[period];

    const results = await EventLog.aggregate([
      // Match events in date range
      {
        $match: {
          'metadata.brandId': brandId,
          timestamp: { $gte: dateRange.start, $lte: dateRange.end },
        },
      },
      // Group by period
      {
        $group: {
          _id: dateFormat,
          totalSessions: {
            $sum: { $cond: [{ $eq: ['$eventType', 'game_played'] }, 1, 0] },
          },
          uniqueUsers: { $addToSet: '$playerId' },
          totalPlayTime: {
            $sum: {
              $cond: [
                { $eq: ['$eventType', 'game_played'] },
                { $ifNull: ['$metadata.duration', 0] },
                0,
              ],
            },
          },
          achievementUnlocks: {
            $sum: { $cond: [{ $eq: ['$eventType', 'achievement_unlocked'] }, 1, 0] },
          },
        },
      },
      // Calculate metrics
      {
        $project: {
          _id: 1,
          totalSessions: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          totalPlayTime: 1,
          achievementUnlocks: 1,
        },
      },
      {
        $project: {
          _id: 1,
          totalSessions: 1,
          uniqueUsers: 1,
          sessionsPerUser: {
            $cond: [
              { $gt: ['$uniqueUsers', 0] },
              { $divide: ['$totalSessions', '$uniqueUsers'] },
              0,
            ],
          },
          averageSessionDuration: {
            $cond: [
              { $gt: ['$totalSessions', 0] },
              { $divide: ['$totalPlayTime', '$totalSessions'] },
              0,
            ],
          },
          totalPlayTime: 1,
          achievementUnlocks: 1,
          achievementRate: {
            $cond: [
              { $gt: ['$uniqueUsers', 0] },
              { $divide: ['$achievementUnlocks', '$uniqueUsers'] },
              0,
            ],
          },
        },
      },
      // Sort by period
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      period,
      date: parsePeriodToDate(r._id, period),
      brandId,
      totalSessions: r.totalSessions,
      uniqueUsers: r.uniqueUsers,
      sessionsPerUser: Math.round(r.sessionsPerUser * 100) / 100,
      averageSessionDuration: Math.round(r.averageSessionDuration),
      totalPlayTime: r.totalPlayTime,
      achievementUnlocks: r.achievementUnlocks,
      achievementRate: Math.round(r.achievementRate * 100) / 100,
    }));
  } catch (error) {
    logger.error({ error, brandId, period }, 'Failed to aggregate engagement');
    throw error;
  }
}

/**
 * Calculate conversion metrics
 */
export async function aggregateConversions(
  brandId: string,
  period: TimePeriod,
  dateRange: DateRange
): Promise<ConversionMetric[]> {
  try {
    logger.info({ brandId, period, dateRange }, 'Aggregating conversions');

    const dateFormat = {
      daily: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
      weekly: { $dateToString: { format: '%Y-W%V', date: '$timestamp' } },
      monthly: { $dateToString: { format: '%Y-%m', date: '$timestamp' } },
    }[period];

    const results = await EventLog.aggregate([
      // Match relevant events in date range
      {
        $match: {
          'metadata.brandId': brandId,
          timestamp: { $gte: dateRange.start, $lte: dateRange.end },
          eventType: { $in: ['player_registered', 'premium_activated', 'achievement_unlocked'] },
        },
      },
      // Group by period
      {
        $group: {
          _id: dateFormat,
          freeUsers: {
            $sum: { $cond: [{ $eq: ['$eventType', 'player_registered'] }, 1, 0] },
          },
          premiumConversions: {
            $sum: { $cond: [{ $eq: ['$eventType', 'premium_activated'] }, 1, 0] },
          },
          achievementCompleters: {
            $addToSet: {
              $cond: [
                { $eq: ['$eventType', 'achievement_unlocked'] },
                '$playerId',
                null,
              ],
            },
          },
        },
      },
      // Calculate rates
      {
        $project: {
          _id: 1,
          freeUsers: 1,
          premiumConversions: 1,
          conversionRate: {
            $cond: [
              { $gt: ['$freeUsers', 0] },
              { $multiply: [{ $divide: ['$premiumConversions', '$freeUsers'] }, 100] },
              0,
            ],
          },
          achievementCompleters: {
            $size: {
              $filter: {
                input: '$achievementCompleters',
                as: 'user',
                cond: { $ne: ['$$user', null] },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          freeUsers: 1,
          premiumConversions: 1,
          conversionRate: 1,
          achievementCompleters: 1,
          achievementCompletionRate: {
            $cond: [
              { $gt: ['$freeUsers', 0] },
              { $multiply: [{ $divide: ['$achievementCompleters', '$freeUsers'] }, 100] },
              0,
            ],
          },
        },
      },
      // Sort by period
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      period,
      date: parsePeriodToDate(r._id, period),
      brandId,
      freeUsers: r.freeUsers,
      premiumConversions: r.premiumConversions,
      conversionRate: Math.round(r.conversionRate * 100) / 100,
      achievementCompleters: r.achievementCompleters,
      achievementCompletionRate: Math.round(r.achievementCompletionRate * 100) / 100,
    }));
  } catch (error) {
    logger.error({ error, brandId, period }, 'Failed to aggregate conversions');
    throw error;
  }
}

/**
 * Helper to parse period string back to Date
 */
function parsePeriodToDate(periodStr: string, period: TimePeriod): Date {
  if (period === 'daily') {
    return new Date(periodStr);
  } else if (period === 'weekly') {
    // Format is 'YYYY-WNN', parse to first day of week
    const [year, week] = periodStr.split('-W');
    const date = new Date(parseInt(year), 0, 1);
    date.setDate(date.getDate() + (parseInt(week) - 1) * 7);
    return date;
  } else {
    // Monthly format is 'YYYY-MM'
    return new Date(periodStr + '-01');
  }
}
