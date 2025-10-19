/**
 * Check Achievement Criteria in Database
 * 
 * Diagnostic script to verify achievement target values are correct
 */

import { config } from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Achievement from '../app/lib/models/achievement';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkAchievements() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Fetch all active achievements
    const achievements = await Achievement.find({ 'metadata.isActive': true })
      .sort({ category: 1, 'criteria.target': 1 })
      .lean();

    console.log(`Found ${achievements.length} active achievements:\n`);

    // Group by category
    const byCategory: Record<string, any[]> = {};
    
    for (const ach of achievements) {
      const category = ach.category;
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(ach);
    }

    // Display grouped
    for (const [category, achs] of Object.entries(byCategory)) {
      console.log(`\n📁 ${category.toUpperCase()}:`);
      console.log('─'.repeat(80));
      
      for (const ach of achs) {
        console.log(`${ach.icon} ${ach.name} (${ach.tier})`);
        console.log(`   Description: ${ach.description}`);
        console.log(`   Criteria: type="${ach.criteria.type}", target=${ach.criteria.target}`);
        console.log(`   Rewards: ${ach.rewards.points} pts, ${ach.rewards.xp} XP${ach.rewards.title ? `, title="${ach.rewards.title}"` : ''}`);
        console.log();
      }
    }

    // Check for suspicious targets
    console.log('\n⚠️  SUSPICIOUS ACHIEVEMENTS (target < 1 or > 1000):');
    console.log('─'.repeat(80));
    
    const suspicious = achievements.filter(a => 
      !a.criteria.target || a.criteria.target < 1 || a.criteria.target > 1000
    );
    
    if (suspicious.length === 0) {
      console.log('✓ No suspicious targets found');
    } else {
      for (const ach of suspicious) {
        console.log(`❌ ${ach.name}: target=${ach.criteria.target}`);
      }
    }

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error checking achievements:', error);
    process.exit(1);
  }
}

checkAchievements();
