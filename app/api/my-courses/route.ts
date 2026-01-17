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
      .populate('courseId', 'courseId name description thumbnail language durationDays')
      .sort({ startedAt: -1 })
      .lean();

    // Calculate progress for each course
    const courses = progressList.map((progress: any) => {
      const course = progress.courseId;
      const completedDays = progress.lessonsCompleted?.length || 0;
      const totalDays = course?.durationDays || 30;
      const progressPercentage = (completedDays / totalDays) * 100;

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
          currentDay: progress.currentDay,
          completedDays,
          totalDays,
          progressPercentage: Math.round(progressPercentage),
          isCompleted: progress.isCompleted,
          startedAt: progress.startedAt,
          lastActivityAt: progress.lastActivityAt,
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
