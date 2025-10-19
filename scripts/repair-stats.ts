/**
 * Stats Repair Script
 * 
 * Purpose: Rebuild all stats from source of truth (PlayerSession)
 * Why: Fix discrepancies between actual game data and aggregated stats
 * 
 * Usage:
 *   npm run repair:stats -- --players all
 *   npm run repair:stats -- --players 507f1f77bcf86cd799439011
 *   npm run repair:stats -- --dry-run
 *   npm run repair:stats -- --players all --skip-leaderboards
 * 
 * Safety:
 * - Dry run mode to preview changes
 * - Logs all changes to EventLog
 * - Detailed report of fixes applied
 * - Backup recommendations
 * 
 * Part of two-phase commit architecture (Phase 5)
 */

import { config } from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import PlayerSession from '../app/lib/models/player-session';
import PlayerProgression from '../app/lib/models/player-progression';
import PointsWallet from '../app/lib/models/points-wallet';
import PointsTransaction from '../app/lib/models/points-transaction';
import LeaderboardEntry from '../app/lib/models/leaderboard-entry';
import Player from '../app/lib/models/player';
import EventLog from '../app/lib/models/event-log';
import { calculateLeaderboard } from '../app/lib/gamification/leaderboard-calculator';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

// Why: CLI argument interface
interface RepairOptions {
  players: 'all' | string; // 'all' or specific playerId
  dryRun: boolean;
  skipLeaderboards: boolean;
  skipChallenges: boolean;
  verbose: boolean;
}

// Why: Repair result tracking
interface RepairReport {
  timestamp: string;
  dryRun: boolean;
  playersProcessed: number;
  progressionFixed: number;
  pointsFixed: number;
  leaderboardsRecalculated: number;
  challengesBackfilled: number;
  totalChanges: number;
  errors: Array<{ playerId: string; error: string }>;
  details: Array<{
    playerId: string;
    playerName: string;
    changes: string[];
  }>;
}

/**
 * Parse CLI arguments
 */
function parseArgs(): RepairOptions {
  const args = process.argv.slice(2);
  const options: RepairOptions = {
    players: 'all',
    dryRun: false,
    skipLeaderboards: false,
    skipChallenges: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--players' && args[i + 1]) {
      options.players = args[i + 1];
      i++;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--skip-leaderboards') {
      options.skipLeaderboards = true;
    } else if (arg === '--skip-challenges') {
      options.skipChallenges = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    }
  }

  return options;
}

/**
 * Repair PlayerProgression stats from PlayerSession source of truth
 */
