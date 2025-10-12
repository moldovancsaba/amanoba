/**
 * Rewards Seed Script
 * 
 * Purpose: Seeds initial reward definitions for points redemption
 * Why: Provides tangible value for earned points, driving engagement
 * 
 * Usage: npm run seed:rewards
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Why: Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Reward } from '../app/lib/models';
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
 * Seed Rewards
 * Why: Creates diverse reward options across categories
 */
async function seedRewards() {
  logger.info('Seeding rewards...');
  
  const rewards = [
    // Game Unlock Rewards
    {
      name: 'Premium Access - 1 Month',
      description: 'Unlock all premium features for 30 days. Access exclusive games, remove ads, and enjoy priority support.',
      category: 'game_unlock',
      type: 'digital',
      pointsCost: 5000,
      stock: {
        isLimited: false,
      },
      availability: {
        isActive: true,
        premiumOnly: false,
      },
      media: {
        iconEmoji: '⭐',
      },
      redemptionDetails: {
        instructions: 'Premium access will be activated immediately upon redemption.',
        expiresAfterDays: 30,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: 1,
      },
    },
    
    // Cosmetic Rewards
    {
      name: 'Custom Avatar Frame - Gold',
      description: 'Stand out with a golden avatar frame displayed on your profile and leaderboards.',
      category: 'cosmetic',
      type: 'virtual',
      pointsCost: 2000,
      stock: {
        isLimited: false,
      },
      availability: {
        isActive: true,
        premiumOnly: false,
      },
      media: {
        iconEmoji: '🖼️',
      },
      redemptionDetails: {
        instructions: 'Avatar frame will be added to your profile immediately.',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: 10,
      },
    },
    {
      name: 'Custom Profile Theme',
      description: 'Personalize your profile with exclusive color themes and animations.',
      category: 'cosmetic',
      type: 'virtual',
      pointsCost: 1500,
      stock: {
        isLimited: false,
      },
      availability: {
        isActive: true,
        premiumOnly: false,
      },
      media: {
        iconEmoji: '🎨',
      },
      redemptionDetails: {
        instructions: 'Theme options will appear in your profile settings.',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: 11,
      },
    },
    
    // Boost Rewards
    {
      name: 'XP Boost - 2x (24 Hours)',
      description: 'Double your XP earnings for 24 hours. Perfect for leveling up quickly!',
      category: 'boost',
      type: 'virtual',
      pointsCost: 1000,
      stock: {
        isLimited: false,
      },
      availability: {
        isActive: true,
        premiumOnly: false,
      },
      media: {
        iconEmoji: '⚡',
      },
      redemptionDetails: {
        instructions: 'Boost activates immediately and lasts for 24 hours.',
        expiresAfterDays: 1,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: 5,
      },
    },
    {
      name: 'Points Boost - 1.5x (1 Week)',
      description: 'Earn 50% more points on all games for one week.',
      category: 'boost',
      type: 'virtual',
      pointsCost: 3000,
      stock: {
        isLimited: false,
      },
      availability: {
        isActive: true,
        premiumOnly: false,
      },
      media: {
        iconEmoji: '💰',
      },
      redemptionDetails: {
        instructions: 'Boost activates immediately and lasts for 7 days.',
        expiresAfterDays: 7,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: 6,
      },
    },
    
    // Discount Rewards
    {
      name: '50% Off Premium Upgrade',
      description: 'Get 50% discount on your next premium subscription upgrade.',
      category: 'discount',
      type: 'digital',
      pointsCost: 2500,
      stock: {
        isLimited: true,
        currentStock: 100,
        maxStock: 100,
      },
      availability: {
        isActive: true,
        premiumOnly: false,
      },
      media: {
        iconEmoji: '🎫',
      },
      redemptionDetails: {
        instructions: 'Discount code will be sent to your email and can be used at checkout.',
        expiresAfterDays: 30,
        limitPerPlayer: 1,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: 15,
      },
    },
    
    // Virtual Item Rewards
    {
      name: 'Power-Up Bundle',
      description: 'Get 5 random power-ups to use in your games: hints, time freezes, and more!',
      category: 'virtual_item',
      type: 'virtual',
      pointsCost: 800,
      stock: {
        isLimited: false,
      },
      availability: {
        isActive: true,
        premiumOnly: false,
      },
      media: {
        iconEmoji: '🎁',
      },
      redemptionDetails: {
        instructions: 'Power-ups will be added to your inventory immediately.',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: 7,
      },
    },
    {
      name: 'Hint Pack - 10 Hints',
      description: 'Get 10 hints to use in Madoku puzzles when you\'re stuck.',
      category: 'virtual_item',
      type: 'virtual',
      pointsCost: 500,
      stock: {
        isLimited: false,
      },
      availability: {
        isActive: true,
        premiumOnly: false,
      },
      media: {
        iconEmoji: '💡',
      },
      redemptionDetails: {
        instructions: 'Hints will be added to your Madoku inventory.',
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: 8,
      },
    },
    
    // Special Limited Rewards
    {
      name: 'Founding Member Badge',
      description: 'Exclusive badge for early supporters. Limited to first 1000 players!',
      category: 'cosmetic',
      type: 'virtual',
      pointsCost: 10000,
      stock: {
        isLimited: true,
        currentStock: 1000,
        maxStock: 1000,
      },
      availability: {
        isActive: true,
        premiumOnly: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      media: {
        iconEmoji: '🏅',
      },
      redemptionDetails: {
        instructions: 'Badge will appear permanently on your profile.',
        limitPerPlayer: 1,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: 2,
      },
    },
  ];
  
  for (const rewardData of rewards) {
    await Reward.findOneAndUpdate(
      { name: rewardData.name },
      rewardData,
      { upsert: true, new: true }
    );
    logger.info(`✓ Reward seeded: ${rewardData.name} (${rewardData.pointsCost} points)`);
  }
}

/**
 * Main seed function
 */
async function seed() {
  try {
    await connectDB();
    await seedRewards();
    
    logger.info('✅ Rewards seeding completed successfully');
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
