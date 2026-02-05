# AMANOBA COURSE CONTENT STANDARD v1.0 (Markdown-first)

Purpose: A single, enforceable standard for writing lessons and quizzes that are easy to consume, action-driven, measurable, and reusable across contexts.

Scope: Applies to every lesson and every quiz item in any Amanoba course.

Last updated: 2026-02-05

---

## 0) Non-negotiable rules

1) Outcome-first
- Every lesson must produce a named **Deliverable** (an artifact).
- Every lesson must define **Success criteria** as observable checks.
- When possible, every lesson must produce a **Baseline metric** (score, count, pass rate, or a simple rubric).

2) 5W1H completeness
- Every lesson must include: **Who, What, Where, When, Why, How**.
- No missing sections.

3) Action sections required
- Every lesson must include: **Guided exercise**, **Independent exercise**, **Self-check**.

4) Standalone quizzes
- Every quiz question must be related to the lesson’s concepts and skills.
- Quiz questions must be fully understandable and answerable without referencing the lesson, day number, course, module, or internal context.
- Forbidden phrases (examples): “in this lesson”, “today”, “Day X”, “as mentioned above”, “in the course”, “module”, “yesterday/tomorrow” (relative course context).

5) One unambiguous correct answer
- Exactly 1 correct option.
- 3 plausible distractors when authoring (wrong, but not silly). The platform may display 2 of them per question (1 correct + 2 random wrong).
- Avoid “all of the above”, “none of the above”, double negatives, and trick wording.

6) Source hygiene
- **Bibliography** must list all sources actually used to write the lesson, with URLs whenever possible.
- **Read more** must include a URL to read and, if applicable, a URL to buy.

---

## 1) Lesson structure (required elements)

Each lesson must contain the following blocks, in this exact order:

1. Header
2. Learning goal
3. Who
4. What
5. Where
6. When
7. Why it matters
8. How
9. Guided exercise
10. Independent exercise
11. Self-check
12. Bibliography (sources used)
13. Read more (optional deepening)

---

## 2) Lesson template (copy-paste)

Use this template verbatim as the starting point for every lesson.

```md
# Lesson X: [Title]

**One-liner:** [What this unlocks in one sentence.]  
**Time:** [Total time, e.g. 20–30 min]  
**Deliverable:** [Exact artifact name, e.g. "Prompt Baseline Table"]  
**Prerequisite (optional):** [One line, only if needed]

## Learning goal

You will be able to: **[single measurable capability]**

### Success criteria (observable)
- [ ] [Binary check]
- [ ] [Binary check]
- [ ] [Binary check]

### Output you will produce
- **Deliverable:** [Exact deliverable name]
- **Format:** [Table, checklist, short doc, screenshot set]
- **Where saved:** [Folder or doc name]

## Who

**Primary persona:** [Who is doing the work]  
**Secondary persona(s):** [Who is affected]  
**Stakeholders (optional):** [Who should be informed or involved]

## What

### What it is
[1–2 sentences.]

### What it is not
[1 sentence.]

### 2-minute theory
- [Key idea 1]
- [Key idea 2]
- [Key idea 3]

### Key terms
- **Term:** short definition
- **Term:** short definition

## Where

### Applies in
- [Area / touchpoint]
- [Area / touchpoint]

### Does not apply in
- [Non-applicable case]

### Touchpoints
- [e.g. product page]
- [e.g. policy page]
- [e.g. feed / structured data]
- [e.g. internal search / navigation]

## When

### Use it when
- [Trigger point]
- [Trigger point]

### Frequency
[One line: daily / weekly / once per setup / per product launch]

### Late signals
- [Symptom]
- [Symptom]

## Why it matters

### Practical benefits
- [Benefit]
- [Benefit]
- [Benefit]

### Risks of ignoring
- [Risk]
- [Risk]

### Expectations
- Improves: [what realistically improves]
- Does not guarantee: [what it cannot promise]

## How

### Step-by-step method
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]

### Do and don't
**Do**
- [Good practice]
- [Good practice]

**Don't**
- [Bad practice]
- [Bad practice]

### Common mistakes and fixes
- **Mistake:** [Fix]
- **Mistake:** [Fix]

### Done when
- [ ] [Binary completion check]
- [ ] [Binary completion check]
- [ ] [Binary completion check]

## Guided exercise (10–15 min)

### Inputs
- [What must be open/available]

### Steps
1. [Step]
2. [Step]
3. [Step]

### Output format
| Field | Value |
|---|---|
| Item | |
| Expected outcome | |
| Result | |
| Notes | |

## Independent exercise (5–10 min)

### Task
[Small variation of guided exercise.]

### Output
[Same format as guided exercise.]

## Self-check (yes/no)

- [ ] [Binary]
- [ ] [Binary]
- [ ] [Binary]
- [ ] [Binary]

### Baseline metric (recommended)
- **Score:** [e.g. 9/15]
- **Date:** [YYYY-MM-DD]
- **Tool used:** [e.g. ChatGPT, Copilot, Gemini]

## Bibliography (sources used)

1. **[Title]**. [Publisher/Author]. [Date].  
   Read: https://...

2. **[Title]**. [Publisher/Author]. [Date].  
   Read: https://...

## Read more (optional)

1. **[Title]**  
   Why: [One line reason.]  
   Read: https://...  
   Buy (optional): https://...

2. **[Title]**  
   Why: [One line reason.]  
   Read: https://...  
   Buy (optional): https://...
```

