# Amanoba Development Environment Status

**Date**: 2026-08-05
**Agent**: Cloud Agent (Cursor)
**Repository**: moldovancsaba/amanoba
**Branch**: main

---

## Environment Setup Status

### ✅ Completed

1. **Git Repository**
   - [x] Repository cloned and accessible
   - [x] Remote origin configured: `https://github.com/moldovancsaba/amanoba`
   - [x] Current branch: `main`
   - [x] Git status: Clean, synced with origin/main

2. **Node.js & Dependencies**
   - [x] Node.js version: v22.22.2 (compatible, requires >= 20.0.0, < 25.0.0)
   - [x] npm version: 10.9.7
   - [x] Dependencies installed: 916 packages
   - [x] Vercel CLI installed locally: v58.5.1

3. **Code Quality Verification**
   - [x] TypeScript type check: **PASSED** (no errors)
   - [x] Build dependencies verified
   - [x] Project structure intact

4. **Documentation**
   - [x] All core documentation read and indexed
   - [x] Learning summary generated: `AMANOBA_LEARNING_SUMMARY.md`
   - [x] Key files identified and accessible

5. **Environment Template**
   - [x] `.env.local.example` exists and documented (6117 bytes)
   - [x] `.env.local` created from template

---

## ⚠️ Pending User Action

### 1. Vercel Authentication Required

**Status**: Waiting for user authentication

**Action Required**: 
- Visit: https://vercel.com/oauth/device?user_code=QGJQ-SZQR
- Authenticate to enable Vercel CLI
- Once authenticated, environment variables can be pulled from Vercel

**Why**: This is needed to:
- Pull production environment variables from Vercel
- Link local project to Vercel deployment
- Enable deployment preview and production operations

**Background process**: 
- Shell ID: 437845 (running)
- Command: `npx vercel link`
- Status: Waiting for authentication

### 2. Environment Variables

**Status**: Template created, actual secrets needed

**Next Steps**:
After Vercel authentication completes:
```bash
npx vercel env pull .env.local
```

Or manually fill in `.env.local` with production values for:

**Critical variables:**
- `MONGODB_URI` — MongoDB Atlas connection string
- `AUTH_SECRET` — NextAuth secret (generate: `openssl rand -base64 32`)
- `SSO_CLIENT_ID` / `SSO_CLIENT_SECRET` — SSO credentials
- `EMAIL_PROVIDER` credentials (Resend, Gmail, or Mailgun)

**Optional variables:**
- Push notification keys (VAPID)
- Analytics (Google Analytics)
- MailerLite integration

---

## Development Readiness Checklist

### Can Start Now (Without Secrets)

- [x] Browse codebase
- [x] Read documentation
- [x] Review architecture
- [x] Plan features
- [x] Write code (TypeScript compilation works)
- [x] Run linting: `npm run lint`
- [x] Run type checking: `npm run type-check`
- [x] Run tests: `npm test`

### Requires Environment Variables

- [ ] Start development server: `npm run dev`
- [ ] Connect to MongoDB database
- [ ] Test authentication flows (SSO)
- [ ] Send test emails
- [ ] Run background workers: `npm run workers`
- [ ] Execute data seeding scripts
- [ ] Test payment flows (Stripe)

### Requires Vercel CLI Authentication

- [ ] Pull environment variables: `vercel env pull`
- [ ] Deploy to preview: `vercel`
- [ ] Deploy to production: `vercel --prod`
- [ ] View deployment logs: `vercel logs`
- [ ] Manage domains: `vercel domains`

---

## Quick Start Guide (After Secrets Available)

### IMPORTANT: Cloud Agent Environment

**This is a Cloud Agent environment** - localhost is not accessible to the user.

**All testing must happen via Vercel preview deployments.**

See **[CLOUD_AGENT_DEPLOYMENT_WORKFLOW.md](CLOUD_AGENT_DEPLOYMENT_WORKFLOW.md)** for complete workflow.

### 1. Verify Environment

```bash
# Check .env.local has all required variables
cat .env.local | grep -E "^(MONGODB_URI|AUTH_SECRET|SSO_CLIENT_ID|EMAIL_PROVIDER)="
```

### 2. Development Workflow

```bash
# Create branch
git checkout -b sentinel-squad/<feature-name>

# Make changes
# ...

# Run quality gates
npm run lint && npm run type-check && npm test

# Push to preview (triggers Vercel preview deployment)
git add -A
git commit -m "descriptive message"
git push origin sentinel-squad/<feature-name>

# Test on Vercel preview URL (not localhost)
```

### 3. Run Quality Gates

```bash
# Before committing any changes
npm run lint           # ESLint
npm run type-check     # TypeScript
npm test              # Vitest tests
npm run docs:check    # Documentation validation
```

### 4. Background Workers (Optional)

```bash
npm run workers
```

Requires `MONGODB_URI` in `.env.local`

---

## Environment Variables Reference

### Template Location

**Source**: `.env.local.example`
**Target**: `.env.local` (created, needs values)

### Required Variables

| Variable | Purpose | How to Get |
|----------|---------|------------|
| `MONGODB_URI` | Database connection | MongoDB Atlas dashboard |
| `AUTH_SECRET` | Session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Auth callback base | http://localhost:3000 (local) |
| `SSO_CLIENT_ID` | SSO authentication | SSO provider dashboard |
| `SSO_CLIENT_SECRET` | SSO authentication | SSO provider dashboard |
| `NEXT_PUBLIC_APP_URL` | App base URL | http://localhost:3000 (local) |
| `EMAIL_PROVIDER` | Email service | Choose: resend/gmail/mailgun |
| Provider credentials | Email sending | Provider dashboard |

