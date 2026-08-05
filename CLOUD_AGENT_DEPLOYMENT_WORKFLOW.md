# Cloud Agent Deployment Workflow

**CRITICAL CONSTRAINT**: This is a Cloud Agent environment. Localhost is not accessible to the user.

---

## ⚠️ Important: No Localhost Access

**Rule**: All testing and verification must be done via Vercel preview deployments.

### Why This Matters

- Cloud Agent runs in an isolated remote environment
- User cannot access http://localhost:3000 or any local URLs
- Development server (`npm run dev`) runs but user cannot interact with it
- All user-facing testing must happen on live Vercel URLs

---

## ✅ Correct Workflow for Testing

### 1. Development & Code Changes

Work as normal:
```bash
# Create feature branch
git checkout -b sentinel-squad/<feature-name>

# Make changes
# ...

# Run quality gates (these work fine)
npm run lint
npm run type-check
npm test
npm run docs:check
```

### 2. Deploy to Preview for Testing

**Push to preview branch:**
```bash
# Commit changes
git add -A
git commit -m "descriptive message"

# Push to preview branch (triggers Vercel preview deployment)
git push origin sentinel-squad/<feature-name>
```

**Vercel automatically creates a preview deployment** for any branch push.

### 3. Get Preview URL

**Option A: Check Vercel dashboard**
- Visit: https://vercel.com/moldovan/workspace/deployments
- Find your branch deployment
- Click to get preview URL

**Option B: Use Vercel CLI**
```bash
# List recent deployments
npx vercel ls

# Get deployment URL for specific branch
npx vercel inspect <deployment-url>
```

**Option C: GitHub Integration**
If GitHub is connected, preview URLs appear in:
- PR comments
- Commit status checks

### 4. Test on Preview URL

**Preview URL format:**
- `https://<project>-<branch>-<team>.vercel.app`
- Or: `https://<project>-git-<branch>-<team>.vercel.app`

**Test everything on the preview deployment:**
- UI changes
- Authentication flows
- Course functionality
- API endpoints
- Multi-locale support
- Admin features

### 5. Merge to Main (Production)

Once preview testing is complete:
```bash
# Merge to main (or create PR)
git checkout main
git pull origin main
git merge sentinel-squad/<feature-name>
git push origin main
```

**Production deployment happens automatically** on push to `main`.

---

## 🔧 What Works in Cloud Agent Environment

### ✅ Can Do (No Preview Needed)

- Code analysis and refactoring
- Documentation updates
- Reading and searching codebase
- Running linters: `npm run lint`
- Running type checks: `npm run type-check`
- Running unit tests: `npm test`
- Running doc checks: `npm run docs:check`
- Running UI audits: `npm run ui:check:foundation`
- Building: `npm run build`

### ⚠️ Requires Preview Deployment

- UI/UX verification
- Authentication testing (SSO flows)
- Course browsing and enrollment
- Email functionality (if preview env configured)
- Payment flows (Stripe)
- Admin panel testing
- Multi-locale verification
- Any user-facing feature

### ❌ Cannot Do (Don't Try)

- Ask user to visit http://localhost:3000
- Reference localhost URLs in instructions
- Expect user to test locally
- Run interactive browser-based tests in Cloud Agent

---

## 📋 Recommended Development Flow

### Pattern 1: Small Changes (Direct to Preview)

```bash
# 1. Create branch
git checkout -b sentinel-squad/fix-typo

# 2. Make change
# Edit file...

# 3. Quality gates
npm run lint && npm run type-check && npm test

# 4. Commit & push (triggers preview)
git add -A
git commit -m "fix: Correct typo in course title"
git push origin sentinel-squad/fix-typo

# 5. Get preview URL and share with user
npx vercel ls | head -5

# 6. User tests on preview

# 7. If good, merge to main
git checkout main
git merge sentinel-squad/fix-typo
git push origin main
```

### Pattern 2: Large Features (Iterative Preview)

```bash
# 1. Create branch
git checkout -b sentinel-squad/new-feature

# 2. Implement phase 1
# Code...

# 3. Quality gates
npm run lint && npm run type-check && npm test

# 4. Push for preview
git add -A
git commit -m "feat: Implement phase 1 of new feature"
git push origin sentinel-squad/new-feature
# Get preview URL, share with user

# 5. Get feedback, iterate
# More code...
git add -A
git commit -m "feat: Refine based on feedback"
git push origin sentinel-squad/new-feature
# Vercel updates the preview automatically

# 6. Repeat until complete

# 7. Merge to main when approved
git checkout main
git merge sentinel-squad/new-feature
git push origin main
```

