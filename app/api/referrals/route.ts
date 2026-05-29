/**
 * Referral System API
 *
 * Handles referral code generation, tracking, and reward distribution.
 * Players can invite friends and earn rewards when referrals sign up and play.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { Player, ReferralTracking } from '@/lib/models';
import { logger } from '@/lib/logger';
import { getAuthBaseUrl } from '@/app/lib/constants/app-url';
import { getPlayerIdFromSession, requireAdmin, requireAuth } from '@/lib/rbac';
import { processReferralSignup } from '@/lib/referrals/process-referral-signup';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/referrals
 *
 * Get referral dashboard data for the authenticated player.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const authCheck = requireAuth(request, session);
    if (authCheck) return authCheck;

    const playerId = getPlayerIdFromSession(session);
    if (!playerId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedPlayerId = searchParams.get('playerId');
    if (requestedPlayerId && requestedPlayerId !== playerId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }
    type PlayerWithDisplayName = { displayName?: string };
    const playerDoc = player as PlayerWithDisplayName;

    const referralCode = generateReferralCode(playerDoc.displayName ?? 'Player', playerId);

    const referrals = await ReferralTracking.find({ referrerId: playerId })
      .populate('refereeId', 'displayName profilePicture createdAt')
      .sort({ 'metadata.createdAt': -1 })
      .lean();

    const totalReferrals = referrals.length;
    const pendingRewards = referrals.filter((r: { status?: string }) => r.status === 'pending').length;
    const completedRewards = referrals.filter((r: { status?: string }) => r.status === 'completed' || r.status === 'rewarded').length;
    const totalPointsEarned = referrals.reduce(
      (sum: number, r: { rewards?: { referrerPoints?: number } }) => sum + (r.rewards?.referrerPoints || 0),
      0
    );

    type PopulatedReferee = { _id?: unknown; displayName?: string; profilePicture?: string; createdAt?: Date };
    type ReferralRow = { _id?: unknown; refereeId?: PopulatedReferee; status?: string; rewards?: { referrerPoints?: number }; metadata?: { createdAt?: Date; completedAt?: Date } };
    const referralData = referrals.map((ref: ReferralRow) => ({
      id: ref._id,
      referredPlayer: {
        id: ref.refereeId?._id ?? ref.refereeId,
        displayName: (ref.refereeId?.displayName ?? 'Unknown') as string,
        profilePicture: ref.refereeId?.profilePicture,
        joinedAt: ref.refereeId?.createdAt ?? ref.metadata?.createdAt,
      },
      status: ref.status,
      rewardDetails: {
        pointsEarned: ref.rewards?.referrerPoints ?? 0,
      },
      completedAt: ref.metadata?.completedAt,
      createdAt: ref.metadata?.createdAt,
    }));

    logger.info({ playerId, totalReferrals }, 'Fetched referral dashboard');

    return NextResponse.json({
      success: true,
      data: {
        referralCode,
        shareUrl: `${getAuthBaseUrl()}?ref=${referralCode}`,
        stats: {
          totalReferrals,
          pendingRewards,
          completedRewards,
          totalPointsEarned,
        },
        referrals: referralData,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch referral dashboard');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/referrals
 *
 * Create referral tracking when the authenticated player signs up with a referral code.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const authCheck = requireAuth(request, session);
    if (authCheck) return authCheck;

    const sessionPlayerId = getPlayerIdFromSession(session);
    if (!sessionPlayerId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { referredPlayerId, referralCode } = body;

    if (referredPlayerId && referredPlayerId !== sessionPlayerId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const result = await processReferralSignup({
      referredPlayerId: sessionPlayerId,
      referralCode,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      success: true,
      referralId: result.referralId,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to create referral tracking');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/referrals
 *
 * Complete a referral and distribute rewards (admin-only).
 */
export async function PUT(request: NextRequest) {
  const session = await auth();
  const adminCheck = requireAdmin(request, session);
  if (adminCheck) return adminCheck;

  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const body = await request.json();
    const { referralId } = body;

    if (!referralId) {
      await dbSession.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Referral ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const { ReferralTracking, PointsWallet, PointsTransaction } = await import('@/lib/models');

    const referralTracking = await ReferralTracking.findById(referralId).session(dbSession);

    if (!referralTracking) {
      await dbSession.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Referral not found' },
        { status: 404 }
      );
    }

    if (referralTracking.status === 'completed') {
      await dbSession.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Referral already completed' },
        { status: 400 }
      );
    }

    const REFERRAL_REWARD = 500;
    const wallet = await PointsWallet.findOne({
      playerId: referralTracking.referrerId,
    }).session(dbSession);

    if (!wallet) {
      await dbSession.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Referrer wallet not found' },
        { status: 404 }
      );
    }

    const balanceBefore = wallet.currentBalance;
    wallet.currentBalance += REFERRAL_REWARD;
    wallet.lifetimeEarned += REFERRAL_REWARD;
    await wallet.save({ session: dbSession });

    await PointsTransaction.create(
      [
        {
          playerId: referralTracking.referrerId,
          walletId: wallet._id,
          type: 'earn',
          amount: REFERRAL_REWARD,
          balanceBefore,
          balanceAfter: wallet.currentBalance,
          source: {
            type: 'referral',
            referenceId: referralTracking._id,
            description: 'Referral reward',
          },
          metadata: {
            createdAt: new Date(),
          },
        },
      ],
      { session: dbSession }
    );

    referralTracking.status = 'completed';
    referralTracking.rewards.referrerPoints = REFERRAL_REWARD;
    referralTracking.rewards.rewardedAt = new Date();
    referralTracking.metadata.completedAt = new Date();
    await referralTracking.save({ session: dbSession });

    await dbSession.commitTransaction();

    logger.info(
      {
        referralId,
        referrerId: referralTracking.referrerId,
        reward: REFERRAL_REWARD,
      },
      'Referral completed and rewarded'
    );

    return NextResponse.json({
      success: true,
      reward: REFERRAL_REWARD,
    });
  } catch (error) {
    await dbSession.abortTransaction();
    logger.error({ error }, 'Failed to complete referral');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    dbSession.endSession();
  }
}

function generateReferralCode(displayName: string, playerId: string): string {
  const base = displayName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4)
    .padEnd(4, 'X');

  const suffix = playerId.slice(-4).toUpperCase();

  return `${base}${suffix}`;
}
