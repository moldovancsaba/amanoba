/**
 * Public Course Live Sessions API (#24)
 *
 * GET /api/courses/[courseId]/live-sessions
 * Returns upcoming (and currently-live) scheduled sessions for a course,
 * for display on the course page. Cancelled/ended sessions are omitted.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Course, LiveSession } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId }).select('_id').lean();
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    // Keep sessions that started up to 2h ago so an in-progress session still shows.
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const sessions = await LiveSession.find({
      courseId: (course as { _id: unknown })._id,
      status: { $in: ['scheduled', 'live'] },
      scheduledStartAt: { $gte: cutoff },
    })
      .sort({ scheduledStartAt: 1 })
      .limit(20)
      .select('title description provider joinUrl scheduledStartAt scheduledEndAt timezone status')
      .lean();

    return NextResponse.json(
      { success: true, sessions },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    logger.error({ error }, 'Failed to fetch course live sessions');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
