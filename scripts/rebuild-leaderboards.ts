/**
 * Rebuild Leaderboards Script
 * 
 * What: Deletes all existing leaderboard entries and recalculates them with proper gameId
 * Why: Fix bug where leaderboards were created without gameId field
 * 
 * Usage: npx tsx scripts/rebuild-leaderboards.ts
 */

import mongoose from 'mongoose';
import { LeaderboardEntry, Game } from '../app/lib/models';
import { calculateLeaderboard } from '../app/lib/gamification/leaderboard-calculator';
import logger from '../app/lib/logger';
import dotenv from 'dotenv';
import path from 'path';

// Why: Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Main rebuild function
 * 
 * What: Cleans old entries and rebuilds all game-specific leaderboards
 * Why: Ensures all leaderboards have proper gameId for accurate querying
 */
async function rebuildLeaderboards() {
  try {
    // Why: Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    logger.info('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');

    // Why: Delete all existing leaderboard entries (clean slate)
    logger.info('Deleting all existing leaderboard entries...');
    const deleteResult = await LeaderboardEntry.deleteMany({});
    logger.info({ deletedCount: deleteResult.deletedCount }, 'Old entries deleted');

    // Why: Get all active games
    logger.info('Fetching all active games...');
    const games = await Game.find({ isActive: true });
    logger.info({ gameCount: games.length }, 'Active games found');

    if (games.length === 0) {
      logger.warn('No active games found - cannot rebuild leaderboards');
      return;
    }

    // Why: Calculate leaderboards for each game
    let totalCalculated = 0;
    let totalErrors = 0;

    for (const game of games) {
      logger.info(
        { gameId: game._id, gameName: game.name },
        'Calculating leaderboards for game'
      );

      // Why: Calculate all relevant leaderboard types for this game
      const leaderboardTypes = [
        'points_balance',
        'points_lifetime',
        'xp_total',
        'level',
        'win_streak',
        'daily_streak',
      ];

      for (const type of leaderboardTypes) {
        try {
          const count = await calculateLeaderboard({
            type: type as any,
            period: 'all_time',
            gameId: game._id.toString(),
            limit: 100,
          });

          logger.info(
            { gameId: game._id, gameName: game.name, type, count },
            'Leaderboard calculated'
          );
          totalCalculated++;
        } catch (error) {
          logger.error(
            { error, gameId: game._id, gameName: game.name, type },
            'Failed to calculate leaderboard'
          );
          totalErrors++;
        }
      }
    }

    logger.info(
      { totalCalculated, totalErrors },
      'Leaderboard rebuild complete'
    );

    // Why: Verify results
    const newEntryCount = await LeaderboardEntry.countDocuments();
    logger.info(
      { newEntryCount },
      'New leaderboard entries created'
    );

  } catch (error) {
    logger.error({ error }, 'Fatal error rebuilding leaderboards');
    throw error;
  } finally {
    // Why: Close database connection
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

// Why: Run the script
rebuildLeaderboards()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error({ error }, 'Script failed');
    process.exit(1);
  });
