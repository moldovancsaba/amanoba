'use client';

/**
 * Anonymous Login Button
 * 
 * Allows users to quickly start playing without registration.
 * Generates random 3-word username and creates guest account.
 * 
 * Why client component:
 * - Uses localStorage for session persistence
 * - Needs onClick handler for async API call
 * - Client-side navigation after login
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLoader2, IconUser } from '@tabler/icons-react';
import classes from './AnonymousLoginButton.module.css';

export function AnonymousLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('auth');

  const handleAnonymousLogin = async () => {
    setLoading(true);
    try {
      // Extract referral code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');
      
      // Call API to create anonymous player
      const apiUrl = referralCode ? `/api/auth/anonymous?ref=${encodeURIComponent(referralCode)}` : '/api/auth/anonymous';
      const response = await fetch(apiUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (data.success && data.credentials) {
        // Store anonymous player info in localStorage for quick access
        localStorage.setItem('amanoba_anonymous_player', JSON.stringify(data.player));
        
        // Use NextAuth signIn with credentials provider
        const result = await signIn('credentials', {
          playerId: data.credentials.playerId,
          displayName: data.credentials.displayName,
          isAnonymous: data.credentials.isAnonymous,
          redirect: false,
        });
        
        if (result?.ok) {
          // Successful login - redirect to dashboard
          // Get locale from pathname or default to 'hu'
          const pathname = window.location.pathname;
          const locale = pathname.split('/')[1] || 'hu';
          router.push(`/${locale}/dashboard`);
          router.refresh();
        } else {
          throw new Error('Failed to create session');
        }
      } else {
        throw new Error(data.error || 'Failed to create anonymous player');
      }
    } catch (error) {
      console.error('Anonymous login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      notifications.show({
        color: 'red',
        title: 'Failed to create anonymous session',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="xs">
      <Button
        onClick={handleAnonymousLogin}
        loading={loading}
        variant="default"
        size="lg"
        fullWidth
        h="auto"
        mih={48}
        py="sm"
        leftSection={loading ? <IconLoader2 size={20} /> : <IconUser size={20} />}
        classNames={{ label: classes.buttonLabel }}
      >
        {loading ? t('creatingAccount') : t('continueWithoutRegistration')}
      </Button>
      <Text ta="center" size="xs" c="dimmed">
        {t('tryGamesInstantly')}
      </Text>
    </Stack>
  );
}
