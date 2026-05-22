/**
 * Admin Feature Flags Management Page
 *
 * What: Manage which features are enabled on the platform.
 * Why: Allows admins to control what users can access.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { IconDeviceFloppy, IconRefresh } from '@tabler/icons-react';

interface FeatureFlags {
  _id?: string;
  features: {
    courses: boolean;
    myCourses: boolean;
    games: boolean;
    stats: boolean;
    leaderboards: boolean;
    challenges: boolean;
    quests: boolean;
    achievements: boolean;
    rewards: boolean;
  };
}

export default function AdminFeatureFlagsPage() {
  const _locale = useLocale();
  const _t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchFeatureFlags = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/feature-flags');
      const data = await response.json();

      if (data.success) {
        setFeatureFlags(data.featureFlags);
      }
    } catch (error) {
      console.error('Failed to fetch feature flags:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFeatureFlags();
  }, [fetchFeatureFlags]);

  const handleToggle = (feature: keyof FeatureFlags['features']) => {
    if (!featureFlags) return;
    setFeatureFlags({
      ...featureFlags,
      features: {
        ...featureFlags.features,
        [feature]: !featureFlags.features[feature],
      },
    });
  };

  const handleSave = async () => {
    if (!featureFlags) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/feature-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: featureFlags.features }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Feature flags updated successfully!');
        void fetchFeatureFlags();
      } else {
        alert(data.error || 'Failed to update feature flags');
      }
    } catch (error) {
      console.error('Failed to save feature flags:', error);
      alert('Failed to save feature flags');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Center mih={400}>
        <Loader />
      </Center>
    );
  }

  if (!featureFlags) {
    return (
      <Center mih={400}>
        <Text>{tCommon('error')}</Text>
      </Center>
    );
  }

  const featureLabels: Record<keyof FeatureFlags['features'], string> = {
    courses: 'Courses',
    myCourses: 'My Courses',
    games: 'Games',
    stats: 'Stats',
    leaderboards: 'Leaderboards',
    challenges: 'Challenges',
    quests: 'Quests',
    achievements: 'Achievements',
    rewards: 'Rewards',
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>Feature Flags</Title>
          <Text c="dimmed">Control which features are enabled on amanoba.com</Text>
        </div>
        <Button variant="default" leftSection={<IconRefresh size={18} />} onClick={fetchFeatureFlags}>
          Refresh
        </Button>
      </Group>

      <Card withBorder>
        <Stack gap="md">
          {(Object.keys(featureFlags.features) as Array<keyof FeatureFlags['features']>).map((feature) => (
            <Card key={feature} withBorder>
              <Group justify="space-between" align="center">
                <div>
                  <Title order={3}>{featureLabels[feature]}</Title>
                  <Text c="dimmed" size="sm">
                    {featureFlags.features[feature] ? 'Enabled' : 'Disabled'}
                  </Text>
                </div>
                <Switch
                  checked={featureFlags.features[feature]}
                  onChange={() => handleToggle(feature)}
                  aria-label={`Toggle ${featureLabels[feature]}`}
                />
              </Group>
            </Card>
          ))}
        </Stack>
      </Card>

      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={18} />}
          onClick={handleSave}
          loading={saving}
        >
          Save Changes
        </Button>
      </Group>
    </Stack>
  );
}
