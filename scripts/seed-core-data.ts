/**
 * Core Data Seed Script
 * 
 * Purpose: Seeds Brand, Game, and GameBrandConfig initial data
 * Why: Provides foundation data required for all other models
 * 
 * Usage: npm run seed:core
 */

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
      name: 'QUIZZZ',
      type: 'QUIZZZ',
      description: 'Fast-paced trivia game with multiple categories. Test your knowledge and compete for the highest score!',
      category: 'trivia',
      icon: '❓',
      displayOrder: 1,
      rules: {
        timeLimit: 180, // 3 minutes
        maxAttempts: 1,
        difficultyLevels: ['easy', 'medium', 'hard'],
        scoringSystem: 'Points based on speed and accuracy',
      },
      scoring: {
        basePoints: 100,
        timeBonus: true,
        accuracyMultiplier: 1.5,
        streakBonus: true,
      },
      features: {
        hasHints: false,
        hasLifelines: false,
        supportsSinglePlayer: true,
        supportsMultiplayer: false,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isPremiumOnly: false,
      },
    },
    {
      name: 'WHACKPOP',
      type: 'WHACKPOP',
      description: 'Reflex-based arcade game. Pop the targets as fast as you can before time runs out!',
      category: 'arcade',
      icon: '🎯',
      displayOrder: 2,
      rules: {
        timeLimit: 60, // 1 minute
        maxAttempts: 3,
        difficultyLevels: ['easy', 'medium', 'hard', 'expert'],
        scoringSystem: 'Points per successful hit with combo multipliers',
      },
      scoring: {
        basePoints: 10,
        timeBonus: false,
        accuracyMultiplier: 2.0,
        streakBonus: true,
      },
      features: {
        hasHints: false,
        hasLifelines: false,
        supportsSinglePlayer: true,
        supportsMultiplayer: false,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isPremiumOnly: false,
      },
    },
    {
      name: 'Madoku',
      type: 'MADOKU',
      description: 'Strategic number puzzle game. Fill the grid following Sudoku rules with increasing difficulty levels.',
      category: 'puzzle',
      icon: '🔢',
      displayOrder: 3,
      rules: {
        timeLimit: 1800, // 30 minutes
        maxAttempts: null, // Unlimited
        difficultyLevels: ['easy', 'medium', 'hard', 'expert'],
        scoringSystem: 'Based on time, hints used, and difficulty',
      },
      scoring: {
        basePoints: 500,
        timeBonus: true,
        accuracyMultiplier: 1.0,
        streakBonus: false,
      },
      features: {
        hasHints: true,
        hasLifelines: true,
        supportsSinglePlayer: true,
        supportsMultiplayer: false,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isPremiumOnly: true, // Premium gated as per requirements
      },
    },
  ];
  
  for (const gameData of games) {
    await Game.findOneAndUpdate(
      { type: gameData.type },
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
