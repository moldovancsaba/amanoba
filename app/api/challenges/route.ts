import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import { DailyChallenge, PlayerChallengeProgress } from '@/lib/models/daily-challenge';

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
    let challenges = ensured.challenges;

    // Fetch player's progress on these challenges
    const challengeIds = challenges.map(c => c._id);
    const progressRecords = await PlayerChallengeProgress.find({
      playerId,
      challengeId: { $in: challengeIds },
    });

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
