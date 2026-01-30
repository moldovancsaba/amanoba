# Quiz pipeline – updated sample (2026-01-29)

After the full pipeline run (tiny loop: replace invalid one-by-one, fill missing one-by-one), here is an **updated sample** so you can see the current quiz quality.

---

## Summary of what was done

1. **questionType/difficulty handling**
   - Pipeline now defaults `questionType` and `difficulty` when building the validation payload (so legacy DB records without these fields don’t break batch validation).
   - Validator treats missing `questionType`/`difficulty` as APPLICATION/MEDIUM so single-question validation doesn’t fail on old data.

2. **Pipeline run (2026-01-29 16:59)**
   - 25 courses, 720 lessons evaluated.
   - 143 lessons rewritten (tiny loop): 579 invalid questions deleted, 1132 valid questions inserted.
   - 296 lessons need lesson refinement first (score &lt; 70 or language gate).
   - 37 lessons failed rewrite in that run (mostly PRODUCTIVITY_2026_EN: fill phase could not reach 7 valid questions per lesson; generator returns too few valid candidates for that course).

3. **B2B_SALES_2026_30_EN**
   - Re-run after the questionType fix: no rewrite failures; course passes.

4. **PRODUCTIVITY_2026_EN**
   - Still 30 lessons failing: “Must have at least 7 questions per lesson”. The content-based generator for this course yields too few questions that pass strict QC. Next step: either add more valid patterns to `generateProductivity2026QuestionsEN` or temporarily increase fill attempts further.

---

## Updated sample: DONE_BETTER_2026_EN Day 1

**Course:** Done is better - Build What Matters  
**Lesson:** Day 1 – Welcome to Real Thinking  
**Questions:** 7 (5 application, 2 critical-thinking).  
**Source:** `scripts/reports/quiz-sample__DONE_BETTER_2026_EN_DAY_01__2026-01-29T17-07-32-941Z.json`

### Example questions (gold-standard style)

**Q1 (application)**  
A structured program trains you to think, decide, and deliver rather than just consume content. What is its primary goal?  
- To be more effective, not just smart or busy ✓  
- To become more intelligent without changing behavior  
- To do more tasks regardless of outcomes  
- To feel more motivated in the short term only  

**Q2 (application)**  
A manager wants to keep improving after a busy quarter. They are choosing between relying on feeling motivated each morning and setting a daily 5-minute reflection: what did I learn, what do I do next. Which approach is more likely to sustain progress?  
- The daily reflection loop; systems persist when motivation fades ✓  
- Relying on feeling motivated each morning; motivation is more powerful  
- Doing more activities without tracking what they learned or what to do next  
- Setting only a yearly goal with no daily structure or reflection  

**Q5 (critical-thinking)**  
A leader says: "We did 50 meetings this month." What is missing for effectiveness?  
- A link to outcomes or results, not just activity ✓  
- More meetings to align the team  
- Fewer notes so people can focus  
- Longer meetings to cover everything  

These are standalone, scenario-based, with a concrete deliverable/outcome and concrete distractors (no generic filler).

---

## Full sample files (current DB state)

| Lesson | File |
|--------|------|
| DONE_BETTER_2026_EN Day 1 | `scripts/reports/quiz-sample__DONE_BETTER_2026_EN_DAY_01__2026-01-29T17-07-32-941Z.json` |
| GEO_SHOPIFY_30_EN Day 11 | `scripts/reports/quiz-sample__GEO_SHOPIFY_30_EN_DAY_11__2026-01-29T17-07-30-258Z.json` |

To dump another lesson:

```bash
npx tsx --env-file=.env.local scripts/dump-quiz-sample.ts LESSON_ID
```

---

## Pipeline reports (latest)

- **Full run:** `scripts/reports/quiz-quality-pipeline__2026-01-29T16-59-19-676Z.json`  
- **Rewrite failures:** `scripts/reports/quiz-quality-pipeline__2026-01-29T17-06-27-944Z__rewrite-failures.md` (30 × PRODUCTIVITY_2026_EN)
