/**
 * Practice Hub completion API
 *
 * What: Records meaningful Practice Hub completion outcomes and applies eligible rewards
 * Why: Ties review behavior into telemetry and a bounded anti-farming reward loop
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, CourseProgress, Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import {
  isPracticeCompletionTrigger,
  parsePracticeContext,
} from '@/app/lib/practice-hub';
import { grantPracticeHubCompletionReward } from '@/app/lib/practice-hub-rewards';
import { logPracticeHubEvent } from '@/app/lib/analytics/event-logger';

function getAssessmentResultKeys(assessmentResults: unknown): Set<string> {
  if (!assessmentResults) return new Set<string>();
  if (assessmentResults instanceof Map) {
    return new Set(Array.from(assessmentResults.keys()).map(String));
  }
  if (typeof assessmentResults === 'object') {
    return new Set(Object.keys(assessmentResults as Record<string, unknown>));
  }
  return new Set<string>();
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const body = await request.json();
    const practiceContext = parsePracticeContext(body?.practiceContext);
    const trigger = body?.trigger;

    if (!practiceContext || !isPracticeCompletionTrigger(trigger)) {
      return NextResponse.json({ error: 'Invalid Practice Hub completion payload' }, { status: 400 });
    }

    const course = await Course.findOne({ courseId: practiceContext.courseId }).select('_id').lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found for Practice Hub completion' }, { status: 404 });
    }

    const progress = await CourseProgress.findOne({
      playerId: player._id,
      courseId: course._id,
    }).lean();

    if (!progress) {
      return NextResponse.json({ error: 'Course progress not found for Practice Hub completion' }, { status: 404 });
    }

    const completedDays = Array.isArray(progress.completedDays) ? progress.completedDays : [];
    const assessmentResultKeys = getAssessmentResultKeys(progress.assessmentResults);
    const completionVerified =
      trigger === 'lesson_completed'
        ? completedDays.includes(practiceContext.lessonDay)
        : assessmentResultKeys.has(String(practiceContext.lessonDay));

    if (!completionVerified) {
      return NextResponse.json(
        { error: 'Practice Hub completion could not be verified from current course progress' },
        { status: 409 }
      );
    }

    await logPracticeHubEvent(playerId!, player.brandId.toString(), {
      event: 'completion_recorded',
      context: practiceContext,
      trigger,
    });

    const rewardResult = await grantPracticeHubCompletionReward({
      playerId: player._id as typeof player._id,
      brandId: player.brandId as typeof player.brandId,
      context: practiceContext,
      trigger,
    });

    return NextResponse.json({
      success: true,
      reward: rewardResult,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to record Practice Hub completion');
    return NextResponse.json({ error: 'Failed to record Practice Hub completion' }, { status: 500 });
  }
}
