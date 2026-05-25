'use client';

import type { ReactNode } from 'react';
import { Box, Card, Group, Stack, Table, Text } from '@mantine/core';

export type ResponsiveColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  mobileLabel?: ReactNode;
  hideOnMobile?: boolean;
  align?: 'left' | 'center' | 'right';
};

type ResponsiveDataViewProps<T> = {
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

export function ResponsiveDataView<T>({
  rows,
  columns,
  rowKey,
  minTableWidth = 640,
  emptyState,
  loading = false,
  loadingState,
  striped,
  highlightOnHover = true,
  withTableBorder,
  withColumnBorders,
  getRowStyle,
}: ResponsiveDataViewProps<T>) {
  if (loading) {
    return <>{loadingState ?? <Text c="dimmed">Loading...</Text>}</>;
  }

  if (rows.length === 0) {
    return emptyState ? <>{emptyState}</> : <Text c="dimmed">No data found</Text>;
  }

  const mobileColumns = columns.filter((column) => !column.hideOnMobile);

  return (
    <>
      <Box hiddenFrom="md">
        <Stack gap="sm">
          {rows.map((row, index) => (
            <Card key={rowKey(row, index)} withBorder p="md" style={getRowStyle?.(row, index)}>
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
          ))}
        </Stack>
      </Box>

      <Box visibleFrom="md">
        <Table.ScrollContainer minWidth={minTableWidth}>
          <Table
            striped={striped}
            highlightOnHover={highlightOnHover}
            withTableBorder={withTableBorder}
            withColumnBorders={withColumnBorders}
          >
            <Table.Thead>
              <Table.Tr>
                {columns.map((column) => (
                  <Table.Th key={column.key} ta={columnAlign(column.align)}>
                    {column.header}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row, index) => (
                <Table.Tr key={rowKey(row, index)} style={getRowStyle?.(row, index)}>
                  {columns.map((column) => (
                    <Table.Td key={column.key} ta={columnAlign(column.align)}>
                      {column.cell(row)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Box>
    </>
  );
}