---

## 3) Visual formatting rules (Markdown, enforced)

These rules exist to maximise completion rate and reduce cognitive load.

### 3.1 Headings
- Use only these heading levels: `#`, `##`, `###`.
- Keep the section order exactly as defined in this standard.
- Do not introduce new top-level sections. Put additions inside existing sections.

### 3.2 Paragraph length
- Max 3 lines per paragraph.
- Prefer bullets over long prose.

### 3.3 Emphasis
- Use `**bold**` for labels and key terms only.
- Do not bold full paragraphs.

### 3.4 Tables and callouts
- Exactly 1 table per lesson (normally inside Guided exercise).
- Exactly 1 callout per lesson, using one of these formats:

```md
> **Pro tip:** [One sentence.]
```

```md
> **Common mistake:** [One sentence.]
```

### 3.5 Checklists
- All checklists must be binary using `- [ ]`.
- “Done when” must contain only observable checks.

### 3.6 Examples
Use the “Do and don't” format exactly:

```md
### Do and don't

**Do**
- [Good]

**Don't**
- [Bad]
```

### 3.7 Source hygiene formatting
- Bibliography must include a **Read** URL whenever possible.
- Read more must include a **Read** URL and a **Buy** URL if applicable.
- If “Buy” is not available, omit the line.

---

## 4) Lesson scoring rubric (quality gate)

Score each category 0 to 5. Total max 40.

Pass criteria:
- Total score >= 32/40
- No category below 3

| Category | 0 (Fail) | 3 (Acceptable) | 5 (Excellent) |
|---|---|---|---|
| Clarity | confusing, vague | mostly clear | crystal clear, minimal ambiguity |
| Actionability | no real task | some task | deliverable + steps, easy to follow |
| Measurability | no checks | partial checks | binary checks + baseline metric |
| 5W1H integrity | missing sections | present but weak | each section adds distinct value |
| Relevance | generic | partly specific | tightly mapped to the topic + audience |
| Example quality | none/trivial | ok | realistic do/don't pairs |
| Exercise design | busywork | decent | time-boxed, compounding, reusable artifact |
| Source hygiene | no sources | some sources | all used sources listed with URLs |

Reviewer rule:
- Reject if any section is missing, even if the score is high.

---

## 5) Quiz standard (rules + blueprint)

### 5.1 Quiz rules (enforced)

1) Lesson-related
- Each question must assess a concept or skill taught in the lesson.

2) Standalone
- The question must not refer to any lesson, day, module, course, or internal context.
- The question must be answerable by a person who did not read the course, as long as they understand the topic.

3) Options
- **Authoring:** Minimum 4 options (1 correct + at least 3 plausible distractors). Distractors must be wrong but realistic.
- **Platform display:** The platform shows 3 options per question (1 correct + 2 randomly chosen distractors, order shuffled). Author at least 4 so the system can choose fairly.
- Exactly 1 correct option.

4) Language quality
- No trick wording.
- No “all of the above” or “none of the above”.
- Avoid double negatives.
- Avoid vague qualifiers (“usually”, “often”) unless the lesson explicitly taught nuance and the question is testing that nuance.

5) Content hygiene
- Do not require knowledge of Amanoba, internal tool names, or internal URLs.
- Do not require remembering phrases that only exist in the lesson text.
- Do not reference “as discussed earlier”.

### 5.2 Quiz set blueprint (minimum 7 questions per lesson)

Use this fixed mix for consistency. Each lesson should have **at least 7** questions. The platform uses **lesson.quizConfig.questionCount** per lesson (default 5) for how many are shown per quiz; set **quizConfig.poolSize** to at least 7 so the pool meets this minimum.

