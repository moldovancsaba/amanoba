/**
 * GuestUsername Model
 * 
 * Pre-generated 3-word usernames for anonymous guest accounts.
 * Much simpler than generating on-the-fly.
 * 
 * Why this approach:
 * - Faster - no generation logic needed
 * - More reliable - names are pre-validated
 * - Easier to manage - just add/remove in database
 * - Trackable - can see which names are popular
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IGuestUsername extends Document {
  username: string;
  usageCount: number;
  lastUsedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GuestUsernameSchema = new Schema<IGuestUsername>(
  {
    // Why: The full 3-word username (e.g. "London Snake Africa")
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    
    // Why: Track how many times this username has been used
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Why: Track when this username was last used
    lastUsedAt: {
      type: Date,
    },
    
    // Why: Enable/disable usernames without deletion
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'GuestUsername',
  }
);

// Why: Index for efficient random selection of active usernames
GuestUsernameSchema.index({ isActive: 1, usageCount: 1 });

export const GuestUsername =
  mongoose.models.GuestUsername ||
  mongoose.model<IGuestUsername>('GuestUsername', GuestUsernameSchema);
