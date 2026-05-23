/**
 * Authentication Error Page
 * 
 * What: Displays authentication errors with user-friendly messages
 * Why: Handle SSO/auth failures and provide clear guidance to users
 */

import { Anchor, Box, Button, Code, Container, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import { StateBlock } from '@/app/components/patterns/StateBlock';

/**
 * Error messages mapping
 * 
 * Why: Provide user-friendly error descriptions
 */
const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please contact support if you believe this is an error.',
  },
  Verification: {
    title: 'Verification Failed',
    description: 'The sign in link is no longer valid. It may have expired or already been used.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Failed',
    description: 'Error occurred while trying to start sign in. Please try again.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'Error occurred during the sign-in callback. Please try again.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Failed',
    description: 'Could not create your account. Please try again or contact support.',
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Failed',
    description: 'Could not create your email account. Please try again.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'Error occurred during the sign in process. Please try again.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Already Exists',
    description: 'An account with this email already exists. Please sign in with your original method.',
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'Could not send sign in email. Please check your email address and try again.',
  },
  CredentialsSignin: {
    title: 'Sign In Failed',
    description: 'The credentials you provided are incorrect. Please try again.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to access this page.',
  },
  default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred. Please try signing in again.',
  },
};

/**
 * Authentication Error Page Component
 * 
 * Why: Provide clear error feedback and recovery options
 */
export default async function AuthErrorPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ error?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const search = await searchParams;
  const { locale } = await params;
  const errorType = search.error || 'default';
  const errorInfo = errorMessages[errorType] || errorMessages.default;

  return (
    <Box bg="ink.9" mih="100vh" px="md" py="xl">
      <Container size="xs">
        <Stack gap="md">
          <StateBlock
            kind="error"
            title={errorInfo.title}
            description={errorInfo.description}
            icon={<IconAlertTriangle size={18} />}
            action={(
              <Button component={LocaleLink} href={`/${locale}/auth/signin`} color="amanoba">
              Try Again
              </Button>
            )}
            secondaryAction={(
              <Button component={LocaleLink} href={`/${locale}`} variant="default">
              Go to Homepage
              </Button>
            )}
          />

          <Text ta="center" size="sm" c="dimmed">
            Need help?{' '}
            <Anchor href="mailto:csaba@doneisbetter.com" c="amanoba.5">
              Contact Support
            </Anchor>
          </Text>
          {process.env.NODE_ENV === 'development' && (
            <Code block>Error Type: {errorType}</Code>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
