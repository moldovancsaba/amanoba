/**
 * Course Recommendations API
 * 
 * What: Returns personalized course recommendations based on survey responses
 * Why: Helps students discover courses that match their interests and skill level
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Player, CourseProgress } from '@/lib/models';
import { logger } from '@/lib/logger';
import { resolveCourseNameForLocale, resolveCourseDescriptionForLocale } from '@/app/lib/utils/course-i18n';
import type { Locale } from '@/app/lib/i18n/locales';

const VALID_LOCALES: Locale[] = ['hu', 'en', 'ar', 'hi', 'id', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru'];
function parseLocale(value: string | null): Locale | null {
  if (!value) return null;
  return VALID_LOCALES.includes(value as Locale) ? (value as Locale) : null;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/courses/recommendations
 * 
 * What: Get personalized course recommendations
 * Query Params:
 *   - limit?: number (default: 5)
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
    const player = await Player.findById(playerId).lean();

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Check if player completed survey
    if (!player.surveyCompleted) {
      return NextResponse.json({
        success: true,
        recommendations: [],
        message: 'Complete the onboarding survey to get personalized recommendations',
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const locale =
      parseLocale(searchParams.get('locale')) ??
      (VALID_LOCALES.includes((player.locale as Locale) ?? '') ? (player.locale as Locale) : null);

    // Get recommendations based on player data (P0: resolve name/description for locale when set)
    const recommendations = await getCourseRecommendations(player, limit, locale);

    logger.info(
      {
        playerId: player._id.toString(),
        skillLevel: player.skillLevel,
        interestsCount: player.interests?.length || 0,
        recommendationsCount: recommendations.length,
      },
      'Generated course recommendations'
    );

    return NextResponse.json({
      success: true,
      recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch course recommendations');
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

/**
 * Get Course Recommendations
 * Why: Matches courses based on player's skill level, interests, and enrollment status
 * When locale is set, name/description are resolved for that locale (P0 catalog language integrity).
 */
async function getCourseRecommendations(
  player: Record<string, unknown>,
  limit: number,
  locale: Locale | null = null
): Promise<Record<string, unknown>[]> {
  // Get player's enrolled courses to exclude them
  const enrolledCourses = await CourseProgress.find({
    playerId: player._id,
  })
    .select('courseId')
    .lean();

  const enrolledCourseIds = enrolledCourses.map((cp) => cp.courseId.toString());

  // Build recommendation query (exclude draft shorts from recommendations)
  const query: Record<string, unknown> = {
    isActive: true,
    isDraft: { $ne: true },
    _id: { $nin: enrolledCourseIds }, // Exclude already enrolled courses
  };

  // Filter by skill level if available
  if (player.skillLevel) {
    query['metadata.difficulty'] = player.skillLevel;
  }

  const selectFields =
    locale != null
      ? 'courseId name description language thumbnail requiresPremium durationDays pointsConfig xpConfig price metadata translations'
      : 'courseId name description language thumbnail requiresPremium durationDays pointsConfig xpConfig price metadata';

  // Get all matching courses
  const courses = await Course.find(query)
    .select(selectFields)
    .lean();

  type PlayerWithInterests = { interests?: string[] };
  const interests = (player as PlayerWithInterests).interests;
  // Score courses based on interests
  if (interests && interests.length > 0) {
    const scoredCourses = courses.map((course) => {
      let score = 0;

      // Match interests with course tags
      if (course.metadata?.tags && Array.isArray(course.metadata.tags)) {
        const courseTags = course.metadata.tags.map((tag: string) => tag.toLowerCase());
        const playerInterests = interests.map((interest: string) => interest.toLowerCase());

        // Count matching tags
        const matchingTags = courseTags.filter((tag: string) =>
          playerInterests.some((interest: string) => tag.includes(interest) || interest.includes(tag))
        );
        score += matchingTags.length * 10;
      }

      // Match interests with course name/description
      const courseText = `${course.name} ${course.description}`.toLowerCase();
      for (const interest of interests) {
        if (courseText.includes(interest.toLowerCase())) {
          score += 5;
        }
      }

      // Boost free courses slightly
      if (!course.requiresPremium) {
        score += 2;
      }

      return { course, score };
    });

    // Sort by score (highest first)
    scoredCourses.sort((a, b) => b.score - a.score);

    // Return top courses (resolve name/description for locale when set)
    const top = scoredCourses
      .filter((item) => item.score > 0) // Only courses with positive scores
      .slice(0, limit)
      .map((item) => item.course);
    return resolveCoursesForLocale(top, locale);
  }

  // If no interests, return courses matching skill level (or all if no skill level)
  const slice = courses.slice(0, limit);
  return resolveCoursesForLocale(slice, locale);
}

function resolveCoursesForLocale(
  courses: Record<string, unknown>[],
  locale: Locale | null
): Record<string, unknown>[] {
  if (locale == null) return courses;
  return courses.map((course) => {
    const name = resolveCourseNameForLocale(course as Parameters<typeof resolveCourseNameForLocale>[0], locale);
    const description = resolveCourseDescriptionForLocale(course as Parameters<typeof resolveCourseDescriptionForLocale>[0], locale);
    const { translations: _translations, ...rest } = course as Record<string, unknown> & { translations?: unknown };
    return { ...rest, name, description };
  });
}
