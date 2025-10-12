/**
 * Streak Model
 * 
 * Purpose: Tracks win streaks and daily login streaks for players
 * Why: Encourages consistent engagement through streak-based rewards
 * 
 * Features:
 * - Win streak tracking (consecutive wins)
 * - Daily login streak tracking
 * - Best streak records
 * - Bonus multipliers for active streaks
 * - Streak expiration logic
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: Streak document structure
 * Why: Type-safe access to streak properties
 */
export interface IStreak extends Document {
  playerId: mongoose.Types.ObjectId;
  type: 'win' | 'daily_login';
  currentStreak: number;
  bestStreak: number;
  lastActivity: Date;
  streakStart: Date;
  bonusMultiplier: number; // Multiplier applied to rewards
  milestones: Array<{
    value: number; // Streak length
    achievedAt: Date;
    rewardGiven: boolean;
  }>;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date; // When streak expires if not continued
  };
}

/**
 * Schema: Streak
 * Why: Enforces structure and validation for streak tracking
 */
const StreakSchema = new Schema<IStreak>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      // Why: Query player's streaks (index defined at schema level)
    },
    type: {
      type: String,
      enum: {
        values: ['win', 'daily_login'],
        message: 'Type must be win or daily_login',
      },
      required: [true, 'Streak type is required'],
      // Why: Different types of streaks with different rules
    },
    currentStreak: {
      type: Number,
      required: [true, 'Current streak is required'],
      default: 0,
      min: [0, 'Current streak cannot be negative'],
      // Why: Active consecutive count
    },
    bestStreak: {
      type: Number,
      required: [true, 'Best streak is required'],
      default: 0,
      min: [0, 'Best streak cannot be negative'],
      // Why: All-time highest streak for this type
    },
    lastActivity: {
      type: Date,
      required: [true, 'Last activity is required'],
      default: () => new Date(),
      // Why: ISO 8601 timestamp for last streak-continuing action
    },
    streakStart: {
      type: Date,
      required: [true, 'Streak start is required'],
      default: () => new Date(),
      // Why: When current streak began
    },
    bonusMultiplier: {
      type: Number,
      default: 1,
      min: [1, 'Bonus multiplier must be at least 1'],
      max: [5, 'Bonus multiplier cannot exceed 5'],
      // Why: Reward multiplier for active streaks (scales with length)
    },
    milestones: [
      {
        value: {
          type: Number,
          required: true,
          min: 1,
          // Why: Streak length milestone (e.g., 7 days, 50 wins)
        },
        achievedAt: {
          type: Date,
          required: true,
          default: () => new Date(),
          // Why: ISO 8601 timestamp for milestone achievement
        },
        rewardGiven: {
          type: Boolean,
          default: false,
          // Why: Tracks if milestone reward was distributed
        },
      },
    ],
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for streak record creation
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last update
      },
      expiresAt: {
        type: Date,
        // Why: When streak will break if not continued (for daily login streaks)
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
StreakSchema.index({ playerId: 1, type: 1 }, { unique: true });
// Why: One streak record per player per type

StreakSchema.index({ type: 1, currentStreak: -1 });
// Why: Leaderboards by streak type

StreakSchema.index({ type: 1, bestStreak: -1 });
// Why: All-time best streaks leaderboards

StreakSchema.index({ 'metadata.expiresAt': 1 }, { sparse: true });
// Why: Find expiring streaks for automated checks

/**
 * Pre-save Hook: Update best streak and metadata
 * Why: Ensures best streak is always current and updatedAt is set
 */
StreakSchema.pre('save', function (next) {
  if (this.currentStreak > this.bestStreak) {
    this.bestStreak = this.currentStreak;
  }
  
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  
  next();
});

/**
 * Virtual: isActive
 * Why: Computed property to check if streak is currently active
 */
StreakSchema.virtual('isActive').get(function () {
  if (!this.metadata.expiresAt) return this.currentStreak > 0;
  return this.currentStreak > 0 && new Date() < this.metadata.expiresAt;
});

/**
 * Virtual: duration
 * Why: Computed property for streak duration in milliseconds
 */
StreakSchema.virtual('duration').get(function () {
  if (this.currentStreak === 0) return 0;
  return new Date().getTime() - this.streakStart.getTime();
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const Streak: Model<IStreak> =
  mongoose.models.Streak ||
  mongoose.model<IStreak>('Streak', StreakSchema);

export default Streak;
