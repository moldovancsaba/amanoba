/**
 * Admin Authorization Utilities
 * 
 * What: Utilities for checking admin access and authorization
 * Why: Centralize admin role checks for consistency and security
 */

import { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Check if a session user has admin role
 * 
 * @param session - NextAuth session object
 * @returns true if user has admin role, false otherwise
 */
export function isAdmin(session: Session | null | undefined): boolean {
  if (!session?.user) {
    return false;
  }

  const role = (session.user as any).role;
  return role === 'admin';
}

/**
 * Get admin role from session
 * 
 * @param session - NextAuth session object
 * @returns 'admin' | 'user' | null
 */
export function getRole(session: Session | null | undefined): 'admin' | 'user' | null {
  if (!session?.user) {
    return null;
  }

  return (session.user as any).role || 'user';
}

/**
 * Check admin access and return error response if not admin
 * Use this in API routes to protect admin endpoints
 * 
 * @param session - NextAuth session object
 * @param apiPath - API path for logging (e.g., '/api/admin/courses')
 * @returns NextResponse with 403 error if not admin, null if admin
 */
export function checkAdminAccess(
  session: Session | null | undefined,
  apiPath: string
): NextResponse | null {
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
