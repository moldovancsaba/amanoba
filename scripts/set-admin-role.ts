/**
 * Set Admin Role Script
 * 
 * What: Sets admin role for a specific user by email
 * Why: Allow setting admin role for users who need admin access
 * 
 * Usage: tsx scripts/set-admin-role.ts <email>
 * Example: tsx scripts/set-admin-role.ts moldovancsaba@gmail.com
 */

import 'dotenv/config';
import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function setAdminRole(email: string) {
  try {
    logger.info({ email }, 'Setting admin role for user...');
    
    await connectDB();
    
    // Find player by email
    const player = await Player.findOne({ email });
    
    if (!player) {
      logger.error({ email }, 'Player not found');
      console.error(`❌ Player with email ${email} not found`);
      process.exit(1);
    }
    
    // Update role to admin
    player.role = 'admin';
    await player.save();
    
    logger.info(
      {
        playerId: player._id,
        email: player.email,
        displayName: player.displayName,
        role: player.role,
      },
      'Admin role set successfully'
    );
    
    console.log('✅ Admin role set successfully!');
    console.log(`   Player: ${player.displayName} (${player.email})`);
    console.log(`   Role: ${player.role}`);
    console.log(`   Player ID: ${player._id}`);
    console.log('\n⚠️  Note: User needs to sign out and sign back in for role to take effect in session.');
    
    process.exit(0);
  } catch (error) {
    logger.error({ error, email }, 'Failed to set admin role');
    console.error('❌ Failed to set admin role:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: tsx scripts/set-admin-role.ts <email>');
  console.log('Example: tsx scripts/set-admin-role.ts moldovancsaba@gmail.com');
  process.exit(1);
}

// Run script
setAdminRole(email);
