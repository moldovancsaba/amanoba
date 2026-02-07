/**
 * Public lesson view (GEO).
 * Read-only lesson at /courses/[courseId]/day/[dayNumber]/view for discovery via sitemap/search/AI.
 * No quiz, no prev/next; Logo + Back to Course + content + Enroll card. Not linked from the rest of the site.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPublicLessonData } from '@/app/lib/public-lesson';
import { contentToHtml } from '@/app/lib/lesson-content';
import { APP_URL } from '@/app/lib/constants/app-url';
import Logo from '@/components/Logo';

interface ViewPageProps {
  params: Promise<{ locale: string; courseId: string; dayNumber: string }>;
}

export async function generateMetadata({ params }: ViewPageProps): Promise<Metadata> {
  const { locale, courseId, dayNumber } = await params;
  const day = parseInt(dayNumber, 10);
  if (isNaN(day) || day < 1) return { title: 'Lesson | Amanoba' };

  const data = await getPublicLessonData(courseId, day);
  if (!data) return { title: 'Lesson | Amanoba' };

  const title = `Day ${data.lesson.dayNumber}: ${data.lesson.title} | ${data.course.name} | Amanoba`;
  const plain = (data.lesson.content || '').replace(/<[^>]*>/g, '').trim();
  const description = plain.length > 160 ? plain.slice(0, 157) + '...' : plain;
  const viewUrl = `${APP_URL}/${locale}/courses/${courseId}/day/${dayNumber}/view`;

  return {
    title,
    description: description || `Lesson ${day} of ${data.course.name} on Amanoba.`,
    alternates: { canonical: viewUrl },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      url: viewUrl,
      siteName: 'Amanoba',
      title,
      description: description || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
    },
  };
}

export default async function PublicLessonViewPage({ params }: ViewPageProps) {
  const { locale, courseId, dayNumber } = await params;
  const day = parseInt(dayNumber, 10);
  if (isNaN(day) || day < 1) notFound();

  const data = await getPublicLessonData(courseId, day);
  if (!data) notFound();

  const courseLang = data.course.language || 'en';
  const dir = courseLang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen bg-brand-black pb-safe" dir={dir}>
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Logo size="sm" showText={false} linkTo="/" className="flex-shrink-0" />
            <Link
              href={`/${locale}/courses/${courseId}`}
              className="min-h-[44px] inline-flex items-center gap-2 text-brand-white hover:text-brand-accent truncate"
            >
              <ArrowLeft className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Back to Course</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <article className="flex-1 min-w-0">
            <div className="bg-brand-white rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-brand-accent shadow-lg mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-black leading-tight break-words mb-2">
                {data.lesson.title}
              </h1>
              <p className="text-sm text-brand-darkGrey">
                Day {data.lesson.dayNumber} of {data.course.durationDays} · {data.course.name}
              </p>
            </div>
            <div className="bg-brand-white rounded-2xl p-6 sm:p-10 border-2 border-brand-accent shadow-lg">
              <div
                className="prose prose-base sm:prose-lg lesson-prose max-w-none text-brand-black"
                dangerouslySetInnerHTML={{ __html: contentToHtml(data.lesson.content) }}
              />
            </div>
          </article>

          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-brand-white rounded-2xl p-6 border-2 border-brand-accent shadow-lg sticky top-4">
              <h2 className="text-xl font-bold text-brand-black mb-2">{data.course.name}</h2>
              <p className="text-sm text-brand-darkGrey mb-4">
                {data.course.durationDays}-day structured course. Enroll to unlock quizzes, track progress, and earn a certificate.
              </p>
              <Link
                href={`/${locale}/courses/${courseId}`}
                className="block w-full text-center bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
              >
                Enroll in this course
              </Link>
              <p className="text-xs text-brand-darkGrey mt-3">
                Already have an account? You can sign in and enroll from the course page.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
