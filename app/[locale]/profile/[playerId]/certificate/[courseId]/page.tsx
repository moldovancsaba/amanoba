/**
 * Certificate Display Page
 * 
 * What: Displays certificate of completion for a player and course
 * Why: Simple certificate display using existing data, no complex generation
 * 
 * Route: /[locale]/profile/[playerId]/certificate/[courseId]
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface CertificateStatus {
  enrolled: boolean;
  allLessonsCompleted: boolean;
  allQuizzesPassed: boolean;
  finalExamPassed: boolean;
  finalExamScore: number | null;
  certificateEligible: boolean;
  courseTitle: string;
  playerName: string;
}

export default function CertificatePage({
  params,
}: {
  params: Promise<{ playerId: string; courseId: string }>;
}) {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificateData, setCertificateData] = useState<CertificateStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Unwrap async params - following pattern from ProfilePage
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setPlayerId(resolvedParams.playerId);
        setCourseId(resolvedParams.courseId);
      } catch (error) {
        console.error('Failed to unwrap params:', error);
        // Fallback: extract from URL
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const profileIndex = pathParts.findIndex(part => part === 'profile');
          const certificateIndex = pathParts.findIndex(part => part === 'certificate');
          if (profileIndex !== -1 && pathParts[profileIndex + 1]) {
            setPlayerId(pathParts[profileIndex + 1]);
          }
          if (certificateIndex !== -1 && pathParts[certificateIndex + 1]) {
            setCourseId(pathParts[certificateIndex + 1]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadParams();
  }, [params]);

  // Fetch certificate status when playerId and courseId are available
  useEffect(() => {
    if (!playerId || !courseId) return;

    const fetchCertificateStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/profile/${playerId}/certificate-status?courseId=${encodeURIComponent(courseId)}`);
        const data = await res.json();
        if (data.success) {
          setCertificateData(data.data);
        } else {
          setError(data.error || 'Failed to load certificate status');
        }
      } catch (error) {
        console.error('Failed to fetch certificate status:', error);
        setError('Network error - failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateStatus();
  }, [playerId, courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-dark to-brand-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-dark to-brand-black flex items-center justify-center p-4">
        <div className="page-card-dark p-8 max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error || 'Certificate not found'}</p>
          <button
            onClick={() => router.push(`/${locale}/profile/${playerId}`)}
            className="bg-brand-accent text-brand-black px-6 py-2 rounded-lg font-bold hover:opacity-90"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const { enrolled, allLessonsCompleted, allQuizzesPassed, finalExamPassed, finalExamScore, certificateEligible, courseTitle, playerName } = certificateData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-dark to-brand-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/${locale}/profile/${playerId}`)}
            className="text-brand-accent hover:underline mb-4 inline-block"
          >
            ← Back to Profile
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Certificate of Completion</h1>
          <p className="text-gray-400">This certificate verifies course completion and achievement</p>
        </div>

        {/* Certificate Card */}
        <div className="page-card-dark p-8">
          {/* Certificate Header */}
          <div className="text-center mb-8 pb-8 border-b border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-2">{courseTitle}</h2>
            <p className="text-xl text-gray-300">Awarded to</p>
            <p className="text-2xl font-bold text-brand-accent mt-2">{playerName}</p>
          </div>

          {/* Completion Status */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              {enrolled ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              )}
              <div>
                <p className="text-white font-semibold">User enrolled in the course</p>
                {!enrolled && <p className="text-gray-400 text-sm">Not enrolled</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {allLessonsCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              )}
              <div>
                <p className="text-white font-semibold">User learned all lessons</p>
                {!allLessonsCompleted && <p className="text-gray-400 text-sm">Lessons not completed</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {allQuizzesPassed ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              )}
              <div>
                <p className="text-white font-semibold">User passed all quizzes</p>
                {!allQuizzesPassed && <p className="text-gray-400 text-sm">Quizzes not passed</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {finalExamPassed ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              )}
              <div>
                <p className="text-white font-semibold">
                  User passed the final quiz
                  {finalExamScore !== null && (
                    <span className="text-brand-accent ml-2">(Score: {finalExamScore}%)</span>
                  )}
                </p>
                {!finalExamPassed && <p className="text-gray-400 text-sm">Final exam not passed</p>}
              </div>
            </div>
          </div>

          {/* Certificate Status */}
          <div className="pt-8 border-t border-gray-700">
            {certificateEligible ? (
              <div className="text-center">
                <div className="inline-block bg-green-500/20 border border-green-500 rounded-lg px-6 py-3 mb-4">
                  <p className="text-green-400 font-bold text-lg">✓ Certificate Eligible</p>
                </div>
                <p className="text-gray-400 text-sm">
                  All requirements have been met. This certificate is valid.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-block bg-yellow-500/20 border border-yellow-500 rounded-lg px-6 py-3 mb-4">
                  <p className="text-yellow-400 font-bold text-lg">Certificate Not Eligible</p>
                </div>
                <p className="text-gray-400 text-sm">
                  Some requirements have not been met. Complete all course requirements to earn this certificate.
                </p>
              </div>
            )}
          </div>

          {/* Issued Date */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Issued: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
