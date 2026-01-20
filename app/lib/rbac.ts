/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * What: Centralized role checking and access control functions
 * Why: Enforce role-based permissions across the application
 */

import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * User Role Types
 */
export type UserRole = 'user' | 'admin';

/**
 * Check if session user has admin role
 * 
 * @param session - NextAuth session object
 * @returns true if user is admin, false otherwise
 */
export function isAdmin(session: Session | null): boolean {
  if (!session?.user) {
    return false;
  }

  const user = session.user as { role?: UserRole };
  return user.role === 'admin';
}

/**
 * Check if session user has required role
 * 
 * @param session - NextAuth session object
 * @param requiredRole - Required role to check
 * @returns true if user has required role, false otherwise
 */
export function hasRole(session: Session | null, requiredRole: UserRole): boolean {
  if (!session?.user) {
    return false;
  }

  const user = session.user as { role?: UserRole };
  const userRole = user.role || 'user';

  // Admin has access to everything
  if (userRole === 'admin') {
    return true;
  }

  // Check if user role matches required role
  return userRole === requiredRole;
}

/**
 * Require authentication middleware
 * 
 * @param request - NextRequest object
 * @param session - NextAuth session object
 * @returns NextResponse with 401 if not authenticated, null if OK
 */
export function requireAuth(
  request: NextRequest,
  session: Session | null
): NextResponse | null {
  if (!session?.user) {
    logger.warn(
      { path: request.nextUrl.pathname, ip: request.headers.get('x-forwarded-for') },
      'Unauthenticated access attempt'
    );
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  return null;
}

/**
 * Require admin role middleware
 * 
 * @param request - NextRequest object
 * @param session - NextAuth session object
 * @returns NextResponse with 403 if not admin, null if OK
 */
export function requireAdmin(
  request: NextRequest,
  session: Session | null
): NextResponse | null {
  // First check authentication
  const authCheck = requireAuth(request, session);
  if (authCheck) {
    return authCheck;
  }

  // Then check admin role
  if (!isAdmin(session)) {
    const user = session?.user as { id?: string; email?: string; role?: UserRole };
    logger.warn(
      {
        path: request.nextUrl.pathname,
        userId: user?.id,
        userEmail: user?.email,
        userRole: user?.role,
        ip: request.headers.get('x-forwarded-for'),
      },
      'Unauthorized admin access attempt'
    );
    return NextResponse.json(
      { error: 'Forbidden', message: 'Admin access required' },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Require specific role middleware
 * 
 * @param request - NextRequest object
 * @param session - NextAuth session object
 * @param requiredRole - Required role
 * @returns NextResponse with 403 if role insufficient, null if OK
 */
export function requireRole(
  request: NextRequest,
  session: Session | null,
  requiredRole: UserRole
): NextResponse | null {
  // First check authentication
  const authCheck = requireAuth(request, session);
  if (authCheck) {
    return authCheck;
  }

  // Then check role
  if (!hasRole(session, requiredRole)) {
    const user = session?.user as { id?: string; email?: string; role?: UserRole };
    logger.warn(
      {
        path: request.nextUrl.pathname,
        userId: user?.id,
        userEmail: user?.email,
        userRole: user?.role,
        requiredRole,
        ip: request.headers.get('x-forwarded-for'),
      },
      'Insufficient role access attempt'
    );
    return NextResponse.json(
      { error: 'Forbidden', message: `Role '${requiredRole}' required` },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Get user role from session
 * 
 * @param session - NextAuth session object
 * @returns User role or 'user' as default
 */
export function getUserRole(session: Session | null): UserRole {
  if (!session?.user) {
    return 'user';
  }

  const user = session.user as { role?: UserRole };
  return user.role || 'user';
}
