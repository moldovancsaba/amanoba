/**
 * LeaderboardEntry Model
 * 
 * Purpose: Stores pre-calculated leaderboard rankings for games
 * Why: Optimizes leaderboard queries by caching rankings instead of real-time calculation
 * 
 * Features:
 * - Per-game and global leaderboards
 * - Time period variants (daily, weekly, monthly, all-time)
 * - Rank tracking with change indicators
 * - Score/metric-based sorting
 * - Automated recalculation timestamps
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: LeaderboardEntry document structure
 * Why: Type-safe access to leaderboard properties
 */
export interface ILeaderboardEntry extends Document {
  playerId: mongoose.Types.ObjectId;
  gameId?: mongoose.Types.ObjectId; // Null for global/course leaderboards
  courseId?: string; // Course ID string for course-specific leaderboards
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  metric:
    | 'score'
    | 'wins'
    | 'points'
    | 'xp'
    | 'streak'
    | 'accuracy'
    | 'points_balance'
    | 'points_lifetime'
    | 'xp_total'
    | 'level'
    | 'win_streak'
    | 'daily_streak'
    | 'games_won'
    | 'win_rate'
    | 'elo'
    | 'course_points'
    | 'course_completion_speed';
  rank: number;
  previousRank?: number;
  value: number; // The metric value (e.g., total score, win count)
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastCalculated: Date;
    periodStart: Date;
    periodEnd: Date;
  };
}

/**
 * Schema: LeaderboardEntry
 * Why: Enforces structure and validation for leaderboard caching
 */
const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
      // Why: Query player's leaderboard positions
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      index: true,
      // Why: Null for global/course leaderboards, specific game for game leaderboards
    },
    courseId: {
      type: String,
      uppercase: true,
      trim: true,
      index: true,
      // Why: Course ID for course-specific leaderboards (points, completion speed)
    },
    period: {
      type: String,
      enum: {
        values: ['daily', 'weekly', 'monthly', 'all_time'],
        message: 'Period must be daily, weekly, monthly, or all_time',
      },
      required: [true, 'Period is required'],
      index: true,
      // Why: Different time-based leaderboard variants
    },
    metric: {
      type: String,
      enum: {
        values: [
          'score', 'wins', 'points', 'xp', 'streak', 'accuracy', // Legacy values
          'points_balance', 'points_lifetime', 'xp_total', 'level', // Current wallet/progression metrics
          'win_streak', 'daily_streak', 'games_won', 'win_rate', 'elo', // Competitive metrics
          'course_points', 'course_completion_speed' // Course-specific (points earned in course; days to complete)
        ],
        message: 'Metric must be valid',
      },
      required: [true, 'Metric is required'],
      index: true,
      // Why: What statistic the leaderboard is sorted by (expanded to match leaderboard-calculator.ts types)
    },
    rank: {
      type: Number,
      required: [true, 'Rank is required'],
      min: [1, 'Rank must be at least 1'],
      index: true,
      // Why: Player's position in this leaderboard
    },
    previousRank: {
      type: Number,
      min: [1, 'Previous rank must be at least 1'],
      // Why: Tracks rank change for UI indicators (up/down arrows)
    },
    value: {
      type: Number,
      required: [true, 'Value is required'],
      min: [0, 'Value cannot be negative'],
      // Why: The actual metric value (e.g., 1500 points, 42 wins)
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for entry creation
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last update
      },
      lastCalculated: {
        type: Date,
        required: [true, 'Last calculated timestamp is required'],
        default: () => new Date(),
        // Why: When this ranking was last computed
      },
      periodStart: {
        type: Date,
        required: [true, 'Period start is required'],
        // Why: Start of time period for this leaderboard
      },
      periodEnd: {
        type: Date,
        required: [true, 'Period end is required'],
        // Why: End of time period for this leaderboard
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
 * Why: Optimizes common leaderboard query patterns
 */
LeaderboardEntrySchema.index(
  { gameId: 1, period: 1, metric: 1, playerId: 1 },
  { unique: true }
);
LeaderboardEntrySchema.index(
  { courseId: 1, period: 1, metric: 1, playerId: 1 },
  { unique: true }
);
// Why: One entry per player per leaderboard variant (game or course)

LeaderboardEntrySchema.index({ gameId: 1, period: 1, metric: 1, rank: 1 });
LeaderboardEntrySchema.index({ courseId: 1, period: 1, metric: 1, rank: 1 });
// Why: Fetch top N rankings efficiently

LeaderboardEntrySchema.index({ playerId: 1, period: 1, metric: 1 });
// Why: Player's rankings across different leaderboards

LeaderboardEntrySchema.index({ period: 1, 'metadata.periodEnd': 1 });
// Why: Find expired leaderboards for recalculation

LeaderboardEntrySchema.index({ 'metadata.lastCalculated': 1 });
// Why: Find stale leaderboards needing refresh

/**
 * Pre-save Hook: Update metadata timestamp
 * Why: Ensures updatedAt is current on every save
 */
LeaderboardEntrySchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

/**
 * Virtual: rankChange
 * Why: Computed property for rank change indicator
 */
LeaderboardEntrySchema.virtual('rankChange').get(function () {
  if (!this.previousRank) return 0;
  return this.previousRank - this.rank; // Positive = moved up, negative = moved down
});

/**
 * Virtual: isActive
 * Why: Computed property to check if leaderboard period is current
 */
LeaderboardEntrySchema.virtual('isActive').get(function () {
  const now = new Date();
  return now >= this.metadata.periodStart && now <= this.metadata.periodEnd;
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const LeaderboardEntry: Model<ILeaderboardEntry> =
  mongoose.models.LeaderboardEntry ||
  mongoose.model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);

export default LeaderboardEntry;
