/**
 * Course Detail Page Layout
 * 
 * What: Generates dynamic metadata for course detail pages
 * Why: Provides proper Open Graph and Twitter Card tags for social sharing
 */

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import connectDB from '@/app/lib/mongodb';
import { Course } from '@/app/lib/models';
import { Brand } from '@/app/lib/models';
import { APP_URL } from '@/app/lib/constants/app-url';

const courseLocales = ['hu', 'en', 'ar', 'hi', 'id', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru'] as const;

const baseUrl = APP_URL;

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
        thumbnailUrl = (brand.metadata as Record<string, unknown>)?.defaultCourseThumbnail;
      }
    }

    // Ensure absolute URL for image (required for Open Graph)
    // IMGBB URLs are already absolute, but we need to handle all cases
    let absoluteImageUrl: string;
    if (thumbnailUrl) {
      // If already absolute URL (starts with http:// or https://)
      if (thumbnailUrl.startsWith('http://') || thumbnailUrl.startsWith('https://')) {
        absoluteImageUrl = thumbnailUrl;
      } else {
        // Relative URL - make it absolute
        absoluteImageUrl = `${baseUrl}${thumbnailUrl.startsWith('/') ? '' : '/'}${thumbnailUrl}`;
      }
    } else {
      // Fallback to default Amanoba logo
      absoluteImageUrl = `${baseUrl}/AMANOBA.png`;
    }

    // Build course URL (force course language in URL)
    const courseLocale = course.language || locale;
    const courseUrl = `${baseUrl}/${courseLocale}/courses/${courseId}`;

    // Prepare title and description
    const title = course.name || 'Course';
    
    // Sanitize description: remove HTML tags and limit length for social previews
    let description = course.description || '';
    // Remove HTML tags (basic sanitization)
    description = description.replace(/<[^>]*>/g, '').trim();
    // Limit to 200 chars for social previews (optimal: 150-200 chars)
    if (description.length > 200) {
      description = description.substring(0, 197) + '...';
    }
    // Fallback if no description
    if (!description) {
      description = `30-day structured learning course. ${course.durationDays} days of lessons, quizzes, and assessments.`;
    }

    // Determine locale for Open Graph
    const ogLocale = courseLocale === 'hu' ? 'hu_HU' : courseLocale === 'ar' ? 'ar_AR' : 'en_US';

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
            // Determine image type from URL extension (default to png)
            type: absoluteImageUrl.match(/\.(jpg|jpeg)$/i) ? 'image/jpeg' 
              : absoluteImageUrl.match(/\.webp$/i) ? 'image/webp'
              : absoluteImageUrl.match(/\.gif$/i) ? 'image/gif'
              : 'image/png',
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
          [courseLocale]: courseUrl,
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
export default async function CourseDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string; locale: string }>;
}) {
  const { courseId, locale } = await params;
  await connectDB();

  const course = await Course.findOne({ courseId })
    .select('courseId language isActive')
    .lean();

  if (!course || !course.isActive) {
    notFound();
  }

  // OPTION 2: Allow any URL locale, but UI will use course language
  // URL locale controls general site navigation (header, menus)
  // Course language controls ALL course-related UI (buttons, labels, content)
  // This is secure because courseLanguage is fetched from API, not URL
  // Result: /hu/courses/PRODUCTIVITY_2026_AR works and shows 100% Arabic UI

  return <>{children}</>;
}
