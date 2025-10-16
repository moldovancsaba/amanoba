/**
 * Progressive Disclosure System
 * 
 * Purpose: Gradually introduce features to new players to avoid overwhelming them
 * Why: Improves onboarding, reduces cognitive load, increases retention
 * 
 * Features:
 * - Level-based feature unlocking
 * - Session-based feature introduction
 * - Achievement-based unlocks
 * - Contextual feature discovery
 */

import { IPlayerProgression } from '../models/player-progression';

/**
 * Interface: Feature Definition
 * Why: Standardizes how features are defined and checked
 */
export interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'gameplay' | 'social' | 'economy' | 'customization' | 'competitive';
  unlockCriteria: {
    minLevel?: number;
    minGamesPlayed?: number;
    minAchievements?: number;
    requirePremium?: boolean;
    custom?: (progression: IPlayerProgression) => boolean;
  };
  priority: number; // Lower = shown first
  tutorialUrl?: string;
}

/**
 * All features in the system
 * Why: Central registry of features with unlock criteria
 */
export const FEATURES: Feature[] = [
  // Core Gameplay (always available)
  {
    id: 'basic_games',
    name: 'Basic Games',
    description: 'Play QUIZZZ and WHACKPOP',
    category: 'gameplay',
    unlockCriteria: {
      minLevel: 1,
    },
    priority: 1,
  },
  
  // Progression (Level 3)
  {
    id: 'daily_challenges',
    name: 'Daily Challenges',
    description: 'Complete special challenges for bonus rewards',
    category: 'gameplay',
    unlockCriteria: {
      minLevel: 3,
    },
    priority: 2,
  },
  
  // Competitive (Level 5)
  {
    id: 'leaderboards',
    name: 'Leaderboards',
    description: 'Compete with other players for top rankings',
    category: 'competitive',
    unlockCriteria: {
      minLevel: 5,
    },
    priority: 3,
  },
  
  // Economy (Level 10)
  {
    id: 'rewards_store',
    name: 'Rewards Store',
    description: 'Redeem your points for exclusive rewards',
    category: 'economy',
    unlockCriteria: {
      minLevel: 10,
    },
    priority: 4,
  },
  
  // Customization (Level 15)
  {
    id: 'custom_avatars',
    name: 'Custom Avatars',
    description: 'Personalize your profile with custom avatars and frames',
    category: 'customization',
    unlockCriteria: {
      minLevel: 15,
    },
    priority: 5,
  },
  
  // Social (Level 20)
  {
    id: 'referral_program',
    name: 'Referral Program',
    description: 'Invite friends and earn bonus points',
    category: 'social',
    unlockCriteria: {
      minLevel: 20,
    },
    priority: 6,
  },
  
  // Advanced Gameplay (Level 25)
  {
    id: 'quests',
    name: 'Quest System',
    description: 'Complete multi-stage quests for epic rewards',
    category: 'gameplay',
    unlockCriteria: {
      minLevel: 25,
    },
    priority: 7,
  },
  
  // Premium Game (Premium only)
  {
    id: 'madoku',
    name: 'Madoku',
    description: 'Advanced Sudoku puzzle game',
    category: 'gameplay',
    unlockCriteria: {
      requirePremium: true,
    },
    priority: 8,
  },
  
  // Achievement-based
  {
    id: 'achievement_showcase',
    name: 'Achievement Showcase',
    description: 'Display your proudest achievements on your profile',
    category: 'customization',
    unlockCriteria: {
      minLevel: 10,
      minAchievements: 5,
    },
    priority: 9,
  },
  
  // Experience-based
  {
    id: 'advanced_stats',
    name: 'Advanced Statistics',
    description: 'Detailed analytics of your gameplay performance',
    category: 'competitive',
    unlockCriteria: {
      minGamesPlayed: 50,
    },
    priority: 10,
  },
];

