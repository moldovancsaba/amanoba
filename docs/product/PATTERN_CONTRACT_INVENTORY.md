# Amanoba Pattern Contract Inventory

**Last Updated**: 2026-07-03
**Status**: GDS 3.9.0 enforced (`gds-adoption.json`)
**Shared SSOT**: [sovereignsquad/general-design-system](https://github.com/sovereignsquad/general-design-system)
**Aligned GDS Version**: `3.9.0`

This document is Amanoba's local adapter inventory for the GDS pattern service model. It records implementation paths and migration state only.

## Contract Summary

| GDS Contract | Amanoba implementation | GDS package | Status | Notes |
| --- | --- | --- | --- | --- |
| Theme | `app/lib/ui/amanoba-gds-theme.ts` | `@sovereignsquad/gds-theme/server` + `extendGdsTheme` | Canonical | Dark product shell; `theme.other.brand` / `email` |
| Learner shell / page header | `app/components/patterns/gds/LearnerShellAdapter.tsx` | — | Local adapter | Stable import remains `app/components/LearnerPageHeader.tsx`; direct shared shell blocked by GDS #80 |
| Article shell | `app/components/patterns/gds/ArticleShell.tsx` | `@sovereignsquad/gds-core` (brand-composition adapter) | Canonical | Re-export at `patterns/ArticleShell.tsx` |
| Product course card | `app/components/patterns/gds/CourseCard.tsx` | `@sovereignsquad/gds-core/client` `PublicProductCard` | Thin adapter | Stable import remains `app/components/patterns/CourseCard.tsx` |
| Metric card | `app/components/patterns/gds/MetricCard.tsx` | `@sovereignsquad/gds-core/client` `MetricCard` | Thin adapter | Amanoba `label`/`value`/`detail` aliases |
| Progress card | `app/components/patterns/gds/ProgressCard.tsx` | `@sovereignsquad/gds-core/client` `ProgressCard` | Thin adapter | Quest/course progress |
| State block | `app/components/patterns/gds/StateBlock.tsx` | `@sovereignsquad/gds-core/client` `StateBlock` | Thin adapter | `kind` → `variant` |
| Course access recovery | `app/components/patterns/gds/CourseAccessRecoveryActions.tsx` | `@sovereignsquad/gds-core/client` `AccessRecoveryPanel` | Thin adapter | Maps course API codes to panel state |
| Admin shell | `app/[locale]/admin/layout.tsx` | `@sovereignsquad/gds-admin/client` `AppShell` | Active | GDS admin shell + Amanoba nav |
| Admin page header | `app/components/patterns/gds/AdminPageHeader.tsx` | `@sovereignsquad/gds-admin/client` `PageHeader` | Active | All admin routes with list/detail titles |
| Auth shell | `app/components/patterns/gds/AuthShell.tsx` | `@sovereignsquad/gds-core/AuthShell` (Amanoba variant) | Canonical | Dark `ink.9` layout |
| Public shell | `app/components/patterns/gds/PublicAppShell.tsx` | `@sovereignsquad/gds-core/PublicShell` (Amanoba variant) | Canonical | Marketing header band |
| Data toolbar | `app/components/patterns/gds/DataToolbar.tsx` | `@sovereignsquad/gds-core/DataToolbar` (aligned local) | Canonical | `layout: inline \| stack` |
| Responsive data view | `app/components/patterns/gds/ResponsiveDataView.tsx` | `@sovereignsquad/gds-admin/client` `ResponsiveDataView` | Active | Thin adapter: Amanoba `rows`/`columns` API |
| Editor shell | `app/[locale]/editor/layout.tsx` | `@sovereignsquad/gds-admin/client` `AppShell` | Active | Course editor portal nav |
| Editor lesson scaffold | `app/[locale]/editor/courses/.../lessons/[lessonId]/page.tsx` | `@sovereignsquad/gds-admin/client` `EditorScaffold` + `ContentOpsActionBar` | Active | Form + sticky save bar |
| Game shell | `app/[locale]/games/**` | — | Canonical + exception | Canvas exception |
| Game board card | `app/components/patterns/gds/GameBoardCard.tsx` | `@sovereignsquad/gds-core/client` `GameBoardTile` | Thin adapter | `highlightColor="amanoba.5"` |

## Canonical Component Rules

- Import shared patterns from `@/app/components/patterns/*` or `@/app/components/patterns/gds`.
- Do not duplicate pattern implementations outside `patterns/gds/` except documented stable re-exports and brand-composition adapters in `gds-adoption.json`.
- Loading, empty, error, permission, success on learner routes must use `StateBlock`.

## Current Highest-Risk Gaps

- GDS **LearnerAppShell** contract remains open upstream (coordination: general-design-system #80).
- npm registry publication is now live. Amanoba uses `@sovereignsquad/*@3.9.0` from npm instead of sibling `file:` links or GitHub release tarballs.

## Verification Commands

- `npm run ui:gds:check`
- `npm run ui:gds:verify`
- `npm run ui:check:gds-patterns`
- `npm run ui:gds:compliance`
- `npm run gds:import-smoke`
- `npm run ui:check:mantine`
- `npm run ui:check:foundation`
- `npm run ui:check:layout`
- `npm run type-check`
- `npm run lint`
- `npm run build`
