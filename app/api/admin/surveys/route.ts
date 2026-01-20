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
    const questionStats: Record<string, any> = {};
    for (const question of survey.questions) {
      const questionAnswers = responses
        .map((r) => r.answers.find((a: any) => a.questionId === question.questionId))
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
      const player = response.playerId as any;
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
      playerName: (r.playerId as any)?.displayName || 'Unknown',
      playerEmail: (r.playerId as any)?.email || null,
      skillLevel: (r.playerId as any)?.skillLevel || null,
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
