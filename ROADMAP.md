# Amanoba Roadmap — 30-Day Learning Platform

**Version**: 2.7.0  
**Last Updated**: 2025-01-20T12:00:00.000Z  
**Vision**: Transform Amanoba into a unified 30-day learning platform with gamified education, assessment tools, and email-based lesson delivery  
**Current Phase**: Phase 4 Assessment Integration Complete ✅ - Quiz System Operational - Production Stable

---

## 🧭 Tech Debt Snapshot (2026-01-18)

### Pseudo-Priority List
- **P0 / High**
  - Gate admin stats APIs (`app/api/admin/stats/verify`, `.../repair`) by role (admin/superadmin), not just session presence.
  - Fix runtime crash in `app/api/admin/system-info/route.ts` (missing `fs`/`path` imports or dead code removal).
  - Implement token-based unsubscribe in `app/api/email/unsubscribe/route.ts` (currently 400 when token is provided) or drop the token param.
  - Restrict `app/api/profile/[playerId]` data exposure (wallet balances, `lastSeenAt`) to self/admin; clarify intended visibility.
  - Wire rate limiting (`app/lib/security.ts`) into auth/profile/admin/progress endpoints.
- **P1 / Medium**
  - Localize and brand policy/legal pages; switch plain `Link`/`href=\"/\"` to `LocaleLink`, add missing HU/EN messages, and apply `globals.css` shell.
  - Reconcile `design-system.css` palette (indigo/pink) with `globals.css` gold/black; remove straggler per-page styles.
  - Remove client debug logs (dashboard, games/quizzz) before production builds.
- **P2 / Low**
  - Add minimal test harness (`npm test`), smoke tests for `[locale]/dashboard`, `[locale]/courses`, and critical APIs.
  - Document/decide public profile surface and unsubscribe token contract to avoid regressions later.

---

## 🚀 New Milestone: Certificate System v0.1 (Shareable, Course-Aware)

### User Stories (actionable)
- As an admin, I set the certificate template and eligibility in course settings (parent and inherited children auto-use the parent’s certificate config by default).
- As a learner who meets the course’s pass/completion rule, I receive a generated certificate image with my name, course title, completion date, and a share link.
- As a learner, I can view/download/share my certificates from my profile; a public URL renders an open-graph-ready image and details.
- As an admin, I can revoke or regenerate a certificate if rules or branding change.

### Scope (v0.1)
- Certificate model linking user ↔ course ↔ issuance metadata (score/pass %, issuedAt, revokedAt).
- Rendering pipeline for branded certificate images (OG-friendly) with per-course assets; stores a CDN URL.
- Shareable public endpoint (signed/unguessable ID) that shows course, result, and social meta for posting/LinkedIn.
- Achievement tie-in: certificate logged as an achievement entry.
- Default propagation: child courses inherit parent certificate config; admin can opt a child out or override later (future option).

### Future Options (Roadmap 1.0+)
- Per-child certificate overrides; multiple templates per course; localized certificates.
- Dynamic pass rules editor; multi-metric eligibility; badge layering.
- LinkedIn Add-to-Profile integration; QR codes; on-chain/verify endpoints.
- A/B testing certificate designs; user-uploaded name edits with approval flow.

---

## 🛤️ New Milestone: Multi-Format Course Forking (30d → 7d / Weekend / 1d / 1h)

