/**
 * Admin Authorization Utilities
 * 
 * What: Utilities for checking admin access and authorization
 * Why: Centralize admin role checks using SSO as single source of truth
 * 
 * IMPORTANT: This module now uses SSO UserInfo endpoint for role checks.
 * Roles are fetched from SSO in real-time (with 5-minute cache).
 * Database role field is deprecated and will be removed.
 */

import { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { checkAdminAccessSSO, getUserRole } from './role-manager';

/**
 * Check if a session user has admin role
 * 
 * What: Checks admin role from SSO UserInfo endpoint (with cache)
 * Why: SSO is the single source of truth for roles
 * 
 * @param session - NextAuth session object
 * @returns Promise<boolean> - true if user has admin role, false otherwise
 * 
 * Note: This is now async because it fetches from SSO
 */
export async function isAdmin(session: Session | null | undefined): Promise<boolean> {
  if (!session?.user) {
    return false;
  }

  // CRITICAL: Check if access token is expired for admin users
  const tokenExpiresAt = (session as any).tokenExpiresAt;
  const isTokenExpired = tokenExpiresAt ? Date.now() > tokenExpiresAt : false;
  const currentRole = (session.user as any).role;
  
  if (isTokenExpired && currentRole === 'admin') {
    logger.error(
      {
        userId: session.user.id,
        tokenExpiresAt,
        currentTime: Date.now(),
        role: currentRole,
      },
      'CRITICAL: Admin access token expired - cannot verify admin status, returning false to force logout'
    );
    // Return false to deny access - this will trigger logout
    return false;
  }

  // Try SSO-based check first (if access token available and not expired)
  const accessToken = (session as any).accessToken;
  if (accessToken && (session.user as any).ssoSub && !isTokenExpired) {
    try {
      return await checkAdminAccessSSO(session, accessToken);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // If error is about expired token and user is admin, deny access
      if ((errorMessage.includes('expired') || errorMessage.includes('Expired')) && currentRole === 'admin') {
        logger.error(
          {
            error: errorMessage,
            userId: session.user.id,
            role: currentRole,
          },
          'CRITICAL: Admin SSO token expired - denying access to force logout'
        );
        return false;
      }
      
      logger.warn(
        {
          error: errorMessage,
          userId: session.user.id,
        },
        'SSO role check failed, falling back to session role'
      );
    }
  }

  // Fallback to session role (for backward compatibility during migration)
  // But only if token is not expired or user is not admin
  const role = (session.user as any).role;
  return role === 'admin';
}

/**
 * Get user role from session or SSO
 * 
 * What: Gets role from SSO if available, otherwise from session
 * Why: Hybrid approach during migration to SSO-only
 * 
 * @param session - NextAuth session object
 * @returns Promise<'admin' | 'user' | null>
 */
export async function getRole(session: Session | null | undefined): Promise<'admin' | 'user' | null> {
  if (!session?.user) {
    return null;
  }

  // Try SSO-based check first (if access token available)
  const accessToken = (session as any).accessToken;
  if (accessToken && (session.user as any).ssoSub) {
    try {
      return await getUserRole(session, accessToken);
    } catch (error) {
      logger.warn(
        {
          error: error instanceof Error ? error.message : String(error),
          userId: session.user.id,
        },
        'SSO role fetch failed, falling back to session role'
      );
    }
  }

  // Fallback to session role (for backward compatibility during migration)
  return (session.user as any).role || 'user';
}

/**
 * Check admin access and return error response if not admin
 * Use this in API routes to protect admin endpoints
 * 
 * What: Checks admin role from SSO UserInfo endpoint
 * Why: SSO is the single source of truth for roles
 * 
 * @param session - NextAuth session object
 * @param apiPath - API path for logging (e.g., '/api/admin/courses')
 * @returns Promise<NextResponse | null> - NextResponse with 403 error if not admin, null if admin
 * 
 * Note: This is now async because it fetches from SSO
 */
export async function checkAdminAccess(
  session: Session | null | undefined,
  apiPath: string
): Promise<NextResponse | null> {
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // CRITICAL: Check if access token is expired for admin users
  const tokenExpiresAt = (session as any).tokenExpiresAt;
  const isTokenExpired = tokenExpiresAt ? Date.now() > tokenExpiresAt : false;
  const currentRole = (session.user as any).role;
  
  if (isTokenExpired && currentRole === 'admin') {
    logger.error(
      {
        userId: session.user.id,
        tokenExpiresAt,
        currentTime: Date.now(),
        role: currentRole,
        path: apiPath,
      },
      'CRITICAL: Admin access token expired - forcing logout via 401 response'
    );
    // Return 401 to force client-side logout
    return NextResponse.json(
      { 
        error: 'Session expired - Please log in again',
        code: 'TOKEN_EXPIRED',
        forceLogout: true,
      },
      { status: 401 }
    );
  }

  // Try SSO-based check first (if access token available and not expired)
  const accessToken = (session as any).accessToken;
  if (accessToken && (session.user as any).ssoSub && !isTokenExpired) {
    try {
      const isAdmin = await checkAdminAccessSSO(session, accessToken);
      if (!isAdmin) {
        logger.warn(
          { userId: session.user.id, ssoSub: (session.user as any).ssoSub, path: apiPath },
          'Non-admin user attempted to access admin API (SSO check)'
        );
        return NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        );
      }
      return null; // Admin access granted
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // If error is about expired token and user is admin, force logout
      if ((errorMessage.includes('expired') || errorMessage.includes('Expired')) && currentRole === 'admin') {
        logger.error(
          {
            error: errorMessage,
            userId: session.user.id,
            role: currentRole,
            path: apiPath,
          },
          'CRITICAL: Admin SSO token expired - forcing logout via 401 response'
        );
        return NextResponse.json(
          { 
            error: 'Session expired - Please log in again',
            code: 'TOKEN_EXPIRED',
            forceLogout: true,
          },
          { status: 401 }
        );
      }
      
      logger.warn(
        {
          error: errorMessage,
          userId: session.user.id,
          path: apiPath,
        },
        'SSO role check failed, falling back to session role check'
      );
    }
  }

  // Fallback to session role check (for backward compatibility during migration)
  // But only if token is not expired or user is not admin
  const userRole = (session.user as any).role;
  if (userRole !== 'admin') {
    logger.warn(
      { userId: session.user.id, role: userRole, path: apiPath },
      'Non-admin user attempted to access admin API (session role check)'
    );
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  return null;
}
