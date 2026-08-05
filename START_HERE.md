# 🎯 Start Here — Amanoba Development Guide

**Welcome to the Amanoba platform!** This guide will help you get started quickly.

---

## 📖 Read This First

If you're new to Amanoba or returning after a break, **start here**:

### 1. Session Summary
👉 **[SESSION_SUMMARY.md](SESSION_SUMMARY.md)** — What was accomplished in the last setup session

### 2. Learning Baseline  
👉 **[AMANOBA_LEARNING_SUMMARY.md](AMANOBA_LEARNING_SUMMARY.md)** — Comprehensive knowledge base (22 sections)
   - Platform overview
   - Architecture & tech stack
   - Development workflow
   - Course system
   - Documentation standards
   - Quality standards
   - Troubleshooting

### 3. Environment Status
👉 **[DEVELOPMENT_ENVIRONMENT_STATUS.md](DEVELOPMENT_ENVIRONMENT_STATUS.md)** — Setup checklist & readiness

### 4. Developer README
👉 **[READMEDEV.md](READMEDEV.md)** — Brain boost ritual (read at start of every work session)

---

## 🚀 Quick Start

### Cloud Agent Environment (No Localhost)

**IMPORTANT**: This is a Cloud Agent environment. Testing happens via Vercel preview deployments, not localhost.

```bash
# 1. Sync with latest
git fetch origin && git status -sb

# 2. Check for assigned work
gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10

# 3. Create feature branch
git checkout -b sentinel-squad/<feature-name>

# 4. Make changes and run quality gates
npm run lint && npm run type-check && npm test

# 5. Push to preview branch (triggers Vercel preview deployment)
git add -A
git commit -m "descriptive message"
git push origin sentinel-squad/<feature-name>

# 6. Test on Vercel preview URL
# Preview URL format: https://amanoba-<branch>-moldovan.vercel.app
```

**See [CLOUD_AGENT_DEPLOYMENT_WORKFLOW.md](CLOUD_AGENT_DEPLOYMENT_WORKFLOW.md) for complete workflow.**

### If Environment Needs Setup

**Option A: Pull from Vercel** (recommended)
```bash
# 1. Authenticate Vercel CLI
# Visit: https://vercel.com/oauth/device?user_code=QGJQ-SZQR

# 2. Pull environment variables
npx vercel env pull .env.local

# 3. Start dev server
npm run dev
```

**Option B: Manual Configuration**
```bash
# 1. Copy template
cp .env.local.example .env.local

# 2. Edit .env.local with your secrets
# Required: MONGODB_URI, AUTH_SECRET, SSO credentials, EMAIL_PROVIDER

# 3. Start dev server
npm run dev
```

---

## 📚 Essential Documentation

### Core Docs (In Repository)

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [READMEDEV.md](READMEDEV.md) | Developer brain boost | **Start of every session** |
| [docs/HANDOVER.md](docs/HANDOVER.md) | Runtime behavior & changes | Before starting work |
| [docs/core/agent_working_loop_canonical_operating_document.md](docs/core/agent_working_loop_canonical_operating_document.md) | Agent operating rules | Cold start or context loss |
| [docs/status/PRODUCTION_STATUS.md](docs/status/PRODUCTION_STATUS.md) | Production status | Before deployment |
| [docs/architecture/layout_grammar.md](docs/architecture/layout_grammar.md) | Layout & structure rules | Working on content/courses/UI |
| [docs/product/TASKLIST.md](docs/product/TASKLIST.md) | Open tasks (reference) | Planning work |
| [docs/product/ROADMAP.md](docs/product/ROADMAP.md) | Future vision | Understanding strategy |
| [docs/product/RELEASE_NOTES.md](docs/product/RELEASE_NOTES.md) | Completed work | Understanding history |

### Session Docs (This Setup)

| Document | Purpose |
|----------|---------|
| [SESSION_SUMMARY.md](SESSION_SUMMARY.md) | Last session overview |
| [AMANOBA_LEARNING_SUMMARY.md](AMANOBA_LEARNING_SUMMARY.md) | Complete knowledge baseline (22 sections) |
| [COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md](COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md) | Course system deep dive (1,025 lines) |
| [COURSE_LEARNING_SESSION_SUMMARY.md](COURSE_LEARNING_SESSION_SUMMARY.md) | Course learning session summary |
| [DEVELOPMENT_ENVIRONMENT_STATUS.md](DEVELOPMENT_ENVIRONMENT_STATUS.md) | Environment checklist |
| [ENVIRONMENT_READY_CHECKLIST.md](ENVIRONMENT_READY_CHECKLIST.md) | Comprehensive ready checklist |
| [WHAT_IS_NEXT.md](WHAT_IS_NEXT.md) | Next steps guide for development |
| [CLOUD_AGENT_DEPLOYMENT_WORKFLOW.md](CLOUD_AGENT_DEPLOYMENT_WORKFLOW.md) | Preview testing workflow |

---

## 🎯 Work Tracking

### MVP Factory Board (SSOT)

**Board**: https://github.com/users/moldovancsaba/projects/12/views/1  
**Issues**: https://github.com/moldovancsaba/mvp-factory-control/issues  
**Product**: amanoba

### Board Workflow

```
IDEABANK → Roadmap → Backlog → Todo → In Progress → Review → Done
(SOMEDAY)  (LATER)   (SOONER)  (NEXT)     (NOW)     (ALMOST)
```

### Find Your Work

```bash
gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10
```

---

## 🧪 Quality Gates

Run before committing:

```bash
npm run lint           # ESLint check
npm run type-check     # TypeScript validation
npm test              # Vitest tests
npm run docs:check    # Documentation validation
npm run build         # Production build
```

---

## 🔧 Common Commands

