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

    logger.info({}, 'Fetching user info from SSO UserInfo endpoint');

    const response = await fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      logger.warn({ status: response.status, statusText: response.statusText }, 'UserInfo endpoint returned error');
      return null;
    }

    const userInfo = await response.json();
    
    // Extract user info using same logic as token claims
    const ssoUserInfo = extractSSOUserInfo(userInfo as any);

    logger.info(
      {
        sub: ssoUserInfo.sub,
        email: ssoUserInfo.email,
        role: ssoUserInfo.role,
      },
      'UserInfo fetched successfully from SSO endpoint'
    );

    return ssoUserInfo;
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      'Failed to fetch user info from SSO UserInfo endpoint'
    );
    return null;
  }
}
