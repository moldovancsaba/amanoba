/**
 * Certification Final Exam Page (MVP)
 * - Fetches entitlement + pool availability
 * - Allows start -> answer flow one question at a time
 * - On completion, submits and shows score/pass/fail
 */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Loader2, ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useCourseTranslations } from '@/app/lib/hooks/useCourseTranslations';

interface EntitlementResp {
  certificationEnabled: boolean;
  certificationAvailable: boolean;
  entitlementOwned: boolean;
  premiumIncludesCertification: boolean;
  priceMoney?: { amount: number; currency: string } | null;
  pricePoints?: number | null;
  poolCount: number;
}

interface QuestionPayload {
  questionId: string;
  question: string;
  options: string[];
  index: number;
  total: number;
}

export default function FinalExamPage() {
  const params = useParams<{ courseId: string; locale: string }>();
  const courseId = params.courseId;
  const router = useRouter();
  const locale = useLocale();
  const { data: session, status } = useSession();

  const [entitlement, setEntitlement] = useState<EntitlementResp | null>(null);
  const [loadingEnt, setLoadingEnt] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuestionPayload | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score?: number; passed?: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [courseLanguage, setCourseLanguage] = useState<string | undefined>(undefined);

  const { t } = useCourseTranslations(courseLanguage);

  useEffect(() => {
    if (status === 'authenticated') {
      loadEntitlement();
    }
  }, [status]);

  const loadEntitlement = async () => {
    setLoadingEnt(true);
    setError(null);
    try {
      const res = await fetch(`/api/certification/entitlement?courseId=${courseId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to load');
      setEntitlement(data.data);
      if (data.data?.courseLanguage) {
        setCourseLanguage(data.data.courseLanguage);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingEnt(false);
    }
  };

  const redeemPoints = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/certification/entitlement/redeem-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Redeem failed');
      await loadEntitlement();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startExam = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/certification/final-exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Start failed');
      setAttemptId(data.data.attemptId);
      setQuestion(data.data.question);
      setResult(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const answer = async (selectedIndex: number) => {
    if (!attemptId || !question) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/certification/final-exam/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          questionId: question.questionId,
          selectedIndex,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Answer failed');

      if (data.data.completed) {
        // Submit to finalize
        const submitRes = await fetch('/api/certification/final-exam/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attemptId }),
        });
        const submitData = await submitRes.json();
        if (!submitRes.ok || !submitData.success) throw new Error(submitData.error || 'Submit failed');
        setResult({ score: submitData.data.scorePercentInteger, passed: submitData.data.passed });
        setQuestion(null);
      } else {
        setQuestion(data.data.nextQuestion);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const discard = async () => {
    if (!attemptId) return;
    await fetch('/api/certification/final-exam/discard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, reason: 'user_exit' }),
    });
    setAttemptId(null);
    setQuestion(null);
    setResult(null);
  };

  if (status === 'loading' || loadingEnt) {
    return (
      <div className="flex items-center justify-center h-80 text-white" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> {t('loadingCourse', { defaultValue: 'Loading...' })}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6 text-white" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <p>{t('signInToEnroll', { defaultValue: 'Please sign in to access the certification exam.' })}</p>
      </div>
    );
  }

  const ent = entitlement;
  const unavailable = !ent?.certificationEnabled || !ent?.certificationAvailable;
  const canStart = ent?.entitlementOwned && !unavailable;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white space-y-6" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-amber-400" />
        <h1 className="text-2xl font-bold">{t('finalExamTitle', { defaultValue: 'Final Certification Exam' })}</h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 text-red-200 px-4 py-3 rounded">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {unavailable && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <p className="text-lg font-semibold">{t('certificationUnavailable', { defaultValue: 'Certification unavailable' })}</p>
          <p className="text-gray-300 mt-1">
            {t('certificationPoolMessage', {
              poolCount: ent?.poolCount ?? 0,
              defaultValue: `Pool size: ${ent?.poolCount ?? 0}. Certification is disabled until the pool has at least 50 questions.`,
            })}
          </p>
          <button
            className="mt-3 text-sm text-indigo-300 underline"
            onClick={() => router.push(`/${courseLanguage || locale}/courses/${courseId}`)}
          >
            {t('backToCourse', { defaultValue: 'Back to course' })}
          </button>
        </div>
      )}

      {!unavailable && !ent?.entitlementOwned && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
          <p className="font-semibold">{t('certificationAccess', { defaultValue: 'Get certification access' })}</p>
          <p className="text-gray-300">
            {t('certificationPriceLine', {
              price: ent?.priceMoney ? `${ent.priceMoney.amount} ${ent.priceMoney.currency}` : 'Not set',
              points: ent?.pricePoints ?? 'N/A',
              defaultValue: `Price: ${ent?.priceMoney ? `${ent.priceMoney.amount} ${ent.priceMoney.currency}` : 'Not set'} | Points: ${ent?.pricePoints ?? 'N/A'}`,
            })}
          </p>
          <div className="flex gap-2">
            {ent?.pricePoints ? (
              <button
                disabled={submitting}
                onClick={redeemPoints}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
              >
                {t('redeemPoints', { defaultValue: 'Redeem points' })}
              </button>
            ) : null}
            <button
              disabled
              className="px-4 py-2 rounded bg-gray-700 text-gray-400 cursor-not-allowed"
            >
              Pay (disabled in MVP)
            </button>
          </div>
        </div>
      )}

      {!unavailable && ent?.entitlementOwned && !question && !result && (
        <div className="space-y-3">
          <p>You have access. The exam is one sitting, 50 randomized questions. Leaving discards progress.</p>
          <button
            disabled={submitting}
            onClick={startExam}
            className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
          >
            Start exam
          </button>
        </div>
      )}

      {question && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>
              Question {question.index + 1} / {question.total}
            </span>
            <button onClick={discard} className="text-red-300 hover:text-red-200">
              Discard attempt
            </button>
          </div>
          <p className="text-lg font-semibold">{question.question}</p>
          <div className="space-y-2">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={submitting}
                onClick={() => answer(idx)}
                className="w-full text-left px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-2">
          <div className="flex items-center gap-2 text-xl font-semibold">
            {result.passed ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <span>{result.passed ? 'Passed' : 'Not passed'}</span>
          </div>
          <p className="text-gray-200">Score: {result.score}%</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setResult(null);
                loadEntitlement();
              }}
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
            >
              Refresh status
            </button>
            <button
              onClick={() => router.push(`/${courseLanguage || locale}/courses/${courseId}`)}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              Back to course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
