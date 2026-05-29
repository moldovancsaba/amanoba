/**
 * Shared referral signup processing.
 *
 * What: Creates referral tracking and awards referrer points when a new player signs up with a code.
 * Why: Used from authenticated POST /api/referrals and server-side signup flows (anonymous, SSO).
 */

import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import {
  Player,
  ReferralTracking,
  PointsWallet,
  PointsTransaction,
} from '@/lib/models';
import { logger } from '@/lib/logger';

const REFERRAL_REWARD = 500;

function extractPlayerIdFromCode(referralCode: string): string {
  return referralCode.slice(-4).toLowerCase();
}

export type ProcessReferralSignupInput = {
  referredPlayerId: string;
  referralCode: string;
};

export type ProcessReferralSignupResult =
  | { success: true; referralId: string }
  | { success: false; error: string; status: number };

export async function processReferralSignup(
  input: ProcessReferralSignupInput
): Promise<ProcessReferralSignupResult> {
  const { referredPlayerId, referralCode } = input;

  if (!referredPlayerId || !referralCode) {
    return { success: false, error: 'Missing required fields', status: 400 };
  }

  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const extractedPlayerId = extractPlayerIdFromCode(referralCode);
    const referrer = await Player.findById(extractedPlayerId).session(session);
    if (!referrer) {
      await session.abortTransaction();
      return { success: false, error: 'Invalid referral code', status: 404 };
    }

    const existing = await ReferralTracking.findOne({
      refereeId: referredPlayerId,
    }).session(session);

    if (existing) {
      await session.abortTransaction();
      return { success: false, error: 'Player already referred', status: 400 };
    }

    const referralTracking = await ReferralTracking.create(
      [
        {
          referrerId: referrer._id,
          refereeId: referredPlayerId,
          referralCode,
          status: 'pending',
          completionCriteria: {
            meetsRequirements: true,
          },
          rewards: {
            referrerPoints: REFERRAL_REWARD,
            refereePoints: 0,
            referrerBonusXP: 0,
            refereeBonusXP: 0,
          },
          metadata: {
            referrerDisplayName: referrer.displayName,
            createdAt: new Date(),
          },
        },
      ],
      { session }
    );

    const referrerWallet = await PointsWallet.findOne({
      playerId: referrer._id,
    }).session(session);

    if (referrerWallet) {
      const balanceBefore = referrerWallet.currentBalance;
      referrerWallet.currentBalance += REFERRAL_REWARD;
      referrerWallet.lifetimeEarned += REFERRAL_REWARD;
      await referrerWallet.save({ session });

      await PointsTransaction.create(
        [
          {
            playerId: referrer._id,
            walletId: referrerWallet._id,
            type: 'earn',
            amount: REFERRAL_REWARD,
            balanceBefore,
            balanceAfter: referrerWallet.currentBalance,
            source: {
              type: 'referral',
              referenceId: referralTracking[0]._id,
              description: 'Referral reward',
            },
            metadata: {
              createdAt: new Date(),
            },
          },
        ],
        { session }
      );

      referralTracking[0].status = 'completed';
      referralTracking[0].rewards.referrerPoints = REFERRAL_REWARD;
      referralTracking[0].rewards.rewardedAt = new Date();
      referralTracking[0].metadata.completedAt = new Date();
      await referralTracking[0].save({ session });

      logger.info(
        {
          referrerId: referrer._id,
          referredPlayerId,
          referralId: referralTracking[0]._id,
          reward: REFERRAL_REWARD,
        },
        'Referral auto-completed and rewarded on signup'
      );
    }

    await session.commitTransaction();

    logger.info(
      {
        referrerId: referrer._id,
        referredPlayerId,
        referralCode,
      },
      'Referral tracking created'
    );

    return {
      success: true,
      referralId: referralTracking[0]._id.toString(),
    };
  } catch (error) {
    await session.abortTransaction();
    logger.error({ error }, 'Failed to create referral tracking');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    };
  } finally {
    session.endSession();
  }
}
