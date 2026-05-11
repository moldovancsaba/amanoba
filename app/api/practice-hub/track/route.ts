/**
 * Practice Hub telemetry API
 *
 * What: Records bounded Practice Hub usage events
 * Why: Evaluates whether the Practice Hub changes learner behavior meaningfully
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { logPracticeHubEvent } from '@/app/lib/analytics/event-logger';
import { parsePracticeContext } from '@/app/lib/practice-hub';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId).lean();
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const body = await request.json();
    const event = typeof body?.event === 'string' ? body.event : '';
    if (event !== 'viewed' && event !== 'recommendation_opened') {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    const practiceContext = parsePracticeContext(body?.practiceContext);

    await logPracticeHubEvent(playerId!, player.brandId.toString(), {
      event,
      context: practiceContext ?? undefined,
      availableRecommendationCount:
        typeof body?.availableRecommendationCount === 'number'
          ? body.availableRecommendationCount
          : undefined,
      availableModeCount:
        typeof body?.availableModeCount === 'number'
          ? body.availableModeCount
          : undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to track Practice Hub event');
    return NextResponse.json({ error: 'Failed to track Practice Hub event' }, { status: 500 });
  }
}
