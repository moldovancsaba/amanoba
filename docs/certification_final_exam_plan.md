# certification_final_exam_plan.md
Last updated: 2026-01-21

## Scope

Implement a premium-gated **Final Certification Exam** for Amanoba courses that:

- Draws **50 random questions** from the course’s underlying question pool.
- Shuffles **question order** and **answer option order** (when applicable).
- Requires a **score strictly greater than 50%** to pass.
- Shows the **integer score percentage** on the certificate image and on a public verification page.
- Allows **unlimited retakes**.
- Uses the **most recent attempt score** as the certificate score (dynamic and can go down).
- Centralises settings via **global defaults**, with future roadmap for per-course overrides.

## Business Rules

### Premium gating
- For free courses, certification is an **upsell**. User must **purchase certificate access** (or spend points) to unlock the final exam.
- For premium courses, certificate cost is **included**. The user is entitled to the final exam without extra payment.
- Pricing is **per course** (each certification has its own price).

### Participation restriction
- If the user has not purchased certificate access, they **cannot start** the final exam.
- After finishing the course, the course list shows:
  - Status chip: **Completed**
  - CTA button: **Get certificate**
- After purchase but before passing:
  - Status chip: **Certification unlocked**
  - CTA button: **Start final exam**
- After passing:
  - Status chip: **Certified**
  - Secondary text: **Score: {scorePercent}%**
- If the user later retakes and falls to 50% or below:
  - Certification is **revoked**
  - Status chip returns to: **Completed**
  - CTA button returns to: **Get certificate**
  - Previously generated certificate becomes invalid (verification page shows revoked state).

## Course pool assumptions

### Question pool requirements
- The master 30-day course contains at least **150 questions** (30 lessons × 5 questions minimum).
- Shorter courses (7 days etc.) draw from the **full master pool** (same 150+ questions), even if some lessons are not included in the shorter course.
- If a course does not have a valid pool for certification:
  - Certification is unavailable and the UI shows: **Certification unavailable. Contact the course creator.**

## Exam Behaviour

### Attempt lifecycle (strict)
- The exam attempt must be completed in **one sitting**.
- If the user leaves the final exam (close tab, navigate away, session expires), the attempt is **discarded** and they must start a new attempt from the beginning.

### Question selection
- Each exam attempt selects **50 unique questions** from the pool.
- Selection is random per attempt.
- Questions are shown **one at a time**.
- Answer options are shuffled per question where the question type supports options.

### Exam UX
Same UX as lesson quizzes:
- One question visible at a time.
- Immediate feedback after each answer.
- If correct: continue to next question.
- If incorrect: show as wrong and allow the attempt to continue.
- After the final question, show:
  - Final score percentage (integer)
  - Pass or fail result
  - If failed: show the list of wrong questions (titles only), without revealing correct answers.
  - If passed: certificate issuance or update and show access actions

### Passing rule
- Pass if `scorePercent > 50`.
- `scorePercentRaw` is computed as:
  - `correctCount / 50 * 100`
- Display rounding:
  - **Nearest integer** (standard rounding)
  - Example: 50.4 → 50, 50.5 → 51

## Retakes and Score Policy

- Retakes are allowed **any time** (no cooldown, no limit).
- The certificate score is always the **most recent attempt score**.
- If a user retakes and gets a lower score, the certificate score must **decrease** accordingly.
- If a user retakes and the score becomes **50% or lower**, certification is **revoked** (see Participation restriction).
- Exam questions and order are always randomised on each attempt.

## Certificate and Verification Output

### Certificate assets
- Certificate outputs include:
  - Certificate PDF
  - Certificate share image for social (LinkedIn-friendly)
- The score must appear on:
  - the certificate share image
  - the public verification page
- The certificate assets must be regenerated whenever the most recent attempt score changes.

### Public verification page
- URL format:
  - `/certificate/{verificationSlug}`
- Privacy control:
  - User can set certificate to **Public** or **Private**.
  - If Private:
    - verification page requires authentication and ownership.
  - If Public:
    - anyone with the link can view.

### LinkedIn share format
- Generate a share image in a 1.91:1 ratio, recommended size:
  - 1200×627

## Settings Architecture

### Global defaults (required)
Store global defaults in a single configuration location (similar to global default thumbnails).

