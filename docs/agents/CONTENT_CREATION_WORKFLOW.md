# Content Creation Workflow for AI Agents

**Purpose:** Rock-solid, agent-friendly workflow that eliminates inconsistent and dummy content  
**Status:** Production-ready foundation for all content generation  
**Last Updated:** 2026-08-05

---

## Executive Summary

This workflow ensures **highest care and quality** for all lesson and quiz content. It is designed to:

1. ✅ **Prevent inconsistent content** through strict validation
2. ✅ **Eliminate dummy/placeholder text** via forbidden pattern detection
3. ✅ **Ensure standalone comprehensibility** for all quiz questions
4. ✅ **Enforce 5W1H structure** for all lessons
5. ✅ **Block recall-only questions** (forbidden by quality gates)
6. ✅ **Validate language integrity** (no English leakage in non-English content)

**Result:** Clean, consistent, high-quality content that supports the progressive course generation strategy.

---

## Quick Reference

### Quality Gates (Must Pass)

| Content Type | Minimum Requirements |
|--------------|---------------------|
| **Lesson** | • Quality score ≥70 (strict) or ≥50 (blocking)<br>• 5W1H structure complete<br>• Named deliverable<br>• 3 exercises (Guided, Independent, Self-check)<br>• Bibliography with sources<br>• 20-30 min reading time<br>• No language leakage |
| **Quiz Question** | • Quality score ≥75 (strict) or ≥60 (blocking)<br>• Standalone comprehensible (no "in this lesson")<br>• Natural scenario language<br>• 1 correct + 3 plausible distractors<br>• NOT recall type (forbidden)<br>• No language leakage<br>• Explanation provided |
| **Quiz Distribution** | • ≥7 valid questions per lesson<br>• ≥5 application/critical-thinking questions<br>• 0 recall questions (forbidden) |

### Forbidden Patterns (Auto-Reject)

**Quiz Questions:**
- ❌ "in this lesson", "today", "Day X", "as mentioned", "in the course", "module"
- ❌ "yesterday", "tomorrow", "next lesson", "previous lesson"
- ❌ "we learned", "you saw", "all of the above", "none of the above"
- ❌ "[TODO]", "[PLACEHOLDER]", "[TBD]", "lorem ipsum", "test question"
- ❌ Administrative openings: "The goal is...", "The main risk is..."

**Lessons:**
- ❌ Placeholder text, dummy content, TODO markers
- ❌ Incomplete sections (missing 5W1H elements)
- ❌ No deliverable named
- ❌ Missing exercises

---

## Step-by-Step Workflow

### Phase 1: Pre-Generation Planning

**Before creating any content:**

1. **Read the standards:**
   ```typescript
   import { REQUIRED_LESSON_SECTIONS, FORBIDDEN_QUIZ_PHRASES } from '@/lib/validators/content-standards';
   ```

2. **Review examples:**
   - See `/workspace/CONTENT_CREATOR_REPOSITORY_KNOWLEDGE.md` Section 5 for lesson structure
   - See Section 5.6 for quiz question examples

3. **Understand the context:**
   - What course? What topic? What day number?
   - What language? (Critical for language integrity checks)
   - What difficulty level?
   - What prerequisite knowledge?

### Phase 2: Lesson Creation

**Follow this exact structure:**

