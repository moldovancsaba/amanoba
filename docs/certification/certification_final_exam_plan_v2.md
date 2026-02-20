# certification_final_exam_plan.md
Last updated: 2026-01-21

## 0) Objective

Deliver a unified, premium-gated final exam and certificate flow for Amanoba courses.

A learner earns a certificate by:
1) completing the course requirements,
2) purchasing certification access (or having it included in a premium course),
3) passing a final exam built from the course question bank.

The certificate must display the learner's score percent and be verifiable via a shareable link. The certificate can be set Public or Private by the learner.

## 1) High-level user experience

### 1.1 Course list status and CTA chips (English, final wording set)
The course list must display a single status chip and zero or one CTA button.

States:
- **In progress**
- **Completed**
- **Completed, certificate available**
- **Certification unlocked**
- **Certified**
- **Certification unavailable**
- **Certification revoked**

CTA buttons:
- **Get certificate**
- **Start final exam**
- **View certificate**

Rules:
- When course requirements are met and certification is available but not purchased, show:
  - Chip: **Completed, certificate available**
  - CTA: **Get certificate**
- After certification purchase, before passing final exam:
  - Chip: **Certification unlocked**
  - CTA: **Start final exam**
- After passing final exam:
  - Chip: **Certified**
  - CTA: **View certificate**
- If a user later retakes and their most recent score becomes 50% or lower:
  - Chip: **Certification revoked**
  - CTA: **Get certificate**
  - Previously issued certificate becomes invalid (verification page shows revoked state)

### 1.2 Paywall placement (premium gating)
- Certification is always a premium service for free courses.
- The final exam is not accessible unless certification access is owned:
  - purchased with money, or
  - redeemed with points, or
  - included in a premium course.

Paywall placement:
- The upsell is shown after the user completes the course:
  - CTA: **Get certificate**
  - The user must purchase to unlock the final exam.

## 2) Final exam rules

### 2.1 Question pool
- Final exam attempt contains **50 unique questions** randomly selected from the course’s certification pool.
- The certification pool is derived from the 30-day master course pool (minimum 150 questions):
  - 30 lessons × minimum 5 questions each = minimum 150 questions.
- Shorter courses (7-day etc.) still use the **full master pool** (not limited to selected lessons).

If a course does not have a valid certification pool:
- Chip: **Certification unavailable**
- Helper text: **Certification unavailable. Contact the course creator.**
- No purchase and no final exam available.

### 2.2 Randomization
Each attempt must randomize:
- selected questions (random subset of 50)
- question order
- answer option order (for option-based question types)

### 2.3 Attempt lifecycle (strict, one sitting)
- The attempt must be completed in one sitting.
- If the learner leaves the exam (navigate away, close tab/app, session expires), the attempt is discarded.
- Discarded attempts do not produce a score and do not affect certification status.
- Starting again generates a new random attempt.

### 2.4 UX behavior
The final exam must follow the same core interaction pattern as lesson quizzes:
- one question visible at a time
- immediate feedback after answering
- continue through all 50 questions

Fail feedback:
- show a list of wrong questions (question titles or short stems)
- do not reveal the correct answers

Pass feedback:
- show score percent (integer)
- certificate becomes available immediately once grading is final

Important: the final exam must not kick the learner back into lesson content on each wrong answer. Lesson remediation behavior, if any, is reserved for lessons, not for the final exam.

## 3) Scoring and pass rules

### 3.1 Pass threshold
- Pass if `scorePercent > 50` (strictly greater than 50%).

### 3.2 Scoring method
- Equal weight per question.
- `scorePercentRaw = (correctCount / 50) * 100`

### 3.3 Rounding
- Display rounding: nearest integer.
  - 50.4 → 50
  - 50.5 → 51

### 3.4 Certificate score policy
- Certificate score is always the **most recent final exam attempt score**.
- If a new attempt produces a lower score, the displayed certificate score decreases.
- If the most recent score is 50% or lower, certification is revoked (see section 1.1).

## 4) Question types and grading

Requirement: final exam must support the same question types as the platform quiz system, now and in the future.

To keep this safe and consistent:
- The final exam uses the same grading pipeline as lesson quizzes.
- If future question types require delayed grading (manual review or asynchronous grading), then:
  - an attempt can enter a **PENDING_GRADE** state
  - certificate issuance/update happens only when the attempt is fully graded

## 5) Certificate integration

### 5.1 Certificate outputs
When certified, generate and store:
- PDF certificate
- share image suitable for LinkedIn link previews
- verification page

The score percent must appear on:
- the certificate share image
- the verification page
- optionally on the PDF (recommended for consistency, but must at least be on image + page)

### 5.2 LinkedIn share image
Generate a 1.91:1 image for link preview sharing.
Recommended size:
- 1200×627

### 5.3 Verification page
- Public URL format: `/certificate/{verificationSlug}`
- Page displays:
  - recipient name (as stored at issuance time)
  - course title (snapshot)
  - credential title
  - score percent
  - issue date
  - status: VALID or REVOKED
  - certificate id/number

### 5.4 Public vs Private
The learner can toggle a certificate:
- Public: anyone with the link can view
- Private: only the learner (authenticated) can view

If Private:
- return 404 to anonymous users (avoid disclosing existence)

