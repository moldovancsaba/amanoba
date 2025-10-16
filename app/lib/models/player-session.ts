/**
 * PlayerSession Model
 * 
 * Purpose: Tracks individual game play sessions with results and analytics
 * Why: Central record for all game plays, enables detailed analytics and history
 * 
 * Features:
 * - Links Player, Brand, and Game
 * - Stores session results (score, time, outcome)
 * - Tracks points/XP earned
 * - Records achievements unlocked during session
 * - Captures device and context information
 * - Supports replay/review functionality
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: PlayerSession document structure
 * Why: Type-safe access to session properties
 */
export interface IPlayerSession extends Document {
  playerId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId;
  sessionStart: Date;
  sessionEnd?: Date;
  duration?: number; // milliseconds
  status: 'in_progress' | 'completed' | 'abandoned' | 'failed';
  gameData: {
    score: number;
    maxScore: number;
    accuracy?: number; // percentage
    moves?: number;
    hints?: number;
    difficulty?: string;
    level?: number;
    outcome: 'win' | 'loss' | 'draw' | 'incomplete';
    rawData?: Record<string, unknown>; // Game-specific data (e.g., Madoku grid state)
  };
  rewards: {
    pointsEarned: number;
    xpEarned: number;
    bonusMultiplier: number;
    achievementsUnlocked: mongoose.Types.ObjectId[]; // References to Achievement
    streakBonus: number;
  };
  context: {
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    browserInfo?: string;
    ipAddress?: string; // Hashed for privacy
    country?: string;
    isPremium: boolean; // Player premium status at time of play
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string; // Game version played
  };
}

/**
 * Schema: PlayerSession
 * Why: Enforces structure and validation for game sessions
 */
const PlayerSessionSchema = new Schema<IPlayerSession>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      index: true,
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'Game ID is required'],
      index: true,
    },
    sessionStart: {
      type: Date,
      required: [true, 'Session start time is required'],
      default: () => new Date(),
      // Why: ISO 8601 timestamp for precise session tracking
    },
    sessionEnd: {
      type: Date,
      // Why: Set when session completes, null for in-progress sessions
    },
    duration: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
      // Why: Milliseconds for precise analytics
    },
    status: {
      type: String,
      enum: {
        values: ['in_progress', 'completed', 'abandoned', 'failed'],
        message: 'Status must be in_progress, completed, abandoned, or failed',
      },
      default: 'in_progress',
      index: true,
      // Why: Allows filtering by session completion status
    },
    gameData: {
      score: {
        type: Number,
        required: [true, 'Score is required'],
        default: 0,
        min: [0, 'Score cannot be negative'],
        // Why: Primary metric for all games
      },
      maxScore: {
        type: Number,
        required: [true, 'Max score is required'],
        min: [0, 'Max score cannot be negative'],
        // Why: Context for score percentage calculations
      },
      accuracy: {
        type: Number,
        min: [0, 'Accuracy cannot be negative'],
        max: [100, 'Accuracy cannot exceed 100%'],
        // Why: Percentage-based performance metric
      },
      moves: {
        type: Number,
        min: [0, 'Moves cannot be negative'],
        // Why: Relevant for puzzle games like Madoku
      },
      hints: {
        type: Number,
        min: [0, 'Hints cannot be negative'],
        default: 0,
        // Why: Tracks assistance usage (affects scoring)
      },
      difficulty: {
        type: String,
        // Why: Records difficulty level played (from GameBrandConfig)
      },
      level: {
        type: Number,
        min: [1, 'Level must be at least 1'],
        // Why: Game level/stage identifier
      },
      outcome: {
        type: String,
        enum: {
          values: ['win', 'loss', 'draw', 'incomplete'],
          message: 'Outcome must be win, loss, draw, or incomplete',
        },
        required: [true, 'Outcome is required'],
        default: 'incomplete',
        // Why: Standardized outcome for all games
      },
      rawData: {
        type: Schema.Types.Mixed,
        // Why: Flexible storage for game-specific state (e.g., final Madoku grid)
      },
    },
    rewards: {
      pointsEarned: {
        type: Number,
        default: 0,
        min: [0, 'Points earned cannot be negative'],
        // Why: Links to PointsWallet transactions
      },
      xpEarned: {
        type: Number,
        default: 0,
        min: [0, 'XP earned cannot be negative'],
        // Why: Links to PlayerProgression updates
      },
      bonusMultiplier: {
        type: Number,
        default: 1,
        min: [1, 'Bonus multiplier must be at least 1'],
        // Why: Records any active multipliers during session
      },
      achievementsUnlocked: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Achievement',
          // Why: Array of achievements earned during this session
        },
      ],
      streakBonus: {
        type: Number,
        default: 0,
        min: [0, 'Streak bonus cannot be negative'],
        // Why: Additional points from active streaks
      },
    },
    context: {
      deviceType: {
        type: String,
        enum: {
          values: ['mobile', 'tablet', 'desktop'],
          message: 'Device type must be mobile, tablet, or desktop',
        },
        // Why: Analytics for device-specific performance
      },
      browserInfo: {
        type: String,
        trim: true,
        // Why: User agent string for debugging/analytics
      },
      ipAddress: {
        type: String,
        // Why: Hashed IP for fraud detection, not stored in plain text
      },
      country: {
        type: String,
        trim: true,
        uppercase: true,
        maxlength: [2, 'Country code must be 2 characters'],
        // Why: ISO country code for geographic analytics
      },
      isPremium: {
        type: Boolean,
        required: [true, 'Premium status is required'],
        // Why: Snapshot of premium status at time of play
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for session creation
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last modification
      },
      version: {
        type: String,
        required: [true, 'Game version is required'],
        // Why: Critical for debugging version-specific issues
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
PlayerSessionSchema.index({ playerId: 1, sessionStart: -1 });
// Why: Player history queries (recent sessions first)

PlayerSessionSchema.index({ gameId: 1, sessionStart: -1 });
// Why: Game-specific analytics (recent plays)

PlayerSessionSchema.index({ brandId: 1, sessionStart: -1 });
// Why: Brand-specific analytics

PlayerSessionSchema.index({ playerId: 1, gameId: 1, status: 1 });
// Why: Player-game-specific queries with status filtering

PlayerSessionSchema.index({ sessionStart: -1 });
// Why: Global recent sessions queries

PlayerSessionSchema.index({ 'gameData.outcome': 1, sessionStart: -1 });
// Why: Win/loss analytics over time

/**
 * Pre-save Hook: Calculate duration on completion
 * Why: Ensures duration is set when session ends
 */
PlayerSessionSchema.pre('save', function (next) {
  if (this.isModified('sessionEnd') && this.sessionEnd) {
    this.duration = this.sessionEnd.getTime() - this.sessionStart.getTime();
  }
  
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  
  next();
});

/**
 * Virtual: scorePercentage
 * Why: Computed property for normalized score comparison
 */
PlayerSessionSchema.virtual('scorePercentage').get(function () {
  if (this.gameData.maxScore === 0) return 0;
  return (this.gameData.score / this.gameData.maxScore) * 100;
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const PlayerSession: Model<IPlayerSession> =
  mongoose.models.PlayerSession ||
  mongoose.model<IPlayerSession>('PlayerSession', PlayerSessionSchema);

export default PlayerSession;
