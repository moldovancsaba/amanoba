/**
 * Admin Certification Settings Page
 *
 * What: Configure global certificate settings
 * Why: Admins need a single place to manage certificate defaults
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  certificateTemplates,
  certificateCredentials,
  certificateCompletionPhrases,
  certificateAwardedPhrases,
  certificateBullets,
  type CertificateLocale,
} from '@/lib/certificates/config';

type CertificationSettings = {
  isActive: boolean;
  autoIssueOnCompletion: boolean;
  locale: CertificateLocale;
  designTemplateId: string;
  credentialId: string;
  completionPhraseId: string;
  awardedPhraseId: string;
  deliverableBulletIds: string[];
  price?: {
    amount: number;
    currency: string;
  };
};

export default function AdminCertificationPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<CertificationSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/certification/settings');
        const data = await res.json();
        if (data.success) {
          setSettings(data.settings);
        } else {
          setError(data.error || t('failedToLoadSettings'));
        }
      } catch (err) {
        setError(t('failedToLoadSettings'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const res = await fetch('/api/admin/certification/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSuccess(t('settingsSaved'));
      } else {
        setError(data.error || t('failedToSaveSettings'));
      }
    } catch (err) {
      setError(t('failedToSaveSettings'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">{tCommon('loading')}</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center text-gray-300">
        {error || t('failedToLoadSettings')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('certification')}</h1>
        <p className="text-gray-400">{t('certificationDescription')}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-gray-200">
            <input
              type="checkbox"
              checked={settings.isActive}
              onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
            />
            {t('certificationEnabled')}
          </label>
          <label className="flex items-center gap-2 text-gray-200">
            <input
              type="checkbox"
              checked={settings.autoIssueOnCompletion}
              onChange={(e) =>
                setSettings({ ...settings, autoIssueOnCompletion: e.target.checked })
              }
            />
            {t('autoIssueOnCompletion')}
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('defaultLocale')}</label>
            <select
              value={settings.locale}
              onChange={(e) =>
                setSettings({ ...settings, locale: e.target.value as CertificateLocale })
              }
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white"
            >
              <option value="en">English</option>
              <option value="hu">Magyar</option>
              <option value="ru">Русский</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('template')}</label>
            <select
              value={settings.designTemplateId}
              onChange={(e) => setSettings({ ...settings, designTemplateId: e.target.value })}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white"
            >
              {certificateTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label[settings.locale] || template.label.en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('credential')}</label>
            <select
              value={settings.credentialId}
              onChange={(e) => setSettings({ ...settings, credentialId: e.target.value })}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white"
            >
              {certificateCredentials.map((credential) => (
                <option key={credential.id} value={credential.id}>
                  {credential.label[settings.locale] || credential.label.en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('completionPhrase')}</label>
            <select
              value={settings.completionPhraseId}
              onChange={(e) => setSettings({ ...settings, completionPhraseId: e.target.value })}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white"
            >
              {certificateCompletionPhrases.map((phrase) => (
                <option key={phrase.id} value={phrase.id}>
                  {phrase.label[settings.locale] || phrase.label.en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('awardedPhrase')}</label>
            <select
              value={settings.awardedPhraseId}
              onChange={(e) => setSettings({ ...settings, awardedPhraseId: e.target.value })}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white"
            >
              {certificateAwardedPhrases.map((phrase) => (
                <option key={phrase.id} value={phrase.id}>
                  {phrase.label[settings.locale] || phrase.label.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">{t('bullets')}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certificateBullets.map((bullet) => {
              const selected = settings.deliverableBulletIds.includes(bullet.id);
              return (
                <label key={bullet.id} className="flex items-start gap-2 text-gray-200 text-sm">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (settings.deliverableBulletIds.length >= 4) return;
                        setSettings({
                          ...settings,
                          deliverableBulletIds: [...settings.deliverableBulletIds, bullet.id],
                        });
                      } else {
                        setSettings({
                          ...settings,
                          deliverableBulletIds: settings.deliverableBulletIds.filter((id) => id !== bullet.id),
                        });
                      }
                    }}
                  />
                  {bullet.label[settings.locale] || bullet.label.en}
                </label>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">{t('bulletLimit')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('price')}</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={settings.price?.amount || 0}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    price: { amount: Number(e.target.value || 0), currency: settings.price?.currency || 'USD' },
                  })
                }
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white"
              />
              <select
                value={settings.price?.currency || 'USD'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    price: { amount: settings.price?.amount || 0, currency: e.target.value },
                  })
                }
                className="rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="HUF">HUF</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-60"
          >
            {saving ? t('saving') : t('saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
}
