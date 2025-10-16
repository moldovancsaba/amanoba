/**
 * Event Logger Service
 * 
 * What: Centralized event logging for analytics and audit trails
 * Why: Provides comprehensive tracking of player actions and system events
 * 
 * Features:
 * - Type-safe event logging
 * - Automatic context capture (session, IP, user agent)
 * - Flexible event data storage
 * - Event-sourcing ready
 * - Privacy-aware (IP hashing)
 */

import { EventLog } from '@/lib/models';
import logger from '@/lib/logger';
import crypto from 'crypto';

/**
 * Event Types
 * 
 * Why: Strongly typed events for better tracking and queries
 */
export type EventType =
  | 'player_registered'
  | 'game_played'
  | 'achievement_unlocked'
  | 'points_earned'
  | 'points_spent'
  | 'level_up'
  | 'streak_started'
  | 'streak_broken'
  | 'reward_redeemed'
  | 'premium_purchased'
  | 'login'
  | 'logout'
  | 'challenge_completed'
  | 'quest_started'
  | 'quest_completed'
  | 'system';

/**
 * Event Context
 * 
 * Why: Captures environment and session information
 */
export interface EventContext {
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  platform?: 'web' | 'mobile' | 'tablet';
  referrer?: string;
}

/**
 * Event Logging Options
 * 
 * Why: Configures how events are logged
 */
export interface LogEventOptions {
  playerId?: string;
  brandId?: string;
  eventType: EventType;
  eventData: Record<string, unknown>;
  context?: EventContext;
  appVersion?: string;
}

/**
 * Log Event
 * 
 * What: Records an event to the database
 * Why: Creates permanent, queryable record of player actions
 * 
 * @param options - Event logging configuration
 * @returns Created event log document ID
 */
export async function logEvent(options: LogEventOptions): Promise<string> {
  const {
    playerId,
    brandId,
    eventType,
    eventData,
    context = {},
    appVersion = process.env.npm_package_version || '1.5.0',
  } = options;

  try {
    // Hash IP address for privacy
    // Why: Store hashed IP to prevent PII storage while allowing fraud detection
    const hashedIP = context.ipAddress
      ? hashIP(context.ipAddress)
      : undefined;

    // Create event log entry
    const eventLog = await EventLog.create({
      playerId: playerId || null,
      brandId: brandId || null,
      eventType,
      eventData,
      timestamp: new Date(),
      context: {
        sessionId: context.sessionId,
        ipAddress: hashedIP,
        userAgent: context.userAgent,
        platform: context.platform || detectPlatform(context.userAgent),
      },
      metadata: {
        createdAt: new Date(),
        version: appVersion,
      },
    });

    logger.debug(
      {
        eventId: eventLog._id,
        eventType,
        playerId,
        brandId,
      },
      'Event logged'
    );

    return (eventLog._id as any).toString();
  } catch (error) {
    logger.error({ error, eventType, playerId }, 'Failed to log event');
    throw error;
  }
}

/**
 * Log Player Registration
 * 
 * What: Records when a new player registers
 * Why: Track user acquisition and onboarding
 */
export async function logPlayerRegistration(
  playerId: string,
  brandId: string,
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType: 'player_registered',
    eventData: {
      registeredAt: new Date().toISOString(),
      source: context?.referrer || 'direct',
    },
    context,
  });
}

/**
 * Log Game Played
 * 
 * What: Records when a player plays a game
 * Why: Track engagement and game popularity
 */
export async function logGamePlayed(
  playerId: string,
  brandId: string,
  gameData: {
    gameId: string;
    gameName: string;
    sessionId: string;
    duration: number;
    score?: number;
    outcome: 'win' | 'loss' | 'draw' | 'abandoned';
  },
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType: 'game_played',
    eventData: gameData,
    context,
  });
}

/**
 * Log Achievement Unlocked
 * 
 * What: Records when a player unlocks an achievement
 * Why: Track achievement completion rates and player milestones
 */
export async function logAchievementUnlocked(
  playerId: string,
  brandId: string,
  achievementData: {
    achievementId: string;
    achievementName: string;
    category: string;
    pointsAwarded: number;
    xpAwarded: number;
  },
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType: 'achievement_unlocked',
    eventData: achievementData,
    context,
  });
}

/**
 * Log Points Transaction
 * 
 * What: Records points earned or spent
 * Why: Track economy flow and player spending patterns
 */
export async function logPointsTransaction(
  playerId: string,
  brandId: string,
  transactionData: {
    type: 'earned' | 'spent';
    amount: number;
    source: string;
    transactionId: string;
    balanceAfter: number;
  },
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType: transactionData.type === 'earned' ? 'points_earned' : 'points_spent',
    eventData: transactionData,
    context,
  });
}

