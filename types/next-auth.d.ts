/**
 * NextAuth Type Definitions
 * 
 * What: Extend NextAuth types with custom fields
 * Why: Add Player ID and Facebook ID to session and JWT types
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extended Session
   * 
   * Why: Include custom Player fields in session
   */
  interface Session {
    user: {
      id: string;
      facebookId: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      locale: string;
    };
  }

  /**
   * Extended User
   * 
   * Why: Include Player ID during sign in
   */
  interface User {
    id: string;
    facebookId?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT
   * 
   * Why: Include custom fields in JWT token
   */
  interface JWT {
    id: string;
    facebookId: string;
    locale: string;
  }
}
