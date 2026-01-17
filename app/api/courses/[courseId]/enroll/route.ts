/**
 * Course Enrollment API
 * 
 * What: REST endpoint for students to enroll in courses
 * Why: Creates CourseProgress record when student enrolls
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, CourseProgress, Player } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * POST /api/courses/[courseId]/enroll
 * 
 * What: Enroll student in a course
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId } = await params;

    // Find course
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!course.isActive) {
      return NextResponse.json({ error: 'Course is not available' }, { status: 400 });
    }

    // Get player
    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Check if already enrolled
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

    // Check premium requirement
    if (course.requiresPremium && !player.isPremium) {
      return NextResponse.json(
        { error: 'This course requires premium membership' },
        { status: 403 }
      );
    }

    // Create course progress
    const progress = new CourseProgress({
      playerId: player._id,
      courseId: course._id,
      startedAt: new Date(),
      currentDay: 1,
      lessonsCompleted: [],
      assessmentsCompleted: [],
      isCompleted: false,
      lastActivityAt: new Date(),
    });

    await progress.save();

    logger.info({ courseId, playerId: player._id.toString() }, 'Student enrolled in course');

    return NextResponse.json({
      success: true,
      message: 'Enrolled successfully',
      progress,
    }, { status: 201 });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to enroll in course');
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
}
