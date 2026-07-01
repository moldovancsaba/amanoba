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
      .select('emailType segment experimentId variant sentAt openedAt clickedAt clickCount')
      .lean();

    const total = activities.length;
    const opened = activities.filter((a) => a.openedAt).length;
    const clicked = activities.filter((a) => a.clickedAt).length;
    const totalClicks = activities.reduce((sum, a) => sum + (a.clickCount || 0), 0);

    type Bucket = { sent: number; opened: number; clicked: number; clicks: number };
    const byType: Record<string, Bucket> = {};
    const bySegment: Record<string, Bucket> = {};
    // A/B analytics (#11): experimentId -> variant (A/B) -> bucket
    const byExperiment: Record<string, Record<string, Bucket>> = {};

    const bump = (b: Bucket, a: (typeof activities)[number]) => {
      b.sent += 1;
      if (a.openedAt) b.opened += 1;
      if (a.clickedAt) b.clicked += 1;
      b.clicks += a.clickCount || 0;
    };

    for (const a of activities) {
      const type = a.emailType || 'unknown';
      if (!byType[type]) byType[type] = { sent: 0, opened: 0, clicked: 0, clicks: 0 };
      bump(byType[type], a);

      const seg = a.segment || 'unknown';
      if (!bySegment[seg]) bySegment[seg] = { sent: 0, opened: 0, clicked: 0, clicks: 0 };
      bump(bySegment[seg], a);

      if (a.experimentId && a.variant) {
        if (!byExperiment[a.experimentId]) byExperiment[a.experimentId] = {};
        const variants = byExperiment[a.experimentId];
        if (!variants[a.variant]) variants[a.variant] = { sent: 0, opened: 0, clicked: 0, clicks: 0 };
        bump(variants[a.variant], a);
      }
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
      byExperiment: Object.entries(byExperiment).map(([experimentId, variants]) => ({
        experimentId,
        variants: Object.entries(variants).map(([variant, v]) => ({
          variant,
          ...v,
          openRatePct: v.sent > 0 ? Math.round((v.opened / v.sent) * 100) : 0,
          clickRatePct: v.sent > 0 ? Math.round((v.clicked / v.sent) * 100) : 0,
        })),
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
