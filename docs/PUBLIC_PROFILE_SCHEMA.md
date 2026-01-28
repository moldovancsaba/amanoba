# Public Profile Schema

**Date**: 2026-01-28  
**Scope**: Fields and sections exposed when a non-owner views a **public** profile.  
**APIs**: `GET /api/players/[playerId]`, `GET /api/profile/[playerId]`

---

## Visibility rules

- **Private profile** (`profileVisibility === 'private'`): Non-owner requests receive **404** with message `"Profile not available"`.
- **Public profile**: Non-owner receives only **public fields** and only **sections** where `profileSectionVisibility[section] === 'public'`.

Owner and admin always receive full data plus `profileVisibility` and `profileSectionVisibility`.

---

## Public fields (non-owner, public profile)

| Area | Public fields | Never exposed to public |
|------|----------------|---------------------------|
| **Player** | `id`, `displayName`, `profilePicture`, `isPremium`, `createdAt`, `title` (if section "about" is public) | `email`, `lastLoginAt`, `lastSeenAt`, `premiumExpiresAt`, `surveyCompleted`, `skillLevel`, `interests`, wallet/Stripe data |
| **Progression** | Only if section **stats** is public: level, currentXP, xpToNextLevel, totalXP, title, nextTitle | — |
| **Statistics** | Only if section **stats** is public: totalGamesPlayed, totalWins, winRate, totalPlayTime, averageSessionTime, etc. | — |
| **Wallet** | Never | Always (owner/admin only) |
| **Streaks** | Only if section **stats** is public | — |
| **Achievements** | Only if section **achievements** is public: total, unlocked, progress, featured | — |
| **Course stats** | Only if section **courses** is public | — |
| **Recent activity** | Only if section **stats** is public (in profile API) | — |

---

## Section keys

- **about**: Basic profile (displayName, profilePicture, isPremium, createdAt, title).
- **courses**: Course enrollment / course stats.
- **achievements**: Achievement counts and featured achievements.
- **certificates**: Certificate list (when exposed via profile/certificate APIs).
- **stats**: Progression, statistics, streaks, recent activity.

Each section is `'public' | 'private'`; default is `'private'`. Only sections marked `'public'` are included in the API response for a non-owner viewing a public profile.
