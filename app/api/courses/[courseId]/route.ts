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

/**
 * GET /api/courses/[courseId]
 * 
 * What: Get course details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId })
      .select('courseId name description language thumbnail isActive requiresPremium durationDays pointsConfig xpConfig metadata createdAt')
      .lean();

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to fetch course');
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
