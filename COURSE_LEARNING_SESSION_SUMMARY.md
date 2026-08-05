# Course System Learning Session - Summary

**Date**: 2026-08-05
**Session**: Deep dive into Amanoba course system, customer journey, profiles, and certificates

---

## What Was Learned

### 1. Course Structure

**Database**: `courses` collection (MongoDB)

**Key Insights**:
- Flexible course lengths (1 to any number of lessons)
- Multi-language support (17 locales)
- Premium access control with Stripe integration
- Gamification: points and XP rewards per lesson and completion
- Prerequisites: hard (block) or soft (warn) enforcement
- Short courses: Subsets of parent courses via `selectedLessonIds`
- Quiz policy at course level (not lesson level) - **CRITICAL**
- Certification configuration embedded in course model

### 2. Lesson Structure

**Database**: `lessons` collection

**Key Insights**:
- Stored as Markdown (rendered to HTML for display/email)
- Each lesson has `dayNumber` (position in course, starts at 1)
- Email templates embedded: `emailSubject` and `emailBody`
- Quiz config on lesson is **compatibility-only** - runtime authority is `course.lessonQuizPolicy`
- Unlock conditions control sequential access
- Language integrity enforced: lesson language must match course

**Content Grammar** (mandatory structure):
1. Introduction
2. Main content (concepts and procedures)
3. Summary
4. Action items

### 3. Customer Journey - Complete Flow

**Phase 1: Discovery & Enrollment**
- Browse courses (`/[locale]/courses`)
- View details (`/[locale]/courses/[courseId]`)
- Free: Enroll immediately
- Premium: Stripe checkout → Enroll on success
- Creates `CourseProgress` record with `startedAt`, `currentDay=1`, `status='in_progress'`

**Phase 2: Learning**
- Access daily lessons (`/[locale]/courses/[courseId]/day/[dayNumber]`)
- Read content (20-30 min estimate)
- Take quiz (if `lessonQuizPolicy.enabled`)
  - Minimum 7 questions
  - Cognitive mix: 0 RECALL, 5+ APPLICATION, 2+ CRITICAL_THINKING
  - Pass: `successThreshold` (e.g., 70%)
  - Max errors: `maxWrongAllowed` (e.g., 2)
- Mark complete → Rewards awarded (points + XP)
- Email delivery via background workers (scheduled, timezone-aware)

**Phase 3: Completion**
- All lessons complete → `courseProgress.status = 'completed'`
- Completion rewards: course points + XP + bonus (if perfect)
- Unlocks certification access (if enabled)

**Phase 4: Certification**
- Eligibility check: all lessons done, all quizzes passed
- Purchase entitlement (if required):
  - Money (Stripe)
  - Points (wallet deduction)
  - Included in premium (auto-granted)
- Take final exam (`certQuestionCount` questions from pool)
- Pass: Certificate issued automatically
  - UUID `certificateId`
  - Unique `verificationSlug` for public URL
  - Template assigned (A/B testing via stable hash)
  - PDF and image assets generated
- Fail: Can retake (no limit)

### 4. Progress Tracking

**Database**: `course_progress` collection

**Unique Constraint**: `playerId + courseId` (one progress per player per course)

**Status Flow**: `NOT_STARTED` → `IN_PROGRESS` → `COMPLETED`

**Fields Tracked**:
- `currentDay`: Next lesson to take
- `completedDays`: Array of completed lesson numbers
- `emailSentDays`: Email delivery tracking
- `totalPointsEarned`, `totalXPEarned`: Gamification
- `lastAccessedAt`: Last activity timestamp
- `completedAt`: Course completion timestamp (null if incomplete)

**Auto-calculated** (pre-save hook):
- Status derived from completedDays and completedAt
- currentDay advanced to next incomplete

### 5. Certification System

**Three Models**:

1. **CertificateEntitlement** (`certificate_entitlements`)
   - Purpose: Gates access to final exam
   - Unique: `playerId + courseId`
   - Sources: PAID, POINTS, INCLUDED_IN_PREMIUM

