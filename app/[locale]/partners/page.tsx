import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconChartBar,
  IconMap,
  IconRocket,
  IconSchool,
  IconShieldCheck,
  IconSparkles,
} from '@tabler/icons-react';
import { auth } from '@/auth';
import { ThemeToggle } from '@/components/ThemeToggle';
import Logo from '@/components/Logo';

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  const features = [
    {
      icon: <IconSchool />,
      title: 'Course delivery',
      description: 'Publish structured lessons, quizzes, exercises, and certificates from one learner-first platform.',
    },
    {
      icon: <IconChartBar />,
      title: 'Progress visibility',
      description: 'Track learner progress, completion, practice activity, and quiz outcomes without separate tools.',
    },
    {
      icon: <IconRocket />,
      title: 'Practice loops',
      description: 'Use games, saved lessons, recovery paths, and daily actions to keep learners moving.',
    },
    {
      icon: <IconShieldCheck />,
      title: 'Operational foundation',
      description: 'Built around a shared Mantine design system, documented course rules, and maintainable admin workflows.',
    },
    {
      icon: <IconMap />,
      title: 'Flexible programs',
      description: 'Support short courses, long programs, and open-ended learning paths without a fixed 30-day assumption.',
    },
    {
      icon: <IconSparkles />,
      title: 'Release transparency',
      description: 'Weekly news posts summarize the product improvements that actually shipped for learners.',
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Logo size="md" showText={false} linkTo="/" preventShrink />
            <Stack gap={2}>
              <Title order={2}>Amanoba</Title>
              <Text c="dimmed">Flexible learning platform</Text>
            </Stack>
          </Group>
          <Group gap="sm">
            <ThemeToggle />
            {session?.user ? (
              <Button component={Link} href={`/${locale}/dashboard`}>
                Dashboard
              </Button>
            ) : (
              <Button component={Link} href={`/${locale}/auth/signin`}>
                Sign in
              </Button>
            )}
          </Group>
        </Group>

        <Stack gap="lg" align="center" ta="center" py="xl">
          <Badge variant="light" size="lg">Partner overview</Badge>
          <Title order={1}>Learning programs that can grow past templates</Title>
          <Text c="dimmed" size="lg" maw={760}>
            Amanoba helps teams publish courses, guide learners through practice, and keep progress visible without
            locking every program into the same course shape.
          </Text>
          <Group gap="sm" justify="center">
            <Button component={Link} href={`/${locale}/courses`}>
              View courses
            </Button>
            <Button component={Link} href={`/${locale}/news`} variant="default">
              Read updates
            </Button>
          </Group>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {features.map((feature) => (
            <Card key={feature.title} withBorder p="lg" h="100%">
              <Stack gap="md">
                <ThemeIcon variant="light" size="xl">
                  {feature.icon}
                </ThemeIcon>
                <Stack gap={4}>
                  <Title order={3}>{feature.title}</Title>
                  <Text c="dimmed">{feature.description}</Text>
                </Stack>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
