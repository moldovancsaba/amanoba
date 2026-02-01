# Messy Content Audit & Grammar / Understandability Plan

**Created**: 2026-01-31  
**Status**: In progress — Phase 1 delivered  
**Purpose**: Find all lowest-quality, messy content and define a clear process to check grammar and language understandability (per locale).

### Delivered (Phase 1)
- **Generator** (`scripts/content-based-question-generator.ts`): `visszacsatolást` → `visszajelzést`; practice text truncation at word boundary via `truncateAtWord(..., 60)`; HU distractor "visszacsatolás" → "visszajelzés".
- **Validator** (`scripts/question-quality-validator.ts`): HU bad-term checks (visszacsatolás, bevezetési táv, tartalo) and truncation heuristic (question/option ending with space or very short word) — errors/warnings.
- **Discovery script** (`scripts/audit-messy-content-hu.ts`): Scans DB questions for **all** messy categories (not just one bad term): **bad_term** (per-locale), **truncation** (trailing space/short word, mid-word cut, very short text), **mixed_language** (English terms in non-EN content: feedback, review, output, playbook, scope, trigger, dashboard, template, workflow, handover, deliverable, stakeholder, etc.), **template_leakage** ({{...}}, ${...}, TBD, TODO, FIXME). Run: `npx tsx --env-file=.env.local scripts/audit-messy-content-hu.ts`; optional `LANGUAGE=hu|ru|pl|...`. **LANGUAGE=all**: all courses, all languages, all questions; writes full report to `docs/audit-messy-content-report-YYYY-MM-DD.json` (see `docs/audit-messy-content-report-2026-01-31.md`).
- **Rephrase script** (`scripts/fix-hu-practice-questions-rephrase.ts`): Rephrases HU practice-intro questions and options to native Hungarian (stem + options); backup under `scripts/question-backups/`; run dry-run then `--apply`. 47 questions updated.
- **Scale plan** (Section 7): Pipeline for rephrase and grammar at scale (all languages): discovery → rephrase rules per locale → fix script per locale → generator cleanup → validation gate → lessons/UI.

---

## 1. What “messy” and “lowest quality” mean

Content is **messy** or **lowest quality** when one or more of the following apply:

| Category | Examples |
|----------|----------|
| **Truncation** | Question or option text cut mid-word or mid-sentence (e.g. „Hozz létre e”, „Playbook tartalo”, „mit m”, „struktúrá”). |
| **Non-native phrasing** | Literal translation, stiff wording, or terms that a native speaker would not use (e.g. „visszacsatolást” → prefer „visszajelzést”; „bevezetési táv” → „bevezetési terv”). |
| **Typos / wrong word** | „tartalo” instead of „tartalmat”; „táv” instead of „terv”; wrong agreement (e.g. „Nincs számok” vs „Nincsenek számok”). |
| **Mixed language** | English (or other) tokens inside a non-EN locale (e.g. „review”, „feedback loop”, „Playbook” as untranslated terms in HU text). |
| **Unclear / ambiguous** | Sentence structure or terminology makes the question or instruction hard to understand on first read. |
| **Template leakage** | Placeholders, „…”, or obvious template fragments visible to the user. |

**Target**: User-facing content only (quiz questions, lesson body/title, UI strings, emails). Internal run logs (e.g. handover) reflect DB/content state but are not displayed to learners.

---

## 2. Where messy content lives (inventory)

### 2.1 Quiz questions (user-facing)

| Source | Location | Notes |
|--------|----------|--------|
| **Generator templates** | `scripts/content-based-question-generator.ts` | HU (and other locale) question/option **templates**. Root cause of e.g. „visszacsatolást”, truncated „${p}” (60 chars), stiff phrasing. |
| **Database** | MongoDB (questions collection) | Live questions served to lesson quiz and QUIZZZ. Seeded/updated via scripts; can contain old or generator-produced text. |
| **Run log (evidence only)** | `docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md`, `docs/QUIZ_ITEM_QA_HANDOVER.md` | Log of evaluated items; many HU questions with „visszacsatolást”, truncation, repeated pattern. Not UI, but proves DB has messy items. |

### 2.2 Lesson content (user-facing)

