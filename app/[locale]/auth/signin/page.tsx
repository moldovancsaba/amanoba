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
import Icon, { MdMenuBook, MdEmail, MdGpsFixed } from '@/components/Icon';

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
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-6 sm:p-10">
      <div className="w-full max-w-lg">
        {/* Sign In Card */}
        <div className="bg-brand-white rounded-3xl shadow-2xl p-10 border-2 border-brand-accent">
          {/* Logo and Branding */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <Image
                src="/amanoba_logo.png"
                alt="Amanoba Logo"
                width={120}
                height={120}
                className="h-24 w-auto"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-brand-black mb-3 leading-tight">
              {t('welcome')} {tCommon('appName')}
            </h1>
            <p className="text-brand-darkGrey text-lg leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {/* SSO Login (if configured) */}
          {process.env.SSO_CLIENT_ID && (
            <>
              <a
                href={`/api/auth/sso/login?returnTo=${encodeURIComponent(searchParamsResolved.callbackUrl || `/${locale}/dashboard`)}`}
                className="w-full bg-brand-accent hover:bg-brand-primary-600 text-brand-white font-semibold text-lg py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl block text-center"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                {t('signInWithSSO')}
              </a>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-darkGrey"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-brand-white text-brand-darkGrey">{t('or')}</span>
                </div>
              </div>
            </>
          )}

          {/* Facebook Login */}
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
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-brand-white font-semibold text-lg py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
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
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-darkGrey"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-brand-white text-brand-darkGrey">{t('or')}</span>
            </div>
          </div>

          {/* Anonymous Login */}
          <div className="text-lg">
            <AnonymousLoginButton />
          </div>

          {/* Additional Info */}
          <div className="mt-10 text-center text-base text-brand-darkGrey leading-relaxed">
            <p>
              {tCommon('byContinuing', { appName: tCommon('appName') })}{' '}
              <LocaleLink href={`/${locale}/terms`} className="text-brand-accent hover:text-brand-primary-600 underline">
                {tCommon('termsOfService')}
              </LocaleLink>{' '}
              {tCommon('and')}{' '}
              <LocaleLink href={`/${locale}/privacy`} className="text-brand-accent hover:text-brand-primary-600 underline">
                {tCommon('privacyPolicy')}
              </LocaleLink>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-10 text-brand-white text-center">
          <h2 className="text-2xl font-semibold mb-5">{t('whyJoin')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-darkGrey/80 backdrop-blur-sm rounded-xl p-5 border border-brand-accent/30">
              <Icon icon={MdMenuBook} size={32} className="text-brand-accent mb-2 mx-auto" />
              <p className="text-base font-medium">{tCommon('courses.title')}</p>
            </div>
            <div className="bg-brand-darkGrey/80 backdrop-blur-sm rounded-xl p-5 border border-brand-accent/30">
              <Icon icon={MdEmail} size={32} className="text-brand-accent mb-2 mx-auto" />
              <p className="text-base font-medium">{t('dailyLessons')}</p>
            </div>
            <div className="bg-brand-darkGrey/80 backdrop-blur-sm rounded-xl p-5 border border-brand-accent/30">
              <Icon icon={MdGpsFixed} size={32} className="text-brand-accent mb-2 mx-auto" />
              <p className="text-base font-medium">{t('interactiveAssessments')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
