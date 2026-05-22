/**
 * Cookie consent banner.
 *
 * Keeps Google Consent Mode controls compact and exposes its height for fixed course CTAs.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Checkbox, Collapse, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useConsent } from '@/app/components/providers/ConsentProvider';
import classes from './CookieConsentBanner.module.css';

export default function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll, updateConsent, consent } = useConsent();
  const t = useTranslations('consent');
  const [showDetails, setShowDetails] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showBanner || !consent) return;
    const banner = bannerRef.current;
    if (!banner) return;

    const updateSpacing = () => {
      const height = banner.getBoundingClientRect().height;
      document.body.style.setProperty('--consent-banner-height', `${height}px`);
      document.body.classList.add('consent-banner-open');
    };

    updateSpacing();
    const observer = new ResizeObserver(updateSpacing);
    observer.observe(banner);

    return () => {
      observer.disconnect();
      document.body.style.removeProperty('--consent-banner-height');
      document.body.classList.remove('consent-banner-open');
    };
  }, [showBanner, consent, showDetails]);

  if (!showBanner || !consent) {
    return null;
  }

  return (
    <Paper
      ref={bannerRef}
      component="aside"
      role="region"
      aria-label={t('title')}
      shadow="xl"
      radius={0}
      p={{ base: 'sm', sm: 'md' }}
      classNames={{ root: classes.banner }}
    >
      <Stack gap="sm" maw={1180} mx="auto">
        <Stack gap={4}>
          <Title order={2} size="h4">
            {t('title')}
          </Title>
          <Text size="sm" c="dimmed" lineClamp={showDetails ? undefined : 2}>
            {t('description')}
          </Text>
        </Stack>

        <Collapse in={showDetails}>
          <Stack gap="sm">
            <Paper p="sm" withBorder>
              <Stack gap={6}>
                <Text fw={700}>{t('analytics.title')}</Text>
                <Text size="sm" c="dimmed">{t('analytics.description')}</Text>
                <Checkbox
                  label={t('analytics.label')}
                  checked={consent.analytics_storage === 'granted'}
                  onChange={(event) =>
                    updateConsent({
                      analytics_storage: event.currentTarget.checked ? 'granted' : 'denied',
                    })
                  }
                />
              </Stack>
            </Paper>

            <Paper p="sm" withBorder>
              <Stack gap={6}>
                <Text fw={700}>{t('advertising.title')}</Text>
                <Text size="sm" c="dimmed">{t('advertising.description')}</Text>
                <Checkbox
                  label={t('advertising.storageLabel')}
                  checked={consent.ad_storage === 'granted'}
                  onChange={(event) =>
                    updateConsent({
                      ad_storage: event.currentTarget.checked ? 'granted' : 'denied',
                    })
                  }
                />
                <Checkbox
                  label={t('advertising.userDataLabel')}
                  checked={consent.ad_user_data === 'granted'}
                  onChange={(event) =>
                    updateConsent({
                      ad_user_data: event.currentTarget.checked ? 'granted' : 'denied',
                    })
                  }
                />
                <Checkbox
                  label={t('advertising.personalizationLabel')}
                  checked={consent.ad_personalization === 'granted'}
                  onChange={(event) =>
                    updateConsent({
                      ad_personalization: event.currentTarget.checked ? 'granted' : 'denied',
                    })
                  }
                />
              </Stack>
            </Paper>
          </Stack>
        </Collapse>

        <Group justify="space-between" gap="xs">
          <Button
            variant="subtle"
            color="gray"
            leftSection={showDetails ? <IconChevronDown size={16} /> : <IconChevronUp size={16} />}
            onClick={() => setShowDetails((current) => !current)}
          >
            {showDetails ? t('hideDetails') : t('showDetails')}
          </Button>
          <Group gap="xs">
            <Button variant="outline" color="gray" onClick={rejectAll}>
              {t('rejectAll')}
            </Button>
            <Button color="amanoba" onClick={acceptAll}>
              {t('acceptAll')}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
}
