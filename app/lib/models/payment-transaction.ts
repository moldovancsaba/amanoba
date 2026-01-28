/**
 * PaymentTransaction Model
 * 
 * Purpose: Complete audit trail for all Stripe payment transactions
 * Why: Immutable transaction history for financial integrity, dispute resolution, and revenue tracking
 * 
 * Features:
 * - Links to Player and Course
 * - Stripe payment tracking (payment intent, checkout session)
 * - Transaction status tracking (pending, succeeded, failed, refunded)
 * - Amount and currency tracking
 * - Payment method information
 * - Immutable records for audit compliance
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Payment Status Enum
 * Why: Standardized payment states matching Stripe's payment intent statuses
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

/**
 * Interface: PaymentTransaction document structure
 * Why: Type-safe access to payment transaction properties
 */
export interface IPaymentTransaction extends Document {
  playerId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId; // Optional: may be general premium purchase
  brandId: mongoose.Types.ObjectId;
  
  // Stripe identifiers
  stripePaymentIntentId: string; // Stripe PaymentIntent ID (pi_xxxxx)
  stripeCheckoutSessionId?: string; // Stripe Checkout Session ID (cs_xxxxx)
  stripeCustomerId?: string; // Stripe Customer ID (cus_xxxxx)
  stripeChargeId?: string; // Stripe Charge ID (ch_xxxxx)
  
  // Payment details
  amount: number; // Amount in cents (e.g., 2999 = $29.99)
  currency: string; // ISO currency code (e.g., 'usd', 'eur', 'huf')
  status: PaymentStatus;
  
  // Payment method
  paymentMethod?: {
    type: string; // 'card', 'paypal', etc.
    brand?: string; // 'visa', 'mastercard', etc.
    last4?: string; // Last 4 digits of card
    country?: string; // Country code
  };
  
  // Premium access details
  premiumGranted: boolean; // Whether premium access was granted
  premiumExpiresAt?: Date; // When premium access expires
  premiumDurationDays?: number; // Number of days premium was granted
  
  // Metadata
  metadata: {
    createdAt: Date;
    processedAt?: Date; // When payment was processed
    refundedAt?: Date; // When refund was processed
    failureReason?: string; // Reason for payment failure
    refundReason?: string; // Reason for refund
    ipAddress?: string; // IP address of payer
    userAgent?: string; // User agent of payer
    notes?: string; // Additional notes
  };
}

/**
 * Schema: PaymentTransaction
 * Why: Enforces immutable transaction structure
 */
const PaymentTransactionSchema = new Schema<IPaymentTransaction>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
      immutable: true,
      // Why: Transaction cannot be reassigned to different player
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
      immutable: true,
      // Why: Links to purchased course (if applicable)
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      immutable: true,
      // Why: Links to brand for multi-tenant support
    },
    
    // Stripe identifiers
    stripePaymentIntentId: {
      type: String,
      required: [true, 'Stripe Payment Intent ID is required'],
      unique: true,
      trim: true,
      index: true,
      immutable: true,
      // Why: Primary Stripe identifier, must be unique
    },
    stripeCheckoutSessionId: {
      type: String,
      trim: true,
      immutable: true,
      // Why: Links to Stripe Checkout session
    },
    stripeCustomerId: {
      type: String,
      trim: true,
      immutable: true,
      // Why: Links to Stripe Customer for recurring payments
    },
    stripeChargeId: {
      type: String,
      trim: true,
      index: true,
      immutable: true,
      // Why: Links to Stripe Charge for refunds
    },
    
    // Payment details
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
      immutable: true,
      // Why: Amount in cents (e.g., 2999 = $29.99)
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      uppercase: true,
      length: [3, 3],
      default: 'USD',
      immutable: true,
      // Why: ISO 4217 currency code
    },
    status: {
      type: String,
      enum: {
        values: Object.values(PaymentStatus),
        message: 'Status must be a valid payment status',
      },
      required: [true, 'Status is required'],
      default: PaymentStatus.PENDING,
      index: true,
      // Why: Tracks payment state (can be updated as payment progresses)
    },
    
    // Payment method
    paymentMethod: {
      type: {
        type: String,
        trim: true,
        immutable: true,
        // Why: Payment method type (card, paypal, etc.)
      },
      brand: {
        type: String,
        trim: true,
        immutable: true,
        // Why: Card brand (visa, mastercard, etc.)
      },
      last4: {
        type: String,
        length: [4, 4],
        immutable: true,
        // Why: Last 4 digits of card for display
      },
      country: {
        type: String,
        length: [2, 2],
        uppercase: true,
        immutable: true,
        // Why: Country code (ISO 3166-1 alpha-2)
      },
    },
    
    // Premium access details
    premiumGranted: {
      type: Boolean,
      default: false,
      index: true,
      // Why: Tracks whether premium access was granted (can be updated)
    },
    premiumExpiresAt: {
      type: Date,
      index: true,
      // Why: When premium access expires (can be updated for extensions)
    },
    premiumDurationDays: {
      type: Number,
      min: [0, 'Premium duration cannot be negative'],
      immutable: true,
      // Why: Number of days premium was granted
    },
    
    // Metadata
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        required: [true, 'Created at is required'],
        // Why: ISO 8601 timestamp for transaction creation
      },
      processedAt: {
        type: Date,
        // Why: When payment was successfully processed
      },
      refundedAt: {
        type: Date,
        // Why: When refund was processed
      },
      failureReason: {
        type: String,
        trim: true,
        maxlength: [500, 'Failure reason cannot exceed 500 characters'],
        // Why: Reason for payment failure
      },
      refundReason: {
        type: String,
        trim: true,
        maxlength: [500, 'Refund reason cannot exceed 500 characters'],
        // Why: Reason for refund
      },
      ipAddress: {
        type: String,
        immutable: true,
        // Why: IP address for fraud detection
      },
      userAgent: {
        type: String,
        immutable: true,
        maxlength: [500, 'User agent cannot exceed 500 characters'],
        // Why: User agent for fraud detection
      },
      notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        // Why: Additional context for transactions
      },
    },
  },
  {
    timestamps: false, // Using custom immutable createdAt
    strict: true,
    // Why: Immutable transactions - only status and premium fields can be updated
  }
);

