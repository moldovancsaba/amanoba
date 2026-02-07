/**
 * Enrolled lesson layout: noindex so only the public /view URL is indexed (GEO).
 * See docs/GEO_IMPROVEMENT_PLAN.md and TASKLIST.md § Public lesson view pages.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function EnrolledDayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