Required settings:
- `enabledByDefault`
- `questionCount` (default 50)
- `passPercentExclusive` (default 50, strict greater-than)
- `shuffleQuestions` (true)
- `shuffleAnswers` (true)
- `scoreRounding` ("NEAREST_INTEGER")
- `attemptMustBeOneSitting` (true)
- `discardAttemptOnLeave` (true)
- `examUxMode` ("LESSON_STYLE_ONE_BY_ONE")
- `showWrongQuestionsOnFail` (true)
- `showCorrectAnswersOnFail` (false)
- `certificateScorePolicy` ("MOST_RECENT_ATTEMPT")
- `revokeCertificationAtOrBelowPercent` (50)
- `premiumGatingMode` ("REQUIRE_PURCHASE_FOR_EXAM")
- `shareImageSize` ("1200x627")
- `verificationPrivacyMode` ("USER_CHOICE")
- `certificatePublicFields` ("recipientName, courseTitle, scorePercent, issuedDate, certificateId")

### Per-course overrides (roadmap)
Support per-course overrides later. All settings should be overrideable:
- pricing (money and points)
- questionCount
- passPercentExclusive
- pool source strategy
- copy strings for CTA and chips
- certificate template choice and credential title choice

## Data Model

### Entities

1) `FinalExamAttempt`
Stores the frozen question set, order, and scoring for an attempt.

Suggested fields:
- `attemptId`
- `playerId`
- `courseId`
- `questionIds[]` (exact 50 chosen)
- `questionOrder[]` (indexes)
- `answerOrderByQuestion` (for option shuffling, when needed)
- `answers[]`
- `correctCount`
- `scorePercentRaw`
- `scorePercentInteger`
- `passed` (boolean)
- `startedAtISO`
- `submittedAtISO`
- `isDiscarded` (boolean)
- `discardReason` (string, optional)

2) `CertificateEntitlement`
Proof that the learner purchased certificate access for a course.

Fields:
- `playerId`
- `courseId`
- `entitled` (boolean)
- `source` ("PAID" | "POINTS" | "INCLUDED_IN_PREMIUM")
- `pricePaid` (optional)
- `pointsSpent` (optional)
- `entitledAtISO`

3) `Certificate`
The issued certificate record (see certificate_dev_plan.md).
Add or ensure:
- `finalExamScorePercentInteger`
- `lastAttemptId`
- `isPublic` (user choice)
- `isRevoked` (boolean)
- `revokedAtISO` (optional)
- `revokedReason` (optional)

## API Contracts

### Entitlement
- `POST /api/certificates/entitlement/purchase`
- `POST /api/certificates/entitlement/redeem-points`
- `GET /api/certificates/entitlement?courseId=...`

### Final exam attempts
- `POST /api/final-exam/start?courseId=...`
  - Validates entitlement.
  - Builds a random set of 50 questions.
  - Returns attempt id and first question payload.

- `POST /api/final-exam/answer`
  - Saves answer, returns correctness and next question (or end screen).

- `POST /api/final-exam/submit`
  - Finalises scoring and pass/fail.
  - If passed: issues or updates certificate.
  - If failed: leaves certificate locked or revokes if previously certified and score <= 50.

- `POST /api/final-exam/discard`
  - Marks an attempt discarded due to leave or timeout (server-side enforcement preferred).

### Certificate retrieval
- `GET /api/certificates/{certificateId}/render?format=pdf|png&variant=share_1200x627`
- `GET /certificate/{verificationSlug}`

## UI Copy (initial, English)

### Course list chips
- Completed
- Certification unlocked
- Certified
- Certification unavailable

### CTAs
- Get certificate
- Start final exam
- View certificate
- Share certificate

### Paywall copy
- Title: Unlock your certificate
- Helper: Purchase certification to start the final exam.

### Result copy
- Fail: You did not pass yet. Review the course and try again.
- Pass: You passed. Your certificate is ready.
- Revoked: Certification revoked due to a new score at or below 50%.

## Roadmap Items (explicit)
- Weighted or structured selection across lessons (distribution constraints)
- Excluding practice-only questions
- Question weights and category weights
- Cooldown and attempt limits
- Per-course overrides for all final exam settings
- Additional certificate fields (time spent, attempt number, course version, etc.)
- Expanded verification page fields and privacy controls
