/**
 * My Courses API
 * 
 * What: REST endpoint for students to get their enrolled courses
 * Why: Shows student's course progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { CourseProgress, Course, Player } from '@/lib/models';
import { logger } from '@/lib/logger';

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
 * GET /api/my-courses
 * 
 * What: Get all courses student is enrolled in
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Get all course progress for this player
    const progressList = await CourseProgress.find({ playerId: player._id })
      .populate('courseId', 'courseId name description thumbnail language durationDays isDraft')
      .sort({ startedAt: -1 })
      .lean();

    // My courses: only show published shorts (exclude isDraft === true)
    type ProgressWithCourse = { courseId?: { isDraft?: boolean; courseId?: string; name?: string; description?: string; thumbnail?: string; language?: string; durationDays?: number }; completedDays?: number[]; status?: string; startedAt?: Date; lastAccessedAt?: Date };
    const list = progressList as ProgressWithCourse[];
    const filteredProgress = list.filter(
      (p) => p.courseId && typeof p.courseId === 'object' && (p.courseId as { isDraft?: boolean }).isDraft !== true
    );

    // Calculate progress for each course
    const courses = filteredProgress.map((progress) => {
      const course = progress.courseId as ProgressWithCourse['courseId'];
      const completedDaysArray = Array.isArray(progress.completedDays) ? progress.completedDays : [];
      const completedDays = completedDaysArray.length;
      const totalDays = (course?.durationDays as number) || 30;
      const progressPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      // Calculate correct currentDay based on completed days
      const correctCurrentDay = calculateCurrentDay(completedDaysArray, totalDays);

      return {
        course: {
          courseId: course?.courseId,
          name: course?.name,
          description: course?.description,
          thumbnail: course?.thumbnail,
          language: course?.language,
          durationDays: course?.durationDays,
        },
        progress: {
          currentDay: correctCurrentDay,
          completedDays,
          totalDays,
          progressPercentage: Math.round(progressPercentage),
          isCompleted: progress.status === 'COMPLETED',
          startedAt: progress.startedAt,
          lastAccessedAt: progress.lastAccessedAt,
        },
      };
    });

    return NextResponse.json({
      success: true,
      courses,
      count: courses.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch my courses');
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