## 6) Purchases and entitlement

### 6.1 Entitlement rule
A learner may start the final exam only if `CertificateEntitlement.entitled === true`.

Entitlement sources:
- PAID (money)
- POINTS (redeemed)
- INCLUDED_IN_PREMIUM (premium course includes certification)

### 6.2 Pricing rules
- Each course has its own certification price and points cost.
- Premium courses set entitlement automatically (no additional purchase UI).

## 7) Settings: one place setup

### 7.1 Global defaults (required)
Store global defaults in a single configuration location.

Fields:
- finalExamEnabledByDefault: boolean
- questionCount: number (default 50)
- passPercentExclusive: number (default 50)
- scoreRounding: "NEAREST_INTEGER"
- randomizeQuestionSelection: boolean (true)
- randomizeQuestionOrder: boolean (true)
- randomizeAnswerOrder: boolean (true)
- attemptMustBeOneSitting: boolean (true)
- discardAttemptOnLeave: boolean (true)
- showWrongQuestionsOnFail: boolean (true)
- showCorrectAnswersOnFail: boolean (false)
- certificateScorePolicy: "MOST_RECENT_ATTEMPT"
- revokeCertificationAtOrBelowPercent: number (50)
- shareImageSize: "1200x627"
- verificationPrivacyMode: "USER_CHOICE"
- paywallEnabled: boolean (true)
- paywallCopy:
  - title
  - helper
  - legalNote (optional)

### 7.2 Per-course configuration (required)
Even if you keep logic "done is better than perfect", pricing must be per course, so a minimal per-course config is required.

Fields:
- certificationEnabled: boolean
- certificationPoolCourseId: string (reference to the master pool source)
- certificationPrice:
  - currency
  - amount
- certificationPointsCost: number
- premiumIncludesCertification: boolean
- credentialId: string (e.g. AAE)
- templateId: string (certificate design template)
- copyOverrides:
  - courseListChipCompleted: string
  - courseListChipCertificateAvailable: string
  - courseListChipCertificationUnlocked: string
  - courseListChipCertified: string
  - courseListChipCertificationRevoked: string
  - ctaGetCertificate: string
  - ctaStartFinalExam: string
  - ctaViewCertificate: string
  - finalExamIntroTitle: string
  - finalExamIntroBody: string
  - passMessage: string
  - failMessage: string
  - revokedMessage: string

## 8) Data model (developer-facing)

### 8.1 FinalExamAttempt
Stores a complete audit of what the learner saw and answered.

Fields:
- attemptId (UUID)
- playerId
- courseId
- entitlementSource ("PAID" | "POINTS" | "INCLUDED_IN_PREMIUM")
- questionIds[50]
- questionOrder[50]
- answerOrderByQuestion (only for option-based types)
- answers[]
- correctCount
- scorePercentRaw
- scorePercentInteger
- status ("IN_PROGRESS" | "SUBMITTED" | "PENDING_GRADE" | "GRADED" | "DISCARDED")
- passed (boolean)
- startedAtISO
- submittedAtISO (optional)
- discardedAtISO (optional)
- discardReason (optional)

### 8.2 CertificateEntitlement
Fields:
- playerId
- courseId
- entitled (boolean)
- source ("PAID" | "POINTS" | "INCLUDED_IN_PREMIUM")
- pricePaid (optional)
- pointsSpent (optional)
- entitledAtISO

### 8.3 Certificate (additions to existing plan)
Ensure Certificate includes:
- finalExamScorePercentInteger
- lastAttemptId
- isPublic (boolean)
- isRevoked (boolean)
- revokedAtISO (optional)
- revokedReason (optional)

## 9) API contracts

### 9.1 Entitlement
- POST /api/certification/entitlement/purchase
- POST /api/certification/entitlement/redeem-points
- GET  /api/certification/entitlement?courseId=...

### 9.2 Final exam
- POST /api/certification/final-exam/start?courseId=...
  - validate entitlement
  - create attempt with random questionIds and shuffles
  - return attemptId + first question payload

- POST /api/certification/final-exam/answer
  - store answer and return correctness + next question payload

- POST /api/certification/final-exam/submit
  - compute score if auto-gradable, else set PENDING_GRADE
  - once graded:
    - if scorePercentInteger > 50: certify and generate/update certificate assets
    - else: fail and revoke if previously certified and scorePercentInteger <= 50

- POST /api/certification/final-exam/discard
  - mark attempt DISCARDED (server enforcement is preferred)

### 9.3 Certificate
- GET /api/certificates/{certificateId}/render?format=pdf|png&variant=share_1200x627
- GET /certificate/{verificationSlug}

## 10) Edge cases and enforcement rules

- Discarded attempts must not modify certificate state.
- Only SUBMITTED or GRADED attempts can modify certificate state.
- If the learner is already certified and passes again, certificate remains valid and score updates to most recent.
- If the learner is certified and fails with 50% or lower, certification is revoked and the verification page shows REVOKED.
- If certificate is Private, public access returns 404.

## 11) Roadmap items (captured)
- Weighted selection across lessons and modules
- Excluding practice-only questions
- Question weights and difficulty balancing
- Cooldowns and attempt limits
- More certificate fields (time spent, attempt number, course version)
- More verification page display controls and privacy policies

