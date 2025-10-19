/**
 * Background Job Queue Workers
 * 
 * What: Starts all background job queue workers
 * Why: Processes async jobs (achievements, leaderboards, challenges) with retry logic
 * 
 * Usage:
 * - Development: npm run workers (set as daemon or run in separate terminal)
 * - Production: Run as systemd service, Docker container, or PM2 process
 * 
 * Workers:
 * - Achievement Worker: Processes achievement unlock checks
 * - Leaderboard Worker: Processes leaderboard recalculations
 * - Challenge Worker: (TODO Phase 7) Processes challenge progress updates
 */

import logger from '../app/lib/logger';
import { startAchievementWorker } from '../app/lib/queue/workers/achievement-worker';
import { startLeaderboardWorker } from '../app/lib/queue/workers/leaderboard-worker';
import mongoose from 'mongoose';

// Why: Environment variables for worker configuration
const ACHIEVEMENT_CONCURRENCY = parseInt(process.env.ACHIEVEMENT_WORKER_CONCURRENCY || '5', 10);
const ACHIEVEMENT_POLL_INTERVAL = parseInt(process.env.ACHIEVEMENT_WORKER_POLL_INTERVAL || '5000', 10);

const LEADERBOARD_CONCURRENCY = parseInt(process.env.LEADERBOARD_WORKER_CONCURRENCY || '3', 10);
const LEADERBOARD_POLL_INTERVAL = parseInt(process.env.LEADERBOARD_WORKER_POLL_INTERVAL || '5000', 10);

/**
 * Start All Workers
 * 
 * What: Initializes MongoDB connection and starts all worker processes
 * Why: Central entry point for background job processing
 */
async function startAllWorkers() {
  try {
    logger.info('Starting background job queue workers...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');

    // Start Achievement Worker
    logger.info(
      { concurrency: ACHIEVEMENT_CONCURRENCY, pollInterval: ACHIEVEMENT_POLL_INTERVAL },
      'Starting achievement worker...'
    );
    await startAchievementWorker(ACHIEVEMENT_CONCURRENCY, ACHIEVEMENT_POLL_INTERVAL);

    // Start Leaderboard Worker
    logger.info(
      { concurrency: LEADERBOARD_CONCURRENCY, pollInterval: LEADERBOARD_POLL_INTERVAL },
      'Starting leaderboard worker...'
    );
    await startLeaderboardWorker(LEADERBOARD_CONCURRENCY, LEADERBOARD_POLL_INTERVAL);

    logger.info('All background workers started successfully');

    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      logger.info({ signal }, 'Received shutdown signal, closing workers...');
      
      try {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected');
        process.exit(0);
      } catch (error) {
        logger.error({ error }, 'Error during shutdown');
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // Keep process alive
    await new Promise(() => {});
  } catch (error) {
    logger.error(
      {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Failed to start workers'
    );
    
    process.exit(1);
  }
}

// Start workers
startAllWorkers();
