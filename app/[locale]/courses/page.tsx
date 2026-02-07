/**
 * Course Catalog Page
 * 
 * What: User-facing course listing and enrollment
 * Why: Allows users to browse and enroll in courses
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import {
  BookOpen,
  Calendar,
  Award,
  Star,
  Search,
  ArrowLeft,
  CreditCard,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';
import Logo from '@/components/Logo';
import { COURSE_LANGUAGE_OPTIONS, type CourseLanguageCode } from '@/app/lib/constants/course-languages';

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
  certification?: {
    enabled?: boolean;
  };
  voteAggregate?: { up: number; down: number; score: number; count: number };
}

export default function CoursesPage() {
  const { data: session } = useSession();
  const t = useTranslations('courses');
  const tCommon = useTranslations('common');
  const tSettings = useTranslations('settings');
  const tAuth = useTranslations('auth');
  const locale = useLocale();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([locale]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'active');
      params.append('locale', locale);
      params.append('includeVoteAggregates', '1');
      params.append('languages', (selectedLanguages.length > 0 ? selectedLanguages : [locale]).join(','));
      // SHOW ALL COURSES: No language filter
      // Each course card displays in requested locale when translations exist (P0 catalog language integrity)
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
  }, [search, locale, selectedLanguages]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchCourses();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchCourses]);

  useEffect(() => {
    setSelectedLanguages([locale]);
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('courseLanguageFilters');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return;
      const allowed = new Set<CourseLanguageCode>(COURSE_LANGUAGE_OPTIONS.map((opt) => opt.code));
      const cleaned = parsed.filter(
        (value): value is CourseLanguageCode => typeof value === 'string' && allowed.has(value as CourseLanguageCode)
      );
      if (cleaned.length > 0) {
        setSelectedLanguages(cleaned);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('courseLanguageFilters', JSON.stringify(selectedLanguages));
    } catch {
      // ignore storage errors
    }
  }, [selectedLanguages]);

  const getLanguageLabel = (code: string): string => {
    if (code === 'hu') return 'Magyar';
    if (code === 'en') return 'English';
    if (code === 'tr') return 'Türkçe';
    if (code === 'bg') return 'Български';
    if (code === 'pl') return 'Polski';
    if (code === 'vi') return 'Tiếng Việt';
    if (code === 'id') return 'Bahasa Indonesia';
    if (code === 'ar') return 'العربية';
    if (code === 'pt') return 'Português';
    if (code === 'hi') return 'हिन्दी';
    if (code === 'ru') return 'Русский';
    if (code === 'sw') return 'Kiswahili';
    return code.toUpperCase();
  };

  const getLanguageFlag = (code: string): string => {
    if (code === 'hu') return '🇭🇺';
    if (code === 'en') return '🇬🇧';
    if (code === 'tr') return '🇹🇷';
    if (code === 'bg') return '🇧🇬';
    if (code === 'pl') return '🇵🇱';
    if (code === 'vi') return '🇻🇳';
    if (code === 'id') return '🇮🇩';
    if (code === 'ar') return '🇸🇦';
    if (code === 'pt') return '🇵🇹';
    if (code === 'hi') return '🇮🇳';
    if (code === 'ru') return '🇷🇺';
    if (code === 'sw') return '🇹🇿';
    return '🌐';
  };

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) => {
      const exists = prev.includes(code);
      if (exists) {
        const next = prev.filter((item) => item !== code);
        return next.length > 0 ? next : prev;
      }
      return [...prev, code];
    });
  };

  const selectAllLanguages = () => {
    setSelectedLanguages(COURSE_LANGUAGE_OPTIONS.map((option) => option.code));
  };

  const clearLanguages = () => {
    setSelectedLanguages([locale]);
  };

  // Map course language to UI text translations
  // This ensures course cards display in their NATIVE language, not URL locale
  const courseCardTranslations: Record<string, Record<string, string>> = {
    hu: {
      premium: 'Premium',
      free: 'Ingyenes',
      certification: 'Tanúsítvány',
      noCertification: 'Nincs tanúsítvány',
      viewCourse: 'Kurzus megtekintése',
      days: 'nap',
      points: 'pont',
    },
    en: {
      premium: 'Premium',
      free: 'Free',
      certification: 'Certification',
      noCertification: 'No certification',
      viewCourse: 'View course',
      days: 'days',
      points: 'points',
    },
    tr: {
      premium: 'Premium',
      free: 'Ücretsiz',
      certification: 'Sertifika',
      noCertification: 'Sertifika yok',
      viewCourse: 'Kursu görüntüle',
      days: 'gün',
      points: 'puan',
    },
    bg: {
      premium: 'Премиум',
      free: 'Безплатен',
      certification: 'Сертификат',
      noCertification: 'Без сертификат',
      viewCourse: 'Преглед на курса',
      days: 'дни',
      points: 'точки',
    },
    pl: {
      premium: 'Premium',
      free: 'Darmowy',
      certification: 'Certyfikat',
      noCertification: 'Brak certyfikatu',
      viewCourse: 'Wyświetl kurs',
      days: 'dni',
      points: 'punkty',
    },
    vi: {
      premium: 'Khóa học cao cấp',
      free: 'Khóa học miễn phí',
      certification: 'Chứng chỉ',
      noCertification: 'Không có chứng chỉ',
      viewCourse: 'Xem khóa học',
      days: 'ngày',
      points: 'điểm',
    },
    id: {
      premium: 'Premium',
      free: 'Gratis',
      certification: 'Sertifikat',
      noCertification: 'Tanpa sertifikat',
      viewCourse: 'Lihat kursus',
      days: 'hari',
      points: 'poin',
    },
    ar: {
      premium: 'دورة متميزة',
      free: 'دورة مجانية',
      certification: 'شهادة',
      noCertification: 'بدون شهادة',
      viewCourse: 'عرض الدورة',
      days: 'أيام',
      points: 'نقاط',
    },
    pt: {
      premium: 'Curso Premium',
      free: 'Curso Gratuito',
      certification: 'Certificado',
      noCertification: 'Sem certificado',
      viewCourse: 'Ver curso',
      days: 'dias',
      points: 'pontos',
    },
    hi: {
      premium: 'प्रीमियम कोर्स',
      free: 'मुफ्त कोर्स',
      certification: 'प्रमाणपत्र',
      noCertification: 'कोई प्रमाणपत्र नहीं',
      viewCourse: 'कोर्स देखें',
      days: 'दिन',
      points: 'अंक',
    },
    ru: {
      premium: 'Премиум курс',
      free: 'Бесплатный курс',
      certification: 'Сертификат',
      noCertification: 'Без сертификата',
      viewCourse: 'Посмотреть курс',
      days: 'дни',
      points: 'баллы',
    },
    sw: {
      premium: 'Kozi ya Premium',
      free: 'Kozi ya Bure',
      certification: 'Cheti',
      noCertification: 'Hakuna cheti',
      viewCourse: 'Tazama kozi',
      days: 'siku',
      points: 'pointi',
    },
  };

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
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center bg-brand-accent text-brand-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-sm sm:text-base"
              >
                {tAuth('signIn')}
              </LocaleLink>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-5 sm:py-10 pb-24 sm:pb-10 pb-safe">
        {/* Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-white/50" />
              <input
                type="text"
                placeholder={t('searchCourses')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-brand-darkGrey border-2 border-brand-accent/30 rounded-xl text-brand-white placeholder-brand-white/50 focus:outline-none focus:border-brand-accent text-base sm:text-lg"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLanguageDropdown((prev) => !prev)}
                className="min-h-[48px] inline-flex items-center justify-between gap-3 bg-brand-darkGrey border-2 border-brand-accent/30 rounded-xl px-4 py-3 text-brand-white hover:border-brand-accent transition-colors w-full sm:w-64"
              >
                <span className="flex items-center gap-2">
                  {tSettings('language')}
                  <span className="text-brand-white/60 text-sm">({selectedLanguages.length})</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-full sm:w-72 bg-brand-darkGrey border-2 border-brand-accent rounded-xl shadow-xl z-20 p-2 max-h-72 overflow-auto">
                  <div className="px-3 py-2 text-xs uppercase tracking-wide text-brand-white/60">
                    {tCommon('filter')}
                  </div>
                  <div className="flex items-center gap-2 px-3 pb-2">
                    <button
                      type="button"
                      onClick={selectAllLanguages}
                      className="text-xs font-semibold text-brand-white/80 hover:text-brand-white"
                    >
                      Select all
                    </button>
                    <span className="text-brand-white/40">•</span>
                    <button
                      type="button"
                      onClick={clearLanguages}
                      className="text-xs font-semibold text-brand-white/80 hover:text-brand-white"
                    >
                      Clear
                    </button>
                  </div>
                  {COURSE_LANGUAGE_OPTIONS.map((option) => (
                    <label
                      key={option.code}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brand-black/30 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(option.code)}
                        onChange={() => toggleLanguage(option.code)}
                        className="h-4 w-4 rounded border-brand-white/30 text-brand-accent focus:ring-brand-accent"
                      />
                      <span className="text-lg">{getLanguageFlag(option.code)}</span>
                      <span className="text-brand-white">{getLanguageLabel(option.code)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
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
            {courses.map((course) => {
              // Get translations in COURSE language (not URL locale)
              // This ensures card text matches the course's native language
              const courseTexts = courseCardTranslations[course.language as keyof typeof courseCardTranslations] || courseCardTranslations.en;
              
              return (
                <LocaleLink
                  key={course._id}
                  href={`/${course.language}/courses/${course.courseId}`}
                  className="block bg-brand-white rounded-2xl p-6 sm:p-7 border-2 border-brand-accent hover:shadow-xl transition-all"
                >
                  {course.thumbnail && (
                    <div className="relative w-full h-44 sm:h-48 bg-brand-darkGrey rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <Image
                        src={course.thumbnail}
                        alt={course.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-brand-black leading-tight mb-2 line-clamp-2">{course.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap text-sm sm:text-base">
                      {/* Language Flag */}
                      <span className="text-lg" title={
                        course.language === 'hu' ? 'Magyar' :
                        course.language === 'en' ? 'English' :
                        course.language === 'tr' ? 'Türkçe' :
                        course.language === 'bg' ? 'Български' :
                        course.language === 'pl' ? 'Polski' :
                        course.language === 'vi' ? 'Tiếng Việt' :
                        course.language === 'id' ? 'Bahasa Indonesia' :
                        course.language === 'ar' ? 'العربية' :
                        course.language === 'pt' ? 'Português' :
                        course.language === 'hi' ? 'हिन्दी' :
                        course.language === 'ru' ? 'Русский' :
                        course.language === 'sw' ? 'Kiswahili' :
                        course.language.toUpperCase()
                      }>
                        {course.language === 'hu' ? '🇭🇺' :
                         course.language === 'en' ? '🇬🇧' :
                         course.language === 'tr' ? '🇹🇷' :
                         course.language === 'bg' ? '🇧🇬' :
                         course.language === 'pl' ? '🇵🇱' :
                         course.language === 'vi' ? '🇻🇳' :
                         course.language === 'id' ? '🇮🇩' :
                         course.language === 'ar' ? '🇸🇦' :
                         course.language === 'pt' ? '🇵🇹' :
                         course.language === 'hi' ? '🇮🇳' :
                         course.language === 'ru' ? '🇷🇺' :
                         course.language === 'sw' ? '🇹🇿' :
                         '🌐'}
                      </span>
                      {/* Premium/Free Chips - CRITICAL: Use course language, not URL locale */}
                      {course.requiresPremium ? (
                        <span className="bg-brand-accent text-brand-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5" />
                          {courseTexts.premium}
                        </span>
                      ) : (
                        <span className="bg-brand-darkGrey/20 text-brand-darkGrey text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          {courseTexts.free}
                        </span>
                      )}
                      {course.certification?.enabled ? (
                        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          {courseTexts.certification}
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                          {courseTexts.noCertification}
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
                  <div className="flex items-center gap-4 text-sm sm:text-base text-brand-darkGrey mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {course.durationDays} {courseTexts.days}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>
                        {course.pointsConfig.completionPoints} {courseTexts.points}
                      </span>
                    </div>
                  </div>
                  {course.voteAggregate && course.voteAggregate.count > 0 && (
                    <div className="flex items-center gap-2 text-sm text-brand-darkGrey mb-5">
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <span>{course.voteAggregate.up}</span>
                      <ThumbsDown className="w-4 h-4 text-amber-600" />
                      <span>{course.voteAggregate.down}</span>
                    </div>
                  )}
                  <div className="min-h-[44px] flex items-center justify-center bg-brand-accent text-brand-black px-5 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors text-base w-full touch-manipulation">
                    {courseTexts.viewCourse} →
                  </div>
                </LocaleLink>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
