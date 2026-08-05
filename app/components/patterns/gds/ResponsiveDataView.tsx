import type { ReactNode } from 'react';
import {
  ResponsiveDataView as GdsResponsiveDataView,
  type DataTableColumn,
} from '@sovereignsquad/gds-admin/client';
import { Box, Card, Group, Stack, Text } from '@mantine/core';

/**
 * Column definition for {@link ResponsiveDataView}.
 * 
 * @property {string} key - Unique column identifier
 * @property {ReactNode} header - Desktop table header text
 * @property {(row: T) => ReactNode} cell - Cell renderer function
 * @property {ReactNode} [mobileLabel] - Optional mobile card label (defaults to header)
 * @property {boolean} [hideOnMobile=false] - Hide this column on mobile cards
 * @property {'left' | 'center' | 'right'} [align='left'] - Cell alignment
 */
export type ResponsiveColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  mobileLabel?: ReactNode;
  hideOnMobile?: boolean;
  align?: 'left' | 'center' | 'right';
};

/**
 * Props for {@link ResponsiveDataView}.
 * 
 * @property {T[]} rows - Data rows
 * @property {ResponsiveColumn<T>[]} columns - Column definitions
 * @property {(row: T, index: number) => string} rowKey - Unique row key function
 * @property {number} [minTableWidth] - Reserved (not currently used)
 * @property {ReactNode} [emptyState] - Custom empty state content
 * @property {boolean} [loading=false] - Loading state
 * @property {ReactNode} [loadingState] - Custom loading state content
 * @property {boolean} [striped] - Reserved (not currently used)
 * @property {boolean} [highlightOnHover] - Reserved (not currently used)
 * @property {boolean} [withTableBorder] - Reserved (not currently used)
 * @property {boolean} [withColumnBorders] - Reserved (not currently used)
 * @property {(row: T, index: number) => React.CSSProperties | undefined} [getRowStyle] - Custom row/card styling
 * 
 * @example
 * ```tsx
 * <ResponsiveDataView
 *   rows={players}
 *   columns={[
 *     { key: 'name', header: 'Name', cell: (row) => row.displayName },
 *     { key: 'email', header: 'Email', cell: (row) => row.email, hideOnMobile: true },
 *     { key: 'level', header: 'Level', cell: (row) => row.level, align: 'right' },
 *   ]}
 *   rowKey={(row) => row.id}
 *   loading={isLoading}
 *   emptyState={<Text>No players found</Text>}
 * />
 * ```
 */
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
 * Canonical admin data view with responsive table/card layout.
 * 
 * **Contract**: Unified desktop table + mobile card rendering for admin lists.
 * 
 * **Server/Client Safety**: ⚠️ Client-only (uses GDS admin client component)
 * 
 * **Consuming Routes**:
 * - All admin list pages (players, payments, certificates, courses, rewards, quests, surveys, games, analytics, email-analytics, questions, achievements, votes, challenges, discussion, feature-flags, certificate-templates)
 * 
 * **GDS Backing**: ✅ `@sovereignsquad/gds-admin/client` `ResponsiveDataView`
 * 
 * **Responsive Behavior**:
 * - **Desktop**: Data table with sortable columns
 * - **Mobile**: Stacked cards with label-value pairs
 * - Breakpoint: Managed by GDS (typically md/768px)
 * 
 * **Column Configuration**:
 * - `key`: Unique identifier (required)
 * - `header`: Desktop table header (required)
 * - `cell`: Cell renderer (required)
 * - `mobileLabel`: Mobile card label (defaults to header)
 * - `hideOnMobile`: Exclude from mobile cards (e.g., long IDs)
 * - `align`: Cell/value alignment (left, center, right)
 * 
 * **State Handling**:
 * - **Loading + loadingState**: Shows custom loading UI
 * - **Loading (no loadingState)**: GDS default spinner
 * - **Empty + emptyState**: Shows custom empty UI
 * - **Empty (no emptyState)**: GDS default empty message
 * 
 * **Mobile Card Behavior**:
 * - Each row becomes a Card
 * - Columns not hidden render as label-value pairs
 * - Labels left-aligned (dimmed), values right-aligned
 * - Custom row styling via `getRowStyle` applies to cards
 * 
 * **Row Actions**:
 * - Include action column with buttons/menu
 * - Action column should not hide on mobile
 * - Use compact button sizes for mobile cards
 * 
 * **Accessibility**:
 * - Desktop table has semantic structure
 * - Mobile cards have visible labels (not header-only)
 * - Row actions keyboard-navigable
 * 
 * **Performance**: Client-only due to GDS dependency
 * 
 * **Pagination**: Handle externally (typically with DataToolbar + pagination controls)
 * 
 * @param props - {@link ResponsiveDataViewProps}
 * @returns Responsive data table/cards backed by GDS
 * 
 * @see {@link DataToolbar} for filter/search/action toolbar
 * @see {@link AdminPageHeader} for page title
 * 
 * @remarks
 * Admin list contract — delegates table/card responsive layout to `@sovereignsquad/gds-admin`.
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
