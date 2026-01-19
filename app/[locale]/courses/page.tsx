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
} from 'lucide-react';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  language: string;
  thumbnail?: string;
  isActive: boolean;
  requiresPremium: boolean;
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

  useEffect(() => {
    fetchCourses();
  }, []);

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

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LocaleLink
                href={session ? "/dashboard" : "/"}
                className="text-brand-white hover:text-brand-accent transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </LocaleLink>
              <div>
                <h1 className="text-4xl font-bold text-brand-white flex items-center gap-2 leading-tight">
                  <BookOpen className="w-8 h-8" />
                  {t('availableCourses')}
                </h1>
                <p className="text-brand-white/80 mt-2 text-lg">{t('browseAndEnroll')}</p>
              </div>
            </div>
            {!session && (
              <LocaleLink
                href="/auth/signin"
                className="bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-base"
              >
                {tAuth('signIn')}
              </LocaleLink>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-white/50" />
            <input
              type="text"
              placeholder={t('searchCourses')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-brand-darkGrey border-2 border-brand-accent/30 rounded-xl text-brand-white placeholder-brand-white/50 focus:outline-none focus:border-brand-accent text-lg"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {courses.map((course) => (
              <LocaleLink
                key={course._id}
                href={`/courses/${course.courseId}`}
                className="block bg-brand-white rounded-2xl p-7 border-2 border-brand-accent hover:shadow-xl transition-all"
              >
                {course.thumbnail && (
                  <div className="w-full h-48 bg-brand-darkGrey rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={course.thumbnail}
                      alt={course.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-brand-black leading-tight">{course.name}</h3>
                  {course.requiresPremium && (
                    <Star className="w-5 h-5 text-brand-accent" />
                  )}
                </div>
                <p className="text-brand-darkGrey text-base mb-5 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex items-center gap-5 text-base text-brand-darkGrey mb-5">
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
                <div className="bg-brand-accent text-brand-black px-5 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors text-base">
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
