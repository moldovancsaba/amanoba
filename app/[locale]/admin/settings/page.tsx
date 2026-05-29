/**
 * Admin Settings Page
 *
 * What: Platform configuration and settings.
 * Why: Allows admins to configure system-wide settings.
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Checkbox,
  FileButton,
  Group,
  Image,
  Loader,
  NumberInput,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { AdminPageHeader } from '@/app/components/patterns/AdminPageHeader';
import { notifications } from '@mantine/notifications';
import {
  IconAward,
  IconCheck,
  IconDatabase,
  IconGlobe,
  IconImageInPicture,
  IconMail,
  IconSettings,
  IconShield,
  IconUpload,
} from '@tabler/icons-react';

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
  gmailClientIdConfigured?: boolean;
  gmailSenderEmail?: string | null;
  mailgunDomain?: string | null;
}

interface I18nSettings {
  supportedLanguages: string[];
  defaultLanguage: string;
}

const ADMIN_LANGUAGE_OPTIONS = [
  { code: 'hu', labelKey: 'hungarian' },
  { code: 'en', labelKey: 'english' },
];

const currencyOptions = ['USD', 'EUR', 'HUF'].map((currency) => ({ value: currency, label: currency }));

export default function AdminSettingsPage() {
  const t = useTranslations('admin');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [defaultThumbnail, setDefaultThumbnail] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [mailSettings, setMailSettings] = useState<MailSettings | null>(null);
  const [mailSettingsLoading, setMailSettingsLoading] = useState(true);
  const [mailSettingsError, setMailSettingsError] = useState<string | null>(null);
  const [certSettings, setCertSettings] = useState<CertSettings | null>(null);
  const [certSettingsLoading, setCertSettingsLoading] = useState(true);
  const [certSaving, setCertSaving] = useState(false);
  const [i18nSettings, setI18nSettings] = useState<I18nSettings | null>(null);
  const [i18nLoading, setI18nLoading] = useState(true);
  const [i18nError, setI18nError] = useState<string | null>(null);

  useEffect(() => {
    void fetchDefaultThumbnail();
    void fetchCertificationSettings();
    void fetchMailSettings();
    void fetchI18nSettings();
  }, []);

  const notifySuccess = (message: string) => notifications.show({ color: 'green', title: 'Saved', message });
  const notifyError = (message: string) => notifications.show({ color: 'red', title: 'Error', message });

  const fetchCertificationSettings = async () => {
    try {
      setCertSettingsLoading(true);
      const response = await fetch('/api/admin/certification/settings');
      const data = await response.json();
      if (data.success && data.settings) setCertSettings(data.settings as CertSettings);
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
        notifySuccess('Certification settings saved successfully.');
      } else {
        notifyError(data.error || 'Failed to save certification settings.');
      }
    } catch (error) {
      console.error('Failed to save certification settings:', error);
      notifyError('Failed to save certification settings. Please try again.');
    } finally {
      setCertSaving(false);
    }
  };

  const fetchDefaultThumbnail = async () => {
    try {
      const response = await fetch('/api/admin/settings/default-thumbnail');
      const data = await response.json();
      if (data.success && data.thumbnail) setDefaultThumbnail(data.thumbnail);
    } catch (error) {
      console.error('Failed to fetch default thumbnail:', error);
    }
  };

  const handleUploadDefaultThumbnail = async (file: File | null) => {
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

      if (!data.success) {
        notifyError(data.error || 'Failed to upload image.');
        return;
      }

      const saveResponse = await fetch('/api/admin/settings/default-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thumbnail: data.url }),
      });
      const saveData = await saveResponse.json();
      if (saveData.success) {
        setDefaultThumbnail(data.url);
        notifySuccess('Default course thumbnail saved successfully.');
      } else {
        notifyError('Failed to save default thumbnail.');
      }
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      notifyError('Failed to upload image. Please try again.');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleRemoveDefaultThumbnail = async () => {
    try {
      const response = await fetch('/api/admin/settings/default-thumbnail', { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setDefaultThumbnail(null);
        notifySuccess('Default thumbnail removed.');
      } else {
        notifyError('Failed to remove default thumbnail.');
      }
    } catch (error) {
      console.error('Failed to remove thumbnail:', error);
      notifyError('Failed to remove default thumbnail.');
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

  const fetchI18nSettings = async () => {
    setI18nLoading(true);
    setI18nError(null);
    try {
      const response = await fetch('/api/admin/settings/i18n');
      const data = await response.json();
      if (response.ok && data.success && data.settings) {
        setI18nSettings(data.settings as I18nSettings);
      } else {
        setI18nError(data.error || 'Failed to load language settings');
      }
    } catch (error) {
      console.error('Failed to fetch i18n settings:', error);
      setI18nError('Failed to load language settings');
    } finally {
      setI18nLoading(false);
    }
  };

  const updateSupportedLanguage = (code: string, checked: boolean) => {
    if (!i18nSettings) return;
    const current = new Set(i18nSettings.supportedLanguages);
    if (checked) current.add(code);
    else current.delete(code);

    const nextSupported = Array.from(current);
    if (nextSupported.length === 0) return;
    const nextDefault = nextSupported.includes(i18nSettings.defaultLanguage)
      ? i18nSettings.defaultLanguage
      : nextSupported[0];

    setI18nSettings({ supportedLanguages: nextSupported, defaultLanguage: nextDefault });
  };

  const getLanguageLabel = (code: string) => {
    const option = ADMIN_LANGUAGE_OPTIONS.find((item) => item.code === code);
    return option ? t(option.labelKey) : code.toUpperCase();
  };

  const handleSave = async () => {
    if (!i18nSettings) return;
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings/i18n', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supportedLanguages: i18nSettings.supportedLanguages,
          defaultLanguage: i18nSettings.defaultLanguage,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        notifyError(data.error || 'Failed to save language settings.');
        return;
      }
      setI18nSettings(data.settings as I18nSettings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save i18n settings:', error);
      notifyError('Failed to save language settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const languageOptions = (i18nSettings?.supportedLanguages || ADMIN_LANGUAGE_OPTIONS.map((item) => item.code))
    .map((code) => ({ value: code, label: `${getLanguageLabel(code)} (${code})` }));

  return (
    <Stack gap="lg">
      <AdminPageHeader
        title={t('settingsTitle')}
        description={t('settingsDescription')}
      />

      <SettingsCard icon={<IconSettings size={22} />} title={t('generalSettings')}>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <TextInput label={t('platformName')} defaultValue="Amanoba" />
          <Select
            label={t('defaultLanguage')}
            data={languageOptions}
            value={i18nSettings?.defaultLanguage || 'en'}
            onChange={(value) => {
              if (!i18nSettings || !value) return;
              setI18nSettings({ ...i18nSettings, defaultLanguage: value });
            }}
            disabled={i18nLoading || !i18nSettings}
            allowDeselect={false}
          />
        </SimpleGrid>
      </SettingsCard>

      <SettingsCard icon={<IconDatabase size={22} />} title={t('database')}>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Stack gap={6}>
            <Text size="sm" fw={600}>{t('connectionStatus')}</Text>
            <Group gap="xs">
              <Badge color="green" leftSection={<IconCheck size={12} />}>{t('connected')}</Badge>
            </Group>
          </Stack>
          <TextInput label={t('databaseName')} value="amanoba" readOnly disabled />
        </SimpleGrid>
      </SettingsCard>

      <SettingsCard
        icon={<IconMail size={22} />}
        title={t('emailConfiguration')}
        aside={mailSettingsLoading ? <Loader size="sm" color="amanobaYellow" /> : undefined}
      >
        {mailSettingsLoading ? (
          <Text c="dimmed">{t('loading')}</Text>
        ) : mailSettings ? (
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <TextInput label={t('emailProvider')} value={mailSettings.emailProvider} readOnly />
              <TextInput label={t('fromEmail')} value={mailSettings.emailFrom || ''} readOnly />
              <TextInput label={t('fromName')} value={mailSettings.emailFromName || ''} readOnly />
              <TextInput label={t('replyTo')} value={mailSettings.emailReplyTo || ''} readOnly />
            </SimpleGrid>
            {mailSettings.emailProvider === 'gmail' && (
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <TextInput
                  label="Gmail sender"
                  value={mailSettings.gmailSenderEmail || mailSettings.emailFrom || ''}
                  readOnly
                />
                <TextInput
                  label="Gmail OAuth client"
                  value={mailSettings.gmailClientIdConfigured ? 'Configured' : 'Missing'}
                  readOnly
                />
              </SimpleGrid>
            )}
            {mailSettings.mailgunDomain && (
              <TextInput label={t('mailgunDomain')} value={mailSettings.mailgunDomain} readOnly />
            )}
          </Stack>
        ) : (
          <Alert color="red">{mailSettingsError || t('emailSettingsError')}</Alert>
        )}
        <Text size="sm" c="dimmed">
          {t('emailProviderNote')}{' '}
          <Anchor
            href="https://github.com/moldovancsaba/amanoba/blob/main/docs/ENVIRONMENT_SETUP.md"
            target="_blank"
            rel="noreferrer"
          >
            {t('emailProviderDocs')}
          </Anchor>
        </Text>
      </SettingsCard>

      <SettingsCard icon={<IconShield size={22} />} title={t('security')}>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <PasswordInput label={t('adminPassword')} placeholder="********" />
          <NumberInput label={t('sessionTimeout')} defaultValue={30} min={1} max={1440} />
        </SimpleGrid>
      </SettingsCard>

      <SettingsCard icon={<IconGlobe size={22} />} title={t('internationalization')}>
        {i18nLoading ? (
          <Text c="dimmed">{t('loading')}</Text>
        ) : i18nSettings ? (
          <Stack gap="md">
            <Stack gap="xs">
              <Text size="sm" fw={600}>{t('supportedLanguages')}</Text>
              <Group>
                {Array.from(new Set([
                  ...ADMIN_LANGUAGE_OPTIONS.map((option) => option.code),
                  ...i18nSettings.supportedLanguages,
                ])).map((code) => {
                  const checked = i18nSettings.supportedLanguages.includes(code);
                  const isOnlyOne = checked && i18nSettings.supportedLanguages.length === 1;
                  return (
                    <Checkbox
                      key={code}
                      checked={checked}
                      disabled={isOnlyOne}
                      onChange={(event) => updateSupportedLanguage(code, event.currentTarget.checked)}
                      label={`${getLanguageLabel(code)} (${code})`}
                    />
                  );
                })}
              </Group>
            </Stack>
            <Select
              label={t('defaultLocale')}
              data={i18nSettings.supportedLanguages.map((code) => ({ value: code, label: `${getLanguageLabel(code)} (${code})` }))}
              value={i18nSettings.defaultLanguage}
              onChange={(value) => {
                if (!value) return;
                setI18nSettings({ ...i18nSettings, defaultLanguage: value });
              }}
              allowDeselect={false}
            />
          </Stack>
        ) : (
          <Alert color="red">{i18nError || 'Failed to load language settings'}</Alert>
        )}
      </SettingsCard>

      <SettingsCard icon={<IconAward size={22} />} title="Certification Settings">
        {certSettingsLoading ? (
          <Group justify="center" py="xl">
            <Loader color="amanobaYellow" />
            <Text c="dimmed">Loading certification settings...</Text>
          </Group>
        ) : certSettings ? (
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <NumberInput
                label="Default Price (Money)"
                value={certSettings.priceMoney?.amount || 0}
                min={0}
                onChange={(value) => setCertSettings({
                  ...certSettings,
                  priceMoney: {
                    ...certSettings.priceMoney,
                    amount: typeof value === 'number' ? value : Number(value) || 0,
                    currency: certSettings.priceMoney?.currency || 'USD',
                  },
                })}
              />
              <Select
                label="Currency"
                data={currencyOptions}
                value={certSettings.priceMoney?.currency || 'USD'}
                onChange={(value) => setCertSettings({
                  ...certSettings,
                  priceMoney: {
                    ...certSettings.priceMoney,
                    amount: certSettings.priceMoney?.amount || 0,
                    currency: value || 'USD',
                  },
                })}
                allowDeselect={false}
              />
            </SimpleGrid>
            <NumberInput
              label="Default Price (Points)"
              value={certSettings.pricePoints || 0}
              min={0}
              onChange={(value) => setCertSettings({
                ...certSettings,
                pricePoints: typeof value === 'number' ? value : Number(value) || 0,
              })}
            />
            <SimpleGrid cols={{ base: 1, md: 3 }}>
              <TextInput
                label="Template ID"
                value={certSettings.templateId || 'default_v1'}
                onChange={(event) => setCertSettings({ ...certSettings, templateId: event.currentTarget.value })}
              />
              <TextInput
                label="Credential ID"
                value={certSettings.credentialId || 'CERT'}
                onChange={(event) => setCertSettings({ ...certSettings, credentialId: event.currentTarget.value })}
              />
              <TextInput
                label="Completion Phrase ID"
                value={certSettings.completionPhraseId || 'completion_final_exam'}
                onChange={(event) => setCertSettings({ ...certSettings, completionPhraseId: event.currentTarget.value })}
              />
            </SimpleGrid>
            <Group justify="flex-end">
              <Button leftSection={<IconCheck size={18} />} onClick={handleSaveCertSettings} loading={certSaving}>
                Save Certification Settings
              </Button>
            </Group>
          </Stack>
        ) : (
          <Alert color="red">Failed to load certification settings</Alert>
        )}
      </SettingsCard>

      <SettingsCard icon={<IconImageInPicture size={22} />} title="Course Settings">
        <Stack gap="md">
          <Text size="sm" fw={600}>Default Course Thumbnail</Text>
          {defaultThumbnail && (
            <Card padding={0} withBorder>
              <Image src={defaultThumbnail} alt="Default course thumbnail" h={240} fit="cover" />
              <Group justify="flex-end" p="sm">
                <Button color="red" variant="light" onClick={() => void handleRemoveDefaultThumbnail()}>
                  Remove
                </Button>
              </Group>
            </Card>
          )}
          <Group>
            <FileButton
              onChange={(file) => void handleUploadDefaultThumbnail(file)}
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            >
              {(props) => (
                <Button {...props} leftSection={<IconUpload size={18} />} loading={uploadingThumbnail}>
                  {defaultThumbnail ? 'Change Default Thumbnail' : 'Upload Default Thumbnail'}
                </Button>
              )}
            </FileButton>
          </Group>
          <Text size="xs" c="dimmed">
            This thumbnail will be used for courses that do not have their own thumbnail image. JPEG, PNG, WebP, or GIF, max 10MB.
          </Text>
        </Stack>
      </SettingsCard>

      <Group justify="flex-end">
        {saved && (
          <Badge color="green" leftSection={<IconCheck size={12} />}>{t('settingsSaved')}</Badge>
        )}
        <Button
          leftSection={<IconCheck size={18} />}
          onClick={handleSave}
          loading={saving}
          disabled={i18nLoading || !i18nSettings}
        >
          {saving ? t('saving') : t('saveSettings')}
        </Button>
      </Group>
    </Stack>
  );
}

function SettingsCard({
  icon,
  title,
  aside,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card padding="lg">
      <Stack gap="md">
        <Group justify="space-between">
          <Group>
            <ThemeIcon color="amanobaYellow" variant="light">{icon}</ThemeIcon>
            <Title order={2} size="h3">{title}</Title>
          </Group>
          {aside}
        </Group>
        {children}
      </Stack>
    </Card>
  );
}
