/**
 * Certificate Lookup by Course
 *
 * What: Returns the current user's certificate for a course, if issued
 * Why: UI needs to show "View certificate" or "Issue" state
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Certificate, Player } from '@/lib/models';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    if (!playerId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    await connectDB();
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const certificate = await Certificate.findOne({
      playerId: player._id,
      courseId,
    }).lean();

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    logger.error({ error }, 'Failed to load certificate');
    return NextResponse.json({ error: 'Failed to load certificate' }, { status: 500 });
  }
}