/**
 * Log Level Up
 * 
 * What: Records when a player levels up
 * Why: Track progression and level distribution
 */
export async function logLevelUp(
  playerId: string,
  brandId: string,
  levelData: {
    previousLevel: number;
    newLevel: number;
    totalXP: number;
    rewardsAwarded?: {
      points?: number;
      title?: string;
    };
  },
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType: 'level_up',
    eventData: levelData,
    context,
  });
}

/**
 * Log Streak Event
 * 
 * What: Records streak milestones and breaks
 * Why: Track streak engagement and churn indicators
 */
export async function logStreakEvent(
  playerId: string,
  brandId: string,
  streakData: {
    type: 'win' | 'daily_login';
    event: 'started' | 'broken';
    streakLength: number;
    milestonesReached?: number[];
  },
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType: streakData.event === 'started' ? 'streak_started' : 'streak_broken',
    eventData: streakData,
    context,
  });
}

/**
 * Log Challenge Completed
 * 
 * What: Records when a player completes a daily challenge
 * Why: Track challenge engagement and completion rates
 */
export async function logChallengeCompleted(
  playerId: string,
  brandId: string,
  challengeData: {
    challengeId: string;
    challengeTitle: string;
    difficulty: 'easy' | 'medium' | 'hard';
    completionTime: number;
    rewardsAwarded: {
      points: number;
      xp: number;
    };
  },
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType: 'challenge_completed',
    eventData: challengeData,
    context,
  });
}

/**
 * Log Quest Event
 * 
 * What: Records quest starts and completions
 * Why: Track quest engagement and completion rates
 */
export async function logQuestEvent(
  playerId: string,
  brandId: string,
  questData: {
    questId: string;
    questTitle: string;
    questCategory: string;
    event: 'started' | 'completed';
    stepsCompleted?: number;
    totalSteps?: number;
    completionTime?: number;
    rewardsAwarded?: {
      points: number;
      xp: number;
    };
  },
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType: questData.event === 'started' ? 'quest_started' : 'quest_completed',
    eventData: questData,
    context,
  });
}

/**
 * Log Reward Redemption
 * 
 * What: Records when a player redeems a reward
 * Why: Track reward popularity and redemption patterns
 */
export async function logRewardRedemption(
  playerId: string,
  brandId: string,
  rewardData: {
    rewardId: string;
    rewardName: string;
    pointsCost: number;
    category: string;
  },
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType: 'reward_redeemed',
    eventData: rewardData,
    context,
  });
}

/**
 * Log Login/Logout
 * 
 * What: Records authentication events
 * Why: Track active user sessions and login patterns
 */
export async function logAuthEvent(
  playerId: string,
  brandId: string,
  eventType: 'login' | 'logout',
  context?: EventContext
): Promise<string> {
  return logEvent({
    playerId,
    brandId,
    eventType,
    eventData: {
      timestamp: new Date().toISOString(),
      method: 'facebook_oauth',
    },
    context,
  });
}

/**
 * Log System Event
 * 
 * What: Records system-level events (not player-specific)
 * Why: Track system health, cron jobs, and maintenance
 */
export async function logSystemEvent(
  eventData: Record<string, any>,
  brandId?: string
): Promise<string> {
  return logEvent({
    brandId,
    eventType: 'system',
    eventData: {
      ...eventData,
      timestamp: new Date().toISOString(),
    },
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Hash IP Address
 * 
 * What: Creates SHA-256 hash of IP address
 * Why: Protects PII while allowing fraud detection via hash matching
 */
function hashIP(ipAddress: string): string {
  return crypto
    .createHash('sha256')
    .update(ipAddress)
    .digest('hex');
}

/**
 * Detect Platform from User Agent
 * 
 * What: Parses user agent to determine platform
 * Why: Categorize events by device type
 */
function detectPlatform(userAgent?: string): 'web' | 'mobile' | 'tablet' {
  if (!userAgent) return 'web';

  const ua = userAgent.toLowerCase();

  // Check for tablet
  if (ua.includes('ipad') || (ua.includes('android') && !ua.includes('mobile'))) {
    return 'tablet';
  }

  // Check for mobile
  if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
    return 'mobile';
  }

  return 'web';
}

/**
 * Get Event Context from Request
 * 
 * What: Extracts context information from Next.js request
 * Why: Automatically populate context for API route events
 */
export function getEventContextFromRequest(request: Request): EventContext {
  const headers = request.headers;
  
  return {
    ipAddress: headers.get('x-forwarded-for') || headers.get('x-real-ip') || undefined,
    userAgent: headers.get('user-agent') || undefined,
    referrer: headers.get('referer') || undefined,
    platform: detectPlatform(headers.get('user-agent') || undefined),
  };
}
