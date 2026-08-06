/**
 * Version Display Component
 * 
 * What: Shows current app version and last updated timestamp
 * Why: Helps users identify if they're seeing the latest version
 */

'use client';

import { useEffect, useState } from 'react';
import { Text, Group, Tooltip, Badge } from '@mantine/core';
import { IconClock, IconGitBranch } from '@tabler/icons-react';

interface VersionData {
  version: string;
  buildTime: string;
  commitSha?: string;
  branch?: string;
  environment?: string;
}

export function VersionDisplay({ compact = false }: { compact?: boolean }) {
  const [versionData, setVersionData] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/version')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVersionData(data.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch version:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !versionData) {
    return null;
  }

  const buildDate = new Date(versionData.buildTime);
  const formattedDate = buildDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = buildDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (compact) {
    return (
      <Tooltip
        label={
          <div>
            <div>Version: {versionData.version}</div>
            <div>Updated: {formattedDate} at {formattedTime}</div>
            {versionData.commitSha && <div>Commit: {versionData.commitSha}</div>}
          </div>
        }
        position="top"
      >
        <Badge
          variant="light"
          color="gray"
          size="xs"
          style={{ cursor: 'help' }}
        >
          v{versionData.version}
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Group gap="xs" wrap="nowrap">
      <Text size="xs" c="dimmed">
        v{versionData.version}
      </Text>
      <Text size="xs" c="dimmed">•</Text>
      <Tooltip label={`${formattedDate} at ${formattedTime}`}>
        <Group gap={4}>
          <IconClock size={12} />
          <Text size="xs" c="dimmed">
            {formattedDate}
          </Text>
        </Group>
      </Tooltip>
      {versionData.commitSha && versionData.commitSha !== 'local' && (
        <>
          <Text size="xs" c="dimmed">•</Text>
          <Tooltip label={`Commit: ${versionData.commitSha}`}>
            <Group gap={4}>
              <IconGitBranch size={12} />
              <Text size="xs" c="dimmed" ff="monospace">
                {versionData.commitSha}
              </Text>
            </Group>
          </Tooltip>
        </>
      )}
    </Group>
  );
}
