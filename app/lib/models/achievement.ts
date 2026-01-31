/**
 * Achievement Model
 * 
 * Purpose: Defines unlockable achievements with criteria and rewards
 * Why: Gamification element for player engagement and progression
 * 
 * Features:
 * - Achievement definitions with unlock criteria
 * - Tiered difficulty (bronze, silver, gold, platinum)
 * - Points and XP rewards
 * - Icon and visual customization
 * - Category organization
 * - Hidden achievements (secrets)
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: Achievement document structure
 * Why: Type-safe access to achievement properties
 */
export interface IAchievement extends Document {
  name: string;
  description: string;
  category: 'gameplay' | 'progression' | 'social' | 'collection' | 'mastery' | 'streak' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string; // Emoji or icon identifier
  isHidden: boolean; // Secret achievements
  criteria: {
    type: 'games_played' | 'wins' | 'streak' | 'points_earned' | 'level_reached' | 'perfect_score' | 'speed' | 'accuracy' | 'custom'
      | 'first_lesson' | 'lessons_completed' | 'course_completed' | 'course_master'; // Course-specific
    gameId?: mongoose.Types.ObjectId; // Optional: achievement specific to one game
    courseId?: string; // Optional: achievement specific to one course (courseId string)
    target: number; // Target value to unlock (e.g. 1 for first_lesson, 7 for week one, 30 for course)
    condition?: string; // Additional condition description
  };
  rewards: {
    points: number;
    xp: number;
    title?: string; // Optional title unlock
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    unlockCount: number; // How many players have unlocked this
    isActive: boolean; // Can be toggled off for seasonal achievements
  };
}

/**
 * Schema: Achievement
 * Why: Enforces structure and validation for achievement definitions
 */
const AchievementSchema = new Schema<IAchievement>(
  {
    name: {
      type: String,
      required: [true, 'Achievement name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      unique: true,
      // Why: Unique identifier for achievement
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      // Why: Explains what player needs to do
    },
    category: {
      type: String,
      enum: {
        values: ['gameplay', 'progression', 'social', 'collection', 'mastery', 'streak', 'special'],
        message: 'Category must be valid',
      },
      required: [true, 'Category is required'],
      index: true,
      // Why: Organizes achievements in UI by type
    },
    tier: {
      type: String,
      enum: {
        values: ['bronze', 'silver', 'gold', 'platinum'],
        message: 'Tier must be bronze, silver, gold, or platinum',
      },
      required: [true, 'Tier is required'],
      index: true,
      // Why: Difficulty/rarity classification
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      trim: true,
      maxlength: [50, 'Icon identifier cannot exceed 50 characters'],
      // Why: Visual representation (emoji or icon name)
    },
    isHidden: {
      type: Boolean,
      default: false,
      // Why: Secret achievements hidden until unlocked
    },
    criteria: {
      type: {
        type: String,
        enum: {
          values: ['games_played', 'wins', 'streak', 'points_earned', 'level_reached', 'perfect_score', 'speed', 'accuracy', 'custom', 'first_lesson', 'lessons_completed', 'course_completed', 'course_master'],
          message: 'Criteria type must be valid',
        },
        required: [true, 'Criteria type is required'],
      },
      gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        // Why: Optional game-specific achievement
      },
      courseId: {
        type: String,
        uppercase: true,
        trim: true,
        // Why: Optional course-specific achievement (courseId string)
      },
      target: {
        type: Number,
        required: [true, 'Target value is required'],
        min: [1, 'Target must be at least 1'],
        // Why: Value player must reach to unlock
      },
      condition: {
        type: String,
        trim: true,
        maxlength: [200, 'Condition cannot exceed 200 characters'],
        // Why: Additional unlock requirements
      },
    },
    rewards: {
      points: {
        type: Number,
        required: [true, 'Points reward is required'],
        default: 0,
        min: [0, 'Points reward cannot be negative'],
        // Why: Points awarded on unlock
      },
      xp: {
        type: Number,
        required: [true, 'XP reward is required'],
        default: 0,
        min: [0, 'XP reward cannot be negative'],
        // Why: XP awarded on unlock
      },
      title: {
        type: String,
        trim: true,
        maxlength: [50, 'Title cannot exceed 50 characters'],
        // Why: Optional title/badge player can equip
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for achievement creation
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last modification
      },
      unlockCount: {
        type: Number,
        default: 0,
        min: [0, 'Unlock count cannot be negative'],
        // Why: Tracks achievement rarity (how many players unlocked)
      },
      isActive: {
        type: Boolean,
        default: true,
        // Why: Can disable seasonal/event achievements
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
AchievementSchema.index({ category: 1, tier: 1 });
// Why: Category/tier browsing in UI

AchievementSchema.index({ 'criteria.type': 1, 'criteria.gameId': 1 });
// Why: Finding achievements by criteria type and game

AchievementSchema.index({ 'metadata.isActive': 1 });
// Why: Filtering active achievements

AchievementSchema.index({ 'metadata.unlockCount': -1 });
// Why: Sorting by rarity

/**
 * Pre-save Hook: Update metadata timestamp
 * Why: Ensures updatedAt is current on every save
 */
AchievementSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const Achievement: Model<IAchievement> =
  mongoose.models.Achievement ||
  mongoose.model<IAchievement>('Achievement', AchievementSchema);

export default Achievement;
