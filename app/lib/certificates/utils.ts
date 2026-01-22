/**
 * Certificate Utilities
 *
 * What: Resolve certificate config labels by ID and locale
 * Why: Keep rendering and issuing logic consistent
 */

import type { CertificateLocale } from './config';
import {
  certificateTemplates,
  certificateCredentials,
  certificateCompletionPhrases,
  certificateAwardedPhrases,
  certificateBullets,
} from './config';

export function getTemplateById(templateId: string) {
  return certificateTemplates.find((t) => t.id === templateId) || certificateTemplates[0];
}

export function getCredentialById(credentialId: string) {
  return certificateCredentials.find((c) => c.id === credentialId) || certificateCredentials[0];
}

export function getCompletionPhraseById(phraseId: string) {
  return certificateCompletionPhrases.find((p) => p.id === phraseId) || certificateCompletionPhrases[0];
}

export function getAwardedPhraseById(phraseId: string) {
  return certificateAwardedPhrases.find((p) => p.id === phraseId) || certificateAwardedPhrases[0];
}

export function getBulletLabelsByIds(ids: string[], locale: CertificateLocale): string[] {
  return ids
    .map((id) => certificateBullets.find((b) => b.id === id))
    .filter(Boolean)
    .map((item) => item!.label[locale] || item!.label.en);
}

export function resolveLabel(
  record: { label: Record<CertificateLocale, string> },
  locale: CertificateLocale
) {
  return record.label[locale] || record.label.en;
}
