/**
 * Notifications API (#28)
 *
 * GET   /api/notifications        — list the signed-in player's notifications + unread count
 * PATCH /api/notifications        — mark read: { all: true } or { ids: string[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Notification } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getPlayerId(session: Session | null): string | null {
  const user = session?.user as { id?: string; playerId?: string } | undefined;
  const id = user?.playerId || user?.id;
  return id && mongoose.isValidObjectId(id) ? id : null;
}

export async function GET(request: NextRequest) {
  try {
    const session = (await auth()) as Session | null;
    const playerId = getPlayerId(session);
    if (!playerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const recipient = new mongoose.Types.ObjectId(playerId);
    const limit = Math.min(50, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '30', 10) || 30));

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient }).sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({ recipient, isRead: false }),
    ]);

    return NextResponse.json(
      { success: true, notifications, unreadCount },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    logger.error({ error }, 'Failed to list notifications');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = (await auth()) as Session | null;
    const playerId = getPlayerId(session);
    if (!playerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const recipient = new mongoose.Types.ObjectId(playerId);
    const body = await request.json().catch(() => ({}));

    const filter: Record<string, unknown> = { recipient, isRead: false };
    if (!body.all) {
      const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown) => typeof id === 'string' && mongoose.isValidObjectId(id)) : [];
      if (ids.length === 0) return NextResponse.json({ error: 'Provide { all: true } or { ids: [...] }' }, { status: 400 });
      filter._id = { $in: ids.map((id: string) => new mongoose.Types.ObjectId(id)) };
    }

    const result = await Notification.updateMany(filter, { $set: { isRead: true } });
    return NextResponse.json({ success: true, updated: result.modifiedCount });
  } catch (error) {
    logger.error({ error }, 'Failed to mark notifications read');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
