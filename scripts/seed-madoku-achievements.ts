#!/usr/bin/env tsx
/**
 * Seed Madoku Achievements
 * 
 * Inserts 18 Madoku-style achievements adapted to Amanoba's IAchievement schema.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Achievement from '@/lib/models/achievement';
import { Game } from '@/lib/models';

async function main() {
  await connectToDatabase();

  // Try to link achievements to Madoku game if present
  const madoku = await Game.findOne({ gameId: 'MADOKU' }).lean();
  const gameId = madoku?._id as any | undefined;

  type Def = {
    name: string;
    description: string;
    category: 'gameplay' | 'progression' | 'social' | 'collection' | 'mastery' | 'streak' | 'special';
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    icon: string;
    criteria: { type: string; target: number; gameId?: any };
    rewards: { points: number; xp: number; title?: string };
    hidden?: boolean;
  };

  const defs: Def[] = [
    { name: 'First Steps', description: 'Play your first game', category: 'progression', tier: 'bronze', icon: '🎯', criteria: { type: 'games_played', target: 1, gameId }, rewards: { points: 10, xp: 10 } },
    { name: 'Winner', description: 'Win your first game', category: 'progression', tier: 'bronze', icon: '🏆', criteria: { type: 'wins', target: 1, gameId }, rewards: { points: 20, xp: 20 } },
    { name: 'Veteran', description: 'Win 5 games', category: 'progression', tier: 'silver', icon: '🎖️', criteria: { type: 'wins', target: 5, gameId }, rewards: { points: 50, xp: 50 } },
    { name: 'Champion', description: 'Win 15 games', category: 'progression', tier: 'gold', icon: '👑', criteria: { type: 'wins', target: 15, gameId }, rewards: { points: 100, xp: 100 } },
    { name: 'Legend', description: 'Win 30 games', category: 'progression', tier: 'platinum', icon: '💎', criteria: { type: 'wins', target: 30, gameId }, rewards: { points: 200, xp: 200 } },

    { name: 'On Fire', description: 'Win 2 games in a row', category: 'streak', tier: 'bronze', icon: '🔥', criteria: { type: 'streak', target: 2, gameId }, rewards: { points: 30, xp: 30 } },
    { name: 'Unstoppable', description: 'Win 3 games in a row', category: 'streak', tier: 'silver', icon: '⚡', criteria: { type: 'streak', target: 3, gameId }, rewards: { points: 60, xp: 60 } },
    { name: 'Godlike', description: 'Win 5 games in a row', category: 'streak', tier: 'gold', icon: '🌟', criteria: { type: 'streak', target: 5, gameId }, rewards: { points: 150, xp: 150 }, hidden: true },

    { name: 'Perfect Score', description: 'Complete a perfect game', category: 'mastery', tier: 'gold', icon: '💯', criteria: { type: 'perfect_score', target: 1, gameId }, rewards: { points: 40, xp: 40 } },
    { name: 'Close Call', description: 'Win a close match', category: 'mastery', tier: 'silver', icon: '🎲', criteria: { type: 'custom', target: 1, gameId }, rewards: { points: 35, xp: 35 } },

    { name: 'AI Conqueror - Easy', description: 'Beat AI Level 1', category: 'mastery', tier: 'bronze', icon: '🤖', criteria: { type: 'custom', target: 1, gameId }, rewards: { points: 15, xp: 15 } },
    { name: 'AI Conqueror - Medium', description: 'Beat AI Level 2', category: 'mastery', tier: 'silver', icon: '🤖', criteria: { type: 'custom', target: 1, gameId }, rewards: { points: 30, xp: 30 } },
    { name: 'AI Conqueror - Hard', description: 'Beat AI Level 3', category: 'mastery', tier: 'gold', icon: '🤖', criteria: { type: 'custom', target: 1, gameId }, rewards: { points: 60, xp: 60 } },
    { name: 'AI Master', description: 'Beat all AI levels', category: 'mastery', tier: 'platinum', icon: '🧠', criteria: { type: 'custom', target: 1, gameId }, rewards: { points: 100, xp: 100 } },

    { name: 'Dedicated', description: 'Play 7 days in a row', category: 'consistency' as any, tier: 'silver', icon: '📅', criteria: { type: 'custom', target: 7, gameId }, rewards: { points: 70, xp: 70 } },
    { name: 'Committed', description: 'Play 14 days in a row', category: 'consistency' as any, tier: 'gold', icon: '💪', criteria: { type: 'custom', target: 14, gameId }, rewards: { points: 140, xp: 140 } },
    { name: 'Devoted', description: 'Play 30 days in a row', category: 'consistency' as any, tier: 'platinum', icon: '⭐', criteria: { type: 'custom', target: 30, gameId }, rewards: { points: 300, xp: 300 }, hidden: true },

    { name: 'Speed Runner', description: 'Finish under 5 minutes', category: 'mastery', tier: 'gold', icon: '🚀', criteria: { type: 'speed', target: 1, gameId }, rewards: { points: 80, xp: 80 } },
  ];

  for (const def of defs) {
    await Achievement.updateOne(
      { name: def.name },
      {
        name: def.name,
        description: def.description,
        category: def.category as any,
        tier: def.tier,
        icon: def.icon,
        isHidden: !!def.hidden,
        criteria: {
          type: def.criteria.type as any,
          target: def.criteria.target,
          ...(gameId ? { gameId } : {}),
        },
        rewards: def.rewards,
        metadata: { createdAt: new Date(), updatedAt: new Date(), unlockCount: 0, isActive: true },
      },
      { upsert: true }
    );
  }

  console.log('✅ Seeded Madoku achievements');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
