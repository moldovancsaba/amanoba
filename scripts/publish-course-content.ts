/**
 * Publish Course Content
 *
 * What: Set all courses and lessons to isActive=true
 * Why: Make all existing content visible on the public website
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

async function publishAll() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  await mongoose.connect(mongoUri);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB connection not initialized');
  }

  const coursesResult = await db.collection('courses').updateMany(
    {},
    { $set: { isActive: true } }
  );

  const lessonsResult = await db.collection('lessons').updateMany(
    {},
    { $set: { isActive: true } }
  );

  console.log('Publish complete');
  console.log(`Courses matched: ${coursesResult.matchedCount}, modified: ${coursesResult.modifiedCount}`);
  console.log(`Lessons matched: ${lessonsResult.matchedCount}, modified: ${lessonsResult.modifiedCount}`);

  await mongoose.disconnect();
}

publishAll().catch((error) => {
  console.error('Publish failed:', error);
  process.exit(1);
});
