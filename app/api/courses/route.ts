/**
 * Public Courses API
 * 
 * What: REST endpoint for students to browse available courses
 * Why: Allows students to see and enroll in courses
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

/**
 * GET /api/courses
 * 
 * What: List all active courses available for enrollment
 */
export async function GET(request: NextRequest) {
  // Rate limiting for API endpoints
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

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
      .select('courseId name description language thumbnail isActive requiresPremium durationDays pointsConfig xpConfig price')
      .sort({ createdAt: -1 })
      .lean();

    logger.info({ count: courses.length, filters: { status, language, search } }, 'Fetched courses');

    return NextResponse.json({
      success: true,
      courses,
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
