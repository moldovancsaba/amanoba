/**
 * Admin Challenges API
 * 
 * What: REST endpoints for daily challenge management
 * Why: Allows admins to view and manage daily challenges
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { DailyChallenge } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';

/**
 * GET /api/admin/challenges
 * 
 * What: List all challenges with optional filtering
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
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const date = searchParams.get('date');
    const isActive = searchParams.get('isActive');

    const query: Record<string, unknown> = {};

    if (type) {
      query.type = type;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setUTCDate(endDate.getUTCDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (isActive !== null) {
      query['availability.isActive'] = isActive === 'true';
    }

    const challenges = await DailyChallenge.find(query)
      .sort({ date: -1, difficulty: 1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      challenges,
      count: challenges.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch challenges');
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}
