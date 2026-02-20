# certification_final_exam_plan_v5.md
Last updated: 2026-01-21

This is the developer delivery plan for the Amanoba Certification system: premium gating, final exam, certificate issuance, score display, verification, revocation, and unified configuration.

## 1. Scope and outcomes

### 1.1 What we are building
A certification layer on top of existing course quizzes:

1. A learner completes a course.
2. The learner can optionally purchase certification access (money or points) unless certification is included in the course.
3. The learner takes a final certification exam (50 questions).
4. If passed, a certificate is issued and shows the achieved score percent.
5. The learner can retake any time; the certificate always reflects the most recent attempt score.
6. If the most recent score is 50% or below, certification is revoked.

### 1.2 What “complete” means for V1
V1 includes:
- premium gating (money or points, or included)
- 50-question randomized final exam
- strict pass condition > 50%
- score shown on certificate image and verification page
- public/private toggle for each certificate
- most recent attempt score wins (can decrease)
- revocation at 50% or below
- unified configuration (global defaults + minimal per-course settings)
- automated tests and logging

V1 does not include (explicit roadmap):
- cooldowns
- attempt limits
- weighted selection by lesson
- difficulty balancing
- proctoring
- manual review workflows

## 2. Non-negotiable business rules

### 2.1 Premium gating and entitlement
1. Certification is always a premium service for free courses.
2. A user cannot start the final exam without entitlement.
3. Entitlement can be granted by:
   - payment with money
   - redemption with points
   - included in a premium course (no separate purchase)
4. Pricing is per course (each course certification has its own money price and points price).
5. Premium courses include certification cost by default. The learner still must finish the course before taking the final exam.

### 2.2 Course completion requirement
1. A user cannot start the final exam unless the course is completed.
2. After completing a course, the UI shows a “Get certificate” upsell option if certification is enabled and the pool is valid.

### 2.3 Certification pool rules
Definitions:
- Certification Pool: the question set used to generate final exams.
- Master Pool: the 30-day course question pool.

Rules:
1. Master pool target is minimum 150 questions.
   - 30 lessons
   - minimum 5 questions per lesson
   - expected total: 150+
2. Certification exam question count is always 50 unique questions.
3. Shorter courses also use the master pool as their certification pool.
4. If certification pool is missing or invalid, certification is unavailable and the UI shows:
   - “Certification unavailable. Contact the course creator.”

### 2.3.1 Child courses (short/rapid variants)
For child courses (courses with `parentCourseId` and `certification.certQuestionCount`):

