/**
 * Locale-Aware Link Component
 * 
 * What: Next.js Link component that preserves locale in the URL
 * Why: Ensures all internal links maintain the current language context
 */

'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

/**
 * LocaleLink Component
 * 
 * Why: Automatically prepends locale to href if not already present
 */
export function LocaleLink({
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const locale = useLocale();
  const pathname = usePathname();
  
  // If href already starts with /{locale}/, use as is
  // Otherwise, prepend locale
  let localizedHref = href;
  
  if (typeof href === 'string') {
    if (href.startsWith('/') && !href.startsWith(`/${locale}/`) && !href.startsWith('/api/')) {
      // Prepend locale for internal links
      localizedHref = `/${locale}${href}` as any;
    }
  } else if (typeof href === 'object' && href.pathname) {
    // Handle Next.js Link href object
    if (!href.pathname.startsWith(`/${locale}/`) && !href.pathname.startsWith('/api/')) {
      localizedHref = {
        ...href,
        pathname: `/${locale}${href.pathname}`,
      } as any;
    }
  }
  
  return <Link href={localizedHref} {...props} />;
}