### User Stories (actionable)
- Shared infra: As an admin, I fork any 30-day course into a child variant with auto-sync on by default (lessons/quizzes mirror parent); I can detach specific lessons/quizzes and add unique ones (future toggle).
- Shared infra: As an admin, I map lessons to the target schedule (linear days for 7d/1d/1h, calendar Fri-Sat-Sun for weekend) and reorder within allowed slots.
- Shared infra: As an admin, I choose quiz strategy per variant (inherit daily quizzes, end-of-course mega-quiz, diagnostic random pool) with fixed question counts per spec.
- 7-day: As an admin, I pick 7 lessons from the parent, publish a 7-day child; learners complete one per day with inherited quizzes.
- Weekend (4 lessons): As an admin, I select 1 Fri, 2 Sat, 1 Sun lessons; learners follow the fixed calendar schedule regardless of enrollment day.
- 1-day (10 lessons): As an admin, I select 10 lessons; learners consume without per-lesson quizzes and then take a 50-question final quiz (5 per lesson) with pass % gating certificate eligibility.
- 1-hour (2 lessons): As an admin, I pick 2 lessons and configure a 50-question diagnostic quiz sourced randomly from the parent; learners see results-only plus a recommended course slug based on score band.
- Publishing: As an admin, I preview a child course (lessons, quiz plan, schedule) before publish; changes in parent prompt a sync log/alert for children.

### Constraints / Defaults
- Auto-sync default; selective unsync/re-sync is a future option.
- Question counts fixed per format (30d: 10/lesson; 1d final: 50 total; 1h diagnostic: 50 random); tweaking counts is deferred.
- Weekend schedule is calendar-fixed: Fri (1), Sat (2), Sun (1).
- Recommendations in 1-hour map score bands → course slugs; richer logic deferred.

---

## 🎯 Platform Vision

**Amanoba** is evolving from a game platform into a **unified 30-day learning platform** that combines:
- **Structured Learning**: 30-day courses with daily lessons delivered via email
- **Gamified Assessment**: Existing games repurposed as interactive surveys/assessments to understand students
- **Retained Systems**: Login, rewards, achievements, leaderboards, and gamification remain core features
- **Course Builder**: Admin interface to create courses similar to how games are currently built

### Core Principles
1. **Games as Assessments**: QUIZZZ, WHACKPOP, and Madoku become student assessment tools
2. **Email-First Learning**: Daily lessons sent via email with in-platform access
3. **Gamification Intact**: All existing rewards, points, XP, achievements, and streaks remain
4. **30-Day Structure**: Each course is a 30-step journey (one lesson per day)
5. **Modular Course System**: Build courses using the same flexible architecture as games

---

## 📅 Phase 1: Foundation & Data Models (Weeks 1-2) ✅ COMPLETE

### Priority: CRITICAL

#### 1.1 Course & Lesson Data Models
**Status**: ✅ COMPLETE  
**Timeline**: Week 1 (Completed 2025-01-14)

Create new Mongoose models following the Game model pattern:

- **Course Model** (`app/lib/models/course.ts`)
  - `courseId`: Unique identifier (e.g., "ENTREPRENEURSHIP_101")
  - `name`: Display name
  - `description`: Course overview
  - `durationDays`: Always 30
  - `thumbnail`: Course image/icon
  - `isActive`: Enable/disable course
  - `requiresPremium`: Premium-only courses
  - `pointsConfig`: Points awarded for completion
  - `xpConfig`: XP awarded for completion
  - `metadata`: Course-specific settings
  - `lessons`: Array of lesson references (30 lessons)

- **Lesson Model** (`app/lib/models/lesson.ts`)
  - `lessonId`: Unique identifier (e.g., "DAY_01", "DAY_15")
  - `courseId`: Parent course reference
  - `dayNumber`: 1-30 (position in course)
  - `title`: Lesson title
  - `content`: HTML/markdown lesson content
  - `emailSubject`: Email subject line template
  - `emailBody`: Email body template (HTML)
  - `assessmentGameId`: Optional game to play after lesson (QUIZZZ, WHACKPOP, etc.)
  - `unlockConditions`: Prerequisites (e.g., complete previous lesson)
  - `pointsReward`: Points for completing lesson
  - `xpReward`: XP for completing lesson
  - `isActive`: Enable/disable lesson
  - `metadata`: Lesson-specific settings

