/**
 * Master Seed Script
 * 
 * Purpose: Runs all seed scripts in correct order
 * Why: Ensures database is populated with all foundation data
 * 
 * Usage: npm run seed
 */

import logger from '../app/lib/logger';
import seedCoreData from './seed-core-data';
import seedAchievements from './seed-achievements';
import seedRewards from './seed-rewards';

/**
 * Main seed orchestrator
 * Why: Runs all seeds in dependency order
 */
async function seedAll() {
  logger.info('🌱 Starting complete database seeding...\n');
  
  try {
    // Phase 1: Core Data (Brands, Games, GameBrandConfigs)
    logger.info('📦 Phase 1: Seeding core data...');
    await seedCoreData();
    
    // Phase 2: Achievements
    logger.info('\n🏆 Phase 2: Seeding achievements...');
    await seedAchievements();
    
    // Phase 3: Rewards
    logger.info('\n🎁 Phase 3: Seeding rewards...');
    await seedRewards();
    
    logger.info('\n✅ All database seeding completed successfully!');
    logger.info('📊 Database is ready for development and testing.\n');
    
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, '\n❌ Master seeding failed');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAll();
}

export default seedAll;
