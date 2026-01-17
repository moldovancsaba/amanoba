/**
 * Daily Lesson Email Scheduler Cron Job
 * 
 * What: Scheduled endpoint to send daily lesson emails to all active students
 * Why: Automates lesson delivery at the right time for each student
 * 
 * Schedule: Configure in Vercel Cron Jobs (recommended: daily at 8:00 AM UTC)
 * Security: Protected by CRON_SECRET authorization header
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { sendDailyLessons } from '@/lib/courses/email-scheduler';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/cron/send-daily-lessons
 * 
 * What: Triggers daily lesson email sending
 * Why: Called by Vercel Cron or external scheduler
 * 
 * Security: Protected by CRON_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Security: Verify cron secret
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.warn('Unauthorized daily lesson email cron job attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logger.info('Starting daily lesson email cron job');

    // Optional: Get target date from query params (for testing/manual triggers)
    const { searchParams } = new URL(request.url);
    const targetDateParam = searchParams.get('date');
    const targetDate = targetDateParam ? new Date(targetDateParam) : undefined;

    // Send daily lessons
    const result = await sendDailyLessons(targetDate);

    logger.info(
      { sent: result.sent, skipped: result.skipped, errors: result.errors },
      'Daily lesson email cron job completed'
    );

    return NextResponse.json({
      success: result.success,
      message: `Sent ${result.sent} emails, skipped ${result.skipped}, ${result.errors} errors`,
      sent: result.sent,
      skipped: result.skipped,
      errors: result.errors,
      details: result.details,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Daily lesson email cron job failed');

    return NextResponse.json(
      {
        error: 'Failed to send daily lesson emails',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/send-daily-lessons
 * 
 * What: Manual trigger for testing (development only)
 * Why: Allows manual email sending during development
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