- **CourseProgress Model** (`app/lib/models/course-progress.ts`)
  - `playerId`: Student reference
  - `courseId`: Course reference
  - `currentDay`: Current lesson (1-30)
  - `completedDays`: Array of completed day numbers
  - `startedAt`: Course start date
  - `completedAt`: Course completion date (if finished)
  - `lastAccessedAt`: Last lesson access
  - `emailSentDays`: Array of days where email was sent
  - `assessmentResults`: Map of day → game session results
  - `totalPointsEarned`: Points earned from course
  - `totalXPEarned`: XP earned from course
  - `status`: "not_started" | "in_progress" | "completed" | "abandoned"

**Deliverables**:
- ✅ 4 new Mongoose models with full TypeScript interfaces (Course, Lesson, CourseProgress, AssessmentResult)
- ✅ Database indexes for efficient queries
- ✅ Model exports added to `app/lib/models/index.ts`
- ✅ Multi-language support in Course and Lesson models
- ⏳ Seed script for sample course (pending - can be added in Phase 2)

---

#### 1.2 Email Service Integration
**Status**: ✅ COMPLETE  
**Timeline**: Week 1-2 (Completed 2025-01-14)

Integrate email service for lesson delivery:

- **Email Provider**: Resend (recommended) or SendGrid
- **Email Service Module** (`app/lib/email/email-service.ts`)
  - `sendLessonEmail()`: Send daily lesson to student
  - `sendWelcomeEmail()`: Course enrollment confirmation
  - `sendCompletionEmail()`: Course completion celebration
  - `sendReminderEmail()`: Daily lesson reminder
  - Template system for HTML emails

- **Email Templates** (`app/lib/email/templates/`)
  - `lesson-email.tsx`: Daily lesson email template
  - `welcome-email.tsx`: Course welcome email
  - `completion-email.tsx`: Course completion email
  - `reminder-email.tsx`: Daily reminder email

- **Email Queue System** (`app/lib/queue/email-queue.ts`)
  - Queue email jobs for async processing
  - Retry logic for failed sends
  - Email delivery tracking

**Environment Variables**:
```bash
RESEND_API_KEY=re_xxxxx  # or SENDGRID_API_KEY
EMAIL_FROM=noreply@amanoba.com
EMAIL_FROM_NAME=Amanoba Learning
```

**Deliverables**:
- ✅ Email service module with Resend integration
- ✅ 4 email functions (lesson, welcome, completion, reminder)
- ✅ Multi-language email support
- ✅ Email preferences checking
- ⏳ Email queue system (can be added in Phase 3)
- ⏳ Email delivery tracking in database (can be added in Phase 3)

---

#### 1.3 Game Repurposing for Assessments
**Status**: ✅ COMPLETE  
**Timeline**: Week 2 (Completed 2025-01-14)

Extend Game model to support assessment mode:

- **Game Model Extensions** (`app/lib/models/game.ts`)
  - `isAssessment`: Boolean flag (default: false)
  - `assessmentConfig`: Optional assessment-specific settings
    - `learningObjectives`: What this assessment measures
    - `questionCategories`: Categories for QUIZZZ assessments
    - `difficultyMapping`: Map game difficulty to learning level
    - `resultsInterpretation`: How to interpret results

- **Assessment Results Model** (`app/lib/models/assessment-result.ts`)
  - `playerId`: Student reference
  - `courseId`: Course reference
  - `lessonDay`: Day number (1-30)
  - `gameId`: Assessment game (QUIZZZ, WHACKPOP, etc.)
  - `sessionId`: Game session reference
  - `score`: Assessment score
  - `maxScore`: Maximum possible score
  - `accuracy`: Percentage correct
  - `insights`: AI-generated insights about student performance
  - `recommendations`: Suggested next steps
  - `completedAt`: Assessment completion timestamp

