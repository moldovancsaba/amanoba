# January Layout Audit

**Date**: 2026-01-28  
**Reference**: `docs/layout_grammar.md` (v1.0, 2026-01-30)  
**Scope**: Project layout (§1), documentation layout (§2), CCS layout (§3), lesson layout (§4), UI/design layout (§6), API/route layout (§7), language layout (§8). Quiz layout (§5) alignment is noted as optional follow-up.

---

## Summary

| Section | Status | Findings |
|--------|--------|----------|
| §1 Project layout | ✅ Compliant | Minor: root-level `.md` (operating doc, course quality prompt) — acceptable as exceptions. |
| §2 Documentation layout | ✅ Resolved | ARCHITECTURE.md "TBD" removed; deliverable to fill baseline: `docs/tasklists/DOCUMENTATION_AUDIT_JANUARY__2026-01-28.md` item 1. |
| §3 CCS layout | ✅ Compliant | PRODUCTIVITY_2026 and DONE_BETTER_2026 present with .canonical.json + _CCS.md. |
| §4 Lesson layout | ✅ Compliant | Lesson model has required fields; quizConfig present. |
| §5 Quiz layout | — | Not audited (would require DB/script). Optional: run quiz quality validator against §5. |
| §6 UI/design layout | ⚠️ 2 findings | Inline hex in rich-text-editor, certificate image route, admin analytics; LinkedIn blue in certificate page. |
| §7 API/route layout | ✅ Compliant | app/[locale]/, app/api/, admin paths, stable IDs in paths. |
| §8 Language layout | ✅ Compliant | messages/<locale>.json with namespaced keys; course language in model. |

---

## §1. Project layout (files and folders)

**Grammar**: `/docs`, `/app`, `/messages`, `/scripts`, `/components`, `/public`; feature docs `YYYY-MM-DD_FEATURE.md` in `/docs`; naming kebab-case for files/dirs.

**Audit**:
- **Folders**: `/docs`, `/app`, `/messages`, `/scripts`, `/components`, `/public` present. `/types` and `/__tests__` exist (not in grammar table; acceptable).
- **App structure**: `app/[locale]/`, `app/api/`, `app/lib/`, `app/design-system.css`, `app/globals.css` — matches.
- **Root-level .md**: `agent_working_loop_canonical_operating_document.md`, `2026_course_quality_prompt.md` at repo root. Grammar says feature docs in `/docs`. These are operational/SSOT docs; treating as **documented exceptions** is acceptable. No change required; optionally note in layout_grammar that root may contain operating doc and course-quality prompt.
- **Naming**: Locale routes use kebab-case (`email-analytics`, `feature-flags`, `my-courses`, `data-deletion`). Scripts and docs mix; tasklists use `*__YYYY-MM-DD*.md` pattern.

**Verdict**: ✅ Compliant.

---

## §2. Documentation layout

**Grammar**: Feature docs `/docs/YYYY-MM-DD_FEATURE.md`; core docs in `/docs`; no placeholders ("TBD", "coming soon"); documentation = code.

**Audit**:
- **Core docs**: TASKLIST.md, ROADMAP.md, RELEASE_NOTES.md, ARCHITECTURE.md, LEARNINGS.md, layout_grammar.md in `/docs`. ✅
- **Feature/dated docs**: Many under `/docs` use `YYYY-MM-DD_*` (e.g. `2026-01-28_DEEP_CODE_AUDIT.md`). Reference docs without date (VERCEL_DEPLOYMENT.md, COURSE_BUILDING_RULES.md, etc.) are acceptable as non-feature reference.
- **Placeholders**: 
  - **ARCHITECTURE.md** (lines 797–801): Performance Targets table has "TBD" in "Current" column for API P95, LCP, Error Rate, Lighthouse Score, PWA Installability. Grammar §2: "No placeholders: Every document must reflect the current state. 'TBD' and 'coming soon' are not allowed."
  - Other "TBD"/"TODO"/"placeholder" grep hits: tasklist section headers (TODO 1, TODO 2), quiz question text containing the word "placeholder", RELEASE_NOTES historical use of "placeholder" (skeleton loaders, Madoku) — not doc placeholders. Only ARCHITECTURE Performance Targets are a layout-grammar finding.

**Finding 1 (resolved):** ARCHITECTURE.md Performance Targets "TBD" was replaced with "—" and a footnote. The requirement to measure and fill the baseline is in `docs/tasklists/DOCUMENTATION_AUDIT_JANUARY__2026-01-28.md` item 1.

**Verdict**: ✅ Resolved (placeholder removed; deliverable in tasklist).

---

## §3. Course and canonical course spec (CCS) layout

**Grammar**: `docs/canonical/<COURSE_FAMILY>/` with `<NAME>.canonical.json` and `<NAME>_CCS.md`.

**Audit**:
- **Canonical families**: `docs/canonical/PRODUCTIVITY_2026/`, `docs/canonical/DONE_BETTER_2026/`.
- **Files**: Each has `*.canonical.json` and `*_CCS.md`. ✅

**Verdict**: ✅ Compliant.

---

## §4. Lesson layout (data and content)

**Grammar**: Lesson model required fields; content structure (intro, main, summary, action items); quiz linkage via quizConfig.

**Audit**:
- **Model** (`app/lib/models/lesson.ts`): lessonId, courseId, dayNumber, language, title, content, emailSubject, emailBody, pointsReward, xpReward, isActive, displayOrder — all present. quizConfig (enabled, successThreshold, questionCount, poolSize, required) present.
- **Content structure**: Grammar describes prose structure (intro/main/summary/action); not validated in this file-only audit.

**Verdict**: ✅ Compliant (model and quiz linkage).

---

## §5. Quiz layout (structure and quality)

