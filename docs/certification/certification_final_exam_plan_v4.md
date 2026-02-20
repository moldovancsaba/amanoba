# certification_final_exam_plan_v4.md
Last updated: 2026-01-21

## Read-me first

You asked me to read the shared ChatGPT conversation and produce a complete, implementation-ready plan.

I attempted to open the share URL, but it is currently behind a login wall and only shows the generic ChatGPT landing header, so I cannot see the underlying chat content from that link. citeturn0view0

This plan therefore consolidates everything that is explicitly present in this current thread, including your numbered decisions, and turns it into a full delivery action list with rules, acceptance criteria, tests, and a decision ledger.

If you paste the missing clarification-question list (or export text), I will produce v5 that includes a complete Q-to-decision mapping with zero ambiguity.

## 0) System goal

Implement a premium-gated certification layer on top of courses:

- Learner finishes a course.
- Learner optionally purchases certification access (money or points), or it is included in a premium course.
- Learner takes a final certification exam built from the course question pool.
- If they pass, a certificate is issued that displays the score percent.
- Learner can retake any time; the most recent score is authoritative and can reduce the displayed score.
- If the most recent score becomes 50% or below, certification is revoked.

## 1) Confirmed rules (authoritative)

### 1.1 Premium gating and upsell
1. Certification is a premium service even for free courses.
2. The final exam is inaccessible without certification entitlement (payment or points).
3. Premium courses include certification cost by default (entitlement is granted automatically).
4. Each certification is priced per course (money price and points price).

### 1.2 Course eligibility and course list UX
1. A user cannot participate in the final exam unless they completed the course and purchased entitlement.
2. After finishing a course, the course list shows a CTA to Get certificate as an upsell option.
3. After certification is achieved, course list must reflect it (see chips in section 3).

### 1.3 Final exam composition
1. Final exam contains 50 questions in random order.
2. Each attempt is randomized and different:
   - random selection from the pool
   - randomized question order
   - randomized answer option order when applicable
3. Question pool is the master 30-day pool:
   - minimum 150 questions (30 lessons × at least 5 questions each)
4. Shorter courses use the same master pool for certification.
5. If certification is not available due to missing pool, the user sees:
   - No certificate available. Contact the course creator.

### 1.4 Passing and scoring
1. Pass condition is strictly greater than 50%.
2. Score is calculated as correctCount / 50 * 100.
3. Score display rounding is nearest integer.
4. The certificate shows the score percent.
5. The certificate score is always the most recent attempt score:
   - if the new score is lower, it replaces the old score (it can go down).

### 1.5 Retakes and revocation
1. Retakes are allowed any time.
2. If the most recent score becomes 50% or lower, certification is revoked.
3. Revocation affects:
   - the certificate status and verification page
   - course list chip text

### 1.6 Attempt lifecycle
1. If the user leaves the exam, they must start over from the beginning.
2. The system should treat leave as a discarded attempt (no grade is committed).

### 1.7 Public/Private
1. User can choose Public or Private for the certificate.
2. Public certificate has a shareable verification page.
3. Private certificate must not be visible to anonymous users.

### 1.8 Where the score must appear
Score percent must be shown on:
- the certificate image
- the public verification page

### 1.9 Question types
The final exam must support the same question types as the lesson quiz system (now and future), using the same grading pipeline.

## 2) External reference constraints (implementation guidance)

### 2.1 LinkedIn share image format
For link-share preview images, LinkedIn recommends a 1.91:1 ratio, typically 1200×627. citeturn1search0turn1search3

### 2.2 Question banks, random subsets, shuffling
Randomly pulling subsets from item banks and shuffling questions and answers is a widely used best practice in online quizzes to reduce answer-sharing and pattern memorization. citeturn1search1turn1search4turn1search19

### 2.3 Verification URLs
Shareable verification URLs are a common certificate credibility mechanism, used by large platforms such as Coursera. citeturn1search2turn1search5turn1search11

## 3) UI state machine (must be deterministic)

### 3.1 Course list chips (English)
Required chip values:
- In progress
- Completed
- Completed, certificate available
- Certification unlocked
- Certified
- Certification unavailable
- Certification revoked

### 3.2 Course list CTAs (English)
- Get certificate
- Start final exam
- View certificate

