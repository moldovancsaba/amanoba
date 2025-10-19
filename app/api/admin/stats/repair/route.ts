/**
 * Admin Stats Repair Trigger Endpoint
 * 
 * Triggers manual repair of stats discrepancies by rebuilding from source of truth.
 * Should be used after identifying issues via /api/admin/stats/verify endpoint.
 * 
 * Why: Provides admin interface to fix stats without running CLI scripts.
 * Rebuilds PlayerProgression, PointsWallet, Leaderboards, and Challenges from PlayerSession data.
 * 
 * POST /api/admin/stats/repair
 * Body:
 * - playerId (optional): Repair specific player only
 * - repairTypes (optional): Array of ['progression', 'points', 'leaderboards', 'challenges']
 * - dryRun (optional): Preview changes without applying
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/app/lib/mongodb';
import logger from '@/app/lib/logger';
import PlayerSession from '@/app/lib/models/player-session';
import PlayerProgression from '@/app/lib/models/player-progression';
import PointsWallet from '@/app/lib/models/points-wallet';
import PointsTransaction from '@/app/lib/models/points-transaction';
import LeaderboardEntry from '@/app/lib/models/leaderboard-entry';
import DailyChallenge from '@/app/lib/models/daily-challenge';
import Player from '@/app/lib/models/player';
import EventLog from '@/app/lib/models/event-log';
import mongoose from 'mongoose';

// Why: Type definitions for repair request and response
interface RepairRequest {
  playerId?: string;
  repairTypes?: ('progression' | 'points' | 'leaderboards' | 'challenges')[];
  dryRun?: boolean;
}

interface RepairResult {
  timestamp: string; // ISO 8601 with milliseconds
  dryRun: boolean;
  summary: {
    playersProcessed: number;
    progressionFixed: number;
    pointsFixed: number;
    leaderboardsRecalculated: number;
    challengesBackfilled: number;
  };
  details: {
    playerId: string;
    playerName: string;
    changes: string[];
  }[];
  errors: {
    playerId: string;
    error: string;
  }[];
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Why: Only allow authenticated admin users to trigger repairs
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Add admin role check when role system implemented
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    await dbConnect();

    const body: RepairRequest = await request.json();
    const { playerId, repairTypes = ['progression', 'points', 'leaderboards'], dryRun = false } = body;

    logger.info('Starting stats repair', {
      playerId,
      repairTypes,
      dryRun,
      requestedBy: session.user.id,
    });

    const result: RepairResult = {
      timestamp: new Date().toISOString(),
      dryRun,
      summary: {
        playersProcessed: 0,
        progressionFixed: 0,
        pointsFixed: 0,
        leaderboardsRecalculated: 0,
        challengesBackfilled: 0,
      },
      details: [],
      errors: [],
    };

    // Why: Get list of players to repair
    const playersToRepair = playerId
      ? await Player.find({ _id: playerId }).lean()
      : await Player.find({}).lean();

    // Why: Process each player sequentially to avoid overwhelming database
    for (const player of playersToRepair) {
      result.summary.playersProcessed++;
      
      const playerDetail = {
        playerId: player._id.toString(),
        playerName: player.displayName || 'Anonymous',
        changes: [] as string[],
      };

      try {
        // Why: Get all completed sessions for this player (source of truth)
        const sessions = await PlayerSession.find({
          playerId: player._id,
          status: 'completed',
        }).lean();

        // Why: Repair PlayerProgression stats
        if (repairTypes.includes('progression') && sessions.length > 0) {
          const actualStats = {
            totalGamesPlayed: sessions.length,
            wins: sessions.filter(s => s.gameData.outcome === 'win').length,
            losses: sessions.filter(s => s.gameData.outcome === 'loss').length,
            draws: sessions.filter(s => s.gameData.outcome === 'draw').length,
            totalPointsEarned: sessions.reduce((sum, s) => sum + (s.rewards?.pointsEarned || 0), 0),
            totalXPEarned: sessions.reduce((sum, s) => sum + (s.rewards?.xpEarned || 0), 0),
          };

          // Why: Calculate high scores per game type
          const gameTypes = [...new Set(sessions.map(s => s.gameType))];
          const highScores: Record<string, number> = {};
          
          for (const gameType of gameTypes) {
            const gameSessions = sessions.filter(s => s.gameType === gameType);
            const maxScore = Math.max(...gameSessions.map(s => s.gameData.finalScore || 0));
            highScores[gameType] = maxScore;
          }

          // Why: Get current progression or create new one
          const currentProgression = await PlayerProgression.findOne({ playerId: player._id });

          const needsUpdate = !currentProgression || 
            currentProgression.statistics.totalGamesPlayed !== actualStats.totalGamesPlayed ||
            currentProgression.statistics.wins !== actualStats.wins;

          if (needsUpdate) {
            if (!dryRun) {
              // Why: Update progression with calculated stats
              await PlayerProgression.findOneAndUpdate(
                { playerId: player._id },
                {
                  $set: {
                    'statistics.totalGamesPlayed': actualStats.totalGamesPlayed,
                    'statistics.wins': actualStats.wins,
                    'statistics.losses': actualStats.losses,
                    'statistics.draws': actualStats.draws,
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
                playerId: player._id,
                eventType: 'stats_repair',
                eventData: {
                  repairType: 'progression',
                  statsUpdated: actualStats,
                  triggeredBy: session.user.id,
                },
                timestamp: new Date(),
              });
            }

            playerDetail.changes.push(
              `PlayerProgression: ${actualStats.totalGamesPlayed} games, ${actualStats.wins} wins, ${actualStats.totalPointsEarned} points earned`
            );
            result.summary.progressionFixed++;
          }
        }

        // Why: Repair PointsWallet balance from transaction history
        if (repairTypes.includes('points')) {
          const transactions = await PointsTransaction.find({ playerId: player._id }).lean();
          const calculatedBalance = transactions.reduce((sum, tx) => {
            return sum + (tx.type === 'earned' ? tx.amount : -tx.amount);
          }, 0);

          const currentWallet = await PointsWallet.findOne({ playerId: player._id });
          const currentBalance = currentWallet?.balance || 0;

          if (currentBalance !== calculatedBalance) {
            if (!dryRun) {
              await PointsWallet.findOneAndUpdate(
                { playerId: player._id },
                {
                  $set: {
                    balance: calculatedBalance,
                    lastUpdatedAt: new Date(),
                  },
                },
                { upsert: true, new: true }
              );

              await EventLog.create({
                playerId: player._id,
                eventType: 'stats_repair',
                eventData: {
                  repairType: 'points_balance',
                  oldBalance: currentBalance,
                  newBalance: calculatedBalance,
                  difference: calculatedBalance - currentBalance,
                  triggeredBy: session.user.id,
                },
                timestamp: new Date(),
              });
            }

            playerDetail.changes.push(
              `PointsWallet: ${currentBalance} → ${calculatedBalance} (${calculatedBalance > currentBalance ? '+' : ''}${calculatedBalance - currentBalance})`
            );
            result.summary.pointsFixed++;
          }
        }

        // Why: Add player detail if any changes made
        if (playerDetail.changes.length > 0) {
          result.details.push(playerDetail);
        }

      } catch (error: unknown) {
        const err = error as Error;
        logger.error('Failed to repair player stats', {
          playerId: player._id,
          error: err.message,
        });

        result.errors.push({
          playerId: player._id.toString(),
          error: err.message,
        });
      }
    }

    // Why: Recalculate leaderboards after all player stats fixed
    if (repairTypes.includes('leaderboards') && !dryRun) {
      try {
        // Why: Import dynamically to avoid circular dependencies
        const { calculateLeaderboard } = await import('@/app/lib/gamification/leaderboard-calculator');
        
        // Why: Recalculate all major leaderboards
        const leaderboardTypes = [
          { type: 'points_balance' as const, period: 'all_time' as const },
          { type: 'xp_total' as const, period: 'all_time' as const },
          { type: 'win_streak' as const, period: 'all_time' as const },
        ];

        for (const lb of leaderboardTypes) {
          await calculateLeaderboard({
            type: lb.type,
            period: lb.period,
            limit: 100,
          });
          result.summary.leaderboardsRecalculated++;
        }

        logger.info('Leaderboards recalculated', {
          count: leaderboardTypes.length,
        });

      } catch (error: unknown) {
        const err = error as Error;
        logger.error('Failed to recalculate leaderboards', {
          error: err.message,
        });
        result.errors.push({
          playerId: 'SYSTEM',
          error: `Leaderboard recalculation failed: ${err.message}`,
        });
      }
    }

    const durationMs = Date.now() - startTime;

    logger.info('Stats repair completed', {
      dryRun,
      playersProcessed: result.summary.playersProcessed,
      progressionFixed: result.summary.progressionFixed,
      pointsFixed: result.summary.pointsFixed,
      errorsCount: result.errors.length,
      durationMs,
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Stats repair failed', {
      error: err.message,
      stack: err.stack,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        error: 'Repair failed',
        message: err.message,
      },
      { status: 500 }
    );
  }
}
