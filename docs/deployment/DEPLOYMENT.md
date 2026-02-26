# Amanoba Deployment Guide

**Last Updated**: 2026-02-26

---

## Source Of Truth

Production deployment is automated from GitHub:
- Push to `origin/main`
- GitHub integration triggers Vercel production build/deploy

Manual Vercel CLI deploy is exception-only and should be used only when explicitly requested.

---

## Standard Deployment Flow

### 1. Pre-push checks

Run before shipping:

```bash
npm run build
npm run lint
npm run docs:check
```

If a command is not applicable for the change, document why.

### 2. Commit and push

```bash
git add -A
git commit -m "<semantic message>"
git push origin main
```

### 3. Verify deployment

After push:
- Confirm the latest commit SHA is deployed in Vercel
- Open production and verify critical routes:
  - `/`
  - `/robots.txt`
  - `/sitemap.xml`
  - `/en/auth/signin`
  - `/en/admin` (authorized admin only)

### 4. Smoke-check critical APIs

Run a minimal health pass appropriate for the change (for example auth, courses, certification, or admin endpoints touched by the release).

---

## Environment Configuration

Environment variables are managed in Vercel project settings.

Canonical variable references:
- `.env.local.example`
- `docs/core/ENVIRONMENT_SETUP.md`
- `docs/sso/SSO_IMPLEMENTATION_DETAILS.md`

Do not store secrets in repository docs.

---

## Rollback Plan

If production regression is found:

1. Revert the offending commit on `main`:
```bash
git revert <bad_commit_sha>
git push origin main
```

2. Confirm the rollback commit deploys successfully.

3. Re-run focused smoke checks on affected areas.

Optional emergency action (UI/manual): promote previous known-good deployment in Vercel dashboard when immediate service restoration is required.

---

## Release Checklist

A release is complete only when all are true:
- Code is merged and pushed to `origin/main`
- Automated production deployment finished successfully
- Core smoke checks pass
- Relevant docs are updated (tasklist/release notes/feature docs as applicable)

