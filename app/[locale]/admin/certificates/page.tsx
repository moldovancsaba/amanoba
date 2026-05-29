/**
 * Admin Certificates Management Page
 *
 * What: Manage all certificates in the platform.
 * Why: Allows admins to view, search, filter, and manage certificates.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { AdminPageHeader } from '@/app/components/patterns/AdminPageHeader';
import {
  IconAward,
  IconCheck,
  IconCircleX,
  IconEye,
  IconSearch,
} from '@tabler/icons-react';
import { useDebounce } from '@/app/lib/hooks/useDebounce';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';
import { MetricCard } from '@/app/components/patterns/MetricCard';
import { ResponsiveDataView } from '@/app/components/patterns/ResponsiveDataView';

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

  const certificateColumns = useMemo(
    () => [
      {
        key: 'certificate',
        header: 'Certificate',
        mobileLabel: 'Certificate',
        cell: (cert: Certificate) => (
          <Group gap="sm">
            <ThemeIcon color="yellow" variant="light" radius="xl">
              <IconAward size={18} />
            </ThemeIcon>
            <Stack gap={2}>
              <Text size="sm" fw={700}>
                {cert.certificateId}
              </Text>
              <Text size="xs" c="dimmed">
                {cert.verificationSlug}
              </Text>
            </Stack>
          </Group>
        ),
      },
      {
        key: 'recipient',
        header: 'Recipient',
        cell: (cert: Certificate) => (
          <Stack gap={2}>
            <Text size="sm" fw={700}>
              {cert.recipientName}
            </Text>
            <Text size="xs" c="dimmed">
              {cert.playerId}
            </Text>
          </Stack>
        ),
      },
      {
        key: 'course',
        header: 'Course',
        cell: (cert: Certificate) => (
          <Stack gap={2}>
            <Text size="sm" fw={700}>
              {cert.courseTitle}
            </Text>
            <Text size="xs" c="dimmed">
              {cert.courseId}
            </Text>
          </Stack>
        ),
      },
      {
        key: 'score',
        header: 'Score',
        cell: (cert: Certificate) => (
          <Text
            size="sm"
            fw={cert.finalExamScorePercentInteger !== undefined ? 700 : undefined}
            c={cert.finalExamScorePercentInteger !== undefined ? undefined : 'dimmed'}
          >
            {cert.finalExamScorePercentInteger !== undefined
              ? `${cert.finalExamScorePercentInteger}%`
              : '-'}
          </Text>
        ),
      },
      {
        key: 'status',
        header: tCommon('status'),
        cell: (cert: Certificate) => <CertificateStatus revoked={Boolean(cert.isRevoked)} />,
      },
      {
        key: 'issued',
        header: 'Issued',
        cell: (cert: Certificate) => (
          <Text size="sm">
            {new Date(cert.issuedAtISO).toLocaleDateString('hu-HU', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        ),
      },
      {
        key: 'actions',
        header: tCommon('actions'),
        align: 'right' as const,
        cell: (cert: Certificate) => (
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
        ),
      },
    ],
    [locale, tCommon]
  );

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
      <AdminPageHeader
        title="Certificates Management"
        description="View, search, and manage all certificates"
        primaryAction={
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
        }
      />

      <DataToolbar title="Search certificates">
        <TextInput
          leftSection={<IconSearch size={18} />}
          placeholder="Search certificates by ID, name, course, or slug..."
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPagination({ ...pagination, page: 1 });
          }}
          w={{ base: '100%', sm: 320 }}
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
          w={{ base: '100%', sm: 200 }}
        />
      </DataToolbar>

      <Card padding={0}>
        <Stack gap={0}>
          {loading ? (
            <Group justify="center" p="sm">
              <Loader size="sm" color="amanobaYellow" />
              <Text size="sm" c="dimmed">
                Searching...
              </Text>
            </Group>
          ) : null}
          <Box p="md">
            <ResponsiveDataView
              rows={certificates}
              columns={certificateColumns}
              rowKey={(cert) => cert._id}
              minTableWidth={980}
              emptyState={<Text c="dimmed" ta="center" py="xl">{tCommon('noDataFound')}</Text>}
              highlightOnHover
            />
          </Box>
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
