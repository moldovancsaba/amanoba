/**
 * Reward Model
 * 
 * Purpose: Defines redeemable rewards in the points economy
 * Why: Provides tangible value for earned points, driving engagement
 * 
 * Features:
 * - Points cost definition
 * - Stock/availability tracking
 * - Category organization
 * - Visibility and availability controls
 * - Reward types (digital, physical, virtual)
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: Reward document structure
 * Why: Type-safe access to reward properties
 */
export interface IReward extends Document {
  name: string;
  description: string;
  category: 'game_unlock' | 'cosmetic' | 'boost' | 'physical' | 'discount' | 'virtual_item';
  type: 'digital' | 'physical' | 'virtual';
  pointsCost: number;
  stock: {
    isLimited: boolean;
    currentStock?: number;
    maxStock?: number;
  };
  availability: {
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    premiumOnly: boolean;
  };
  media: {
    imageUrl?: string;
    iconEmoji?: string;
  };
  redemptionDetails: {
    instructions?: string;
    expiresAfterDays?: number; // How long reward is valid after redemption
    limitPerPlayer?: number; // Max redemptions per player
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    totalRedemptions: number;
    displayOrder: number;
  };
}

/**
 * Schema: Reward
 * Why: Enforces structure and validation for reward definitions
 */
const RewardSchema = new Schema<IReward>(
  {
    name: {
      type: String,
      required: [true, 'Reward name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      unique: true,
      // Why: Unique identifier for reward
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      // Why: Explains what player gets
    },
    category: {
      type: String,
      enum: {
        values: ['game_unlock', 'cosmetic', 'boost', 'physical', 'discount', 'virtual_item'],
        message: 'Category must be valid',
      },
      required: [true, 'Category is required'],
      // Why: Organizes rewards by type (index defined at schema level)
    },
    type: {
      type: String,
      enum: {
        values: ['digital', 'physical', 'virtual'],
        message: 'Type must be digital, physical, or virtual',
      },
      required: [true, 'Type is required'],
      // Why: Determines fulfillment method
    },
    pointsCost: {
      type: Number,
      required: [true, 'Points cost is required'],
      min: [1, 'Points cost must be at least 1'],
      // Why: How many points to redeem (index defined at schema level)
    },
    stock: {
      isLimited: {
        type: Boolean,
        default: false,
        // Why: Whether reward has limited availability
      },
      currentStock: {
        type: Number,
        min: [0, 'Current stock cannot be negative'],
        // Why: Remaining quantity available
      },
      maxStock: {
        type: Number,
        min: [1, 'Max stock must be at least 1'],
        // Why: Original stock quantity for tracking
      },
    },
    availability: {
      isActive: {
        type: Boolean,
        default: true,
        // Why: Can disable rewards without deletion
      },
      startDate: {
        type: Date,
        // Why: When reward becomes available (for scheduled releases)
      },
      endDate: {
        type: Date,
        // Why: When reward is no longer available (for limited-time offers)
      },
      premiumOnly: {
        type: Boolean,
        default: false,
        // Why: Restricts reward to premium players
      },
    },
    media: {
      imageUrl: {
        type: String,
        trim: true,
        // Why: Visual representation of reward
      },
      iconEmoji: {
        type: String,
        trim: true,
        maxlength: [10, 'Icon emoji cannot exceed 10 characters'],
        // Why: Emoji icon for rewards without images
      },
    },
    redemptionDetails: {
      instructions: {
        type: String,
        trim: true,
        maxlength: [2000, 'Instructions cannot exceed 2000 characters'],
        // Why: How player claims/uses reward after redemption
      },
      expiresAfterDays: {
        type: Number,
        min: [1, 'Expiration must be at least 1 day'],
        // Why: Validity period for redeemed reward
      },
      limitPerPlayer: {
        type: Number,
        min: [1, 'Limit per player must be at least 1'],
        // Why: Prevents abuse by limiting redemptions
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for reward creation
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last modification
      },
      totalRedemptions: {
        type: Number,
        default: 0,
        min: [0, 'Total redemptions cannot be negative'],
        // Why: Tracks popularity
      },
      displayOrder: {
        type: Number,
        default: 0,
        // Why: Controls order in UI
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
RewardSchema.index({ category: 1, pointsCost: 1 });
// Why: Browsing rewards by category and cost

RewardSchema.index({ 'availability.isActive': 1, 'metadata.displayOrder': 1 });
// Why: Fetching active rewards in display order

RewardSchema.index({ pointsCost: 1 });
// Why: Sorting rewards by affordability

RewardSchema.index({ 'metadata.totalRedemptions': -1 });
// Why: Finding most popular rewards

/**
 * Pre-save Hook: Update metadata timestamp
 * Why: Ensures updatedAt is current on every save
 */
RewardSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

/**
 * Virtual: isAvailable
 * Why: Computed property to check if reward can be redeemed now
 */
RewardSchema.virtual('isAvailable').get(function () {
  if (!this.availability.isActive) return false;
  
  const now = new Date();
  
  if (this.availability.startDate && now < this.availability.startDate) return false;
  if (this.availability.endDate && now > this.availability.endDate) return false;
  
  if (this.stock.isLimited && this.stock.currentStock !== undefined) {
    return this.stock.currentStock > 0;
  }
  
  return true;
});

/**
 * Virtual: stockPercentage
 * Why: Computed property for stock remaining percentage
 */
RewardSchema.virtual('stockPercentage').get(function () {
  if (!this.stock.isLimited || !this.stock.maxStock || !this.stock.currentStock) return 100;
  return (this.stock.currentStock / this.stock.maxStock) * 100;
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const Reward: Model<IReward> =
  mongoose.models.Reward ||
  mongoose.model<IReward>('Reward', RewardSchema);

export default Reward;
