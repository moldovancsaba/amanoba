/**
 * Admin Players API
 * 
 * What: REST endpoints for player management
 * Why: Allows admins to view, search, and manage players
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { checkRateLimit, adminRateLimiter } from '@/lib/security';
import { checkAdminAccess } from '@/lib/auth/admin';

/**
 * GET /api/admin/players
 * 
 * What: List all players with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  // Rate limiting for admin endpoints
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin role check (database role)
    const adminCheck = await checkAdminAccess(session, '/api/admin/players');
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isPremium = searchParams.get('isPremium');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (isPremium !== null) {
      query.isPremium = isPremium === 'true';
    }

    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { facebookId: { $regex: search, $options: 'i' } },
      ];
    }

    const [players, total] = await Promise.all([
      Player.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('displayName email isPremium isActive isAnonymous role createdAt lastLoginAt')
        .lean(),
      Player.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      players,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch players');
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
