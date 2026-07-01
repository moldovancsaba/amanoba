/**
 * Report a discussion post (#30)
 *
 * POST /api/courses/[courseId]/discussion/[postId]/report  body: { reason?: string }
 * Auth required. One report per reporter per post (re-reporting updates it).
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { DiscussionPost, DiscussionReport } from '@/lib/models';
import { logger } from '@/lib/logger';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; postId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    const user = session?.user as { id?: string; playerId?: string } | undefined;
    const playerId = user?.playerId || user?.id;
    if (!playerId || !mongoose.isValidObjectId(playerId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, postId } = await params;
    if (!mongoose.isValidObjectId(postId)) {
      return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
    }

    await connectDB();
    const post = await DiscussionPost.findById(postId).select('_id courseId').lean();
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const reason = String(body.reason ?? '').trim().slice(0, 500);

    await DiscussionReport.findOneAndUpdate(
      { postId: new mongoose.Types.ObjectId(postId), reporter: new mongoose.Types.ObjectId(playerId) },
      {
        $set: { reason, status: 'open' },
        $setOnInsert: { courseId: (post as { courseId?: string }).courseId || courseId.toUpperCase() },
      },
      { upsert: true, new: true }
    );

    logger.info({ postId, reporter: playerId }, 'Discussion post reported');
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to report discussion post');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
