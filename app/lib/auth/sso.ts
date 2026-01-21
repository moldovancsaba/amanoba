/**
 * SSO Authentication Utilities
 * 
 * What: Utilities for SSO token validation, JWKS fetching, and role mapping
 * Why: Centralize SSO authentication logic for maintainability and security
 */

import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose';
import { logger } from '@/lib/logger';

/**
 * SSO Configuration
 */
export interface SSOConfig {
  issuer: string;
  clientId: string;
  jwksUri: string;
  audience?: string;
}

/**
 * SSO Token Claims
 */
export interface SSOTokenClaims extends JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  role?: string; // Single role string from SSO
  roles?: string[]; // Array of roles (if provided)
  [key: string]: unknown;
}

/**
 * Get SSO configuration from environment variables
 */
export function getSSOConfig(): SSOConfig | null {
  const issuer = process.env.SSO_ISSUER;
  const clientId = process.env.SSO_CLIENT_ID;
  const jwksUri = process.env.SSO_JWKS_URL;

  if (!issuer || !clientId || !jwksUri) {
    logger.warn({ issuer: !!issuer, clientId: !!clientId, jwksUri: !!jwksUri }, 'SSO configuration incomplete');
    return null;
  }

  return {
    issuer,
    clientId,
    jwksUri,
    audience: process.env.SSO_CLIENT_ID, // Usually same as clientId
  };
}

/**
 * Create JWKS remote set for token verification
 */
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

export function getJWKSSet(): ReturnType<typeof createRemoteJWKSet> | null {
  const config = getSSOConfig();
  if (!config) {
    return null;
  }

  if (!jwksCache) {
    jwksCache = createRemoteJWKSet(new URL(config.jwksUri));
  }

  return jwksCache;
}

/**
 * Validate and decode SSO ID token
 * 
 * @param token - JWT ID token from SSO provider
 * @returns Decoded token claims or null if invalid
 */
export async function validateSSOToken(token: string): Promise<SSOTokenClaims | null> {
  try {
    const config = getSSOConfig();
    if (!config) {
      logger.error({}, 'SSO configuration missing');
      return null;
    }

    const jwks = getJWKSSet();
    if (!jwks) {
      logger.error({}, 'Failed to initialize JWKS');
      return null;
    }

    // Verify token signature, issuer, audience, and expiration
    const { payload } = await jwtVerify(token, jwks, {
      issuer: config.issuer,
      audience: config.audience || config.clientId,
    });

    // Type assertion for our claims structure
    const claims = payload as SSOTokenClaims;

    // Validate required claims
    if (!claims.sub) {
      logger.error({ claims: Object.keys(claims) }, 'Token missing required "sub" claim');
      return null;
    }

    logger.info(
      {
        sub: claims.sub,
        email: claims.email,
        roles: claims.roles,
      },
      'SSO token validated successfully'
    );

    return claims;
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : undefined,
      },
      'SSO token validation failed'
    );
    return null;
  }
}

/**
 * Map SSO roles to application roles
 * 
 * @param ssoRole - Single role string or array of roles from SSO token
 * @returns Application role ('admin' | 'user')
 */
export function mapSSORole(ssoRole?: string | string[]): 'user' | 'admin' {
  // Handle single role string
  if (typeof ssoRole === 'string') {
    const normalizedRole = ssoRole.toLowerCase().trim();
    // Check for exact match or contains "admin"
    if (normalizedRole === 'admin' || normalizedRole.includes('admin')) {
      logger.info({ originalRole: ssoRole, normalizedRole }, 'SSO role mapped to admin');
      return 'admin';
    }
    logger.info({ originalRole: ssoRole, normalizedRole }, 'SSO role mapped to user');
    return 'user';
  }
  
  // Handle array of roles
  if (Array.isArray(ssoRole) && ssoRole.length > 0) {
    const normalizedRoles = ssoRole.map(r => typeof r === 'string' ? r.toLowerCase().trim() : String(r).toLowerCase().trim());
    const hasAdminRole = normalizedRoles.some(
      (role) => role === 'admin' || role.includes('admin')
    );
    if (hasAdminRole) {
      logger.info({ originalRoles: ssoRole, normalizedRoles, foundAdmin: true }, 'SSO role array contains admin');
      return 'admin';
    }
    logger.info({ originalRoles: ssoRole, normalizedRoles, foundAdmin: false }, 'SSO role array does not contain admin');
    return 'user';
  }

  // Default to user if no role provided
  logger.warn({ ssoRole, ssoRoleType: typeof ssoRole }, 'No role found in SSO token, defaulting to user');
  return 'user';
}

/**
 * Extract user information from SSO token claims
 */
export interface SSOUserInfo {
  sub: string;
  email?: string;
  name?: string;
  role: 'user' | 'admin';
}

/**
 * Extract user information from validated SSO token
 * Enhanced role extraction from 15+ claim locations
 * 
 * @param claims - Validated SSO token claims
 * @returns User information for player upsert
 */
export function extractSSOUserInfo(claims: SSOTokenClaims): SSOUserInfo {
  // Enhanced role extraction - check 15+ claim locations
  // Why: Different SSO providers may put roles in different claim locations
  const roleValue = 
    claims.role || 
    claims.roles || 
    (claims as any).user_role || 
    (claims as any).groups || 
    (claims as any).permissions ||
    (claims as any).authorities || // Common in Spring Security
    (claims as any).realm_access?.roles || // Keycloak format
    (claims as any).resource_access?.[process.env.SSO_CLIENT_ID || '']?.roles || // Keycloak resource roles
    (claims as any)['https://sso.doneisbetter.com/roles'] || // Custom claim namespace
    (claims as any)['https://sso.doneisbetter.com/groups'] || // Custom claim namespace
    (claims as any).custom_roles || // Custom claim
    (claims as any).app_roles || // Azure AD app roles
    (claims as any).wids || // Azure AD Windows groups
    (claims as any).groups || // Generic groups
    (claims as any).organization_roles || // Organization-specific roles
    (claims as any).role_assignments; // Role assignments array
  
  const role = mapSSORole(roleValue);
  
  // Comprehensive logging for debugging
  logger.info(
    {
      hasRole: !!claims.role,
      hasRoles: !!claims.roles,
      roleValue,
      roleValueType: typeof roleValue,
      roleValueIsArray: Array.isArray(roleValue),
      extractedRole: role,
      allClaimKeys: Object.keys(claims),
      // Log all potential role-related claims
      roleClaim: claims.role,
      rolesClaim: claims.roles,
      userRoleClaim: (claims as any).user_role,
      groupsClaim: (claims as any).groups,
      permissionsClaim: (claims as any).permissions,
      authoritiesClaim: (claims as any).authorities,
      realmAccess: (claims as any).realm_access,
      resourceAccess: (claims as any).resource_access,
      // Log custom SSO provider claims
      customRolesClaim: (claims as any)['https://sso.doneisbetter.com/roles'],
      customGroupsClaim: (claims as any)['https://sso.doneisbetter.com/groups'],
      // Log first 500 chars of full claims for debugging
      claimsPreview: JSON.stringify(claims).substring(0, 500),
    },
    'SSO role extraction - enhanced (15+ claim locations) - checking ID token'
  );

  return {
    sub: claims.sub,
    email: claims.email,
    name: claims.name || claims.email?.split('@')[0] || 'User',
    role,
  };
}
