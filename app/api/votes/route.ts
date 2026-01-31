/**
 * Votes API
 *
 * POST: Submit or update vote (targetType, targetId, value: 1 | -1). Auth required.
 * GET: Get aggregate for a target (query: targetType, targetId). Optional: playerId to return current user's vote.
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { ContentVote } from '@/lib/models';
import { logger } from '@/lib/logger';
import type { VoteTargetType } from '@/lib/models/content-vote';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_TYPES: VoteTargetType[] = ['course', 'lesson', 'question'];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const playerId = session?.user?.id;
    if (!playerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const targetType = String(body.targetType || '').toLowerCase();
    const targetId = String(body.targetId || '').trim();
    const value = body.value === -1 ? -1 : 1;

    if (!VALID_TYPES.includes(targetType as VoteTargetType)) {
      return NextResponse.json({ error: 'Invalid targetType' }, { status: 400 });
    }
    if (!targetId) {
      return NextResponse.json({ error: 'targetId required' }, { status: 400 });
    }

    await connectDB();

    const playerObjectId = new mongoose.Types.ObjectId(playerId);
    const vote = await ContentVote.findOneAndUpdate(
      { targetType, targetId, playerId: playerObjectId },
      {
        $set: { value, updatedAt: new Date() },
        $setOnInsert: { targetType, targetId, playerId: playerObjectId },
      },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    logger.info({ targetType, targetId, playerId, value }, 'Vote submitted');

    return NextResponse.json({ success: true, vote: { targetType, targetId, value: vote.value } });
  } catch (error) {
    logger.error({ error }, 'Vote submit failed');
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const targetType = String(searchParams.get('targetType') || '').toLowerCase();
    const targetId = String(searchParams.get('targetId') || '').trim();
    const playerId = searchParams.get('playerId'); // optional: return current user vote

    if (!VALID_TYPES.includes(targetType as VoteTargetType) || !targetId) {
      return NextResponse.json({ error: 'targetType and targetId required' }, { status: 400 });
    }

    await connectDB();

    const votes = await ContentVote.find({ targetType, targetId }).lean();
    const sum = votes.reduce((s, v) => s + v.value, 0);
    const up = votes.filter((v) => v.value === 1).length;
    const down = votes.filter((v) => v.value === -1).length;

    let myVote: number | null = null;
    if (playerId) {
      const mine = votes.find((v) => v.playerId.toString() === playerId);
      if (mine) myVote = mine.value;
    }

    return NextResponse.json({
      success: true,
      aggregate: { sum, up, down, count: votes.length },
      myVote,
    });
  } catch (error) {
    logger.error({ error }, 'Vote aggregate failed');
    return NextResponse.json({ error: 'Failed to get vote aggregate' }, { status: 500 });
  }
}
