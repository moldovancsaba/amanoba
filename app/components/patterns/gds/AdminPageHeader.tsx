'use client';

import {
  PageHeader,
  type PageHeaderOverflowAction,
  type PageHeaderProps,
} from '@sovereignsquad/gds-admin/client';

export type AdminPageHeaderProps = PageHeaderProps;

/**
 * Admin workspace title band — `@sovereignsquad/gds-admin` PageHeader with Amanoba import path.
 */
export function AdminPageHeader(props: AdminPageHeaderProps) {
  return <PageHeader {...props} />;
}

export type { PageHeaderOverflowAction };
