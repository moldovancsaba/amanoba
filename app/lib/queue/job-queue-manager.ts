/**
 * Job Queue Manager
 * 
 * Purpose: Central interface for enqueueing and processing background jobs
 * Why: Provides clean API for Phase 2 operations to queue failed updates for retry
 * 
 * Features:
 * - Enqueue jobs with automatic retry scheduling
 * - Fetch pending jobs ready for processing
 * - Dead letter queue monitoring
 * - Queue health metrics
 * 
 * Part of two-phase commit architecture (Phase 4)
 */

import mongoose from 'mongoose';
import JobQueue, { type IJobQueue, type JobType } from '../models/job-queue';
import { logger } from '../logger';

// Why: Interface for job creation
export interface CreateJobInput {
  jobType: JobType;
  playerId: mongoose.Types.ObjectId | string;
  sessionId?: mongoose.Types.ObjectId | string;
  brandId?: mongoose.Types.ObjectId | string;
  gameId?: mongoose.Types.ObjectId | string;
  payload: Record<string, unknown>;
  maxAttempts?: number;
}

// Why: Interface for queue health metrics
export interface QueueHealth {
  timestamp: string;
  byType: {
    achievement: { pending: number; processing: number; failed: number };
    leaderboard: { pending: number; processing: number; failed: number };
    challenge: { pending: number; processing: number; failed: number };
  };
  totals: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  oldestPendingJob?: {
    jobType: JobType;
    createdAt: Date;
    ageMinutes: number;
  };
}

/**
 * Enqueue a new background job
 * 
 * What: Creates a job in the queue with initial retry schedule
 * Why: Allows Phase 2 operations to offload work for later retry
 */
