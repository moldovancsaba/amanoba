/**
 * Admin System Info API
 * 
 * What: REST endpoint for system information
 * Why: Provides real system metrics for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
import packageJson from '../../../../package.json';

/**
 * GET /api/admin/system-info
 * 
 * What: Get system information
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    // Check database connection
    const dbStatus = await checkDatabaseConnection();

    // Get environment
    const environment = process.env.NODE_ENV || 'development';

    // Read version from package.json (already imported)
    const version = packageJson.version || '2.7.0';

    // Uptime from Node process start (process.uptime() = seconds since process started)
    const uptimeSeconds = process.uptime();
    const uptime = formatUptime(uptimeSeconds);

    return NextResponse.json({
      success: true,
      systemInfo: {
        version,
        environment,
        database: dbStatus,
        uptime,
        uptimeSeconds: Math.round(uptimeSeconds),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch system info');
    return NextResponse.json({ error: 'Failed to fetch system info' }, { status: 500 });
  }
}

/**
 * Format process uptime (seconds) as human-readable string (e.g. "2h 30m" or "3d 2h 15m").
 */
function formatUptime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0s';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(' ');
}

async function checkDatabaseConnection(): Promise<string> {
  try {
    const mongoose = await import('mongoose');
    if (mongoose.default.connection.readyState === 1) {
      return 'connected';
    }
    return 'disconnected';
  } catch (_error) {
    return 'error';
  }
}
