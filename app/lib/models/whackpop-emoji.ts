/**
 * WhackPopEmoji Model
 * 
 * What: Stores emoji characters used as targets in WHACKPOP game
 * Why: Enables database-driven emoji management and easy content expansion
 * 
 * Features:
 * - Unique emoji constraint
 * - Active/inactive toggling
 * - Weight-based selection (for future probability tuning)
 * - Category organization
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * WhackPopEmoji Document Interface
 * Why: TypeScript type safety for WhackPopEmoji documents
 */
export interface IWhackPopEmoji extends Document {
  emoji: string;
  name: string;
  category: string;
  isActive: boolean;
  weight: number;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
  };
}

/**
 * WhackPopEmoji Schema
 * Why: Defines structure, validation, and indexes for emoji management
 */
const WhackPopEmojiSchema = new Schema<IWhackPopEmoji>(
  {
    // Emoji character
    // Why: The actual emoji displayed in game
    emoji: {
      type: String,
      required: [true, 'Emoji is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (emoji: string) {
          // Why: Basic validation that string contains emoji-like character
          // Emojis are typically 1-2 characters (can be multi-byte)
          return emoji.length >= 1 && emoji.length <= 10;
        },
        message: 'Invalid emoji format',
      },
    },

    // Emoji name
    // Why: Human-readable identifier for admin management
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    // Category
    // Why: Enables grouping for themed gameplay variations
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Animals',
          'Food',
          'Objects',
          'Nature',
          'Sports',
          'Transportation',
          'Symbols',
        ],
        message: 'Invalid category',
      },
      default: 'Animals',
      index: true, // Why: For category-filtered queries
    },

    // Active status
    // Why: Allows soft-deletion without removing emoji from database
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Why: Always filter by active status
    },

    // Weight
    // Why: Controls selection probability (higher weight = more likely to appear)
    // Currently unused (all set to 1), but enables future balancing
    weight: {
      type: Number,
      required: true,
      default: 1,
      min: [0, 'Weight cannot be negative'],
      max: [10, 'Weight cannot exceed 10'],
    },

    // Metadata
    // Why: Audit trail and temporal tracking
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for compliance with AI rules
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last modification for admin visibility
      },
      createdBy: {
        type: String,
        trim: true,
        // Why: Optional admin user who added the emoji
      },
    },
  },
  {
    timestamps: false, // Using custom metadata timestamps
    strict: true,
    // Why: Prevents accidental addition of undefined fields
    collection: 'whackpop_emojis',
  }
);

/**
 * Unique Index on Emoji
 * Why: Prevents duplicate emojis in database
 */
WhackPopEmojiSchema.index(
  { emoji: 1 },
  { unique: true, name: 'emoji_unique' }
);

/**
 * Compound Index for Active Category Queries
 * Why: Optimizes fetching active emojis by category
 */
WhackPopEmojiSchema.index(
  { isActive: 1, category: 1 },
  { name: 'active_category' }
);

/**
 * Pre-save Hook: Update metadata timestamp
 * Why: Ensures updatedAt is current on every save
 */
WhackPopEmojiSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations in Next.js hot reload
 */
const WhackPopEmoji: Model<IWhackPopEmoji> =
  mongoose.models.WhackPopEmoji ||
  mongoose.model<IWhackPopEmoji>('WhackPopEmoji', WhackPopEmojiSchema);

export default WhackPopEmoji;
