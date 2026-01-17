/**
 * Root Layout (Legacy)
 * 
 * What: Legacy root layout for backward compatibility
 * Why: Redirects to locale-based layout structure
 * 
 * Note: This file is kept for backward compatibility. New pages should use app/[locale]/layout.tsx
 */

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

/**
 * Root Layout
 * 
 * Why: Redirects to default locale structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Redirect to default locale
  redirect(`/${defaultLocale}`);
}
