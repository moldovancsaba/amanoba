/**
 * Certificate Verification Page
 * 
 * What: Public certificate verification and display page
 * Why: Allows certificate verification via public slug
 */

'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import { CheckCircle, XCircle, Download, Copy } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CertificateData {
  certificateId: string;
  courseId: string;
  courseTitle: string;
  courseName?: string;
  playerName: string;
  score: number;
  issuedAt: string;
  revokedAt?: string;
  isRevoked: boolean;
  isPublic: boolean;
  verificationSlug: string;
  locale: string;
}

export default function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('certificates');
  
  // Unwrap params - following pattern from CourseDetailPage
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error('Failed to unwrap params:', error);
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const certIndex = pathParts.findIndex(part => part === 'certificate');
          if (certIndex !== -1 && pathParts[certIndex + 1]) {
            setSlug(pathParts[certIndex + 1]);
          }
        }
      }
    };
    loadParams();
  }, [params]);
  
  // Check if owner - MUST be defined BEFORE useEffect that uses it
  const user = session?.user as { id?: string; playerId?: string } | undefined;
  const currentUserId = user?.playerId || user?.id;
  
  // Fetch certificate
  const { data, isLoading, error } = useQuery<{ success: boolean; certificate: CertificateData }>({
    queryKey: ['certificate', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug');
      const res = await fetch(`/api/certificates/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!slug,
  });
  
  // Check if owner (after data is loaded)
  const isOwner = data?.certificate && currentUserId && data.certificate.certificateId;
  // Simplified check - would need proper playerId comparison via API
  
  // Toggle privacy - defined BEFORE use to avoid hoisting issues
  const togglePrivacy = async () => {
    if (!slug || !data?.certificate) return;
    
    try {
      const res = await fetch(`/api/certificates/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !data.certificate.isPublic }),
      });
      
      if (res.ok) {
        // Refetch
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to toggle privacy:', error);
    }
  };
  
  // Copy verification link - defined BEFORE use to avoid hoisting issues
  const copyLink = () => {
    if (typeof window !== 'undefined' && slug) {
      const url = `${window.location.origin}/${locale}/certificate/${slug}`;
      navigator.clipboard.writeText(url);
      // Could add toast notification here
    }
  };
  
  // Download image - defined BEFORE use to avoid hoisting issues
  const downloadImage = () => {
    if (data?.certificate) {
      const url = `/api/certificates/${data.certificate.certificateId}/render`;
      window.open(url, '_blank');
    }
  };
  
  if (isLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-xl">{t('loadingCertificate')}</div>
      </div>
    );
  }
  
  if (error || !data?.success || !data.certificate) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="page-card-dark p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('certificateNotFound')}</h2>
          <p className="text-gray-400 mb-6">{t('certificateNotFoundDescription')}</p>
          <LocaleLink href="/" className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold">
            {t('backToHome')}
          </LocaleLink>
        </div>
      </div>
    );
  }
  
  const cert = data.certificate;
  
  return (
    <div className="page-shell p-6">
      <div className="max-w-4xl mx-auto">
        <div className="page-card-dark rounded-2xl p-8">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-6">
            {cert.isRevoked ? (
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="w-6 h-6" />
                <span className="font-bold">{t('certificateRevoked')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-6 h-6" />
                <span className="font-bold">{t('certificateVerified')}</span>
              </div>
            )}
            
            {/* Owner Actions */}
            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={togglePrivacy}
                  className="bg-brand-darkGrey text-white px-4 py-2 rounded-lg text-sm"
                >
                  {cert.isPublic ? t('makePrivate') : t('makePublic')}
                </button>
              </div>
            )}
          </div>
          
          {/* Certificate Content */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{cert.courseTitle}</h1>
            <p className="text-2xl text-brand-white mb-6">{t('awardedTo')} {cert.playerName}</p>
            <div className="text-3xl font-bold text-brand-accent mb-4">
              {t('finalExamScore')}: {cert.score}%
            </div>
            <p className="text-gray-400">
              {t('issued')}: {new Date(cert.issuedAt).toLocaleDateString()}
            </p>
            {cert.isRevoked && cert.revokedAt && (
              <p className="text-red-400 mt-2">
                {t('revoked')}: {new Date(cert.revokedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={copyLink}
              className="bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold flex items-center gap-2"
            >
              <Copy className="w-5 h-5" />
              {t('copyLink')}
            </button>
            <button
              onClick={downloadImage}
              className="bg-brand-darkGrey text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              {t('downloadImage')}
            </button>
          </div>
          
          {/* Verification Info */}
          <div className="mt-8 p-4 bg-brand-black/40 rounded-lg">
            <p className="text-gray-400 text-sm">{t('verificationInfo')}</p>
            <p className="text-gray-500 text-xs mt-2">
              {t('certificateId')}: {cert.certificateId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