### Optional Variables

| Variable | Purpose | How to Get |
|----------|---------|------------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Push notifications | `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | Push notifications | Same as above |
| `NEXT_PUBLIC_GA_ID` | Google Analytics | Google Analytics dashboard |
| `STRIPE_SECRET_KEY` | Payments | Stripe dashboard (if needed) |
| `MAILERLITE_API_KEY` | Email list sync | MailerLite dashboard (optional) |

---

## Vercel CLI Commands (After Authentication)

### Pull Environment Variables

```bash
# Pull all environments
npx vercel env pull .env.local

# Pull specific environment
npx vercel env pull .env.production production
npx vercel env pull .env.preview preview
npx vercel env pull .env.development development
```

### Deploy

```bash
# Deploy to preview
npx vercel

# Deploy to production (requires approval/ownership)
npx vercel --prod
```

### View Logs

```bash
# Recent deployment logs
npx vercel logs

# Follow logs in real-time
npx vercel logs --follow
```

### Project Info

```bash
# Show project details
npx vercel project ls

# Show current linking
npx vercel whoami
npx vercel project
```

---

## Current System Information

### Node.js Environment

```
Node version: v22.22.2
npm version: 10.9.7
Platform: linux 6.12.94+
Architecture: x64
```

### Repository State

```
Repository: moldovancsaba/amanoba
Current branch: main
Status: Clean (no uncommitted changes)
Remotes: origin (github.com/moldovancsaba/amanoba)
```

### Installed Packages (Key)

```
amanoba@2.9.49
├── next@16.2.6
├── react@19.2.6
├── typescript@5
├── mongoose@8.18.0
├── @mantine/core@8.3.18
├── next-auth@5.0.0-beta.31
├── @doneisbetter/gds-core@2.6.1
└── vercel@58.5.1 (dev)
```

### Known Issues

**npm audit**: 46 vulnerabilities detected (3 low, 13 moderate, 26 high, 4 critical)
- Most are transitive dependencies from Vercel CLI
- Run `npm audit fix` to attempt automatic fixes
- Review before applying in production

---

## Testing Without Full Environment

### What Works Now

```bash
# Code analysis
npm run lint
npm run type-check

# Unit tests (may skip integration tests)
npm test

# Documentation checks
npm run docs:refresh
npm run docs:links:check
npm run docs:check

# UI checks
npm run ui:check:layout
npm run ui:check:foundation
npm run ui:gds:check
```

### What Requires Environment

```bash
# Development server (needs MONGODB_URI, AUTH_SECRET)
npm run dev

# Background workers (needs MONGODB_URI)
npm run workers

# Data seeding (needs MONGODB_URI)
npm run seed:core
npm run seed:achievements-v2

# Admin operations (needs MONGODB_URI, AUTH_SECRET)
npm run admin:set-role
npm run admin:check-role

# Course operations (needs MONGODB_URI)
npm run course:ai:create
npm run course:ai:maintain
```

---

## Next Steps

### Immediate (No Authentication Required)

1. ✅ Repository cloned and accessible
2. ✅ Dependencies installed
3. ✅ TypeScript validation passing
4. ✅ Learning documentation generated
5. ✅ `.env.local` template created

### After Vercel Authentication

1. **Complete Vercel link**: Visit authentication URL above
2. **Pull environment variables**: `npx vercel env pull .env.local`
3. **Verify secrets**: Check all required variables are populated
4. **Start dev server**: `npm run dev`
5. **Test basic flows**: Auth, course viewing, API endpoints

### Before First Commit

1. **Run quality gates**: lint, type-check, test
2. **Update documentation**: If behavior changes
3. **Check board**: Confirm assigned issue in mvp-factory-control
4. **Create branch**: `sentinel-squad/<feature-name>`
5. **Document rollback plan**: Commit SHA, rollback steps, verification

---

## Support & Resources

### Documentation

- **Learning Summary**: `AMANOBA_LEARNING_SUMMARY.md` (this session)
- **Developer README**: `READMEDEV.md`
- **Operating Document**: `docs/core/agent_working_loop_canonical_operating_document.md`
- **Environment Setup**: `docs/core/ENVIRONMENT_SETUP.md`
- **Production Status**: `docs/status/PRODUCTION_STATUS.md`

### Key Commands

```bash
# Daily workflow
git fetch origin && git status -sb
gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10

# Quality gates
npm run lint && npm run type-check && npm test

# Documentation
npm run docs:check

# UI validation
npm run ui:check:foundation
```

### Project Board

- **Board**: https://github.com/users/moldovancsaba/projects/12/views/1
- **Issues**: https://github.com/moldovancsaba/mvp-factory-control/issues
- **Product**: amanoba
- **Workflow**: IDEABANK → Roadmap → Backlog → Todo → In Progress → Review → Done

---

## Summary

### ✅ Ready for Development

The development environment is **ready for code exploration, planning, and offline development**. TypeScript compilation works, code quality tools are functional, and all documentation is accessible.

### ⚠️ Requires User Action

**To run the application locally**, you need to:
1. Authenticate with Vercel (visit the URL above)
2. Pull environment variables from Vercel OR manually configure `.env.local`
3. Ensure MongoDB Atlas is accessible

**Once environment variables are configured**, the full development server, background workers, and all operational scripts will be functional.

---

**Status**: Environment partially ready — code analysis ✅, application runtime ⚠️ (awaiting secrets)

**Last Updated**: 2026-08-05T09:01:00Z

**Next Action**: Authenticate Vercel CLI or manually configure environment variables
