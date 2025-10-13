/**
 * Referral System API
 * 
 * Handles referral code generation, tracking, and reward distribution.
 * Players can invite friends and earn rewards when referrals sign up and play.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import {
  Player,
  ReferralTracking,
  PointsWallet,
  PointsTransaction,
} from '@/lib/models';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';

/**
 * GET /api/referrals?playerId=xxx
 * 
 * Get referral dashboard data for a player:
 * - Referral code
 * - List of referred players
 * - Pending and completed rewards
 * - Total referrals count
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get player
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }

    // Generate referral code based on player ID (consistent)
    const referralCode = generateReferralCode(player.displayName, playerId);

    // Get all referrals by this player
    const referrals = await ReferralTracking.find({ referrerId: playerId })
      .populate('referredPlayerId', 'displayName profilePicture createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate stats
    const totalReferrals = referrals.length;
    const pendingRewards = referrals.filter((r: any) => r.status === 'pending').length;
    const completedRewards = referrals.filter((r: any) => r.status === 'completed').length;
    const totalPointsEarned = referrals.reduce(
      (sum: number, r: any) => sum + (r.rewardDetails?.pointsEarned || 0),
      0
    );

    // Format referral data
    const referralData = referrals.map((ref: any) => ({
      id: ref._id,
      referredPlayer: {
        id: ref.referredPlayerId?._id,
        displayName: ref.referredPlayerId?.displayName || 'Unknown',
        profilePicture: ref.referredPlayerId?.profilePicture,
        joinedAt: ref.referredPlayerId?.createdAt,
      },
      status: ref.status,
      rewardDetails: ref.rewardDetails,
      completedAt: ref.completedAt,
      createdAt: ref.createdAt,
    }));

    logger.info({ playerId, totalReferrals }, 'Fetched referral dashboard');

    return NextResponse.json({
      success: true,
      data: {
        referralCode,
        shareUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?ref=${referralCode}`,
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
 * Create a referral tracking entry when a new player signs up with a referral code.
 * Called during player registration process.
 * 
 * Body:
 * - referredPlayerId: ID of the new player
 * - referralCode: Referral code used during signup
 */
export async function POST(request: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await request.json();
    const { referredPlayerId, referralCode } = body;

    if (!referredPlayerId || !referralCode) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find referrer by extracting player ID from code
    const extractedPlayerId = extractPlayerIdFromCode(referralCode);
    const referrer = await Player.findById(extractedPlayerId).session(session);
    if (!referrer) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    // Check if referral already exists
    const existing = await ReferralTracking.findOne({
      referredPlayerId,
    }).session(session);

    if (existing) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Player already referred' },
        { status: 400 }
      );
    }

    // Create referral tracking entry
    const referralTracking = await ReferralTracking.create(
      [
        {
          referrerId: referrer._id,
          referredPlayerId,
          referralCode,
          status: 'pending',
          metadata: {
            referrerDisplayName: referrer.displayName,
            createdAt: new Date(),
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();

    logger.info(
      {
        referrerId: referrer._id,
        referredPlayerId,
        referralCode,
      },
      'Referral tracking created'
    );

    return NextResponse.json({
      success: true,
      referralId: referralTracking[0]._id,
    });
  } catch (error) {
    await session.abortTransaction();
    logger.error({ error }, 'Failed to create referral tracking');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}

/**
 * PUT /api/referrals/[referralId]/complete
 * 
 * Complete a referral and distribute rewards.
 * Called when referred player reaches milestone (e.g., plays 5 games).
 */
export async function PUT(request: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await request.json();
    const { referralId } = body;

    if (!referralId) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Referral ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get referral tracking
    const referralTracking = await ReferralTracking.findById(referralId).session(
      session
    );

    if (!referralTracking) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Referral not found' },
        { status: 404 }
      );
    }

    if (referralTracking.status === 'completed') {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Referral already completed' },
        { status: 400 }
      );
    }

    // Award points to referrer
    const REFERRAL_REWARD = 500; // Points for successful referral
    const wallet = await PointsWallet.findOne({
      playerId: referralTracking.referrerId,
    }).session(session);

    if (!wallet) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Referrer wallet not found' },
        { status: 404 }
      );
    }

    const balanceBefore = wallet.currentBalance;
    wallet.currentBalance += REFERRAL_REWARD;
    wallet.lifetimeEarned += REFERRAL_REWARD;
    await wallet.save({ session });

    // Create points transaction
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
      { session }
    );

    // Update referral tracking
    referralTracking.status = 'completed';
    // Note: Add completedAt and rewardDetails fields to model if needed
    await referralTracking.save({ session });

    await session.commitTransaction();

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
    await session.abortTransaction();
    logger.error({ error }, 'Failed to complete referral');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}

/**
 * Generate consistent referral code based on display name and player ID
 */
function generateReferralCode(displayName: string, playerId: string): string {
  // Create base from display name (first 3-4 chars)
  const base = displayName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4)
    .padEnd(4, 'X');

  // Use last 4 chars of player ID for consistency
  const suffix = playerId.slice(-4).toUpperCase();

  return `${base}${suffix}`;
}

/**
 * Extract player ID from referral code
 */
function extractPlayerIdFromCode(referralCode: string): string {
  // Extract last 4 characters (simplified - in production use better encoding)
  const suffix = referralCode.slice(-4).toLowerCase();
  // Return as-is for now - proper implementation would reverse-engineer the full ID
  return suffix;
}
