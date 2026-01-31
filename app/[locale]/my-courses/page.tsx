/**
 * My Courses Page
 * 
 * What: User dashboard showing enrolled courses and progress
 * Why: Allows users to track their learning progress
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import Image from 'next/image';
import {
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import Logo from '@/components/Logo';

interface CourseProgress {
  course: {
    courseId: string;
    name: string;
    description: string;
    thumbnail?: string;
    language: string;
    durationDays: number;
  };
  progress: {
    currentDay: number;
    completedDays: number;
    totalDays: number;
    progressPercentage: number;
    isCompleted: boolean;
    startedAt: string;
    lastActivityAt: string;
  };
}

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const tCourses = useTranslations('courses');
  const tAuth = useTranslations('auth');
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/my-courses?locale=${locale}`);
      const data = await response.json();

      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch my courses:', error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (session) {
      fetchMyCourses();
    }
  }, [session, fetchMyCourses]);

  if (!session) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-white mb-4">{tCourses('signInToView')}</h2>
          <LocaleLink
            href="/auth/signin"
            className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400"
          >
            {tAuth('signIn')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent sticky top-0 z-30 mobile-sticky-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <Logo size="sm" showText={false} linkTo="/dashboard" className="flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-white flex items-center gap-2">
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
              {tCourses('myCourses')}
            </h1>
          </div>
          <p className="text-brand-white/80 mt-1 text-sm sm:text-base">{t('trackLearningProgress')}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-brand-white text-lg">{tCourses('loadingCourses')}</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-brand-darkGrey rounded-xl p-12 text-center border-2 border-brand-accent">
            <BookOpen className="w-16 h-16 text-brand-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-white mb-2">{t('noCoursesEnrolled')}</h3>
            <p className="text-brand-white/70 mb-6">{t('noCoursesEnrolled')}</p>
            <LocaleLink
              href="/courses"
              className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
            >
              📚 {t('browseCourses')}
            </LocaleLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 dashboard-grid-3">
            {courses.map((item) => (
              <div
                key={item.course.courseId}
                className="bg-brand-white rounded-xl p-5 sm:p-6 border-2 border-brand-accent hover:shadow-lg transition-all"
              >
                {item.course.thumbnail && (
                  <div className="relative w-full h-40 bg-brand-darkGrey rounded-lg mb-4 overflow-hidden">
                    <Image
                      src={item.course.thumbnail}
                      alt={item.course.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 20rem"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-black leading-tight">{item.course.name}</h3>
                    {item.progress.isCompleted && (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-brand-darkGrey line-clamp-2">
                    {item.course.description}
                  </p>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-brand-darkGrey">{tCourses('progress')}</span>
                    <span className="font-bold text-brand-black">
                      {item.progress.progressPercentage}%
                    </span>
                  </div>
                  <div className="bg-brand-darkGrey/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-brand-accent h-full transition-all"
                      style={{ width: `${item.progress.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-brand-darkGrey mt-2">
                    <span>
                      {tCourses('dayOf', {
                        currentDay: item.progress.currentDay,
                        totalDays: item.progress.totalDays,
                        defaultValue: `Day ${item.progress.currentDay} of ${item.progress.totalDays}`,
                      })}
                    </span>
                    <span>
                      {tCourses('daysCompleted', {
                        count: item.progress.completedDays,
                        defaultValue: `${item.progress.completedDays} days completed`,
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <LocaleLink
                  href={`/${item.course.language}/courses/${item.course.courseId}/day/${item.progress.currentDay}`}
                  className="block w-full bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors mobile-full-width"
                >
                  {item.progress.isCompleted
                    ? tCourses('reviewCourse')
                    : `${tCourses('continueLearning')} →`}
                </LocaleLink>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
