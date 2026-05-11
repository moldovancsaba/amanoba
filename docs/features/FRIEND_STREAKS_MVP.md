# Friend Streaks MVP

## Objective

Ship a bounded peer-accountability loop that reuses Amanoba's real learning signals instead of introducing a full social network.

## MVP Scope

- One learner creates an invite code from the dashboard.
- A second learner joins that code.
- The pair gets a shared streak only when both learners complete at least one qualifying learning action on the same calendar day.
- The dashboard shows:
  - pending invite state
  - active pair streaks
  - current streak
  - best streak
  - simple state labels (`Shared today`, `At risk today`, `Needs restart`)
- Either learner can remove the connection.

## Qualifying Actions

- Lesson completion
- Passed lesson quiz

Same-day repeats do not increment the shared streak.

## Shared Streak Rule

1. Learner A studies today: no shared increment yet.
2. Learner B studies on the same day: the pair earns that shared day.
3. If the previous shared day was yesterday, the streak increments.
4. If the previous shared day was older than yesterday, the shared streak restarts at `1`.

## Privacy / Safety Boundaries

- No public directory or discovery flow.
- No global follower graph.
- Invite-only pairing.
- Remove connection is immediate and available to either learner.
- Dashboard visibility is limited to the paired learners.

## Data Model

- `FriendStreak`
  - owner / invited learner pair
  - invite code
  - pair status: `pending`, `active`, `ended`
  - per-learner last qualifying day
  - current / best shared streak
  - milestone history

## API Surface

- `GET /api/friend-streaks`
  - returns pending + active friend streak state for the signed-in learner
- `POST /api/friend-streaks`
  - `action: "create"` creates or reuses one pending invite
  - `action: "join"` activates an invite code
- `DELETE /api/friend-streaks`
  - ends a pending or active connection for the signed-in learner

## Rollout Boundaries

- No notifications yet
- No rewards yet
- No multi-step moderation workflow
- No backfill from historical activity before the connection exists

## Follow-up Ideas

- Pair-specific milestone rewards
- Reminder nudges when a shared streak is at risk
- Optional notes or encouragement templates
- Small-group streaks after pair behavior proves useful
