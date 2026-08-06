/**
 * Course Progression API
 * 
 * Public endpoint for viewing course progression paths.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { getProgressionPath } from '@/app/lib/progressive-generation';
import { logger } from '@/app/lib/logger';

interface RouteParams {
  params: Promise<{
    courseId: string;
  }>;
}

/**
 * GET /api/courses/[courseId]/progression
 * 
 * Get progression information for a course
 * 
 * Shows:
 * - Topic name
 * - Current stage
 * - All stages in the progression
 * - Links to next/previous stage courses
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();
    
    const { courseId: rawCourseId } = await params;
    const courseId = rawCourseId.toUpperCase();

    const path = await getProgressionPath(courseId);

    if (!path) {
      return NextResponse.json({
        success: true,
        isProgression: false,
        message: 'This course is not part of a progression',
      });
    }

    return NextResponse.json({
      success: true,
      isProgression: true,
      data: path,
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching course progression');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch course progression',
      },
      { status: 500 }
    );
  }
}