2. **Certificate** (`certificates`)
   - Purpose: Immutable snapshot of issued certificate
   - Unique: `certificateId` (UUID), `verificationSlug` (slug)
   - Privacy: `isPublic` (owner can toggle)
   - Revocation: `isRevoked` (admin action)
   - Assets: `pdfAssetPath`, `imageAssetPath`

3. **CertificateTemplate** (`certificate_templates`)
   - Purpose: Design templates for rendering
   - A/B testing: Multiple variants per course
   - Assignment: Stable hash of `playerId + courseId`

**Verification API**:
- `GET /api/certificates/[slug]`: Public verification
  - Public cert: Anyone can view
  - Private cert: Only owner (else 404)
  - Revoked cert: Shows revoked status
- `PATCH /api/certificates/[slug]`: Toggle privacy (owner only)

### 6. Profile System

**Database**: `players` collection

**Key Fields**:
- `displayName`: Public name (shown on profile, certificates)
- `profilePicture`: Avatar URL
- `isPremium`, `premiumExpiresAt`: Access control
- `locale`: UI language (17 supported)
- `emailPreferences`: Lesson email settings (frequency, time, timezone)
- `unsubscribeToken`: One-click email unsubscribe
- `stripeCustomerId`: Payment integration
- `profileVisibility`: 'public' | 'private'
- `profileSectionVisibility`: Granular per-section (about, courses, achievements, certificates, stats)

**Profile Page** (`/[locale]/profile/[playerId]`):

**Tabs**:
1. **Overview**: Level, XP, courses, certificates, wallet, achievements
2. **Certificates**: List with verification links and "Copy link" button
3. **Achievements**: Progress, featured badges
4. **Payments**: Transaction history (owner only)
5. **Settings**: Photo, display name, visibility, language (owner only)

**Privacy Rules**:
- `private`: Non-owners get 404
- `public`: Show profile with per-section visibility

### 7. Public Sharing & Social Media

**Certificate Sharing**:
- **Public URL**: `/{locale}/certificate/{verificationSlug}`
- **Verification Page**: Shows cert details, authenticity badge
- **Copy Link**: One-click copy to clipboard
- **LinkedIn**: Paste URL in "Add credential" or posts
- **Social Media**: Share link on Twitter, Facebook, etc.
- **OpenGraph Tags**: Rich previews with title, description, image

**Profile Sharing**:
- **Public URL**: `/{locale}/profile/{playerId}`
- **Use Cases**:
  - LinkedIn profile (Featured/About section)
  - Resume/CV
  - Portfolio website
  - Job applications
- **Visible When Public**:
  - Level, title, XP progress
  - Completed courses count
  - Certificates with verification links
  - Achievements
  - Points wallet (if section public)

**Certificate URL Structure**:
```
Production: https://www.amanoba.com/en/certificate/{verificationSlug}
Shareable: Anyone can visit and verify
Privacy-aware: Private certs only visible to owner
Revocation-aware: Shows revoked status if revoked
```

---

## Key Architecture Patterns

### 1. Quiz Governance

**CRITICAL RULE**: Runtime authority is `course.lessonQuizPolicy`, NOT `lesson.quizConfig`.

- `lesson.quizConfig` is compatibility-only payload (import/export, legacy clients)
- Learner quiz behavior resolved from `course.lessonQuizPolicy`
- Learner routes should expose `quizPolicy` or course-level aliases

### 2. Reuse via Discriminator

**Pattern**: Same feature in 2+ places → one model, one API, one component

**Example**: Content voting
- Used on: courses, lessons, discussion posts
- Implementation: One `ContentVote` model with `targetType` and `targetId`
- See: `docs/product/VOTING_AND_REUSE_PATTERN.md`

### 3. Privacy Controls

**Two-Level Privacy**:

1. **Profile Level**: `profileVisibility` (public/private)
   - Private: Non-owners get 404
   - Public: Show profile

2. **Section Level**: `profileSectionVisibility` (per section)
   - Sections: about, courses, achievements, certificates, stats
   - Granular control when profile is public

**Certificate Privacy**:
- `isPublic` flag (default true)
- Owner can toggle anytime
- Private: Only owner sees (others 404)
- Revoked: Shows revoked status (public info)

### 4. Multi-Language Course Authoring

