/**
 * Sync SSO Roles Script
 * 
 * What: Manually sync roles from SSO UserInfo endpoint for existing players
 * Why: Fix admin access for users who logged in before UserInfo endpoint was implemented
 * 
 * Usage: npx tsx scripts/sync-sso-roles.ts [playerId]
 * 
 * If playerId is provided, syncs only that player.
 * If no playerId, syncs all SSO users.
 */

import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { fetchUserInfo } from '../app/lib/auth/sso-userinfo';
import { logger } from '../app/lib/logger';
import mongoose from 'mongoose';

async function syncSSORoles(playerId?: string) {
  try {
    await connectDB();
    logger.info({ playerId: playerId || 'all' }, 'Starting SSO role sync');

    // Check if UserInfo URL is configured
    if (!process.env.SSO_USERINFO_URL) {
      logger.error({}, 'SSO_USERINFO_URL not configured. Cannot sync roles.');
      console.error('❌ SSO_USERINFO_URL environment variable is not set.');
      console.error('   Please set SSO_USERINFO_URL in your environment variables.');
      process.exit(1);
    }

    let players;
    if (playerId) {
      // Sync specific player
      const player = await Player.findById(playerId);
      if (!player) {
        logger.error({ playerId }, 'Player not found');
        console.error(`❌ Player ${playerId} not found`);
        process.exit(1);
      }
      if (!player.ssoSub) {
        logger.error({ playerId }, 'Player is not an SSO user');
        console.error(`❌ Player ${playerId} is not an SSO user (no ssoSub)`);
        process.exit(1);
      }
      players = [player];
    } else {
      // Sync all SSO users
      players = await Player.find({ 
        authProvider: 'sso',
        ssoSub: { $exists: true, $ne: null }
      });
      logger.info({ count: players.length }, 'Found SSO users to sync');
    }

    if (players.length === 0) {
      console.log('ℹ️  No SSO users found to sync');
      process.exit(0);
    }

    console.log(`\n🔄 Syncing roles for ${players.length} SSO user(s)...\n`);

    let synced = 0;
    let failed = 0;
    let skipped = 0;

    for (const player of players) {
      try {
        // Note: This script requires manual access token or we need to implement
        // a way to get fresh tokens. For now, we'll update based on what's in DB
        // and log what needs to be done.
        
        console.log(`\n📋 Player: ${player.displayName} (${player.email || 'no email'})`);
        console.log(`   Current role: ${player.role}`);
        console.log(`   SSO Sub: ${player.ssoSub}`);
        
        // Since we don't have access tokens, we can't fetch UserInfo directly
        // This script is a placeholder - in production, you'd need to:
        // 1. Get a fresh access token for the user
        // 2. Call fetchUserInfo with that token
        // 3. Update player.role with the result
        
        console.log(`   ⚠️  Manual sync requires access token. User must log in via SSO to sync role.`);
        console.log(`   💡 Solution: User should log out and log back in via SSO.`);
        
        skipped++;
      } catch (error) {
        logger.error({ playerId: player._id, error }, 'Failed to sync player role');
        console.error(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
        failed++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Synced: ${synced}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    
    if (synced > 0) {
      console.log(`\n✅ Role sync completed successfully`);
    } else {
      console.log(`\n⚠️  No roles were synced. Users need to log in via SSO to sync their roles.`);
    }

    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'SSO role sync failed');
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Get playerId from command line args
const playerId = process.argv[2];

syncSSORoles(playerId);
