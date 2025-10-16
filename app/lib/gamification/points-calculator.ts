/**
 * Points Calculation System
 * 
 * Purpose: Calculate points earned from game sessions
 * Why: Centralizes points logic for consistency across all games
 * 
 * Features:
 * - Base points from game configuration
 * - Performance multipliers (score, accuracy, speed)
 * - Streak bonuses
 * - Premium player bonuses
 * - Time-based bonuses
 */

import { IGame } from '../models/game';
import { IGameBrandConfig } from '../models/game-brand-config';
import { IStreak } from '../models/streak';

/**
 * Interface: Points Calculation Input
 * Why: Type-safe input for points calculation
 */
export interface PointsCalculationInput {
  game: IGame;
  gameBrandConfig: IGameBrandConfig;
  sessionData: {
    score: number;
    maxScore: number;
    accuracy?: number; // Percentage (0-100)
    duration: number; // Milliseconds
    hintsUsed?: number;
    outcome: 'win' | 'loss' | 'draw';
  };
  playerContext: {
    isPremium: boolean;
    currentWinStreak?: number;
    activeBoosts?: {
      pointsMultiplier?: number;
      expiresAt?: Date;
    };
  };
}

/**
 * Interface: Points Calculation Result
 * Why: Detailed breakdown for transparency and debugging
 */
export interface PointsCalculationResult {
  totalPoints: number;
  breakdown: {
    basePoints: number;
    scoreMultiplier: number;
    accuracyBonus: number;
    speedBonus: number;
    streakBonus: number;
    premiumBonus: number;
    brandMultiplier: number;
    boostMultiplier: number;
  };
  formula: string; // Human-readable calculation explanation
}

/**
 * Calculate points earned from a game session
 * 
 * What: Comprehensive points calculation with all multipliers and bonuses
 * Why: Ensures fair and consistent rewards across all games
 * 
 * Formula:
 * Total = (Base × Score% × Accuracy% × Speed%) 
 *         + Streak Bonus + Premium Bonus
 *         × Brand Multiplier × Boost Multiplier
 */
export function calculatePoints(input: PointsCalculationInput): PointsCalculationResult {
  const { game, gameBrandConfig, sessionData, playerContext } = input;
  
  // 1. Base Points (from game configuration)
  const basePoints = (game as { scoring?: { basePoints?: number } }).scoring?.basePoints || 100;
  
  // 2. Score Multiplier (how well player performed)
  // Why: Reward higher scores proportionally
  const scorePercentage = sessionData.maxScore > 0 
    ? sessionData.score / sessionData.maxScore 
    : 0;
  const scoreMultiplier = Math.max(0, Math.min(1, scorePercentage));
  
  // 3. Accuracy Bonus (for games with accuracy tracking)
  // Why: Reward precision play
  let accuracyBonus = 0;
  if (sessionData.accuracy !== undefined && (game as { scoring?: { accuracyMultiplier?: number } }).scoring?.accuracyMultiplier) {
    const accuracyPercentage = sessionData.accuracy / 100;
    const accuracyMult = (game as { scoring?: { accuracyMultiplier?: number } }).scoring?.accuracyMultiplier || 1;
    accuracyBonus = basePoints * accuracyPercentage * (accuracyMult - 1);
  }
  
  // 4. Speed Bonus (for games with time limits)
  // Why: Reward quick completion
  let speedBonus = 0;
  const gameWithScoring = game as { scoring?: { timeBonus?: boolean }; rules?: { timeLimit?: number } };
  if (gameWithScoring.scoring?.timeBonus && gameWithScoring.rules?.timeLimit) {
    const timeLimit = gameWithScoring.rules.timeLimit * 1000; // Convert to milliseconds
    const timeTaken = sessionData.duration;
    const timePercentage = Math.max(0, 1 - (timeTaken / timeLimit));
    
    // Bonus only if completed faster than 75% of time limit
    if (timePercentage > 0.25 && sessionData.outcome === 'win') {
      speedBonus = basePoints * timePercentage * 0.5; // Up to 50% bonus
    }
  }
  
  // 5. Streak Bonus (from active win streaks)
  // Why: Reward consistent performance
  let streakBonus = 0;
  if ((game as { scoring?: { streakBonus?: boolean } }).scoring?.streakBonus && playerContext.currentWinStreak) {
    const streak = playerContext.currentWinStreak;
    // Exponential bonus: 10 points per streak level, with diminishing returns
    streakBonus = Math.floor(10 * Math.log(streak + 1) * streak);
  }
  
  // 6. Premium Player Bonus
  // Why: Reward premium subscribers
  const premiumBonus = playerContext.isPremium 
    ? Math.floor(basePoints * 0.1) // 10% bonus
    : 0;
  
  // 7. Brand Configuration Multiplier
  // Why: Brands can adjust difficulty/rewards
  const brandMultiplier = gameBrandConfig.gameRules?.pointsMultiplier || 1.0;
  
  // 8. Active Boost Multiplier
  // Why: Temporary boosts from rewards
  let boostMultiplier = 1.0;
  if (playerContext.activeBoosts?.pointsMultiplier) {
    const boostExpiresAt = playerContext.activeBoosts.expiresAt;
    if (!boostExpiresAt || new Date() < boostExpiresAt) {
      boostMultiplier = playerContext.activeBoosts.pointsMultiplier;
    }
  }
  
  // 9. Calculate Total
  // Core points from performance
  const corePoints = (basePoints * scoreMultiplier) + accuracyBonus + speedBonus;
  
  // Add flat bonuses
  const withBonuses = corePoints + streakBonus + premiumBonus;
  
  // Apply multipliers
  const totalPoints = Math.floor(withBonuses * brandMultiplier * boostMultiplier);
  
  // 10. Build human-readable formula
  const formula = buildFormulaString({
    basePoints,
    scoreMultiplier,
    accuracyBonus,
    speedBonus,
    streakBonus,
    premiumBonus,
    brandMultiplier,
    boostMultiplier,
    totalPoints,
  });
  
  return {
    totalPoints: Math.max(0, totalPoints), // Never negative
    breakdown: {
      basePoints,
      scoreMultiplier,
      accuracyBonus,
      speedBonus,
      streakBonus,
      premiumBonus,
      brandMultiplier,
      boostMultiplier,
    },
    formula,
  };
}

