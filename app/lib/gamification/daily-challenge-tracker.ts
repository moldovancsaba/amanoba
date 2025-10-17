/**
 * Daily Challenge Tracker
 * 
 * Purpose: Automatically track player progress on daily challenges
 * Why: Update challenge progress when relevant game events occur
 * 
 * Features:
 * - Auto-track progress based on session completion
 * - Support all challenge types
 * - Award rewards when challenges complete
 * - Event logging for analytics
 */

import mongoose from 'mongoose';
import {
  DailyChallenge,
  PlayerChallengeProgress,
  PointsWallet,
  PointsTransaction,
  PlayerProgression,
  EventLog,
} from '../models';
import type { IDailyChallenge, ChallengeType } from '../models/daily-challenge';
import logger from '../logger';

/**
 * Interface: Challenge Progress Context
 * Why: All data needed to check and update challenge progress
 */
export interface ChallengeProgressContext {
  playerId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  gameId?: mongoose.Types.ObjectId;
  sessionData: {
    outcome: 'win' | 'loss' | 'draw';
    pointsEarned: number;
    xpEarned: number;
    isPerfect?: boolean;
  };
  streakData?: {
    currentStreak: number;
  };
}

/**
 * Interface: Challenge Completion Result
 * Why: Return details about completed challenges
 */
export interface ChallengeCompletionResult {
  challengeId: mongoose.Types.ObjectId;
  title: string;
  rewardsEarned: {
    points: number;
    xp: number;
  };
}

/**
 * Update daily challenge progress for a player
 * 
 * What: Check active challenges and update progress based on session data
 * Why: Automatically track challenge progress without manual player action
 */
export async function updateDailyChallengeProgress(
  context: ChallengeProgressContext,
  session?: mongoose.mongo.ClientSession
): Promise<ChallengeCompletionResult[]> {
  try {
    const now = new Date();
    
    // Why: Get all active daily challenges for today (using UTC to match challenge creation)
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
    
let activeChallenges = await DailyChallenge.find({
      'availability.startTime': { $lte: now },
      'availability.endTime': { $gte: now },
      'availability.isActive': true,
      date: { $gte: startOfDay, $lt: endOfDay },
    }).session(session || null);
    
    logger.info(
      {
        playerId: context.playerId,
        activeChallengesFound: activeChallenges.length,
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
        now: now.toISOString(),
      },
      'Checking daily challenges for player'
    );
    
if (activeChallenges.length === 0) {
      // Why: Ensure today's challenges exist (progress may occur before challenges page is visited)
      const { ensureDailyChallengesForToday } = await import('./daily-challenge-service');
      const ensured = await ensureDailyChallengesForToday(session);
      activeChallenges = ensured.challenges.filter(c => c.availability.startTime <= now && c.availability.endTime > now);

      if (activeChallenges.length === 0) {
        logger.warn(
          {
            playerId: context.playerId,
            dateRange: { start: startOfDay.toISOString(), end: endOfDay.toISOString() },
          },
          'No active daily challenges found even after ensuring creation'
        );
        return [];
      }
    }
    
    const completedChallenges: ChallengeCompletionResult[] = [];
    
    // Why: Check each challenge and update progress
    for (const challenge of activeChallenges) {
      const progressUpdate = calculateProgressIncrement(challenge, context);
      
      logger.info(
        {
          playerId: context.playerId,
          challengeId: challenge._id,
          challengeType: challenge.type,
          challengeTitle: challenge.title,
          progressUpdate,
          currentProgress: 'will fetch',
        },
        'Challenge progress calculation'
      );
      
      if (progressUpdate === 0) {
        logger.debug(
          { challengeId: challenge._id, type: challenge.type },
          'Challenge not applicable to this session'
        );
        continue; // This challenge doesn't apply to this session
      }
      
      // Why: Get or create player progress record
      let progress = await PlayerChallengeProgress.findOne({
        playerId: context.playerId,
        challengeId: challenge._id,
      }).session(session || null);
      
      if (!progress) {
        progress = new PlayerChallengeProgress({
          playerId: context.playerId,
          challengeId: challenge._id,
          progress: 0,
          isCompleted: false,
          rewardsClaimed: false,
          metadata: {
            createdAt: now,
            updatedAt: now,
          },
        });
      }
      
      // Why: Update progress toward challenge target
      const previousProgress = progress.progress;
      progress.progress += progressUpdate;
      progress.metadata.updatedAt = now;
      
      // Why: Check if challenge is now completed
      if (
        !progress.isCompleted &&
        progress.progress >= challenge.requirement.target
      ) {
        progress.isCompleted = true;
        progress.completedAt = now;
        progress.rewardsClaimed = true; // Auto-claim rewards
        
        // Why: Award challenge rewards
        const rewardsResult = await awardChallengeRewards(
          context.playerId,
          context.brandId,
          challenge,
          session
        );
        
        completedChallenges.push({
          challengeId: challenge._id as mongoose.Types.ObjectId,
          title: challenge.title,
          rewardsEarned: rewardsResult,
        });
        
        // Why: Update challenge completion stats
        challenge.completions.total += 1;
        await challenge.save({ session: session || undefined });
        
        logger.info(
          {
            playerId: context.playerId,
            challengeId: challenge._id,
            challengeTitle: challenge.title,
            rewards: rewardsResult,
          },
          'Daily challenge completed'
        );
      }
      
      await progress.save({ session: session || undefined });
      
      logger.debug(
        {
          playerId: context.playerId,
          challengeId: challenge._id,
          previousProgress,
          newProgress: progress.progress,
          target: challenge.requirement.target,
          isCompleted: progress.isCompleted,
        },
        'Daily challenge progress updated'
      );
    }
    
    return completedChallenges;
  } catch (error) {
    logger.error({ err: error, playerId: context.playerId }, 'Failed to update daily challenge progress');
    // Why: Don't throw - challenges are a bonus feature, shouldn't break main flow
    return [];
  }
}

