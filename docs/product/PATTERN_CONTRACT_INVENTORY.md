# Amanoba Pattern Contract Inventory

**Last Updated**: 2026-05-25
**Status**: GDS 2.5.1 enforced (`gds-adoption.json`)
**Shared SSOT**: `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`
**Aligned GDS Version**: `2.5.1`

This document is Amanoba's local adapter inventory for the GDS pattern service model. It records implementation paths and migration state only.

## Contract Summary

| GDS Contract | Amanoba implementation | GDS package | Status | Notes |
| --- | --- | --- | --- | --- |
| Theme | `app/lib/ui/amanoba-gds-theme.ts` | local `@gds/theme` shim + `extendGdsTheme` | Canonical | Dark product shell; `theme.other.brand` / `email` |
| Learner shell / page header | `app/components/LearnerPageHeader.tsx` | — | Local adapter | Until GDS LearnerAppShell (#80) |
| Article shell | `app/components/patterns/gds/ArticleShell.tsx` | `@gds/core` (aligned local) | Canonical | Re-export at `patterns/ArticleShell.tsx` |
| Product course card | `app/components/patterns/CourseCard.tsx` | `ProductCard` (future) | Local adapter | Course-specific slots |
| Metric card | `app/components/patterns/gds/MetricCard.tsx` | local `@gds/core` `MetricCard` shim | Thin adapter | Amanoba `label`/`value`/`detail` aliases |
| Progress card | `app/components/patterns/gds/ProgressCard.tsx` | local `@gds/core` `ProgressCard` shim | Thin adapter | Quest/course progress |
| State block | `app/components/patterns/gds/StateBlock.tsx` | local `@gds/core` `StateBlock` shim | Thin adapter | `kind` → `variant` |
| Course access recovery | `app/components/patterns/gds/CourseAccessRecoveryActions.tsx` | local `@gds/core` `AccessRecoveryPanel` shim | Thin adapter | Maps course API codes to panel state |
| Admin shell | `app/[locale]/admin/layout.tsx` | `@gds/admin/AppShell` (optional) | Canonical | Mantine AppShell |
| Auth shell | `app/components/patterns/gds/AuthShell.tsx` | `@gds/core/AuthShell` (Amanoba variant) | Canonical | Dark `ink.9` layout |
| Public shell | `app/components/patterns/gds/PublicAppShell.tsx` | `@gds/core/PublicShell` (Amanoba variant) | Canonical | Marketing header band |
| Data toolbar | `app/components/patterns/gds/DataToolbar.tsx` | `@gds/core/DataToolbar` (aligned local) | Canonical | `layout: inline \| stack` |
| Responsive data view | `app/components/patterns/gds/ResponsiveDataView.tsx` | `@gds/admin/ResponsiveDataView` (adapter) | Canonical | `rows` + `md` table breakpoint |
| Editor shell | `app/[locale]/editor/layout.tsx` | `@gds/admin/EditorScaffold` (future) | Canonical | |
| Game shell | `app/[locale]/games/**` | — | Canonical + exception | Canvas exception |
| Game board card | `app/components/patterns/gds/GameBoardCard.tsx` | local `@gds/core` `GameBoardTile` shim | Thin adapter | `highlightColor="amanoba.5"` |

## Canonical Component Rules

- Import shared patterns from `@/app/components/patterns/*` or `@/app/components/patterns/gds`.
- Do not duplicate pattern implementations outside `patterns/gds/` except documented adapters in `gds-adoption.json` (`CourseCard`, `LearnerPageHeader`, brand-composition shells).
- Loading, empty, error, permission, success on learner routes must use `StateBlock`.

## Current Highest-Risk Gaps

- GDS **LearnerAppShell** and **course card variant** contracts (coordination: general-design-system #80).
- Published npm path for the shared packages. The deployed app no longer imports the sibling checkout directly, but local governance/version tooling still does.

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
