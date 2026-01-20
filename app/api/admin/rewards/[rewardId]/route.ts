/**
 * Admin Reward Detail API
 * 
 * What: REST endpoints for individual reward operations
 * Why: Allows admins to get, update, and delete specific rewards
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Reward } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';

/**
 * GET /api/admin/rewards/[rewardId]
 * 
 * What: Get a specific reward by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rewardId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { rewardId } = await params;

    const reward = await Reward.findById(rewardId).lean();

    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, reward });
  } catch (error) {
    logger.error({ error, rewardId: (await params).rewardId }, 'Failed to fetch reward');
    return NextResponse.json({ error: 'Failed to fetch reward' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/rewards/[rewardId]
 * 
 * What: Update a specific reward
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ rewardId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { rewardId } = await params;
    const body = await request.json();

    const reward = await Reward.findByIdAndUpdate(
      rewardId,
      { 
        $set: {
          ...body,
          'metadata.updatedAt': new Date(),
        }
      },
      { new: true, runValidators: true }
    );

    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    logger.info({ rewardId }, 'Admin updated reward');

    return NextResponse.json({ success: true, reward });
  } catch (error) {
    logger.error({ error, rewardId: (await params).rewardId }, 'Failed to update reward');
    return NextResponse.json({ error: 'Failed to update reward' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/rewards/[rewardId]
 * 
 * What: Delete a specific reward
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ rewardId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { rewardId } = await params;

    const reward = await Reward.findByIdAndDelete(rewardId);

    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    logger.info({ rewardId }, 'Admin deleted reward');

    return NextResponse.json({ success: true, message: 'Reward deleted' });
  } catch (error) {
    logger.error({ error, rewardId: (await params).rewardId }, 'Failed to delete reward');
    return NextResponse.json({ error: 'Failed to delete reward' }, { status: 500 });
  }
}
