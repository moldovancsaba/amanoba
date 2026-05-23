/**
 * Sign In Page
 * 
 * What: Authentication page with SSO and anonymous login
 * Why: Allow users to sign in via SSO or continue anonymously
 */

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AnonymousLoginButton } from '@/app/components/AnonymousLoginButton';
import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/LocaleLink';
import Image from 'next/image';
import { AuthShell } from '@/app/components/patterns/AuthShell';
import {
  Alert,
  Button,
  Card,
  Divider,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconBook, IconLock, IconMail, IconTargetArrow } from '@tabler/icons-react';

/**
 * Sign In Page Component
 * 
 * Why: Provides branded sign-in interface for Amanoba
 */
const SIGNIN_ERROR_KEYS: Record<string, string> = {
  database_error: 'errorDatabase',
  brand_not_found: 'errorBrandNotFound',
  callback_error: 'errorCallback',
  token_validation_failed: 'errorTokenValidation',
  session_creation_failed: 'errorSessionCreation',
};

export default async function SignInPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;
  const t = await getTranslations({ locale, namespace: 'auth' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const callbackUrl = searchParamsResolved.callbackUrl || `/${locale}`;
  
  // Check if user is already authenticated
  const session = await auth();
  
  if (session?.user) {
    // Redirect authenticated users back to the requested page
    redirect(callbackUrl);
  }

  const errorCode = searchParamsResolved.error;
  const errorMessageKey = errorCode ? SIGNIN_ERROR_KEYS[errorCode] : null;
  const errorMessage = errorMessageKey ? t(errorMessageKey) : errorCode ? t('errorSignInFailed') : null;

  return (
    <AuthShell
      alert={errorMessage ? <Alert color="red" radius="md">{errorMessage}</Alert> : undefined}
      footer={(
          <Stack gap="md" ta="center">
            <Title order={2} size="h3" c="white">{t('whyJoin')}</Title>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
              {[
                { icon: IconBook, label: tCommon('courses.title') },
                { icon: IconMail, label: t('dailyLessons') },
                { icon: IconTargetArrow, label: t('interactiveAssessments') },
              ].map((item) => (
                <Paper key={item.label} bg="ink.8" p="md" withBorder>
                  <Stack gap="xs" align="center">
                    <ThemeIcon color="amanoba" variant="light" radius="xl">
                      <item.icon size={20} />
                    </ThemeIcon>
                    <Text c="white" fw={700} size="sm">{item.label}</Text>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
      )}
    >
          <Card padding="xl" withBorder>
            <Stack gap="xl">
              <Stack gap="md" align="center" ta="center">
              <Image
                src="/amanoba_logo.png"
                alt="Amanoba Logo"
                width={96}
                height={96}
                priority
              />
                <Title order={1} size="h1">
              {t('welcome')} {tCommon('appName')}
                </Title>
                <Text c="dimmed" size="lg">
              {t('tagline')}
                </Text>
              </Stack>

          {process.env.SSO_CLIENT_ID && (
                <Stack gap="sm">
                  <Button
                    component="a"
                href={`/api/auth/sso/login?provider=google&returnTo=${encodeURIComponent(callbackUrl)}`}
                    variant="outline"
                    color="gray"
                    size="lg"
                    fullWidth
                    leftSection={
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="var(--color-google-blue)" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="var(--color-google-green)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="var(--color-google-yellow)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="var(--color-google-red)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    }
              >
                {t('signInWithGoogle')}
                  </Button>

                  <Button
                    component="a"
                href={`/api/auth/sso/login?returnTo=${encodeURIComponent(callbackUrl)}`}
                    color="amanoba"
                    size="lg"
                    fullWidth
                    leftSection={<IconLock size={22} />}
              >
                {t('signInAnotherWay')}
                  </Button>

                  <Divider label={t('or')} labelPosition="center" />
                </Stack>
          )}

              <AnonymousLoginButton />

              <Text ta="center" size="sm" c="dimmed">
              {tCommon('byContinuing', { appName: tCommon('appName') })}{' '}
                <Text component={LocaleLink} href={`/${locale}/terms`} span c="amanoba.7" td="underline">
                {tCommon('termsOfService')}
                </Text>{' '}
              {tCommon('and')}{' '}
                <Text component={LocaleLink} href={`/${locale}/privacy`} span c="amanoba.7" td="underline">
                {tCommon('privacyPolicy')}
                </Text>
              </Text>
            </Stack>
          </Card>
    </AuthShell>
  );
}
