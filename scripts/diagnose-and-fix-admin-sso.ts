/**
 * Diagnose and Fix Admin Access via SSO
 * 
 * What: Comprehensive diagnostic and fix for admin access
 * Why: Determine if SSO is working and fix admin access definitively
 * 
 * Usage: npx tsx scripts/diagnose-and-fix-admin-sso.ts <email>
 */

import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function diagnoseAndFixAdminSSO(email: string) {
  try {
    await connectDB();
    logger.info({ email }, 'Diagnose and fix admin SSO - starting');

    // Find player by email
    const player = await Player.findOne({ email });

    if (!player) {
      console.error(`❌ Player not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`\n📋 Player Information:`);
    console.log(`   ID: ${player._id}`);
    console.log(`   Display Name: ${player.displayName}`);
    console.log(`   Email: ${player.email}`);
    console.log(`   SSO Sub: ${player.ssoSub || '❌ MISSING'}`);
    console.log(`   Current Database Role: ${player.role || '❌ NOT SET'}`);
    console.log(`   Auth Provider: ${player.authProvider || 'N/A'}`);
    
    if (!player.ssoSub) {
      console.log(`\n❌ CRITICAL: Player has no ssoSub - not an SSO user`);
      console.log(`   This account cannot use SSO-based admin access.`);
      console.log(`   You must log in via SSO first to get an ssoSub.`);
      process.exit(1);
    }

    // Check SSO configuration
    console.log(`\n🔍 SSO Configuration Check:`);
    const ssoUserInfoUrl = process.env.SSO_USERINFO_URL;
    const ssoIssuer = process.env.SSO_ISSUER;
    const ssoClientId = process.env.SSO_CLIENT_ID;
    
    console.log(`   SSO_USERINFO_URL: ${ssoUserInfoUrl ? '✅ Configured' : '❌ MISSING'}`);
    console.log(`   SSO_ISSUER: ${ssoIssuer ? '✅ Configured' : '❌ MISSING'}`);
    console.log(`   SSO_CLIENT_ID: ${ssoClientId ? '✅ Configured' : '❌ MISSING'}`);
    
    if (!ssoUserInfoUrl) {
      console.log(`\n❌ CRITICAL: SSO_USERINFO_URL is not configured!`);
      console.log(`   Admin roles come from the SSO UserInfo endpoint.`);
      console.log(`   Without this, the system cannot fetch your admin role from SSO.`);
      console.log(`\n   SOLUTION: Set SSO_USERINFO_URL environment variable.`);
      process.exit(1);
    }

    console.log(`\n📝 DIAGNOSIS:`);
    console.log(`   Your SSO Sub: ${player.ssoSub}`);
    console.log(`   SSO UserInfo URL: ${ssoUserInfoUrl}`);
    console.log(`\n   The system fetches your role from SSO on every login.`);
    console.log(`   If you have admin on SSO server, it should sync automatically.`);
    
    if (player.role === 'admin') {
      console.log(`\n✅ GOOD NEWS: Your database role is already 'admin'!`);
      console.log(`\n📝 NEXT STEPS:`);
      console.log(`   1. Go to https://www.amanoba.com/hu/dashboard`);
      console.log(`   2. Click "🔄 Frissítés" (Refresh) button`);
      console.log(`   3. Admin button should appear`);
      console.log(`\n   If it doesn't appear:`);
      console.log(`   - Log out completely`);
      console.log(`   - Clear browser cookies`);
      console.log(`   - Log back in via SSO`);
      console.log(`   - The role will sync from database to session`);
      process.exit(0);
    }

    // Ask for confirmation
    console.log(`\n❓ Your database role is currently: ${player.role || 'NOT SET'}`);
    console.log(`\n   I can set it to 'admin' now, but you need to verify:`);
    console.log(`   1. Do you have admin role on sso.doneisbetter.com?`);
    console.log(`   2. Is your SSO account configured correctly?`);
    console.log(`\n   If YES, I'll set it to 'admin' now.`);
    console.log(`   If NO, you need to configure admin on SSO server first.`);
    
    // For script usage, we'll set it (can be made interactive later)
    const shouldSet = process.argv[3] === '--yes' || process.argv[3] === '-y';
    
    if (!shouldSet) {
      console.log(`\n💡 To proceed, run:`);
      console.log(`   npx tsx scripts/diagnose-and-fix-admin-sso.ts ${email} --yes`);
      console.log(`\n   This will:`);
      console.log(`   1. Set your database role to 'admin'`);
      console.log(`   2. Provide instructions to refresh your session`);
      process.exit(0);
    }

    // Update role to admin
    const previousRole = player.role;
    player.role = 'admin';
    await player.save();

    console.log(`\n✅ Role updated:`);
    console.log(`   Previous: ${previousRole || 'NOT SET'}`);
    console.log(`   New: ${player.role}`);
    
    console.log(`\n📝 IMMEDIATE ACTION REQUIRED:`);
    console.log(`   1. Go to https://www.amanoba.com/hu/dashboard`);
    console.log(`   2. Click "🔄 Frissítés" (Refresh) button`);
    console.log(`   3. Admin button should appear NOW`);
    console.log(`\n   If it still doesn't appear:`);
    console.log(`   - Log out completely (click "🚪 Kijelentkezés")`);
    console.log(`   - Clear browser cookies (or use incognito)`);
    console.log(`   - Log back in via SSO`);
    console.log(`   - The role will sync from database to your session`);
    
    console.log(`\n⚠️  IMPORTANT NOTES:`);
    console.log(`   - This is a manual override of your database role`);
    console.log(`   - On next SSO login, the role will sync from SSO UserInfo endpoint`);
    console.log(`   - If SSO returns 'admin', it will stay 'admin'`);
    console.log(`   - If SSO returns 'user', it will be overwritten to 'user'`);
    console.log(`   - Make sure you have admin role on sso.doneisbetter.com`);
    
    logger.info(
      {
        playerId: player._id,
        previousRole,
        newRole: player.role,
        manualOverride: true,
        ssoSub: player.ssoSub,
      },
      'Admin role set manually - user must refresh dashboard or log out/in'
    );

    console.log(`\n✅ DONE! Your database role is now 'admin'.`);
    console.log(`   Follow the steps above to see the admin button.`);
    
    process.exit(0);
  } catch (error) {
    logger.error({ error, email }, 'Diagnose and fix admin SSO failed');
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error('❌ Email address required');
  console.error('\nUsage: npx tsx scripts/diagnose-and-fix-admin-sso.ts <email> [--yes]');
  console.error('\nExample:');
  console.error('  npx tsx scripts/diagnose-and-fix-admin-sso.ts moldovancsaba@gmail.com');
  console.error('  npx tsx scripts/diagnose-and-fix-admin-sso.ts moldovancsaba@gmail.com --yes');
  process.exit(1);
}

diagnoseAndFixAdminSSO(email);
