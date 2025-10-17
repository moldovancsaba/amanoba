import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import { Quest, PlayerQuestProgress } from '@/lib/models/quest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { Player } from '@/lib/models';

/**
 * GET /api/quests
 * 
 * Why: Fetch available quests with player progress
 * What: Returns active quests filtered by player level/premium and their progress
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

    // Get player info for filtering
    const player = await Player.findById(playerId).select('isPremium');
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Fetch active quests
    const now = new Date();
    const quests = await Quest.find({
      'availability.isActive': true,
      $or: [
        { 'availability.startDate': { $exists: false } },
        { 'availability.startDate': { $lte: now } },
      ],
      $and: [
        {
          $or: [
            { 'availability.endDate': { $exists: false } },
            { 'availability.endDate': { $gte: now } },
          ],
        },
      ],
    }).sort({ 'metadata.displayOrder': 1, 'metadata.createdAt': -1 });

    // Fetch player's progress
    const questIds = quests.map(q => q._id);
    const progressRecords = await PlayerQuestProgress.find({
      playerId,
      questId: { $in: questIds },
    });

    // Create progress map
    const progressMap = new Map(
      progressRecords.map(p => [p.questId.toString(), p])
    );

    // Combine quest definitions with progress
    const questsWithProgress = quests.map(quest => {
      const progress = progressMap.get(String(quest._id));

      // Calculate which steps are completed
      const stepsCompleted = progress?.stepsCompleted || [];
      const stepsWithProgress = quest.steps.map((step, index) => ({
        stepNumber: step.stepNumber,
        description: step.description,
        isCompleted: stepsCompleted.includes(step.stepNumber),
        completedAt: progress?.stepsProgress?.get(step.stepNumber)?.completedAt || null,
      }));

      return {
        _id: String(quest._id),
        name: quest.title,
        description: quest.description,
        storyline: quest.story || null,
        difficulty: 'medium', // Default since not in schema
        steps: stepsWithProgress,
        totalSteps: quest.totalSteps,
        currentStep: progress?.currentStep || 1,
        rewards: {
          points: quest.rewards.completionPoints,
          xp: quest.rewards.completionXP,
          title: null, // Can be added later
        },
        isActive: progress?.status === 'in_progress',
        isCompleted: progress?.status === 'completed',
        completedAt: progress?.completedAt || null,
        isPremiumOnly: quest.requirements.isPremiumOnly,
      };
    });

    // Filter out premium quests if player is not premium
    const filteredQuests = player.isPremium
      ? questsWithProgress
      : questsWithProgress.filter(q => !q.isPremiumOnly);

    logger.info(
      {
        playerId,
        questCount: filteredQuests.length,
        activeCount: filteredQuests.filter(q => q.isActive).length,
        completedCount: filteredQuests.filter(q => q.isCompleted).length,
      },
      'Fetched quests'
    );

    return NextResponse.json(
      {
        quests: filteredQuests,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ error }, 'Error fetching quests');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
