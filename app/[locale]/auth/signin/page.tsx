/**
 * Sign In Page
 * 
 * What: Authentication page with Facebook OAuth
 * Why: Allow users to sign in and create Player accounts
 */

import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AnonymousLoginButton } from '@/app/components/AnonymousLoginButton';
import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import Image from 'next/image';

/**
 * Sign In Page Component
 * 
 * Why: Provides branded sign-in interface for Amanoba
 */
export default async function SignInPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;
  const t = await getTranslations('auth');
  const tCommon = await getTranslations('common');
  
  // Check if user is already authenticated
  const session = await auth();
  
  if (session?.user) {
    // Redirect authenticated users to dashboard
    const callbackUrl = searchParamsResolved.callbackUrl || `/${locale}/dashboard`;
    redirect(callbackUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-4">
      <div className="w-full max-w-md">
        {/* Sign In Card */}
        <div className="bg-brand-white rounded-2xl shadow-2xl p-8 border-2 border-brand-accent">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/AMANOBA.png"
                alt="Amanoba Logo"
                width={120}
                height={120}
                className="h-24 w-auto"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-brand-black mb-2">
              {t('welcome')} {tCommon('appName')}
            </h1>
            <p className="text-brand-darkGrey">
              Play. Compete. Achieve.
            </p>
          </div>

          {/* Sign In Form */}
          <form
            action={async () => {
              'use server';
              const resolvedParams = await params;
              const resolvedSearchParams = await searchParams;
              await signIn('facebook', { 
                redirectTo: resolvedSearchParams.callbackUrl || `/${resolvedParams.locale}/dashboard` 
              });
            }}
          >
            <button
              type="submit"
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-brand-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
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
              {t('signInWithFacebook')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-darkGrey"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-brand-white text-brand-darkGrey">Or</span>
            </div>
          </div>

          {/* Anonymous Login */}
          <AnonymousLoginButton />

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-brand-darkGrey">
            <p>
              By continuing, you agree to {tCommon('appName')}&apos;s{' '}
              <LocaleLink href={`/${locale}/terms`} className="text-brand-accent hover:text-brand-primary-600 underline">
                Terms of Service
              </LocaleLink>{' '}
              and{' '}
              <LocaleLink href={`/${locale}/privacy`} className="text-brand-accent hover:text-brand-primary-600 underline">
                Privacy Policy
              </LocaleLink>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 text-brand-white text-center">
          <h2 className="text-xl font-semibold mb-4">Why Join Amanoba?</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-brand-darkGrey/80 backdrop-blur-sm rounded-lg p-4 border border-brand-accent/30">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm font-medium">{tCommon('games.title')}</p>
            </div>
            <div className="bg-brand-darkGrey/80 backdrop-blur-sm rounded-lg p-4 border border-brand-accent/30">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm font-medium">{tCommon('achievements.title')}</p>
            </div>
            <div className="bg-brand-darkGrey/80 backdrop-blur-sm rounded-lg p-4 border border-brand-accent/30">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-sm font-medium">{tCommon('leaderboard.title')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
