/**
 * Streak Management System
 * 
 * Purpose: Track and manage win streaks and daily login streaks
 * Why: Streaks drive engagement and reward consistent play
 * 
 * Features:
 * - Win streak tracking (consecutive wins)
 * - Daily login streak tracking
 * - Streak expiration logic
 * - Streak bonuses and multipliers
 * - Milestone rewards
 */

import mongoose from 'mongoose';
import { Streak } from '../models';
import logger from '../logger';

/**
 * Update win streak for a player
 * 
 * What: Increments or resets win streak based on game outcome
 * Why: Rewards consecutive victories
 */
export async function updateWinStreak(
  playerId: mongoose.Types.ObjectId,
  outcome: 'win' | 'loss' | 'draw'
): Promise<{
  currentStreak: number;
  bestStreak: number;
  bonusMultiplier: number;
  milestoneReached?: number;
}> {
  try {
    // Get or create streak record
    let streak = await Streak.findOne({
      playerId,
      type: 'win',
    });
    
    if (!streak) {
      streak = new Streak({
        playerId,
        type: 'win',
        currentStreak: 0,
        bestStreak: 0,
        lastActivity: new Date(),
        streakStart: new Date(),
        bonusMultiplier: 1.0,
        milestones: [],
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
    
    const previousStreak = streak.currentStreak;
    
    if (outcome === 'win') {
      // Increment streak
      streak.currentStreak += 1;
      streak.lastActivity = new Date();
      
      if (streak.currentStreak === 1) {
        streak.streakStart = new Date();
      }
      
      // Update best streak if exceeded
      if (streak.currentStreak > streak.bestStreak) {
        streak.bestStreak = streak.currentStreak;
      }
      
      // Calculate bonus multiplier (scales with streak)
      // Why: Progressive rewards for longer streaks
      streak.bonusMultiplier = Math.min(
        3.0, // Max 3x multiplier
        1.0 + (streak.currentStreak * 0.05) // +5% per win
      );
      
      // Check for milestones
      const milestoneReached = checkStreakMilestone(
        streak.currentStreak,
        previousStreak
      );
      
      if (milestoneReached) {
        streak.milestones.push({
          value: milestoneReached,
          achievedAt: new Date(),
          rewardGiven: false,
        });
      }
      
      await streak.save();
      
      logger.info(
        {
          playerId,
          currentStreak: streak.currentStreak,
          bonusMultiplier: streak.bonusMultiplier,
          milestoneReached,
        },
        'Win streak updated'
      );
      
      return {
        currentStreak: streak.currentStreak,
        bestStreak: streak.bestStreak,
        bonusMultiplier: streak.bonusMultiplier,
        milestoneReached,
      };
    } else if (outcome === 'loss') {
      // Break streak
      const brokenStreak = streak.currentStreak;
      streak.currentStreak = 0;
      streak.bonusMultiplier = 1.0;
      streak.lastActivity = new Date();
      
      await streak.save();
      
      logger.info(
        { playerId, brokenStreak },
        'Win streak broken'
      );
      
      return {
        currentStreak: 0,
        bestStreak: streak.bestStreak,
        bonusMultiplier: 1.0,
      };
    }
    
    // Draw doesn't affect streak
    return {
      currentStreak: streak.currentStreak,
      bestStreak: streak.bestStreak,
      bonusMultiplier: streak.bonusMultiplier,
    };
  } catch (error) {
    logger.error({ err: error, playerId }, 'Failed to update win streak');
    throw error;
  }
}

/**
 * Update daily login streak
 * 
 * What: Tracks consecutive days player has logged in
 * Why: Rewards daily engagement
 */
export async function updateDailyLoginStreak(
  playerId: mongoose.Types.ObjectId
): Promise<{
  currentStreak: number;
  continued: boolean;
  milestoneReached?: number;
}> {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    // Get or create streak record
    let streak = await Streak.findOne({
      playerId,
      type: 'daily_login',
    });
    
    if (!streak) {
      // First login
      streak = new Streak({
        playerId,
        type: 'daily_login',
        currentStreak: 1,
        bestStreak: 1,
        lastActivity: now,
        streakStart: now,
        bonusMultiplier: 1.0,
        milestones: [],
        metadata: {
          createdAt: now,
          updatedAt: now,
          expiresAt: getNextDayEnd(now),
        },
      });
      
      await streak.save();
      
      return {
        currentStreak: 1,
        continued: false,
      };
    }
    
    const lastLogin = streak.lastActivity;
    const lastLoginDate = new Date(
      lastLogin.getFullYear(),
      lastLogin.getMonth(),
      lastLogin.getDate()
    );
    
    // Already logged in today
    if (lastLoginDate.getTime() === todayStart.getTime()) {
      return {
        currentStreak: streak.currentStreak,
        continued: false,
      };
    }
    
    // Logged in yesterday - continue streak
    if (lastLoginDate.getTime() === yesterdayStart.getTime()) {
      const previousStreak = streak.currentStreak;
      streak.currentStreak += 1;
      streak.lastActivity = now;
      streak.metadata.expiresAt = getNextDayEnd(now);
      
      if (streak.currentStreak > streak.bestStreak) {
        streak.bestStreak = streak.currentStreak;
      }
      
      // Check for milestones
      const milestoneReached = checkStreakMilestone(
        streak.currentStreak,
        previousStreak
      );
      
      if (milestoneReached) {
        streak.milestones.push({
          value: milestoneReached,
          achievedAt: now,
          rewardGiven: false,
        });
      }
      
      await streak.save();
      
      logger.info(
        {
          playerId,
          currentStreak: streak.currentStreak,
          milestoneReached,
        },
        'Daily login streak continued'
      );
      
      return {
        currentStreak: streak.currentStreak,
        continued: true,
        milestoneReached,
      };
    }
    
    // Streak was broken - restart
    const brokenStreak = streak.currentStreak;
    streak.currentStreak = 1;
    streak.lastActivity = now;
    streak.streakStart = now;
    streak.bonusMultiplier = 1.0;
    streak.metadata.expiresAt = getNextDayEnd(now);
    
    await streak.save();
    
    logger.info(
      { playerId, brokenStreak },
      'Daily login streak broken and restarted'
    );
    
    return {
      currentStreak: 1,
      continued: false,
    };
  } catch (error) {
    logger.error({ err: error, playerId }, 'Failed to update daily login streak');
    throw error;
  }
}

/**
 * Get next day end timestamp
 * Why: Used for streak expiration
 */
function getNextDayEnd(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(23, 59, 59, 999);
  return nextDay;
}

/**
 * Check if streak reached a milestone
 * Why: Milestones trigger special rewards
 */
function checkStreakMilestone(
  currentStreak: number,
  previousStreak: number
): number | undefined {
  const milestones = [3, 7, 14, 30, 50, 100];
  
  for (const milestone of milestones) {
    if (currentStreak >= milestone && previousStreak < milestone) {
      return milestone;
    }
  }
  
  return undefined;
}

/**
 * Get current streaks for a player
 * 
 * What: Retrieves both win and login streaks
 * Why: Display on profile and dashboard
 */
export async function getPlayerStreaks(
  playerId: mongoose.Types.ObjectId
): Promise<{
  winStreak: {
    current: number;
    best: number;
    multiplier: number;
  };
  loginStreak: {
    current: number;
    best: number;
    expiresAt?: Date;
  };
}> {
  const streaks = await Streak.find({ playerId }).lean();
  
  const winStreak = streaks.find(s => s.type === 'win');
  const loginStreak = streaks.find(s => s.type === 'daily_login');
  
  return {
    winStreak: {
      current: winStreak?.currentStreak || 0,
      best: winStreak?.bestStreak || 0,
      multiplier: winStreak?.bonusMultiplier || 1.0,
    },
    loginStreak: {
      current: loginStreak?.currentStreak || 0,
      best: loginStreak?.bestStreak || 0,
      expiresAt: loginStreak?.metadata?.expiresAt,
    },
  };
}

/**
 * Check and expire old streaks
 * 
 * What: Cron job function to reset expired login streaks
 * Why: Ensures streaks break if player doesn't log in
 */
export async function expireOldStreaks(): Promise<number> {
  try {
    const now = new Date();
    
    const result = await Streak.updateMany(
      {
        type: 'daily_login',
        'metadata.expiresAt': { $lt: now },
        currentStreak: { $gt: 0 },
      },
      {
        $set: {
          currentStreak: 0,
          bonusMultiplier: 1.0,
        },
      }
    );
    
    logger.info(
      { expiredCount: result.modifiedCount },
      'Expired old login streaks'
    );
    
    return result.modifiedCount || 0;
  } catch (error) {
    logger.error({ err: error }, 'Failed to expire old streaks');
    throw error;
  }
}
