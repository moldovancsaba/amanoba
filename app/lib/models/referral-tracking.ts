/**
 * ReferralTracking Model
 * 
 * Purpose: Tracks player referral events and rewards
 * Why: Supports referral program for organic growth (bonus from PlayMass)
 * 
 * Features:
 * - Referrer and referee tracking
 * - Referral code generation
 * - Status tracking (pending, completed, rewarded)
 * - Bonus points distribution
 * - Fraud detection metadata
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: ReferralTracking document structure
 * Why: Type-safe access to referral properties
 */
export interface IReferralTracking extends Document {
  referrerId: mongoose.Types.ObjectId; // Player who referred
  refereeId: mongoose.Types.ObjectId; // Player who was referred
  referralCode: string;
  status: 'pending' | 'completed' | 'rewarded' | 'invalid';
  rewards: {
    referrerPoints: number;
    refereePoints: number;
    referrerBonusXP: number;
    refereeBonusXP: number;
    rewardedAt?: Date;
  };
  completionCriteria: {
    requireGamesPlayed?: number;
    requirePointsEarned?: number;
    requireDaysActive?: number;
    meetsRequirements: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    ipAddress?: string; // Hashed
    userAgent?: string;
  };
}

/**
 * Schema: ReferralTracking
 * Why: Enforces structure and validation for referral tracking
 */
const ReferralTrackingSchema = new Schema<IReferralTracking>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Referrer ID is required'],
      index: true,
      // Why: Query referrals by referrer
    },
    refereeId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Referee ID is required'],
      unique: true,
      index: true,
      // Why: One referral record per referee (prevent double rewards)
    },
    referralCode: {
      type: String,
      required: [true, 'Referral code is required'],
      trim: true,
      uppercase: true,
      maxlength: [20, 'Referral code cannot exceed 20 characters'],
      index: true,
      immutable: true,
      // Why: Code used for tracking (e.g., "PLAYER123")
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'rewarded', 'invalid'],
        message: 'Status must be pending, completed, rewarded, or invalid',
      },
      required: [true, 'Status is required'],
      default: 'pending',
      index: true,
      // Why: Tracks referral lifecycle
    },
    rewards: {
      referrerPoints: {
        type: Number,
        default: 0,
        min: [0, 'Referrer points cannot be negative'],
        // Why: Points awarded to referrer
      },
      refereePoints: {
        type: Number,
        default: 0,
        min: [0, 'Referee points cannot be negative'],
        // Why: Welcome bonus for new player
      },
      referrerBonusXP: {
        type: Number,
        default: 0,
        min: [0, 'Referrer bonus XP cannot be negative'],
        // Why: XP bonus for referrer
      },
      refereeBonusXP: {
        type: Number,
        default: 0,
        min: [0, 'Referee bonus XP cannot be negative'],
        // Why: Welcome XP for new player
      },
      rewardedAt: {
        type: Date,
        // Why: ISO 8601 timestamp when rewards were distributed
      },
    },
    completionCriteria: {
      requireGamesPlayed: {
        type: Number,
        min: [0, 'Required games cannot be negative'],
        // Why: Referee must play N games before rewards
      },
      requirePointsEarned: {
        type: Number,
        min: [0, 'Required points cannot be negative'],
        // Why: Referee must earn N points before rewards
      },
      requireDaysActive: {
        type: Number,
        min: [0, 'Required days cannot be negative'],
        // Why: Referee must be active for N days before rewards
      },
      meetsRequirements: {
        type: Boolean,
        default: false,
        // Why: Whether referee has met completion criteria
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp when referral was created
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last status update
      },
      completedAt: {
        type: Date,
        // Why: ISO 8601 timestamp when criteria were met
      },
      ipAddress: {
        type: String,
        immutable: true,
        // Why: Hashed IP for fraud detection (same IP = suspicious)
      },
      userAgent: {
        type: String,
        immutable: true,
        // Why: Device info for fraud detection
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
ReferralTrackingSchema.index({ referrerId: 1, status: 1 });
// Why: Count referrals by referrer and status

ReferralTrackingSchema.index({ refereeId: 1 }, { unique: true });
// Why: One referral per referee (prevents double rewards)

ReferralTrackingSchema.index({ referralCode: 1 });
// Why: Lookup by referral code

ReferralTrackingSchema.index({ status: 1, 'metadata.createdAt': -1 });
// Why: Pending referrals for automated checks

ReferralTrackingSchema.index({ 'completionCriteria.meetsRequirements': 1, status: 1 });
// Why: Find referrals ready for reward distribution

/**
 * Pre-save Hook: Update metadata timestamp and auto-complete
 * Why: Ensures updatedAt is current and auto-sets completion timestamp
 */
ReferralTrackingSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  
  // Auto-set completedAt when criteria are met
  if (
    this.isModified('completionCriteria.meetsRequirements') &&
    this.completionCriteria.meetsRequirements &&
    !this.metadata.completedAt
  ) {
    this.metadata.completedAt = new Date();
    if (this.status === 'pending') {
      this.status = 'completed';
    }
  }
  
  // Auto-set rewardedAt when status changes to rewarded
  if (this.isModified('status') && this.status === 'rewarded' && !this.rewards.rewardedAt) {
    this.rewards.rewardedAt = new Date();
  }
  
  next();
});

/**
 * Virtual: isPending
 * Why: Computed property to check if referral awaits completion
 */
ReferralTrackingSchema.virtual('isPending').get(function () {
  return this.status === 'pending' || this.status === 'completed';
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const ReferralTracking: Model<IReferralTracking> =
  mongoose.models.ReferralTracking ||
  mongoose.model<IReferralTracking>('ReferralTracking', ReferralTrackingSchema);

export default ReferralTracking;
