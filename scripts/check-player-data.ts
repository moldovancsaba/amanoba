/**
 * Check Player Data Script
 * 
 * What: Verifies player data exists in the database
 * Why: Debug why leaderboards are empty
 * 
 * Usage: npx tsx scripts/check-player-data.ts
 */

import mongoose from 'mongoose';
import { Player, PlayerProgression, PointsWallet, PlayerSession } from '../app/lib/models';
import logger from '../app/lib/logger';
import dotenv from 'dotenv';
import path from 'path';

// Why: Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkPlayerData() {
  try {
    // Why: Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    logger.info('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');

    // Why: Count players
    const playerCount = await Player.countDocuments();
    logger.info({ playerCount }, 'Total players');

    if (playerCount > 0) {
      // Why: Get sample player data
      const samplePlayer = await Player.findOne().lean();
      logger.info({ samplePlayer }, 'Sample player');

      // Why: Check progression for this player
      const progression = await PlayerProgression.findOne({ playerId: samplePlayer?._id }).lean();
      logger.info({ progression }, 'Sample progression');

      // Why: Check wallet for this player
      const wallet = await PointsWallet.findOne({ playerId: samplePlayer?._id }).lean();
      logger.info({ wallet }, 'Sample wallet');

      // Why: Count completed sessions
      const completedSessionsCount = await PlayerSession.countDocuments({ status: 'completed' });
      logger.info({ completedSessionsCount }, 'Completed sessions');

      // Why: Check if player is active and not banned
      const activePlayersCount = await Player.countDocuments({ isActive: true, isBanned: false });
      logger.info({ activePlayersCount }, 'Active, non-banned players');
    }

  } catch (error) {
    logger.error({ error }, 'Error checking player data');
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

checkPlayerData()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error({ error }, 'Script failed');
    process.exit(1);
  });