### 3.3 State mapping rules
Inputs required:
- courseCompletion: boolean
- certificationEnabled: boolean
- poolAvailable: boolean
- entitlementOwned: boolean
- mostRecentExamScorePercentInteger: number|null

Derived state rules:
1. If not completed:
   - Chip: In progress
   - CTA: none
2. If completed AND certification enabled AND pool available AND entitlement not owned:
   - Chip: Completed, certificate available
   - CTA: Get certificate
3. If completed AND entitlement owned AND mostRecentExamScorePercentInteger is null:
   - Chip: Certification unlocked
   - CTA: Start final exam
4. If mostRecentExamScorePercentInteger > 50:
   - Chip: Certified
   - CTA: View certificate
5. If mostRecentExamScorePercentInteger <= 50 AND mostRecentExamScorePercentInteger is not null:
   - Chip: Certification revoked
   - CTA: Start final exam
6. If certification disabled OR pool not available:
   - Chip: Certification unavailable
   - CTA: none

## 4) Configuration architecture (one place setup)

### 4.1 Global defaults (required)
Central location, similar to global thumbnail defaults.

Required keys:
- questionCount = 50
- passPercentExclusive = 50
- rounding = NEAREST_INTEGER
- randomizeSelection = true
- randomizeQuestionOrder = true
- randomizeAnswerOrder = true
- discardOnLeave = true
- retakesEnabled = true
- certificateScorePolicy = MOST_RECENT_ATTEMPT
- revokeAtOrBelowPercent = 50
- showWrongQuestionListOnFail = true
- showCorrectAnswersOnFail = false
- verificationPrivacyMode = USER_CHOICE
- shareImageSize = 1200x627

### 4.2 Per-course settings (minimum required)
Must exist because pricing is per course.

Required keys per course:
- certificationEnabled: boolean
- certificationPoolCourseId: string (master pool source)
- certificationPriceMoney: {currency, amount}
- certificationPricePoints: number
- premiumIncludesCertification: boolean
- certificateTemplateId: string
- credentialTitleId: string (example: AAE, Amanoba-Accredited Expert)

## 5) Data model (implementation requirement)

### 5.1 CertificateEntitlement
Unique: (playerId, courseId)

Fields:
- id
- playerId
- courseId
- entitled: boolean
- source: PAID | POINTS | INCLUDED_IN_PREMIUM
- money: {currency, amount} optional
- pointsSpent optional
- entitledAtISO

### 5.2 FinalExamAttempt
Stores exact attempt contents.

Fields:
- id
- playerId
- courseId
- questionIds[50]
- questionOrder[50]
- answerOrderByQuestion optional
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

### 5.3 Certificate
Fields required (add if missing):
- certificateId
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
- verificationSlug

## 6) API delivery checklist (action items with acceptance)

### 6.1 Entitlement
1. GET entitlement
   - GET /api/certification/entitlement?courseId=...
   - Acceptance:
     - returns correct entitlement and pricing for current user only

2. Purchase entitlement (money)
   - POST /api/certification/entitlement/purchase
   - Acceptance:
     - idempotent
     - cannot double purchase
     - records source=PAID

3. Purchase entitlement (points)
   - POST /api/certification/entitlement/redeem-points
   - Acceptance:
     - atomic points deduction
     - records source=POINTS

4. Auto-entitlement for premium courses
   - server sets source=INCLUDED_IN_PREMIUM when user gains access to premium course
   - Acceptance:
     - premium users see Start final exam without purchase

### 6.2 Final exam
5. Start exam attempt
   - POST /api/certification/final-exam/start?courseId=...
   - Server checks:
     - course completed
     - certification enabled
     - pool available
     - entitlement owned
   - Server does:
     - select 50 unique questions randomly
     - create shuffles
     - store attempt as IN_PROGRESS
   - Returns: attemptId + first question payload
   - Acceptance:
     - cannot start without entitlement
     - questionIds always unique and length 50

6. Answer question
   - POST /api/certification/final-exam/answer
   - Acceptance:
     - validates questionId belongs to attempt
     - returns correctness + next question
     - cannot answer after discard/submit

7. Submit exam attempt
   - POST /api/certification/final-exam/submit
   - Acceptance:
     - scorePercentInteger uses nearest integer rounding
     - pass if strictly > 50
     - updates certificate if pass
     - revokes certificate if score is 50 or lower

