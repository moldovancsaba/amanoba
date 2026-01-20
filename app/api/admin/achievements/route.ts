/**
 * Admin Achievements API
 * 
 * What: REST endpoints for achievement management
 * Why: Allows admins to create, read, update, and delete achievements
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Achievement } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';

/**
 * GET /api/admin/achievements
 * 
 * What: List all achievements with optional filtering
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
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    const query: Record<string, unknown> = {};

    if (category) {
      query.category = category;
    }

    if (isActive !== null) {
      query['metadata.isActive'] = isActive === 'true';
    }

    let achievements = await Achievement.find(query).sort({ name: 1 }).lean();

    if (search) {
      achievements = achievements.filter((a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      achievements,
      count: achievements.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch achievements');
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

/**
 * POST /api/admin/achievements
 * 
 * What: Create a new achievement
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const body = await request.json();
    const newAchievement = new Achievement({
      ...body,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        unlockCount: 0,
        isActive: body.metadata?.isActive ?? true,
      },
    });

    await newAchievement.save();

    return NextResponse.json({ success: true, achievement: newAchievement }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Failed to create achievement');
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}
