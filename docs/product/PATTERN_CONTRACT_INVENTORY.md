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
| Auth shell | `app/components/patterns/AuthShell.tsx`, `app/[locale]/auth/signin/page.tsx`, `app/[locale]/auth/error/page.tsx` | Canonical | Shared centered auth layout; sign-in and auth error routes compose `AuthShell` with Mantine cards and `StateBlock`. |
| Public shell | `app/components/patterns/PublicAppShell.tsx`, `app/[locale]/page.tsx`, `app/[locale]/partners/page.tsx` | Canonical | Shared marketing header/footer band; landing and partners compose the shell. |
| Data toolbar | `app/components/patterns/DataToolbar.tsx` | Canonical | Admin course, player, achievement, question, vote, payment, quest, challenge, and game list filters. |
| Responsive data view | `app/components/patterns/ResponsiveDataView.tsx` | Pilot | Table on `md+`, card rows on small screens; used on votes, players, games, and payments. |
| Editor shell | `app/[locale]/editor/layout.tsx` | Canonical | Mantine `AppShell` for the editor portal (courses navigation). |
| Game shell | `app/[locale]/games/**`, `app/components/games/**` | Canonical | Memory and sudoku pages use Mantine shells; game-board internals may remain custom when framed by Mantine cards and state contracts. |

## Canonical Component Rules

- Repeated course cards must use `CourseCard`.
- Repeated learner/dashboard metrics must use `MetricCard`.
- Loading, empty, error, permission, disabled, and success states must use `StateBlock` unless a local exception is documented here.
- Blog/news detail pages must use `ArticleShell`.
- Learner-facing top navigation must use `LearnerPageHeader` until a fuller learner `AppShell` contract replaces it.
- New page-local shells, cards, metric blocks, and state blocks are not allowed when a canonical contract exists.

## Current Highest-Risk Gaps

1. Extend `ResponsiveDataView` to remaining admin tables (rewards, email analytics).
2. Game-board flip animations may keep local layout styles inside Mantine-framed surfaces.

## Implementation Sequence

1. Complete learner-facing reuse first: course catalog, dashboard, My Courses, blog/news detail, and route states.
2. Extend `ResponsiveDataView` to remaining admin list pages.
3. Tighten `npm run ui:check:mantine` after each group so old variants cannot return.

## Verification Commands

- `npm run ui:check:mantine`
- `npm run ui:check:foundation`
- `npm run ui:check:layout`
- `npm run lint`
- `npm run type-check`
- `npm run build`
