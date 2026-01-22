/**
 * NextAuth.js Main Configuration
 * 
 * What: Authentication setup with Player model integration
 * Why: Connect Facebook OAuth to our Player database model
 */

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { Brand } from '@/lib/models';
import logger from '@/lib/logger';
import { logPlayerRegistration, logAuthEvent } from '@/lib/analytics';

/**
 * NextAuth Instance
 * 
 * Why: Initialize NextAuth with custom handlers for Player creation/update
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    
    /**
     * Sign In Callback
     * 
     * What: Called when user signs in with Facebook
     * Why: Create or update Player record in our database
     */
    async signIn({ user, account, profile }) {
      try {
        // Skip this callback for credentials provider (anonymous login)
        // Why: Credentials provider doesn't need database player creation
        if (account?.provider === 'credentials') {
          return true;
        }
        
        // Only run for Facebook provider
        if (account?.provider !== 'facebook') {
          return true;
        }
        
        // Connect to database
        await connectDB();

        // Get Facebook ID from profile
        const facebookId = profile?.id as string;
        
        if (!facebookId) {
          logger.error('No Facebook ID found in profile');
          return false;
        }

        // Get default brand (first brand in database)
        // Why: New players need to be assigned to a brand
        const defaultBrand = await Brand.findOne({ isActive: true }).sort({ createdAt: 1 });
        
        if (!defaultBrand) {
          logger.error('No active brand found for player registration');
          return false;
        }

        // Check if player already exists
        let player = await Player.findOne({ facebookId });

        if (player) {
          // Update existing player
          // Why: Sync latest profile info from Facebook
          player.displayName = profile?.name || player.displayName;
          player.email = profile?.email || player.email;
          player.profilePicture = (profile as any)?.picture?.data?.url || player.profilePicture;
          player.lastLoginAt = new Date();
          player.lastSeenAt = new Date();
          
          await player.save();
          
          logger.info({ playerId: player._id, facebookId }, 'Player logged in');
          
          // Log login event
          await logAuthEvent(
            (player._id as any).toString(),
            (player.brandId as any).toString(),
            'login'
          );
        } else {
          // Create new player
          // Why: First-time user needs a Player record
          player = await Player.create({
            facebookId,
            displayName: profile?.name || 'Player',
            email: profile?.email,
            profilePicture: (profile as any)?.picture?.data?.url,
            brandId: defaultBrand._id,
            locale: (profile as any)?.locale || 'en',
            isPremium: false,
            isActive: true,
            isBanned: false,
            lastLoginAt: new Date(),
            lastSeenAt: new Date(),
          });

          logger.info({ playerId: player._id, facebookId }, 'New player created');

          // Initialize PlayerProgression for new player
          // Why: Every player needs progression tracking with all required fields
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
          // Why: Every player needs a points wallet
          const { PointsWallet } = await import('@/lib/models');
          await PointsWallet.create({
            playerId: player._id,
            balance: 0,
            lifetimeEarned: 0,
            lifetimeSpent: 0,
          });

          // Initialize Streak for new player
          // Why: Every player needs streak tracking
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

          logger.info({ playerId: player._id }, 'Initialized player progression, wallet, and streaks');
          
          // Log player registration event
          await logPlayerRegistration(
            (player._id as any).toString(),
            (defaultBrand._id as any).toString()
          );
        }

        // Add player ID to user object for callbacks
        user.id = (player._id as any).toString();

        return true;
      } catch (error) {
        logger.error({ error }, 'Error during sign in');
        return false;
      }
    },

    /**
     * JWT Callback
     * 
     * What: Add custom fields to JWT token
     * Why: Include Player ID, SSO identifier, role, and auth provider in session
     */
    async jwt({ token, user }) {
      // CRITICAL: Check if access token is expired for admin users
      // If admin token is expired, invalidate session to force re-login
      const tokenExpiresAt = token.tokenExpiresAt as number | undefined;
      const currentRole = token.role as 'user' | 'admin' | undefined;
      const isTokenExpired = tokenExpiresAt ? Date.now() > tokenExpiresAt : false;
      
      if (isTokenExpired && currentRole === 'admin') {
        logger.error(
          {
            playerId: token.id,
            tokenExpiresAt,
            currentTime: Date.now(),
            role: currentRole,
          },
          'CRITICAL: Admin access token expired - invalidating session to force re-login'
        );
        // Invalidate token by removing critical fields
        // This will force the session callback to return null user, causing logout
        token.role = undefined;
        token.accessToken = undefined;
        token.refreshToken = undefined;
        token.tokenExpiresAt = undefined;
        return token; // Return invalidated token
      }
      
      // Always fetch player data to get current role (important for role updates)
      // Why: Role may change in database, so we need to refresh it on every request
      const playerId = user?.id || token.id;
      
      // SIMPLIFIED: For initial sign in, use role from user object (from SSO/credentials)
      // Then always refresh from database to ensure consistency
      if (user && user.id && (user as any).role) {
        token.id = user.id;
        token.role = (user as any).role as 'user' | 'admin';
        token.authProvider = (user as any).authProvider || 'sso';
        token.isAnonymous = (user as any).isAnonymous || false;
        
        // Store SSO tokens for role checks
        if ((user as any).accessToken) {
          token.accessToken = (user as any).accessToken;
          token.refreshToken = (user as any).refreshToken;
          token.tokenExpiresAt = (user as any).tokenExpiresAt;
        }
        
        logger.info({ 
          playerId: user.id, 
          role: token.role, 
          userRole: (user as any).role,
          hasAccessToken: !!(user as any).accessToken,
          source: 'user_object_initial' 
        }, 'JWT: Initial sign in - using role from user object');
      }
      
      // Always refresh from database to ensure we have the latest role
      // This is critical for SSO where role might have just been updated from UserInfo endpoint
      if (playerId) {
        try {
          await connectDB();
          const player = await Player.findById(playerId).lean();
          
          if (player) {
            token.id = playerId as string;
            token.authProvider = (player.authProvider as 'sso' | 'anonymous') || 'sso';
            token.ssoSub = player.ssoSub || null;
            token.locale = player.locale || 'en';
            token.isAnonymous = player.isAnonymous || false;
            
            // SSO-CENTRALIZED ROLE MANAGEMENT
            // Try to fetch role from SSO UserInfo endpoint (single source of truth)
            // CRITICAL: If token is expired and user is admin, we already invalidated above
            // For non-expired tokens or non-admin users, proceed normally
            const accessToken = token.accessToken as string | undefined;
            const tokenExpired = token.tokenExpiresAt ? Date.now() > (token.tokenExpiresAt as number) : false;
            
            if (accessToken && player.ssoSub && !tokenExpired) {
              try {
                const { getRoleFromSSO } = await import('@/lib/auth/role-manager');
                const ssoRole = await getRoleFromSSO(accessToken, player.ssoSub);
                const previousTokenRole = token.role;
                token.role = ssoRole; // SSO is the source of truth
                
                if (previousTokenRole && previousTokenRole !== ssoRole) {
                  logger.warn(
                    { 
                      playerId, 
                      previousTokenRole,
                      newSSORole: ssoRole,
                      source: 'sso_userinfo',
                    }, 
                    'JWT: Role changed from SSO - real-time role sync'
                  );
                }
                
                logger.info(
                  { 
                    playerId, 
                    ssoRole,
                    source: 'sso_userinfo',
                    ssoSub: player.ssoSub,
                  }, 
                  'JWT: Role fetched from SSO UserInfo endpoint (single source of truth)'
                );
              } catch (ssoError) {
                // SSO fetch failed - check if this is an admin with expired token
                const errorMessage = ssoError instanceof Error ? ssoError.message : String(ssoError);
                if (errorMessage.includes('expired') || errorMessage.includes('Expired')) {
                  const dbRole = (player.role as 'user' | 'admin') || 'user';
                  if (dbRole === 'admin') {
                    logger.error(
                      {
                        playerId,
                        error: errorMessage,
                      },
                      'CRITICAL: Admin SSO token expired - invalidating session'
                    );
                    // Invalidate token
                    token.role = undefined;
                    token.accessToken = undefined;
                    token.refreshToken = undefined;
                    token.tokenExpiresAt = undefined;
                    return token;
                  }
                }
                
                // SSO fetch failed for non-admin or non-expired - fall back to database role
                logger.warn(
                  {
                    error: errorMessage,
                    playerId,
                  },
                  'JWT: SSO role fetch failed, falling back to database role'
                );
                const dbRole = (player.role as 'user' | 'admin') || 'user';
                token.role = dbRole;
              }
            } else if (tokenExpired && (player.role === 'admin' || token.role === 'admin')) {
              // Token expired and user is admin - invalidate session
              logger.error(
                {
                  playerId,
                  playerRole: player.role,
                  tokenRole: token.role,
                  tokenExpiresAt: token.tokenExpiresAt,
                },
                'CRITICAL: Admin token expired - invalidating session to force re-login'
              );
              token.role = undefined;
              token.accessToken = undefined;
              token.refreshToken = undefined;
              token.tokenExpiresAt = undefined;
              return token;
            } else {
              // No access token or token expired for non-admin - use database role as fallback
              const dbRole = (player.role as 'user' | 'admin') || 'user';
              const previousTokenRole = token.role;
              token.role = dbRole;
              
              if (previousTokenRole && previousTokenRole !== dbRole) {
                logger.warn(
                  { 
                    playerId, 
                    previousTokenRole,
                    newDbRole: dbRole,
                  }, 
                  'JWT: Role changed during database refresh (no SSO token available)'
                );
              }
              
              logger.info(
                { 
                  playerId, 
                  dbRole,
                  source: 'database_fallback',
                  hasAccessToken: !!accessToken,
                  hasSsoSub: !!player.ssoSub,
                  tokenExpired,
                }, 
                'JWT: Using database role (SSO token not available or expired)'
              );
            }
          } else if (user && user.id && !token.role) {
            // Fallback: player not found, use role from user object
            token.id = user.id;
            token.role = (user as any).role || 'user';
            token.authProvider = (user as any).authProvider || 'sso';
            token.isAnonymous = (user as any).isAnonymous || false;
            logger.warn({ playerId: user.id }, 'JWT: Player not found in database, using user object role');
          }
        } catch (error) {
          logger.error({ error, playerId }, 'Failed to fetch player in JWT callback');
          // Fallback: use role from user object if database fetch fails
          if (user && user.id) {
            token.id = user.id;
            token.role = (user as any).role || token.role || 'user';
            token.authProvider = (user as any).authProvider || token.authProvider || 'sso';
            token.isAnonymous = (user as any).isAnonymous ?? token.isAnonymous ?? false;
            logger.warn({ playerId: user.id, role: token.role }, 'JWT: Database fetch failed, using user object role as fallback');
          }
        }
      }
      
      // For credentials provider (anonymous)
      if (user && (user as any).isAnonymous) {
        token.authProvider = 'anonymous';
        token.isAnonymous = true;
        token.role = 'user'; // Anonymous users are always 'user'
      }
      
      return token;
    },

    /**
     * Session Callback
     * 
     * What: Make custom fields available in session
     * Why: Frontend needs Player ID, SSO identifier, role, and auth provider
     */
    async session({ session, token }) {
      // CRITICAL: If token was invalidated (role removed due to expired admin token), return null user
      // This will force logout on the client side
      if (!token.role && token.id) {
        logger.warn(
          {
            playerId: token.id,
            reason: 'Token invalidated due to expired admin access token',
          },
          'Session callback: Returning null user to force logout'
        );
        // Return session with null user to force logout
        session.user = null as any;
        return session;
      }
      
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.ssoSub = token.ssoSub || null;
        session.user.locale = token.locale || 'en';
        session.user.isAnonymous = token.isAnonymous ?? false;
        session.user.role = (token.role as 'user' | 'admin') || 'user';
        session.user.authProvider = (token.authProvider as 'sso' | 'anonymous') || 'sso';
        
        // Store access token in session for role checks (not exposed to client, server-side only)
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).tokenExpiresAt = token.tokenExpiresAt;
      }
      return session;
    },
  },
});
