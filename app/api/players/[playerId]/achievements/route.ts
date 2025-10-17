import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import { Achievement, AchievementUnlock } from '@/lib/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/players/[playerId]/achievements
 * 
 * Why: Display all achievements with unlock status for a specific player
 * What: Returns complete achievement list with unlock dates and progress
 * 
 * Response:
 * - achievements: Array of all achievements with unlock status
 *   - Each includes achievement details and optional unlock info
 *   - Shows progress for partially completed achievements
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ playerId: string }> }
) {
  try {
    const params = await props.params;
    const { playerId } = params;

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Why: Connect to database before any operations
    await connectToDatabase();

    // Why: Fetch all achievements and player's unlocks in parallel
    const [allAchievements, playerUnlocks] = await Promise.all([
      Achievement.find().sort({ category: 1, requiredValue: 1 }),
      AchievementUnlock.find({ playerId }),
    ]);

    // Why: Create a map of unlocked achievements for quick lookup
    const unlocksMap = new Map(
      playerUnlocks.map((unlock) => [unlock.achievementId.toString(), unlock])
    );

    // Why: Combine achievement definitions with player's unlock status
    const achievementsWithStatus = allAchievements.map((achievement) => {
      const achievementId = (achievement._id as mongoose.Types.ObjectId).toString();
      const unlock = unlocksMap.get(achievementId);

      return {
        id: achievement._id,
        name: achievement.name,
        description: achievement.description,
        category: achievement.category,
        tier: achievement.tier,
        icon: achievement.icon,
        points: achievement.rewards.points,
        xp: achievement.rewards.xp,
        criteria: achievement.criteria,
        isHidden: achievement.isHidden,
        isUnlocked: !!unlock,
        unlockedAt: unlock?.unlockedAt || null,
        progress: unlock?.progress || 0,
        // Why: Calculate progress percentage for display
        progressPercentage: achievement.criteria.target
          ? Math.min(
              100,
              Math.round(
                ((unlock?.progress || 0) / achievement.criteria.target) * 100
              )
            )
          : unlock
          ? 100
          : 0,
      };
    });

    // Why: Provide summary statistics for the UI
    const stats = {
      total: allAchievements.length,
      unlocked: playerUnlocks.length,
      percentage: Math.round(
        (playerUnlocks.length / allAchievements.length) * 100
      ),
      byCategory: allAchievements.reduce((acc, achievement) => {
        const category = achievement.category;
        if (!acc[category]) {
          acc[category] = {
            total: 0,
            unlocked: 0,
          };
        }
        acc[category].total++;
        if (unlocksMap.has((achievement._id as mongoose.Types.ObjectId).toString())) {
          acc[category].unlocked++;
        }
        return acc;
      }, {} as Record<string, { total: number; unlocked: number }>),
    };

    logger.info(
      { playerId, totalAchievements: allAchievements.length, unlockedCount: playerUnlocks.length },
      'Player achievements fetched successfully'
    );

    return NextResponse.json(
      {
        achievements: achievementsWithStatus,
        stats,
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    // Why: Log unexpected errors for debugging
    logger.error(
      { error },
      'Error fetching player achievements'
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