async function repairPlayerProgression(
  playerId: mongoose.Types.ObjectId,
  playerName: string,
  dryRun: boolean,
  verbose: boolean
): Promise<string[]> {
  const changes: string[] = [];

  // Why: Get all completed sessions for this player (source of truth)
  const sessions = await PlayerSession.find({
    playerId,
    status: 'completed',
  }).lean();

  if (sessions.length === 0) {
    if (verbose) {
      console.log(`  ℹ️  No sessions found for ${playerName}`);
    }
    return changes;
  }

  // Why: Calculate actual stats from sessions
  const actualStats = {
    totalGamesPlayed: sessions.length,
    totalWins: sessions.filter(s => s.gameData.outcome === 'win').length,
    totalLosses: sessions.filter(s => s.gameData.outcome === 'loss').length,
    totalDraws: sessions.filter(s => s.gameData.outcome === 'draw').length,
    totalPointsEarned: sessions.reduce((sum, s) => sum + (s.rewards?.pointsEarned || 0), 0),
    totalXPEarned: sessions.reduce((sum, s) => sum + (s.rewards?.xpEarned || 0), 0),
    totalPlayTime: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
  };

  // Why: Calculate high scores per game type
  const gameTypes = [...new Set(sessions.map(s => s.gameId.toString()))];
  const highScores: Record<string, number> = {};
  
  for (const gameId of gameTypes) {
    const gameSessions = sessions.filter(s => s.gameId.toString() === gameId);
    const maxScore = Math.max(...gameSessions.map(s => s.gameData.finalScore || 0));
    highScores[gameId] = maxScore;
  }

  // Why: Get current progression
  const currentProgression = await PlayerProgression.findOne({ playerId });

  // Why: Check for discrepancies
  if (!currentProgression) {
    changes.push(`Missing PlayerProgression - would create with ${actualStats.totalGamesPlayed} games`);
  } else {
    if (currentProgression.statistics.totalGamesPlayed !== actualStats.totalGamesPlayed) {
      changes.push(
        `Games played: ${currentProgression.statistics.totalGamesPlayed} → ${actualStats.totalGamesPlayed} (${actualStats.totalGamesPlayed > currentProgression.statistics.totalGamesPlayed ? '+' : ''}${actualStats.totalGamesPlayed - currentProgression.statistics.totalGamesPlayed})`
      );
    }

    if (currentProgression.statistics.totalWins !== actualStats.totalWins) {
      changes.push(
        `Wins: ${currentProgression.statistics.totalWins} → ${actualStats.totalWins} (${actualStats.totalWins > currentProgression.statistics.totalWins ? '+' : ''}${actualStats.totalWins - currentProgression.statistics.totalWins})`
      );
    }

    if (currentProgression.statistics.totalLosses !== actualStats.totalLosses) {
      changes.push(
        `Losses: ${currentProgression.statistics.totalLosses} → ${actualStats.totalLosses} (${actualStats.totalLosses > currentProgression.statistics.totalLosses ? '+' : ''}${actualStats.totalLosses - currentProgression.statistics.totalLosses})`
      );
    }

    const currentTotalPointsEarned = currentProgression.lifetimeStats?.totalPointsEarned || 0;
    if (currentTotalPointsEarned !== actualStats.totalPointsEarned) {
      changes.push(
        `Points earned: ${currentTotalPointsEarned} → ${actualStats.totalPointsEarned} (${actualStats.totalPointsEarned > currentTotalPointsEarned ? '+' : ''}${actualStats.totalPointsEarned - currentTotalPointsEarned})`
      );
    }
  }

  // Why: Apply changes if not dry run
  if (changes.length > 0 && !dryRun) {
    const averageSessionTime = actualStats.totalGamesPlayed > 0
      ? actualStats.totalPlayTime / actualStats.totalGamesPlayed
      : 0;

    await PlayerProgression.findOneAndUpdate(
      { playerId },
      {
        $set: {
          'statistics.totalGamesPlayed': actualStats.totalGamesPlayed,
          'statistics.totalWins': actualStats.totalWins,
          'statistics.totalLosses': actualStats.totalLosses,
          'statistics.totalDraws': actualStats.totalDraws,
          'statistics.totalPlayTime': actualStats.totalPlayTime,
          'statistics.averageSessionTime': averageSessionTime,
          'statistics.highScores': highScores,
          'lifetimeStats.totalPointsEarned': actualStats.totalPointsEarned,
          'lifetimeStats.totalXPEarned': actualStats.totalXPEarned,
          lastSyncedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // Why: Log repair event for audit trail
    await EventLog.create({
      playerId,
      eventType: 'stats_repair',
      eventData: {
        repairType: 'progression',
        statsUpdated: actualStats,
        source: 'cli_script',
      },
      timestamp: new Date(),
    });
  }

  return changes;
}

/**
 * Repair PointsWallet balance from PointsTransaction source of truth
 */
async function repairPointsWallet(
  playerId: mongoose.Types.ObjectId,
  playerName: string,
  dryRun: boolean,
  verbose: boolean
): Promise<string[]> {
  const changes: string[] = [];

  // Why: Calculate balance from transaction history (source of truth)
  const transactions = await PointsTransaction.find({ playerId }).lean();
  
  const calculatedBalance = transactions.reduce((sum, tx) => {
    return sum + (tx.type === 'earned' ? tx.amount : -tx.amount);
  }, 0);

  const calculatedLifetimeEarned = transactions
    .filter(tx => tx.type === 'earned')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const calculatedLifetimeSpent = transactions
    .filter(tx => tx.type === 'spent')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Why: Get current wallet
  const currentWallet = await PointsWallet.findOne({ playerId });

  if (!currentWallet) {
    if (transactions.length > 0) {
      changes.push(
        `Missing PointsWallet - would create with balance=${calculatedBalance}, earned=${calculatedLifetimeEarned}`
      );
    }
  } else {
    if (currentWallet.currentBalance !== calculatedBalance) {
      changes.push(
        `Balance: ${currentWallet.currentBalance} → ${calculatedBalance} (${calculatedBalance > currentWallet.currentBalance ? '+' : ''}${calculatedBalance - currentWallet.currentBalance})`
      );
    }

    if (currentWallet.lifetimeEarned !== calculatedLifetimeEarned) {
      changes.push(
        `Lifetime earned: ${currentWallet.lifetimeEarned} → ${calculatedLifetimeEarned} (${calculatedLifetimeEarned > currentWallet.lifetimeEarned ? '+' : ''}${calculatedLifetimeEarned - currentWallet.lifetimeEarned})`
      );
    }
  }

  // Why: Apply changes if not dry run
  if (changes.length > 0 && !dryRun) {
    await PointsWallet.findOneAndUpdate(
      { playerId },
      {
        $set: {
          currentBalance: calculatedBalance,
          lifetimeEarned: calculatedLifetimeEarned,
          lifetimeSpent: calculatedLifetimeSpent,
          lastUpdatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    await EventLog.create({
      playerId,
      eventType: 'stats_repair',
      eventData: {
        repairType: 'points_wallet',
        oldBalance: currentWallet?.currentBalance || 0,
        newBalance: calculatedBalance,
        source: 'cli_script',
      },
      timestamp: new Date(),
    });
  }

  return changes;
}

/**
 * Main repair function
 */
async function repairStats() {
  const options = parseArgs();
  
  console.log('\n🔧 STATS REPAIR SCRIPT');
  console.log('═'.repeat(80));
  console.log(`Mode: ${options.dryRun ? '🔍 DRY RUN (no changes will be made)' : '✏️  WRITE MODE (changes will be applied)'}`);
  console.log(`Players: ${options.players}`);
  console.log(`Skip leaderboards: ${options.skipLeaderboards}`);
  console.log(`Skip challenges: ${options.skipChallenges}`);
  console.log(`Verbose: ${options.verbose}`);
  console.log('═'.repeat(80));
  console.log();

  if (!options.dryRun) {
    console.log('⚠️  WARNING: This will modify database records!');
    console.log('⚠️  Recommended: Create a database backup before proceeding');
    console.log();
  }

  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Initialize report
    const report: RepairReport = {
      timestamp: new Date().toISOString(),
      dryRun: options.dryRun,
      playersProcessed: 0,
      progressionFixed: 0,
      pointsFixed: 0,
      leaderboardsRecalculated: 0,
      challengesBackfilled: 0,
      totalChanges: 0,
      errors: [],
      details: [],
    };

    // Get players to repair
    const playersQuery = options.players === 'all'
      ? {}
      : { _id: new mongoose.Types.ObjectId(options.players) };

    const players = await Player.find(playersQuery).lean();
    
    console.log(`Found ${players.length} player(s) to process\n`);

    // Process each player
    for (const player of players) {
      report.playersProcessed++;
      
      const playerName = player.displayName || player.username || 'Anonymous';
      console.log(`\n[${ report.playersProcessed}/${players.length}] Processing ${playerName} (${player._id})`);
      console.log('─'.repeat(80));

      const playerChanges: string[] = [];

      try {
        // Repair PlayerProgression
        const progressionChanges = await repairPlayerProgression(
          player._id,
          playerName,
          options.dryRun,
          options.verbose
        );
        
        if (progressionChanges.length > 0) {
          report.progressionFixed++;
          playerChanges.push(...progressionChanges.map(c => `[Progression] ${c}`));
          console.log(`  📊 Progression: ${progressionChanges.length} change(s)`);
          if (options.verbose) {
            progressionChanges.forEach(c => console.log(`     - ${c}`));
          }
        } else {
          console.log(`  ✓ Progression: No changes needed`);
        }

        // Repair PointsWallet
        const pointsChanges = await repairPointsWallet(
          player._id,
          playerName,
          options.dryRun,
          options.verbose
        );
        
        if (pointsChanges.length > 0) {
          report.pointsFixed++;
          playerChanges.push(...pointsChanges.map(c => `[Points] ${c}`));
          console.log(`  💰 Points: ${pointsChanges.length} change(s)`);
          if (options.verbose) {
            pointsChanges.forEach(c => console.log(`     - ${c}`));
          }
        } else {
          console.log(`  ✓ Points: No changes needed`);
        }

        // Add to report details if changes were made
        if (playerChanges.length > 0) {
          report.details.push({
            playerId: player._id.toString(),
            playerName,
            changes: playerChanges,
          });
          report.totalChanges += playerChanges.length;
        }

      } catch (error) {
        const err = error as Error;
        console.log(`  ❌ Error: ${err.message}`);
        report.errors.push({
          playerId: player._id.toString(),
          error: err.message,
        });
      }
    }

    // Recalculate leaderboards
    if (!options.skipLeaderboards && !options.dryRun) {
      console.log('\n\n📊 RECALCULATING LEADERBOARDS');
      console.log('═'.repeat(80));

      const leaderboardTypes = [
        { type: 'points_balance' as const, period: 'all_time' as const, name: 'Points Balance' },
        { type: 'xp_total' as const, period: 'all_time' as const, name: 'Total XP' },
        { type: 'win_streak' as const, period: 'all_time' as const, name: 'Win Streak' },
        { type: 'games_won' as const, period: 'all_time' as const, name: 'Games Won' },
        { type: 'level' as const, period: 'all_time' as const, name: 'Level' },
      ];

      for (const lb of leaderboardTypes) {
        try {
          console.log(`  Recalculating ${lb.name}...`);
          await calculateLeaderboard({
            type: lb.type,
            period: lb.period,
            limit: 100,
          });
          report.leaderboardsRecalculated++;
          console.log(`  ✓ ${lb.name} recalculated`);
        } catch (error) {
          const err = error as Error;
          console.log(`  ❌ Failed to recalculate ${lb.name}: ${err.message}`);
          report.errors.push({
            playerId: 'SYSTEM',
            error: `Leaderboard ${lb.name}: ${err.message}`,
          });
        }
      }
    }

    // Print summary report
    console.log('\n\n📋 REPAIR SUMMARY');
    console.log('═'.repeat(80));
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Mode: ${report.dryRun ? 'DRY RUN' : 'WRITE'}`);
    console.log(`Players processed: ${report.playersProcessed}`);
    console.log(`Total changes: ${report.totalChanges}`);
    console.log(`  - Progression fixed: ${report.progressionFixed} player(s)`);
    console.log(`  - Points fixed: ${report.pointsFixed} player(s)`);
    console.log(`  - Leaderboards recalculated: ${report.leaderboardsRecalculated}`);
    console.log(`Errors: ${report.errors.length}`);
    console.log('═'.repeat(80));

    if (report.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      report.errors.forEach(e => {
        console.log(`  - ${e.playerId}: ${e.error}`);
      });
    }

    if (report.dryRun && report.totalChanges > 0) {
      console.log('\n💡 This was a dry run. To apply changes, run without --dry-run flag');
    }

    if (!report.dryRun && report.totalChanges > 0) {
      console.log('\n✅ Changes applied successfully');
      console.log('💾 All changes logged to EventLog collection');
    }

    if (report.totalChanges === 0 && report.errors.length === 0) {
      console.log('\n✨ All stats are correct! No repairs needed.');
    }

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the repair script
repairStats();
