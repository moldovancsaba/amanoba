# Learning Streak MVP

## Context

Amanoba issue `#750` calls for a streak system that supports daily learning habits rather than empty compulsive behavior.

## MVP rule

The first streak implementation is a `daily_learning` streak.

It advances when a learner completes at least one meaningful course-learning action on a calendar day:

- complete a lesson day
- pass a lesson quiz

It does not advance more than once per day, even if the learner completes multiple lessons or quizzes on that same day.

## Why this rule

This keeps the habit loop fair:

- strong enough to reward return behavior
- hard to farm through repeated low-value actions
- aligned with Amanoba’s lesson cadence and quiz gating

## Recovery behavior

- same-day repeat activity: no penalty, no extra increment
- next-day qualifying activity: continue streak
- missed day: streak restarts at `1` on the next qualifying learning action

This is intentionally forgiving in tone but strict in counting.

## Visible surfaces

The first learner-facing streak surface is the existing dashboard streak card.

The card now distinguishes:

- `Win Streak`
- `Daily Login Streak`
- `Learning Streak`

## Interaction with reminders and scheduler

The MVP does not change reminder delivery rules directly. Instead:

- scheduler/reminder systems keep helping learners return
- the learning streak measures whether they actually complete meaningful learning after returning

This keeps measurement cleaner than rewarding reminder opens or page visits.

## Measurement contract

Track the streak as a habit intervention, not a vanity counter.

Questions this MVP should answer:

- do learners with an active learning streak complete more lesson days per week?
- does streak continuity correlate with better course progression?
- how often do learners preserve a streak via lesson completion vs quiz pass?

## Verification

- confirm a first qualifying learning action creates a `daily_learning` streak
- confirm a second qualifying action on the same day does not increment it
- confirm a next-day qualifying action increments it
- confirm the dashboard can display the active learning streak

## Rollback

- remove `daily_learning` from the streak model and manager
- remove learning-streak updates from lesson completion and quiz pass flows
- remove the dashboard label and this doc
