/**
 * Public lesson API (no auth).
 * Used by GEO view page and crawlers. Returns lesson content for active courses only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublicLessonData } from '@/app/lib/public-lesson';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

/**
 * GET /api/courses/[courseId]/day/[dayNumber]/public
 * Returns lesson title, content, and course info. No auth. 404 if course/lesson inactive or not found.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; dayNumber: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { courseId, dayNumber } = await params;
    const day = parseInt(dayNumber, 10);
    if (isNaN(day) || day < 1) {
      return NextResponse.json({ error: 'Invalid day number' }, { status: 400 });
    }

    const data = await getPublicLessonData(courseId, day);
    if (!data) {
      return NextResponse.json({ error: 'Course or lesson not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      course: data.course,
      lesson: data.lesson,
    });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}
