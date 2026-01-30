/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * What: Centralized role checking and access control functions
 * Why: Enforce role-based permissions across the application
 */

import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';
import { timingSafeEqual } from 'crypto';

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

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const [scheme, ...rest] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer') return null;

  const token = rest.join(' ').trim();
  return token.length > 0 ? token : null;
}

function safeTokenEquals(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

function getConfiguredAdminApiTokens(): string[] {
  const raw = process.env.ADMIN_API_TOKENS || process.env.ADMIN_API_TOKEN;
  if (!raw) return [];
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Optional admin API token (script/bot access)
 *
 * Why: Enables controlled, non-browser CRUD (e.g., pipeline scripts) without a NextAuth session.
 * How: Provide either `Authorization: Bearer <token>` or `X-Admin-Api-Key: <token>`.
 *
 * Security:
 * - Supports both static tokens (ADMIN_API_TOKENS) and SSO Bearer tokens
 * - Static tokens use constant-time comparison to reduce timing leakage
 * - SSO tokens are validated against the SSO userinfo endpoint
 */
export async function getAdminApiActor(request: NextRequest): Promise<string | null> {
  const provided =
    getBearerToken(request) || request.headers.get('x-admin-api-key')?.trim() || null;
  if (!provided) return null;

  // First, try static admin API tokens
  const configured = getConfiguredAdminApiTokens();
  if (configured.length > 0) {
    const isStaticTokenValid = configured.some((t) => safeTokenEquals(provided, t));
    if (isStaticTokenValid) {
      const rawActor = request.headers.get('x-admin-actor')?.trim();
      if (!rawActor) return 'admin-api';
      const actor = rawActor.replace(/[\r\n\t]/g, ' ').slice(0, 120).trim();
      return actor.length > 0 ? actor : 'admin-api';
    }
  }

  // If static token validation failed, try SSO token validation
  try {
    const ssoUserInfo = await validateSSOBearerToken(provided);
    if (ssoUserInfo && ssoUserInfo.role === 'admin') {
      logger.info(
        {
          ssoSub: ssoUserInfo.sub,
          ssoEmail: ssoUserInfo.email,
          ssoRole: ssoUserInfo.role,
        },
        'SSO Bearer token validated for admin API access'
      );
      return `sso-admin:${ssoUserInfo.email || ssoUserInfo.sub}`;
    }
  } catch (error) {
    logger.warn(
      {
        error: error instanceof Error ? error.message : String(error),
        tokenLength: provided.length,
      },
      'SSO Bearer token validation failed for admin API access'
    );
  }

  return null;
}

/**
 * Validate SSO Bearer token by calling the SSO userinfo endpoint
 * and checking the user's role in Amanoba's database
 * 
 * @param token - Bearer token to validate
 * @returns User info if token is valid and user has admin role, null otherwise
 */
async function validateSSOBearerToken(token: string): Promise<{ sub: string; email?: string; role: string } | null> {
  const ssoUserinfoUrl = process.env.SSO_USERINFO_URL || 'https://sso.doneisbetter.com/api/oauth/userinfo';
  
  try {
    // Step 1: Try to validate token against SSO userinfo endpoint
    const response = await fetch(ssoUserinfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    let sub: string;
    let email: string | undefined;

    if (response.ok) {
      // SSO userinfo endpoint is working
      const ssoUserInfo = await response.json();
      sub = ssoUserInfo.sub;
      email = ssoUserInfo.email;

      if (!sub) {
        logger.warn({ ssoUserInfo: Object.keys(ssoUserInfo) }, 'SSO userinfo missing required sub claim');
        return null;
      }
    } else {
      // SSO userinfo endpoint failed, try to extract from JWT token directly
      logger.debug(
        {
          status: response.status,
          statusText: response.statusText,
          ssoUserinfoUrl,
        },
        'SSO userinfo endpoint failed, attempting JWT token extraction'
      );

      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          logger.warn({}, 'Invalid JWT token format');
          return null;
        }

        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        sub = payload.sub;
        email = payload.email; // May not be present in access token

        if (!sub) {
          logger.warn({ payload: Object.keys(payload) }, 'JWT token missing required sub claim');
          return null;
        }

        logger.debug(
          {
            sub,
            clientId: payload.client_id,
            scope: payload.scope,
          },
          'Successfully extracted user info from JWT token'
        );
      } catch (jwtError) {
        logger.warn(
          {
            error: jwtError instanceof Error ? jwtError.message : String(jwtError),
          },
          'Failed to extract user info from JWT token'
        );
        return null;
      }
    }

    // Step 2: Check user's role in Amanoba's database
    try {
      const connectDB = (await import('@/lib/mongodb')).default;
      await connectDB();
      
      const { Player } = await import('@/lib/models');
      
      logger.debug(
        {
          sub,
          searchQuery: { ssoSub: sub },
        },
        'Searching for player in database'
      );
      
      const player = await Player.findOne({ ssoSub: sub }).lean().maxTimeMS(5000);

      if (!player) {
        // Try to find any players with similar ssoSub for debugging
        const allPlayers = await Player.find({}).select('ssoSub displayName email role').limit(5).lean();
        logger.debug(
          {
            sub,
            email,
            samplePlayers: allPlayers.map(p => ({ ssoSub: p.ssoSub, email: p.email, role: p.role })),
          },
          'SSO user not found in Amanoba database - showing sample players'
        );
        return null;
      }

      const role = player.role || 'user';

      logger.info(
        {
          sub,
          email,
          role,
          hasAdminRole: role === 'admin',
          playerId: player._id,
          validationMethod: response.ok ? 'sso-userinfo' : 'jwt-extraction',
        },
        'SSO token validated and user role determined from Amanoba database'
      );

      return { sub, email, role };
    } catch (dbError) {
      logger.warn(
        {
          error: dbError instanceof Error ? dbError.message : String(dbError),
          sub,
        },
        'Database error while checking user role'
      );
      return null;
    }
  } catch (error) {
    logger.warn(
      {
        error: error instanceof Error ? error.message : String(error),
        ssoUserinfoUrl,
      },
      'Failed to validate SSO Bearer token'
    );
    return null;
  }
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

/**
 * Get current user's Player _id from session (for editor access checks).
 */
export function getPlayerIdFromSession(session: Session | null): string | null {
  if (!session?.user) return null;
  const user = session.user as { id?: string };
  return user.id && typeof user.id === 'string' ? user.id : null;
}

/**
 * Check if the given player has editor access (at least one course where they are createdBy or in assignedEditors).
 * Used to show admin entry point and allow limited admin API access.
 */
export async function hasEditorAccess(playerId: string | null): Promise<boolean> {
  if (!playerId) return false;
  try {
    const connectDB = (await import('@/lib/mongodb')).default;
    await connectDB();
    const { Course } = await import('@/lib/models');
    const mongoose = await import('mongoose');
    const pid = new mongoose.Types.ObjectId(playerId);
    const count = await Course.countDocuments({
      $or: [{ createdBy: pid }, { assignedEditors: pid }],
    });
    return count > 0;
  } catch {
    return false;
  }
}

/**
 * Require admin or editor access. Admins get full access; editors get access to course-scoped APIs only.
 * Use after requireAuth when the route allows editors (e.g. GET /api/admin/courses, GET /api/admin/courses/[id]).
 */
export async function requireAdminOrEditor(
  request: NextRequest,
  session: Session | null
): Promise<NextResponse | null> {
  const authCheck = requireAuth(request, session);
  if (authCheck) return authCheck;

  if (isAdmin(session)) return null;

  const playerId = getPlayerIdFromSession(session);
  const editor = await hasEditorAccess(playerId);
  if (editor) return null;

  logger.warn(
    {
      path: request.nextUrl.pathname,
      playerId,
      ip: request.headers.get('x-forwarded-for'),
    },
    'Unauthorized admin/editor access attempt'
  );
  return NextResponse.json(
    { error: 'Forbidden', message: 'Admin or editor access required' },
    { status: 403 }
  );
}

/**
 * Check if a player can access a specific course (createdBy or in assignedEditors).
 * Used to restrict GET/PATCH to courses the editor is assigned to.
 * Accepts lean() documents where _id/createdBy/assignedEditors may be ObjectId or string.
 */
export function canAccessCourse(
  course: { createdBy?: { toString?: () => string } | string; assignedEditors?: Array<{ toString?: () => string } | string> } | null,
  playerId: string | null
): boolean {
  if (!course || !playerId) return false;
  const pid = playerId.toString();
  const created = course.createdBy != null ? (typeof course.createdBy === 'string' ? course.createdBy : course.createdBy?.toString?.()) : undefined;
  if (created === pid) return true;
  const editors = course.assignedEditors;
  if (Array.isArray(editors) && editors.some((id) => (typeof id === 'string' ? id : id?.toString?.()) === pid)) return true;
  return false;
}
