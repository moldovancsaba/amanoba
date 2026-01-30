/**
 * Locale-Aware Link Component
 * 
 * What: Next.js Link component that preserves locale in the URL
 * Why: Ensures all internal links maintain the current language context
 */

'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { ComponentProps } from 'react';
import { locales } from '@/app/lib/i18n/locales';

type LinkHref = ComponentProps<typeof Link>['href'];

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
  
  // If href already starts with /{locale}/, use as is
  // Otherwise, prepend locale
  let localizedHref: LinkHref = href;
  
  if (typeof href === 'string') {
    if (href.startsWith('//')) {
      localizedHref = href as LinkHref;
    } else if (href.startsWith('/') && locales.some((loc) => href.startsWith(`/${loc}/`) || href === `/${loc}`)) {
      localizedHref = href as LinkHref;
    } else 
    if (href.startsWith('/') && !href.startsWith(`/${locale}/`) && !href.startsWith('/api/')) {
      // Prepend locale for internal links
      localizedHref = `/${locale}${href}` as LinkHref;
    }
  } else if (typeof href === 'object' && href.pathname) {
    // Handle Next.js Link href object
    const pathname = href.pathname ?? '';
    if (
      pathname.startsWith('/api/') ||
      locales.some((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`)
    ) {
      localizedHref = href as LinkHref;
    } else if (!pathname.startsWith(`/${locale}/`) && !pathname.startsWith('/api/')) {
      localizedHref = {
        ...href,
        pathname: `/${locale}${pathname}`,
      } as LinkHref;
    }
  }
  
  return <Link href={localizedHref} {...props} />;
}
