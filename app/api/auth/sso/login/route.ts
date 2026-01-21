/**
 * SSO Login Route
 * 
 * What: Initiates SSO OAuth flow by redirecting to SSO provider
 * Why: Start authentication flow with sso.doneisbetter.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { checkRateLimit, authRateLimiter } from '@/lib/security';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/sso/login
 * 
 * What: Redirect user to SSO provider for authentication
 * Query params:
 * - returnTo?: string - URL to redirect to after successful login
 */
export async function GET(request: NextRequest) {
  // Rate limiting for auth endpoints
  const rateLimitResponse = await checkRateLimit(request, authRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const returnTo = searchParams.get('returnTo') || '/dashboard';

    // SSO configuration
    const authUrl = process.env.SSO_AUTH_URL;
    const clientId = process.env.SSO_CLIENT_ID;
    const redirectUri = process.env.SSO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/sso/callback`;
    const scopes = process.env.SSO_SCOPES || 'openid profile email roles';

    if (!authUrl || !clientId) {
      logger.error({}, 'SSO configuration missing (SSO_AUTH_URL or SSO_CLIENT_ID)');
      return NextResponse.json(
        { error: 'SSO configuration error' },
        { status: 500 }
      );
    }

    // Generate state and nonce for security
    const state = crypto.randomBytes(32).toString('base64url');
    const nonce = crypto.randomBytes(32).toString('base64url');

    // Store state in cookie (will be validated in callback)
    const response = NextResponse.redirect(
      `${authUrl}?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${encodeURIComponent(state)}&` +
      `nonce=${encodeURIComponent(nonce)}`
    );

    // Store state and returnTo in secure httpOnly cookie
    response.cookies.set('sso_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    response.cookies.set('sso_return_to', returnTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    response.cookies.set('sso_nonce', nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    logger.info({ state, returnTo }, 'SSO login initiated');

    return response;
  } catch (error) {
    logger.error({ error }, 'SSO login failed');
    return NextResponse.json(
      { error: 'SSO login failed' },
      { status: 500 }
    );
  }
}
