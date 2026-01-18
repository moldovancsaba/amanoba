# Amanoba Roadmap — Future Plans & Strategic Directions

**Version**: 2.7.0  
**Last Updated**: 2025-01-20T18:00:00.000Z  
**Vision**: Transform Amanoba into a unified 30-day learning platform with gamified education, assessment tools, and email-based lesson delivery

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

### P0 / High Priority
- Gate admin stats APIs (`app/api/admin/stats/verify`, `.../repair`) by role (admin/superadmin), not just session presence
- ~~Fix runtime crash in `app/api/admin/system-info/route.ts` (missing `fs`/`path` imports or dead code removal)~~ ✅ FIXED (v2.7.1)
- Implement token-based unsubscribe in `app/api/email/unsubscribe/route.ts` (currently 400 when token is provided) or drop the token param
- Restrict `app/api/profile/[playerId]` data exposure (wallet balances, `lastSeenAt`) to self/admin; clarify intended visibility
- Wire rate limiting (`app/lib/security.ts`) into auth/profile/admin/progress endpoints

### P1 / Medium Priority
- Localize and brand policy/legal pages; switch plain `Link`/`href=\"/\"` to `LocaleLink`, add missing HU/EN messages, and apply `globals.css` shell
- Reconcile `design-system.css` palette (indigo/pink) with `globals.css` gold/black; remove straggler per-page styles
- Remove client debug logs (dashboard, games/quizzz) before production builds

### P2 / Low Priority
- Add minimal test harness (`npm test`), smoke tests for `[locale]/dashboard`, `[locale]/courses`, and critical APIs
- Document/decide public profile surface and unsubscribe token contract to avoid regressions later

---

## 🚀 Upcoming Milestones

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
