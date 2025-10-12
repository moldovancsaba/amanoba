/**
 * Leaderboard Calculation Cron Job API
 * 
 * What: Scheduled endpoint to recalculate all leaderboards
 * Why: Keeps rankings up-to-date without manual intervention
 * 
 * Usage: Configure Vercel Cron Jobs or external scheduler to hit this endpoint daily
 * Schedule: Recommended daily at 00:00 UTC
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateAllLeaderboards } from '@/lib/gamification/leaderboard-calculator';
import connectDB from '@/lib/mongodb';
import logger from '@/lib/logger';

/**
 * POST /api/cron/calculate-leaderboards
 * 
 * What: Triggers leaderboard recalculation
 * Why: Updates all leaderboard rankings
 * 
 * Security: Should be protected by Vercel Cron secret or API key
 */
export async function POST(request: NextRequest) {
  try {
    // Security: Verify cron secret (if provided)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.warn('Unauthorized cron job attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logger.info('Starting leaderboard calculation cron job');

    // Connect to database
    await connectDB();

    // Calculate all leaderboards
    const result = await calculateAllLeaderboards();

    logger.info({ result }, 'Leaderboard calculation cron job completed');

    return NextResponse.json({
      success: result.success,
      message: `Calculated ${result.calculated} leaderboards, ${result.errors} errors`,
      calculated: result.calculated,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Leaderboard calculation cron job failed');
    
    return NextResponse.json(
      { 
        error: 'Failed to calculate leaderboards',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/calculate-leaderboards
 * 
 * What: Manual trigger for testing (optional)
 * Why: Allows manual leaderboard recalculation during development
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'GET method not allowed in production' },
      { status: 405 }
    );
  }

  return POST(request);
}
