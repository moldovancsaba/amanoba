/**
 * Admin Discussion Moderation API (#30)
 *
 * GET  /api/admin/discussion/reports        — list open reports (grouped by post) with previews
 * POST /api/admin/discussion/reports        — bulk moderation:
 *      { action: 'hide'|'unhide'|'delete', postIds: string[] }
 *      { action: 'dismiss', reportIds: string[] }
 *
 * Admin only.
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { DiscussionPost, DiscussionReport } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();

    const reports = await DiscussionReport.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('reporter', 'displayName')
      .lean();

    const postIds = [...new Set(reports.map((r) => String((r as { postId: unknown }).postId)))];
    const posts = await DiscussionPost.find({ _id: { $in: postIds } })
      .populate('author', 'displayName')
      .lean();
    const postsById = new Map(posts.map((p) => [String(p._id), p]));

    const items = reports.map((r) => {
      const post = postsById.get(String((r as { postId: unknown }).postId));
      return {
        reportId: r._id,
        postId: (r as { postId: unknown }).postId,
        reason: (r as { reason?: string }).reason || '',
        reporter: (r as { reporter?: { displayName?: string } }).reporter?.displayName || 'Anonymous',
        createdAt: (r as { createdAt?: Date }).createdAt,
        post: post
          ? {
              body: (post as { body?: string }).body || '',
              hiddenByAdmin: (post as { hiddenByAdmin?: boolean }).hiddenByAdmin || false,
              courseId: (post as { courseId?: string }).courseId,
              author: (post as { author?: { displayName?: string } }).author?.displayName || 'Anonymous',
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, reports: items });
  } catch (error) {
    logger.error({ error }, 'Failed to list discussion reports');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();
    const body = await request.json().catch(() => ({}));
    const action = String(body.action || '');

    if (action === 'dismiss') {
      const reportIds = (Array.isArray(body.reportIds) ? body.reportIds : []).filter((id: unknown) => typeof id === 'string' && mongoose.isValidObjectId(id));
      if (reportIds.length === 0) return NextResponse.json({ error: 'reportIds required' }, { status: 400 });
      const res = await DiscussionReport.updateMany({ _id: { $in: reportIds } }, { $set: { status: 'dismissed' } });
      return NextResponse.json({ success: true, updated: res.modifiedCount });
    }

    const postIds = (Array.isArray(body.postIds) ? body.postIds : []).filter((id: unknown) => typeof id === 'string' && mongoose.isValidObjectId(id));
    if (postIds.length === 0) return NextResponse.json({ error: 'postIds required' }, { status: 400 });
    const objectIds = postIds.map((id: string) => new mongoose.Types.ObjectId(id));

    if (action === 'hide' || action === 'unhide') {
      await DiscussionPost.updateMany({ _id: { $in: objectIds } }, { $set: { hiddenByAdmin: action === 'hide' } });
      // Resolve related open reports once the post is actioned.
      await DiscussionReport.updateMany({ postId: { $in: objectIds }, status: 'open' }, { $set: { status: 'reviewed' } });
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      // Delete the posts and any direct replies to them, plus their reports.
      await DiscussionPost.deleteMany({ $or: [{ _id: { $in: objectIds } }, { parentPostId: { $in: objectIds } }] });
      await DiscussionReport.deleteMany({ postId: { $in: objectIds } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    logger.error({ error }, 'Failed to moderate discussion');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