### Development

```bash
npm run dev            # Start dev server (http://localhost:3000)
npm run build          # Production build
npm run start          # Production server
```

### Quality Checks

```bash
npm run lint                    # Lint check
npm run type-check             # Type check
npm test                       # Run tests
npm run docs:check             # Doc validation
npm run ui:check:foundation    # UI foundation (runs in CI)
npm run ui:gds:check           # GDS compliance
```

### Background Workers

```bash
npm run workers        # Start job workers (needs MONGODB_URI)
```

### Course Operations

```bash
npm run course:ai:create       # Create course with AI
npm run course:ai:maintain     # Maintain existing course
npm run course:ai:content-fix  # Audit and fix content
```

### Admin Operations

```bash
npm run admin:set-role         # Set user role
npm run admin:check-role       # Check user role
```

---

## 📦 Project Info

**Platform**: Amanoba v2.9.49 — Unified flexible learning platform  
**Tech**: Next.js 16.2.6, TypeScript 5, MongoDB Atlas, Mantine UI  
**Locales**: 17 supported (hu, en, ar, hi, id, pt, vi, tr, bg, pl, ru, sw, zh, es, fr, bn, ur)  
**Auth**: SSO-only via sso.doneisbetter.com (NextAuth 5.0.0-beta.31)  
**Deploy**: Push to `origin/main` → Automatic Vercel production deploy  
**Production**: https://www.amanoba.com

---

## 🔑 Key Principles

### Documentation = Code
- Update docs with every code change
- No "TBD" or placeholders
- Single-place rule: ROADMAP (vision), TASKLIST (open), RELEASE_NOTES (done)

### Quality Standards
- Error-free, warning-free, deprecated-free
- Production-grade code
- Full TypeScript coverage
- Comments only for non-obvious intent

### Rollback Plan (Non-Negotiable)
Every change requires:
1. Current stable baseline (commit SHA)
2. Exact rollback steps
3. Verification steps

### Critical Warning: Authentication
**DO NOT MODIFY** the working authentication configuration (commit f20c34a):
- No CORS wrapping in NextAuth route handler
- Service worker v2.0.0 must stay enabled
- JWT callback must not be simplified

---

## 🆘 Need Help?

### Getting Stuck?

1. **Documentation**: Check [AMANOBA_LEARNING_SUMMARY.md](AMANOBA_LEARNING_SUMMARY.md)
2. **Troubleshooting**: See "Troubleshooting" section in learning summary
3. **Architecture**: Check [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)
4. **Layout/Structure**: Check [docs/architecture/layout_grammar.md](docs/architecture/layout_grammar.md)

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails locally | Check Node version (>= 20.0.0, < 25.0.0), clear cache, reinstall |
| SSO login fails | Verify SSO URLs, scopes, callback URL exact match |
| Email sending fails | Check EMAIL_PROVIDER matches credentials, validate sender |
| TypeScript errors | Run `npm run type-check` |

---

## 🎯 Daily Workflow

### 1. Brain Boost (Start of Session)

```bash
# Sync with remote
git fetch origin && git status -sb

# Check assigned work
gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10

# Read latest handover
tail -100 docs/HANDOVER.md
```

### 2. During Work

```bash
# Create branch
git checkout -b sentinel-squad/<feature-name>

# Make changes
# ...

# Run quality gates
npm run lint && npm run type-check && npm test
```

### 3. Before Commit

- Update documentation (if behavior changed)
- Define rollback plan
- Run quality gates

```bash
git add -A
git commit -m "descriptive message"
git push -u origin <branch-name>
```

### 4. After Merge to Main

- Automated Vercel deployment triggered
- Verify deployment: `npm run audit:production-smoke` (post-deploy)
- Update HANDOVER.md if runtime behavior changed

---

## 🚦 Current Status

### ✅ Fully Ready

- ✅ Code analysis and offline development
- ✅ Linting, type checking, testing
- ✅ Documentation work
- ✅ UI checks and GDS compliance
- ✅ Development server (`npm run dev`)
- ✅ Database operations (MongoDB connected)
- ✅ Authentication configured (SSO)
- ✅ Email provider configured
- ✅ Background workers ready
- ✅ Vercel CLI authenticated and linked
- ✅ Environment variables pulled (all production secrets)

**Next Step**: Start working on a specific task or feature (see [WHAT_IS_NEXT.md](WHAT_IS_NEXT.md))

---

## 📞 Team & Resources

### Team

- **Sultan**: Product Owner, Decision maker
- **Chappie**: Architect
- **Katja**: Content Creator, Developer  
- **Tribeca**: Developer

### Repositories

- **Product**: https://github.com/moldovancsaba/amanoba
- **Issues**: https://github.com/moldovancsaba/mvp-factory-control
- **Board**: https://github.com/users/moldovancsaba/projects/12/views/1
- **Design System**: https://github.com/sovereignsquad/general-design-system

---

## 🎉 You're Ready!

Everything you need is documented. Start with:
1. ✅ [WHAT_IS_NEXT.md](WHAT_IS_NEXT.md) — Next steps guide (recommended first read)
2. ✅ [ENVIRONMENT_READY_CHECKLIST.md](ENVIRONMENT_READY_CHECKLIST.md) — Complete ready checklist
3. ✅ [AMANOBA_LEARNING_SUMMARY.md](AMANOBA_LEARNING_SUMMARY.md) — Complete knowledge base (22 sections)
4. ✅ [COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md](COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md) — Course system deep dive
5. ✅ [READMEDEV.md](READMEDEV.md) — Daily brain boost

**Happy coding!** 🚀

---

**Generated**: 2026-08-05  
**Version**: v2.9.49  
**Status**: ✅ Environment fully ready, all systems operational, ready for development
