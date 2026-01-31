/**
 * Course Recommendations (P2 Email Automation)
 *
 * What: Shared logic for personalized course recommendations by skill level and interests
 * Why: Used by API /api/courses/recommendations and completion email upsell
 */

import { Course, CourseProgress } from '@/app/lib/models';
import { resolveCourseNameForLocale, resolveCourseDescriptionForLocale } from '@/app/lib/utils/course-i18n';
import type { Locale } from '@/app/lib/i18n/locales';

export type CourseRecommendation = {
  courseId: string;
  name: string;
  description?: string;
  [key: string]: unknown;
};

type PlayerLike = {
  _id: unknown;
  skillLevel?: string;
  interests?: string[];
};

/**
 * Get course recommendations for a player
 * Excludes enrolled courses and optionally a specific course (e.g. just completed)
 */
export async function getCourseRecommendations(
  player: PlayerLike,
  limit: number,
  locale: Locale | null = null,
  excludeCourseId?: string
): Promise<CourseRecommendation[]> {
  const enrolledCourses = await CourseProgress.find({
    playerId: player._id,
  })
    .select('courseId')
    .lean();

  const enrolledIds = enrolledCourses.map((cp) => cp.courseId.toString());
  if (excludeCourseId) {
    enrolledIds.push(excludeCourseId);
  }

  const query: Record<string, unknown> = {
    isActive: true,
    isDraft: { $ne: true },
    _id: { $nin: enrolledIds },
  };

  if (player.skillLevel) {
    query['metadata.difficulty'] = player.skillLevel;
  }

  const selectFields =
    locale != null
      ? 'courseId name description language thumbnail requiresPremium durationDays pointsConfig xpConfig price metadata translations'
      : 'courseId name description language thumbnail requiresPremium durationDays pointsConfig xpConfig price metadata';

  const courses = await Course.find(query)
    .select(selectFields)
    .lean();

  const interests = player.interests;
  if (interests && interests.length > 0) {
    const scored = courses.map((course: Record<string, unknown>) => {
      let score = 0;
      if (course.metadata && typeof course.metadata === 'object' && Array.isArray((course.metadata as { tags?: string[] }).tags)) {
        const tags = ((course.metadata as { tags: string[] }).tags).map((t: string) => t.toLowerCase());
        const playerInterests = interests.map((i: string) => i.toLowerCase());
        const matching = tags.filter((tag: string) =>
          playerInterests.some((interest: string) => tag.includes(interest) || interest.includes(tag))
        );
        score += matching.length * 10;
      }
      const text = `${course.name} ${course.description}`.toLowerCase();
      for (const interest of interests) {
        if (text.includes(interest.toLowerCase())) score += 5;
      }
      if (!course.requiresPremium) score += 2;
      return { course, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const top = scored.filter((item) => item.score > 0).slice(0, limit).map((item) => item.course);
    return resolveCoursesForLocale(top as Record<string, unknown>[], locale);
  }

  const slice = courses.slice(0, limit) as Record<string, unknown>[];
  return resolveCoursesForLocale(slice, locale);
}

function resolveCoursesForLocale(
  courses: Record<string, unknown>[],
  locale: Locale | null
): CourseRecommendation[] {
  if (locale == null) {
    return courses.map((c) => ({
      courseId: c.courseId as string,
      name: c.name as string,
      description: c.description as string | undefined,
      ...c,
    }));
  }
  return courses.map((course) => {
    const name = resolveCourseNameForLocale(course as Parameters<typeof resolveCourseNameForLocale>[0], locale);
    const description = resolveCourseDescriptionForLocale(course as Parameters<typeof resolveCourseDescriptionForLocale>[0], locale);
    const { translations: _t, ...rest } = course;
    return { ...rest, courseId: course.courseId as string, name, description } as CourseRecommendation;
  });
}