**Deliverables**:
- ✅ Game model extended with assessment fields (`isAssessment`, `assessmentConfig`)
- ✅ AssessmentResult model created
- ✅ Assessment results structure ready for course progress linking
- ⏳ Admin UI to configure games as assessments (Phase 2)

---

## 📅 Phase 2: Course Builder & Admin Tools (Weeks 3-4) ✅ COMPLETE

### Priority: HIGH
**Status**: ✅ COMPLETE

#### 2.1 Course Builder Admin Interface
**Status**: ✅ COMPLETE  
**Timeline**: Week 3 (Completed 2025-01-17)

Create admin interface for course creation (similar to game management):

- **Admin Routes**:
  - `/admin/courses`: Course list and management
  - `/admin/courses/new`: Create new course
  - `/admin/courses/[courseId]`: Edit course
  - `/admin/courses/[courseId]/lessons`: Manage lessons (30-day builder)

- **Course Builder UI** (`app/admin/courses/[courseId]/page.tsx`)
  - Course metadata editor (name, description, thumbnail)
  - 30-day lesson builder with drag-and-drop reordering
  - Lesson editor for each day:
    - Title and content (rich text editor)
    - Email subject and body templates
    - Assessment game selection (QUIZZZ, WHACKPOP, etc.)
    - Points and XP rewards
    - Unlock conditions
  - Preview mode for lessons
  - Publish/unpublish course

- **Lesson Content Editor**
  - Rich text editor (TipTap or similar)
  - Markdown support
  - Image upload
  - Video embedding
  - Code blocks for technical courses

**Deliverables**:
- ✅ Admin course management pages (`/admin/courses`, `/admin/courses/new`, `/admin/courses/[courseId]`)
- ✅ 30-day lesson builder interface with TipTap rich text editor
- ✅ Rich text editor for lesson content (TipTap integration)
- ✅ Course preview functionality
- ✅ Publish/unpublish workflow
- ✅ Assessment game selection and linking
- ✅ Email template editor with variable substitution

---

#### 2.2 Student Course Dashboard
**Status**: ✅ COMPLETE  
**Timeline**: Week 3-4 (Completed 2025-01-17)

Create student-facing course interface:

- **Student Routes**:
  - `/courses`: Available courses list
  - `/courses/[courseId]`: Course overview and enrollment
  - `/courses/[courseId]/day/[dayNumber]`: Daily lesson view
  - `/my-courses`: Student's enrolled courses

- **Course Dashboard** (`app/courses/[courseId]/page.tsx`)
  - Course overview (description, duration, thumbnail)
  - Enrollment button
  - Progress visualization (30-day timeline)
  - Completed days highlighted
  - Current day indicator
  - Points and XP earned from course
  - Assessment results summary

- **Daily Lesson View** (`app/courses/[courseId]/day/[dayNumber]/page.tsx`)
  - Lesson content (HTML/markdown rendered)
  - "Mark as Complete" button
  - Assessment game launcher (if configured)
  - Previous/Next lesson navigation
  - Email link ("View in email" button)

- **My Courses Page** (`app/my-courses/page.tsx`)
  - List of enrolled courses
  - Progress for each course
  - Continue learning CTA
  - Course completion badges

**Deliverables**:
- ✅ Student course listing and enrollment
- ✅ Course progress dashboard
- ✅ Daily lesson viewer
- ✅ Assessment game integration
- ✅ My Courses management page

---

## 📅 Phase 3: Email Delivery & Automation (Weeks 5-6)

### Priority: HIGH

#### 3.1 Daily Email Scheduler
**Status**: 🔄 PENDING  
**Timeline**: Week 5

Automated email delivery system:

- **Cron Job** (`app/api/cron/send-daily-lessons/route.ts`)
  - Runs daily at 8:00 AM user's timezone
  - Finds all students with active course progress
  - Checks if today's lesson email needs to be sent
  - Sends lesson email for current day
  - Tracks email delivery in CourseProgress

