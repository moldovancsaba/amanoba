/**
 * Public Courses API
 * 
 * What: REST endpoint for students to browse available courses
 * Why: Allows students to see and enroll in courses
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Course, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';

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
    const search = searchParams.get('search');

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

    if (language) {
      query.language = language;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { courseId: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .select('courseId name description language thumbnail isActive requiresPremium durationDays pointsConfig xpConfig price certification')
      .sort({ createdAt: -1 })
      .lean();

    // Get default thumbnail from brand metadata for courses without thumbnails
    let defaultThumbnail: string | null = null;
    const hasCoursesWithoutThumbnail = courses.some(course => !course.thumbnail);
    
    if (hasCoursesWithoutThumbnail) {
      const brand = await Brand.findOne({ slug: 'amanoba' }).lean();
      if (brand?.metadata) {
        defaultThumbnail = (brand.metadata as any)?.defaultCourseThumbnail || null;
      }
    }

    // Add default thumbnail to courses that don't have one
    const coursesWithThumbnails = courses.map(course => ({
      ...course,
      thumbnail: course.thumbnail || defaultThumbnail || null,
    }));

    logger.info({ 
      count: courses.length, 
      filters: { status, language, search },
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
