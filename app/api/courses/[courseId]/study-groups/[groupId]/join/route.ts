/**
 * Join Study Group API
 *
 * POST: Join a study group. Auth required.
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; groupId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, groupId } = await params;
    const courseIdUpper = (courseId as string).toUpperCase().trim();

    const course = await Course.findOne({ courseId: courseIdUpper });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const group = await StudyGroup.findOne({ _id: new mongoose.Types.ObjectId(groupId), courseId: courseIdUpper });
    if (!group) {
      return NextResponse.json({ error: 'Study group not found' }, { status: 404 });
    }

    const user = session.user as { id?: string; playerId?: string };
    const playerId = new mongoose.Types.ObjectId(user.playerId || user.id);

    const existing = await StudyGroupMembership.findOne({ groupId: group._id, playerId });
    if (existing) {
      return NextResponse.json({ success: true, alreadyMember: true });
    }

    if (group.capacity) {
      const count = await StudyGroupMembership.countDocuments({ groupId: group._id });
      if (count >= group.capacity) {
        return NextResponse.json({ error: 'Study group is full' }, { status: 400 });
      }
    }

    await StudyGroupMembership.create({
      groupId: group._id,
      playerId,
      role: 'member',
    });

    logger.info({ groupId: group._id, playerId }, 'Joined study group');
    return NextResponse.json({ success: true, joined: true });
  } catch (error) {
    logger.error({ error }, 'Study group join failed');
    return NextResponse.json({ error: 'Failed to join study group' }, { status: 500 });
  }
}
