/**
 * Migration Script: Add role and authProvider to existing players
 * 
 * What: Updates all existing Player documents to include role and authProvider fields
 * Why: Prepare database for SSO implementation with RBAC
 * 
 * Usage: tsx scripts/migrate-player-roles.ts
 */

import 'dotenv/config';
import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function migratePlayerRoles() {
  try {
    logger.info('Starting player roles migration...');
    
    await connectDB();
    
    // Update all players without role field
    const result = await Player.updateMany(
      {
        $or: [
          { role: { $exists: false } },
          { authProvider: { $exists: false } },
        ],
      },
      {
        $set: {
          role: 'user', // Default all existing players to 'user' role
          authProvider: 'facebook', // Default existing players to Facebook auth
        },
      }
    );
    
    logger.info(
      {
        matched: result.matchedCount,
        modified: result.modifiedCount,
      },
      'Player roles migration completed'
    );
    
    // Verify migration
    const playersWithoutRole = await Player.countDocuments({
      role: { $exists: false },
    });
    
    const playersWithoutAuthProvider = await Player.countDocuments({
      authProvider: { $exists: false },
    });
    
    if (playersWithoutRole > 0 || playersWithoutAuthProvider > 0) {
      logger.warn(
        {
          playersWithoutRole,
          playersWithoutAuthProvider,
        },
        'Some players still missing role or authProvider'
      );
    } else {
      logger.info('All players have role and authProvider fields');
    }
    
    // Show statistics
    const stats = await Player.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);
    
    logger.info({ roleDistribution: stats }, 'Role distribution after migration');
    
    const authProviderStats = await Player.aggregate([
      {
        $group: {
          _id: '$authProvider',
          count: { $sum: 1 },
        },
      },
    ]);
    
    logger.info(
      { authProviderDistribution: authProviderStats },
      'Auth provider distribution after migration'
    );
    
    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Migration failed');
    process.exit(1);
  }
}

// Run migration
migratePlayerRoles();
