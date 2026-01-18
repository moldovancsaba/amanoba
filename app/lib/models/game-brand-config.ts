/**
 * GameBrandConfig Model
 * 
 * Purpose: Defines per-brand customization for games (colors, rules, availability)
 * Why: Enables white-labeling where different brands can have unique game configurations
 * 
 * Features:
 * - Links Brand to Game with custom settings
 * - Per-brand availability toggles
 * - Custom branding (colors, logos)
 * - Game-specific rule overrides (time limits, scoring)
 * - Premium gating configuration
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: GameBrandConfig document structure
 * Why: Type-safe access to game brand configuration properties
 */
export interface IGameBrandConfig extends Document {
  brandId: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId;
  isEnabled: boolean;
  isPremiumOnly: boolean;
  customBranding: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    backgroundUrl?: string;
  };
  gameRules: {
    timeLimit?: number; // seconds
    maxAttempts?: number;
    pointsMultiplier?: number;
    difficultyLevel?: 'easy' | 'medium' | 'hard' | 'expert';
    customSettings?: Record<string, unknown>; // Game-specific settings
  };
  displayOrder: number; // For sorting games in UI
  featuredUntil?: Date; // Optional featured promotion period
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    lastModifiedBy?: string;
  };
}

/**
 * Schema: GameBrandConfig
 * Why: Enforces data structure and validation for brand-specific game configs
 */
const GameBrandConfigSchema = new Schema<IGameBrandConfig>(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      // Why: Index created explicitly at schema level
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'Game ID is required'],
      index: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
      // Why: Allows temporarily disabling games per brand without deletion
    },
    isPremiumOnly: {
      type: Boolean,
      default: false,
      // Why: Enables premium gating at brand level
    },
    customBranding: {
      primaryColor: {
        type: String,
        match: [/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color'],
        // Why: Ensures valid hex color format for UI consistency
      },
      secondaryColor: {
        type: String,
        match: [/^#[0-9A-Fa-f]{6}$/, 'Secondary color must be a valid hex color'],
      },
      logoUrl: {
        type: String,
        trim: true,
        // Why: Optional brand-specific game logo
      },
      backgroundUrl: {
        type: String,
        trim: true,
        // Why: Optional brand-specific game background
      },
    },
    gameRules: {
      timeLimit: {
        type: Number,
        min: [10, 'Time limit must be at least 10 seconds'],
        max: [3600, 'Time limit cannot exceed 1 hour'],
        // Why: Reasonable bounds for game time limits
      },
      maxAttempts: {
        type: Number,
        min: [1, 'Must allow at least 1 attempt'],
        max: [100, 'Max attempts cannot exceed 100'],
        // Why: Prevents abuse and ensures fair gameplay
      },
      pointsMultiplier: {
        type: Number,
        min: [0.1, 'Points multiplier must be at least 0.1'],
        max: [10, 'Points multiplier cannot exceed 10'],
        default: 1,
        // Why: Allows brands to adjust scoring difficulty/rewards
      },
      difficultyLevel: {
        type: String,
        enum: {
          values: ['easy', 'medium', 'hard', 'expert'],
          message: 'Difficulty must be easy, medium, hard, or expert',
        },
        // Why: Standardized difficulty levels across all games
      },
      customSettings: {
        type: Schema.Types.Mixed,
        default: {},
        // Why: Flexible storage for game-specific configuration (e.g., Madoku grid size)
      },
    },
    displayOrder: {
      type: Number,
      default: 0,
      // Why: Controls game ordering in UI per brand
    },
    featuredUntil: {
      type: Date,
      // Why: Allows temporary promotional featuring of games
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for audit trail
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last modification timestamp
      },
      createdBy: {
        type: String,
        trim: true,
        // Why: Audit trail for who created the configuration
      },
      lastModifiedBy: {
        type: String,
        trim: true,
        // Why: Audit trail for who last modified the configuration
      },
    },
  },
  {
    timestamps: false, // Using custom metadata timestamps
    strict: true,
    // Why: Prevents accidental addition of undefined fields
  }
);

/**
 * Indexes
 * Why: Optimizes common query patterns
 */
GameBrandConfigSchema.index({ brandId: 1, gameId: 1 }, { unique: true });
// Why: Ensures each brand can only have one config per game

GameBrandConfigSchema.index({ brandId: 1, displayOrder: 1 });
// Why: Optimizes queries for displaying games in order per brand

GameBrandConfigSchema.index({ gameId: 1, isEnabled: 1 });
// Why: Optimizes queries for finding enabled brands per game

GameBrandConfigSchema.index({ featuredUntil: 1 }, { sparse: true });
// Why: Optimizes queries for finding currently featured games

/**
 * Pre-save Hook: Update metadata timestamp
 * Why: Ensures updatedAt is current on every save
 */
GameBrandConfigSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

/**
 * Virtual: isFeatured
 * Why: Computed property to check if game is currently featured
 */
GameBrandConfigSchema.virtual('isFeatured').get(function () {
  return this.featuredUntil ? new Date() < this.featuredUntil : false;
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations in Next.js hot reload
 */
const GameBrandConfig: Model<IGameBrandConfig> =
  mongoose.models.GameBrandConfig ||
  mongoose.model<IGameBrandConfig>('GameBrandConfig', GameBrandConfigSchema);

export default GameBrandConfig;
