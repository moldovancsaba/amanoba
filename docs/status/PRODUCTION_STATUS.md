# Production Status

**Last Updated**: 2026-05-28
**Status**: Production stable; GitHub push to `origin/main` deploys through Vercel.

---

## Canonical Deployment Truth

- Production deployment is automated via GitHub integration.
- Shipping path is: commit -> push to `origin/main` -> automated Vercel production deploy.
- Manual Vercel CLI deploy is exception-only and should be used only when explicitly requested.
- Production aliases are `https://www.amanoba.com`, `https://amanoba.com`, `https://amanoba-narimato.vercel.app`, and `https://amanoba-git-main-narimato.vercel.app`.

Reference:
- `docs/deployment/DEPLOYMENT.md`

---

## Current Verification Policy

After each production push:

1. Confirm latest deploy SHA matches the intended `origin/main` commit.
2. Verify baseline routes:
   - `/`
   - `/robots.txt`
   - `/sitemap.xml`
   - `/en/auth/signin`
3. Verify the feature area touched by the release.
4. Log completed changes in `docs/product/RELEASE_NOTES.md`.

---

## Last Recorded Production Verification

Latest recorded verification in this repo: **2026-05-28** during the post-GDS/documentation closure reconciliation pass.

Verified baseline routes:

- `/` — 200, redirected to `/hu`
- `/robots.txt` — 200
- `/sitemap.xml` — 200
- `/en/auth/signin` — 200
- `/en/courses` — 200
- `/en/blog` — 200
- `/en/news` — 200
- `/en/practice` — 200
- `/en/saved` — 200
- `/en/editor/courses` — 200 after anonymous redirect to `/en/auth/signin?callbackUrl=%2Fen%2Feditor%2Fcourses`

Confirmed production content:

- Public blog/news routes are reachable.
- Protected editor route redirects anonymous users to localized sign-in.
- Baseline course, practice, saved-lessons, sitemap, and robots routes are reachable.
- Post-GDS verification is pending the next production deploy SHA confirmation; treat the route list above as the current baseline smoke set until that deploy is logged.

---

## Historical Incident Reports

Detailed legacy incident writeups were intentionally removed from this active status doc to reduce confusion.

If historical debugging context is required, use:
- `docs/_archive/**`
- Git history for this file
