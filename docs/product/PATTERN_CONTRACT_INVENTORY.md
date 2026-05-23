# Amanoba Pattern Contract Inventory

**Last Updated**: 2026-05-23
**Status**: Active local adapter
**Shared SSOT**: `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`
**Aligned GDS Version**: `2.2.0`

This document is Amanoba's local adapter inventory for the GDS pattern service model. It records implementation paths and migration state only. The design, UX, component behavior, responsive rules, color-mode rules, and Mantine-only policy remain owned by the shared GDS.

## Contract Summary

| GDS Contract | Amanoba Implementation | Status | Notes |
|---|---|---|---|
| Learner shell / page header | `app/components/LearnerPageHeader.tsx` | Canonical | Used by dashboard, course catalog, My Courses, Practice Hub, Saved Lessons, blog, and news index pages. |
| Article shell | `app/components/patterns/ArticleShell.tsx` | Canonical | Used by blog/news detail pages. Index pages still use the learner header because they are learner-facing product surfaces. |
| Product course card | `app/components/patterns/CourseCard.tsx` | Canonical | Used by course catalog, My Courses, dashboard recommendations, and active-course progress cards. |
| Metric / progress card | `app/components/patterns/MetricCard.tsx` | Canonical | Used by the learner dashboard metric grid. Admin analytics/payment metrics should migrate to this contract where the data shape matches. |
| State block | `app/components/patterns/StateBlock.tsx` | Canonical | Used by course catalog, My Courses, and dashboard loading/error/empty/permission states. Remaining route-level states should migrate to this contract. |
| Course access recovery | `app/components/patterns/CourseAccessRecoveryActions.tsx` + `app/lib/course-access-recovery.ts` | Canonical | Used by protected lesson day and lesson quiz routes for 401/404 recovery (sign-in, back to course, retry). |
| Admin shell | `app/[locale]/admin/layout.tsx` | Canonical | Mantine `AppShell` with `NavLink`, `ScrollArea`, `Menu`, and Tabler icons. |
| Auth shell | `app/[locale]/auth/signin/page.tsx`, `app/[locale]/auth/error/page.tsx` | Partial | Sign-in is Mantine-only and auth error uses `StateBlock`; reusable `AuthShell` extraction remains backlog. |
| Public shell | `app/[locale]/page.tsx`, `app/[locale]/partners/page.tsx` | Partial | Public pages are Mantine-based but do not yet share one explicit `PublicAppShell` contract. |
| Data toolbar / responsive data view | Admin list pages | Backlog | Several admin pages use Mantine forms/tables now, but the shared toolbar/table contract is not yet extracted. |
| Game shell | `app/[locale]/games/**`, `app/components/games/**` | Backlog / exception review | Game engine internals may remain custom, but navigation, cards, loading/error states, and chrome must use Mantine contracts. |

## Canonical Component Rules

- Repeated course cards must use `CourseCard`.
- Repeated learner/dashboard metrics must use `MetricCard`.
- Loading, empty, error, permission, disabled, and success states must use `StateBlock` unless a local exception is documented here.
- Blog/news detail pages must use `ArticleShell`.
- Learner-facing top navigation must use `LearnerPageHeader` until a fuller learner `AppShell` contract replaces it.
- New page-local shells, cards, metric blocks, and state blocks are not allowed when a canonical contract exists.

## Current Highest-Risk Gaps

1. `app/[locale]/leaderboards/page.tsx`, `app/[locale]/stats/page.tsx`, and `app/[locale]/onboarding/page.tsx` still contain legacy page-local markup.
2. `app/[locale]/admin/votes/page.tsx` still uses raw table/form markup and lucide icons.
3. Memory-game internals still contain local CSS/layout classes. Game-board internals may remain custom only if framed by Mantine shell/state/card contracts.
4. `AuthShell`, `PublicAppShell`, `DataToolbar`, and `ResponsiveDataView` are not extracted yet.

## Implementation Sequence

1. Complete learner-facing reuse first: course catalog, dashboard, My Courses, blog/news detail, and route states.
2. Extract `AuthShell` from the sign-in page and migrate auth error to the same state contract.
3. Extract `DataToolbar` and `ResponsiveDataView` for admin list pages.
4. Migrate leaderboards, stats, onboarding, and game chrome to the state/card/shell contracts.
5. Tighten `npm run ui:check:mantine` after each group so old variants cannot return.

## Verification Commands

- `npm run ui:check:mantine`
- `npm run ui:check:foundation`
- `npm run ui:check:layout`
- `npm run lint`
- `npm run type-check`
- `npm run build`
