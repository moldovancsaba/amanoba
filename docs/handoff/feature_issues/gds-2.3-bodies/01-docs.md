## Objective

Align Amanoba adapter documentation to **GDS 2.3.0** so any developer knows the consumed release line, package paths, local-vs-shared contract map, and exception registry—before code imports `@gds/*`.

## Unified Context

- GDS added: `COMPATIBILITY_AND_RELEASES.md`, `THEME_GOVERNANCE.md`, `EXCEPTION_SURFACES.md`, `GDS_GAP_INVENTORY.md`, publishable `@gds/*` packages.
- Amanoba `docs/product/DESIGN_UPDATE.md` still says **2.2.0** and lists patterns as local-only; "Still pending" section is **stale** (AuthShell, DataToolbar, etc. are implemented).
- `docs/product/PATTERN_CONTRACT_INVENTORY.md` is accurate for local paths but lacks `@gds/*` column.

## Problem

Documentation drift causes wrong imports, repeated local invention, and failed audits. Developers cannot pass `npm run docs:check` after refresh if generated docs disagree.

## Goal

Adapter docs become the **onboarding SSOT** for GDS adoption with zero TBD placeholders.

## Scope

### In scope

- Update `docs/product/DESIGN_UPDATE.md`:
  - Aligned version **2.3.0**, date **2026-05-24**
  - Read order adds items 8–10: `COMPATIBILITY_AND_RELEASES.md`, `THEME_GOVERNANCE.md`, `EXCEPTION_SURFACES.md`
  - Replace "Still pending" with **Package adoption backlog** (issues 2/9–9/9)
  - Record planned `@gds/theme`, `@gds/core`, `@gds/admin` consumption (version pin TBD in child 2/9)
- Update `docs/product/PATTERN_CONTRACT_INVENTORY.md`:
  - Add column **GDS package / maturity** (`@gds/core`, `@gds/admin`, `local-until-promoted`)
  - Map: MetricCard, StateBlock, DataToolbar, shells, ResponsiveDataView, GameBoardCard (local), LearnerPageHeader (local), CourseCard (local)
- Append `docs/HANDOVER.md` section **GDS 2.3.0 adoption program** with epic link.
- Update `docs/handoff/feature_issues/GDS_2_3_ADOPTION_PROGRAM.md` with epic issue number.
- If `docs/core/TECH_STACK.md` or `CONTRIBUTING.md` reference GDS paths, bump version pointers.

### Out of scope

- Installing npm packages (child 2/9)
- Deleting local pattern files (child 8/9)
- Course UX content (#822 children)

## Technical Notes

### Contract mapping table (must appear in PATTERN_CONTRACT_INVENTORY)

| Contract | Local path today | Target GDS surface | Maturity |
| --- | --- | --- | --- |
| Theme | `app/lib/ui/mantine-theme.ts` | `@gds/theme` + `extendGdsTheme` | child 3/9 |
| Auth shell | `patterns/AuthShell.tsx` | `@gds/core/AuthShell` | child 4/9 |
| Public shell | `patterns/PublicAppShell.tsx` | `@gds/core/PublicShell` | child 4/9 |
| Article shell | `patterns/ArticleShell.tsx` | `@gds/core/ArticleShell` | child 4/9 |
| Metric card | `patterns/MetricCard.tsx` | `@gds/core/MetricCard` | child 5/9 |
| State block | `patterns/StateBlock.tsx` | `@gds/core/StateBlock` | child 5/9 |
| Data toolbar | `patterns/DataToolbar.tsx` | `@gds/core/DataToolbar` | child 6/9 |
| Responsive data view | `patterns/ResponsiveDataView.tsx` | `@gds/admin/ResponsiveDataView` + adapter | child 6/9 |
| Learner nav | `LearnerPageHeader.tsx` | **local** until GDS LearnerAppShell | coordination |
| Course card | `patterns/CourseCard.tsx` | **local** until GDS course variants | coordination |
| Game board card | `patterns/GameBoardCard.tsx` | **local** (EXCEPTION_SURFACES game chrome) | documented |

### Pseudocode: doc freshness invariant

```
∀ contract C in PATTERN_CONTRACT_INVENTORY:
  assert C.status ∈ {Canonical, Local-adapter, Exception}
  assert C.gds_package_path is non-empty OR C.exception_doc_ref is non-empty
assert DESIGN_UPDATE.aligned_version == read_file(GDS/VERSION)
```

## UX Instructions

No UI changes. Operators/readers should open `DESIGN_UPDATE.md` and understand **what to import** within 2 minutes.

## Execution Prompt

Edit docs only. Run `npm run docs:refresh` then `npm run docs:check`. Commit docs with epic reference.

## Acceptance Checks

- [ ] `DESIGN_UPDATE.md` aligned to GDS **2.3.0** with no stale "Still pending" for completed work
- [ ] `PATTERN_CONTRACT_INVENTORY.md` includes GDS package column and local-only exceptions
- [ ] `HANDOVER.md` appended with adoption program entry
- [ ] `npm run docs:check` passes
- [ ] No TBD placeholders in touched files

## Verification

- `npm run docs:refresh`
- `npm run docs:check`
- `npm run docs:links:check`

## Dependencies

- Blocks: all code children 2/9–9/9 (they need the mapping table)
- Depends on: none

## Risks

- Regenerated docs may change—commit regenerated output with doc edits.

## Delivery Artifact

Updated adapter docs + HANDOVER entry + program markdown with epic number.