**Grammar**: Min 7 questions per lesson; 0 RECALL, min 5 APPLICATION, min 2 CRITICAL_THINKING; 4 options; standalone, scenario-based; metadata and distractor rules.

**Audit**: Not performed (requires DB or script). Optional follow-up: run existing quiz quality validator / pipeline against §5 and COURSE_BUILDING_RULES + QUIZ_QUALITY_PIPELINE_PLAYBOOK.

**Verdict**: — Deferred.

---

## §6. UI and design layout

**Grammar**: Design system in `app/design-system.css`, `app/globals.css`, `tailwind.config.ts`; CTA yellow (#FAB908) for primary actions only; avoid inline hex for brand/CTA; use tokens (`brand-accent`, `brand-black`, etc.) or CSS variables.

**Audit**:
- **Design system**: design-system.css defines `--cta-bg`, `--color-primary-*`, CTA tokens. tailwind.config.ts uses `var(--cta-bg)` for brand.accent and primary. ✅
- **Inline hex in app**:
  1. **Certificate page** (`app/[locale]/profile/[playerId]/certificate/[courseId]/page.tsx`): `bg-[#0A66C2]` for "Share on LinkedIn" button. **Assessment**: Third-party brand (LinkedIn blue). Acceptable as exception; optionally add a design-system token (e.g. `--social-linkedin`) if more social buttons are added.
  2. **Certificate image route** (`app/api/certificates/[slug]/image/route.tsx`): `background: '#1a1a1a'`, `color: '#ef4444'` for revoked state. **Assessment**: Could use design-system semantic tokens (e.g. `--color-error`, neutral dark) for consistency. **Finding**.
  3. **Rich text editor** (`app/components/ui/rich-text-editor.tsx`): Multiple inline hex (`#000000`, `#374151`, `#FAB908`, `#9CA3AF`, etc.) in styles. **Assessment**: Grammar says avoid inline hex for brand/CTA; use tokens. CTA/primary should use `var(--cta-bg)` or Tailwind `brand-accent`; neutrals could use design-system or Tailwind tokens. **Finding**.
  4. **Admin analytics** (`app/[locale]/admin/analytics/page.tsx`): `gridStroke: '#ffffff33'`, `axisStroke: '#ffffff'`, `tooltipBg: '#1f2937'`, `series: ['#6366f1', ...]` for charts. **Assessment**: Chart palettes often use hex; consider moving to a small chart color token set in design-system for consistency. **Minor finding** (optional).

**Finding 2**: Replace inline hex in rich-text-editor and certificate image (revoked) route with design-system/Tailwind tokens where applicable.  
**Finding 3**: (Optional) Add chart color tokens and use them in admin analytics; document LinkedIn blue as allowed exception for social buttons.

**Verdict**: ⚠️ Two findings (inline hex in editor and certificate image route); one optional (chart tokens).

---

## §7. API and route layout

**Grammar**: App Router `app/[locale]/<segment>/...`, `app/api/<segment>/...`; locale first; admin under `[locale]/admin` and `api/admin`; stable IDs in paths.

**Audit**:
- **Locale**: `app/[locale]/` with dashboard, courses, profile, admin, certificate, auth, etc. ✅
- **API**: `app/api/` with admin, auth, certificates, courses, cron, email, leaderboards, payments, profile, votes, etc. ✅
- **Admin**: `app/[locale]/admin/...`, `app/api/admin/...`. ✅
- **IDs**: courseId, playerId, slug, achievementId, lessonId, etc. in path segments. ✅

**Verdict**: ✅ Compliant.

---

## §8. Language and localization layout

**Grammar**: Course single language; lesson and email fields in that language; UI in `messages/<locale>.json`; keys namespaced.

**Audit**:
- **Messages**: `messages/en.json`, `messages/hu.json` (and others). Keys namespaced (e.g. `common.*`, `auth.*`, `dashboard`, `admin`). ✅
- **Course language**: In Lesson and Course models. ✅

**Verdict**: ✅ Compliant.

---

## Action items (priority)

**Tasklist**: Action items are recorded in **`docs/tasklists/LAYOUT_AUDIT_JANUARY__2026-01-28.md`**. Work in order P1 → P2 → P3.

| Priority | Action | Owner |
|----------|--------|--------|
| — | ARCHITECTURE.md: TBD removed; deliver baseline and fill table (see DOCUMENTATION_AUDIT tasklist item 1). | Dev |
| P2 | rich-text-editor.tsx: Replace inline hex for brand/CTA and neutrals with design-system or Tailwind tokens (e.g. `var(--cta-bg)`, `var(--color-primary-500)`, neutral tokens). | Dev |
| P2 | Certificate image route (revoked state): Use design-system tokens for background and error color instead of `#1a1a1a` and `#ef4444`. | Dev |
| P3 | (Optional) Add chart color tokens to design-system and use in admin analytics page. | Dev |
| P3 | (Optional) Note in layout_grammar §1 that repo root may contain operating doc and course-quality prompt. | Doc |
| — | (Optional) Run quiz quality validator / pipeline for §5 alignment. | Dev |

---

## References

- **Layout grammar**: `docs/layout_grammar.md`
- **Course/quiz quality**: `docs/COURSE_BUILDING_RULES.md`, `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`, `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md`
- **Design**: `app/design-system.css`, `docs/DESIGN_UPDATE.md`
- **Naming**: `docs/NAMING_GUIDE.md`
- **Documentation audit**: `docs/2026-01_DOCUMENTATION_AUDIT.md` (placeholders, single-place rule); tasklist: `docs/tasklists/DOCUMENTATION_AUDIT_JANUARY__2026-01-28.md`

---

**Maintained by**: Amanoba team  
**Next audit**: After layout grammar or design system changes, or quarterly (e.g. April 2026).