- **Email Sending Logic** (`app/lib/courses/email-scheduler.ts`)
  - `sendDailyLessons()`: Main function to send all daily lessons
  - Timezone-aware scheduling (respects student timezone)
  - Prevents duplicate sends
  - Handles missed days (catch-up emails)
  - Email delivery status tracking

- **Vercel Cron Configuration** (`vercel.json`)
  ```json
  {
    "crons": [{
      "path": "/api/cron/send-daily-lessons",
      "schedule": "0 8 * * *"
    }]
  }
  ```

**Deliverables**:
- ✅ Daily lesson email cron job (`/api/cron/send-daily-lessons`)
- ✅ Timezone-aware email scheduling (`app/lib/courses/email-scheduler.ts`)
- ✅ Email delivery tracking (emailSentDays in CourseProgress)
- ✅ Catch-up email logic for missed days
- ✅ Vercel cron configuration in `vercel.json`

---

#### 3.2 Email Preferences & Management
**Status**: ✅ COMPLETE  
**Timeline**: Week 5-6 (Completed 2025-01-17)

Student email preferences:

- **Player Model Extension** (`app/lib/models/player.ts`)
  - `emailPreferences`: Object
    - `receiveLessonEmails`: Boolean (default: true)
    - `emailFrequency`: "daily" | "weekly" | "never"
    - `preferredEmailTime`: Hour of day (0-23)
    - `timezone`: User timezone

- **Email Preferences UI** (`app/settings/email/page.tsx`)
  - Toggle lesson emails on/off
  - Select email frequency
  - Set preferred email time
  - Timezone selector
  - Email delivery history

- **Unsubscribe Handling** (`app/api/email/unsubscribe/route.ts`)
  - Unsubscribe link in emails
  - One-click unsubscribe
  - Respects email preferences

**Deliverables**:
- ✅ Email preferences in Player model (`emailPreferences` object)
- ✅ Email settings page (`/settings/email`)
- ✅ Unsubscribe functionality (`/api/email/unsubscribe`)
- ✅ Email delivery history (tracked in CourseProgress)
- ✅ Timezone selector and preferred email time configuration

---

## 📅 Phase 4: Assessment Integration (Weeks 7-8) ✅ COMPLETE

### Priority: MEDIUM
**Status**: ✅ COMPLETE (2025-01-20)

#### 4.1 Quiz Assessment System
**Status**: ✅ COMPLETE  
**Timeline**: Week 7 (Completed 2025-01-20)

Course-specific quiz assessment system:

- **QuizQuestion Model** (`app/lib/models/quiz-question.ts`)
  - Course-specific quiz questions with options and correct answers
  - Difficulty levels and categories
  - Two-step deletion: soft delete (deactivate) → permanent delete
  - Linked to lessons via `lessonId` and `courseId`

- **Lesson Quiz Configuration** (`app/lib/models/lesson.ts`)
  - `quizConfig` object with:
    - `enabled`: Boolean flag
    - `successThreshold`: Percentage required to pass (default: 100%)
    - `questionCount`: Number of questions shown (default: 5)
    - `poolSize`: Total questions in pool (default: 15)
    - `required`: Must pass quiz to complete lesson

- **Quiz Management UI** (`app/[locale]/admin/courses/[courseId]/page.tsx`)
  - Create, edit, delete quiz questions
  - Separate active/inactive question lists
  - Soft delete (deactivate) and permanent delete for inactive questions
  - Quiz configuration editor (threshold, question count, pool size)

- **Student Quiz Interface** (`app/components/LessonQuiz.tsx`)
  - Display quiz questions with multiple choice options
  - Submit quiz and calculate score
  - Show pass/fail status with retry option
  - Full Hungarian and English translations

**Deliverables**:
- ✅ QuizQuestion model with course-specific linking
- ✅ Lesson quiz configuration system
- ✅ Admin quiz management interface
- ✅ Student quiz completion flow
- ✅ Two-step deletion system (soft + permanent)
- ✅ Full i18n support for quiz UI

