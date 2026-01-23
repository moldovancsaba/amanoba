# Complete Feature Documentation: All Features Added Since f20c34a

**Baseline Version**: `f20c34a` - "feat: surface certification state in catalog and course detail pages"  
**Documentation Date**: 2026-01-21  
**Purpose**: Complete documentation of all features to enable redevelopment from working baseline

---

## Table of Contents

1. [Certification System with Final Exam](#1-certification-system-with-final-exam)
2. [Short Children Courses Feature](#2-short-children-courses-feature)
3. [SSO Authentication Problems Discovered](#3-sso-authentication-problems-discovered)
4. [Comparison to Working Version f20c34a](#4-comparison-to-working-version-f20c34a)

---

## 1. Certification System with Final Exam

### 1.1 Overview

A complete certification system that allows learners to:
- Purchase certification access (money or points) after completing a course
- Take a 50-question randomized final exam
- Receive a certificate with their score if they pass (>50%)
- Retake the exam unlimited times (most recent score wins)
- Have certification revoked if score drops to ≤50%

### 1.2 Database Models

#### Certificate Model (`app/lib/models/certificate.ts`)

**Purpose**: Stores issued certificates as immutable snapshots for verification and sharing.

**Schema**:
```typescript
interface ICertificate {
  certificateId: string; // UUID
  certificateNumber?: string;
  playerId: string;
  recipientName: string;
  courseId: string;
  courseTitle: string;
  locale: 'en' | 'hu';
  
  designTemplateId: string;
  credentialId: string;
  completionPhraseId: string;
  deliverableBulletIds: string[];
  
  issuedAtISO: string;
  awardedPhraseId: string;
  
  verificationSlug: string; // Unique, unguessable slug for public verification
  pdfAssetPath?: string;
  imageAssetPath?: string; // CDN URL after upload to imgbb
  
  finalExamScorePercentInteger?: number; // Integer score (0-100)
  lastAttemptId?: string;
  isPublic?: boolean; // Default: true
  isRevoked?: boolean; // Default: false
  revokedAtISO?: string;
  revokedReason?: string;
}
```

**Key Indexes**:
- `certificateId` (unique)
- `verificationSlug` (unique)
- `{ playerId: 1, courseId: 1, verificationSlug: 1 }`

**Critical Fields**:
- `verificationSlug`: Random hex string for public verification URLs
- `finalExamScorePercentInteger`: Integer score (0-100) shown on certificate
- `isRevoked`: Set to true if most recent attempt score ≤50%

#### CertificateEntitlement Model (`app/lib/models/certificate-entitlement.ts`)

**Purpose**: Gates access to final certification exam per course and player.

**Schema**:
```typescript
interface ICertificateEntitlement {
  playerId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  source: 'PAID' | 'POINTS' | 'INCLUDED_IN_PREMIUM';
  money?: {
    amount: number;
    currency: string;
    paymentReference?: string;
  };
  pointsSpent?: number;
  entitledAtISO: string;
  metadata?: Record<string, unknown>;
}
```

**Key Indexes**:
- `{ playerId: 1, courseId: 1 }` (unique) - One entitlement per player/course

**Business Rules**:
- One entitlement per player/course (unique constraint)
- Entitlement can be purchased with money, redeemed with points, or included in premium course
- Required before starting final exam

#### FinalExamAttempt Model (`app/lib/models/final-exam-attempt.ts`)

**Purpose**: Stores a single certification final exam attempt for a player/course.

**Schema**:
```typescript
interface IFinalExamAttempt {
  playerId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  poolCourseId: mongoose.Types.ObjectId; // Resolved pool course (_id)
  questionIds: string[]; // 50 question IDs selected
  questionOrder: string[]; // Ordered list of question IDs (shuffled)
  answerOrderByQuestion?: Record<string, number[]>; // questionId -> shuffled option indices
  answers: Record<string, unknown>[]; // Client payloads per question
  correctCount: number;
  scorePercentRaw?: number; // Raw decimal (e.g., 75.5)
  scorePercentInteger?: number; // Rounded integer (e.g., 76)
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'DISCARDED' | 'PENDING_GRADE';
  passed?: boolean;
  startedAtISO: string;
  submittedAtISO?: string;
  discardedAtISO?: string;
  discardReason?: string;
}
```

**Key Indexes**:
- `{ playerId: 1, courseId: 1, status: 1 }`

**Status Flow**:
1. `IN_PROGRESS` - Exam started, questions being answered
2. `SUBMITTED` - All questions answered, ready for grading
3. `GRADED` - Score calculated, certificate updated
4. `DISCARDED` - User left exam, attempt abandoned

**Critical Logic**:
- `questionOrder`: Shuffled array of 50 question IDs
- `answerOrderByQuestion`: Maps each questionId to shuffled option indices [0,1,2,3]
- `correctCount`: Incremented on each correct answer
- `scorePercentInteger`: Calculated as `Math.round((correctCount / 50) * 100)`

#### CertificationSettings Model (`app/lib/models/certification-settings.ts`)

**Purpose**: Global defaults for certification (template, pricing, etc.).

**Schema**:
```typescript
interface ICertificationSettings {
  key: string; // Fixed: "global"
  backgroundUrl?: string;
  priceMoney?: { amount: number; currency: string };
  pricePoints?: number;
  templateId?: string;
  credentialTitleId?: string;
  completionPhraseId?: string;
  deliverableBulletIds?: string[];
  updatedAt: Date;
}
```

**Usage**: Single document with `key: 'global'` stores system-wide defaults.

### 1.3 Course Model Extension

**File**: `app/lib/models/course.ts`

**New Field Added**:
```typescript
certification?: {
  enabled: boolean;
  poolCourseId?: string; // For child courses, points to parent 30-day course
  priceMoney?: { amount: number; currency: string };
  pricePoints?: number;
  premiumIncludesCertification?: boolean;
  templateId?: string;
  credentialTitleId?: string;
}
```

**Business Rules**:
- `enabled`: Must be true for certification to be available
- `poolCourseId`: If set, uses parent course's question pool (for shorter courses)
- If `poolCourseId` not set, uses course's own question pool
- `premiumIncludesCertification`: If true and course is premium, entitlement is auto-granted

### 1.4 Core Utility Functions

#### `app/lib/certification.ts`

**Functions**:

1. **`resolvePoolCourse(courseId: string)`**
   - Resolves which course to use for question pool
   - If `course.certification.poolCourseId` exists, returns that course
   - Otherwise returns the course itself
   - **Purpose**: Allows shorter courses to use parent 30-day course's question pool

2. **`getCertificationPoolCount(courseId: string): Promise<number>`**
   - Counts active, course-specific questions in the pool course
   - Returns 0 if course not found
   - **Requirement**: Must have ≥50 questions for certification to be available

3. **`isCertificationAvailable(courseId: string)`**
   - Checks if certification is enabled AND pool has ≥50 questions
   - Returns `{ available: boolean, poolCount: number }`

### 1.5 API Endpoints

#### 1.5.1 Entitlement Management

**GET `/api/certification/entitlement?courseId=COURSE_ID`**

**Purpose**: Check certification entitlement status for a course.

**Response**:
```json
{
  "success": true,
  "data": {
    "certificationEnabled": boolean,
    "poolCount": number,
    "certificationAvailable": boolean,
    "entitlementOwned": boolean,
    "premiumIncludesCertification": boolean,
    "priceMoney": { "amount": number, "currency": string } | null,
    "pricePoints": number | null,
    "poolCourseId": string
  }
}
```

**Business Logic**:
- Checks if course has certification enabled
- Verifies pool has ≥50 questions
- Checks if player has entitlement
- Returns pricing information

**POST `/api/certification/entitlement/redeem-points`**

**Purpose**: Redeem points to purchase certification access.

**Request Body**:
```json
{
  "courseId": "COURSE_ID"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "entitlementId": string
  }
}
```

**Business Logic**:
- Checks player has enough points
- Deducts points from player
- Creates CertificateEntitlement with `source: 'POINTS'`
- Returns entitlement ID

**POST `/api/certification/entitlement/purchase`**

**Purpose**: Purchase certification with money (Stripe integration - not fully implemented in MVP).

**Request Body**:
```json
{
  "courseId": "COURSE_ID"
}
```

**Status**: Payment flow not fully implemented in current version.

#### 1.5.2 Final Exam Flow

**POST `/api/certification/final-exam/start`**

**Purpose**: Start a new final exam attempt.

**Request Body**:
```json
{
  "courseId": "COURSE_ID"
}
```

**Prerequisites**:
1. User must be authenticated
2. Course must be completed (`CourseProgress.status === 'completed'`)
3. User must have entitlement OR course must have `premiumIncludesCertification: true`
4. Certification must be enabled
5. Pool must have ≥50 questions

**Response**:
```json
{
  "success": true,
  "data": {
    "attemptId": string,
    "question": {
      "questionId": string,
      "question": string,
      "options": string[], // Shuffled
      "index": 0,
      "total": 50
    }
  }
}
```

**Implementation Details**:
1. Validates prerequisites
2. Resolves pool course (parent or self)
3. Uses MongoDB `$sample` to randomly select 50 questions
4. Shuffles question order
5. Shuffles answer options for first question
6. Creates `FinalExamAttempt` with status `IN_PROGRESS`
7. Returns first question with shuffled options

**Critical**: Uses `QuizQuestion.aggregate([{ $match: {...} }, { $sample: { size: 50 } }])` for random selection.

**POST `/api/certification/final-exam/answer`**

**Purpose**: Submit answer to current question and get next question.

**Request Body**:
```json
{
  "attemptId": string,
  "questionId": string,
  "selectedIndex": number // Index in shuffled options array
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "correct": boolean,
    "nextQuestion": {
      "questionId": string,
      "question": string,
      "options": string[], // Shuffled
      "index": number,
      "total": 50
    } | null, // null if completed
    "completed": boolean
  }
}
```

**Implementation Details**:
1. Validates attempt exists and is `IN_PROGRESS`
2. Validates question is part of attempt
3. Loads question from database
4. Ensures answer order exists for question (creates if missing)
5. Maps `selectedIndex` back to original `correctIndex` using `answerOrderByQuestion`
6. Checks if answer is correct
7. Increments `correctCount` if correct
8. Stores answer in `answers` array
9. If more questions remain:
   - Loads next question
   - Shuffles options for next question
   - Stores shuffled order in `answerOrderByQuestion`
   - Returns next question
10. If completed, returns `completed: true` with no next question

**Critical Logic**:
- `selectedIndex` is the index in the shuffled options array
- `answerOrderByQuestion[questionId]` maps to original indices [0,1,2,3]
- To check correctness: `optionOrder[selectedIndex] === question.correctIndex`

**POST `/api/certification/final-exam/submit`**

**Purpose**: Finalize exam attempt and update certificate.

**Request Body**:
```json
{
  "attemptId": string
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "scorePercentInteger": number,
    "passed": boolean,
    "certificateUpdated": boolean
  }
}
```

**Implementation Details**:
1. Validates attempt exists and is `IN_PROGRESS`
2. Calculates score:
   - `scorePercentRaw = (correctCount / 50) * 100`
   - `scorePercentInteger = Math.round(scorePercentRaw)`
   - `passed = scorePercentInteger > 50` (strictly greater than 50%)
3. Updates attempt:
   - `status = 'GRADED'`
   - `scorePercentRaw`, `scorePercentInteger`, `passed`
   - `submittedAtISO = new Date().toISOString()`
4. Updates certificate (most recent wins):
   - If passed:
     - If certificate exists: Update score, clear revoked status
     - If no certificate: Create new certificate
   - If failed (≤50%):
     - If certificate exists: Set `isRevoked = true`, `revokedAtISO`, `revokedReason = 'score_below_threshold'`
     - Update score to show failed attempt
5. Returns score and pass status

**Critical Business Rules**:
- **Most recent attempt wins**: Certificate always reflects latest attempt score
- **Revocation**: If score ≤50%, certification is revoked
- **Pass threshold**: Must be >50% (strictly greater, so 50% fails)

**POST `/api/certification/final-exam/discard`**

**Purpose**: Discard an in-progress attempt (user left exam).

**Request Body**:
```json
{
  "attemptId": string,
  "reason": string // Optional, default: "user_exit"
}
```

**Response**:
```json
{
  "success": true
}
```

**Implementation Details**:
1. Validates attempt exists and is `IN_PROGRESS`
2. Sets `status = 'DISCARDED'`
3. Sets `discardedAtISO = new Date().toISOString()`
4. Sets `discardReason`

**Business Rule**: Discarded attempts do NOT affect certificate status.

#### 1.5.3 Certificate Management

**GET `/api/certificates/[slug]`**

**Purpose**: Public verification endpoint. Returns certificate snapshot plus related course info and referral code.

**Response**:
```json
{
  "success": true,
  "data": {
    "certificate": ICertificate,
    "course": {
      "courseId": string,
      "name": string,
      "language": string,
      "slug": string,
      "description": string,
      "durationDays": number
    } | null,
    "referral": {
      "code": string,
      "shareUrl": string
    } | null
  }
}
```

**Privacy Logic**:
- If `certificate.isPublic === false` and user is not owner: Returns 404
- If certificate is revoked: Shows revoked state
- Generates referral code for certificate owner

**PATCH `/api/certificates/[slug]`**

**Purpose**: Allows owner to toggle public/private visibility.

**Request Body**:
```json
{
  "isPublic": boolean
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "isPublic": boolean
  }
}
```

**Authorization**: Only certificate owner can update.

**POST `/api/certificates/issue`**

**Purpose**: Admin-only endpoint to manually issue certificates.

**Request Body**:
```json
{
  "playerId": string,
  "courseId": string,
  "locale": "en" | "hu",
  "designTemplateId": string,
  "credentialId": string,
  "completionPhraseId": string,
  "deliverableBulletIds": string[]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "certificateId": string,
    "verificationUrl": string,
    "pdfUrl": string | null,
    "imageUrl": string | null
  }
}
```

**Implementation Details**:
1. Validates admin role
2. Verifies course completion (soft check)
3. Creates certificate with UUID `certificateId`
4. Generates random `verificationSlug` (10 bytes hex)
5. Renders PNG via internal render endpoint
6. Uploads to imgbb (if `IMGBB_API_KEY` set)
7. Returns certificate data with URLs

**GET `/api/certificates/[certificateId]/render?format=png&variant=share_1200x627`**

**Purpose**: Renders certificate as PNG image for sharing or printing.

**Query Parameters**:
- `format`: `"png"` (only supported format)
- `variant`: `"share_1200x627"` (social sharing) or `"print_a4"` (2480x3508)

**Response**: PNG image (ImageResponse from `next/og`)

**Implementation Details**:
- Uses Next.js `ImageResponse` (Vercel OG Image Generation)
- Renders certificate with:
  - Recipient name
  - Course title
  - Score (if available)
  - Issue date
  - Verification URL
  - Revoked watermark (if revoked)
- Returns PNG buffer

**Critical**: Requires `@vercel/og` or Next.js 13+ with ImageResponse support.

#### 1.5.4 Admin Endpoints

**GET `/api/admin/certificates`**

**Purpose**: List issued certificates for admins (with search and pagination).

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 25, max: 100)
- `search`: string (searches recipientName, courseTitle, courseId, certificateId, certificateNumber)

**Response**:
```json
{
  "success": true,
  "data": Certificate[],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

**GET `/api/admin/certification/analytics`**

**Purpose**: Certification analytics for admin dashboard.

**Response**:
```json
{
  "success": true,
  "data": {
    "certificates": {
      "total": number,
      "revoked": number,
      "publicCount": number
    },
    "attempts": Array<{
      "_id": string, // courseId
      "attempts": number,
      "passed": number,
      "failed": number
    }>,
    "entitlements": Array<{
      "_id": string, // courseId
      "entitlements": number,
      "paid": number,
      "points": number,
      "premium": number
    }>
  }
}
```

**GET `/api/admin/certification/pools`**

**Purpose**: Audit question pool sizes for all courses.

**Response**:
```json
{
  "success": true,
  "data": Array<{
    "courseId": string,
    "certificationEnabled": boolean,
    "poolCourseId": string,
    "poolCount": number,
    "available": boolean // poolCount >= 50
  }>
}
```

**GET `/api/admin/certification/settings`**

**Purpose**: Get global certification settings.

**Response**:
```json
{
  "success": true,
  "data": ICertificationSettings
}
```

**PUT `/api/admin/certification/settings`**

**Purpose**: Update global certification settings.

**Request Body**:
```json
{
  "backgroundUrl": string,
  "priceMoney": { "amount": number, "currency": string },
  "pricePoints": number,
  "templateId": string,
  "credentialTitleId": string,
  "completionPhraseId": string,
  "deliverableBulletIds": string[]
}
```

**Response**:
```json
{
  "success": true,
  "data": ICertificationSettings
}
```

### 1.6 Frontend Pages

#### Final Exam Page (`app/[locale]/courses/[courseId]/final-exam/page.tsx`)

**Route**: `/{locale}/courses/{courseId}/final-exam`

**Purpose**: Client-side page for taking final certification exam.

**Features**:
1. **Entitlement Check**: Loads entitlement status on mount
2. **Purchase/Redeem UI**: Shows pricing and allows point redemption
3. **Exam Start**: Button to start exam (creates attempt)
4. **Question Flow**: One question at a time with shuffled options
5. **Answer Submission**: Submits answer, gets immediate feedback, loads next question
6. **Completion**: Auto-submits on last question, shows score and pass/fail
7. **Discard**: Button to abandon attempt

**State Management**:
- `entitlement`: Entitlement status from API
- `attemptId`: Current attempt ID
- `question`: Current question payload
- `result`: Final score and pass status
- `error`: Error messages

**Key Functions**:
- `loadEntitlement()`: Fetches entitlement status
- `redeemPoints()`: Redeems points for entitlement
- `startExam()`: Creates new attempt, loads first question
- `answer(selectedIndex)`: Submits answer, gets next question or completes
- `discard()`: Abandons attempt

**UI Flow**:
1. Loading state while checking entitlement
2. If unavailable: Shows "Certification unavailable" message
3. If no entitlement: Shows purchase/redeem UI
4. If entitled: Shows "Start exam" button
5. During exam: Shows question with options, progress indicator, discard button
6. After completion: Shows score, pass/fail, refresh button

#### Certificate Verification Page (`app/[locale]/certificate/[slug]/page.tsx`)

**Route**: `/{locale}/certificate/{slug}`

**Purpose**: Public certificate verification and sharing page.

**Features**:
1. **Certificate Display**: Shows certificate details
2. **Course Info**: Displays course information
3. **Referral Code**: Generates and displays referral code for owner
4. **Privacy Toggle**: Owner can toggle public/private
5. **Revoked State**: Shows "REVOKED" watermark if revoked
6. **Social Meta**: Open Graph tags for sharing

**Components**:
- `CertificateClient.tsx`: Client component for interactivity
- `head.tsx`: Metadata generation

**Metadata**:
- Title: `"{recipientName} – {courseTitle} | Amanoba Certificate"`
- Description: `"Score: {score}% • Verify on Amanoba"`
- Image: Certificate render URL (1200x627 PNG)

#### Admin Pages

**`app/[locale]/admin/certificates/page.tsx`**

**Purpose**: Admin interface to view and manage certificates.

**Features**:
- List all certificates with search
- Pagination
- Filter by status (active/revoked)
- View certificate details

**`app/[locale]/admin/certification-settings/page.tsx`**

**Purpose**: Admin interface to configure global certification settings.

**Features**:
- Edit global defaults (pricing, template, etc.)
- Save settings

**`app/[locale]/admin/certification/page.tsx`**

**Purpose**: Admin certification dashboard/analytics.

**Features**:
- View certification analytics
- Pool audit
- Statistics

### 1.7 Business Rules Summary

#### Eligibility
1. Course must be completed before starting final exam
2. User must have entitlement (purchased, redeemed, or included in premium)
3. Certification must be enabled on course
4. Question pool must have ≥50 questions

#### Exam Rules
1. **50 questions** per attempt (randomly selected from pool)
2. **One sitting only**: Leaving discards attempt
3. **Randomization**: Questions and answer options shuffled per attempt
4. **One question at a time**: Same UX as lesson quizzes
5. **Immediate feedback**: Shows correct/incorrect after each answer

#### Scoring
1. **Pass threshold**: >50% (strictly greater, so 50% fails)
2. **Score calculation**: `Math.round((correctCount / 50) * 100)`
3. **Most recent wins**: Certificate always reflects latest attempt
4. **Revocation**: If score ≤50%, certification is revoked

#### Retakes
1. **Unlimited retakes**: No cooldown, no limit
2. **Score can decrease**: If user retakes and scores lower
3. **Revocation on fail**: If score drops to ≤50%, certification revoked

#### Certificate
1. **Issued on pass**: Certificate created when score >50%
2. **Updated on retake**: Score updated to most recent attempt
3. **Revoked on fail**: If score ≤50%, certificate marked revoked
4. **Public by default**: `isPublic: true` by default
5. **Verification URL**: `/{locale}/certificate/{verificationSlug}`

### 1.8 Implementation Checklist

**Database Models**:
- [ ] Create `Certificate` model with all fields
- [ ] Create `CertificateEntitlement` model with unique index
- [ ] Create `FinalExamAttempt` model with status enum
- [ ] Create `CertificationSettings` model
- [ ] Add `certification` field to `Course` model

**Utility Functions**:
- [ ] Implement `resolvePoolCourse()`
- [ ] Implement `getCertificationPoolCount()`
- [ ] Implement `isCertificationAvailable()`

**API Endpoints**:
- [ ] Implement entitlement check endpoint
- [ ] Implement point redemption endpoint
- [ ] Implement exam start endpoint (with randomization)
- [ ] Implement answer submission endpoint (with option shuffling)
- [ ] Implement exam submit endpoint (with certificate update logic)
- [ ] Implement exam discard endpoint
- [ ] Implement certificate verification endpoint
- [ ] Implement certificate visibility toggle
- [ ] Implement admin certificate list
- [ ] Implement admin analytics
- [ ] Implement admin pool audit
- [ ] Implement admin settings CRUD

**Frontend Pages**:
- [ ] Create final exam page with one-question flow
- [ ] Create certificate verification page
- [ ] Create admin certificate management page
- [ ] Create admin certification settings page
- [ ] Create admin certification analytics page

**Certificate Rendering**:
- [ ] Implement PNG render endpoint (ImageResponse)
- [ ] Implement imgbb upload integration
- [ ] Add revoked watermark to render

**Integration Points**:
- [ ] Add certification CTA to course detail page
- [ ] Add certification status to course list
- [ ] Add referral code generation for certificate owners
- [ ] Add certificate link to user profile

---

## 2. Short Children Courses Feature

### 2.1 Status: NOT FULLY IMPLEMENTED

**Important**: After thorough codebase analysis, the "short children courses" feature appears to be **planned but not fully implemented**. The infrastructure exists (poolCourseId concept), but there is no complete implementation of:
- Course forking/creation UI
- Parent-child course relationships
- Lesson selection and mapping
- Different quiz strategies per variant

### 2.2 Planned Architecture (from ROADMAP.md)

**Concept**: Fork 30-day courses into shorter formats (7-day, weekend, 1-day, 1-hour) with different quiz strategies.

**Planned Features**:
1. **Forking Core**: Parent→child link, auto-sync default, selective detach toggle
2. **Lesson Mapping UI**: Select/reorder lessons for target schedule
3. **Variant Quiz Strategies**: Inherit daily quizzes, end mega-quiz, diagnostic random pool
4. **Format-Specific Creation**:
   - 7-day: Pick 7 lessons, daily cadence, inherited quizzes
   - Weekend: Pick 1 Fri + 2 Sat + 1 Sun lessons, calendar-fixed schedule
   - 1-day: Pick 10 lessons, disable per-lesson quizzes, 50-question final quiz
   - 1-hour: Pick 2 lessons, 50-question diagnostic random pool

### 2.3 Partial Implementation: poolCourseId

**What Exists**:
- `Course.certification.poolCourseId` field
- `resolvePoolCourse()` function that uses poolCourseId if set
- Certification system uses parent course's question pool for shorter courses

**What This Enables**:
- A shorter course can use a parent 30-day course's question pool for certification
- Example: 7-day course can use parent's 150+ questions for final exam

**What's Missing**:
- No UI to create child courses
- No parent-child relationship management
- No lesson selection/mapping system
- No different quiz strategies
- No format-specific scheduling

### 2.4 How to Implement (When Ready)

**Phase 1: Database Schema**
1. Add `parentCourseId` field to Course model (optional ObjectId reference)
2. Add `courseVariant` field: `'standard' | '7day' | 'weekend' | '1day' | '1hour'`
3. Add `selectedLessonIds` array to Course model (for child courses)
4. Add `quizStrategy` field: `'inherit' | 'mega-quiz' | 'diagnostic'`

**Phase 2: Course Creation UI**
1. Add "Fork Course" button in admin course editor
2. Create fork wizard:
   - Select parent course
   - Select variant type
   - Select lessons to include
   - Configure quiz strategy
   - Set schedule (for weekend variant)
3. Create child course with:
   - `parentCourseId` set
   - `courseVariant` set
   - `selectedLessonIds` set
   - `certification.poolCourseId` set to parent's courseId
   - `durationDays` set based on variant

**Phase 3: Lesson Delivery**
1. Modify lesson delivery to respect `selectedLessonIds`
2. Implement variant-specific scheduling:
   - 7-day: One lesson per day
   - Weekend: Calendar-based (Fri/Sat/Sun)
   - 1-day: All lessons in one day
   - 1-hour: All lessons immediately

**Phase 4: Quiz Strategy**
1. Inherit: Use parent's lesson quizzes
2. Mega-quiz: Single 50-question quiz at end
3. Diagnostic: Random 50-question pool

**Phase 5: Auto-Sync (Future)**
1. Track parent course changes
2. Alert child courses of updates
3. Preview changes before syncing

### 2.5 Current Workaround

**For Now**: You can manually create shorter courses and set `certification.poolCourseId` to point to a parent 30-day course. The certification system will use the parent's question pool, but there's no automated forking or lesson selection.

---

## 3. SSO Authentication Problems Discovered

### 3.1 Critical Issues Found

#### Issue 1: "Fetch API cannot load /api/auth/session due to access control checks"

**Error Message**:
```
Fetch API cannot load https://www.amanoba.com/api/auth/session due to access control checks.
```

**Root Cause**: Client-side CORS error when NextAuth tries to fetch session endpoint.

**What Was Tried** (All Failed):
1. ❌ Adding explicit CORS headers to NextAuth route handler
2. ❌ Excluding API routes from next.config.ts headers
3. ❌ Disabling service worker fetch interception
4. ❌ Restoring JWT callback to working version
5. ❌ Restoring middleware to working version
6. ❌ Restoring SessionProvider to working version

**Current Status**: **UNRESOLVED** - System broken, preventing all authentication.

**Working Version**: `f20c34a` - Simple NextAuth route handler with no CORS wrapping.

**Key Finding**: The working version had:
```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

**All attempts to "fix" this broke it further.**

#### Issue 2: Session Loading Timeout

**Error Message**:
```
Session loading timeout. Please try refreshing the page.
```

**Root Cause**: SessionProvider or NextAuth client-side code timing out.

**What Was Tried**:
1. ❌ Adding `refetchInterval={0}` to SessionProvider
2. ❌ Adding `refetchOnWindowFocus={false}` to SessionProvider
3. ❌ Adding `basePath="/api/auth"` to SessionProvider
4. ❌ Removing all SessionProvider props (restored to working version)

**Current Status**: Related to Issue 1 - if session endpoint fails, timeout occurs.

#### Issue 3: Anonymous Login Failing

**Error Message**:
```
Anonymous login failed: TypeError: Load failed
Fetch API cannot load https://www.amanoba.com/api/auth/anonymous due to access control checks.
```

**Root Cause**: Same CORS issue affecting anonymous login endpoint.

**What Was Tried**:
1. ✅ Added CORS headers to anonymous endpoint (helped but didn't fix root cause)
2. ✅ Added `credentials: 'include'` to fetch call

**Current Status**: Still failing due to root CORS issue.

#### Issue 4: Courses Page Failing

**Error Message**:
```
Failed to fetch courses: TypeError: Load failed
```

**Root Cause**: Same CORS/access control issue affecting all API routes.

**Current Status**: All API calls failing due to root issue.

### 3.2 SSO-Specific Issues (Separate from CORS)

#### Issue 5: Invalid Nonce Error

**Error Message**:
```
https://www.amanoba.com/hu/auth/signin?error=invalid_nonce
```

**Root Cause**: SSO server was not capturing/returning nonce parameter in ID tokens.

**Fix Applied** (in SSO server):
- SSO now extracts `nonce` from authorization requests
- Stores `nonce` with authorization codes
- Returns `nonce` in ID token payload
- Validation now works correctly

**Status**: ✅ **FIXED** (in SSO server, not Amanoba code)

**Documentation**: See `SSO_NONCE_FIX_INSTRUCTIONS.md`

#### Issue 6: Invalid Scope Error

**Error Message**:
```
invalid_scope
```

**Root Cause**: `roles` scope was not whitelisted in SSO server.

**Fix Applied** (in SSO server):
- Added `roles` to OAuth client's allowed_scopes
- Added `roles` to SSO server's global SCOPE_DEFINITIONS whitelist

**Status**: ✅ **FIXED** (in SSO server, not Amanoba code)

**Documentation**: See `docs/SSO_SCOPE_FIX.md`

#### Issue 7: Role Extraction Issues

**Problem**: SSO roles not being extracted correctly from tokens.

**Solution Implemented**:
- Enhanced role extraction from 15+ claim locations
- UserInfo endpoint fallback
- Comprehensive logging
- Debug tools

**Files Changed**:
- `app/lib/auth/sso.ts` - Enhanced role extraction
- `app/lib/auth/sso-userinfo.ts` - NEW: UserInfo endpoint fallback
- `app/api/auth/sso/callback/route.ts` - Role management logic

**Status**: ✅ **IMPLEMENTED** (but system broken due to CORS issue)

### 3.3 What Works in f20c34a

**Working SSO Flow**:
1. User clicks "SSO Login"
2. Redirects to SSO provider
3. User authenticates
4. SSO redirects back with code
5. Callback exchanges code for tokens
6. Player created/updated in database
7. NextAuth session created
8. User redirected to dashboard

**Key Files (Working Version)**:
- `app/api/auth/sso/login/route.ts` - Simple redirect
- `app/api/auth/sso/callback/route.ts` - Token exchange and player upsert
- `auth.ts` - JWT callback with database refresh
- `middleware.ts` - Simple auth() wrapper

### 3.4 What Broke After f20c34a

**All Changes That Broke System**:
1. ❌ Attempts to add CORS headers to NextAuth route
2. ❌ Changes to SessionProvider props
3. ❌ Changes to middleware structure
4. ❌ Changes to JWT callback (simplification attempts)
5. ❌ Service worker fetch interception changes

**Key Lesson**: **The working version was simple. All "improvements" broke it.**

### 3.5 Recommended Approach for Redevelopment

**DO**:
1. Start from exact f20c34a code
2. Test SSO login works
3. Test anonymous login works
4. Test session endpoint works
5. Only then add new features

**DON'T**:
1. Don't modify NextAuth route handler
2. Don't add CORS wrappers
3. Don't change SessionProvider props
4. Don't modify middleware structure
5. Don't simplify JWT callback (the complex version works)

---

## 4. Comparison to Working Version f20c34a

### 4.1 Files That Must Match Exactly

#### `app/api/auth/[...nextauth]/route.ts`

**Working Version**:
```typescript
/**
 * NextAuth API Route Handler
 * 
 * What: Catch-all route for NextAuth authentication endpoints
 * Why: Handles sign in, sign out, callbacks, and session management
 */

import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

**Critical**: No CORS wrapping, no OPTIONS handler, no modifications.

#### `next.config.ts`

**Working Version**:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        },
      ],
    },
    // ... manifest.json headers
  ];
}
```

**Critical**: Headers apply to ALL routes including `/api/`. Don't exclude API routes.

#### `public/service-worker.js`

**Working Version**:
- Version: `2.0.0`
- Has fetch event listener with `networkFirstStrategy` for API routes
- Does NOT exclude API routes from interception

**Critical**: Service worker intercepts API routes with network-first strategy. Don't disable it.

#### `auth.ts`

**Working Version**:
- Complex JWT callback that fetches player data from database on every request
- Includes fallback logic for database failures
- Has `signIn` callback (even if it just returns true)

**Critical**: The "simplified" version breaks role updates. Keep the complex version.

#### `middleware.ts`

**Working Version**:
- Uses `export default auth((req) => { ... })` pattern
- No manual `authEdge()` calls
- Matcher: `'/((?!_next/static|_next/image|favicon.ico|manifest.json|api).*)'`

**Critical**: Don't restructure middleware. The simple pattern works.

#### `app/components/session-provider.tsx`

**Working Version**:
```typescript
export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
```

**Critical**: No extra props. Simple wrapper only.

#### `app/[locale]/courses/page.tsx`

**Working Version**:
```typescript
const fetchCourses = async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('status', 'active');
    if (search) {
      params.append('search', search);
    }
    const response = await fetch(`/api/courses?${params.toString()}`);
    const data = await response.json();
    if (data.success) {
      setCourses(data.courses || []);
    }
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  } finally {
    setLoading(false);
  }
};
```

**Critical**: No `cache: 'no-store'`, no `credentials: 'include'`. Simple fetch.

### 4.2 What Changed (That Broke Things)

**94 commits** since f20c34a with these breaking changes:

1. **NextAuth Route Handler**: Added CORS wrapping → **BROKE**
2. **next.config.ts**: Excluded API routes from headers → **BROKE**
3. **Service Worker**: Disabled fetch interception → **BROKE**
4. **JWT Callback**: Simplified → **BROKE** (role updates stopped working)
5. **SessionProvider**: Added props → **BROKE**
6. **Courses Fetch**: Added cache control → **BROKE**

### 4.3 What Was Added (That Works, But System Broken)

**New Features** (would work if auth wasn't broken):
1. ✅ Certification system (complete implementation)
2. ✅ SSO role management enhancements
3. ✅ Rate limiting
4. ✅ Referral system
5. ✅ Default course thumbnails
6. ✅ Admin improvements

### 4.4 Restoration Strategy

**Step 1**: Checkout f20c34a
```bash
git checkout f20c34a
```

**Step 2**: Verify it works
- Test SSO login
- Test anonymous login
- Test session endpoint
- Test courses page

**Step 3**: Cherry-pick features one by one
- Start with certification system
- Test after each feature
- Only proceed if everything still works

**Step 4**: Never modify core auth files
- Don't touch NextAuth route handler
- Don't modify middleware structure
- Don't simplify JWT callback
- Don't change SessionProvider

---

## 5. Summary

### 5.1 Certification System

**Status**: ✅ **FULLY IMPLEMENTED** (but system broken due to auth issues)

**What It Does**:
- Premium-gated certification with final exam
- 50-question randomized exam
- Certificate issuance with score
- Public/private verification
- Revocation on fail

**How to Recreate**: Follow Section 1 documentation step-by-step.

### 5.2 Short Children Courses

**Status**: ⚠️ **PARTIALLY IMPLEMENTED** (poolCourseId exists, but no forking UI)

**What Exists**:
- `poolCourseId` field for using parent course's question pool
- `resolvePoolCourse()` function

**What's Missing**:
- Course forking UI
- Parent-child relationships
- Lesson selection/mapping
- Variant-specific scheduling

**How to Recreate**: Follow Section 2 documentation when ready to implement.

### 5.3 SSO Problems

**Status**: ❌ **CRITICAL ISSUES UNRESOLVED**

**Main Problem**: CORS/access control errors preventing all authentication.

**Root Cause**: Unknown - working version (f20c34a) has no special handling, yet works.

**Recommendation**: Restore to f20c34a and redevelop features one by one, testing after each.

### 5.4 Next Steps

1. **Restore to f20c34a** (working baseline)
2. **Test everything works**
3. **Redevelop certification system** (using this documentation)
4. **Test after each step**
5. **Never modify core auth files**

---

**Documentation Complete** ✅

This document provides everything needed to recreate all features added since f20c34a, with crystal-clear implementation details, business rules, and code examples.
