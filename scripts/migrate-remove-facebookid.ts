/**
 * Migration Script: Remove facebookId Field
 * 
 * What: Removes facebookId field from all Player documents
 * Why: System is now 100% SSO-aligned, facebookId is obsolete
 * 
 * Usage: npm run migrate:remove-facebookid
 * 
 * WARNING: This is a destructive operation. Make sure you have a backup.
 */

import 'dotenv/config';
import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function removeFacebookId() {
  try {
    logger.info('Starting facebookId removal migration...');
    await connectDB();

    // Count players with facebookId
    const playersWithFacebookId = await Player.countDocuments({
      facebookId: { $exists: true, $ne: null }
    });
    
    logger.info({ count: playersWithFacebookId }, 'Players with facebookId found');

    if (playersWithFacebookId === 0) {
      logger.info('No players with facebookId found. Migration not needed.');
      process.exit(0);
    }

    // Remove facebookId field from all players
    const result = await Player.updateMany(
      { facebookId: { $exists: true } },
      { $unset: { facebookId: '' } }
    );

    logger.info(
      { 
        matched: result.matchedCount,
        modified: result.modifiedCount 
      },
      'facebookId field removed from players'
    );

    // Verify removal
    const remainingWithFacebookId = await Player.countDocuments({
      facebookId: { $exists: true, $ne: null }
    });

    if (remainingWithFacebookId === 0) {
      logger.info('✅ Migration completed successfully - all facebookId fields removed');
    } else {
      logger.warn(
        { remaining: remainingWithFacebookId },
        '⚠️  Some players still have facebookId - migration may be incomplete'
      );
    }

    // Also check for any players with authProvider: 'facebook' and update them
    const facebookAuthPlayers = await Player.countDocuments({
      authProvider: 'facebook'
    });

    if (facebookAuthPlayers > 0) {
      logger.info({ count: facebookAuthPlayers }, 'Players with authProvider: facebook found');
      
      // Update to 'sso' if they have ssoSub, otherwise 'anonymous'
      const updateResult = await Player.updateMany(
        { authProvider: 'facebook' },
        [
          {
            $set: {
              authProvider: {
                $cond: [
                  { $ifNull: ['$ssoSub', false] },
                  'sso',
                  'anonymous'
                ]
              }
            }
          }
        ]
      );

      logger.info(
        { 
          matched: updateResult.matchedCount,
          modified: updateResult.modifiedCount 
        },
        'Updated authProvider from facebook to sso/anonymous'
      );
    }

    logger.info('Migration completed');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during facebookId removal migration');
    console.error('Error removing facebookId:', error);
    process.exit(1);
  }
}

removeFacebookId();
