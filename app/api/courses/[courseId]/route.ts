/**
 * Course Detail API
 * 
 * What: REST endpoint to get a specific course
 * Why: Used by course detail page and enrollment
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { resolveCourseNameForLocale, resolveCourseDescriptionForLocale } from '@/app/lib/utils/course-i18n';
import type { Locale } from '@/app/lib/i18n/locales';

const VALID_LOCALES: Locale[] = ['hu', 'en', 'ar', 'hi', 'id', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru', 'sw', 'zh', 'es', 'fr', 'bn', 'ur'];
function parseLocale(value: string | null): Locale | null {
  if (!value) return null;
  return VALID_LOCALES.includes(value as Locale) ? (value as Locale) : null;
}

/**
 * GET /api/courses/[courseId]
 * 
 * What: Get course details
 * Query: locale — optional; when set, name/description are resolved for that locale (P0 catalog language integrity)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await connectDB();
    const { courseId } = await params;
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get('locale'));

    const selectFields =
      locale != null
        ? 'courseId name description language thumbnail isActive requiresPremium durationDays pointsConfig xpConfig metadata price createdAt prerequisiteCourseIds prerequisiteEnforcement translations discussionEnabled leaderboardEnabled studyGroupsEnabled'
        : 'courseId name description language thumbnail isActive requiresPremium durationDays pointsConfig xpConfig metadata price createdAt prerequisiteCourseIds prerequisiteEnforcement discussionEnabled leaderboardEnabled studyGroupsEnabled';
    const course = await Course.findOne({ courseId })
      .select(selectFields)
      .populate('prerequisiteCourseIds', 'courseId name')
      .lean();

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const prerequisiteCourses = Array.isArray(course.prerequisiteCourseIds)
      ? course.prerequisiteCourseIds
          .map((prereq) => {
            if (prereq && typeof prereq === 'object' && 'courseId' in prereq) {
              const typed = prereq as { courseId?: string; name?: string };
              if (!typed.courseId) return null;
              return { courseId: typed.courseId, name: typed.name };
            }
            return null;
          })
          .filter(Boolean)
      : [];
    const base = {
      ...course,
      prerequisiteCourses,
      prerequisiteEnforcement: course.prerequisiteEnforcement ?? undefined,
    };
    const { prerequisiteCourseIds: _prereqIds, ...restBase } = base as typeof base & { prerequisiteCourseIds?: unknown };

    if (locale != null && course.name != null && course.description != null) {
      const { translations: _translations, ...rest } = restBase as typeof restBase & { translations?: unknown };
      const resolved = {
        ...rest,
        name: resolveCourseNameForLocale(course as Parameters<typeof resolveCourseNameForLocale>[0], locale),
        description: resolveCourseDescriptionForLocale(course as Parameters<typeof resolveCourseDescriptionForLocale>[0], locale),
      };
      return NextResponse.json({ success: true, course: resolved });
    }

    const { translations: _t, ...rest } = restBase as typeof restBase & { translations?: unknown };
    const payload = _t !== undefined ? rest : restBase;
    return NextResponse.json({ success: true, course: payload });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to fetch course');
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
