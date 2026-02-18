/**
 * Sign In Page
 * 
 * What: Authentication page with SSO and anonymous login
 * Why: Allow users to sign in via SSO or continue anonymously
 */

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AnonymousLoginButton } from '@/app/components/AnonymousLoginButton';
import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/LocaleLink';
import Image from 'next/image';
import Icon, { MdMenuBook, MdEmail, MdGpsFixed } from '@/components/Icon';

/**
 * Sign In Page Component
 * 
 * Why: Provides branded sign-in interface for Amanoba
 */
const SIGNIN_ERROR_KEYS: Record<string, string> = {
  database_error: 'errorDatabase',
  brand_not_found: 'errorBrandNotFound',
  callback_error: 'errorCallback',
  token_validation_failed: 'errorTokenValidation',
  session_creation_failed: 'errorSessionCreation',
};

export default async function SignInPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;
  const t = await getTranslations({ locale, namespace: 'auth' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const callbackUrl = searchParamsResolved.callbackUrl || `/${locale}`;
  
  // Check if user is already authenticated
  const session = await auth();
  
  if (session?.user) {
    // Redirect authenticated users back to the requested page
    redirect(callbackUrl);
  }

  const errorCode = searchParamsResolved.error;
  const errorMessageKey = errorCode ? SIGNIN_ERROR_KEYS[errorCode] : null;
  const errorMessage = errorMessageKey ? t(errorMessageKey) : errorCode ? t('errorSignInFailed') : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-6 sm:p-10">
      <div className="w-full max-w-lg">
        {/* Sign-in error banner (e.g. ?error=database_error) */}
        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-500/90 text-white px-4 py-3 text-center text-sm shadow-lg" role="alert">
            {errorMessage}
          </div>
        )}
        {/* Sign In Card */}
        <div className="bg-brand-white rounded-3xl shadow-2xl p-10 border-2 border-brand-accent">
          {/* Logo and Branding */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <Image
                src="/AMANOBA_2026_512.png"
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
                href={`/api/auth/sso/login?provider=google&returnTo=${encodeURIComponent(callbackUrl)}`}
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

              {/* Divider - only show if anonymous login is available */}
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
