/**
 * Certificate Settings Helpers
 *
 * What: Load or create global certificate settings
 * Why: Ensure issuance always has a valid configuration
 */

import { CertificateSettings } from '@/lib/models';
import { certificateDefaults } from './config';

export async function getOrCreateCertificateSettings() {
  let settings = await CertificateSettings.findOne({ settingsId: 'global' });
  if (!settings) {
    settings = await CertificateSettings.create({
      settingsId: 'global',
      isActive: true,
      autoIssueOnCompletion: false,
      locale: certificateDefaults.locale,
      designTemplateId: certificateDefaults.templateId,
      credentialId: certificateDefaults.credentialId,
      completionPhraseId: certificateDefaults.completionPhraseId,
      awardedPhraseId: certificateDefaults.awardedPhraseId,
      deliverableBulletIds: certificateDefaults.deliverableBulletIds,
    });
  }
  return settings;
}
