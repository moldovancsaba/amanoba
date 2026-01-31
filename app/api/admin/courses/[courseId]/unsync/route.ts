/**
 * Admin Course Unsync API
 *
 * What: Mark a child course as out of sync (selective unsync for admin control and sync alerts).
 * Why: Enables selective unsync for child courses per ROADMAP.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course } from '@/lib/models';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) return accessCheck;

    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    if (!(course as { parentCourseId?: string }).parentCourseId) {
      return NextResponse.json(
        { error: 'Not a child course', message: 'Unsync applies only to child (short) courses' },
        { status: 400 }
      );
    }
    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    const updated = await Course.findOneAndUpdate(
      { courseId },
      { $set: { syncStatus: 'out_of_sync' } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    logger.info({ courseId }, 'Admin marked child course as out of sync');

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to mark course unsync');
    return NextResponse.json({ error: 'Failed to mark course unsync' }, { status: 500 });
  }
}
