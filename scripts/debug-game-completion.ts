/**
 * Debug Game Completion Flow
 * Check if game sessions are being created and completed
 */

import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'amanoba';

async function debugGameCompletion() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment');
    }

    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log('✅ Connected to MongoDB\n');

    // Get the latest player session
    const PlayerSession = mongoose.model('PlayerSession', new mongoose.Schema({}, { strict: false }));
    const latestSession = await PlayerSession.findOne().sort({ createdAt: -1 }).lean();
    
    console.log('📋 Latest Player Session:');
    console.log(JSON.stringify(latestSession, null, 2));
    console.log('\n');

    // Get latest PointsTransaction
    const PointsTransaction = mongoose.model('PointsTransaction', new mongoose.Schema({}, { strict: false }));
    const latestTransaction = await PointsTransaction.findOne().sort({ 'metadata.createdAt': -1 }).lean();
    
    console.log('💰 Latest Points Transaction:');
    console.log(JSON.stringify(latestTransaction, null, 2));
    console.log('\n');

    // Get latest PlayerProgression
    const PlayerProgression = mongoose.model('PlayerProgression', new mongoose.Schema({}, { strict: false }));
    const latestProgression = await PlayerProgression.findOne().sort({ 'metadata.updatedAt': -1 }).lean();
    
    console.log('⚡ Latest Player Progression:');
    console.log(JSON.stringify(latestProgression, null, 2));
    console.log('\n');

    // Get latest EventLog entries
    const EventLog = mongoose.model('EventLog', new mongoose.Schema({}, { strict: false }));
    const latestEvents = await EventLog.find().sort({ timestamp: -1 }).limit(5).lean();
    
    console.log('📝 Latest 5 Event Logs:');
    latestEvents.forEach((event, i) => {
      console.log(`${i + 1}. ${event.eventType} - ${event.timestamp}`);
      console.log(JSON.stringify(event, null, 2));
    });

    await mongoose.disconnect();
    console.log('\n✅ Debug complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugGameCompletion();
