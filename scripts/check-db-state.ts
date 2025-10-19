/**
 * Check Database State
 * 
 * What: Shows all collection counts and recent data
 * Why: Verify database has data and identify issues
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';

async function checkState() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  await mongoose.connect(mongoUri);
  console.log('\n========== DATABASE STATE ==========\n');

  const collections = [
    'players',
    'playersessions',
    'playerprogressions',
    'pointswallets',
    'pointstransactions',
    'achievements',
    'achievementunlocks',
    'leaderboardentries',
    'streaks',
    'dailychallenges',
    'eventlogs',
    'jobqueues',
  ];

  for (const collection of collections) {
    try {
      const count = await mongoose.connection.db!.collection(collection).countDocuments();
      console.log(`${collection.padEnd(25)} ${count} documents`);
    } catch (error) {
      console.log(`${collection.padEnd(25)} Collection not found`);
    }
  }

  console.log('\n========== RECENT ACTIVITY ==========\n');

  // Check last 3 player sessions
  const sessions = await mongoose.connection.db!.collection('playersessions')
    .find({})
    .sort({ startedAt: -1 })
    .limit(3)
    .toArray();

  console.log(`Last ${sessions.length} game sessions:\n`);
  for (const session of sessions) {
    console.log(`- ${session.gameId} | ${session.outcome} | Score: ${session.score} | ${session.startedAt.toISOString()}`);
  }

  // Check job queue
  const jobs = await mongoose.connection.db!.collection('jobqueues')
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  console.log(`\nLast ${jobs.length} queued jobs:\n`);
  for (const job of jobs) {
    console.log(`- ${job.type} | ${job.status} | ${job.createdAt.toISOString()}`);
  }

  await mongoose.disconnect();
  console.log('\n====================================\n');
}

checkState().catch(error => {
  console.error('Check failed:', error);
  process.exit(1);
});
