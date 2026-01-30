/**
 * Certificate Verification Page (Slug-based)
 * 
 * What: Public page to verify certificate authenticity using slug
 * Why: More secure verification with privacy controls
 * 
 * Route: /[locale]/certificate/[slug]
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle, XCircle, ExternalLink, Lock, Unlock, Award } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Certificate {
  certificateId: string;
  recipientName: string;
  courseTitle: string;
  courseId: string;
  playerId?: string;
  verificationSlug: string;
  issuedAtISO: string;
  finalExamScorePercentInteger?: number;
  isPublic: boolean;
  isRevoked: boolean;
  revokedAtISO?: string;
  revokedReason?: string;
  locale: 'en' | 'hu';
}

export default function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const _t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [updatingPrivacy, setUpdatingPrivacy] = useState(false);

  // Unwrap async params
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error('Failed to unwrap params:', error);
        // Fallback: extract from URL
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const certificateIndex = pathParts.findIndex(part => part === 'certificate');
          if (certificateIndex !== -1 && pathParts[certificateIndex + 1]) {
            setSlug(pathParts[certificateIndex + 1]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadParams();
  }, [params]);

  // Fetch certificate by slug
  useEffect(() => {
    if (!slug) return;

    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/certificates/${slug}`);
        const data = await res.json();
        
        if (data.success && data.certificate) {
          setCertificate(data.certificate);
          // Check if current user is owner
          if (session?.user?.id && data.certificate.playerId === session.user.id) {
            setIsOwner(true);
          }
        } else {
          setError(data.error || 'Certificate not found');
        }
      } catch (error) {
        console.error('Failed to fetch certificate:', error);
        setError('Network error - failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [slug, session?.user?.id]);

  // Toggle privacy (owner only)
  const handleTogglePrivacy = async () => {
    if (!certificate || !isOwner) return;

    try {
      setUpdatingPrivacy(true);
      const res = await fetch(`/api/certificates/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !certificate.isPublic }),
      });

      const data = await res.json();
      if (data.success && data.certificate) {
        setCertificate(data.certificate);
      } else {
        alert(data.error || 'Failed to update privacy settings');
      }
    } catch (error) {
      console.error('Failed to update privacy:', error);
      alert('Failed to update privacy settings');
    } finally {
      setUpdatingPrivacy(false);
    }
  };

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

  if (error || !certificate) {
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

  const issuedDate = new Date(certificate.issuedAtISO).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-dark to-brand-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Certificate Verification</h1>
          <p className="text-gray-400">Verify the authenticity of this certificate</p>
        </div>

        {/* Certificate Card */}
        <div className="page-card-dark p-8 mb-6">
          {certificate.isRevoked ? (
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Certificate Revoked</h2>
              <p className="text-gray-400 mb-4">
                This certificate has been revoked and is no longer valid.
              </p>
              {certificate.revokedReason && (
                <p className="text-gray-500 text-sm mb-4">
                  Reason: {certificate.revokedReason}
                </p>
              )}
              {certificate.revokedAtISO && (
                <p className="text-gray-500 text-sm">
                  Revoked on: {new Date(certificate.revokedAtISO).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Certificate Verified</h2>
                    <p className="text-gray-400">This certificate is authentic</p>
                  </div>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>

              {/* Certificate Details */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Recipient</p>
                    <p className="text-white font-semibold text-lg">{certificate.recipientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Course</p>
                    <p className="text-white font-semibold text-lg">{certificate.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Certificate ID</p>
                    <p className="text-white font-mono text-sm">{certificate.certificateId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Issued Date</p>
                    <p className="text-white">{issuedDate}</p>
                  </div>
                  {certificate.finalExamScorePercentInteger !== undefined && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Final Exam Score</p>
                      <p className="text-white font-semibold">
                        {certificate.finalExamScorePercentInteger}%
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      {certificate.isPublic ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                          <Unlock className="w-3 h-3" />
                          Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Controls */}
              {isOwner && (
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-white mb-4">Privacy Settings</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium mb-1">
                        {certificate.isPublic ? 'Public' : 'Private'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {certificate.isPublic
                          ? 'Anyone with the link can view this certificate'
                          : 'Only you can view this certificate'}
                      </p>
                    </div>
                    <button
                      onClick={handleTogglePrivacy}
                      disabled={updatingPrivacy}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        certificate.isPublic
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      } disabled:opacity-50`}
                    >
                      {updatingPrivacy ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : certificate.isPublic ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          Make Public
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* View Full Certificate (Owner Only) */}
              {isOwner && certificate.playerId && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <LocaleLink
                    href={`/profile/${certificate.playerId}/certificate/${certificate.courseId}`}
                    className="inline-flex items-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Full Certificate
                  </LocaleLink>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/${locale}`)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
