/**
 * Admin Stats Verification Endpoint
 * 
 * Provides health check and integrity verification for the gamification stats system.
 * Detects discrepancies between source of truth (PlayerSession) and aggregated stats.
 * 
 * Why: Part of two-phase commit refactor to make stats recording failures visible.
 * Enables proactive detection of sync issues before players notice.
 * 
 * GET /api/admin/stats/verify
 * Query params:
 * - playerId (optional): Check specific player
 * - detailed (optional): Include per-player breakdown
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
import Achievement from '@/app/lib/models/achievement';
import Player from '@/app/lib/models/player';

// Why: Type definitions for verification report structure
interface PlayerDiscrepancy {
  playerId: string;
  playerName: string;
  issues: {
    type: 'games_played' | 'wins' | 'losses' | 'points' | 'xp';
    expected: number;
    actual: number;
    difference: number;
  }[];
}

interface VerificationReport {
  timestamp: string; // ISO 8601 with milliseconds
  systemHealth: 'healthy' | 'warning' | 'critical';
  summary: {
    totalPlayers: number;
    playersWithIssues: number;
    totalSessions: number;
    achievementsCount: number;
    activeChallengesCount: number;
    leaderboardsCount: number;
  };
  discrepancies: {
    progressionStats: {
      playersAffected: number;
      totalGapGames: number;
      totalGapPoints: number;
    };
    pointsBalance: {
      playersAffected: number;
      totalMismatch: number;
    };
    leaderboards: {
      staleEntries: number;
      oldestUpdateMinutesAgo: number;
      needingRecalculation: number;
    };
    challenges: {
      missingForToday: boolean;
      lastCreatedAt: string | null;
    };
    achievements: {
      totalInDatabase: number;
      playersEligibleButNotUnlocked: number;
    };
  };
  playerDetails?: PlayerDiscrepancy[];
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Why: Only allow authenticated admin users to access verification
    const session = await auth();
    const { requireAdmin } = await import('@/lib/rbac');
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const detailed = searchParams.get('detailed') === 'true';

    logger.info('Starting stats verification', {
      playerId,
      detailed,
      requestedBy: session.user.id,
    });

    // Why: Build verification report by comparing source of truth against aggregations
    const report: VerificationReport = {
      timestamp: new Date().toISOString(),
      systemHealth: 'healthy',
      summary: {
        totalPlayers: 0,
        playersWithIssues: 0,
        totalSessions: 0,
        achievementsCount: 0,
        activeChallengesCount: 0,
        leaderboardsCount: 0,
      },
      discrepancies: {
        progressionStats: {
          playersAffected: 0,
          totalGapGames: 0,
          totalGapPoints: 0,
        },
        pointsBalance: {
          playersAffected: 0,
          totalMismatch: 0,
        },
        leaderboards: {
          staleEntries: 0,
          oldestUpdateMinutesAgo: 0,
          needingRecalculation: 0,
        },
        challenges: {
          missingForToday: false,
          lastCreatedAt: null,
        },
        achievements: {
          totalInDatabase: 0,
          playersEligibleButNotUnlocked: 0,
        },
      },
    };

    // Why: Get summary counts
    const [totalPlayers, totalSessions, achievementsCount, leaderboardsCount] = await Promise.all([
      Player.countDocuments(playerId ? { _id: playerId } : {}),
      PlayerSession.countDocuments(playerId ? { playerId } : { status: 'completed' }),
      Achievement.countDocuments({ 'metadata.isActive': true }),
      LeaderboardEntry.countDocuments(),
    ]);

    report.summary.totalPlayers = totalPlayers;
    report.summary.totalSessions = totalSessions;
    report.summary.achievementsCount = achievementsCount;
    report.summary.leaderboardsCount = leaderboardsCount;

    // Why: Check if daily challenges exist for today
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const todaysChallenges = await DailyChallenge.find({
      'availability.startTime': { $lte: now },
      'availability.endTime': { $gte: now },
      'availability.isActive': true,
    });

    report.summary.activeChallengesCount = todaysChallenges.length;
    report.discrepancies.challenges.missingForToday = todaysChallenges.length === 0;

    if (todaysChallenges.length > 0) {
      const latestChallenge = todaysChallenges.sort((a, b) => 
        new Date((b as { metadata?: { createdAt?: Date } }).metadata?.createdAt ?? 0).getTime() - new Date((a as { metadata?: { createdAt?: Date } }).metadata?.createdAt ?? 0).getTime()
      )[0];
      const createdAt = (latestChallenge as { metadata?: { createdAt?: Date } }).metadata?.createdAt;
      report.discrepancies.challenges.lastCreatedAt = createdAt ? createdAt.toISOString() : null;
    }

    // Why: Check leaderboard staleness (ILeaderboardEntry uses metadata.lastCalculated)
    const leaderboardEntries = await LeaderboardEntry.find().sort({ 'metadata.lastCalculated': 1 }).limit(1);
    if (leaderboardEntries.length > 0) {
      const oldestEntry = leaderboardEntries[0];
      const lastCalc = (oldestEntry as { metadata?: { lastCalculated?: Date } }).metadata?.lastCalculated;
      const ageMinutes = Math.floor((now.getTime() - new Date(lastCalc ?? 0).getTime()) / 60000);
      report.discrepancies.leaderboards.oldestUpdateMinutesAgo = ageMinutes;
      
      // Why: Flag stale if older than 30 minutes
      if (ageMinutes > 30) {
        report.discrepancies.leaderboards.staleEntries = await LeaderboardEntry.countDocuments({
          'metadata.lastCalculated': { $lt: new Date(now.getTime() - 30 * 60000) },
        });
      }
    }

    // Why: Count entries needing recalculation (if field exists)
    report.discrepancies.leaderboards.needingRecalculation = await LeaderboardEntry.countDocuments({
      needsRecalculation: true,
    });

    // Why: Verify PlayerProgression stats against PlayerSession source of truth
    const playerDiscrepancies: PlayerDiscrepancy[] = [];
    
    const playersToCheck = playerId 
      ? await Player.find({ _id: playerId }).lean()
      : await Player.find({}).lean();

    for (const player of playersToCheck) {
      const discrepancy: PlayerDiscrepancy = {
        playerId: player._id.toString(),
        playerName: player.displayName || 'Anonymous',
        issues: [],
      };

      // Why: Get actual data from PlayerSession (source of truth)
      const sessions = await PlayerSession.find({
        playerId: player._id,
        status: 'completed',
      }).lean();

      const actualStats = {
        gamesPlayed: sessions.length,
        wins: sessions.filter(s => s.gameData.outcome === 'win').length,
        losses: sessions.filter(s => s.gameData.outcome === 'loss').length,
        totalPoints: sessions.reduce((sum, s) => sum + (s.rewards?.pointsEarned || 0), 0),
        totalXP: sessions.reduce((sum, s) => sum + (s.rewards?.xpEarned || 0), 0),
      };

      // Why: Get aggregated data from PlayerProgression
      const progression = await PlayerProgression.findOne({ playerId: player._id }).lean();
      
      if (!progression && sessions.length > 0) {
        // Why: Missing PlayerProgression entirely
        discrepancy.issues.push({
          type: 'games_played',
          expected: actualStats.gamesPlayed,
          actual: 0,
          difference: actualStats.gamesPlayed,
        });
        report.discrepancies.progressionStats.totalGapGames += actualStats.gamesPlayed;
      } else if (progression) {
        const progressionStats = progression.statistics;

        // Why: Compare each stat field
        if (progressionStats.totalGamesPlayed !== actualStats.gamesPlayed) {
          discrepancy.issues.push({
            type: 'games_played',
            expected: actualStats.gamesPlayed,
            actual: progressionStats.totalGamesPlayed,
            difference: actualStats.gamesPlayed - progressionStats.totalGamesPlayed,
          });
          report.discrepancies.progressionStats.totalGapGames += Math.abs(
            actualStats.gamesPlayed - progressionStats.totalGamesPlayed
          );
        }

        if (progressionStats.totalWins !== actualStats.wins) {
          discrepancy.issues.push({
            type: 'wins',
            expected: actualStats.wins,
            actual: progressionStats.totalWins,
            difference: actualStats.wins - progressionStats.totalWins,
          });
        }

        if (progressionStats.totalLosses !== actualStats.losses) {
          discrepancy.issues.push({
            type: 'losses',
            expected: actualStats.losses,
            actual: progressionStats.totalLosses,
            difference: actualStats.losses - progressionStats.totalLosses,
          });
        }

        // Why: Check total points earned (PlayerProgression may not have lifetimeStats; use 0 if missing)
        const expectedTotalPointsEarned = (progression as { statistics?: { lifetimeStats?: { totalPointsEarned?: number } } })?.statistics?.lifetimeStats?.totalPointsEarned ?? 0;
        if (expectedTotalPointsEarned !== actualStats.totalPoints) {
          discrepancy.issues.push({
            type: 'points',
            expected: actualStats.totalPoints,
            actual: expectedTotalPointsEarned,
            difference: actualStats.totalPoints - expectedTotalPointsEarned,
          });
          report.discrepancies.progressionStats.totalGapPoints += Math.abs(
            actualStats.totalPoints - expectedTotalPointsEarned
          );
        }
      }

      // Why: Verify PointsWallet balance matches PointsTransaction history
      const [wallet, transactions] = await Promise.all([
        PointsWallet.findOne({ playerId: player._id }).lean(),
        PointsTransaction.find({ playerId: player._id }).lean(),
      ]);

      const transactionSum = transactions.reduce((sum, tx) => {
        return sum + (tx.type === 'earn' ? tx.amount : -tx.amount);
      }, 0);

      const walletBalance = wallet?.currentBalance ?? 0;

      if (walletBalance !== transactionSum) {
        discrepancy.issues.push({
          type: 'points',
          expected: transactionSum,
          actual: walletBalance,
          difference: transactionSum - walletBalance,
        });
        report.discrepancies.pointsBalance.totalMismatch += Math.abs(transactionSum - walletBalance);
      }

      // Why: Add player to discrepancies list if any issues found
      if (discrepancy.issues.length > 0) {
        report.summary.playersWithIssues++;
        
        if (discrepancy.issues.some(i => ['games_played', 'wins', 'losses'].includes(i.type))) {
          report.discrepancies.progressionStats.playersAffected++;
        }
        
        if (discrepancy.issues.some(i => i.type === 'points')) {
          report.discrepancies.pointsBalance.playersAffected++;
        }

        if (detailed) {
          playerDiscrepancies.push(discrepancy);
        }
      }
    }

    if (detailed) {
      report.playerDetails = playerDiscrepancies;
    }

    // Why: Determine overall system health based on discrepancies
    if (report.summary.playersWithIssues > 0 || report.discrepancies.challenges.missingForToday) {
      report.systemHealth = 'warning';
    }

    if (
      report.discrepancies.progressionStats.playersAffected > report.summary.totalPlayers * 0.1 || // >10% affected
      report.discrepancies.leaderboards.staleEntries > 5 ||
      report.discrepancies.challenges.missingForToday
    ) {
      report.systemHealth = 'critical';
    }

    const durationMs = Date.now() - startTime;

    logger.info('Stats verification completed', {
      systemHealth: report.systemHealth,
      playersWithIssues: report.summary.playersWithIssues,
      durationMs,
    });

    return NextResponse.json(report, { status: 200 });

  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Stats verification failed', {
      error: err.message,
      stack: err.stack,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        error: 'Verification failed',
        message: err.message,
      },
      { status: 500 }
    );
  }
}
