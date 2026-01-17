/**
 * Admin Rewards API
 * 
 * What: REST endpoints for reward management
 * Why: Allows admins to create, read, update, and delete rewards
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Reward } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/rewards
 * 
 * What: List all rewards with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    const query: Record<string, unknown> = {};

    if (category) {
      query.category = category;
    }

    if (isActive !== null) {
      query['availability.isActive'] = isActive === 'true';
    }

    let rewards = await Reward.find(query).sort({ pointsCost: 1 }).lean();

    if (search) {
      rewards = rewards.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      rewards,
      count: rewards.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch rewards');
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
  }
}

/**
 * POST /api/admin/rewards
 * 
 * What: Create a new reward
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const newReward = new Reward({
      ...body,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalRedemptions: 0,
        displayOrder: body.metadata?.displayOrder || 0,
      },
    });

    await newReward.save();

    return NextResponse.json({ success: true, reward: newReward }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Failed to create reward');
    return NextResponse.json({ error: 'Failed to create reward' }, { status: 500 });
  }
}
