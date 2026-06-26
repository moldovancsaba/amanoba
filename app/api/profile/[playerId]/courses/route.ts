/**
 * Player Enrolled Courses API
 * 
 * What: Returns list of courses a player is enrolled in
 * Why: Needed for displaying certificates on profile page
 * 
 * Endpoint: GET /api/profile/[playerId]/courses
 * 
 * Returns:
 * {
 *   success: true,
 *   courses: [
 *     {
 *       courseId: string,
 *       title: string,
 *       language: string
 *     }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { CourseProgress } from '@/lib/models';
import { logger } from '@/lib/logger';
import { resolveCourseLength } from '@/lib/course-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/profile/[playerId]/courses
 * 
 * Fetches all courses a player is enrolled in.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params;

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      );
    }

    logger.info({ playerId }, 'Fetching enrolled courses');

    await connectDB();

    // Get all course progress for this player
    const progressList = await CourseProgress.find({
      playerId: new mongoose.Types.ObjectId(playerId),
    })
      .populate('courseId', 'courseId name language durationDays parentCourseId selectedLessonIds ccsId')
      .sort({ startedAt: -1 })
      .lean();

    // Transform to simple course list (populate returns courseId, name, language)
    type PopulatedCourse = {
      _id?: unknown;
      name?: string;
      courseId?: string;
      language?: string;
      durationDays?: number;
      parentCourseId?: string;
      selectedLessonIds?: string[];
      ccsId?: string;
    };
    const courses = (await Promise.all(progressList
      .map(async (progress) => {
        const course = progress.courseId as PopulatedCourse | null | undefined;
        if (!course) return null;
        const { totalDays } = await resolveCourseLength(course);
        const completedDays = Array.isArray(progress.completedDays) ? progress.completedDays.length : 0;
        const isCompleted =
          String(progress.status || '').toUpperCase() === 'COMPLETED' ||
          (totalDays > 0 && completedDays >= totalDays);
        return {
          courseId: course.courseId ?? (course._id != null ? String(course._id) : undefined),
          title: course.name ?? course.courseId ?? 'Unknown Course',
          language: course.language ?? 'en',
          completedDays,
          totalDays,
          isCompleted,
        };
      })))
      .filter((course) => course !== null);

    logger.info({ playerId, courseCount: courses.length }, 'Enrolled courses fetched');

    return NextResponse.json({
      success: true,
      courses,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch enrolled courses');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
