/**
 * Course Day Lesson API
 * 
 * What: REST endpoint to get lesson for a specific day
 * Why: Used by daily lesson viewer
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, CourseProgress, Player } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/courses/[courseId]/day/[dayNumber]
 * 
 * What: Get lesson for a specific day, check if unlocked
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; dayNumber: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, dayNumber } = await params;
    const day = parseInt(dayNumber);

    if (isNaN(day) || day < 1 || day > 30) {
      return NextResponse.json({ error: 'Invalid day number' }, { status: 400 });
    }

    // Find course
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get player
    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Get progress or auto-enroll for testing
    let progress = await CourseProgress.findOne({
      playerId: player._id,
      courseId: course._id,
    });

    // Auto-enroll if not enrolled (useful for testing/admin)
    if (!progress) {
      progress = new CourseProgress({
        playerId: player._id,
        courseId: course._id,
        startedAt: new Date(),
        currentDay: 1,
        completedDays: [],
        status: 'IN_PROGRESS',
        lastAccessedAt: new Date(),
      });
      await progress.save();
      logger.info({ courseId, playerId: player._id.toString() }, 'Auto-enrolled in course for testing');
    }

    // Find lesson
    const lesson = await Lesson.findOne({
      courseId: course._id,
      dayNumber: day,
      isActive: true,
    }).lean();

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Check if lesson is unlocked
    const isUnlocked =
      day === 1 ||
      progress.completedDays?.includes(day - 1) ||
      progress.currentDay >= day;

    // Get previous/next lessons
    const previousLesson = day > 1
      ? await Lesson.findOne({ courseId: course._id, dayNumber: day - 1 }).lean()
      : null;
    const nextLesson = day < 30
      ? await Lesson.findOne({ courseId: course._id, dayNumber: day + 1 }).lean()
      : null;

    return NextResponse.json({
      success: true,
      lesson: {
        ...lesson,
        quizConfig: lesson.quizConfig || undefined,
        isUnlocked,
        isCompleted: progress.completedDays?.includes(day) || false,
      },
      navigation: {
        previous: previousLesson ? { day: day - 1, title: previousLesson.title } : null,
        next: nextLesson ? { day: day + 1, title: nextLesson.title } : null,
      },
      progress: {
        currentDay: progress.currentDay,
        completedDays: progress.completedDays?.length || 0,
        totalDays: course.durationDays,
      },
      courseLanguage: course.language, // Include course language for locale matching
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, dayNumber: (await params).dayNumber }, 'Failed to fetch lesson');
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}

/**
 * POST /api/courses/[courseId]/day/[dayNumber]/complete
 * 
 * What: Mark lesson as completed
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; dayNumber: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, dayNumber } = await params;
    const day = parseInt(dayNumber);

    // Get player
    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Find course
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get progress or auto-enroll for testing
    let progress = await CourseProgress.findOne({
      playerId: player._id,
      courseId: course._id,
    });

    // Auto-enroll if not enrolled (useful for testing/admin)
    if (!progress) {
      progress = new CourseProgress({
        playerId: player._id,
        courseId: course._id,
        startedAt: new Date(),
        currentDay: 1,
        completedDays: [],
        status: 'IN_PROGRESS',
        lastAccessedAt: new Date(),
      });
      await progress.save();
      logger.info({ courseId, playerId: player._id.toString() }, 'Auto-enrolled in course for testing');
    }

    // Find lesson
    const lesson = await Lesson.findOne({
      courseId: course._id,
      dayNumber: day,
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Mark as completed
    if (!progress.completedDays?.includes(day)) {
      progress.completedDays.push(day);
      progress.currentDay = Math.max(progress.currentDay, day + 1);
      progress.lastAccessedAt = new Date();

      // Check if course is completed
      if (progress.completedDays.length >= course.durationDays) {
        progress.status = 'COMPLETED';
        progress.completedAt = new Date();
      }

      await progress.save();

      // Award points and XP
      player.points += lesson.pointsReward;
      player.xp += lesson.xpReward;
      await player.save();

      logger.info({ courseId, day, playerId: player._id.toString() }, 'Lesson completed');
    }

    return NextResponse.json({
      success: true,
      message: 'Lesson completed',
      progress,
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId, dayNumber: (await params).dayNumber }, 'Failed to complete lesson');
    return NextResponse.json({ error: 'Failed to complete lesson' }, { status: 500 });
  }
}
