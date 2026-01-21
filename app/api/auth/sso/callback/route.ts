/**
 * SSO Callback Route
 * 
 * What: Handles OAuth callback from SSO provider, validates token, creates/updates player
 * Why: Complete SSO authentication flow and sync roles from SSO
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { checkRateLimit, authRateLimiter } from '@/lib/security';
import connectDB from '@/lib/mongodb';
import { Player, Brand } from '@/lib/models';
import { validateSSOToken, extractSSOUserInfo } from '@/lib/auth/sso';
import { fetchUserInfo } from '@/lib/auth/sso-userinfo';
import { signIn } from '@/auth';
import { logPlayerRegistration, logAuthEvent } from '@/lib/analytics';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/sso/callback
 * 
 * What: Handle OAuth callback from SSO provider (GET with query params)
 * Query params:
 * - code: string - Authorization code from SSO provider
 * - state: string - State parameter for CSRF protection
 */
export async function GET(request: NextRequest) {
  // Rate limiting for auth endpoints
  const rateLimitResponse = await checkRateLimit(request, authRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      logger.warn({}, 'SSO callback missing authorization code');
      return NextResponse.redirect(new URL('/auth/error?error=missing_code', request.url));
    }

    // Validate state from cookie
    const storedState = request.cookies.get('sso_state')?.value;
    if (!storedState || storedState !== state) {
      logger.warn({ storedState: !!storedState, state: !!state }, 'SSO state mismatch');
      return NextResponse.redirect(new URL('/auth/error?error=invalid_state', request.url));
    }

    const returnTo = request.cookies.get('sso_return_to')?.value || '/dashboard';
    const nonce = request.cookies.get('sso_nonce')?.value;

    // Exchange code for tokens
    const tokenUrl = process.env.SSO_TOKEN_URL;
    const clientId = process.env.SSO_CLIENT_ID;
    const clientSecret = process.env.SSO_CLIENT_SECRET;
    const redirectUri = process.env.SSO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/sso/callback`;

    if (!tokenUrl || !clientId || !clientSecret) {
      logger.error({}, 'SSO token exchange configuration missing');
      return NextResponse.redirect(new URL('/auth/error?error=config_error', request.url));
    }

    logger.info({}, 'Exchanging authorization code for tokens');

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      logger.error({ status: tokenResponse.status, error: errorText }, 'Token exchange failed');
      return NextResponse.redirect(new URL('/auth/error?error=token_exchange_failed', request.url));
    }

    const tokens = await tokenResponse.json();
    const { id_token, access_token } = tokens;

    if (!id_token) {
      logger.error({}, 'ID token missing from token response');
      return NextResponse.redirect(new URL('/auth/error?error=missing_id_token', request.url));
    }

    // Validate ID token
    const claims = await validateSSOToken(id_token);
    if (!claims) {
      logger.error({}, 'ID token validation failed');
      return NextResponse.redirect(new URL('/auth/error?error=invalid_token', request.url));
    }

    // Extract user info from token
    let ssoUserInfo = extractSSOUserInfo(claims);

    // Fallback to UserInfo endpoint if role not found in token
    if (ssoUserInfo.role === 'user' && access_token) {
      logger.info({}, 'Role not found in ID token, trying UserInfo endpoint');
      const userInfo = await fetchUserInfo(access_token);
      if (userInfo && userInfo.role === 'admin') {
        // UserInfo endpoint found admin role
        ssoUserInfo = userInfo;
        logger.info({}, 'Admin role found via UserInfo endpoint fallback');
      }
    }

    await connectDB();

    // Get default brand
    const defaultBrand = await Brand.findOne({ slug: 'amanoba' }) || await Brand.findOne({});
    if (!defaultBrand) {
      logger.error({}, 'No brand found for SSO user');
      return NextResponse.redirect(new URL('/auth/error?error=brand_error', request.url));
    }

    // Upsert player by SSO sub
    let player = await Player.findOne({ ssoSub: ssoUserInfo.sub });

    if (player) {
      // Update existing player - sync email, name, and role from SSO
      player.email = ssoUserInfo.email || player.email;
      player.displayName = ssoUserInfo.name || player.displayName;
      player.role = ssoUserInfo.role; // SSO is source of truth for roles
      player.authProvider = 'sso';
      player.lastLoginAt = new Date();
      await player.save();

      logger.info(
        {
          playerId: player._id,
          ssoSub: ssoUserInfo.sub,
          role: ssoUserInfo.role,
          updated: true,
        },
        'SSO user updated - role synced from SSO'
      );
    } else {
      // Create new player
      player = await Player.create({
        ssoSub: ssoUserInfo.sub,
        email: ssoUserInfo.email,
        displayName: ssoUserInfo.name || ssoUserInfo.email?.split('@')[0] || 'User',
        role: ssoUserInfo.role,
        authProvider: 'sso',
        brandId: defaultBrand._id,
        isPremium: false,
        isAnonymous: false,
        isActive: true,
        isBanned: false,
        locale: 'en',
        lastLoginAt: new Date(),
      });

      logger.info(
        {
          playerId: player._id,
          ssoSub: ssoUserInfo.sub,
          role: ssoUserInfo.role,
          created: true,
        },
        'SSO user created - role from SSO'
      );

      // Log registration
      await logPlayerRegistration(
        (player._id as mongoose.Types.ObjectId).toString(),
        (defaultBrand._id as mongoose.Types.ObjectId).toString(),
        'sso'
      );
    }

    // Log auth event
    await logAuthEvent(
      (player._id as mongoose.Types.ObjectId).toString(),
      (defaultBrand._id as mongoose.Types.ObjectId).toString(),
      'login'
    );

    // Sign in with NextAuth using credentials provider
    // Why: Use NextAuth session management for consistency
    // CRITICAL: Pass the role from SSO (which was just synced to player.role)
    const finalRole = player.role || 'user';
    logger.info(
      {
        playerId: (player._id as mongoose.Types.ObjectId).toString(),
        role: finalRole,
        ssoSub: player.ssoSub,
      },
      'Signing in with NextAuth - role from SSO (GET handler)'
    );
    
    await signIn('credentials', {
      redirect: false,
      playerId: (player._id as mongoose.Types.ObjectId).toString(),
      displayName: player.displayName,
      isAnonymous: 'false',
      role: finalRole, // This role comes from SSO (UserInfo endpoint or ID token)
    });

    // Clear SSO cookies and redirect
    const response = NextResponse.redirect(new URL(returnTo, request.url));

    response.cookies.delete('sso_state');
    response.cookies.delete('sso_return_to');
    response.cookies.delete('sso_nonce');

    return response;
  } catch (error) {
    logger.error({ error }, 'SSO callback failed');
    return NextResponse.redirect(new URL('/auth/error?error=callback_failed', request.url));
  }
}

/**
 * POST /api/auth/sso/callback
 * 
 * What: Exchange authorization code for tokens and create/update player (alternative endpoint)
 * Body:
 * - code: string - Authorization code from SSO provider
 * - state: string - State parameter for CSRF protection
 */
export async function POST(request: NextRequest) {
  // Rate limiting for auth endpoints
  const rateLimitResponse = await checkRateLimit(request, authRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { code, state } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Validate state from cookie
    const storedState = request.cookies.get('sso_state')?.value;
    if (!storedState || storedState !== state) {
      logger.warn({ storedState: !!storedState, state: !!state }, 'SSO state mismatch');
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 400 }
      );
    }

    const returnTo = request.cookies.get('sso_return_to')?.value || '/dashboard';
    const nonce = request.cookies.get('sso_nonce')?.value;

    // Exchange code for tokens
    const tokenUrl = process.env.SSO_TOKEN_URL;
    const clientId = process.env.SSO_CLIENT_ID;
    const clientSecret = process.env.SSO_CLIENT_SECRET;
    const redirectUri = process.env.SSO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/sso/callback`;

    if (!tokenUrl || !clientId || !clientSecret) {
      logger.error({}, 'SSO token exchange configuration missing');
      return NextResponse.json(
        { error: 'SSO configuration error' },
        { status: 500 }
      );
    }

    logger.info({}, 'Exchanging authorization code for tokens');

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      logger.error({ status: tokenResponse.status, error: errorText }, 'Token exchange failed');
      return NextResponse.json(
        { error: 'Token exchange failed' },
        { status: 500 }
      );
    }

    const tokens = await tokenResponse.json();
    const { id_token, access_token } = tokens;

    if (!id_token) {
      logger.error({}, 'ID token missing from token response');
      return NextResponse.json(
        { error: 'ID token missing' },
        { status: 500 }
      );
    }

    // Validate ID token
    const claims = await validateSSOToken(id_token);
    if (!claims) {
      logger.error({}, 'ID token validation failed');
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      );
    }

    // Extract user info from token
    let ssoUserInfo = extractSSOUserInfo(claims);

    // CRITICAL: Always try UserInfo endpoint as fallback (SSO role management happens there)
    // Why: Some SSO providers (like sso.doneisbetter.com) put roles in UserInfo, not ID token
    if (access_token) {
      logger.info(
        { 
          roleFromToken: ssoUserInfo.role,
          sub: ssoUserInfo.sub,
          email: ssoUserInfo.email 
        }, 
        'Attempting UserInfo endpoint to get role (SSO role management source)'
      );
      const userInfo = await fetchUserInfo(access_token);
      if (userInfo) {
        // UserInfo endpoint is source of truth for roles
        logger.info(
          { 
            roleFromToken: ssoUserInfo.role,
            roleFromUserInfo: userInfo.role,
            sub: userInfo.sub 
          }, 
          'UserInfo endpoint returned role - using as source of truth'
        );
        ssoUserInfo = userInfo; // UserInfo wins - it's where SSO role management happens
      } else {
        logger.warn({}, 'UserInfo endpoint did not return data, using ID token role');
      }
    } else {
      logger.warn({}, 'No access token available for UserInfo endpoint fallback');
    }

    await connectDB();

    // Get default brand
    const defaultBrand = await Brand.findOne({ slug: 'amanoba' }) || await Brand.findOne({});
    if (!defaultBrand) {
      logger.error({}, 'No brand found for SSO user');
      return NextResponse.json(
        { error: 'Brand configuration error' },
        { status: 500 }
      );
    }

    // Upsert player by SSO sub
    let player = await Player.findOne({ ssoSub: ssoUserInfo.sub });

    if (player) {
      // Update existing player - sync email, name, and role from SSO
      player.email = ssoUserInfo.email || player.email;
      player.displayName = ssoUserInfo.name || player.displayName;
      player.role = ssoUserInfo.role; // SSO is source of truth for roles
      player.authProvider = 'sso';
      player.lastLoginAt = new Date();
      await player.save();

      logger.info(
        {
          playerId: player._id,
          ssoSub: ssoUserInfo.sub,
          role: ssoUserInfo.role,
          updated: true,
        },
        'SSO user updated - role synced from SSO'
      );
    } else {
      // Create new player
      player = await Player.create({
        ssoSub: ssoUserInfo.sub,
        email: ssoUserInfo.email,
        displayName: ssoUserInfo.name || ssoUserInfo.email?.split('@')[0] || 'User',
        role: ssoUserInfo.role,
        authProvider: 'sso',
        brandId: defaultBrand._id,
        isPremium: false,
        isAnonymous: false,
        isActive: true,
        isBanned: false,
        locale: 'en',
        lastLoginAt: new Date(),
      });

      logger.info(
        {
          playerId: player._id,
          ssoSub: ssoUserInfo.sub,
          role: ssoUserInfo.role,
          created: true,
        },
        'SSO user created - role from SSO'
      );

      // Log registration
      await logPlayerRegistration(
        (player._id as mongoose.Types.ObjectId).toString(),
        (defaultBrand._id as mongoose.Types.ObjectId).toString(),
        'sso'
      );
    }

    // Log auth event
    await logAuthEvent(
      (player._id as mongoose.Types.ObjectId).toString(),
      (defaultBrand._id as mongoose.Types.ObjectId).toString(),
      'login'
    );

    // Sign in with NextAuth using credentials provider
    // Why: Use NextAuth session management for consistency
    // CRITICAL: Pass the role from SSO (which was just synced to player.role)
    const finalRole = player.role || 'user';
    logger.info(
      {
        playerId: (player._id as mongoose.Types.ObjectId).toString(),
        role: finalRole,
        ssoSub: player.ssoSub,
      },
      'Signing in with NextAuth - role from SSO'
    );
    
    await signIn('credentials', {
      redirect: false,
      playerId: (player._id as mongoose.Types.ObjectId).toString(),
      displayName: player.displayName,
      isAnonymous: 'false',
      role: finalRole, // This role comes from SSO (UserInfo endpoint or ID token)
    });

    // Clear SSO cookies
    const response = NextResponse.json({
      success: true,
      playerId: (player._id as mongoose.Types.ObjectId).toString(),
      returnTo,
    });

    response.cookies.delete('sso_state');
    response.cookies.delete('sso_return_to');
    response.cookies.delete('sso_nonce');

    return response;
  } catch (error) {
    logger.error({ error }, 'SSO callback failed');
    return NextResponse.json(
      {
        error: 'SSO authentication failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
