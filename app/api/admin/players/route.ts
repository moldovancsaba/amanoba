/**
 * Admin Players API
 * 
 * What: REST endpoints for player management
 * Why: Allows admins to view, search, and manage players
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { checkRateLimit, adminRateLimiter } from '@/lib/security';

/**
 * GET /api/admin/players
 * 
 * What: List all players with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  // Rate limiting: 50 requests per 15 minutes per IP (admin endpoints)
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const userType = searchParams.get('userType');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (userType && userType !== 'all') {
      if (userType === 'guest') {
        query.isAnonymous = true;
      } else if (userType === 'admin') {
        query.role = 'admin';
        query.isAnonymous = false;
      } else if (userType === 'user') {
        query.role = 'user';
        query.isAnonymous = false;
      }
    }

    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { ssoSub: { $regex: search, $options: 'i' } },
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
