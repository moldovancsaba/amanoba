/**
 * Course Enrollment API
 *
 * What: REST endpoint for students to enroll in courses (idempotent).
 * Why: Creates CourseProgress when student enrolls; enforces prerequisites when set.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, CourseProgress, Player, CourseProgressStatus } from '@/lib/models';
import { logger } from '@/lib/logger';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

/**
 * POST /api/courses/[courseId]/enroll
 *
 * What: Enroll student in a course. Idempotent: returns success with existing progress if already enrolled.
 * Enforces course.prerequisiteCourseIds when set (prerequisiteEnforcement 'hard' blocks until all completed).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!course.isActive) {
      return NextResponse.json({ error: 'Course is not available' }, { status: 400 });
    }

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const existing = await CourseProgress.findOne({
      playerId: player._id,
      courseId: course._id,
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Already enrolled',
        progress: existing,
      });
    }

    if (course.requiresPremium && !player.isPremium) {
      return NextResponse.json(
        { error: 'This course requires premium membership' },
        { status: 403 }
      );
    }

    const prereqIds = course.prerequisiteCourseIds as unknown[] | undefined;
    const enforcement = course.prerequisiteEnforcement ?? 'hard';

    if (Array.isArray(prereqIds) && prereqIds.length > 0) {
      const completedForPrereqs = await CourseProgress.find({
        playerId: player._id,
        courseId: { $in: prereqIds },
        status: CourseProgressStatus.COMPLETED,
      })
        .select('courseId')
        .lean();

      const completedIds = new Set(completedForPrereqs.map((p) => String(p.courseId)));
      const unmet = prereqIds.filter((id: unknown) => !completedIds.has(String(id)));

      if (unmet.length > 0 && enforcement === 'hard') {
        const prereqCourses = await Course.find({ _id: { $in: unmet } })
          .select('courseId name')
          .lean();
        return NextResponse.json(
          {
            error: 'Prerequisites not met',
            code: 'PREREQUISITES_NOT_MET',
            unmetPrerequisites: prereqCourses.map((c) => ({ courseId: c.courseId, name: c.name })),
          },
          { status: 403 }
        );
      }
    }

    const progress = new CourseProgress({
      playerId: player._id,
      courseId: course._id,
      startedAt: new Date(),
      currentDay: 1,
      completedDays: [],
      status: CourseProgressStatus.IN_PROGRESS,
      lastAccessedAt: new Date(),
    });

    await progress.save();

    logger.info(
      { courseId, playerId: (player as { _id: { toString(): string } })._id.toString() },
      'Student enrolled in course'
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Enrolled successfully',
        progress,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to enroll in course');
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
}
