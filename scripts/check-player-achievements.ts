import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';

async function check() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const playerId = '68f2604d0ba2c95dbeb1ed77';
  
  // Check PlayerProgression
  const progression = await mongoose.connection.db!.collection('playerprogressions')
    .findOne({ playerId: new mongoose.Types.ObjectId(playerId) });
  
  console.log('\n=== PLAYER PROGRESSION ===\n');
  console.log('Achievements:', JSON.stringify(progression?.achievements, null, 2));
  
  // Check AchievementUnlocks
  const unlocks = await mongoose.connection.db!.collection('achievementunlocks')
    .find({ playerId: new mongoose.Types.ObjectId(playerId) })
    .toArray();
  
  console.log('\n=== ACHIEVEMENT UNLOCKS ===\n');
  console.log(`Found ${unlocks.length} unlocks:`);
  for (const unlock of unlocks) {
    console.log(`- Achievement ID: ${unlock.achievementId}`);
    console.log(`  Unlocked At: ${unlock.unlockedAt}`);
    console.log(`  Progress: ${unlock.progress}%\n`);
  }
  
  await mongoose.disconnect();
}

check().catch(console.error);
