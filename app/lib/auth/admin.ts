/**
 * Admin Authorization Utilities
 * 
 * What: Utilities for checking admin access and authorization
 * Why: Centralize admin role checks using database role as source of truth
 */

import { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Check if a session user has admin role
 * 
 * What: Checks admin role from session (synced from database)
 * Why: Roles are managed locally in MongoDB
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
  const role = (session.user as any).role;
  return role === 'admin';
}

/**
 * Get user role from session or SSO
 * 
 * What: Gets role from session
 * Why: Roles are managed locally in MongoDB
 * 
 * @param session - NextAuth session object
 * @returns Promise<'admin' | 'user' | null>
 */
export async function getRole(session: Session | null | undefined): Promise<'admin' | 'user' | null> {
  if (!session?.user) {
    return null;
  }
  return (session.user as any).role || 'user';
}

/**
 * Check admin access and return error response if not admin
 * Use this in API routes to protect admin endpoints
 * 
 * What: Checks admin role from session
 * Why: Roles are managed locally in MongoDB
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

  const userRole = (session.user as any).role;
  if (userRole !== 'admin') {
    logger.warn(
      { userId: session.user.id, role: userRole, path: apiPath },
      'Non-admin user attempted to access admin API'
    );
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  return null;
}
