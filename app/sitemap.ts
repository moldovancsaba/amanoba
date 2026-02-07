/**
 * Dynamic sitemap for GEO/SEO.
 * Lists: static locale roots, course pages, and public lesson view URLs for active courses.
 * See docs/GEO_IMPROVEMENT_PLAN.md and docs/SEO_IMPROVEMENT_PLAN.md.
 */

import type { MetadataRoute } from 'next';
import connectDB from '@/app/lib/mongodb';
import { Course } from '@/app/lib/models';
import { APP_URL } from '@/app/lib/constants/app-url';
import { locales } from '@/app/lib/i18n/locales';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // revalidate at most every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = APP_URL.replace(/\/$/, '');
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static: locale roots and courses index per locale (always returned so GSC gets valid XML even if DB fails)
  for (const locale of locales) {
    entries.push({
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
    entries.push({
      url: `${base}/${locale}/courses`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  try {
    await connectDB();
    const courses = await Course.find({ isActive: true })
      .select({ courseId: 1, durationDays: 1 })
      .lean();

    const durationDaysByCourse = (courses as { courseId: string; durationDays?: number }[]).map(
      (c) => ({ courseId: c.courseId, durationDays: Math.max(1, c.durationDays ?? 30) })
    );

    for (const locale of locales) {
      for (const { courseId, durationDays } of durationDaysByCourse) {
        entries.push({
          url: `${base}/${locale}/courses/${courseId}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
        for (let day = 1; day <= durationDays; day++) {
          entries.push({
            url: `${base}/${locale}/courses/${courseId}/day/${day}/view`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }
  } catch (_err) {
    // DB unavailable (e.g. serverless cold start, timeout): return static entries only so sitemap is still valid
  }

  return entries;
}
