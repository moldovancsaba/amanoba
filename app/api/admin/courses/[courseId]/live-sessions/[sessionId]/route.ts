/**
 * Admin Course Live Session item API (#23)
 *
 * PATCH  /api/admin/courses/[courseId]/live-sessions/[sessionId] — update
 * DELETE /api/admin/courses/[courseId]/live-sessions/[sessionId] — remove
 *
 * Access: admin (any course) or editor assigned to the course.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { z } from 'zod';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, LiveSession } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const httpUrl = z.string().url().refine((u) => /^https?:\/\//i.test(u), 'Must be an http(s) URL');

const UpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  provider: z.enum(['manual', 'zoom', 'meet', 'other']).optional(),
  joinUrl: httpUrl.optional(),
  scheduledStartAt: z.string().datetime().optional(),
  scheduledEndAt: z.string().datetime().nullable().optional(),
  timezone: z.string().trim().max(64).optional(),
  status: z.enum(['scheduled', 'live', 'ended', 'cancelled']).optional(),
});

async function authorize(request: NextRequest, courseId: string, sessionId: string) {
  const session = (await auth()) as Session | null;
  const denied = await requireAdminOrEditor(request, session);
  if (denied) return { denied };
  if (!mongoose.isValidObjectId(sessionId)) {
    return { denied: NextResponse.json({ error: 'Invalid session id' }, { status: 400 }) };
  }
  const course = await Course.findOne({ courseId }).lean();
  if (!course) return { denied: NextResponse.json({ error: 'Course not found' }, { status: 404 }) };
  if (!isAdmin(session) && !canAccessCourse(course as Parameters<typeof canAccessCourse>[0], getPlayerIdFromSession(session))) {
    return { denied: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { course: course as { _id: unknown } };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; sessionId: string }> }
) {
  try {
    await connectDB();
    const { courseId, sessionId } = await params;
    const { denied, course } = await authorize(request, courseId, sessionId);
    if (denied) return denied;

    const parsed = UpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }
    const d = parsed.data;
    const update: Record<string, unknown> = {};
    if (d.title !== undefined) update.title = d.title;
    if (d.description !== undefined) update.description = d.description;
    if (d.provider !== undefined) update.provider = d.provider;
    if (d.joinUrl !== undefined) update.joinUrl = d.joinUrl;
    if (d.scheduledStartAt !== undefined) update.scheduledStartAt = new Date(d.scheduledStartAt);
    if (d.scheduledEndAt !== undefined) update.scheduledEndAt = d.scheduledEndAt ? new Date(d.scheduledEndAt) : null;
    if (d.timezone !== undefined) update.timezone = d.timezone;
    if (d.status !== undefined) update.status = d.status;

    const updated = await LiveSession.findOneAndUpdate(
      { _id: sessionId, courseId: course!._id },
      { $set: update },
      { new: true }
    ).lean();
    if (!updated) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    logger.error({ error }, 'Failed to update live session');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; sessionId: string }> }
) {
  try {
    await connectDB();
    const { courseId, sessionId } = await params;
    const { denied, course } = await authorize(request, courseId, sessionId);
    if (denied) return denied;

    const deleted = await LiveSession.findOneAndDelete({ _id: sessionId, courseId: course!._id }).lean();
    if (!deleted) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to delete live session');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
