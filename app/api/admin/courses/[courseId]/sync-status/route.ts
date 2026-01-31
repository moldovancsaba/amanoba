/**
 * Admin Course Sync Status API
 *
 * What: Return computed sync status for a child course (for admin preview and sync alerts).
 * Why: Enables admin tooling for sync alerts per ROADMAP.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course } from '@/lib/models';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';
import { getChildSyncStatus } from '@/lib/course-helpers';

export async function GET(
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
        { error: 'Not a child course', message: 'Sync status applies only to child (short) courses' },
        { status: 400 }
      );
    }
    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    const status = await getChildSyncStatus(course as { parentCourseId?: string; selectedLessonIds?: string[]; syncStatus?: string; lastSyncedAt?: Date });
    if (!status) {
      return NextResponse.json(
        { error: 'Could not compute sync status', message: 'Child has no selected lessons' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      syncStatus: (course as { syncStatus?: string }).syncStatus ?? null,
      lastSyncedAt: (course as { lastSyncedAt?: Date }).lastSyncedAt ?? null,
      computedStatus: status.status,
      missingLessonIds: status.missingLessonIds ?? [],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get sync status' }, { status: 500 });
  }
}
