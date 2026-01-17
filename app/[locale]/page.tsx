import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

/**
 * Locale Root Page
 * 
 * What: Redirects to signin page for the locale
 * Why: Main entry point for locale-based routes
 */
export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Redirect to signin - respect localePrefix: 'as-needed'
  // Default locale (hu) has no prefix, others do
  const signInPath = locale === defaultLocale 
    ? '/auth/signin' 
    : `/${locale}/auth/signin`;
  redirect(signInPath);
}
