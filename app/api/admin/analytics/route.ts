/**
 * Admin Analytics API
 * 
 * REST endpoints for fetching pre-aggregated analytics data from AnalyticsSnapshot.
 * Used by admin dashboard to display charts and metrics.
 * 
 * Requires authentication (to be integrated with auth middleware).
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import mongoose from 'mongoose';
import { AnalyticsSnapshot } from '../../../lib/models';
import { logger } from '../../../lib/logger';
import connectDB from '../../../lib/mongodb';

/**
 * GET /api/admin/analytics?brandId=xxx&metricType=xxx&period=xxx&startDate=xxx&endDate=xxx
 * 
 * Fetches analytics snapshots for dashboard display.
 * 
 * Query params:
 * - brandId: Brand ID (required)
 * - metricType: 'active_users' | 'game_sessions' | 'revenue' | 'engagement' | 'conversions' | 'retention_cohort' (required)
 * - period: 'daily' | 'weekly' | 'monthly' (required)
 * - startDate: ISO date string (optional, defaults to 30 days ago)
 * - endDate: ISO date string (optional, defaults to today)
 * - gameId: Game ID for game_sessions metric (optional)
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
    
    // Parse and validate query params
    const brandId = searchParams.get('brandId');
    const metricType = searchParams.get('metricType');
    const period = searchParams.get('period');
    const gameId = searchParams.get('gameId');
    
    if (!brandId || !metricType || !period) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: brandId, metricType, period' },
        { status: 400 }
      );
    }

    const validMetricTypes = ['active_users', 'game_sessions', 'revenue', 'engagement', 'conversions', 'retention_cohort'];
    if (!validMetricTypes.includes(metricType)) {
      return NextResponse.json(
        { success: false, error: `Invalid metricType. Must be one of: ${validMetricTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const validPeriods = ['daily', 'weekly', 'monthly'];
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { success: false, error: 'Invalid period. Must be daily, weekly, or monthly' },
        { status: 400 }
      );
    }

    // Parse date range
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setDate(defaultStart.getDate() - 30);
    
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : defaultStart;
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : now;

    logger.info({ brandId, metricType, period, startDate, endDate }, 'Fetching analytics snapshots');

    // Build query
    const query: Record<string, unknown> = {
      brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: false },
      metricType,
      period,
      date: { $gte: startDate, $lte: endDate },
    };

    if (gameId && metricType === 'game_sessions') {
      query.gameId = gameId;
    }

    // Fetch snapshots
    const snapshots = await AnalyticsSnapshot.find(query)
      .sort({ date: 1 })
      .lean();

    logger.info({ count: snapshots.length }, 'Fetched analytics snapshots');

    return NextResponse.json({
      success: true,
      data: snapshots,
      count: snapshots.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch analytics snapshots');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
