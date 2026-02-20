# certification_final_exam_plan_v3.md
Last updated: 2026-01-21

This document is the implementation-ready delivery plan for the Amanoba Certification system upgrade:
- Premium-gated certification entitlement (money or points, or included in premium)
- Final Certification Exam (50 questions from the certification pool)
- Certificate issuance and revocation based on the most recent attempt
- Public/Private verification page
- Unified configuration (global defaults + minimal per-course config)

## 1) Non-negotiable rules (must implement exactly)

### 1.1 Eligibility and gating
1. A user can only start the Final Certification Exam if they have a valid **Certificate Entitlement** for that course:
   - purchased with money, or
   - redeemed with points, or
   - included in a premium course (no separate purchase).
2. Certification is always a premium service for free courses (upsell at end of course).
3. A course can have certification disabled; in that case there is no purchase CTA.

### 1.2 Question pool and selection
1. Each Final Certification Exam attempt consists of **50 unique questions**.
2. Every attempt pulls questions from the **certification pool** tied to the course.
3. The certification pool is sourced from the master 30-day pool (minimum **150 questions**, 30 lessons × 5 minimum).
4. Shorter courses also use the **master pool** as their certification pool (not only the selected lessons).
5. If a course does not have a valid certification pool:
   - user sees “Certification unavailable. Contact the course creator.”
   - purchase is disabled
   - exam is disabled

### 1.3 Randomization and integrity
1. Every attempt must randomize:
   - which 50 questions are selected (random subset)
   - question order
   - answer option order (only when the question type supports it)
2. One-question-at-a-time delivery is mandatory (same pattern as lesson quizzes).
Rationale is standard online test integrity practice (question banks + random subsets + shuffling). citeturn0search1turn0search5turn0search17

### 1.4 One-sitting attempt policy
1. Final exam attempts are **one sitting only**.
2. If the user leaves (navigation away, close app/tab, session expiry), the attempt is discarded.
3. A discarded attempt:
   - does not generate a score
   - does not affect certification state
4. The user can start again immediately; the new attempt is newly randomized.

### 1.5 Pass/fail and scoring
1. Pass threshold is **strictly greater than 50%**:
   - `pass = scorePercent > 50`
2. Scoring:
   - `scorePercentRaw = (correctCount / 50) * 100`
3. Display percent is **nearest integer**:
   - 50.4 → 50
   - 50.5 → 51

### 1.6 Retakes, “most recent wins”, and revocation
1. Retakes are allowed any time (no cooldown, no limit in V1).
2. The certificate score is always the **most recent attempt score**.
3. If a user retakes and their score decreases, the certificate score must decrease accordingly.
4. If the most recent score is **50% or lower**, certification is **revoked**:
   - status changes to revoked
   - verification page shows revoked state
   - the course status chip must no longer show “Certified”

### 1.7 Certificate display requirements
1. The certificate must show the user’s **score percent** in two places:
   - on the certificate share image
   - on the certificate public verification page
2. The user can set each certificate **Public** or **Private**.
3. Private certificates must not be viewable by anonymous users.

Verification links are a common credential pattern (e.g., Coursera’s shareable certificate URLs, and Open Badges hosted verification). citeturn0search2turn0search6turn0search3turn0search7

### 1.8 LinkedIn share image
The share image must be optimized for LinkedIn link preview: 1.91:1, typically 1200×627. citeturn0search0turn0search4

## 2) Required UI copy (English) and state machine

### 2.1 Course list chips
Exact state chips to implement (V1):
- In progress
- Completed
- Completed, certificate available
- Certification unlocked
- Certified
- Certification unavailable
- Certification revoked

### 2.2 CTA buttons
- Get certificate
- Start final exam
- View certificate

### 2.3 Rules mapping
1. If course not completed:
   - Chip: In progress
   - CTA: none
2. If course completed and certification enabled but entitlement not owned:
   - Chip: Completed, certificate available
   - CTA: Get certificate
3. If entitlement owned and exam not yet passed (or revoked):
   - Chip: Certification unlocked (or Certification revoked)
   - CTA: Start final exam
4. If most recent attempt passed:
   - Chip: Certified
   - CTA: View certificate

## 3) Configuration model (one-place setup)

### 3.1 Global defaults (required)
Store in one global config, similar to global default thumbnails.

Required fields:
- enabledByDefault: boolean
- questionCount: 50
- passPercentExclusive: 50
- rounding: NEAREST_INTEGER
- randomizeSelection: true
- randomizeQuestionOrder: true
- randomizeAnswerOrder: true
- oneSittingOnly: true
- discardOnLeave: true
- showWrongQuestionListOnFail: true
- showCorrectAnswersOnFail: false
- certificateScorePolicy: MOST_RECENT_ATTEMPT
- revokeAtOrBelowPercent: 50
- shareImage: 1200x627
- verificationPrivacyMode: USER_CHOICE

### 3.2 Per-course certification settings (minimum required in V1)
Per course:
- certificationEnabled: boolean
- certificationPoolCourseId: string (master pool reference)
- certificationPriceMoney: {currency, amount}
- certificationPricePoints: number
- premiumIncludesCertification: boolean
- certificateTemplateId: string
- credentialTitleId: string (example: AAE)
- copyOverrides (optional, V1 can use global copy):
  - chip/cta labels

## 4) Data model changes (V1)

### 4.1 CertificateEntitlement
Purpose: unlock final exam participation for a course.

Fields:
- id
- playerId
- courseId
- entitled: boolean
- source: PAID | POINTS | INCLUDED_IN_PREMIUM
- money: {currency, amount} optional
- pointsSpent optional
- entitledAtISO

Unique constraint:
- (playerId, courseId) unique

