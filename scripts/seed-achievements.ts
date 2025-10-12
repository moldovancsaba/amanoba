/**
 * Achievements Seed Script
 * 
 * Purpose: Seeds initial achievement definitions
 * Why: Provides gamification goals for player engagement
 * 
 * Usage: npm run seed:achievements
 */

import mongoose from 'mongoose';
import { Achievement, Game } from '../app/lib/models';
import logger from '../app/lib/logger';

/**
 * Connect to MongoDB
 */
async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  
  await mongoose.connect(mongoUri);
  logger.info('Connected to MongoDB for seeding');
}

/**
 * Seed Achievements
 * Why: Creates diverse achievement goals across categories
 */
async function seedAchievements() {
  logger.info('Seeding achievements...');
  
  const games = await Game.find({}).lean();
  const gameMap = Object.fromEntries(games.map(g => [g.type, g._id]));
  
  const achievements = [
    // Progression Achievements
    {
      name: 'First Steps',
      description: 'Complete your first game',
      category: 'progression',
      tier: 'bronze',
      icon: '👣',
      isHidden: false,
      criteria: {
        type: 'games_played',
        target: 1,
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
      name: 'Getting Started',
      description: 'Play 10 games',
      category: 'progression',
      tier: 'bronze',
      icon: '🎮',
      isHidden: false,
      criteria: {
        type: 'games_played',
        target: 10,
      },
      rewards: {
        points: 100,
        xp: 200,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Dedicated Player',
      description: 'Play 50 games',
      category: 'progression',
      tier: 'silver',
      icon: '🎯',
      isHidden: false,
      criteria: {
        type: 'games_played',
        target: 50,
      },
      rewards: {
        points: 500,
        xp: 1000,
        title: 'Dedicated',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Century Club',
      description: 'Play 100 games',
      category: 'progression',
      tier: 'gold',
      icon: '💯',
      isHidden: false,
      criteria: {
        type: 'games_played',
        target: 100,
      },
      rewards: {
        points: 1000,
        xp: 2500,
        title: 'Centurion',
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
      name: 'First Victory',
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
        points: 100,
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
      name: 'Winning Streak',
      description: 'Win 10 games',
      category: 'gameplay',
      tier: 'silver',
      icon: '🔥',
      isHidden: false,
      criteria: {
        type: 'wins',
        target: 10,
      },
      rewards: {
        points: 300,
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
      name: 'Champion',
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
        points: 1500,
        xp: 3000,
        title: 'Champion',
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
      name: 'Hot Streak',
      description: 'Win 3 games in a row',
      category: 'streak',
      tier: 'bronze',
      icon: '🔥',
      isHidden: false,
      criteria: {
        type: 'streak',
        target: 3,
      },
      rewards: {
        points: 200,
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
      name: 'Unstoppable',
      description: 'Win 10 games in a row',
      category: 'streak',
      tier: 'gold',
      icon: '💥',
      isHidden: false,
      criteria: {
        type: 'streak',
        target: 10,
      },
      rewards: {
        points: 1000,
        xp: 2000,
        title: 'Unstoppable',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Legendary Streak',
      description: 'Win 25 games in a row',
      category: 'streak',
      tier: 'platinum',
      icon: '⚡',
      isHidden: true,
      criteria: {
        type: 'streak',
        target: 25,
      },
      rewards: {
        points: 5000,
        xp: 10000,
        title: 'Legend',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    
    // Mastery Achievements (Game-specific)
    {
      name: 'Quiz Master',
      description: 'Achieve a perfect score in QUIZZZ',
      category: 'mastery',
      tier: 'gold',
      icon: '🧠',
      isHidden: false,
      criteria: {
        type: 'perfect_score',
        gameId: gameMap.QUIZZZ,
        target: 1,
      },
      rewards: {
        points: 800,
        xp: 1500,
        title: 'Quiz Master',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Sharp Shooter',
      description: 'Achieve 100% accuracy in WHACKPOP',
      category: 'mastery',
      tier: 'gold',
      icon: '🎯',
      isHidden: false,
      criteria: {
        type: 'accuracy',
        gameId: gameMap.WHACKPOP,
        target: 100,
      },
      rewards: {
        points: 800,
        xp: 1500,
        title: 'Sharpshooter',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Sudoku Genius',
      description: 'Complete an Expert Madoku puzzle',
      category: 'mastery',
      tier: 'platinum',
      icon: '🧩',
      isHidden: false,
      criteria: {
        type: 'custom',
        gameId: gameMap.MADOKU,
        target: 1,
        condition: 'Complete on Expert difficulty without hints',
      },
      rewards: {
        points: 2000,
        xp: 5000,
        title: 'Genius',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    
    // Collection Achievements
    {
      name: 'Rising Star',
      description: 'Reach Level 10',
      category: 'collection',
      tier: 'bronze',
      icon: '⭐',
      isHidden: false,
      criteria: {
        type: 'level_reached',
        target: 10,
      },
      rewards: {
        points: 500,
        xp: 0,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
    {
      name: 'Point Collector',
      description: 'Earn 10,000 total points',
      category: 'collection',
      tier: 'silver',
      icon: '💰',
      isHidden: false,
      criteria: {
        type: 'points_earned',
        target: 10000,
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
    
    // Special Achievements
    {
      name: 'Early Adopter',
      description: 'Join Amanoba in its first month',
      category: 'special',
      tier: 'platinum',
      icon: '🚀',
      isHidden: false,
      criteria: {
        type: 'custom',
        target: 1,
        condition: 'Register before February 1, 2025',
      },
      rewards: {
        points: 1000,
        xp: 1000,
        title: 'Pioneer',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: true,
      },
    },
  ];
  
  for (const achievementData of achievements) {
    await Achievement.findOneAndUpdate(
      { name: achievementData.name },
      achievementData,
      { upsert: true, new: true }
    );
    logger.info(`✓ Achievement seeded: ${achievementData.name} (${achievementData.tier})`);
  }
}

/**
 * Main seed function
 */
async function seed() {
  try {
    await connectDB();
    await seedAchievements();
    
    logger.info('✅ Achievements seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, '❌ Seeding failed');
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seed();
}

export default seed;
