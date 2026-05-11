# Quiz Answer Explanation Pilot

## Context

Amanoba issue `#771` asks for mistake-aware answer explanations that teach, rather than only report correct or incorrect status. The first implementation must stay narrow, grounded in course content, and cheap to operate.

## Pilot scope

The first rollout is limited to lesson quizzes inside the main learner course flow:

- surface: `app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx`
- trigger: only after an incorrect answer
- content source: author-supplied `QuizQuestion.explanation`, with a bounded question-type hint fallback when no authored explanation exists

Out of scope:

- full chat tutoring
- explanations after every correct answer
- generic AI-generated paragraphs for all questions
- support for non-lesson quiz surfaces in the first release

## Product rule

The learner should stay in the quiz flow. Feedback should clarify the mistake immediately, reveal the correct answer, and point back to the relevant concept without sending the learner into a separate chat or modal workflow.

## Learner workflow

1. The learner answers a lesson quiz question.
2. If the answer is correct, Amanoba shows the existing positive feedback and continues.
3. If the answer is incorrect, Amanoba shows:
   - the existing supportive retry feedback
   - the correct answer
   - an optional explanation block
4. The learner remains in the lesson quiz sequence or returns to the lesson retry path under the existing course quiz policy.

## Content contract

Each lesson quiz question may now include an optional `explanation` field.

Authoring guidance:

- Keep it short.
- Explain why the correct answer is right or what concept the learner should review.
- Tie the explanation to the lesson concept, not to generic test-taking advice.

When `explanation` is missing, Amanoba may fall back to a short question-type hint for supported `questionType` values. If neither authored content nor a supported fallback exists, the learner still sees the correct answer but no fabricated explanation text.

## Why this rollout

This pilot is intentionally small because it creates a clear, teachable moment at the point of failure while avoiding the two main risks in `#771`:

- low-quality AI text that sounds helpful but is not grounded
- expensive broad inference across all learner answers

## Verification

- Confirm `QuizQuestion` supports optional `explanation`
- Confirm admin lesson quiz authoring can create and update `explanation`
- Confirm import/export preserves `explanation`
- Confirm lesson quiz submit returns `correctAnswer` and `explanation` on incorrect answers
- Confirm the learner quiz page renders the explanation block only after incorrect answers

## Rollback

- Remove `explanation` support from the lesson quiz admin and import/export paths
- Remove explanation rendering from the learner lesson quiz page
- Remove this pilot doc and the corresponding handover entry
