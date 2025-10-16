/**
 * Sign In Page
 * 
 * What: Authentication page with Facebook OAuth
 * Why: Allow users to sign in and create Player accounts
 */

import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AnonymousLoginButton } from '@/components/AnonymousLoginButton';

/**
 * Sign In Page Component
 * 
 * Why: Provides branded sign-in interface for Amanoba
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  
  // Check if user is already authenticated
  const session = await auth();
  
  if (session?.user) {
    // Redirect authenticated users to dashboard
    redirect(params.callbackUrl || '/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="w-full max-w-md">
        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Amanoba
            </h1>
            <p className="text-gray-600">
              Play. Compete. Achieve.
            </p>
          </div>

          {/* Sign In Form */}
          <form
            action={async () => {
              'use server';
              const params = await searchParams;
              await signIn('facebook', { 
                redirectTo: params.callbackUrl || '/dashboard' 
              });
            }}
          >
            <button
              type="submit"
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
              Continue with Facebook
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Anonymous Login */}
          <AnonymousLoginButton />

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By continuing, you agree to Amanoba&apos;s{' '}
              <a href="/terms" className="text-indigo-600 hover:text-indigo-700 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 text-white text-center">
          <h2 className="text-xl font-semibold mb-4">Why Join Amanoba?</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm font-medium">Multiple Games</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm font-medium">Achievements</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-sm font-medium">Leaderboards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
