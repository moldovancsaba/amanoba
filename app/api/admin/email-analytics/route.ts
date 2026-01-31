/**
 * Admin Email Analytics API
 *
 * What: Aggregates email sent/open/click for admin dashboard
 * Why: Enables segment-specific and type-specific email analytics
 *
 * GET /api/admin/email-analytics
 * Query: days? (default 30) — last N days
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { EmailActivity } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = Math.min(90, Math.max(1, parseInt(searchParams.get('days') || '30', 10) || 30));
    const since = new Date();
    since.setDate(since.getDate() - days);

    const activities = await EmailActivity.find({ sentAt: { $gte: since } })
      .select('emailType segment sentAt openedAt clickedAt clickCount')
      .lean();

    const total = activities.length;
    const opened = activities.filter((a) => a.openedAt).length;
    const clicked = activities.filter((a) => a.clickedAt).length;
    const totalClicks = activities.reduce((sum, a) => sum + (a.clickCount || 0), 0);

    const byType: Record<string, { sent: number; opened: number; clicked: number; clicks: number }> = {};
    const bySegment: Record<string, { sent: number; opened: number; clicked: number; clicks: number }> = {};

    for (const a of activities) {
      const type = a.emailType || 'unknown';
      if (!byType[type]) byType[type] = { sent: 0, opened: 0, clicked: 0, clicks: 0 };
      byType[type].sent += 1;
      if (a.openedAt) byType[type].opened += 1;
      if (a.clickedAt) byType[type].clicked += 1;
      byType[type].clicks += a.clickCount || 0;

      const seg = a.segment || 'unknown';
      if (!bySegment[seg]) bySegment[seg] = { sent: 0, opened: 0, clicked: 0, clicks: 0 };
      bySegment[seg].sent += 1;
      if (a.openedAt) bySegment[seg].opened += 1;
      if (a.clickedAt) bySegment[seg].clicked += 1;
      bySegment[seg].clicks += a.clickCount || 0;
    }

    const openRate = total > 0 ? Math.round((opened / total) * 100) : 0;
    const clickRate = total > 0 ? Math.round((clicked / total) * 100) : 0;

    logger.info({ days, total, opened, clicked }, 'Email analytics fetched');

    return NextResponse.json({
      success: true,
      period: { days, since: since.toISOString() },
      summary: {
        sent: total,
        opened,
        clicked,
        totalClicks,
        openRatePct: openRate,
        clickRatePct: clickRate,
      },
      byType: Object.entries(byType).map(([type, v]) => ({
        type,
        ...v,
        openRatePct: v.sent > 0 ? Math.round((v.opened / v.sent) * 100) : 0,
        clickRatePct: v.sent > 0 ? Math.round((v.clicked / v.sent) * 100) : 0,
      })),
      bySegment: Object.entries(bySegment).map(([segment, v]) => ({
        segment,
        ...v,
        openRatePct: v.sent > 0 ? Math.round((v.opened / v.sent) * 100) : 0,
        clickRatePct: v.sent > 0 ? Math.round((v.clicked / v.sent) * 100) : 0,
      })),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch email analytics');
    return NextResponse.json(
      { error: 'Failed to fetch email analytics' },
      { status: 500 }
    );
  }
}
