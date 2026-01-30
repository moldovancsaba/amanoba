/**
 * Public Feature Flags API
 * 
 * What: Get current feature flags (public endpoint)
 * Why: Allows frontend to check which features are enabled
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { FeatureFlags, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/feature-flags
 * 
 * What: Get current feature flags (public)
 */
export async function GET(_request: NextRequest) {
  try {
    await connectDB();

    // Get default brand (amanoba)
    const brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      // Return default flags if brand not found
      return NextResponse.json({
        success: true,
        featureFlags: {
          features: {
            courses: true,
            myCourses: true,
            games: false,
            stats: false,
            leaderboards: false,
            challenges: false,
            quests: false,
            achievements: false,
            rewards: false,
          },
        },
      });
    }

    const featureFlags = await FeatureFlags.findOne({ brandId: brand._id }).lean();

    // If no feature flags exist, return defaults
    if (!featureFlags) {
      return NextResponse.json({
        success: true,
        featureFlags: {
          features: {
            courses: true,
            myCourses: true,
            games: false,
            stats: false,
            leaderboards: false,
            challenges: false,
            quests: false,
            achievements: false,
            rewards: false,
          },
        },
      });
    }

    type FeatureFlagsDoc = { features?: Record<string, boolean> };
    return NextResponse.json({
      success: true,
      featureFlags: {
        features: (featureFlags as FeatureFlagsDoc).features ?? {},
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch feature flags');
    // Return defaults on error
    return NextResponse.json({
      success: true,
      featureFlags: {
        features: {
          courses: true,
          myCourses: true,
          games: false,
          stats: false,
          leaderboards: false,
          challenges: false,
          quests: false,
          achievements: false,
          rewards: false,
        },
      },
    });
  }
}
