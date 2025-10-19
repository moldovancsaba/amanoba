/**
 * Achievement Seed V2 - Clean Slate
 * 
 * What: Seeds achievements with verified, simple criteria
 * Why: Previous system had false unlocks - rebuilding from scratch
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Achievement } from '../app/lib/models';
import logger from '../app/lib/logger';

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }
  await mongoose.connect(mongoUri);
  logger.info('Connected to MongoDB');
}

async function seedAchievementsV2() {
  await connectDB();

  logger.info('Seeding achievements V2...');

  const achievements = [
    // Progression Achievements - Games Played
    {
      name: 'Newcomer',
      description: 'Play your first game',
      category: 'progression',
      tier: 'bronze',
      icon: '🎮',
      isHidden: false,
      criteria: {
        type: 'games_played',
        target: 1,
      },
      rewards: {
        points: 10,
        xp: 50,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Regular Player',
      description: 'Play 5 games',
      category: 'progression',
      tier: 'bronze',
      icon: '🎯',
      isHidden: false,
      criteria: {
        type: 'games_played',
        target: 5,
      },
      rewards: {
        points: 50,
        xp: 100,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Enthusiast',
      description: 'Play 25 games',
      category: 'progression',
      tier: 'silver',
      icon: '⚡',
      isHidden: false,
      criteria: {
        type: 'games_played',
        target: 25,
      },
      rewards: {
        points: 200,
        xp: 500,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Veteran',
      description: 'Play 100 games',
      category: 'progression',
      tier: 'gold',
      icon: '🏅',
      isHidden: false,
      criteria: {
        type: 'games_played',
        target: 100,
      },
      rewards: {
        points: 1000,
        xp: 2000,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },

    // Gameplay Achievements
    {
      name: 'First Win',
      description: 'Win your first game',
      category: 'gameplay',
      tier: 'bronze',
      icon: '🏆',
      isHidden: false,
      criteria: {
        type: 'wins',
        target: 1,
      },
      rewards: {
        points: 20,
        xp: 100,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Winner',
      description: 'Win 10 games',
      category: 'gameplay',
      tier: 'silver',
      icon: '🥇',
      isHidden: false,
      criteria: {
        type: 'wins',
        target: 10,
      },
      rewards: {
        points: 100,
        xp: 300,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Master',
      description: 'Win 50 games',
      category: 'gameplay',
      tier: 'gold',
      icon: '👑',
      isHidden: false,
      criteria: {
        type: 'wins',
        target: 50,
      },
      rewards: {
        points: 500,
        xp: 1500,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },

    // Streak Achievements
    {
      name: 'Double Win',
      description: 'Win 2 games in a row',
      category: 'streak',
      tier: 'bronze',
      icon: '🔥',
      isHidden: false,
      criteria: {
        type: 'streak',
        target: 2,
      },
      rewards: {
        points: 30,
        xp: 150,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Hot Hand',
      description: 'Win 5 games in a row',
      category: 'streak',
      tier: 'silver',
      icon: '🔥🔥',
      isHidden: false,
      criteria: {
        type: 'streak',
        target: 5,
      },
      rewards: {
        points: 150,
        xp: 400,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Unstoppable Force',
      description: 'Win 10 games in a row',
      category: 'streak',
      tier: 'gold',
      icon: '🔥🔥🔥',
      isHidden: false,
      criteria: {
        type: 'streak',
        target: 10,
      },
      rewards: {
        points: 500,
        xp: 1000,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
  ];

  // Clear existing achievements
  await Achievement.deleteMany({});
  logger.info('Cleared existing achievements');

  // Insert new achievements
  for (const achievementData of achievements) {
    await Achievement.create(achievementData);
    logger.info(`✓ Achievement seeded: ${achievementData.name} (${achievementData.tier})`);
  }

  logger.info(`✅ Seeded ${achievements.length} achievements V2 successfully`);
  
  await mongoose.disconnect();
}

seedAchievementsV2().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
