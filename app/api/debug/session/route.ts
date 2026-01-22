/**
 * Session Debug Endpoint
 * 
 * What: Returns current session data including role for debugging
 * Why: Help diagnose why admin roles are not appearing
 * 
 * GET /api/debug/session
 */

import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { getSSOConfig } from '@/lib/auth/sso';

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

    // Fetch player from database to compare
    await connectDB();
    const player = await Player.findById(session.user.id).lean();

    // Check SSO configuration
    const ssoConfig = getSSOConfig();
    const ssoConfigStatus = {
      hasSSO_ISSUER: !!process.env.SSO_ISSUER,
      hasSSO_CLIENT_ID: !!process.env.SSO_CLIENT_ID,
      hasSSO_JWKS_URL: !!process.env.SSO_JWKS_URL,
      hasSSO_USERINFO_URL: !!process.env.SSO_USERINFO_URL, // CRITICAL for admin roles
      hasSSO_TOKEN_URL: !!process.env.SSO_TOKEN_URL,
      hasSSO_AUTH_URL: !!process.env.SSO_AUTH_URL,
      ssoIssuer: process.env.SSO_ISSUER || 'NOT SET',
      ssoUserInfoUrl: process.env.SSO_USERINFO_URL || 'NOT SET - CRITICAL FOR ADMIN ROLES',
    };

    return NextResponse.json({
      authenticated: true,
      timestamp: new Date().toISOString(),
      session: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role || 'NOT SET',
        authProvider: (session.user as any).authProvider || 'NOT SET',
        ssoSub: (session.user as any).ssoSub || 'NOT SET',
        isAnonymous: (session.user as any).isAnonymous ?? false,
        locale: (session.user as any).locale || 'NOT SET',
        hasAccessToken: !!(session as any).accessToken,
        accessTokenLength: (session as any).accessToken ? String((session as any).accessToken).length : 0,
        hasRefreshToken: !!(session as any).refreshToken,
        tokenExpiresAt: (session as any).tokenExpiresAt || null,
        tokenExpired: (session as any).tokenExpiresAt ? Date.now() > (session as any).tokenExpiresAt : null,
      },
      database: player ? {
        playerId: player._id,
        displayName: player.displayName,
        email: player.email,
        role: player.role || 'NOT SET',
        authProvider: player.authProvider || 'NOT SET',
        ssoSub: player.ssoSub || 'NOT SET',
        isAnonymous: player.isAnonymous ?? false,
        lastLoginAt: player.lastLoginAt,
        createdAt: player.createdAt,
      } : null,
      diagnostics: {
        roleMatch: player ? (session.user as any).role === player.role : 'player_not_found',
        isAdminInSession: (session.user as any).role === 'admin',
        isAdminInDatabase: player?.role === 'admin',
        hasRoleInSession: !!(session.user as any).role,
        hasRoleInDatabase: !!player?.role,
        roleSource: player?.authProvider === 'sso' ? 'SSO UserInfo endpoint' : 'Unknown',
        sessionRoleValue: (session.user as any).role,
        databaseRoleValue: player?.role,
      },
      ssoRoleCheck: (session as any).accessToken && (session.user as any).ssoSub ? {
        canCheckSSO: true,
        message: 'Access token available - can check SSO role',
        note: 'Try calling /api/debug/sso-role-check to verify SSO role',
      } : {
        canCheckSSO: false,
        message: 'No access token or ssoSub - cannot check SSO role',
        hasAccessToken: !!(session as any).accessToken,
        hasSsoSub: !!(session.user as any).ssoSub,
      },
      ssoConfiguration: ssoConfigStatus,
      recommendations: [
        !ssoConfigStatus.hasSSO_USERINFO_URL ? '❌ CRITICAL: SSO_USERINFO_URL is not set - admin roles cannot be extracted' : '✅ SSO_USERINFO_URL is configured',
        !player?.ssoSub ? '⚠️ Player has no ssoSub - may not be an SSO user' : '✅ Player has ssoSub',
        player?.role !== 'admin' ? '⚠️ Player role in database is not "admin" - need to sync from SSO' : '✅ Player role is "admin" in database',
        (session.user as any).role !== 'admin' ? '⚠️ Session role is not "admin" - JWT callback may not be refreshing correctly' : '✅ Session role is "admin"',
        player && (session.user as any).role !== player.role ? '⚠️ Role mismatch: session role does not match database role' : '✅ Role matches between session and database',
      ],
    });
  } catch (error) {
    logger.error({ error }, 'Session debug endpoint failed');
    return NextResponse.json(
      {
        error: 'Failed to fetch session data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