/**
 * Check if a feature is unlocked for a player
 * 
 * What: Evaluates unlock criteria against player progression
 * Why: Determines what features to show in UI
 */
export function isFeatureUnlocked(
  feature: Feature,
  progression: IPlayerProgression,
  isPremium: boolean
): boolean {
  const criteria = feature.unlockCriteria;
  
  // Check level requirement
  if (criteria.minLevel && progression.level < criteria.minLevel) {
    return false;
  }
  
  // Check games played requirement
  if (
    criteria.minGamesPlayed &&
    progression.statistics.totalGamesPlayed < criteria.minGamesPlayed
  ) {
    return false;
  }
  
  // Check achievements requirement
  if (
    criteria.minAchievements &&
    progression.achievements.totalUnlocked < criteria.minAchievements
  ) {
    return false;
  }
  
  // Check premium requirement
  if (criteria.requirePremium && !isPremium) {
    return false;
  }
  
  // Check custom criteria
  if (criteria.custom && !criteria.custom(progression)) {
    return false;
  }
  
  return true;
}

/**
 * Get all unlocked features for a player
 * 
 * What: Filters feature list to only show unlocked features
 * Why: UI needs to know what to display
 */
export function getUnlockedFeatures(
  progression: IPlayerProgression,
  isPremium: boolean
): Feature[] {
  return FEATURES.filter(feature =>
    isFeatureUnlocked(feature, progression, isPremium)
  ).sort((a, b) => a.priority - b.priority);
}

/**
 * Get locked features with progress
 * 
 * What: Shows what features are coming next and how to unlock them
 * Why: Motivates players to keep playing
 */
export function getLockedFeaturesWithProgress(
  progression: IPlayerProgression,
  isPremium: boolean
): Array<{
  feature: Feature;
  progress: number; // 0-100
  missingRequirements: string[];
}> {
  const locked = FEATURES.filter(
    feature => !isFeatureUnlocked(feature, progression, isPremium)
  );
  
  return locked
    .map(feature => {
      const { progress, missingRequirements } = calculateUnlockProgress(
        feature,
        progression,
        isPremium
      );
      
      return {
        feature,
        progress,
        missingRequirements,
      };
    })
    .sort((a, b) => b.progress - a.progress); // Closest to unlock first
}

/**
 * Calculate progress toward unlocking a feature
 * 
 * What: Determines how close player is to unlock
 * Why: Visual feedback shows players what to work toward
 */
function calculateUnlockProgress(
  feature: Feature,
  progression: IPlayerProgression,
  isPremium: boolean
): {
  progress: number;
  missingRequirements: string[];
} {
  const criteria = feature.unlockCriteria;
  const requirements: Array<{ met: boolean; description: string }> = [];
  
  // Level requirement
  if (criteria.minLevel) {
    const met = progression.level >= criteria.minLevel;
    requirements.push({
      met,
      description: `Reach level ${criteria.minLevel} (current: ${progression.level})`,
    });
  }
  
  // Games played requirement
  if (criteria.minGamesPlayed) {
    const met = progression.statistics.totalGamesPlayed >= criteria.minGamesPlayed;
    requirements.push({
      met,
      description: `Play ${criteria.minGamesPlayed} games (current: ${progression.statistics.totalGamesPlayed})`,
    });
  }
  
  // Achievements requirement
  if (criteria.minAchievements) {
    const met = progression.achievements.totalUnlocked >= criteria.minAchievements;
    requirements.push({
      met,
      description: `Unlock ${criteria.minAchievements} achievements (current: ${progression.achievements.totalUnlocked})`,
    });
  }
  
  // Premium requirement
  if (criteria.requirePremium) {
    requirements.push({
      met: isPremium,
      description: 'Upgrade to Premium',
    });
  }
  
  // Calculate overall progress
  const totalRequirements = requirements.length;
  const metRequirements = requirements.filter(r => r.met).length;
  const progress = totalRequirements > 0 ? (metRequirements / totalRequirements) * 100 : 0;
  
  // Get missing requirements
  const missingRequirements = requirements
    .filter(r => !r.met)
    .map(r => r.description);
  
  return {
    progress,
    missingRequirements,
  };
}