```markdown
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

## When

### Use it when
- [Trigger point]
- [Trigger point]

### Frequency
[One line: daily / weekly / once per setup / per product launch]

### Late signals
- [Symptom that you should have acted earlier]
- [Symptom]

## Why it matters

### Practical benefits
- [Benefit]
- [Benefit]
- [Benefit]

### Risks of ignoring
- [Negative outcome if skipped]
- [Negative outcome]

### Expectations
- Improves: [What gets better]
- Does not guarantee: [What this alone won't achieve]

## How

### Step-by-step method
1. [Action step]
2. [Action step]
3. [Action step]

### Do and don't

**Do**
- [Good practice]
- [Good practice]

**Don't**
- [Anti-pattern to avoid]
- [Anti-pattern to avoid]

### Common mistakes
- [Mistake]: [Why it happens] → [Fix]
- [Mistake]: [Why it happens] → [Fix]

## Guided exercise

[Direct, step-by-step instructions with expected outcome]

**Steps:**
1. [Specific instruction]
2. [Specific instruction]
3. [Specific instruction]

**Expected result:** [What the learner should have]

## Independent exercise

[Task description without step-by-step guidance]

**Your task:** [Clear goal]

**Deliverable:** [What to produce]

**Time:** [Estimated time]

## Self-check

Use this checklist to verify your work:

- [ ] [Observable verification]
- [ ] [Observable verification]
- [ ] [Observable verification]

## Bibliography

**Sources used:**
- [Author]. [Title]. [URL]
- [Author]. [Title]. [URL]

## Read more

**For deeper learning:**
- [Resource title] – [URL] – [Why useful]
- [Resource title] – [URL] – [Why useful]
```

**Validation before submission:**

```typescript
import { validateLesson, enforceLessonQuality } from '@/lib/validators/content-standards';
import { EnforcementLevel } from '@/lib/content-quality/enforcement';

const lesson = {
  lessonId: 'COURSE_ID_L01',
  dayNumber: 1,
  language: 'en',
  title: 'Your Lesson Title',
  content: '...your markdown content...',
  emailSubject: 'Day 1: Your Lesson Title',
  emailBody: '...email markdown...',
  pointsReward: 100,
  xpReward: 50,
  isActive: true,
  displayOrder: 0,
};

// Run enforcement (STRICT mode by default)
const result = enforceLessonQuality(lesson, {
  level: EnforcementLevel.STRICT,
  context: 'agent_generation',
  enforcedBy: 'your-agent-name',
});

if (!result.allowed) {
  console.error('Lesson blocked:', result.enforcement.reason);
  console.error('Errors:', result.validation.errors);
  console.error('Suggestions:', result.enforcement.suggestions);
  // FIX THE ISSUES AND RETRY
} else {
  console.log('✅ Lesson passed quality gates:', result.validation.qualityScore);
  // PROCEED TO SAVE
}
```

### Phase 3: Quiz Question Creation

**Follow this pattern for EVERY question:**

#### ✅ GOOD Example (Standalone, Natural, Scenario-Based)

```markdown
**Question:** A builder says, "My AI app will use GPT-4 and a dashboard." Which revision makes this a product promise with a concrete outcome?

A) "My AI app will use GPT-4 and provide a sleek dashboard for modern teams."
B) "Freelance designers get a 5 minute brief from messy notes so they can send proposals faster."
C) "The app will include templates, automations, and a chat window for users."
D) "We will add more models and more integrations to cover more use cases."

**Correct:** B

**Explanation:** Option B states a clear user (freelance designers), the problem context (messy notes), and the specific outcome (send proposals faster in 5 minutes). The other options focus on features or tech, not user outcomes.

**Difficulty:** EASY
**Type:** application
**Category:** product-strategy
**Hashtags:** #promise #user-outcome #mvp
```

**Why this is good:**
- ✅ Standalone (no "in this lesson")
- ✅ Natural scenario ("A builder says...")
- ✅ Concrete situation and decision
- ✅ One clear correct answer
- ✅ Plausible distractors (not silly)
- ✅ Explanation shows reasoning

#### ❌ BAD Example (Context-Dependent, Administrative)

```markdown
**Question:** In this lesson, we learned about product promises. What is the main goal of defining a product promise?

A) To create a feature list
B) To improve focus and decision speed
C) To guarantee product-market fit
D) All of the above

**Correct:** B
```

