# Amanoba Project State

**Purpose**: One-page operational SSOT for the current repo state.
**Scope**: Use this page first when resuming work, validating docs, or checking whether repo and GDS contracts are aligned.

## Manual Truths

- Canonical repo: `amanoba` product repo only; do not rely on sibling or duplicate local clones as truth.
- Work tracking SSOT: Project 12 + `moldovancsaba/mvp-factory-control`.
- GDS consumer contract: use published `@doneisbetter/*` packages, governed by `gds-adoption.json`.
- Documentation SSOT: `PROJECT_STATE.md` for current state, `docs/HANDOVER.md` for chronology, `docs/product/RELEASE_NOTES.md` for delivered work only.
- Production deploy path: push to `origin/main`; GitHub triggers the Vercel production deploy.

## Cold Start Restore

1. Read this file.
2. Read `READMEDEV.md`.
3. Read `docs/HANDOVER.md`.
4. Read `docs/core/agent_working_loop_canonical_operating_document.md`.
5. Read `docs/status/PRODUCTION_STATUS.md`.
6. Open `docs/product/TASKLIST.md` and the top of `docs/product/RELEASE_NOTES.md`.

## Required Gates

- `npm run docs:project-state:refresh`
- `npm run docs:truth:check`
- `npm run docs:check`
- `npm run type-check`
- `npm run lint`
- `npm run ui:gds:check`
- `npm run build`

## Generated Snapshot

<!-- gds-project-state:generated:start -->
- Generated at: `2026-05-29T08:56:01.985Z`
- Package version: `2.9.49`
- Git branch: `main`
- Git HEAD: `1a3643a` (`1a3643ad3c05dbd09a8f1481ca6e20f9d4d58024`)
- Git worktree state: `dirty`
- GDS version: `2.6.1`
- GDS migration status: `enforced`
- Product archetype: `lms-game`
- Supported GDS entry points:
- `@doneisbetter/gds-theme/client`
- `@doneisbetter/gds-theme/server`
- `@doneisbetter/gds-core/client`
- `@doneisbetter/gds-core/server`
- `@doneisbetter/gds-admin/client`
- `@doneisbetter/gds-admin/server`
- Required GDS contracts:
- `extendGdsTheme`
- `StateBlock`
- `MetricCard`
- `ProgressCard`
- `AccessRecoveryPanel`
- `GameBoardTile`
- `AuthShell`
- `PublicShell`
- `DataToolbar`
- `ResponsiveDataView`
- Active local adapters: 6
- `CourseCard` -> `app/components/patterns/gds/CourseCard.tsx`
- `ResponsiveDataView` -> `app/components/patterns/gds/ResponsiveDataView.tsx`
- `AdminPageHeader` -> `app/components/patterns/gds/AdminPageHeader.tsx`
- `EditorAppShell` -> `app/[locale]/editor/layout.tsx`
- `CourseAccessRecovery` -> `app/components/patterns/gds/CourseAccessRecoveryActions.tsx`
- `AdminAppShell` -> `app/[locale]/admin/layout.tsx`
- Docs command set:
- `docs:inventory`
- `docs:canonical-map`
- `docs:triage`
- `docs:refresh`
- `docs:links:check`
- `docs:project-state:refresh`
- `docs:truth:check`
- `docs:check`
<!-- gds-project-state:generated:end -->