### 4.2 FinalExamAttempt
Purpose: capture the exact attempt, including which questions were selected.

Fields:
- id
- playerId
- courseId
- questionIds[50]
- questionOrder[50]
- answerOrderByQuestion (optional)
- answers[]
- correctCount
- scorePercentRaw
- scorePercentInteger
- status: IN_PROGRESS | SUBMITTED | GRADED | DISCARDED | PENDING_GRADE
- passed boolean
- startedAtISO
- submittedAtISO optional
- discardedAtISO optional
- discardReason optional

### 4.3 Certificate additions
Fields to ensure:
- finalExamScorePercentInteger
- lastAttemptId
- isPublic
- isRevoked
- revokedAtISO optional
- revokedReason optional

## 5) API delivery checklist (action items)

### 5.1 Entitlement APIs
1. GET entitlement status
   - `GET /api/certification/entitlement?courseId=...`
   - Returns: entitled true/false, entitlement source, price info, included info
   - Acceptance: matches database, no leakage across users

2. Purchase with money
   - `POST /api/certification/entitlement/purchase`
   - Inputs: courseId, payment reference
   - Acceptance: idempotent, cannot double-purchase, records source=PAID

3. Redeem with points
   - `POST /api/certification/entitlement/redeem-points`
   - Inputs: courseId
   - Acceptance: atomic points deduction, entitlement created source=POINTS

### 5.2 Final exam APIs
4. Start attempt
   - `POST /api/certification/final-exam/start?courseId=...`
   - Server must:
     - verify course completed
     - verify entitlement
     - verify certification enabled + pool exists
     - generate random 50 unique questions
     - generate question order + answer order maps
     - store attempt IN_PROGRESS
   - Returns: attemptId + first question payload
   - Acceptance: cannot start without entitlement, always returns randomized set

5. Answer question
   - `POST /api/certification/final-exam/answer`
   - Inputs: attemptId, questionId, answer payload
   - Server must:
     - validate attempt IN_PROGRESS
     - validate questionId belongs to attempt
     - grade immediately if possible
     - store answer
     - return correctness + next question payload (or end-of-exam marker)
   - Acceptance: cannot answer after submit/discard

6. Submit attempt
   - `POST /api/certification/final-exam/submit`
   - Server must:
     - finalize scoring
     - round to nearest integer
     - set passed = score > 50
     - set status GRADED (or PENDING_GRADE for future types)
     - update certification state:
       - if passed: issue/update certificate with score
       - if not passed and score <= 50: revoke if previously certified
   - Acceptance: certificate score always matches most recent graded attempt

7. Discard attempt
   - `POST /api/certification/final-exam/discard`
   - Inputs: attemptId, reason
   - Server must:
     - set status DISCARDED
   - Acceptance: discarded attempts do not affect certification state

### 5.3 Certificate APIs
8. Render certificate
   - `GET /api/certificates/{certificateId}/render?format=pdf|png&variant=share_1200x627`
   - Acceptance: share image includes score percent

9. Verification page data
   - `GET /api/certificates/verify/{verificationSlug}`
   - Acceptance:
     - public cert returns full view model
     - private cert returns 404 to anonymous

## 6) Frontend delivery checklist (action items)

1. Course list UI
   - implement the state machine in section 2
   - show exact chip and CTA based on API state
   - Acceptance: every state renders correctly with correct CTA

2. Paywall modal/page
   - invoked from Get certificate CTA
   - allows money purchase or points redeem (if points enabled)
   - on success: refresh entitlement state and show Start final exam
   - Acceptance: user cannot bypass to exam without entitlement

3. Final exam screen
   - one question at a time
   - immediate feedback
   - next question navigation controlled by API response
   - leaving the screen triggers discard
   - Acceptance: discard works, cannot resume, must restart

4. Result screen
   - show score percent integer
   - pass/fail message
   - if fail: show wrong question list (no correct answers)
   - if pass: show View certificate CTA

5. Certificate page
   - shows the certificate share image and details
   - toggle Public/Private
   - copy share link if public

6. Public verification page
   - renders certificate details + score percent
   - shows revoked state clearly
   - if private: 404 for anonymous

## 7) Certificate rendering checklist (action items)

1. Add score percent layer to certificate template renderer
2. Add revoked watermark/label for revoked certificates
3. Ensure share image uses LinkedIn 1200×627 layout
4. Ensure logo is not color-modified (existing rule)
5. Acceptance:
   - share image includes score percent
   - revoked certificate is visually distinct
   - verification page matches status

## 8) Quality gates (tests to implement)

### 8.1 Unit tests
- selection produces 50 unique questions
- pass strictly > 50
- rounding nearest integer
- entitlement required to start
- discard attempt does not change certificate

### 8.2 Integration tests
- free course: completed -> paywall -> entitlement -> exam -> pass -> certificate
- free course: completed -> paywall -> entitlement -> exam -> fail -> no certificate
- certified -> retake -> score drops <= 50 -> revoked -> verification shows revoked
- private cert -> anonymous verify returns 404
- short course -> uses master pool, still produces 50 questions

### 8.3 Regression tests
- lesson quizzes unaffected
- points wallet atomicity for redemption
- certificate rendering stable under multiple attempts

## 9) Logging and observability (minimum required)
Log these events (server-side):
- entitlement created (source, courseId)
- final exam attempt started (attemptId, pool size)
- attempt discarded (reason)
- attempt graded (score, passed)
- certificate issued/updated
- certificate revoked
- public/private toggle changed

## 10) Roadmap items (explicitly parked)
- per-course override of all exam knobs (beyond pricing)
- cooldowns
- attempt limits
- weighted question distribution across lessons
- question difficulty balancing
- manual review question types (PENDING_GRADE flows)
- richer certificate metadata
