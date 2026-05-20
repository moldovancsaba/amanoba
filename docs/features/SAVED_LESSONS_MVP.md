# Saved Lessons MVP

**Last Updated**: 2026-05-20
**Status**: Active

## Context

Amanoba issue `#770` asks for bookmarks, saved content, and a resume library that help learners restart intentionally after interruptions.

## MVP scope

The first release is intentionally narrow:

- learners can save lesson positions from the enrolled lesson view
- Amanoba exposes a dedicated `Saved Lessons` page
- each saved item includes both:
  - a direct link back to the saved lesson
  - a resume link for the learner's current course position

Out of scope:

- generic bookmarking across every content type
- large passive history logs
- multiple save collections with overlapping meaning

## Product rule

Saved content should reflect learning intent, not generic web-style bookmarking. The first save unit is therefore a course lesson position, because it is the smallest meaningful revisit target in the current Amanoba flow.

## Learner workflow

1. The learner opens an enrolled lesson position.
2. The learner saves that lesson for later review.
3. The learner can later open the `Saved Lessons` page from the dashboard.
4. For each saved item, Amanoba offers:
   - `Open saved lesson`
   - `Resume course`

This keeps saved content tied to both review and progression.

## Data contract

Saved lesson persistence stores:

- `playerId`
- `brandId`
- `courseId`
- `lessonDay`
- optional `lessonId`
- `savedAt`

Uniqueness rule:

- one saved item per `{ playerId, courseId, lessonDay }`

## Resume contract

The resume library should not invent separate history logic. It should derive continuity from the existing `CourseProgress` model:

- `currentDay`
- `completedDays`
- `lastAccessedAt`

Each saved item therefore shows:

- whether the saved lesson is already completed
- the learner's current course lesson position
- a saved-lesson href
- a course-resume href

## Why this shape

This MVP solves the continuity problem without creating a second navigation system:

- the save target is specific and actionable
- the learner gets both revisit and resume choices
- the implementation reuses existing course-progress truth

## Verification

- confirm learners can save and unsave a lesson position
- confirm `Saved Lessons` lists saved items for the authenticated learner
- confirm each item links both to the saved lesson position and to the learner's current course position
- confirm duplicate saves do not create duplicate records

## Rollback

- remove the `SavedLesson` model and saved-lessons API
- remove the lesson-page save toggle
- remove the saved-lessons page and dashboard entry point
- remove this doc and the related handover entry
