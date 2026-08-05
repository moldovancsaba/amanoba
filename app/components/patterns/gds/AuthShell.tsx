import type { ReactNode } from 'react';
import { Box, Container, Stack } from '@mantine/core';
import type { MantineSize } from '@mantine/core';

/**
 * Props for {@link AuthShell} component.
 * 
 * @property {ReactNode} children - Main content (typically sign-in card, error state, or onboarding form)
 * @property {ReactNode} [footer] - Optional footer content (marketing features, help links)
 * @property {ReactNode} [alert] - Optional alert banner (auth errors, validation messages)
 * @property {MantineSize} [size='xs'] - Container size constraint (xs=540px, sm=768px, md=1024px)
 * 
 * @example
 * ```tsx
 * <AuthShell
 *   alert={<Alert color="red">Invalid credentials</Alert>}
 *   footer={<Text>Need help? Contact support</Text>}
 * >
 *   <Card><SignInForm /></Card>
 * </AuthShell>
 * ```
 */
export type AuthShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  alert?: ReactNode;
  size?: MantineSize;
};

/**
 * Canonical authentication/onboarding page shell with dark background and centered layout.
 * 
 * **Contract**: Provides consistent auth experience across sign-in, error, and onboarding routes.
 * 
 * **Server/Client Safety**: ✅ Server-safe (no client-only hooks)
 * 
 * **Consuming Routes**:
 * - `/[locale]/auth/signin` - SSO and anonymous sign-in
 * - `/[locale]/auth/error` - Authentication error display
 * - `/[locale]/onboarding` - Onboarding survey (partial usage)
 * 
 * **Slots**:
 * - `alert` (optional): Error/info banner rendered above main content
 * - `children` (required): Primary card/form content
 * - `footer` (optional): Marketing features, help text, legal links
 * 
 * **Accessibility**:
 * - Uses semantic layout structure
 * - Dark background with sufficient contrast (`ink.9`)
 * - Keyboard-navigable content within slots
 * - Screen reader friendly (no layout-only landmarks)
 * 
 * **Performance**: Minimal bundle impact, renders on server
 * 
 * @param props - {@link AuthShellProps}
 * @returns Centered auth page shell with dark background
 * 
 * @see {@link PublicAppShell} for marketing pages
 * @see {@link ArticleShell} for blog/news pages
 */
export function AuthShell({ children, footer, alert, size = 'xs' }: AuthShellProps) {
  return (
    <Box bg="ink.9" mih="100vh" py={{ base: 'lg', sm: 'xl' }} px="md">
      <Container size={size}>
        <Stack gap="xl">
          {alert}
          {children}
          {footer}
        </Stack>
      </Container>
    </Box>
  );
}
