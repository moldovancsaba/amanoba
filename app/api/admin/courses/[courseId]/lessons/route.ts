/**
 * Admin Course Lessons API
 * 
 * What: REST endpoints for managing lessons within a course
 * Why: Allows admins to create, read, update, and delete lessons
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';
import mongoose from 'mongoose';

async function assertCourseAccess(
  request: NextRequest,
  session: Session | null,
  course: { createdBy?: { toString?: () => string } | string; assignedEditors?: Array<{ toString?: () => string } | string> } | null
): Promise<NextResponse | null> {
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  if (isAdmin(session)) return null;
  if (canAccessCourse(course, getPlayerIdFromSession(session))) return null;
  return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
}

/**
 * GET /api/admin/courses/[courseId]/lessons
 *
 * What: Get all lessons for a course (admins: any; editors: only their courses)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = (await auth()) as Session | null;
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId }).lean();
    const forbid = await assertCourseAccess(request, session, course as Parameters<typeof assertCourseAccess>[2]);
    if (forbid) return forbid;

    // Load course again for parent/child logic (need document for selectedLessonIds)
    const courseDoc = await Course.findOne({ courseId });
    if (!courseDoc) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    let lessons: Array<Record<string, unknown>>;
    if (courseDoc.parentCourseId && courseDoc.selectedLessonIds?.length) {
      // Child course: return parent lessons in selectedLessonIds order, with dayNumber 1..N
      const ids = courseDoc.selectedLessonIds
        .filter((id): id is string => typeof id === 'string' && !!id)
        .map((id) => new mongoose.Types.ObjectId(id));
      const byId = await Lesson.find({ _id: { $in: ids } }).lean();
      const orderMap = new Map(ids.map((id, i) => [id.toString(), i]));
      const sorted = [...byId].sort(
        (a, b) => ((orderMap.get(String((a as { _id: unknown })._id)) ?? 0) - (orderMap.get(String((b as { _id: unknown })._id)) ?? 0))
      );
      lessons = sorted.map((l, i) => ({ ...l, dayNumber: i + 1 }));
    } else {
      lessons = await Lesson.find({ courseId: courseDoc._id })
        .sort({ dayNumber: 1 })
        .lean();
    }

    return NextResponse.json({
      success: true,
      lessons,
      count: lessons.length,
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to fetch lessons');
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

/**
 * POST /api/admin/courses/[courseId]/lessons
 *
 * What: Create a new lesson for a course (admins and editors with course access)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = (await auth()) as Session | null;
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    const forbid = await assertCourseAccess(request, session, course as Parameters<typeof assertCourseAccess>[2]);
    if (forbid) return forbid;

    const body = await request.json();
    const {
      lessonId,
      dayNumber,
      title,
      content,
      emailSubject,
      emailBody,
      assessmentGameId,
      pointsReward,
      xpReward,
      unlockConditions,
      metadata,
      language,
      translations,
    } = body;

    // Validate required fields
    if (!lessonId || !dayNumber || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: lessonId, dayNumber, title, content' },
        { status: 400 }
      );
    }

    // Validate dayNumber (1-30)
    if (dayNumber < 1 || dayNumber > 30) {
      return NextResponse.json(
        { error: 'dayNumber must be between 1 and 30' },
        { status: 400 }
      );
    }

    // Check if lessonId already exists for this course
    const existing = await Lesson.findOne({ courseId: course._id, lessonId });
    if (existing) {
      return NextResponse.json(
        { error: 'Lesson ID already exists for this course' },
        { status: 400 }
      );
    }

    // Check if dayNumber already has a lesson
    const existingDay = await Lesson.findOne({ courseId: course._id, dayNumber });
    if (existingDay) {
      return NextResponse.json(
        { error: `Day ${dayNumber} already has a lesson` },
        { status: 400 }
      );
    }

    // Create lesson
    const lesson = new Lesson({
      lessonId,
      courseId: course._id,
      dayNumber,
      title,
      content,
      emailSubject: emailSubject || `Day ${dayNumber}: ${title}`,
      emailBody: emailBody || content,
      assessmentGameId: assessmentGameId && mongoose.Types.ObjectId.isValid(assessmentGameId)
        ? new mongoose.Types.ObjectId(assessmentGameId)
        : undefined,
      pointsReward: pointsReward || course.pointsConfig.lessonPoints,
      xpReward: xpReward || course.xpConfig.lessonXP,
      unlockConditions: unlockConditions || {
        requirePreviousLesson: dayNumber > 1,
        requireCourseStart: true,
      },
      isActive: true,
      displayOrder: dayNumber,
      language: language || course.language,
      translations: translations || {},
      metadata: metadata || {},
    });

    await lesson.save();

    logger.info({ courseId, lessonId, dayNumber }, 'Admin created lesson');

    return NextResponse.json({
      success: true,
      lesson,
    }, { status: 201 });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to create lesson');
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
