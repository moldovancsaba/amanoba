/**
 * Study Group Members API
 *
 * GET: List members of a study group.
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { StudyGroup, StudyGroupMembership, Course } from '@/lib/models';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; groupId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
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

    const memberships = await StudyGroupMembership.find({ groupId: group._id })
      .sort({ joinedAt: 1 })
      .populate('playerId', 'displayName')
      .lean();

    const members = memberships.map((m) => ({
      playerId: (m as { playerId?: { _id: mongoose.Types.ObjectId; displayName?: string } }).playerId?._id,
      displayName: (m as { playerId?: { displayName?: string } }).playerId?.displayName ?? 'Anonymous',
      role: (m as { role?: string }).role,
      joinedAt: (m as { joinedAt?: Date }).joinedAt,
    }));

    return NextResponse.json({ success: true, members });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list members' }, { status: 500 });
  }
}
