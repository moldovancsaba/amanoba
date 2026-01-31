/**
 * Onboarding Survey Page
 * 
 * What: Multi-step survey form for new users
 * Why: Collects user preferences for personalized course recommendations
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { trackGAEvent } from '@/app/lib/analytics/ga-events';

interface SurveyQuestion {
  questionId: string;
  type: string;
  question: string;
  description?: string;
  options?: Array<{
    value: string;
    label: string;
    metadata?: Record<string, unknown>;
  }>;
  required: boolean;
  order: number;
  metadata?: {
    category?: string;
    min?: number;
    max?: number;
  };
}

interface Survey {
  surveyId: string;
  name: string;
  description?: string;
  questions: SurveyQuestion[];
  metadata?: {
    completionMessage?: string;
    redirectUrl?: string;
  };
  alreadyCompleted: boolean;
}

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');
  const tOnboarding = useTranslations('onboarding');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin?callbackUrl=/${locale}/onboarding`);
      return;
    }
    fetchSurvey();
  }, [session, status, router, locale]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/surveys/onboarding');
      const data = await response.json();

      if (data.success) {
        if (data.survey.alreadyCompleted) {
          // Already completed - don't redirect, just show a message or allow them to view
          // This prevents redirect loops
          setSurvey(data.survey);
        } else {
          setSurvey(data.survey);
        }
      } else {
        console.error('Failed to fetch survey:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // Clear error for this question
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    if (!survey) return false;

    const currentQuestion = survey.questions[currentStep];
    if (!currentQuestion) return false;

    if (currentQuestion.required) {
      const answer = answers[currentQuestion.questionId];
      if (answer === undefined || answer === null || answer === '' || 
          (Array.isArray(answer) && answer.length === 0)) {
        setErrors((prev) => ({
          ...prev,
          [currentQuestion.questionId]: 'This question is required',
        }));
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!survey) return;

    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < survey.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!survey) return;

    // Final validation
    const allRequiredAnswered = survey.questions.every((q) => {
      if (!q.required) return true;
      const answer = answers[q.questionId];
      return answer !== undefined && answer !== null && answer !== '' &&
             !(Array.isArray(answer) && answer.length === 0);
    });

    if (!allRequiredAnswered) {
      // Find first missing required question
      const missingQuestion = survey.questions.find((q) => {
        if (!q.required) return false;
        const answer = answers[q.questionId];
        return answer === undefined || answer === null || answer === '' ||
               (Array.isArray(answer) && answer.length === 0);
      });
      if (missingQuestion) {
        const missingIndex = survey.questions.findIndex((q) => q.questionId === missingQuestion.questionId);
        setCurrentStep(missingIndex);
        setErrors((prev) => ({
          ...prev,
          [missingQuestion.questionId]: 'This question is required',
        }));
      }
      return;
    }

    setSubmitting(true);

    try {
      const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);

      const response = await fetch('/api/surveys/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: survey.questions.map((q) => ({
            questionId: q.questionId,
            value: answers[q.questionId],
          })),
          metadata: {
            timeSpentSeconds,
            deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        trackGAEvent('survey_complete', {
          survey_id: 'onboarding',
          time_spent_seconds: timeSpentSeconds,
        });
        // Survey submitted successfully
        // Show success message and allow manual navigation
        alert(tOnboarding('submitSuccess') || 'Survey submitted successfully! Thank you.');
        setSubmitting(false);
        // Optionally redirect after showing message (disabled for now)
        // setTimeout(() => {
        //   const redirectUrl = survey.metadata?.redirectUrl || `/${locale}/dashboard`;
        //   router.replace(`${redirectUrl}?surveyCompleted=true`);
        // }, 2000);
      } else {
        alert(data.error || tOnboarding('submitError') || 'Failed to submit survey. Please try again.');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Failed to submit survey:', error);
      alert('Failed to submit survey. Please try again.');
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-white mb-4">{tOnboarding('notAvailable') || 'Survey not available'}</h2>
          <LocaleLink
            href="/dashboard"
            className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400"
          >
            {tOnboarding('goToDashboard') || t('dashboard')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentStep];
  const progress = ((currentStep + 1) / survey.questions.length) * 100;
  const isLastStep = currentStep === survey.questions.length - 1;

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent sticky top-0 z-40 mobile-sticky-header">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <Logo size="sm" showText={false} linkTo="/dashboard" className="flex-shrink-0" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-brand-white leading-tight">{survey.name}</h1>
              {survey.description && (
                <p className="text-brand-white/70 text-sm mt-1">{survey.description}</p>
              )}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-brand-black/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-accent h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-brand-white/70 mt-2 text-center">
            {tOnboarding('questionProgress', { current: currentStep + 1, total: survey.questions.length }) || `Question ${currentStep + 1} of ${survey.questions.length}`}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <div className="bg-brand-white rounded-2xl p-6 sm:p-8 border-2 border-brand-accent shadow-lg">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-black flex-1 leading-tight">
                {currentQuestion.question}
              </h2>
              {currentQuestion.required && (
                <span className="text-red-500 text-sm font-medium">*</span>
              )}
            </div>
            {currentQuestion.description && (
              <p className="text-brand-darkGrey mb-6 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                {currentQuestion.description}
              </p>
            )}

            {/* Error Message */}
            {errors[currentQuestion.questionId] && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {errors[currentQuestion.questionId]}
              </div>
            )}

            {/* Answer Input */}
            <div className="space-y-3">
              {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[currentQuestion.questionId] === option.value
                          ? 'border-brand-accent bg-brand-accent/10'
                          : 'border-brand-darkGrey/30 hover:border-brand-accent/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={currentQuestion.questionId}
                        value={option.value}
                        checked={answers[currentQuestion.questionId] === option.value}
                        onChange={(e) => handleAnswerChange(currentQuestion.questionId, e.target.value)}
                        className="w-5 h-5 text-brand-accent focus:ring-brand-accent"
                      />
                      <span className="text-brand-black font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => {
                    const selectedValues = answers[currentQuestion.questionId] || [];
                    const isSelected = Array.isArray(selectedValues) && selectedValues.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brand-accent bg-brand-accent/10'
                            : 'border-brand-darkGrey/30 hover:border-brand-accent/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={isSelected}
                          onChange={(e) => {
                            const currentValues = answers[currentQuestion.questionId] || [];
                            const newValues = e.target.checked
                              ? [...(Array.isArray(currentValues) ? currentValues : []), option.value]
                              : (Array.isArray(currentValues) ? currentValues : []).filter((v) => v !== option.value);
                            handleAnswerChange(currentQuestion.questionId, newValues);
                          }}
                          className="w-5 h-5 text-brand-accent focus:ring-brand-accent rounded"
                        />
                        <span className="text-brand-black font-medium">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'rating' && (
                <div className="flex items-center gap-4">
                  <span className="text-brand-darkGrey text-sm">
                    {currentQuestion.metadata?.min || 1}
                  </span>
                  <div className="flex-1 flex items-center justify-center gap-2">
                    {Array.from({ length: (currentQuestion.metadata?.max || 5) - (currentQuestion.metadata?.min || 1) + 1 }, (_, i) => {
                      const value = (currentQuestion.metadata?.min || 1) + i;
                      const isSelected = answers[currentQuestion.questionId] === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleAnswerChange(currentQuestion.questionId, value)}
                          className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                            isSelected
                              ? 'bg-brand-accent text-brand-black'
                              : 'bg-brand-darkGrey/20 text-brand-darkGrey hover:bg-brand-accent/50'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-brand-darkGrey text-sm">
                    {currentQuestion.metadata?.max || 5}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-brand-darkGrey/20">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0 || submitting}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-darkGrey text-brand-white rounded-lg font-bold hover:bg-brand-darkGrey/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('previous')}
            </button>

            <button
              onClick={handleNext}
              disabled={submitting}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {tOnboarding('submitting') || 'Submitting...'}
                </>
              ) : isLastStep ? (
                <>
                  {t('submit')}
                  <CheckCircle className="w-5 h-5" />
                </>
              ) : (
                <>
                  {t('next')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
