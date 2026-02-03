/**
 * Admin Settings Page
 * 
 * What: Platform configuration and settings
 * Why: Allows admins to configure system-wide settings
 */

'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Save,
  Settings,
  Database,
  Mail,
  Shield,
  Globe,
  Image as ImageIcon,
  Upload,
  Award,
} from 'lucide-react';
import Image from 'next/image';

interface CertPriceMoney {
  amount?: number;
  currency?: string;
}

interface CertSettings {
  priceMoney?: CertPriceMoney;
  pricePoints?: number;
  templateId?: string;
  credentialId?: string;
  completionPhraseId?: string;
  deliverableBulletIds?: string[];
  backgroundUrl?: string;
}

interface MailSettings {
  emailProvider: string;
  emailFrom?: string;
  emailFromName?: string;
  emailReplyTo?: string;
  smtpHost?: string | null;
  smtpPort?: string | null;
  smtpSecure?: string | null;
  mailgunDomain?: string | null;
}

export default function AdminSettingsPage() {
  const _locale = useLocale();
  const t = useTranslations('admin');
  const _tCommon = useTranslations('common');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [defaultThumbnail, setDefaultThumbnail] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [mailSettings, setMailSettings] = useState<MailSettings | null>(null);
  const [mailSettingsLoading, setMailSettingsLoading] = useState(true);
  const [mailSettingsError, setMailSettingsError] = useState<string | null>(null);
  
  // Certification settings state
  const [certSettings, setCertSettings] = useState<CertSettings | null>(null);
  const [certSettingsLoading, setCertSettingsLoading] = useState(true);
  const [certSaving, setCertSaving] = useState(false);

  useEffect(() => {
    fetchDefaultThumbnail();
    fetchCertificationSettings();
    fetchMailSettings();
  }, []);

  const fetchCertificationSettings = async () => {
    try {
      setCertSettingsLoading(true);
      const response = await fetch('/api/admin/certification/settings');
      const data = await response.json();
      if (data.success && data.settings) {
        setCertSettings(data.settings as CertSettings);
      }
    } catch (error) {
      console.error('Failed to fetch certification settings:', error);
    } finally {
      setCertSettingsLoading(false);
    }
  };

  const handleSaveCertSettings = async () => {
    if (!certSettings) return;

    try {
      setCertSaving(true);
      const response = await fetch('/api/admin/certification/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceMoney: certSettings.priceMoney,
          pricePoints: certSettings.pricePoints,
          templateId: certSettings.templateId,
          credentialId: certSettings.credentialId,
          completionPhraseId: certSettings.completionPhraseId,
          deliverableBulletIds: certSettings.deliverableBulletIds || [],
          backgroundUrl: certSettings.backgroundUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCertSettings(data.settings as CertSettings);
        alert('Certification settings saved successfully!');
      } else {
        alert(data.error || 'Failed to save certification settings');
      }
    } catch (error) {
      console.error('Failed to save certification settings:', error);
      alert('Failed to save certification settings. Please try again.');
    } finally {
      setCertSaving(false);
    }
  };

  const fetchDefaultThumbnail = async () => {
    try {
      const response = await fetch('/api/admin/settings/default-thumbnail');
      const data = await response.json();
      if (data.success && data.thumbnail) {
        setDefaultThumbnail(data.thumbnail);
      }
    } catch (error) {
      console.error('Failed to fetch default thumbnail:', error);
    }
  };

  const handleUploadDefaultThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingThumbnail(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Save to settings
        const saveResponse = await fetch('/api/admin/settings/default-thumbnail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thumbnail: data.url }),
        });

        const saveData = await saveResponse.json();
        if (saveData.success) {
          setDefaultThumbnail(data.url);
          alert('Default course thumbnail saved successfully!');
        } else {
          alert('Failed to save default thumbnail');
        }
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingThumbnail(false);
      e.target.value = '';
    }
  };

  const fetchMailSettings = async () => {
    setMailSettingsLoading(true);
    try {
      const response = await fetch('/api/admin/settings/email-config');
      const data = await response.json();
      if (response.ok && data.success && data.settings) {
        setMailSettings(data.settings as MailSettings);
        setMailSettingsError(null);
      } else {
        setMailSettings(null);
        setMailSettingsError(data.error || 'Failed to load mail settings');
      }
    } catch (error) {
      console.error('Failed to fetch mail settings:', error);
      setMailSettingsError('Failed to load mail settings');
    } finally {
      setMailSettingsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement settings save
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('settingsTitle')}</h1>
        <p className="text-gray-400">{t('settingsDescription')}</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-white">{t('generalSettings')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('platformName')}
              </label>
              <input
                type="text"
                defaultValue="Amanoba"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('defaultLanguage')}
              </label>
              <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                <option value="hu">{t('hungarian')}</option>
                <option value="en">{t('english')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-white">{t('database')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('connectionStatus')}
              </label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">{t('connected')}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('databaseName')}
              </label>
              <input
                type="text"
                defaultValue="amanoba"
                disabled
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold text-white">{t('emailConfiguration')}</h2>
            </div>
            {mailSettingsLoading && (
              <span className="text-sm text-gray-400">{t('loading')}</span>
            )}
          </div>
          <div className="space-y-4">
            {mailSettingsLoading ? (
              <p className="text-sm text-gray-400">{t('loading')}</p>
            ) : mailSettings ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('emailProvider')}
                  </label>
                  <input
                    type="text"
                    value={mailSettings.emailProvider}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('fromEmail')}
                  </label>
                  <input
                    type="text"
                    value={mailSettings.emailFrom || ''}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('fromName')}
                    </label>
                    <input
                      type="text"
                      value={mailSettings.emailFromName || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('replyTo')}
                    </label>
                    <input
                      type="text"
                      value={mailSettings.emailReplyTo || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                {mailSettings.smtpHost && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('smtpHost')}
                      </label>
                      <input
                        type="text"
                        value={mailSettings.smtpHost}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('smtpPort')}
                      </label>
                      <input
                        type="text"
                        value={mailSettings.smtpPort || ''}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('smtpSecure')}
                      </label>
                      <input
                        type="text"
                        value={mailSettings.smtpSecure || ''}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
                {mailSettings.mailgunDomain && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('mailgunDomain')}
                    </label>
                    <input
                      type="text"
                      value={mailSettings.mailgunDomain}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-red-400">
                {mailSettingsError || t('emailSettingsError')}
              </p>
            )}
            <p className="text-sm text-gray-400">
              {t('emailProviderNote')}{' '}
              <a
                href="https://github.com/moldovancsaba/amanoba/blob/main/docs/ENVIRONMENT_SETUP.md"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline"
              >
                {t('emailProviderDocs')}
              </a>
            </p>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-white">{t('security')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('adminPassword')}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('sessionTimeout')}
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Internationalization */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-white">{t('internationalization')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('supportedLanguages')}
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-white">{t('hungarian')} (hu)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-white">{t('english')} (en)</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('defaultLocale')}
              </label>
              <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                <option value="hu">{t('hungarian')}</option>
                <option value="en">{t('english')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Certification Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-white">Certification Settings</h2>
          </div>
          {certSettingsLoading ? (
            <div className="text-center py-8 text-gray-400">Loading certification settings...</div>
          ) : certSettings ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Price (Money)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={certSettings.priceMoney?.amount || 0}
                    onChange={(e) => setCertSettings({
                      ...certSettings,
                      priceMoney: {
                        ...certSettings.priceMoney,
                        amount: parseFloat(e.target.value) || 0,
                        currency: certSettings.priceMoney?.currency || 'USD',
                      },
                    })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                  <select
                    value={certSettings.priceMoney?.currency || 'USD'}
                    onChange={(e) => setCertSettings({
                      ...certSettings,
                      priceMoney: {
                        ...certSettings.priceMoney,
                        amount: certSettings.priceMoney?.amount || 0,
                        currency: e.target.value,
                      },
                    })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="HUF">HUF</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Price (Points)
                </label>
                <input
                  type="number"
                  value={certSettings.pricePoints || 0}
                  onChange={(e) => setCertSettings({
                    ...certSettings,
                    pricePoints: parseInt(e.target.value) || 0,
                  })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template ID
                </label>
                <input
                  type="text"
                  value={certSettings.templateId || 'default_v1'}
                  onChange={(e) => setCertSettings({
                    ...certSettings,
                    templateId: e.target.value,
                  })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="default_v1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={certSettings.credentialId || 'CERT'}
                  onChange={(e) => setCertSettings({
                    ...certSettings,
                    credentialId: e.target.value,
                  })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="CERT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Completion Phrase ID
                </label>
                <input
                  type="text"
                  value={certSettings.completionPhraseId || 'completion_final_exam'}
                  onChange={(e) => setCertSettings({
                    ...certSettings,
                    completionPhraseId: e.target.value,
                  })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="completion_final_exam"
                />
              </div>
              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={handleSaveCertSettings}
                  disabled={certSaving}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {certSaving ? 'Saving...' : 'Save Certification Settings'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">Failed to load certification settings</div>
          )}
        </div>

        {/* Course Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-white">Course Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Course Thumbnail
              </label>
              <div className="space-y-3">
                {defaultThumbnail && (
                  <div className="relative w-full h-48 bg-gray-700 rounded-lg overflow-hidden border-2 border-indigo-500">
                    <Image
                      src={defaultThumbnail}
                      alt="Default course thumbnail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 24rem"
                    />
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/admin/settings/default-thumbnail', {
                            method: 'DELETE',
                          });
                          const data = await response.json();
                          if (data.success) {
                            setDefaultThumbnail(null);
                            alert('Default thumbnail removed');
                          } else {
                            alert('Failed to remove default thumbnail');
                          }
                        } catch (error) {
                          console.error('Failed to remove thumbnail:', error);
                          alert('Failed to remove default thumbnail');
                        }
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <label className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors cursor-pointer w-fit disabled:opacity-50" style={{ pointerEvents: uploadingThumbnail ? 'none' : 'auto' }}>
                  <Upload className="w-5 h-5" />
                  {uploadingThumbnail ? 'Uploading...' : defaultThumbnail ? 'Change Default Thumbnail' : 'Upload Default Thumbnail'}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleUploadDefaultThumbnail}
                    disabled={uploadingThumbnail}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400">
                  This thumbnail will be used for courses that don&apos;t have their own thumbnail image. (JPEG, PNG, WebP, or GIF, max 10MB)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4 pt-4">
        {saved && (
          <div className="flex items-center gap-2 text-green-500">
            <span className="font-medium">{t('settingsSaved')}</span>
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? t('saving') : t('saveSettings')}
        </button>
      </div>
    </div>
  );
}
