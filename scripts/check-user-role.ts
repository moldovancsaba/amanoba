/**
 * Check User Role Script
 * 
 * What: Check and display user role from database
 * Why: Debug SSO admin role issues
 * 
 * Usage: npm run admin:check-role <email>
 */

import 'dotenv/config';
import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function checkUserRole(email: string) {
  try {
    logger.info('Checking user role...');
    await connectDB();

    const player = await Player.findOne({ email: email.toLowerCase() });

    if (!player) {
      logger.error({ email }, 'Player not found');
      console.error(`❌ Player not found with email: ${email}`);
      process.exit(1);
    }

    console.log('\n📊 Player Role Information:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${player.email}`);
    console.log(`Display Name: ${player.displayName}`);
    console.log(`SSO Sub: ${player.ssoSub || 'N/A'}`);
    console.log(`Auth Provider: ${player.authProvider}`);
    console.log(`Role: ${player.role}`);
    console.log(`Is Anonymous: ${player.isAnonymous}`);
    console.log(`Is Active: ${player.isActive}`);
    console.log(`Is Banned: ${player.isBanned}`);
    console.log(`Last Login: ${player.lastLoginAt || 'Never'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (player.role === 'admin') {
      console.log('✅ User has admin role in database');
      console.log('⚠️  If admin button is not showing, the issue is likely in:');
      console.log('   1. JWT callback not fetching role correctly');
      console.log('   2. Session callback not including role');
      console.log('   3. Dashboard not checking role correctly');
    } else {
      console.log('❌ User does NOT have admin role in database');
      console.log(`   Current role: ${player.role}`);
      console.log('\n💡 To set admin role, run:');
      console.log(`   npm run admin:set-sso-role ${email}`);
    }

    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error checking user role');
    console.error('Error checking user role:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args[0]) {
  checkUserRole(args[0]);
} else {
  console.error('Usage: npm run admin:check-role <email>');
  process.exit(1);
}
