/**
 * EventLog Model
 * 
 * Purpose: Event-sourcing log for analytics and debugging
 * Why: Captures all significant player actions for analysis and audit
 * 
 * Features:
 * - Immutable event records
 * - Structured event types
 * - Flexible metadata storage
 * - Time-series data for analytics pipelines
 * - Supports replay and debugging
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: EventLog document structure
 * Why: Type-safe access to event properties
 */
export interface IEventLog extends Document {
  playerId?: mongoose.Types.ObjectId; // Null for system events
  brandId?: mongoose.Types.ObjectId;
  eventType: 'player_registered' | 'game_played' | 'achievement_unlocked' | 'points_earned' | 'points_spent' | 'level_up' | 'streak_started' | 'streak_broken' | 'streak_milestone' | 'challenge_completed' | 'reward_redeemed' | 'premium_purchased' | 'login' | 'logout' | 'system';
  eventData: Record<string, unknown>; // Flexible event-specific data
  timestamp: Date;
  context: {
    sessionId?: string;
    ipAddress?: string; // Hashed
    userAgent?: string;
    platform?: 'web' | 'mobile' | 'tablet';
  };
  metadata: {
    createdAt: Date;
    version: string; // App version when event occurred
  };
}

/**
 * Schema: EventLog
 * Why: Enforces immutable event structure for audit trail
 */
const EventLogSchema = new Schema<IEventLog>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      // Why: Query events by player (null for system events, index defined at schema level)
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      // Why: Brand-specific analytics (index defined at schema level)
    },
    eventType: {
      type: String,
      enum: {
        values: ['player_registered', 'game_played', 'achievement_unlocked', 'points_earned', 'points_spent', 'level_up', 'streak_started', 'streak_broken', 'streak_milestone', 'challenge_completed', 'reward_redeemed', 'premium_purchased', 'login', 'logout', 'system'],
        message: 'Event type must be valid',
      },
      required: [true, 'Event type is required'],
      immutable: true,
      // Why: Categorizes events for filtering and analytics (index defined at schema level)
    },
    eventData: {
      type: Schema.Types.Mixed,
      required: [true, 'Event data is required'],
      immutable: true,
      // Why: Flexible storage for event-specific details
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      default: () => new Date(),
      immutable: true,
      // Why: ISO 8601 timestamp for time-series analytics (index defined at schema level)
    },
    context: {
      sessionId: {
        type: String,
        trim: true,
        immutable: true,
        // Why: Groups events within same session
      },
      ipAddress: {
        type: String,
        immutable: true,
        // Why: Hashed IP for fraud detection
      },
      userAgent: {
        type: String,
        immutable: true,
        // Why: Browser/device information
      },
      platform: {
        type: String,
        enum: {
          values: ['web', 'mobile', 'tablet'],
          message: 'Platform must be web, mobile, or tablet',
        },
        immutable: true,
        // Why: Device type for usage analytics
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for record creation
      },
      version: {
        type: String,
        required: [true, 'App version is required'],
        immutable: true,
        // Why: Tracks which version generated the event
      },
    },
  },
  {
    timestamps: false, // Using custom immutable timestamps
    strict: true,
    // Why: Immutable events - no updates allowed
  }
);

/**
 * Indexes
 * Why: Optimizes time-series and analytics queries
 */
EventLogSchema.index({ timestamp: -1 });
// Why: Recent events queries

EventLogSchema.index({ playerId: 1, timestamp: -1 });
// Why: Player event timeline

EventLogSchema.index({ eventType: 1, timestamp: -1 });
// Why: Event type analytics over time

EventLogSchema.index({ brandId: 1, eventType: 1, timestamp: -1 });
// Why: Brand-specific event analytics

EventLogSchema.index({ 'context.sessionId': 1 });
// Why: Session-based event grouping

EventLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });
// Why: Auto-delete events after 90 days (optional TTL for storage management)

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const EventLog: Model<IEventLog> =
  mongoose.models.EventLog ||
  mongoose.model<IEventLog>('EventLog', EventLogSchema);

export default EventLog;
