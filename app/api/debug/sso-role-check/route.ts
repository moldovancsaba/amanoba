/**
 * SSO Role Check Debug Endpoint
 * 
 * What: Checks role directly from SSO UserInfo endpoint
 * Why: Verify that SSO role extraction is working correctly
 * 
 * GET /api/debug/sso-role-check
 */

import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/auth/role-manager';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        message: 'Not authenticated',
      });
    }

    const accessToken = (session as any).accessToken;
    const ssoSub = (session.user as any).ssoSub;

    if (!accessToken) {
      return NextResponse.json({
        error: 'No access token available',
        message: 'Access token is required to check SSO role. Please log out and log back in via SSO.',
        hasAccessToken: false,
        hasSsoSub: !!ssoSub,
      });
    }

    if (!ssoSub) {
      return NextResponse.json({
        error: 'No ssoSub available',
        message: 'SSO subject identifier is required. Please log out and log back in via SSO.',
        hasAccessToken: !!accessToken,
        hasSsoSub: false,
      });
    }

    try {
      const role = await getUserRole(session, accessToken);
      
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        ssoRole: role,
        isAdmin: role === 'admin',
        sessionRole: (session.user as any).role,
        roleMatch: role === (session.user as any).role,
        ssoSub,
        hasAccessToken: true,
        message: role === 'admin' 
          ? '✅ You have admin role from SSO' 
          : '❌ You do not have admin role from SSO',
        recommendation: role !== (session.user as any).role
          ? '⚠️ SSO role does not match session role - session may need refresh'
          : '✅ SSO role matches session role',
      });
    } catch (error) {
      logger.error({ error }, 'SSO role check failed');
      return NextResponse.json({
        error: 'Failed to check SSO role',
        details: error instanceof Error ? error.message : String(error),
        hasAccessToken: !!accessToken,
        hasSsoSub: !!ssoSub,
      }, { status: 500 });
    }
  } catch (error) {
    logger.error({ error }, 'SSO role check endpoint failed');
    return NextResponse.json(
      {
        error: 'Failed to check SSO role',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
