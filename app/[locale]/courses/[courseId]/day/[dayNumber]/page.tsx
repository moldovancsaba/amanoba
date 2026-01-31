/**
 * Daily Lesson Viewer Page
 * 
 * What: Display lesson content for a specific day
 * Why: Users read and complete daily lessons
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LocaleLink } from '@/components/LocaleLink';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lock,
  Award,
  Play,
  Calendar,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Logo from '@/components/Logo';
import ContentVoteWidget from '@/components/ContentVoteWidget';

interface Lesson {
  _id: string;
  lessonId: string;
  dayNumber: number;
  title: string;
  content: string;
  assessmentGameId?: string;
  assessmentGameRoute?: string; // Game route for navigation (e.g., '/games/quizzz')
  quizConfig?: {
    enabled: boolean;
    successThreshold: number;
    questionCount: number;
    poolSize: number;
    required: boolean;
  };
  pointsReward: number;
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

interface Navigation {
  previous: { day: number; title: string } | null;
  next: { day: number; title: string } | null;
}

// Static translations for day page - keyed by COURSE LANGUAGE
const dayPageTranslations: Record<string, Record<string, string>> = {
  ar: {
    loadingLesson: 'جارٍ تحميل الدرس...',
    lessonNotFound: 'الدرس غير موجود',
    backToMyCourses: 'العودة إلى دوراتي',
    backToCourse: 'العودة إلى الدورة',
    dayNumber: 'اليوم {{day}}',
    completePreviousLessons: 'أكمل الدروس السابقة',
    points: 'نقاط',
    xp: 'XP',
    previousDay: 'اليوم السابق',
    takeQuiz: 'ابدأ الاختبار',
    completing: 'جاري الإكمال...',
    markAsComplete: 'تمييز كمكتمل',
    completed: 'مكتمل',
    nextDay: 'اليوم التالي',
    quizRequiredMessage: 'للمتابعة يجب اجتياز اختبار اليوم.',
    testYourKnowledge: 'اختبر معرفتك',
    assessmentDescription: 'اختبر معرفتك عبر الألعاب',
    playAssessment: 'ابدأ التقييم',
    failedToStartAssessment: 'فشل بدء التقييم',
    lessonLocked: 'الدرس مقفل',
    goToDay: 'الانتقال إلى اليوم {{day}}',
    mustPassQuiz: 'يجب اجتياز الاختبار أولًا',
    failedToComplete: 'فشل إكمال الدرس',
    failedToLoadLesson: 'فشل تحميل الدرس',
  },
  hu: {
    loadingLesson: 'Lecke betöltése...',
    lessonNotFound: 'Lecke nem található',
    backToMyCourses: 'Vissza a kurzusaimhoz',
    backToCourse: 'Vissza a kurzusra',
    dayNumber: '{{day}}. nap',
    completePreviousLessons: 'Teljesítsd az előző leckéket, hogy feloldhasd ezt.',
    points: 'pont',
    xp: 'XP',
    previousDay: 'Előző nap',
    takeQuiz: 'Kitöltöm a kvízt',
    completing: 'Befejezés...',
    markAsComplete: 'Befejezveként jelölés',
    completed: 'Befejezve',
    nextDay: 'Következő nap',
    quizRequiredMessage: 'A kvíz sikeres teljesítése (5/5) szükséges a befejezéshez. A kérdések a „Kitöltöm a kvízt” gombbal érhetők el.',
    testYourKnowledge: 'Teszteld a tudásodat',
    assessmentDescription: 'Teljesítsd az értékelő játékot, hogy megerősítsd a tanultakat. Az eredményeid ehhez a leckéhez lesznek kapcsolva.',
    playAssessment: 'Játssz értékelőt →',
    failedToStartAssessment: 'Nem sikerült elindítani az értékelést. Kérlek próbáld újra.',
    lessonLocked: 'Lecke zárolva',
    goToDay: 'Menj a(z) {{day}}. napra',
    mustPassQuiz: 'A lecke befejezéséhez át kell menned a quiz-en.',
    failedToComplete: 'Nem sikerült befejezni a leckét',
    failedToLoadLesson: 'Nem sikerült betölteni a leckét',
  },
  en: {
    loadingLesson: 'Loading lesson...',
    lessonNotFound: 'Lesson not found',
    backToMyCourses: 'Back to My Courses',
    backToCourse: 'Back to Course',
    dayNumber: 'Day {{day}}',
    completePreviousLessons: 'Complete previous lessons to unlock this lesson.',
    points: 'points',
    xp: 'XP',
    previousDay: 'Previous Day',
    takeQuiz: 'Take Quiz',
    completing: 'Completing...',
    markAsComplete: 'Mark as Complete',
    completed: 'Completed',
    nextDay: 'Next Day',
    quizRequiredMessage: 'You need to pass the quiz (5/5) to complete this lesson. Use the "Take Quiz" button to open it.',
    testYourKnowledge: 'Test Your Knowledge',
    assessmentDescription: 'Complete the assessment game to reinforce what you learned. Your results will be linked to this lesson.',
    playAssessment: 'Play Assessment →',
    failedToStartAssessment: 'Failed to start assessment. Please try again.',
    lessonLocked: 'Lesson Locked',
    goToDay: 'Go to Day {{day}}',
    mustPassQuiz: 'You must pass the quiz before completing this lesson.',
    failedToComplete: 'Failed to complete lesson',
    failedToLoadLesson: 'Failed to load lesson',
  },
  ru: {
    loadingLesson: 'Загрузка урока...',
    lessonNotFound: 'Урок не найден',
    backToMyCourses: 'Назад к моим курсам',
    backToCourse: 'Назад к курсу',
    dayNumber: 'День {{day}}',
    completePreviousLessons: 'Завершите предыдущие уроки, чтобы открыть этот.',
    points: 'баллы',
    xp: 'XP',
    previousDay: 'Предыдущий день',
    takeQuiz: 'Пройти квиз',
    completing: 'Завершение...',
    markAsComplete: 'Отметить как завершенный',
    completed: 'Завершено',
    nextDay: 'Следующий день',
    quizRequiredMessage: 'Нужно пройти квиз (5/5), чтобы завершить урок. Нажмите «Пройти квиз».',
    testYourKnowledge: 'Проверьте знания',
    assessmentDescription: 'Пройдите оценочный квиз, чтобы закрепить материал. Результаты будут связаны с уроком.',
    playAssessment: 'Пройти оценку →',
    failedToStartAssessment: 'Не удалось запустить квиз. Попробуйте еще раз.',
    lessonLocked: 'Урок закрыт',
    goToDay: 'Перейти к дню {{day}}',
    mustPassQuiz: 'Нужно пройти квиз, чтобы завершить урок.',
    failedToComplete: 'Не удалось завершить урок',
    failedToLoadLesson: 'Не удалось загрузить урок',
  },
  pt: {
    loadingLesson: 'Carregando aula...',
    lessonNotFound: 'Aula não encontrada',
    backToMyCourses: 'Voltar aos meus cursos',
    backToCourse: 'Voltar ao curso',
    dayNumber: 'Dia {{day}}',
    completePreviousLessons: 'Conclua as aulas anteriores',
    points: 'pontos',
    xp: 'XP',
    previousDay: 'Dia anterior',
    takeQuiz: 'Fazer questionário',
    completing: 'Concluindo...',
    markAsComplete: 'Marcar como concluído',
    completed: 'Concluído',
    nextDay: 'Próximo dia',
    quizRequiredMessage: 'Você precisa passar no questionário de hoje para continuar.',
    testYourKnowledge: 'Teste seus conhecimentos',
    assessmentDescription: 'Teste seus conhecimentos com jogos',
    playAssessment: 'Iniciar avaliação',
    failedToStartAssessment: 'Falha ao iniciar a avaliação',
    lessonLocked: 'Aula bloqueada',
    goToDay: 'Ir para o dia {{day}}',
    mustPassQuiz: 'Você deve passar no questionário primeiro',
    failedToComplete: 'Falha ao concluir',
    failedToLoadLesson: 'Falha ao carregar a aula',
  },
  vi: {
    loadingLesson: 'Đang tải bài học...',
    lessonNotFound: 'Không tìm thấy bài học',
    backToMyCourses: 'Quay lại khóa học của tôi',
    backToCourse: 'Quay lại khóa học',
    dayNumber: 'Ngày {{day}}',
    completePreviousLessons: 'Hoàn thành các bài học trước',
    points: 'điểm',
    xp: 'XP',
    previousDay: 'Ngày trước',
    takeQuiz: 'Làm bài kiểm tra',
    completing: 'Đang hoàn thành...',
    markAsComplete: 'Đánh dấu là hoàn thành',
    completed: 'Đã hoàn thành',
    nextDay: 'Ngày tiếp theo',
    quizRequiredMessage: 'Bạn phải vượt qua bài kiểm tra hôm nay để tiếp tục.',
    testYourKnowledge: 'Kiểm tra kiến thức của bạn',
    assessmentDescription: 'Kiểm tra kiến thức của bạn với trò chơi',
    playAssessment: 'Bắt đầu đánh giá',
    failedToStartAssessment: 'Không thể bắt đầu đánh giá',
    lessonLocked: 'Bài học bị khóa',
    goToDay: 'Đi đến ngày {{day}}',
    mustPassQuiz: 'Bạn phải vượt qua bài kiểm tra trước',
    failedToComplete: 'Không thể hoàn thành',
    failedToLoadLesson: 'Không thể tải bài học',
  },
  id: {
    loadingLesson: 'Memuat pelajaran...',
    lessonNotFound: 'Pelajaran tidak ditemukan',
    backToMyCourses: 'Kembali ke kursus saya',
    backToCourse: 'Kembali ke kursus',
    dayNumber: 'Hari {{day}}',
    completePreviousLessons: 'Selesaikan pelajaran sebelumnya',
    points: 'poin',
    xp: 'XP',
    previousDay: 'Hari sebelumnya',
    takeQuiz: 'Ikuti kuis',
    completing: 'Menyelesaikan...',
    markAsComplete: 'Tandai sebagai selesai',
    completed: 'Selesai',
    nextDay: 'Hari berikutnya',
    quizRequiredMessage: 'Anda harus lulus kuis hari ini untuk melanjutkan.',
    testYourKnowledge: 'Uji pengetahuan Anda',
    assessmentDescription: 'Uji pengetahuan Anda dengan permainan',
    playAssessment: 'Mulai penilaian',
    failedToStartAssessment: 'Gagal memulai penilaian',
    lessonLocked: 'Pelajaran terkunci',
    goToDay: 'Ke Hari {{day}}',
    mustPassQuiz: 'Anda harus lulus kuis terlebih dahulu',
    failedToComplete: 'Gagal menyelesaikan',
    failedToLoadLesson: 'Gagal memuat pelajaran',
  },
  hi: {
    loadingLesson: 'पाठ लोड हो रहा है...',
    lessonNotFound: 'पाठ नहीं मिला',
    backToMyCourses: 'मेरे पाठ्यक्रमों पर वापस जाएँ',
    backToCourse: 'पाठ्यक्रम पर वापस जाएँ',
    dayNumber: 'दिन {{day}}',
    completePreviousLessons: 'पिछले पाठ पूरे करें',
    points: 'अंक',
    xp: 'XP',
    previousDay: 'पिछला दिन',
    takeQuiz: 'प्रश्नोत्तरी दें',
    completing: 'पूरा हो रहा है...',
    markAsComplete: 'पूर्ण के रूप में चिह्नित करें',
    completed: 'पूर्ण',
    nextDay: 'अगला दिन',
    quizRequiredMessage: 'आगे बढ़ने के लिए आज की प्रश्नोत्तरी पास करनी होगी।',
    testYourKnowledge: 'अपना ज्ञान जांचें',
    assessmentDescription: 'खेलों के साथ अपना ज्ञान जांचें',
    playAssessment: 'आकलन शुरू करें',
    failedToStartAssessment: 'आकलन शुरू नहीं हो सका',
    lessonLocked: 'पाठ लॉक है',
    goToDay: 'दिन {{day}} पर जाएँ',
    mustPassQuiz: 'पहले प्रश्नोत्तरी पास करनी होगी',
    failedToComplete: 'पूरा करने में विफल',
    failedToLoadLesson: 'पाठ लोड नहीं हो सका',
  },
  tr: {
    loadingLesson: 'Ders yükleniyor...',
    lessonNotFound: 'Ders bulunamadı',
    backToMyCourses: 'Kurslarıma dön',
    backToCourse: 'Kursa dön',
    dayNumber: 'Gün {{day}}',
    completePreviousLessons: 'Önceki dersleri tamamlayın',
    points: 'puan',
    xp: 'XP',
    previousDay: 'Önceki gün',
    takeQuiz: 'Sınava gir',
    completing: 'Tamamlanıyor...',
    markAsComplete: 'Tamamlandı olarak işaretle',
    completed: 'Tamamlandı',
    nextDay: 'Sonraki gün',
    quizRequiredMessage: 'Devam etmek için bugünkü sınavı geçmelisiniz.',
    testYourKnowledge: 'Bilginizi test edin',
    assessmentDescription: 'Oyunlarla bilginizi test edin',
    playAssessment: 'Değerlendirmeyi başlat',
    failedToStartAssessment: 'Değerlendirme başlatılamadı',
    lessonLocked: 'Ders kilitli',
    goToDay: '{{day}}. güne git',
    mustPassQuiz: 'Önce sınavı geçmelisiniz',
    failedToComplete: 'Tamamlama başarısız',
    failedToLoadLesson: 'Ders yüklenemedi',
  },
  bg: {
    loadingLesson: 'Зареждане на урока...',
    lessonNotFound: 'Урокът не е намерен',
    backToMyCourses: 'Назад към моите курсове',
    backToCourse: 'Назад към курса',
    dayNumber: 'Ден {{day}}',
    completePreviousLessons: 'Завършете предишните уроци',
    points: 'точки',
    xp: 'XP',
    previousDay: 'Предишен ден',
    takeQuiz: 'Вземете тест',
    completing: 'Завършване...',
    markAsComplete: 'Маркирай като завършен',
    completed: 'Завършен',
    nextDay: 'Следващ ден',
    quizRequiredMessage: 'За да продължите, трябва да преминете теста за деня.',
    testYourKnowledge: 'Тествайте знанията си',
    assessmentDescription: 'Тествайте знанията си с игри',
    playAssessment: 'Започнете оценяване',
    failedToStartAssessment: 'Неуспешно стартиране на оценяване',
    lessonLocked: 'Урокът е заключен',
    goToDay: 'Отидете към ден {{day}}',
    mustPassQuiz: 'Трябва първо да преминете теста',
    failedToComplete: 'Неуспешно завършване',
    failedToLoadLesson: 'Неуспешно зареждане на урока',
  },
  pl: {
    loadingLesson: 'Ładowanie lekcji...',
    lessonNotFound: 'Lekcja nieznaleziona',
    backToMyCourses: 'Wróć do moich kursów',
    backToCourse: 'Wróć do kursu',
    dayNumber: 'Dzień {{day}}',
    completePreviousLessons: 'Ukończ poprzednie lekcje',
    points: 'punkty',
    xp: 'XP',
    previousDay: 'Poprzedni dzień',
    takeQuiz: 'Rozwiąż quiz',
    completing: 'Kończenie...',
    markAsComplete: 'Oznacz jako ukończone',
    completed: 'Ukończone',
    nextDay: 'Następny dzień',
    quizRequiredMessage: 'Aby kontynuować, musisz zaliczyć dzisiejszy quiz.',
    testYourKnowledge: 'Sprawdź swoją wiedzę',
    assessmentDescription: 'Sprawdź swoją wiedzę w grach',
    playAssessment: 'Rozpocznij ocenę',
    failedToStartAssessment: 'Nie udało się uruchomić oceny',
    lessonLocked: 'Lekcja zablokowana',
    goToDay: 'Przejdź do dnia {{day}}',
    mustPassQuiz: 'Najpierw musisz zaliczyć quiz',
    failedToComplete: 'Nie udało się ukończyć',
    failedToLoadLesson: 'Nie udało się załadować lekcji',
  },
};

// Helper to get translation by course language
const getDayPageText = (key: string, courseLang: string, params?: Record<string, string | number>): string => {
  const lang = courseLang || 'en';
  const translations = dayPageTranslations[lang] || dayPageTranslations.en;
  let text = translations[key] || dayPageTranslations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, String(v));
    });
  }
  return text;
};

export default function DailyLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; dayNumber: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [courseId, setCourseId] = useState<string>('');
  const [dayNumber, setDayNumber] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const [courseLanguage, setCourseLanguage] = useState<string>('en');
  const searchParams = useSearchParams();
  const _locale = useLocale();

  const fetchLesson = useCallback(async (cid: string, day: number, opts: { silent?: boolean; fallbackLanguage?: string } = {}) => {
    const errorLanguage = opts.fallbackLanguage || 'en';
    try {
      if (!opts.silent) {
        setLoading(true);
      }
      const response = await fetch(`/api/courses/${cid}/day/${day}`);
      const data = await response.json();

      if (data.success) {
        // Store course language for UI translations
        if (data.courseLanguage) {
          setCourseLanguage(data.courseLanguage);
        }

        setLesson(data.lesson);
        setNavigation(data.navigation);
        // Refresh quiz passed flag from localStorage (set by quiz page)
        // Include player ID in key to make it user-specific
        const user = session?.user as { id?: string; playerId?: string } | undefined;
        const playerId = user?.playerId || user?.id;
        const storageKey = playerId 
          ? `quiz-passed-${playerId}-${cid}-${data.lesson.lessonId}`
          : `quiz-passed-${cid}-${data.lesson.lessonId}`;
        const stored = localStorage.getItem(storageKey);
        setQuizPassed(stored === 'true');
      } else {
        alert(data.error || getDayPageText('failedToLoadLesson', errorLanguage));
      }
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
      alert(getDayPageText('failedToLoadLesson', errorLanguage));
    } finally {
      if (!opts.silent) {
        setLoading(false);
      }
    }
  }, [session]);

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const cid = resolvedParams.courseId;
      const day = parseInt(resolvedParams.dayNumber);
      
      setCourseId(cid);
      setDayNumber(day);
      
      // Extract language from courseId suffix (e.g., PRODUCTIVITY_2026_AR → ar)
      // This ensures links use correct language immediately, before API call
      const parts = cid.split('_');
      const suffix = parts[parts.length - 1].toLowerCase();
      const validLanguages = ['hu', 'en', 'ar', 'ru', 'pt', 'vi', 'id', 'hi', 'tr', 'bg', 'pl'];
      const fallbackLanguage = validLanguages.includes(suffix) ? suffix : 'en';
      if (validLanguages.includes(suffix)) {
        setCourseLanguage(suffix);
      }
      
      await fetchLesson(cid, day, { fallbackLanguage });
    };
    void loadData();
  }, [fetchLesson, params]);

  const handleComplete = async () => {
    if (!lesson || completing) return;

    // Check if quiz is required and not passed
    if (lesson.quizConfig?.enabled && lesson.quizConfig.required && !quizPassed) {
      alert(getDayPageText('mustPassQuiz', courseLanguage));
      return;
    }

    setCompleting(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/day/${dayNumber}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Optimistically update UI without flashing the whole page
        setLesson((prev) =>
          prev
            ? {
                ...prev,
                isCompleted: true,
              }
            : prev
        );
        // Refresh lesson state silently to pick up progress/unlocks
        await fetchLesson(courseId, dayNumber, { silent: true, fallbackLanguage: courseLanguage });
        // Alert removed - lesson completion is already visible in the UI
      } else {
        alert(data.error || getDayPageText('failedToComplete', courseLanguage));
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      alert(getDayPageText('failedToComplete', courseLanguage));
    } finally {
      setCompleting(false);
    }
  };

  useEffect(() => {
    // If quiz page redirected back with query flag, mark as passed
    const qp = searchParams.get('quiz');
    if (qp === 'passed' && lesson) {
      // Include player ID in key to make it user-specific
      const user = session?.user as { id?: string; playerId?: string } | undefined;
      const playerId = user?.playerId || user?.id;
      const key = playerId 
        ? `quiz-passed-${playerId}-${courseId}-${lesson.lessonId}`
        : `quiz-passed-${courseId}-${lesson.lessonId}`;
      localStorage.setItem(key, 'true');
      setQuizPassed(true);
    }
  }, [searchParams, lesson, courseId, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-brand-white text-xl">{getDayPageText('loadingLesson', courseLanguage)}</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-white mb-4">{getDayPageText('lessonNotFound', courseLanguage)}</h2>
          <LocaleLink
            href="/my-courses"
            className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400"
          >
            {getDayPageText('backToMyCourses', courseLanguage)}
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={false} linkTo={session?.user ? "/dashboard" : "/"} className="flex-shrink-0" />
              <LocaleLink
                href={`/${courseLanguage}/courses/${courseId}`}
                className="inline-flex items-center gap-2 text-brand-white hover:text-brand-accent"
              >
                <ArrowLeft className="w-5 h-5" />
                {getDayPageText('backToCourse', courseLanguage)}
              </LocaleLink>
            </div>
            <div className="flex items-center gap-2 text-brand-white">
              <Calendar className="w-5 h-5" />
              <span className="font-bold">
                {getDayPageText('dayNumber', courseLanguage, { day: lesson.dayNumber })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Lesson Header */}
        <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg mb-8">
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {lesson.isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : !lesson.isUnlocked ? (
                  <Lock className="w-6 h-6 text-brand-darkGrey" />
                ) : null}
                <h1 className="text-4xl font-bold text-brand-black leading-tight">{lesson.title}</h1>
              </div>
              {!lesson.isUnlocked && (
                <div className="bg-brand-darkGrey/20 border border-brand-darkGrey rounded-lg p-3 mt-3">
                  <p className="text-brand-darkGrey">
                    {getDayPageText('completePreviousLessons', courseLanguage)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {lesson.isUnlocked && (
            <div className="flex items-center gap-4 text-base text-brand-darkGrey mt-2">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{lesson.pointsReward} {getDayPageText('points', courseLanguage)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{lesson.xpReward} {getDayPageText('xp', courseLanguage)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Content */}
        {lesson.isUnlocked ? (
          <>
            {/* Actions - Moved to top */}
            <div className="bg-brand-white rounded-2xl p-6 border-2 border-brand-accent shadow-lg mb-8">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
                {/* Left: Previous Day */}
                <div className="flex-1 flex justify-start">
                  {navigation?.previous && (
                    <LocaleLink
                      href={`/${courseLanguage}/courses/${courseId}/day/${navigation.previous.day}`}
                      className="flex items-center justify-center gap-2 bg-brand-darkGrey text-brand-white px-6 py-3 rounded-lg font-bold hover:bg-brand-secondary-700 transition-colors w-full"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      {getDayPageText('previousDay', courseLanguage)}
                    </LocaleLink>
                  )}
                </div>

                {/* Center: Quiz and Complete buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 flex-shrink-0 w-full md:w-auto">
                  {/* Show quiz button if quiz is enabled and lesson not completed */}
                  {lesson.quizConfig?.enabled && !lesson.isCompleted && (
                    <LocaleLink
                      href={`/${courseLanguage}/courses/${courseId}/day/${dayNumber}/quiz`}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors text-base whitespace-nowrap ${
                        lesson.quizConfig.required && !quizPassed
                          ? 'bg-brand-accent text-brand-black hover:bg-brand-primary-400 px-7 py-3.5 w-full'
                          : 'bg-brand-white border-2 border-brand-accent text-brand-black hover:bg-brand-accent/80 w-full'
                      }`}
                    >
                      {getDayPageText('takeQuiz', courseLanguage)}
                    </LocaleLink>
                  )}

                  {/* Show "Mark as Complete" button only if:
                      - Lesson not completed AND
                      - (No quiz required OR quiz already passed) */}
                  {!lesson.isCompleted && 
                   !(lesson.quizConfig?.enabled && lesson.quizConfig.required && !quizPassed) && (
                    <button
                      onClick={handleComplete}
                      disabled={completing}
                      className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-7 py-3.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base whitespace-nowrap w-full"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {completing ? getDayPageText('completing', courseLanguage) : getDayPageText('markAsComplete', courseLanguage)}
                    </button>
                  )}

                  {/* Show completed state */}
                  {lesson.isCompleted && (
                    <div className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold whitespace-nowrap w-full">
                      <CheckCircle className="w-5 h-5" />
                      {getDayPageText('completed', courseLanguage)}
                    </div>
                  )}
                </div>

                {/* Right: Next Day */}
                <div className="flex-1 flex justify-end">
                  {navigation?.next && (
                    <LocaleLink
                      href={`/${courseLanguage}/courses/${courseId}/day/${navigation.next.day}`}
                      className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors w-full"
                    >
                      {getDayPageText('nextDay', courseLanguage)}
                      <ArrowRight className="w-5 h-5" />
                    </LocaleLink>
                  )}
                </div>
              </div>
              {lesson.quizConfig?.enabled && lesson.quizConfig.required && !quizPassed && (
                <p className="mt-4 text-sm text-brand-darkGrey text-center">
                  {getDayPageText('quizRequiredMessage', courseLanguage)}
                </p>
              )}
            </div>

            <div className="bg-brand-white rounded-2xl p-10 border-2 border-brand-accent shadow-lg mb-8">
              <div
                className="prose prose-xl lesson-prose max-w-none text-brand-black"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
              <ContentVoteWidget
                targetType="lesson"
                targetId={lesson._id}
                playerId={(session?.user as { id?: string; playerId?: string } | undefined)?.playerId ?? (session?.user as { id?: string } | undefined)?.id ?? null}
                label="Was this lesson helpful?"
                className="mt-6 pt-6 border-t border-brand-darkGrey/20"
              />
            </div>

            {/* Assessment Game */}
            {lesson.assessmentGameId && lesson.isCompleted && (
              <div className="bg-brand-accent/20 border-2 border-brand-accent rounded-xl p-8 mt-8">
                <h3 className="text-2xl font-bold text-brand-black mb-3 flex items-center gap-2">
                  <Play className="w-6 h-6" />
                  {getDayPageText('testYourKnowledge', courseLanguage)}
                </h3>
                <p className="text-brand-darkGrey mb-5">
                  {getDayPageText('assessmentDescription', courseLanguage)}
                </p>
                {lesson.assessmentGameRoute ? (
                  <LocaleLink
                    href={`${lesson.assessmentGameRoute}?courseId=${courseId}&lessonDay=${dayNumber}&assessment=true`}
                    className="inline-block bg-brand-accent text-brand-black px-7 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-base"
                  >
                    {getDayPageText('playAssessment', courseLanguage)}
                  </LocaleLink>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        // Start game session with course context
                        const sessionResponse = await fetch('/api/game-sessions/start', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            playerId: session?.user?.id,
                            gameId: lesson.assessmentGameId,
                            courseId: courseId,
                            lessonDay: dayNumber,
                          }),
                        });

                        const sessionData = await sessionResponse.json();

                        if (sessionData.success && lesson.assessmentGameRoute) {
                          // Navigate to game with session context
                          router.push(`${lesson.assessmentGameRoute}?sessionId=${sessionData.sessionId}&courseId=${courseId}&lessonDay=${dayNumber}&assessment=true`);
                        } else {
                          alert(getDayPageText('failedToStartAssessment', courseLanguage));
                        }
                      } catch (error) {
                        console.error('Failed to start assessment:', error);
                        alert(getDayPageText('failedToStartAssessment', courseLanguage));
                      }
                    }}
                    className="inline-block bg-brand-accent text-brand-black px-7 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-base"
                  >
                    {getDayPageText('playAssessment', courseLanguage)}
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-brand-darkGrey rounded-xl p-12 text-center border-2 border-brand-accent">
            <Lock className="w-16 h-16 text-brand-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-white mb-2">{getDayPageText('lessonLocked', courseLanguage)}</h3>
            <p className="text-brand-white/70 mb-6">
              {getDayPageText('completePreviousLessons', courseLanguage)}
            </p>
              {navigation?.previous && (
                <LocaleLink
                  href={`/${courseLanguage}/courses/${courseId}/day/${navigation.previous.day}`}
                  className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
                >
                  {getDayPageText('goToDay', courseLanguage, { day: navigation.previous.day })}
                </LocaleLink>
              )}
          </div>
        )}
      </main>
    </div>
  );
}
