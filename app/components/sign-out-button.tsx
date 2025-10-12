/**
 * Sign Out Button Component
 * 
 * What: Client-side button to sign out users
 * Why: Allow authenticated users to log out from any page
 */

'use client';

import { signOut } from 'next-auth/react';

/**
 * Sign Out Button
 * 
 * Why: Provides a reusable sign-out button for navigation components
 */
export default function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={className || 'px-4 py-2 text-red-600 hover:text-red-700 transition-colors font-medium'}
    >
      Sign Out
    </button>
  );
}