### Pattern 3: Urgent Hotfix

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b sentinel-squad/hotfix-critical-bug

# 2. Make minimal fix
# Fix...

# 3. Fast quality gates
npm run lint && npm run type-check

# 4. Push for preview verification
git add -A
git commit -m "fix: Critical bug in authentication"
git push origin sentinel-squad/hotfix-critical-bug
# Share preview URL immediately

# 5. Once verified on preview, merge to main
git checkout main
git merge sentinel-squad/hotfix-critical-bug
git push origin main
# Production deploy happens automatically
```

---

## 🎯 Vercel CLI Quick Reference

### List Deployments

```bash
# Recent deployments
npx vercel ls

# With more details
npx vercel ls --scope moldovan
```

### Inspect Deployment

```bash
# Get deployment info
npx vercel inspect <deployment-url>

# Get deployment logs
npx vercel logs <deployment-url>
```

### Project Info

```bash
# Show linked project
npx vercel project ls

# Show project domains
npx vercel domains ls
```

### Environment Variables

```bash
# Pull latest env vars
npx vercel env pull .env.local

# Add new env var (do via dashboard instead)
# npx vercel env add
```

---

## 🔍 Preview vs Production URLs

### Preview Deployments

**Trigger**: Push to any branch except `main`

**URL patterns:**
- `https://amanoba-<branch>-moldovan.vercel.app`
- `https://amanoba-git-<branch>-moldovan.vercel.app`

**Characteristics:**
- One per branch
- Auto-updates on new pushes to that branch
- Isolated from production
- Can have different env vars (preview scope)
- Perfect for testing

### Production Deployment

**Trigger**: Push to `main` branch

**URL patterns:**
- `https://www.amanoba.com` (primary)
- `https://amanoba.com`
- `https://amanoba-narimato.vercel.app`
- `https://amanoba-git-main-narimato.vercel.app`

**Characteristics:**
- Single canonical deployment
- Auto-updates on push to main
- Production env vars
- Live for all users

---

## ✅ Updated Quality Gates Flow

```bash
# Before committing
npm run lint           # ✅ Works
npm run type-check     # ✅ Works
npm test              # ✅ Works
npm run docs:check    # ✅ Works
npm run build         # ✅ Works

# Commit
git add -A
git commit -m "feat: New feature"

# Push to preview
git push origin <branch-name>

# Testing happens on Vercel preview URL (not localhost)
# User tests: https://<project>-<branch>-<team>.vercel.app

# After user approval on preview
git checkout main
git merge <branch-name>
git push origin main  # Auto-deploys to production
```

---

## 📝 Communication Templates

### When Sharing Changes with User

**❌ Wrong:**
> "I've started the dev server. Please visit http://localhost:3000 to test."

**✅ Correct:**
> "I've pushed the changes to the preview branch. The Vercel preview deployment will be ready in ~2 minutes.
> 
> Preview URL: https://amanoba-sentinel-squad-feature-moldovan.vercel.app
> 
> Please test:
> - [x] Feature A
> - [x] Feature B
> - [x] Authentication flow
> 
> Once approved, I'll merge to main for production deployment."

### When Providing Instructions

**❌ Wrong:**
> "Run `npm run dev` and open your browser to http://localhost:3000"

**✅ Correct:**
> "I'll push to the preview branch for testing. You can verify the changes on the Vercel preview URL once deployed."

---

## 🎯 Key Takeaways

1. **Never reference localhost** - User cannot access it
2. **All testing via Vercel previews** - Push to branch, test on preview URL
3. **Quality gates run locally** - Lint, type-check, test work fine
4. **Development server is for build verification** - Not for user testing
5. **Preview branch = Testing environment** - Not main
6. **Main branch = Production** - Auto-deploys to amanoba.com
7. **Iterate on preview** - Get feedback, push updates, preview auto-updates

---

**Last Updated**: 2026-08-05  
**Status**: Active workflow for Cloud Agent environment
