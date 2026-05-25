'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Alert,
  Button,
  Card,
  Container,
  Divider,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { StateBlock } from '@/app/components/patterns/StateBlock';
import {
  IconCheck,
  IconChevronLeft,
  IconClock,
  IconDeviceFloppy,
  IconGlobe,
  IconMail,
} from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';

interface EmailPreferences {
  receiveLessonEmails: boolean;
  emailFrequency: 'daily' | 'weekly' | 'never';
  preferredEmailTime?: number;
  timezone?: string;
}

export default function EmailSettingsPage() {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<EmailPreferences>({
    receiveLessonEmails: true,
    emailFrequency: 'daily',
    preferredEmailTime: 8,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timezoneOptions = useMemo(() => {
    const intlWithZones = Intl as unknown as { supportedValuesOf?: (key: string) => string[] };
    const zones = intlWithZones.supportedValuesOf?.('timeZone') || [Intl.DateTimeFormat().resolvedOptions().timeZone];
    return zones.map((timezone) => ({
      value: timezone,
      label: timezone.replace(/_/g, ' '),
    }));
  }, []);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (data.success && data.player?.emailPreferences) {
          setPreferences({
            receiveLessonEmails: data.player.emailPreferences.receiveLessonEmails ?? true,
            emailFrequency: data.player.emailPreferences.emailFrequency || 'daily',
            preferredEmailTime: data.player.emailPreferences.preferredEmailTime ?? 8,
            timezone: data.player.emailPreferences.timezone || data.player.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        }
      } catch (loadError) {
        console.error('Failed to load email preferences:', loadError);
        setError('Failed to load email preferences');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [session]);

  const handleSave = async () => {
    if (!session?.user) return;

    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailPreferences: preferences }),
      });

      const data = await response.json();

      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || 'Failed to save preferences');
      }
    } catch (saveError) {
      console.error('Failed to save preferences:', saveError);
      setError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <StateBlock kind="loading" title="Loading email settings..." />
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <Button component={LocaleLink} href="/dashboard" variant="default" leftSection={<IconChevronLeft size={18} />}>
            Back to Dashboard
          </Button>
          <Stack gap={4} align="flex-end">
            <Title order={1}>Email Settings</Title>
            <Text c="dimmed">Control lesson delivery and scheduling.</Text>
          </Stack>
        </Group>

        <Card withBorder p="lg">
          <Stack gap="lg">
            {error && (
              <Alert color="red" variant="light" icon={<IconMail size={18} />}>
                {error}
              </Alert>
            )}

            <Switch
              checked={preferences.receiveLessonEmails}
              onChange={(event) => setPreferences({
                ...preferences,
                receiveLessonEmails: event.currentTarget.checked,
              })}
              label="Receive Lesson Emails"
              description="Get daily lesson emails delivered to your inbox"
              size="md"
              thumbIcon={<IconMail size={14} />}
            />

            {preferences.receiveLessonEmails && (
              <Stack gap="lg">
                <Select
                  label="Email Frequency"
                  description="How often you want to receive lesson emails"
                  value={preferences.emailFrequency}
                  onChange={(value) => setPreferences({
                    ...preferences,
                    emailFrequency: (value || 'daily') as EmailPreferences['emailFrequency'],
                  })}
                  data={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly Summary' },
                    { value: 'never', label: 'Never' },
                  ]}
                />

                <NumberInput
                  label="Preferred Email Time"
                  description="Hour of day from 0 to 23 when you prefer to receive emails."
                  min={0}
                  max={23}
                  value={preferences.preferredEmailTime}
                  onChange={(value) => setPreferences({
                    ...preferences,
                    preferredEmailTime: typeof value === 'number' ? value : 8,
                  })}
                  leftSection={<IconClock size={18} />}
                />

                <Select
                  label="Timezone"
                  description="Your timezone for email delivery scheduling"
                  value={preferences.timezone}
                  onChange={(value) => setPreferences({
                    ...preferences,
                    timezone: value || Intl.DateTimeFormat().resolvedOptions().timeZone,
                  })}
                  data={timezoneOptions}
                  searchable
                  leftSection={<IconGlobe size={18} />}
                />
              </Stack>
            )}

            <Divider />

            <Group justify="space-between">
              {saved ? (
                <Group gap="xs">
                  <ThemeIcon color="green" variant="light">
                    <IconCheck size={18} />
                  </ThemeIcon>
                  <Text fw={600}>Saved!</Text>
                </Group>
              ) : (
                <Text c="dimmed" size="sm">Changes are saved to your profile.</Text>
              )}
              <Button
                leftSection={<IconDeviceFloppy size={18} />}
                loading={saving}
                onClick={handleSave}
              >
                Save Preferences
              </Button>
            </Group>

            <Divider />

            <Stack gap={4}>
              <Text size="sm" c="dimmed">Don&apos;t want to receive emails anymore?</Text>
              <Button component={LocaleLink} href="/api/email/unsubscribe" variant="subtle" w="fit-content">
                Unsubscribe from all lesson emails
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
