/**
 * Course Study Groups API
 *
 * GET: List study groups for course (with member count).
 * POST: Create a study group. Auth required.
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { StudyGroup, StudyGroupMembership, Course } from '@/lib/models';
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
    const session = await auth();
    await connectDB();
    const { courseId } = await params;
    const courseIdUpper = (courseId as string).toUpperCase().trim();

    const course = await Course.findOne({ courseId: courseIdUpper });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const groups = await StudyGroup.find({ courseId: courseIdUpper })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'displayName')
      .lean();

    const groupIds = groups.map((g) => g._id);
    const counts = await StudyGroupMembership.aggregate([
      { $match: { groupId: { $in: groupIds } } },
      { $group: { _id: '$groupId', count: { $sum: 1 } } },
    ]);
    const countByGroup = counts.reduce((acc, c) => {
      acc[String(c._id)] = c.count;
      return acc;
    }, {} as Record<string, number>);

    let myGroupIds: string[] = [];
    if (session?.user) {
      const user = session.user as { id?: string; playerId?: string };
      const playerId = user.playerId || user.id;
      if (playerId) {
        const myMemberships = await StudyGroupMembership.find({
          groupId: { $in: groupIds },
          playerId: new mongoose.Types.ObjectId(playerId),
        })
          .select('groupId')
          .lean();
        myGroupIds = myMemberships.map((m) => String((m as { groupId: mongoose.Types.ObjectId }).groupId));
      }
    }

    const list = groups.map((g) => ({
      ...g,
      createdByDisplayName: (g as { createdBy?: { displayName?: string } }).createdBy?.displayName ?? 'Anonymous',
      memberCount: countByGroup[String(g._id)] ?? 0,
      isMember: myGroupIds.includes(String(g._id)),
    }));

    return NextResponse.json({ success: true, groups: list });
  } catch (error) {
    logger.error({ error }, 'Study groups list failed');
    return NextResponse.json({ error: 'Failed to list study groups' }, { status: 500 });
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
    const name = String(body.name ?? '').trim();
    const capacity = typeof body.capacity === 'number' && body.capacity >= 2 ? body.capacity : undefined;

    if (!name || name.length > 120) {
      return NextResponse.json({ error: 'Name required (max 120 chars)' }, { status: 400 });
    }

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const createdBy = new mongoose.Types.ObjectId(playerId);

    const group = await StudyGroup.create({
      courseId: courseIdUpper,
      name,
      createdBy,
      capacity: capacity ?? undefined,
    });

    await StudyGroupMembership.create({
      groupId: group._id,
      playerId: createdBy,
      role: 'leader',
    });

    const populated = await StudyGroup.findById(group._id).populate('createdBy', 'displayName').lean();

    logger.info({ courseId: courseIdUpper, groupId: group._id, createdBy: playerId }, 'Study group created');

    return NextResponse.json({
      success: true,
      group: {
        ...populated,
        createdByDisplayName: (populated?.createdBy as { displayName?: string })?.displayName ?? 'Anonymous',
        memberCount: 1,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Study group create failed');
    return NextResponse.json({ error: 'Failed to create study group' }, { status: 500 });
  }
}
