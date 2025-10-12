/**
 * PointsWallet Model
 * 
 * Purpose: Tracks current points balance per player
 * Why: Central wallet for in-game currency/points economy
 * 
 * Features:
 * - Current balance tracking
 * - Lifetime earned/spent totals
 * - Transaction history linking
 * - Balance validation and constraints
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: PointsWallet document structure
 * Why: Type-safe access to wallet properties
 */
export interface IPointsWallet extends Document {
  playerId: mongoose.Types.ObjectId;
  currentBalance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  pendingBalance: number; // Points pending confirmation (e.g., pending rewards)
  lastTransaction: Date;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastBalanceCheck: Date;
  };
}

/**
 * Schema: PointsWallet
 * Why: Enforces structure and validation for points tracking
 */
const PointsWalletSchema = new Schema<IPointsWallet>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      unique: true,
      index: true,
      // Why: One wallet per player
    },
    currentBalance: {
      type: Number,
      required: [true, 'Current balance is required'],
      default: 0,
      min: [0, 'Balance cannot be negative'],
      // Why: Prevents negative balances (no debt system)
    },
    lifetimeEarned: {
      type: Number,
      required: [true, 'Lifetime earned is required'],
      default: 0,
      min: [0, 'Lifetime earned cannot be negative'],
      // Why: Total points ever earned (for rankings and analytics)
    },
    lifetimeSpent: {
      type: Number,
      required: [true, 'Lifetime spent is required'],
      default: 0,
      min: [0, 'Lifetime spent cannot be negative'],
      // Why: Total points ever spent (for engagement metrics)
    },
    pendingBalance: {
      type: Number,
      default: 0,
      min: [0, 'Pending balance cannot be negative'],
      // Why: Points awaiting confirmation (e.g., reward redemption approval)
    },
    lastTransaction: {
      type: Date,
      required: [true, 'Last transaction date is required'],
      default: () => new Date(),
      // Why: ISO 8601 timestamp for activity tracking
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for wallet creation
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last wallet update
      },
      lastBalanceCheck: {
        type: Date,
        default: () => new Date(),
        // Why: For audit/reconciliation purposes
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
PointsWalletSchema.index({ playerId: 1 }, { unique: true });
// Why: One wallet per player

PointsWalletSchema.index({ currentBalance: -1 });
// Why: Leaderboards by current balance

PointsWalletSchema.index({ lifetimeEarned: -1 });
// Why: All-time earnings leaderboards

PointsWalletSchema.index({ lastTransaction: -1 });
// Why: Recent activity queries

/**
 * Pre-save Hook: Update metadata timestamp
 * Why: Ensures updatedAt is current on every save
 */
PointsWalletSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

/**
 * Virtual: netBalance
 * Why: Computed property for current + pending balance
 */
PointsWalletSchema.virtual('netBalance').get(function () {
  return this.currentBalance + this.pendingBalance;
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const PointsWallet: Model<IPointsWallet> =
  mongoose.models.PointsWallet ||
  mongoose.model<IPointsWallet>('PointsWallet', PointsWalletSchema);

export default PointsWallet;
