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
     * Why: Include Player ID and Facebook ID in session
     */
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && profile) {
        token.facebookId = profile.id as string;
        token.picture = (profile as any)?.picture?.data?.url || profile.image;
        token.locale = (profile as any)?.locale || 'en';
      }
      
      // Add user data to token
      if (user) {
        token.id = user.id;
      }
      
      return token;
    },

    /**
     * Session Callback
     * 
     * What: Make custom fields available in session
     * Why: Frontend needs Player ID and Facebook ID
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.facebookId = token.facebookId as string;
        session.user.locale = token.locale as string;
      }
      return session;
    },
  },
});
