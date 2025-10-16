/**
 * Achievement Engine
 * 
 * Purpose: Check, unlock, and track player achievements
 * Why: Automates achievement unlocking and progress tracking
 * 
 * Features:
 * - Achievement criteria evaluation
 * - Progress tracking for incremental achievements
 * - Batch checking for efficiency
 * - Achievement unlock notifications
 */

import mongoose from 'mongoose';
import { Achievement, AchievementUnlock, PlayerProgression } from '../models';
import { IAchievement } from '../models/achievement';
import { IPlayerProgression } from '../models/player-progression';
import logger from '../logger';

/**
 * Interface: Achievement Check Context
 * Why: All data needed to evaluate achievement criteria
 */
export interface AchievementCheckContext {
  playerId: mongoose.Types.ObjectId;
  gameId?: mongoose.Types.ObjectId;
  progression: IPlayerProgression;
  recentSession?: {
    score: number;
    maxScore: number;
    accuracy?: number;
    duration: number;
    outcome: 'win' | 'loss' | 'draw';
  };
}

/**
 * Interface: Achievement Unlock Result
 * Why: Details of newly unlocked achievements
 */
export interface AchievementUnlockResult {
  achievement: IAchievement;
  unlockedAt: Date;
  rewards: {
    points: number;
    xp: number;
    title?: string;
  };
  wasAlreadyUnlocked: boolean;
}

/**
 * Check and unlock achievements for a player
 * 
 * What: Evaluates all active achievements and unlocks eligible ones
 * Why: Ensures players get credit for achievements as soon as earned
 */
export async function checkAndUnlockAchievements(
  context: AchievementCheckContext
): Promise<AchievementUnlockResult[]> {
  const results: AchievementUnlockResult[] = [];
  
  try {
    // Get all active achievements
    const achievements = await Achievement.find({
      'metadata.isActive': true,
    }).lean();
    
    // Get player's existing achievement unlocks
    const existingUnlocks = await AchievementUnlock.find({
      playerId: context.playerId,
    }).lean();
    
    const unlockedIds = new Set(
      existingUnlocks.map(u => u.achievementId.toString())
    );
    
    // Check each achievement
    for (const achievement of achievements) {
      const achievementId = achievement._id.toString();
      const isUnlocked = unlockedIds.has(achievementId);
      
      // Skip if already fully unlocked
      if (isUnlocked) {
        const unlock = existingUnlocks.find(
          u => u.achievementId.toString() === achievementId
        );
        if (unlock && unlock.progress >= 100) {
          continue;
        }
      }
      
      // Evaluate achievement criteria
      const evaluation = evaluateAchievementCriteria(
        achievement as IAchievement,
        context
      );
      
      if (evaluation.meetsRequirements) {
        // Unlock or update achievement
        const result = await unlockAchievement(
          context.playerId,
          achievement as IAchievement,
          evaluation.currentValue,
          context.recentSession
            ? new mongoose.Types.ObjectId() // Source session ID
            : undefined
        );
        
        if (result) {
          results.push(result);
        }
      } else if (evaluation.currentValue > 0) {
        // Update progress for incremental achievements
        await updateAchievementProgress(
          context.playerId,
          achievement._id as mongoose.Types.ObjectId,
          evaluation.currentValue,
          evaluation.progress
        );
      }
    }
    
    logger.info(
      { playerId: context.playerId, unlockedCount: results.length },
      'Achievement check completed'
    );
    
    return results;
  } catch (error) {
    logger.error({ err: error, playerId: context.playerId }, 'Achievement check failed');
    throw error;
  }
}

/**
 * Evaluate if achievement criteria are met
 * 
 * What: Checks if player meets achievement unlock requirements
 * Why: Centralized criteria evaluation logic
 */
export function evaluateAchievementCriteria(
  achievement: IAchievement,
  context: AchievementCheckContext
): {
  meetsRequirements: boolean;
  currentValue: number;
  targetValue: number;
  progress: number;
} {
  const criteria = achievement.criteria;
  let currentValue = 0;
  const targetValue = criteria.target;
  
  // Game-specific achievements
  if (criteria.gameId && context.gameId) {
    if (criteria.gameId.toString() !== context.gameId.toString()) {
      return {
        meetsRequirements: false,
        currentValue: 0,
        targetValue,
        progress: 0,
      };
    }
  }
  
  // Evaluate based on criteria type
  switch (criteria.type) {
    case 'games_played':
      currentValue = context.progression.statistics.totalGamesPlayed;
      break;
      
    case 'wins':
      currentValue = context.progression.statistics.totalWins;
      break;
      
    case 'streak':
      currentValue = context.progression.statistics.currentStreak;
      break;
      
    case 'points_earned':
      // This requires querying PointsWallet - simplified for now
      currentValue = 0; // Would need wallet lookup
      break;
      
    case 'level_reached':
      currentValue = context.progression.level;
      break;
      
    case 'perfect_score':
      if (context.recentSession) {
        currentValue = context.recentSession.score === context.recentSession.maxScore ? 1 : 0;
      }
      break;
      
    case 'speed':
      // Game-specific speed requirements
      if (context.recentSession) {
        // Would need game configuration to evaluate
        currentValue = 0;
      }
      break;
      
    case 'accuracy':
      if (context.recentSession && context.recentSession.accuracy !== undefined) {
        currentValue = context.recentSession.accuracy >= targetValue ? 1 : 0;
      }
      break;
      
    case 'custom':
      // Custom achievements need special handling
      currentValue = 0;
      break;
  }
  
  const progress = targetValue > 0 ? Math.min(100, (currentValue / targetValue) * 100) : 0;
  const meetsRequirements = currentValue >= targetValue;
  
  return {
    meetsRequirements,
    currentValue,
    targetValue,
    progress,
  };
}

