# Certification System with Final Exam

**Date**: 2026-01-23  
**Status**: 🚧 IN PROGRESS (entitlement + final exam implemented; certificate verification and admin tooling ongoing)  
**Priority**: HIGH  
**Estimated**: 5-7 days  
**Related Documents**: `docs/FEATURES_SINCE_F20C34A_COMPLETE_DOCUMENTATION copy.md` (Section 1)

---

## Overview

Complete certification system that allows learners to purchase certification access, take a 50-question randomized final exam, and receive certificates with scores. Includes premium gating, unlimited retakes, and certificate revocation on fail.

---

## Current Progress (2026-01-24)

- ✅ **Phases 1-3** (models, entitlement, exam flow) have been executed: the backend now enforces course completion, entitlement ownership, pool availability, randomized selection, scoring, revocation, and certificate creation.
- ✅ **CS4: Profile Certificates Tab** – Added `/api/profile/[playerId]/certificates`, the profile tab UI, share link copy, and PNG download actions for learners to manage their credentials.
- 🚀 **Phase 4** now exposes `/api/certificates/[slug]` (GET + PATCH) with privacy controls, the on-demand `/api/certificates/[certificateId]/render` generator, and the public verification experience at `app/[locale]/certificate/[slug]/page.tsx`.
- ✅ **CS5 (Partial)** – `/api/admin/certificates` and `/api/admin/certification/analytics` endpoints are live; analytics aggregates certificate counts, pass/fail attempts, and entitlement breakdowns.
- ❌ **Phase 5** (admin dashboards/settings, analytics, achievement ties, asset storage) remains pending, though `/api/admin/certificates` is now live (see “Next Actions” below and Section 1 of `docs/FEATURES_SINCE_F20C34A_COMPLETE_DOCUMENTATION copy.md` for the remaining checklist).

## Next Actions

1. **Finalize asset pipeline (CS2)** – Stabilize CDN/storage handling for rendered certificate PNG/PDF assets and ensure admin exports expose those URLs.
2. **Complete admin certification surface (CS5)** – Ship the remaining endpoints (`/api/admin/certification/pools`, `/api/admin/certification/settings`) and the associated admin pages (analytics, pools, settings) to give teams complete auditing/control.
3. **Achievement & variant integration (CS6/CS7)** – Record issuance events in the achievements feed and implement score-band recommendations for short-course variants before moving to the broader transformation backlog.

---

## Feature Breakdown

### Phase 1: Database Models & Core Utilities (Day 1-2)

**Tasks**:
1. Create `Certificate` model (`app/lib/models/certificate.ts`)
   - Fields: certificateId, playerId, courseId, score, verificationSlug, isPublic, isRevoked
   - Indexes: certificateId (unique), verificationSlug (unique), playerId+courseId
2. Create `CertificateEntitlement` model (`app/lib/models/certificate-entitlement.ts`)
   - Fields: playerId, courseId, source (PAID/POINTS/INCLUDED_IN_PREMIUM)
   - Index: playerId+courseId (unique)
3. Create `FinalExamAttempt` model (`app/lib/models/final-exam-attempt.ts`)
   - Fields: playerId, courseId, poolCourseId, questionIds, questionOrder, answers, score, status
   - Status enum: IN_PROGRESS, SUBMITTED, GRADED, DISCARDED
4. Create `CertificationSettings` model (`app/lib/models/certification-settings.ts`)
   - Global defaults: pricing, template, credential titles
5. Add `certification` field to `Course` model
   - Fields: enabled, poolCourseId, priceMoney, pricePoints, premiumIncludesCertification
6. Create utility functions (`app/lib/certification.ts`)
   - `resolvePoolCourse()` - Resolve which course to use for question pool
   - `getCertificationPoolCount()` - Count questions in pool (must be ≥50)
   - `isCertificationAvailable()` - Check if certification is available

**Deliverable**: All models created, utilities implemented, Course model extended.

---

### Phase 2: Entitlement System (Day 2-3)

**Tasks**:
1. Create `/api/certification/entitlement` GET endpoint
   - Check entitlement status, pool count, pricing
2. Create `/api/certification/entitlement/redeem-points` POST endpoint
   - Redeem points for certification access
   - Deduct points, create entitlement
3. Create `/api/certification/entitlement/purchase` POST endpoint
   - Purchase with money (Stripe integration - can be simplified for MVP)
4. Add entitlement check to course detail page
   - Show "Get certificate" CTA if no entitlement
   - Show "Start final exam" if entitled

