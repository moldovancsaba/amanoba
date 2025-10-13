/**
 * Models Index
 * 
 * What: Central export point for all 17 Mongoose models
 * Why: Simplifies imports throughout the application
 * 
 * Usage:
 * import { Player, Game, Brand } from '@/app/lib/models';
 */

// Core Configuration Models (3)
export { default as Brand, type IBrand } from './brand';
export { default as Game, type IGame, GameType } from './game';
export { default as GameBrandConfig, type IGameBrandConfig } from './game-brand-config';

// Player Models (3)
export { default as Player, type IPlayer } from './player';
export { default as PlayerSession, type IPlayerSession } from './player-session';
export { default as PlayerProgression, type IPlayerProgression } from './player-progression';

// Points Economy Models (2)
export { default as PointsWallet, type IPointsWallet } from './points-wallet';
export { default as PointsTransaction, type IPointsTransaction } from './points-transaction';

// Gamification Models (4)
export { default as Achievement, type IAchievement } from './achievement';
export { default as AchievementUnlock, type IAchievementUnlock } from './achievement-unlock';
export { default as Streak, type IStreak } from './streak';
export { default as LeaderboardEntry, type ILeaderboardEntry } from './leaderboard-entry';

// Rewards Models (2)
export { default as Reward, type IReward } from './reward';
export { default as RewardRedemption, type IRewardRedemption } from './reward-redemption';

// Analytics and System Models (3)
export { default as EventLog, type IEventLog } from './event-log';
export { default as AnalyticsSnapshot, type IAnalyticsSnapshot } from './analytics-snapshot';
export { default as SystemVersion, type ISystemVersion } from './system-version';

// Referral System Model (1)
export { default as ReferralTracking, type IReferralTracking } from './referral-tracking';

// Anonymous Auth Models (2)
export { AnonymousNameWord, type IAnonymousNameWord } from './anonymous-name-word';
export { GuestUsername, type IGuestUsername } from './guest-username';

// Daily Challenges Models (2)
export { 
  DailyChallenge, 
  PlayerChallengeProgress,
  type IDailyChallenge,
  type IPlayerChallengeProgress,
  type ChallengeType,
  type ChallengeDifficulty
} from './daily-challenge';

// Quest System Models (2)
export {
  Quest,
  PlayerQuestProgress,
  type IQuest,
  type IPlayerQuestProgress,
  type IQuestStep,
  type QuestCategory,
  type QuestStepType,
  type StepDependency
} from './quest';

// Total: 21 models
