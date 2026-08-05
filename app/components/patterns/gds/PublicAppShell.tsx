import type { ReactNode } from 'react';
import Image from 'next/image';
import { Box, Container, Group, Paper, Stack, Text } from '@mantine/core';

/**
 * Props for {@link PublicAppShell} component.
 * 
 * @property {ReactNode} children - Main page content (hero, features, call-to-action)
 * @property {ReactNode} headerActions - Navigation and action buttons (sign-in, language switcher)
 * @property {string} [appName] - Application name displayed in header (e.g., "Amanoba")
 * @property {string} [tagline] - Subtitle/tagline below app name
 * @property {ReactNode} [brand] - Custom brand logo/content (overrides default logo + appName)
 * @property {ReactNode} [footer] - Footer content (copyright, legal links, contact)
 * 
 * @example
 * ```tsx
 * <PublicAppShell
 *   appName="Amanoba"
 *   tagline="Learn Every Day"
 *   headerActions={
 *     <>
 *       <Button href="/courses">Courses</Button>
 *       <LanguageSwitcher />
 *       <Button href="/signin">Sign In</Button>
 *     </>
 *   }
 *   footer={<Text>© 2026 Amanoba</Text>}
 * >
 *   <Container><Title>Welcome</Title></Container>
 * </PublicAppShell>
 * ```
 */
export type PublicAppShellProps = {
  children: ReactNode;
  headerActions: ReactNode;
  appName?: string;
  tagline?: string;
  brand?: ReactNode;
  footer?: ReactNode;
};

/**
 * Canonical public/marketing page shell with sticky header and dark background.
 * 
 * **Contract**: Provides consistent landing/marketing experience across public routes.
 * 
 * **Server/Client Safety**: ✅ Server-safe (no client-only hooks)
 * 
 * **Consuming Routes**:
 * - `/[locale]` - Landing page (hero, features, CTA)
 * - `/[locale]/partners` - Partner overview page
 * 
 * **Slots**:
 * - `brand` (optional): Custom logo/branding (default: Amanoba logo + appName + tagline)
 * - `headerActions` (required): Navigation links, language switcher, sign-in button
 * - `children` (required): Main page content
 * - `footer` (optional): Legal links, copyright, social links
 * 
 * **Accessibility**:
 * - Semantic `<header>` and `<footer>` landmarks
 * - Logo has alt text ("Amanoba Logo")
 * - Header actions keyboard navigable
 * - Sufficient contrast on dark shell
 * - Visible focus states on interactive elements
 * 
 * **Performance**: Minimal bundle impact, renders on server, logo uses Next/Image priority
 * 
 * **Mobile Behavior**:
 * - Header actions wrap on narrow viewports
 * - AppName/tagline hidden below `xs` breakpoint
 * - Logo remains visible at all sizes
 * 
 * @param props - {@link PublicAppShellProps}
 * @returns Public marketing shell with sticky header
 * 
 * @see {@link AuthShell} for authentication pages
 * @see {@link ArticleShell} for blog/news content
 */
export function PublicAppShell({
  children,
  headerActions,
  appName,
  tagline,
  brand,
  footer,
}: PublicAppShellProps) {
  return (
    <Box bg="ink.9" mih="100vh">
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="xl" py="md">
          <Group justify="space-between" align="center" gap="md">
            {brand ?? (
              <Group gap="sm" wrap="nowrap" miw={0}>
                <Image
                  src="/amanoba_logo.png"
                  alt="Amanoba Logo"
                  width={48}
                  height={48}
                  priority
                />
                {appName ? (
                  <Stack gap={0} visibleFrom="xs">
                    <Text component="span" fw={700} size="lg" c="white">
                      {appName}
                    </Text>
                    {tagline ? (
                      <Text size="sm" c="gray.3">
                        {tagline}
                      </Text>
                    ) : null}
                  </Stack>
                ) : null}
              </Group>
            )}
            <Group gap="sm" justify="flex-end" wrap="wrap">
              {headerActions}
            </Group>
          </Group>
        </Container>
      </Paper>

      {children}

      {footer ? (
        <Box component="footer" bd="1px 0 0 0 solid var(--mantine-color-ink-6)">
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}
