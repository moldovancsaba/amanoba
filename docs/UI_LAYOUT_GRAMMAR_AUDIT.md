# UI Layout Grammar Audit

**Generated at**: 2026-02-05T19:55:00.078Z

This report scans tracked UI code (`app/**`, `components/**`) for **layout-grammar / design-token** drift. It is a *heuristic* scan: it finds likely violations, then humans decide which are intentional.

## How to run

- Regenerate this file: `node --import tsx scripts/audit-layout-grammar-ui.ts --write`
- Quick scan (stdout only): `node --import tsx scripts/audit-layout-grammar-ui.ts`

## Summary

- Files scanned: **194**

### Findings by area
| Group | Findings |
| --- | --- |
| admin | 580 |
| app | 412 |
| games | 192 |
| components | 14 |

### Findings by severity
| Severity | Findings |
| --- | --- |
| major | 680 |
| minor | 464 |
| info | 54 |

### Top patterns (most frequent)
| Pattern | Severity | Findings |
| --- | --- | --- |
| Default Tailwind gray scale in UI | major | 562 |
| Plain white/black classes (bg-white, text-white, bg-black, text-black) | minor | 464 |
| Default Tailwind indigo/blue palette in UI | major | 118 |
| Inline style={{...}} in components/pages | info | 28 |
| Uses Tailwind dark: variants | info | 26 |

