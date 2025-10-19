/**
 * Check Achievement Targets
 * 
 * What: Verify all achievements have valid targets
 * Why: Debug mass unlock issue
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';

async function checkTargets() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  await mongoose.connect(mongoUri);

  const achievements = await mongoose.connection.db!.collection('achievements')
    .find({})
    .toArray();

  console.log('\n========== ACHIEVEMENT TARGETS ==========\n');

  for (const achievement of achievements) {
    const criteria = achievement.criteria;
    console.log(`"${achievement.name}"`);
    console.log(`  Type: ${criteria?.type}`);
    console.log(`  Target: ${criteria?.target}`);
    console.log(`  Criteria: ${JSON.stringify(criteria)}\n`);
  }

  await mongoose.disconnect();
}

checkTargets().catch(error => {
  console.error('Check failed:', error);
  process.exit(1);
});
