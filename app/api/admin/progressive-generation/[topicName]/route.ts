/**
 * Admin Progressive Generation API - Topic Detail
 * 
 * Endpoints for managing a specific progression tracker.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { CourseGenerationTracker } from '@/app/lib/models';
import {
  updateAllStagesMetrics,
  markTriggerMet,
  getProgressionStatus,
} from '@/app/lib/progressive-generation';
import { logger } from '@/app/lib/logger';

interface RouteParams {
  params: Promise<{
    topicName: string;
  }>;
}

/**
 * GET /api/admin/progressive-generation/[topicName]
 * 
 * Get detailed progression data for a specific topic
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();
    
    const { topicName: rawTopicName } = await params;
    const topicName = decodeURIComponent(rawTopicName);

    const status = await getProgressionStatus(topicName);

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Progression tracker not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching progression details');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch progression details',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/progressive-generation/[topicName]
 * 
 * Update progression tracker settings
 * 
 * Body:
 * {
 *   status?: 'active' | 'paused' | 'completed',
 *   stage1Threshold?: number,
 *   stage2Threshold?: number,
 *   stage3Threshold?: number
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();
    
    const { topicName: rawTopicName } = await params;
    const topicName = decodeURIComponent(rawTopicName);
    const body = await request.json();

    const tracker = await CourseGenerationTracker.findOne({ topicName });

    if (!tracker) {
      return NextResponse.json(
        {
          success: false,
          error: 'Progression tracker not found',
        },
        { status: 404 }
      );
    }

    if (body.status) {
      tracker.status = body.status;
    }

    if (body.stage1Threshold !== undefined && tracker.stage1Metrics) {
      tracker.stage1Metrics.triggerThreshold = body.stage1Threshold;
    }

    if (body.stage2Threshold !== undefined && tracker.stage2Metrics) {
      tracker.stage2Metrics.triggerThreshold = body.stage2Threshold;
    }

    if (body.stage3Threshold !== undefined && tracker.stage3Metrics) {
      tracker.stage3Metrics.triggerThreshold = body.stage3Threshold;
    }

    await tracker.save();

    return NextResponse.json({
      success: true,
      data: tracker,
    });
  } catch (error) {
    logger.error({ error }, 'Error updating progression tracker');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update progression tracker',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/progressive-generation/[topicName]
 * 
 * Delete a progression tracker (soft delete by setting status to paused)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();
    
    const { topicName: rawTopicName } = await params;
    const topicName = decodeURIComponent(rawTopicName);

    const tracker = await CourseGenerationTracker.findOne({ topicName });

    if (!tracker) {
      return NextResponse.json(
        {
          success: false,
          error: 'Progression tracker not found',
        },
        { status: 404 }
      );
    }

    tracker.status = 'paused';
    await tracker.save();

    return NextResponse.json({
      success: true,
      message: 'Progression tracker paused',
    });
  } catch (error) {
    logger.error({ error }, 'Error deleting progression tracker');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete progression tracker',
      },
      { status: 500 }
    );
  }
}
