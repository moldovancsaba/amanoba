# Amanoba Course System & Customer Journey

**Complete Guide**: Course structure, database storage, customer journey, profiles, certificates, and public sharing.

**Generated**: 2026-08-05
**Purpose**: Deep understanding of how courses, learners, and certificates work together

---

## Table of Contents

1. [Course Structure & Database](#1-course-structure--database)
2. [Lesson Structure & Daily Delivery](#2-lesson-structure--daily-delivery)
3. [Customer Journey - Complete Flow](#3-customer-journey---complete-flow)
4. [Progress Tracking](#4-progress-tracking)
5. [Certification System](#5-certification-system)
6. [Profile System](#6-profile-system)
7. [Public Sharing & Social Media](#7-public-sharing--social-media)
8. [Database Schema Summary](#8-database-schema-summary)
9. [API Endpoints Reference](#9-api-endpoints-reference)
10. [Key Business Rules](#10-key-business-rules)

---

## 1. Course Structure & Database

### Course Model (`app/lib/models/course.ts`)

**Database Collection**: `courses`

**Core Fields**:
```typescript
{
  courseId: string;              // Unique identifier (e.g., "PRODUCTIVITY_2026_HU")
  name: string;                  // Display name
  description: string;           // Course overview
  language: string;              // Primary language (hu, en, etc.)
  thumbnail?: string;            // Course image URL
  durationDays: number;          // Planned lesson count (fallback)
  isActive: boolean;             // Published/unpublished
  requiresPremium: boolean;      // Access control
  brandId: ObjectId;             // Multi-tenancy
  
  // Pricing (if premium)
  price?: {
    amount: number;              // Price in cents (2999 = $29.99)
    currency: string;            // 'USD', 'EUR', 'HUF', 'GBP'
  };
  
  // Gamification rewards
  pointsConfig: {
    completionPoints: number;    // Awarded on course completion
    lessonPoints: number;        // Awarded per lesson
    perfectCourseBonus?: number; // Bonus for completing all lessons
  };
  xpConfig: {
    completionXP: number;        // XP on course completion
    lessonXP: number;            // XP per lesson
  };
  
  // Prerequisites (optional)
  prerequisiteCourseIds?: ObjectId[];
  prerequisiteEnforcement?: 'hard' | 'soft';  // hard = block enroll; soft = warn
  
  // Quiz policy (course-level authority)
  lessonQuizPolicy?: {
    enabled?: boolean;           // Quiz enabled for lessons
    required?: boolean;          // Must pass to proceed
    questionCount?: number;      // Questions per quiz (1-50)
    shownAnswerCount?: number;   // Answer options shown (2-4)
    maxWrongAllowed?: number;    // Max errors before fail (0-10)
    successThreshold?: number;   // Pass percentage (0-100)
  };
  
  // Certification configuration
  certification?: {
    enabled: boolean;                      // Course has final exam/cert
    poolCourseId?: string;                 // Question pool course
    certQuestionCount?: number;            // Final exam question count
    passThresholdPercent?: number;         // Min score to pass (0-100)
    maxErrorPercent?: number;              // Fail if error rate exceeds this
    requireAllLessonsCompleted?: boolean;  // Must complete all lessons
    requireAllQuizzesPassed?: boolean;     // Must pass all quizzes
    
    // Pricing for certificate access
    priceMoney?: { amount: number; currency: string };
    pricePoints?: number;
    premiumIncludesCertification?: boolean;
    
    // Template assignment
    templateId?: string;                   // Single template ID
    templateVariantIds?: string[];         // A/B test variants
    templateVariantWeights?: number[];     // Weighted random (optional)
    credentialTitleId?: string;            // Credential phrase ID
  };
  
  // Feature toggles
  discussionEnabled?: boolean;
  leaderboardEnabled?: boolean;
  studyGroupsEnabled?: boolean;
  
  // Short courses (optional)
  parentCourseId?: string;             // Parent course ID
  selectedLessonIds?: string[];        // Subset of parent lessons
  courseVariant?: string;              // 'essentials', 'beginner', etc.
  ccsId?: string;                      // Canonical course spec ID
  isDraft?: boolean;                   // Draft until published
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Indexes**:
- `courseId` (unique)
- `isActive`
- `requiresPremium`
- `brandId`
- `language`
- Compound: `brandId + isActive`, `brandId + language + isActive`

---

## 2. Lesson Structure & Daily Delivery

### Lesson Model (`app/lib/models/lesson.ts`)

**Database Collection**: `lessons`

**Core Fields**:
```typescript
{
  lessonId: string;              // Unique identifier
  courseId: ObjectId;            // Parent course reference
  dayNumber: number;             // Lesson position (1, 2, 3, ...)
  language: string;              // Lesson language (must match course)
  
  // Content
  title: string;                 // Lesson title
  content: string;               // Markdown lesson content
  
  // Email delivery
  emailSubject: string;          // Email subject line template
  emailBody: string;             // Email body template (Markdown)
  
  // Quiz configuration (compatibility only)
  // Runtime authority is course.lessonQuizPolicy
  quizConfig?: {
    enabled: boolean;
    successThreshold: number;    // Legacy snapshot
    questionCount: number;       // Legacy snapshot
    poolSize: number;            // Informational
    required: boolean;           // Legacy snapshot
  };
  
  // Unlock conditions
  unlockConditions?: {
    requirePreviousLesson?: boolean;
    requireMinimumDay?: number;
    requireCourseStart?: boolean;
  };
  
  // Rewards
  pointsReward: number;          // Points for completing lesson
  xpReward: number;              // XP for completing lesson
  
  isActive: boolean;             // Published/unpublished
  displayOrder: number;          // Order within day (for multiple lessons per day)
  
  // Metadata (optional)
  metadata?: {
    estimatedMinutes?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
    resources?: Array<{
      title: string;
      url: string;
      type: 'article' | 'video' | 'document' | 'external';
    }>;
  };
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Indexes**:
- `lessonId` (unique)
- `courseId`
- `courseId + dayNumber`
- `courseId + dayNumber + displayOrder`
- `courseId + language + dayNumber`

**Content Structure Grammar** (from `layout_grammar.md`):
1. **Introduction** — context and why it matters
2. **Main content** — concepts and procedures (aligned to CCS)
3. **Summary** — short recap
4. **Action items** — concrete next steps

**Quality Standards**:
- 20–30 min reading time
- Clear structure, specific and actionable
- No fluff
- Same language as course (language integrity)
- Email fields (`emailSubject`, `emailBody`) must be in-language (no English leakage)

---

## 3. Customer Journey - Complete Flow

### Phase 1: Discovery & Enrollment

**1. Browse Courses**
- **Page**: `/[locale]/courses`
- **Data**: Fetches active courses matching user's locale
- **Filters**: Language, difficulty, category, premium status
- **Display**: Course cards with thumbnail, title, description, duration, rewards

**2. View Course Details**
- **Page**: `/[locale]/courses/[courseId]`
- **Data Fetched**:
  - Course info (name, description, duration, rewards)
  - Enrollment status (enrolled, current day, completion %)
  - Entitlement status (certification available, owned, pricing)
  - Lessons list (titles, estimated time, quiz status)
  - Prerequisites (if any)
- **Actions**:
  - Enroll (free courses): Creates `CourseProgress` record
  - Purchase (premium courses): Stripe checkout → Enroll on success
  - Resume (enrolled): Navigate to current lesson
  - Continue (enrolled): Navigate to next incomplete lesson

**3. Enrollment Process**
```typescript
// API: POST /api/enroll/[courseId]
// Creates CourseProgress record:
{
  playerId: ObjectId,              // Current user
  courseId: ObjectId,              // Selected course
  currentDay: 1,                   // Start at lesson 1
  completedDays: [],               // Empty initially
  startedAt: new Date(),           // Enrollment timestamp
  status: 'in_progress',
  totalPointsEarned: 0,
  totalXPEarned: 0,
  emailSentDays: [],              // Track email delivery
}
```

---

### Phase 2: Learning Journey

**1. Daily Lesson Access**
- **Page**: `/[locale]/courses/[courseId]/day/[dayNumber]`
- **Access Control**:
  - Must be enrolled
  - Previous lesson must be completed (if `unlockConditions.requirePreviousLesson`)
  - Premium course requires premium access or payment
- **Content**:
  - Lesson title and content (rendered Markdown)
  - Estimated reading time
  - Navigation to previous/next lessons
  - Quiz access (if `lessonQuizPolicy.enabled`)
  - Resources and metadata

**2. Lesson Quiz (Optional)**
- **Page**: `/[locale]/courses/[courseId]/day/[dayNumber]/quiz`
- **Behavior** (governed by `course.lessonQuizPolicy`):
  - `enabled`: Show quiz button
  - `required`: Must pass to mark lesson complete
  - `questionCount`: Number of questions shown (e.g., 7)
  - `maxWrongAllowed`: Max errors before fail (e.g., 2)
  - `successThreshold`: Pass percentage (e.g., 70%)
- **Questions**:
  - Fetched from quiz question pool for this lesson
  - Minimum 7 valid questions per lesson
  - Cognitive mix: 0 RECALL, minimum 5 APPLICATION, minimum 2 CRITICAL_THINKING
  - 4 options per question (1 correct + 3 plausible distractors)
- **Pass/Fail**:
  - Pass: Lesson marked complete, rewards awarded
  - Fail: Can retry (no limit)

**3. Lesson Completion**
```typescript
// API: POST /api/courses/[courseId]/lessons/[dayNumber]/complete
// Updates CourseProgress:
{
  completedDays: [...prev, dayNumber],  // Add to completed
  currentDay: dayNumber + 1,            // Advance to next
  totalPointsEarned: +lesson.pointsReward,
  totalXPEarned: +lesson.xpReward,
  lastAccessedAt: new Date(),
  // If all lessons complete:
  completedAt: new Date(),
  status: 'completed',
  totalPointsEarned: +course.pointsConfig.completionPoints,
  totalXPEarned: +course.xpConfig.completionXP,
}
```

**4. Email Delivery (Daily Lessons)**
- **Background Worker**: `scripts/start-workers.ts`
- **Trigger**: Scheduled job (daily, based on user timezone and `emailPreferences`)
- **Logic**:
  - Fetch players with `emailPreferences.receiveLessonEmails = true`
  - For each enrolled course:
    - Check if current day lesson should be sent
    - Check if email not already sent (`!emailSentDays.includes(currentDay)`)
    - Send email with lesson content
    - Update `courseProgress.emailSentDays.push(currentDay)`
- **Email Content**:
  - Subject: `lesson.emailSubject`
  - Body: `lesson.emailBody` (rendered Markdown → HTML)
  - Includes lesson content, links to platform, unsubscribe link

---

### Phase 3: Course Completion

**1. Complete All Lessons**
- **Trigger**: Last lesson marked complete
- **Updates**:
  - `courseProgress.status = 'completed'`
  - `courseProgress.completedAt = new Date()`
  - Completion points/XP awarded
  - Perfect course bonus (if all lessons completed without skipping)
- **Unlock**: Certification access (if `course.certification.enabled`)

**2. View Progress**
- **Page**: `/[locale]/my-courses`
- **Display**:
  - Enrolled courses with progress bars
  - Completed days / total days
  - Current lesson link
  - Certificate status (if eligible)
  - Course completion badge

---

### Phase 4: Certification

**1. Eligibility Check**
```typescript
// API: GET /api/profile/[playerId]/certificate-status?courseId=X
// Requirements (from course.certification):
{
  requireAllLessonsCompleted: true,     // All lessons must be done
  requireAllQuizzesPassed: true,        // All quizzes must be passed
  entitlementRequired: true/false,      // Need to purchase cert access
}
```

**2. Purchase Entitlement (If Required)**
- **API**: POST `/api/courses/[courseId]/certification/purchase`
- **Payment Options**:
  - Money: Stripe checkout (`certification.priceMoney`)
  - Points: Deduct from wallet (`certification.pricePoints`)
  - Included in Premium: Auto-granted if `premiumIncludesCertification`
- **Creates**: `CertificateEntitlement` record
```typescript
{
  playerId: ObjectId,
  courseId: ObjectId,
  source: 'PAID' | 'POINTS' | 'INCLUDED_IN_PREMIUM',
  money?: { amount, currency, paymentReference },
  pointsSpent?: number,
  entitledAtISO: new Date().toISOString(),
}
```

**3. Take Final Exam**
- **Page**: `/[locale]/courses/[courseId]/final-exam`
- **Questions**:
  - Pulled from `poolCourseId` question bank
  - Count: `certification.certQuestionCount` (e.g., 50)
  - Random selection each attempt
- **Scoring**:
  - `passThresholdPercent`: Minimum score to pass (e.g., 80%)
  - `maxErrorPercent`: Fail immediately if error rate exceeds (e.g., 10%)
- **Pass**: Certificate issued automatically
- **Fail**: Can retake (no limit)

**4. Certificate Issuance**
```typescript
// API: POST /api/courses/[courseId]/certification/issue
// Creates Certificate record:
{
  certificateId: string,              // UUID
  certificateNumber?: string,         // Sequential number (optional)
  playerId: string,                   // Recipient
  recipientName: string,              // From player.displayName
  courseId: string,
  courseTitle: string,
  locale: 'en' | 'hu',
  
  // Template assignment
  designTemplateId: string,           // Selected from templateVariantIds
  credentialId: string,               // Credential phrase
  completionPhraseId: string,         // Completion phrase
  deliverableBulletIds: string[],     // Learning outcomes
  
  // Issuance
  issuedAtISO: string,                // Issue date
  awardedPhraseId: string,            // Award phrase
  
  // Verification
  verificationSlug: string,           // Unique slug for public URL
  pdfAssetPath?: string,              // Generated PDF path
  imageAssetPath?: string,            // Generated image path
  
  // Exam results
  finalExamScorePercentInteger?: number,
  lastAttemptId?: string,
  
  // Privacy
  isPublic?: boolean,                 // Default true
  isRevoked?: boolean,                // Default false
  revokedAtISO?: string,
  revokedReason?: string,
}
```

**Template Assignment (A/B Testing)**:
- If `certification.templateVariantIds.length > 1`:
  - Assign variant using stable hash of `playerId + courseId`
  - Ensures same user always sees same template
- If `templateVariantWeights` provided:
  - Use weighted random selection
- Otherwise: Use first template in array

**5. Certificate Rendering**
- **Data Sources**:
  - `app/lib/constants/certificate-colors.ts` - Color schemes
  - `app/lib/constants/certificate-strings.ts` - Localized phrases
  - `app/lib/models/certificate-template.ts` - Template definitions
- **Generated Assets**:
  - PDF: High-resolution certificate (for download/print)
  - Image: Web-optimized version (for sharing)
  - Stored in CDN or static assets

---

## 4. Progress Tracking

### CourseProgress Model (`app/lib/models/course-progress.ts`)

**Database Collection**: `course_progress`

**Unique Constraint**: `playerId + courseId` (one progress record per player per course)

**Status Flow**:
```
NOT_STARTED → IN_PROGRESS → COMPLETED
           ↘ ABANDONED (optional)
```

**Progress Calculation**:
```typescript
// Completion percentage
const completionPercent = (completedDays.length / totalLessons) * 100;

// Current lesson
const currentDay = Math.max(...completedDays) + 1;

// Is completed
const isCompleted = completedDays.length === totalLessons && completedAt !== null;
```

**Pre-save Hook** (automatic status update):
```typescript
// If no completed days → NOT_STARTED
// If completedAt is set → COMPLETED
// Otherwise → IN_PROGRESS

// Set currentDay to next incomplete day
```

---

## 5. Certification System

### Certificate Entitlement (`app/lib/models/certificate-entitlement.ts`)

**Purpose**: Gates access to final certification exam per course and player.

**Collection**: `certificate_entitlements`

**Unique Constraint**: `playerId + courseId`

**Sources**:
1. **PAID**: Purchased with money (Stripe)
2. **POINTS**: Purchased with platform points
3. **INCLUDED_IN_PREMIUM**: Auto-granted for premium members

### Certificate (`app/lib/models/certificate.ts`)

**Purpose**: Immutable snapshot of issued certificate for verification and sharing.

**Collection**: `certificates`

**Unique Fields**:
- `certificateId`: UUID (unique)
- `verificationSlug`: Public verification URL slug (unique)

**Privacy Control**:
- `isPublic`: true (anyone can view) | false (only owner)
- Default: `true` (public by default)
- Owner can toggle via PATCH `/api/certificates/[slug]`

**Revocation**:
- `isRevoked`: true | false
- `revokedAtISO`: timestamp
- `revokedReason`: explanation
- Revoked certificates still display but show revoked status

### Certificate Verification API (`app/api/certificates/[slug]/route.ts`)

**GET `/api/certificates/[slug]`**:
- **Public certificate**: Returns full data
- **Private certificate**: Only returns if user is owner (otherwise 404)
- **Revoked certificate**: Returns with revoked status (public info)
- **Not found**: 404 (don't reveal existence)

**PATCH `/api/certificates/[slug]`**:
- **Owner only**: Toggle `isPublic` flag
- **Body**: `{ isPublic: boolean }`
- **Returns**: Updated certificate

---

## 6. Profile System

### Player Model (`app/lib/models/player.ts`)

**Database Collection**: `players`

**Core Fields**:
```typescript
{
  ssoSub?: string;                 // SSO identifier (unique)
  displayName: string;             // Public name
  email?: string;                  // Contact email
  profilePicture?: string;         // Avatar URL
  isPremium: boolean;              // Premium status
  premiumExpiresAt?: Date;
  isAnonymous: boolean;            // Guest account flag
  authProvider: 'sso' | 'anonymous';
  role: 'user' | 'admin';
  brandId: ObjectId;
  locale: string;                  // UI language (hu, en, etc.)
  timezone?: string;
  
  // Email preferences
  emailPreferences?: {
    receiveLessonEmails: boolean;
    emailFrequency: 'daily' | 'weekly' | 'never';
    preferredEmailTime?: number;   // Hour of day (0-23)
    timezone?: string;
  };
  unsubscribeToken?: string;       // One-click unsubscribe
  
  // Payment
  stripeCustomerId?: string;       // Stripe Customer ID
  paymentHistory?: ObjectId[];     // PaymentTransaction references
  
  // Survey & recommendations
  surveyCompleted?: boolean;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  interests?: string[];
  
  // Profile visibility (see PUBLIC_PROFILE_SCHEMA.md)
  profileVisibility?: 'public' | 'private';
  profileSectionVisibility?: {
    about?: 'public' | 'private';
    courses?: 'public' | 'private';
    achievements?: 'public' | 'private';
    certificates?: 'public' | 'private';
    stats?: 'public' | 'private';
  };
  
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
```

### Profile Page (`app/[locale]/profile/[playerId]/page.tsx`)

**Route**: `/[locale]/profile/[playerId]`

**Privacy Rules**:
- **profileVisibility = 'private'**: Non-owners see 404
- **profileVisibility = 'public'**: Show profile with per-section visibility
- **profileSectionVisibility**: Granular control per section

**Tabs**:
1. **Overview** (all users):
   - Level, title, XP progress
   - Completed courses count
   - Lessons completed count
   - Certificates count
   - Points wallet (current, lifetime earned, lifetime spent)
   - Featured achievements

2. **Certificates** (public if section visible):
   - List of earned certificates
   - Course title, score, issue date
   - "Copy link" button (copies `/{locale}/certificate/{verificationSlug}`)
   - "View Certificate" button

3. **Achievements** (public if section visible):
   - Achievement progress percentage
   - Featured achievements with tiers (common, rare, epic, legendary)
   - Unlock dates

4. **Payments** (owner only):
   - Payment history (transactions)
   - Course purchases, premium subscriptions
   - Payment method, amounts, dates

5. **Profile settings** (owner only):
   - Change profile photo
   - Edit display name
   - Profile visibility (public/private/friends)
   - Language preference (redirects to new locale)
   - Email preferences

**Data Fetched**:
```typescript
// API: GET /api/profile/[playerId]
{
  player: {
    id, displayName, profilePicture, level, isPremium, profileVisibility, locale
  },
  progression: {
    level, title, currentXP, xpToNextLevel, nextTitle
  },
  statistics: {
    totalGamesPlayed, winRate, highestScore, perfectGames, averageSessionTime
  },
  achievements: {
    unlocked, total, progress, featured[]
  },
  streaks: {
    win: { current, longest },
    daily: { current, longest }
  },
  wallet: {
    currentBalance, lifetimeEarned, lifetimeSpent
  }
}

// API: GET /api/profile/[playerId]/courses
{ courses: [ { courseId, title, language, completedDays, totalDays, isCompleted } ] }

// API: GET /api/profile/[playerId]/certificate-status?courseId=X
{ certificateEligible, finalExamScore, verificationSlug }
```

---

## 7. Public Sharing & Social Media

### Public Certificate Page

**Route**: `/[locale]/certificate/[slug]`

**Purpose**: Public verification page for certificate authenticity

**Display**:
- Certificate verified badge (if valid)
- Recipient name
- Course title
- Certificate ID
- Issue date
- Final exam score (if available)
- Privacy status badge (Public/Private)
- Owner controls (if logged in as owner):
  - Toggle public/private button
  - "View Full Certificate" link

**Sharing Features**:
1. **Shareable URL**: `https://www.amanoba.com/{locale}/certificate/{verificationSlug}`
2. **Copy Link Button**: Copies URL to clipboard
3. **Privacy Toggle**: Owner can make public/private anytime
4. **LinkedIn Sharing**:
   - URL can be pasted in LinkedIn "Add credential" or post
   - Certificate page has OpenGraph meta tags (title, description, image)
   - Example: "I earned a certificate in {courseTitle} from Amanoba!"
5. **Other Social Media**:
   - Twitter/X: Share link with custom message
   - Facebook: Post with certificate link
   - Email: Send certificate link to employers/contacts

### Public Profile Sharing

**Route**: `/[locale]/profile/[playerId]`

**Purpose**: Showcase learner achievements, courses, and certificates

**Sharing Use Cases**:
1. **LinkedIn Profile**: Add URL to "Featured" or "About" section
2. **Resume/CV**: Include profile URL
3. **Portfolio**: Link to profile from personal website
4. **Job Applications**: Share profile with recruiters

**What's Visible** (when public):
- Display name, profile picture, level, title
- XP progress
- Completed courses count
- Lessons completed count
- Certificates (with verification links)
- Achievements (featured badges)
- Points wallet (if section public)

### OpenGraph Meta Tags (SEO/Social)

**Certificate Pages**:
```html
<meta property="og:title" content="Certificate: {courseTitle} - {recipientName}" />
<meta property="og:description" content="Verified certificate from Amanoba Learning Platform" />
<meta property="og:image" content="{certificate.imageAssetPath}" />
<meta property="og:url" content="https://www.amanoba.com/{locale}/certificate/{slug}" />
<meta property="og:type" content="article" />
```

**Profile Pages**:
```html
<meta property="og:title" content="{displayName}'s Profile - Amanoba" />
<meta property="og:description" content="View {displayName}'s learning achievements and certificates" />
<meta property="og:image" content="{profilePicture}" />
<meta property="og:url" content="https://www.amanoba.com/{locale}/profile/{playerId}" />
<meta property="og:type" content="profile" />
```

### LinkedIn Certificate Integration

**Steps for Learners**:
1. Complete course and pass final exam
2. Navigate to profile → Certificates tab
3. Click "Copy link" on certificate
4. Go to LinkedIn → Add credential to profile
5. Paste certificate URL
6. LinkedIn automatically fetches title, description, image from OpenGraph tags

**Certificate URL Structure**:
- Public: `/{locale}/certificate/{verificationSlug}`
- Verification: Anyone can visit and verify authenticity
- Revocation-aware: Shows revoked status if certificate is revoked

---

## 8. Database Schema Summary

### Collections

| Collection | Purpose | Unique Constraint |
|------------|---------|-------------------|
| `courses` | Course definitions | `courseId` |
| `lessons` | Lesson content | `lessonId` |
| `course_progress` | Player progress | `playerId + courseId` |
| `players` | User accounts | `ssoSub` |
| `certificates` | Issued certificates | `certificateId`, `verificationSlug` |
| `certificate_entitlements` | Cert access gates | `playerId + courseId` |
| `quiz_questions` | Quiz question pool | `questionId` |
| `certificate_templates` | Cert design templates | `templateId` |

### Relationships

```
Player (1) ─→ (Many) CourseProgress
CourseProgress (Many) ─→ (1) Course
Course (1) ─→ (Many) Lesson
Player (1) ─→ (Many) Certificate
Certificate (Many) ─→ (1) Course
Player (1) ─→ (Many) CertificateEntitlement
CertificateEntitlement (Many) ─→ (1) Course
```

### Indexes (Performance-Critical)

**course_progress**:
- `playerId + courseId` (unique, enrollment lookup)
- `playerId` (player's courses)
- `courseId` (course enrollments)
- `status` (active learners)
- `completedAt` (completion tracking)

**certificates**:
- `certificateId` (unique, certificate lookup)
- `verificationSlug` (unique, public verification)
- `playerId` (player's certificates)
- `courseId` (course certificates)
- `playerId + courseId + verificationSlug` (composite)

**players**:
- `ssoSub` (unique, SSO login)
- `email` (sparse, contact lookup)
- `unsubscribeToken` (sparse, email unsub)
- `stripeCustomerId` (sparse, payment lookup)

---

## 9. API Endpoints Reference

### Course Management

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/courses` | GET | List active courses (filtered by locale) |
| `/api/courses/[courseId]` | GET | Get course details |
| `/api/enroll/[courseId]` | POST | Enroll in course (creates CourseProgress) |
| `/api/courses/[courseId]/lessons/[dayNumber]` | GET | Get lesson content |
| `/api/courses/[courseId]/lessons/[dayNumber]/complete` | POST | Mark lesson complete |
| `/api/courses/[courseId]/lessons/[dayNumber]/quiz` | GET | Get quiz questions |
| `/api/courses/[courseId]/lessons/[dayNumber]/quiz/submit` | POST | Submit quiz answers |

### Certification

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/courses/[courseId]/certification/status` | GET | Check cert eligibility |
| `/api/courses/[courseId]/certification/purchase` | POST | Purchase cert entitlement |
| `/api/courses/[courseId]/final-exam` | GET | Get final exam questions |
| `/api/courses/[courseId]/final-exam/submit` | POST | Submit final exam answers |
| `/api/courses/[courseId]/certification/issue` | POST | Issue certificate (auto on pass) |
| `/api/certificates/[slug]` | GET | Get certificate by slug |
| `/api/certificates/[slug]` | PATCH | Toggle certificate privacy |

### Profile

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/profile` | PATCH | Update profile (displayName, locale, visibility) |
| `/api/profile/photo` | POST | Upload profile photo |
| `/api/profile/[playerId]` | GET | Get public profile data |
| `/api/profile/[playerId]/courses` | GET | Get enrolled courses |
| `/api/profile/[playerId]/certificate-status` | GET | Check certificate status for course |
| `/api/payments/history` | GET | Get payment history (owner only) |

---

## 10. Key Business Rules

### Access Control

1. **Course Enrollment**:
   - Free courses: Anyone can enroll
   - Premium courses: Requires `isPremium = true` OR purchase
   - Prerequisites: If `prerequisiteCourseIds` set:
     - `hard`: Must complete prerequisites before enrolling
     - `soft`: Show warning but allow enrollment

2. **Lesson Access**:
   - Must be enrolled in course
   - Previous lesson must be completed (if `unlockConditions.requirePreviousLesson`)
   - Course must be active (`isActive = true`)

3. **Quiz Access**:
   - Enabled if `course.lessonQuizPolicy.enabled = true`
   - Required if `course.lessonQuizPolicy.required = true`
   - Pass threshold: `course.lessonQuizPolicy.successThreshold` (e.g., 70%)
   - Max errors: `course.lessonQuizPolicy.maxWrongAllowed` (e.g., 2)

4. **Certification Access**:
   - Course must have `certification.enabled = true`
   - Requirements from `course.certification`:
     - `requireAllLessonsCompleted`: All lessons must be done
     - `requireAllQuizzesPassed`: All quizzes must be passed
   - Entitlement:
     - If `premiumIncludesCertification`: Auto-granted for premium
     - Else: Purchase with money or points

5. **Profile Visibility**:
   - `private`: Non-owners get 404
   - `public`: Show profile with per-section visibility
   - Sections: about, courses, achievements, certificates, stats

6. **Certificate Privacy**:
   - `isPublic = true`: Anyone can view
   - `isPublic = false`: Only owner can view (others get 404)
   - Owner can toggle anytime

### Gamification Rules

1. **Points/XP Rewards**:
   - Lesson completion: `lesson.pointsReward` + `lesson.xpReward`
   - Course completion: `course.pointsConfig.completionPoints` + `course.xpConfig.completionXP`
   - Perfect course bonus: `course.pointsConfig.perfectCourseBonus` (if all lessons completed without skip)

2. **Progression**:
   - Level up based on total XP
   - Title changes with level (Rookie → Novice → Expert → Master → Legend)
   - XP required for next level increases exponentially

3. **Achievements**:
   - Unlocked based on actions (first course, 10 lessons, perfect quiz, etc.)
   - Tiers: common, rare, epic, legendary
   - Featured achievements shown on profile

### Email Delivery Rules

1. **Opt-in Required**: `emailPreferences.receiveLessonEmails = true`
2. **Frequency**: `daily`, `weekly`, or `never`
3. **Timing**: `preferredEmailTime` (hour of day, 0-23) + `timezone`
4. **Deduplication**: Check `emailSentDays` array (don't send duplicate for same lesson)
5. **Unsubscribe**: One-click via `unsubscribeToken` in email footer
6. **Content**: Lesson content rendered from Markdown → HTML

### Course Building Rules

1. **Language Integrity**:
   - Course language must match lesson language
   - Email fields must be in-language (no English leakage)
   - Translations must be fully in-language

2. **Lesson Count**:
   - `durationDays` is fallback; actual length derived from active lessons
   - Short courses: Subset of parent lessons via `selectedLessonIds`

3. **Quiz Requirements** (per lesson):
   - Minimum 7 valid questions
   - 0 RECALL, minimum 5 APPLICATION, minimum 2 CRITICAL_THINKING
   - 4 options per question (1 correct + 3 plausible distractors)

4. **Canonical Course Spec (CCS)**:
   - Designer courses follow CCS in `docs/canonical/<COURSE_FAMILY>/`
   - Localized courses must align with CCS
   - Drift is either defect or version change

### Certificate Validity

1. **Immutable**: Once issued, certificate data frozen (except privacy and revocation)
2. **Revocation**:
   - Sets `isRevoked = true`
   - Certificate still visible but shows revoked status
   - Revocation reason logged
3. **Verification**:
   - Public URL: `/{locale}/certificate/{verificationSlug}`
   - Unique slug prevents guessing
   - Privacy-aware: Private certs only visible to owner

---

## Summary Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         AMANOBA CUSTOMER JOURNEY                 │
└─────────────────────────────────────────────────────────────────┘

┌───────────────┐
│  1. DISCOVERY │
│               │
│ Browse courses│
│ View details  │
│ Check prereqs │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ 2. ENROLLMENT │
│               │
│ Free: Enroll  │
│ Premium: Pay  │
│  → Stripe     │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  3. LEARNING  │
│               │
│ Day 1 Lesson  │
│  → Read       │
│  → Quiz       │
│  → Complete   │
│               │
│ Day 2 Lesson  │
│  → Read       │
│  → Quiz       │
│  → Complete   │
│               │
│  ... (repeat) │
│               │
│ Day N Lesson  │
│  → Complete   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ 4. COMPLETION │
│               │
│ All lessons ✓ │
│ All quizzes ✓ │
│ Rewards +     │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│5. CERTIFICATE │
│               │
│ Check eligible│
│ Buy access?   │
│ Final exam    │
│  → Pass       │
│  → Issued ✓   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  6. SHARING   │
│               │
│ Public profile│
│ Copy cert link│
│ LinkedIn      │
│ Social media  │
└───────────────┘
```

---

**End of Document**

This comprehensive guide covers the complete course system, customer journey, database structure, profiles, certificates, and public sharing mechanisms in Amanoba. All information is based on actual code and database models as of 2026-08-05.
