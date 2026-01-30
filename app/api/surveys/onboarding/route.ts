/**
 * Onboarding Survey API
 * 
 * What: REST endpoints for onboarding survey (GET questions, POST responses)
 * Why: Allows students to complete onboarding survey for course recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Survey, SurveyResponse, Player, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/surveys/onboarding
 * 
 * What: Get onboarding survey questions
 * Why: Returns survey questions for the survey form
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId).lean();

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Get default brand
    const brand = await Brand.findById(player.brandId).lean();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Find default onboarding survey
    const survey = await Survey.findOne({
      surveyId: 'onboarding',
      brandId: brand._id,
      isActive: true,
    }).lean();

    if (!survey) {
      return NextResponse.json(
        { error: 'Onboarding survey not found' },
        { status: 404 }
      );
    }

    // Check if player already completed this survey
    const existingResponse = await SurveyResponse.findOne({
      playerId: player._id,
      surveyId: survey._id,
    }).lean();

    // Format survey for response (exclude internal fields)
    const formattedSurvey = {
      surveyId: survey.surveyId,
      name: survey.name,
      description: survey.description,
      questions: survey.questions.map((q) => ({
        questionId: q.questionId,
        type: q.type,
        question: q.question,
        description: q.description,
        options: q.options,
        required: q.required,
        order: q.order,
        metadata: q.metadata,
      })),
      metadata: survey.metadata,
      alreadyCompleted: !!existingResponse,
    };

    logger.info(
      { playerId: player._id.toString(), surveyId: survey.surveyId, alreadyCompleted: !!existingResponse },
      'Fetched onboarding survey'
    );

    return NextResponse.json({
      success: true,
      survey: formattedSurvey,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch onboarding survey');
    return NextResponse.json(
      { error: 'Failed to fetch survey' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/surveys/onboarding
 * 
 * What: Save survey responses
 * Request Body:
 * {
 *   answers: Array<{ questionId: string, value: string | string[] | number }>,
 *   metadata?: { timeSpentSeconds?: number, deviceType?: string }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId);

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Get default brand
    const brand = await Brand.findById(player.brandId).lean();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Find onboarding survey
    const survey = await Survey.findOne({
      surveyId: 'onboarding',
      brandId: brand._id,
      isActive: true,
    });

    if (!survey) {
      return NextResponse.json(
        { error: 'Onboarding survey not found' },
        { status: 404 }
      );
    }

    // Check if already completed
    const existingResponse = await SurveyResponse.findOne({
      playerId: player._id,
      surveyId: survey._id,
    });

    if (existingResponse) {
      return NextResponse.json(
        { error: 'Survey already completed' },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.json();
    const { answers, metadata: requestMetadata } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }

    // Validate answers match survey questions
    const questionIds = new Set(survey.questions.map((q) => q.questionId));
    const answerQuestionIds = new Set(answers.map((a: { questionId?: string }) => a.questionId));

    // Check all required questions are answered
    const requiredQuestions = survey.questions.filter((q) => q.required);
    for (const question of requiredQuestions) {
      if (!answerQuestionIds.has(question.questionId)) {
        return NextResponse.json(
          { error: `Required question "${question.questionId}" is missing` },
          { status: 400 }
        );
      }
    }

    // Extract skill level and interests from answers
    let skillLevel: 'beginner' | 'intermediate' | 'advanced' | undefined;
    const interests: string[] = [];

    for (const answer of answers) {
      const question = survey.questions.find((q) => q.questionId === answer.questionId);
      if (!question) continue;

      // Extract skill level
      if (question.metadata?.category === 'skill_level') {
        skillLevel = answer.value as 'beginner' | 'intermediate' | 'advanced';
      }

      // Extract interests
      if (question.metadata?.category === 'interests' && Array.isArray(answer.value)) {
        interests.push(...answer.value);
      }
    }

    // Create survey response
    const surveyResponse = new SurveyResponse({
      playerId: player._id,
      surveyId: survey._id,
      brandId: brand._id,
      answers: answers.map((a: { questionId?: string; value?: unknown; metadata?: unknown }) => ({
        questionId: a.questionId,
        value: a.value,
        metadata: a.metadata || {},
      })),
      completedAt: new Date(),
      metadata: {
        timeSpentSeconds: requestMetadata?.timeSpentSeconds,
        deviceType: requestMetadata?.deviceType,
        userAgent: request.headers.get('user-agent') || undefined,
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || undefined,
      },
    });

    await surveyResponse.save();

    // Update player with survey completion and extracted data
    player.surveyCompleted = true;
    if (skillLevel) {
      player.skillLevel = skillLevel;
    }
    if (interests.length > 0) {
      player.interests = interests;
    }
    await player.save();

    type DocWithId = { _id: { toString(): string } };
    logger.info(
      {
        playerId: (player as DocWithId)._id.toString(),
        surveyId: survey.surveyId,
        skillLevel,
        interestsCount: interests.length,
      },
      'Survey response saved and player updated'
    );

    return NextResponse.json({
      success: true,
      message: 'Survey completed successfully',
      surveyResponse: {
        id: (surveyResponse as DocWithId)._id.toString(),
        completedAt: surveyResponse.completedAt,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to save survey response');
    return NextResponse.json(
      { error: 'Failed to save survey response' },
      { status: 500 }
    );
  }
}