| Source | Location | Notes |
|--------|----------|--------|
| **Database** | MongoDB (lessons, courses) | Titles, body, email subject/body. |
| **Seed / fix scripts** | `scripts/seed-*.ts`, `scripts/fix-*-hu-*.ts`, `scripts/refine-*-hu-*.ts` | Inline or loaded content; fixes already done e.g. „visszajelzési hurok”, „bevezetési ütemterv” in `scripts/fix-playbook-2026-30-hu-language-integrity.ts`. |
| **Backups** | `scripts/lesson-backups/<COURSE>_*/` | JSON snapshots; reference for before/after, not live. |

### 2.3 UI strings (user-facing)

| Source | Location | Notes |
|--------|----------|--------|
| **i18n** | `messages/hu.json` (and other `messages/*.json`) | Keys used in app (e.g. „Kérdés”, „Kérdés: {{current}} / {{total}}”). |
| **Hardcoded** | `app/[locale]/courses/[courseId]/final-exam/page.tsx`, `app/[locale]/privacy/page.tsx`, etc. | Some pages have inline HU (or other) strings. |

### 2.4 Other

| Source | Location | Notes |
|--------|----------|--------|
| **Email templates** | See `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` (email integrity) | Localized footers and body. |
| **Docs** | `docs/QUIZ_ITEM_QA_HANDOVER*.md` | Run logs; not user-facing but useful for **discovery** of bad question text. |

---

## 3. Plan: clearly check grammar and understandability

### Phase A — Discovery (find all messy content)

1. **Quiz questions**
   - **Generator**: Grep/search `scripts/content-based-question-generator.ts` for all locale blocks (hu, ru, pl, etc.) and list every template string used for question text and options.
   - **DB** (audit script `scripts/audit-messy-content-hu.ts`): Query by language (`LANGUAGE=hu|ru|pl|…`) and scan for **all** messy categories:
     - **Truncation**: trailing space/short word, mid-word cut (1–2 letter final token), very short text (&lt; 12 chars).
     - **Bad terms** (per-locale): e.g. HU „visszacsatolást”, „bevezetési táv”, „tartalo”; PL/VI „feedback loop”.
     - **Mixed language**: common English terms in non-EN content (feedback, review, output, playbook, scope, trigger, dashboard, template, workflow, handover, deliverable, stakeholder, checkpoint, rollout, standup, backlog, sprint, etc.).
     - **Template leakage**: `{{...}}`, `${...}`, TBD, TODO, FIXME, `[...]`.
   - **Handover log**: Use `docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md` as a **sample** of HU (and other) questions; extract unique question texts and flag truncation / non-native / typo.

2. **Lessons**
   - List courses with HU (and other non-EN) lessons; for each, get title + body (and email subject/body if applicable).
   - Scan for: mixed language, typos, unclear sentences (manual or scripted pattern match).

3. **UI**
   - Review `messages/hu.json` (and other locales) for typos and unnatural phrasing.
   - Grep `app/[locale]` for hardcoded strings in Hungarian (or target locale).

4. **Output**
   - Single **audit list** (spreadsheet or markdown): per source (generator template id, question id, lesson id, message key), „issue type” (truncation / non-native / typo / mixed / unclear), „snippet”, optional „suggested fix”.

### Phase B — Grammar and understandability criteria (checklist)

Define a **per-locale** checklist. For **Hungarian** (example):

- **Grammar**
  - Correct spelling (including „tartalmat”, „terv”, „visszajelzés”).
  - Subject–verb and number agreement (e.g. „Nincsenek számok”).
  - Proper punctuation and quotation marks („…” vs "…").
- **Understandability**
  - Sentence is clear on first read; no ambiguous reference.
  - Terminology is native or accepted loan (e.g. „Playbook” can stay if product term; „feedback” → „visszajelzés” in normal text).
- **Consistency**
  - Same concept same term across questions/lessons (e.g. „bevezetési terv” everywhere, not „bevezetési táv” or „rollout ütemterv” in HU).

Repeat for other locales (e.g. RU, PL) with native-speaker or proven reference where possible.

### Phase C — Fix workflow

1. **Generator**
   - Edit `scripts/content-based-question-generator.ts`: replace „visszacsatolást” with „visszajelzést”; consider increasing or removing the 60‑char truncation for `${p}` (or truncate with „…” and full words).
   - Review every HU (and other) template in that file for non-native phrasing and typos; fix in code.
2. **DB questions**
   - For each question id in the audit list: apply fix (e.g. replace „visszacsatolást” → „visszajelzést”, fix truncated text if possible from lesson/source). Prefer script (e.g. `scripts/fix-*-hu-*.ts`) with backup before update.
3. **Lessons**
   - Fix in seed/fix scripts or via API; keep backups. Re-run seed for affected courses if that’s the source of truth.