export async function enqueueJob(input: CreateJobInput): Promise<IJobQueue> {
  try {
    // Why: Convert string IDs to ObjectIds if needed
    const job = new JobQueue({
      jobType: input.jobType,
      playerId: typeof input.playerId === 'string' ? new mongoose.Types.ObjectId(input.playerId) : input.playerId,
      sessionId: input.sessionId ? (typeof input.sessionId === 'string' ? new mongoose.Types.ObjectId(input.sessionId) : input.sessionId) : undefined,
      brandId: input.brandId ? (typeof input.brandId === 'string' ? new mongoose.Types.ObjectId(input.brandId) : input.brandId) : undefined,
      gameId: input.gameId ? (typeof input.gameId === 'string' ? new mongoose.Types.ObjectId(input.gameId) : input.gameId) : undefined,
      payload: input.payload,
      status: 'pending',
      attempts: 0,
      maxAttempts: input.maxAttempts || 5,
      nextRetryAt: new Date(), // Why: Process immediately on first attempt
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await job.save();

    logger.info(
      {
        jobId: job._id,
        jobType: job.jobType,
        playerId: job.playerId,
        sessionId: job.sessionId,
      },
      'Job enqueued successfully'
    );

    return job;
  } catch (error) {
    logger.error(
      {
        err: error,
        jobType: input.jobType,
        playerId: input.playerId,
      },
      'Failed to enqueue job'
    );
    throw error;
  }
}

/**
 * Fetch jobs ready for processing
 * 
 * What: Finds pending jobs where nextRetryAt <= now
 * Why: Worker processes use this to get jobs to execute
 * 
 * @param jobType - Optional: filter by specific job type
 * @param limit - Maximum number of jobs to fetch
 */
export async function fetchPendingJobs(
  jobType?: JobType,
  limit: number = 10
): Promise<IJobQueue[]> {
  try {
    const query: Record<string, unknown> = {
      status: 'pending',
      nextRetryAt: { $lte: new Date() },
    };

    if (jobType) {
      query.jobType = jobType;
    }

    // Why: Fetch oldest jobs first (FIFO)
    const jobs = await JobQueue.find(query)
      .sort({ nextRetryAt: 1 })
      .limit(limit)
      .lean();

    return jobs as unknown as IJobQueue[];
  } catch (error) {
    logger.error(
      {
        err: error,
        jobType,
        limit,
      },
      'Failed to fetch pending jobs'
    );
    throw error;
  }
}

/**
 * Get queue health metrics
 * 
 * What: Aggregates job counts by type and status
 * Why: Monitoring dashboard to detect queue backup or high failure rate
 */
export async function getQueueHealth(): Promise<QueueHealth> {
  try {
    const now = new Date();

    // Why: Aggregate counts by job type and status
    const aggregation = await JobQueue.aggregate([
      {
        $group: {
          _id: { jobType: '$jobType', status: '$status' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Why: Initialize health object with all job types
    const health: QueueHealth = {
      timestamp: now.toISOString(),
      byType: {
        achievement: { pending: 0, processing: 0, failed: 0 },
        leaderboard: { pending: 0, processing: 0, failed: 0 },
        challenge: { pending: 0, processing: 0, failed: 0 },
      },
      totals: {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
      },
    };

    // Why: Populate counts from aggregation
    for (const item of aggregation) {
      const { jobType, status } = item._id;
      const count = item.count;

      if (status !== 'completed' && jobType in health.byType) {
        (health.byType[jobType as JobType] as Record<string, number>)[status] = count;
      }

      health.totals[status as keyof typeof health.totals] = 
        (health.totals[status as keyof typeof health.totals] || 0) + count;
    }

    // Why: Find oldest pending job to detect stale queue
    const oldestPending = await JobQueue.findOne({
      status: 'pending',
      nextRetryAt: { $lte: now },
    })
      .sort({ createdAt: 1 })
      .lean();

    if (oldestPending) {
      const ageMinutes = Math.floor(
        (now.getTime() - new Date(oldestPending.createdAt).getTime()) / 60000
      );

      health.oldestPendingJob = {
        jobType: oldestPending.jobType,
        createdAt: new Date(oldestPending.createdAt),
        ageMinutes,
      };
    }

    return health;
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      'Failed to get queue health'
    );
    throw error;
  }
}

/**
 * Cleanup old completed jobs
 * 
 * What: Deletes completed jobs older than specified days
 * Why: Prevent unbounded queue growth (TTL index also handles this)
 * 
 * @param daysOld - Delete completed jobs older than this many days
 */
export async function cleanupCompletedJobs(daysOld: number = 7): Promise<number> {
  try {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    const result = await JobQueue.deleteMany({
      status: 'completed',
      completedAt: { $lt: cutoffDate },
    });

    logger.info(
      {
        deletedCount: result.deletedCount,
        daysOld,
      },
      'Cleanup completed jobs'
    );

    return result.deletedCount || 0;
  } catch (error) {
    logger.error(
      {
        err: error,
        daysOld,
      },
      'Failed to cleanup completed jobs'
    );
    throw error;
  }
}

/**
 * Get failed jobs (dead letter queue)
 * 
 * What: Fetches jobs that exceeded max retry attempts
 * Why: Manual intervention and debugging of persistent failures
 * 
 * @param limit - Maximum number of failed jobs to fetch
 */
export async function getFailedJobs(limit: number = 100): Promise<IJobQueue[]> {
  try {
    const jobs = await JobQueue.find({
      status: 'failed',
    })
      .sort({ completedAt: -1 })
      .limit(limit)
      .lean();

    return jobs as unknown as IJobQueue[];
  } catch (error) {
    logger.error(
      {
        err: error,
        limit,
      },
      'Failed to fetch failed jobs'
    );
    throw error;
  }
}

/**
 * Retry a failed job
 * 
 * What: Resets a failed job back to pending with fresh retry schedule
 * Why: Manual recovery for jobs that failed due to temporary infrastructure issues
 * 
 * @param jobId - ID of the job to retry
 */
export async function retryFailedJob(jobId: string | mongoose.Types.ObjectId): Promise<IJobQueue | null> {
  try {
    const job = await JobQueue.findById(jobId);

    if (!job) {
      logger.warn({ jobId }, 'Job not found for retry');
      return null;
    }

    if (job.status !== 'failed') {
      logger.warn({ jobId, currentStatus: job.status }, 'Job is not in failed status');
      return null;
    }

    // Why: Reset to pending with immediate retry
    job.status = 'pending';
    job.attempts = 0; // Why: Reset attempts counter for fresh retry
    job.nextRetryAt = new Date();
    job.lastError = undefined;
    job.completedAt = undefined;

    await job.save();

    logger.info(
      {
        jobId: job._id,
        jobType: job.jobType,
      },
      'Failed job reset for retry'
    );

    return job;
  } catch (error) {
    logger.error(
      {
        err: error,
        jobId,
      },
      'Failed to retry job'
    );
    throw error;
  }
}

// Export all functions
export const JobQueueManager = {
  enqueueJob,
  fetchPendingJobs,
  getQueueHealth,
  cleanupCompletedJobs,
  getFailedJobs,
  retryFailedJob,
};

export default JobQueueManager;
