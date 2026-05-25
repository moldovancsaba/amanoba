## Objective

Migrate **Auth**, **public/marketing**, and **article/detail** shells to **`@gds/core`** (`AuthShell`, `PublicShell`, `ArticleShell`) using thin adapters only where Amanoba slots differ—eliminating duplicate local shell implementations.

## Unified Context

| Local file | Routes | GDS export |
| --- | --- | --- |
| `patterns/AuthShell.tsx` | `auth/signin`, `auth/error` | `@gds/core/AuthShell` |
| `patterns/PublicAppShell.tsx` | `page.tsx`, `partners` | `@gds/core/PublicShell` |
| `patterns/ArticleShell.tsx` | `blog/[slug]`, `news/[slug]` | `@gds/core/ArticleShell` |

Compare props before delete-local (child 8/9).

## Problem

Maintaining two shell codepaths guarantees drift from GDS 2.3.0 bugfixes and i18n copy in packages.

## Goal

All three families import from `@gds/core/client` (or re-export file `app/components/patterns/gds/AuthShell.tsx` that wraps GDS with Amanoba-only props).

## Scope

### In scope

- Prop mapping table implemented in adapter or direct swap:

**AuthShell** — preserve: `footer`, `alert`, `size` (xs). GDS `AuthShell` slots: verify `children`, optional header/footer.

**PublicShell** — map `headerActions`, `brand` (Logo), `footer`, `tagline` → GDS `PublicShell` API (`logoText`, `headerActions`, `footer`).

**ArticleShell** — map metadata rail, `TypographyStylesProvider` wrapper for body, mobile collapse.

- Update routes listed above; run `ui:check:mantine` allowlist paths if file paths change.
- Tabler icons only; no lucide.

### Out of scope

- `LearnerPageHeader` (no GDS contract)
- Admin `AppShell` (`@gds/admin/AppShell` optional later)

## Technical Notes

### Adapter pattern (preferred)

```tsx
// app/components/patterns/gds/PublicAppShell.tsx
'use client';
export { PublicShell as PublicAppShell } from '@gds/core/client';
// OR wrap if Logo slot required:
import { PublicShell } from '@gds/core/client';
import Logo from '@/components/Logo';
export function PublicAppShell(props) {
  return <PublicShell logoText={...} headerActions={...} {...props} />;
}
```

### UX Instructions

- **Auth:** centered column, max width `xs`/`sm`; error uses `StateBlock` below title; sign-in footer grid unchanged.
- **Public:** sticky header band `ink.8`; marketing CTA not competing with page header actions.
- **Article:** readable measure `max-width` ~720px for body; metadata above title; mobile: metadata stacks above content.

### Pseudocode: migration order

```
migrate(AuthShell) → verify /en/auth/signin, /en/auth/error
migrate(PublicShell) → verify /en, /en/partners
migrate(ArticleShell) → verify /en/blog/{slug}, /en/news/{slug}
```

## Acceptance Checks

- [ ] No direct UI imports of deleted local shell files (if removed) or locals are thin re-exports only
- [ ] Sign-in, landing, article detail render without layout regression
- [ ] `npm run ui:check:mantine` passes
- [ ] Screenshots: auth mobile, landing desktop, article mobile

## Verification

- `npm run type-check`, `lint`, `ui:check:mantine`, `ui:check:foundation`, `ui:check:layout`, `build`
- Browser: paths above at 390px and 1280px

## Dependencies

- Depends on: children 2/9, 3/9
- Blocks: child 8/9 (deletion)

## Risks

- API mismatch on `PublicShell` logo slot—wrapper required.

## Delivery Artifact

Migrated routes + adapter re-exports + HANDOVER.
