# UI Layout Grammar Audit

**Generated at**: 2026-05-22T11:59:14.654Z

This report scans tracked UI code (`app/**`, `components/**`) for **layout-grammar / design-token** drift. It is a *heuristic* scan: it finds likely violations, then humans decide which are intentional.

## How to run

- Regenerate this file: `node --import tsx scripts/audit-layout-grammar-ui.ts --write`
- Quick scan (stdout only): `node --import tsx scripts/audit-layout-grammar-ui.ts`

## Summary

- Files scanned: **216**

### Findings by area
| Group | Findings |
| --- | --- |
| app | 75 |
| admin | 32 |
| games | 7 |
| components | 7 |

### Findings by severity
| Severity | Findings |
| --- | --- |
| major | 46 |
| minor | 33 |
| info | 42 |

### Top patterns (most frequent)
| Pattern | Severity | Findings |
| --- | --- | --- |
| Inline style={{...}} in components/pages | info | 42 |
| Plain white/black classes (bg-white, text-white, bg-black, text-black) | minor | 33 |
| Default Tailwind indigo/blue palette in UI | major | 15 |
| CTA accent background on non-action elements (likely misuse) | major | 14 |
| CTA accent text on non-link elements (review) | major | 7 |
| Default Tailwind gray scale in UI | major | 6 |
| Tailwind yellow palette usage (prefer brand accent token) | major | 4 |

### Top files (most findings)
| File | Group | Findings |
| --- | --- | --- |
| `app/[locale]/admin/questions/page.tsx` | admin | 23 |
| `app/[locale]/quests/page.tsx` | app | 17 |
| `app/[locale]/achievements/page.tsx` | app | 9 |
| `app/[locale]/courses/[courseId]/page.tsx` | app | 7 |
| `app/[locale]/challenges/page.tsx` | app | 6 |
| `app/[locale]/partners/page.tsx` | app | 6 |
| `app/[locale]/rewards/page.tsx` | app | 6 |
| `app/[locale]/games/page.tsx` | games | 4 |
| `app/[locale]/stats/page.tsx` | app | 4 |
| `app/[locale]/admin/courses/[courseId]/page.tsx` | admin | 3 |
| `app/[locale]/admin/courses/page.tsx` | admin | 3 |
| `app/[locale]/settings/email/page.tsx` | app | 3 |
| `components/CourseDiscussion.tsx` | components | 3 |
| `app/[locale]/admin/layout.tsx` | admin | 2 |
| `app/[locale]/certificate/[slug]/page.tsx` | app | 2 |
| `app/[locale]/certificate/verify/[playerId]/[courseId]/page.tsx` | app | 2 |
| `app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx` | app | 2 |
| `app/[locale]/onboarding/page.tsx` | app | 2 |
| `app/components/LessonQuiz.tsx` | app | 2 |
| `app/components/games/MemoryGame.tsx` | games | 2 |
| `app/components/ui/markdown-editor.tsx` | app | 2 |
| `app/[locale]/admin/payments/page.tsx` | admin | 1 |
| `app/[locale]/auth/signin/page.tsx` | app | 1 |
| `app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx` | app | 1 |
| `app/[locale]/games/sudoku/loading.tsx` | games | 1 |

## Rules checked (what counts as a “defect”)

These rules are derived from `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` plus the Amanoba adapter rules in `docs/architecture/layout_grammar.md` (§ UI layout). `app/design-system.css` and `tailwind.config.ts` are adapter sources, not design authority.

