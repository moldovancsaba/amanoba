/**
 * robots.txt for GEO/SEO.
 * Allows crawlers on public content; disallows admin/auth/API; points to sitemap.
 * See docs/GEO_IMPROVEMENT_PLAN.md and docs/SEO_IMPROVEMENT_PLAN.md.
 */

import type { MetadataRoute } from 'next';
import { APP_URL } from '@/app/lib/constants/app-url';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const base = APP_URL.replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/auth/',
          '/editor',
          '/editor/',
          '/dashboard',
          '/dashboard/',
          '/my-courses',
          '/my-courses/',
          '/_next/',
          '/auth/',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
