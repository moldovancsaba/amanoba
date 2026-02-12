# Amanoba Roadmap — Future Vision & Client Benefits

> **Source of truth is now the [MVP Factory Board](https://github.com/users/moldovancsaba/projects/1).** Roadmap items have been migrated to issues with **Status = Roadmap** (Product = amanoba). This file is kept as reference only. Add new vision items as issues in [mvp-factory-control](https://github.com/moldovancsaba/mvp-factory-control), add to the project, set Status = Roadmap. See [MIGRATION_ROADMAP_TASKLIST.md](https://github.com/moldovancsaba/mvp-factory-control/blob/main/docs/MIGRATION_ROADMAP_TASKLIST.md).

**Version**: 2.9.48  
**Last Updated**: 2026-02-12

This document describes **what we want to build in the future** and **what benefits we want to give to clients**. It is not a task list. **Rules:** Do not list anything that is already delivered (see **RELEASE_NOTES.md**). Do not list anything that has been turned into tasks (see **TASKLIST.md**). Only future vision that is not yet broken down into tasks belongs here. **Only related items:** Only content that belongs in the ROADMAP may appear here — no delivered items, no task-list items, no unrelated content.

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

_(Nothing delivered or already on TASKLIST appears here. Delivered work: RELEASE_NOTES.md. Current tasks: TASKLIST.md. Certificate tooling — pass rules, template A/B — is delivered; see RELEASE_NOTES.)_

---

### Future quarters (Q2–Q4 2026 and beyond)

Items already broken down into tasks (multiple courses, live sessions, AI personalisation, instructor dashboard, mobile/offline, video lessons) are tracked on the MVP Factory Board and in `docs/product/TASKLIST.md`, so they are intentionally not duplicated here.

**What we want:**

- **Cross-repo documentation federation**: Unified docs discovery across `amanoba` and `amanoba_courses` without local-only path coupling
- **Portable cross-repo references**: Standard link convention that works on any machine (published URL first, local filesystem path optional)

**Client benefits:**

- Teams can navigate product + course docs without broken handoff links
- Documentation maintenance becomes less fragile across repos and environments

---

### Certification templates and defaults

**What we want:**

- **Global default certificate**: Admins define a default certification template (design, palette, credential metadata) that automatically applies to courses that do not have their own assigned certificate, keeping new courses consistent out of the box.
- **Custom certificate library**: Allow admins to create and save reusable certification templates in the admin UI and assign them to individual courses so bespoke certifications can coexist with the default baseline.

**Client benefits:**

- Admins can roll out new branding or credential styles immediately without touching every course.
- Courses inherit sensible defaults but can adopt custom certificates when the curriculum or credential demands it.

---

## Client Benefits Summary (future only)

| Who            | Benefits we want to deliver (not yet delivered or on TASKLIST) |
|----------------|----------------------------------------------------------------|
| **Learners**   | More consistent certificate branding and credential trust across courses |
| **Admins**     | Unified documentation discovery and reusable certificate defaults/templates |
| **Business**   | Lower operational risk from documentation drift; faster onboarding for delivery teams |

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
**Next Review**: 2026-02-19
