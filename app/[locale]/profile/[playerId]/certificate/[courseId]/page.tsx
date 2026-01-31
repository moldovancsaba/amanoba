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
import { CheckCircle, XCircle, Download, Link as LinkIcon, Check } from 'lucide-react';
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
  verificationSlug?: string | null; // Optional verification slug for certificate link
}

export default function CertificatePage({
  params,
}: {
  params: Promise<{ playerId: string; courseId: string }>;
}) {
  const _t = useTranslations('common');
  const _locale = useLocale();
  const router = useRouter();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificateData, setCertificateData] = useState<CertificateStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-dark to-brand-black p-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Skeleton Header */}
          <div className="mb-6">
            <div className="h-6 w-32 bg-brand-darkGrey/50 rounded animate-pulse mb-4"></div>
          </div>

          {/* Skeleton Certificate */}
          <div className="relative">
            <div className="absolute inset-0 border-4 border-brand-accent rounded-2xl opacity-20"></div>
            <div className="absolute inset-2 border-2 border-brand-accent/30 rounded-xl"></div>
            
            <div className="relative bg-gradient-to-br from-brand-darkGrey via-brand-darkGrey to-brand-black rounded-2xl border-4 border-brand-accent shadow-2xl p-12 md:p-16">
              {/* Skeleton Header */}
              <div className="text-center mb-12 pb-12 border-b-2 border-brand-accent/30">
                <div className="h-16 bg-brand-darkGrey/50 rounded animate-pulse mb-6 mx-auto max-w-md"></div>
                <div className="h-1 w-32 bg-brand-darkGrey/50 rounded animate-pulse mx-auto mb-8"></div>
                <div className="h-12 bg-brand-darkGrey/50 rounded animate-pulse mb-6 mx-auto max-w-lg"></div>
                <div className="h-8 bg-brand-darkGrey/50 rounded animate-pulse mb-4 mx-auto max-w-xs"></div>
                <div className="h-10 bg-brand-darkGrey/50 rounded animate-pulse mb-4 mx-auto max-w-md"></div>
                <div className="h-8 bg-brand-darkGrey/50 rounded animate-pulse mx-auto max-w-xs"></div>
              </div>

              {/* Skeleton Requirements */}
              <div className="mb-12">
                <div className="h-6 bg-brand-darkGrey/50 rounded animate-pulse mb-6 mx-auto max-w-xs"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-brand-darkGrey/50 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Skeleton Footer */}
              <div className="mt-12 pt-8 border-t-2 border-brand-accent/30">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="h-12 bg-brand-darkGrey/50 rounded animate-pulse w-32"></div>
                  <div className="h-10 bg-brand-darkGrey/50 rounded-full animate-pulse w-40"></div>
                  <div className="h-12 bg-brand-darkGrey/50 rounded animate-pulse w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !certificateData) {
    const errorMessage = error || 'Certificate not found';
    const isNotFound = errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('404');
    const isNetworkError = errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('failed to fetch');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-dark to-brand-black flex items-center justify-center p-4">
        <div className="page-card-dark p-8 max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            {isNotFound ? 'Certificate Not Found' : 'Error Loading Certificate'}
          </h1>
          <p className="text-gray-400 mb-2">{errorMessage}</p>
          {isNetworkError && (
            <p className="text-gray-500 text-sm mb-6">
              Please check your internet connection and try again.
            </p>
          )}
          {isNotFound && (
            <p className="text-gray-500 text-sm mb-6">
              This certificate may not exist or may have been removed.
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(`/${_locale}/profile/${playerId}`)}
              className="bg-brand-accent text-brand-black px-6 py-2 rounded-lg font-bold hover:opacity-90"
            >
              Back to Profile
            </button>
            {isNetworkError && (
              <button
                onClick={() => window.location.reload()}
                className="bg-brand-darkGrey text-white px-6 py-2 rounded-lg font-bold hover:opacity-90"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { enrolled: _enrolled, allLessonsCompleted: _allLessonsCompleted, allQuizzesPassed: _allQuizzesPassed, finalExamPassed: _finalExamPassed, finalExamScore, certificateEligible, courseTitle, playerName } = certificateData;

  // Generate certificate ID from playerId and courseId
  const certificateId = (playerId && courseId) ? `${playerId.slice(-8)}-${courseId.slice(-8)}`.toUpperCase() : '';
  const issuedDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Download certificate image
  const handleDownloadImage = async (variant: 'share_1200x627' | 'print_a4' = 'share_1200x627') => {
    if (!playerId || !courseId || !certificateEligible) return;
    
    try {
      const response = await fetch(`/api/profile/${playerId}/certificate/${courseId}/image?variant=${variant}`);
      if (!response.ok) {
        throw new Error('Failed to generate certificate image');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${courseId}-${variant}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  // Copy verification link
  const handleCopyLink = async () => {
    if (!playerId || !courseId) return;

    // Use slug-based URL if available, otherwise fall back to old format
    let verificationUrl: string;
    if (certificateData?.verificationSlug) {
      // Use new slug-based verification URL
      verificationUrl = `${window.location.origin}/${_locale}/certificate/${certificateData.verificationSlug}`;
    } else {
      // Fallback to old format for backward compatibility
      verificationUrl = `${window.location.origin}/${_locale}/certificate/verify/${playerId}/${courseId}`;
    }
    
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = verificationUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-dark to-brand-black p-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/${_locale}/profile/${playerId}`)}
            className="text-brand-accent hover:underline mb-4 inline-block flex items-center gap-2"
          >
            ← Back to Profile
          </button>
        </div>

        {/* Certificate Card - Enhanced Design */}
        <div className="relative">
          {/* Decorative border pattern */}
          <div className="absolute inset-0 border-4 border-brand-accent rounded-2xl opacity-20"></div>
          <div className="absolute inset-2 border-2 border-brand-accent/30 rounded-xl"></div>
          
          <div className="relative bg-gradient-to-br from-brand-darkGrey via-brand-darkGrey to-brand-black rounded-2xl border-4 border-brand-accent shadow-2xl p-12 md:p-16">
            {/* Certificate Header - Enhanced */}
            <div className="text-center mb-12 pb-12 border-b-2 border-brand-accent/30 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-brand-accent/20"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-brand-accent/20"></div>
              
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-400 mb-4">
                  Certificate of Completion
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 mt-8">{courseTitle}</h2>
              
              <div className="my-8">
                <p className="text-xl md:text-2xl text-gray-300 mb-3">This is to certify that</p>
                <p className="text-3xl md:text-4xl font-bold text-brand-accent mt-4 mb-2">{playerName}</p>
                <p className="text-xl md:text-2xl text-gray-300 mt-4">has successfully completed the course</p>
              </div>
            </div>

            {/* Completion Requirements - Only show if certificate is eligible */}
            {certificateEligible && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-white mb-6 text-center">Completion Requirements Met</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 bg-brand-black/30 rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">Enrolled in Course</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-black/30 rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">All Lessons Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-black/30 rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">All Quizzes Passed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-black/30 rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Final Exam Passed
                        {finalExamScore !== null && (
                          <span className="text-brand-accent ml-2">({finalExamScore}%)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Certificate Footer */}
            <div className="mt-12 pt-8 border-t-2 border-brand-accent/30">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Left: Certificate ID */}
                <div className="text-center md:text-left">
                  <p className="text-gray-500 text-xs mb-1">Certificate ID</p>
                  <p className="text-brand-accent font-mono text-sm font-bold">{certificateId}</p>
                </div>

                {/* Center: Status Badge */}
                {certificateEligible ? (
                  <div className="flex items-center gap-2 bg-green-500/20 border border-green-500 rounded-full px-6 py-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-green-400 font-bold">Valid Certificate</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500 rounded-full px-6 py-2">
                    <XCircle className="w-5 h-5 text-yellow-400" />
                    <p className="text-yellow-400 font-bold">Requirements Not Met</p>
                  </div>
                )}

                {/* Right: Issued Date */}
                <div className="text-center md:text-right">
                  <p className="text-gray-500 text-xs mb-1">Issued</p>
                  <p className="text-white font-semibold">{issuedDate}</p>
                </div>
              </div>

              {/* Actions - Only show if certificate is eligible */}
              {certificateEligible && (
                <div className="mt-8 pt-8 border-t border-brand-accent/20">
                  <div className="space-y-4">
                    {/* Share Section */}
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-bold text-white mb-2">Share Certificate</h4>
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-2 bg-brand-darkGrey text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity border border-brand-accent mx-auto"
                      >
                        {linkCopied ? (
                          <>
                            <Check className="w-5 h-5" />
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-5 h-5" />
                            Copy Verification Link
                          </>
                        )}
                      </button>
                    </div>

                    {/* Download Section */}
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-white mb-2">Download Certificate</h4>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => handleDownloadImage('share_1200x627')}
                          className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                        >
                          <Download className="w-5 h-5" />
                          Download Image (Share)
                        </button>
                        <button
                          onClick={() => handleDownloadImage('print_a4')}
                          className="flex items-center justify-center gap-2 bg-brand-darkGrey text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity border border-brand-accent"
                        >
                          <Download className="w-5 h-5" />
                          Download Image (Print)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative bottom corners */}
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-brand-accent/20"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-brand-accent/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
