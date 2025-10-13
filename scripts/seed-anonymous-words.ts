/**
 * Seed Anonymous Name Words
 * 
 * Populates the database with words for generating anonymous guest usernames.
 * 
 * Why: Separate seed script allows easy expansion of word list
 * Run: npm run seed:anonymous-words
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import connectDB from '../app/lib/mongodb';
import { AnonymousNameWord } from '../app/lib/models/anonymous-name-word';
import logger from '../app/lib/logger';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const INITIAL_WORDS = [
  // Cities
  'London', 'Beijing', 'Chicago', 'York', 'Prague', 'Rome', 'Vienna', 
  'Bangkok', 'Tokyo', 'Moscow', 'Riga', 'Oslo', 'Balaton', 'Leon', 'Miskolc',
  
  // Animals & Nature
  'Zebra', 'Zulu', 'Butterfly', 'Firefly', 'Snake', 'Sea', 'Ocean',
  
  // Abstract
  'Alfa', 'Cylon', 'Mystral', 'Africa',
];

async function seedAnonymousWords() {
  try {
    logger.info('🌱 Starting anonymous name words seed...');
    
    await connectDB();
    logger.info('✅ Connected to MongoDB');

    // Clear existing words
    const deleteResult = await AnonymousNameWord.deleteMany({});
    logger.info(`🗑️  Cleared ${deleteResult.deletedCount} existing words`);

    // Insert words
    const words = INITIAL_WORDS.map(word => ({
      word,
      isActive: true,
      usageCount: 0,
    }));

    const result = await AnonymousNameWord.insertMany(words);
    logger.info(`✅ Inserted ${result.length} words for anonymous name generation`);

    logger.info('🎉 Anonymous name words seed completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`❌ Seed failed: ${error}`);
    process.exit(1);
  }
}

seedAnonymousWords();
