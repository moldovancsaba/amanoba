/**
 * Admin Course Live Sessions API (#23)
 *
 * GET  /api/admin/courses/[courseId]/live-sessions — list sessions for a course
 * POST /api/admin/courses/[courseId]/live-sessions — create a session
 *
 * Access: admin (any course) or editor assigned to the course.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { z } from 'zod';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, LiveSession } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const httpUrl = z.string().url().refine((u) => /^https?:\/\//i.test(u), 'Must be an http(s) URL');

const CreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  provider: z.enum(['manual', 'zoom', 'meet', 'other']).default('manual'),
  joinUrl: httpUrl,
  scheduledStartAt: z.string().datetime(),
  scheduledEndAt: z.string().datetime().optional(),
  timezone: z.string().trim().max(64).optional(),
});

async function loadCourseWithAccess(request: NextRequest, courseId: string) {
  const session = (await auth()) as Session | null;
  const denied = await requireAdminOrEditor(request, session);
  if (denied) return { denied };
  const course = await Course.findOne({ courseId }).lean();
  if (!course) return { denied: NextResponse.json({ error: 'Course not found' }, { status: 404 }) };
  if (!isAdmin(session) && !canAccessCourse(course as Parameters<typeof canAccessCourse>[0], getPlayerIdFromSession(session))) {
    return { denied: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { course: course as { _id: unknown; brandId?: unknown }, session };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    await connectDB();
    const { courseId } = await params;
    const { denied, course } = await loadCourseWithAccess(request, courseId);
    if (denied) return denied;

    const sessions = await LiveSession.find({ courseId: course!._id })
      .sort({ scheduledStartAt: 1 })
      .lean();
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    logger.error({ error }, 'Failed to list live sessions');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    await connectDB();
    const { courseId } = await params;
    const { denied, course, session } = await loadCourseWithAccess(request, courseId);
    if (denied) return denied;

    const parsed = CreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }
    const data = parsed.data;

    const created = await LiveSession.create({
      courseId: course!._id,
      brandId: course!.brandId,
      title: data.title,
      description: data.description,
      provider: data.provider,
      joinUrl: data.joinUrl,
      scheduledStartAt: new Date(data.scheduledStartAt),
      scheduledEndAt: data.scheduledEndAt ? new Date(data.scheduledEndAt) : undefined,
      timezone: data.timezone,
      status: 'scheduled',
      createdBy: getPlayerIdFromSession(session!) || undefined,
    });

    logger.info({ courseId, sessionId: created._id }, 'Live session created');
    return NextResponse.json({ success: true, session: created }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Failed to create live session');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
