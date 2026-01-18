/**
 * Admin Feature Flags API
 * 
 * What: REST endpoints for managing feature flags
 * Why: Allows admins to enable/disable features on the platform
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { FeatureFlags, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/feature-flags
 * 
 * What: Get current feature flags
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get default brand (amanoba)
    const brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    let featureFlags = await FeatureFlags.findOne({ brandId: brand._id }).lean();

    // If no feature flags exist, create default ones
    if (!featureFlags) {
      const defaultFlags = new FeatureFlags({
        brandId: brand._id,
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
        metadata: {
          updatedAt: new Date(),
          updatedBy: session.user.email || 'system',
        },
      });
      await defaultFlags.save();
      featureFlags = defaultFlags.toObject();
    }

    return NextResponse.json({
      success: true,
      featureFlags,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch feature flags');
    return NextResponse.json({ error: 'Failed to fetch feature flags' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/feature-flags
 * 
 * What: Update feature flags
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { features } = body;

    // Get default brand (amanoba)
    const brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const featureFlags = await FeatureFlags.findOneAndUpdate(
      { brandId: brand._id },
      {
        $set: {
          features: {
            courses: features.courses ?? true,
            myCourses: features.myCourses ?? true,
            games: features.games ?? false,
            stats: features.stats ?? false,
            leaderboards: features.leaderboards ?? false,
            challenges: features.challenges ?? false,
            quests: features.quests ?? false,
            achievements: features.achievements ?? false,
            rewards: features.rewards ?? false,
          },
          'metadata.updatedAt': new Date(),
          'metadata.updatedBy': session.user.email || 'admin',
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    logger.info({ features: featureFlags.features }, 'Admin updated feature flags');

    return NextResponse.json({
      success: true,
      featureFlags,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to update feature flags');
    return NextResponse.json({ error: 'Failed to update feature flags' }, { status: 500 });
  }
}