**Deliverable**: Users can purchase/redeem certification access, entitlement tracked in database.

---

### Phase 3: Final Exam Flow (Day 3-5)

**Tasks**:
1. Create `/api/certification/final-exam/start` POST endpoint
   - Validate prerequisites (course completed, entitlement exists, pool ≥50)
   - Randomly select 50 questions using MongoDB `$sample`
   - Shuffle question order and answer options
   - Create FinalExamAttempt with IN_PROGRESS status
2. Create `/api/certification/final-exam/answer` POST endpoint
   - Submit answer, check correctness
   - Increment correctCount if correct
   - Load next question with shuffled options
   - Return completion status
3. Create `/api/certification/final-exam/submit` POST endpoint
   - Calculate score (Math.round((correctCount / 50) * 100))
   - Determine pass/fail (>50% passes)
   - Update/create certificate (most recent wins)
   - Revoke certificate if score ≤50%
4. Create `/api/certification/final-exam/discard` POST endpoint
   - Mark attempt as DISCARDED
   - Do not affect certificate status
5. Create final exam page (`app/[locale]/courses/[courseId]/final-exam/page.tsx`)
   - One question at a time UI
   - Progress indicator
   - Immediate feedback
   - Score display on completion

**Deliverable**: Complete exam flow working, certificates issued/updated on pass/fail.

---

### Phase 4: Certificate Management (Day 5-6)

**Tasks**:
1. Create `/api/certificates/[slug]` GET endpoint
   - Public verification with privacy checks
   - Generate referral code for owner
2. Create `/api/certificates/[slug]` PATCH endpoint
   - Toggle public/private visibility (owner only)
3. Create `/api/certificates/[certificateId]/render` GET endpoint
   - Render PNG using Next.js ImageResponse
   - Support share_1200x627 and print_a4 variants
   - Show revoked watermark if revoked
4. Create `/api/certificates/issue` POST endpoint
   - Admin-only manual certificate issuance
   - Upload to imgbb if API key set
5. Create certificate verification page (`app/[locale]/certificate/[slug]/page.tsx`)
   - Public certificate display
   - Social meta tags for sharing
   - Privacy toggle for owner

**Deliverable**: Certificates can be verified, shared, and managed.

---

### Phase 5: Admin Interface (Day 6-7)

**Tasks**:
1. Create `/api/admin/certificates` GET endpoint
   - List certificates with search and pagination
2. Create `/api/admin/certification/analytics` GET endpoint
   - Certificate statistics, attempt analytics, entitlement stats
3. Create `/api/admin/certification/pools` GET endpoint
   - Audit question pool sizes for all courses
4. Create `/api/admin/certification/settings` GET/PUT endpoints
   - Global certification settings management
5. Create admin pages:
   - `app/[locale]/admin/certificates/page.tsx` - Certificate list
   - `app/[locale]/admin/certification-settings/page.tsx` - Settings
   - `app/[locale]/admin/certification/page.tsx` - Analytics dashboard

**Deliverable**: Complete admin interface for certification management.

---

## Business Rules

### Eligibility
- Course must be completed
- User must have entitlement (purchased/redeemed/included)
- Certification must be enabled
- Pool must have ≥50 questions

### Exam Rules
- 50 questions per attempt (random selection)
- One sitting only (leaving discards)
- Questions and options shuffled per attempt
- One question at a time
- Immediate feedback

### Scoring
- Pass threshold: >50% (strictly greater)
- Score: Math.round((correctCount / 50) * 100)
- Most recent attempt wins
- Revocation if score ≤50%

### Retakes
- Unlimited retakes
- Score can decrease
- Revocation on fail (≤50%)

---

## Implementation Checklist

See `docs/FEATURES_SINCE_F20C34A_COMPLETE_DOCUMENTATION copy.md` Section 1.8 for complete checklist.

---

## Testing Requirements

- [ ] Entitlement purchase/redeem works
- [ ] Exam start validates all prerequisites
- [ ] Question randomization works correctly
- [ ] Answer submission increments score correctly
- [ ] Certificate issued on pass (>50%)
- [ ] Certificate revoked on fail (≤50%)
- [ ] Retakes update certificate score
- [ ] Public verification works
- [ ] Privacy toggle works
- [ ] Admin interface displays correctly

---

## Critical Notes

- **DO NOT modify core auth files** during implementation
- Test after each phase before proceeding
- Keep NextAuth route handler simple (no CORS wrapping)
- Use MongoDB `$sample` for random question selection
- Certificate always reflects most recent attempt
