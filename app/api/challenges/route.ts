import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import { DailyChallenge, PlayerChallengeProgress } from '@/lib/models/daily-challenge';

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

    // Fetch today's active challenges
    let challenges = await DailyChallenge.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
      'availability.isActive': true,
    }).sort({ difficulty: 1 });

    // Auto-generate today's challenges if none exist
    if (challenges.length === 0) {
      const base = [
        {
          type: 'games_played',
          difficulty: 'easy',
          title: 'Warm Up',
          description: 'Play 2 games today',
          target: 2,
          points: 25,
          xp: 25,
        },
        {
          type: 'games_won',
          difficulty: 'medium',
          title: 'First Victory',
          description: 'Win 1 game today',
          target: 1,
          points: 50,
          xp: 50,
        },
        {
          type: 'points_earned',
          difficulty: 'hard',
          title: 'Point Hunter',
          description: 'Earn 150 points today',
          target: 150,
          points: 100,
          xp: 100,
        },
      ] as const;

      const toInsert = base.map((b) => ({
        date: today,
        type: b.type as any,
        difficulty: b.difficulty as any,
        title: b.title,
        description: b.description,
        requirement: { target: b.target },
        rewards: { points: b.points, xp: b.xp },
        availability: { startTime: today, endTime: tomorrow, isActive: true },
        completions: { total: 0, percentage: 0 },
        metadata: { createdAt: new Date(), updatedAt: new Date() },
      }));

      await DailyChallenge.insertMany(toInsert);
      challenges = await DailyChallenge.find({
        date: { $gte: today, $lt: tomorrow },
        'availability.isActive': true,
      }).sort({ difficulty: 1 });
    }

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
      { status: 200 }
    );
  } catch (error) {
    logger.error({ error }, 'Error fetching challenges');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
