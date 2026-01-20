/**
 * SSO Login Initiation Endpoint
 * 
 * What: Initiates SSO login flow by redirecting to SSO provider
 * Why: Centralized SSO login entry point with state/nonce management
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/sso/login
 * 
 * Query params:
 * - returnTo?: string - URL to redirect to after login
 */
export async function GET(request: NextRequest) {
  try {
    const authUrl = process.env.SSO_AUTH_URL;
    const clientId = process.env.SSO_CLIENT_ID;
    const redirectUri = process.env.SSO_REDIRECT_URI || `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/api/auth/sso/callback`;
    // Default to standard OIDC scopes if not configured
    // Note: 'roles' is not a standard OIDC scope - provider may not support it
    // If SSO_SCOPES is set, use it; otherwise use standard scopes
    const scopes = process.env.SSO_SCOPES || 'openid profile email';

    if (!authUrl || !clientId) {
      logger.error({}, 'SSO configuration missing');
      return NextResponse.json(
        { error: 'SSO not configured' },
        { status: 500 }
      );
    }

    // Generate state and nonce for security
    const state = randomBytes(32).toString('base64url');
    const nonce = randomBytes(32).toString('base64url');

    // Get returnTo and referral code from query params
    const { searchParams } = new URL(request.url);
    const returnTo = searchParams.get('returnTo') || '/dashboard';
    const referralCode = searchParams.get('ref'); // Extract referral code from URL

    // Build authorization URL
    // Note: Some SSO providers may not support 'prompt' parameter
    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes,
      state,
      nonce,
    });

    // Only add prompt if explicitly supported (some providers don't support it)
    // Remove prompt=login if provider shows empty page
    // const promptSupported = process.env.SSO_PROMPT_SUPPORTED === 'true';
    // if (promptSupported) {
    //   authParams.set('prompt', 'login');
    // }

    const authUrlWithParams = `${authUrl}?${authParams.toString()}`;
    
    logger.info(
      {
        authUrl: authUrlWithParams.substring(0, 100) + '...', // Log partial URL for security
        redirectUri,
        clientId: clientId.substring(0, 8) + '...', // Log partial client ID
      },
      'SSO login redirect URL generated'
    );

    const response = NextResponse.redirect(authUrlWithParams);

    // Store state, nonce, and returnTo in HTTP-only cookie
    // Note: Domain should not be set to allow cookies to work across subdomains
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 600, // 10 minutes
      path: '/',
      // Don't set domain - let browser handle it automatically
    };

    response.cookies.set('sso_state', state, cookieOptions);
    response.cookies.set('sso_nonce', nonce, cookieOptions);
    response.cookies.set('sso_return_to', returnTo, cookieOptions);
    
    // Store referral code in cookie if present
    if (referralCode) {
      response.cookies.set('referral_code', referralCode, cookieOptions);
      logger.info({ referralCode }, 'Referral code stored in cookie');
    }

    logger.info({ state, returnTo }, 'SSO login initiated');

    return response;
  } catch (error) {
    logger.error({ error }, 'Failed to initiate SSO login');
    return NextResponse.json(
      { error: 'Failed to initiate login' },
      { status: 500 }
    );
  }
}
