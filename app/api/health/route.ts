/**
 * Health Check API Endpoint
 * 
 * What: Returns application health status including database connectivity
 * Why: Used by monitoring systems and deployment platforms to verify application health
 * 
 * Returns:
 * - 200: Application is healthy
 * - 503: Application is unhealthy (database connection failed)
 */

import { NextResponse } from 'next/server';
import connectDB, { getConnectionState } from '../../lib/mongodb';
import { logger } from '../../lib/logger';

// Use Node.js runtime for MongoDB connection
// Why: MongoDB requires Node.js runtime, not Edge
export const runtime = 'nodejs';

// Disable caching for health checks
// Why: Health status should always be current
export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * 
 * What: Returns health status with database connection state
 * Why: Monitoring systems need to verify both app and database are operational
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Attempt database connection
    // Why: Verify database is accessible
    await connectDB();

    // Get connection state
    // Why: Detailed status helps with debugging
    const connectionState = getConnectionState();
    
    // Map connection state to readable string
    // Why: Human-readable status for logs and monitoring
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const dbStatus = stateMap[connectionState] || 'unknown';
    const responseTime = Date.now() - startTime;

    // Log health check
    // Why: Track health check requests for debugging
    logger.info(
      {
        dbStatus,
        connectionState,
        responseTimeMs: responseTime,
      },
      'Health check passed'
    );

    // Return healthy status
    // Why: 200 indicates application is fully operational
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          status: dbStatus,
          state: connectionState,
        },
        responseTimeMs: responseTime,
        version: process.env.npm_package_version || '1.0.0',
      },
      { status: 200 }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Log health check failure
    // Why: Critical error, needs immediate attention
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTimeMs: responseTime,
      },
      'Health check failed'
    );

    // Return unhealthy status
    // Why: 503 Service Unavailable indicates application cannot serve requests
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTimeMs: responseTime,
      },
      { status: 503 }
    );
  }
}
