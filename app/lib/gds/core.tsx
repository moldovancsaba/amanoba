'use client';

import type { ReactNode } from 'react';
import type { ButtonVariant, MantineColor } from '@mantine/core';
import {
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconAlertCircle,
  IconArrowBackUp,
  IconArrowRight,
  IconChecklist,
  IconInfoCircle,
  IconLock,
  IconMoodEmpty,
  IconPlayerPlay,
  IconRefresh,
  IconRosetteDiscountCheck,
  IconToggleLeft,
  IconUserCircle,
} from '@tabler/icons-react';

export interface MetricCardProps {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  trend?: {
    label: string;
    tone?: 'positive' | 'negative' | 'neutral';
  };
  icon?: ReactNode;
  footer?: ReactNode;
}

type MetricTrendTone = NonNullable<NonNullable<MetricCardProps['trend']>['tone']>;

const trendColors: Record<MetricTrendTone, string> = {
  positive: 'teal',
  negative: 'red',
  neutral: 'gray',
};

export function MetricCard({ label, value, description, trend, icon, footer }: MetricCardProps) {
  return (
    <Card withBorder radius="lg" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={4}>
            <Text size="sm" c="dimmed" fw={600}>
              {label}
            </Text>
            <Title order={3}>{value}</Title>
          </Stack>
          {icon ? (
            <ThemeIcon variant="light" size="xl" radius="xl" aria-hidden>
              {icon}
            </ThemeIcon>
          ) : null}
        </Group>

        {(description || trend) ? (
          <Group justify="space-between" align="center" gap="sm">
            {description ? (
              <Text size="sm" c="dimmed" flex={1}>
                {description}
              </Text>
            ) : (
              <span />
            )}
            {trend ? (
              <Badge color={trendColors[trend.tone ?? 'neutral']} variant="light">
                {trend.label}
              </Badge>
            ) : null}
          </Group>
        ) : null}

        {footer}
      </Stack>
    </Card>
  );
}

