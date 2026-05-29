import type { ReactNode } from 'react';
import {
  ResponsiveDataView as GdsResponsiveDataView,
  type DataTableColumn,
} from '@doneisbetter/gds-admin/client';
import { Box, Card, Group, Stack, Text } from '@mantine/core';

export type ResponsiveColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  mobileLabel?: ReactNode;
  hideOnMobile?: boolean;
  align?: 'left' | 'center' | 'right';
};

type ResponsiveDataViewProps<T extends object> = {
  rows: T[];
  columns: ResponsiveColumn<T>[];
  rowKey: (row: T, index: number) => string;
  minTableWidth?: number;
  emptyState?: ReactNode;
  loading?: boolean;
  loadingState?: ReactNode;
  striped?: boolean;
  highlightOnHover?: boolean;
  withTableBorder?: boolean;
  withColumnBorders?: boolean;
  getRowStyle?: (row: T, index: number) => React.CSSProperties | undefined;
};

function columnAlign(align: ResponsiveColumn<unknown>['align']) {
  if (align === 'right') return 'right' as const;
  if (align === 'center') return 'center' as const;
  return 'left' as const;
}

function columnLabel(header: ReactNode, key: string): string {
  if (typeof header === 'string') return header;
  if (typeof header === 'number') return String(header);
  return key;
}

function toGdsColumns<T extends object>(
  columns: ResponsiveColumn<T>[]
): DataTableColumn<T & Record<string, unknown>>[] {
  return columns.map((column) => ({
    key: column.key,
    label: columnLabel(column.header, column.key),
    render: (row) => column.cell(row),
  }));
}

function DefaultMobileCard<T extends object>({
  row,
  columns,
  style,
}: {
  row: T;
  columns: ResponsiveColumn<T>[];
  style?: React.CSSProperties;
}) {
  const mobileColumns = columns.filter((column) => !column.hideOnMobile);

  return (
    <Card withBorder p="md" style={style}>
      <Stack gap="xs">
        {mobileColumns.map((column) => (
          <Group key={column.key} justify="space-between" align="flex-start" wrap="nowrap" gap="md">
            <Text size="sm" c="dimmed" maw="40%">
              {column.mobileLabel ?? column.header}
            </Text>
            <Box style={{ textAlign: columnAlign(column.align), flex: 1 }}>{column.cell(row)}</Box>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}

/**
 * Admin list contract — delegates table/card responsive layout to `@doneisbetter/gds-admin`.
 * Preserves Amanoba column API (`header` / `cell`, mobile labels) for existing admin pages.
 */
export function ResponsiveDataView<T extends object>({
  rows,
  columns,
  rowKey,
  emptyState,
  loading = false,
  loadingState,
  getRowStyle,
}: ResponsiveDataViewProps<T>) {
  if (loading && loadingState) {
    return <>{loadingState}</>;
  }

  if (!loading && rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  const gdsRows = rows as Array<T & Record<string, unknown>>;

  return (
    <GdsResponsiveDataView
      data={gdsRows}
      columns={toGdsColumns(columns)}
      loading={loading}
      getRowKey={(row, index) => rowKey(row, index)}
      emptyTitle="No data found"
      emptyDescription="Try changing filters or create a new record."
      emptyAction={emptyState}
      renderCard={(row, index) => (
        <DefaultMobileCard
          row={row as T}
          columns={columns}
          style={getRowStyle?.(row as T, index)}
        />
      )}
    />
  );
}
