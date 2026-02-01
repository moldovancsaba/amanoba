/**
 * Single Discussion Post API
 *
 * PATCH: Edit own post (body) or admin set hiddenByAdmin.
 * DELETE: Delete own post or admin hide/delete.
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { DiscussionPost, Course } from '@/lib/models';
import { requireAdmin } from '@/lib/rbac';
import { logger } from '@/lib/logger';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getPlayerId(session: { user?: unknown } | null): mongoose.Types.ObjectId | null {
  const user = session?.user as { id?: string; playerId?: string } | undefined;
  const id = user?.playerId || user?.id;
  return id ? new mongoose.Types.ObjectId(id) : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; postId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, postId } = await params;
    const courseIdUpper = (courseId as string).toUpperCase().trim();

    const course = await Course.findOne({ courseId: courseIdUpper });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const post = await DiscussionPost.findOne({ _id: new mongoose.Types.ObjectId(postId), courseId: courseIdUpper });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const playerId = getPlayerId(session);
    const isAdmin = requireAdmin(request, session) === null;

    const body = await request.json().catch(() => ({}));

    if (isAdmin && typeof body.hiddenByAdmin === 'boolean') {
      post.hiddenByAdmin = body.hiddenByAdmin;
      await post.save();
      logger.info({ postId, hiddenByAdmin: post.hiddenByAdmin }, 'Discussion post moderation');
      return NextResponse.json({ success: true, post: { _id: post._id, hiddenByAdmin: post.hiddenByAdmin } });
    }

    if (!playerId || !post.author.equals(playerId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const newBody = String(body.body ?? '').trim();
    if (!newBody || newBody.length > 10000) {
      return NextResponse.json({ error: 'Body required (max 10000 chars)' }, { status: 400 });
    }

    post.body = newBody;
    await post.save();

    return NextResponse.json({ success: true, post: { _id: post._id, body: post.body } });
  } catch (error) {
    logger.error({ error }, 'Discussion post update failed');
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; postId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, postId } = await params;
    const courseIdUpper = (courseId as string).toUpperCase().trim();

    const course = await Course.findOne({ courseId: courseIdUpper });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const post = await DiscussionPost.findOne({ _id: new mongoose.Types.ObjectId(postId), courseId: courseIdUpper });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const playerId = getPlayerId(session);
    const adminCheck = requireAdmin(request, session);
    const isAdmin = adminCheck === null;

    if (isAdmin) {
      post.hiddenByAdmin = true;
      await post.save();
      logger.info({ postId }, 'Discussion post hidden by admin');
      return NextResponse.json({ success: true, hidden: true });
    }

    if (!playerId || !post.author.equals(playerId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await DiscussionPost.deleteOne({ _id: post._id });
    await DiscussionPost.deleteMany({ parentPostId: post._id });

    logger.info({ postId, authorId: playerId }, 'Discussion post deleted by author');
    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    logger.error({ error }, 'Discussion post delete failed');
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
