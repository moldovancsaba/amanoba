# Layout Audit January 2026 — Action Items

**Source**: `docs/_archive/delivery/2026-01/2026-01_LAYOUT_AUDIT.md`  
**Created**: 2026-01-28  
**Purpose**: Track remediation of January layout audit findings (layout grammar §1–§8). Work in order: **P1 → P2 → P3**.

---

## P1 — Documentation (no placeholders)

- [x] **P1.1** ARCHITECTURE.md: Replace "TBD" in Performance Targets with "—" and add footnote pointing to tasklist. **Done:** TBD removed; deliverable to measure and fill baseline is `docs/_archive/tasklists/DOCUMENTATION_AUDIT_JANUARY__2026-01-28.md` item 1.
- [x] **P1.2** Option: Remove the "Current" column — **Not chosen;** kept column with "—" and footnote.

---

## P2 — UI / design tokens (replace inline hex)

- [ ] **P2.1** rich-text-editor.tsx: Replace inline hex for brand/CTA and neutrals with design-system or Tailwind tokens. Use `var(--cta-bg)` or `var(--color-primary-500)` for CTA/primary; use `var(--color-neutral-*)` or design-system greys for `#000000`, `#374151`, `#9CA3AF` (or Tailwind `brand-black`, `brand-darkGrey` where applicable). File: `app/components/ui/rich-text-editor.tsx`.
- [ ] **P2.2** Certificate image route (revoked state): Replace `background: '#1a1a1a'` and `color: '#ef4444'` with design-system tokens (e.g. `var(--color-neutral-900)` or equivalent for background; `var(--color-error)` for error text). File: `app/api/certificates/[slug]/image/route.tsx`.

---

## P3 — Optional (consistency and doc)

- [ ] **P3.1** (Optional) Add chart color tokens to design-system (e.g. `--chart-grid`, `--chart-axis`, `--chart-series-1` …) and use them in admin analytics page instead of inline hex. File: `app/[locale]/admin/analytics/page.tsx`.
- [ ] **P3.2** (Optional) layout_grammar.md §1: Add one sentence that repo root may contain operating doc (`agent_working_loop_canonical_operating_document.md`) and course-quality prompt (`2026_course_quality_prompt.md`) as exceptions to "feature docs in /docs".
- [ ] **P3.3** (Optional) Document LinkedIn blue (`#0A66C2`) as allowed exception for social/share buttons in layout_grammar or DESIGN_UPDATE (certificate page "Share on LinkedIn").
- [ ] **P3.4** (Optional) Run quiz quality validator / pipeline against layout grammar §5 (min 7 questions, cognitive mix, 4 options, standalone/scenario-based). Reference: `docs/COURSE_BUILDING_RULES.md`, `docs/_archive/reference/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`.

---

## Done (for reference)

- **P1.1** ARCHITECTURE.md Performance Targets: TBD replaced with "—"; footnote points to DOCUMENTATION_AUDIT tasklist item 1 for baseline delivery.
- **P1.2** Option (remove Current column) not chosen.

---

**Cross-references**: `docs/layout_grammar.md`, `docs/_archive/delivery/2026-01/2026-01_LAYOUT_AUDIT.md`, `app/design-system.css`, `docs/DESIGN_UPDATE.md`.
