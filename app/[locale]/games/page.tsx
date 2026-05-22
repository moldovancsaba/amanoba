'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBrain,
  IconChevronLeft,
  IconClock,
  IconCrown,
  IconGridDots,
  IconLock,
  IconNumber,
  IconTarget,
} from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';

interface GameInfo {
  id: string;
  name: string;
  description: string;
  route: string;
  isPremium: boolean;
  requiredLevel: number;
  estimatedTime: string;
  icon: ReactNode;
}

const AVAILABLE_GAMES: GameInfo[] = [
  {
    id: 'quizzz',
    name: 'QUIZZZ',
    description: 'Test your knowledge with rapid-fire trivia questions.',
    route: '/games/quizzz',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '2-3 min',
    icon: <IconBrain />,
  },
  {
    id: 'whackpop',
    name: 'WHACKPOP',
    description: 'Click targets as fast as you can in this fast-paced game.',
    route: '/games/whackpop',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '1-2 min',
    icon: <IconTarget />,
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Find matching pairs in this card-flipping memory game.',
    route: '/games/memory',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '2-5 min',
    icon: <IconGridDots />,
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Classic Sudoku puzzles with progressive difficulty.',
    route: '/games/sudoku',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '5-15 min',
    icon: <IconNumber />,
  },
  {
    id: 'madoku',
    name: 'Madoku',
    description: 'Competitive number-picking strategy game against AI.',
    route: '/games/madoku',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '3-8 min',
    icon: <IconTarget />,
  },
];

export default function GamesLauncher() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('games');
  const tCommon = useTranslations('common');
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    const fetchPlayerData = async () => {
      try {
        const playerId = session.user.id;
        const response = await fetch(`/api/players/${playerId}`);

        if (response.ok) {
          const data = await response.json();
          setPlayerLevel(data.progression?.level || 1);
          setIsPremium(data.player?.isPremium || false);
        }
      } catch (error) {
        console.error('Failed to fetch player data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [session, status, router, locale]);

  const isGameAvailable = (game: GameInfo): boolean => {
    if (game.isPremium && !isPremium) return false;
    if (game.requiredLevel > playerLevel) return false;
    return true;
  };

  const getLockReason = (game: GameInfo): string | null => {
    if (game.isPremium && !isPremium) return t('premiumOnly');
    if (game.requiredLevel > playerLevel) return t('unlockAtLevel', { level: game.requiredLevel });
    return null;
  };

  if (status === 'loading' || loading) {
    return (
      <Center mih="70vh">
        <Stack align="center" gap="md">
          <Loader />
          <Text size="lg">{t('loading')}</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <Group gap="md">
            <Logo size="sm" showText={false} linkTo="/dashboard" preventShrink />
            <Stack gap={4}>
              <Title order={1}>{tCommon('appName')} {t('title')}</Title>
              <Text c="dimmed">{t('chooseChallenge')}</Text>
            </Stack>
          </Group>
          <Group gap="xs">
            <Badge size="lg" variant="light">Level {playerLevel}</Badge>
            {isPremium && (
              <Badge size="lg" color="yellow" variant="light" leftSection={<IconCrown size={14} />}>
                Premium
              </Badge>
            )}
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {AVAILABLE_GAMES.map((game) => {
            const available = isGameAvailable(game);
            const lockReason = getLockReason(game);

            return (
              <Card key={game.id} withBorder p="lg" h="100%">
                <Stack gap="md" h="100%">
                  <Group justify="space-between" align="flex-start">
                    <ThemeIcon size="xl" variant="light" color={available ? undefined : 'gray'}>
                      {game.icon}
                    </ThemeIcon>
                    {!available && (
                      <Badge color="gray" variant="outline" leftSection={<IconLock size={12} />}>
                        {lockReason || t('locked')}
                      </Badge>
                    )}
                    {available && game.isPremium && (
                      <Badge color="yellow" variant="light" leftSection={<IconCrown size={12} />}>
                        Premium
                      </Badge>
                    )}
                  </Group>
                  <Stack gap={4}>
                    <Title order={3}>{game.name}</Title>
                    <Text c="dimmed">{game.description}</Text>
                  </Stack>
                  <Badge color="gray" variant="light" leftSection={<IconClock size={12} />} w="fit-content">
                    {game.estimatedTime}
                  </Badge>
                  <Button
                    mt="auto"
                    fullWidth
                    disabled={!available}
                    onClick={() => router.push(`/${locale}${game.route}`)}
                  >
                    {available ? t('playNow') : t('locked')}
                  </Button>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>

        <Group justify="center">
          <Button component={LocaleLink} href="/dashboard" variant="default" leftSection={<IconChevronLeft size={18} />}>
            {t('backToDashboard')}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
