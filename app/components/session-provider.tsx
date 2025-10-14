/**
 * Session Provider Component
 * 
 * What: Client-side session provider wrapper
 * Why: Makes session available to client components via useSession hook
 */

'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

/**
 * Session Provider Wrapper
 * 
 * Why: Wraps application with NextAuth session context
 */
export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