export interface ProgressCardProps {
  label: string;
  value: ReactNode;
  progress: number;
  progressLabel?: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function ProgressCard({
  label,
  value,
  progress,
  progressLabel,
  description,
  action,
}: ProgressCardProps) {
  return (
    <Card withBorder radius="lg" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text size="sm" c="dimmed" fw={600}>
              {label}
            </Text>
            <Title order={3}>{value}</Title>
          </Stack>
          {action}
        </Group>

        {description ? (
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        ) : null}

        <Stack gap={6}>
          <Group justify="space-between" gap="sm">
            <Text size="sm" fw={500}>
              {progressLabel ?? 'Progress'}
            </Text>
            <Text size="sm" c="dimmed">
              {Math.round(progress)}%
            </Text>
          </Group>
          <Progress value={progress} radius="xl" size="md" />
        </Stack>
      </Stack>
    </Card>
  );
}

export type StateBlockVariant =
  | 'loading'
  | 'empty'
  | 'error'
  | 'permission'
  | 'disabled'
  | 'success'
  | 'info'
  | 'not-enough-data';

export interface StateBlockProps {
  variant: StateBlockVariant;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  compact?: boolean;
}

const stateBlockConfig: Record<StateBlockVariant, { color: string; icon: ReactNode }> = {
  loading: { color: 'violet', icon: <Loader size="sm" /> },
  empty: { color: 'gray', icon: <IconMoodEmpty size="1.1rem" /> },
  error: { color: 'red', icon: <IconAlertCircle size="1.1rem" /> },
  permission: { color: 'orange', icon: <IconLock size="1.1rem" /> },
  disabled: { color: 'gray', icon: <IconToggleLeft size="1.1rem" /> },
  success: { color: 'teal', icon: <IconRosetteDiscountCheck size="1.1rem" /> },
  info: { color: 'blue', icon: <IconInfoCircle size="1.1rem" /> },
  'not-enough-data': { color: 'yellow', icon: <IconChecklist size="1.1rem" /> },
};

export function StateBlock({
  variant,
  title,
  description,
  action,
  icon,
  compact = false,
}: StateBlockProps) {
  const config = stateBlockConfig[variant];

  return (
    <Stack
      align={compact ? 'flex-start' : 'center'}
      justify="center"
      gap="md"
      py={compact ? 'md' : 'xl'}
      ta={compact ? 'left' : 'center'}
    >
      <ThemeIcon variant="light" color={config.color} size={compact ? 'lg' : 'xl'} radius="xl">
        {icon ?? config.icon}
      </ThemeIcon>
      <Stack gap={6} align={compact ? 'flex-start' : 'center'}>
        <Title order={compact ? 4 : 3}>{title}</Title>
        {description ? (
          <Text c="dimmed" maw={compact ? undefined : 480}>
            {description}
          </Text>
        ) : null}
      </Stack>
      {action}
    </Stack>
  );
}

export interface GameBoardTileProps {
  face: ReactNode;
  revealed: boolean;
  matched: boolean;
  disabled: boolean;
  onPress: () => void;
  highlightColor?: MantineColor;
}

export function GameBoardTile({
  face,
  revealed,
  matched,
  disabled,
  onPress,
  highlightColor,
}: GameBoardTileProps) {
  const theme = useMantineTheme();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const highlighted = revealed && !matched;
  const revealBg =
    highlightColor ??
    (typeof theme.primaryColor === 'string' ? `${theme.primaryColor}.5` : 'violet.5');

  return (
    <UnstyledButton w="100%" disabled={disabled} onClick={onPress} aria-pressed={revealed}>
      <Paper
        withBorder
        radius="md"
        p="md"
        bg={revealed ? revealBg : 'dark.6'}
        styles={{
          root: {
            aspectRatio: '1',
            opacity: matched ? 0.55 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: reduceMotion
              ? 'opacity 0.2s ease'
              : 'transform 0.25s ease, background-color 0.25s ease, opacity 0.25s ease',
            transform: reduceMotion || !highlighted ? 'scale(1)' : 'scale(1.02)',
          },
        }}
      >
        <Center h="100%">
          <Text size="xl" fw={700}>
            {face}
          </Text>
        </Center>
      </Paper>
    </UnstyledButton>
  );
}

export type AccessRecoveryState =
  | 'unauthenticated'
  | 'expired-session'
  | 'forbidden'
  | 'missing'
  | 'unavailable';

export interface AccessRecoveryAction {
  action: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
  variant?: ButtonVariant;
}

export interface AccessRecoveryPanelProps {
  state: AccessRecoveryState;
  title?: string;
  description?: ReactNode;
  primaryAction?: AccessRecoveryAction | null;
  secondaryAction?: AccessRecoveryAction | null;
  tertiaryAction?: AccessRecoveryAction | null;
  onRetry?: () => void;
  onSignIn?: () => void;
  onBack?: () => void;
  supportAction?: AccessRecoveryAction | null;
  compact?: boolean;
}

const accessStateVariant: Record<AccessRecoveryState, 'permission' | 'error' | 'info'> = {
  unauthenticated: 'permission',
  'expired-session': 'info',
  forbidden: 'permission',
  missing: 'error',
  unavailable: 'error',
};

const accessCopy: Record<AccessRecoveryState, { title: string; description: string }> = {
  unauthenticated: {
    title: 'Sign in required',
    description: 'Please sign in to continue to this content.',
  },
  'expired-session': {
    title: 'Session expired',
    description: 'Sign in again or retry to continue where you left off.',
  },
  forbidden: {
    title: 'You do not have access',
    description: 'This content is outside your current permissions or scope.',
  },
  missing: {
    title: 'Content not found',
    description: 'The resource may have moved, been deleted, or never existed in this scope.',
  },
  unavailable: {
    title: 'Content is temporarily unavailable',
    description: 'Try again in a moment or return to a safe destination.',
  },
};

function getActionLabel(action: string) {
  const labels: Record<string, string> = {
    back: 'Back',
    login: 'Sign in',
    refresh: 'Retry',
    start: 'Continue',
  };
  return labels[action] ?? action.charAt(0).toUpperCase() + action.slice(1);
}

function getActionIcon(action: string) {
  const icons: Record<string, ReactNode> = {
    back: <IconArrowBackUp size="1rem" />,
    login: <IconUserCircle size="1rem" />,
    refresh: <IconRefresh size="1rem" />,
    start: <IconPlayerPlay size="1rem" />,
  };
  return icons[action] ?? <IconArrowRight size="1rem" />;
}

function defaultActions(
  state: AccessRecoveryState,
  {
    onRetry,
    onSignIn,
    onBack,
    supportAction,
  }: Pick<AccessRecoveryPanelProps, 'onRetry' | 'onSignIn' | 'onBack' | 'supportAction'>,
) {
  const signInAction = onSignIn ? { action: 'login', onClick: onSignIn } : null;
  const retryAction = onRetry
    ? { action: 'refresh', onClick: onRetry, variant: 'light' as const }
    : null;
  const backAction = onBack
    ? { action: 'back', onClick: onBack, variant: 'default' as const }
    : null;

  switch (state) {
    case 'unauthenticated':
      return { primary: signInAction, secondary: backAction, tertiary: supportAction ?? null };
    case 'expired-session':
      return {
        primary: signInAction ?? retryAction,
        secondary: retryAction && signInAction ? retryAction : backAction,
        tertiary: supportAction ?? null,
      };
    case 'forbidden':
      return { primary: backAction, secondary: supportAction ?? null, tertiary: null };
    case 'missing':
      return { primary: backAction, secondary: supportAction ?? null, tertiary: null };
    case 'unavailable':
      return {
        primary: retryAction ?? backAction,
        secondary: retryAction && backAction ? backAction : supportAction ?? null,
        tertiary: retryAction && backAction ? supportAction ?? null : null,
      };
  }
}

function ActionGroup({
  primaryAction,
  secondaryAction,
  tertiaryAction,
}: {
  primaryAction: AccessRecoveryAction | null;
  secondaryAction: AccessRecoveryAction | null;
  tertiaryAction: AccessRecoveryAction | null;
}) {
  const actions = [primaryAction, secondaryAction, tertiaryAction].filter(Boolean) as AccessRecoveryAction[];
  if (actions.length === 0) {
    return null;
  }

  return (
    <Group gap="sm" justify="center" wrap="wrap">
      {actions.map((actionConfig, index) => (
        <Button
          key={`${actionConfig.action}-${index}`}
          leftSection={getActionIcon(actionConfig.action)}
          onClick={actionConfig.onClick}
          loading={actionConfig.loading}
          disabled={actionConfig.disabled}
          color={actionConfig.color}
          variant={actionConfig.variant ?? (index === 0 ? 'filled' : 'default')}
        >
          {getActionLabel(actionConfig.action)}
        </Button>
      ))}
    </Group>
  );
}

export function AccessRecoveryPanel({
  state,
  title,
  description,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  onRetry,
  onSignIn,
  onBack,
  supportAction,
  compact = false,
}: AccessRecoveryPanelProps) {
  const fallback = accessCopy[state];
  const defaults = defaultActions(state, {
    onRetry,
    onSignIn,
    onBack,
    supportAction,
  });

  return (
    <StateBlock
      variant={accessStateVariant[state]}
      compact={compact}
      title={title ?? fallback.title}
      description={description ?? fallback.description}
      action={
        <ActionGroup
          primaryAction={primaryAction ?? defaults.primary}
          secondaryAction={secondaryAction ?? defaults.secondary}
          tertiaryAction={tertiaryAction ?? defaults.tertiary}
        />
      }
    />
  );
}