/**
 * Unlock an achievement for a player
 * 
 * What: Creates achievement unlock record and updates counts
 * Why: Persists achievement unlock with rewards
 */
async function unlockAchievement(
  playerId: mongoose.Types.ObjectId,
  achievement: IAchievement,
  currentValue: number,
  sourceSessionId?: mongoose.Types.ObjectId
): Promise<AchievementUnlockResult | null> {
  try {
    const now = new Date();
    
    // Create or update unlock record
    const unlock = await AchievementUnlock.findOneAndUpdate(
      {
        playerId,
        achievementId: achievement._id,
      },
      {
        playerId,
        achievementId: achievement._id,
        unlockedAt: now,
        progress: 100,
        currentValue,
        sourceSessionId,
        'metadata.createdAt': now,
        'metadata.notified': false,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    
    const wasAlreadyUnlocked = unlock.progress === 100 && 
                               unlock.unlockedAt < now;
    
    if (!wasAlreadyUnlocked) {
      // Increment unlock count on achievement
      await Achievement.findByIdAndUpdate(achievement._id, {
        $inc: { 'metadata.unlockCount': 1 },
      });
      
      // Update player progression achievement count
      await PlayerProgression.findOneAndUpdate(
        { playerId },
        {
          $inc: { 'achievements.totalUnlocked': 1 },
          $push: {
            'achievements.recentUnlocks': {
              $each: [
                {
                  achievementId: achievement._id,
                  unlockedAt: now,
                },
              ],
              $slice: -5, // Keep only last 5
            },
          },
        }
      );
      
      logger.info(
        {
          playerId,
          achievementId: achievement._id,
          achievementName: achievement.name,
        },
        'Achievement unlocked'
      );
    }
    
    return {
      achievement,
      unlockedAt: now,
      rewards: {
        points: achievement.rewards.points,
        xp: achievement.rewards.xp,
        title: achievement.rewards.title,
      },
      wasAlreadyUnlocked,
    };
  } catch (error) {
    logger.error(
      { err: error, playerId, achievementId: achievement._id },
      'Failed to unlock achievement'
    );
    return null;
  }
}

/**
 * Update progress for an incremental achievement
 * 
 * What: Updates progress without fully unlocking
 * Why: Shows players how close they are to unlock
 */
async function updateAchievementProgress(
  playerId: mongoose.Types.ObjectId,
  achievementId: mongoose.Types.ObjectId,
  currentValue: number,
  progress: number
): Promise<void> {
  try {
    await AchievementUnlock.findOneAndUpdate(
      {
        playerId,
        achievementId,
      },
      {
        currentValue,
        progress,
        'metadata.createdAt': new Date(),
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  } catch (error) {
    logger.error(
      { err: error, playerId, achievementId },
      'Failed to update achievement progress'
    );
  }
}

/**
 * Get player's achievement completion rate
 * 
 * What: Calculates % of achievements unlocked
 * Why: Gamification metric for profiles/leaderboards
 */
export async function getAchievementCompletionRate(
  playerId: mongoose.Types.ObjectId
): Promise<{
  unlocked: number;
  total: number;
  percentage: number;
}> {
  const [unlocked, total] = await Promise.all([
    AchievementUnlock.countDocuments({
      playerId,
      progress: { $gte: 100 },
    }),
    Achievement.countDocuments({
      'metadata.isActive': true,
    }),
  ]);
  
  return {
    unlocked,
    total,
    percentage: total > 0 ? (unlocked / total) * 100 : 0,
  };
}

/**
 * Get achievements by category for a player
 * 
 * What: Retrieves achievements grouped by category with progress
 * Why: UI display for achievement screen
 */
export async function getPlayerAchievementsByCategory(
  playerId: mongoose.Types.ObjectId
): Promise<
  Map<
    string,
    Array<{
      achievement: IAchievement;
      progress: number;
      isUnlocked: boolean;
      unlockedAt?: Date;
    }>
  >
> {
  const achievements = await Achievement.find({
    'metadata.isActive': true,
  })
    .sort({ category: 1, tier: 1 })
    .lean();
  
  const unlocks = await AchievementUnlock.find({
    playerId,
  }).lean();
  
  const unlockMap = new Map(
    unlocks.map(u => [u.achievementId.toString(), u])
  );
  
  const grouped = new Map<string, Array<{ playerId: string; achievementId: string; unlockedAt: Date }>>();
  
  for (const achievement of achievements) {
    const unlock = unlockMap.get(achievement._id.toString());
    const category = achievement.category;
    
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    
    grouped.get(category)!.push({
      achievement,
      progress: unlock?.progress || 0,
      isUnlocked: (unlock?.progress || 0) >= 100,
      unlockedAt: unlock?.unlockedAt,
    });
  }
  
  return grouped;
}
