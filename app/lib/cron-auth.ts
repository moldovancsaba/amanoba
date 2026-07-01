/**
 * Cron Authorization
 *
 * What: Single fail-closed check for all /api/cron/* routes.
 * Why: The per-route checks drifted (one fell back to a hardcoded 'dev-cron-secret',
 *      others skipped auth entirely when CRON_SECRET was unset). This centralizes them
 *      so a missing/weak secret is rejected, not silently bypassed. (AUDIT-009)
 *
 * Vercel Cron: when CRON_SECRET is set, Vercel sends `Authorization: Bearer <CRON_SECRET>`.
 */

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { logger } from './logger';

/**
 * Returns a NextResponse to short-circuit the request when unauthorized,
 * or null when the caller is an authorized cron trigger.
 *
 * Fail-closed: if CRON_SECRET is missing or too short, every request is refused.
 */
export function verifyCronAuth(request: NextRequest, label: string): NextResponse | null {
  const secret = process.env.CRON_SECRET;

  // Fail closed: no usable secret means nobody is authorized (prevents open cron endpoints).
  if (!secret || secret.length < 16) {
    logger.error({ label }, 'CRON_SECRET missing or too short; refusing cron request');
    return NextResponse.json({ error: 'Cron endpoint not configured' }, { status: 500 });
  }

  const provided = request.headers.get('authorization') || '';
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);

  // Length-guard before timingSafeEqual (it throws on unequal lengths).
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    logger.warn({ label }, 'Unauthorized cron request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
