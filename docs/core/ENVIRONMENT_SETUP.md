# Environment Setup Guide

**Project**: Amanoba  
**Last Updated**: 2026-02-26

---

## Purpose

This document defines how to set up Amanoba safely in local and production environments.

Canonical rules:
- Never commit secrets to git.
- `.env.local.example` is the template source of truth.
- Production deployment is triggered by pushing to `origin/main` (GitHub -> Vercel integration).

---

## Prerequisites

- Node.js >= 20 and < 25
- npm >= 10
- MongoDB Atlas project/database access
- SSO provider credentials (OIDC)
- Stripe account (if payments are enabled)
- Email provider account (`resend`, `smtp`, or `mailgun`)

---

## Local Setup

1. Clone and install:
```bash
git clone https://github.com/moldovancsaba/amanoba.git
cd amanoba
npm install
```

2. Create env file from template:
```bash
cp .env.local.example .env.local
```

3. Fill required values in `.env.local`.

4. Run locally:
```bash
npm run dev
```

---

## Required Environment Variables

Use `.env.local.example` for the complete list and naming.

Required groups:
- Database: `MONGODB_URI`
- Auth/session: `AUTH_SECRET`, `NEXTAUTH_URL`
- SSO/OIDC: `SSO_AUTH_URL`, `SSO_TOKEN_URL`, `SSO_JWKS_URL`, `SSO_ISSUER`, `SSO_CLIENT_ID`, `SSO_CLIENT_SECRET`, `SSO_REDIRECT_URI`, `SSO_SCOPES`
- App URL: `NEXT_PUBLIC_APP_URL`
- Email: `EMAIL_PROVIDER` + provider-specific credentials
- Payments (if enabled): `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

Optional groups:
- Push notifications (VAPID)
- Analytics (`NEXT_PUBLIC_GA_ID`)
- Logging/debug flags

---

## Production Setup

### Deployment model

Production deploys are automated via GitHub integration:

1. Commit changes
2. Push to `origin/main`
3. Vercel builds and deploys automatically

Do not run manual `vercel --prod` unless explicitly requested.

### Production environment variables

Configure all required vars in your host (Vercel) Project Settings -> Environment Variables.

Minimum checks:
- `NEXT_PUBLIC_APP_URL` matches the production domain (`https://www.amanoba.com`)
- `NEXTAUTH_URL` matches production callback base URL
- SSO redirect URI matches `/api/auth/sso/callback`
- Database and email credentials are present for production scope

### MongoDB Atlas

- Use least-privilege DB user
- Restrict network access as much as practical for your deployment model
- Keep automated backups enabled

---

## SSO Notes

Amanoba uses SSO/OIDC and anonymous sign-up. Facebook login is not part of the active auth flow.

Key production callback pattern:
- `https://www.amanoba.com/api/auth/sso/callback`

Reference docs:
- `docs/sso/SSO_IMPLEMENTATION_DETAILS.md`
- `docs/sso/SSO_MIGRATION_COMPLETE.md`

---

## Security Rules

Never commit:
- `.env.local`
- private keys/tokens/secrets
- connection strings with credentials

Rotate on schedule or incident:
- `AUTH_SECRET`
- `SSO_CLIENT_SECRET`
- DB credentials
- email/payment secrets

---

## Troubleshooting

### Build passes locally but fails in production
- Check Node version alignment (20.x/22.x runtime)
- Confirm all production env vars are set in host settings
- Re-check callback URLs and domain-specific vars (`NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`)

### SSO login fails
- Verify issuer/JWKS/token/auth URLs
- Verify `SSO_SCOPES` includes required scopes
- Verify callback URL exact match in provider config

### Email sending fails
- Confirm `EMAIL_PROVIDER` and matching credentials
- Validate sender identity/domain in provider

---

## Operational References

- Deployment runbook: `docs/deployment/DEPLOYMENT.md`
- Contribution/DoD rules: `docs/core/CONTRIBUTING.md`
- Agent operating rules: `docs/core/agent_working_loop_canonical_operating_document.md`

