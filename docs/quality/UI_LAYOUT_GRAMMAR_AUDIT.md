# UI Layout Grammar Audit

**Generated at**: 2026-08-05T12:55:56.774Z

This report scans tracked UI code (`app/**`, `components/**`) for **layout-grammar / design-token** drift. It is a *heuristic* scan: it finds likely violations, then humans decide which are intentional.

## How to run

- Regenerate this file: `node --import tsx scripts/audit-layout-grammar-ui.ts --write`
- Quick scan (stdout only): `node --import tsx scripts/audit-layout-grammar-ui.ts`

## Summary

- Files scanned: **270**

### Findings by area
| Group | Findings |
| --- | --- |
| app | 26 |
| admin | 7 |

### Findings by severity
| Severity | Findings |
| --- | --- |
| info | 33 |

### Top patterns (most frequent)
| Pattern | Severity | Findings |
| --- | --- | --- |
| Inline style={{...}} in components/pages | info | 33 |

### Top files (most findings)
| File | Group | Findings |
| --- | --- | --- |
| `app/[locale]/data-deletion/page.tsx` | app | 5 |
| `app/[locale]/onboarding/page.tsx` | app | 5 |
| `app/[locale]/courses/[courseId]/page.tsx` | app | 3 |
| `app/[locale]/leaderboards/page.tsx` | app | 3 |
| `app/[locale]/admin/certificate-templates/page.tsx` | admin | 2 |
| `app/[locale]/admin/courses/[courseId]/page.tsx` | admin | 2 |
| `app/[locale]/notifications/page.tsx` | app | 2 |
| `app/components/LessonQuiz.tsx` | app | 2 |
| `app/[locale]/admin/courses/[courseId]/live-sessions/page.tsx` | admin | 1 |
| `app/[locale]/admin/courses/page.tsx` | admin | 1 |
| `app/[locale]/admin/discussion/page.tsx` | admin | 1 |
| `app/[locale]/courses/[courseId]/day/[dayNumber]/view/page.tsx` | app | 1 |
| `app/[locale]/courses/page.tsx` | app | 1 |
| `app/[locale]/editor/courses/page.tsx` | app | 1 |
| `app/[locale]/privacy/page.tsx` | app | 1 |
| `app/[locale]/terms/page.tsx` | app | 1 |
| `app/components/patterns/gds/ResponsiveDataView.tsx` | app | 1 |

## Rules checked (what counts as a “defect”)

These rules are derived from `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` plus the Amanoba adapter rules in `docs/architecture/layout_grammar.md` (§ UI layout). `app/design-system.css` and the Mantine theme are local adapter sources, not design authority.

| Rule | Severity | Scope | Notes |
| --- | --- | --- | --- |
| Hardcoded utility hex colors (e.g. bg-[#...] ) | blocker | `app/**` + `components/**` | Use approved shared-theme or adapter tokens. Exception: explicit external brand colors (e.g. social share) should be centralized. |
| Inline color literals in style={{...}} (hex/rgb/hsl) | blocker | `app/**` + `components/**` | Avoid hardcoded colors in inline styles; use shared-theme or adapter tokens. (Heuristic scan: may include some false positives.) |
| Default template indigo/blue palette in UI | major | `app/**` + `components/**` | Amanoba UI grammar expects brand tokens (CTA yellow + dark shell). Indigo/blue typically indicates template leftovers. |
| Default template gray scale in UI | major | `app/**` + `components/**` | Prefer shared-theme semantics; while migrating, use adapter tokens (brand-darkGray, brand-white, brand-black) and approved CSS variables. |
| Template yellow palette usage (prefer brand accent token) | major | `app/**` + `components/**` | CTA yellow should be applied via brand tokens (`brand-accent` / `primary-*`) and used only for primary actions. |
| CTA accent background on non-action elements (likely misuse) | major | `app/**` + `components/**` | Layout grammar: CTA yellow is exclusive to primary actions. If this is an intentional CTA-like element, change to button/link or adjust styling. |
| CTA accent text on non-link elements (review) | major | `app/**` + `components/**` | Accent text is usually for primary links or emphasis. Ensure it is not used as a generic label/badge. |
| Plain white/black classes (bg-white, text-white, bg-black, text-black) | minor | `app/**` + `components/**` | Prefer `brand-*` tokens (`bg-brand-white`, `text-brand-white`, etc.) for consistency. |
| Uses utility dark: variants | info | `app/**` + `components/**` | The product grammar is “dark shell by default”. Review utility dark-mode variants for consistency. |
| Inline style={{...}} in components/pages | info | `app/**` + `components/**` | Often needed for progress widths/aspect ratios. Prefer Mantine props or pattern contracts when possible; ensure tokens for colors. |

## Sample findings (first 120)

Use this section to spot-check; the totals above are the authoritative counts.

| Where | Pattern | Matches |
| --- | --- | --- |
| `app/[locale]/admin/certificate-templates/page.tsx:130` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/certificate-templates/page.tsx:138` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/[courseId]/live-sessions/page.tsx:150` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/[courseId]/page.tsx:547` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/[courseId]/page.tsx:1584` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/courses/page.tsx:498` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/discussion/page.tsx:101` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/day/[dayNumber]/view/page.tsx:106` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1319` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1328` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/[courseId]/page.tsx:1400` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/courses/page.tsx:348` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/data-deletion/page.tsx:47` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/data-deletion/page.tsx:63` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/data-deletion/page.tsx:85` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/data-deletion/page.tsx:128` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/data-deletion/page.tsx:166` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/editor/courses/page.tsx:99` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/leaderboards/page.tsx:267` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/leaderboards/page.tsx:306` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/leaderboards/page.tsx:308` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/notifications/page.tsx:86` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/notifications/page.tsx:96` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/onboarding/page.tsx:263` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/onboarding/page.tsx:267` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/onboarding/page.tsx:293` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/onboarding/page.tsx:304` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/onboarding/page.tsx:381` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/privacy/page.tsx:376` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/terms/page.tsx:669` | Inline style={{...}} in components/pages | `style={{` |
| `app/components/LessonQuiz.tsx:226` | Inline style={{...}} in components/pages | `style={{` |
| `app/components/LessonQuiz.tsx:259` | Inline style={{...}} in components/pages | `style={{` |
| `app/components/patterns/gds/ResponsiveDataView.tsx:114` | Inline style={{...}} in components/pages | `style={{` |

## Actionable next steps (recommended)

1. **Admin UI first:** Replace `indigo-*` / `gray-*` button + panel styling in `app/[locale]/admin/**` with shared adapter primitives now, then map those surfaces to Mantine wrappers during the shared-SSOT migration.
2. **Shared components next:** Fix shared components that use template palette classes or page-local styling (these leak inconsistent styling across the app).
3. **Decide policy for games:** Document any game-canvas exceptions against `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/GOVERNANCE_AND_ADOPTION.md`, then migrate reusable chrome to the shared adapter.
4. **Add guardrails:** Turn the “blocker/major” rules into a `--check` CI step once we’ve reduced the current findings to an acceptable baseline.
