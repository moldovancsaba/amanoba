/**
 * PlayerProgression Model
 * 
 * Purpose: Tracks player advancement through XP, levels, titles, and achievements
 * Why: Central gamification system for player engagement and retention
 * 
 * Features:
 * - XP accumulation and level progression
 * - Title/badge system with unlock conditions
 * - Achievement tracking (total unlocked count)
 * - Win/loss statistics per game
 * - Streak tracking (wins, daily logins)
 * - Total play time and session counts
 * - Personal records and milestones
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: PlayerProgression document structure
 * Why: Type-safe access to progression properties
 */
export interface IPlayerProgression extends Document {
  playerId: mongoose.Types.ObjectId;
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  title?: string; // Current equipped title (e.g., "Master", "Champion")
  unlockedTitles: string[]; // All titles player has earned
  statistics: {
    totalGamesPlayed: number;
    totalWins: number;
    totalLosses: number;
    totalDraws: number;
    totalPlayTime: number; // milliseconds
    averageSessionTime: number; // milliseconds
    bestStreak: number; // Longest win streak ever
    currentStreak: number; // Current active win streak
    dailyLoginStreak: number; // Consecutive days logged in
    lastLoginDate: Date;
  };
  gameSpecificStats: Map<
    string,
    {
      // Key: gameId as string
      gamesPlayed: number;
      wins: number;
      losses: number;
      draws: number;
      bestScore: number;
      averageScore: number;
      totalPoints: number;
      fastestWin?: number; // milliseconds
      highestAccuracy?: number; // percentage
      elo?: number; // ELO rating for competitive games (e.g., Madoku)
    }
  >;
  achievements: {
    totalUnlocked: number;
    totalAvailable: number; // For progress tracking
    recentUnlocks: Array<{
      achievementId: mongoose.Types.ObjectId;
      unlockedAt: Date;
    }>;
  };
  milestones: Array<{
    type: 'level' | 'achievement' | 'streak' | 'points' | 'games' | 'title';
    description: string;
    achievedAt: Date;
    value: number; // Context-dependent (e.g., level 10, 100 games)
  }>;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastXPGain: Date;
    lastLevelUp?: Date;
  };
}

/**
 * Schema: PlayerProgression
 * Why: Enforces structure and validation for progression tracking
 */
