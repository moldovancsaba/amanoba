import type { ReactNode } from 'react';
import { Group, Paper, Stack, Text } from '@mantine/core';

/**
 * Props for {@link DataToolbar}.
 * 
 * @property {ReactNode} children - Filter controls, search inputs, action buttons
 * @property {string} [title] - Optional toolbar title
 * @property {string} [description] - Optional toolbar description/hint text
 * @property {'inline' | 'stack'} [layout='inline'] - Layout mode (inline: horizontal, stack: vertical)
 * 
 * @example
 * ```tsx
 * <DataToolbar title="Filters" description="Search and filter players">
 *   <TextInput placeholder="Search..." />
 *   <Select data={["All", "Active", "Inactive"]} />
 *   <Button>Export</Button>
 * </DataToolbar>
 * ```
 */
type DataToolbarProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  layout?: 'inline' | 'stack';
};

/**
 * Canonical admin data toolbar for filters, search, and actions.
 * 
 * **Contract**: Unified toolbar for admin list/report filtering and actions.
 * 
 * **Server/Client Safety**: ✅ Server-safe (no client-only hooks)
 * 
 * **Consuming Routes**:
 * - All admin list pages (players, payments, certificates, courses, etc.)
 * 
 * **GDS Backing**: ⚠️ Mantine-only (no direct GDS primitive, local composition)
 * 
 * **Slots**:
 * - `title` (optional): Toolbar title
 * - `description` (optional): Supporting text
 * - `children` (required): Filter controls, search inputs, action buttons
 * 
 * **Layout Modes**:
 * - `inline` (default): Horizontal group with wrap (for 1-3 controls)
 * - `stack`: Vertical stack (for multi-row filter grids)
 * 
 * **Styling**:
 * - Dark background (`ink.8`)
 * - Border and padding (`md`)
 * - Controls aligned to bottom (inline mode)
 * 
 * **Accessibility**:
 * - Toolbar title provides context
 * - Filter controls semantically grouped
 * - Focus order follows layout
 * 
 * **Performance**: Server-safe, minimal overhead
 * 
 * **Mobile Behavior**:
 * - Inline mode wraps controls naturally
 * - Stack mode remains vertical
 * 
 * @param props - {@link DataToolbarProps}
 * @returns Admin toolbar with filter/action controls
 * 
 * @see {@link ResponsiveDataView} for data table/card rendering
 * @see {@link AdminPageHeader} for page titles
 * 
 * @remarks
 * Shared admin/list filter row: search, selects, and action buttons in one governed band.
 * Use stack layout for multi-row filter grids; default is inline controls.
 */
export function DataToolbar({ children, title, description, layout = 'inline' }: DataToolbarProps) {
  return (
    <Paper bg="ink.8" p="md" withBorder>
      <Stack gap="md">
        {title || description ? (
          <Stack gap={4}>
            {title ? <Text fw={700}>{title}</Text> : null}
            {description ? (
              <Text size="sm" c="dimmed">
                {description}
              </Text>
            ) : null}
          </Stack>
        ) : null}
        {layout === 'stack' ? (
          <Stack gap="md">{children}</Stack>
        ) : (
          <Group align="flex-end" gap="md" wrap="wrap">
            {children}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
