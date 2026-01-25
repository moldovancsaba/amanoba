/**
 * Admin Certificates API
 * 
 * What: REST endpoints for certificate management
 * Why: Allows admins to view, search, filter, and manage certificates
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { Certificate } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/certificates
 * 
 * What: List all certificates with optional filtering and pagination
 * Query Params:
 *   - search?: string (searches certificateId, recipientName, courseTitle, courseId, playerId, verificationSlug)
 *   - status?: string ('all' | 'active' | 'revoked')
 *   - courseId?: string
 *   - playerId?: string
 *   - page?: number (default: 1)
 *   - limit?: number (default: 50)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status'); // 'all' | 'active' | 'revoked'
    const courseId = searchParams.get('courseId');
    const playerId = searchParams.get('playerId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    // Status filter
    if (status === 'revoked') {
      query.isRevoked = true;
    } else if (status === 'active') {
      query.isRevoked = { $ne: true };
    }
    // 'all' or no status filter means no status filter applied

    // Course filter
    if (courseId) {
      query.courseId = courseId;
    }

    // Player filter
    if (playerId) {
      query.playerId = playerId;
    }

    // Search filter (searches multiple fields)
    if (search) {
      query.$or = [
        { certificateId: { $regex: search, $options: 'i' } },
        { recipientName: { $regex: search, $options: 'i' } },
        { courseTitle: { $regex: search, $options: 'i' } },
        { courseId: { $regex: search, $options: 'i' } },
        { playerId: { $regex: search, $options: 'i' } },
        { verificationSlug: { $regex: search, $options: 'i' } },
      ];
    }

    const [certificates, total] = await Promise.all([
      Certificate.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Certificate.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      certificates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch certificates');
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}
