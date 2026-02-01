/**
 * Admin Vote Aggregates API
 *
 * GET: List vote aggregates (optionally by targetType). Admin only.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { PipelineStage } from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { ContentVote } from '@/lib/models';
import { requireAdmin } from '@/lib/rbac';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const targetType = searchParams.get('targetType'); // optional: course | lesson | question

    const match: Record<string, string> = {};
    if (targetType && ['course', 'lesson', 'question', 'discussion_post'].includes(targetType)) {
      match.targetType = targetType;
    }

    const pipeline: PipelineStage[] = [{ $match: Object.keys(match).length ? match : {} }];
    pipeline.push({
      $group: {
        _id: { targetType: '$targetType', targetId: '$targetId' },
        sum: { $sum: '$value' },
        up: { $sum: { $cond: [{ $eq: ['$value', 1] }, 1, 0] } },
        down: { $sum: { $cond: [{ $eq: ['$value', -1] }, 1, 0] } },
        count: { $sum: 1 },
      },
    });
    pipeline.push({ $sort: { sum: -1, count: -1 } });
    pipeline.push({ $limit: 500 });

    const aggregates = await ContentVote.aggregate(pipeline);

    const list = aggregates.map((a: { _id: { targetType: string; targetId: string }; sum: number; up: number; down: number; count: number }) => ({
      targetType: a._id.targetType,
      targetId: a._id.targetId,
      sum: a.sum,
      up: a.up,
      down: a.down,
      count: a.count,
    }));

    return NextResponse.json({ success: true, aggregates: list });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to get vote aggregates' }, { status: 500 });
  }
}
