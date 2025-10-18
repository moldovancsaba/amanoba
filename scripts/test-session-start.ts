import { config } from 'dotenv';
import mongoose from 'mongoose';

config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'amanoba';

async function testSessionStart() {
  try {
    await mongoose.connect(MONGODB_URI!, { dbName: DB_NAME });
    console.log('✅ Connected to MongoDB\n');

    // Get the most recently active player
    const Player = mongoose.model('Player', new mongoose.Schema({}, { strict: false }));
    const player = await Player.findOne().sort({ lastSeenAt: -1 }).lean();
    
    if (!player) {
      console.error('❌ No players found');
      process.exit(1);
    }

    console.log(`📋 Testing with player: ${player.displayName} (ID: ${player._id})`);
    
    // Try to start a session
    const { startGameSession } = await import('../app/lib/gamification/session-manager.js');
    const { default: Game } = await import('../app/lib/models/game.js');
    
    // Find or create QUIZZZ game
    let game = await Game.findOne({ gameId: 'QUIZZZ' });
    if (!game) {
      console.log('Creating QUIZZZ game...');
      game = await Game.create({
        gameId: 'QUIZZZ',
        name: 'QUIZZZ',
        type: 'QUIZZZ',
        description: 'Rapid-fire trivia quiz',
        isActive: true,
        requiresAuth: true,
        isPremium: false,
        minPlayers: 1,
        maxPlayers: 1,
        averageDurationSeconds: 180,
        pointsConfig: { winPoints: 45, losePoints: 5, participationPoints: 5, perfectGameBonus: 25 },
        xpConfig: { winXP: 35, loseXP: 5, participationXP: 5 },
        difficultyLevels: ['EASY','MEDIUM','HARD','EXPERT'],
      });
    }
    
    console.log(`🎮 Game found: ${game.name} (ID: ${game._id})\n`);
    
    // Get brandId
    const brandId = player.brandId || (await mongoose.model('Brand', new mongoose.Schema({}, { strict: false })).findOne({ isActive: true }))._id;
    
    console.log('🚀 Starting session...');
    const sessionId = await startGameSession({
      playerId: player._id,
      gameId: game._id,
      brandId,
    });
    
    console.log(`✅ Session created: ${sessionId}\n`);
    
    // Verify it was created
    const PlayerSession = mongoose.model('PlayerSession', new mongoose.Schema({}, { strict: false }));
    const session = await PlayerSession.findById(sessionId).lean();
    console.log('📋 Session details:', JSON.stringify(session, null, 2));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSessionStart();
