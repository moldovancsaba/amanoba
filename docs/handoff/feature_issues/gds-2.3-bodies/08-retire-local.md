## Objective

**Retire duplicate local pattern modules** that are fully replaced by `@gds/*` adapters, update **`scripts/check-mantine-boundaries.mjs`**, and ensure imports across the repo point to a single canonical path per contract.

## Unified Context

After children 4/9–7/9, these files may be redundant:

- `app/components/patterns/AuthShell.tsx` → `patterns/gds/` or direct `@gds/core`
- `app/components/patterns/PublicAppShell.tsx`
- `app/components/patterns/ArticleShell.tsx`
- `app/components/patterns/MetricCard.tsx`
- `app/components/patterns/StateBlock.tsx`
- `app/components/patterns/DataToolbar.tsx`
- `app/components/patterns/ResponsiveDataView.tsx`

**Keep local (document in inventory):**

- `LearnerPageHeader.tsx`
- `CourseCard.tsx`
- `GameBoardCard.tsx`
- `CourseAccessRecoveryActions.tsx`

## Problem

Duplicate files invite accidental edits to the wrong SSOT.

## Goal

Deprecation path:

```
import { MetricCard } from '@/app/components/patterns/MetricCard'
→ import { MetricCard } from '@/app/components/patterns/gds'
```

Delete old file when grep shows zero imports.

## Scope

### In scope

- Create barrel `app/components/patterns/gds/index.ts` exporting all GDS-backed contracts
- Codemod or manual replace imports
- Update `check-mantine-boundaries.mjs` paths to gds barrel files
- Add ESLint restriction optional: ban imports from deleted paths (if eslint rule exists—else document)
- Update `PATTERN_CONTRACT_INVENTORY.md` implementation paths

### Out of scope

- Phase 6 tailwind deletion (child 9/9)
- CourseCard / LearnerPageHeader

## Technical Notes

### Verification script

```bash
for f in AuthShell PublicAppShell ArticleShell MetricCard StateBlock DataToolbar ResponsiveDataView; do
  rg "patterns/$f" app --glob '*.tsx' && echo "FAIL $f" && exit 1
done
```

### Pseudocode: barrel

```ts
// app/components/patterns/gds/index.ts
export * from './metric-adapters';
export { AuthShell } from '@gds/core/client';
// ...
```

## Acceptance Checks

- [ ] Zero imports of deleted modules
- [ ] Barrel is documented SSOT in DESIGN_UPDATE.md
- [ ] Mantine boundary allowlist matches new paths
- [ ] All quality gates pass

## Verification

- `rg` import audit + full npm gates

## Dependencies

- Depends on: 4/9, 5/9, 6/9, 7/9
- Blocks: 9/9 (cleaner deletion surface)

## Delivery Artifact

Deleted/deprecated files + barrel + inventory + HANDOVER.
