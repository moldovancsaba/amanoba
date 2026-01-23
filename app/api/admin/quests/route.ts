/**
 * Admin Quests API
 * 
 * What: REST endpoints for quest management
 * Why: Allows admins to view and manage quests
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { Quest } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/quests
 * 
 * What: List all quests with optional filtering
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
    const status = searchParams.get('status'); // 'all' | 'active' | 'inactive'
    const search = searchParams.get('search');

    // Build query
    const query: Record<string, unknown> = {};

    if (status === 'active') {
      query['availability.isActive'] = true;
    } else if (status === 'inactive') {
      query['availability.isActive'] = false;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const quests = await Quest.find(query)
      .sort({ 'metadata.createdAt': -1 })
      .select('title description category totalSteps rewards requirements availability statistics metadata.createdAt')
      .lean();

    logger.info({ count: quests.length, filters: { status, search } }, 'Admin fetched quests');

    return NextResponse.json({
      success: true,
      quests,
      count: quests.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch quests');
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}
