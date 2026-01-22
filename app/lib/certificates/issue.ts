/**
 * Certificate Issuance
 *
 * What: Issue certificate for a completed course
 * Why: Centralized logic for validation and snapshot creation
 */

import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import { Certificate, Course, CourseProgress, Player } from '@/lib/models';
import { getOrCreateCertificateSettings } from './settings';
import {
  getTemplateById,
  getCredentialById,
  getCompletionPhraseById,
  getAwardedPhraseById,
  getBulletLabelsByIds,
  resolveLabel,
} from './utils';
import { uploadToImgBB } from '@/lib/utils/imgbb';
import { logger } from '@/lib/logger';
import type { CertificateLocale } from './config';

export async function issueCertificateForCompletion(params: {
  playerId: string;
  courseId: string;
  locale?: CertificateLocale;
  finalExamScorePercentInteger?: number;
}) {
  const { playerId, courseId, locale, finalExamScorePercentInteger } = params;
  await connectDB();

  const player = await Player.findById(playerId);
  if (!player) {
    throw new Error('Player not found');
  }

  const course = await Course.findOne({ courseId });
  if (!course) {
    throw new Error('Course not found');
  }

  const progress = await CourseProgress.findOne({
    playerId: player._id,
    courseId: course._id,
  });

  if (!progress || (progress.status !== 'COMPLETED' && progress.status !== 'completed')) {
    throw new Error('Course not completed');
  }

  const existing = await Certificate.findOne({ playerId: player._id, courseId: course.courseId });
  if (existing) {
    return existing;
  }

  const settings = await getOrCreateCertificateSettings();
  if (!settings.isActive) {
    throw new Error('Certification is disabled');
  }

  const certificateLocale = (locale || settings.locale || course.language || 'en') as CertificateLocale;
  const template = getTemplateById(settings.designTemplateId);
  const credential = getCredentialById(settings.credentialId);
  const completionPhrase = getCompletionPhraseById(settings.completionPhraseId);
  const awardedPhrase = getAwardedPhraseById(settings.awardedPhraseId);
  const bulletLabels = getBulletLabelsByIds(settings.deliverableBulletIds || [], certificateLocale);

  const certificateId = crypto.randomUUID();
  const verificationSlug = crypto.randomBytes(16).toString('hex');
  const issuedAt = new Date();
  const issuedAtISO = issuedAt.toISOString();
  const certificateNumber = `CERT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  const cert = await Certificate.create({
    certificateId,
    certificateNumber,
    playerId: player._id,
    recipientName: player.displayName,
    courseId: course.courseId,
    courseRef: course._id,
    courseTitle: course.name,
    locale: certificateLocale,
    designTemplateId: template.id,
    designTemplateLabel: resolveLabel(template, certificateLocale),
    credentialId: credential.id,
    credentialTitle: resolveLabel(credential, certificateLocale),
    completionPhraseId: completionPhrase.id,
    completionPhrase: resolveLabel(completionPhrase, certificateLocale),
    awardedPhraseId: awardedPhrase.id,
    awardedPhrase: resolveLabel(awardedPhrase, certificateLocale),
    deliverableBulletIds: settings.deliverableBulletIds || [],
    deliverableBullets: bulletLabels,
    issuedAt,
    issuedAtISO,
    verificationSlug,
    finalExamScorePercentInteger,
  });

  const apiKey = process.env.IMGBB_API_KEY;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  if (apiKey) {
    try {
      const renderUrl = `${appUrl}/api/certificates/${cert.certificateId}/render?format=png&variant=share_1200x627`;
      const renderResponse = await fetch(renderUrl);
      if (renderResponse.ok) {
        const buffer = Buffer.from(await renderResponse.arrayBuffer());
        const base64 = buffer.toString('base64');
        const upload = await uploadToImgBB(base64, apiKey);
        cert.imageUrl = upload.data.url;
        cert.imageDeleteUrl = upload.data.delete_url;
        await cert.save();
      } else {
        logger.warn(
          { status: renderResponse.status, certificateId: cert.certificateId },
          'Certificate render failed for image upload'
        );
      }
    } catch (error) {
      logger.error({ error, certificateId: cert.certificateId }, 'Failed to upload certificate image');
    }
  }

  return cert;
}
