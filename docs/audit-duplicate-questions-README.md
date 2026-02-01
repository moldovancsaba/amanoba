# Duplicate / similar questions audit (lesson by lesson)

**Purpose**: Find duplicate or very similar questions (content-meaning > 85%) and repeated answers across 3+ questions, so you can create new questions and rewrite answers.

## Repeatable process

The process is **repeatable** and always investigates **two scopes** for every lesson:

1. **Actual (current) lesson** – All questions in the current lesson (within-lesson comparison).
2. **Previous lesson** – Questions from the lesson immediately before (cross-lesson comparison).

So for each lesson in order (Day 1, Day 2, …):

- **Duplicate detection**: Compare every question in the **actual** lesson to every other question in the same lesson; then compare every question in the **actual** lesson to every question in the **previous** lesson (window of last 2 lessons’ questions).
- **Similar answers**: Consider a sliding window of at least **14 questions** from the **previous** lesson (min 7) and the **actual** lesson (min 7). If the same or very similar option text appears in 3+ of those questions → rewrite answers.

When moving to the next lesson, the “previous” becomes the lesson you just finished; the “actual” becomes the next lesson. This way the process always investigates **actual + previous** lesson’s questions, lesson by lesson.

## Rules (as specified)

1. **One lesson at a time** – Process lessons in order (by `dayNumber`).
2. **Within a lesson** – Compare all questions in the lesson for content-meaning similarity. If similarity > 85% → **create a new question**.
3. **Cross-lesson** – Compare each lesson’s questions to the **previous lesson** (same > 85% rule).
4. **Sliding window** – Always consider at least **14 questions** from the **last 2 lessons** (and their answers). When moving to the next lesson, drop the oldest **min 7** questions and add the current lesson’s **min 7**.
5. **Similar answers** – If the same or very similar answer text appears in **3+ questions** (in that window) → **rewrite answers**.

## How to run

```bash
npx tsx --env-file=.env.local scripts/audit-duplicate-questions-by-lesson.ts
```

**Optional env:**

| Env | Default | Description |
|-----|---------|-------------|
| `COURSE_ID` | (all courses) | Restrict to one course, e.g. `PRODUCTIVITY_2026_HU` |
| `SIMILARITY_THRESHOLD` | 0.85 | Content similarity threshold (0–1). Pairs above this → create new question. |
| `MIN_WINDOW` | 14 | Min number of questions in the 2-lesson window for answer similarity. |
| `MIN_PREV` | 7 | Min number of questions kept from the previous lesson in the window. |
| `OUT` | `docs/audit-duplicate-questions-report.json` | Report path. |

## Report shape

- **byLesson**: One entry per lesson with:
  - **duplicatePairs**: Pairs of questions with similarity ≥ threshold → action: `create_new_question`.
  - **similarAnswerGroups**: Groups of (option text, questionIds, lessonIds) where the same/similar option appears in ≥ 3 questions → action: `rewrite_answers`.
- **summary**: Totals (lessons processed, duplicate pairs, similar-answer groups).

## Similarity

- **Content-meaning** is approximated by **word-set Jaccard**: normalize text (lowercase, strip punctuation), tokenize into words, then `|A ∩ B| / |A ∪ B|`. No embeddings; template-style questions (e.g. only one word different) will still score high and be flagged.

## Fix script (create new question + DELETE one of pair; rewrite answers)

**Create new question**: For each duplicate pair, the script generates ONE new MCQ from the lesson using the assessment-writer prompt (standalone MCQs, 4 options, no duplicates), inserts it, then **DELETEs** one of the pair (not deactivate).

**Rewrite answers**: For each similar-answer group, the script paraphrases the repeated option text via LLM and updates each question’s option so they are distinct.

**LLM provider (one of):**

- **OpenAI**: set `OPENAI_API_KEY` in `.env.local`. Optional: `OPENAI_MODEL` (default `gpt-4o-mini`).
- **Ollama (local)**: set `OLLAMA_BASE_URL` (default `http://localhost:11434`) and `OLLAMA_MODEL` (e.g. `llama3.2`, `mistral`). No API key needed. Run `ollama serve` and pull a model (e.g. `ollama pull llama3.2`) first.

Auto-detect: if `OLLAMA_BASE_URL` or `OLLAMA_MODEL` is set, use Ollama; else use OpenAI if `OPENAI_API_KEY` is set. Or set `LLM_PROVIDER=openai` or `LLM_PROVIDER=ollama` explicitly.

```bash
# Dry-run (no DB changes)
npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts

# Apply with OpenAI
npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply

# Apply with local Ollama (no API key)
OLLAMA_MODEL=llama3.2 npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply
# or: LLM_PROVIDER=ollama OLLAMA_BASE_URL=http://localhost:11434 OLLAMA_MODEL=mistral ...
```

**Optional env**: `REPORT=path`, `FIX_DUPLICATES=false`, `FIX_ANSWERS=false`, `LIMIT_PAIRS=5`, `LIMIT_GROUPS=5` (for testing).

**Note**: Re-run the audit after changing the audit script (e.g. for `optionOccurrences`) so the report includes `optionOccurrences` for rewrite-answers. Old reports without `optionOccurrences` will use a fallback (find option index by matching text).

## Example (PRODUCTIVITY_2026_HU)

- 30 lessons processed.
- 264 duplicate pairs (create new question).
- 210 similar-answer groups (rewrite answers).

Many pairs are template-style (“Egy projektben a „X” fogalmat…”) with only the term X differing; they still exceed 85% word overlap. You can raise `SIMILARITY_THRESHOLD` (e.g. 0.92) or add logic to ignore template-only differences in a future version.
