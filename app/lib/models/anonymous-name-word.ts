/**
 * AnonymousNameWord Model
 * 
 * Stores words used for generating anonymous guest usernames.
 * Words are randomly selected (3 at a time) to create unique identities.
 * 
 * Why this approach:
 * - Stored in database for easy expansion without code changes
 * - Enables curated word lists for brand consistency
 * - Allows filtering/moderation of words
 * - Supports multiple categories if needed in future
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IAnonymousNameWord extends Document {
  word: string;
  category?: string; // Optional: 'city', 'animal', 'element', etc.
  isActive: boolean;
  usageCount: number; // Track how often this word is used
  createdAt: Date;
  updatedAt: Date;
}

const AnonymousNameWordSchema = new Schema<IAnonymousNameWord>(
  {
    // Why: The actual word to use in name generation
    word: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    
    // Why: Optional categorization for future filtering
    category: {
      type: String,
      trim: true,
      default: null,
    },
    
    // Why: Enable/disable words without deletion
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    
    // Why: Track popularity for analytics
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'AnonymousNameWord',
  }
);

// Why: Compound index for efficient active word queries
AnonymousNameWordSchema.index({ isActive: 1, word: 1 });

export const AnonymousNameWord =
  mongoose.models.AnonymousNameWord ||
  mongoose.model<IAnonymousNameWord>('AnonymousNameWord', AnonymousNameWordSchema);
