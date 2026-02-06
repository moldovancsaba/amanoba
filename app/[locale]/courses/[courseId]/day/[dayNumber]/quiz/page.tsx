/**
 * Lesson Quiz Page (one question at a time, supportive flow)
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import { useSession } from 'next-auth/react';

interface LessonResponse {
  success: boolean;
  lesson?: {
    lessonId: string;
    title: string;
    quizConfig?: {
      enabled: boolean;
      questionCount: number;
    };
  };
  error?: string;
}

type LessonDayApiResponse = LessonResponse & {
  courseLanguage?: string;
  quizMaxWrongAllowed?: number;
  defaultLessonQuizQuestionCount?: number;
};

interface Question {
  id: string;
  question: string;
  options: string[];
}

// Static translations for quiz page - keyed by COURSE LANGUAGE
const quizPageTranslations: Record<string, Record<string, string>> = {
  ar: {
    failedToLoadLesson: 'فشل تحميل الدرس',
    quizError: 'حدث خطأ في الاختبار',
    noQuizQuestions: 'لا توجد أسئلة متاحة لهذا الدرس. قد لا تكون الأسئلة جاهزة بعد لهذا المساق.',
    someQuestionsNotFound: 'بعض الأسئلة غير موجودة. حاول مرة أخرى.',
    quizCorrect: 'إجابة صحيحة، أحسنت! 🚀',
    quizSupportiveRetry: 'إجابة غير صحيحة. حاول مرة أخرى!',
    backToLesson: 'العودة إلى الدرس',
    questionProgress: 'السؤال {{current}} / {{total}}',
    lessonQuiz: 'اختبار الدرس',
    quiz: 'اختبار',
    question: 'سؤال',
  },
  hu: {
    failedToLoadLesson: 'Nem sikerült betölteni a leckét',
    quizError: 'Hiba történt a kérdések betöltésekor.',
    noQuizQuestions: 'Nincs elérhető értékelési kérdés ehhez a leckéhez. A kurzus kérdései még nem készültek el.',
    someQuestionsNotFound: 'Néhány kérdés nem található. Kérjük, próbáld meg újra.',
    quizCorrect: 'Helyes válasz, szép munka! 🚀',
    quizSupportiveRetry: 'Most nem talált. Nézzük át újra a leckét, aztán próbáld meg ismét.',
    backToLesson: 'Vissza a leckéhez',
    questionProgress: 'Kérdés: {{current}} / {{total}}',
    lessonQuiz: 'Lecke értékelés',
    quiz: 'Kvíz',
    question: 'Kérdés',
  },
  en: {
    failedToLoadLesson: 'Failed to load lesson',
    quizError: 'An error occurred while loading questions.',
    noQuizQuestions: 'No questions available for this lesson. Questions may not be ready yet for this course.',
    someQuestionsNotFound: 'Some questions not found. Please try again.',
    quizCorrect: 'Correct. Well done.',
    quizSupportiveRetry: 'Not quite. Let\'s review the lesson, then try again.',
    backToLesson: 'Back to lesson',
    questionProgress: 'Question {{current}} / {{total}}',
    lessonQuiz: 'Lesson Quiz',
    quiz: 'Quiz',
    question: 'Question',
  },
  ru: {
    failedToLoadLesson: 'Не удалось загрузить урок',
    quizError: 'Ошибка загрузки вопросов.',
    noQuizQuestions: 'Нет вопросов для этого урока. Вопросы по курсу могут быть ещё не готовы.',
    someQuestionsNotFound: 'Некоторые вопросы не найдены. Попробуйте снова.',
    quizCorrect: 'Верно. Отлично!',
    quizSupportiveRetry: 'Не совсем. Давайте вернемся к уроку и попробуем снова.',
    backToLesson: 'Назад к уроку',
    questionProgress: 'Вопрос {{current}} / {{total}}',
    lessonQuiz: 'Квиз к уроку',
    quiz: 'Квиз',
    question: 'Вопрос',
  },
  pt: {
    failedToLoadLesson: 'Falha ao carregar a aula',
    quizError: 'Erro no questionário',
    noQuizQuestions: 'Nenhuma pergunta disponível para esta aula. As perguntas do curso podem ainda não estar prontas.',
    someQuestionsNotFound: 'Algumas perguntas não foram encontradas. Tente novamente.',
    quizCorrect: 'Resposta correta, ótimo trabalho! 🚀',
    quizSupportiveRetry: 'Resposta incorreta. Tente novamente!',
    backToLesson: 'Voltar à aula',
    questionProgress: 'Pergunta {{current}} / {{total}}',
    lessonQuiz: 'Questionário da aula',
    quiz: 'Questionário',
    question: 'Pergunta',
  },
  vi: {
    failedToLoadLesson: 'Không thể tải bài học',
    quizError: 'Lỗi bài kiểm tra',
    noQuizQuestions: 'Không có câu hỏi cho bài học này. Câu hỏi của khóa học có thể chưa sẵn sàng.',
    someQuestionsNotFound: 'Một số câu hỏi không tìm thấy. Vui lòng thử lại.',
    quizCorrect: 'Câu trả lời đúng, làm tốt! 🚀',
    quizSupportiveRetry: 'Câu trả lời chưa đúng. Hãy thử lại!',
    backToLesson: 'Quay lại bài học',
    questionProgress: 'Câu hỏi {{current}} / {{total}}',
    lessonQuiz: 'Bài kiểm tra bài học',
    quiz: 'Bài kiểm tra',
    question: 'Câu hỏi',
  },
  id: {
    failedToLoadLesson: 'Gagal memuat pelajaran',
    quizError: 'Terjadi kesalahan kuis',
    noQuizQuestions: 'Tidak ada pertanyaan tersedia untuk pelajaran ini. Pertanyaan kursus mungkin belum siap.',
    someQuestionsNotFound: 'Beberapa pertanyaan tidak ditemukan. Silakan coba lagi.',
    quizCorrect: 'Jawaban benar, kerja bagus! 🚀',
    quizSupportiveRetry: 'Jawaban salah. Coba lagi!',
    backToLesson: 'Kembali ke pelajaran',
    questionProgress: 'Pertanyaan {{current}} / {{total}}',
    lessonQuiz: 'Kuis pelajaran',
    quiz: 'Kuis',
    question: 'Pertanyaan',
  },
  hi: {
    failedToLoadLesson: 'पाठ लोड नहीं हो सका',
    quizError: 'प्रश्नोत्तरी त्रुटि',
    noQuizQuestions: 'इस पाठ के लिए कोई प्रश्न उपलब्ध नहीं। इस पाठ्यक्रम के प्रश्न अभी तैयार नहीं हो सकते।',
    someQuestionsNotFound: 'कुछ प्रश्न नहीं मिले। कृपया फिर से प्रयास करें।',
    quizCorrect: 'सही उत्तर, बढ़िया काम! 🚀',
    quizSupportiveRetry: 'गलत उत्तर। फिर से प्रयास करें!',
    backToLesson: 'पाठ पर वापस जाएँ',
    questionProgress: 'प्रश्न {{current}} / {{total}}',
    lessonQuiz: 'पाठ प्रश्नोत्तरी',
    quiz: 'प्रश्नोत्तरी',
    question: 'प्रश्न',
  },
  tr: {
    failedToLoadLesson: 'Ders yüklenemedi',
    quizError: 'Sınav hatası',
    noQuizQuestions: 'Bu ders için soru bulunmuyor. Kurs soruları henüz hazır olmayabilir.',
    someQuestionsNotFound: 'Bazı sorular bulunamadı. Lütfen tekrar deneyin.',
    quizCorrect: 'Doğru cevap, harika iş! 🚀',
    quizSupportiveRetry: 'Yanlış cevap. Tekrar deneyin!',
    backToLesson: 'Derse dön',
    questionProgress: 'Soru {{current}} / {{total}}',
    lessonQuiz: 'Ders sınavı',
    quiz: 'Sınav',
    question: 'Soru',
  },
  bg: {
    failedToLoadLesson: 'Неуспешно зареждане на урока',
    quizError: 'Грешка в теста',
    noQuizQuestions: 'Няма налични въпроси за този урок. Въпросите за курса може още да не са готови.',
    someQuestionsNotFound: 'Някои въпроси не са намерени. Моля, опитайте отново.',
    quizCorrect: 'Правилен отговор, браво! 🚀',
    quizSupportiveRetry: 'Грешен отговор. Опитайте отново!',
    backToLesson: 'Назад към урока',
    questionProgress: 'Въпрос {{current}} / {{total}}',
    lessonQuiz: 'Тест за урока',
    quiz: 'Тест',
    question: 'Въпрос',
  },
  pl: {
    failedToLoadLesson: 'Nie udało się załadować lekcji',
    quizError: 'Błąd quizu',
    noQuizQuestions: 'Brak pytań do tej lekcji. Pytania do kursu mogą nie być jeszcze gotowe.',
    someQuestionsNotFound: 'Nie znaleziono niektórych pytań. Spróbuj ponownie.',
    quizCorrect: 'Poprawna odpowiedź, świetna robota! 🚀',
    quizSupportiveRetry: 'Niepoprawna odpowiedź. Spróbuj ponownie!',
    backToLesson: 'Wróć do lekcji',
    questionProgress: 'Pytanie {{current}} / {{total}}',
    lessonQuiz: 'Quiz lekcji',
    quiz: 'Quiz',
    question: 'Pytanie',
  },
};

// Helper to get translation by course language
const getQuizPageText = (key: string, courseLang: string, params?: Record<string, string | number>): string => {
  const lang = courseLang || 'en';
  const translations = quizPageTranslations[lang] || quizPageTranslations.en;
  let text = translations[key] || quizPageTranslations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, String(v));
    });
  }
  return text;
};

export default function LessonQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; dayNumber: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const [courseId, setCourseId] = useState<string>('');
  const [courseLanguage, setCourseLanguage] = useState<string>('en');
  const [dayNumber, setDayNumber] = useState<number>(0);
  const [lessonId, setLessonId] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizMaxWrongAllowed, setQuizMaxWrongAllowed] = useState<number | undefined>(undefined);
  const [wrongCount, setWrongCount] = useState(0);

  const loadLessonAndQuestions = useCallback(async (cid: string, day: number, fallbackLanguage: string) => {
    try {
      setLoading(true);
      setError(null);
      const lessonRes = await fetch(`/api/courses/${cid}/day/${day}`, { cache: 'no-store' });
      const lessonData = (await lessonRes.json()) as LessonDayApiResponse;
      const apiLanguage = lessonData.courseLanguage || fallbackLanguage;

      // Get course language from API response FIRST
      if (lessonData.courseLanguage) setCourseLanguage(lessonData.courseLanguage);
      
      if (!lessonData.success || !lessonData.lesson) {
        setError(lessonData.error || getQuizPageText('failedToLoadLesson', apiLanguage));
        return;
      }
      
      setLessonId(lessonData.lesson.lessonId);
      setLessonTitle(lessonData.lesson.title);
      setQuizMaxWrongAllowed(lessonData.quizMaxWrongAllowed);
      setWrongCount(0);

      const count = lessonData.lesson.quizConfig?.questionCount ?? lessonData.defaultLessonQuizQuestionCount ?? 5;
      const qRes = await fetch(
        `/api/games/quizzz/questions?lessonId=${lessonData.lesson.lessonId}&courseId=${cid}&count=${count}&t=${Date.now()}`,
        { cache: 'no-store' }
      );
      const qData = await qRes.json();
      if (qData.ok && qData.data?.questions?.length) {
        setQuestions(qData.data.questions);
        setCurrentIndex(0);
      } else {
        setError(qData.error?.code === 'NO_QUESTIONS' ? getQuizPageText('noQuizQuestions', apiLanguage) : (qData.error?.message || getQuizPageText('quizError', apiLanguage)));
      }
    } catch (err) {
      console.error(err);
      setError(getQuizPageText('quizError', fallbackLanguage));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const resolved = await params;
      const cid = resolved.courseId;
      const day = parseInt(resolved.dayNumber);
      
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
      
      await loadLessonAndQuestions(cid, day, fallbackLanguage);
    };
    init();
  }, [loadLessonAndQuestions, params]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = async (option: string, optionIndex: number) => {
    if (!currentQuestion || answering) return;
    setAnswering(true);
    setFeedback(null);
    setIsAnswerCorrect(null);
    try {
      const res = await fetch(
        `/api/courses/${courseId}/lessons/${lessonId}/quiz/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: [
              {
                questionId: currentQuestion.id,
                selectedIndex: optionIndex,
                selectedOption: option,
              },
            ],
          }),
        }
      );
      const data = await res.json();
      if (!data.success) {
        // Handle specific error codes with translated messages
        if (data.errorCode === 'QUESTIONS_NOT_FOUND') {
          setError(getQuizPageText('someQuestionsNotFound', courseLanguage));
        } else {
          setError(data.error || getQuizPageText('quizError', courseLanguage));
        }
        setAnswering(false);
        return;
      }

      const result = data.results?.[0];
      const isCorrect = result?.isCorrect;
      setIsAnswerCorrect(isCorrect);
      if (isCorrect) {
        setFeedback(getQuizPageText('quizCorrect', courseLanguage));
        const nextIndex = currentIndex + 1;
        if (nextIndex >= questions.length) {
          // Quiz finished; mark passed locally
          // Include player ID in key to make it user-specific
          if (lessonId) {
            const user = session?.user as { id?: string; playerId?: string } | undefined;
            const playerId = user?.playerId || user?.id;
            const key = playerId 
              ? `quiz-passed-${playerId}-${courseId}-${lessonId}`
              : `quiz-passed-${courseId}-${lessonId}`;
            localStorage.setItem(key, 'true');
          }
          setTimeout(() => {
            router.replace(`/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}?quiz=passed`);
          }, 900);
        } else {
          setTimeout(() => {
            setFeedback(null);
            setIsAnswerCorrect(null);
            setCurrentIndex(nextIndex);
          }, 700);
        }
      } else {
        const newWrongCount = wrongCount + 1;
        setWrongCount(newWrongCount);
        setFeedback(getQuizPageText('quizSupportiveRetry', courseLanguage));
        if (lessonId) {
          const user = session?.user as { id?: string; playerId?: string } | undefined;
          const playerId = user?.playerId || user?.id;
          const key = playerId 
            ? `quiz-passed-${playerId}-${courseId}-${lessonId}`
            : `quiz-passed-${courseId}-${lessonId}`;
          localStorage.removeItem(key);
        }
        // Only redirect when wrong count exceeds course limit (e.g. 3 wrong allowed → fail on 4th)
        const maxWrong = quizMaxWrongAllowed;
        if (typeof maxWrong === 'number' && newWrongCount > maxWrong) {
          setTimeout(() => {
            router.replace(`/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}?quizRetry=1`);
          }, 1200);
        } else {
          // Stay in quiz and go to next question
          const nextIndex = currentIndex + 1;
          if (nextIndex >= questions.length) {
            setTimeout(() => {
              router.replace(`/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}?quizRetry=1`);
            }, 1200);
          } else {
            setTimeout(() => {
              setFeedback(null);
              setIsAnswerCorrect(null);
              setCurrentIndex(nextIndex);
            }, 1200);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(getQuizPageText('quizError', courseLanguage));
    } finally {
      setAnswering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Loader2 className="w-8 h-8 text-brand-white animate-spin" />
      </div>
    );
  }

  if (error || !currentQuestion) {
    // Show translated error message
    let errorMessage = error || getQuizPageText('quizError', courseLanguage);
    if (error && (error.includes('Some questions not found') || error.includes('someQuestionsNotFound'))) {
      errorMessage = getQuizPageText('someQuestionsNotFound', courseLanguage);
    }
    
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent max-w-lg w-full text-center">
          <p className="text-brand-black mb-6">{errorMessage}</p>
          <LocaleLink
            href={`/${courseLanguage}/courses/${courseId}/day/${dayNumber}`}
            className="inline-flex items-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {getQuizPageText('backToLesson', courseLanguage)}
          </LocaleLink>
        </div>
      </div>
    );
  }

  const progressText = getQuizPageText('questionProgress', courseLanguage, {
    current: currentIndex + 1,
    total: questions.length,
  });

  return (
    <div className="min-h-screen bg-brand-black" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" showText={false} linkTo={session?.user ? "/dashboard" : "/"} className="flex-shrink-0" />
            <LocaleLink
              href={`/${courseLanguage}/courses/${courseId}/day/${dayNumber}`}
              className="inline-flex items-center gap-2 text-brand-white hover:text-brand-accent"
            >
              <ArrowLeft className="w-5 h-5" />
              {getQuizPageText('backToLesson', courseLanguage)}
            </LocaleLink>
          </div>
          <div className="text-brand-white text-sm">
            {getQuizPageText('lessonQuiz', courseLanguage)}: {lessonTitle || getQuizPageText('quiz', courseLanguage)}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-brand-black leading-tight">
              {getQuizPageText('question', courseLanguage)} {currentIndex + 1}
            </h1>
            <span className="text-base font-semibold text-brand-darkGrey">{progressText}</span>
          </div>
          <p className="text-xl text-brand-black mb-8 leading-relaxed">{currentQuestion.question}</p>

          <div className="space-y-4">
            {currentQuestion.options.map((option: string, idx: number) => (
              <button
                key={idx}
                disabled={answering}
                onClick={() => handleAnswer(option, idx)}
                className={`w-full ${courseLanguage === 'ar' ? 'text-right' : 'text-left'} border-2 border-brand-darkGrey/15 hover:border-brand-accent transition-colors rounded-xl px-5 py-4 font-semibold text-brand-black text-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`mt-8 flex items-center gap-3 font-semibold rounded-lg px-5 py-4 ${
              isAnswerCorrect === true
                ? 'bg-green-500/15 border border-green-500 text-green-700'
                : isAnswerCorrect === false
                ? 'bg-red-500/15 border border-red-500 text-red-700'
                : 'bg-brand-accent/15 border border-brand-accent text-brand-black'
            }`}>
              {isAnswerCorrect === true ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : isAnswerCorrect === false ? (
                <XCircle className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-brand-accent" />
              )}
              <span>{feedback}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
