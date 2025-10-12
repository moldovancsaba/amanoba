/**
 * DailyChallenge Model
 * 
 * Purpose: Defines daily challenges and tracks player progress
 * Why: Drives daily engagement with fresh, time-limited challenges
 * 
 * Features:
 * - Challenge definitions with multiple types
 * - Difficulty tiers (easy, medium, hard)
 * - Time-limited availability (24 hours)
 * - Reward definitions per challenge
 * - Player progress tracking
 * - Automatic expiration
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Challenge Types
 * 
 * Why: Different challenge categories for variety
 */
export type ChallengeType =
  | 'games_played'      // Play N games
  | 'games_won'         // Win N games
  | 'points_earned'     // Earn N points
  | 'xp_earned'         // Earn N XP
  | 'specific_game'     // Play/win specific game
  | 'win_streak'        // Achieve N win streak
  | 'perfect_games'     // Complete N perfect games
  | 'play_consecutive'; // Play games N days in a row

/**
 * Difficulty Levels
 * 
 * Why: Scaled rewards based on difficulty
 */
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Interface: DailyChallenge document structure
 * 
 * Why: Type-safe access to challenge properties
 */
export interface IDailyChallenge extends Document {
  date: Date; // Challenge date (YYYY-MM-DD)
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  title: string;
  description: string;
  requirement: {
    target: number; // Target value to complete challenge
    gameId?: mongoose.Types.ObjectId; // For game-specific challenges
    metric?: string; // Custom metric (e.g., 'accuracy', 'time')
  };
  rewards: {
    points: number;
    xp: number;
    bonusMultiplier?: number; // Optional bonus multiplier
  };
  availability: {
    startTime: Date;
    endTime: Date;
    isActive: boolean;
  };
  completions: {
    total: number; // Total players who completed
    percentage: number; // Completion rate
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Interface: Player Challenge Progress
 * 
 * Why: Tracks individual player progress on daily challenges
 */
export interface IPlayerChallengeProgress extends Document {
  playerId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  progress: number; // Current progress toward target
  isCompleted: boolean;
  completedAt?: Date;
  rewardsClaimed: boolean;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Schema: DailyChallenge
 * 
 * Why: Enforces structure and validation for challenge definitions
 */
const DailyChallengeSchema = new Schema<IDailyChallenge>(
  {
    date: {
      type: Date,
      required: [true, 'Challenge date is required'],
      index: true,
      // Why: Query challenges by date
    },
    type: {
      type: String,
      enum: {
        values: [
          'games_played',
          'games_won',
          'points_earned',
          'xp_earned',
          'specific_game',
          'win_streak',
          'perfect_games',
          'play_consecutive',
        ],
        message: 'Challenge type must be valid',
      },
      required: [true, 'Challenge type is required'],
      // Why: Defines what player must accomplish
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be easy, medium, or hard',
      },
      required: [true, 'Difficulty is required'],
      index: true,
      // Why: Players may filter by difficulty
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      // Why: Display name for challenge
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      // Why: Explains challenge requirements
    },
    requirement: {
      target: {
        type: Number,
        required: [true, 'Target is required'],
        min: [1, 'Target must be at least 1'],
        // Why: Number needed to complete (e.g., 5 games, 100 points)
      },
      gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        // Why: For game-specific challenges
      },
      metric: {
        type: String,
        trim: true,
        // Why: Custom metric for specific challenge types
      },
    },
    rewards: {
      points: {
        type: Number,
        required: [true, 'Points reward is required'],
        min: [0, 'Points reward cannot be negative'],
        // Why: Points awarded on completion
      },
      xp: {
        type: Number,
        required: [true, 'XP reward is required'],
        min: [0, 'XP reward cannot be negative'],
        // Why: XP awarded on completion
      },
      bonusMultiplier: {
        type: Number,
        min: [1, 'Bonus multiplier must be at least 1'],
        max: [5, 'Bonus multiplier cannot exceed 5'],
        // Why: Optional multiplier for hard challenges
      },
    },
    availability: {
      startTime: {
        type: Date,
        required: [true, 'Start time is required'],
        // Why: When challenge becomes available (usually 00:00 UTC)
      },
      endTime: {
        type: Date,
        required: [true, 'End time is required'],
        // Why: When challenge expires (usually 23:59 UTC same day)
      },
      isActive: {
        type: Boolean,
        default: true,
        index: true,
        // Why: Can disable challenges without deletion
      },
    },
    completions: {
      total: {
        type: Number,
        default: 0,
        min: [0, 'Completions cannot be negative'],
        // Why: Track how many players completed
      },
      percentage: {
        type: Number,
        default: 0,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100'],
        // Why: Completion rate for analytics
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for challenge creation
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last update
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
 * 
 * Why: Optimizes common query patterns
 */
DailyChallengeSchema.index({ date: 1, difficulty: 1 });
// Why: Query challenges by date and difficulty

DailyChallengeSchema.index({ 'availability.isActive': 1, 'availability.endTime': 1 });
// Why: Find active challenges and check expiration

DailyChallengeSchema.index({ date: -1 });
// Why: Recent challenges first

/**
 * Pre-save Hook: Update metadata timestamp
 * 
 * Why: Ensures updatedAt is current on every save
 */
DailyChallengeSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

/**
 * Virtual: isExpired
 * 
 * Why: Computed property to check if challenge has expired
 */
DailyChallengeSchema.virtual('isExpired').get(function () {
  return new Date() > this.availability.endTime;
});

/**
 * Virtual: timeRemaining
 * 
 * Why: Computed property for milliseconds until expiration
 */
DailyChallengeSchema.virtual('timeRemaining').get(function () {
  const now = new Date();
  if (now > this.availability.endTime) return 0;
  return this.availability.endTime.getTime() - now.getTime();
});

/**
 * Schema: PlayerChallengeProgress
 * 
 * Why: Enforces structure for player challenge tracking
 */
const PlayerChallengeProgressSchema = new Schema<IPlayerChallengeProgress>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      // Why: Links progress to player
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: 'DailyChallenge',
      required: [true, 'Challenge ID is required'],
      // Why: Links to challenge definition
    },
    progress: {
      type: Number,
      required: [true, 'Progress is required'],
      default: 0,
      min: [0, 'Progress cannot be negative'],
      // Why: Current value toward target
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
      // Why: Tracks completion status
    },
    completedAt: {
      type: Date,
      // Why: ISO 8601 timestamp when challenge was completed
    },
    rewardsClaimed: {
      type: Boolean,
      default: false,
      // Why: Tracks if player has claimed rewards
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp when player started challenge
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last progress update
      },
    },
  },
  {
    timestamps: false, // Using custom metadata timestamps
    strict: true,
  }
);

/**
 * Indexes for PlayerChallengeProgress
 * 
 * Why: Optimizes player challenge queries
 */
PlayerChallengeProgressSchema.index(
  { playerId: 1, challengeId: 1 },
  { unique: true }
);
// Why: One progress record per player per challenge

PlayerChallengeProgressSchema.index({ playerId: 1, isCompleted: 1 });
// Why: Query player's completed challenges

PlayerChallengeProgressSchema.index({ challengeId: 1, isCompleted: 1 });
// Why: Count completions for a challenge

/**
 * Pre-save Hook: Auto-set completedAt
 * 
 * Why: Automatically timestamp when challenge is marked complete
 */
PlayerChallengeProgressSchema.pre('save', function (next) {
  if (this.isModified('isCompleted') && this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  
  next();
});

/**
 * Export Models
 * 
 * Why: Singleton pattern prevents multiple model compilations
 */
export const DailyChallenge: Model<IDailyChallenge> =
  mongoose.models.DailyChallenge ||
  mongoose.model<IDailyChallenge>('DailyChallenge', DailyChallengeSchema);

export const PlayerChallengeProgress: Model<IPlayerChallengeProgress> =
  mongoose.models.PlayerChallengeProgress ||
  mongoose.model<IPlayerChallengeProgress>(
    'PlayerChallengeProgress',
    PlayerChallengeProgressSchema
  );

export default DailyChallenge;
