/**
 * Certificate Verification Page (Slug-based)
 * 
 * What: Public page to verify certificate authenticity using slug
 * Why: More secure verification with privacy controls
 * 
 * Route: /[locale]/certificate/[slug]
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Badge, Box, Button, Card, Container, Divider, Group, Loader, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAward, IconCertificate, IconExternalLink, IconLock, IconRosetteDiscountCheck, IconX, IconLockOpen } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Certificate {
  certificateId: string;
  recipientName: string;
  courseTitle: string;
  courseId: string;
  playerId?: string;
  verificationSlug: string;
  issuedAtISO: string;
  finalExamScorePercentInteger?: number;
  isPublic: boolean;
  isRevoked: boolean;
  revokedAtISO?: string;
  revokedReason?: string;
  locale: 'en' | 'hu';
}

export default function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const _t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [updatingPrivacy, setUpdatingPrivacy] = useState(false);

  // Unwrap async params
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error('Failed to unwrap params:', error);
        // Fallback: extract from URL
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const certificateIndex = pathParts.findIndex(part => part === 'certificate');
          if (certificateIndex !== -1 && pathParts[certificateIndex + 1]) {
            setSlug(pathParts[certificateIndex + 1]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadParams();
  }, [params]);

  // Fetch certificate by slug
  useEffect(() => {
    if (!slug) return;

    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/certificates/${slug}`);
        const data = await res.json();
        
        if (data.success && data.certificate) {
          setCertificate(data.certificate);
          // Check if current user is owner
          if (session?.user?.id && data.certificate.playerId === session.user.id) {
            setIsOwner(true);
          }
        } else {
          setError(data.error || 'Certificate not found');
        }
      } catch (error) {
        console.error('Failed to fetch certificate:', error);
        setError('Network error - failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [slug, session?.user?.id]);

  // Toggle privacy (owner only)
  const handleTogglePrivacy = async () => {
    if (!certificate || !isOwner) return;

    try {
      setUpdatingPrivacy(true);
      const res = await fetch(`/api/certificates/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !certificate.isPublic }),
      });

      const data = await res.json();
      if (data.success && data.certificate) {
        setCertificate(data.certificate);
      } else {
        notifications.show({ color: 'red', title: 'Privacy update failed', message: data.error || 'Failed to update privacy settings' });
      }
    } catch (error) {
      console.error('Failed to update privacy:', error);
      notifications.show({ color: 'red', title: 'Privacy update failed', message: 'Failed to update privacy settings' });
    } finally {
      setUpdatingPrivacy(false);
    }
  };

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

  if (error || !certificate) {
    return (
      <Box bg="dark.9" mih="100vh">
        <Container size="sm" py="xl" mih="100vh" style={{ display: 'grid', placeItems: 'center' }}>
          <Paper withBorder radius="md" p="xl" ta="center" bg="dark.8">
            <ThemeIcon size={64} radius="xl" color="red" mx="auto" mb="md">
              <IconX size={34} />
            </ThemeIcon>
            <Title order={1} size="h3" c="white" mb="sm">
              Verification Failed
            </Title>
            <Text c="gray.4" mb="lg">
              {error || 'Certificate not found or invalid'}
            </Text>
            <Button onClick={() => router.push(`/${locale}`)}>
            Go Home
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const issuedDate = new Date(certificate.issuedAtISO).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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

        <Paper withBorder radius="md" p="xl" bg="dark.8" mb="lg">
          {certificate.isRevoked ? (
            <Stack align="center" ta="center">
              <ThemeIcon size={64} radius="xl" color="red">
                <IconX size={34} />
              </ThemeIcon>
              <Title order={2} size="h3" c="white">
                Certificate Revoked
              </Title>
              <Text c="gray.4">This certificate has been revoked and is no longer valid.</Text>
              {certificate.revokedReason && (
                <Text c="gray.5" size="sm">
                  Reason: {certificate.revokedReason}
                </Text>
              )}
              {certificate.revokedAtISO && (
                <Text c="gray.5" size="sm">
                  Revoked on: {new Date(certificate.revokedAtISO).toLocaleDateString()}
                </Text>
              )}
            </Stack>
          ) : (
            <>
              <Group justify="space-between" align="center" mb="xl">
                <Group>
                  <ThemeIcon size={64} radius="xl" color="amanobaYellow">
                    <IconAward size={34} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Title order={2} size="h3" c="white">
                      Certificate Verified
                    </Title>
                    <Text c="gray.4">This certificate is authentic</Text>
                  </Stack>
                </Group>
                <ThemeIcon size={52} radius="xl" color="green">
                  <IconRosetteDiscountCheck size={30} />
                </ThemeIcon>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
                <Card withBorder radius="md" bg="dark.7">
                  <Text c="gray.4" size="sm">Recipient</Text>
                  <Text c="white" fw={700} size="lg">{certificate.recipientName}</Text>
                </Card>
                <Card withBorder radius="md" bg="dark.7">
                  <Text c="gray.4" size="sm">Course</Text>
                  <Text c="white" fw={700} size="lg">{certificate.courseTitle}</Text>
                </Card>
                <Card withBorder radius="md" bg="dark.7">
                  <Text c="gray.4" size="sm">Certificate ID</Text>
                  <Text c="white" ff="monospace" size="sm">{certificate.certificateId}</Text>
                </Card>
                <Card withBorder radius="md" bg="dark.7">
                  <Text c="gray.4" size="sm">Issued Date</Text>
                  <Text c="white">{issuedDate}</Text>
                </Card>
                  {certificate.finalExamScorePercentInteger !== undefined && (
                  <Card withBorder radius="md" bg="dark.7">
                    <Text c="gray.4" size="sm">Final Exam Score</Text>
                    <Text c="white" fw={700}>{certificate.finalExamScorePercentInteger}%</Text>
                  </Card>
                  )}
                <Card withBorder radius="md" bg="dark.7">
                  <Text c="gray.4" size="sm">Status</Text>
                  <Badge color={certificate.isPublic ? 'green' : 'gray'} leftSection={certificate.isPublic ? <IconLockOpen size={12} /> : <IconLock size={12} />}>
                    {certificate.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </Card>
              </SimpleGrid>

              {isOwner && (
                <>
                  <Divider mb="lg" />
                  <Group justify="space-between" align="center" mb="lg">
                    <Stack gap={2}>
                      <Title order={3} size="h4" c="white">
                        Privacy Settings
                      </Title>
                      <Text c="white" fw={600}>
                        {certificate.isPublic ? 'Public' : 'Private'}
                      </Text>
                      <Text c="gray.4" size="sm">
                        {certificate.isPublic
                          ? 'Anyone with the link can view this certificate'
                          : 'Only you can view this certificate'}
                      </Text>
                    </Stack>
                    <Button
                      onClick={handleTogglePrivacy}
                      disabled={updatingPrivacy}
                      loading={updatingPrivacy}
                      variant={certificate.isPublic ? 'default' : 'filled'}
                      leftSection={certificate.isPublic ? <IconLock size={16} /> : <IconLockOpen size={16} />}
                    >
                      {certificate.isPublic ? 'Make Private' : 'Make Public'}
                    </Button>
                  </Group>
                </>
              )}

              {isOwner && certificate.playerId && (
                <>
                  <Divider mb="lg" />
                  <Button component={LocaleLink} href={`/profile/${certificate.playerId}/certificate/${certificate.courseId}`} leftSection={<IconExternalLink size={16} />}>
                    View Full Certificate
                  </Button>
                </>
              )}
            </>
          )}
        </Paper>

        <Group justify="center">
          <Button variant="subtle" color="gray" onClick={() => router.push(`/${locale}`)}>
            Back to Home
          </Button>
        </Group>
      </Container>
    </Box>
  );
}
