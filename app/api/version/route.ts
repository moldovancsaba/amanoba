/**
 * Version Information API
 * 
 * What: Returns current app version and deployment info
 * Why: Allows frontend to check version and show update notifications
 * 
 * Endpoint: GET /api/version
 * Returns: { version, buildTime, environment, commitSha }
 */

import { NextResponse } from 'next/server';
import { getVersionInfo } from '@/app/lib/version';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const versionInfo = getVersionInfo();
  
  return NextResponse.json({
    success: true,
    data: {
      version: versionInfo.version,
      buildTime: versionInfo.buildTime,
      name: versionInfo.name,
      environment: process.env.NODE_ENV || 'development',
      vercelEnv: process.env.VERCEL_ENV || 'local',
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
      branch: process.env.VERCEL_GIT_COMMIT_REF || 'local',
    },
  }, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache for 5 minutes
    },
  });
}
