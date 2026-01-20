/**
 * Course Catalog Page
 * 
 * What: Student-facing course listing and enrollment
 * Why: Allows students to browse and enroll in courses
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import {
  BookOpen,
  Calendar,
  Users,
  Award,
  Lock,
  Star,
  Search,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import Logo from '@/components/Logo';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  language: string;
  thumbnail?: string;
  isActive: boolean;
  requiresPremium: boolean;
  price?: {
    amount: number;
    currency: string;
  };
  durationDays: number;
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number;
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number;
  };
}

export default function CoursesPage() {
  const { data: session } = useSession();
  const t = useTranslations('courses');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [defaultThumbnail, setDefaultThumbnail] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    fetchDefaultThumbnail();
  }, []);

  const fetchDefaultThumbnail = async () => {
    try {
      const response = await fetch('/api/admin/settings/default-thumbnail');
      const data = await response.json();
      if (data.success && data.thumbnail) {
        setDefaultThumbnail(data.thumbnail);
      }
    } catch (error) {
      console.error('Failed to fetch default thumbnail:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'active');
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/courses?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== undefined) {
        fetchCourses();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const formatPrice = (amount: number, currency: string): string => {
    const formatter = new Intl.NumberFormat(
      currency === 'huf' ? 'hu-HU' : currency === 'eur' ? 'de-DE' : currency === 'gbp' ? 'en-GB' : 'en-US',
      {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: currency === 'huf' ? 0 : 2,
        maximumFractionDigits: currency === 'huf' ? 0 : 2,
      }
    );
    // Convert from cents to main unit
    const mainUnit = currency === 'huf' ? amount : amount / 100;
    return formatter.format(mainUnit);
  };

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-5 sm:py-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <Logo size="sm" showText={false} linkTo={session ? "/dashboard" : "/"} className="flex-shrink-0" />
              <LocaleLink
                href={session ? "/dashboard" : "/"}
                className="text-brand-white hover:text-brand-accent transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </LocaleLink>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-brand-white flex items-center gap-2 leading-tight">
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
                  {t('availableCourses')}
                </h1>
                <p className="text-brand-white/80 mt-1 sm:mt-2 text-sm sm:text-lg">{t('browseAndEnroll')}</p>
              </div>
            </div>
            {!session && (
              <LocaleLink
                href="/auth/signin"
                className="bg-brand-accent text-brand-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-sm sm:text-base"
              >
                {tAuth('signIn')}
              </LocaleLink>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-10">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-white/50" />
            <input
              type="text"
              placeholder={t('searchCourses')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-brand-darkGrey border-2 border-brand-accent/30 rounded-xl text-brand-white placeholder-brand-white/50 focus:outline-none focus:border-brand-accent text-base sm:text-lg"
            />
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-brand-white text-lg">{t('loadingCourses')}</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-brand-darkGrey rounded-2xl p-12 text-center border-2 border-brand-accent">
            <BookOpen className="w-16 h-16 text-brand-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-white mb-2">{t('noCoursesAvailable')}</h3>
            <p className="text-brand-white/70">{t('checkBackSoon')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {courses.map((course) => (
              <LocaleLink
                key={course._id}
                href={`/courses/${course.courseId}`}
                className="block bg-brand-white rounded-2xl p-6 sm:p-7 border-2 border-brand-accent hover:shadow-xl transition-all"
              >
                {(course.thumbnail || defaultThumbnail) && (
                  <div className="w-full h-44 sm:h-48 bg-brand-darkGrey rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={course.thumbnail || defaultThumbnail || ''}
                      alt={course.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="mb-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-black leading-tight mb-2 line-clamp-2">{course.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap text-sm sm:text-base">
                    {/* Language Flag */}
                    <span className="text-lg" title={course.language === 'hu' ? 'Magyar' : course.language === 'en' ? 'English' : course.language.toUpperCase()}>
                      {course.language === 'hu' ? '🇭🇺' : course.language === 'en' ? '🇬🇧' : '🌐'}
                    </span>
                    {/* Premium/Free Chips */}
                    {course.requiresPremium ? (
                      <span className="bg-brand-accent text-brand-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5" />
                        {t('premiumCourse')}
                      </span>
                    ) : (
                      <span className="bg-brand-darkGrey/20 text-brand-darkGrey text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        {t('freeCourse')}
                      </span>
                    )}
                  </div>
                </div>
                {course.requiresPremium && course.price && (
                  <div className="mb-4 flex items-center gap-2 text-lg font-bold text-brand-black">
                    <CreditCard className="w-5 h-5" />
                    <span>{formatPrice(course.price.amount, course.price.currency)}</span>
                  </div>
                )}
                {course.requiresPremium && !course.price && (
                  <div className="mb-4 flex items-center gap-2 text-base text-brand-darkGrey">
                    <CreditCard className="w-4 h-4" />
                    <span>{t('premiumRequired')}</span>
                  </div>
                )}
                <p className="text-brand-darkGrey text-sm sm:text-base mb-5 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-sm sm:text-base text-brand-darkGrey mb-5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {course.durationDays} {t('days')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>
                      {course.pointsConfig.completionPoints} {tCommon('points')}
                    </span>
                  </div>
                </div>
                <div className="bg-brand-accent text-brand-black px-5 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors text-base w-full">
                  {t('viewCourse')} →
                </div>
              </LocaleLink>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
