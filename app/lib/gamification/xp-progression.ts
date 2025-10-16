/**
 * XP and Level Progression System
 * 
 * Purpose: Manage player XP gain, level ups, and progression
 * Why: Central system for player advancement and engagement
 * 
 * Features:
 * - XP calculation from game sessions
 * - Dynamic level-up requirements
 * - Level-up rewards (titles, bonuses)
 * - XP multipliers and boosts
 */

import { IGame } from '../models/game';
import { IPlayerProgression } from '../models/player-progression';

/**
 * Interface: XP Calculation Input
 * Why: Type-safe input for XP calculation
 */
export interface XPCalculationInput {
  game: IGame;
  sessionData: {
    outcome: 'win' | 'loss' | 'draw';
    score: number;
    maxScore: number;
    accuracy?: number;
    duration: number;
  };
  playerContext: {
    currentLevel: number;
    isPremium: boolean;
    activeBoosts?: {
      xpMultiplier?: number;
      expiresAt?: Date;
    };
  };
}

/**
 * Interface: XP Calculation Result
 * Why: Detailed XP breakdown with multipliers
 */
export interface XPCalculationResult {
  totalXP: number;
  breakdown: {
    baseXP: number;
    outcomeMultiplier: number;
    performanceBonus: number;
    premiumBonus: number;
    boostMultiplier: number;
  };
}

/**
 * Interface: Level Up Result
 * Why: Contains all rewards and updates from leveling up
 */
export interface LevelUpResult {
  newLevel: number;
  xpOverflow: number; // XP that carries over to next level
  rewards: {
    points?: number;
    title?: string;
    unlocks?: string[]; // Features unlocked
  };
  newXPRequirement: number;
}

/**
 * Calculate XP earned from a game session
 * 
 * What: Calculates XP based on performance and multipliers
 * Why: Rewards player progression and engagement
 * 
 * Formula:
 * XP = (Base × Outcome × Performance) + Premium Bonus × Boost Multiplier
 */
export function calculateXP(input: XPCalculationInput): XPCalculationResult {
  const { game, sessionData, playerContext } = input;
  
  // 1. Base XP (typically 50% of points base value)
  const baseXP = ((game as { scoring?: { basePoints?: number } }).scoring?.basePoints || 100) * 0.5;
  
  // 2. Outcome Multiplier
  // Why: Wins give full XP, losses give partial XP
  let outcomeMultiplier = 1.0;
  switch (sessionData.outcome) {
    case 'win':
      outcomeMultiplier = 1.0;
      break;
    case 'draw':
      outcomeMultiplier = 0.5;
      break;
    case 'loss':
      outcomeMultiplier = 0.25; // Still reward participation
      break;
  }
  
  // 3. Performance Bonus (based on score percentage)
  // Why: Reward high scores even on losses
  const scorePercentage = sessionData.maxScore > 0 
    ? sessionData.score / sessionData.maxScore 
    : 0;
  const performanceBonus = baseXP * scorePercentage * 0.2; // Up to 20% bonus
  
  // 4. Premium Player Bonus
  // Why: Additional value for premium subscribers
  const premiumBonus = playerContext.isPremium 
    ? Math.floor(baseXP * 0.15) // 15% bonus
    : 0;
  
  // 5. Active Boost Multiplier
  // Why: Temporary XP boosts from rewards
  let boostMultiplier = 1.0;
  if (playerContext.activeBoosts?.xpMultiplier) {
    const boostExpiresAt = playerContext.activeBoosts.expiresAt;
    if (!boostExpiresAt || new Date() < boostExpiresAt) {
      boostMultiplier = playerContext.activeBoosts.xpMultiplier;
    }
  }
  
  // 6. Calculate Total
  const coreXP = (baseXP * outcomeMultiplier) + performanceBonus + premiumBonus;
  const totalXP = Math.floor(coreXP * boostMultiplier);
  
  return {
    totalXP: Math.max(0, totalXP), // Never negative
    breakdown: {
      baseXP,
      outcomeMultiplier,
      performanceBonus,
      premiumBonus,
      boostMultiplier,
    },
  };
}

/**
 * Calculate XP required for next level
 * 
 * What: Dynamic XP requirement that scales with level
 * Why: Keeps progression challenging but achievable
 * 
 * Formula: level × 100 × (1 + level × 0.1)
 * 
 * Examples:
 * - Level 1 → 2: 110 XP
 * - Level 5 → 6: 600 XP
 * - Level 10 → 11: 2,000 XP
 * - Level 20 → 21: 6,000 XP
 */
