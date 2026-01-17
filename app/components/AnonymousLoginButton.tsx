'use client';

/**
 * Anonymous Login Button
 * 
 * Allows users to quickly start playing without registration.
 * Generates random 3-word username and creates guest account.
 * 
 * Why client component:
 * - Uses localStorage for session persistence
 * - Needs onClick handler for async API call
 * - Client-side navigation after login
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export function AnonymousLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnonymousLogin = async () => {
    setLoading(true);
    try {
      // Call API to create anonymous player
      const response = await fetch('/api/auth/anonymous', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (data.success && data.credentials) {
        // Store anonymous player info in localStorage for quick access
        localStorage.setItem('amanoba_anonymous_player', JSON.stringify(data.player));
        
        // Use NextAuth signIn with credentials provider
        const result = await signIn('credentials', {
          playerId: data.credentials.playerId,
          displayName: data.credentials.displayName,
          isAnonymous: data.credentials.isAnonymous,
          redirect: false,
        });
        
        if (result?.ok) {
          // Successful login - redirect to dashboard
          // Get locale from pathname or default to 'hu'
          const pathname = window.location.pathname;
          const locale = pathname.split('/')[1] || 'hu';
          router.push(`/${locale}/dashboard`);
          router.refresh();
        } else {
          throw new Error('Failed to create session');
        }
      } else {
        throw new Error(data.error || 'Failed to create anonymous player');
      }
    } catch (error) {
      console.error('Anonymous login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to create anonymous session: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAnonymousLogin}
        disabled={loading}
        className="w-full bg-brand-darkGrey hover:bg-brand-secondary-700 text-brand-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating account...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Continue Without Registration
          </>
        )}
      </button>
      <p className="mt-2 text-center text-xs text-brand-darkGrey">
        Try games instantly with a random username
      </p>
    </>
  );
}
