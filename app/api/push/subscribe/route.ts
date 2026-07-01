/**
 * Push Subscription API (#20)
 *
 * POST   /api/push/subscribe   body: PushSubscriptionJSON — save/refresh subscription
 * DELETE /api/push/subscribe   body: { endpoint } — remove subscription
 *
 * Auth required (subscriptions belong to the signed-in player).
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { PushSubscription } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function playerIdFrom(session: Session | null): string | null {
  const user = session?.user as { id?: string; playerId?: string } | undefined;
  const id = user?.playerId || user?.id;
  return id && mongoose.isValidObjectId(id) ? id : null;
}

export async function POST(request: NextRequest) {
  try {
    const session = (await auth()) as Session | null;
    const playerId = playerIdFrom(session);
    if (!playerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sub = await request.json().catch(() => null);
    const endpoint = sub?.endpoint;
    const p256dh = sub?.keys?.p256dh;
    const authKey = sub?.keys?.auth;
    if (!endpoint || !p256dh || !authKey) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    await connectDB();
    // Endpoint is unique; upsert re-binds it to the current player.
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      {
        $set: {
          playerId: new mongoose.Types.ObjectId(playerId),
          keys: { p256dh, auth: authKey },
          userAgent: request.headers.get('user-agent') || undefined,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to save push subscription');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = (await auth()) as Session | null;
    const playerId = playerIdFrom(session);
    if (!playerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const endpoint = body?.endpoint;
    if (!endpoint) return NextResponse.json({ error: 'endpoint required' }, { status: 400 });

    await connectDB();
    await PushSubscription.deleteOne({ endpoint, playerId: new mongoose.Types.ObjectId(playerId) });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to remove push subscription');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
