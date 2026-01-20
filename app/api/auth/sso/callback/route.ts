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
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle SSO provider errors
    if (error) {
      logger.warn({ error, errorDescription: searchParams.get('error_description') }, 'SSO provider returned error');
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      logger.warn({ hasCode: !!code, hasState: !!state }, 'Missing required SSO callback parameters');
      return NextResponse.redirect(
        new URL('/auth/signin?error=invalid_request', request.url)
      );
    }

    // Verify state from cookie
    const storedState = request.cookies.get('sso_state')?.value;
    const storedNonce = request.cookies.get('sso_nonce')?.value;
    const returnTo = request.cookies.get('sso_return_to')?.value || '/dashboard';

    if (!storedState || storedState !== state) {
      logger.warn({ state, storedState: !!storedState }, 'SSO state mismatch - possible CSRF attack');
      return NextResponse.redirect(
        new URL('/auth/signin?error=invalid_state', request.url)
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
        new URL('/auth/signin?error=configuration_error', request.url)
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
        new URL('/auth/signin?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const idToken = tokenData.id_token;

    if (!idToken) {
      logger.error({ tokenData: Object.keys(tokenData) }, 'SSO token response missing id_token');
      return NextResponse.redirect(
        new URL('/auth/signin?error=missing_token', request.url)
      );
    }

    // Validate ID token
    const claims = await validateSSOToken(idToken);
    if (!claims) {
      logger.error({}, 'SSO token validation failed');
      return NextResponse.redirect(
        new URL('/auth/signin?error=token_validation_failed', request.url)
      );
    }

    // Verify nonce
    if (storedNonce && claims.nonce !== storedNonce) {
      logger.warn({ nonce: claims.nonce, storedNonce }, 'SSO nonce mismatch');
      return NextResponse.redirect(
        new URL('/auth/signin?error=invalid_nonce', request.url)
      );
    }

    // Extract user information
    const userInfo = extractSSOUserInfo(claims);

    await connectDB();

    // Get default brand
    const defaultBrand = await Brand.findOne({ slug: 'amanoba' });
    if (!defaultBrand) {
      logger.error({}, 'Default brand not found');
      return NextResponse.redirect(
        new URL('/auth/signin?error=brand_not_found', request.url)
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
      
      await player.save();
      
      logger.info({ playerId: player._id, ssoSub: userInfo.sub }, 'SSO player logged in');
      
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
    const signInResult = await signIn('credentials', {
      redirect: false,
      playerId: (player._id as any).toString(),
      displayName: player.displayName,
      isAnonymous: 'false',
    });

    if (!signInResult || signInResult.error) {
      logger.error({ error: signInResult?.error }, 'Failed to create NextAuth session after SSO login');
      return NextResponse.redirect(
        new URL('/auth/signin?error=session_creation_failed', request.url)
      );
    }

    // Clear SSO cookies
    const response = NextResponse.redirect(new URL(returnTo, request.url));
    response.cookies.delete('sso_state');
    response.cookies.delete('sso_nonce');
    response.cookies.delete('sso_return_to');

    logger.info({ playerId: player._id, returnTo }, 'SSO login completed successfully');

    return response;
  } catch (error) {
    logger.error({ error }, 'SSO callback error');
    return NextResponse.redirect(
      new URL('/auth/signin?error=callback_error', request.url)
    );
  }
}