/**
 * Get newly unlocked features since last check
 * 
 * What: Identifies features that just became available
 * Why: Triggers unlock notifications and tutorials
 */
export function getNewlyUnlockedFeatures(
  previousLevel: number,
  currentLevel: number,
  previousGamesPlayed: number,
  currentGamesPlayed: number,
  previousAchievements: number,
  currentAchievements: number,
  isPremium: boolean
): Feature[] {
  // Create mock progression objects for comparison
  const previousProgression: Partial<IPlayerProgression> = {
    level: previousLevel,
    statistics: { totalGamesPlayed: previousGamesPlayed } as IPlayerProgression['statistics'],
    achievements: { totalUnlocked: previousAchievements } as IPlayerProgression['achievements'],
  };
  
  const currentProgression: Partial<IPlayerProgression> = {
    level: currentLevel,
    statistics: { totalGamesPlayed: currentGamesPlayed },
    achievements: { totalUnlocked: currentAchievements },
  };
  
  const wasLocked = FEATURES.filter(
    feature => !isFeatureUnlocked(feature, previousProgression, isPremium)
  );
  
  const nowUnlocked = wasLocked.filter(feature =>
    isFeatureUnlocked(feature, currentProgression, isPremium)
  );
  
  return nowUnlocked;
}

/**
 * Get next feature to unlock
 * 
 * What: Shows the closest feature to unlocking
 * Why: Gives players a clear short-term goal
 */
export function getNextFeatureToUnlock(
  progression: IPlayerProgression,
  isPremium: boolean
): {
  feature: Feature;
  progress: number;
  primaryRequirement: string;
} | null {
  const lockedWithProgress = getLockedFeaturesWithProgress(
    progression,
    isPremium
  );
  
  if (lockedWithProgress.length === 0) {
    return null;
  }
  
  // Get feature with highest progress
  const closest = lockedWithProgress[0];
  
  return {
    feature: closest.feature,
    progress: closest.progress,
    primaryRequirement: closest.missingRequirements[0] || 'Unknown',
  };
}

/**
 * Get onboarding checklist for new players
 * 
 * What: List of tasks for new players to complete
 * Why: Guides initial experience and engagement
 */
export function getOnboardingChecklist(
  progression: IPlayerProgression
): Array<{
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reward?: string;
}> {
  return [
    {
      id: 'play_first_game',
      title: 'Play Your First Game',
      description: 'Complete any game to earn points and XP',
      completed: progression.statistics.totalGamesPlayed >= 1,
      reward: '50 points + 100 XP',
    },
    {
      id: 'win_first_game',
      title: 'Win Your First Game',
      description: 'Achieve victory in any game',
      completed: progression.statistics.totalWins >= 1,
      reward: 'First Victory achievement',
    },
    {
      id: 'reach_level_3',
      title: 'Reach Level 3',
      description: 'Level up to unlock Daily Challenges',
      completed: progression.level >= 3,
      reward: 'Daily Challenges unlocked',
    },
    {
      id: 'earn_1000_points',
      title: 'Earn 1,000 Points',
      description: 'Accumulate points through gameplay',
      completed: false, // Would need wallet check
      reward: 'Point Collector badge',
    },
    {
      id: 'unlock_achievement',
      title: 'Unlock an Achievement',
      description: 'Complete any achievement',
      completed: progression.achievements.totalUnlocked >= 1,
      reward: 'Achievement Hunter title',
    },
    {
      id: 'win_streak_3',
      title: 'Get a 3-Win Streak',
      description: 'Win 3 games in a row',
      completed: progression.statistics.bestStreak >= 3,
      reward: 'Hot Streak achievement',
    },
  ];
}
