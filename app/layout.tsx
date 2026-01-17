/**
 * Root Layout
 * 
 * What: Root layout that delegates to locale-based layout
 * Why: Next.js requires a root layout, but we use locale-based layouts
 * 
 * Note: This layout should not redirect - let middleware handle routing
 */

import { ReactNode } from 'react';

/**
 * Root Layout
 * 
 * Why: Pass-through layout - actual layout is in app/[locale]/layout.tsx
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Don't redirect here - middleware handles routing
  // This is just a pass-through for Next.js requirements
  return <>{children}</>;
}
