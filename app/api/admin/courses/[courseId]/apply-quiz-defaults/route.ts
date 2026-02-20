/**
 * Deprecated endpoint.
 *
 * What: Legacy flow that copied course question count into lesson.quizConfig.
 * Why: Lesson-level quiz behavior authority was removed in favor of course-level policy.
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  logger.info({ courseId }, 'Deprecated apply-quiz-defaults endpoint called');
  return NextResponse.json(
    {
      success: false,
      error: 'Deprecated: lesson-level quiz defaults sync was removed. Configure course-level lessonQuizPolicy instead.',
    },
    { status: 410 }
  );
}
