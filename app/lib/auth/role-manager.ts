/**
 * SSO-Centralized Role Management
 * 
 * What: Single source of truth for user roles from SSO UserInfo endpoint
 * Why: Eliminate role storage in database and ensure real-time role synchronization
 * 
 * Architecture:
 * - SSO UserInfo endpoint is the ONLY authoritative source for roles
 * - Roles are fetched on-demand (not stored in database)
 * - 5-minute cache to reduce SSO API calls while maintaining freshness
 * - Graceful fallback if SSO unavailable (fail-secure: deny admin access)
 * 
 * Usage:
 * ```typescript
 * const isAdmin = await checkAdminAccess(session, accessToken);
 * if (!isAdmin) {
 *   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
 * }
 * ```
 */

import { Session } from 'next-auth';
import { fetchUserInfo, type SSOUserInfo } from './sso-userinfo';
import { logger } from '@/lib/logger';

/**
 * Role Cache Entry
 * 
 * What: Stores role with expiration timestamp
 * Why: Reduce SSO API calls while maintaining role freshness
 */
interface RoleCache {
  role: 'user' | 'admin';
  expiresAt: number; // Unix timestamp in milliseconds
  fetchedAt: number; // Unix timestamp when role was fetched
}

/**
 * In-Memory Role Cache
 * 
 * What: Map of ssoSub -> RoleCache
 * Why: Fast lookups for recently fetched roles
 * 
 * Cache TTL: 5 minutes
 * Cache Key: ssoSub (SSO subject identifier)
 * Cache Invalidation: Automatic on expiration, manual via clearRoleCache()
 */
const roleCache = new Map<string, RoleCache>();

/**
 * Cache TTL in milliseconds
 * 
 * Why: 5 minutes balances freshness with performance
 * - Roles don't change frequently
 * - Reduces SSO API load
 * - Still fresh enough for security
 */
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get role from SSO UserInfo endpoint
 * 
 * What: Fetches role from SSO, uses cache if available and valid
 * Why: Single source of truth for roles, with performance optimization
 * 
 * @param accessToken - OAuth access token for UserInfo endpoint
 * @param ssoSub - SSO subject identifier (unique user ID from SSO)
 * @returns User role ('user' | 'admin')
 * @throws Error if SSO fetch fails and no cache available
 * 
 * Flow:
 * 1. Check cache for valid entry
 * 2. If cache valid, return cached role
 * 3. If cache expired or missing, fetch from SSO
 * 4. Update cache with new role
 * 5. Return role
 */
export async function getRoleFromSSO(
  accessToken: string,
  ssoSub: string
): Promise<'user' | 'admin'> {
  // Check cache first
  const cached = roleCache.get(ssoSub);
  if (cached && cached.expiresAt > Date.now()) {
    logger.debug(
      {
        ssoSub,
        role: cached.role,
        cacheAge: Date.now() - cached.fetchedAt,
      },
      'Role retrieved from cache'
    );
    return cached.role;
  }

  // Cache expired or missing - fetch from SSO
  logger.info({ ssoSub }, 'Fetching role from SSO UserInfo endpoint');

  const userInfo = await fetchUserInfo(accessToken);
  if (!userInfo) {
    // SSO fetch failed - check if this is an expired token error
    // If we have cached admin role and fetch failed, it's likely token expired
    if (cached && cached.role === 'admin') {
      logger.error(
        {
          ssoSub,
          cachedRole: cached.role,
          cacheAge: Date.now() - cached.fetchedAt,
        },
        'CRITICAL: SSO fetch failed for admin user - likely expired token. Throwing error to force logout.'
      );
      // Throw error to force logout instead of using expired cache
      throw new Error('Access token expired - Please log in again');
    }
    
    // SSO fetch failed - try expired cache as fallback (only for non-admin)
    if (cached) {
      logger.warn(
        {
          ssoSub,
          cachedRole: cached.role,
          cacheAge: Date.now() - cached.fetchedAt,
        },
        'SSO fetch failed, using expired cache as fallback (non-admin user)'
      );
      return cached.role;
    }

    // No cache available - fail secure
    logger.error(
      { ssoSub },
      'SSO fetch failed and no cache available - defaulting to user role'
    );
    throw new Error('Failed to fetch role from SSO and no cache available');
  }

  // Update cache with fresh role
  const now = Date.now();
  roleCache.set(ssoSub, {
    role: userInfo.role,
    expiresAt: now + CACHE_TTL_MS,
    fetchedAt: now,
  });

  logger.info(
    {
      ssoSub,
      role: userInfo.role,
      cacheExpiresAt: now + CACHE_TTL_MS,
    },
    'Role fetched from SSO and cached'
  );

  return userInfo.role;
}

