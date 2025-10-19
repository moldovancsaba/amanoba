/**
 * Diagnose Achievement Issues
 * 
 * What: Checks achievement data in database for bugs
 * Why: Debug mass unlock and criteria evaluation issues
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Achievement, AchievementUnlock, PlayerProgression, Player } from '../app/lib/models';
import logger from '../app/lib/logger';

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  await mongoose.connect(mongoUri);
  logger.info('Connected to MongoDB');
}

async function diagnose() {
  await connectDB();

  console.log('\n========== ACHIEVEMENT DIAGNOSTICS ==========\n');

  // 1. Check all achievements for missing or invalid targets
  console.log('1. Checking Achievement Criteria...\n');
  const achievements = await Achievement.find({}).lean();
  
  let invalidCount = 0;
  for (const achievement of achievements) {
    const criteria = achievement.criteria as any;
    const target = criteria?.target;
    
    if (target === undefined || target === null || target === 0) {
      console.log(`❌ INVALID: "${achievement.name}" (${achievement._id})`);
      console.log(`   Criteria: ${JSON.stringify(criteria)}`);
      console.log(`   Target: ${target}\n`);
      invalidCount++;
    }
  }
  
  if (invalidCount === 0) {
    console.log('✅ All achievements have valid targets\n');
  } else {
    console.log(`⚠️ Found ${invalidCount} achievements with invalid targets\n`);
  }

  // 2. Check recent achievement unlocks
  console.log('2. Checking Recent Unlocks...\n');
  const recentUnlocks = await AchievementUnlock.find({})
    .sort({ 'metadata.createdAt': -1 })
    .limit(20)
    .populate('achievementId')
    .populate('playerId')
    .lean();

  console.log(`Found ${recentUnlocks.length} recent unlocks:\n`);
  
  for (const unlock of recentUnlocks) {
    const achievement = unlock.achievementId as any;
    const player = unlock.playerId as any;
    
    console.log(`- "${achievement?.name}"`);
    console.log(`  Player: ${player?.displayName || 'Unknown'}`);
    console.log(`  Unlocked: ${unlock.unlockedAt?.toISOString()}`);
    console.log(`  Progress: ${unlock.progress}%`);
    console.log(`  Current Value: ${unlock.currentValue}\n`);
  }

  // 3. Check player progressions for first player
  console.log('3. Checking Player Stats...\n');
  const players = await Player.find({}).limit(3).lean();
  
  for (const player of players) {
    const progression = await PlayerProgression.findOne({ playerId: player._id }).lean();
    
    if (progression) {
      console.log(`Player: ${player.displayName}`);
      console.log(`  Games Played: ${progression.statistics.totalGamesPlayed}`);
      console.log(`  Wins: ${progression.statistics.totalWins}`);
      console.log(`  Losses: ${progression.statistics.totalLosses}`);
      console.log(`  Level: ${progression.level}`);
      console.log(`  Achievements Unlocked: ${progression.achievements.totalUnlocked}\n`);
    }
  }

  // 4. Count unlocks per achievement
  console.log('4. Unlocks Per Achievement...\n');
  const unlockCounts = await AchievementUnlock.aggregate([
    {
      $group: {
        _id: '$achievementId',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  for (const { _id, count } of unlockCounts) {
    const achievement = await Achievement.findById(_id).lean();
    console.log(`- "${achievement?.name}": ${count} unlocks`);
  }

  await mongoose.disconnect();
  console.log('\n========== DIAGNOSTICS COMPLETE ==========\n');
}

diagnose().catch(error => {
  console.error('Diagnostic failed:', error);
  process.exit(1);
});
