'use client';

import {
  PageHeader,
  type PageHeaderOverflowAction,
  type PageHeaderProps,
} from '@sovereignsquad/gds-admin/client';

/**
 * Re-exported GDS admin page header props.
 * 
 * See `@sovereignsquad/gds-admin/client` `PageHeaderProps` for full specification.
 * 
 * Common props:
 * - `title` (required): Page title
 * - `description` (optional): Supporting text
 * - `primaryAction` (optional): Main action button
 * - `overflowActions` (optional): Additional actions in overflow menu
 */
export type AdminPageHeaderProps = PageHeaderProps;

/**
 * Canonical admin page header for titles and actions.
 * 
 * **Contract**: Unified page title band for all admin routes.
 * 
 * **Server/Client Safety**: ⚠️ Client-only (uses GDS admin client component)
 * 
 * **Consuming Routes**:
 * - All admin pages with page-level titles and actions
 * 
 * **GDS Backing**: ✅ `@sovereignsquad/gds-admin/client` `PageHeader`
 * 
 * **Slots**:
 * - `title` (required): Page title (h1)
 * - `description` (optional): Supporting text
 * - `primaryAction` (optional): Main CTA button (e.g., "Create Player")
 * - `overflowActions` (optional): Additional actions in overflow menu
 * 
 * **Action Pattern**:
 * - **Desktop**: Primary action visible, overflow actions in menu
 * - **Mobile**: All actions may collapse into overflow based on GDS breakpoints
 * 
 * **Accessibility**:
 * - Title is semantic h1
 * - Actions keyboard-navigable
 * - Overflow menu accessible
 * 
 * **Performance**: Client-only due to GDS dependency
 * 
 * **Mobile Behavior**: Responsive via GDS (title wraps, actions stack/collapse)
 * 
 * @param props - {@link AdminPageHeaderProps}
 * @returns Admin page header backed by GDS
 * 
 * @see {@link DataToolbar} for filter/action toolbar
 * @see {@link ResponsiveDataView} for data tables
 * 
 * @remarks
 * Admin workspace title band — `@sovereignsquad/gds-admin` PageHeader with Amanoba import path.
 * This is a thin re-export, all behavior defined by GDS.
 */
export function AdminPageHeader(props: AdminPageHeaderProps) {
  return <PageHeader {...props} />;
}

/**
 * Re-exported GDS overflow action type.
 * 
 * Use for defining additional actions in AdminPageHeader overflow menu.
 */
export type { PageHeaderOverflowAction };
