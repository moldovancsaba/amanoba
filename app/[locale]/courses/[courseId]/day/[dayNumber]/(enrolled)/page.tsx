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
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconAward,
  IconBookmark,
  IconBookmarkFilled,
  IconCircleCheck,
  IconDeviceGamepad2,
  IconLock,
} from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Logo from '@/components/Logo';
import ContentVoteWidget from '@/components/ContentVoteWidget';
import { contentToHtml } from '@/app/lib/lesson-content';
import { readPracticeContextFromSearchParams } from '@/app/lib/practice-hub';
import { trackGAEvent } from '@/app/lib/analytics/ga-events';
import {
  resolveCourseAccessIssue,
  type CourseAccessRecoveryIssue,
} from '@/app/lib/course-access-recovery';
import CourseAccessRecoveryActions from '@/components/patterns/CourseAccessRecoveryActions';

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

interface QuizPolicy {
  enabled: boolean;
  required: boolean;
  questionCount: number;
  shownAnswerCount?: number;
  maxWrongAllowed?: number;
  successThreshold: number;
  availableQuestionCount?: number;
}

interface Navigation {
  previous: { day: number; title: string } | null;
  next: { day: number; title: string } | null;
}

type LessonAccessIssue = CourseAccessRecoveryIssue | null;

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
    quizRequiredMessage: 'A kvíz sikeres teljesítése ({{count}}/{{count}}) szükséges a befejezéshez. A kérdések a „Kitöltöm a kvízt” gombbal érhetők el.',
    quizRequiredMaxWrongMessage: 'A lecke befejezéséhez legfeljebb {{maxWrong}} hibád lehet {{count}} kérdésből. A kérdések a „Kitöltöm a kvízt” gombbal érhetők el.',
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
    quizRequiredMessage: 'You need to pass the quiz ({{count}}/{{count}}) to complete this lesson. Use the "Take Quiz" button to open it.',
    quizRequiredMaxWrongMessage: 'To complete this lesson, you can have at most {{maxWrong}} wrong answers out of {{count}} questions. Use the "Take Quiz" button to open it.',
    testYourKnowledge: 'Test Your Knowledge',
    assessmentDescription: 'Complete the assessment game to reinforce what you learned. Your results will be linked to this lesson.',
    playAssessment: 'Play Assessment →',
    failedToStartAssessment: 'Failed to start assessment. Please try again.',
    lessonLocked: 'Lesson Locked',
    goToDay: 'Go to Day {{day}}',
    mustPassQuiz: 'You must pass the quiz before completing this lesson.',
    failedToComplete: 'Failed to complete lesson',
    failedToLoadLesson: 'Failed to load lesson',
    saveLesson: 'Save lesson',
    removeSavedLesson: 'Remove saved lesson',
    savingLesson: 'Saving...',
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
    quizRequiredMessage: 'Нужно пройти квиз ({{count}}/{{count}}), чтобы завершить урок. Нажмите «Пройти квиз».',
    quizRequiredMaxWrongMessage: 'Чтобы завершить урок, можно допустить не более {{maxWrong}} ошибок из {{count}} вопросов. Нажмите «Пройти квиз».',
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
  sw: {
    loadingLesson: 'Inapakia somo...',
    lessonNotFound: 'Somo halijapatikana',
    backToMyCourses: 'Rudi kwenye kozi zangu',
    backToCourse: 'Rudi kwenye kozi',
    dayNumber: 'Siku {{day}}',
    completePreviousLessons: 'Kamilisha masomo yaliyotangulia kufungua hili.',
    points: 'pointi',
    xp: 'XP',
    previousDay: 'Siku iliyotangulia',
    takeQuiz: 'Fanya jaribio',
    completing: 'Inakamilisha...',
    markAsComplete: 'Weka kama imekamilika',
    completed: 'Imekamilika',
    nextDay: 'Siku inayofuata',
    quizRequiredMessage: 'Unahitaji kupita jaribio ({{count}}/{{count}}) kukamilisha somo hili. Tumia kitufe "Fanya Jaribio" kufungua.',
    quizRequiredMaxWrongMessage: 'Ili kukamilisha somo hili, unaweza kukosea si zaidi ya maswali {{maxWrong}} kati ya {{count}}. Tumia kitufe "Fanya Jaribio" kufungua.',
    testYourKnowledge: 'Jaribu Ujuzi wako',
    assessmentDescription: 'Kamilisha mchezo wa tathmini kuthibitisha ulichojifunza. Matokeo yako yataunganishwa na somo hili.',
    playAssessment: 'Cheza Tathmini →',
    failedToStartAssessment: 'Imeshindwa kuanza tathmini. Tafadhali jaribu tena.',
    lessonLocked: 'Somo limefungwa',
    goToDay: 'Nenda kwenye Siku {{day}}',
    mustPassQuiz: 'Lazima upite jaribio kabla ya kukamilisha somo.',
    failedToComplete: 'Imeshindwa kukamilisha somo',
    failedToLoadLesson: 'Imeshindwa kupakia somo',
  },
};

