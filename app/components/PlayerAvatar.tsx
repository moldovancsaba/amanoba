/**
 * Player Avatar Component
 *
 * Reusable Mantine avatar component for profile pictures, level badges,
 * premium indicators, and online status.
 */

'use client';

import Link from 'next/link';
import {
  Avatar,
  Box,
  Group,
  Indicator,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';

export interface PlayerAvatarProps {
  playerId: string;
  displayName: string;
  profilePicture?: string;
  level?: number;
  isPremium?: boolean;
  isOnline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLevel?: boolean;
  showPremium?: boolean;
  showOnline?: boolean;
  clickable?: boolean;
  className?: string;
}

const avatarSizes = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
} as const;

const levelBadgeSizes = {
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
} as const;

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function AvatarFrame({
  displayName,
  profilePicture,
  level,
  isPremium,
  isOnline,
  size,
  showLevel,
  showPremium,
  showOnline,
}: Required<Pick<PlayerAvatarProps, 'displayName' | 'size' | 'showLevel' | 'showPremium' | 'showOnline'>> &
  Pick<PlayerAvatarProps, 'profilePicture' | 'level' | 'isPremium' | 'isOnline'>) {
  const avatar = (
    <Indicator
      disabled={!showOnline || !isOnline}
      color="green"
      size={12}
      processing
      position="top-start"
      withBorder
    >
      <Indicator
        disabled={!showLevel || level === undefined}
        label={level}
        size={levelBadgeSizes[size]}
        position="bottom-end"
        color="violet"
        withBorder
      >
        <Avatar
          src={profilePicture}
          alt={displayName}
          size={avatarSizes[size]}
          radius="xl"
          color="yellow"
          variant="filled"
        >
          {getInitials(displayName)}
        </Avatar>
      </Indicator>
    </Indicator>
  );

  if (!showPremium || !isPremium) {
    return avatar;
  }

  return (
    <Indicator
      label={
        <ThemeIcon size="xs" radius="xl" color="yellow">
          <IconCrown size={12} />
        </ThemeIcon>
      }
      size={18}
      position="top-end"
      withBorder
    >
      {avatar}
    </Indicator>
  );
}

export default function PlayerAvatar({
  playerId,
  displayName,
  profilePicture,
  level,
  isPremium = false,
  isOnline = false,
  size = 'md',
  showLevel = true,
  showPremium = true,
  showOnline = false,
  clickable = true,
}: PlayerAvatarProps) {
  const avatarContent = (
    <AvatarFrame
      displayName={displayName}
      profilePicture={profilePicture}
      level={level}
      isPremium={isPremium}
      isOnline={isOnline}
      size={size}
      showLevel={showLevel}
      showPremium={showPremium}
      showOnline={showOnline}
    />
  );

  if (clickable) {
    return (
      <Box component={Link} href={`/profile/${playerId}`} title={`View ${displayName}'s profile`}>
        {avatarContent}
      </Box>
    );
  }

  return avatarContent;
}

export function PlayerAvatarWithName({
  playerId,
  displayName,
  profilePicture,
  level,
  isPremium = false,
  size = 'md',
  showLevel = true,
  namePosition = 'right',
  clickable = true,
}: PlayerAvatarProps & { namePosition?: 'top' | 'right' | 'bottom' }) {
  const avatar = (
    <PlayerAvatar
      playerId={playerId}
      displayName={displayName}
      profilePicture={profilePicture}
      level={level}
      isPremium={isPremium}
      size={size}
      showLevel={showLevel}
      clickable={false}
    />
  );

  const content =
    namePosition === 'right' ? (
      <Group gap="xs">
        {avatar}
        <Text fw={600}>{displayName}</Text>
      </Group>
    ) : (
      <Stack gap="xs" align="center">
        {namePosition === 'top' ? <Text fw={600}>{displayName}</Text> : null}
        {avatar}
        {namePosition === 'bottom' ? <Text fw={600}>{displayName}</Text> : null}
      </Stack>
    );

  if (clickable) {
    return (
      <Box component={Link} href={`/profile/${playerId}`}>
        {content}
      </Box>
    );
  }

  return content;
}

export function PlayerAvatarList({
  players,
  maxVisible = 5,
  size = 'sm',
}: {
  players: Array<{ playerId: string; displayName: string; profilePicture?: string; level?: number; isPremium?: boolean }>;
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const visiblePlayers = players.slice(0, maxVisible);
  const remainingCount = players.length - maxVisible;

  return (
    <Avatar.Group spacing="sm">
      {visiblePlayers.map((player) => (
        <PlayerAvatar
          key={player.playerId}
          {...player}
          size={size}
          showLevel={false}
          showPremium={false}
        />
      ))}
      {remainingCount > 0 ? <Avatar size={avatarSizes[size]}>+{remainingCount}</Avatar> : null}
    </Avatar.Group>
  );
}
