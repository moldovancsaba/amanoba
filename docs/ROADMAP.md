# Amanoba Roadmap — Future Plans & Strategic Directions

**Version**: 2.9.23  
**Last Updated**: 2026-01-28  
**Vision**: Transform Amanoba into a unified 30-day learning platform with gamified education, assessment tools, email-based lesson delivery, and monetization

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

## 🧭 Tech Debt & Improvements

Completed items are in **RELEASE_NOTES.md** — roadmap and tasklist contain only open/future work.

### P0 — Open (High Priority)
1. **Global audit: communication + catalog language integrity**
   - Course catalog language integrity for `course.name` + `course.description` + `course.translations.*`
   - Code-level email audit for send-time language leakage (unsubscribe footer, etc.)
   - Localize transactional emails (welcome/completion/reminder/payment) and gate sending on language integrity

### P1 — Open (Medium Priority)
2. ~~Reconcile `design-system.css` palette with `globals.css` gold/black; remove straggler per-page styles~~ — **Done** (2026-01-28): `--color-heading` in design-system; globals uses it; certificate routes use `SECONDARY_HEX`. See `docs/2026-01-28_P1_TECH_DEBT_DELIVERY.md`.  
3. ~~Remove client debug logs (dashboard, games, achievements, etc.) before production builds~~ — **Done**: Icon.tsx console.warn removed; no client console in production bundle.  
4. **Design system**: Use CTA token (#FAB908) for all primary CTAs; replace inline styles and hardcoded hex with Tailwind/design tokens — (partially done in tech audit; CTA audit doc exists.)  
5. ~~**Facebook cleanup** (post-migration): Remove `facebookId`/`authProvider: 'facebook'` once migration complete~~ — **Done**: Player model already SSO-only; data-deletion page and auth comment updated to SSO wording. See `docs/SSO_MIGRATION_COMPLETE.md` and `docs/2026-01-28_P1_TECH_DEBT_DELIVERY.md`.

### P2 — Open (Low Priority)
6. Add minimal test harness (`npm test`), smoke tests for dashboard, courses, critical APIs  
7. Single APP_URL constant for all env fallbacks  
8. Certificate image route: source colors from CertificationSettings/Brand  
9. CSP: Remove Facebook domains when Facebook fully removed  

### Tech audit follow-up (Jan 2026) — priority order P0 → P1 → P2 → P3
10. **P0 — Security**: Run `npm audit fix`; evaluate Next.js upgrade; restrict debug API; env for origin allowlists; gate SSO DEBUG logs.  
11. **P1 — Lint/TS**: Fix critical ESLint errors (Sparkles, unescaped entities); fix Hook deps and high-impact `any`; re-enable lint (and optionally TS) in build; migrate from deprecated `next lint`. **P1.7 TypeScript**: ✅ Complete — all app-level TS errors fixed; `tsc --noEmit` passes; see `docs/2026-01-28_TYPESCRIPT_AUDIT_COMPLETE.md`.  
12. **P2 — Deprecated/hardcoded**: Update/remove baseline-browser-mapping and @emnapi/runtime; centralise certificate/email/analytics colors; use env for production allowlists.  
13. **P3 — Known issues, UI, consistency**: Resolve or ticket profile stats, admin settings, system-info, game status API, challenge retry; replace admin `<img>` with Next Image; audit CTA yellow; standardise imports and logging.  
*Full list: `docs/2026-01-30_TECH_AUDIT_JANUARY.md` §12; tasklist: `docs/tasklists/TECH_AUDIT_JANUARY__2026-01-30.md`.*


### User profile customization — photo, nickname, public/private (Planned)

**Status**: 🟡 **PLANNED**  
**Estimated**: TBD  
**Priority**: MEDIUM

**Summary**: Users can add a profile photo (stored in imgbb.com via our existing API), set a nickname (the visible name shown on profile and elsewhere), and set their profile to public or private.

**User Stories**:
- As a user, I can upload a profile photo so others (or I) see my picture on my profile; the photo is stored in our imgbb.com storage via the existing ImgBB API.
- As a user, I can set a nickname (visible name) so that name is shown on my profile, in leaderboards, and wherever we display the user’s name instead of email or internal id.
- As a user, I can set my profile to public or private so I control who can view my profile (Profile Visibility & Privacy is delivered — see RELEASE_NOTES; ensure this toggle remains available and discoverable in profile/settings).

**Scope**:
- **Profile photo**: User-facing upload on profile or settings; image sent to backend, uploaded to imgbb.com via existing `app/lib/utils/imgbb.ts` (or equivalent API); store returned image URL on Player (e.g. `avatarUrl` or `profileImageUrl`); display on profile and optionally in header/comment/leaderboard.
- **Nickname (visible name)**: Player field for display name (e.g. `displayName` or `nickname`); editable on profile/settings; used everywhere we show the user’s name (profile, public profile, leaderboards, certificates, etc.); validation (length, allowed characters).
- **Public/private profile**: Profile Visibility & Privacy is delivered (RELEASE_NOTES); ensure the toggle is present in profile/settings and documented as part of this “profile customization” experience.

**Technical Requirements** (to be detailed):
- Player model: `avatarUrl` or `profileImageUrl` (string, imgbb URL); `displayName` or `nickname` (string, optional).
- API: `POST /api/profile/photo` or `PATCH /api/profile` accepting image upload; server-side upload to imgbb using existing ImgBB API; save URL to Player. `PATCH /api/profile` for nickname and public/private (if not already covered).
- UI: Profile or settings page — photo upload (crop/optional), nickname field, public/private toggle; use existing imgbb integration (`IMGBB_API_KEY`); next.config already allows imgbb image domains.

---

## 🚀 Upcoming Milestones (by priority)

**Priority order**: P0 = Global audit (language integrity) in Tech Debt above. P1 = design/CTA cleanup, debug logs, Facebook cleanup. P2 = Onboarding Survey, Email Automation, Multi-Format Forking. Certificate v0.1, Editor User, User profile customization → **RELEASE_NOTES.md** (v2.9.18–v2.9.20).

---

### Onboarding Survey & Segmentation — MEDIUM-HIGH PRIORITY

**Status**: 🟡 **UX IMPROVEMENT**  
**Estimated**: 1-2 days  
**Priority**: MEDIUM-HIGH

**User Stories**:
- As a new student, I want to complete an onboarding survey so I get personalized course recommendations
- As a student, I want to see course recommendations based on my interests and skill level
- As an admin, I want to see survey responses so I can understand student needs and preferences
- As a student, I want my email communications to be personalized based on my survey answers
- As an admin, I want to segment students by skill level (beginner/intermediate/advanced) for targeted campaigns

**Scope**:
- Onboarding survey form (multi-step, 5-10 questions)
- Survey model for question management
- SurveyResponse model for storing student answers
- Course recommendation engine based on survey responses
- Player segmentation (beginner/intermediate/advanced) stored in Player model
- Survey completion tracking
- Admin dashboard for viewing survey analytics

**Technical Requirements**:
- Create `Survey` model (`app/lib/models/survey.ts`)
- Create `SurveyResponse` model (`app/lib/models/survey-response.ts`)
- Create `/api/surveys/onboarding` endpoint (GET for questions, POST for responses)
- Create onboarding survey page (`app/[locale]/onboarding/page.tsx`)
- Add `surveyCompleted`, `skillLevel`, `interests` fields to Player model
- Create course recommendation logic based on survey responses
- Add survey analytics to admin dashboard

**Survey Questions (Example)**:
1. What is your primary learning goal? (Multiple choice)
2. What is your current skill level? (Beginner/Intermediate/Advanced)
3. What topics interest you most? (Multi-select)
4. How much time can you dedicate daily? (15min/30min/1hr+)
5. What is your preferred learning style? (Visual/Audio/Reading/Practice)

**Future Enhancements**:
- Dynamic survey questions based on previous answers
- Survey A/B testing
- Post-course feedback surveys
- Survey question management in admin UI

---

### Email Automation Enhancement — LOW-MEDIUM PRIORITY

**Status**: 🟢 **MARKETING OPTIMIZATION**  
**Estimated**: 2-5 days  
**Priority**: LOW-MEDIUM (depends on marketing strategy)

**User Stories**:
- As an admin, I want to segment students by skill level so I can send targeted lesson emails
- As a student, I want to receive upsell emails after completing courses so I can discover new courses
- As an admin, I want to see email analytics so I can improve email campaigns
- As a student, I want to receive personalized emails based on my learning progress
- As an admin, I want to send A/B tested emails to improve engagement

**Scope (Phase 1 - Resend Enhancement)**:
- Player segmentation logic (beginner/intermediate/advanced) based on course progress
- Email templates per segment (different tone/content for each level)
- Upsell logic in course completion emails (recommend related courses)
- Email analytics tracking (open rates, click rates)
- Personalized email content based on player progress and preferences

**Technical Requirements**:
- Add `emailSegment` field to Player model (auto-calculated from progress)
- Create email template system with segment-specific templates
- Enhance `sendCompletionEmail` with upsell logic
- Add email analytics tracking to EventLog model
- Create email analytics dashboard in admin UI
- Add course recommendation logic for upsell emails

**Scope (Phase 2 - MailerLite/ActiveCampaign Integration)**:
- MailerLite or ActiveCampaign integration (if advanced marketing automation needed)
- Webhook setup for subscriber sync
- Automated email workflows (drip campaigns, nurture sequences)
- Advanced segmentation and tagging
- A/B testing capabilities

**Technical Requirements (Phase 2)**:
- Install MailerLite SDK or ActiveCampaign SDK
- Create `/api/email/sync-subscriber` endpoint
- Create webhook handler for MailerLite/ActiveCampaign events
- Sync player data to email marketing platform
- Create automated workflows in email platform

**Decision Point**:
- **Short-term**: Enhance Resend with segmentation (2-3 days)
- **Long-term**: Consider MailerLite/ActiveCampaign only if you need:
  - Advanced automation workflows
  - A/B testing
  - Detailed analytics
  - Large-scale email marketing

---

### Editor User — Limited Admin Access (Planned)

**Status**: 🟡 **PLANNED**  
**Estimated**: TBD  
**Priority**: MEDIUM

**Summary**: Editor users have limited access to the admin UI. They can only access courses that they created or that are assigned to them for editing.

**How a user becomes an editor**:
- A user becomes an editor when **a course is assigned to them** for editing (by an admin). There is no separate “editor” account type: any user who has at least one course assigned to them for editing is treated as an editor for that course.
- When a course (or a lesson within a course) is assigned to a user so they can edit it, that user **starts to see the admin button** (e.g. in header or dashboard) and can open the limited admin UI. They see only the courses assigned to them (or that they created).
- **Course management** must provide an option to **assign a course to an editor**: e.g. on the course edit/settings screen, an admin can select a user (by email or playerId) and add them as an assigned editor for that course; that user then gains editor access for that course and the admin entry point becomes visible to them.

**User Stories**:
- As an editor, I can log in to the admin UI and see only the courses I created or that are assigned to me
- As an editor, I can edit lessons and quiz questions for those courses (no access to other courses or system-wide admin features)
- As an admin, I can assign a course to a user (editor) from course management so that user can edit that course and sees the admin button
- As an admin, I can manage course–editor assignments (add/remove assigned editors per course)

**Scope**:
- Editor role (distinct from admin/superadmin): limited admin UI access
- Course–editor association: courses have creator and/or assigned editors
- Admin UI filtering: editors see only their courses (created by them or assigned to them)
- No access for editors: system settings, payments, all courses list, user management, analytics (or restricted analytics per assigned courses only — to be defined)
- **Vote reset on lesson update**: When a lesson is updated/finetuned (by editor or admin), reset that lesson’s upvote/downvote (and aggregate) so votes apply to the current content (see Course & content voting — actionable item 9).

**Technical Requirements** (to be detailed):
- **Becoming an editor**: No separate role signup; a user is an “editor” if they appear in `assignedEditors` for at least one course (or are `createdBy` for a course). Auth/session: derive “has editor access” from course assignments.
- Course model: `createdBy` (playerId/userId), `assignedEditors` (array of playerIds or role refs)
- **Admin button visibility**: Show the admin entry point (e.g. “Admin” in header/nav) only if the user is admin/superadmin **or** has at least one course assigned to them (or created by them). Otherwise hide it.
- **Course management — assign course to editor**: In admin course edit/settings UI, add “Assign editor” (or “Assigned editors”): select user (e.g. by email or search), add to `assignedEditors` for that course; list and remove assigned editors. API: e.g. `PATCH /api/admin/courses/[courseId]` with `assignedEditors` or dedicated `POST /api/admin/courses/[courseId]/editors` to add/remove.
- Admin routes and UI: gate by role; for editors, filter courses by createdBy / assignedEditors
- Admin UI: course list and course/lesson/question edit screens scoped to editor’s courses

---

### Certificate System v0.1 (Shareable, Course-Aware)

**User Stories**:
- As an admin, I set the certificate template and eligibility in course settings (parent and inherited children auto-use the parent's certificate config by default)
- As a learner who meets the course's pass/completion rule, I receive a generated certificate image with my name, course title, completion date, and a share link
- As a learner, I can view/download/share my certificates from my profile; a public URL renders an open-graph-ready image and details
- As an admin, I can revoke or regenerate a certificate if rules or branding change

**Scope (v0.1)**:
- Certificate model linking user ↔ course ↔ issuance metadata (score/pass %, issuedAt, revokedAt)
- Rendering pipeline for branded certificate images (OG-friendly) with per-course assets; stores a CDN URL
- Shareable public endpoint (signed/unguessable ID) that shows course, result, and social meta for posting/LinkedIn
- Achievement tie-in: certificate logged as an achievement entry
- Default propagation: child courses inherit parent certificate config; admin can opt a child out or override later (future option)

**Future Options (Roadmap 1.0+)**:
- Per-child certificate overrides; multiple templates per course; localized certificates
- Dynamic pass rules editor; multi-metric eligibility; badge layering
- LinkedIn Add-to-Profile integration; QR codes; on-chain/verify endpoints
- A/B testing certificate designs; user-uploaded name edits with approval flow

---

### Multi-Format Course Forking (30d → 7d / Weekend / 1d / 1h)

**Implementation plan and handover**: `docs/2026-01-27_RAPID_CHILDREN_COURSES_ACTION_PLAN_AND_HANDOVER.md` — Admin grouping (Course Idea → 30-Day Outline → CCS → Language variants → Course); Shorts by lesson count (1–3 Essentials, 4–7 Beginner, 8–12 Foundations, 13–20 Core Skills, 21+ Full Program); checkbox lesson selection; read-only child editor; certificate with limited questions; timeline (goLiveAt) so any length can go live before 30-day is published; rollback plan; **Section 10** lists clarification questions (Course Idea/Outline storage, CCS entity vs files, naming, timeline model).  
**Delivery plan (action items)**: `docs/2026-01-27_RAPID_CHILDREN_COURSES_DELIVERY_PLAN.md` — checkable P1.1–P6.3.

**User Stories**:
- Shared infra: As an admin, I fork any 30-day course into a child variant with auto-sync on by default (lessons/quizzes mirror parent); I can detach specific lessons/quizzes and add unique ones (future toggle)
- Shared infra: As an admin, I map lessons to the target schedule (linear days for 7d/1d/1h, calendar Fri-Sat-Sun for weekend) and reorder within allowed slots
- Shared infra: As an admin, I choose quiz strategy per variant (inherit daily quizzes, end-of-course mega-quiz, diagnostic random pool) with fixed question counts per spec
- 7-day: As an admin, I pick 7 lessons from the parent, publish a 7-day child; learners complete one per day with inherited quizzes
- Weekend (4 lessons): As an admin, I select 1 Fri, 2 Sat, 1 Sun lessons; learners follow the fixed calendar schedule regardless of enrollment day
- 1-day (10 lessons): As an admin, I select 10 lessons; learners consume without per-lesson quizzes and then take a 50-question final quiz (5 per lesson) with pass % gating certificate eligibility
- 1-hour (2 lessons): As an admin, I pick 2 lessons and configure a 50-question diagnostic quiz sourced randomly from the parent; learners see results-only plus a recommended course slug based on score band
- Publishing: As an admin, I preview a child course (lessons, quiz plan, schedule) before publish; changes in parent prompt a sync log/alert for children

**Constraints / Defaults**:
- Auto-sync default; selective unsync/re-sync is a future option
- Question counts fixed per format (30d: 10/lesson; 1d final: 50 total; 1h diagnostic: 50 random); tweaking counts is deferred
- Weekend schedule is calendar-fixed: Fri (1), Sat (2), Sun (1)
- Recommendations in 1-hour map score bands → course slugs; richer logic deferred

---

## 📅 Phase 5: Gamification Integration (Future)

### Priority: MEDIUM

#### 5.1 Course-Specific Achievements
- Extend achievement system for courses
- Course-specific achievements:
  - "First Lesson Complete"
  - "Week 1 Complete" (7 lessons)
  - "Halfway Hero" (15 lessons)
  - "Course Master" (30 lessons complete)
  - "Perfect Assessment Score"
  - "Consistent Learner" (no missed days)
- Achievement Engine Extension to check course-specific achievements
- Award on lesson completion, assessment completion, course completion

#### 5.2 Course Leaderboards
- Course-specific leaderboards:
  - Course completion speed
  - Assessment scores
  - Total points earned from course
  - Consistency (no missed days)
  - Perfect assessment scores
- Leaderboard Integration for course-specific rankings
- Update on lesson completion and assessment completion

---

## 📅 Phase 6: Polish & Launch (Future)

### Priority: HIGH

#### 6.1 UI/UX Polish
- Course card designs
- Lesson viewer improvements
- Progress visualization enhancements
- Mobile responsiveness
- Email template design improvements
- Assessment results visualization

#### 6.2 Documentation & Testing
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

## 📊 Success Metrics (Future Tracking)

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

## 🛠️ Technical Stack Additions (Future)

### New Dependencies (Potential)
```json
{
  "resend": "^3.0.0",  // or "sendgrid": "^5.x"
  "@tiptap/react": "^2.x",  // Rich text editor
  "@tiptap/starter-kit": "^2.x"
}
```

### New Environment Variables (Potential)
```bash
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@amanoba.com
EMAIL_FROM_NAME=Amanoba Learning
```

### New Database Collections (Potential)
- `courses` (Course model)
- `lessons` (Lesson model)
- `course_progress` (CourseProgress model)
- `assessment_results` (AssessmentResult model)

---

## 🎯 Future Enhancements (Post-Launch)

### Course & Certification Enhancements
- **Final Quiz for Certification**: Add final comprehensive quiz at course completion for certificate eligibility
- **Publicly Available & LinkedIn-Compatible Certificates**: Generate shareable certificates with LinkedIn integration, public URLs, and Open Graph metadata
- **Course Social Features**: 
  - Add Google/Facebook/other social feedback star ranking to courses
  - Add "Share this course" functionality to course pages
- **Course authorship & attribution**
  - **Author of the course**: Select registered user(s) as course authors (stored and displayed per course).
  - **Checked and reviewed by quality assurance**: Select registered user(s) as QA reviewers (stored and displayed per course).
  - **Course advisor**: Select registered user(s) as course advisors (stored and displayed per course).
- **Course & content voting**
  - Up/down vote for course (aggregate score and optional display).
  - Up/down vote for lessons (per-lesson score).
  - Up/down vote for questions (per-question score; e.g. quiz feedback).

  **Actionable items (delivery order)**:
  1. **Data model** — Add `CourseVote` (or embed votes on Course): `courseId`, `playerId`, `vote` (+1 / -1), `createdAt`; aggregate/cache `courseScore` on Course for display. Add `LessonVote` (or embed): `lessonId`, `playerId`, `vote`, `createdAt`; optional `lessonScore` on Lesson. Add `QuestionVote` (or embed): `questionId` (QuizQuestion ref), `playerId`, `vote`, `createdAt`; optional score cache on QuizQuestion or separate aggregate.
  2. **API — Course votes** — `POST /api/courses/[courseId]/vote` (body: `{ vote: 1 | -1 }`); require auth; upsert one vote per player per course; return updated aggregate. `GET /api/courses/[courseId]` (or public course endpoint) include `score` / `voteCount` for optional display.
  3. **UI — Course vote** — On course detail page (and optionally course card): show aggregate score and up/down controls; call vote API on click; one vote per user per course.
  4. **API — Lesson votes** — `POST /api/lessons/[lessonId]/vote` (body: `{ vote: 1 | -1 }`); require auth; upsert per player per lesson; return aggregate. `GET` lesson or course-lesson response includes lesson score if needed.
  5. **UI — Lesson vote** — In lesson viewer: show score and up/down controls; call lesson vote API.
  6. **API — Question votes** — `POST /api/questions/[questionId]/vote` (body: `{ vote: 1 | -1 }`); require auth; upsert per player per question; return aggregate (e.g. for quiz feedback).
  7. **UI — Question vote** — After quiz question or on feedback view: optional up/down per question; call question vote API.
  8. **Admin/display** — Optional: admin view of vote aggregates per course/lesson/question; decide where to display public scores (course card, lesson header, quiz results).
  9. **Vote reset on lesson update** — When a lesson is updated/finetuned (content or quiz changed), reset the upvote/downvote (and aggregate score) for that lesson so votes reflect the current content; optionally clear `LessonVote` records for that lesson or set score to null and recompute on next vote.

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
- **Editor user**: See “Editor User — Limited Admin Access” under Upcoming Milestones: editors have limited admin UI access and can only edit courses they created or that are assigned to them.

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

## 🎯 RECOMMENDED NEXT 3 ITEMS

Based on current priorities (see Tech Debt P0/P1 and TASKLIST.md). Certificate v0.1, Editor User, and User profile customization → **RELEASE_NOTES.md** (v2.9.18–v2.9.20).

### 1. Global audit — communication + catalog language integrity (P0)

**Status**: 🟡 OPEN  
**Docs**: `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`, audit scripts

- Course catalog language integrity (`course.name`, `course.description`, `course.translations.*`)
- Code-level email audit (send-time language leakage)
- Localize transactional emails and gate sending on language integrity

---

### 2. Onboarding Survey / Email Automation / Multi-Format Forking (P2)

**Status**: 🟡 PLANNED  
**Docs**: ROADMAP § Onboarding Survey, Email Automation, Multi-Format Forking

- Onboarding survey (multi-step, recommendations, segmentation)
- Email automation and personalization
- Multi-format course forking

---

### 3. P1 Tech debt — design system, debug logs, Facebook cleanup

**Status**: 🟡 OPEN  
**Docs**: ROADMAP § Tech Debt

- Design system: CTA token (#FAB908), replace inline styles
- Remove client debug logs before production
- Facebook cleanup post-migration

---

**Maintained By**: Narimato  
**Review Cycle**: Weekly during active development  
**Next Review**: 2026-02-03
