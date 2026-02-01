/**
 * Leave Study Group API
 *
 * POST: Leave a study group. Auth required.
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

    const result = await StudyGroupMembership.deleteOne({ groupId: group._id, playerId });

    if (result.deletedCount) {
      logger.info({ groupId: group._id, playerId }, 'Left study group');
    }

    return NextResponse.json({ success: true, left: result.deletedCount > 0 });
  } catch (error) {
    logger.error({ error }, 'Study group leave failed');
    return NextResponse.json({ error: 'Failed to leave study group' }, { status: 500 });
  }
}
