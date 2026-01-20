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
    return ssoRole.toLowerCase() === 'admin' || ssoRole.toLowerCase().includes('admin') 
      ? 'admin' 
      : 'user';
  }
  
  // Handle array of roles
  if (Array.isArray(ssoRole) && ssoRole.length > 0) {
    const hasAdminRole = ssoRole.some(
      (role) => role.toLowerCase() === 'admin' || role.toLowerCase().includes('admin')
    );
    return hasAdminRole ? 'admin' : 'user';
  }

  // Default to user if no role provided
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
 * 
 * @param claims - Validated SSO token claims
 * @returns User information for player upsert
 */
export function extractSSOUserInfo(claims: SSOTokenClaims): SSOUserInfo {
  // Try both 'role' (single string) and 'roles' (array)
  // SSO might return role as a string in profile claims
  const roleValue = claims.role || claims.roles;
  const role = mapSSORole(roleValue);

  return {
    sub: claims.sub,
    email: claims.email,
    name: claims.name || claims.email?.split('@')[0] || 'User',
    role,
  };
}
