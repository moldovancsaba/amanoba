/**
 * SSO Logout Endpoint
 * 
 * What: Handles SSO logout (local session clear + optional provider logout)
 * Why: Centralized logout handling with optional SSO provider logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/auth';
import { logger } from '@/lib/logger';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/sso/logout
 * 
 * Body:
 * - returnTo?: string - URL to redirect to after logout
 */
export async function POST(request: NextRequest) {
  // Rate limiting: 100 requests per 15 minutes per IP
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json().catch(() => ({}));
    const returnTo = body.returnTo || '/';

    // Sign out from NextAuth (clears session)
    await signOut({ redirect: false });

    // Optional: Call SSO provider logout endpoint if configured
    const logoutUrl = process.env.SSO_LOGOUT_URL;
    if (logoutUrl) {
      const clientId = process.env.SSO_CLIENT_ID;
      const postLogoutRedirectUri = process.env.SSO_POST_LOGOUT_REDIRECT_URI || 
        `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}${returnTo}`;

      // If provider supports front-channel logout, redirect to logout URL
      // Otherwise, just clear local session (which we already did)
      if (logoutUrl && clientId) {
        const providerLogoutUrl = `${logoutUrl}?` +
          new URLSearchParams({
            client_id: clientId,
            post_logout_redirect_uri: postLogoutRedirectUri,
          }).toString();

        logger.info({ returnTo }, 'Redirecting to SSO provider logout');
        return NextResponse.redirect(providerLogoutUrl);
      }
    }

    logger.info({ returnTo }, 'SSO logout completed (local only)');
    
    return NextResponse.json({ success: true, returnTo });
  } catch (error) {
    logger.error({ error }, 'SSO logout error');
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/sso/logout
 * 
 * Convenience GET endpoint for logout
 */
export async function GET(request: NextRequest) {
  // Rate limiting: 100 requests per 15 minutes per IP
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo') || '/';

  try {
    await signOut({ redirect: false });

    const logoutUrl = process.env.SSO_LOGOUT_URL;
    if (logoutUrl) {
      const clientId = process.env.SSO_CLIENT_ID;
      const postLogoutRedirectUri = process.env.SSO_POST_LOGOUT_REDIRECT_URI || 
        `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}${returnTo}`;

      if (clientId) {
        const providerLogoutUrl = `${logoutUrl}?` +
          new URLSearchParams({
            client_id: clientId,
            post_logout_redirect_uri: postLogoutRedirectUri,
          }).toString();

        return NextResponse.redirect(providerLogoutUrl);
      }
    }

    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (error) {
    logger.error({ error }, 'SSO logout error');
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}