/**
 * Calculate progress increment for a challenge based on session data
 * 
 * What: Determine how much progress this session contributes to the challenge
 * Why: Different challenge types track different metrics
 */
function calculateProgressIncrement(
  challenge: IDailyChallenge,
  context: ChallengeProgressContext
): number {
  switch (challenge.type) {
    case 'games_played':
      // Why: Any game completion counts
      return 1;
      
    case 'games_won':
      // Why: Only wins count
      return context.sessionData.outcome === 'win' ? 1 : 0;
      
    case 'points_earned':
      // Why: Track cumulative points earned
      return context.sessionData.pointsEarned;
      
    case 'xp_earned':
      // Why: Track cumulative XP earned
      return context.sessionData.xpEarned;
      
    case 'specific_game':
      // Why: Must play/win specific game
      if (challenge.requirement.gameId && context.gameId) {
        const isSameGame = challenge.requirement.gameId.equals(context.gameId);
        if (!isSameGame) return 0;
        
        // Check if it's play or win requirement
        if (challenge.requirement.metric === 'win') {
          return context.sessionData.outcome === 'win' ? 1 : 0;
        }
        return 1; // Just playing counts
      }
      return 0;
      
    case 'win_streak':
      // Why: Track current win streak
      if (context.streakData) {
        // Only increment if this session extended the streak
        return context.sessionData.outcome === 'win' ? 1 : 0;
      }
      return 0;
      
    case 'perfect_games':
      // Why: Track perfect game completions
      return context.sessionData.isPerfect ? 1 : 0;
      
    case 'play_consecutive':
      // Why: This is tracked separately by login streak system
      return 0;
      
    default:
      logger.warn({ challengeType: challenge.type }, 'Unknown challenge type');
      return 0;
  }
}

/**
 * Award rewards for completing a challenge
 * 
 * What: Give player points and XP for completing a challenge
 * Why: Incentivize challenge completion
 */
async function awardChallengeRewards(
  playerId: mongoose.Types.ObjectId,
  brandId: mongoose.Types.ObjectId,
  challenge: IDailyChallenge,
  session?: mongoose.mongo.ClientSession
): Promise<{ points: number; xp: number }> {
  const { points, xp } = challenge.rewards;
  
  // Why: Update points wallet
  const wallet = await PointsWallet.findOne({ playerId }).session(session || null);
  
  if (wallet) {
    const balanceBefore = wallet.currentBalance;
    wallet.currentBalance += points;
    wallet.lifetimeEarned += points;
    wallet.lastTransaction = new Date();
    await wallet.save({ session: session || undefined });
    
    // Why: Create transaction record
    await PointsTransaction.create(
      [
        {
          playerId,
          walletId: wallet._id,
          type: 'earn',
          amount: points,
          balanceBefore,
          balanceAfter: wallet.currentBalance,
          source: {
            type: 'daily_challenge',
            referenceId: challenge._id,
            description: `Daily Challenge: ${challenge.title}`,
          },
          metadata: {
            createdAt: new Date(),
          },
        },
      ],
      { session: session || undefined }
    );
  }
  
  // Why: Update XP in player progression
  const progression = await PlayerProgression.findOne({ playerId }).session(
    session || null
  );
  
  if (progression) {
    progression.totalXP += xp;
    progression.currentXP += xp;
    progression.metadata.updatedAt = new Date();
    await progression.save({ session: session || undefined });
  }
  
  // Why: Log challenge completion event
  await EventLog.create(
    [
      {
        playerId,
        brandId,
        eventType: 'challenge_completed',
        eventData: {
          challengeId: challenge._id,
          challengeTitle: challenge.title,
          challengeDifficulty: challenge.difficulty,
          rewardsEarned: { points, xp },
        },
        timestamp: new Date(),
        metadata: {
          challengeType: challenge.type,
          difficulty: challenge.difficulty,
          pointsEarned: points,
          xpEarned: xp,
        },
      },
    ],
    { session: session || undefined }
  );
  
  return { points, xp };
}
