/**
 * Admin Achievement Detail API
 * 
 * What: REST endpoints for individual achievement operations
 * Why: Allows admins to get, update, and delete specific achievements
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Achievement } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';

/**
 * GET /api/admin/achievements/[achievementId]
 * 
 * What: Get a specific achievement by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ achievementId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { achievementId } = await params;

    const achievement = await Achievement.findById(achievementId).lean();

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, achievement });
  } catch (error) {
    logger.error({ error, achievementId: (await params).achievementId }, 'Failed to fetch achievement');
    return NextResponse.json({ error: 'Failed to fetch achievement' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/achievements/[achievementId]
 * 
 * What: Update a specific achievement
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ achievementId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { achievementId } = await params;
    const body = await request.json();

    const achievement = await Achievement.findByIdAndUpdate(
      achievementId,
      { 
        $set: {
          ...body,
          'metadata.updatedAt': new Date(),
        }
      },
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    logger.info({ achievementId }, 'Admin updated achievement');

    return NextResponse.json({ success: true, achievement });
  } catch (error) {
    logger.error({ error, achievementId: (await params).achievementId }, 'Failed to update achievement');
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/achievements/[achievementId]
 * 
 * What: Delete a specific achievement
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ achievementId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { achievementId } = await params;

    const achievement = await Achievement.findByIdAndDelete(achievementId);

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    logger.info({ achievementId }, 'Admin deleted achievement');

    return NextResponse.json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    logger.error({ error, achievementId: (await params).achievementId }, 'Failed to delete achievement');
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
