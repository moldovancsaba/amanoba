/**
 * Gamification Systems Index
 * 
 * Purpose: Central export point for all gamification utilities
 * Why: Simplifies imports throughout the application
 * 
 * Usage:
 *   import { calculatePoints, calculateXP, checkAndUnlockAchievements } from '@/app/lib/gamification';
 */

// Points Calculation System
export {
  calculatePoints,
  calculateConsolationPoints,
  validatePointsInput,
  type PointsCalculationInput,
  type PointsCalculationResult,
} from './points-calculator';

// XP and Level Progression System
export {
  calculateXP,
  calculateXPToNextLevel,
  processXPGain,
  getLevelUpRewards,
  estimateGamesToNextLevel,
  getLevelProgressPercentage,
  calculateTotalXP,
  type XPCalculationInput,
  type XPCalculationResult,
  type LevelUpResult,
} from './xp-progression';

// Achievement Engine
export {
  checkAndUnlockAchievements,
  evaluateAchievementCriteria,
  getAchievementCompletionRate,
  getPlayerAchievementsByCategory,
  type AchievementCheckContext,
  type AchievementUnlockResult,
} from './achievement-engine';

// Streak Management System
export {
  updateWinStreak,
  updateDailyLoginStreak,
  getPlayerStreaks,
  expireOldStreaks,
} from './streak-manager';
