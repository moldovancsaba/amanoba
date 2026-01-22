/**
 * Role Check Debug Endpoint
 * 
 * What: Comprehensive role checking from all sources
 * Why: Diagnose why admin access is not working
 * 
 * GET /api/debug/role-check
 */

import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { getUserRole, checkAdminAccessSSO } from '@/lib/auth/role-manager';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        message: 'Not authenticated - please log in',
      });
    }

    await connectDB();
    const player = await Player.findById(session.user.id).lean();

    const sessionRole = (session.user as any).role;
    const sessionSsoSub = (session.user as any).ssoSub;
    const sessionAccessToken = (session as any).accessToken;
    const databaseRole = player?.role;

    // Try SSO role check
    let ssoRole: 'user' | 'admin' | null = null;
    let ssoCheckError: string | null = null;
    if (sessionAccessToken && sessionSsoSub) {
      try {
        ssoRole = await getUserRole(session, sessionAccessToken);
      } catch (error) {
        ssoCheckError = error instanceof Error ? error.message : String(error);
      }
    }

    // Try SSO admin check
    let ssoIsAdmin = false;
    let ssoAdminCheckError: string | null = null;
    if (sessionAccessToken && sessionSsoSub) {
      try {
        ssoIsAdmin = await checkAdminAccessSSO(session, sessionAccessToken);
      } catch (error) {
        ssoAdminCheckError = error instanceof Error ? error.message : String(error);
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      session: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: sessionRole || 'NOT SET',
        ssoSub: sessionSsoSub || 'NOT SET',
        authProvider: (session.user as any).authProvider || 'NOT SET',
        hasAccessToken: !!sessionAccessToken,
        accessTokenLength: sessionAccessToken ? String(sessionAccessToken).length : 0,
        tokenExpiresAt: (session as any).tokenExpiresAt || null,
        tokenExpired: (session as any).tokenExpiresAt ? Date.now() > (session as any).tokenExpiresAt : null,
      },
      database: player ? {
        playerId: player._id,
        displayName: player.displayName,
        email: player.email,
        role: databaseRole || 'NOT SET',
        ssoSub: player.ssoSub || 'NOT SET',
        authProvider: player.authProvider || 'NOT SET',
      } : null,
      sso: {
        role: ssoRole,
        isAdmin: ssoIsAdmin,
        checkError: ssoCheckError,
        adminCheckError: ssoAdminCheckError,
        canCheck: !!(sessionAccessToken && sessionSsoSub),
      },
      comparison: {
        sessionRole,
        databaseRole,
        ssoRole,
        allMatch: sessionRole === databaseRole && databaseRole === ssoRole,
        sessionIsAdmin: sessionRole === 'admin',
        databaseIsAdmin: databaseRole === 'admin',
        ssoIsAdmin,
      },
      recommendations: [
        !sessionRole || sessionRole === 'NOT SET' ? '❌ CRITICAL: Session role is not set - log out and log back in via SSO' : `✅ Session role: ${sessionRole}`,
        !databaseRole || databaseRole === 'NOT SET' ? '⚠️ Database role is not set - SSO sync may have failed' : `✅ Database role: ${databaseRole}`,
        !ssoRole ? '⚠️ Cannot check SSO role - access token may be missing or expired' : `✅ SSO role: ${ssoRole}`,
        !sessionAccessToken ? '❌ CRITICAL: No access token in session - log out and log back in via SSO' : '✅ Access token available',
        !sessionSsoSub ? '❌ CRITICAL: No ssoSub in session - log out and log back in via SSO' : '✅ ssoSub available',
        sessionRole !== 'admin' && databaseRole !== 'admin' && ssoRole !== 'admin' ? '❌ You do not have admin role from any source' : '✅ Admin role detected',
        sessionRole !== databaseRole ? '⚠️ Session role does not match database role - session may need refresh' : '✅ Session and database roles match',
        databaseRole !== ssoRole && ssoRole ? '⚠️ Database role does not match SSO role - database may be stale' : '✅ Database and SSO roles match',
      ],
      actionRequired: !sessionRole || sessionRole === 'NOT SET' || sessionRole !== 'admin' 
        ? 'LOG OUT AND LOG BACK IN VIA SSO to refresh your session with the correct role'
        : 'Session role is set correctly',
    });
  } catch (error) {
    logger.error({ error }, 'Role check endpoint failed');
    return NextResponse.json(
      {
        error: 'Failed to check role',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
