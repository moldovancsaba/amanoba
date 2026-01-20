/**
 * SSO Callback Endpoint
 * 
 * What: Handles SSO provider callback, validates token, and creates/updates player
 * Why: Centralized callback handling with token validation and user upsert
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import connectDB from '@/lib/mongodb';
import { Player, Brand } from '@/lib/models';
import { validateSSOToken, extractSSOUserInfo } from '@/lib/auth/sso';
import { signIn } from '@/auth';
import { logAuthEvent, logPlayerRegistration } from '@/lib/analytics/event-logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/sso/callback
 * 
 * Query params:
 * - code: Authorization code from SSO provider
 * - state: State parameter for CSRF protection
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = new URL(request.url);
  
  // Extract locale from URL path (e.g., /hu/api/auth/sso/callback or /en/api/auth/sso/callback)
  // Default to 'hu' if not found
  let locale = 'hu';
  const pathParts = url.pathname.split('/').filter(Boolean);
  if (pathParts.length > 0 && (pathParts[0] === 'hu' || pathParts[0] === 'en')) {
    locale = pathParts[0];
  }
  
  try {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle SSO provider errors
    if (error) {
      logger.warn({ error, errorDescription: searchParams.get('error_description') }, 'SSO provider returned error');
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      logger.warn({ hasCode: !!code, hasState: !!state }, 'Missing required SSO callback parameters');
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=invalid_request`, request.url)
      );
    }

    // Verify state from cookie
    const storedState = request.cookies.get('sso_state')?.value;
    const storedNonce = request.cookies.get('sso_nonce')?.value;
    const returnTo = request.cookies.get('sso_return_to')?.value || '/dashboard';

    if (!storedState || storedState !== state) {
      logger.warn({ state, storedState: !!storedState }, 'SSO state mismatch - possible CSRF attack');
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=invalid_state`, request.url)
      );
    }

    // Exchange authorization code for tokens
    const tokenUrl = process.env.SSO_TOKEN_URL;
    const clientId = process.env.SSO_CLIENT_ID;
    const clientSecret = process.env.SSO_CLIENT_SECRET;
    const redirectUri = process.env.SSO_REDIRECT_URI || `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/api/auth/sso/callback`;

    if (!tokenUrl || !clientId || !clientSecret) {
      logger.error({}, 'SSO token exchange configuration missing');
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=configuration_error`, request.url)
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
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
      logger.error(
        { status: tokenResponse.status, error: errorText },
        'Failed to exchange SSO authorization code for tokens'
      );
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=token_exchange_failed`, request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const idToken = tokenData.id_token;

    if (!idToken) {
      logger.error({ tokenData: Object.keys(tokenData) }, 'SSO token response missing id_token');
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=missing_token`, request.url)
      );
    }

    // Validate ID token
    let claims;
    try {
      claims = await validateSSOToken(idToken);
      if (!claims) {
        logger.error({ tokenLength: idToken?.length }, 'SSO token validation returned null');
        return NextResponse.redirect(
          new URL(`/${locale}/auth/signin?error=token_validation_failed`, request.url)
        );
      }
    } catch (tokenError) {
      const errorMessage = tokenError instanceof Error ? tokenError.message : String(tokenError);
      logger.error(
        {
          error: errorMessage,
          errorStack: tokenError instanceof Error ? tokenError.stack : undefined,
          tokenLength: idToken?.length,
        },
        'SSO token validation threw exception'
      );
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=token_validation_failed`, request.url)
      );
    }

    // DEBUG: Log ID token claims to see what's in it
    logger.info({
      sub: claims.sub,
      email: claims.email,
      name: claims.name,
      role: claims.role,
      roles: claims.roles,
      allClaims: Object.keys(claims)
    }, 'DEBUG: ID token claims received from SSO');

    // Verify nonce (if present in both cookie and token claims)
    // Note: Some SSO providers may not include nonce in token claims
    // Only validate if both are present - if nonce is missing from claims, allow it
    if (storedNonce && claims.nonce) {
      // Both nonce values exist - they must match
      if (claims.nonce !== storedNonce) {
        logger.warn(
          { 
            nonceFromClaims: claims.nonce, 
            nonceFromCookie: storedNonce,
            nonceLength: claims.nonce?.length,
            storedLength: storedNonce?.length
          }, 
          'SSO nonce mismatch'
        );
        return NextResponse.redirect(
          new URL(`/${locale}/auth/signin?error=invalid_nonce`, request.url)
        );
      }
      logger.info({}, 'SSO nonce validated successfully');
    } else if (storedNonce && !claims.nonce) {
      // Nonce was sent but not returned in token - log warning but allow (some providers don't return it)
      logger.warn({}, 'SSO nonce was sent but not found in token claims - allowing login (provider may not return nonce)');
    } else {
      // No nonce in cookie or claims - this is fine for first-time login or if nonce wasn't set
      logger.info({ hasStoredNonce: !!storedNonce, hasClaimsNonce: !!claims.nonce }, 'SSO nonce validation skipped');
    }

    // Extract user information
    let userInfo;
    try {
      userInfo = extractSSOUserInfo(claims);
    } catch (extractError) {
      const errorMessage = extractError instanceof Error ? extractError.message : String(extractError);
      logger.error(
        {
          error: errorMessage,
          errorStack: extractError instanceof Error ? extractError.stack : undefined,
          claimsKeys: Object.keys(claims),
        },
        'Failed to extract user info from SSO claims'
      );
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=user_info_extraction_failed`, request.url)
      );
    }
    
    // DEBUG: Log extracted user info
    logger.info({
      sub: userInfo.sub,
      email: userInfo.email,
      role: userInfo.role
    }, 'DEBUG: Extracted user info from claims');

    try {
      await connectDB();
    } catch (dbError) {
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      logger.error(
        {
          error: errorMessage,
          errorStack: dbError instanceof Error ? dbError.stack : undefined,
        },
        'Failed to connect to database during SSO callback'
      );
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=database_error`, request.url)
      );
    }

    // Get default brand
    const defaultBrand = await Brand.findOne({ slug: 'amanoba' });
    if (!defaultBrand) {
      logger.error({}, 'Default brand not found');
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=brand_not_found`, request.url)
      );
    }

    // Upsert player by SSO sub
    let player = await Player.findOne({ ssoSub: userInfo.sub });

    if (player) {
      // Update existing player
      player.displayName = userInfo.name || player.displayName;
      player.email = userInfo.email || player.email;
      player.role = userInfo.role; // Update role from SSO
      player.authProvider = 'sso';
      player.lastLoginAt = new Date();
      player.lastSeenAt = new Date();
      
      logger.info({
        playerId: player._id,
        ssoSub: userInfo.sub,
        oldRole: player.role,
        newRole: userInfo.role,
        willSave: userInfo.role
      }, 'DEBUG: Updating existing player role');
      
      await player.save();
      
      logger.info({ 
        playerId: player._id, 
        ssoSub: userInfo.sub,
        savedRole: player.role
      }, 'SSO player logged in and saved');
      
      // Log login event
      await logAuthEvent(
        (player._id as any).toString(),
        (player.brandId as any).toString(),
        'login'
      );
    } else {
      // Check if player exists with same email (account linking)
      if (userInfo.email) {
        const existingPlayer = await Player.findOne({ email: userInfo.email });
        if (existingPlayer) {
          // Link SSO to existing account
          existingPlayer.ssoSub = userInfo.sub;
          existingPlayer.role = userInfo.role; // Update role from SSO
          existingPlayer.authProvider = 'sso';
          existingPlayer.displayName = userInfo.name || existingPlayer.displayName;
          existingPlayer.lastLoginAt = new Date();
          existingPlayer.lastSeenAt = new Date();
          
          await existingPlayer.save();
          player = existingPlayer;
          
          logger.info({ playerId: player._id, ssoSub: userInfo.sub }, 'SSO linked to existing player account');
        }
      }

      if (!player) {
        // Create new player
        player = await Player.create({
          ssoSub: userInfo.sub,
          displayName: userInfo.name || 'Player',
          email: userInfo.email,
          brandId: defaultBrand._id,
          locale: 'en', // Default locale
          isPremium: false,
          isActive: true,
          isBanned: false,
          authProvider: 'sso',
          role: userInfo.role,
          lastLoginAt: new Date(),
          lastSeenAt: new Date(),
        });

        logger.info({ playerId: player._id, ssoSub: userInfo.sub }, 'New SSO player created');

        // Initialize PlayerProgression for new player
        const { PlayerProgression } = await import('@/lib/models');
        await PlayerProgression.create({
          playerId: player._id,
          level: 1,
          currentXP: 0,
          totalXP: 0,
          xpToNextLevel: 100,
          title: 'Rookie',
          unlockedTitles: ['Rookie'],
          statistics: {
            totalGamesPlayed: 0,
            totalWins: 0,
            totalLosses: 0,
            totalDraws: 0,
            totalPlayTime: 0,
            averageSessionTime: 0,
            bestStreak: 0,
            currentStreak: 0,
            dailyLoginStreak: 1,
            lastLoginDate: new Date(),
          },
          gameSpecificStats: new Map(),
          achievements: {
            totalUnlocked: 0,
            totalAvailable: 0,
            recentUnlocks: [],
          },
          milestones: [],
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            lastXPGain: new Date(),
          },
        });

        // Initialize PointsWallet for new player
        const { PointsWallet } = await import('@/lib/models');
        await PointsWallet.create({
          playerId: player._id,
          balance: 0,
          lifetimeEarned: 0,
          lifetimeSpent: 0,
        });

        // Initialize Streak for new player
        const { Streak } = await import('@/lib/models');
        await Streak.create({
          playerId: player._id,
          type: 'WIN_STREAK',
          currentStreak: 0,
          longestStreak: 0,
          lastActivityAt: new Date(),
        });

        await Streak.create({
          playerId: player._id,
          type: 'DAILY_LOGIN',
          currentStreak: 1, // First login
          longestStreak: 1,
          lastActivityAt: new Date(),
        });

        logger.info({ playerId: player._id }, 'Initialized SSO player progression, wallet, and streaks');
        
        // Log player registration event
        await logPlayerRegistration(
          (player._id as any).toString(),
          (defaultBrand._id as any).toString()
        );
      }
    }

    // Create NextAuth session using credentials provider
    // Why: Use NextAuth session management for consistency
    logger.info({
      playerId: (player._id as any).toString(),
      displayName: player.displayName,
      roleBeforeSignIn: player.role
    }, 'DEBUG: About to call signIn with role');
    
    let signInResult;
    try {
      signInResult = await signIn('credentials', {
        redirect: false,
        playerId: (player._id as any).toString(),
        displayName: player.displayName,
        isAnonymous: 'false',
        role: player.role, // Pass role to session
      });
    } catch (signInError) {
      const errorMessage = signInError instanceof Error ? signInError.message : String(signInError);
      logger.error(
        {
          error: errorMessage,
          errorStack: signInError instanceof Error ? signInError.stack : undefined,
          playerId: (player._id as any).toString(),
        },
        'Failed to call signIn - exception thrown'
      );
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=session_creation_failed`, request.url)
      );
    }
    
    logger.info({
      signInSuccess: !signInResult?.error,
      rolePassed: player.role,
      signInError: signInResult?.error
    }, 'DEBUG: signIn completed');

    if (!signInResult || signInResult.error) {
      logger.error({ error: signInResult?.error }, 'Failed to create NextAuth session after SSO login');
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?error=session_creation_failed`, request.url)
      );
    }

    // Clear SSO cookies
    // Ensure returnTo has locale prefix if it's a relative path
    let finalReturnTo = returnTo;
    if (returnTo.startsWith('/') && !returnTo.startsWith(`/${locale}/`) && returnTo !== '/') {
      // Add locale prefix to relative paths
      finalReturnTo = `/${locale}${returnTo}`;
    }
    
    const response = NextResponse.redirect(new URL(finalReturnTo, request.url));
    response.cookies.delete('sso_state');
    response.cookies.delete('sso_nonce');
    response.cookies.delete('sso_return_to');

    logger.info({ playerId: player._id, returnTo: finalReturnTo }, 'SSO login completed successfully');

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : undefined;
    
    // Extract locale from URL if not already extracted
    let errorLocale = locale;
    if (!errorLocale) {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0 && (pathParts[0] === 'hu' || pathParts[0] === 'en')) {
        errorLocale = pathParts[0];
      } else {
        errorLocale = 'hu'; // Default fallback
      }
    }
    
    logger.error(
      {
        error: errorMessage,
        errorName,
        errorStack,
        errorType: typeof error,
        url: request.url,
        hasCode: !!searchParams.get('code'),
        hasState: !!searchParams.get('state'),
        locale: errorLocale,
      },
      'SSO callback error - detailed error information'
    );
    
    // Return more specific error if we can identify it
    let errorCode = 'callback_error';
    if (errorMessage.includes('token') || errorMessage.includes('jwt') || errorMessage.includes('JWKS')) {
      errorCode = 'token_validation_failed';
    } else if (errorMessage.includes('database') || errorMessage.includes('mongodb') || errorMessage.includes('connection')) {
      errorCode = 'database_error';
    } else if (errorMessage.includes('session') || errorMessage.includes('signIn')) {
      errorCode = 'session_creation_failed';
    }
    
    return NextResponse.redirect(
      new URL(`/${errorLocale}/auth/signin?error=${errorCode}`, request.url)
    );
  }
}
