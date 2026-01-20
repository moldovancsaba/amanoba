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
    const scopes = process.env.SSO_SCOPES || 'openid profile email roles';

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

    // Get returnTo from query params or default to dashboard
    const { searchParams } = new URL(request.url);
    const returnTo = searchParams.get('returnTo') || '/dashboard';

    // Store state and nonce in encrypted cookie (valid for 10 minutes)
    const response = NextResponse.redirect(
      `${authUrl}?` +
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scopes,
        state,
        nonce,
        prompt: 'login', // Force fresh login
      }).toString()
    );

    // Store state, nonce, and returnTo in HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 600, // 10 minutes
      path: '/',
    };

    response.cookies.set('sso_state', state, cookieOptions);
    response.cookies.set('sso_nonce', nonce, cookieOptions);
    response.cookies.set('sso_return_to', returnTo, cookieOptions);

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
