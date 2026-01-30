/**
 * Admin Surveys API
 * 
 * What: REST endpoint for admins to view survey analytics
 * Why: Allows admins to see survey response statistics and insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { Survey, SurveyResponse, Player, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/surveys
 * 
 * What: Get survey analytics and response statistics
 * Query Params:
 *   - surveyId?: string (default: 'onboarding')
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get('surveyId') || 'onboarding';

    // Find survey
    const survey = await Survey.findOne({ surveyId, isActive: true }).lean();
    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    // Get all responses for this survey
    const responses = await SurveyResponse.find({ surveyId: survey._id })
      .populate('playerId', 'displayName email surveyCompleted skillLevel interests')
      .sort({ completedAt: -1 })
      .lean();

    // Calculate statistics
    const totalResponses = responses.length;
    const completionRate = totalResponses > 0 ? 100 : 0; // All responses are completed

    // Answer statistics by question
    const questionStats: Record<string, unknown> = {};
    for (const question of survey.questions) {
      const questionAnswers = responses
        .map((r) => r.answers.find((a: { questionId?: string }) => a.questionId === question.questionId))
        .filter(Boolean);

      if (question.type === 'single_choice' || question.type === 'multiple_choice') {
        const answerCounts: Record<string, number> = {};
        for (const answer of questionAnswers) {
          if (Array.isArray(answer?.value)) {
            for (const value of answer.value) {
              answerCounts[value] = (answerCounts[value] || 0) + 1;
            }
          } else if (answer?.value) {
            answerCounts[answer.value] = (answerCounts[answer.value] || 0) + 1;
          }
        }
        questionStats[question.questionId] = {
          question: question.question,
          type: question.type,
          answerCounts,
          totalAnswers: questionAnswers.length,
        };
      } else if (question.type === 'rating') {
        const ratings = questionAnswers
          .map((a) => a?.value)
          .filter((v): v is number => typeof v === 'number');
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;
        questionStats[question.questionId] = {
          question: question.question,
          type: question.type,
          averageRating: averageRating.toFixed(2),
          totalRatings: ratings.length,
          minRating: ratings.length > 0 ? Math.min(...ratings) : null,
          maxRating: ratings.length > 0 ? Math.max(...ratings) : null,
        };
      }
    }

    // Skill level distribution
    const skillLevelDistribution = await Player.aggregate([
      {
        $match: {
          surveyCompleted: true,
          skillLevel: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$skillLevel',
          count: { $sum: 1 },
        },
      },
    ]);

    // Most common interests
    const interestsCount: Record<string, number> = {};
    for (const response of responses) {
      const player = response.playerId as { interests?: string[] };
      if (player?.interests && Array.isArray(player.interests)) {
        for (const interest of player.interests) {
          interestsCount[interest] = (interestsCount[interest] || 0) + 1;
        }
      }
    }

    const topInterests = Object.entries(interestsCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([interest, count]) => ({ interest, count }));

    // Average time spent
    const timesSpent = responses
      .map((r) => r.metadata?.timeSpentSeconds)
      .filter((t): t is number => typeof t === 'number');
    const averageTimeSpent =
      timesSpent.length > 0
        ? timesSpent.reduce((sum, t) => sum + t, 0) / timesSpent.length
        : 0;

    // Recent responses (last 10)
    const recentResponses = responses.slice(0, 10).map((r) => ({
      id: r._id.toString(),
      playerName: (r.playerId as { displayName?: string })?.displayName || 'Unknown',
      playerEmail: (r.playerId as { email?: string | null })?.email || null,
      skillLevel: (r.playerId as { skillLevel?: string })?.skillLevel || null,
      completedAt: r.completedAt,
      timeSpentSeconds: r.metadata?.timeSpentSeconds || null,
    }));

    logger.info(
      {
        surveyId,
        totalResponses,
        questionCount: survey.questions.length,
      },
      'Fetched survey analytics'
    );

    return NextResponse.json({
      success: true,
      survey: {
        surveyId: survey.surveyId,
        name: survey.name,
        description: survey.description,
        questionCount: survey.questions.length,
        isActive: survey.isActive,
        isDefault: survey.isDefault,
      },
      statistics: {
        totalResponses,
        completionRate,
        averageTimeSpent: Math.round(averageTimeSpent),
        skillLevelDistribution: skillLevelDistribution.map((s) => ({
          level: s._id,
          count: s.count,
        })),
        topInterests,
      },
      questionStats,
      recentResponses,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch survey analytics');
    return NextResponse.json(
      { error: 'Failed to fetch survey analytics' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/surveys
 * 
 * What: Update survey settings (enable/disable for new users)
 * Body: { surveyId: string, isActive?: boolean, isDefault?: boolean }
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const body = await request.json();
    const { surveyId, isActive, isDefault } = body;

    if (!surveyId) {
      return NextResponse.json(
        { error: 'Survey ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    if (typeof isDefault === 'boolean') {
      updateData.isDefault = isDefault;
    }

    const survey = await Survey.findOneAndUpdate(
      { surveyId },
      { $set: updateData },
      { new: true }
    );

    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    logger.info({ surveyId, updateData }, 'Survey settings updated');

    return NextResponse.json({
      success: true,
      survey: {
        surveyId: survey.surveyId,
        name: survey.name,
        isActive: survey.isActive,
        isDefault: survey.isDefault,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to update survey settings');
    return NextResponse.json(
      { error: 'Failed to update survey settings' },
      { status: 500 }
    );
  }
}