8. Discard attempt
   - POST /api/certification/final-exam/discard
   - Triggered when user leaves.
   - Acceptance:
     - attempt becomes DISCARDED
     - no score committed
     - certification state unchanged

### 6.3 Certificate and verification
9. Render certificate assets
   - GET /api/certificates/{certificateId}/render?format=pdf|png&variant=share_1200x627
   - Acceptance:
     - share image includes score percent
     - PDF generation works

10. Verification data endpoint
   - GET /api/certificates/verify/{verificationSlug}
   - Acceptance:
     - public cert returns data with score percent and status
     - private cert returns 404 to anonymous users

## 7) Frontend delivery checklist (action items)

1. Course list updates
   - Implement chips and CTA mapping in section 3.
   - Acceptance:
     - all state transitions reflect correctly after API refresh

2. Get certificate upsell screen
   - Shows price (money and points) for that course.
   - Enforces entitlement flow.
   - Acceptance:
     - user cannot access exam without entitlement

3. Final exam screen
   - One question at a time
   - Immediate feedback
   - Leave triggers discard
   - Acceptance:
     - leave always forces restart

4. Results screen
   - Shows score percent integer
   - Shows pass or fail
   - On fail: list wrong questions, no correct answers
   - On pass: View certificate

5. Certificate page
   - Shows certificate image + score
   - Public/Private toggle
   - Share link copy

6. Public verification page
   - Shows status VALID or REVOKED and score percent
   - If revoked, shows clear Revoked state
   - If private, blocks access

## 8) Certificate rendering checklist (action items)

1. Add score percent layer to share image template
2. Add score percent display to verification page
3. Add revoked overlay or watermark to share image (only when revoked)
4. Ensure template and logo are used without modifying logo colors
5. Ensure share image output is 1200×627

## 9) Automated tests (must ship with V1)

### 9.1 Unit tests
- random selection produces 50 unique questionIds
- rounding nearest integer is correct
- pass strictly > 50
- entitlement required to start attempt
- discard does not change certificate

### 9.2 Integration tests
- free course completed -> Get certificate -> pay -> exam -> pass -> certificate
- free course completed -> Get certificate -> pay -> exam -> fail -> no certificate
- certified -> retake -> score drops to 50 or below -> revoked
- private cert -> anonymous verify returns 404
- short course -> exam uses master pool and yields 50 questions

## 10) Observability and audit logs (minimum)
Log events server-side:
- entitlement created
- entitlement redeemed with points
- attempt started
- attempt discarded
- attempt graded (score and pass/fail)
- certificate issued or updated
- certificate revoked
- certificate privacy changed

## 11) Decision ledger (from your numbered replies)

The following is what I can reconstruct only from your answers, without the original question text.

### Ledger A: Your 1..21 list
- 2: certification is premium, buy with money or points
- 3: certification exam draws randomly from the 150 question pool; fallback is no certificate available, contact course creator
- 8: pass is strictly > 50%
- 13: if new score is lower than previous, the certificate score must be lowered
- 14: show score percent on certificate image and on public certificate page
- 16: any quiz question type supported now or in future
- 17: managed the same way as all quizzes now and future
- 18: global defaults exist, with fallback like default thumbnails; per-course overrides are future roadmap

Items 1,4,5,6,7,9,10,11,12,15,19,20,21 cannot be mapped without the original question text, because A/B/C is ambiguous by itself.

### Ledger B: Your later 1..7 list
- 1: upsell option at end of free courses to be certified
- 3: user cannot participate in final exam without payment; course list must reflect completion and certification status; exam participation is gated
- 5: final exam uses the same quiz management and grading approach as lesson quizzes
- 7: user can set Public or Private

### Ledger C: Your final 1..3 list
- 2: if user leaves, they must start over (one sitting only)
- 1 and 3 cannot be mapped without the original question text

## 12) What is missing for a truly complete plan


To produce a final v5 that includes the multiple dozen clarifications with zero ambiguity, I need either:
- the plain text list of the questions, or
- a screenshot export, or
- a copy-paste of that section.

Once provided, I will:
- add a full Q-to-decision mapping
- add explicit delivery actions for every decision
- remove the cannot be mapped lines completely
