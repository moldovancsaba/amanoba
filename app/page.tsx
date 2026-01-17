/**
 * Root Page
 * 
 * What: Root page that lets middleware handle routing
 * Why: Next.js requires a root page.tsx, but middleware handles the redirect
 * 
 * Note: Don't redirect here - middleware will rewrite to [locale] route
 */

import { redirect } from 'next/navigation';

/**
 * Root Page Component
 * 
 * Why: This should never be reached - middleware rewrites / to /[locale] first
 * But if it is reached, redirect to signin
 */
export default function RootPage() {
  // This should be handled by middleware, but as fallback redirect to signin
  redirect('/auth/signin');
}
