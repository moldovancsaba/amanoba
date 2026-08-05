import type { ReactNode } from 'react';
import { Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';

/**
 * Props for {@link ArticleShell} component.
 * 
 * @property {string} eyebrow - Small category label above title (e.g., "Amanoba blog", "What's new")
 * @property {string} title - Section title in header (e.g., "Amanoba Blog", "Amanoba News")
 * @property {string} logoHref - Click destination for logo (typically section index)
 * @property {string} backHref - Navigation back to article list
 * @property {string} backLabel - Text for back button (e.g., "All blog posts")
 * @property {string} dashboardLabel - Text for dashboard button (e.g., "Dashboard")
 * @property {ReactNode} [languageSwitcher] - Optional language switcher component
 * @property {ReactNode} children - Article content (title, metadata, body)
 * 
 * @example
 * ```tsx
 * <ArticleShell
 *   eyebrow="Amanoba blog"
 *   title="Amanoba Blog"
 *   logoHref="/blog"
 *   backHref="/blog"
 *   backLabel="All blog posts"
 *   dashboardLabel="Dashboard"
 *   languageSwitcher={<LanguageSwitcher />}
 * >
 *   <Paper component="article">
 *     <Title>{post.headline}</Title>
 *     <Text>{post.summary}</Text>
 *   </Paper>
 * </ArticleShell>
 * ```
 */
export type ArticleShellProps = {
  eyebrow: string;
  title: string;
  logoHref: string;
  backHref: string;
  backLabel: string;
  dashboardLabel: string;
  languageSwitcher?: ReactNode;
  children: ReactNode;
};

/**
 * Canonical article/blog post shell with branded header and navigation.
 * 
 * **Contract**: Provides consistent blog/news reading experience with clear navigation.
 * 
 * **Server/Client Safety**: ✅ Server-safe (no client-only hooks)
 * 
 * **Consuming Routes**:
 * - `/[locale]/blog/[slug]` - Blog post detail pages
 * - `/[locale]/news/[slug]` - News post detail pages
 * 
 * **Slots**:
 * - `eyebrow` (required): Category label (uppercase, brand color)
 * - `title` (required): Section title (h1 in header)
 * - `logoHref` (required): Logo click destination
 * - `languageSwitcher` (optional): Language switcher component
 * - `backHref` + `backLabel` (required): Navigation back to list
 * - `dashboardLabel` (required): Dashboard button text
 * - `children` (required): Article content (Paper with headline, metadata, body)
 * 
 * **Accessibility**:
 * - Semantic `<header>` landmark
 * - Semantic `<main>` landmark with constrained measure
 * - Logo alt text via Logo component
 * - Keyboard-navigable back/dashboard buttons
 * - Clear visual hierarchy (eyebrow → title → nav)
 * - Sufficient contrast on dark header
 * 
 * **Performance**: Minimal bundle impact, renders on server
 * 
 * **Mobile Behavior**:
 * - Header wraps navigation on narrow viewports
 * - Logo remains visible
 * - Button labels remain readable
 * 
 * @param props - {@link ArticleShellProps}
 * @returns Article shell with branded header and constrained content measure
 * 
 * @see {@link AuthShell} for authentication pages
 * @see {@link PublicAppShell} for marketing pages
 */
export function ArticleShell({
  eyebrow,
  title,
  logoHref,
  backHref,
  backLabel,
  dashboardLabel,
  languageSwitcher,
  children,
}: ArticleShellProps) {
  return (
    <>
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="md" py="md">
          <Group justify="space-between" align="center" gap="md">
            <Group gap="md" wrap="nowrap">
              <Logo size="sm" showText={false} linkTo={logoHref} preventShrink />
              <Stack gap={2}>
                <Text size="xs" tt="uppercase" fw={800} c="amanoba.5">
                  {eyebrow}
                </Text>
                <Title order={1} size="h3" c="white">
                  {title}
                </Title>
              </Stack>
            </Group>
            <Group component="nav" gap="xs" justify="flex-end">
              {languageSwitcher}
              <Button component={LocaleLink} href={backHref} variant="outline" color="gray">
                {backLabel}
              </Button>
              <Button component={LocaleLink} href="/dashboard" color="amanoba">
                {dashboardLabel}
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>

      <Container component="main" size="md" py={{ base: 'xl', sm: 56 }}>
        {children}
      </Container>
    </>
  );
}
