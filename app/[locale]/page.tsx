import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

/**
 * Root Landing Page
 * 
 * What: Redirects to signin page as main entry point
 * Why: Users go directly to signin, partners page moved to /partners
 */
export default async function RootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/auth/signin`);
}
