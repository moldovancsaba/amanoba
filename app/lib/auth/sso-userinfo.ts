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
      logger.warn({}, 'SSO_USERINFO_URL not configured, skipping UserInfo fetch');
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
