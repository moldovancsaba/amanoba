/**
 * Admin Progressive Generation API - Refresh Metrics
 * 
 * Force metrics refresh for a specific topic.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { updateAllStagesMetrics } from '@/app/lib/progressive-generation';
import { logger } from '@/app/lib/logger';

interface RouteParams {
  params: Promise<{
    topicName: string;
  }>;
}

/**
 * POST /api/admin/progressive-generation/[topicName]/refresh-metrics
 * 
 * Force metrics refresh for a specific topic
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();
    
    const { topicName: rawTopicName } = await params;
    const topicName = decodeURIComponent(rawTopicName);

    const tracker = await updateAllStagesMetrics(topicName);

    if (!tracker) {
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
      data: tracker,
      message: 'Metrics refreshed successfully',
    });
  } catch (error) {
    logger.error({ error }, 'Error refreshing metrics');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh metrics',
      },
      { status: 500 }
    );
  }
}
