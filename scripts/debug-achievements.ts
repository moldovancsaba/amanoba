/**
 * Debug Achievement Issue
 * 
 * Purpose: Investigate why 9 achievements unlock on first game
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { PlayerProgression, Achievement, AchievementUnlock } from '../app/lib/models';

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not defined');
  }
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');
}

async function debug() {
  try {
    await connectDB();
    
    // Get most recent player
    const progression = await PlayerProgression.findOne()
      .sort({ 'metadata.updatedAt': -1 })
      .lean();
    
    if (!progression) {
      console.log('❌ No player progression found');
      return;
    }
    
    console.log('\n📊 PLAYER STATS:');
    console.log('Player ID:', progression.playerId);
    console.log('Level:', progression.level);
    console.log('Total XP:', progression.totalXP);
    console.log('Games Played:', progression.statistics.totalGamesPlayed);
    console.log('Wins:', progression.statistics.totalWins);
    console.log('Losses:', progression.statistics.totalLosses);
    console.log('Current Streak:', progression.statistics.currentStreak);
    console.log('Best Streak:', progression.statistics.bestStreak);
    
    // Get unlocked achievements
    const unlocks = await AchievementUnlock.find({ 
      playerId: progression.playerId,
      progress: { $gte: 100 }
    })
      .populate('achievementId')
      .lean();
    
    console.log('\n🏆 UNLOCKED ACHIEVEMENTS:', unlocks.length);
    for (const unlock of unlocks) {
      const ach: any = unlock.achievementId;
      console.log(`- ${ach.name} (${ach.criteria.type}, target: ${ach.criteria.target})`);
    }
    
    // Get all achievements with target <= current stats
    const achievements = await Achievement.find({
      'metadata.isActive': true,
    }).lean();
    
    console.log('\n🔍 ACHIEVEMENTS ANALYSIS:');
    for (const ach of achievements) {
      let currentValue = 0;
      let shouldUnlock = false;
      
      switch (ach.criteria.type) {
        case 'games_played':
          currentValue = progression.statistics.totalGamesPlayed;
          shouldUnlock = currentValue >= ach.criteria.target;
          break;
        case 'wins':
          currentValue = progression.statistics.totalWins;
          shouldUnlock = currentValue >= ach.criteria.target;
          break;
        case 'streak':
          currentValue = progression.statistics.currentStreak;
          shouldUnlock = currentValue >= ach.criteria.target;
          break;
        case 'level_reached':
          currentValue = progression.level;
          shouldUnlock = currentValue >= ach.criteria.target;
          break;
      }
      
      const isUnlocked = unlocks.some(
        u => (u.achievementId as any)._id.toString() === ach._id.toString()
      );
      
      const status = isUnlocked ? '✅ UNLOCKED' : shouldUnlock ? '⚠️  SHOULD BE UNLOCKED' : '❌ LOCKED';
      console.log(`${status} ${ach.name} (${ach.criteria.type}: ${currentValue}/${ach.criteria.target})`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debug();
