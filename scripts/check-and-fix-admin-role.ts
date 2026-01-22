/**
 * Check and Fix Admin Role Script
 * 
 * What: Comprehensive check of user's role from all sources and fix if needed
 * Why: Diagnose and fix admin access issues
 * 
 * Usage: npx tsx scripts/check-and-fix-admin-role.ts <playerId|email|ssoSub>
 */

import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function checkAndFixAdminRole(identifier: string) {
  try {
    await connectDB();
    logger.info({ identifier }, 'Check and fix admin role - starting');

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

    console.log(`\n📋 Player found:`);
    console.log(`   ID: ${player._id}`);
    console.log(`   Display Name: ${player.displayName}`);
    console.log(`   Email: ${player.email || 'N/A'}`);
    console.log(`   SSO Sub: ${player.ssoSub || 'N/A'}`);
    console.log(`   Current Role: ${player.role || 'NOT SET'}`);
    console.log(`   Auth Provider: ${player.authProvider || 'N/A'}`);
    console.log(`   Last Login: ${player.lastLoginAt || 'N/A'}`);
    
    if (!player.ssoSub) {
      console.log(`\n⚠️  WARNING: Player has no ssoSub - not an SSO user`);
      console.log(`   This player cannot use SSO-based admin access.`);
      process.exit(1);
    }

    if (player.role === 'admin') {
      console.log(`\n✅ Player already has admin role in database`);
      console.log(`\n📝 Next steps:`);
      console.log(`   1. Log out completely from amanoba.com`);
      console.log(`   2. Log back in via SSO`);
      console.log(`   3. The role should sync to your session`);
      console.log(`   4. Check /api/debug/role-check to verify`);
      process.exit(0);
    }

    // Ask for confirmation
    console.log(`\n❓ Do you want to set this player's role to 'admin'?`);
    console.log(`   This will update the database role to 'admin'.`);
    console.log(`   After this, you MUST log out and log back in via SSO for the change to take effect.`);
    
    // For script usage, we'll set it (can be made interactive later)
    const shouldSet = process.argv[3] === '--yes' || process.argv[3] === '-y';
    
    if (!shouldSet) {
      console.log(`\n💡 To proceed, run:`);
      console.log(`   npx tsx scripts/check-and-fix-admin-role.ts ${identifier} --yes`);
      process.exit(0);
    }

    // Update role to admin
    const previousRole = player.role;
    player.role = 'admin';
    await player.save();

    console.log(`\n✅ Role updated:`);
    console.log(`   Previous: ${previousRole || 'NOT SET'}`);
    console.log(`   New: ${player.role}`);
    console.log(`\n⚠️  IMPORTANT: You MUST now:`);
    console.log(`   1. Log out completely from amanoba.com`);
    console.log(`   2. Log back in via SSO`);
    console.log(`   3. The role will sync from database to your session`);
    console.log(`   4. Check /api/debug/role-check to verify session role`);
    console.log(`\n⚠️  NOTE: This is a manual override.`);
    console.log(`   The role will be synced from SSO on next login.`);
    console.log(`   If SSO role extraction is working, this change may be overwritten.`);
    
    logger.info(
      {
        playerId: player._id,
        previousRole,
        newRole: player.role,
        manualOverride: true,
      },
      'Admin role set manually - user must log out and back in'
    );

    process.exit(0);
  } catch (error) {
    logger.error({ error, identifier }, 'Check and fix admin role failed');
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get identifier from command line args
const identifier = process.argv[2];

if (!identifier) {
  console.error('❌ Player identifier required');
  console.error('\nUsage: npx tsx scripts/check-and-fix-admin-role.ts <playerId|email|ssoSub> [--yes]');
  console.error('\nExample:');
  console.error('  npx tsx scripts/check-and-fix-admin-role.ts moldovancsaba@gmail.com');
  console.error('  npx tsx scripts/check-and-fix-admin-role.ts moldovancsaba@gmail.com --yes');
  process.exit(1);
}

checkAndFixAdminRole(identifier);
