/**
 * Admin Brands API
 * 
 * What: REST endpoint for fetching brand information
 * Why: Provides brand data for admin interfaces
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Brand } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/brands?default=true
 * 
 * What: Get brands (optionally default brand only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const defaultOnly = searchParams.get('default') === 'true';

    let brands;
    if (defaultOnly) {
      // Get the first active brand (default)
      brands = await Brand.find({ 'metadata.isActive': true })
        .sort({ 'metadata.createdAt': 1 })
        .limit(1)
        .lean();
    } else {
      brands = await Brand.find({}).lean();
    }

    return NextResponse.json({
      success: true,
      brands,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch brands');
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}
