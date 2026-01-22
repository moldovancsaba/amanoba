/**
 * Fix Admin Role NOW Script
 * 
 * What: Immediately sets admin role in database and provides clear instructions
 * Why: Quick fix for admin access issues
 * 
 * Usage: npx tsx scripts/fix-admin-role-now.ts <email>
 */

import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function fixAdminRoleNow(email: string) {
  try {
    await connectDB();
    logger.info({ email }, 'Fix admin role now - starting');

    // Find player by email
    const player = await Player.findOne({ email });

    if (!player) {
      console.error(`❌ Player not found with email: ${email}`);
      console.error('   Make sure you use the exact email address from your SSO account.');
      process.exit(1);
    }

    console.log(`\n📋 Player found:`);
    console.log(`   ID: ${player._id}`);
    console.log(`   Display Name: ${player.displayName}`);
    console.log(`   Email: ${player.email}`);
    console.log(`   SSO Sub: ${player.ssoSub || 'N/A'}`);
    console.log(`   Current Role: ${player.role || 'NOT SET'}`);
    console.log(`   Auth Provider: ${player.authProvider || 'N/A'}`);
    
    if (!player.ssoSub) {
      console.log(`\n⚠️  WARNING: Player has no ssoSub - not an SSO user`);
      console.log(`   This player cannot use SSO-based admin access.`);
      process.exit(1);
    }

    if (player.role === 'admin') {
      console.log(`\n✅ Player already has admin role in database`);
      console.log(`\n📝 Next steps:`);
      console.log(`   1. Go to https://www.amanoba.com/hu/dashboard`);
      console.log(`   2. Click the "🔄 Frissítés" (Refresh) button`);
      console.log(`   3. The admin button should appear`);
      console.log(`\n   If it still doesn't appear:`);
      console.log(`   - Log out completely`);
      console.log(`   - Clear browser cookies`);
      console.log(`   - Log back in via SSO`);
      process.exit(0);
    }

    // Update role to admin
    const previousRole = player.role;
    player.role = 'admin';
    await player.save();

    console.log(`\n✅ Role updated:`);
    console.log(`   Previous: ${previousRole || 'NOT SET'}`);
    console.log(`   New: ${player.role}`);
    console.log(`\n📝 IMMEDIATE NEXT STEPS:`);
    console.log(`   1. Go to https://www.amanoba.com/hu/dashboard`);
    console.log(`   2. Click the "🔄 Frissítés" (Refresh) button`);
    console.log(`   3. The admin button should appear NOW`);
    console.log(`\n   If it still doesn't appear:`);
    console.log(`   - Log out completely (click "🚪 Kijelentkezés")`);
    console.log(`   - Clear browser cookies (or use incognito)`);
    console.log(`   - Log back in via SSO`);
    console.log(`   - The role will sync from database to your session`);
    console.log(`\n⚠️  NOTE: This is a manual override.`);
    console.log(`   The role will be synced from SSO on next login.`);
    console.log(`   If SSO role extraction is working, this change may be overwritten.`);
    console.log(`   If you have admin on SSO server, it should match after login.`);
    
    logger.info(
      {
        playerId: player._id,
        previousRole,
        newRole: player.role,
        manualOverride: true,
      },
      'Admin role set manually - user must refresh dashboard or log out/in'
    );

    process.exit(0);
  } catch (error) {
    logger.error({ error, email }, 'Fix admin role now failed');
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error('❌ Email address required');
  console.error('\nUsage: npx tsx scripts/fix-admin-role-now.ts <email>');
  console.error('\nExample:');
  console.error('  npx tsx scripts/fix-admin-role-now.ts moldovancsaba@gmail.com');
  process.exit(1);
}

fixAdminRoleNow(email);