### Top files (most findings)
| File | Group | Findings |
| --- | --- | --- |
| `app/[locale]/profile/[playerId]/page.tsx` | app | 129 |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx` | admin | 88 |
| `app/[locale]/games/quizzz/page.tsx` | games | 56 |
| `app/[locale]/admin/players/page.tsx` | admin | 53 |
| `app/[locale]/admin/achievements/page.tsx` | admin | 49 |
| `app/[locale]/admin/certificates/page.tsx` | admin | 49 |
| `app/[locale]/admin/surveys/page.tsx` | admin | 49 |
| `app/[locale]/games/sudoku/page.tsx` | games | 46 |
| `app/[locale]/games/whackpop/page.tsx` | games | 46 |
| `app/[locale]/admin/rewards/page.tsx` | admin | 44 |
| `app/[locale]/admin/games/page.tsx` | admin | 41 |
| `app/[locale]/data-deletion/page.tsx` | app | 40 |
| `app/[locale]/games/madoku/page.tsx` | games | 40 |
| `app/[locale]/certificate/[slug]/page.tsx` | app | 36 |
| `app/[locale]/admin/analytics/page.tsx` | admin | 35 |
| `app/[locale]/admin/challenges/page.tsx` | admin | 33 |
| `app/[locale]/admin/email-analytics/page.tsx` | admin | 29 |
| `app/[locale]/certificate/verify/[playerId]/[courseId]/page.tsx` | app | 28 |
| `app/[locale]/admin/quests/page.tsx` | admin | 24 |
| `app/[locale]/admin/achievements/new/page.tsx` | admin | 22 |
| `app/[locale]/admin/questions/page.tsx` | admin | 22 |
| `app/[locale]/profile/[playerId]/certificate/[courseId]/page.tsx` | app | 22 |
| `app/[locale]/admin/feature-flags/page.tsx` | admin | 16 |
| `app/[locale]/courses/[courseId]/final-exam/page.tsx` | app | 16 |
| `app/[locale]/quests/page.tsx` | app | 16 |

## Rules checked (what counts as a “defect”)

These rules are derived from `docs/layout_grammar.md` (§ UI layout) + the design tokens in `app/design-system.css` and Tailwind brand colors (`tailwind.config.ts`).

| Rule | Severity | Scope | Notes |
| --- | --- | --- | --- |
| Hardcoded hex Tailwind colors (e.g. bg-[#...] ) | blocker | `app/**` + `components/**` | Use design tokens / brand palette. Exception: explicit external brand colors (e.g. social share) should be centralized. |
| Default Tailwind indigo/blue palette in UI | major | `app/**` + `components/**` | Amanoba UI grammar expects brand tokens (CTA yellow + dark shell). Indigo/blue typically indicates template leftovers. |
| Default Tailwind gray scale in UI | major | `app/**` + `components/**` | Prefer brand tokens (brand-darkGrey, brand-white, brand-black) and design-system CSS variables. |
| Plain white/black classes (bg-white, text-white, bg-black, text-black) | minor | `app/**` + `components/**` | Prefer `brand-*` tokens (`bg-brand-white`, `text-brand-white`, etc.) for consistency. |
| Uses Tailwind dark: variants | info | `app/**` + `components/**` | Dark mode exists (`darkMode: class`), but the product grammar is “dark shell by default”. Review for consistency. |
| Inline style={{...}} in components/pages | info | `app/**` + `components/**` | Often needed for progress widths/aspect ratios. Prefer Tailwind utilities when possible; ensure tokens for colors. |

## Sample findings (first 120)

Use this section to spot-check; the totals above are the authoritative counts.

| Where | Pattern | Matches |
| --- | --- | --- |
| `app/[locale]/achievements/page.tsx:43` | Default Tailwind gray scale in UI | `from-stone-500` `to-stone-700` |
| `app/[locale]/achievements/page.tsx:44` | Default Tailwind gray scale in UI | `from-gray-400` `to-gray-600` |
| `app/[locale]/achievements/page.tsx:45` | Default Tailwind gray scale in UI | `from-slate-300` `to-slate-500` |
| `app/[locale]/achievements/page.tsx:236` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/achievements/page.tsx:288` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/achievements/page.tsx:308` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:88` | Default Tailwind gray scale in UI | `bg-gray-400` `text-gray-300` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:352` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:365` | Default Tailwind gray scale in UI | `bg-gray-800` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:367` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:370` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:373` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:402` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:410` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:417` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:417` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:417` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:422` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:427` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:433` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:433` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:433` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:439` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:445` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:451` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:451` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:451` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:461` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:467` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:467` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:467` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:479` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:487` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:487` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:487` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:492` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:504` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` `bg-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:505` | Default Tailwind gray scale in UI | `border-gray-700` `border-gray-600` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:521` | Default Tailwind indigo/blue palette in UI | `text-indigo-600` `ring-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:521` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:523` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:532` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:537` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:539` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:544` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:544` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:544` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:558` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:564` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:564` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:564` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:576` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:583` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:583` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:583` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:587` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:602` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:609` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:609` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:609` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:619` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:624` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:631` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:631` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:631` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:638` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:645` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:645` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:645` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:653` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:660` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:660` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:660` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:670` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:678` | Default Tailwind indigo/blue palette in UI | `text-indigo-600` `ring-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:678` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:680` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:688` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:689` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:694` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:701` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:702` | Default Tailwind gray scale in UI | `text-gray-300` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:717` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:725` | Default Tailwind gray scale in UI | `bg-gray-700` `bg-gray-600` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:725` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:732` | Default Tailwind indigo/blue palette in UI | `bg-indigo-600` `bg-indigo-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:732` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:743` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `bg-black` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:744` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:745` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:746` | Default Tailwind gray scale in UI | `text-gray-300` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:760` | Default Tailwind gray scale in UI | `bg-gray-700` `bg-gray-600` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:760` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:768` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:261` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:264` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:285` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:293` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:310` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:328` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:344` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:362` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:406` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:415` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:420` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:441` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:459` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:485` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:502` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:507` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:521` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:536` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:553` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:563` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:571` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:577` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/page.tsx:108` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/page.tsx:115` | Default Tailwind gray scale in UI | `bg-gray-400` `text-gray-300` |
| `app/[locale]/admin/achievements/page.tsx:125` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/page.tsx:126` | Default Tailwind gray scale in UI | `text-gray-400` |

## Actionable next steps (recommended)

1. **Admin UI first:** Replace `indigo-*` / `gray-*` button + panel styling in `app/[locale]/admin/**` with the page primitives in `app/globals.css` (`.page-shell`, `.page-card(-dark)`, `.page-button-primary`, `.page-button-secondary`, `.input-on-dark`).
2. **Shared components next:** Fix `components/LanguageSwitcher.tsx` and any other shared component that uses default Tailwind palettes (these leak inconsistent styling across the app).
3. **Decide policy for games:** Either (A) treat games as allowed to use non-brand palettes, or (B) migrate them to brand tokens incrementally and update this audit script to include/exclude them.
4. **Add guardrails:** Turn the “blocker/major” rules into a `--check` CI step once we’ve reduced the current findings to an acceptable baseline.
