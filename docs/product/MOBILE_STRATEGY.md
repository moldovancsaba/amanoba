# Mobile Strategy & Scope (#12)

**Last Updated**: 2026-07-01
**Status**: Decision recorded — **PWA-first**. Native client deferred to IDEABANK/Roadmap.
**Related board items**: #7 (Mobile app), #12 (this scope), #20 (SW/caching hardening), #21 (native prototype)

---

## Decision

**Ship mobile as an enhanced PWA, not a native app — for now.**

Amanoba is already an installable PWA: it has a web app manifest, a registered
service worker (`public/service-worker.js`), and — as of 2026-07 — **web push
notifications wired end-to-end** (`app/lib/push/send-push.ts`, `/api/push/subscribe`,
`components/pwa/PushOptIn.tsx`). The learning experience is content- and form-driven
(lessons, quizzes, email), which the web platform serves well. A native app would
duplicate the entire surface for marginal gain today.

**Revisit native only when** one of these becomes a hard requirement:
- iOS push reliability/engagement parity beyond what web push on iOS delivers.
- Deep OS integration (widgets, background audio, offline video download DRM).
- App-store distribution is a business/marketing requirement in itself.

If/when that happens, the lowest-friction path is **Expo (React Native)** consuming
the existing REST API (auth via the same SSO), tracked as #21.

## Target

- **Primary**: PWA (installable, offline-capable, push-enabled) across mobile browsers.
- **Deferred**: React Native/Expo native client (#7/#21) — separate repo, shares the API + SSO contract.

## Offline data & sync strategy

Scope offline to **read the current course** and **never lose progress**, not full-app offline.

| Data | Strategy |
|------|----------|
| App shell (JS/CSS/icons) | SW precache of hashed Next.js build assets + navigation fallback. **(This is the concrete work in #20.)** |
| Lesson/course content (GET) | SW runtime cache, stale-while-revalidate, per-course; bounded cache size. |
| Key GET APIs (my-courses, course detail, lesson) | SW runtime cache with short TTL; network-first, cache fallback. |
| Progress writes (lesson complete, quiz submit) | Queue in **IndexedDB** when offline; flush via SW **Background Sync** with retry + idempotency (endpoints already idempotent). |
| Auth/session | Never cache; always network. SW must not intercept `/api/auth/*`. |

**Sync-safe progress**: lesson-completion and quiz-submit endpoints are idempotent,
so a replayed queued write is safe. The SW's current `syncGameSessions()` /
`syncAchievements()` are stubs — #20 fills them with a real IndexedDB queue.

## Constraints / guardrails

- `public/service-worker.js` is **protected** (do-not-modify-without-approval): it
  intercepts fetch and must not break NextAuth/session flows. Changes for #20 need
  a review pass + a staged rollout, not a drive-by edit.
- Keep the SW additive: precache + runtime cache + a scoped background-sync queue.
  Do not cache authenticated API responses beyond short TTLs.

## Next steps

1. **#20** — SW hardening: precache hashed build assets, add navigation preload, and
   a real IndexedDB background-sync queue for progress writes. *(Requires SW-owner
   approval; ship behind a staged rollout.)*
2. **#12** — closed by this document.
3. **#7 / #21** — native (Expo) client: keep in Roadmap/IDEABANK until a hard native
   requirement lands; when it does, build against the existing API + SSO.
