/**
 * Practice Hub reward integration
 *
 * What: Applies one-time Practice Hub completion rewards and telemetry
 * Why: Rewards meaningful review recovery without allowing reward farming
 */

import mongoose from 'mongoose';
import {
  PlayerProgression,
  PointsTransaction,
  PointsWallet,
  PracticeHubRewardGrant,
} from '@/lib/models';
import {
  PRACTICE_HUB_QUIZ_RECOVERY_REWARD,
  type PracticeCompletionTrigger,
  type PracticeContext,
  isPracticeRewardEligible,
} from '@/app/lib/practice-hub';
import { processXPGain } from '@/app/lib/gamification/xp-progression';
import { logLevelUp, logPointsTransaction, logPracticeHubEvent } from '@/app/lib/analytics/event-logger';
import { logger } from '@/lib/logger';

type RewardGrantRejectedReason = 'not_eligible' | 'already_granted';

type GrantedRewardGrantResult = {
  granted: true;
  pointsAwarded: number;
  xpAwarded: number;
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
  balanceAfter: number;
  transactionId: string;
};

type RewardGrantResult =
  | {
      granted: false;
      reason: RewardGrantRejectedReason;
    }
  | GrantedRewardGrantResult;

function createEmptyProgression(playerId: mongoose.Types.ObjectId) {
  return new PlayerProgression({
    playerId,
    level: 1,
    currentXP: 0,
    totalXP: 0,
    xpToNextLevel: 100,
    statistics: {
      totalGamesPlayed: 0,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      totalPlayTime: 0,
      averageSessionTime: 0,
      bestStreak: 0,
      currentStreak: 0,
      dailyLoginStreak: 0,
      lastLoginDate: new Date(),
    },
    achievements: {
      totalUnlocked: 0,
      totalAvailable: 0,
      recentUnlocks: [],
    },
    milestones: [],
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      lastXPGain: new Date(),
    },
  });
}

function createEmptyWallet(playerId: mongoose.Types.ObjectId) {
  return new PointsWallet({
    playerId,
    currentBalance: 0,
    lifetimeEarned: 0,
    lifetimeSpent: 0,
    pendingBalance: 0,
    lastTransaction: new Date(),
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      lastBalanceCheck: new Date(),
    },
  });
}

export async function grantPracticeHubCompletionReward(input: {
  playerId: mongoose.Types.ObjectId;
  brandId?: mongoose.Types.ObjectId;
  context: PracticeContext;
  trigger: PracticeCompletionTrigger;
}): Promise<RewardGrantResult> {
  const { playerId, brandId, context, trigger } = input;

  if (!isPracticeRewardEligible(context, trigger)) {
    return { granted: false, reason: 'not_eligible' };
  }

  const session = await mongoose.startSession();
  let grantedResult: GrantedRewardGrantResult | null = null;
  let rejectedReason: RewardGrantRejectedReason = 'not_eligible';

  try {
    await session.withTransaction(async () => {
      const existingGrant = await PracticeHubRewardGrant.findOne({
        playerId,
        mode: context.mode,
        courseId: context.courseId,
        lessonDay: context.lessonDay,
      }).session(session);

      if (existingGrant) {
        rejectedReason = 'already_granted';
        return;
      }

      let wallet = await PointsWallet.findOne({ playerId }).session(session);
      if (!wallet) {
        wallet = createEmptyWallet(playerId);
        await wallet.save({ session });
      }

      let progression = await PlayerProgression.findOne({ playerId }).session(session);
      if (!progression) {
        progression = createEmptyProgression(playerId);
        await progression.save({ session });
      }

      const balanceBefore = wallet.currentBalance;
      wallet.currentBalance += PRACTICE_HUB_QUIZ_RECOVERY_REWARD.points;
      wallet.lifetimeEarned += PRACTICE_HUB_QUIZ_RECOVERY_REWARD.points;
      wallet.lastTransaction = new Date();
      await wallet.save({ session });

      const previousLevel = progression.level;
      const xpProcessResult = processXPGain(
        {
          level: progression.level,
          currentXP: progression.currentXP,
          xpToNextLevel: progression.xpToNextLevel,
        },
        PRACTICE_HUB_QUIZ_RECOVERY_REWARD.xp
      );

      progression.level = xpProcessResult.finalLevel;
      progression.currentXP = xpProcessResult.finalCurrentXP;
      progression.totalXP += PRACTICE_HUB_QUIZ_RECOVERY_REWARD.xp;
      progression.xpToNextLevel = xpProcessResult.finalXPToNextLevel;
      progression.metadata.lastXPGain = new Date();
      if (xpProcessResult.leveledUp) {
        progression.metadata.lastLevelUp = new Date();
      }
      await progression.save({ session });

      const transactions = await PointsTransaction.create(
        [
          {
            playerId,
            walletId: wallet._id,
            type: 'bonus',
            amount: PRACTICE_HUB_QUIZ_RECOVERY_REWARD.points,
            balanceBefore,
            balanceAfter: wallet.currentBalance,
            source: {
              type: 'practice_hub',
              description: `Practice Hub reward for ${context.mode} on ${context.courseId} day ${context.lessonDay}`,
            },
            metadata: {
              createdAt: new Date(),
            },
          },
        ],
        { session }
      );

      await PracticeHubRewardGrant.create(
        [
          {
            playerId,
            brandId,
            courseId: context.courseId,
            lessonDay: context.lessonDay,
            mode: context.mode,
            trigger,
            pointsAwarded: PRACTICE_HUB_QUIZ_RECOVERY_REWARD.points,
            xpAwarded: PRACTICE_HUB_QUIZ_RECOVERY_REWARD.xp,
            grantedAt: new Date(),
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
        { session }
      );

      grantedResult = {
        granted: true,
        pointsAwarded: PRACTICE_HUB_QUIZ_RECOVERY_REWARD.points,
        xpAwarded: PRACTICE_HUB_QUIZ_RECOVERY_REWARD.xp,
        leveledUp: xpProcessResult.leveledUp,
        previousLevel,
        newLevel: xpProcessResult.finalLevel,
        balanceAfter: wallet.currentBalance,
        transactionId: String(transactions[0]._id),
      };
    });
  } catch (error) {
    logger.error({ error, playerId, context }, 'Failed to grant Practice Hub reward');
    throw error;
  } finally {
    await session.endSession();
  }

  if (!grantedResult) {
    return { granted: false, reason: rejectedReason };
  }

  const settledGrant = grantedResult as GrantedRewardGrantResult;
  const playerIdString = playerId.toString();
  const brandIdString = brandId?.toString();

  await logPointsTransaction(
    playerIdString,
    brandIdString || '',
    {
      type: 'earned',
      amount: settledGrant.pointsAwarded,
      source: 'practice_hub',
      transactionId: settledGrant.transactionId,
      balanceAfter: settledGrant.balanceAfter,
    }
  );

  if (settledGrant.leveledUp) {
    await logLevelUp(
      playerIdString,
      brandIdString || '',
      {
        previousLevel: settledGrant.previousLevel,
        newLevel: settledGrant.newLevel,
        totalXP: settledGrant.xpAwarded,
      }
    );
  }

  await logPracticeHubEvent(playerIdString, brandIdString, {
    event: 'reward_granted',
    context,
    trigger,
    pointsAwarded: settledGrant.pointsAwarded,
    xpAwarded: settledGrant.xpAwarded,
    leveledUp: settledGrant.leveledUp,
  });

  return settledGrant;
}
