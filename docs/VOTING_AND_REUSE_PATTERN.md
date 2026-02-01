# Unified Voting and Reuse Pattern

**Last Updated**: 2026-01-28

This document describes the **unified up/down voting** implementation and the general pattern for **reusing the same feature in 2+ places**.

---

## 1. Unified voting (one solution, many targets)

Voting is implemented once and reused everywhere we need up/down votes.

### Single implementation

| Layer | What | Where |
|-------|-----|------|
| **Model** | One collection for all vote targets | `ContentVote`: `targetType`, `targetId`, `playerId`, `value` (1 \| -1) |
| **API** | One endpoint for submit and aggregate | `POST /api/votes`, `GET /api/votes?targetType=&targetId=&playerId=` |
| **UI** | One component for any votable entity | `ContentVoteWidget`: `targetType`, `targetId`, `playerId`, `label?`, `className?` |

The **discriminator** is `(targetType, targetId)`:

- `targetType` = kind of entity (course, lesson, question, discussion_post).
- `targetId` = that entity’s id (e.g. courseId, lesson `_id`, post `_id`).

So the same model, API, and widget serve courses, lessons, questions, and discussion posts.

### Supported target types

- `course` — course detail page (“Was this course helpful?”)
- `lesson` — lesson viewer (“Was this lesson helpful?”)
- `question` — (reserved for quiz questions if needed)
- `discussion_post` — each discussion post (up/down per post)

### Adding voting to a new place

1. **Model**: Add a new value to `VoteTargetType` in `app/lib/models/content-vote.ts` (type + schema enum).
2. **API**: Add that value to `VALID_TYPES` in `app/api/votes/route.ts`.
3. **Widget**: Add that value to the `VoteTargetType` in `components/ContentVoteWidget.tsx`.
4. **UI**: Render `<ContentVoteWidget targetType="your_type" targetId={entityId} playerId={playerId} label="…" />` where the entity is shown.

No new collections, routes, or components. One behaviour, many targets.

---

## 2. How to reuse a feature in 2+ places (general pattern)

When you want the **same behaviour** in multiple contexts (e.g. vote on courses, lessons, posts):

1. **One model**  
   One schema/collection with a **discriminator** field (e.g. `targetType`) so one document can refer to different kinds of entities (e.g. course vs lesson vs post). Optionally a second field for the entity id (e.g. `targetId`).

2. **One API**  
   One set of routes that accept the discriminator (and id) and apply the same logic regardless of entity type. Validate the discriminator against an allow-list.

3. **One UI component**  
   One component that takes the discriminator and entity id (and any context like `playerId`, `label`). It calls the single API and renders the same UX everywhere.

4. **To add a new “place”**  
   - Extend the discriminator (e.g. add a new `targetType`).  
   - Use the same component with the new type and the new entity’s id.  
   - Do **not** duplicate model, API, or widget.

### Benefits

- **Consistency**: Same UX and rules everywhere (e.g. one vote per user per target).
- **Maintainability**: Fixes and changes happen in one model, one API, one component.
- **Scalability**: New surfaces (e.g. study group posts, comments) only add a discriminator value and a single component usage.

### Example: voting

- **Model**: `ContentVote` with `targetType` ∈ { course, lesson, question, discussion_post }.
- **API**: `/api/votes` with `targetType` + `targetId`.
- **UI**: `<ContentVoteWidget targetType="…" targetId="…" playerId="…" />` on course page, lesson page, and each discussion post.

### Other candidates for this pattern

- **Comments/replies**: One `Comment` model with `targetType` (e.g. course, lesson, post) + `targetId`; one API; one `CommentList`/`CommentForm` component.
- **Reactions**: One `Reaction` model with `targetType` + `targetId`; one API; one reaction bar component.

---

**Maintained by**: Engineering  
**See also**: `app/lib/models/content-vote.ts`, `app/api/votes/route.ts`, `components/ContentVoteWidget.tsx`, `docs/ARCHITECTURE.md`