**Why this is bad:**
- ❌ "In this lesson" (context-dependent, forbidden)
- ❌ "What is the main goal" (administrative language)
- ❌ No concrete scenario
- ❌ "All of the above" (low-quality pattern)
- ❌ Not standalone comprehensible

**Validation before submission:**

```typescript
import { validateQuizQuestion, enforceQuizQuestionQuality } from '@/lib/validators/content-standards';
import { QuestionDifficulty, QuestionType } from '@/lib/models/quiz-question';
import { EnforcementLevel } from '@/lib/content-quality/enforcement';

const question = {
  uuid: crypto.randomUUID(), // Generate unique ID
  question: 'Your question text here...',
  correctAnswer: 'The correct answer',
  wrongAnswers: [
    'Plausible wrong answer 1',
    'Plausible wrong answer 2',
    'Plausible wrong answer 3',
  ],
  explanation: 'Why the correct answer is right and others are wrong...',
  difficulty: QuestionDifficulty.MEDIUM,
  category: 'product-strategy',
  questionType: QuestionType.APPLICATION, // NOT recall!
  hashtags: ['#promise', '#mvp'],
  isActive: true,
  isCourseSpecific: true,
  lessonId: 'COURSE_ID_L01',
};

// Run enforcement
const result = enforceQuizQuestionQuality(question, {
  level: EnforcementLevel.STRICT,
  context: 'agent_generation',
  enforcedBy: 'your-agent-name',
  expectedLanguage: 'en',
});

if (!result.allowed) {
  console.error('Question blocked:', result.enforcement.reason);
  console.error('Errors:', result.validation.errors);
  console.error('Suggestions:', result.enforcement.suggestions);
  // FIX THE ISSUES AND RETRY
} else {
  console.log('✅ Question passed quality gates:', result.validation.qualityScore);
  // PROCEED TO SAVE
}
```

### Phase 4: Batch Validation (Full Course)

**Before importing a complete course:**

```typescript
import { enforceCourseQuality } from '@/lib/content-quality/enforcement';
import { EnforcementLevel } from '@/lib/content-quality/enforcement';

// Your course data with lessons and embedded quiz questions
const lessons = [
  {
    lessonId: 'COURSE_ID_L01',
    dayNumber: 1,
    title: 'Lesson 1 Title',
    content: '...markdown...',
    // ... other fields
    quizQuestions: [
      // 7+ questions per lesson
      { question: '...', correctAnswer: '...', wrongAnswers: [...], ...},
      // ...
    ],
  },
  // ... 30 lessons total
];

// Run batch enforcement
const batchResult = enforceCourseQuality(lessons, {
  level: EnforcementLevel.STRICT,
  context: 'course_import',
  enforcedBy: 'your-agent-name',
  expectedLanguage: 'en',
});

if (!batchResult.allowed) {
  console.error('Course import BLOCKED');
  console.error('Summary:', batchResult.summary);
  console.error('Recommendations:', batchResult.recommendations);
  
  // Show per-lesson errors
  for (const lesson of batchResult.lessons) {
    if (!lesson.allowed) {
      console.error(`❌ Lesson ${lesson.lessonId}:`, lesson.enforcement.reason);
    }
  }
  
  // Show per-question errors
  for (const [lessonId, questions] of Object.entries(batchResult.questions)) {
    const blocked = questions.filter(q => !q.allowed);
    if (blocked.length > 0) {
      console.error(`❌ Lesson ${lessonId}: ${blocked.length} questions blocked`);
      for (const q of blocked) {
        console.error(`  - ${q.enforcement.reason}`);
      }
    }
  }
  
  // DO NOT PROCEED - FIX ALL ISSUES
} else {
  console.log('✅ Course passed all quality gates');
  console.log('Summary:', batchResult.summary);
  console.log(`Overall Quality Score: ${batchResult.summary.overallQualityScore.toFixed(1)}/100`);
  
  // PROCEED TO IMPORT
}
```

---

## Quality Score Interpretation

