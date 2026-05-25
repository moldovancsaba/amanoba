## Objective

Deliver a **rock-solid GDS 2.3.0 adoption** in Amanoba: consumable `@gds/*` packages, Amanoba brand via `extendGdsTheme`, migrated shared patterns, exhaustive `StateBlock` coverage, admin data contracts on `@gds/admin`, and Phase 6 deletion of competing CSS/Tailwind authority—without regressing learner, admin, or course UX work already on `main`.

## Unified Context

- **GDS SSOT:** `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` — release line **`2.3.0`** (2026-05-24).
- **GDS packages:** `@gds/theme`, `@gds/core`, `@gds/admin` with `client` / `server` subpaths (`COMPATIBILITY_AND_RELEASES.md`).
- **Amanoba today:** Mantine-only runtime active; **local** pattern adapters in `app/components/patterns/*` duplicate GDS packages with **API differences**; `docs/product/DESIGN_UPDATE.md` still references **2.2.0**; **no `@gds/*` in `package.json`**.
- **Portfolio:** GDS board issue `#62` (Amanoba rollout) is closed for contract inventory; **this program** is implementation + package adoption.
- **Related program:** Course UX epic **#822** (conversion/lesson flows) is orthogonal; GDS adoption must not block #823–#827 but must share Mantine guardrails.

## Problem

Amanoba implemented GDS **behavior** locally before GDS **shipped packages**. That creates drift risk: two `MetricCard` APIs, two `StateBlock` models, two `ResponsiveDataView` implementations, and docs that under-report readiness. Any developer joining cold cannot tell whether to import from `@gds/core` or `@/app/components/patterns/*`.

## Goal

One governed stack:

\[
\text{UI authority} = \text{GDS SSOT} \rightarrow \text{@gds/theme (extended)} \rightarrow \text{@gds/core | @gds/admin} \rightarrow \text{thin Amanoba adapters only where domain-specific}
\]

## Delivery Strategy (child issues)

| Seq | Child | Outcome |
| --- | --- | --- |
| 1/9 | Adapter docs 2.3.0 | Read order + inventory + HANDOVER |
| 2/9 | Package install | Pinned deps, peer alignment, CI proof |
| 3/9 | Theme | `extendGdsTheme` replaces parallel token authority |
| 4/9 | Shells | Auth / Public / Article → `@gds/core` |
| 5/9 | Metrics + states | MetricCard, ProgressCard, StateBlock alignment |
| 6/9 | Admin data | DataToolbar + ResponsiveDataView |
| 7/9 | State rollout | Quests, rewards, profile, settings, course surfaces |
| 8/9 | Retire locals | Delete duplicates; update `ui:check:mantine` |
| 9/9 | Phase 6 delete | Tailwind/residual CSS authority removal |

**Coordination (separate track):** Request/promote in GDS repo: `LearnerAppShell`, course card variants, gamification contracts (`GDS_GAP_INVENTORY.md` §2A.12).

## Mantine-Only Constraint

- No new Radix / `sonner` / `vaul` / Tailwind-as-design-authority.
- Exceptions only per `EXCEPTION_SURFACES.md` + Amanoba `DESIGN_UPDATE.md` registry.

## Required reading (every child)

1. `AGENTS.md` (repo root)
2. `READMEDEV.md` → `docs/HANDOVER.md`
3. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/COMPATIBILITY_AND_RELEASES.md`
4. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/THEME_GOVERNANCE.md`
5. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/EXCEPTION_SURFACES.md`
6. `docs/product/DESIGN_UPDATE.md`
7. `docs/product/PATTERN_CONTRACT_INVENTORY.md`
8. `docs/architecture/layout_grammar.md` (UI layout §)

## Verification (every code child)

- `npm run type-check`
- `npm run lint`
- `npm run ui:check:mantine`
- `npm run ui:check:foundation`
- `npm run ui:check:layout`
- `npm run build`
- `npm run docs:check` when docs change

## Acceptance Checks

- [ ] Child issues 1/9–9/9 exist, linked below, on Project 12 `Backlog (SOONER)` or `Todo (NEXT)` in order.
- [ ] `DESIGN_UPDATE.md` records consumed GDS version **2.3.0** and package install path.
- [ ] `PATTERN_CONTRACT_INVENTORY.md` maps each contract to `@gds/*` path or documented Amanoba-only adapter.
- [ ] No ambiguous duplicate exports for the same contract name without deprecation note.
- [ ] Epic does not absorb unbounded Course UX scope from #822.

## Child Issues

Created in dependency order (titles on board):

1. `Amanoba GDS 2.3.0 1/9: adapter docs and contract inventory alignment`
2. `Amanoba GDS 2.3.0 2/9: install @gds packages and CI compatibility baseline`
3. `Amanoba GDS 2.3.0 3/9: migrate theme to extendGdsTheme (Amanoba brand)`
4. `Amanoba GDS 2.3.0 4/9: migrate Auth Public Article shells to @gds/core`
5. `Amanoba GDS 2.3.0 5/9: align MetricCard ProgressCard and StateBlock`
6. `Amanoba GDS 2.3.0 6/9: migrate admin DataToolbar and ResponsiveDataView`
7. `Amanoba GDS 2.3.0 7/9: StateBlock rollout on remaining learner routes`
8. `Amanoba GDS 2.3.0 8/9: retire duplicate local pattern modules and guardrails`
9. `Amanoba GDS 2.3.0 9/9: Phase 6 Tailwind and legacy CSS authority deletion`

(Update this list with issue numbers after creation.)

## Risks

- **Install path:** GDS packages may require npm publish vs documented `file:` dev link—child 2/9 must lock production path.
- **API drift:** Forcing `@gds/admin/ResponsiveDataView` without adapter breaks admin tables—child 6/9 must ship compatibility layer if needed.
- **Scope collision:** Course UX (#822) refactors same files—sequence child work after #823–#827 or coordinate merges.

## Delivery Artifact

Program plan doc: `docs/handoff/feature_issues/GDS_2_3_ADOPTION_PROGRAM.md` plus linked GitHub issues on Project 12.
