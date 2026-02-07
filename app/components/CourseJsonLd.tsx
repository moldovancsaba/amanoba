/**
 * Course schema.org JSON-LD for GEO/SEO.
 * Rendered on course detail layout so crawlers and AI get structured course data.
 */

export interface CourseJsonLdProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  durationDays: number;
  inLanguage: string;
}

export default function CourseJsonLd({
  name,
  description,
  url,
  image,
  durationDays,
  inLanguage,
}: CourseJsonLdProps) {
  // schema.org timeRequired: ISO 8601 duration, e.g. P30D for 30 days
  const timeRequired = `P${durationDays}D`;

  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description: description.replace(/<[^>]*>/g, '').trim().slice(0, 500),
    url,
    ...(image && { image }),
    timeRequired,
    inLanguage,
    provider: {
      '@type': 'Organization',
      name: 'Amanoba',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(course) }}
    />
  );
}