**Default Strategy** (from operating doc):
1. Author EN course first (complete lesson sequence)
2. Localize to each target language
3. **Hard requirement**: Fully in-language (no English leakage)
4. Pass language integrity gates for lesson content + email fields
5. Do not overwrite existing in-language lessons unless requested

### 5. Canonical Course Specs (CCS)

**Location**: `docs/canonical/<COURSE_FAMILY>/`

**Files**:
- `<NAME>.canonical.json` - Machine-readable spec
- `<NAME>_CCS.md` - Narrative guide

**Structure**:
- Course intent (one sentence, outcomes, non-goals)
- Concepts map (key → definition + notes)
- Procedures (id, name, steps, used in days)
- Lessons (day, title, intent, goals, concepts, examples, common mistakes)
- Assessment blueprint (question archetypes, distractor guidelines)

**Rule**: Localized lessons must align with CCS. Drift = defect or version change.

---

## Critical Business Rules

### Access Control

1. **Course Enrollment**: Free (anyone) | Premium (requires `isPremium` OR purchase)
2. **Prerequisites**: hard (block) | soft (warn)
3. **Lesson Access**: Must be enrolled + previous lesson complete (if required)
4. **Quiz Access**: Enabled by `lessonQuizPolicy.enabled`
5. **Certification**: All lessons + all quizzes + entitlement (if required)

### Gamification

1. **Lesson**: `lesson.pointsReward` + `lesson.xpReward`
2. **Course**: `course.pointsConfig.completionPoints` + `course.xpConfig.completionXP`
3. **Bonus**: `course.pointsConfig.perfectCourseBonus` (if all lessons completed)
4. **Progression**: Level up on XP thresholds, title changes with level

### Email Delivery

1. **Opt-in**: `emailPreferences.receiveLessonEmails = true`
2. **Frequency**: daily | weekly | never
3. **Timing**: `preferredEmailTime` (hour) + `timezone`
4. **Deduplication**: Check `emailSentDays` array
5. **Unsubscribe**: One-click via `unsubscribeToken`

### Quiz Quality (Per Lesson)

1. **Minimum 7 valid questions**
2. **0 RECALL** (none allowed)
3. **Minimum 5 APPLICATION**
4. **Minimum 2 CRITICAL_THINKING** (recommended)
5. **4 options**: 1 correct + 3 plausible distractors
6. **Standalone**: No lesson-referential wording
7. **Educational distractors**: No throwaway options

---

## Database Schema Quick Reference

| Collection | Purpose | Unique Constraint |
|------------|---------|-------------------|
| `courses` | Course definitions | `courseId` |
| `lessons` | Lesson content | `lessonId` |
| `course_progress` | Player progress | `playerId + courseId` |
| `players` | User accounts | `ssoSub` |
| `certificates` | Issued certificates | `certificateId`, `verificationSlug` |
| `certificate_entitlements` | Cert access | `playerId + courseId` |
| `quiz_questions` | Question pool | `questionId` |
| `certificate_templates` | Cert designs | `templateId` |

---

## API Endpoints Quick Reference

### Course Flow

```
GET    /api/courses                                  # List courses
GET    /api/courses/[courseId]                       # Course details
POST   /api/enroll/[courseId]                        # Enroll
GET    /api/courses/[courseId]/lessons/[day]         # Lesson content
POST   /api/courses/[courseId]/lessons/[day]/complete # Mark complete
GET    /api/courses/[courseId]/lessons/[day]/quiz    # Quiz questions
POST   /api/courses/[courseId]/lessons/[day]/quiz/submit # Submit quiz
```

### Certification Flow

```
GET    /api/courses/[courseId]/certification/status  # Check eligibility
POST   /api/courses/[courseId]/certification/purchase # Buy entitlement
GET    /api/courses/[courseId]/final-exam            # Get exam
POST   /api/courses/[courseId]/final-exam/submit     # Submit exam
POST   /api/courses/[courseId]/certification/issue   # Issue cert (auto)
GET    /api/certificates/[slug]                      # Verify cert
PATCH  /api/certificates/[slug]                      # Toggle privacy
```

### Profile Flow

