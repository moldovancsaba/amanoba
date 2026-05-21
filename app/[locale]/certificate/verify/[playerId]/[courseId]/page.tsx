/**
 * Public Certificate Verification Page
 * 
 * What: Public page to verify certificate authenticity
 * Why: Allows sharing certificates via public link
 * 
 * Route: /[locale]/certificate/verify/[playerId]/[courseId]
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Badge, Box, Button, Card, Container, Divider, Group, Loader, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCertificate, IconCircleCheck, IconExternalLink, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface CertificateStatus {
  enrolled: boolean;
  allLessonsCompleted: boolean;
  allQuizzesPassed: boolean;
  finalExamPassed: boolean;
  finalExamScore: number | null;
  certificateEligible: boolean;
  courseTitle: string;
  playerName: string;
}

export default function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ playerId: string; courseId: string }>;
}) {
  const _t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificateData, setCertificateData] = useState<CertificateStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Unwrap async params
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setPlayerId(resolvedParams.playerId);
        setCourseId(resolvedParams.courseId);
      } catch (error) {
        console.error('Failed to unwrap params:', error);
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const verifyIndex = pathParts.findIndex(part => part === 'verify');
          if (verifyIndex !== -1 && pathParts[verifyIndex + 1] && pathParts[verifyIndex + 2]) {
            setPlayerId(pathParts[verifyIndex + 1]);
            setCourseId(pathParts[verifyIndex + 2]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadParams();
  }, [params]);

  // Fetch certificate status
  useEffect(() => {
    if (!playerId || !courseId) return;

    const fetchCertificateStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/profile/${playerId}/certificate-status?courseId=${encodeURIComponent(courseId)}`);
        const data = await res.json();
        if (data.success) {
          setCertificateData(data.data);
        } else {
          setError(data.error || 'Failed to load certificate status');
        }
      } catch (error) {
        console.error('Failed to fetch certificate status:', error);
        setError('Network error - failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateStatus();
  }, [playerId, courseId]);

  if (loading) {
    return (
      <Box bg="dark.9" mih="100vh">
        <Container size="sm" py="xl" mih="100vh" style={{ display: 'grid', placeItems: 'center' }}>
          <Stack align="center">
            <Loader color="amanobaYellow" />
            <Text c="gray.4">Verifying certificate...</Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (error || !certificateData) {
    return (
      <Box bg="dark.9" mih="100vh">
        <Container size="sm" py="xl" mih="100vh" style={{ display: 'grid', placeItems: 'center' }}>
          <Paper withBorder radius="md" p="xl" bg="dark.8" ta="center">
            <ThemeIcon size={64} radius="xl" color="red" mx="auto" mb="md">
              <IconX size={34} />
            </ThemeIcon>
            <Title order={1} size="h3" c="white" mb="sm">
              Verification Failed
            </Title>
            <Text c="gray.4" mb="lg">
              {error || 'Certificate not found or invalid'}
            </Text>
            <Button onClick={() => router.push(`/${locale}`)}>Go Home</Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const { enrolled, allLessonsCompleted, allQuizzesPassed, finalExamPassed, finalExamScore, certificateEligible, courseTitle, playerName } = certificateData;
  const certificateId = `${playerId?.slice(-8)}-${courseId?.slice(-8)}`.toUpperCase();
  const issuedDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Box bg="dark.9" mih="100vh">
      <Container size="lg" py="xl">
        <Stack align="center" gap="xs" mb="xl">
          <ThemeIcon size={56} radius="xl" color="amanobaYellow">
            <IconCertificate size={30} />
          </ThemeIcon>
          <Title order={1} c="white" ta="center">
            Certificate Verification
          </Title>
          <Text c="gray.4" ta="center">
            Verify the authenticity of this certificate
          </Text>
        </Stack>

        <Paper withBorder radius="md" p="xl" bg="dark.8">
          <Stack align="center" ta="center" gap="md" mb="xl">
            {certificateEligible ? (
              <>
                <ThemeIcon size={80} radius="xl" color="green">
                  <IconCircleCheck size={44} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Title order={2} c="green">
                    Certificate Verified
                  </Title>
                  <Text c="gray.4">This certificate is authentic and valid</Text>
                </Stack>
              </>
            ) : (
              <>
                <ThemeIcon size={80} radius="xl" color="yellow">
                  <IconX size={44} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Title order={2} c="yellow">
                    Certificate Not Eligible
                  </Title>
                  <Text c="gray.4">This certificate does not meet all requirements</Text>
                </Stack>
              </>
            )}
          </Stack>

          <Divider mb="xl" />

          <Stack gap="xl">
            <Stack gap="md">
              <Title order={3} size="h4" c="white">
                Certificate Details
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Card withBorder radius="md" bg="dark.7">
                  <Text c="gray.4" size="sm">Recipient</Text>
                  <Text c="white" fw={700}>{playerName}</Text>
                </Card>
                <Card withBorder radius="md" bg="dark.7">
                  <Text c="gray.4" size="sm">Course</Text>
                  <Text c="white" fw={700}>{courseTitle}</Text>
                </Card>
                <Card withBorder radius="md" bg="dark.7">
                  <Text c="gray.4" size="sm">Certificate ID</Text>
                  <Text c="amanobaYellow" ff="monospace" fw={700}>{certificateId}</Text>
                </Card>
                <Card withBorder radius="md" bg="dark.7">
                  <Text c="gray.4" size="sm">Issued</Text>
                  <Text c="white" fw={700}>{issuedDate}</Text>
                </Card>
                {finalExamScore !== null ? (
                  <Card withBorder radius="md" bg="dark.7">
                    <Text c="gray.4" size="sm">Final Exam Score</Text>
                    <Text c="amanobaYellow" fw={700}>{finalExamScore}%</Text>
                  </Card>
                ) : null}
              </SimpleGrid>
            </Stack>

            <Stack gap="md">
              <Title order={3} size="h4" c="white">
                Completion Requirements
              </Title>
              {[
                { label: 'Enrolled in Course', passed: enrolled, failedText: 'Not enrolled' },
                { label: 'All Lessons Completed', passed: allLessonsCompleted, failedText: 'Lessons not completed' },
                { label: 'All Quizzes Passed', passed: allQuizzesPassed, failedText: 'Quizzes not passed' },
                {
                  label: `Final Exam Passed${finalExamScore !== null ? ` (${finalExamScore}%)` : ''}`,
                  passed: finalExamPassed,
                  failedText: 'Final exam not passed',
                },
              ].map((requirement) => (
                <Card key={requirement.label} withBorder radius="md" bg="dark.7">
                  <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap">
                      <ThemeIcon size={36} radius="xl" color={requirement.passed ? 'green' : 'red'}>
                        {requirement.passed ? <IconCircleCheck size={20} /> : <IconX size={20} />}
                      </ThemeIcon>
                      <Stack gap={2}>
                        <Text c="white" fw={700}>
                          {requirement.label}
                        </Text>
                        {!requirement.passed ? (
                          <Text c="gray.4" size="sm">
                            {requirement.failedText}
                          </Text>
                        ) : null}
                      </Stack>
                    </Group>
                    <Badge color={requirement.passed ? 'green' : 'red'}>{requirement.passed ? 'Passed' : 'Missing'}</Badge>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Stack>

          <Divider my="xl" />
          <Group justify="center">
            <Button component="a" href={`/${locale}/profile/${playerId}/certificate/${courseId}`} leftSection={<IconExternalLink size={16} />}>
              View Full Certificate
            </Button>
            <Button variant="default" onClick={() => router.push(`/${locale}`)}>
              Go Home
            </Button>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}
