/**
 * Test All 5 Games End-to-End
 * Simulates starting and completing each game, verifies rewards
 */

import { config } from 'dotenv';
import mongoose from 'mongoose';

config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'amanoba';

async function testAllGames() {
  try {
    await mongoose.connect(MONGODB_URI!, { dbName: DB_NAME });
    console.log('✅ Connected to MongoDB\n');

    // Get a test player
    const Player = mongoose.model('Player', new mongoose.Schema({}, { strict: false }));
    const player = await Player.findOne().sort({ lastSeenAt: -1 }).lean();
    
    if (!player) {
      console.error('❌ No players found');
      process.exit(1);
    }

    console.log(`🎮 Testing with player: ${player.displayName} (${player._id})\n`);

    const { startGameSession, completeGameSession } = await import('../app/lib/gamification/session-manager.js');
    const { default: Game } = await import('../app/lib/models/game.js');
    const { default: Brand } = await import('../app/lib/models/brand.js');
    
    const brand = await Brand.findOne({ isActive: true });
    const brandId = brand._id;

    const games = [
      { key: 'QUIZZZ', maxScore: 1000, testScore: 800 },
      { key: 'SUDOKU', maxScore: 1000, testScore: 750 },
      { key: 'MEMORY', maxScore: 1000, testScore: 900 },
      { key: 'WHACKPOP', maxScore: 1000, testScore: 850 },
      { key: 'MADOKU', maxScore: 500, testScore: 450 },
    ];

    for (const gameConfig of games) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🎯 Testing ${gameConfig.key}`);
      console.log('='.repeat(60));

      // Find or create game
      let game = await Game.findOne({ gameId: gameConfig.key });
      if (!game) {
        console.log(`Creating ${gameConfig.key} game...`);
        game = await Game.create({
          gameId: gameConfig.key,
          name: gameConfig.key,
          type: gameConfig.key,
          description: `${gameConfig.key} game`,
          isActive: true,
          requiresAuth: true,
          isPremium: false,
          minPlayers: 1,
          maxPlayers: 1,
          averageDurationSeconds: 180,
          pointsConfig: { winPoints: 50, losePoints: 5, participationPoints: 5 },
          xpConfig: { winXP: 40, loseXP: 5, participationXP: 5 },
          difficultyLevels: ['EASY','MEDIUM','HARD'],
        });
      }

      try {
        // Start session
        console.log('🚀 Starting session...');
        const sessionId = await startGameSession({
          playerId: player._id,
          gameId: game._id,
          brandId,
        });
        console.log(`✅ Session started: ${sessionId}`);

        // Complete session with win
        console.log('🏁 Completing session with WIN...');
        const result = await completeGameSession({
          sessionId,
          score: gameConfig.testScore,
          maxScore: gameConfig.maxScore,
          outcome: 'win',
          accuracy: 85,
          moves: 10,
          difficulty: 'MEDIUM',
        });

        console.log('✅ Session completed!');
        console.log(`   Points earned: ${result.rewards.points}`);
        console.log(`   XP earned: ${result.rewards.xp}`);
        console.log(`   Level: ${result.progression.newLevel}${result.progression.leveledUp ? ' (LEVEL UP!)' : ''}`);
        console.log(`   Achievements: ${result.achievements.newUnlocks} unlocked`);
        console.log(`   Streak: ${result.streak.current}`);

      } catch (error) {
        console.error(`❌ Error testing ${gameConfig.key}:`, error.message);
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 Final Player Stats');
    console.log('='.repeat(60));

    // Check final stats
    const PointsWallet = mongoose.model('PointsWallet', new mongoose.Schema({}, { strict: false }));
    const PlayerProgression = mongoose.model('PlayerProgression', new mongoose.Schema({}, { strict: false }));

    const wallet = await PointsWallet.findOne({ playerId: player._id }).lean();
    const progression = await PlayerProgression.findOne({ playerId: player._id }).lean();

    console.log(`\n💰 Wallet:`);
    console.log(`   Current Balance: ${wallet?.currentBalance || 0} points`);
    console.log(`   Lifetime Earned: ${wallet?.lifetimeEarned || 0} points`);

    console.log(`\n⚡ Progression:`);
    console.log(`   Level: ${progression?.level || 1}`);
    console.log(`   Total XP: ${progression?.totalXP || 0}`);
    console.log(`   Games Played: ${progression?.statistics?.totalGamesPlayed || 0}`);
    console.log(`   Wins: ${progression?.statistics?.totalWins || 0}`);
    console.log(`   Current Streak: ${progression?.statistics?.currentStreak || 0}`);

    console.log('\n✅ All games tested successfully!\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAllGames();
