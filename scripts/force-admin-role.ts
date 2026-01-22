/**
 * Force Admin Role Script
 * 
 * What: Manually set a player's role to 'admin' in the database
 * Why: Emergency fix if SSO role sync is not working
 * 
 * Usage: npx tsx scripts/force-admin-role.ts <playerId|email|ssoSub>
 * 
 * WARNING: This is a manual override. Use with care.
 * Roles are managed locally in MongoDB (SSO is login-only).
 */

import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function forceAdminRole(identifier: string) {
  try {
    await connectDB();
    logger.info({ identifier }, 'Force admin role - starting');

    // Find player by ID, email, or ssoSub
    let player = await Player.findById(identifier);
    
    if (!player) {
      player = await Player.findOne({ email: identifier });
    }
    
    if (!player) {
      player = await Player.findOne({ ssoSub: identifier });
    }

    if (!player) {
      logger.error({ identifier }, 'Player not found');
      console.error(`❌ Player not found: ${identifier}`);
      console.error('   Try: playerId, email, or ssoSub');
      process.exit(1);
    }

    const previousRole = player.role;
    
    console.log(`\n📋 Player found:`);
    console.log(`   ID: ${player._id}`);
    console.log(`   Display Name: ${player.displayName}`);
    console.log(`   Email: ${player.email || 'N/A'}`);
    console.log(`   SSO Sub: ${player.ssoSub || 'N/A'}`);
    console.log(`   Current Role: ${previousRole}`);
    console.log(`   Auth Provider: ${player.authProvider || 'N/A'}`);
    
    if (previousRole === 'admin') {
      console.log(`\n✅ Player already has admin role`);
      process.exit(0);
    }

    // Update role to admin
    player.role = 'admin';
    await player.save();

    console.log(`\n✅ Role updated:`);
    console.log(`   Previous: ${previousRole}`);
    console.log(`   New: ${player.role}`);
    console.log(`\n⚠️  WARNING: This is a manual override.`);
    console.log(`   Roles are managed locally in MongoDB.`);
    
    logger.info(
      {
        playerId: player._id,
        previousRole,
        newRole: player.role,
        manualOverride: true,
      },
      'Force admin role - completed'
    );

    process.exit(0);
  } catch (error) {
    logger.error({ error, identifier }, 'Force admin role failed');
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get identifier from command line args
const identifier = process.argv[2];

if (!identifier) {
  console.error('❌ Player identifier required');
  console.error('\nUsage: npx tsx scripts/force-admin-role.ts <playerId|email|ssoSub>');
  console.error('\nExample:');
  console.error('  npx tsx scripts/force-admin-role.ts 68ee3bd02b16d01cdcdfb2cf');
  console.error('  npx tsx scripts/force-admin-role.ts moldovancsaba@gmail.com');
  process.exit(1);
}

forceAdminRole(identifier);
