/**
 * Admin Progressive Generation API
 * 
 * Endpoints for managing course progression trackers.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { CourseGenerationTracker } from '@/app/lib/models';
import {
  createProgressionTracker,
  updateAllStagesMetrics,
} from '@/app/lib/progressive-generation';
import { logger } from '@/app/lib/logger';

/**
 * GET /api/admin/progressive-generation
 * 
 * List all progression trackers with optional filters
 * 
 * Query parameters:
 * - status: Filter by status (active, paused, completed)
 * - stage: Filter by current stage (1, 2, 3, 4)
 * - category: Filter by topic category
 * - triggerMet: Filter by trigger status (true, false)
 * - limit: Max number of results (default: 50)
 * - offset: Skip N results (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const statusFilter = searchParams.get('status');
    const stageFilter = searchParams.get('stage');
    const categoryFilter = searchParams.get('category');
    const triggerMetFilter = searchParams.get('triggerMet');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const query: Record<string, unknown> = {};

    if (statusFilter) {
      query.status = statusFilter;
    }

    if (stageFilter) {
      query.currentStage = parseInt(stageFilter, 10);
    }

    if (categoryFilter) {
      query.topicCategory = categoryFilter;
    }

    if (triggerMetFilter === 'true' || triggerMetFilter === 'false') {
      const triggerMet = triggerMetFilter === 'true';
      query.$or = [
        { 'stage1Metrics.triggerMet': triggerMet },
        { 'stage2Metrics.triggerMet': triggerMet },
        { 'stage3Metrics.triggerMet': triggerMet },
      ];
    }

    const [trackers, total] = await Promise.all([
      CourseGenerationTracker.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .lean(),
      CourseGenerationTracker.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: trackers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + trackers.length < total,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching progression trackers');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch progression trackers',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/progressive-generation
 * 
 * Create a new progression tracker
 * 
 * Body:
 * {
 *   topicName: string,
 *   topicCategory: string,
 *   stage1CourseId?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { topicName, topicCategory, stage1CourseId } = body;

    if (!topicName || !topicCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'topicName and topicCategory are required',
        },
        { status: 400 }
      );
    }

    const existing = await CourseGenerationTracker.findOne({ topicName });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Tracker already exists for topic: ${topicName}`,
        },
        { status: 409 }
      );
    }

    const tracker = await createProgressionTracker(
      topicName,
      topicCategory,
      stage1CourseId
    );

    return NextResponse.json({
      success: true,
      data: tracker,
    }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Error creating progression tracker');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create progression tracker',
      },
      { status: 500 }
    );
  }
}
