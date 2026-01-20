/**
 * Course Detail Page Layout
 * 
 * What: Generates dynamic metadata for course detail pages
 * Why: Provides proper Open Graph and Twitter Card tags for social sharing
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectDB from '@/app/lib/mongodb';
import { Course } from '@/app/lib/models';
import { Brand } from '@/app/lib/models';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

/**
 * Generate metadata for course detail page
 * 
 * Industry standards for social sharing:
 * - Open Graph tags (og:title, og:description, og:image, og:url, og:type)
 * - Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
 * - Minimum image size: 1200x630px (recommended: 1200x630px)
 * - Image must be absolute URL (full URL with https://)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string; locale: string }>;
}): Promise<Metadata> {
  try {
    const { courseId, locale } = await params;
    await connectDB();

    // Fetch course data
    const course = await Course.findOne({ courseId })
      .select('courseId name description language thumbnail isActive requiresPremium durationDays')
      .lean();

    if (!course || !course.isActive) {
      return {
        title: 'Course Not Found',
        description: 'The requested course could not be found.',
      };
    }

    // Get default thumbnail if course doesn't have one
    let thumbnailUrl = course.thumbnail;
    if (!thumbnailUrl) {
      const brand = await Brand.findOne({ slug: 'amanoba' }).lean();
      if (brand?.metadata) {
        thumbnailUrl = (brand.metadata as any)?.defaultCourseThumbnail;
      }
    }

    // Fallback to default Amanoba logo if no thumbnail
    const imageUrl = thumbnailUrl 
      ? (thumbnailUrl.startsWith('http') ? thumbnailUrl : thumbnailUrl)
      : `${baseUrl}/AMANOBA.png`;

    // Ensure absolute URL
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;

    // Build course URL
    const courseUrl = `${baseUrl}/${locale}/courses/${courseId}`;

    // Prepare title and description
    const title = course.name || 'Course';
    const description = course.description 
      ? course.description.substring(0, 200) // Limit to 200 chars for social previews
      : `30-day structured learning course. ${course.durationDays} days of lessons, quizzes, and assessments.`;

    // Determine locale for Open Graph
    const ogLocale = locale === 'hu' ? 'hu_HU' : 'en_US';

    return {
      title: `${title} | Amanoba`,
      description,
      keywords: ['course', 'learning', 'education', '30-day course', course.name],
      authors: [{ name: 'Amanoba' }],
      openGraph: {
        type: 'website',
        locale: ogLocale,
        url: courseUrl,
        siteName: 'Amanoba',
        title,
        description,
        images: [
          {
            url: absoluteImageUrl,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [absoluteImageUrl],
        creator: '@amanoba',
        site: '@amanoba',
      },
      alternates: {
        canonical: courseUrl,
        languages: {
          'hu': `${baseUrl}/hu/courses/${courseId}`,
          'en': `${baseUrl}/en/courses/${courseId}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Failed to generate course metadata:', error);
    // Return default metadata on error
    return {
      title: 'Course | Amanoba',
      description: '30-day structured learning course on Amanoba platform.',
    };
  }
}

/**
 * Layout component (just passes through children)
 * Metadata is handled by generateMetadata function above
 */
export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
