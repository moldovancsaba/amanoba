/**
 * Admin Course Re-sync API
 *
 * What: Re-sync a child course from its parent (validate selectedLessonIds, set syncStatus + lastSyncedAt).
 * Why: Enables selective re-sync for child courses per ROADMAP.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course } from '@/lib/models';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';
import { reSyncChildFromParent } from '@/lib/course-helpers';
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
        { error: 'Not a child course', message: 'Re-sync applies only to child (short) courses' },
        { status: 400 }
      );
    }
    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    const result = await reSyncChildFromParent(course as { _id?: unknown; courseId?: string; parentCourseId?: string; selectedLessonIds?: string[] });
    if (!result) {
      return NextResponse.json(
        { error: 'Re-sync failed', message: 'Parent course not found or child has no selected lessons' },
        { status: 400 }
      );
    }

    logger.info(
      { courseId, removedLessonIds: result.removedLessonIds.length },
      'Admin re-synced child course from parent'
    );

    return NextResponse.json({
      success: true,
      course: result.course,
      removedLessonIds: result.removedLessonIds,
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to re-sync child course');
    return NextResponse.json({ error: 'Failed to re-sync course' }, { status: 500 });
  }
}
