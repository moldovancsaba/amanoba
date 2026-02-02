# Duplicate questions: start from the very beginning

End-to-end flow for finding and fixing duplicate/similar questions and repeated answers. Do these steps in order.

---

## Prerequisites

- Node/npx and project deps: `npm install`
- `.env.local` with DB and app config (MongoDB connection, etc.)
- **For fix script (step 2)** either:
  - **Ollama (local)**: Ollama installed and running (`ollama serve`), model pulled (e.g. `ollama pull llama3.1:8b`). No API key.
  - **OpenAI**: `OPENAI_API_KEY` in `.env.local`

---

## Step 1: Run the audit (generate the report)

This scans all lessons (or one course), compares **actual + previous** lesson’s questions, and writes a report.

```bash
npx tsx --env-file=.env.local scripts/audit-duplicate-questions-by-lesson.ts
```

**Optional**: Restrict to one course:

```bash
COURSE_ID=PRODUCTIVITY_2026_HU npx tsx --env-file=.env.local scripts/audit-duplicate-questions-by-lesson.ts
```

**Output**: `docs/audit-duplicate-questions-report.json` (by default; override with `OUT=path`).

**What it does**: For each lesson in order, compares questions within the current lesson and with the previous lesson; finds duplicate pairs (> 85% similarity) and similar-answer groups (same/similar option in 3+ questions in the 2-lesson window).

---

## Step 2: Run the fix script (create new questions, delete duplicates, rewrite answers)

Use the report from step 1. Dry-run first, then apply.

**Dry-run (no DB changes):**

```bash
OLLAMA_MODEL=llama3.1:8b npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts
```

**Apply with a small test (1 pair, 1 group):**

```bash
LIMIT_PAIRS=1 LIMIT_GROUPS=1 OLLAMA_MODEL=llama3.1:8b npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply
```

**Apply on the full report:**

```bash
OLLAMA_MODEL=llama3.1:8b npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply
```

**Apply for one course only** (recommended to avoid long runs):

```bash
COURSE_ID=GEO_SHOPIFY_30_EN OLLAMA_MODEL=llama3.1:8b npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply
```

**With OpenAI instead of Ollama:** Omit `OLLAMA_MODEL`; set `OPENAI_API_KEY` in `.env.local`.

**What it does**: For each duplicate pair, generates one new MCQ from the lesson (LLM), inserts it, **deletes** one of the pair. For each similar-answer group, paraphrases the repeated option and updates each question’s option. Backup: `scripts/question-backups/FIX_DUPLICATES_<timestamp>.json`.

---

## Step 3 (optional): Re-run the audit

After fixing, re-run step 1 to get a new report and confirm fewer duplicates/similar answers.

---

## Summary

| Step | Command | Result |
|------|---------|--------|
| 1 | `npx tsx --env-file=.env.local scripts/audit-duplicate-questions-by-lesson.ts` | Report: `docs/audit-duplicate-questions-report.json` |
| 2a | Same script with `... fix-duplicates-from-report.ts` (no --apply) | Dry-run log |
| 2b | Same script with `--apply` | New questions created, duplicates deleted, answers rewritten |

**Repeatable process**: The audit always investigates the **actual** (current) lesson’s questions and the **previous** lesson’s questions, lesson by lesson. See `docs/audit-duplicate-questions-README.md` for details.
