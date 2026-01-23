import Image from 'next/image';
import { notFound } from 'next/navigation';

import { LocaleLink } from '@/components/LocaleLink';
import ShareLinkButton from '@/components/ShareLinkButton';
import { CertificatePrivacyToggle } from '@/components/CertificatePrivacyToggle';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Certificate, Course, Player } from '@/lib/models';
import { format } from 'date-fns';

interface Params {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function CertificatePage({ params }: Params) {
  await connectDB();

  const certificate = await Certificate.findOne({ verificationSlug: params.slug }).lean();
  if (!certificate) {
    return notFound();
  }

  const session = await auth();
  const isOwner = session?.user?.id === certificate.playerId;
  if (!certificate.isPublic && !isOwner) {
    return notFound();
  }

  const [player, course] = await Promise.all([
    Player.findById(certificate.playerId).lean(),
    Course.findOne({ courseId: certificate.courseId }).lean(),
  ]);

  const shareUrl = `/${params.locale}/certificate/${certificate.verificationSlug}`;
  const courseUrl = `/${params.locale}/courses/${certificate.courseId}`;
  const issuedDate = certificate.issuedAtISO
    ? format(new Date(certificate.issuedAtISO), 'MMMM d, yyyy')
    : null;
  const status = certificate.isRevoked ? 'Revoked' : 'Certified';
  const score = certificate.finalExamScorePercentInteger ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10">
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Certificate / Verification</p>
          <h1 className="text-3xl font-bold text-white">Verified Credential</h1>
          <p className="text-slate-400">
            {player?.displayName ?? certificate.recipientName} · {course?.name ?? certificate.courseTitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/40">
            <div className="h-auto overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={`/api/certificates/${certificate.certificateId}/render?variant=share_1200x627`}
                alt="Certificate preview"
                width={1200}
                height={627}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">Status</p>
                <p className={`text-2xl font-semibold ${certificate.isRevoked ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {status}
                </p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">Score</p>
                <p className="text-3xl font-bold text-white">{score}%</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">Issued</p>
                <p className="text-base text-white/80">{issuedDate ?? 'Pending'}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/40 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Verification</p>
              <p className="text-sm font-mono text-white/80">{certificate.verificationSlug}</p>
              <ShareLinkButton shareUrl={shareUrl} />
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Issued to</p>
              <p className="text-lg text-white font-semibold">{player?.displayName ?? certificate.recipientName}</p>
              {player?.profilePicture && (
                <span className="text-sm text-white/70">Profile picture available</span>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Course</p>
              <LocaleLink href={courseUrl} className="text-lg font-semibold text-indigo-300 hover:text-indigo-200">
                {course?.name ?? certificate.courseTitle}
              </LocaleLink>
              <p className="text-sm text-white/70">Course ID: {certificate.courseId}</p>
            </div>

            {isOwner && (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Privacy</p>
                <CertificatePrivacyToggle slug={certificate.verificationSlug} initialPublic={Boolean(certificate.isPublic)} />
              </div>
            )}
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Holder</p>
              <p className="text-lg font-semibold text-white">{player?.displayName ?? certificate.recipientName}</p>
              <p className="text-sm text-white/70">Player ID: {certificate.playerId}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Credential</p>
              <p className="text-base text-white/80">{certificate.credentialId}</p>
              <p className="text-sm text-white/60">{certificate.completionPhraseId}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Template</p>
              <p className="text-sm text-white/80">{certificate.designTemplateId}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Delivery</p>
              <LocaleLink href={shareUrl} className="text-indigo-300 text-sm hover:text-indigo-200">
                View verification page
              </LocaleLink>
              <LocaleLink href={courseUrl} className="text-indigo-300 text-sm hover:text-indigo-200">
                Back to course
              </LocaleLink>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
