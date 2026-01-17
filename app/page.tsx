/**
 * Root Page
 * 
 * What: Root page that redirects to signin
 * Why: Next.js requires a root page.tsx for the root route
 * 
 * Note: This handles the root route before locale routing
 */

import { redirect } from 'next/navigation';

/**
 * Root Page Component
 * 
 * Why: Redirects root route to signin (default locale, no prefix)
 */
export default function RootPage() {
  // Redirect to signin - middleware will handle locale routing
  redirect('/auth/signin');
}
