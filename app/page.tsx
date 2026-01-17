/**
 * Root Landing Page (Legacy)
 * 
 * What: Redirects to locale-based signin page
 * Why: Maintains backward compatibility while using i18n structure
 */

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

export default function RootPage() {
  redirect(`/${defaultLocale}/auth/signin`);
}