const PlayerProgressionSchema = new Schema<IPlayerProgression>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      // Why: One progression record per player (unique index defined at schema level)
    },
    level: {
      type: Number,
      required: [true, 'Level is required'],
      default: 1,
      min: [1, 'Level must be at least 1'],
      max: [100, 'Level cannot exceed 100'],
      // Why: Standard RPG-style level system
    },
    currentXP: {
      type: Number,
      required: [true, 'Current XP is required'],
      default: 0,
      min: [0, 'Current XP cannot be negative'],
      // Why: XP within current level toward next level
    },
    totalXP: {
      type: Number,
      required: [true, 'Total XP is required'],
      default: 0,
      min: [0, 'Total XP cannot be negative'],
      // Why: Lifetime XP accumulation for all-time rankings
    },
    xpToNextLevel: {
      type: Number,
      required: [true, 'XP to next level is required'],
      default: 100,
      min: [1, 'XP to next level must be positive'],
      // Why: Dynamic based on level formula (e.g., level * 100)
    },
    title: {
      type: String,
      trim: true,
      maxlength: [50, 'Title cannot exceed 50 characters'],
      // Why: Currently equipped title/badge
    },
    unlockedTitles: [
      {
        type: String,
        trim: true,
        // Why: Array of all titles player has earned (can switch between them)
      },
    ],
    statistics: {
      totalGamesPlayed: {
        type: Number,
        default: 0,
        min: [0, 'Total games cannot be negative'],
      },
      totalWins: {
        type: Number,
        default: 0,
        min: [0, 'Total wins cannot be negative'],
      },
      totalLosses: {
        type: Number,
        default: 0,
        min: [0, 'Total losses cannot be negative'],
      },
      totalDraws: {
        type: Number,
        default: 0,
        min: [0, 'Total draws cannot be negative'],
      },
      totalPlayTime: {
        type: Number,
        default: 0,
        min: [0, 'Total play time cannot be negative'],
        // Why: Milliseconds for precise tracking
      },
      averageSessionTime: {
        type: Number,
        default: 0,
        min: [0, 'Average session time cannot be negative'],
        // Why: Calculated metric for engagement analysis
      },
      bestStreak: {
        type: Number,
        default: 0,
        min: [0, 'Best streak cannot be negative'],
        // Why: Highest consecutive win streak ever achieved
      },
      currentStreak: {
        type: Number,
        default: 0,
        min: [0, 'Current streak cannot be negative'],
        // Why: Active consecutive win streak (resets on loss)
      },
      dailyLoginStreak: {
        type: Number,
        default: 0,
        min: [0, 'Daily login streak cannot be negative'],
        // Why: Consecutive days player has logged in
      },
      lastLoginDate: {
        type: Date,
        required: [true, 'Last login date is required'],
        default: () => new Date(),
        // Why: Used to calculate daily login streaks
      },
    },
    gameSpecificStats: {
      type: Map,
      of: {
        gamesPlayed: { type: Number, default: 0, min: 0 },
        wins: { type: Number, default: 0, min: 0 },
        losses: { type: Number, default: 0, min: 0 },
        draws: { type: Number, default: 0, min: 0 },
        bestScore: { type: Number, default: 0, min: 0 },
        averageScore: { type: Number, default: 0, min: 0 },
        totalPoints: { type: Number, default: 0, min: 0 },
        fastestWin: { type: Number, min: 0 },
        highestAccuracy: { type: Number, min: 0, max: 100 },
        elo: { type: Number, default: 1200, min: 0 }, // ELO rating starting at 1200
      },
      default: () => new Map(),
      // Why: Per-game statistics for detailed analytics and competitive ranking
    },
    achievements: {
      totalUnlocked: {
        type: Number,
        default: 0,
        min: [0, 'Total unlocked cannot be negative'],
        // Why: Quick count without querying AchievementUnlock collection
      },
      totalAvailable: {
        type: Number,
        default: 0,
        min: [0, 'Total available cannot be negative'],
        // Why: Denominator for achievement completion percentage
      },
      recentUnlocks: [
        {
          achievementId: {
            type: Schema.Types.ObjectId,
            ref: 'Achievement',
            required: true,
          },
          unlockedAt: {
            type: Date,
            required: true,
            default: () => new Date(),
          },
        },
      ],
      // Why: Last 5 achievements for notifications/display
    },
    milestones: [
      {
        type: {
          type: String,
          enum: ['level', 'achievement', 'streak', 'points', 'games', 'title'],
          required: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
          maxlength: [200, 'Milestone description cannot exceed 200 characters'],
        },
        achievedAt: {
          type: Date,
          required: true,
          default: () => new Date(),
        },
        value: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for player progression initialization
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last progression update
      },
      lastXPGain: {
        type: Date,
        required: [true, 'Last XP gain date is required'],
        default: () => new Date(),
        // Why: Tracks player engagement recency
      },
      lastLevelUp: {
        type: Date,
        // Why: Tracks most recent level advancement
      },
    },
  },
  {
    timestamps: false, // Using custom metadata timestamps
    strict: true,
  }
);

/**
 * Indexes
 * Why: Optimizes common query patterns
 */
PlayerProgressionSchema.index({ playerId: 1 }, { unique: true });
// Why: One progression record per player

PlayerProgressionSchema.index({ level: -1, totalXP: -1 });
// Why: Global leaderboards by level and XP

PlayerProgressionSchema.index({ 'statistics.totalGamesPlayed': -1 });
// Why: Most active players queries

PlayerProgressionSchema.index({ 'statistics.bestStreak': -1 });
// Why: Best streak leaderboards

PlayerProgressionSchema.index({ 'achievements.totalUnlocked': -1 });
// Why: Achievement hunter leaderboards

/**
 * Pre-save Hook: Update metadata timestamp
 * Why: Ensures updatedAt is current on every save
 */
PlayerProgressionSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

/**
 * Virtual: winRate
 * Why: Computed property for overall win percentage
 */
PlayerProgressionSchema.virtual('winRate').get(function () {
  const totalGames = this.statistics.totalGamesPlayed;
  if (totalGames === 0) return 0;
  return (this.statistics.totalWins / totalGames) * 100;
});

/**
 * Virtual: levelProgress
 * Why: Computed property for level progress percentage
 */
PlayerProgressionSchema.virtual('levelProgress').get(function () {
  if (this.xpToNextLevel === 0) return 100;
  return (this.currentXP / this.xpToNextLevel) * 100;
});

/**
 * Virtual: achievementCompletionRate
 * Why: Computed property for achievement completion percentage
 */
PlayerProgressionSchema.virtual('achievementCompletionRate').get(function () {
  if (this.achievements.totalAvailable === 0) return 0;
  return (this.achievements.totalUnlocked / this.achievements.totalAvailable) * 100;
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const PlayerProgression: Model<IPlayerProgression> =
  mongoose.models.PlayerProgression ||
  mongoose.model<IPlayerProgression>('PlayerProgression', PlayerProgressionSchema);

export default PlayerProgression;
