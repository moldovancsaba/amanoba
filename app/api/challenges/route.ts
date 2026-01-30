import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import { DailyChallenge, PlayerChallengeProgress } from '@/lib/models/daily-challenge';
import { PlayerSession } from '@/lib/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { ensureDailyChallengesForToday } from '@/lib/gamification/daily-challenge-service';

/**
 * GET /api/challenges
 * 
 * Why: Fetch today's challenges with player progress
 * What: Returns active challenges and player's progress on each
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get today's date range (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

// Fetch or create today's active challenges via shared service
    const ensured = await ensureDailyChallengesForToday();
    const challenges = ensured.challenges;

    // Fetch player's progress on these challenges (ensure ObjectId match)
    const challengeIds = challenges.map(c => c._id);
    let playerObjectId: mongoose.Types.ObjectId | null = null;
    try {
      playerObjectId = new mongoose.Types.ObjectId(playerId);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid playerId' },
        { status: 400 }
      );
    }

    let progressRecords = await PlayerChallengeProgress.find({
      playerId: playerObjectId,
      challengeId: { $in: challengeIds },
    });

    // Optional backfill: if progress is missing or zero, compute from today's sessions
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

      const sessions = await PlayerSession.find({
        playerId: playerObjectId,
        status: 'completed',
        sessionEnd: { $gte: today, $lt: tomorrow },
      }).select('rewards pointsEarned gameData.outcome outcome');

      if (sessions.length > 0) {
        const totals = {
          gamesPlayed: sessions.length,
          gamesWon: sessions.filter((s: { gameData?: { outcome?: string }; outcome?: string }) => (s.gameData?.outcome || s.outcome) === 'win').length,
          pointsEarned: sessions.reduce((sum: number, s: { rewards?: { pointsEarned?: number } }) => sum + (s.rewards?.pointsEarned || 0), 0),
          xpEarned: sessions.reduce((sum: number, s: { rewards?: { xpEarned?: number } }) => sum + (s.rewards?.xpEarned || 0), 0),
        };

        for (const ch of challenges) {
          const target = ch.requirement.target;
          let value = 0;
          switch (ch.type) {
            case 'games_played':
              value = totals.gamesPlayed;
              break;
            case 'games_won':
              value = totals.gamesWon;
              break;
            case 'points_earned':
              value = totals.pointsEarned;
              break;
            case 'xp_earned':
              value = totals.xpEarned;
              break;
            default:
              value = 0;
          }

          if (value > 0) {
            await PlayerChallengeProgress.findOneAndUpdate(
              { playerId: playerObjectId, challengeId: ch._id },
              {
                $setOnInsert: {
                  metadata: { createdAt: new Date(), updatedAt: new Date() },
                  rewardsClaimed: false,
                  isCompleted: false,
                },
                $set: { 'metadata.updatedAt': new Date() },
                $max: { progress: value },
              },
              { upsert: true, new: true }
            );
          }
        }

        // Re-load progress records after backfill
        progressRecords = await PlayerChallengeProgress.find({
          playerId: playerObjectId,
          challengeId: { $in: challengeIds },
        });
      }
    } catch (backfillErr) {
      logger.warn({ backfillErr }, 'Challenge progress backfill skipped');
    }

    // Create a map for quick lookup
    const progressMap = new Map(
      progressRecords.map(p => [p.challengeId.toString(), p])
    );

    // Combine challenge definitions with progress
    const challengesWithProgress = challenges.map(challenge => {
      const progress = progressMap.get(String(challenge._id));

      return {
        _id: String(challenge._id),
        name: challenge.title,
        description: challenge.description,
        type: challenge.type,
        difficulty: challenge.difficulty,
        targetValue: challenge.requirement.target,
        currentProgress: progress?.progress || 0,
        rewards: challenge.rewards,
        expiresAt: challenge.availability.endTime,
        isCompleted: progress?.isCompleted || false,
        completedAt: progress?.completedAt || null,
      };
    });

    logger.info(
      {
        playerId,
        challengeCount: challenges.length,
        completedCount: challengesWithProgress.filter(c => c.isCompleted).length,
      },
      'Fetched daily challenges'
    );

    return NextResponse.json(
      {
        challenges: challengesWithProgress,
        date: today.toISOString(),
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    logger.error({ error }, 'Error fetching challenges');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
