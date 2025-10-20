/**
 * Check Database Contents
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { 
  Player, 
  PlayerProgression, 
  PlayerSession, 
  Achievement, 
  AchievementUnlock,
  PointsWallet,
  PointsTransaction 
} from '../app/lib/models';

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not defined');
  }
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB\n');
}

async function checkDB() {
  try {
    await connectDB();
    
    const counts = {
      players: await Player.countDocuments(),
      progressions: await PlayerProgression.countDocuments(),
      sessions: await PlayerSession.countDocuments(),
      achievements: await Achievement.countDocuments(),
      achievementUnlocks: await AchievementUnlock.countDocuments(),
      wallets: await PointsWallet.countDocuments(),
      transactions: await PointsTransaction.countDocuments(),
    };
    
    console.log('📊 DATABASE COUNTS:');
    console.log('Players:', counts.players);
    console.log('Player Progressions:', counts.progressions);
    console.log('Player Sessions:', counts.sessions);
    console.log('Achievements (definitions):', counts.achievements);
    console.log('Achievement Unlocks:', counts.achievementUnlocks);
    console.log('Points Wallets:', counts.wallets);
    console.log('Points Transactions:', counts.transactions);
    
    if (counts.players > 0) {
      console.log('\n📋 RECENT PLAYERS:');
      const players = await Player.find().sort({ 'metadata.createdAt': -1 }).limit(3).lean();
      for (const p of players) {
        console.log(`- ${p.displayName} (${p._id})`);
      }
    }
    
    if (counts.sessions > 0) {
      console.log('\n🎮 RECENT SESSIONS:');
      const sessions = await PlayerSession.find()
        .sort({ 'session.startedAt': -1 })
        .limit(3)
        .lean();
      for (const s of sessions) {
        console.log(`- Player ${s.playerId}, Score: ${s.session.score}/${s.session.maxScore}, Outcome: ${s.session.outcome}`);
      }
    }
    
    if (counts.achievementUnlocks > 0) {
      console.log('\n🏆 RECENT ACHIEVEMENT UNLOCKS:');
      const unlocks = await AchievementUnlock.find()
        .sort({ unlockedAt: -1 })
        .limit(5)
        .populate('achievementId')
        .lean();
      for (const u of unlocks) {
        const ach: any = u.achievementId;
        console.log(`- Player ${u.playerId}: ${ach?.name || 'Unknown'}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDB();
