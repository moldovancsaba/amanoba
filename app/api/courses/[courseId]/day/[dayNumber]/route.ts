/**
 * Course Day Lesson API
 * 
 * What: REST endpoint to get lesson for a specific day
 * Why: Used by daily lesson viewer
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, CourseProgress, Player, CourseProgressStatus } from '@/lib/models';
import { logger } from '@/lib/logger';
import { checkAndUnlockCourseCompletionAchievements } from '@/lib/gamification';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

/**
 * Calculate the current day (first uncompleted lesson) based on completed days
 * 
 * What: Finds the first day number that is not in the completedDays array
 * Why: Ensures currentDay always points to the next lesson the user should take
 */
function calculateCurrentDay(completedDays: number[], totalDays: number): number {
  // If no days completed, start at day 1
  if (!completedDays || completedDays.length === 0) {
    return 1;
  }

  // Sort completed days to handle out-of-order completion
  const sortedCompleted = [...completedDays].sort((a, b) => a - b);

  // Find the first gap in completed days
  for (let day = 1; day <= totalDays; day++) {
    if (!sortedCompleted.includes(day)) {
      return day;
    }
  }

  // All days completed
  return totalDays + 1;
}

/**
 * GET /api/courses/[courseId]/day/[dayNumber]
 * 
 * What: Get lesson for a specific day, check if unlocked
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; dayNumber: string }> }
) {
  // Rate limiting: 100 requests per 15 minutes per IP
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

    // Ensure currentDay is correct based on completedDays
    // This fixes cases where currentDay might be out of sync
    const correctCurrentDay = calculateCurrentDay(
      progress.completedDays || [],
      course.durationDays
    );
    if (progress.currentDay !== correctCurrentDay) {
      const oldCurrentDay = progress.currentDay;
      progress.currentDay = correctCurrentDay;
      progress.lastAccessedAt = new Date();
      await progress.save();
      logger.info(
        { courseId, oldCurrentDay, newCurrentDay: correctCurrentDay, playerId: player._id.toString() },
        'Updated currentDay to match completedDays'
      );
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
    // Lesson is unlocked if it's day 1, or if the previous day is completed, or if currentDay >= day
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
      
      // Recalculate currentDay based on all completed days
      // This ensures currentDay always points to the first uncompleted lesson
      progress.currentDay = calculateCurrentDay(
        progress.completedDays,
        course.durationDays
      );
      
      progress.lastAccessedAt = new Date();

      // Check if course is completed
      if (progress.completedDays.length >= course.durationDays) {
        progress.status = CourseProgressStatus.COMPLETED;
        progress.completedAt = new Date();
        // If all days completed, currentDay should be totalDays + 1
        progress.currentDay = course.durationDays + 1;
        
        // Check and unlock course completion achievements
        try {
          const unlockedAchievements = await checkAndUnlockCourseCompletionAchievements(
            player._id,
            course._id
          );
          
          if (unlockedAchievements.length > 0) {
            logger.info(
              {
                courseId,
                playerId: player._id.toString(),
                completedDays: progress.completedDays.length,
                achievementsUnlocked: unlockedAchievements.length,
                achievementNames: unlockedAchievements.map(a => a.achievement.name),
              },
              'Course completed - achievements unlocked'
            );
          } else {
            logger.info(
              { courseId, playerId: player._id.toString(), completedDays: progress.completedDays.length },
              'Course completed - no achievements to unlock'
            );
          }
        } catch (achievementError) {
          // Don't fail course completion if achievement unlock fails
          logger.warn(
            { error: achievementError, courseId, playerId: player._id.toString() },
            'Failed to unlock course completion achievements'
          );
        }
      }

      await progress.save();

      // Award points and XP
      player.points += lesson.pointsReward;
      player.xp += lesson.xpReward;
      await player.save();

      logger.info(
        { courseId, day, currentDay: progress.currentDay, completedDays: progress.completedDays.length, playerId: player._id.toString() },
        'Lesson completed'
      );
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
