/**
 * NextAuth.js Main Configuration
 * 
 * What: Authentication setup with Player model integration
 * Why: Connect SSO and anonymous login to our Player database model
 */

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { Brand } from '@/lib/models';
import logger from '@/lib/logger';
import { logPlayerRegistration, logAuthEvent } from '@/lib/analytics';
import { defaultLocale } from '@/i18n';
import { locales, type Locale } from '@/app/lib/i18n/locales';

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
     * What: Called when user signs in (SSO handled separately, this is for anonymous)
     * Why: Create or update Player record in our database for anonymous users
     */
    async signIn({ user, account }) {
      try {
        // Skip this callback for credentials provider (anonymous login)
        // Why: Credentials provider doesn't need database player creation (handled in API)
        if (account?.provider === 'credentials') {
          return true;
        }
        
        // SSO is handled in /api/auth/sso/callback, not here
        // This callback is only for legacy providers (none remaining)
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
        logger.info({ 
          playerId: user.id, 
          role: token.role, 
          userRole: (user as any).role,
          source: 'user_object_initial' 
        }, 'JWT: Initial sign in - using role from user object');
      }
      
      // Always refresh from database to ensure we have the latest role
      // This is critical for SSO where role might have just been updated
      if (playerId) {
        try {
          await connectDB();
          const player = await Player.findById(playerId).lean();
          
          if (player) {
            token.id = playerId as string;
            // Always use database role - it's the source of truth after SSO update
            const dbRole = (player.role as 'user' | 'admin') || 'user';
            token.role = dbRole; // Database role wins (was updated from SSO)
            token.authProvider = (player.authProvider as 'sso' | 'anonymous') || 'sso';
            token.ssoSub = player.ssoSub || null;
            token.locale = (player.locale && locales.includes(player.locale as Locale) ? (player.locale as Locale) : defaultLocale);
            token.isAnonymous = player.isAnonymous || false;
            
            logger.info(
              { 
                playerId, 
                dbRole,
                userRole: user ? (user as any).role : undefined,
                roleMatch: user ? dbRole === (user as any).role : 'no_user',
                source: 'database_refresh'
              }, 
              'JWT: Refreshed role from database (SSO is source of truth)'
            );
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
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.ssoSub = token.ssoSub ?? undefined;
        session.user.locale = (token.locale && locales.includes(token.locale as Locale) ? token.locale : defaultLocale) as string;
        session.user.isAnonymous = token.isAnonymous ?? false;
        session.user.role = (token.role as 'user' | 'admin') || 'user';
        session.user.authProvider = (token.authProvider as 'sso' | 'anonymous') || 'sso';
      }
      return session;
    },
  },
});
