# Quiz questions: requirements summary and delivery plan (Archived)

> Archived on 2026-02-05. This is historical planning context.

**Last updated:** 2026-02-03  
**Status:** Plan — not yet implemented.

---

## 1. Requirements summary (your ask)

### 1.1 Question structure: 3 options (1 good + 2 random bad)

- **Stored per question:** one **correct answer** + a **list of wrong answers** (N wrong).
- **Shown to the student:** exactly **3 options**:
  - the correct answer
  - 2 wrong answers **chosen at random** from the N wrong
- **Order:** the 3 options are **shuffled** each time (so the correct answer is not always in the same position).

Example:

- Stored: `good: "Paris"`, `bad: ["London", "Berlin", "Madrid", "Rome", ...]`
- One run: Question? → [Madrid, London, **Paris**]  
- Another run: Question? → [**Paris**, Rome, Berlin]

### 1.2 Lesson quiz: 5 questions, random selection

- Each **lesson quiz** shows **exactly 5 questions**.
- Those 5 are **randomly selected** from **all questions linked to that lesson** (pool).
- Order of the 5 questions is **random** (e.g. show Q7, Q4, Q2, Q3, Q6 instead of 1–5).

### 1.3 Answer handling

- “Finetune how we manage user answers” — track which option the user picked and whether it was correct; use that for pass/fail and (optionally) analytics.

### 1.4 Lesson quiz pass/fail: course-level “wrong answers allowed”

- **Course-level setting:** how many **wrong answers** are allowed in the **lesson quiz** (or equivalently: how many correct are required).
  - **0** = one wrong answer → **fail** (strict).
  - **5** = pass even if all 5 answers are wrong (very lenient).
- So the author sets a **rigidity** (e.g. “max wrong allowed” or “min correct required”) per course for **daily lesson quizzes**.

### 1.5 Final exam: % error rate + immediate fail

- **Course-level setting:** maximum **error rate** (e.g. **10%**) for the **final exam**.
- Student answers **one question at a time**.
- **After each answer:**  
  - If **current error rate** (wrong / answered so far) **exceeds** the set % (e.g. 10%), the student **fails immediately** and does **not** see the rest of the questions.
- So: “student can answer until they are in the range; if at the 25th question a wrong answer pushes them over 10%, they fail immediately.”

---

## 2. What we have today (as-is)

### 2.1 Question model (`QuizQuestion`)

| Aspect | Current |
|--------|--------|
| Options | **Exactly 4 options** in `options: string[]`. |
| Correct | **correctIndex** (0–3) points to one of the 4. |
| Validation | Schema enforces `options.length === 4` and `correctIndex` in 0–3. |
| Good/bad split | Not stored; all options are in one array. |

So we do **not** have “1 good + N bad” or “show 3 options (1 good + 2 random bad)”.

### 2.2 Lesson quiz

| Aspect | Current |
|--------|--------|
| Questions per quiz | **quizConfig.questionCount** (e.g. 5). |
| Pool | **quizConfig.poolSize**; questions filtered by **lessonId** + **courseId**. |
| Selection | API `/api/games/quizzz/questions` selects up to `count` from pool (with diversity by category, showCount, etc.). |
| Order | Questions and **options** are **shuffled** before sending to client. |
| Pass/fail | **quizConfig.successThreshold** = **percentage** (e.g. 70). Pass if `(correct / total) * 100 >= successThreshold`. |

So we **do** have: fixed number of questions per quiz (e.g. 5), random selection from lesson pool, shuffled order. We **do not** have: “max wrong answers allowed” at course level (we have percentage threshold only).

### 2.3 Answer handling

- Client sends `{ questionId, selectedIndex, selectedOption }` to lesson quiz submit.
- Server matches by **selectedIndex** or by **option value** to **options[correctIndex]**.
- Results: `score`, `total`, `percentage`, `passed`; per-question correct/incorrect in response.

### 2.4 Final exam