/**
 * Indexes
 * Why: Optimizes common query patterns for payment history
 */
PaymentTransactionSchema.index({ playerId: 1, 'metadata.createdAt': -1 });
// Why: Player payment history (most recent first)

PaymentTransactionSchema.index({ courseId: 1, 'metadata.createdAt': -1 });
// Why: Course-specific payment queries

PaymentTransactionSchema.index({ brandId: 1, 'metadata.createdAt': -1 });
// Why: Brand-specific payment queries

PaymentTransactionSchema.index({ status: 1, 'metadata.createdAt': -1 });
// Why: Payment status analytics over time

PaymentTransactionSchema.index({ stripeCustomerId: 1 });
// Why: Lookup payments by Stripe customer

PaymentTransactionSchema.index({ stripeCheckoutSessionId: 1 });
// Why: Lookup payment by checkout session

PaymentTransactionSchema.index({ premiumGranted: 1, premiumExpiresAt: 1 });
// Why: Query active premium subscriptions

PaymentTransactionSchema.index({ 'metadata.createdAt': -1 });
// Why: Global recent payments queries

/**
 * Virtual: isSuccessful
 * Why: Computed property to check if payment succeeded
 */
PaymentTransactionSchema.virtual('isSuccessful').get(function () {
  return this.status === PaymentStatus.SUCCEEDED;
});

/**
 * Virtual: isRefunded
 * Why: Computed property to check if payment was refunded
 */
PaymentTransactionSchema.virtual('isRefunded').get(function () {
  return this.status === PaymentStatus.REFUNDED || this.status === PaymentStatus.PARTIALLY_REFUNDED;
});

/**
 * Virtual: isActive
 * Why: Computed property to check if premium is currently active
 */
PaymentTransactionSchema.virtual('isActive').get(function () {
  if (!this.premiumGranted) return false;
  if (!this.premiumExpiresAt) return true; // Lifetime premium
  return this.premiumExpiresAt > new Date();
});

/**
 * Pre-save Hook: Update processedAt timestamp
 * Why: Automatically set processedAt when status changes to succeeded
 */
PaymentTransactionSchema.pre('save', function (next) {
  // Set processedAt when payment succeeds
  if (this.isModified('status') && this.status === PaymentStatus.SUCCEEDED && !this.metadata.processedAt) {
    this.metadata.processedAt = new Date();
  }
  
  // Set refundedAt when payment is refunded
  if (this.isModified('status') && (this.status === PaymentStatus.REFUNDED || this.status === PaymentStatus.PARTIALLY_REFUNDED) && !this.metadata.refundedAt) {
    this.metadata.refundedAt = new Date();
  }
  
  next();
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const PaymentTransaction: Model<IPaymentTransaction> =
  mongoose.models.PaymentTransaction ||
  mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);

export default PaymentTransaction;
