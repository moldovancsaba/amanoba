/**
 * Email Click Tracking
 *
 * What: Redirect endpoint for tracking email link clicks
 * Why: Records click and redirects to the target URL
 *
 * GET /api/email/click/[messageId]?url=<encoded-destination-url>
 * Returns: 302 redirect to url
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { EmailActivity } from '@/lib/models';
import { logger } from '@/lib/logger';
import { isValidUrl } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_REDIRECT_HOSTS = [
  'www.amanoba.com',
  'amanoba.com',
  'localhost',
  '127.0.0.1',
];

function isAllowedRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      ALLOWED_REDIRECT_HOSTS.includes(parsed.hostname)
    );
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { messageId } = await params;
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('url');

    if (!destination) {
      return NextResponse.redirect(new URL('/', request.url), 302);
    }

    const decoded = decodeURIComponent(destination);
    if (!isValidUrl(decoded) || !isAllowedRedirectUrl(decoded)) {
      return NextResponse.redirect(new URL('/', request.url), 302);
    }

    if (messageId) {
      await connectDB();

      const activity = await EmailActivity.findOne({ messageId });
      if (activity) {
        const update: { $set?: { clickedAt: Date }; $inc: { clickCount: number } } = { $inc: { clickCount: 1 } };
        if (!activity.clickedAt) update.$set = { clickedAt: new Date() };
        await EmailActivity.updateOne({ messageId }, update);
        logger.info(
          { messageId, emailType: activity.emailType, clickCount: (activity.clickCount || 0) + 1 },
          'Email click tracked'
        );
      }
    }

    return NextResponse.redirect(decoded, 302);
  } catch (error) {
    logger.error({ error }, 'Email click tracking failed');
    const fallback = request.nextUrl.origin;
    return NextResponse.redirect(fallback, 302);
  }
}