#### 4.2 Course Export/Import System
**Status**: ✅ COMPLETE  
**Timeline**: Week 8 (Completed 2025-01-20)

Course backup and migration system:

- **Export API** (`app/api/admin/courses/[courseId]/export/route.ts`)
  - Export complete course to JSON (course + lessons + quiz questions)
  - Safe Map-to-object conversion for translations
  - Comprehensive error handling and validation

- **Import API** (`app/api/admin/courses/import/route.ts`)
  - Import courses from JSON with overwrite support
  - Validation of course data structure
  - Batch creation of lessons and quiz questions

- **Admin UI Integration**
  - Export button in course editor
  - Import file upload with confirmation dialog
  - Success/error feedback

**Deliverables**:
- ✅ Course export functionality
- ✅ Course import with overwrite support
- ✅ Admin UI for export/import
- ✅ Error handling and validation

---

#### 4.3 Course Deletion with Cascading Deletes
**Status**: ✅ COMPLETE  
**Timeline**: Week 8 (Completed 2025-01-20)

Safe course deletion system:

- **Cascading Delete API** (`app/api/admin/courses/[courseId]/route.ts`)
  - Deletes course and all related data:
    - All lessons
    - All student progress records
    - All quiz questions
    - All assessment results
  - Confirmation dialog in admin UI
  - Loading states during deletion

**Deliverables**:
- ✅ Cascading delete functionality
- ✅ Admin UI with confirmation
- ✅ Safe deletion of all related data

---

## 📅 Phase 5: Gamification Integration (Weeks 9-10)

### Priority: MEDIUM

#### 5.1 Course-Specific Achievements
**Status**: 🔄 PENDING  
**Timeline**: Week 9

Extend achievement system for courses:

- **Course Achievements** (`app/lib/models/achievement.ts` extension)
  - `courseId`: Optional course reference
  - Course-specific achievements:
    - "First Lesson Complete"
    - "Week 1 Complete" (7 lessons)
    - "Halfway Hero" (15 lessons)
    - "Course Master" (30 lessons complete)
    - "Perfect Assessment Score"
    - "Consistent Learner" (no missed days)

- **Achievement Engine Extension** (`app/lib/gamification/achievement-engine.ts`)
  - Check course-specific achievements
  - Award on lesson completion
  - Award on assessment completion
  - Award on course completion

**Deliverables**:
- ✅ Course-specific achievements
- ✅ Achievement triggers for course events
- ✅ Course completion badges

---

#### 5.2 Course Leaderboards
**Status**: 🔄 PENDING  
**Timeline**: Week 10

Course-specific leaderboards:

- **Course Leaderboard Types**:
  - Course completion speed
  - Assessment scores
  - Total points earned from course
  - Consistency (no missed days)
  - Perfect assessment scores

- **Leaderboard Integration** (`app/lib/gamification/leaderboard-calculator.ts`)
  - Calculate course-specific rankings
  - Update on lesson completion
  - Update on assessment completion
  - Course completion leaderboard

**Deliverables**:
- ✅ Course leaderboards
- ✅ Leaderboard calculation for courses
- ✅ Course leaderboard UI

---

## 📅 Phase 6: Polish & Launch (Weeks 11-12)

### Priority: HIGH

#### 6.1 UI/UX Polish
**Status**: 🔄 PENDING  
**Timeline**: Week 11

- Course card designs
- Lesson viewer improvements
- Progress visualization enhancements
- Mobile responsiveness
- Email template design improvements
- Assessment results visualization

---

#### 6.2 Documentation & Testing
**Status**: 🔄 PENDING  
**Timeline**: Week 12

- Course creation documentation
- Student onboarding flow
- Email delivery testing
- Assessment integration testing
- End-to-end course completion testing
- Performance optimization

---

## 🔄 Migration Strategy

