/**
 * Organization + WebSite JSON-LD for GEO/SEO.
 * Rendered in locale layout so every page has brand context for crawlers and AI.
 */

import { APP_URL } from '@/app/lib/constants/app-url';

const base = APP_URL.replace(/\/$/, '');
const logoUrl = `${base}/AMANOBA.png`;

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Amanoba',
  url: base,
  logo: logoUrl,
  description: '30-day learning platform with gamified education, email-based lesson delivery, and interactive assessments.',
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Amanoba',
  url: base,
  publisher: { '@id': `${base}/#organization` },
  description: 'Unified learning platform with structured courses, achievements, and certificates.',
};

export default function OrganizationWebSiteJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ ...organization, '@id': `${base}/#organization` }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
