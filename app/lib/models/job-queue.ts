/**
 * Job Queue Model
 * 
 * Purpose: Background job queue for retry mechanism of non-critical gamification updates
 * Why: Prevents transient failures (network, DB timeout) from permanently losing achievement/leaderboard/challenge updates
 * 
 * Features:
 * - Stores failed operations for retry with exponential backoff
 * - Supports different job types (achievement, leaderboard, challenge)
 * - Tracks attempts and schedules next retry
 * - Dead letter queue for permanently failed jobs
 * 
 * Part of two-phase commit architecture (Phase 4)
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

// Why: Type-safe job types for different background operations
export type JobType = 'achievement' | 'leaderboard' | 'challenge';

// Why: Job status lifecycle
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Why: Interface for job queue documents
export interface IJobQueue extends Document {
  _id: mongoose.Types.ObjectId;
  jobType: JobType;
  playerId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId; // Optional: may be null for scheduled jobs
  brandId?: mongoose.Types.ObjectId;
  gameId?: mongoose.Types.ObjectId;
  payload: Record<string, unknown>; // Job-specific data
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  nextRetryAt: Date;
  lastError?: {
    message: string;
    stack?: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// Why: Schema definition with validation and indexes
const JobQueueSchema = new Schema<IJobQueue>(
  {
    jobType: {
      type: String,
      required: true,
      enum: ['achievement', 'leaderboard', 'challenge'],
      index: true, // Why: Frequently queried for specific job types
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true, // Why: For player-specific job queries
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'PlayerSession',
      required: false, // Why: Some jobs may not be session-specific (e.g., scheduled recalculations)
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: false,
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: false,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
      // Why: Flexible storage for job-specific data (progression, scores, etc.)
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true, // Why: Filter jobs by status for processing
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    maxAttempts: {
      type: Number,
      required: true,
      default: 5, // Why: 5 retries with exponential backoff = ~25 hours total retry window
    },
    nextRetryAt: {
      type: Date,
      required: true,
      index: true, // Why: Find jobs ready to retry
    },
    lastError: {
      message: { type: String },
      stack: { type: String },
      timestamp: { type: Date },
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true, // Why: Clean up old completed jobs
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    startedAt: {
      type: Date,
      required: false,
    },
    completedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // Why: Automatically update createdAt/updatedAt
    collection: 'job_queue',
  }
);

// Why: Compound index for efficient job processing queries
JobQueueSchema.index(
  { status: 1, nextRetryAt: 1 },
  { 
    name: 'processing_queue',
    // Why: Find pending jobs ready to process
  }
);

// Why: Index for finding jobs by type and status
JobQueueSchema.index(
  { jobType: 1, status: 1 },
  {
    name: 'job_type_status',
    // Why: Monitor queue health per job type
  }
);

// Why: Index for player-specific job queries
JobQueueSchema.index(
  { playerId: 1, createdAt: -1 },
  {
    name: 'player_jobs',
    // Why: Find all jobs for a specific player (for debugging)
  }
);

// Why: TTL index to automatically delete old completed jobs after 7 days
JobQueueSchema.index(
  { completedAt: 1 },
  {
    name: 'ttl_completed_jobs',
    expireAfterSeconds: 7 * 24 * 60 * 60, // 7 days
    partialFilterExpression: { status: 'completed' },
  }
);

// Why: Static method to calculate next retry time with exponential backoff
JobQueueSchema.statics.calculateNextRetry = function (attempts: number): Date {
  // Why: Exponential backoff: 1min, 5min, 15min, 1hr, 24hr
  const backoffMinutes = [1, 5, 15, 60, 1440];
  const minutes = backoffMinutes[Math.min(attempts, backoffMinutes.length - 1)];
  return new Date(Date.now() + minutes * 60 * 1000);
};

// Why: Instance method to mark job as failed and schedule retry
JobQueueSchema.methods.markFailed = async function (error: Error): Promise<void> {
  this.attempts += 1;
  this.lastError = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
  };
  
  if (this.attempts >= this.maxAttempts) {
    // Why: Max retries exceeded, mark as permanently failed
    this.status = 'failed';
    this.completedAt = new Date();
  } else {
    // Why: Schedule retry with exponential backoff
    this.status = 'pending';
    this.nextRetryAt = (this.constructor as { calculateNextRetry(attempts: number): Date }).calculateNextRetry(this.attempts);
  }
  
  await this.save();
};

// Why: Instance method to mark job as successfully completed
JobQueueSchema.methods.markCompleted = async function (): Promise<void> {
  this.status = 'completed';
  this.completedAt = new Date();
  await this.save();
};

// Why: Instance method to mark job as started
JobQueueSchema.methods.markStarted = async function (): Promise<void> {
  this.status = 'processing';
  this.startedAt = new Date();
  await this.save();
};

// Export model
const JobQueue: Model<IJobQueue> =
  mongoose.models.JobQueue || mongoose.model<IJobQueue>('JobQueue', JobQueueSchema);

export default JobQueue;
