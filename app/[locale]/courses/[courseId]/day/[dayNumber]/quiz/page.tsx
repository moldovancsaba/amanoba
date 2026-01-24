/**
 * Lesson Quiz Page (one question at a time, supportive flow)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import { useSession } from 'next-auth/react';
import { useCourseTranslations } from '@/app/lib/hooks/useCourseTranslations';

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

interface Question {
  id: string;
  question: string;
  options: string[];
}

export default function LessonQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; dayNumber: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const [courseId, setCourseId] = useState<string>('');
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
  const [courseLanguage, setCourseLanguage] = useState<string | undefined>(undefined);
  
  // Use course language for translations instead of URL locale
  const { t, courseLocale } = useCourseTranslations(courseLanguage, locale);

  useEffect(() => {
    const init = async () => {
      const resolved = await params;
      const cid = resolved.courseId;
      const day = parseInt(resolved.dayNumber);
      
      setCourseId(cid);
      setDayNumber(day);
      await loadLessonAndQuestions(cid, day);
    };
    init();
  }, [params]);

  const loadLessonAndQuestions = async (cid: string, day: number) => {
    try {
      setLoading(true);
      setError(null);
      const lessonRes = await fetch(`/api/courses/${cid}/day/${day}`, { cache: 'no-store' });
      const lessonData: LessonResponse & { courseLanguage?: string } = await lessonRes.json();
      if (!lessonData.success || !lessonData.lesson) {
        setError(lessonData.error || t('failedToLoadLesson'));
        return;
      }

      // Store course language for UI translations (no redirect needed)
      if (lessonData.courseLanguage) {
        setCourseLanguage(lessonData.courseLanguage);
      }

      setLessonId(lessonData.lesson.lessonId);
      setLessonTitle(lessonData.lesson.title);

      const count = lessonData.lesson.quizConfig?.questionCount || 5;
      const qRes = await fetch(
        `/api/games/quizzz/questions?lessonId=${lessonData.lesson.lessonId}&courseId=${cid}&count=${count}&t=${Date.now()}`,
        { cache: 'no-store' }
      );
      const qData = await qRes.json();
      if (qData.ok && qData.data?.questions?.length) {
        setQuestions(qData.data.questions);
        setCurrentIndex(0);
      } else {
        setError(qData.error?.message || t('quizError'));
      }
    } catch (err) {
      console.error(err);
      setError(t('quizError'));
    } finally {
      setLoading(false);
    }
  };

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
          setError(t('someQuestionsNotFound', { defaultValue: 'Néhány kérdés nem található. Kérjük, próbáld meg újra.' }));
        } else {
          setError(data.error || t('quizError'));
        }
        setAnswering(false);
        return;
      }

      const result = data.results?.[0];
      const isCorrect = result?.isCorrect;
      setIsAnswerCorrect(isCorrect);
      if (isCorrect) {
        setFeedback(t('quizCorrect', { defaultValue: 'Helyes válasz, szép munka! 🚀' }));
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
        setFeedback(
          t('quizSupportiveRetry', {
            defaultValue: 'Most nem talált. Nézzük át újra a leckét, utána próbáld meg ismét.',
          })
        );
        if (lessonId) {
          // Include player ID in key to make it user-specific
          const user = session?.user as { id?: string; playerId?: string } | undefined;
          const playerId = user?.playerId || user?.id;
          const key = playerId 
            ? `quiz-passed-${playerId}-${courseId}-${lessonId}`
            : `quiz-passed-${courseId}-${lessonId}`;
          localStorage.removeItem(key);
        }
        setTimeout(() => {
          router.replace(`/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}?quizRetry=1`);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setError(t('quizError'));
    } finally {
      setAnswering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center" dir={courseLocale === 'ar' ? 'rtl' : 'ltr'}>
        <Loader2 className="w-8 h-8 text-brand-white animate-spin" />
      </div>
    );
  }

  if (error || !currentQuestion) {
    // Show translated error message
    let errorMessage = error || t('quizError');
    if (error && (error.includes('Some questions not found') || error.includes('someQuestionsNotFound'))) {
      errorMessage = t('someQuestionsNotFound');
    }
    
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4" dir={courseLocale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent max-w-lg w-full text-center">
          <p className="text-brand-black mb-6">{errorMessage}</p>
          <LocaleLink
            href={`/courses/${courseId}/day/${dayNumber}`}
            className="inline-flex items-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('backToLesson')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  const progressText = t('questionProgress', {
    current: currentIndex + 1,
    total: questions.length,
    defaultValue: `${currentIndex + 1}/${questions.length}`,
  });

  return (
    <div className="min-h-screen bg-brand-black" dir={courseLocale === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" showText={false} linkTo={session?.user ? "/dashboard" : "/"} className="flex-shrink-0" />
            <LocaleLink
              href={`/courses/${courseId}/day/${dayNumber}`}
              className="inline-flex items-center gap-2 text-brand-white hover:text-brand-accent"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('backToLesson')}
            </LocaleLink>
          </div>
          <div className="text-brand-white text-sm">
            {t('lessonQuiz', { defaultValue: 'Kvíz' })}: {lessonTitle || t('quiz')}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-brand-black leading-tight">
              {t('question', { defaultValue: 'Kérdés' })} {currentIndex + 1}
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
                className={`w-full ${courseLocale === 'ar' ? 'text-right' : 'text-left'} border-2 border-brand-darkGrey/15 hover:border-brand-accent transition-colors rounded-xl px-5 py-4 font-semibold text-brand-black text-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
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
