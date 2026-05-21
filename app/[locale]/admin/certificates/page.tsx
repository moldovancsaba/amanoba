/**
 * Admin Certificates Management Page
 *
 * What: Manage all certificates in the platform.
 * Why: Allows admins to view, search, filter, and manage certificates.
 */

'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconAward,
  IconCheck,
  IconCircleX,
  IconEye,
  IconSearch,
} from '@tabler/icons-react';
import { useDebounce } from '@/app/lib/hooks/useDebounce';

interface Certificate {
  _id: string;
  certificateId: string;
  recipientName: string;
  courseId: string;
  courseTitle: string;
  playerId: string;
  verificationSlug: string;
  issuedAtISO: string;
  finalExamScorePercentInteger?: number;
  isRevoked?: boolean;
  revokedAtISO?: string;
  revokedReason?: string;
  isPublic?: boolean;
  locale: 'en' | 'hu';
  createdAt: string;
}

export default function AdminCertificatesPage() {
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useState({ status: 'all' });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filters.status !== 'all') params.append('status', filters.status);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/admin/certificates?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCertificates(data.certificates || []);
        setPagination((prev) => data.pagination || prev);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [debouncedSearch, filters.status, pagination.limit, pagination.page]);

  useEffect(() => {
    void fetchCertificates();
  }, [fetchCertificates]);

  if (initialLoading) {
    return (
      <Center mih={400}>
        <Group>
          <Loader color="amanobaYellow" />
          <Text c="white">{tCommon('loading')}</Text>
        </Group>
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Title order={1} c="white">Certificates Management</Title>
          <Text c="gray.4">View, search, and manage all certificates</Text>
        </Stack>
        <Button
          component="a"
          href="https://github.com/moldovancsaba/amanoba/blob/main/docs/CERTIFICATE_CREATION_GUIDE.md"
          target="_blank"
          rel="noopener noreferrer"
          variant="default"
          leftSection={<IconAward size={18} />}
        >
          Certificate Creation Guide
        </Button>
      </Group>

      <Card padding="md">
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <TextInput
            leftSection={<IconSearch size={18} />}
            placeholder="Search certificates by ID, name, course, or slug..."
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              setPagination({ ...pagination, page: 1 });
            }}
          />
          <Select
            data={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active Only' },
              { value: 'revoked', label: 'Revoked Only' },
            ]}
            value={filters.status}
            onChange={(value) => {
              setFilters({ ...filters, status: value || 'all' });
              setPagination({ ...pagination, page: 1 });
            }}
            allowDeselect={false}
          />
        </SimpleGrid>
      </Card>

      <Card padding={0}>
        <Stack gap={0}>
          {loading && (
            <Group justify="center" p="sm">
              <Loader size="sm" color="amanobaYellow" />
              <Text size="sm" c="dimmed">Searching...</Text>
            </Group>
          )}
          <ScrollArea>
            <Table miw={980} verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Certificate</Table.Th>
                  <Table.Th>Recipient</Table.Th>
                  <Table.Th>Course</Table.Th>
                  <Table.Th>Score</Table.Th>
                  <Table.Th>{tCommon('status')}</Table.Th>
                  <Table.Th>Issued</Table.Th>
                  <Table.Th>{tCommon('actions')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {certificates.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Text c="dimmed" ta="center" py="xl">{tCommon('noDataFound')}</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  certificates.map((cert) => (
                    <Table.Tr key={cert._id}>
                      <Table.Td>
                        <Group gap="sm">
                          <ThemeIcon color="yellow" variant="light" radius="xl">
                            <IconAward size={18} />
                          </ThemeIcon>
                          <Stack gap={2}>
                            <Text size="sm" fw={700}>{cert.certificateId}</Text>
                            <Text size="xs" c="dimmed">{cert.verificationSlug}</Text>
                          </Stack>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text size="sm" fw={700}>{cert.recipientName}</Text>
                          <Text size="xs" c="dimmed">{cert.playerId}</Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text size="sm" fw={700}>{cert.courseTitle}</Text>
                          <Text size="xs" c="dimmed">{cert.courseId}</Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={cert.finalExamScorePercentInteger !== undefined ? 700 : undefined} c={cert.finalExamScorePercentInteger !== undefined ? undefined : 'dimmed'}>
                          {cert.finalExamScorePercentInteger !== undefined ? `${cert.finalExamScorePercentInteger}%` : '-'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <CertificateStatus revoked={Boolean(cert.isRevoked)} />
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(cert.issuedAtISO).toLocaleDateString('hu-HU', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Button
                          component={Link}
                          href={`/${locale}/certificate/${cert.verificationSlug}`}
                          target="_blank"
                          variant="subtle"
                          size="compact-sm"
                          leftSection={<IconEye size={16} />}
                        >
                          View
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
      </Card>

      {pagination.pages > 1 && (
        <Group justify="space-between">
          <Text c="dimmed" size="sm">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} certificates
          </Text>
          <Pagination
            value={pagination.page}
            total={pagination.pages}
            onChange={(page) => setPagination({ ...pagination, page })}
          />
        </Group>
      )}

      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <MetricCard label="Total Certificates" value={pagination.total.toString()} icon={<IconAward size={20} />} color="amanobaYellow" />
        <MetricCard
          label="Active Certificates"
          value={certificates.filter((cert) => !cert.isRevoked).length.toString()}
          icon={<IconCheck size={20} />}
          color="green"
        />
        <MetricCard
          label="Revoked Certificates"
          value={certificates.filter((cert) => cert.isRevoked).length.toString()}
          icon={<IconCircleX size={20} />}
          color="red"
        />
      </SimpleGrid>
    </Stack>
  );
}

function CertificateStatus({ revoked }: { revoked: boolean }) {
  return revoked ? (
    <Badge color="red" leftSection={<IconCircleX size={12} />} variant="light">Revoked</Badge>
  ) : (
    <Badge color="green" leftSection={<IconCheck size={12} />} variant="light">Active</Badge>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <Card padding="md">
      <Group justify="space-between">
        <Stack gap={2}>
          <Text size="sm" c="dimmed">{label}</Text>
          <Text size="xl" fw={800}>{value}</Text>
        </Stack>
        <ThemeIcon color={color} variant="light">{icon}</ThemeIcon>
      </Group>
    </Card>
  );
}
