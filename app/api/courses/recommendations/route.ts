/**
 * Course Recommendations API
 * 
 * What: Returns personalized course recommendations based on survey responses
 * Why: Helps students discover courses that match their interests and skill level
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { getCourseRecommendations } from '@/app/lib/course-recommendations';
import type { Locale } from '@/app/lib/i18n/locales';

const VALID_LOCALES: Locale[] = ['hu', 'en', 'ar', 'hi', 'id', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru', 'sw'];
function parseLocale(value: string | null): Locale | null {
  if (!value) return null;
  return VALID_LOCALES.includes(value as Locale) ? (value as Locale) : null;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/courses/recommendations
 * 
 * What: Get personalized course recommendations
 * Query Params:
 *   - limit?: number (default: 5)
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

    // Check if player completed survey
    if (!player.surveyCompleted) {
      return NextResponse.json({
        success: true,
        recommendations: [],
        message: 'Complete the onboarding survey to get personalized recommendations',
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const locale =
      parseLocale(searchParams.get('locale')) ??
      (VALID_LOCALES.includes((player.locale as Locale) ?? '') ? (player.locale as Locale) : null);

    // Get recommendations based on player data (P0: resolve name/description for locale when set)
    const recommendations = await getCourseRecommendations(
      player as { _id: unknown; skillLevel?: string; interests?: string[] },
      limit,
      locale
    );

    logger.info(
      {
        playerId: player._id.toString(),
        skillLevel: player.skillLevel,
        interestsCount: player.interests?.length || 0,
        recommendationsCount: recommendations.length,
      },
      'Generated course recommendations'
    );

    return NextResponse.json({
      success: true,
      recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch course recommendations');
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
