# Amanoba Pattern Contract Inventory

**Last Updated**: 2026-05-26
**Status**: GDS 2.6.1 enforced (`gds-adoption.json`)
**Shared SSOT**: [sovereignsquad/general-design-system](https://github.com/sovereignsquad/general-design-system)
**Aligned GDS Version**: `2.6.1`

This document is Amanoba's local adapter inventory for the GDS pattern service model. It records implementation paths and migration state only.

## Contract Summary

| GDS Contract | Amanoba implementation | GDS package | Status | Notes |
| --- | --- | --- | --- | --- |
| Theme | `app/lib/ui/amanoba-gds-theme.ts` | `@doneisbetter/gds-theme/server` + `extendGdsTheme` | Canonical | Dark product shell; `theme.other.brand` / `email` |
| Learner shell / page header | `app/components/LearnerPageHeader.tsx` | — | Local adapter | Until GDS LearnerAppShell (#80) |
| Article shell | `app/components/patterns/gds/ArticleShell.tsx` | `@doneisbetter/gds-core` (brand-composition adapter) | Canonical | Re-export at `patterns/ArticleShell.tsx` |
| Product course card | `app/components/patterns/CourseCard.tsx` | `ProductCard` (future) | Local adapter | Course-specific slots |
| Metric card | `app/components/patterns/gds/MetricCard.tsx` | `@doneisbetter/gds-core/client` `MetricCard` | Thin adapter | Amanoba `label`/`value`/`detail` aliases |
| Progress card | `app/components/patterns/gds/ProgressCard.tsx` | `@doneisbetter/gds-core/client` `ProgressCard` | Thin adapter | Quest/course progress |
| State block | `app/components/patterns/gds/StateBlock.tsx` | `@doneisbetter/gds-core/client` `StateBlock` | Thin adapter | `kind` → `variant` |
| Course access recovery | `app/components/patterns/gds/CourseAccessRecoveryActions.tsx` | `@doneisbetter/gds-core/client` `AccessRecoveryPanel` | Thin adapter | Maps course API codes to panel state |
| Admin shell | `app/[locale]/admin/layout.tsx` | `@doneisbetter/gds-admin/AppShell` (optional) | Canonical | Mantine AppShell |
| Auth shell | `app/components/patterns/gds/AuthShell.tsx` | `@doneisbetter/gds-core/AuthShell` (Amanoba variant) | Canonical | Dark `ink.9` layout |
| Public shell | `app/components/patterns/gds/PublicAppShell.tsx` | `@doneisbetter/gds-core/PublicShell` (Amanoba variant) | Canonical | Marketing header band |
| Data toolbar | `app/components/patterns/gds/DataToolbar.tsx` | `@doneisbetter/gds-core/DataToolbar` (aligned local) | Canonical | `layout: inline \| stack` |
| Responsive data view | `app/components/patterns/gds/ResponsiveDataView.tsx` | `@doneisbetter/gds-admin/ResponsiveDataView` (adapter) | Canonical | `rows` + `md` table breakpoint |
| Editor shell | `app/[locale]/editor/layout.tsx` | `@doneisbetter/gds-admin/EditorScaffold` (future) | Canonical | |
| Game shell | `app/[locale]/games/**` | — | Canonical + exception | Canvas exception |
| Game board card | `app/components/patterns/gds/GameBoardCard.tsx` | `@doneisbetter/gds-core/client` `GameBoardTile` | Thin adapter | `highlightColor="amanoba.5"` |

## Canonical Component Rules

- Import shared patterns from `@/app/components/patterns/*` or `@/app/components/patterns/gds`.
- Do not duplicate pattern implementations outside `patterns/gds/` except documented adapters in `gds-adoption.json` (`CourseCard`, `LearnerPageHeader`, brand-composition shells).
- Loading, empty, error, permission, success on learner routes must use `StateBlock`.

## Current Highest-Risk Gaps

- GDS **LearnerAppShell** and **course card variant** contracts (coordination: general-design-system #80).
- npm registry publication is still pending. Amanoba now uses the approved 2.6.1 GitHub release tarballs instead of sibling `file:` links.

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