4. **UI**
   - Edit `messages/hu.json` (and others) and any hardcoded strings; deploy.

### Phase D — Validation (ongoing)

1. **Automated**
   - Extend `scripts/question-quality-validator.ts` (or add a small script) to:
     - Reject or flag known bad HU terms (e.g. „visszacsatolást”, „bevezetési táv”, „tartalo” as typo).
     - Optionally: flag question text ending in incomplete word (simple heuristic).
   - Run validator in CI or pre-commit for question imports/updates.
2. **Manual**
   - For each batch of fixes: spot-check random sample for grammar and understandability using the per-locale checklist.
3. **Handover**
   - After fixes, re-run quiz-item-qa (or equivalent) so new run log no longer contains the old messy samples.

---

## 4. Execution order (recommended)

| Step | Action | Owner |
|------|--------|--------|
| 1 | Fix **generator** templates in `content-based-question-generator.ts` (visszacsatolást → visszajelzést; truncation; other HU templates). | Dev |
| 2 | Add **validator** rules (or script) for bad HU terms and truncation. | Dev |
| 3 | Export **questions** (e.g. HU) from DB; run discovery script (truncation + bad terms); produce audit list. | Dev |
| 4 | Fix **DB questions** (script + backup); then lessons and UI. | Dev |
| 5 | **Manual** grammar/understandability check on a sample per locale. | Reviewer |
| 6 | Document **per-locale checklist** in this doc or `docs/COURSE_BUILDING_RULES.md` / `layout_grammar.md` so future content is checked the same way. | Dev |

---

## 5. References

- **Quality rules**: `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` (gold-standard question type; language integrity).
- **Course quality**: `docs/2026-01-25_COURSE_CONTENT_QUALITY_AUDIT_AND_FIX_MASTER_PLAN.md`.
- **Layout / structure**: `docs/layout_grammar.md`.
- **Existing HU fixes**: `scripts/fix-playbook-2026-30-hu-language-integrity.ts`, `scripts/fix-geo-shopify-30-hu-review-terms.ts`.
- **Question validator**: `scripts/question-quality-validator.ts`.

---

## 6. Summary

- **Messy content** = truncation, non-native phrasing, typos, mixed language, unclear or template leakage.
- **Main sources**: quiz **generator** (`content-based-question-generator.ts`), **DB** (questions + lessons), **messages** and hardcoded UI.
- **Plan**: (A) discover all such content; (B) define per-locale grammar/understandability checklist; (C) fix generator first, then DB/lessons/UI; (D) validate with extended validator + manual sample.
- **First concrete fixes**: In `content-based-question-generator.ts` replace „visszacsatolást” with „visszajelzést” and fix truncation of practice text `${p}`; then audit and fix DB questions using the same criteria.

---

## 7. Scale plan: rephrase and grammar at scale

**Goal**: Apply proper rephrase and grammar/understandability checks across **all languages** and **all question types**, not just one word in one language.

### 7.1 Principles

- **Rephrase, don’t just replace**: Fix non-native or unclear text by rewriting stems and options (native word order, correct terms, clear sentences). Single-word swaps are a stopgap only.
- **Per-locale rules**: Each language has its own bad terms, typo list, and preferred phrasing. Maintain a small “rephrase rules” set per locale (e.g. HU: visszacsatolás → visszajelzés; RU: similar glossary).
- **Template-first, then DB**: Fix generator templates so **new** content is clean; then fix existing DB content in batches (by course/language) with backup.

### 7.2 Pipeline (at scale)

| Phase | Action | Scope |
|-------|--------|--------|
| **1. Discovery** | Run audit script per language (e.g. `LANGUAGE=ru npx tsx scripts/audit-messy-content-hu.ts` or extend script to support RU/PL/…). Export list: question id, language, issue type, snippet. | All course-specific questions, per locale. |
| **2. Rephrase rules** | For each locale, document: (a) bad terms → correct term, (b) stem rephrase patterns (e.g. “Egy új gyakorlatot vezetsz be” → “Bevezetsz egy új gyakorlatot”), (c) recurring option rephrases. | One “rephrase rules” doc or script config per language. |
| **3. Fix script per locale** | Script that loads rephrase rules, finds matching questions (by language/lessonId), applies stem + option rephrases, writes backup, updates DB. Example: `fix-hu-practice-questions-rephrase.ts`; replicate pattern for RU, PL, etc. | One script per language (or one script + locale param and rules file). |
| **4. Generator cleanup** | Review **all** locale blocks in `content-based-question-generator.ts` (HU, RU, PL, …): fix non-native templates, truncation, and bad terms so new questions are clean. | Generator file. |
| **5. Validation gate** | Validator (or CI job) rejects/errors on known bad terms and truncation per language; optional: human review of a random sample per batch. | Every question insert/update. |
| **6. Lessons and UI** | Same idea for lesson content and `messages/*.json`: per-locale audit, rephrase rules, fix script, backup, update. | Lessons, i18n, hardcoded strings. |

