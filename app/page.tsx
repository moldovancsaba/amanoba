/**
 * Root Page
 * 
 * What: Root page that redirects to default locale
 * Why: Next.js requires a root page.tsx, but we use locale-based routing
 * 
 * Note: This should redirect immediately to let middleware handle locale routing
 */

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

/**
 * Root Page Component
 * 
 * Why: Redirects to default locale signin page
 */
export default function RootPage() {
  // Redirect to default locale signin (no prefix for default locale)
  redirect('/auth/signin');
}
