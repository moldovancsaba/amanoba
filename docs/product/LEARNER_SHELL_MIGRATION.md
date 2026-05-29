# Learner Shell Migration

**Last Updated**: 2026-05-28
**Status**: Adapter active; direct shared-shell swap blocked upstream.
**Blocking issue**: [general-design-system#80](https://github.com/sovereignsquad/general-design-system/issues/80)

## Current Contract

- Amanoba keeps the public learner-shell contract at `app/components/LearnerPageHeader.tsx`.
- Runtime implementation now lives in `app/components/patterns/gds/LearnerShellAdapter.tsx`.
- The adapter keeps the existing learner page header props stable:
  - `title`
  - `subtitle`
  - `icon`
  - `onRefresh`
  - `actions`

## Why The Adapter Exists

- Amanoba already has a stable learner-facing header contract used across dashboard, courses, my-courses, Practice Hub, blog/news, saved lessons, leaderboards, and stats.
- Shared GDS still does not expose the final learner app-shell contract needed to replace this surface directly.
- The adapter creates a single swap point so Amanoba can move to the shared learner shell without forcing route-level churn.

## Swap Plan Once GDS #80 Lands

1. Replace the local adapter body with the shared learner shell import.
2. Preserve the `LearnerPageHeader` re-export so route imports do not change.
3. Re-run `npm run ui:gds:check`, `npm run type-check`, and keyboard/focus verification for learner routes.
4. Update `gds-adoption.json`, `docs/core/PROJECT_STATE.md`, and `docs/product/GDS_ACCESSIBILITY_VERIFICATION.md`.

## Acceptance Rule

Until GDS #80 is resolved, Amanoba treats `LearnerShellAdapter` as the authoritative learner-shell boundary.
