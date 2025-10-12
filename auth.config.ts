/**
 * NextAuth.js v5 Configuration
 * 
 * What: Authentication configuration for Amanoba platform
 * Why: Centralized auth setup with Facebook OAuth and MongoDB session storage
 */

import type { NextAuthConfig } from 'next-auth';
import Facebook from 'next-auth/providers/facebook';

/**
 * NextAuth Configuration
 * 
 * What: Edge-compatible authentication configuration
 * Why: Define authentication providers, callbacks, and pages without database imports
 */
export const authConfig = {
  // Authentication providers
  // Why: Facebook OAuth as primary authentication method
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
      // Initial sign in
      if (account && profile) {
        token.facebookId = profile.id as string;
        token.picture = (profile.picture as any)?.data?.url || profile.image;
        token.locale = (profile.locale as string) || 'en';
      }
      
      // Add user data to token
      if (user) {
        token.id = user.id;
      }
      
      return token;
    },

    // Session callback
    // Why: Make custom fields available in session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.facebookId = token.facebookId as string;
        session.user.locale = token.locale as string;
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
