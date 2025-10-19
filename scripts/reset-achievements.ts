/**
 * Reset Achievements - Clean Slate
 * 
 * DANGER: This script will:
 * 1. Delete ALL achievement unlocks (all players lose progress)
 * 2. Delete ALL achievements
 * 3. Re-seed fresh achievements from seed-achievements.ts
 * 
 * Use this to fix stale achievement data causing false unlocks
 */

import { config } from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Achievement from '../app/lib/models/achievement';
import AchievementUnlock from '../app/lib/models/achievement-unlock';
import PlayerProgression from '../app/lib/models/player-progression';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

async function resetAchievements() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment');
    }

    console.log('🔥 ACHIEVEMENT RESET - WARNING 🔥');
    console.log('This will DELETE all achievement data!\n');

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Step 1: Count existing data
    const [achievementCount, unlockCount, progressionCount] = await Promise.all([
      Achievement.countDocuments(),
      AchievementUnlock.countDocuments(),
      PlayerProgression.countDocuments(),
    ]);

    console.log(`Current state:`);
    console.log(`- Achievements: ${achievementCount}`);
    console.log(`- Unlocks: ${unlockCount}`);
    console.log(`- Players with progression: ${progressionCount}\n`);

    // Step 2: Delete all achievement unlocks
    console.log('1️⃣ Deleting all achievement unlocks...');
    const unlockResult = await AchievementUnlock.deleteMany({});
    console.log(`✓ Deleted ${unlockResult.deletedCount} unlock records\n`);

    // Step 3: Reset achievement counts in PlayerProgression
    console.log('2️⃣ Resetting achievement counts in PlayerProgression...');
    const progressionResult = await PlayerProgression.updateMany(
      {},
      {
        $set: {
          'achievements.totalUnlocked': 0,
          'achievements.recentUnlocks': [],
        },
      }
    );
    console.log(`✓ Reset ${progressionResult.modifiedCount} player progression records\n`);

    // Step 4: Delete all achievements
    console.log('3️⃣ Deleting all achievements...');
    const achievementResult = await Achievement.deleteMany({});
    console.log(`✓ Deleted ${achievementResult.deletedCount} achievements\n`);

    // Step 5: Re-seed achievements
    console.log('4️⃣ Re-seeding achievements from seed script...');
    console.log('Please run: npm run seed:achievements\n');

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    console.log('\n✅ Reset complete!');
    console.log('\n⚠️  IMPORTANT: Run `npm run seed:achievements` to restore achievements');

  } catch (error) {
    console.error('❌ Error resetting achievements:', error);
    process.exit(1);
  }
}

resetAchievements();