| Aspect | Current |
|--------|--------|
| Flow | One question at a time; POST each answer to `/api/certification/final-exam/answer`. |
| Options | 4 options per question; order shuffled per question (**answerOrderByQuestion**). |
| Completion | When all questions in **questionOrder** are answered, client calls **submit**; then **pass/fail** is computed. |
| Pass rule | **course.certification.passThresholdPercent** (e.g. 50). Pass if **final** score % ≥ threshold. |

So we **do not** have: “fail **immediately** when current error rate exceeds X%” (we only grade at the end).

---

## 3. What to change (to-be) and delivery plan

### Phase 1 — Question structure: 1 correct + N wrong, show 3 options

**Goal:** Store one correct answer and a list of wrong answers; at display time show 3 options (correct + 2 random wrong), shuffled.

| # | Task | Details |
|---|------|--------|
| 1.1 | **Model** | Extend `QuizQuestion`: support **either** (A) current `options` + `correctIndex` **or** (B) `correctAnswer: string` + `wrongAnswers: string[]`. For (B), require `wrongAnswers.length >= 2` so we can always pick 2 wrong. Migration: existing questions stay (A); new/import can use (B). Optionally allow both and prefer (B) when present. |
| 1.2 | **Validation** | Relax or duplicate validator: (A) 4 options + correctIndex 0–3; (B) correctAnswer + wrongAnswers (min 2). |
| 1.3 | **Lesson quiz API** (`GET /api/games/quizzz/questions`) | When building response for each question: if (B), pick 2 random from `wrongAnswers`, combine with `correctAnswer`, shuffle, and return `options: [3 items]`; do **not** send correctIndex. Client only gets option strings and selected index; submit by value or by index. |
| 1.4 | **Lesson quiz submit** | Keep accepting `selectedIndex` and/or `selectedOption`; server resolves correct by comparing to stored correct answer (and option order if stored in session). No change to client contract if we send 3 options and track order server-side per request (or derive from questionId + stored correct). |
| 1.5 | **Final exam** | Same idea: for (B) questions, each question shows 3 options (correct + 2 random wrong), shuffled. Reuse same “build 3 options” logic in final-exam question delivery. |
| 1.6 | **Admin / import** | Quiz manager and course import: allow creating/editing questions in “1 correct + N wrong” form; export/import this shape in package. |

**Backward compatibility:** Questions that only have `options` + `correctIndex` (current format) continue to work: we still return 4 options (or we can “reduce” to 3 by dropping one wrong at random). Prefer not to change existing behaviour for old questions unless we migrate them.

---

### Phase 2 — Lesson quiz: 5 questions fixed, course-level “max wrong allowed”

**Goal:** Lesson quiz always shows 5 questions (or configurable); pass/fail uses a **course-level** “max wrong answers allowed” (or “min correct required”).

| # | Task | Details |
|---|------|--------|
| 2.1 | **Course (or lesson) config** | Add e.g. **quizMaxWrongAllowed** (number, 0–5) at **course** level. Meaning: “fail if wrong count > this”. Alternative: **quizMinCorrectRequired** (0–5). Default e.g. 0 = fail on first wrong; 5 = pass even if all wrong. |
| 2.2 | **Lesson quiz submit** | Instead of (or in addition to) `successThreshold` %: compute `passed = (wrongCount <= course.quizMaxWrongAllowed)`. If both exist, can support both semantics (e.g. “pass if either % ≥ threshold OR wrong ≤ max”). Prefer single rule: **max wrong allowed** for lesson quiz. |
| 2.3 | **Admin UI** | Course editor: add field “Lesson quiz: max wrong answers allowed” (0–5). Optional: keep successThreshold for display/backward compat but document that “lesson quiz pass rule” is now “max wrong allowed”. |
| 2.4 | **Default** | If not set, default e.g. “2” (allow 2 wrong out of 5) or keep current 70% equivalent: 5 * 0.3 = 1.5 → allow 1 wrong. So default **1** wrong could match “70%”. |

---

### Phase 3 — Final exam: max error % and immediate fail

