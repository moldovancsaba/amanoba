import { redirect } from 'next/navigation';

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
  // Redirect to signin for this locale
  redirect(`/${locale}/auth/signin`);
}
