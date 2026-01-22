/**
 * Certificate Verification Page
 *
 * What: Public verification page for issued certificates
 * Why: Shareable proof with course and recipient info
 */

'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';

interface CertificateData {
  certificateId: string;
  certificateNumber?: string;
  recipientName: string;
  courseTitle: string;
  credentialTitle: string;
  completionPhrase: string;
  awardedPhrase: string;
  deliverableBullets: string[];
  issuedAtISO: string;
  verificationSlug: string;
  imageUrl?: string;
  isRevoked: boolean;
}

export default function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = useLocale();
  const t = useTranslations('certificates');
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { slug } = await params;
      try {
        const res = await fetch(`/api/certificates/verify/${slug}`);
        const data = await res.json();
        if (data.success) {
          setCertificate(data.certificate);
        } else {
          setError(data.error || t('notFound'));
        }
      } catch (err) {
        setError(t('failedToLoad'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-white mb-4">{t('notFound')}</h2>
          <p className="text-brand-white/70 mb-6">{error}</p>
          <LocaleLink
            href="/courses"
            className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400"
          >
            {t('browseCourses')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex items-center gap-4">
          <Logo size="sm" showText={false} linkTo="/" />
          <div>
            <h1 className="text-2xl font-bold text-brand-white">{t('title')}</h1>
            <p className="text-brand-white/80">{t('subtitle')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="text-sm uppercase tracking-wide text-brand-darkGrey">
                {certificate.isRevoked ? t('revoked') : t('verified')}
              </div>
              <h2 className="text-3xl font-bold text-brand-black mt-2">
                {certificate.recipientName}
              </h2>
              <p className="text-brand-darkGrey mt-2">{certificate.completionPhrase}</p>
              <p className="text-brand-black font-semibold mt-3">{certificate.courseTitle}</p>
              <p className="text-brand-darkGrey mt-2">{certificate.awardedPhrase}</p>

              {certificate.deliverableBullets?.length ? (
                <ul className="mt-4 list-disc list-inside text-brand-darkGrey space-y-1">
                  {certificate.deliverableBullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-6 text-sm text-brand-darkGrey">
                <div>
                  {t('credential')}: <span className="text-brand-black font-semibold">{certificate.credentialTitle}</span>
                </div>
                <div>
                  {t('issuedAt')}:{' '}
                  <span className="text-brand-black font-semibold">
                    {new Date(certificate.issuedAtISO).toLocaleDateString(locale)}
                  </span>
                </div>
                <div>
                  {t('certificateNumber')}:{' '}
                  <span className="text-brand-black font-semibold">
                    {certificate.certificateNumber || certificate.certificateId}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <LocaleLink
                  href="/courses"
                  className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400"
                >
                  {t('browseCourses')}
                </LocaleLink>
                {certificate.imageUrl ? (
                  <a
                    href={certificate.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-brand-darkGrey text-brand-white px-4 py-2 rounded-lg font-bold hover:bg-brand-secondary-700"
                  >
                    {t('viewImage')}
                  </a>
                ) : null}
              </div>
            </div>
            <div className="w-full md:w-80">
              <div className="rounded-xl border border-brand-accent/40 bg-brand-accent/10 p-4">
                <div className="text-sm text-brand-darkGrey mb-2">{t('verification')}</div>
                <div className="text-xs text-brand-darkGrey break-all">
                  amanoba.com/certificate/{certificate.verificationSlug}
                </div>
              </div>
              {certificate.imageUrl ? (
                <div className="mt-4">
                  <img
                    src={certificate.imageUrl}
                    alt={t('certificateImageAlt')}
                    className="w-full rounded-xl border border-brand-accent/40"
                  />
                </div>
              ) : (
                <div className="mt-4 text-sm text-brand-darkGrey">
                  {t('imagePending')}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
