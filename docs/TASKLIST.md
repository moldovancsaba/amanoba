# Amanoba Task List

**Version**: 2.9.33  
**Last Updated**: 2026-01-28

This document lists **actionable tasks** derived from the roadmap and current backlog. Each item is something to do. When a task is completed, move it to **RELEASE_NOTES.md** and remove it from this list. Ideas and vision live in **ROADMAP.md**.

**Remaining open (as of v2.9.33):** Optional email A/B and MailerLite/ActiveCampaign (5).

---

## Action Items (priority order)

### Quality & reliability

1. ~~Add minimal `npm test` and smoke tests~~ — **Done** (v2.9.29); see RELEASE_NOTES.
2. ~~Fix profile stats, admin settings, system-info, game status API, challenge retry~~ — **Done** (P3); see `docs/P3_KNOWN_ISSUES_BACKLOG.md`.
3. ~~Standardise imports and logging~~ — **Done** (v2.9.32); see RELEASE_NOTES. §12 items: logger @/lib/logger, debug logs gated.

_(User profile customization — v2.9.19; Editor User — v2.9.18. See RELEASE_NOTES; not listed as tasks.)_

### Email automation Phase 2 (from ROADMAP)

4. ~~Extend email tracking (messageId, open/click) to lesson, reminder, welcome, payment~~ — **Done** (v2.9.30); see RELEASE_NOTES.
5. (Optional) Add A/B testing for key emails; (optional) MailerLite/ActiveCampaign integration per ROADMAP.

### Certificate enhancements (from ROADMAP)

6. ~~Implement per-child certificate overrides and/or multiple templates per course~~ — **Done** (v2.9.33); see RELEASE_NOTES.
7. ~~(Optional) Localized certificates; LinkedIn Add-to-Profile; QR codes~~ — **Done** (v2.9.33); see RELEASE_NOTES.

### Multi-format enhancements (from ROADMAP)

8. ~~Implement selective unsync/re-sync for child courses (per ROADMAP); improve admin preview and sync alerts~~ — **Done** (v2.9.31); see RELEASE_NOTES.

### Course achievements & leaderboards (from ROADMAP)

9. ~~Extend achievement system for course-specific achievements (First Lesson, Week 1, Course Master, etc.); award on lesson/assessment/course completion~~ — **Done** (v2.9.32); see RELEASE_NOTES.
10. ~~Add course-specific leaderboards (completion speed, scores, points, consistency); update on lesson and assessment completion~~ — **Done** (v2.9.32); see RELEASE_NOTES.

### Course & content voting (from ROADMAP)

11. ~~Add CourseVote / LessonVote / QuestionVote (or embed); APIs for vote and aggregate; UI on course detail, lesson viewer, quiz feedback; admin view of aggregates; vote reset on lesson update when content changes~~ — **Done** (v2.9.32); see RELEASE_NOTES.

---

## Legend

- ✅ **DONE** — Completed; move to RELEASE_NOTES and remove from here  
- 🟡 **IN PROGRESS** — Currently being worked on  
- ⏳ **PENDING** — Not yet started  
- 🚫 **BLOCKED** — Waiting on dependency  
- ⚠️ **AT RISK** — Behind or facing issues  

---

**Maintained By**: AI Agent / Engineering  
**Review**: When tasks are completed or new work is broken down from ROADMAP  
**Last Major Update**: v2.9.33 (Tasks 6, 7 completed; remaining: optional email A/B only)
