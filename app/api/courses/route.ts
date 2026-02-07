/**
 * Public Courses API
 * 
 * What: REST endpoint for students to browse available courses
 * Why: Allows students to see and enroll in courses
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Course, Brand, ContentVote } from '@/lib/models';
import { logger } from '@/lib/logger';
import { resolveCourseNameForLocale, resolveCourseDescriptionForLocale } from '@/app/lib/utils/course-i18n';
import type { Locale } from '@/app/lib/i18n/locales';

const VALID_LOCALES: Locale[] = ['hu', 'en', 'ar', 'hi', 'id', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru', 'sw'];
function parseLocale(value: string | null): Locale | null {
  if (!value) return null;
  return VALID_LOCALES.includes(value as Locale) ? (value as Locale) : null;
}

/**
 * GET /api/courses
 * 
 * What: List all active courses available for enrollment
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'all' | 'active'
    const language = searchParams.get('language');
    const languages = searchParams.get('languages');
    const search = searchParams.get('search');
    const locale = parseLocale(searchParams.get('locale'));
    const includeVoteAggregates = searchParams.get('includeVoteAggregates') === '1' || searchParams.get('includeVoteAggregates') === 'true';

    // Build query - only show active courses to students
    const query: Record<string, unknown> = {};
    
    // Filter by status: 'all' shows all, 'active' shows only active, default shows active
    if (status === 'all') {
      // Show all courses (no isActive filter)
    } else {
      // Default: show only active courses
      query.isActive = true;
    }

    // Catalog: only show published shorts (exclude isDraft === true)
    query.isDraft = { $ne: true };

    if (languages) {
      const languageList = languages
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
        .filter((value) => parseLocale(value) !== null);
      if (languageList.length > 0) {
        query.language = { $in: languageList };
      }
    } else if (language) {
      const parsed = parseLocale(language);
      if (parsed) {
        query.language = parsed;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { courseId: { $regex: search, $options: 'i' } },
      ];
    }

    const selectFields =
      locale != null
        ? 'courseId name description language thumbnail isActive requiresPremium durationDays pointsConfig xpConfig price certification translations'
        : 'courseId name description language thumbnail isActive requiresPremium durationDays pointsConfig xpConfig price certification';
    const courses = await Course.find(query)
      .select(selectFields)
      .sort({ createdAt: -1 })
      .lean();

    // Get default thumbnail from brand metadata for courses without thumbnails
    let defaultThumbnail: string | null = null;
    const hasCoursesWithoutThumbnail = courses.some(course => !course.thumbnail);
    
    if (hasCoursesWithoutThumbnail) {
      const brand = await Brand.findOne({ slug: 'amanoba' }).lean();
      if (brand?.metadata) {
        defaultThumbnail = (brand.metadata as Record<string, unknown>)?.defaultCourseThumbnail as string | undefined || null;
      }
    }

    // Add default thumbnail; resolve name/description for locale when requested (P0 catalog language integrity)
    let coursesWithThumbnails = courses.map((course) => {
      const base = {
        ...course,
        thumbnail: course.thumbnail || defaultThumbnail || null,
      };
      if (locale != null && base.name != null && base.description != null) {
        const { translations: _translations, ...rest } = base as typeof base & { translations?: unknown };
        return {
          ...rest,
          name: resolveCourseNameForLocale(base as Parameters<typeof resolveCourseNameForLocale>[0], locale),
          description: resolveCourseDescriptionForLocale(base as Parameters<typeof resolveCourseDescriptionForLocale>[0], locale),
        };
      }
      const { translations: _t, ...rest } = base as typeof base & { translations?: unknown };
      return _t != null ? rest : base;
    });

    if (includeVoteAggregates && coursesWithThumbnails.length > 0) {
      const courseIds = coursesWithThumbnails.map((c) => (c as { courseId?: string }).courseId).filter(Boolean) as string[];
      const aggregates = await ContentVote.aggregate([
        { $match: { targetType: 'course', targetId: { $in: courseIds } } },
        { $group: { _id: '$targetId', up: { $sum: { $cond: [{ $eq: ['$value', 1] }, 1, 0] } }, down: { $sum: { $cond: [{ $eq: ['$value', -1] }, 1, 0] } }, count: { $sum: 1 } } },
        { $project: { targetId: '$_id', up: 1, down: 1, count: 1, score: { $subtract: ['$up', '$down'] } } },
      ]).exec();
      const aggMap = new Map(aggregates.map((a: { targetId: string; up: number; down: number; count: number; score: number }) => [a.targetId, { up: a.up, down: a.down, count: a.count, score: a.score }]));
      coursesWithThumbnails = coursesWithThumbnails.map((c) => {
        const courseId = (c as { courseId?: string }).courseId;
        const voteAggregate = courseId ? aggMap.get(courseId) ?? { up: 0, down: 0, count: 0, score: 0 } : { up: 0, down: 0, count: 0, score: 0 };
        return { ...c, voteAggregate };
      });
    }

    logger.info({ 
      count: courses.length, 
      filters: { status, language, languages, search },
      defaultThumbnailUsed: defaultThumbnail ? true : false
    }, 'Fetched courses');

    return NextResponse.json({
      success: true,
      courses: coursesWithThumbnails,
      count: courses.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch courses');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