### Existing Data
- **Games**: Keep all existing games, add assessment flags
- **Players**: No migration needed, add email preferences
- **Rewards**: Keep all existing rewards
- **Achievements**: Keep all existing, add course-specific ones
- **Leaderboards**: Keep all existing, add course leaderboards

### Backward Compatibility
- Games remain playable outside of courses
- All existing gamification features continue to work
- Existing player data preserved
- Gradual rollout: courses are opt-in feature

---

## 📊 Success Metrics

### Learning Platform Metrics
- **Course Enrollment Rate**: % of students enrolling in courses
- **Lesson Completion Rate**: % of lessons completed
- **Course Completion Rate**: % of students completing 30-day course
- **Email Open Rate**: % of lesson emails opened
- **Assessment Engagement**: % of assessments completed
- **Daily Active Learners**: Students accessing lessons daily

### Retention Metrics
- **D7 Retention**: Students active after 7 days
- **D30 Retention**: Students completing full course
- **Course Abandonment Rate**: % of students who start but don't finish

### Engagement Metrics
- **Average Lessons Completed**: Per enrolled student
- **Assessment Participation**: % of students completing assessments
- **Points Earned from Courses**: Total points from course activities
- **Achievement Unlocks**: Course-specific achievements unlocked

---

## 🛠️ Technical Stack Additions

### New Dependencies
```json
{
  "resend": "^3.0.0",  // or "sendgrid": "^5.x"
  "@tiptap/react": "^2.x",  // Rich text editor
  "@tiptap/starter-kit": "^2.x"
}
```

### New Environment Variables
```bash
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@amanoba.com
EMAIL_FROM_NAME=Amanoba Learning
```

### New Database Collections
- `courses` (Course model)
- `lessons` (Lesson model)
- `course_progress` (CourseProgress model)
- `assessment_results` (AssessmentResult model)

---

## 🎯 Future Enhancements (Post-Launch)

### Q2 2026
- **Short-Format Tracks**: Launch fast-path course formats:
  - Learn in 60 Minutes (1-hour courses)
  - One Day to Master (1-day courses)
  - Zero to Real in a Weekend (weekend courses)
  - Skills in a Week (7-day courses)
- **Multiple Courses**: Students can enroll in multiple courses simultaneously
- **Course Prerequisites**: Require completion of one course before starting another
- **Live Sessions**: Scheduled live lessons with instructors
- **Community Features**: Course discussion forums, study groups

### Q3 2026
- **AI-Powered Personalization**: Adaptive lesson difficulty based on assessment results
- **Course Recommendations**: Suggest courses based on student interests and performance
- **Certificates**: Digital certificates for course completion
- **Instructor Dashboard**: Allow instructors to create and manage courses

### Q4 2026
- **Mobile App**: Native mobile app for course access
- **Offline Mode**: Download lessons for offline access
- **Video Lessons**: Video content in lessons
- **Interactive Quizzes**: In-lesson quizzes (separate from game assessments)

---

## 📝 Implementation Notes

### Course Builder Philosophy
- **Similar to Game Builder**: Use same architectural patterns
- **Flexible Content**: Support HTML, markdown, images, videos
- **30-Day Structure**: Enforced but flexible (can have shorter courses)
- **Assessment Integration**: Seamless game → assessment flow

### Email Delivery Philosophy
- **Email-First**: Lessons primarily delivered via email
- **Platform Access**: All lessons accessible in platform
- **Timezone Aware**: Respect student timezone for delivery
- **Catch-Up Support**: Handle missed days gracefully

### Gamification Philosophy
- **Retain Everything**: All existing gamification remains
- **Course Enhancements**: Add course-specific achievements, leaderboards
- **Points Integration**: Course activities award points
- **Streak Integration**: Course completion maintains streaks

---

**Maintained By**: Narimato  
**Review Cycle**: Weekly during active development  
**Next Review**: 2026-01-25
