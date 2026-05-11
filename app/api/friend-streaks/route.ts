import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { getDisplayedFriendStreakState, getFriendStreakPartner } from '@/lib/friend-streaks';
import { FriendStreak, Player } from '@/lib/models';
import { logger } from '@/lib/logger';

function generateInviteCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

async function resolveAuthedPlayer() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const user = session.user as { id?: string; playerId?: string };
  const playerId = user.playerId || user.id;
  const player = await Player.findById(playerId).select('_id brandId displayName').lean();
  if (!player) {
    return { error: NextResponse.json({ error: 'Player not found' }, { status: 404 }) };
  }

  return { player };
}

export async function GET() {
  try {
    await connectDB();

    const resolved = await resolveAuthedPlayer();
    if (resolved.error) return resolved.error;
    const { player } = resolved;
    const playerId = String(player._id);

    const friendStreaks = await FriendStreak.find({
      status: { $in: ['pending', 'active'] },
      $or: [{ ownerPlayerId: player._id }, { friendPlayerId: player._id }],
    })
      .sort({ 'metadata.createdAt': -1 })
      .lean();

    return NextResponse.json({
      success: true,
      friendStreaks: friendStreaks.map((friendStreak) => {
        const partner = getFriendStreakPartner(friendStreak, playerId);
        const state = getDisplayedFriendStreakState(friendStreak);
        const isOwner = String(friendStreak.ownerPlayerId) === playerId;

        return {
          id: String(friendStreak._id),
          status: friendStreak.status,
          inviteCode: friendStreak.status === 'pending' && isOwner ? friendStreak.inviteCode : null,
          createdAt: friendStreak.metadata?.createdAt || null,
          joinedAt: friendStreak.metadata?.joinedAt || null,
          lastSharedActivity: friendStreak.lastSharedActivity || null,
          currentSharedStreak: state.currentSharedStreak,
          bestSharedStreak: state.bestSharedStreak,
          statusLabel: state.statusLabel,
          atRisk: state.atRisk,
          stale: state.stale,
          partner,
        };
      }),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch friend streaks');
    return NextResponse.json({ error: 'Failed to fetch friend streaks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const resolved = await resolveAuthedPlayer();
    if (resolved.error) return resolved.error;
    const { player } = resolved;

    const body = await request.json().catch(() => ({}));
    const action = typeof body?.action === 'string' ? body.action.trim() : '';

    if (action === 'create') {
      const existingPending = await FriendStreak.findOne({
        ownerPlayerId: player._id,
        status: 'pending',
      }).lean();

      if (existingPending) {
        return NextResponse.json({
          success: true,
          friendStreak: {
            id: String(existingPending._id),
            status: existingPending.status,
            inviteCode: existingPending.inviteCode,
          },
        });
      }

      let inviteCode = generateInviteCode();
      while (await FriendStreak.exists({ inviteCode })) {
        inviteCode = generateInviteCode();
      }

      const friendStreak = await FriendStreak.create({
        brandId: player.brandId,
        ownerPlayerId: player._id,
        ownerDisplayNameSnapshot: player.displayName,
        inviteCode,
        status: 'pending',
        currentSharedStreak: 0,
        bestSharedStreak: 0,
        milestones: [],
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        friendStreak: {
          id: String(friendStreak._id),
          status: friendStreak.status,
          inviteCode: friendStreak.inviteCode,
        },
      });
    }

    if (action === 'join') {
      const inviteCode = typeof body?.inviteCode === 'string' ? body.inviteCode.trim().toUpperCase() : '';
      if (!inviteCode) {
        return NextResponse.json({ error: 'inviteCode is required' }, { status: 400 });
      }

      const friendStreak = await FriendStreak.findOne({
        inviteCode,
        status: 'pending',
      });

      if (!friendStreak) {
        return NextResponse.json({ error: 'Invite code not found or expired' }, { status: 404 });
      }

      if (String(friendStreak.ownerPlayerId) === String(player._id)) {
        return NextResponse.json({ error: 'You cannot join your own invite' }, { status: 400 });
      }

      if (String(friendStreak.brandId) !== String(player.brandId)) {
        return NextResponse.json({ error: 'Invite belongs to a different brand' }, { status: 400 });
      }

      const duplicate = await FriendStreak.findOne({
        status: { $in: ['pending', 'active'] },
        $or: [
          {
            ownerPlayerId: friendStreak.ownerPlayerId,
            friendPlayerId: player._id,
          },
          {
            ownerPlayerId: player._id,
            friendPlayerId: friendStreak.ownerPlayerId,
          },
        ],
      }).lean();

      if (duplicate && String(duplicate._id) !== String(friendStreak._id)) {
        return NextResponse.json({ error: 'This pair already has a friend streak' }, { status: 409 });
      }

      friendStreak.friendPlayerId = player._id;
      friendStreak.friendDisplayNameSnapshot = player.displayName;
      friendStreak.status = 'active';
      friendStreak.metadata.joinedAt = new Date();
      await friendStreak.save();

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    logger.error({ error }, 'Failed to mutate friend streaks');
    return NextResponse.json({ error: 'Failed to mutate friend streaks' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const resolved = await resolveAuthedPlayer();
    if (resolved.error) return resolved.error;
    const { player } = resolved;

    const body = await request.json().catch(() => ({}));
    const friendStreakId = typeof body?.friendStreakId === 'string' ? body.friendStreakId.trim() : '';
    if (!friendStreakId) {
      return NextResponse.json({ error: 'friendStreakId is required' }, { status: 400 });
    }

    const friendStreak = await FriendStreak.findOne({
      _id: friendStreakId,
      status: { $in: ['pending', 'active'] },
      $or: [{ ownerPlayerId: player._id }, { friendPlayerId: player._id }],
    });

    if (!friendStreak) {
      return NextResponse.json({ error: 'Friend streak not found' }, { status: 404 });
    }

    friendStreak.status = 'ended';
    friendStreak.inviteCode = `${friendStreak.inviteCode}-ENDED`;
    friendStreak.metadata.endedAt = new Date();
    await friendStreak.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to delete friend streak');
    return NextResponse.json({ error: 'Failed to delete friend streak' }, { status: 500 });
  }
}