| Score Range | Status | Action |
|-------------|--------|--------|
| **90-100** | Excellent | ✅ No action needed |
| **80-89** | Good | ✅ Proceed, consider minor improvements |
| **70-79** | Acceptable | ⚠️ Proceed with warnings, improve in next iteration |
| **60-69** | Poor (Moderate) | ⚠️ Allowed in MODERATE mode, blocked in STRICT |
| **50-59** | Critical (Blocking) | ❌ Always blocked, must fix |
| **0-49** | Failed | ❌ Always blocked, major rework required |

---

## Common Mistakes and Fixes

### Mistake 1: Context-Dependent Quiz Questions

**❌ Bad:**
```
"In today's lesson, we learned about product promises. Which is true?"
```

**✅ Good:**
```
"A builder says, 'My AI app will use GPT-4 and a dashboard.' Which revision makes this a product promise?"
```

**Fix:** Remove all references to "this lesson", "today", "Day X", etc. Create a standalone scenario.

---

### Mistake 2: Administrative Quiz Language

**❌ Bad:**
```
"The goal of defining a product promise is to:"
```

**✅ Good:**
```
"A founder writes, 'Teams save time with our agent.' Which success check is the best binary criterion?"
```

**Fix:** Replace administrative openings with natural scenarios.

---

### Mistake 3: Recall Questions (Forbidden)

**❌ Bad:**
```
"What is a product promise?" (Type: recall)
```

**✅ Good:**
```
"You must choose one promise to keep scope tight. Which best reduces scope drift?" (Type: application)
```

**Fix:** Always use application or critical-thinking types. Test application of knowledge, not memorization.

---

### Mistake 4: Missing Lesson Deliverable

**❌ Bad:**
```
"## Learning goal
You will understand product promises."
```

**✅ Good:**
```
"**Deliverable:** Product Promise and Success Checklist

## Learning goal
You will be able to: **Define a product promise and measurable success criteria for a sellable AI app.**"
```

**Fix:** Always name a concrete artifact the learner will create.

---

### Mistake 5: Incomplete 5W1H Structure

**❌ Bad:**
```
# Lesson 1: Product Promise

[Just some content about promises...]
```

**✅ Good:**
```
# Lesson 1: Product Promise

## Who
**Primary persona:** Digital nomad building a commercial AI app

## What
### What it is
[Definition...]

## Where
### Applies in
[Contexts...]

## When
### Use it when
[Triggers...]

## Why it matters
### Practical benefits
[Benefits...]

## How
### Step-by-step method
[Instructions...]

## Guided exercise
[Exercise...]

## Independent exercise
[Task...]

## Self-check
[Checklist...]

## Bibliography
[Sources...]
```

**Fix:** Use the complete lesson template. All 13 sections are required.

---

### Mistake 6: Silly Distractors

**❌ Bad:**
```
A) This is obviously wrong lol
B) Random nonsense answer 😂
C) Makes no sense at all
D) The correct answer
```

**✅ Good:**
```
A) "My AI app will use GPT-4 and provide a sleek dashboard for modern teams." (feature-focused, not outcome)
B) "Freelance designers get a 5 minute brief from messy notes so they can send proposals faster." (CORRECT: clear user + outcome)
C) "The app will include templates, automations, and a chat window for users." (feature list, no user result)
D) "We will add more models and more integrations to cover more use cases." (expansion, not promise)
```

**Fix:** Make wrong answers plausible. They should be reasonable but incorrect choices.

---

### Mistake 7: English Leakage in Non-English Content

**❌ Bad (Hungarian lesson):**
```
"A termék promise az egy olyan statement, ami defines the user outcome."
```

**✅ Good (Hungarian lesson):**
```
"A termékígéret egy olyan kijelentés, ami meghatározza a felhasználói eredményt."
```

**Fix:** Ensure 100% language integrity. No mixed-language content.

---

## Integration with Import API

