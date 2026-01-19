/**
 * Admin Settings - Default Course Thumbnail API
 * 
 * What: Manages default course thumbnail stored in Brand metadata
 * Why: Allows admins to set a fallback thumbnail for courses without their own
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Brand } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/settings/default-thumbnail
 * 
 * What: Get default course thumbnail URL
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get default brand (amanoba)
    const brand = await Brand.findOne({ slug: 'amanoba' }).lean();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const defaultThumbnail = (brand.metadata as any)?.defaultCourseThumbnail || null;

    return NextResponse.json({
      success: true,
      thumbnail: defaultThumbnail,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch default thumbnail');
    return NextResponse.json(
      { error: 'Failed to fetch default thumbnail' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings/default-thumbnail
 * 
 * What: Set default course thumbnail URL
 * Body: { thumbnail: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { thumbnail } = body;

    if (!thumbnail || typeof thumbnail !== 'string') {
      return NextResponse.json(
        { error: 'Thumbnail URL is required' },
        { status: 400 }
      );
    }

    // Get default brand (amanoba)
    const brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Update metadata with default thumbnail
    if (!brand.metadata) {
      brand.metadata = {};
    }
    (brand.metadata as any).defaultCourseThumbnail = thumbnail;
    await brand.save();

    logger.info({ thumbnail }, 'Default course thumbnail updated');

    return NextResponse.json({
      success: true,
      thumbnail,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to save default thumbnail');
    return NextResponse.json(
      { error: 'Failed to save default thumbnail' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/settings/default-thumbnail
 * 
 * What: Remove default course thumbnail
 */
export async function DELETE(request: NextRequest) {
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

    // Remove default thumbnail from metadata
    if (brand.metadata) {
      delete (brand.metadata as any).defaultCourseThumbnail;
      await brand.save();
    }

    logger.info({}, 'Default course thumbnail removed');

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to remove default thumbnail');
    return NextResponse.json(
      { error: 'Failed to remove default thumbnail' },
      { status: 500 }
    );
  }
}