1. **Question count**: The final exam uses at most `certQuestionCount` questions drawn at random from the parent course's certification pool (the same pool as the 30-day parent).
2. **Pool**: The pool is the parent's pool; the child does not define its own question set.
3. **Pass rule**: The same as for full exams: pass if `scorePercentInteger` is strictly greater than 50 (§2.7). The score is computed as (correctCount / number_of_questions_in_this_exam) × 100, rounded to the nearest integer. So for a 10-question child exam, passing means more than 5 correct (e.g. 6+).
4. **Certificate**: When the pass rule is met, a certificate is issued for the **child** course (child's `courseId`). Revocation and "most recent wins" (§2.8) apply to that child certificate.

This keeps child certification consistent with the main plan while allowing shorter exams (e.g. Essentials with fewer questions).

### 2.4 What happens if the pool has fewer than 50 questions
This is explicitly defined for V1 to remove ambiguity:

- If poolCount < 50:
  1. Certification is unavailable for that course.
  2. Disable purchase and disable points redemption for certification.
  3. Disable final exam start.
  4. Show the fallback message: “Certification unavailable. Contact the course creator.”

Rationale: the exam requires 50 unique questions, and random selection cannot produce 50 unique items from fewer than 50. Item banks that pull random subsets require the bank to exceed the subset size. citeturn0search9turn0search15turn0search19

### 2.5 Randomization and integrity requirements
Every exam attempt must randomize:
1. which 50 questions are selected (random subset)
2. question order
3. answer option order when supported by the question type

Randomization from a bank and shuffling questions and answers is standard practice for online quizzes to limit answer sharing and memorisation patterns. citeturn0search9turn0search15turn0search19

### 2.6 One-sitting attempt policy
V1 rule:
1. A final exam attempt is one sitting only.
2. If the user leaves the exam (tab close, navigation away, app close, session loss), the attempt is discarded.
3. A discarded attempt does not generate a grade and does not affect certification state.
4. The user must start a new attempt from the beginning.

### 2.7 Scoring and pass condition
1. Each attempt consists of 50 questions.
2. Score percent raw:
   - scorePercentRaw = (correctCount / 50) * 100
3. Displayed score percent:
   - scorePercentInteger = nearest integer rounding of scorePercentRaw
4. Pass condition:
   - pass if scorePercentInteger is strictly greater than 50
   - fail if scorePercentInteger is 50 or below

### 2.8 Retakes and “most recent wins”
1. Retakes are allowed any time in V1.
2. The certificate score always reflects the most recent graded attempt score.
3. If the most recent score is lower than previous, the certificate score must decrease accordingly.
4. If the most recent score becomes 50 or below, certification is revoked.

### 2.9 Where the score must appear
Score percent must be visible in two places:
1. On the certificate image
2. On the certificate verification page

### 2.10 Public and private
1. The user can set each certificate to Public or Private.
2. Public certificate has a shareable verification URL.
3. Private certificates must not be accessible to anonymous users.
4. Verification links are a common pattern used by large credential platforms (example: Coursera). citeturn0search1turn0search4
5. Optional standards alignment (future): Open Badges describes hosted verification data patterns. citeturn0search2turn0search21

## 3. UX specification

### 3.1 Course list chips (English)
Required chips:
- In progress
- Completed
- Completed, certificate available
- Certification unlocked
- Certified
- Certification unavailable
- Certification revoked

### 3.2 CTAs (English)
- Get certificate
- Start final exam
- View certificate

### 3.3 Deterministic UI state machine
Inputs per user and course:
- courseCompleted: boolean
- certificationEnabled: boolean
- poolCount: number
- entitlementOwned: boolean
- mostRecentScorePercentInteger: number|null

Derived state rules:
1. If courseCompleted = false:
   - Chip: In progress
   - CTA: none
2. If courseCompleted = true AND certificationEnabled = true AND poolCount >= 50 AND entitlementOwned = false:
   - Chip: Completed, certificate available
   - CTA: Get certificate
3. If courseCompleted = true AND certificationEnabled = true AND poolCount >= 50 AND entitlementOwned = true AND mostRecentScorePercentInteger is null:
   - Chip: Certification unlocked
   - CTA: Start final exam
4. If mostRecentScorePercentInteger > 50:
   - Chip: Certified
   - CTA: View certificate
5. If mostRecentScorePercentInteger <= 50 AND mostRecentScorePercentInteger is not null:
   - Chip: Certification revoked
   - CTA: Start final exam
6. If certificationEnabled = false OR poolCount < 50:
   - Chip: Certification unavailable
   - CTA: none
   - Optional helper text: Certification unavailable. Contact the course creator.

## 4. Unified configuration model

### 4.1 Global defaults
Store in a single place, similar to global default thumbnails.

Required keys:
- examQuestionCount: 50
- passPercentExclusive: 50
- rounding: NEAREST_INTEGER
- randomizeSelection: true
- randomizeQuestionOrder: true
- randomizeAnswerOrder: true
- oneSittingOnly: true
- discardOnLeave: true
- retakesEnabled: true
- certificateScorePolicy: MOST_RECENT_ATTEMPT
- revokeAtOrBelowPercent: 50
- showWrongQuestionListOnFail: true
- showCorrectAnswersOnFail: false
- verificationPrivacyMode: USER_CHOICE
- shareImageFormat: LINKEDIN_1200x627

LinkedIn link preview guidance commonly uses 1.91:1 and 1200×627 for the preview image. citeturn0search0turn0search6

### 4.2 Per-course settings (minimum required in V1)
Required keys per course:
- certificationEnabled: boolean
- certificationPoolCourseId: string (master pool reference)
- certificationPriceMoney: { currency, amount }
- certificationPricePoints: number
- premiumIncludesCertification: boolean
- certificateTemplateId: string
- credentialTitleId: string (example: AAE)

## 5. Data model requirements

### 5.1 CertificateEntitlement
Purpose: gate exam access.

Uniqueness:
- unique(playerId, courseId)

Fields:
- id
- playerId
- courseId
- source: PAID | POINTS | INCLUDED_IN_PREMIUM
- money: { currency, amount } optional
- pointsSpent: number optional
- entitledAtISO: string

### 5.2 FinalExamAttempt
Purpose: store the attempt, the selected questions, and grading.

Fields:
- id
- playerId
- courseId
- poolCourseId
- selectedQuestionIds: string[50]
- questionOrder: string[50]
- answerOrderByQuestion: object optional
- answers: array
- correctCount: number
- scorePercentRaw: number
- scorePercentInteger: number
- status: IN_PROGRESS | GRADED | DISCARDED | PENDING_GRADE
- passed: boolean
- startedAtISO: string
- gradedAtISO: string optional
- discardedAtISO: string optional
- discardReason: string optional

### 5.3 Certificate
Purpose: renderable credential plus verification.

Fields:
- id
- playerId
- courseId
- credentialTitleId
- templateId
- finalExamScorePercentInteger
- lastAttemptId
- issuedAtISO
- isPublic
- isRevoked
- revokedAtISO optional
- revokedReason optional
- verificationSlug (stable identifier used for public verification URL)

## 6. Backend delivery checklist (action items)

### 6.1 Pool validation
Action:
- implement a server-side validator that can compute poolCount for a course’s certification pool reference.
Acceptance:
- returns correct count
- treats poolCount < 50 as certification unavailable (section 2.4)

### 6.2 Entitlement endpoints
1. GET entitlement status
   - GET /api/certification/entitlement?courseId=...
   - Response includes:
     - certificationEnabled
     - poolCount
     - entitlementOwned
     - prices (money and points)
     - premiumIncludesCertification
   Acceptance:
   - scoped to current user

2. Create entitlement via payment
   - POST /api/certification/entitlement/purchase
   Inputs:
   - courseId
   - paymentReference
   Acceptance:
   - idempotent (no duplicates)
   - cannot purchase if certification unavailable

3. Create entitlement via points
   - POST /api/certification/entitlement/redeem-points
   Inputs:
   - courseId
   Acceptance:
   - atomic points deduction
   - cannot redeem if certification unavailable

4. Auto-entitlement for premium courses
   - when premiumIncludesCertification = true and user has access, entitlement is granted with source INCLUDED_IN_PREMIUM
   Acceptance:
   - entitlementOwned becomes true without purchase

### 6.3 Final exam endpoints
5. Start attempt
   - POST /api/certification/final-exam/start?courseId=...
   Server checks:
   - course completed
   - certification enabled
   - poolCount >= 50
   - entitlement owned
   Server creates:
   - random subset of 50 unique questions
   - randomized order
   - answer option shuffle maps where applicable
   - attempt status IN_PROGRESS
   Returns:
   - attemptId and first question payload
   Acceptance:
   - always 50 unique question IDs
   - cannot start without entitlement

6. Answer question
   - POST /api/certification/final-exam/answer
   Inputs:
   - attemptId
   - questionId
   - answer payload
   Server:
   - validates membership in selectedQuestionIds
   - grades immediately when possible
   - returns correctness and next question
   Acceptance:
   - cannot answer after DISCARDED or GRADED

7. Submit attempt
   - POST /api/certification/final-exam/submit
   Server:
   - finalises correctCount
   - computes scorePercentRaw
   - rounds to scorePercentInteger
   - sets passed if scorePercentInteger > 50
   - sets status GRADED
   - updates certificate state:
     - if passed: issue or update certificate score to this most recent attempt
     - if fail (<= 50): revoke certificate if previously certified, and set score to most recent attempt
   Acceptance:
   - certificate always matches the most recent attempt score

8. Discard attempt
   - POST /api/certification/final-exam/discard
   Trigger:
   - client on leave
   Server:
   - sets status DISCARDED
   - does not update certificate
   Acceptance:
   - discarded attempt does not affect certification state

### 6.4 Certificate endpoints
9. Render certificate asset
   - GET /api/certificates/{certificateId}/render?format=png|pdf&variant=linkedin_1200x627
   Acceptance:
   - image includes score percent
   - revoked certificates have revoked visual label

10. Verification endpoint
   - GET /api/certificates/verify/{verificationSlug}
   Acceptance:
   - public returns certificate details and score percent and revoked state
   - private returns 404 to anonymous

## 7. Frontend delivery checklist (action items)

1. Course list UI
   - implement chips and CTAs exactly as in section 3
   - integrate entitlement status API
   Acceptance:
   - correct chip and CTA appears in all states

2. Get certificate upsell flow
   - modal or page that displays price (money and points)
   - blocks purchase if poolCount < 50
   Acceptance:
   - no route or UI path allows starting exam without entitlement

3. Final exam UI
   - one question at a time
   - immediate feedback
   - leaving discards attempt and forces restart
   Acceptance:
   - leaving cannot resume the same attempt

4. Result UI
   - shows scorePercentInteger
   - pass and fail messages
   - fail: show wrong question list, do not show correct answers
   - pass: show View certificate CTA

5. Certificate page
   - shows certificate image and score
   - public/private toggle
   - share link copy for public

6. Public verification page
   - displays score
   - displays revoked state clearly
   - blocks if private

## 8. Rendering and LinkedIn requirements

### 8.1 Image size
Default certificate share image output:
- 1200 × 627
- ratio 1.91:1

This aligns with LinkedIn link preview guidance. citeturn0search0turn0search6

### 8.2 Required render layers
- learner name
- credential title
- course title
- issue date
- score percent
- verification URL or short code
- revoked label when revoked

## 9. Tests (must ship with V1)

### 9.1 Unit tests
- poolCount < 50 returns certification unavailable
- random selection yields 50 unique questions
- rounding nearest integer is correct
- pass strictly > 50
- discard attempt does not change certificate

### 9.2 Integration tests
- completed course, no entitlement -> paywall -> purchase -> start -> pass -> certificate issued
- completed course, entitlement -> fail -> no certificate or revoked state if previously certified
- certified -> retake -> lower score <= 50 -> revoked
- private certificate verify -> anonymous receives 404
- short course -> uses master pool and still yields 50 questions

## 10. Observability and audit logging (minimum)

Log server-side events:
- entitlement created (source, courseId)
- points redemption (pointsSpent)
- attempt started (attemptId, poolCount)
- attempt discarded (reason)
- attempt graded (score and pass/fail)
- certificate issued or updated (score)
- certificate revoked (score)
- privacy toggled (public/private)

## 11. Explicit roadmap backlog
Track these as future tickets (not V1):
- cooldown between attempts
- daily attempt limits
- weighted distribution by lesson coverage
- difficulty tiers and adaptive selection
- per-course overrides for all global defaults
- proctoring features
- Open Badges packaging and hosted JSON badge metadata alignment citeturn0search2turn0search21
