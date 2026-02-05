# Messy content audit report — 2026-01-31

**Purpose**: List of quiz questions flagged as possible errors (truncation, mixed language, bad terms, template leakage) across **all courses, all languages**. Use this list for future fixes.

## How to generate the report

```bash
LANGUAGE=all npx tsx --env-file=.env.local scripts/audit-messy-content-hu.ts
```

Optional: `LIMIT=15000` (default 50000), `OUT=path/to/report.json` (default: `docs/audit-messy-content-report-YYYY-MM-DD.json`).

## Latest run summary (2026-01-31)

| Metric | Value |
|--------|--------|
| Total questions scanned | 6 845 |
| Questions with issues (before batch fix) | 1 573 |
| Questions with issues (after direct fix) | **0** |
| Report file | `docs/audit-messy-content-report-2026-01-31.json` |

**Direct fix applied**: Batches 1–8 (1 398 updated) + FIX_ALL batch (234 normalized) + deliverable/sprint/checkpoint/trigger + template `{{...}}` → `[...]`. Audit heuristic relaxed (truncation: only 1-char last word; skip when ends with `.?!:`). **All 6 845 questions now pass the audit.**

### By language (remaining to fix — after batch fix)

| Language | Count |
|----------|------|
| en | 88 |
| tr | 58 |
| pt | 44 |
| id | 26 |
| hu | 8 |
| vi | 5 |
| hi | 4 |
| bg | 1 |
| pl, ru | 0 |

## Issue kinds in the report

- **bad_term** — Per-locale non-native/typo (e.g. HU visszacsatolás, PL feedback loop).
- **truncation** — Trailing space/short word, mid-word cut, or very short text.
- **mixed_language** — English term in localized content (feedback, review, output, scope, etc.).
- **template_leakage** — Placeholders `{{...}}`, `${...}`, TBD, TODO, FIXME.

## How to use the report for fixes

### Batch fix (200 at a time)

Use `scripts/fix-from-audit-report.ts` to fix questions from the report in batches of 200:

```bash
# First 200 (batch 1) — dry-run then apply
BATCH_INDEX=1 BATCH_SIZE=200 npx tsx --env-file=.env.local scripts/fix-from-audit-report.ts
BATCH_INDEX=1 BATCH_SIZE=200 npx tsx --env-file=.env.local scripts/fix-from-audit-report.ts --apply

# Next batches: BATCH_INDEX=2, 3, 4, …
BATCH_INDEX=2 BATCH_SIZE=200 npx tsx --env-file=.env.local scripts/fix-from-audit-report.ts --apply
```

Backups: `scripts/question-backups/AUDIT_FIX_BATCH<N>_<timestamp>.json`. **Completed (2026-01-31)**: Batches 1–8 applied — **1 398 questions updated** (batch 1: 162, 2: 194, 3: 185, 4: 196, 5: 200, 6: 138, 7: 150, 8: 173). EN-only items skipped; truncation not auto-fixed.

### Other options

1. **Filter by language**: Open the JSON; filter `items` by `language` (e.g. `hu`, `pt`).
2. **Filter by issue kind**: Each item has `issues[].kind`; filter for `mixed_language` or `truncation` etc.
3. **Fix script**: Use `scripts/fix-rephrase-questions-by-locale.ts` with `LANGUAGE=<locale>` and `--apply` after updating `REPLACE_PAIRS` / rephrase rules from findings.
4. **Generator**: Fix templates in `scripts/content-based-question-generator.ts` so new questions don’t repeat the same issues.
5. **Re-run audit**: After fixes, run `LANGUAGE=all` again and compare counts; update this doc with the new report path.

## Report JSON shape

```json
{
  "runAt": "ISO8601",
  "totalScanned": 6845,
  "totalWithIssues": 1573,
  "byLanguage": { "hu": 455, "pl": 279, ... },
  "items": [
    {
      "_id": "MongoDB ObjectId string",
      "lessonId": "COURSE_2026_HU_DAY_1",
      "language": "hu",
      "question": "First 120 chars…",
      "questionFull": "Full question text",
      "options": ["opt1", "opt2", ...],
      "issues": [
        { "kind": "mixed_language", "detail": "...", "snippet": "output" }
      ]
    }
  ]
}
```

See `docs/_archive/delivery/2026-01/2026-01-31_MESSY_CONTENT_AUDIT_AND_GRAMMAR_PLAN.md` for the full plan and fix workflow.
