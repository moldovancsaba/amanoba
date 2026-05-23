'use client';

/**
 * Memory Match Game Page (Client)
 *
 * Why: Use client-side session to avoid SSR auth redirect loops that send users back to dashboard.
 */

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, Center, Container, Loader, Stack, Text } from '@mantine/core';
import MemoryGame from '@/components/games/MemoryGame';

export default function MemoryGamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(
    `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
  )}`;

  if (status === 'loading') {
    return (
      <Container py="xl">
        <Center mih={400}>
          <Stack align="center" gap="md">
            <Loader color="amanoba" />
            <Text>Loading...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (!session?.user) {
    router.push(signInUrl);
    return null;
  }

  const playerId = (session.user as { id: string }).id;
  const isPremium = (session.user as { isPremium?: boolean }).isPremium || false;

  return (
    <Container size="lg" py="xl">
      <Card withBorder p="lg">
        <MemoryGame playerId={playerId} isPremium={isPremium} />
      </Card>
    </Container>
  );
}
