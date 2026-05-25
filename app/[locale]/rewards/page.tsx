'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { StateBlock } from '@/app/components/patterns/StateBlock';
import {
  IconAlertCircle,
  IconChevronLeft,
  IconCheck,
  IconDiamond,
  IconGift,
  IconShoppingCart,
  IconSparkles,
  IconStar,
} from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  pointsCost: number;
  type?: string;
  isActive: boolean;
  stock?: number;
  premiumOnly?: boolean;
}

export default function RewardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('rewards');
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    const fetchData = async () => {
      try {
        const user = session.user as { id?: string; playerId?: string };
        const playerId = user.playerId || user.id;

        const rewardsResponse = await fetch('/api/rewards');
        if (!rewardsResponse.ok) throw new Error('Failed to load rewards');
        const rewardsData = await rewardsResponse.json();
        setRewards(rewardsData.rewards || []);

        const playerResponse = await fetch(`/api/players/${playerId}`);
        if (!playerResponse.ok) throw new Error('Failed to load player data');
        const playerData = await playerResponse.json();
        setPlayerPoints(playerData.wallet?.currentBalance || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router, locale]);

  const handleRedeem = async (rewardId: string, pointsCost: number) => {
    if (playerPoints < pointsCost) return;

    setRedeeming(rewardId);
    setRedeemSuccess(null);

    try {
      const user = session!.user as { id?: string; playerId?: string };
      const playerId = user.playerId || user.id;
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, rewardId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to redeem reward');
      }

      const data = await response.json();
      setPlayerPoints(data.newBalance);
      setRedeemSuccess(rewardId);
      setTimeout(() => setRedeemSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem reward');
    } finally {
      setRedeeming(null);
    }
  };

  if (loading || status === 'loading') {
    return (
      <Container size="lg" py="xl">
        <StateBlock kind="loading" title={tCommon('loading')} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <StateBlock
          kind="error"
          title={t('unableToLoad')}
          description={error}
          action={(
            <Button component={LocaleLink} href="/dashboard">
              {tDashboard('backToDashboard')}
            </Button>
          )}
        />
      </Container>
    );
  }

  const categories = ['all', ...new Set(rewards.map((reward) => reward.category))];
  const filteredRewards = filterCategory === 'all'
    ? rewards.filter((reward) => reward.isActive)
    : rewards.filter((reward) => reward.isActive && reward.category === filterCategory);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <Group gap="md">
            <ThemeIcon size="xl" variant="light">
              <IconGift />
            </ThemeIcon>
            <Stack gap={4}>
              <Title order={1}>{t('storeTitle')}</Title>
              <Text c="dimmed">{t('storeDescription')}</Text>
            </Stack>
          </Group>
          <Button component={LocaleLink} href="/dashboard" variant="default" leftSection={<IconChevronLeft size={18} />}>
            {tCommon('dashboard')}
          </Button>
        </Group>

        <Card withBorder p="lg">
          <Group justify="space-between" align="center">
            <Stack gap={4}>
              <Title order={2}>{t('yourBalance')}</Title>
              <Text c="dimmed">{t('balanceDescription')}</Text>
            </Stack>
            <Stack gap={2} align="flex-end">
              <Title order={1}>{playerPoints.toLocaleString()}</Title>
              <Badge variant="light" leftSection={<IconDiamond size={12} />}>
                {tCommon('points')}
              </Badge>
            </Stack>
          </Group>
        </Card>

        <Card withBorder p="md">
          <SegmentedControl
            value={filterCategory}
            onChange={setFilterCategory}
            data={categories.map((category) => ({
              value: category,
              label: category === 'all' ? 'All' : category,
            }))}
          />
        </Card>

        {filteredRewards.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {filteredRewards.map((reward) => {
              const canAfford = playerPoints >= reward.pointsCost;
              const isRedeeming = redeeming === reward.id;
              const wasRedeemed = redeemSuccess === reward.id;

              return (
                <Card key={reward.id} withBorder p="lg" h="100%">
                  <Stack gap="md" h="100%">
                    <Group justify="space-between" align="flex-start">
                      <Text size="xl">{reward.icon}</Text>
                      <Group gap="xs">
                        {reward.premiumOnly && (
                          <Badge color="yellow" variant="light" leftSection={<IconStar size={12} />}>
                            {tCommon('premium')}
                          </Badge>
                        )}
                        {wasRedeemed && (
                          <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>
                            {t('redeemed')}
                          </Badge>
                        )}
                      </Group>
                    </Group>
                    {reward.type && (
                      <Badge variant="light">{reward.type.toUpperCase()}</Badge>
                    )}
                    <Stack gap={4}>
                      <Title order={3}>{reward.name}</Title>
                      <Text c="dimmed" size="sm">{reward.description}</Text>
                    </Stack>
                    {reward.stock !== undefined && reward.stock > 0 && (
                      <Alert variant="light" color="gray" icon={<IconAlertCircle size={16} />}>
                        {t('stockLeft', { count: reward.stock })}
                      </Alert>
                    )}
                    <Group justify="space-between" mt="auto">
                      <Badge size="lg" variant="light" leftSection={<IconDiamond size={14} />}>
                        {reward.pointsCost.toLocaleString()}
                      </Badge>
                      <Badge color="gray" variant="outline">
                        {reward.category}
                      </Badge>
                    </Group>
                    <Button
                      fullWidth
                      leftSection={
                        isRedeeming ? undefined
                          : wasRedeemed ? <IconCheck size={18} />
                            : !canAfford ? <IconAlertCircle size={18} />
                              : <IconShoppingCart size={18} />
                      }
                      loading={isRedeeming}
                      disabled={!canAfford || isRedeeming || wasRedeemed}
                      variant={canAfford && !wasRedeemed ? 'filled' : 'default'}
                      onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                    >
                      {isRedeeming
                        ? t('redeeming')
                        : wasRedeemed
                          ? `${t('redeemed')}!`
                          : !canAfford
                            ? t('insufficientPoints')
                            : t('redeemNow')}
                    </Button>
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        ) : (
          <Card withBorder p="xl">
            <Stack align="center" gap="sm">
              <ThemeIcon size="xl" variant="light">
                <IconSparkles />
              </ThemeIcon>
              <Title order={3}>{t('noRewardsAvailable')}</Title>
              <Text c="dimmed" ta="center">
                {filterCategory === 'all' ? t('checkBackLater') : t('tryDifferentCategory')}
              </Text>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