```
GET    /api/profile/[playerId]                       # Get profile
GET    /api/profile/[playerId]/courses               # Get courses
GET    /api/profile/[playerId]/certificate-status    # Cert status
PATCH  /api/profile                                  # Update profile
POST   /api/profile/photo                            # Upload photo
GET    /api/payments/history                         # Payment history
```

---

## Files Read & Analyzed

1. **Models**:
   - `app/lib/models/course.ts` (437 lines)
   - `app/lib/models/lesson.ts` (303 lines)
   - `app/lib/models/course-progress.ts` (225 lines)
   - `app/lib/models/certificate.ts` (77 lines)
   - `app/lib/models/certificate-entitlement.ts` (54 lines)
   - `app/lib/models/player.ts` (387 lines)

2. **Pages**:
   - `app/[locale]/profile/[playerId]/page.tsx` (903 lines)
   - `app/[locale]/certificate/[slug]/page.tsx` (315 lines)
   - `app/[locale]/courses/[courseId]/page.tsx` (150 lines preview)

3. **APIs**:
   - `app/api/certificates/[slug]/route.ts` (214 lines)

4. **Documentation**:
   - `docs/architecture/layout_grammar.md` (102 lines preview)
   - Multiple SSOT documents referenced in operating doc

---

## Documentation Created

### Main Document

**`COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md`** (1,025 lines)

**Contents**:
1. Course Structure & Database
2. Lesson Structure & Daily Delivery
3. Customer Journey - Complete Flow (6 phases)
4. Progress Tracking
5. Certification System
6. Profile System
7. Public Sharing & Social Media
8. Database Schema Summary
9. API Endpoints Reference
10. Key Business Rules

**Includes**:
- Complete database schemas with field descriptions
- Customer journey flow diagram
- API endpoint tables
- Business rule reference
- Privacy control patterns
- Sharing use cases for LinkedIn and social media
- OpenGraph meta tags for rich previews

---

## Key Takeaways

### 1. **Quiz Authority**
Runtime behavior is `course.lessonQuizPolicy`, not `lesson.quizConfig`. This is the **single source of truth** for learner quiz experience.

### 2. **Certificate Sharing**
Certificates have unique `verificationSlug` for public URLs. Owner controls privacy. LinkedIn and social media can verify authenticity.

### 3. **Profile Visibility**
Two-level privacy: profile-level + section-level. Granular control over what's public.

### 4. **Multi-Language Integrity**
Courses and lessons must be fully in-language. Email fields (`emailSubject`, `emailBody`) are critical for language integrity gates.

### 5. **Course Building**
Follow Canonical Course Specs (CCS) in `docs/canonical/`. Localized courses must align. Drift = defect or version change.

### 6. **Flexible Lengths**
Courses can be any length (1 to N lessons). `durationDays` is fallback; active lessons define learner-facing length.

### 7. **Certification Flow**
Eligibility → (optional) Purchase → Final Exam → Auto-issue on pass. Immutable snapshot with unique verification URL.

### 8. **Gamification**
Points and XP at lesson and course levels. Perfect course bonus. Level/title progression on XP thresholds.

---

## What's Ready for Testing

✅ **Understanding complete** for:
- Course structure and database storage
- Lesson creation and daily email delivery
- Customer journey from discovery to certificate
- Progress tracking and completion logic
- Certification system (entitlement, exam, issuance)
- Profile system with privacy controls
- Public sharing for LinkedIn and social media
- API endpoints and business rules

✅ **Can now**:
- Build new courses
- Create lesson sequences
- Configure quiz policies
- Set up certification
- Design certificate templates
- Implement profile features
- Add sharing capabilities
- Troubleshoot customer journey issues

---

## Next Steps for Development

When working on course-related features:

1. **Read layout grammar first**: `docs/architecture/layout_grammar.md`
2. **Check CCS**: `docs/canonical/<COURSE_FAMILY>/` for structure
3. **Quiz authority**: Always use `course.lessonQuizPolicy`
4. **Language integrity**: Email fields must be in-language
5. **Privacy controls**: Respect profile and certificate privacy settings
6. **Testing**: Use Vercel preview deployments (not localhost)

---

**Session Complete**: 2026-08-05
**Commit**: 28f959c1
**Documentation**: COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md (pushed to main)
