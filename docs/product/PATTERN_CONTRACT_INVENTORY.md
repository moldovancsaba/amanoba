# Amanoba Pattern Contract Inventory

**Last Updated**: 2026-05-26
**Status**: GDS 3.14.17 enforced (`gds-adoption.json`)
**Shared SSOT**: [sovereignsquad/general-design-system](https://github.com/sovereignsquad/general-design-system)
**Aligned GDS Version**: `3.14.17`

This document is Amanoba's local adapter inventory for the GDS pattern service model. It records implementation paths and migration state only.

## Contract Summary

| GDS Contract | Amanoba implementation | GDS package | Status | Notes |
| --- | --- | --- | --- | --- |
| Theme | `app/lib/ui/amanoba-gds-theme.ts` | `@sovereignsquad/gds-theme/server` + `extendGdsTheme` | Canonical | Dark product shell; `theme.other.brand` / `email` |
| Learner shell / page header | `app/components/patterns/gds/LearnerShellAdapter.tsx` | — | Local adapter | Stable import: `app/components/LearnerPageHeader.tsx`; client-only (session hooks); dashboard/courses/my-courses/saved/practice/stats/leaderboards/blog/news; GDS #80 blocks upstream |
| Auth shell | `app/components/patterns/gds/AuthShell.tsx` | `@sovereignsquad/gds-core` (brand-composition adapter) | Canonical | Re-export at `patterns/AuthShell.tsx`; server-safe; signin/error/onboarding routes |
| Public shell | `app/components/patterns/gds/PublicAppShell.tsx` | `@sovereignsquad/gds-core` (brand-composition adapter) | Canonical | Re-export at `patterns/PublicAppShell.tsx`; server-safe; landing/partners routes |
| Article shell | `app/components/patterns/gds/ArticleShell.tsx` | `@sovereignsquad/gds-core` (brand-composition adapter) | Canonical | Re-export at `patterns/ArticleShell.tsx`; server-safe; blog/news routes |
| Product course card | `app/components/patterns/gds/CourseCard.tsx` | `@sovereignsquad/gds-core/client` `PublicProductCard` | GDS-backed adapter | Stable: `app/components/patterns/CourseCard.tsx`; catalog/my-courses/dashboard; 3 usage patterns (catalog/enrolled/progress); client-only |
| Metric card | `app/components/patterns/gds/MetricCard.tsx` | `@sovereignsquad/gds-core/client` `MetricCard` | GDS-backed adapter | Stable: `app/components/patterns/MetricCard.tsx`; dashboard/stats/profile; value-first metrics; client-only |
| Progress card | `app/components/patterns/gds/ProgressCard.tsx` | `@sovereignsquad/gds-core/client` `ProgressCard` | GDS-backed adapter | Stable: `app/components/patterns/ProgressCard.tsx`; dashboard/my-courses/profile; progress bar + action; client-only |
| State block | `app/components/patterns/gds/StateBlock.tsx` | `@sovereignsquad/gds-core/client` `StateBlock` | GDS-backed adapter | Stable: `app/components/patterns/StateBlock.tsx`; 7 variants (loading/empty/error/info/success/warning/permission); all learner routes; client-only |
| Course access recovery | `app/components/patterns/gds/CourseAccessRecoveryActions.tsx` | `@sovereignsquad/gds-core/client` `AccessRecoveryPanel` | GDS-backed adapter | Stable: `app/components/patterns/CourseAccessRecoveryActions.tsx`; lesson/quiz access routes; 7 recovery states (signin/course/retry/continue/forbidden/missing/unavailable); client-only |
| Admin shell | `app/[locale]/admin/layout.tsx` | `@sovereignsquad/gds-admin/client` `AppShell` | GDS-backed | GDS admin shell + Amanoba nav; all admin routes; client-only |
| Admin page header | `app/components/patterns/gds/AdminPageHeader.tsx` | `@sovereignsquad/gds-admin/client` `PageHeader` | GDS-backed thin re-export | All admin pages with titles/actions; title+description+primaryAction+overflowActions; client-only |
| Data toolbar | `app/components/patterns/gds/DataToolbar.tsx` | Mantine-only | Mantine composition | All admin list pages; inline/stack layout; title+description+filter controls; server-safe |
| Responsive data view | `app/components/patterns/gds/ResponsiveDataView.tsx` | `@sovereignsquad/gds-admin/client` `ResponsiveDataView` | GDS-backed adapter | All admin lists (players/payments/certificates/courses/etc.); desktop table + mobile cards; client-only |
| Rich lesson prose | Mantine `TypographyStylesProvider` | Mantine primitive | Local exception | Lesson routes (enrolled/view); wraps `dangerouslySetInnerHTML` with sanitized HTML; dark-mode safe typography; documented exception for rich content |
| Article/blog body | Mantine Stack/Text/Title | Mantine primitives | Mantine composition | Blog/news detail pages; structured paragraph rendering; no HTML injection; server-safe |
| Quiz chrome (lesson) | Mantine Card/Stack/Progress/Button | Mantine primitives | Mantine composition | Lesson quiz pages; progress HUD, question cards, result modals; answer selection is local component; client-only |
| Game chrome (memory, etc.) | Mantine Card/MetricCard/Modal/Button | Mantine + GDS primitives | Mantine/GDS composition | Game pages; HUD (time/moves/score), result modals, difficulty controls; game board/engine is documented exception; client-only |
| Game board card | `app/components/patterns/GameBoardCard.tsx` | Mantine Card | Local component | Memory game cards; click/flip interactions; part of game engine exception boundary |
| Amanoba GDS theme | `app/lib/ui/amanoba-gds-theme.ts` | `@sovereignsquad/gds-theme/server` | Brand extension | Runtime theme authority; extends GDS base theme with Amanoba palettes/brand; server-safe |
| Server token bridge | `app/lib/constants/color-tokens.ts` | Raw literals | Token governance | Non-CSS contexts (email, OG, charts, games); BRAND_COLORS, EMAIL_THEME, CHART_THEME, GAME_AI_PERSONAS, AMANOBA_MANTINE_PALETTES; server-safe |
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
- npm registry publication is now live. Amanoba uses `@sovereignsquad/*@3.14.17` from npm instead of sibling `file:` links or GitHub release tarballs.

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
