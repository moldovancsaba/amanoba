/**
 * Public Certificate Verification Page
 * 
 * What: Public page to verify certificate authenticity
 * Why: Allows sharing certificates via public link
 * 
 * Route: /[locale]/certificate/verify/[playerId]/[courseId]
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
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

export default function CertificateVerificationPage({
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

  // Unwrap async params
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setPlayerId(resolvedParams.playerId);
        setCourseId(resolvedParams.courseId);
      } catch (error) {
        console.error('Failed to unwrap params:', error);
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const verifyIndex = pathParts.findIndex(part => part === 'verify');
          if (verifyIndex !== -1 && pathParts[verifyIndex + 1] && pathParts[verifyIndex + 2]) {
            setPlayerId(pathParts[verifyIndex + 1]);
            setCourseId(pathParts[verifyIndex + 2]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadParams();
  }, [params]);

  // Fetch certificate status
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
          <p className="text-gray-400">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-dark to-brand-black flex items-center justify-center p-4">
        <div className="page-card-dark p-8 max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Verification Failed</h1>
          <p className="text-gray-400 mb-6">{error || 'Certificate not found or invalid'}</p>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="bg-brand-accent text-brand-black px-6 py-2 rounded-lg font-bold hover:opacity-90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { enrolled, allLessonsCompleted, allQuizzesPassed, finalExamPassed, finalExamScore, certificateEligible, courseTitle, playerName } = certificateData;
  const certificateId = `${playerId?.slice(-8)}-${courseId?.slice(-8)}`.toUpperCase();
  const issuedDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-dark to-brand-black p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Certificate Verification</h1>
          <p className="text-gray-400">Verify the authenticity of this certificate</p>
        </div>

        {/* Verification Card */}
        <div className="page-card-dark p-8">
          {/* Verification Status */}
          <div className="text-center mb-8 pb-8 border-b border-gray-700">
            {certificateEligible ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-green-400 mb-2">Certificate Verified</h2>
                  <p className="text-gray-400">This certificate is authentic and valid</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center border-4 border-yellow-500">
                  <XCircle className="w-12 h-12 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2">Certificate Not Eligible</h2>
                  <p className="text-gray-400">This certificate does not meet all requirements</p>
                </div>
              </div>
            )}
          </div>

          {/* Certificate Details */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Certificate Details</h3>
              <div className="bg-brand-black/30 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Recipient</span>
                  <span className="text-white font-semibold">{playerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Course</span>
                  <span className="text-white font-semibold">{courseTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Certificate ID</span>
                  <span className="text-brand-accent font-mono font-bold">{certificateId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Issued</span>
                  <span className="text-white font-semibold">{issuedDate}</span>
                </div>
                {finalExamScore !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Final Exam Score</span>
                    <span className="text-brand-accent font-bold">{finalExamScore}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements Status */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Completion Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-brand-black/30 rounded-lg p-4">
                  {enrolled ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-semibold">Enrolled in Course</p>
                    {!enrolled && <p className="text-gray-400 text-sm">Not enrolled</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-brand-black/30 rounded-lg p-4">
                  {allLessonsCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-semibold">All Lessons Completed</p>
                    {!allLessonsCompleted && <p className="text-gray-400 text-sm">Lessons not completed</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-brand-black/30 rounded-lg p-4">
                  {allQuizzesPassed ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-semibold">All Quizzes Passed</p>
                    {!allQuizzesPassed && <p className="text-gray-400 text-sm">Quizzes not passed</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-brand-black/30 rounded-lg p-4">
                  {finalExamPassed ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      Final Exam Passed
                      {finalExamScore !== null && (
                        <span className="text-brand-accent ml-2">({finalExamScore}%)</span>
                      )}
                    </p>
                    {!finalExamPassed && <p className="text-gray-400 text-sm">Final exam not passed</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-8 border-t border-gray-700 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/profile/${playerId}/certificate/${courseId}`}
              className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-5 h-5" />
              View Full Certificate
            </a>
            <button
              onClick={() => router.push(`/${locale}`)}
              className="bg-brand-darkGrey text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity border border-brand-accent"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
