# Tech Audit Journey Matrix

**Last updated:** 2026-05-29  
**Legend:** ✅ verified | ⚠️ partial | ❌ failed | 🔲 not tested (needs auth/session)

## Production anonymous (automated)

| Journey | Role | Locale | Result | Evidence |
| --- | --- | --- | --- | --- |
| Home redirect | Anonymous | default | ✅ | `/` → `/hu` 200 |
| Public courses | Anonymous | en, hu, ar | ✅ | `/en/courses`, `/hu/courses`, `/ar/courses` 200 |
| Sign-in page | Anonymous | en | ✅ | `/en/auth/signin` 200 |
| Practice hub page | Anonymous | en | ✅ | `/en/practice` 200 (page shell) |
| Saved lessons page | Anonymous | en | ✅ | `/en/saved` 200 (page shell) |
| Blog | Anonymous | en | ✅ | `/en/blog` 200 |
| Dashboard gate | Anonymous | en | ✅ | Redirect to sign-in with callbackUrl |
| Admin gate | Anonymous | en | ✅ | Redirect to sign-in |
| Editor gate | Anonymous | en | ✅ | Redirect to sign-in |
| SEO | Anonymous | — | ✅ | robots + sitemap 200 |

## API anonymous (automated)

| Journey | Endpoint | Expected | Result |
| --- | --- | --- | --- |
| Checkout blocked | POST `/api/payments/create-checkout` | 401 | ✅ |
| Admin courses blocked | GET `/api/admin/courses` | 401 | ✅ |
| Practice hub blocked | GET `/api/practice-hub` | 401 | ✅ |
| Saved lessons blocked | GET `/api/saved-lessons` | 401 | ✅ |
| Access probe | GET `/api/admin/access` | 200 false flags | ✅ |

## Authenticated learner (manual — 🔲)

Requires SSO test account. Highest priority from user feedback.

| Journey | Steps | Status |
| --- | --- | --- |
| SSO sign-in + callback | Open protected URL → SSO → return | 🔲 |
| Enrol course | Courses → enrol → my-courses | 🔲 |
| Lesson + quiz | Open lesson → complete → quiz pass/fail | 🔲 |
| Practice hub data | `/en/practice` loads recommendations | 🔲 |
| Saved lessons | Save/unsave lesson day | 🔲 |
| Premium purchase | Checkout → webhook → access | 🔲 |
| Certificate | Pass course → verify public URL | 🔲 |

## Admin (manual — 🔲)

Recent GDS migration — high regression risk.

| Journey | Steps | Status |
| --- | --- | --- |
| Admin shell nav | All sidebar links load | 🔲 |
| Payments list | Filter, paginate, view transaction | 🔲 |
| Players list | Search, row actions | 🔲 |
| Course editor | Edit metadata → ContentOps save bar → dirty state | 🔲 |
| Course import/export | Import JSON modes | 🔲 |
| Feature flags | Toggle flags (post AUDIT-001 fix) | 🔲 |
| Leaderboards | Staleness GET (post AUDIT-002 fix) | 🔲 |

## Editor portal (manual — 🔲)

| Journey | Steps | Status |
| --- | --- | --- |
| Editor access | Editor-only user nav | 🔲 |
| Lesson editor | EditorScaffold save + quiz manager | 🔲 |

## i18n (manual — 🔲)

| Locale | Surface | Status |
| --- | --- | --- |
| `hu` | Courses + dashboard | 🔲 |
| `en` | Full P0 set | 🔲 |
| `ar` | RTL layout smoke | 🔲 |

## Next automation target (Playwright)

1. Anonymous redirect matrix (already curl-covered)
2. Authenticated learner: practice-hub API + UI
3. Admin: one ResponsiveDataView page
4. Editor: lesson save PATCH
