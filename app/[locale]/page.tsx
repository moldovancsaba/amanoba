import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

/**
 * Locale Root Page
 * 
 * What: Redirects to signin page for the locale
 * Why: Main entry point for locale-based routes
 * 
 * Note: This handles /[locale] route (e.g., /hu or /en)
 * For default locale (hu), the URL is just / (no prefix due to localePrefix: 'as-needed')
 */
export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Always redirect to signin for this locale
  // For default locale (hu), path is /auth/signin (no prefix)
  // For other locales (en), path is /en/auth/signin
  const signInPath = locale === defaultLocale 
    ? '/auth/signin' 
    : `/${locale}/auth/signin`;
  
  redirect(signInPath);
}