export function calculateXPToNextLevel(currentLevel: number): number {
  // Exponential scaling with diminishing returns
  // Why: Early levels are quick, higher levels take more time but not impossibly long
  const base = 100;
  const scaleFactor = 1 + (currentLevel * 0.1);
  
  return Math.floor(currentLevel * base * scaleFactor);
}

/**
 * Process XP gain and check for level ups
 * 
 * What: Adds XP to player and handles cascading level ups
 * Why: Players can level up multiple times in one session
 */
export function processXPGain(
  currentProgression: {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
  },
  xpGained: number
): {
  leveledUp: boolean;
  levelsGained: number;
  finalLevel: number;
  finalCurrentXP: number;
  finalXPToNextLevel: number;
  levelUpResults: LevelUpResult[];
} {
  let level = currentProgression.level;
  let currentXP = currentProgression.currentXP + xpGained;
  let xpToNextLevel = currentProgression.xpToNextLevel;
  let levelsGained = 0;
  const levelUpResults: LevelUpResult[] = [];
  
  // Process cascading level ups
  // Why: Handle case where player gains enough XP for multiple levels
  while (currentXP >= xpToNextLevel && level < 100) { // Max level 100
    levelsGained++;
    const xpOverflow = currentXP - xpToNextLevel;
    level++;
    
    // Calculate new XP requirement
    xpToNextLevel = calculateXPToNextLevel(level);
    
    // Generate level-up rewards
    const rewards = getLevelUpRewards(level);
    
    levelUpResults.push({
      newLevel: level,
      xpOverflow,
      rewards,
      newXPRequirement: xpToNextLevel,
    });
    
    // Carry over excess XP
    currentXP = xpOverflow;
  }
  
  return {
    leveledUp: levelsGained > 0,
    levelsGained,
    finalLevel: level,
    finalCurrentXP: currentXP,
    finalXPToNextLevel: xpToNextLevel,
    levelUpResults,
  };
}

/**
 * Get rewards for reaching a specific level
 * 
 * What: Returns points, titles, and feature unlocks for level milestones
 * Why: Provides tangible value and excitement for leveling up
 */
export function getLevelUpRewards(level: number): {
  points?: number;
  title?: string;
  unlocks?: string[];
} {
  const rewards: {
    points?: number;
    title?: string;
    unlocks?: string[];
  } = {};
  
  // Points reward (scales with level)
  rewards.points = level * 50;
  
  // Title milestones
  if (level === 5) rewards.title = 'Novice';
  if (level === 10) rewards.title = 'Adept';
  if (level === 15) rewards.title = 'Expert';
  if (level === 20) rewards.title = 'Master';
  if (level === 30) rewards.title = 'Champion';
  if (level === 40) rewards.title = 'Legend';
  if (level === 50) rewards.title = 'Mythic';
  if (level === 75) rewards.title = 'Transcendent';
  if (level === 100) rewards.title = 'Immortal';
  
  // Feature unlocks
  rewards.unlocks = [];
  
  if (level === 3) rewards.unlocks.push('Daily Challenges');
  if (level === 5) rewards.unlocks.push('Leaderboards');
  if (level === 10) rewards.unlocks.push('Rewards Store');
  if (level === 15) rewards.unlocks.push('Custom Avatars');
  if (level === 20) rewards.unlocks.push('Referral Program');
  if (level === 25) rewards.unlocks.push('Quests System');
  
  return rewards;
}

/**
 * Calculate estimated time to next level
 * 
 * What: Predicts games needed to reach next level
 * Why: Helps set player expectations
 */
export function estimateGamesToNextLevel(
  currentXP: number,
  xpToNextLevel: number,
  averageXPPerGame: number
): {
  gamesNeeded: number;
  xpRemaining: number;
} {
  const xpRemaining = xpToNextLevel - currentXP;
  const gamesNeeded = Math.ceil(xpRemaining / averageXPPerGame);
  
  return {
    gamesNeeded: Math.max(0, gamesNeeded),
    xpRemaining: Math.max(0, xpRemaining),
  };
}

/**
 * Get level progress percentage
 * 
 * What: Calculates % progress toward next level
 * Why: Visual feedback for players
 */
export function getLevelProgressPercentage(
  currentXP: number,
  xpToNextLevel: number
): number {
  if (xpToNextLevel === 0) return 100;
  return Math.min(100, (currentXP / xpToNextLevel) * 100);
}

/**
 * Calculate total XP from level and current XP
 * 
 * What: Lifetime XP for leaderboards
 * Why: Compare players at different levels fairly
 */
export function calculateTotalXP(level: number, currentXP: number): number {
  let totalXP = currentXP;
  
  // Sum XP requirements for all previous levels
  for (let i = 1; i < level; i++) {
    totalXP += calculateXPToNextLevel(i);
  }
  
  return totalXP;
}
