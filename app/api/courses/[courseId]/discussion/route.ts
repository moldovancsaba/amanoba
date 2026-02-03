/**
 * Course Discussion API
 *
 * GET: List posts for course (optional lessonId). Excludes hidden unless admin.
 * POST: Create a post. Auth required.
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { DiscussionPost, Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await connectDB();
    const { courseId } = await params;
    const courseIdUpper = (courseId as string).toUpperCase().trim();
    const lessonId = request.nextUrl.searchParams.get('lessonId')?.trim() || undefined;

    const course = await Course.findOne({ courseId: courseIdUpper });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const session = await auth();
    const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';

    const filter: Record<string, unknown> = {
      courseId: courseIdUpper,
      parentPostId: null,
    };
    if (lessonId) filter.lessonId = lessonId;
    if (!isAdmin) filter.hiddenByAdmin = false;

    const posts = await DiscussionPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('author', 'displayName')
      .lean();

    const postIds = posts.map((p) => p._id);
    const replies = await DiscussionPost.find({
      parentPostId: { $in: postIds },
      ...(isAdmin ? {} : { hiddenByAdmin: false }),
    })
      .sort({ createdAt: 1 })
      .populate('author', 'displayName')
      .lean();

    type ReplyLean = {
      parentPostId?: mongoose.Types.ObjectId;
      author?: { _id?: unknown; displayName?: string };
      _id: unknown;
      body: string;
      createdAt: Date;
    };

    const repliesByParent = (replies as ReplyLean[]).reduce<Record<string, ReplyLean[]>>((acc, r) => {
      const pid = String((r as { parentPostId?: mongoose.Types.ObjectId }).parentPostId);
      if (!acc[pid]) acc[pid] = [];
      acc[pid].push(r);
      return acc;
    }, {});

    const list = posts.map((p) => ({
      ...p,
      authorId: (p as { author?: { _id?: unknown } }).author?._id ?? null,
      authorDisplayName: (p as { author?: { displayName?: string } }).author?.displayName ?? 'Anonymous',
      replies: (repliesByParent[String(p._id)] ?? []).map((r) => ({
        _id: r._id,
        body: r.body,
        createdAt: r.createdAt,
        authorId: r.author?._id ?? null,
        authorDisplayName: r.author?.displayName ?? 'Anonymous',
      })),
    }));

    return NextResponse.json({ success: true, posts: list });
  } catch (error) {
    logger.error({ error }, 'Discussion list failed');
    return NextResponse.json({ error: 'Failed to list discussion' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId } = await params;
    const courseIdUpper = (courseId as string).toUpperCase().trim();

    const course = await Course.findOne({ courseId: courseIdUpper });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const postBody = String(body.body ?? '').trim();
    const lessonId = body.lessonId ? String(body.lessonId).trim() : undefined;
    const parentPostId = body.parentPostId
      ? new mongoose.Types.ObjectId(String(body.parentPostId))
      : undefined;

    if (!postBody || postBody.length > 10000) {
      return NextResponse.json({ error: 'Body required (max 10000 chars)' }, { status: 400 });
    }

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const authorId = new mongoose.Types.ObjectId(playerId);

    const post = await DiscussionPost.create({
      courseId: courseIdUpper,
      lessonId: lessonId || undefined,
      author: authorId,
      parentPostId: parentPostId || null,
      body: postBody,
      hiddenByAdmin: false,
    });

    const populated = await DiscussionPost.findById(post._id).populate('author', 'displayName').lean();
    const authorDisplayName = (populated?.author as { displayName?: string })?.displayName ?? 'Anonymous';

    logger.info({ courseId: courseIdUpper, postId: post._id, authorId: playerId }, 'Discussion post created');

    return NextResponse.json({
      success: true,
      post: {
        ...populated,
        authorDisplayName,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Discussion post create failed');
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
