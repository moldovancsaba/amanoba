/**
 * Leaderboard Worker
 * 
 * What: Processes leaderboard recalculation jobs from the queue
 * Why: Ensures leaderboard updates don't fail silently and are retried on error
 * 
 * Features:
 * - Async processing of leaderboard updates
 * - Automatic retry with exponential backoff
 * - Detailed logging for observability
 * - Multiple leaderboard type support
 */

import logger from '@/lib/logger';
import { JobQueueManager } from '../job-queue-manager';
import { calculateLeaderboard, calculateAllLeaderboards, LeaderboardType, LeaderboardPeriod } from '@/lib/gamification/leaderboard-calculator';

/**
 * Leaderboard Job Payload
 * 
 * Why: Defines the structure of leaderboard calculation jobs
 */
export interface LeaderboardJobPayload {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  brandId?: string;
  gameId?: string;
  limit?: number;
  calculateAll?: boolean; // If true, calculate all leaderboards
}

/**
 * Process Leaderboard Job
 * 
 * What: Executes a single leaderboard calculation job
 * Why: Updates leaderboard rankings with retry capability
 * 
 * @param jobId - Job ID for tracking
 * @param payload - Leaderboard calculation parameters
 */
export async function processLeaderboardJob(
  jobId: string,
  payload: LeaderboardJobPayload
): Promise<void> {
  const startTime = Date.now();

  try {
    logger.info(
      { jobId, payload },
      'Processing leaderboard job'
    );

    if (payload.calculateAll) {
      // Calculate all leaderboards for a brand
      const result = await calculateAllLeaderboards(payload.brandId);
      
      if (!result.success) {
        throw new Error(`Failed to calculate all leaderboards. Calculated: ${result.calculated}, Errors: ${result.errors}`);
      }

      logger.info(
        {
          jobId,
          brandId: payload.brandId,
          calculated: result.calculated,
          duration: Date.now() - startTime,
        },
        'All leaderboards calculated successfully'
      );
    } else {
      // Calculate specific leaderboard
      const entriesUpdated = await calculateLeaderboard({
        type: payload.type,
        period: payload.period,
        brandId: payload.brandId,
        gameId: payload.gameId,
        limit: payload.limit,
      });

      logger.info(
        {
          jobId,
          type: payload.type,
          period: payload.period,
          brandId: payload.brandId,
          gameId: payload.gameId,
          entriesUpdated,
          duration: Date.now() - startTime,
        },
        'Leaderboard calculated successfully'
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error(
      {
        error,
        jobId,
        payload,
        duration,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Error processing leaderboard job'
    );

    // Re-throw to trigger retry mechanism
    throw error;
  }
}

/**
 * Start Leaderboard Worker
 * 
 * What: Continuously processes leaderboard jobs from the queue
 * Why: Ensures leaderboard updates are eventually consistent
 * 
 * Usage: Call this in a background process or cron job
 * 
 * @param concurrency - Number of jobs to process in parallel (default: 3)
 * @param pollInterval - Time between queue polls in ms (default: 5000)
 */
export async function startLeaderboardWorker(
  concurrency: number = 3,
  pollInterval: number = 5000
): Promise<void> {
  logger.info(
    { concurrency, pollInterval },
    'Starting leaderboard worker'
  );

  const processJobs = async () => {
    try {
      const jobs = await JobQueueManager.fetchJobsToProcess('leaderboard', concurrency);

      if (jobs.length === 0) {
        return;
      }

      logger.info({ count: jobs.length }, 'Fetched leaderboard jobs');

      // Process jobs in parallel
      await Promise.all(
        jobs.map(async (job) => {
          try {
            await processLeaderboardJob(job._id.toString(), job.payload as LeaderboardJobPayload);
            
            // Mark job as completed
            await JobQueueManager.completeJob(job._id.toString());
          } catch (error) {
            // Retry job
            await JobQueueManager.retryJob(job._id.toString(), error instanceof Error ? error.message : 'Unknown error');
          }
        })
      );
    } catch (error) {
      logger.error({ error }, 'Error in leaderboard worker loop');
    }
  };

  // Run initial batch
  await processJobs();

  // Set up polling interval
  setInterval(processJobs, pollInterval);

  logger.info('Leaderboard worker started successfully');
}

/**
 * Enqueue Leaderboard Update
 * 
 * What: Helper function to enqueue a leaderboard calculation job
 * Why: Provides a simple API for other parts of the system to trigger leaderboard updates
 * 
 * @param payload - Leaderboard calculation parameters
 * @param priority - Job priority (default: 3)
 * @returns Job ID
 */
export async function enqueueLeaderboardUpdate(
  payload: LeaderboardJobPayload,
  priority: number = 3
): Promise<string> {
  return JobQueueManager.enqueueJob({
    type: 'leaderboard',
    payload,
    priority,
  });
}

/**
 * Enqueue All Leaderboards Update
 * 
 * What: Helper to enqueue a job to recalculate all leaderboards
 * Why: Useful for bulk updates or scheduled recalculations
 * 
 * @param brandId - Optional brand filter
 * @param priority - Job priority (default: 2)
 * @returns Job ID
 */
export async function enqueueAllLeaderboardsUpdate(
  brandId?: string,
  priority: number = 2
): Promise<string> {
  return JobQueueManager.enqueueJob({
    type: 'leaderboard',
    payload: {
      calculateAll: true,
      brandId,
    } as LeaderboardJobPayload,
    priority,
  });
}
