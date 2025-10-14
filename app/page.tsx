import { redirect } from 'next/navigation';

/**
 * Root Landing Page
 * 
 * What: Redirects to signin page as main entry point
 * Why: Users go directly to signin, partners page moved to /partners
 */
export default function RootPage() {
  redirect('/auth/signin');
}
