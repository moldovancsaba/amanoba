'use client';

/**
 * Referral Card Component
 * 
 * Shows referral code, share link, stats, and referred friends list
 * Allows easy sharing and tracking of referral rewards
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Code,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconBrandWhatsapp, IconGift, IconLink, IconMail, IconShare3, IconTargetArrow } from '@tabler/icons-react';

interface ReferralData {
  referralCode: string;
  shareUrl: string;
  stats: {
    totalReferrals: number;
    pendingRewards: number;
    completedRewards: number;
    totalPointsEarned: number;
  };
  referrals: Array<{
    id: string;
    referredPlayer: {
      displayName: string;
      joinedAt: string;
    };
    status: string;
    rewardDetails?: {
      pointsEarned: number;
    };
    completedAt?: string;
  }>;
}

export function ReferralCard() {
  const { data: session } = useSession();
  const t = useTranslations('referral');
  const tCommon = useTranslations('common');
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!session?.user?.id) return;

      try {
        const playerId = (session.user as { id: string }).id;
        const response = await fetch(`/api/referrals?playerId=${playerId}`);
        
        if (response.ok) {
          const data = await response.json();
          setReferralData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [session]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaWhatsApp = () => {
    if (!referralData) return;
    const message = encodeURIComponent(
      `${t('shareMessage')}: ${referralData.referralCode}\n\n${referralData.shareUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareViaEmail = () => {
    if (!referralData) return;
    const subject = encodeURIComponent(`${tCommon('appName')} - ${t('inviteFriends')}`);
    const body = encodeURIComponent(
      `${t('emailBody')}\n\n${t('shareMessage')}: ${referralData.referralCode}\n${referralData.shareUrl}\n`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <Card padding="lg" withBorder>
        <Group justify="center" py="lg">
          <Loader color="amanoba" size="sm" />
        </Group>
      </Card>
    );
  }

  if (!referralData) {
    return null;
  }

  return (
    <Card padding="lg" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon color="amanoba" variant="light" radius="xl">
            <IconGift size={20} />
          </ThemeIcon>
          <Title order={2} size="h3">{t('inviteFriends')}</Title>
        </Group>

        <Paper p="md" withBorder>
          <Stack gap="sm">
            <Text size="sm" c="dimmed">{t('yourReferralCode')}</Text>
            <Group gap="sm" align="center">
              <Code fz="xl" fw={800} flex={1}>
            {referralData.referralCode}
              </Code>
              <Button
            onClick={() => copyToClipboard(referralData.referralCode)}
                color="amanoba"
          >
            {copied ? '✓ ' + tCommon('copied') : t('copy')}
              </Button>
            </Group>
          </Stack>
        </Paper>

        <SimpleGrid cols={2} spacing="sm">
          <Button
          onClick={() => copyToClipboard(referralData.shareUrl)}
            variant="default"
            leftSection={<IconLink size={18} />}
        >
          {t('copyLink')}
          </Button>
          <Button
          onClick={shareViaWhatsApp}
            color="green"
            leftSection={<IconBrandWhatsapp size={18} />}
        >
          WhatsApp
          </Button>
          <Button
          onClick={shareViaEmail}
            variant="default"
            leftSection={<IconMail size={18} />}
        >
          Email
          </Button>
          <Button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: tCommon('appName'),
                text: `${t('shareMessage')}: ${referralData.referralCode}`,
                url: referralData.shareUrl,
              });
            }
          }}
            color="amanoba"
            leftSection={<IconShare3 size={18} />}
        >
          {t('share')}
          </Button>
        </SimpleGrid>

        <SimpleGrid cols={2} spacing="sm">
          <Paper p="md" withBorder>
            <Text ta="center" size="xl" fw={800}>
            {referralData.stats.totalReferrals}
            </Text>
            <Text ta="center" size="xs" c="dimmed">{t('friendsInvited')}</Text>
          </Paper>
          <Paper p="md" withBorder>
            <Text ta="center" size="xl" fw={800}>
            {referralData.stats.totalPointsEarned}
            </Text>
            <Text ta="center" size="xs" c="dimmed">{t('pointsEarned')}</Text>
          </Paper>
        </SimpleGrid>

      {referralData.referrals.length > 0 && (
          <Stack gap="sm">
            <Text size="sm" fw={700}>
            {t('referredFriends')} ({referralData.referrals.length})
            </Text>
            <Stack gap="xs" mah={192} style={{ overflowY: 'auto' }}>
            {referralData.referrals.map((referral) => (
                <Paper key={referral.id} p="sm" withBorder>
                  <Group justify="space-between" gap="sm">
                    <Group gap="sm">
                      <Avatar color="gray" radius="xl">
                        {referral.referredPlayer.displayName.charAt(0)}
                      </Avatar>
                      <Stack gap={0}>
                        <Text size="sm" fw={700}>
                      {referral.referredPlayer.displayName}
                        </Text>
                        <Text size="xs" c="dimmed">
                      {new Date(referral.referredPlayer.joinedAt).toLocaleDateString('hu-HU')}
                        </Text>
                      </Stack>
                    </Group>
                  {referral.status === 'completed' ? (
                      <Badge color="green">
                      +{referral.rewardDetails?.pointsEarned || 0} {tCommon('points')}
                      </Badge>
                  ) : (
                      <Badge color="gray" variant="light">
                      {t('pending')}
                      </Badge>
                  )}
                  </Group>
                </Paper>
            ))}
            </Stack>
          </Stack>
      )}

      {referralData.referrals.length === 0 && (
          <Paper p="md" withBorder>
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon color="amanoba" variant="light" radius="xl" size="sm">
                  <IconTargetArrow size={16} />
                </ThemeIcon>
                <Text fw={700}>{t('howItWorks')}</Text>
              </Group>
              <Text size="xs" c="dimmed">{t('step1')}</Text>
              <Text size="xs" c="dimmed">{t('step2')}</Text>
              <Text size="xs" c="dimmed">{t('step3')}</Text>
            </Stack>
          </Paper>
      )}
      </Stack>
    </Card>
  );
}