**Goal:** Course has a “max error rate %” for the final exam; after each answer we check if current error rate exceeds it and, if so, fail the attempt immediately (no more questions).

| # | Task | Details |
|---|------|--------|
| 3.1 | **Course certification config** | Add **maxErrorPercent** (number, 0–100). Meaning: “fail as soon as (wrongCount / answeredCount) * 100 > maxErrorPercent”. E.g. 10 = fail once error rate goes above 10%. |
| 3.2 | **Final exam answer API** (`POST .../final-exam/answer`) | After recording the answer: `wrongCount = answeredCount - correctCount`; `errorRate = (wrongCount / answeredCount) * 100`. If `errorRate > course.certification.maxErrorPercent`: set attempt to failed, return `completed: true`, `passed: false`, no `nextQuestion`. Client shows “Failed” and ends exam. |
| 3.3 | **Submit** | When attempt is ended by “immediate fail”, submit might already be called with passed=false, or we mark attempt as GRADED with passed=false in the answer API. Ensure certificate is not issued. |
| 3.4 | **Admin UI** | Course certification settings: “Final exam: max error % (fail immediately if exceeded)”. Optional: keep **passThresholdPercent** for “minimum score to pass if you complete the set” (e.g. for reporting), but the **hard** rule is “fail as soon as error % &gt; maxErrorPercent”. |

---

### Phase 4 — Answer management and UX

**Goal:** Clean, consistent way to record and evaluate answers for both lesson quiz and final exam.

| # | Task | Details |
|---|------|--------|
| 4.1 | **Lesson quiz** | Client sends `{ questionId, selectedIndex }` (index in the 3-option list). Server knows the 3-option order for that request (either stored in session/attempt or recomputed from correct + 2 random wrong). Map selectedIndex → correct/incorrect. |
| 4.2 | **Final exam** | Already per-question; add immediate-fail in answer API as above. Optionally return `errorRate`, `wrongSoFar`, `answeredSoFar` in response for UI (e.g. “2 wrong of 10 answered”). |
| 4.3 | **Analytics** | Keep storing per-question correct/incorrect; optional: store selected option text for analytics. |

---

## 4. Suggested order of delivery

1. **Phase 1** — Question model and “3 options (1 good + 2 random bad)” for lesson quiz and final exam. Delivers the new question shape and display behaviour.
2. **Phase 2** — Course-level “max wrong allowed” for lesson quiz. Delivers rigid/lenient author control.
3. **Phase 3** — Final exam “max error %” and immediate fail. Delivers the “fail as soon as you exceed the %” behaviour.
4. **Phase 4** — Any remaining answer-handling and UX polish (and admin/import for Phase 1 if not done in 1.6).

---

## 5. Config summary (to-be)

| Config | Level | Meaning |
|--------|--------|--------|
| **Lesson quiz** | | |
| questionCount | Lesson (quizConfig) | Number of questions per quiz (e.g. 5). |
| poolSize | Lesson (quizConfig) | Pool size for selection (can be &gt; questionCount). |
| **quizMaxWrongAllowed** | **Course** | Max wrong answers allowed (0–5). Fail if wrong &gt; this. (New.) |
| **Final exam** | | |
| certQuestionCount | Course (certification) | Number of questions in the exam (e.g. 50). |
| **maxErrorPercent** | **Course (certification)** | Fail **immediately** when (wrong/answered)*100 &gt; this. (New.) |
| passThresholdPercent | Course (certification) | Used when student completes the set without early fail (e.g. min score to pass). |

---

## 6. Open decisions

- **Migration:** Migrate existing 4-option questions to “correct + wrongAnswers” or keep two formats indefinitely?
- **Default for quizMaxWrongAllowed:** e.g. 1 (strict) or 2 (allow 2 wrong out of 5)?
- **Default for maxErrorPercent:** e.g. 10 (fail if &gt;10% wrong at any point)?
- **Admin UI:** Where exactly to put “Lesson quiz: max wrong allowed” (course general vs course quiz section) and “Final exam: max error %” (certification block).

Once these are decided, implementation can follow the phases above.
