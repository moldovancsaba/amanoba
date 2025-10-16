/**
 * WhackPop Emojis Seed Script
 * 
 * Purpose: Seeds 8 animal emojis used as targets in WHACKPOP game
 * Why: Migrates existing hardcoded emojis to database for easy management
 * 
 * Usage: npm run seed:whackpop-emojis
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Why: Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { WhackPopEmoji } from '../app/lib/models';
import logger from '../app/lib/logger';

/**
 * Emoji Data Structure
 * Why: Type-safe emoji definitions matching model schema
 */
interface EmojiData {
  emoji: string;
  name: string;
  category: string;
}

/**
 * Connect to MongoDB
 */
async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  
  await mongoose.connect(mongoUri);
  logger.info('Connected to MongoDB for seeding WhackPop emojis');
}

/**
 * All 8 Emojis
 * Why: Migrated from app/games/whackpop/page.tsx line 88
 */
const emojis: EmojiData[] = [
  { emoji: '🐹', name: 'Hamster', category: 'Animals' },
  { emoji: '🐰', name: 'Rabbit', category: 'Animals' },
  { emoji: '🐭', name: 'Mouse', category: 'Animals' },
  { emoji: '🐻', name: 'Bear', category: 'Animals' },
  { emoji: '🐼', name: 'Panda', category: 'Animals' },
  { emoji: '🐨', name: 'Koala', category: 'Animals' },
  { emoji: '🦊', name: 'Fox', category: 'Animals' },
  { emoji: '🦝', name: 'Raccoon', category: 'Animals' },
];

/**
 * Seed Emojis
 * Why: Populates database with all 8 emojis
 */
async function seedEmojis() {
  logger.info('Seeding 8 WhackPop emojis...');
  
  // Why: Clear existing emojis to ensure clean state
  await WhackPopEmoji.deleteMany({});
  logger.info('Cleared existing emojis');
  
  // Why: Insert all emojis with default values
  const emojiDocs = emojis.map(e => ({
    ...e,
    isActive: true,
    weight: 1, // Why: Equal probability for all emojis
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'seed-script',
    },
  }));
  
  const inserted = await WhackPopEmoji.insertMany(emojiDocs);
  logger.info(`✓ Inserted ${inserted.length} emojis:`);
  
  // Why: Log each emoji for verification
  inserted.forEach(emoji => {
    logger.info(`  ${emoji.emoji} - ${emoji.name} (${emoji.category})`);
  });
}

/**
 * Main Execution
 */
async function main() {
  try {
    await connectDB();
    await seedEmojis();
    logger.info('\n✅ WhackPop emojis seed completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, '❌ Error seeding WhackPop emojis');
    process.exit(1);
  }
}

main();