The content quality enforcement is **automatically applied** during course imports:

```typescript
// In /app/api/admin/courses/import/route.ts

import { enforceCourseQuality, EnforcementLevel } from '@/lib/content-quality/enforcement';

// During import processing...
const enforcementResult = enforceCourseQuality(lessons, {
  level: EnforcementLevel.STRICT, // Default for new imports
  context: 'api_import',
  enforcedBy: session.user.email,
  expectedLanguage: course.language,
});

if (!enforcementResult.allowed) {
  return NextResponse.json({
    error: 'Course content does not meet quality gates',
    summary: enforcementResult.summary,
    recommendations: enforcementResult.recommendations,
    details: {
      blockedLessons: enforcementResult.lessons.filter(l => !l.allowed).length,
      blockedQuestions: Object.values(enforcementResult.questions).flat().filter(q => !q.allowed).length,
    },
  }, { status: 400 });
}

// Proceed with import...
```

---

## Progressive Course Strategy Integration

This workflow directly supports the progressive course generation strategy:

1. **1-Day Rapid Courses**: Same quality gates, shorter content (adjust estimatedMinutes threshold)
2. **3-Day Intermediate**: Full quality gates apply
3. **7-Day Advanced**: Full quality gates apply
4. **30-Day Mastery**: Full quality gates apply

**Key Point:** Quality standards remain consistent across all course stages. The Trinity pipeline (Drafter → Writer → Judge) from the content creator repository uses these same validation rules.

---

## Agent Checklist

Before generating ANY content:

- [ ] Read this workflow document completely
- [ ] Review forbidden patterns list
- [ ] Understand 5W1H lesson structure
- [ ] Review good/bad quiz question examples
- [ ] Test validation with sample content
- [ ] Run enforcement before submitting

During content generation:

- [ ] Use the exact lesson template
- [ ] Name a concrete deliverable
- [ ] Include all 13 required sections
- [ ] Create 7+ quiz questions per lesson
- [ ] Use application/critical-thinking types (NOT recall)
- [ ] Make questions standalone (no "in this lesson")
- [ ] Use natural scenario language
- [ ] Ensure language integrity (no mixing)
- [ ] Run validation after each piece

Before submission:

- [ ] Run `enforceLessonQuality` for each lesson
- [ ] Run `enforceQuizQuestionQuality` for each question
- [ ] Run `enforceCourseQuality` for complete batch
- [ ] Fix ALL blocked items (quality score ≥70 for lessons, ≥75 for quizzes)
- [ ] Review suggestions and warnings
- [ ] Confirm overall quality score ≥80

---

## Support and References

**Code References:**
- Validation: `/workspace/app/lib/validators/content-standards.ts`
- Enforcement: `/workspace/app/lib/content-quality/enforcement.ts`
- Models: `/workspace/app/lib/models/lesson.ts`, `/workspace/app/lib/models/quiz-question.ts`

**Documentation:**
- Content Creator Knowledge: `/workspace/CONTENT_CREATOR_REPOSITORY_KNOWLEDGE.md`
- Progressive Strategy: `/workspace/docs/product/PROGRESSIVE_COURSE_STRATEGY.md`
- Trinity Architecture: See Content Creator repo `trinity_flow_agent.md`

**Quality Standards:**
- Amanoba Course Content Standard v1.0 (from `amanoba_courses` repo)
- 5W1H structure (required sections)
- Standalone comprehensibility (quiz questions)
- Language integrity (no mixing)

---

## Version History

- **2026-08-05**: Initial rock-solid foundation release
  - Comprehensive validation layer
  - Strict quality enforcement
  - Agent-friendly workflow
  - Integration with import API
  - Support for progressive course strategy

---

**Remember:** This is your ROCK-SOLID FOUNDATION. Follow it exactly, and you will produce consistent, high-quality content that serves learners well and supports the platform's long-term vision. No shortcuts, no exceptions.