1. Definition check (1)
2. Disambiguation between similar concepts (1)
3. Application scenario (2)
4. Do vs don't decision (1)
5. Error spotting / diagnosis (1)
6. Metric or success criteria (1)

### 5.3 Authoring format (human-readable)

Use letters for stable review and an explicit answer key.

```md
**Question:** [Standalone question]

A) [Option]
B) [Option]
C) [Option]
D) [Option]

**Correct:** [A/B/C/D]

**Why correct:** [1–2 sentences]
**Why others are wrong:**
- A: [1 line]
- B: [1 line]
- C: [1 line]
- D: [1 line]

**Tags:** #topic #platform #difficulty-easy|medium|hard #type-definition|scenario|metric|error
```

Important:
- “Correct” must always be present (A/B/C/D). Import/authoring tools may convert this to platform storage (correctAnswer + wrongAnswers or options + correctIndex).

### 5.4 Data model requirement (to allow shuffling safely)

Correctness must be stored independent of display order so that shuffling does not break grading.

**Platform implementation (Amanoba):**
- **Storage:** Each question stores either (a) legacy: `options` (string[], minimum 4 items) + `correctIndex` (0 to options.length−1), or (b) preferred: `correctAnswer` (string) + `wrongAnswers` (string[], at least 2). Both formats are supported; export/import round-trip `correctAnswer` and `wrongAnswers`.
- **Display:** At request time the platform builds 3 options (1 correct + 2 random wrong from the 3 distractors, or from `wrongAnswers`) and shuffles their order. For each question/attempt it stores the **correct index in display order** (e.g. `correctIndexInDisplay`) so grading uses `selectedIndex === correctIndexInDisplay` (no reliance on A/B/C/D position).
- **Grading:** Lesson quiz can accept either `selectedIndex` (with stored display order) or `selectedOption` (the chosen option text); final exam uses `selectedIndex` against the stored correct display index.

Alternative pattern (for reference only): store options with stable `optionId` and `correctOptionId`; Amanoba uses answer text / display-index instead.

---

## 6) Reviewer checklist (fast approval)

A lesson is ready to publish only if all are true:

- [ ] Deliverable is explicitly named in the header and repeated in Learning goal.
- [ ] Success criteria are binary and observable.
- [ ] All 5W1H sections exist and are non-empty.
- [ ] How section has a numbered method and at least 2 do/don't bullets.
- [ ] Guided exercise includes exactly one table.
- [ ] Independent exercise is a small variation, not a repeat.
- [ ] Self-check is yes/no and includes a baseline metric when possible.
- [ ] Bibliography lists all used sources with Read URLs when possible.
- [ ] Read more includes Read URLs and Buy URLs where applicable.
- [ ] Quiz has at least 7 questions per lesson (minimum); platform uses lesson.quizConfig.questionCount for how many are shown (default 5).
- [ ] Each quiz question is authored with minimum 4 options (1 correct + at least 3 distractors) and exactly 1 correct answer; the platform may display 3 options per question.
- [ ] No quiz question references the lesson, day, module, or course.

---

## 7) Platform implementation notes (technical alignment)

These notes align this content standard with the Amanoba codebase. No authoring change required; they describe how the platform implements the standard.

- **Lesson and email content:** Stored and exchanged as **Markdown** (see `docs/COURSE_PACKAGE_FORMAT.md`). Display and email render via the app’s content layer.
- **Quiz question storage:** Supports (a) legacy: `options` (minimum 4 strings) + `correctIndex` (0 to options.length−1), (b) preferred: `correctAnswer` (string) + `wrongAnswers` (string[], ≥2). Export/import include `correctAnswer` and `wrongAnswers` when present.
- **Quiz display:** 3 options per question (1 correct + 2 random wrong, shuffled). Lesson quiz and final exam both use this behaviour; grading is by correct answer value or by stored correct display index.
- **Lesson quiz:** Pass/fail uses either course **quizMaxWrongAllowed** (max wrong answers allowed) or lesson **successThreshold** (%). Number of questions per lesson is **quizConfig.questionCount** (default 5); **quizConfig.poolSize** is the pool size for selection.
- **Final exam:** Course-level **certification.maxErrorPercent** can trigger immediate fail when current error rate exceeds the threshold.
- **Metadata:** Quiz questions support **hashtags** (e.g. `#topic #difficulty-easy #type-definition`) and **questionType** (e.g. recall, application, critical-thinking) for filtering and analytics.

End of document.
