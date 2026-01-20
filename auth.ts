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
          
          // Ensure authProvider is set (for existing players)
          if (!player.authProvider) {
            player.authProvider = 'facebook';
          }
          
          // Ensure role is set (for existing players, default to 'user')
          if (!player.role) {
            player.role = 'user';
          }
          
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
            authProvider: 'facebook',
            role: 'user', // Default role for new users
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
     * Why: Include Player ID, Facebook ID, role, and auth provider in session
     */
    async jwt({ token, user, account, profile }) {
      // Always fetch player data to get current role (important for role updates)
      // Why: Role may change in database, so we need to refresh it on every request
      const playerId = user?.id || token.id;
      
      // On initial sign in, use role from user object if available (from credentials provider)
      // This is important for SSO where role is passed explicitly
      if (user && user.id && (user as any).role) {
        token.id = user.id;
        token.role = (user as any).role as 'user' | 'admin';
        token.authProvider = (user as any).authProvider || 'facebook';
        token.isAnonymous = (user as any).isAnonymous || false;
        logger.info({ playerId: user.id, role: token.role, source: 'user_object' }, 'JWT: Using role from user object (initial sign in)');
      }
      
      if (playerId) {
        try {
          await connectDB();
          const player = await Player.findById(playerId).lean();
          
          if (player) {
            token.id = playerId as string;
            // Always refresh role from database to ensure it's up-to-date
            // This ensures role changes in DB are reflected in session
            const dbRole = (player.role as 'user' | 'admin') || 'user';
            token.role = dbRole;
            token.authProvider = (player.authProvider as 'facebook' | 'sso' | 'anonymous') || 'facebook';
            token.facebookId = player.facebookId || null;
            token.ssoSub = player.ssoSub || null;
            token.locale = player.locale || 'en';
            token.isAnonymous = player.isAnonymous || false;
            
            // Log role source for debugging
            if (user && (user as any).role && dbRole !== (user as any).role) {
              logger.warn(
                { 
                  playerId, 
                  userRole: (user as any).role, 
                  dbRole,
                  source: 'database_override'
                }, 
                'JWT: Role from database differs from user object - using database role'
              );
            }
          } else if (user && user.id && !token.role) {
            // Initial sign in - player not found yet (shouldn't happen, but handle gracefully)
            token.id = user.id;
            token.role = (user as any).role || 'user';
            token.authProvider = (user as any).authProvider || 'facebook';
            token.isAnonymous = (user as any).isAnonymous || false;
            logger.warn({ playerId: user.id }, 'JWT: Player not found in database, using user object role');
          }
        } catch (error) {
          logger.error({ error, playerId }, 'Failed to fetch player in JWT callback');
          // Fallback values - keep existing token values if fetch fails
          if (user && user.id) {
            token.id = user.id;
            token.role = (user as any).role || token.role || 'user';
            token.authProvider = (user as any).authProvider || token.authProvider || 'facebook';
            token.isAnonymous = (user as any).isAnonymous ?? token.isAnonymous ?? false;
          }
        }
      }
      
      // Update from account/profile for Facebook OAuth
      if (account && profile && account.provider === 'facebook') {
        token.facebookId = profile.id as string;
        token.picture = (profile as any)?.picture?.data?.url || profile.image;
        token.locale = (profile as any)?.locale || token.locale || 'en';
        token.authProvider = 'facebook';
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
     * Why: Frontend needs Player ID, Facebook ID, role, and auth provider
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.facebookId = token.facebookId || null;
        session.user.ssoSub = token.ssoSub || null;
        session.user.locale = token.locale || 'en';
        session.user.isAnonymous = token.isAnonymous ?? false;
        session.user.role = (token.role as 'user' | 'admin') || 'user';
        session.user.authProvider = (token.authProvider as 'facebook' | 'sso' | 'anonymous') || 'facebook';
      }
      return session;
    },
  },
});
