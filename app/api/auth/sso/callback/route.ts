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
    const tokenRole = ssoUserInfo.role;

    // CRITICAL: Always try UserInfo endpoint (SSO role management happens there)
    // Why: sso.doneisbetter.com manages roles on UserInfo endpoint, not ID token
    if (!access_token) {
      logger.error(
        { 
          hasIdToken: !!id_token,
          roleFromToken: ssoUserInfo.role,
        }, 
        'CRITICAL: No access token available - cannot fetch UserInfo endpoint for role'
      );
      // Continue with ID token role, but log warning
    } else {
      logger.info(
        { 
          roleFromToken: ssoUserInfo.role,
          sub: ssoUserInfo.sub,
          email: ssoUserInfo.email,
          userInfoUrl: process.env.SSO_USERINFO_URL ? 'configured' : 'MISSING'
        }, 
        'Fetching role from UserInfo endpoint (SSO role management source)'
      );
      
      const userInfo = await fetchUserInfo(access_token);
      if (userInfo) {
        const hasUserInfoRole = userInfo.roleClaimPresent ?? false;
        if (hasUserInfoRole) {
          // UserInfo endpoint is source of truth for roles only if it actually contains a role claim
          logger.info(
            { 
              roleFromToken: tokenRole,
              roleFromUserInfo: userInfo.role,
              sub: userInfo.sub,
              roleChanged: tokenRole !== userInfo.role
            }, 
            'UserInfo endpoint returned role claim - using as source of truth'
          );
          ssoUserInfo = userInfo;
        } else {
          // Keep token role if UserInfo lacks role claim
          logger.warn(
            { 
              roleFromToken: tokenRole,
              roleFromUserInfo: userInfo.role,
              sub: userInfo.sub,
            },
            'UserInfo endpoint missing role claim - keeping token role'
          );
          ssoUserInfo = {
            ...ssoUserInfo,
            email: userInfo.email || ssoUserInfo.email,
            name: userInfo.name || ssoUserInfo.name,
            sub: userInfo.sub || ssoUserInfo.sub,
          };
        }
      } else {
        logger.error(
          { 
            roleFromToken: tokenRole,
            userInfoUrl: process.env.SSO_USERINFO_URL ? 'configured' : 'MISSING'
          }, 
          'CRITICAL: UserInfo endpoint did not return data - admin roles may be missing'
        );
        // Continue with ID token role, but this is a problem
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
      // Update existing player - sync email/name, update role only if SSO supplied a role claim
      const previousRole = player.role;
      const hasRoleClaim = ssoUserInfo.roleClaimPresent ?? false;
      player.email = ssoUserInfo.email || player.email;
      player.displayName = ssoUserInfo.name || player.displayName;
      if (hasRoleClaim) {
        player.role = ssoUserInfo.role; // Update role only if SSO provided a role claim
      }
      player.authProvider = 'sso';
      player.lastLoginAt = new Date();
      await player.save();

      logger.info(
        {
          playerId: player._id,
          ssoSub: ssoUserInfo.sub,
          previousRole,
          newRole: player.role,
          roleChanged: previousRole !== player.role,
          roleClaimPresent: hasRoleClaim,
          updated: true,
        },
        hasRoleClaim
          ? 'SSO user updated - role synced from SSO role claim'
          : 'SSO user updated - role unchanged (no role claim provided)'
      );
      
      if (hasRoleClaim && previousRole !== ssoUserInfo.role) {
        logger.warn(
          {
            playerId: player._id,
            previousRole,
            newRole: player.role,
          },
          'Player role changed during SSO sync - admin access may have changed'
        );
      }
    } else {
      // Create new player
      const hasRoleClaim = ssoUserInfo.roleClaimPresent ?? false;
      player = await Player.create({
        ssoSub: ssoUserInfo.sub,
        email: ssoUserInfo.email,
        displayName: ssoUserInfo.name || ssoUserInfo.email?.split('@')[0] || 'User',
        role: hasRoleClaim ? ssoUserInfo.role : 'user',
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
          role: player.role,
          created: true,
        },
        hasRoleClaim
          ? 'SSO user created - role from SSO role claim'
          : 'SSO user created - defaulted to user (no role claim)'
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
        hasAccessToken: !!access_token,
        hasRefreshToken: !!tokens.refresh_token,
      },
      'Signing in with NextAuth - role from SSO (GET handler)'
    );
    
    // Store access token in session for role checks
    // Why: Need access token to call SSO UserInfo endpoint for real-time role checks
    await signIn('credentials', {
      redirect: false,
      playerId: (player._id as mongoose.Types.ObjectId).toString(),
      displayName: player.displayName,
      isAnonymous: 'false',
      role: finalRole, // This role comes from SSO (UserInfo endpoint or ID token)
      ssoSub: player.ssoSub || undefined, // SSO subject identifier (for middleware)
      accessToken: access_token || undefined, // Store for SSO role checks
      refreshToken: tokens.refresh_token || undefined, // Store for token renewal
      tokenExpiresAt: tokens.expires_in ? Date.now() + (tokens.expires_in * 1000) : undefined, // Token expiration
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
    const tokenRole = ssoUserInfo.role;

    // CRITICAL: Always try UserInfo endpoint (SSO role management happens there)
    // Why: sso.doneisbetter.com manages roles on UserInfo endpoint, not ID token
    if (!access_token) {
      logger.error(
        { 
          hasIdToken: !!id_token,
          roleFromToken: ssoUserInfo.role,
        }, 
        'CRITICAL: No access token available - cannot fetch UserInfo endpoint for role'
      );
      // Continue with ID token role, but log warning
    } else {
      logger.info(
        { 
          roleFromToken: ssoUserInfo.role,
          sub: ssoUserInfo.sub,
          email: ssoUserInfo.email,
          userInfoUrl: process.env.SSO_USERINFO_URL ? 'configured' : 'MISSING'
        }, 
        'Fetching role from UserInfo endpoint (SSO role management source)'
      );
      
      const userInfo = await fetchUserInfo(access_token);
      if (userInfo) {
        const hasUserInfoRole = userInfo.roleClaimPresent ?? false;
        if (hasUserInfoRole) {
          // UserInfo endpoint is source of truth for roles only if it actually contains a role claim
          logger.info(
            { 
              roleFromToken: tokenRole,
              roleFromUserInfo: userInfo.role,
              sub: userInfo.sub,
              roleChanged: tokenRole !== userInfo.role
            }, 
            'UserInfo endpoint returned role claim - using as source of truth'
          );
          ssoUserInfo = userInfo;
        } else {
          // Keep token role if UserInfo lacks role claim
          logger.warn(
            { 
              roleFromToken: tokenRole,
              roleFromUserInfo: userInfo.role,
              sub: userInfo.sub,
            },
            'UserInfo endpoint missing role claim - keeping token role'
          );
          ssoUserInfo = {
            ...ssoUserInfo,
            email: userInfo.email || ssoUserInfo.email,
            name: userInfo.name || ssoUserInfo.name,
            sub: userInfo.sub || ssoUserInfo.sub,
          };
        }
      } else {
        logger.error(
          { 
            roleFromToken: tokenRole,
            userInfoUrl: process.env.SSO_USERINFO_URL ? 'configured' : 'MISSING'
          }, 
          'CRITICAL: UserInfo endpoint did not return data - admin roles may be missing'
        );
        // Continue with ID token role, but this is a problem
      }
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
      // Update existing player - sync email/name, update role only if SSO supplied a role claim
      const previousRole = player.role;
      const hasRoleClaim = ssoUserInfo.roleClaimPresent ?? false;
      player.email = ssoUserInfo.email || player.email;
      player.displayName = ssoUserInfo.name || player.displayName;
      if (hasRoleClaim) {
        player.role = ssoUserInfo.role; // Update role only if SSO provided a role claim
      }
      player.authProvider = 'sso';
      player.lastLoginAt = new Date();
      await player.save();

      logger.info(
        {
          playerId: player._id,
          ssoSub: ssoUserInfo.sub,
          previousRole,
          newRole: player.role,
          roleChanged: previousRole !== player.role,
          roleClaimPresent: hasRoleClaim,
          updated: true,
        },
        hasRoleClaim
          ? 'SSO user updated - role synced from SSO role claim'
          : 'SSO user updated - role unchanged (no role claim provided)'
      );
      
      if (hasRoleClaim && previousRole !== ssoUserInfo.role) {
        logger.warn(
          {
            playerId: player._id,
            previousRole,
            newRole: player.role,
          },
          'Player role changed during SSO sync - admin access may have changed'
        );
      }
    } else {
      // Create new player
      const hasRoleClaim = ssoUserInfo.roleClaimPresent ?? false;
      player = await Player.create({
        ssoSub: ssoUserInfo.sub,
        email: ssoUserInfo.email,
        displayName: ssoUserInfo.name || ssoUserInfo.email?.split('@')[0] || 'User',
        role: hasRoleClaim ? ssoUserInfo.role : 'user',
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
          role: player.role,
          created: true,
        },
        hasRoleClaim
          ? 'SSO user created - role from SSO role claim'
          : 'SSO user created - defaulted to user (no role claim)'
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
        hasAccessToken: !!access_token,
        hasRefreshToken: !!tokens.refresh_token,
      },
      'Signing in with NextAuth - role from SSO (POST handler)'
    );
    
    // Store access token in session for role checks
    // Why: Need access token to call SSO UserInfo endpoint for real-time role checks
    await signIn('credentials', {
      redirect: false,
      playerId: (player._id as mongoose.Types.ObjectId).toString(),
      displayName: player.displayName,
      isAnonymous: 'false',
      role: finalRole, // This role comes from SSO (UserInfo endpoint or ID token)
      ssoSub: player.ssoSub || undefined, // SSO subject identifier (for middleware)
      accessToken: access_token || undefined, // Store for SSO role checks
      refreshToken: tokens.refresh_token || undefined, // Store for token renewal
      tokenExpiresAt: tokens.expires_in ? Date.now() + (tokens.expires_in * 1000) : undefined, // Token expiration
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
