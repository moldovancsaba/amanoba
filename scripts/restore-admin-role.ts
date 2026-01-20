/**
 * Restore Admin Role Script
 * 
 * Restores admin role for a user by email or SSO sub
 * Usage: npm run admin:restore-role <email> or npm run admin:restore-role --sso <ssoSub>
 */

import 'dotenv/config';
import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function restoreAdminRole(email?: string, ssoSub?: string) {
  try {
    logger.info('Starting admin role restoration...');
    await connectDB();

    if (!email && !ssoSub) {
      logger.error('Either email or ssoSub must be provided');
      console.error('Usage: npm run admin:restore-role <email>');
      console.error('   or: npm run admin:restore-role --sso <ssoSub>');
      process.exit(1);
    }

    const query: any = {};
    if (email) {
      query.email = email;
    }
    if (ssoSub) {
      query.ssoSub = ssoSub;
    }

    const player = await Player.findOne(query);

    if (!player) {
      logger.error({ email, ssoSub }, 'Player not found');
      console.error('Player not found with the provided email or SSO sub');
      process.exit(1);
    }

    const oldRole = player.role;
    player.role = 'admin';
    await player.save();

    logger.info({ 
      playerId: player._id, 
      email: player.email,
      ssoSub: player.ssoSub,
      oldRole, 
      newRole: 'admin' 
    }, 'Admin role restored');

    console.log(`✅ Admin role restored for:`);
    console.log(`   Email: ${player.email}`);
    console.log(`   SSO Sub: ${player.ssoSub || 'N/A'}`);
    console.log(`   Display Name: ${player.displayName}`);
    console.log(`   Old Role: ${oldRole || 'none'}`);
    console.log(`   New Role: admin`);
    console.log(`\n⚠️  User must sign out and sign back in for changes to take effect.`);

    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error restoring admin role');
    console.error('Error restoring admin role:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args[0] === '--sso' && args[1]) {
  restoreAdminRole(undefined, args[1]);
} else if (args[0]) {
  restoreAdminRole(args[0]);
} else {
  console.error('Usage: npm run admin:restore-role <email>');
  console.error('   or: npm run admin:restore-role --sso <ssoSub>');
  process.exit(1);
}