### 7.3 Execution order at scale

1. **Extend discovery** to all locales (e.g. add LANGUAGE env to audit script; add RU/PL bad-term lists).
2. **Document rephrase rules** per language (bad terms, stem patterns, recurring options) in this doc or `docs/COURSE_BUILDING_RULES.md` / a dedicated `docs/REPHRASE_RULES_*.md`.
3. **Fix scripts**: One rephrase script per language (or one parameterised script + rules), with backup and `--apply`.
4. **Generator**: Pass over every locale block in the content-based generator; apply native phrasing and no truncation.
5. **Validator**: Ensure bad-term and truncation checks exist for each supported locale.
6. **Lessons / UI**: Repeat discovery → rules → fix script for lesson content and UI strings.

### 7.4 Delivered (quick win + scale)

- **HU practice questions**: 47 questions rephrased (stem + options) via `scripts/fix-hu-practice-questions-rephrase.ts`; backup in `scripts/question-backups/HU_REPHRASE_<timestamp>.json`. Audit now reports 1 remaining HU issue (truncation on another question type).
- **Scale (delivered)**:
  - **Audit script** (`scripts/audit-messy-content-hu.ts`): Supports `LANGUAGE=hu|ru|pl`; per-locale bad-term lists (HU, PL: feedback loop; RU: extend when found). Query filters by `lessonId` (_HU_/_RU_/_PL_).
  - **Rephrase rules docs**: `docs/REPHRASE_RULES_HU.md`, `docs/REPHRASE_RULES_RU.md`, `docs/REPHRASE_RULES_PL.md` (bad terms, stem patterns, script refs).
  - **Parameterised fix script** (`scripts/fix-rephrase-questions-by-locale.ts`): `LANGUAGE=hu|ru|pl`; HU = full stem+option rephrase; RU/PL = simple replace list (PL: feedback loop → pętla informacji zwrotnej). Backup: `scripts/question-backups/REPHRASE_<LOCALE>_<timestamp>.json`.
  - **Generator**: RU and PL practice templates use `truncateAtWord(practice, 60)`; PL "feedback loop" → "szybką pętlę informacji zwrotnej", "mierzalny output" → "mierzalny wynik".
  - **Validator**: PL and VI bad-term check for "feedback loop" (PL: pętla informacji zwrotnej; VI: vòng phản hồi).
- **All locales**: Audit script and fix script support `LANGUAGE=hu|ru|pl|bg|tr|vi|id|pt|hi|ar`. Rephrase rules docs: `docs/REPHRASE_RULES_{HU,RU,PL,BG,TR,VI,ID,PT,HI,AR}.md`. Generator: TR uses `truncateAtWord(practice, 60)`; BG and VI use truncateAtWord and native "feedback" term (BG: обратна връзка; VI: vòng phản hồi). Remaining locales (ID, PT, HI, AR) can be extended with truncateAtWord and replace pairs when bad terms are found.

### 7.5 Continue from here (after context loss)

- **Generator**: Remaining `${practice}` in `pickOne`/`pickThree` calls are **seeds** (not displayed text); no change needed. Displayed text uses `${p}` (truncated) in all locale blocks.
- **Next steps** (in order):  
  1. Run audit per locale to find bad terms: `LANGUAGE=ru npx tsx --env-file=.env.local scripts/audit-messy-content-hu.ts` (then pl, bg, tr, vi, id, pt, hi, ar).  
  2. For each locale with findings: add bad terms to `docs/REPHRASE_RULES_<LOCALE>.md` and to the fix script’s `REPLACE_PAIRS` (or stem logic for HU).  
  3. Run fix script with backup: `LANGUAGE=ru npx tsx --env-file=.env.local scripts/fix-rephrase-questions-by-locale.ts` (dry-run), then `--apply`.  
  4. Phase 6 (lessons / UI): repeat discovery → rules → fix for lesson content and `messages/*.json`.
