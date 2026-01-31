# Amanoba Roadmap — Future Vision & Client Benefits

**Version**: 2.9.33  
**Last Updated**: 2026-01-28

This document describes **what we want to build in the future** and **what benefits we want to give to clients**. It is not a task list. Actionable tasks derived from this roadmap live in **TASKLIST.md**. Completed work is in **RELEASE_NOTES.md**.

---

## Vision

**Amanoba** is a **unified 30-day learning platform** that combines:

- **Structured learning**: 30-day courses with daily lessons delivered via email
- **Gamified assessment**: Games (QUIZZZ, WHACKPOP, Madoku) as interactive surveys and assessments
- **Retained systems**: Login, rewards, achievements, leaderboards, and gamification
- **Course builder**: Admin interface to create and manage courses

### Core principles

1. **Games as assessments** — Existing games become student assessment tools
2. **Email-first learning** — Daily lessons via email with in-platform access
3. **Gamification intact** — All rewards, points, XP, achievements, and streaks remain
4. **30-day structure** — Each course is a 30-step journey (one lesson per day)
5. **Modular course system** — Build courses using the same flexible architecture as games

---

## Future Functions We Want to Implement

_Already delivered (see RELEASE_NOTES): User profile customization (v2.9.19), Editor User (v2.9.18), Certificate v0.1 (v2.9.20), Multi-Format Forking / Shorts (v2.9.24), Onboarding Survey, Email Automation Phase 1 (v2.9.28), Email tracking lesson/reminder/welcome/payment (v2.9.30), Selective unsync/re-sync for child courses (v2.9.31), Course-specific achievements and leaderboards (v2.9.32), Content voting (v2.9.32), Certificate enhancements — per-child overrides/templates, localized certs, LinkedIn share, QR codes (v2.9.33). Below = not yet delivered._

---

### Email automation — Phase 2 and beyond

**What we want:** A/B testing for key emails; optional integration with MailerLite/ActiveCampaign for advanced workflows, drip campaigns, and richer analytics.

**Client benefits:**

- Learners receive more relevant, personalised emails
- Admins get better analytics and automation to improve engagement and conversions

---

### Certificate enhancements

**What we want:** Per-child certificate overrides; multiple templates per course; localized certificates; dynamic pass rules; LinkedIn Add-to-Profile; QR codes; A/B testing of certificate designs.

**Client benefits:**

- Learners get certificates that fit their course and language
- Learners can showcase completion on LinkedIn and elsewhere more easily

---

### Multi-format course enhancements

**What we want:** More schedule types; richer recommendation logic for 1-hour diagnostic flows; admin tooling for preview and sync alerts.

**Client benefits:**

- Learners can choose 7-day, weekend, 1-day, or 1-hour formats that fit their pace
- Admins can create and maintain short-format courses with less friction

---

### Course-specific achievements and leaderboards

**What we want:** Further course achievements (e.g. Perfect Assessment, Consistent Learner) and richer leaderboard metrics; course-specific leaderboards (completion speed, scores, points, consistency).

**Client benefits:**

- Learners get clear milestones and recognition per course
- Learners can compare progress with others on the same course

---

### Course and content voting

**What we want:** Up/down voting for courses, lessons, and questions; aggregate scores; display on course cards and lesson headers; admin view of aggregates; vote reset when lesson content is updated.

**Client benefits:**

- Learners and admins see which content is most helpful
- Content quality improves from feedback

---

### UI/UX polish and reliability

**What we want:** Improved course cards, lesson viewer, and progress visualisation; mobile responsiveness; better email templates and assessment result visuals; test coverage (e.g. smoke tests for dashboard, courses, critical APIs) so the product stays reliable.

**Client benefits:**

- Learners get a clearer, more consistent experience on all devices
- Fewer regressions and faster, safer releases

---

### Future quarters (Q2–Q4 2026 and beyond)

**What we want:**

- **Short-format tracks**: 1-hour, 1-day, weekend, 7-day courses as first-class offerings
- **Multiple courses**: Enrolment in several courses at once; prerequisites
- **Live sessions**: Scheduled live lessons with instructors
- **Community**: Discussion forums, study groups
- **AI-powered personalisation**: Adaptive difficulty and recommendations from assessments
- **Instructor dashboard**: Instructors create and manage their own courses
- **Mobile app**: Native app and offline access
- **Video lessons**: Video in lessons; in-lesson quizzes

**Client benefits:**

- Learners get more flexibility, support, and variety
- Admins and instructors can scale and differentiate offerings

---

## Client Benefits Summary

| Who            | Benefits we want to deliver |
|----------------|-----------------------------|
| **Learners**   | Certificates they can share; short-format options (7d, weekend, 1d, 1h); course achievements and leaderboards; better email relevance; voting and feedback; mobile and offline; live and community features |
| **Admins**     | Email analytics and A/B testing; course and content voting insights; multi-format and certificate tooling; reliable releases via tests |
| **Business**   | Higher engagement, completion, and retention; clearer product direction; scalable course and content creation |

---

## Success Metrics (Future Tracking)

- **Learning**: Course enrolment rate; lesson and course completion rate; email open rate; assessment engagement; daily active learners
- **Retention**: D7/D30 retention; course abandonment rate
- **Engagement**: Average lessons completed; assessment participation; points and achievements from courses

---

## Principles (How We Build)

- **Similar to game builder**: Same architectural patterns for courses
- **Email-first**: Lessons via email; all content also in platform; timezone-aware; catch-up support
- **Gamification retained**: Course activities award points and achievements; streaks and leaderboards stay
- **Backward compatibility**: Existing games and gamification keep working; courses are opt-in

---

**Maintained By**: Product / Engineering  
**Review**: When strategy or priorities change  
**Next Review**: 2026-02-03
