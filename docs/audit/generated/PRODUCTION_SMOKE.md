# Production smoke — https://www.amanoba.com

## HTML routes

| Path | Status | Final URL | Pass |
| --- | ---: | --- | --- |
| `/` | 200 | /hu | ✅ |
| `/robots.txt` | 200 | /robots.txt | ✅ |
| `/sitemap.xml` | 200 | /sitemap.xml | ✅ |
| `/en/auth/signin` | 200 | /en/auth/signin | ✅ |
| `/en/courses` | 200 | /en/courses | ✅ |
| `/en/my-courses` | 200 | /en/auth/signin?callbackUrl=%2Fen%2Fmy-courses | ✅ |
| `/en/practice` | 200 | /en/practice | ✅ |
| `/en/saved` | 200 | /en/saved | ✅ |
| `/en/blog` | 200 | /en/blog | ✅ |
| `/en/dashboard` | 200 | /en/auth/signin?callbackUrl=%2Fen%2Fdashboard | ✅ |
| `/en/admin` | 200 | /en/auth/signin?callbackUrl=%2Fen%2Fadmin | ✅ |
| `/en/editor/courses` | 200 | /en/auth/signin?callbackUrl=%2Fen%2Feditor%2Fcourses | ✅ |
| `/hu/courses` | 200 | /hu/courses | ✅ |
| `/ar/courses` | 200 | /ar/courses | ✅ |

## API auth smoke (no session)

| Method | Path | Status | Expected | Pass | Snippet |
| --- | --- | ---: | --- | --- | --- |
| POST | `/api/payments/create-checkout` | 401 | 401/403 | ✅ | {"error":"Unauthorized"} |
| GET | `/api/admin/access` | 200 | 200/401/403 | ✅ | {"canAccessAdmin":false,"isAdmin":false,"isEditorOnly":false} |
| GET | `/api/editor/access` | 200 | 200/401/403 | ✅ | {"canAccessEditor":false,"isAdmin":false} |
| GET | `/api/admin/courses` | 401 | 401/403 | ✅ | {"error":"Unauthorized","message":"Authentication required"} |
| POST | `/api/admin/courses` | 401 | 401/403 | ✅ | {"error":"Unauthorized","message":"Authentication required"} |
| GET | `/api/practice-hub` | 401 | 401/403 | ✅ | {"error":"Unauthorized"} |
| GET | `/api/saved-lessons` | 401 | 401/403 | ✅ | {"error":"Unauthorized"} |
| GET | `/api/friend-streaks` | 401 | 401/403 | ✅ | {"error":"Unauthorized"} |
| GET | `/api/games` | 200 | 200/401 | ✅ | {"success":true,"games":[{"_id":"68f14a35b8be44fda3162f6d","gameId":"MADOKU","name":"Madoku","type":"MADOKU","descriptio |

---
HTML failures: 0; API failures: 0
