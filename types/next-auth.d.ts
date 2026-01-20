/**
 * NextAuth Type Definitions
 * 
 * What: Extend NextAuth types with custom fields
 * Why: Add Player ID, Facebook ID, role, and auth provider to session and JWT types
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extended Session
   * 
   * Why: Include custom Player fields in session, including role for RBAC
   */
  interface Session {
    user: {
      id: string;
      facebookId?: string | null;
      ssoSub?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      locale: string;
      isAnonymous: boolean;
      role: 'user' | 'admin';
      authProvider: 'facebook' | 'sso' | 'anonymous';
    };
  }

  /**
   * Extended User
   * 
   * Why: Include Player ID, role, and auth provider during sign in
   */
  interface User {
    id: string;
    facebookId?: string;
    ssoSub?: string;
    isAnonymous?: boolean;
    role?: 'user' | 'admin';
    authProvider?: 'facebook' | 'sso' | 'anonymous';
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT
   * 
   * Why: Include custom fields in JWT token, including role for RBAC
   */
  interface JWT {
    id: string;
    facebookId?: string | null;
    ssoSub?: string | null;
    locale: string;
    isAnonymous: boolean;
    role: 'user' | 'admin';
    authProvider: 'facebook' | 'sso' | 'anonymous';
  }
}
