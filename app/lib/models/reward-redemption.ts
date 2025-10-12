/**
 * RewardRedemption Model
 * 
 * Purpose: Tracks reward claim lifecycle from request to fulfillment
 * Why: Complete audit trail for reward redemptions and fulfillment status
 * 
 * Features:
 * - Links Player, Reward, and PointsTransaction
 * - Multi-stage status tracking (pending, approved, fulfilled, cancelled)
 * - Expiration tracking
 * - Fulfillment details and notes
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: RewardRedemption document structure
 * Why: Type-safe access to redemption properties
 */
export interface IRewardRedemption extends Document {
  playerId: mongoose.Types.ObjectId;
  rewardId: mongoose.Types.ObjectId;
  transactionId: mongoose.Types.ObjectId; // Points transaction for this redemption
  status: 'pending' | 'approved' | 'fulfilled' | 'cancelled' | 'expired';
  pointsCost: number; // Snapshot of cost at redemption time
  redemptionDate: Date;
  expiresAt?: Date;
  fulfillment: {
    fulfilledAt?: Date;
    fulfilledBy?: string; // Admin user ID
    trackingInfo?: string; // For physical rewards
    notes?: string; // Internal fulfillment notes
  };
  cancellation?: {
    cancelledAt: Date;
    reason: string;
    refunded: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    playerNotified: boolean;
  };
}

/**
 * Schema: RewardRedemption
 * Why: Enforces structure and validation for redemption tracking
 */
const RewardRedemptionSchema = new Schema<IRewardRedemption>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
      // Why: Query player's redemption history
    },
    rewardId: {
      type: Schema.Types.ObjectId,
      ref: 'Reward',
      required: [true, 'Reward ID is required'],
      index: true,
      // Why: Track redemptions per reward
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'PointsTransaction',
      required: [true, 'Transaction ID is required'],
      unique: true,
      // Why: One redemption per transaction (ensures points were deducted)
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'fulfilled', 'cancelled', 'expired'],
        message: 'Status must be valid',
      },
      required: [true, 'Status is required'],
      default: 'pending',
      index: true,
      // Why: Tracks redemption lifecycle
    },
    pointsCost: {
      type: Number,
      required: [true, 'Points cost is required'],
      min: [1, 'Points cost must be at least 1'],
      immutable: true,
      // Why: Snapshot at redemption time (reward cost may change later)
    },
    redemptionDate: {
      type: Date,
      required: [true, 'Redemption date is required'],
      default: () => new Date(),
      immutable: true,
      // Why: ISO 8601 timestamp when redemption was requested
    },
    expiresAt: {
      type: Date,
      // Why: When unfulfilled redemption expires
    },
    fulfillment: {
      fulfilledAt: {
        type: Date,
        // Why: ISO 8601 timestamp when reward was delivered
      },
      fulfilledBy: {
        type: String,
        trim: true,
        // Why: Admin user who processed fulfillment
      },
      trackingInfo: {
        type: String,
        trim: true,
        maxlength: [500, 'Tracking info cannot exceed 500 characters'],
        // Why: Tracking number for physical rewards
      },
      notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Notes cannot exceed 2000 characters'],
        // Why: Internal notes about fulfillment
      },
    },
    cancellation: {
      cancelledAt: {
        type: Date,
        // Why: ISO 8601 timestamp when redemption was cancelled
      },
      reason: {
        type: String,
        trim: true,
        maxlength: [1000, 'Cancellation reason cannot exceed 1000 characters'],
        // Why: Explanation for cancellation
      },
      refunded: {
        type: Boolean,
        default: false,
        // Why: Whether points were refunded
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for record creation
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last status update
      },
      playerNotified: {
        type: Boolean,
        default: false,
        // Why: Whether player was notified of fulfillment
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
RewardRedemptionSchema.index({ playerId: 1, redemptionDate: -1 });
// Why: Player's redemption history (recent first)

RewardRedemptionSchema.index({ rewardId: 1, status: 1 });
// Why: Track redemptions by reward and status

RewardRedemptionSchema.index({ status: 1, redemptionDate: -1 });
// Why: Admin dashboard for pending/processing redemptions

RewardRedemptionSchema.index({ expiresAt: 1 }, { sparse: true });
// Why: Find expiring redemptions for automated cleanup

RewardRedemptionSchema.index({ 'fulfillment.fulfilledAt': -1 }, { sparse: true });
// Why: Recently fulfilled redemptions

/**
 * Pre-save Hook: Update metadata timestamp
 * Why: Ensures updatedAt is current on every save
 */
RewardRedemptionSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  
  // Auto-set fulfillment timestamp when status changes to fulfilled
  if (this.isModified('status') && this.status === 'fulfilled' && !this.fulfillment.fulfilledAt) {
    this.fulfillment.fulfilledAt = new Date();
  }
  
  // Auto-set cancellation timestamp when status changes to cancelled
  if (this.isModified('status') && this.status === 'cancelled' && this.cancellation && !this.cancellation.cancelledAt) {
    this.cancellation.cancelledAt = new Date();
  }
  
  next();
});

/**
 * Virtual: isPending
 * Why: Computed property to check if redemption awaits processing
 */
RewardRedemptionSchema.virtual('isPending').get(function () {
  return this.status === 'pending' || this.status === 'approved';
});

/**
 * Virtual: isCompleted
 * Why: Computed property to check if redemption is in final state
 */
RewardRedemptionSchema.virtual('isCompleted').get(function () {
  return ['fulfilled', 'cancelled', 'expired'].includes(this.status);
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const RewardRedemption: Model<IRewardRedemption> =
  mongoose.models.RewardRedemption ||
  mongoose.model<IRewardRedemption>('RewardRedemption', RewardRedemptionSchema);

export default RewardRedemption;
