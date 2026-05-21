/**
 * Admin Payments Dashboard
 *
 * What: View all payment transactions and revenue analytics.
 * Why: Allows admins to track revenue, view transactions, and analyze payment data.
 */

'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  Pagination,
  Paper,
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
  IconCheck,
  IconDownload,
  IconEye,
  IconRefresh,
  IconTrendingDown,
  IconTrendingUp,
  IconX,
  IconCurrencyDollar,
} from '@tabler/icons-react';

interface PaymentTransaction {
  id: string;
  playerId: string | null;
  playerName: string;
  playerEmail: string | null;
  courseId: string | null;
  courseName: string | null;
  amount: number;
  currency: string;
  status: string;
  premiumGranted: boolean;
  premiumExpiresAt: string | null;
  premiumDurationDays: number | null;
  paymentMethod: {
    type: string;
    brand?: string;
    last4?: string;
    country?: string;
  } | null;
  stripePaymentIntentId: string;
  stripeCheckoutSessionId: string | null;
  stripeCustomerId: string | null;
  stripeChargeId: string | null;
  createdAt: string;
  processedAt: string | null;
  refundedAt: string | null;
  failureReason: string | null;
  refundReason: string | null;
}

interface Analytics {
  totalRevenue: Array<{ currency: string; amount: number; count: number }>;
  revenueByCourse: Array<{
    courseId: string | null;
    courseName: string;
    totalAmount: number;
    count: number;
  }>;
  statusBreakdown: Array<{ status: string; count: number }>;
  revenueByPeriod: {
    today: Array<{ currency: string; amount: number; count: number }>;
    last7Days: Array<{ currency: string; amount: number; count: number }>;
    last30Days: Array<{ currency: string; amount: number; count: number }>;
  };
  successRate: number;
  failureRate: number;
  refundRate: number;
  totalTransactions: number;
  succeededTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
}

const LIMIT = 50;

const statusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'succeeded', label: 'Succeeded' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'canceled', label: 'Canceled' },
];

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('');
  const [playerFilter, setPlayerFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (courseFilter) params.append('courseId', courseFilter);
      if (playerFilter) params.append('playerId', playerFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      params.append('limit', LIMIT.toString());
      params.append('offset', ((currentPage - 1) * LIMIT).toString());
      params.append('analytics', 'true');

      const response = await fetch(`/api/admin/payments?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTransactions(data.transactions || []);
        setTotalCount(data.pagination?.total || 0);
        setAnalytics(data.analytics || null);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  }, [courseFilter, currentPage, endDate, playerFilter, startDate, statusFilter]);

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  const formatCurrency = (amount: number, currency: string): string => {
    const formatter = new Intl.NumberFormat(
      currency === 'HUF' ? 'hu-HU' : currency === 'EUR' ? 'de-DE' : currency === 'GBP' ? 'en-GB' : 'en-US',
      {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: currency === 'HUF' ? 0 : 2,
        maximumFractionDigits: currency === 'HUF' ? 0 : 2,
      }
    );
    return formatter.format(currency === 'HUF' ? amount : amount / 100);
  };

  const resetToFirstPage = (setter: (value: string) => void, value: string | null) => {
    setter(value || '');
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'User Name',
      'User Email',
      'Course',
      'Amount',
      'Currency',
      'Status',
      'Payment Method',
      'Premium Granted',
      'Created At',
      'Stripe Payment Intent ID',
    ];

    const rows = transactions.map((tx) => [
      tx.id,
      tx.playerName,
      tx.playerEmail || '',
      tx.courseName || 'N/A',
      tx.amount,
      tx.currency,
      tx.status,
      tx.paymentMethod ? `${tx.paymentMethod.type} ${tx.paymentMethod.last4 || ''}` : 'N/A',
      tx.premiumGranted ? 'Yes' : 'No',
      new Date(tx.createdAt).toISOString(),
      tx.stripePaymentIntentId,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Title order={1} c="white">Payment Dashboard</Title>
          <Text c="gray.4">View all transactions and revenue analytics</Text>
        </Stack>
        <Group>
          <Button variant="default" leftSection={<IconDownload size={18} />} onClick={exportToCSV}>
            Export CSV
          </Button>
          <Button leftSection={<IconRefresh size={18} />} onClick={() => void fetchPayments()}>
            Refresh
          </Button>
        </Group>
      </Group>

      {analytics && (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }}>
          <MetricCard
            label="Total Revenue"
            value={analytics.totalRevenue.length > 0
              ? analytics.totalRevenue.map((rev) => formatCurrency(rev.amount, rev.currency)).join(' / ')
              : '$0.00'}
            detail={`${analytics.succeededTransactions} successful transactions`}
            icon={<IconCurrencyDollar size={22} />}
            color="amanobaYellow"
          />
          <MetricCard
            label="Success Rate"
            value={`${analytics.successRate.toFixed(1)}%`}
            detail={`${analytics.succeededTransactions} / ${analytics.totalTransactions} transactions`}
            icon={<IconTrendingUp size={22} />}
            color="green"
          />
          <MetricCard
            label="Failed"
            value={analytics.failedTransactions.toString()}
            detail={`${analytics.failureRate.toFixed(1)}% failure rate`}
            icon={<IconTrendingDown size={22} />}
            color="red"
          />
          <MetricCard
            label="Refunded"
            value={analytics.refundedTransactions.toString()}
            detail={`${analytics.refundRate.toFixed(1)}% refund rate`}
            icon={<IconRefresh size={22} />}
            color="yellow"
          />
        </SimpleGrid>
      )}

      {analytics && (
        <Card padding="lg">
          <Stack gap="md">
            <Title order={2} size="h3">Revenue by Period</Title>
            <SimpleGrid cols={{ base: 1, md: 3 }}>
              <RevenuePeriod label="Today" values={analytics.revenueByPeriod.today} formatCurrency={formatCurrency} />
              <RevenuePeriod label="Last 7 Days" values={analytics.revenueByPeriod.last7Days} formatCurrency={formatCurrency} />
              <RevenuePeriod label="Last 30 Days" values={analytics.revenueByPeriod.last30Days} formatCurrency={formatCurrency} />
            </SimpleGrid>
          </Stack>
        </Card>
      )}

      <Card padding="md">
        <SimpleGrid cols={{ base: 1, md: 2, lg: 5 }}>
          <Select
            label="Status"
            data={statusOptions}
            value={statusFilter}
            onChange={(value) => resetToFirstPage(setStatusFilter, value || 'all')}
            allowDeselect={false}
          />
          <TextInput
            label="Course"
            placeholder="Course ID..."
            value={courseFilter}
            onChange={(event) => resetToFirstPage(setCourseFilter, event.currentTarget.value)}
          />
          <TextInput
            label="User ID"
            placeholder="User ID..."
            value={playerFilter}
            onChange={(event) => resetToFirstPage(setPlayerFilter, event.currentTarget.value)}
          />
          <TextInput
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(event) => resetToFirstPage(setStartDate, event.currentTarget.value)}
          />
          <TextInput
            label="End Date"
            type="date"
            value={endDate}
            onChange={(event) => resetToFirstPage(setEndDate, event.currentTarget.value)}
          />
        </SimpleGrid>
      </Card>

      <Card padding={0}>
        <ScrollArea>
          <Table miw={980} verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Player</Table.Th>
                <Table.Th>Course</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Payment Method</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Group justify="center" py="xl">
                      <Loader color="amanobaYellow" />
                      <Text c="dimmed">Loading transactions...</Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ) : transactions.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text c="dimmed" ta="center" py="xl">No transactions found</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                transactions.map((tx) => (
                  <Table.Tr key={tx.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text size="sm">{new Date(tx.createdAt).toLocaleDateString()}</Text>
                        <Text size="xs" c="dimmed">{new Date(tx.createdAt).toLocaleTimeString()}</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text size="sm">{tx.playerName}</Text>
                        {tx.playerEmail && <Text size="xs" c="dimmed">{tx.playerEmail}</Text>}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{tx.courseName || 'N/A'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={700}>{formatCurrency(tx.amount, tx.currency)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <StatusBadge status={tx.status} />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatPaymentMethod(tx.paymentMethod)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Button
                        variant="subtle"
                        size="compact-sm"
                        leftSection={<IconEye size={16} />}
                        onClick={() => setSelectedTransaction(tx)}
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

        {totalPages > 1 && (
          <Group justify="space-between" p="md">
            <Text size="sm" c="dimmed">
              Showing {(currentPage - 1) * LIMIT + 1} to {Math.min(currentPage * LIMIT, totalCount)} of {totalCount} transactions
            </Text>
            <Pagination value={currentPage} onChange={setCurrentPage} total={totalPages} />
          </Group>
        )}
      </Card>

      <Modal
        opened={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction Details"
        size="lg"
        centered
      >
        {selectedTransaction && (
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Detail label="Transaction ID" value={selectedTransaction.id} mono />
              <Detail label="Status" value={<StatusBadge status={selectedTransaction.status} />} />
              <Detail label="User" value={selectedTransaction.playerName} detail={selectedTransaction.playerEmail || undefined} />
              <Detail label="Course" value={selectedTransaction.courseName || 'N/A'} />
              <Detail label="Amount" value={formatCurrency(selectedTransaction.amount, selectedTransaction.currency)} />
              <Detail label="Payment Method" value={formatPaymentMethod(selectedTransaction.paymentMethod)} />
              <Detail label="Created At" value={new Date(selectedTransaction.createdAt).toLocaleString()} />
              {selectedTransaction.processedAt && (
                <Detail label="Processed At" value={new Date(selectedTransaction.processedAt).toLocaleString()} />
              )}
              {selectedTransaction.refundedAt && (
                <Detail label="Refunded At" value={new Date(selectedTransaction.refundedAt).toLocaleString()} />
              )}
              <Detail label="Premium Granted" value={selectedTransaction.premiumGranted ? 'Yes' : 'No'} />
              {selectedTransaction.premiumExpiresAt && (
                <Detail label="Premium Expires" value={new Date(selectedTransaction.premiumExpiresAt).toLocaleString()} />
              )}
            </SimpleGrid>

            <Detail label="Stripe Payment Intent ID" value={selectedTransaction.stripePaymentIntentId} mono />
            {selectedTransaction.stripeCheckoutSessionId && (
              <Detail label="Stripe Checkout Session ID" value={selectedTransaction.stripeCheckoutSessionId} mono />
            )}
            {selectedTransaction.failureReason && (
              <Detail label="Failure Reason" value={selectedTransaction.failureReason} color="red" />
            )}
            {selectedTransaction.refundReason && (
              <Detail label="Refund Reason" value={selectedTransaction.refundReason} color="yellow" />
            )}
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <Card padding="lg">
      <Stack gap="sm">
        <Group justify="space-between">
          <Text size="sm" c="dimmed" fw={600}>{label}</Text>
          <ThemeIcon color={color} variant="light">{icon}</ThemeIcon>
        </Group>
        <Text size="xl" fw={800}>{value}</Text>
        <Text size="xs" c="dimmed">{detail}</Text>
      </Stack>
    </Card>
  );
}

function RevenuePeriod({
  label,
  values,
  formatCurrency,
}: {
  label: string;
  values: Array<{ currency: string; amount: number; count: number }>;
  formatCurrency: (amount: number, currency: string) => string;
}) {
  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap={4}>
        <Text size="sm" c="dimmed" fw={600}>{label}</Text>
        {values.length > 0 ? (
          values.map((rev) => (
            <Text key={rev.currency} fw={800}>{formatCurrency(rev.amount, rev.currency)}</Text>
          ))
        ) : (
          <Text fw={800}>$0.00</Text>
        )}
      </Stack>
    </Paper>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = getStatusColor(status);
  const icon = status === 'succeeded'
    ? <IconCheck size={12} />
    : status === 'failed'
      ? <IconX size={12} />
      : undefined;

  return (
    <Badge color={color} leftSection={icon} variant="light">
      {status}
    </Badge>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'succeeded':
      return 'green';
    case 'failed':
      return 'red';
    case 'refunded':
    case 'partially_refunded':
      return 'yellow';
    case 'pending':
    case 'processing':
      return 'amanobaYellow';
    default:
      return 'gray';
  }
}

function formatPaymentMethod(method: PaymentTransaction['paymentMethod']) {
  if (!method) return 'N/A';
  return `${method.type} ${method.last4 ? `••••${method.last4}` : ''}`.trim();
}

function Detail({
  label,
  value,
  detail,
  mono,
  color,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  mono?: boolean;
  color?: string;
}) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed" fw={600}>{label}</Text>
      <Text fw={600} ff={mono ? 'monospace' : undefined} size={mono ? 'sm' : undefined} c={color} style={{ wordBreak: 'break-word' }}>
        {value}
      </Text>
      {detail && <Text size="sm" c="dimmed">{detail}</Text>}
    </Stack>
  );
}
