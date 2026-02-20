/**
 * My Courses API
 * 
 * What: REST endpoint for students to get their enrolled courses
 * Why: Shows student's course progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { CourseProgress, Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { resolveCourseNameForLocale, resolveCourseDescriptionForLocale } from '@/app/lib/utils/course-i18n';
import type { Locale } from '@/app/lib/i18n/locales';

const VALID_LOCALES: Locale[] = ['hu', 'en', 'ar', 'hi', 'id', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru', 'sw', 'zh', 'es', 'fr', 'bn', 'ur'];
function parseLocale(value: string | null): Locale | null {
  if (!value) return null;
  return VALID_LOCALES.includes(value as Locale) ? (value as Locale) : null;
}

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
 * Query: locale — optional; when set, course name/description are resolved for that locale (P0 catalog language integrity)
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

    const { searchParams } = new URL(request.url);
    const locale =
      parseLocale(searchParams.get('locale')) ??
      (VALID_LOCALES.includes((player.locale as Locale) ?? '') ? (player.locale as Locale) : null);

    const populateFields =
      locale != null
        ? 'courseId name description thumbnail language durationDays isDraft translations'
        : 'courseId name description thumbnail language durationDays isDraft';

    // Get all course progress for this player
    const progressList = await CourseProgress.find({ playerId: player._id })
      .populate('courseId', populateFields)
      .sort({ startedAt: -1 })
      .lean();

    // My courses: only show published shorts (exclude isDraft === true)
    type ProgressWithCourse = { courseId?: { isDraft?: boolean; courseId?: string; name?: string; description?: string; thumbnail?: string; language?: string; durationDays?: number }; completedDays?: number[]; status?: string; startedAt?: Date; lastAccessedAt?: Date };
    const list = progressList as ProgressWithCourse[];
    const filteredProgress = list.filter(
      (p) => p.courseId && typeof p.courseId === 'object' && (p.courseId as { isDraft?: boolean }).isDraft !== true
    );

    // Calculate progress for each course; resolve name/description for locale when set (P0 catalog language integrity)
    const courses = filteredProgress.map((progress) => {
      const course = progress.courseId as ProgressWithCourse['courseId'] & { translations?: unknown };
      const completedDaysArray = Array.isArray(progress.completedDays) ? progress.completedDays : [];
      const completedDays = completedDaysArray.length;
      const totalDays = (course?.durationDays as number) || 30;
      const progressPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      // Calculate correct currentDay based on completed days
      const correctCurrentDay = calculateCurrentDay(completedDaysArray, totalDays);

      let name = course?.name ?? '';
      let description = course?.description ?? '';
      if (locale != null && course?.name != null && course?.description != null) {
        name = resolveCourseNameForLocale(course as Parameters<typeof resolveCourseNameForLocale>[0], locale);
        description = resolveCourseDescriptionForLocale(course as Parameters<typeof resolveCourseDescriptionForLocale>[0], locale);
      }

      return {
        course: {
          courseId: course?.courseId,
          name,
          description,
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
