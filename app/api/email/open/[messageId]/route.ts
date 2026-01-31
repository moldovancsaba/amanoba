/**
 * Email Open Tracking
 *
 * What: 1x1 pixel endpoint for tracking email opens
 * Why: Records when a recipient loads images in the email (open event)
 *
 * GET /api/email/open/[messageId]
 * Returns: 1x1 transparent GIF
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { EmailActivity } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** 1x1 transparent GIF (base64) */
const PIXEL_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { messageId } = await params;
    if (!messageId) {
      return new NextResponse(PIXEL_GIF, {
        status: 200,
        headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store' },
      });
    }

    await connectDB();

    const activity = await EmailActivity.findOne({ messageId }).lean();
    if (activity && !activity.openedAt) {
      await EmailActivity.updateOne(
        { messageId },
        { $set: { openedAt: new Date() } }
      );
      logger.info({ messageId, emailType: activity.emailType }, 'Email open tracked');
    }

    return new NextResponse(PIXEL_GIF, {
      status: 200,
      headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    logger.error({ error }, 'Email open tracking failed');
    return new NextResponse(PIXEL_GIF, {
      status: 200,
      headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store' },
    });
  }
}