/**
 * Build human-readable formula string
 * Why: Helps players understand how points were calculated
 */
function buildFormulaString(breakdown: PointsCalculationResult['breakdown'] & { totalPoints: number }): string {
  const parts: string[] = [];
  
  parts.push(`${breakdown.basePoints} base`);
  
  if (breakdown.scoreMultiplier < 1) {
    parts.push(`× ${(breakdown.scoreMultiplier * 100).toFixed(0)}% score`);
  }
  
  if (breakdown.accuracyBonus > 0) {
    parts.push(`+ ${Math.floor(breakdown.accuracyBonus)} accuracy`);
  }
  
  if (breakdown.speedBonus > 0) {
    parts.push(`+ ${Math.floor(breakdown.speedBonus)} speed`);
  }
  
  if (breakdown.streakBonus > 0) {
    parts.push(`+ ${breakdown.streakBonus} streak`);
  }
  
  if (breakdown.premiumBonus > 0) {
    parts.push(`+ ${breakdown.premiumBonus} premium`);
  }
  
  if (breakdown.brandMultiplier !== 1) {
    parts.push(`× ${breakdown.brandMultiplier} brand`);
  }
  
  if (breakdown.boostMultiplier !== 1) {
    parts.push(`× ${breakdown.boostMultiplier} boost`);
  }
  
  parts.push(`= ${breakdown.totalPoints}`);
  
  return parts.join(' ');
}

/**
 * Calculate minimum points for a loss
 * Why: Even losses should give some points to encourage continued play
 */
export function calculateConsolationPoints(
  game: IGame,
  isPremium: boolean
): number {
  const basePoints = (game as { scoring?: { basePoints?: number } }).scoring?.basePoints || 100;
  const consolation = Math.floor(basePoints * 0.1); // 10% of base
  const premiumBonus = isPremium ? Math.floor(consolation * 0.1) : 0;
  
  return consolation + premiumBonus;
}

/**
 * Validate points calculation input
 * Why: Prevent errors from invalid data
 */
export function validatePointsInput(input: PointsCalculationInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!input.game || !(input.game as { scoring?: unknown }).scoring) {
    errors.push('Game or scoring configuration missing');
  }
  
  if (input.sessionData.score < 0) {
    errors.push('Score cannot be negative');
  }
  
  if (input.sessionData.maxScore <= 0) {
    errors.push('Max score must be positive');
  }
  
  if (input.sessionData.accuracy !== undefined) {
    if (input.sessionData.accuracy < 0 || input.sessionData.accuracy > 100) {
      errors.push('Accuracy must be between 0 and 100');
    }
  }
  
  if (input.sessionData.duration < 0) {
    errors.push('Duration cannot be negative');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
