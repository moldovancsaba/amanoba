## Objective

Install and pin **`@gds/theme`**, **`@gds/core`**, and **`@gds/admin`** at GDS release **2.3.0**, align Mantine/React peers per `COMPATIBILITY_AND_RELEASES.md`, and prove CI builds without `file:` hacks unless documented for local dev only.

## Unified Context

- GDS `COMPATIBILITY_AND_RELEASES.md`: Mantine `^7.9.0`, React `^18.2.0 | ^19.0.0`, subpaths `./client` and `./server`.
- Amanoba: `@mantine/*` already installed; **no `@gds/*`** today.
- Install options: (A) npm registry publish, (B) `file:../../../Shared/Projects/GENERAL_DESIGN_SYSTEM/packages/gds-*` for local dev with **documented** CI path.

## Problem

Without pinned packages, children 3/9–8/9 cannot import shared contracts; duplicate local modules remain the de facto SSOT.

## Goal

\[
\text{package.json} \vdash \text{@gds/theme@2.3.0} \land \text{@gds/core@2.3.0} \land \text{@gds/admin@2.3.0}
\]

and `npm run build` succeeds.

## Scope

### In scope

- Add dependencies + peer dependency alignment check (no duplicate Mantine majors).
- Document install path in `DESIGN_UPDATE.md` (production vs local dev).
- Add script or CI step note: verify GDS version matches `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/VERSION` when using `file:` links.
- Optional: `npm run gds:verify` script that reads consumed version from `package.json` and fails on mismatch with env `GDS_VERSION_EXPECTED=2.3.0`.
- Update `READMEDEV.md` or `AGENTS.md` one line: consumed GDS packages.

### Out of scope

- Replacing `mantine-theme.ts` (child 3/9)
- Migrating components (children 4/9+)

## Technical Notes

### Peer alignment matrix (must satisfy)

| Package | Required range (GDS) | Amanoba action |
| --- | --- | --- |
| `@mantine/core` | `^7.9.0` | bump if below 7.9 |
| `react` / `react-dom` | `^18.2.0` or `^19` | no change if already compatible |
| `@gds/theme` | `2.3.0` | add |
| `@gds/core` | `2.3.0` | add |
| `@gds/admin` | `2.3.0` | add |

### Pseudocode: install verification

```ts
// scripts/verify-gds-version.ts (optional)
const expected = process.env.GDS_VERSION_EXPECTED ?? '2.3.0';
const pkgs = ['@gds/theme', '@gds/core', '@gds/admin'];
for (const name of pkgs) {
  const v = require(`${name}/package.json`).version;
  if (v !== expected) throw new Error(`${name}@${v} != ${expected}`);
}
```

### Import smoke test (add `scripts/gds-import-smoke.mjs`)

```js
import { extendGdsTheme } from '@gds/theme/server';
import { StateBlock } from '@gds/core/client';
import { ResponsiveDataView } from '@gds/admin/client';
console.log(Boolean(extendGdsTheme && StateBlock && ResponsiveDataView));
```

Run: `node scripts/gds-import-smoke.mjs` after install.

## UX Instructions

None (infra only).

## Execution Prompt

Modify `package.json` + lockfile. Document path. Do not wire provider yet. Run full quality gates.

## Acceptance Checks

- [ ] `@gds/theme`, `@gds/core`, `@gds/admin` present at **2.3.0** (or documented equivalent)
- [ ] `npm install` clean on clean machine / CI
- [ ] Import smoke script passes
- [ ] `DESIGN_UPDATE.md` states production install method
- [ ] `npm run type-check`, `lint`, `build` pass

## Verification

- `npm install`
- `node scripts/gds-import-smoke.mjs` (if added)
- `npm run type-check`
- `npm run lint`
- `npm run build`

## Dependencies

- Depends on: child 1/9 (doc mapping)
- Blocks: children 3/9–8/9

## Risks

- Unpublished packages: coordinate with GDS maintainers to publish `2.3.0` to npm or approve `file:` for Vercel with build step copying packages.

## Delivery Artifact

`package.json` + lockfile + optional verify script + doc note.