/**
 * Check if user has admin access (SSO-based)
 * 
 * What: Verifies admin role from SSO for a given session
 * Why: Centralized admin access check using SSO as source of truth
 * 
 * @param session - NextAuth session object
 * @param accessToken - OAuth access token (optional, will try to get from session if not provided)
 * @returns true if user has admin role, false otherwise
 * 
 * Flow:
 * 1. Verify session exists and has ssoSub
 * 2. Get access token (from parameter or session)
 * 3. Fetch role from SSO (with cache)
 * 4. Return true if role is 'admin'
 */
export async function checkAdminAccessSSO(
  session: Session | null | undefined,
  accessToken?: string
): Promise<boolean> {
  if (!session?.user) {
    logger.debug('No session - admin access denied');
    return false;
  }

  const ssoSub = (session.user as any).ssoSub;
  if (!ssoSub) {
    logger.debug(
      { userId: session.user.id },
      'No ssoSub in session - admin access denied'
    );
    return false;
  }

  // Get access token
  let token = accessToken;
  if (!token) {
    // Try to get from session (if stored)
    token = (session as any).accessToken;
    if (!token) {
      logger.warn(
        { ssoSub, userId: session.user.id },
        'No access token available - cannot check role from SSO'
      );
      // Fail secure: no token = no admin access
      return false;
    }
  }

  try {
    const role = await getRoleFromSSO(token, ssoSub);
    const isAdmin = role === 'admin';

    logger.debug(
      {
        ssoSub,
        userId: session.user.id,
        role,
        isAdmin,
      },
      'Admin access check completed'
    );

    return isAdmin;
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        ssoSub,
        userId: session.user.id,
      },
      'Failed to check admin access - denying access (fail-secure)'
    );
    // Fail secure: error = no admin access
    return false;
  }
}

/**
 * Get user role from SSO
 * 
 * What: Fetches role from SSO for a given session
 * Why: Utility to get role (not just check admin)
 * 
 * @param session - NextAuth session object
 * @param accessToken - OAuth access token (optional)
 * @returns User role ('user' | 'admin') or null if cannot determine
 */
export async function getUserRole(
  session: Session | null | undefined,
  accessToken?: string
): Promise<'user' | 'admin' | null> {
  if (!session?.user) {
    return null;
  }

  const ssoSub = (session.user as any).ssoSub;
  if (!ssoSub) {
    return null;
  }

  let token = accessToken || (session as any).accessToken;
  if (!token) {
    logger.warn({ ssoSub }, 'No access token available - cannot fetch role');
    return null;
  }

  try {
    return await getRoleFromSSO(token, ssoSub);
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        ssoSub,
      },
      'Failed to get user role'
    );
    return null;
  }
}

/**
 * Clear role cache for a specific user
 * 
 * What: Invalidates cached role for a user
 * Why: Force refresh of role on next check (e.g., after role change in SSO)
 * 
 * @param ssoSub - SSO subject identifier
 */
export function clearRoleCache(ssoSub: string): void {
  roleCache.delete(ssoSub);
  logger.info({ ssoSub }, 'Role cache cleared');
}

/**
 * Clear all role caches
 * 
 * What: Invalidates all cached roles
 * Why: Force refresh of all roles (e.g., after SSO maintenance)
 */
export function clearAllRoleCaches(): void {
  const count = roleCache.size;
  roleCache.clear();
  logger.info({ clearedCount: count }, 'All role caches cleared');
}

/**
 * Get cache statistics
 * 
 * What: Returns cache size and expiration info
 * Why: Monitoring and debugging
 * 
 * @returns Cache statistics
 */
export function getCacheStats(): {
  size: number;
  entries: Array<{
    ssoSub: string;
    role: 'user' | 'admin';
    expiresAt: number;
    age: number;
  }>;
} {
  const now = Date.now();
  const entries = Array.from(roleCache.entries()).map(([ssoSub, cache]) => ({
    ssoSub,
    role: cache.role,
    expiresAt: cache.expiresAt,
    age: now - cache.fetchedAt,
  }));

  return {
    size: roleCache.size,
    entries,
  };
}