// Helper to get translation by course language
const getDayPageText = (key: string, courseLang: string, params?: Record<string, string | number>): string => {
  const lang = courseLang || 'en';
  const translations = dayPageTranslations[lang] || dayPageTranslations.en;
  let text = translations[key] || dayPageTranslations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      const placeholder = `{{${k}}}`;
      text = text.split(placeholder).join(String(v));
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
  const [totalDays, setTotalDays] = useState<number>(30);
  const [quizPolicy, setQuizPolicy] = useState<QuizPolicy | null>(null);
  const [isSavedLesson, setIsSavedLesson] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [accessIssue, setAccessIssue] = useState<LessonAccessIssue>(null);
  const searchParams = useSearchParams();
  const locale = useLocale(); // URL locale (e.g. /hu/ → 'hu') for fallback when lesson not found before courseLanguage is set

  const fetchLesson = useCallback(async (cid: string, day: number, opts: { silent?: boolean; fallbackLanguage?: string } = {}) => {
    const errorLanguage = opts.fallbackLanguage || 'en';
    try {
      if (!opts.silent) {
        setLoading(true);
      }
      const response = await fetch(`/api/courses/${cid}/day/${day}`);
      const data = await response.json();

      if (data.success) {
        setAccessIssue(null);
        // Store course language for UI translations
        if (data.courseLanguage) {
          setCourseLanguage(data.courseLanguage);
        }

        setLesson(data.lesson);
        setNavigation(data.navigation);
        if (data.progress?.totalDays != null) setTotalDays(data.progress.totalDays);
        setQuizPolicy(data.quizPolicy ?? null);
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
        setLesson(null);
        setAccessIssue(resolveCourseAccessIssue(response.status, data, errorLanguage, 'lesson'));
      }
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
      setLesson(null);
      setAccessIssue(resolveCourseAccessIssue(0, {}, errorLanguage, 'lesson'));
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

  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (!session?.user || !courseId || !dayNumber) return;
      try {
        const response = await fetch(
          `/api/saved-lessons?courseId=${encodeURIComponent(courseId)}&lessonDay=${dayNumber}`,
          { cache: 'no-store' }
        );
        if (!response.ok) return;
        const data = await response.json();
        setIsSavedLesson(data.isSaved === true);
      } catch (error) {
        console.error('Failed to fetch saved lesson status:', error);
      }
    };

    void fetchSavedStatus();
  }, [courseId, dayNumber, session?.user]);

  const handleComplete = async () => {
    if (!lesson || completing) return;

    const quizEnabled = quizPolicy?.enabled ?? lesson.quizConfig?.enabled ?? false;
    const quizRequired = quizPolicy?.required ?? lesson.quizConfig?.required ?? false;
    if (quizEnabled && quizRequired && !quizPassed) {
      notifications.show({
        color: 'yellow',
        title: getDayPageText('mustPassQuiz', courseLanguage),
        message: getDayPageText('mustPassQuiz', courseLanguage),
      });
      return;
    }

    setCompleting(true);
    try {
      const practiceContext = readPracticeContextFromSearchParams(searchParams);
      const response = await fetch(`/api/courses/${courseId}/day/${dayNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          practiceContext ? { practiceContext } : {}
        ),
      });

      const data = await response.json();

      if (data.success) {
        trackGAEvent('lesson_complete', { course_id: courseId, day_number: dayNumber });
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

        if (practiceContext) {
          await fetch('/api/practice-hub/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              practiceContext,
              trigger: 'lesson_completed',
            }),
          });
        }
      } else {
        notifications.show({
          color: 'red',
          title: getDayPageText('failedToComplete', courseLanguage),
          message: data.error || getDayPageText('failedToComplete', courseLanguage),
        });
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      notifications.show({
        color: 'red',
        title: getDayPageText('failedToComplete', courseLanguage),
        message: getDayPageText('failedToComplete', courseLanguage),
      });
    } finally {
      setCompleting(false);
    }
  };

  const handleToggleSavedLesson = async () => {
    if (!lesson?.lessonId || !courseId || !dayNumber || savingLesson) return;

    setSavingLesson(true);
    try {
      const response = await fetch('/api/saved-lessons', {
        method: isSavedLesson ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          lessonDay: dayNumber,
          lessonId: lesson.lessonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update saved lesson');
      }

      const data = await response.json();
      setIsSavedLesson(data.saved === true);
    } catch (error) {
      console.error('Failed to update saved lesson:', error);
    } finally {
      setSavingLesson(false);
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
    const displayLang = courseLanguage !== 'en' ? courseLanguage : (locale || 'en');
    const dir = (displayLang === 'ar' ? 'rtl' : 'ltr') as 'rtl' | 'ltr';
    return (
      <Box bg="ink.9" mih="100vh" py="xl" dir={dir}>
        <Container size="md">
          <Card padding="lg">
            <Stack gap="md">
              <Text fw={700}>{getDayPageText('loadingLesson', displayLang)}</Text>
              <Skeleton height={32} width="70%" />
              <Skeleton height={18} />
              <Skeleton height={18} />
              <Skeleton height={18} width="85%" />
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  if (!lesson) {
    // Use URL locale as fallback so /hu/ always shows Hungarian message (courseLanguage may still be initial 'en')
    const displayLang = courseLanguage !== 'en' ? courseLanguage : (locale || 'en');
    const dir = (displayLang === 'ar' ? 'rtl' : 'ltr') as 'rtl' | 'ltr';
    const issue = accessIssue ?? resolveCourseAccessIssue(0, {}, displayLang, 'lesson');
    return (
      <Box bg="ink.9" mih="100vh" py="xl" dir={dir}>
        <Container size="sm">
          <Card padding="lg">
            <Stack gap="md">
              <Alert
                color={issue.status === 401 ? 'yellow' : 'red'}
                variant="light"
                title={issue.title}
                icon={issue.status === 401 ? <IconLock size={18} /> : <IconAlertTriangle size={18} />}
              >
                <Text>{issue.message}</Text>
              </Alert>
              <CourseAccessRecoveryActions
                issue={issue}
                courseId={courseId}
                courseLanguage={courseLanguage || displayLang}
                onRetry={() => void fetchLesson(courseId, dayNumber, { fallbackLanguage: displayLang })}
                signInHref={`/auth/signin?callbackUrl=${encodeURIComponent(`/${courseLanguage || displayLang}/courses/${courseId}/day/${dayNumber}`)}`}
                backLabel={getDayPageText('backToCourse', displayLang)}
              />
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  const effectiveQuizPolicy: QuizPolicy | null = quizPolicy ?? (
    lesson.quizConfig
      ? {
          enabled: lesson.quizConfig.enabled,
          required: lesson.quizConfig.required,
          questionCount: lesson.quizConfig.questionCount,
          successThreshold: lesson.quizConfig.successThreshold,
          availableQuestionCount: lesson.quizConfig.poolSize,
        }
      : null
  );
  const isQuizEnabled = effectiveQuizPolicy?.enabled === true;
  const isQuizRequired = effectiveQuizPolicy?.required === true;
  const effectiveQuestionCount = effectiveQuizPolicy?.questionCount ?? 5;
  const quizMaxWrongAllowed = effectiveQuizPolicy?.maxWrongAllowed;
  const hasMaxWrongRule =
    typeof quizMaxWrongAllowed === 'number' && quizMaxWrongAllowed >= 0;
  const courseLanguageBase = courseLanguage.toLowerCase().split('-')[0];
  const showMaxWrongMessageByLanguage = ['hu', 'en', 'ru', 'sw'].includes(courseLanguageBase);
  const quizRequiredMessage = hasMaxWrongRule && showMaxWrongMessageByLanguage
    ? getDayPageText('quizRequiredMaxWrongMessage', courseLanguageBase, {
        maxWrong: quizMaxWrongAllowed,
        count: effectiveQuestionCount,
      })
    : getDayPageText('quizRequiredMessage', courseLanguage, {
        count: effectiveQuestionCount,
      });
  const lessonProgressValue = Math.min(100, (lesson.dayNumber / Math.max(totalDays, 1)) * 100);
  const playerId = (session?.user as { id?: string; playerId?: string } | undefined)?.playerId
    ?? (session?.user as { id?: string } | undefined)?.id
    ?? null;

  const handleStartAssessment = async () => {
    try {
      const sessionResponse = await fetch('/api/game-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: session?.user?.id,
          gameId: lesson.assessmentGameId,
          courseId,
          lessonDay: dayNumber,
        }),
      });

      const sessionData = await sessionResponse.json();

      if (sessionData.success && lesson.assessmentGameRoute) {
        router.push(`${lesson.assessmentGameRoute}?sessionId=${sessionData.sessionId}&courseId=${courseId}&lessonDay=${dayNumber}&assessment=true`);
        return;
      }

      notifications.show({
        color: 'red',
        title: getDayPageText('failedToStartAssessment', courseLanguage),
        message: getDayPageText('failedToStartAssessment', courseLanguage),
      });
    } catch (error) {
      console.error('Failed to start assessment:', error);
      notifications.show({
        color: 'red',
        title: getDayPageText('failedToStartAssessment', courseLanguage),
        message: getDayPageText('failedToStartAssessment', courseLanguage),
      });
    }
  };

  return (
    <Box bg="ink.9" mih="100vh" pb="xl" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="lg" py={{ base: 'md', sm: 'lg' }}>
          <Group justify="space-between" align="center" gap="md">
            <Group gap="md" wrap="nowrap" miw={0}>
              <Logo size="sm" showText={false} linkTo={session?.user ? "/dashboard" : "/"} />
              <Button
                component={LocaleLink}
                href={`/${courseLanguage}/courses/${courseId}`}
                variant="subtle"
                color="gray"
                leftSection={<IconArrowLeft size={18} />}
              >
                {getDayPageText('backToCourse', courseLanguage)}
              </Button>
            </Group>
            <Stack gap={4} align="flex-end" miw={120}>
              <Text fw={700} c="white" size="sm">
                {getDayPageText('dayNumber', courseLanguage, { day: lesson.dayNumber })} / {totalDays}
              </Text>
              <Progress value={lessonProgressValue} color="amanoba" w={{ base: 96, sm: 128 }} size="sm" radius="xl" />
            </Stack>
          </Group>
        </Container>
      </Paper>

      <Container component="main" size="lg" py={{ base: 'lg', sm: 'xl' }}>
        <Stack gap="lg">
          <Card padding="xl" radius="md" withBorder>
            <Stack gap="md">
              <Group align="flex-start" gap="sm" wrap="nowrap">
                {lesson.isCompleted ? (
                  <ThemeIcon color="green" variant="light" radius="xl">
                    <IconCircleCheck size={20} />
                  </ThemeIcon>
                ) : !lesson.isUnlocked ? (
                  <ThemeIcon color="gray" variant="light" radius="xl">
                    <IconLock size={20} />
                  </ThemeIcon>
                ) : null}
                <Title order={1} size="h2" className="break-words">{lesson.title}</Title>
              </Group>

          {lesson.isUnlocked && (
                <Group gap="xs">
                  <Badge color="gray" variant="light" leftSection={<IconAward size={14} />}>
                    {lesson.pointsReward} {getDayPageText('points', courseLanguage)}
                  </Badge>
                  <Badge color="gray" variant="light" leftSection={<IconAward size={14} />}>
                    {lesson.xpReward} {getDayPageText('xp', courseLanguage)}
                  </Badge>
                </Group>
          )}

              {!lesson.isUnlocked ? (
                <Alert color="gray" icon={<IconLock size={18} />} radius="md">
                  {getDayPageText('completePreviousLessons', courseLanguage)}
                </Alert>
              ) : null}

          {lesson.isUnlocked && session?.user ? (
                <Button
                onClick={handleToggleSavedLesson}
                  loading={savingLesson}
                  variant="outline"
                  color="amanoba"
                  leftSection={isSavedLesson ? <IconBookmarkFilled size={18} /> : <IconBookmark size={18} />}
              >
                  {savingLesson
                    ? getDayPageText('savingLesson', courseLanguage)
                    : isSavedLesson
                    ? getDayPageText('removeSavedLesson', courseLanguage)
                    : getDayPageText('saveLesson', courseLanguage)}
                </Button>
          ) : null}
            </Stack>
          </Card>

        {lesson.isUnlocked ? (
          <>
            <Card padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm">
                  {navigation?.previous && (
                    <Button
                      component={LocaleLink}
                      href={`/${courseLanguage}/courses/${courseId}/day/${navigation.previous.day}`}
                      variant="default"
                      leftSection={<IconArrowLeft size={18} />}
                      fullWidth
                    >
                      {getDayPageText('previousDay', courseLanguage)}
                    </Button>
                  )}

                  <Stack gap="xs">
                    {isQuizEnabled && !lesson.isCompleted ? (
                      <Button
                        component={LocaleLink}
                        href={`/${courseLanguage}/courses/${courseId}/day/${dayNumber}/quiz`}
                        color={isQuizRequired && !quizPassed ? 'amanoba' : 'gray'}
                        variant={isQuizRequired && !quizPassed ? 'filled' : 'outline'}
                        fullWidth
                      >
                        {getDayPageText('takeQuiz', courseLanguage)}
                      </Button>
                    ) : null}

                    {!lesson.isCompleted && !(isQuizEnabled && isQuizRequired && !quizPassed) ? (
                      <Button
                        onClick={handleComplete}
                        loading={completing}
                        color="amanoba"
                        leftSection={<IconCircleCheck size={18} />}
                        fullWidth
                      >
                        {completing ? getDayPageText('completing', courseLanguage) : getDayPageText('markAsComplete', courseLanguage)}
                      </Button>
                    ) : null}

                    {lesson.isCompleted ? (
                      <Button color="green" leftSection={<IconCircleCheck size={18} />} fullWidth>
                        {getDayPageText('completed', courseLanguage)}
                      </Button>
                    ) : null}
                  </Stack>

                  {navigation?.next ? (
                    <Button
                      component={LocaleLink}
                      href={`/${courseLanguage}/courses/${courseId}/day/${navigation.next.day}`}
                      color="amanoba"
                      rightSection={<IconArrowRight size={18} />}
                      fullWidth
                    >
                      {getDayPageText('nextDay', courseLanguage)}
                    </Button>
                  ) : null}
                </SimpleGrid>

              {isQuizEnabled && isQuizRequired && !quizPassed && (
                  <Alert color="amanoba" radius="md">
                    {quizRequiredMessage}
                  </Alert>
              )}
              </Stack>
            </Card>

            <Card padding="xl" radius="md" withBorder>
              <TypographyStylesProvider
                className="lesson-prose lesson-prose-dark"
                dangerouslySetInnerHTML={{ __html: contentToHtml(lesson.content, { stripFirstH1: true }) }}
              />
              <Divider my="lg" />
              <ContentVoteWidget
                targetType="lesson"
                targetId={lesson._id}
                playerId={playerId}
                label="Was this lesson helpful?"
              />
            </Card>

            {lesson.assessmentGameId && lesson.isCompleted && (
              <Card padding="xl" radius="md" withBorder>
                <Stack gap="md">
                  <Group gap="sm">
                    <ThemeIcon color="amanoba" variant="light" radius="md">
                      <IconDeviceGamepad2 size={20} />
                    </ThemeIcon>
                    <Title order={2} size="h3">{getDayPageText('testYourKnowledge', courseLanguage)}</Title>
                  </Group>
                  <Text c="dimmed">{getDayPageText('assessmentDescription', courseLanguage)}</Text>
                {lesson.assessmentGameRoute ? (
                    <Button
                      component={LocaleLink}
                    href={`${lesson.assessmentGameRoute}?courseId=${courseId}&lessonDay=${dayNumber}&assessment=true`}
                      color="amanoba"
                      leftSection={<IconDeviceGamepad2 size={18} />}
                  >
                    {getDayPageText('playAssessment', courseLanguage)}
                    </Button>
                ) : (
                    <Button
                      onClick={handleStartAssessment}
                      color="amanoba"
                      leftSection={<IconDeviceGamepad2 size={18} />}
                  >
                    {getDayPageText('playAssessment', courseLanguage)}
                    </Button>
                )}
                </Stack>
              </Card>
            )}
          </>
        ) : (
          <Card bg="ink.8" padding="xl" radius="md" withBorder>
            <Stack gap="md" align="center">
              <ThemeIcon color="gray" variant="light" size={72} radius="xl">
                <IconLock size={38} />
              </ThemeIcon>
              <Title order={2} c="white" size="h3">{getDayPageText('lessonLocked', courseLanguage)}</Title>
              <Text c="gray.3" ta="center">
              {getDayPageText('completePreviousLessons', courseLanguage)}
              </Text>
              {navigation?.previous && (
                <Button
                  component={LocaleLink}
                  href={`/${courseLanguage}/courses/${courseId}/day/${navigation.previous.day}`}
                  color="amanoba"
                >
                  {getDayPageText('goToDay', courseLanguage, { day: navigation.previous.day })}
                </Button>
              )}
            </Stack>
          </Card>
        )}
        </Stack>
      </Container>
    </Box>
  );
}
