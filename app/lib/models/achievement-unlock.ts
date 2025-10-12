/**
 * AchievementUnlock Model
 * 
 * Purpose: Records when players unlock specific achievements
 * Why: Tracks individual player achievement progress and unlock timestamps
 * 
 * Features:
 * - Links Player to Achievement
 * - Unlock timestamp and context
 * - Progress tracking for partially completed achievements
 * - Source session tracking
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: AchievementUnlock document structure
 * Why: Type-safe access to unlock properties
 */
export interface IAchievementUnlock extends Document {
  playerId: mongoose.Types.ObjectId;
  achievementId: mongoose.Types.ObjectId;
  unlockedAt: Date;
  progress: number; // Percentage toward unlock (0-100)
  currentValue: number; // Current value toward target
  sourceSessionId?: mongoose.Types.ObjectId; // Session that triggered unlock
  metadata: {
    createdAt: Date;
    notified: boolean; // Whether player was notified of unlock
  };
}

/**
 * Schema: AchievementUnlock
 * Why: Enforces structure and validation for unlock records
 */
const AchievementUnlockSchema = new Schema<IAchievementUnlock>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      // Why: Query player's achievements (index defined at schema level)
    },
    achievementId: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
      required: [true, 'Achievement ID is required'],
      // Why: Query all unlocks for an achievement (index defined at schema level)
    },
    unlockedAt: {
      type: Date,
      required: [true, 'Unlock timestamp is required'],
      default: () => new Date(),
      // Why: ISO 8601 timestamp for when achievement was earned
    },
    progress: {
      type: Number,
      required: [true, 'Progress is required'],
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100%'],
      // Why: Tracks partial progress toward achievement
    },
    currentValue: {
      type: Number,
      required: [true, 'Current value is required'],
      default: 0,
      min: [0, 'Current value cannot be negative'],
      // Why: Actual value toward target (e.g., 7 out of 10 wins)
    },
    sourceSessionId: {
      type: Schema.Types.ObjectId,
      ref: 'PlayerSession',
      // Why: Optional link to session that triggered unlock
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for record creation
      },
      notified: {
        type: Boolean,
        default: false,
        // Why: Tracks if player has been notified of unlock
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
AchievementUnlockSchema.index({ playerId: 1, achievementId: 1 }, { unique: true });
// Why: One unlock record per player per achievement

AchievementUnlockSchema.index({ playerId: 1, unlockedAt: -1 });
// Why: Player's recent unlocks

AchievementUnlockSchema.index({ playerId: 1, progress: 1 });
// Why: In-progress achievements for a player

AchievementUnlockSchema.index({ achievementId: 1, unlockedAt: -1 });
// Why: Recent unlocks for specific achievement

AchievementUnlockSchema.index({ progress: 1 }, { partialFilterExpression: { progress: { $lt: 100 } } });
// Why: Find in-progress achievements across all players

/**
 * Virtual: isUnlocked
 * Why: Computed property to check if achievement is fully unlocked
 */
AchievementUnlockSchema.virtual('isUnlocked').get(function () {
  return this.progress >= 100;
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const AchievementUnlock: Model<IAchievementUnlock> =
  mongoose.models.AchievementUnlock ||
  mongoose.model<IAchievementUnlock>('AchievementUnlock', AchievementUnlockSchema);

export default AchievementUnlock;
