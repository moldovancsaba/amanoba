/**
 * Analytics Snapshot Cron Job API
 * 
 * Scheduled endpoint that runs aggregation pipelines and stores results
 * in AnalyticsSnapshot collection for fast dashboard queries.
 * 
 * Designed to be called by external cron services (e.g., Vercel Cron, GitHub Actions).
 * Protected by Authorization header with bearer token.
 * 
 * Schedule recommendations:
 * - Daily snapshots: Run at 00:00 UTC
 * - Weekly snapshots: Run on Mondays at 00:00 UTC
 * - Monthly snapshots: Run on 1st of month at 00:00 UTC
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  aggregateActiveUsers,
  aggregateGameSessions,
  aggregateRevenue,
  aggregateRetentionCohorts,
  aggregateEngagement,
  aggregateConversions,
  TimePeriod,
} from '../../../lib/analytics';
import { AnalyticsSnapshot, Brand } from '../../../lib/models';
import { logger } from '../../../lib/logger';
import connectDB from '../../../lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/cron/analytics-snapshot
 * 
 * Runs analytics aggregations and stores snapshots for all brands.
 * 
 * Query params:
 * - period: 'daily' | 'weekly' | 'monthly' (required)
 * 
 * Headers:
 * - Authorization: Bearer <CRON_SECRET> (required)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify authorization
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const expectedToken = process.env.CRON_SECRET || 'dev-cron-secret';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Analytics cron: Missing or invalid authorization header');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (token !== expectedToken) {
      logger.warn('Analytics cron: Invalid token');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as TimePeriod;

    if (!period || !['daily', 'weekly', 'monthly'].includes(period)) {
      return NextResponse.json(
        { success: false, error: 'Invalid period. Must be daily, weekly, or monthly.' },
        { status: 400 }
      );
    }

    logger.info({ period }, 'Analytics snapshot cron started');

    // Connect to database
    await connectDB();

    // Calculate date range based on period
    const now = new Date();
    const dateRange = calculateDateRange(period, now);

    logger.info({ period, dateRange }, 'Calculated date range');

    // Get all brands to process
    const brands = await Brand.find({ isActive: true });

    if (brands.length === 0) {
      logger.warn('No active brands found');
      return NextResponse.json({
        success: true,
        message: 'No active brands to process',
        duration: Date.now() - startTime,
      });
    }

    const results: Array<{
      brandId: string;
      brandName: string;
      snapshotsCreated?: number;
      success: boolean;
      error?: string;
    }> = [];

    // Process each brand
    for (const brand of brands) {
      try {
        const brandId = String(brand._id);
        logger.info({ brandId }, `Processing brand: ${brand.name}`);

        // Run all aggregations in parallel
        const [
          activeUsers,
          gameSessions,
          revenue,
          engagement,
          conversions,
        ] = await Promise.all([
          aggregateActiveUsers(brandId, period, dateRange),
          aggregateGameSessions(brandId, period, dateRange),
          aggregateRevenue(brandId, period, dateRange),
          aggregateEngagement(brandId, period, dateRange),
          aggregateConversions(brandId, period, dateRange),
        ]);

        // Store snapshots
        const snapshots = [];

        // Active users snapshots
        for (const metric of activeUsers) {
          snapshots.push({
            brandId: brand._id,
            metricType: 'active_users',
            period: metric.period,
            date: metric.date,
            data: {
              totalUsers: metric.totalUsers,
              newUsers: metric.newUsers,
              returningUsers: metric.returningUsers,
              premiumUsers: metric.premiumUsers,
            },
          });
        }

        // Game session snapshots
        for (const metric of gameSessions) {
          snapshots.push({
            brandId: brand._id,
            metricType: 'game_sessions',
            period: metric.period,
            date: metric.date,
            gameId: metric.gameId,
            data: {
              totalSessions: metric.totalSessions,
              completedSessions: metric.completedSessions,
              completionRate: metric.completionRate,
              averageDuration: metric.averageDuration,
              totalPoints: metric.totalPoints,
              averagePoints: metric.averagePoints,
            },
          });
        }

        // Revenue snapshots
        for (const metric of revenue) {
          snapshots.push({
            brandId: brand._id,
            metricType: 'revenue',
            period: metric.period,
            date: metric.date,
            data: {
              totalRedemptions: metric.totalRedemptions,
              pointsRedeemed: metric.pointsRedeemed,
              uniqueRedeemers: metric.uniqueRedeemers,
              averageRedemptionValue: metric.averageRedemptionValue,
              topRewards: metric.topRewards,
            },
          });
        }

        // Engagement snapshots
        for (const metric of engagement) {
          snapshots.push({
            brandId: brand._id,
            metricType: 'engagement',
            period: metric.period,
            date: metric.date,
            data: {
              totalSessions: metric.totalSessions,
              uniqueUsers: metric.uniqueUsers,
              sessionsPerUser: metric.sessionsPerUser,
              averageSessionDuration: metric.averageSessionDuration,
              totalPlayTime: metric.totalPlayTime,
              achievementUnlocks: metric.achievementUnlocks,
              achievementRate: metric.achievementRate,
            },
          });
        }

        // Conversion snapshots
        for (const metric of conversions) {
          snapshots.push({
            brandId: brand._id,
            metricType: 'conversions',
            period: metric.period,
            date: metric.date,
            data: {
              freeUsers: metric.freeUsers,
              premiumConversions: metric.premiumConversions,
              conversionRate: metric.conversionRate,
              achievementCompleters: metric.achievementCompleters,
              achievementCompletionRate: metric.achievementCompletionRate,
            },
          });
        }

        // Calculate retention cohorts for yesterday if period is daily
        if (period === 'daily') {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);

          const retentionCohort = await aggregateRetentionCohorts(
            brandId,
            yesterday
          );

          if (retentionCohort.newUsers > 0) {
            snapshots.push({
              brandId: brand._id,
              metricType: 'retention_cohort',
              period: 'daily',
              date: retentionCohort.cohortDate,
              data: {
                newUsers: retentionCohort.newUsers,
                retained1Day: retentionCohort.retained1Day,
                retained7Day: retentionCohort.retained7Day,
                retained30Day: retentionCohort.retained30Day,
                retention1DayRate: retentionCohort.retention1DayRate,
                retention7DayRate: retentionCohort.retention7DayRate,
                retention30DayRate: retentionCohort.retention30DayRate,
              },
            });
          }
        }

        // Bulk upsert snapshots
        if (snapshots.length > 0) {
          for (const snapshot of snapshots) {
            await AnalyticsSnapshot.findOneAndUpdate(
              {
                brandId: snapshot.brandId,
                metricType: snapshot.metricType,
                period: snapshot.period,
                date: snapshot.date,
                gameId: snapshot.gameId || null,
              },
              snapshot,
              { upsert: true, new: true }
            );
          }

          logger.info(
            { brandId, snapshotCount: snapshots.length },
            'Snapshots stored successfully'
          );
        }

        results.push({
          brandId,
          brandName: brand.name,
          snapshotsCreated: snapshots.length,
          success: true,
        });
      } catch (error) {
        const brandId = String(brand._id);
        logger.error(
          { error, brandId },
          `Failed to process brand: ${brand.name}`
        );
        results.push({
          brandId,
          brandName: brand.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const duration = Date.now() - startTime;

    logger.info(
      { period, brandCount: brands.length, duration },
      'Analytics snapshot cron completed'
    );

    return NextResponse.json({
      success: true,
      period,
      brandsProcessed: brands.length,
      results,
      duration,
    });
  } catch (error) {
    logger.error({ error }, 'Analytics snapshot cron failed');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate date range based on period type
 * 
 * - Daily: Yesterday (full day)
 * - Weekly: Last full week (Monday to Sunday)
 * - Monthly: Last full month
 */
function calculateDateRange(period: TimePeriod, now: Date): { start: Date; end: Date } {
  const start = new Date(now);
  const end = new Date(now);

  if (period === 'daily') {
    // Yesterday
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'weekly') {
    // Last full week (Monday to Sunday)
    const dayOfWeek = now.getDay();
    const daysToLastSunday = dayOfWeek === 0 ? 7 : dayOfWeek;
    end.setDate(end.getDate() - daysToLastSunday);
    end.setHours(23, 59, 59, 999);
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else {
    // Last full month
    start.setMonth(start.getMonth() - 1);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(end.getMonth(), 0); // Last day of previous month
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
}