| Rule | Severity | Scope | Notes |
| --- | --- | --- | --- |
| Hardcoded hex Tailwind colors (e.g. bg-[#...] ) | blocker | `app/**` + `components/**` | Use approved shared-theme or adapter tokens. Exception: explicit external brand colors (e.g. social share) should be centralized. |
| Inline color literals in style={{...}} (hex/rgb/hsl) | blocker | `app/**` + `components/**` | Avoid hardcoded colors in inline styles; use shared-theme or adapter tokens. (Heuristic scan: may include some false positives.) |
| Default Tailwind indigo/blue palette in UI | major | `app/**` + `components/**` | Amanoba UI grammar expects brand tokens (CTA yellow + dark shell). Indigo/blue typically indicates template leftovers. |
| Default Tailwind gray scale in UI | major | `app/**` + `components/**` | Prefer shared-theme semantics; while migrating, use adapter tokens (brand-darkGrey, brand-white, brand-black) and approved CSS variables. |
| Tailwind yellow palette usage (prefer brand accent token) | major | `app/**` + `components/**` | CTA yellow should be applied via brand tokens (`brand-accent` / `primary-*`) and used only for primary actions. |
| CTA accent background on non-action elements (likely misuse) | major | `app/**` + `components/**` | Layout grammar: CTA yellow is exclusive to primary actions. If this is an intentional CTA-like element, change to button/link or adjust styling. |
| CTA accent text on non-link elements (review) | major | `app/**` + `components/**` | Accent text is usually for primary links or emphasis. Ensure it is not used as a generic label/badge. |
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
| `app/[locale]/achievements/page.tsx:229` | CTA accent background on non-action elements (likely misuse) | `<div className="absolute top-0 right-0 bg-brand-accent text-brand-black px-3 py-1 rounded-bl-lg font-bold text-sm"` |
| `app/[locale]/achievements/page.tsx:248` | CTA accent text on non-link elements (review) | `<span className="text-brand-accent font-bold flex items-center gap-1"` |
| `app/[locale]/achievements/page.tsx:315` | CTA accent text on non-link elements (review) | `<span className="text-brand-accent font-bold"` |
| `app/[locale]/achievements/page.tsx:236` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/achievements/page.tsx:288` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/achievements/page.tsx:308` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/[courseId]/page.tsx:647` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/[courseId]/page.tsx:652` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/[courseId]/page.tsx:1508` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/page.tsx:828` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/page.tsx:833` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/page.tsx:838` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/layout.tsx:223` | CTA accent background on non-action elements (likely misuse) | `<div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0"` |
| `app/[locale]/admin/layout.tsx:149` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/payments/page.tsx:552` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/questions/page.tsx:383` | Default Tailwind indigo/blue palette in UI | `bg-indigo-600` `bg-indigo-700` |
| `app/[locale]/admin/questions/page.tsx:610` | Default Tailwind indigo/blue palette in UI | `text-indigo-400` `text-indigo-300` |
| `app/[locale]/admin/questions/page.tsx:629` | Default Tailwind indigo/blue palette in UI | `bg-indigo-600` `bg-indigo-700` |
| `app/[locale]/admin/questions/page.tsx:677` | Default Tailwind indigo/blue palette in UI | `text-indigo-300` |
| `app/[locale]/admin/questions/page.tsx:685` | Default Tailwind indigo/blue palette in UI | `text-indigo-400` `text-indigo-300` |
| `app/[locale]/admin/questions/page.tsx:708` | Default Tailwind indigo/blue palette in UI | `bg-blue-500` `text-blue-300` |
| `app/[locale]/admin/questions/page.tsx:758` | Default Tailwind indigo/blue palette in UI | `text-blue-400` `text-blue-300` `bg-blue-500` |
| `app/[locale]/admin/questions/page.tsx:986` | Default Tailwind indigo/blue palette in UI | `bg-indigo-600` `bg-indigo-700` |
| `app/[locale]/admin/questions/page.tsx:1038` | Default Tailwind indigo/blue palette in UI | `bg-indigo-600` `bg-indigo-700` |
| `app/[locale]/admin/questions/page.tsx:1047` | Default Tailwind indigo/blue palette in UI | `bg-indigo-500` `text-indigo-300` |
| `app/[locale]/admin/questions/page.tsx:1052` | Default Tailwind indigo/blue palette in UI | `text-indigo-200` |
| `app/[locale]/admin/questions/page.tsx:1096` | Default Tailwind indigo/blue palette in UI | `bg-indigo-600` `bg-indigo-700` |
| `app/[locale]/admin/questions/page.tsx:715` | Tailwind yellow palette usage (prefer brand accent token) | `bg-yellow-500/20` `text-yellow-300` |
| `app/[locale]/admin/questions/page.tsx:376` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/questions/page.tsx:383` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/questions/page.tsx:394` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/questions/page.tsx:629` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/questions/page.tsx:697` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/questions/page.tsx:805` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `bg-black` |
| `app/[locale]/admin/questions/page.tsx:808` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/questions/page.tsx:986` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/questions/page.tsx:1038` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/questions/page.tsx:1096` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/auth/signin/page.tsx:85` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/certificate/[slug]/page.tsx:139` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/certificate/[slug]/page.tsx:152` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/certificate/verify/[playerId]/[courseId]/page.tsx:100` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/certificate/verify/[playerId]/[courseId]/page.tsx:113` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/challenges/page.tsx:45` | Tailwind yellow palette usage (prefer brand accent token) | `text-yellow-700` |
| `app/[locale]/challenges/page.tsx:347` | CTA accent background on non-action elements (likely misuse) | `<div className="absolute top-0 right-0 bg-brand-accent text-brand-black px-4 py-1 rounded-bl-lg font-bold text-sm flex items-center gap-1"` |
| `app/[locale]/challenges/page.tsx:315` | CTA accent text on non-link elements (review) | `<span className="font-bold text-brand-accent"` |
| `app/[locale]/challenges/page.tsx:363` | CTA accent text on non-link elements (review) | `<span className="font-bold text-brand-accent"` |
| `app/[locale]/challenges/page.tsx:279` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/challenges/page.tsx:305` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx:843` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx:879` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx:608` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1248` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1278` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1283` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1289` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1414` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1518` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1525` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/games/page.tsx:174` | CTA accent background on non-action elements (likely misuse) | `<div className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold min-h-[44px] inline-flex items-center"` |
| `app/[locale]/games/page.tsx:178` | CTA accent background on non-action elements (likely misuse) | `<div className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold min-h-[44px] inline-flex items-center"` |
| `app/[locale]/games/page.tsx:233` | CTA accent background on non-action elements (likely misuse) | `<span className="bg-brand-accent text-brand-black px-2 py-1 rounded font-bold"` |
| `app/[locale]/games/page.tsx:242` | CTA accent background on non-action elements (likely misuse) | `<div className="bg-brand-accent p-4 text-center"` |
| `app/[locale]/games/sudoku/loading.tsx:4` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/leaderboards/page.tsx:138` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/onboarding/page.tsx:282` | CTA accent background on non-action elements (likely misuse) | `<div
              className="bg-brand-accent h-full transition-all duration-300"` |
| `app/[locale]/onboarding/page.tsx:284` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/page.tsx:77` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/partners/page.tsx:174` | CTA accent background on non-action elements (likely misuse) | `<div className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-accent/20 text-brand-black rounded-full font-medium"` |
| `app/[locale]/partners/page.tsx:175` | CTA accent background on non-action elements (likely misuse) | `<span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"` |
| `app/[locale]/partners/page.tsx:200` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/partners/page.tsx:210` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/partners/page.tsx:222` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/partners/page.tsx:223` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/quests/page.tsx:242` | Default Tailwind indigo/blue palette in UI | `bg-blue-50` `border-blue-200` |
| `app/[locale]/quests/page.tsx:250` | Default Tailwind indigo/blue palette in UI | `text-blue-600` |
| `app/[locale]/quests/page.tsx:261` | Default Tailwind indigo/blue palette in UI | `bg-blue-600` |
| `app/[locale]/quests/page.tsx:243` | Default Tailwind gray scale in UI | `bg-gray-50` `border-gray-200` |
| `app/[locale]/quests/page.tsx:206` | Tailwind yellow palette usage (prefer brand accent token) | `bg-yellow-400` |
| `app/[locale]/quests/page.tsx:200` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/quests/page.tsx:206` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-black` |
| `app/[locale]/quests/page.tsx:211` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/quests/page.tsx:213` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/quests/page.tsx:218` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/quests/page.tsx:223` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `bg-white` |
| `app/[locale]/quests/page.tsx:225` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `bg-white` |
| `app/[locale]/quests/page.tsx:261` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/quests/page.tsx:331` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/quests/page.tsx:336` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/quests/page.tsx:337` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/quests/page.tsx:226` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/rewards/page.tsx:234` | Tailwind yellow palette usage (prefer brand accent token) | `bg-yellow-400` |
| `app/[locale]/rewards/page.tsx:241` | CTA accent background on non-action elements (likely misuse) | `<div className="absolute top-0 right-0 bg-brand-accent text-brand-black px-3 py-1 rounded-bl-lg font-bold text-sm animate-pulse"` |
| `app/[locale]/rewards/page.tsx:270` | CTA accent text on non-link elements (review) | `<span className="text-2xl font-bold text-brand-accent flex items-center gap-1"` |
| `app/[locale]/rewards/page.tsx:234` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-black` |
| `app/[locale]/rewards/page.tsx:250` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/rewards/page.tsx:290` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `border-white` |
| `app/[locale]/settings/email/page.tsx:142` | Default Tailwind gray scale in UI | `border-gray-300` |
| `app/[locale]/settings/email/page.tsx:142` | CTA accent background on non-action elements (likely misuse) | `<div className="w-11 h-6 bg-brand-darkGrey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"` |
| `app/[locale]/settings/email/page.tsx:142` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `border-white` `bg-white` |
| `app/[locale]/stats/page.tsx:211` | CTA accent background on non-action elements (likely misuse) | `<div
                className="h-full bg-brand-accent"` |
| `app/[locale]/stats/page.tsx:326` | CTA accent background on non-action elements (likely misuse) | `<div
                  className="h-full bg-brand-accent"` |
| `app/[locale]/stats/page.tsx:213` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/stats/page.tsx:328` | Inline style={{...}} in components/pages | `style={{` |
| `app/components/LessonQuiz.tsx:189` | CTA accent text on non-link elements (review) | `<span className="font-bold text-brand-accent"` |
| `app/components/LessonQuiz.tsx:200` | CTA accent text on non-link elements (review) | `<span className="font-bold text-brand-accent text-lg"` |
| `app/components/ReferralCard.tsx:210` | Inline style={{...}} in components/pages | `style={{` |
| `app/components/games/MemoryGame.tsx:381` | Inline style={{...}} in components/pages | `style={{` |
| `app/components/games/MemoryGame.tsx:462` | Inline style={{...}} in components/pages | `style={{` |
| `app/components/ui/markdown-editor.tsx:55` | Inline style={{...}} in components/pages | `style={{` |
| `app/components/ui/markdown-editor.tsx:81` | Inline style={{...}} in components/pages | `style={{` |
| `components/CookieConsentBanner.tsx:56` | Inline style={{...}} in components/pages | `style={{` |
| `components/CourseDiscussion.tsx:221` | Inline style={{...}} in components/pages | `style={{` |
| `components/CourseDiscussion.tsx:226` | Inline style={{...}} in components/pages | `style={{` |
| `components/CourseDiscussion.tsx:302` | Inline style={{...}} in components/pages | `style={{` |
| `components/CourseStudyGroups.tsx:255` | Inline style={{...}} in components/pages | `style={{` |
| `components/Icon.tsx:114` | Inline style={{...}} in components/pages | `style={{` |

## Actionable next steps (recommended)

1. **Admin UI first:** Replace `indigo-*` / `gray-*` button + panel styling in `app/[locale]/admin/**` with shared adapter primitives now, then map those surfaces to Mantine wrappers during the shared-SSOT migration.
2. **Shared components next:** Fix `components/LanguageSwitcher.tsx` and any other shared component that uses default Tailwind palettes (these leak inconsistent styling across the app).
3. **Decide policy for games:** Document any game-canvas exceptions against `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/GOVERNANCE.md`, then migrate reusable chrome to the shared adapter.
4. **Add guardrails:** Turn the “blocker/major” rules into a `--check` CI step once we’ve reduced the current findings to an acceptable baseline.
