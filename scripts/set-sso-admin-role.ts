/**
 * Set SSO Admin Role Script
 * 
 * What: Sets admin role for SSO users by email or ssoSub
 * Why: Allow setting admin role for SSO users who need admin access
 * 
 * Usage: 
 *   tsx scripts/set-sso-admin-role.ts <email>
 *   tsx scripts/set-sso-admin-role.ts --ssoSub <ssoSub>
 * 
 * Example: 
 *   tsx scripts/set-sso-admin-role.ts moldovancsaba@gmail.com
 *   tsx scripts/set-sso-admin-role.ts --ssoSub abc123-def456
 */

import 'dotenv/config';
import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function setSSOAdminRole(email?: string, ssoSub?: string) {
  try {
    if (!email && !ssoSub) {
      console.error('❌ Please provide either email or ssoSub');
      console.log('Usage: tsx scripts/set-sso-admin-role.ts <email>');
      console.log('   or: tsx scripts/set-sso-admin-role.ts --ssoSub <ssoSub>');
      process.exit(1);
    }

    logger.info({ email, ssoSub }, 'Setting admin role for SSO user...');
    
    await connectDB();
    
    // Find player by email or ssoSub
    const query = email ? { email } : { ssoSub };
    const player = await Player.findOne(query);
    
    if (!player) {
      logger.error({ email, ssoSub }, 'Player not found');
      console.error(`❌ Player not found with ${email ? `email: ${email}` : `ssoSub: ${ssoSub}`}`);
      process.exit(1);
    }
    
    // Check if player is SSO user
    if (player.authProvider !== 'sso') {
      console.warn(`⚠️  Warning: Player auth provider is '${player.authProvider}', not 'sso'`);
      console.log('   This script is intended for SSO users, but will proceed anyway.');
    }
    
    // Show current role
    console.log(`\n📋 Current player info:`);
    console.log(`   Name: ${player.displayName}`);
    console.log(`   Email: ${player.email || 'N/A'}`);
    console.log(`   SSO Sub: ${player.ssoSub || 'N/A'}`);
    console.log(`   Auth Provider: ${player.authProvider}`);
    console.log(`   Current Role: ${player.role}`);
    
    // Update role to admin
    const oldRole = player.role;
    player.role = 'admin';
    await player.save();
    
    logger.info(
      {
        playerId: player._id,
        email: player.email,
        ssoSub: player.ssoSub,
        displayName: player.displayName,
        oldRole,
        newRole: player.role,
      },
      'SSO admin role set successfully'
    );
    
    console.log('\n✅ Admin role set successfully!');
    console.log(`   Role changed: ${oldRole} → ${player.role}`);
    console.log(`   Player ID: ${player._id}`);
    console.log('\n⚠️  Note: User needs to sign out and sign back in for role to take effect in session.');
    
    process.exit(0);
  } catch (error) {
    logger.error({ error, email, ssoSub }, 'Failed to set SSO admin role');
    console.error('❌ Failed to set admin role:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Please provide either email or ssoSub');
  console.log('Usage: tsx scripts/set-sso-admin-role.ts <email>');
  console.log('   or: tsx scripts/set-sso-admin-role.ts --ssoSub <ssoSub>');
  console.log('Example: tsx scripts/set-sso-admin-role.ts moldovancsaba@gmail.com');
  process.exit(1);
}

if (args[0] === '--ssoSub' && args[1]) {
  setSSOAdminRole(undefined, args[1]);
} else if (args[0] && !args[0].startsWith('--')) {
  setSSOAdminRole(args[0]);
} else {
  console.error('❌ Invalid arguments');
  console.log('Usage: tsx scripts/set-sso-admin-role.ts <email>');
  console.log('   or: tsx scripts/set-sso-admin-role.ts --ssoSub <ssoSub>');
  process.exit(1);
}
