/**
 * Achievement Worker
 * 
 * Purpose: Process queued achievement checking jobs with retry on failure
 * Why: Decouple achievement unlocking from critical session completion path
 * 
 * Features:
 * - Process achievement check jobs from queue
 * - Automatic retry with exponential backoff
 * - Update PlayerSession with unlocked achievements
 * 
 * Part of two-phase commit architecture (Phase 4)
 */

import mongoose from 'mongoose';
import JobQueue, { type IJobQueue } from '../../models/job-queue';
import PlayerSession from '../../models/player-session';
import PlayerProgression from '../../models/player-progression';
import { checkAndUnlockAchievements, type AchievementCheckContext } from '../../gamification/achievement-engine';
import logger from '../../logger';

// Why: Interface for achievement job payload
export interface AchievementJobPayload {
  playerId: string;
  gameId: string;
  progression: {
    level: number;
    currentXP: number;
    totalXP: number;
    statistics: {
      totalGamesPlayed: number;
      wins: number;
      losses: number;
      draws: number;
      currentStreak: number;
      bestStreak: number;
    };
  };
  recentSession: {
    score: number;
    maxScore: number;
    accuracy?: number;
    duration: number;
    outcome: 'win' | 'loss' | 'draw';
  };
}

/**
 * Process a single achievement checking job
 * 
 * What: Checks and unlocks achievements for a player
 * Why: Retry failed achievement checks without blocking session completion
 * 
 * @param job - The job to process
 * @returns Success boolean
 */
export async function processAchievementJob(job: IJobQueue): Promise<boolean> {
  const startTime = Date.now();
  
  try {
    logger.info(
      {
        jobId: job._id,
        playerId: job.playerId,
        sessionId: job.sessionId,
        attempts: job.attempts,
      },
      'Processing achievement job'
    );

    // Why: Mark job as processing
    await JobQueue.findByIdAndUpdate(job._id, {
      status: 'processing',
      startedAt: new Date(),
    });

    const payload = job.payload as unknown as AchievementJobPayload;

    // Why: Fetch current progression to get latest stats
    const progression = await PlayerProgression.findOne({ playerId: job.playerId });
    if (!progression) {
      throw new Error('PlayerProgression not found');
    }

    // Why: Build achievement check context
    const achievementContext: AchievementCheckContext = {
      playerId: job.playerId,
      gameId: new mongoose.Types.ObjectId(payload.gameId),
      progression,
      recentSession: payload.recentSession,
    };

    // Why: Check and unlock achievements
    const newAchievements = await checkAndUnlockAchievements(achievementContext);

    // Why: Update PlayerSession with unlocked achievements
    if (newAchievements.length > 0 && job.sessionId) {
      await PlayerSession.updateOne(
        { _id: job.sessionId },
        {
          $push: {
            'rewards.achievementsUnlocked': {
              $each: newAchievements.map(a => a.achievement._id),
            },
          },
        }
      );

      logger.info(
        {
          jobId: job._id,
          playerId: job.playerId,
          sessionId: job.sessionId,
          achievementsUnlocked: newAchievements.length,
          achievements: newAchievements.map(a => a.achievement.code),
        },
        'Achievements unlocked by worker'
      );
    }

    // Why: Mark job as completed
    await JobQueue.findByIdAndUpdate(job._id, {
      status: 'completed',
      completedAt: new Date(),
    });

    const durationMs = Date.now() - startTime;

    logger.info(
      {
        jobId: job._id,
        playerId: job.playerId,
        achievementsUnlocked: newAchievements.length,
        durationMs,
      },
      'Achievement job completed successfully'
    );

    return true;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const err = error as Error;

    logger.error(
      {
        err: error,
        jobId: job._id,
        playerId: job.playerId,
        sessionId: job.sessionId,
        attempts: job.attempts,
        durationMs,
      },
      'Achievement job failed'
    );

    // Why: Mark job as failed and schedule retry
    const jobDoc = await JobQueue.findById(job._id);
    if (jobDoc) {
      await jobDoc.markFailed(err);
    }

    return false;
  }
}

/**
 * Process batch of achievement jobs
 * 
 * What: Fetches and processes multiple achievement jobs
 * Why: Efficient batch processing for worker processes
 * 
 * @param batchSize - Number of jobs to process in this batch
 * @returns Count of successfully processed jobs
 */
export async function processAchievementBatch(batchSize: number = 10): Promise<number> {
  try {
    const jobs = await JobQueue.find({
      jobType: 'achievement',
      status: 'pending',
      nextRetryAt: { $lte: new Date() },
    })
      .sort({ nextRetryAt: 1 })
      .limit(batchSize);

    if (jobs.length === 0) {
      return 0;
    }

    logger.info(
      {
        jobCount: jobs.length,
        batchSize,
      },
      'Processing achievement job batch'
    );

    let successCount = 0;

    // Why: Process jobs sequentially to avoid overwhelming database
    for (const job of jobs) {
      const success = await processAchievementJob(job);
      if (success) {
        successCount++;
      }
    }

    logger.info(
      {
        total: jobs.length,
        successful: successCount,
        failed: jobs.length - successCount,
      },
      'Achievement batch processing complete'
    );

    return successCount;
  } catch (error) {
    logger.error(
      {
        err: error,
        batchSize,
      },
      'Failed to process achievement batch'
    );
    return 0;
  }
}

/**
 * Start Achievement Worker
 * 
 * What: Continuously processes achievement jobs from the queue
 * Why: Ensures achievement unlocks are eventually consistent
 * 
 * Usage: Call this in a background process or cron job
 * 
 * @param concurrency - Number of jobs to process in parallel (default: 5)
 * @param pollInterval - Time between queue polls in ms (default: 5000)
 */
export async function startAchievementWorker(
  concurrency: number = 5,
  pollInterval: number = 5000
): Promise<void> {
  logger.info(
    { concurrency, pollInterval },
    'Starting achievement worker'
  );

  const processJobs = async () => {
    try {
      const jobs = await JobQueue.find({
        jobType: 'achievement',
        status: 'pending',
        nextRetryAt: { $lte: new Date() },
      })
        .sort({ nextRetryAt: 1 })
        .limit(concurrency);

      if (jobs.length === 0) {
        return;
      }

      logger.info({ count: jobs.length }, 'Fetched achievement jobs');

      // Process jobs in parallel
      await Promise.all(
        jobs.map(async (job) => {
          await processAchievementJob(job);
        })
      );
    } catch (error) {
      logger.error({ error }, 'Error in achievement worker loop');
    }
  };

  // Run initial batch
  await processJobs();

  // Set up polling interval
  setInterval(processJobs, pollInterval);

  logger.info('Achievement worker started successfully');
}

export default {
  processAchievementJob,
  processAchievementBatch,
  startAchievementWorker,
};
