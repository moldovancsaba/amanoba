/**
 * SSO UserInfo Endpoint Utilities
 * 
 * What: Fetch user information from SSO UserInfo endpoint as fallback
 * Why: Some SSO providers don't include all claims in ID token, need to fetch from UserInfo
 */

import { logger } from '@/lib/logger';
import { extractSSOUserInfo, type SSOUserInfo } from './sso';

/**
 * Fetch user information from SSO UserInfo endpoint
 * 
 * @param accessToken - OAuth access token
 * @returns User information or null if fetch fails
 */
export async function fetchUserInfo(accessToken: string): Promise<SSOUserInfo | null> {
  try {
    const userInfoUrl = process.env.SSO_USERINFO_URL;
    if (!userInfoUrl) {
      logger.error(
        { 
          hasAccessToken: !!accessToken,
          envVars: {
            hasSSO_ISSUER: !!process.env.SSO_ISSUER,
            hasSSO_CLIENT_ID: !!process.env.SSO_CLIENT_ID,
            hasSSO_JWKS_URL: !!process.env.SSO_JWKS_URL,
            hasSSO_USERINFO_URL: false,
          }
        }, 
        'SSO_USERINFO_URL not configured - CRITICAL: Admin roles come from UserInfo endpoint'
      );
      console.error('❌ CRITICAL: SSO_USERINFO_URL environment variable is not set.');
      console.error('   SSO role management happens on UserInfo endpoint.');
      console.error('   Without this, admin roles cannot be extracted.');
      return null;
    }

    logger.info({ userInfoUrl }, 'Fetching user info from SSO UserInfo endpoint (role management source)');

    const response = await fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      
      // Check if this is a token expiration error (401 Unauthorized)
      if (response.status === 401) {
        logger.error(
          { 
            status: response.status, 
            statusText: response.statusText,
            errorText: errorText.substring(0, 200),
          }, 
          'CRITICAL: UserInfo endpoint returned 401 - Access token expired'
        );
        // Return null but the error will be handled by caller to force logout
        return null;
      }
      
      logger.warn(
        { 
          status: response.status, 
          statusText: response.statusText,
          errorText: errorText.substring(0, 200) // Limit error text length
        }, 
        'UserInfo endpoint returned error'
      );
      return null;
    }

    const userInfo = await response.json();
    
    // Log raw UserInfo response for debugging
    logger.info(
      {
        userInfoKeys: Object.keys(userInfo),
        hasRole: !!(userInfo as any).role,
        hasRoles: !!(userInfo as any).roles,
        rawUserInfo: JSON.stringify(userInfo).substring(0, 500), // First 500 chars for debugging
      },
      'Raw UserInfo response received'
    );
    
    // Extract user info using same logic as token claims
    const ssoUserInfo = extractSSOUserInfo(userInfo as any);

    logger.info(
      {
        sub: ssoUserInfo.sub,
        email: ssoUserInfo.email,
        role: ssoUserInfo.role,
        roleClaimPresent: ssoUserInfo.roleClaimPresent ?? false,
        extractedFromUserInfo: true,
      },
      'UserInfo fetched and processed successfully - this is the source of truth for roles'
    );

    return ssoUserInfo;
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      },
      'Failed to fetch user info from SSO UserInfo endpoint'
    );
    return null;
  }
}
