## Objective

Replace ad-hoc **Loader + plain text** empty/error states on remaining learner/gamification routes with governed **`StateBlock`** (`@gds/core` via child 5/9 adapter).

## Unified Context

Routes **without** StateBlock today (audit 2026-05-24):

| Route file | Current pattern |
| --- | --- |
| `app/[locale]/quests/page.tsx` | `<Loader />` center |
| `app/[locale]/rewards/page.tsx` | `<Loader />` |
| `app/[locale]/profile/[playerId]/page.tsx` | Loader + inline errors |
| `app/[locale]/settings/email/page.tsx` | Loader |
| `app/[locale]/saved/page.tsx` | Loader in list |
| `app/[locale]/courses/[courseId]/page.tsx` | partial — verify |
| `app/[locale]/onboarding/page.tsx` | has StateBlock for gate — verify steps |

## Problem

Inconsistent empty/error UX violates GDS § State Blocks and Amanoba inventory rule § Canonical Component Rules.

## Goal

\[
\forall r \in \text{learnerRoutes}: \text{loading}(r) \Rightarrow \text{StateBlock}(\text{loading})
\]

and same for empty/error/permission where applicable.

## Scope

### In scope

For each route:

1. **Loading:** `StateBlock variant="loading"` compact or full per layout
2. **Empty:** `variant="empty"` with CTA (e.g. browse courses, start quest)
3. **Error:** `variant="error"` + retry `Button`
4. **Unauthenticated:** `variant="permission"` + sign-in link

### Pseudocode template

```tsx
if (status === 'loading') return <StateBlock variant="loading" title={t('loading')} compact />;
if (error) return <StateBlock variant="error" title={t('error')} description={error.message} action={<Button onClick={retry}>...</Button>} />;
if (items.length === 0) return <StateBlock variant="empty" title={t('empty')} action={<Button component={Link} href="...">...</Button>} />;
```

### UX Instructions

- **Quests:** empty = "No active quests" + link to games/courses; error = retry fetch
- **Rewards:** empty = explain how to earn points; loading inside grid area not full viewport flash
- **Profile:** permission when viewing others without session; error on 404 player
- **Saved lessons:** empty = link to catalog
- Mobile: compact variant inside `Container`; avoid double scroll with `LearnerPageHeader`

### Out of scope

- Admin tables (child 6/9)
- Game board internals (`EXCEPTION_SURFACES` game canvas)

## Acceptance Checks

- [ ] Each route in table uses StateBlock for loading/empty/error (grep audit clean)
- [ ] No bare `<Loader />` as sole page content on those routes
- [ ] i18n keys added to message catalogs (en + existing locales pattern)
- [ ] `ui:check:mantine` passes

## Verification

- Quality gates
- Browser: `/en/quests`, `/en/rewards`, `/en/profile/{id}`, `/en/saved` — throttle network for error state

## Dependencies

- Depends on: 5/9 (StateBlock adapter)
- Independent of 6/9

## Risks

- Over-full-page states on nested tabs—use `compact`

## Delivery Artifact

Migrated pages + grep evidence in PR body.
