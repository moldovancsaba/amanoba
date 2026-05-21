/**
 * Certificate Display Page
 *
 * What: Displays certificate of completion for a player and course
 * Why: Gives learners a shareable certificate surface with verification actions
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconDownload,
  IconLink,
  IconQrcode,
  IconShare2,
} from '@tabler/icons-react';
import { trackGAEvent } from '@/app/lib/analytics/ga-events';

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
  verificationSlug?: string | null;
  designTemplateId?: string | null;
}

export default function CertificatePage({
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
  const [linkCopied, setLinkCopied] = useState(false);
  const [verificationUrlForShare, setVerificationUrlForShare] = useState('');
  const hasFiredCertificateGA = useRef(false);

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
          const profileIndex = pathParts.findIndex((part) => part === 'profile');
          const certificateIndex = pathParts.findIndex((part) => part === 'certificate');
          if (profileIndex !== -1 && pathParts[profileIndex + 1]) setPlayerId(pathParts[profileIndex + 1]);
          if (certificateIndex !== -1 && pathParts[certificateIndex + 1]) setCourseId(pathParts[certificateIndex + 1]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadParams();
  }, [params]);

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

  useEffect(() => {
    if (!certificateData?.certificateEligible || !courseId || !certificateData.courseTitle || hasFiredCertificateGA.current) return;
    hasFiredCertificateGA.current = true;
    trackGAEvent('certificate_earned', { course_id: courseId, course_name: certificateData.courseTitle });
    trackGAEvent('certificate_viewed', {
      course_id: courseId,
      course_name: certificateData.courseTitle,
      ...(certificateData.designTemplateId && { template_variant_id: certificateData.designTemplateId }),
    });
  }, [certificateData, courseId]);

  useEffect(() => {
    if (typeof window === 'undefined' || !playerId || !courseId) return;
    const base = window.location.origin;
    const url = certificateData?.verificationSlug
      ? `${base}/${locale}/certificate/${certificateData.verificationSlug}`
      : `${base}/${locale}/certificate/verify/${playerId}/${courseId}`;
    setVerificationUrlForShare(url);
  }, [certificateData?.verificationSlug, locale, playerId, courseId]);

  const handleDownloadImage = async (variant: 'share_1200x627' | 'print_a4' = 'share_1200x627') => {
    if (!playerId || !courseId || !certificateData?.certificateEligible) return;

    try {
      const response = await fetch(`/api/profile/${playerId}/certificate/${courseId}/image?variant=${variant}&locale=${encodeURIComponent(locale)}`);
      if (!response.ok) throw new Error('Failed to generate certificate image');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `certificate-${courseId}-${variant}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
      notifications.show({ color: 'green', title: 'Certificate download started', message: 'Your certificate image is being downloaded.' });
    } catch (error) {
      console.error('Failed to download certificate:', error);
      notifications.show({ color: 'red', title: 'Download failed', message: 'Failed to download certificate. Please try again.' });
    }
  };

  const handleCopyLink = async () => {
    if (!playerId || !courseId) return;
    const verificationUrl = certificateData?.verificationSlug
      ? `${window.location.origin}/${locale}/certificate/${certificateData.verificationSlug}`
      : `${window.location.origin}/${locale}/certificate/verify/${playerId}/${courseId}`;

    try {
      await navigator.clipboard.writeText(verificationUrl);
    } catch (error) {
      console.error('Failed to copy link:', error);
      const textArea = document.createElement('textarea');
      textArea.value = verificationUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } finally {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      notifications.show({ color: 'green', title: 'Link copied', message: 'Certificate verification link copied.' });
    }
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Skeleton height={32} width={160} radius="md" />
          <Card padding="xl">
            <Stack gap="xl" align="center">
              <Skeleton height={70} width="60%" radius="md" />
              <Skeleton height={30} width="40%" radius="md" />
              <SimpleGrid cols={{ base: 1, md: 2 }} w="100%">
                {[1, 2, 3, 4].map((item) => <Skeleton key={item} height={74} radius="md" />)}
              </SimpleGrid>
              <Group w="100%" justify="space-between">
                <Skeleton height={44} width={140} radius="md" />
                <Skeleton height={44} width={180} radius="xl" />
                <Skeleton height={44} width={140} radius="md" />
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    );
  }

  if (error || !certificateData) {
    const errorMessage = error || 'Certificate not found';
    const isNotFound = errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('404');
    const isNetworkError = errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('failed to fetch');

    return (
      <Container size="sm" py="xl">
        <Center mih="60vh">
          <Card padding="xl">
            <Stack align="center" gap="md">
              <ThemeIcon size={64} color="red" radius="xl">
                <IconCircleX size={36} />
              </ThemeIcon>
              <Title order={1} size="h3">{isNotFound ? 'Certificate Not Found' : 'Error Loading Certificate'}</Title>
              <Text c="dimmed" ta="center">{errorMessage}</Text>
              {isNetworkError && <Text c="dimmed" size="sm" ta="center">Please check your internet connection and try again.</Text>}
              {isNotFound && <Text c="dimmed" size="sm" ta="center">This certificate may not exist or may have been removed.</Text>}
              <Group justify="center">
                <Button leftSection={<IconArrowLeft size={16} />} onClick={() => router.push(`/${locale}/profile/${playerId}`)}>
                  Back to Profile
                </Button>
                {isNetworkError && (
                  <Button variant="default" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                )}
              </Group>
            </Stack>
          </Card>
        </Center>
      </Container>
    );
  }

  const { finalExamScore, certificateEligible, courseTitle, playerName } = certificateData;
  const certificateId = (playerId && courseId) ? `${playerId.slice(-8)}-${courseId.slice(-8)}`.toUpperCase() : '';
  const issuedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group>
          <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => router.push(`/${locale}/profile/${playerId}`)}>
            Back to Profile
          </Button>
        </Group>

        <Card padding="xl">
          <Stack gap="xl" align="center">
            <Stack gap="sm" align="center">
              <Badge color="amanobaYellow" size="lg">Certificate of Completion</Badge>
              <Title order={1} ta="center">{courseTitle}</Title>
              <Text size="lg" c="dimmed" ta="center">This certifies that</Text>
              <Title order={2} c="amanobaYellow.5" ta="center">{playerName}</Title>
              <Text size="lg" c="dimmed" ta="center">has successfully completed the course.</Text>
            </Stack>

            {certificateEligible && (
              <Stack gap="md" w="100%">
                <Title order={3} size="h4" ta="center">Completion Requirements Met</Title>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <Requirement label="Enrolled in Course" />
                  <Requirement label="All Lessons Completed" />
                  <Requirement label="All Quizzes Passed" />
                  <Requirement label={`Final Exam Passed${finalExamScore !== null ? ` (${finalExamScore}%)` : ''}`} />
                </SimpleGrid>
              </Stack>
            )}

            <SimpleGrid cols={{ base: 1, md: 3 }} w="100%">
              <Paper withBorder radius="md" p="md">
                <Text size="xs" c="dimmed">Certificate ID</Text>
                <Text fw={700} ff="monospace">{certificateId}</Text>
              </Paper>
              <Paper withBorder radius="md" p="md">
                <Text size="xs" c="dimmed">Status</Text>
                <Badge color={certificateEligible ? 'green' : 'yellow'} leftSection={certificateEligible ? <IconCircleCheck size={12} /> : <IconAlertTriangle size={12} />}>
                  {certificateEligible ? 'Valid Certificate' : 'Requirements Not Met'}
                </Badge>
              </Paper>
              <Paper withBorder radius="md" p="md">
                <Text size="xs" c="dimmed">Issued</Text>
                <Text fw={700}>{issuedDate}</Text>
              </Paper>
            </SimpleGrid>

            {certificateEligible && (
              <Stack gap="lg" align="center" w="100%">
                <Stack gap="sm" align="center">
                  <Title order={3} size="h4">Share Certificate</Title>
                  <Group justify="center">
                    <Button
                      type="button"
                      variant="default"
                      leftSection={linkCopied ? <IconCheck size={16} /> : <IconLink size={16} />}
                      onClick={handleCopyLink}
                    >
                      {linkCopied ? 'Link Copied' : 'Copy Verification Link'}
                    </Button>
                    {verificationUrlForShare && (
                      <Button
                        component="a"
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrlForShare)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="blue"
                        leftSection={<IconShare2 size={16} />}
                      >
                        Share on LinkedIn
                      </Button>
                    )}
                  </Group>
                </Stack>

                {verificationUrlForShare && (
                  <Stack gap="sm" align="center">
                    <Group gap="xs">
                      <IconQrcode size={18} />
                      <Text fw={700}>Scan to verify</Text>
                    </Group>
                    <Paper withBorder radius="md" p="xs" bg="white">
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrlForShare)}`}
                        alt="QR code to verify certificate"
                        width={150}
                        height={150}
                        unoptimized
                      />
                    </Paper>
                  </Stack>
                )}

                <Stack gap="sm" align="center">
                  <Title order={3} size="h4">Download Certificate</Title>
                  <Group justify="center">
                    <Button leftSection={<IconDownload size={16} />} onClick={() => handleDownloadImage('share_1200x627')}>
                      Download Image (Share)
                    </Button>
                    <Button variant="default" leftSection={<IconDownload size={16} />} onClick={() => handleDownloadImage('print_a4')}>
                      Download Image (Print)
                    </Button>
                  </Group>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

function Requirement({ label }: { label: string }) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group gap="sm">
        <ThemeIcon color="green" variant="light">
          <IconCircleCheck size={18} />
        </ThemeIcon>
        <Text fw={700}>{label}</Text>
      </Group>
    </Paper>
  );
}
