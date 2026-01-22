/**
 * NextAuth.js Edge Runtime Configuration
 * 
 * What: Edge-compatible authentication configuration (no MongoDB dependencies)
 * Why: Middleware runs in Edge Runtime and cannot import Mongoose/MongoDB
 * 
 * This is a separate file from auth.config.ts to ensure Edge Runtime compatibility.
 * auth.config.ts may have indirect dependencies that cause Edge Runtime issues.
 */

import type { NextAuthConfig, Session } from 'next-auth';
import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';

/**
 * Edge-Compatible NextAuth Configuration
 * 
 * What: Authentication configuration without any database dependencies
 * Why: Used by authEdge for middleware (Edge Runtime)
 */
export const authConfigEdge: NextAuthConfig = {
  // Authentication providers
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      authorization: {
        params: {
          scope: 'email public_profile',
        },
      },
    }),
    
    // Credentials provider for SSO and anonymous login
    Credentials({
      id: 'credentials',
      name: 'Anonymous',
      credentials: {
        playerId: { label: 'Player ID', type: 'text' },
        displayName: { label: 'Display Name', type: 'text' },
        isAnonymous: { label: 'Is Anonymous', type: 'text' },
        role: { label: 'Role', type: 'text' },
        ssoSub: { label: 'SSO Sub', type: 'text' },
        accessToken: { label: 'Access Token', type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
        tokenExpiresAt: { label: 'Token Expires At', type: 'text' },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.playerId || !credentials?.displayName) {
          return null;
        }
        
        const role = (credentials.role as 'user' | 'admin') || 'user';
        const isAnonymous = credentials.isAnonymous === 'true';
        
        // Return user object - NO database lookups (Edge Runtime incompatible)
        return {
          id: credentials.playerId as string,
          name: credentials.displayName as string,
          email: null,
          image: null,
          isAnonymous,
          role,
          authProvider: isAnonymous ? 'anonymous' : 'sso',
          ssoSub: credentials.ssoSub as string | undefined,
          accessToken: credentials.accessToken as string | undefined,
          refreshToken: credentials.refreshToken as string | undefined,
          tokenExpiresAt: credentials.tokenExpiresAt ? parseInt(credentials.tokenExpiresAt as string) : undefined,
        };
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  // Callbacks for customizing authentication behavior
  callbacks: {
    // Authorized callback for middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // API routes should always be accessible (they handle their own auth if needed)
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

    // JWT callback - preserve role from user object
    async jwt({ token, user, account, profile }) {
      // Store access token and refresh token from user object (SSO callback)
      if (user && (user as any).accessToken) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.tokenExpiresAt = (user as any).tokenExpiresAt;
      }
      
      // CRITICAL: Preserve role from user object (from SSO callback)
      // This is needed for middleware (authEdge) to check admin access
      if (user && (user as any).role) {
        token.role = (user as any).role as 'user' | 'admin';
        token.authProvider = (user as any).authProvider || 'sso';
        token.ssoSub = (user as any).ssoSub || null;
        token.isAnonymous = (user as any).isAnonymous || false;
      }
      
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

    // Session callback - expose role and access token
    async session({ session, token }): Promise<Session> {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).ssoSub = token.ssoSub || null;
        (session.user as any).locale = token.locale || 'en';
        (session.user as any).isAnonymous = token.isAnonymous ?? false;
        (session.user as any).role = (token.role as 'user' | 'admin') || 'user';
        (session.user as any).authProvider = (token.authProvider as 'sso' | 'anonymous') || 'sso';
        
        // Store access token in session for role checks (not exposed to client, server-side only)
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).tokenExpiresAt = token.tokenExpiresAt;
      }
      return session;
    },
  },

  // Session strategy
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
};
