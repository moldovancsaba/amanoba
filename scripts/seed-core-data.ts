/**
 * Core Data Seed Script
 * 
 * Purpose: Seeds Brand, Game, and GameBrandConfig initial data
 * Why: Provides foundation data required for all other models
 * 
 * Usage: npm run seed:core
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Why: Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Game, GameBrandConfig } from '../app/lib/models';
import logger from '../app/lib/logger';

/**
 * Connect to MongoDB
 * Why: Establishes database connection for seeding
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
 * Seed Brands
 * Why: Creates default Amanoba brand and enables white-labeling
 */
async function seedBrands() {
  logger.info('Seeding brands...');
  
  const brands = [
    {
      name: 'Amanoba',
      slug: 'amanoba',
      description: 'The unified gamification platform - Play. Compete. Achieve.',
      website: 'https://amanoba.com',
      logo: '🎮',
      theme: {
        primaryColor: '#6366f1', // Indigo
        secondaryColor: '#ec4899', // Pink
        accentColor: '#a855f7', // Purple
        fontFamily: 'Noto Sans',
      },
      contact: {
        supportEmail: 'support@amanoba.com',
        adminEmail: 'admin@amanoba.com',
      },
      settings: {
        allowRegistration: true,
        requireEmailVerification: false,
        enablePremiumFeatures: true,
        maintenanceMode: false,
      },
      features: {
        games: ['QUIZZZ', 'WHACKPOP', 'MADOKU'],
        hasAchievements: true,
        hasLeaderboards: true,
        hasRewards: true,
        hasReferralProgram: true,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      },
    },
  ];
  
  for (const brandData of brands) {
    await Brand.findOneAndUpdate(
      { slug: brandData.slug },
      brandData,
      { upsert: true, new: true }
    );
    logger.info(`✓ Brand seeded: ${brandData.name}`);
  }
}

/**
 * Seed Games
 * Why: Creates three core games (QUIZZZ, WHACKPOP, MADOKU)
 */
async function seedGames() {
  logger.info('Seeding games...');
  
  const games = [
    {
      gameId: 'QUIZZZ',
      name: 'QUIZZZ',
      type: 'QUIZZZ',
      description: 'Fast-paced trivia game with multiple categories. Test your knowledge and compete for the highest score!',
      rules: '• Answer all questions before time runs out\n• Each correct answer earns points\n• Faster answers get bonus points\n• Get 60% or more correct to win',
      thumbnail: '🧠',
      isActive: true,
      requiresAuth: false,
      isPremium: false,
      minPlayers: 1,
      maxPlayers: 1,
      averageDurationSeconds: 180,
      pointsConfig: {
        winPoints: 500,
        losePoints: 100,
        participationPoints: 50,
        perfectGameBonus: 200,
      },
      xpConfig: {
        winXP: 100,
        loseXP: 25,
        participationXP: 10,
      },
      difficultyLevels: ['easy', 'medium', 'hard'],
      metadata: {
        category: 'trivia',
        icon: '🧠',
      },
    },
    {
      gameId: 'WHACKPOP',
      name: 'WHACKPOP',
      type: 'WHACKPOP',
      description: 'Reflex-based arcade game. Pop the targets as fast as you can before time runs out!',
      rules: '• Click targets as they appear\n• Targets disappear after 1 second\n• Get 20+ hits to win\n• Misses reduce your score',
      thumbnail: '🎯',
      isActive: true,
      requiresAuth: false,
      isPremium: false,
      minPlayers: 1,
      maxPlayers: 1,
      averageDurationSeconds: 30,
      pointsConfig: {
        winPoints: 400,
        losePoints: 80,
        participationPoints: 40,
        perfectGameBonus: 150,
      },
      xpConfig: {
        winXP: 80,
        loseXP: 20,
        participationXP: 10,
      },
      difficultyLevels: ['easy', 'medium', 'hard', 'expert'],
      metadata: {
        category: 'arcade',
        icon: '🎯',
      },
    },
    {
      gameId: 'MADOKU',
      name: 'Madoku',
      type: 'MADOKU',
      description: 'Strategic number puzzle game. Fill the grid following Sudoku rules with increasing difficulty levels.',
      rules: '• Fill 9x9 grid with numbers 1-9\n• Each row, column, and 3x3 box must contain all digits\n• Use hints sparingly for best score\n• Premium feature - unlock to play',
      thumbnail: '🔢',
      isActive: true,
      requiresAuth: true,
      isPremium: true,
      minPlayers: 1,
      maxPlayers: 1,
      averageDurationSeconds: 900,
      pointsConfig: {
        winPoints: 1000,
        losePoints: 200,
        participationPoints: 100,
        perfectGameBonus: 500,
      },
      xpConfig: {
        winXP: 200,
        loseXP: 50,
        participationXP: 25,
      },
      difficultyLevels: ['easy', 'medium', 'hard', 'expert'],
      metadata: {
        category: 'puzzle',
        icon: '🔢',
      },
    },
  ];
  
  for (const gameData of games) {
    await Game.findOneAndUpdate(
      { gameId: gameData.gameId },
      gameData,
      { upsert: true, new: true }
    );
    logger.info(`✓ Game seeded: ${gameData.name}`);
  }
}

/**
 * Seed GameBrandConfigs
 * Why: Links games to Amanoba brand with specific configurations
 */
async function seedGameBrandConfigs() {
  logger.info('Seeding game-brand configurations...');
  
  const amanobaBrand = await Brand.findOne({ slug: 'amanoba' });
  if (!amanobaBrand) {
    throw new Error('Amanoba brand not found');
  }
  
  const games = await Game.find({}).lean<any[]>();
  
  for (const game of games) {
    const config = {
      brandId: amanobaBrand._id,
      gameId: game._id,
      isEnabled: true,
      isPremiumOnly: game.metadata?.isPremiumOnly || false,
      customBranding: {
        primaryColor: '#6366f1',
        secondaryColor: '#ec4899',
      },
      gameRules: {
        timeLimit: (game.rules as any)?.timeLimit || 180,
        pointsMultiplier: 1.0,
        difficultyLevel: 'medium' as 'easy' | 'medium' | 'hard' | 'expert',
      },
      displayOrder: game.displayOrder || 0,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    
    await GameBrandConfig.findOneAndUpdate(
      { brandId: amanobaBrand._id, gameId: game._id },
      config,
      { upsert: true, new: true }
    );
    logger.info(`✓ Game-Brand config seeded: ${game.name} for Amanoba`);
  }
}

/**
 * Main seed function
 * Why: Orchestrates all seeding operations
 */
async function seed() {
  try {
    await connectDB();
    
    await seedBrands();
    await seedGames();
    await seedGameBrandConfigs();
    
    logger.info('✅ Core data seeding completed successfully');
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
