/**
 * PointsTransaction Model
 * 
 * Purpose: Complete audit trail for all points earned and spent
 * Why: Immutable transaction history for financial integrity and dispute resolution
 * 
 * Features:
 * - Links to Player and PointsWallet
 * - Transaction type classification (earn, spend, refund, admin)
 * - Source tracking (game session, reward redemption, admin adjustment)
 * - Balance snapshots before/after transaction
 * - Immutable records for audit compliance
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: PointsTransaction document structure
 * Why: Type-safe access to transaction properties
 */
export interface IPointsTransaction extends Document {
  playerId: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  type: 'earn' | 'spend' | 'refund' | 'admin_add' | 'admin_deduct' | 'bonus';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  source: {
    type: 'game_session' | 'reward_redemption' | 'achievement' | 'streak' | 'admin' | 'referral' | 'daily_bonus' | 'daily_challenge';
    referenceId?: mongoose.Types.ObjectId; // ID of related document (session, reward, etc.)
    description: string;
  };
  metadata: {
    createdAt: Date;
    processedBy?: string; // Admin user ID for manual transactions
    notes?: string; // Optional notes for admin transactions
    ipAddress?: string; // Hashed for fraud detection
  };
}

/**
 * Schema: PointsTransaction
 * Why: Enforces immutable transaction structure
 */
const PointsTransactionSchema = new Schema<IPointsTransaction>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
      immutable: true,
      // Why: Transaction cannot be reassigned to different player
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: 'PointsWallet',
      required: [true, 'Wallet ID is required'],
      index: true,
      immutable: true,
      // Why: Links to specific wallet for reconciliation
    },
    type: {
      type: String,
      enum: {
        values: ['earn', 'spend', 'refund', 'admin_add', 'admin_deduct', 'bonus'],
        message: 'Type must be earn, spend, refund, admin_add, admin_deduct, or bonus',
      },
      required: [true, 'Transaction type is required'],
      index: true,
      immutable: true,
      // Why: Categorizes transaction for reporting and analytics
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      validate: {
        validator: function (value: number) {
          return value !== 0;
        },
        message: 'Amount cannot be zero',
      },
      immutable: true,
      // Why: Positive for earn/add, negative for spend/deduct
    },
    balanceBefore: {
      type: Number,
      required: [true, 'Balance before is required'],
      min: [0, 'Balance before cannot be negative'],
      immutable: true,
      // Why: Snapshot for audit trail and reconciliation
    },
    balanceAfter: {
      type: Number,
      required: [true, 'Balance after is required'],
      min: [0, 'Balance after cannot be negative'],
      immutable: true,
      // Why: Snapshot for audit trail and validation
    },
    source: {
      type: {
        type: String,
        enum: {
          values: ['game_session', 'reward_redemption', 'achievement', 'streak', 'admin', 'referral', 'daily_bonus', 'daily_challenge'],
          message: 'Source type must be valid',
        },
        required: [true, 'Source type is required'],
        immutable: true,
      },
      referenceId: {
        type: Schema.Types.ObjectId,
        immutable: true,
        // Why: Links to originating document for full transaction context
      },
      description: {
        type: String,
        required: [true, 'Source description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        immutable: true,
        // Why: Human-readable transaction reason
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        required: [true, 'Created at is required'],
        // Why: ISO 8601 timestamp for transaction time
      },
      processedBy: {
        type: String,
        trim: true,
        immutable: true,
        // Why: Admin user ID for manual transactions (audit trail)
      },
      notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        immutable: true,
        // Why: Additional context for admin transactions
      },
      ipAddress: {
        type: String,
        immutable: true,
        // Why: Hashed IP for fraud detection
      },
    },
  },
  {
    timestamps: false, // Using custom immutable createdAt
    strict: true,
    // Why: Immutable transactions - no updates allowed
  }
);

/**
 * Indexes
 * Why: Optimizes common query patterns for transaction history
 */
PointsTransactionSchema.index({ playerId: 1, 'metadata.createdAt': -1 });
// Why: Player transaction history (most recent first)

PointsTransactionSchema.index({ walletId: 1, 'metadata.createdAt': -1 });
// Why: Wallet-specific transaction history

PointsTransactionSchema.index({ type: 1, 'metadata.createdAt': -1 });
// Why: Transaction type analytics over time

PointsTransactionSchema.index({ 'source.type': 1, 'metadata.createdAt': -1 });
// Why: Source-specific transaction queries

PointsTransactionSchema.index({ 'source.referenceId': 1 });
// Why: Lookup transactions by related document (e.g., session, reward)

PointsTransactionSchema.index({ 'metadata.createdAt': -1 });
// Why: Global recent transactions queries

/**
 * Pre-save Hook: Validate balance calculation
 * Why: Ensures balance integrity before save
 */
PointsTransactionSchema.pre('save', function (next) {
  const expectedBalance = this.balanceBefore + this.amount;
  
  if (Math.abs(expectedBalance - this.balanceAfter) > 0.01) {
    return next(new Error('Balance calculation mismatch: balanceBefore + amount !== balanceAfter'));
  }
  
  next();
});

/**
 * Virtual: isCredit
 * Why: Computed property to check if transaction adds points
 */
PointsTransactionSchema.virtual('isCredit').get(function () {
  return this.amount > 0;
});

/**
 * Virtual: isDebit
 * Why: Computed property to check if transaction removes points
 */
PointsTransactionSchema.virtual('isDebit').get(function () {
  return this.amount < 0;
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const PointsTransaction: Model<IPointsTransaction> =
  mongoose.models.PointsTransaction ||
  mongoose.model<IPointsTransaction>('PointsTransaction', PointsTransactionSchema);

export default PointsTransaction;
