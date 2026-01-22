/**
 * NextAuth.js v5 Configuration
 * 
 * What: Authentication configuration for Amanoba platform
 * Why: Centralized auth setup with Facebook OAuth and MongoDB session storage
 */

import type { NextAuthConfig, Session } from 'next-auth';
import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';

/**
 * NextAuth Configuration
 * 
 * What: Edge-compatible authentication configuration
 * Why: Define authentication providers, callbacks, and pages without database imports
 */
export const authConfig = {
  // Authentication providers
  // Why: Facebook OAuth + Credentials for anonymous guest login
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      // Request additional user information from Facebook
      // Why: We need profile picture and email for player profiles
      authorization: {
        params: {
          scope: 'email public_profile',
        },
      },
    }),
    
    // Credentials provider for anonymous guest login
    // Why: Allow frictionless onboarding without OAuth
    Credentials({
      id: 'credentials',
      name: 'Anonymous',
      credentials: {
        playerId: { label: 'Player ID', type: 'text' },
        displayName: { label: 'Display Name', type: 'text' },
        isAnonymous: { label: 'Is Anonymous', type: 'text' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.playerId || !credentials?.displayName) {
          return null;
        }
        
        const role = (credentials.role as 'user' | 'admin') || 'user';
        const isAnonymous = credentials.isAnonymous === 'true';
        
        // Return user object for anonymous player or SSO user
        // Why: NextAuth uses this to create session
        return {
          id: credentials.playerId as string,
          name: credentials.displayName as string,
          email: null,
          image: null,
          isAnonymous,
          role,
          authProvider: isAnonymous ? 'anonymous' : 'sso',
        };
      },
    }),
  ],

  // Custom pages
  // Why: Branded authentication pages matching Amanoba design
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  // Callbacks for customizing authentication behavior
  callbacks: {
    // Authorized callback for middleware
    // Why: Protect routes that require authentication
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // Why: API routes should always be accessible (they handle their own auth if needed)
      if (nextUrl.pathname.startsWith('/api')) {
        return true;
      }
      
      const isOnProtectedRoute = 
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/games') ||
        nextUrl.pathname.startsWith('/profile');

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname.startsWith('/auth/signin')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },

    // JWT callback
    // Why: Add custom fields to JWT token
    async jwt({ token, user, account, profile }) {
      // Initial sign in with Facebook
      if (account && profile && account.provider === 'facebook') {
        token.facebookId = profile.id as string;
        token.picture = (profile.picture as any)?.data?.url || profile.image;
        token.locale = (profile.locale as string) || 'en';
        token.isAnonymous = false;
      }
      
      // Initial sign in with Credentials (anonymous)
      if (user && (user as any).isAnonymous) {
        token.isAnonymous = true;
        token.facebookId = null;
      }
      
      // Add user data to token
      if (user) {
        token.id = user.id;
      }
      
      return token;
    },

    // Session callback
    // Why: Make custom fields available in session
    // NOTE: This is overridden in auth.ts with the full implementation including role
    // Keeping this for reference but auth.ts session callback takes precedence
    async session({ session, token }): Promise<Session> {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).ssoSub = token.ssoSub || null;
        (session.user as any).locale = token.locale || 'en';
        (session.user as any).isAnonymous = token.isAnonymous ?? false;
        (session.user as any).role = (token.role as 'user' | 'admin') || 'user';
        (session.user as any).authProvider = (token.authProvider as 'sso' | 'anonymous') || 'sso';
      }
      return session;
    },
  },

  // Session strategy
  // Why: Use JWT for serverless compatibility
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Debug mode in development
  // Why: Easier troubleshooting during development
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;
