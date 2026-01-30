/**
 * Certificate Verification Page Layout (Slug-based)
 *
 * What: Dynamic metadata for /certificate/[slug] for Open Graph and social sharing
 * Why: Shareable links get correct og:image (certificate image) and title/description
 *
 * Route: /[locale]/certificate/[slug]
 */

import type { Metadata } from 'next';
import connectDB from '@/app/lib/mongodb';
import { Certificate } from '@/app/lib/models';
import { APP_URL } from '@/app/lib/constants/app-url';

const baseUrl = APP_URL;

/**
 * Generate metadata for certificate verification page
 *
 * - og:image points to GET /api/certificates/[slug]/image (shareable certificate image)
 * - For public certificates: title/description include recipient and course
 * - For private/not-found: generic verification title to avoid leaking data
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}): Promise<Metadata> {
  try {
    const { slug, locale } = await params;
    if (!slug) {
      return {
        title: 'Certificate | Amanoba',
        description: 'Verify a certificate on Amanoba.',
      };
    }

    await connectDB();
    const certificate = await Certificate.findOne({ verificationSlug: slug })
      .select('recipientName courseTitle isPublic isRevoked')
      .lean();

    if (!certificate) {
      return {
        title: 'Certificate | Amanoba',
        description: 'Verify a certificate on Amanoba.',
        openGraph: {
          type: 'website',
          url: `${baseUrl}/${locale || 'en'}/certificate/${slug}`,
          siteName: 'Amanoba',
          title: 'Certificate | Amanoba',
          description: 'Verify a certificate on Amanoba.',
          images: [{ url: `${baseUrl}/api/certificates/${slug}/image`, width: 1200, height: 627, alt: 'Certificate' }],
        },
        twitter: { card: 'summary_large_image', title: 'Certificate | Amanoba', description: 'Verify a certificate on Amanoba.' },
      };
    }

    const pageUrl = `${baseUrl}/${locale || 'en'}/certificate/${slug}`;
    const imageUrl = `${baseUrl}/api/certificates/${slug}/image`;

    const title =
      certificate.isRevoked
        ? 'Certificate Revoked | Amanoba'
        : certificate.isPublic
          ? `${certificate.recipientName} – ${certificate.courseTitle} | Certificate | Amanoba`
          : 'Certificate Verification | Amanoba';

    const description =
      certificate.isRevoked
        ? 'This certificate has been revoked and is no longer valid.'
        : certificate.isPublic
          ? `Certificate of completion for ${certificate.courseTitle} issued to ${certificate.recipientName}.`
          : 'Verify the authenticity of this certificate on Amanoba.';

    return {
      title,
      description,
      openGraph: {
        type: 'website',
        url: pageUrl,
        siteName: 'Amanoba',
        title,
        description,
        images: [
          { url: imageUrl, width: 1200, height: 627, alt: certificate.isRevoked ? 'Certificate revoked' : 'Certificate' },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: { canonical: pageUrl },
    };
  } catch (error) {
    console.error('Failed to generate certificate metadata:', error);
    return {
      title: 'Certificate | Amanoba',
      description: 'Verify a certificate on Amanoba.',
    };
  }
}

/**
 * Layout only provides metadata; page content is in page.tsx
 */
export default function CertificateSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
