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
import { calculateCurrentLessonDay, resolveCourseLength } from '@/lib/course-helpers';

const VALID_LOCALES: Locale[] = ['hu', 'en', 'ar', 'hi', 'id', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru', 'sw', 'zh', 'es', 'fr', 'bn', 'ur'];
function parseLocale(value: string | null): Locale | null {
  if (!value) return null;
  return VALID_LOCALES.includes(value as Locale) ? (value as Locale) : null;
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
        ? 'courseId name description thumbnail language durationDays isDraft translations parentCourseId selectedLessonIds ccsId'
        : 'courseId name description thumbnail language durationDays isDraft parentCourseId selectedLessonIds ccsId';

    // Get all course progress for this player
    const progressList = await CourseProgress.find({ playerId: player._id })
      .populate('courseId', populateFields)
      .sort({ startedAt: -1 })
      .lean();

    // My courses: only show published shorts (exclude isDraft === true)
    type ProgressWithCourse = { courseId?: { _id?: unknown; isDraft?: boolean; courseId?: string; name?: string; description?: string; thumbnail?: string; language?: string; durationDays?: number; parentCourseId?: string; selectedLessonIds?: string[]; ccsId?: string }; completedDays?: number[]; status?: string; startedAt?: Date; lastAccessedAt?: Date };
    const list = progressList as ProgressWithCourse[];
    const filteredProgress = list.filter(
      (p) => p.courseId && typeof p.courseId === 'object' && (p.courseId as { isDraft?: boolean }).isDraft !== true
    );

    // Calculate progress for each course; resolve name/description for locale when set (P0 catalog language integrity)
    const courses = await Promise.all(filteredProgress.map(async (progress) => {
      const course = progress.courseId as ProgressWithCourse['courseId'] & { translations?: unknown };
      const completedDaysArray = Array.isArray(progress.completedDays) ? progress.completedDays : [];
      const completedDays = completedDaysArray.length;
      const { totalDays } = await resolveCourseLength(course ?? null);
      const progressPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      // Calculate correct currentDay based on completed days
      const correctCurrentDay = calculateCurrentLessonDay(completedDaysArray, totalDays);

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
          durationDays: totalDays,
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
    }));

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
