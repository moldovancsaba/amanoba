/**
 * Admin MailerLite bulk sync (#17)
 *
 * POST /api/admin/email/mailerlite-sync — sync players with an email into MailerLite.
 * Body: { limit?: number }  (default 500, max 2000 per call)
 *
 * Admin only. No-op (409) if MailerLite is not configured.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { isMailerLiteConfigured, upsertMailerLiteSubscriber } from '@/lib/email/mailerlite';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    if (!isMailerLiteConfigured()) {
      return NextResponse.json({ error: 'MailerLite is not configured (set MAILERLITE_API_KEY)' }, { status: 409 });
    }

    const body = await request.json().catch(() => ({}));
    const limit = Math.min(2000, Math.max(1, parseInt(String(body.limit ?? 500), 10) || 500));

    await connectDB();
    const players = await Player.find({ email: { $exists: true, $ne: null } })
      .select('email displayName')
      .limit(limit)
      .lean();

    let synced = 0;
    let failed = 0;
    // Sequential to stay within MailerLite rate limits (naive; fine for periodic admin sync).
    for (const p of players) {
      const email = (p as { email?: string }).email;
      if (!email) continue;
      const ok = await upsertMailerLiteSubscriber({ email, name: (p as { displayName?: string }).displayName });
      if (ok) synced++; else failed++;
    }

    logger.info({ candidates: players.length, synced, failed }, 'MailerLite bulk sync completed');
    return NextResponse.json({ success: true, candidates: players.length, synced, failed });
  } catch (error) {
    logger.error({ error }, 'MailerLite bulk sync failed');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
