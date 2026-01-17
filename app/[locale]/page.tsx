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
  // With localePrefix: 'always', all routes have locale prefix
  // /hu → /hu/auth/signin, /en → /en/auth/signin
  redirect(`/${locale}/auth/signin`);
}
