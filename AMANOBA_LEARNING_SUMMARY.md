# Amanoba Platform - Complete Learning Summary

**Generated**: 2026-08-05
**Agent**: Cloud Agent (Cursor)
**Purpose**: Comprehensive knowledge baseline for Amanoba platform

---

## Executive Summary

**Amanoba** is a unified flexible learning platform (v2.9.49) that combines structured courses, gamified assessments, and email-based lesson delivery. Built on Next.js 16.2.6 with MongoDB Atlas, deployed on Vercel, and supporting 17 locales.

**Key Facts:**
- **Tech Stack**: Next.js 16.2.6 (App Router), TypeScript 5, MongoDB Atlas, Mongoose 8.18.0, Mantine UI
- **Current Version**: v2.9.49
- **Production URL**: https://www.amanoba.com
- **Auth**: SSO-only via sso.doneisbetter.com (NextAuth 5.0.0-beta.31)
- **Deployment**: Automated via GitHub → Vercel (push to `origin/main`)
- **Locales**: 17 supported (hu, en, ar, hi, id, pt, vi, tr, bg, pl, ru, sw, zh, es, fr, bn, ur)

---

## 1. Project Architecture

### Core Principles

1. **Centralized & Reusable**: Components designed for reuse across games and features
2. **Event-Driven**: All player actions emit events for analytics and gamification
3. **Type-Safe**: Full TypeScript coverage with strict mode
4. **Security-First**: Rate limiting, input validation, XSS protection on all endpoints
5. **Reuse via discriminator**: One model, one API, one component; discriminator (e.g. `targetType`) selects context
6. **Design-system SSOT**: https://github.com/sovereignsquad/general-design-system is the UI/UX authority
7. **Mantine-only baseline**: No Tailwind, Radix, or page-local design systems in active surfaces

### Technology Stack

**Frontend:**
- Next.js 16.2.6 (App Router) with React 19.2.6
- TypeScript 5
- Mantine UI components (v8.3.18)
- Framer Motion 10.18.0 (animations)
- TanStack React Query 5.56.2 (state)
- React Hook Form 7.53.0 with Zod validation
- Recharts 3.2.1 (charts)

**Backend:**
- Node.js >= 20.0.0 (< 25.0.0)
- Next.js API Routes (App Router)
- MongoDB Atlas 6.18.0 with Mongoose 8.18.0
- Zod 4.1.11 with XSS protection (xss 1.0.15)
- Pino 9.13.0 (logging with PII redaction)
- rate-limiter-flexible 8.0.1

**Infrastructure:**
- **Platform**: Vercel (Serverless)
- **Database**: MongoDB Atlas (Madoku cluster)
- **CDN**: Vercel Edge Network
- **Deployment**: Automated via GitHub integration

**Key Services:**
- **Auth**: NextAuth 5.0.0-beta.31 with SSO-only via sso.doneisbetter.com
- **Email**: Resend, Gmail API OAuth, or Mailgun (configurable via `EMAIL_PROVIDER`)
- **Payments**: Stripe SDK 20.2.0 for premium courses (USD, EUR, HUF, GBP)
- **Push Notifications**: web-push 3.6.7 (VAPID)

---

## 2. Project Structure

### Key Directories

```
amanoba/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Locale-scoped routes (17 locales)
│   │   ├── dashboard/           # Learner dashboard
│   │   ├── courses/             # Course catalog and player
│   │   ├── profile/             # User profiles
│   │   ├── admin/               # Admin dashboard (auth protected)
│   │   ├── certificate/         # Certificate viewing
│   │   └── practice/            # Practice hub
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication (NextAuth)
│   │   ├── courses/             # Course APIs
│   │   ├── admin/               # Admin APIs
│   │   └── payments/            # Stripe integration
│   ├── lib/                     # Business logic
│   │   ├── models/              # Mongoose models (32 models)
│   │   ├── courses/             # Course management
│   │   ├── gamification/        # Points, achievements, streaks
│   │   └── email/               # Email transport layer
│   └── components/              # React components
├── docs/                        # All documentation
│   ├── architecture/            # System architecture
│   ├── core/                    # Core development docs
│   ├── product/                 # Product roadmap & releases
│   ├── canonical/               # Canonical course specs (CCS)
│   ├── handoff/                 # Handoff procedures
│   └── status/                  # Production status
├── messages/                    # i18n translations (17 locales)
├── scripts/                     # Operational scripts
└── public/                      # Static assets
```

### Critical Files

- **`READMEDEV.md`**: Developer brain boost (start here every session)
- **`docs/HANDOVER.md`**: Runtime behavior and process changes
- **`docs/core/agent_working_loop_canonical_operating_document.md`**: Agent operating rules
- **`docs/status/PRODUCTION_STATUS.md`**: Production deployment status
- **`docs/architecture/layout_grammar.md`**: SSOT for structural and layout rules
- **`docs/product/TASKLIST.md`**: Actionable tasks (reference only; SSOT is Project 12)
- **`docs/product/ROADMAP.md`**: Future vision and client benefits
- **`docs/product/RELEASE_NOTES.md`**: Completed work changelog

---

## 3. Development Workflow

### Brain Boost Ritual (Start Every Session)

1. **Baseline sync**: `git fetch origin && git status -sb`
2. **Confirm active SSOT card**: Issues live in `moldovancsaba/mvp-factory-control`
   ```bash
   gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10
   ```
3. **Scan docs**: Read `docs/HANDOVER.md` and active issue comments
4. **Branch naming**: Use `sentinel-squad/` prefix for feature branches

### Core Commands

**Local development:**
```bash
npm install
npm run dev                      # Start dev server (http://localhost:3000)
```

**Quality gates:**
```bash
npm run lint                     # ESLint check
npm test                         # Vitest tests
npm run type-check               # TypeScript validation
npm run build                    # Production build
```

**Documentation checks:**
```bash
npm run docs:refresh             # Regenerate docs inventory
npm run docs:links:check         # Validate active doc links
npm run docs:check               # Full docs validation
DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check  # Include archive
```

**UI/GDS checks:**
```bash
npm run ui:audit:layout          # Audit layout grammar
npm run ui:check:layout          # Validate layout
npm run ui:audit:foundation      # Audit UI foundation
npm run ui:check:foundation      # Validate UI foundation (runs in CI)
npm run ui:gds:check             # GDS compliance
npm run ui:check:mantine         # Mantine boundary check
```

**Background workers:**
```bash
npm run workers                  # Start job workers (requires MONGODB_URI)
```

**Operational scripts (with env):**
```bash
npx tsx --env-file=.env.local scripts/<script-name>.ts
```

**Project board auth (one-time):**
```bash
gh auth refresh -h github.com -s read:project,project
```

### Release Commands

```bash
npm run release:patch            # Bump patch version
npm run release:minor            # Bump minor version
npm run release:major            # Bump major version
```

---

## 4. Environment Setup

### Required Environment Variables

**Database:**
- `MONGODB_URI`: MongoDB Atlas connection string

**Auth/Session:**
- `AUTH_SECRET`: NextAuth secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Base URL (http://localhost:3000 for local)

**SSO/OIDC (sso.doneisbetter.com):**
- `SSO_AUTH_URL`, `SSO_TOKEN_URL`, `SSO_JWKS_URL`, `SSO_ISSUER`
- `SSO_CLIENT_ID`, `SSO_CLIENT_SECRET`
- `SSO_REDIRECT_URI`: e.g., http://localhost:3000/api/auth/sso/callback
- `SSO_SCOPES`: openid profile email roles

**Application:**
- `NEXT_PUBLIC_APP_URL`: http://localhost:3000 (local) or https://www.amanoba.com (prod)

**Email (required):**
- `EMAIL_PROVIDER`: resend | gmail | mailgun
- `EMAIL_FROM`, `EMAIL_FROM_NAME`, `EMAIL_REPLY_TO`
- Provider-specific credentials (e.g., `RESEND_API_KEY`)

**Optional:**
- Push notifications: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
- Analytics: `NEXT_PUBLIC_GA_ID`
- MailerLite: `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`

**Setup:**
```bash
cp .env.local.example .env.local
# Fill in values in .env.local
```

### Email Providers

**Resend:**
```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_api_key
```

**Gmail API OAuth:**
```bash
EMAIL_PROVIDER=gmail
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_SENDER_EMAIL=your_gmail@example.com

# Generate refresh token:
npm run email:gmail:oauth
```

**Mailgun:**
```bash
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=your_api_key
MAILGUN_DOMAIN=mg.example.com
```

---

## 5. Authentication System

### Working Configuration (CRITICAL - DO NOT MODIFY)

**Current auth setup (f20c34a commit):**
- `app/api/auth/[...nextauth]/route.ts`: Simple export - `export const { GET, POST } = handlers;` (NO CORS wrapping)
- `next.config.ts`: Headers apply to ALL routes including `/api/` (source: '/:path*')
- `public/service-worker.js`: Version 2.0.0 with networkFirstStrategy (DO NOT disable)
- `auth.ts`: Complex JWT callback with database refresh on every request (DO NOT simplify)
- `proxy.ts`: Simple `export default auth((req) => { ... })` pattern (DO NOT restructure)
- `app/components/session-provider.tsx`: Simple wrapper, no extra props

**⚠️ CRITICAL WARNING**: All attempts to "improve" or "fix" these files broke the system. The working version is simple. Keep it simple.

### SSO Flow

1. User clicks SSO login
2. App redirects to `SSO_AUTH_URL` with client_id, redirect_uri, scopes
3. SSO provider authenticates user
4. Provider redirects to `SSO_REDIRECT_URI` with authorization code
5. NextAuth exchanges code for tokens at `SSO_TOKEN_URL`
6. JWT callback validates token against `SSO_JWKS_URL`
7. Session created with user data and roles

**Production callback**: https://www.amanoba.com/api/auth/sso/callback

---

## 6. Course System

### Canonical Course Specs (CCS)

**Location**: `docs/canonical/<COURSE_FAMILY>/`

**Files:**
- `<NAME>.canonical.json` — Machine-readable course spec
- `<NAME>_CCS.md` — Narrative guide

**Structure:**
- `schemaVersion`, `courseIdBase`, `courseName`, `version`
- `intent`: oneSentence, outcomes, nonGoals
- `qualityGates`, `concepts`, `procedures`
- `assessmentBlueprint`: question types, distractors
- `lessons`: Array of lesson outlines (dayNumber, title, intent, goals, concepts, examples)

**Existing CCS families:**
- `docs/canonical/PRODUCTIVITY_2026/`
- `docs/canonical/DONE_BETTER_2026/`
- `docs/canonical/SCRUMMASTER_LESZEK_2026/`

### Lesson Structure

**Model**: `app/lib/models/lesson.ts`

**Required fields:**
- `lessonId`, `courseId`, `dayNumber`, `language`
- `title`, `content`, `emailSubject`, `emailBody`
- `pointsReward`, `xpReward`, `isActive`, `displayOrder`

**Content grammar:**
1. Introduction — context and why it matters
2. Main content — concepts and procedures (aligned to CCS)
3. Summary — short recap
4. Action items — concrete next steps

**Quality standards:**
- 20–30 min reading time
- Clear structure, specific and actionable
- No fluff, same language as course (language integrity)
- Email fields must be in-language (no English leakage)

### Quiz System

**Requirements per lesson:**
- Minimum **7** valid questions
- **0 RECALL** questions
- Minimum **5 APPLICATION** questions
- Minimum **2 CRITICAL_THINKING** questions

**Question format:**
- 4 options (1 correct + 3 plausible distractors)
- UUID v4, hashtags, `questionType`, `difficulty`, `category`
- Standalone, scenario-based, grounded in lesson
- No lesson-referential wording, no throwaway options
- Distractors must be educational

**Governance:**
- Authority: `Course.lessonQuizPolicy` (via `app/lib/course-quiz-policy.ts`)
- `Lesson.quizConfig` is compatibility-only (not authoritative)

---

## 7. Documentation Standards

### Non-Negotiable Rules

1. **Documentation = Code**: Update docs with every code change
2. **No placeholders**: No "TBD" or "coming soon" in committed docs
3. **Single-place rule**:
   - **ROADMAP** = future vision only
   - **TASKLIST** = open tasks only
   - **RELEASE_NOTES** = completed work only
4. **Only related items**: Each doc contains only what belongs there
5. **Immediate updates**: Logic/feature changes trigger immediate doc review

### Documentation System

- **Feature documents**: `/docs/core/templates/FEATURE_TEMPLATE.md`
- **Core docs**: TASKLIST, ROADMAP, RELEASE_NOTES, ARCHITECTURE, LEARNINGS
- **Cross-repo references**: Use portable convention from `docs/core/CROSS_REPO_DOCS.md`

### Layout Grammar (Mandatory)

**When to read `docs/architecture/layout_grammar.md`:**
- Content structure, course/lesson/quiz layout
- UI/page layout, documentation structure
- API and locale layout

**What it defines:**
- Project layout (files and folders)
- Documentation layout
- Course and CCS layout
- Lesson layout (data and content)
- Quiz layout (structure and quality)
- UI adapter layout
- API and locale layout
- Language rules

---

## 8. Git & Deployment

### Git Workflow

**Canonical checkout**: `/Users/Shared/Projects/amanoba` (do not recreate duplicate)

**Branch naming**: `sentinel-squad/<feature-name>`

**Start session:**
```bash
git fetch origin && git status -sb
```

**Commit & push:**
```bash
git add -A
git commit -m "descriptive message"
git push origin <branch-name>
```

**Never:**
- Force push without explicit approval
- Amend commits without explicit approval
- Merge PRs without explicit approval

### Deployment

**Production deployment:**
1. Commit changes
2. Push to `origin/main`
3. Vercel builds and deploys automatically (GitHub integration)

**Manual deployment**: Exception-only, when explicitly requested

**Production URLs:**
- https://www.amanoba.com
- https://amanoba.com
- https://amanoba-narimato.vercel.app
- https://amanoba-git-main-narimato.vercel.app

**Post-deploy verification:**
1. Confirm latest deploy SHA matches `origin/main`
2. Verify baseline routes: `/`, `/robots.txt`, `/sitemap.xml`, `/en/auth/signin`
3. Verify feature area touched by release
4. Log changes in `docs/product/RELEASE_NOTES.md`

---

## 9. Project Management

### MVP Factory Board

**SSOT**: https://github.com/users/moldovancsaba/projects/12/views/1

**Issues repo**: `moldovancsaba/mvp-factory-control`

**Board statuses:**
- `IDEABANK (SOMEDAY)` → `Roadmap (LATER)` → `Backlog (SOONER)` → `Todo (NEXT)` → `In Progress (NOW)` → `Review (ALMOST)` → `Done` / `Declined (NEVER)`

**Board fields:**
- **Status**, **Agent**, **Product** (e.g., amanoba), **Type** (e.g., Feature), **Priority** (P0–P3)

**Update board fields from repo:**
```bash
./scripts/mvp-factory-set-project-fields.sh ISSUE_NUMBER
```

### Team

- **Chappie**: Architect
- **Katja**: OpenAI CODEX via Cursor, Content Creator, Developer
- **Tribeca**: Auto Agent via Cursor, Developer
- **Sultan**: Product Owner, Decision maker

---

## 10. GDS (General Design System)

### SSOT

**Authority**: https://github.com/sovereignsquad/general-design-system

**Amanoba's role**: Consumer/adapter, not design authority

**Active packages:**
```json
{
  "@doneisbetter/gds-admin": "2.6.1",
  "@doneisbetter/gds-core": "2.6.1",
  "@doneisbetter/gds-theme": "2.6.1",
  "@doneisbetter/gds-compliance": "2.6.1",
  "@doneisbetter/gds-eslint-config": "2.6.1"
}
```

**Legacy naming (DO NOT USE):**
- ❌ `@gds/*` packages
- ❌ GitHub release tarballs
- ❌ Sibling `file:` installs

**GDS checks:**
```bash
npm run ui:gds:verify             # Verify GDS version
npm run ui:check:no-legacy-gds-imports  # Check for legacy imports
npm run gds:import-smoke          # Import smoke test
npm run ui:check:gds-patterns     # Pattern compliance
npm run ui:gds:compliance         # GDS compliance
npm run ui:gds:check              # Full GDS check
```

### CTA Yellow Rule (Transitional)

**Current adapter rule:**
- CTA yellow (`#FAB908`) is exclusive to primary actions
- Tokens: `--cta-bg`, `--cta-bg-hover`, `--cta-text`, `--cta-shadow`
- Non-CTA elements must use neutral/secondary palette
- This rule persists until Mantine theme migration replaces it

---

## 11. Localization (i18n)

### Supported Locales (17)

`hu`, `en`, `ar`, `hi`, `id`, `pt`, `vi`, `tr`, `bg`, `pl`, `ru`, `sw`, `zh`, `es`, `fr`, `bn`, `ur`

**Definition**: `app/lib/i18n/locales.ts`

**Translation files**: `messages/<locale>.json`

### Locale Selection

**Default locale**: Fallback when browser language not supported (see `i18n.ts`)

**Browser detection**: First visit uses `Accept-Language` header (via next-intl with `localeDetection: true`)

**User preference**: Profile → Profile settings → Language
- Stored in `player.locale`
- Used for session, emails, recommendations
- UI redirects to chosen locale path

### Language Integrity

**Hard rule**: When user selects a language, entire UI must be in that language
- No English placeholders in live locales
- Email fields (`emailSubject`, `emailBody`) must be in-language
- No leakage from other languages

---

## 12. Key Operational Scripts

### Course Management

```bash
# AI course automation
npm run course:ai:create          # Create course with AI
npm run course:ai:maintain        # Maintain existing course
npm run course:ai:content-fix     # Audit and fix content

# Seed specific courses
npm run seed:geo-shopify-course
npm run seed:geo-shopify-course-en
npm run seed:ai-course-en
npm run seed:scrummaster-leszek-2026-hu
npm run seed:sport-sales-network-europe-2026-en
npm run seed:gcc-market-entry-2026-en
npm run seed:ccs-generative-ai-2026
```

### Admin Operations

```bash
# Role management
npm run admin:set-role
npm run admin:set-sso-role
npm run admin:restore-role
npm run admin:check-role

# Course admin
npm run admin:disable-course-discussion

# SEO
npm run seo:submit-sitemap
```

### Data Operations

```bash
# Seeding
npm run seed:core
npm run seed:achievements-v2
npm run seed:translations

# Repairs
npm run repair:stats

# Migrations
npm run migrate:fix-facebookid-index
npm run migrate:remove-facebookid
npm run backfill:course-quiz-policy
```

### Content Publishing

```bash
npm run blog:publish             # Publish blog post
npm run news:publish             # Publish news
```

### Audits

```bash
npm run audit:routes             # Generate route inventory
npm run audit:production-smoke   # Production smoke test
npm run audit:run                # Tech audit
npm run audit:admin-guards       # Admin API guard check
npm run audit:course-flow        # Course flow integrity
```

---

## 13. Database (MongoDB)

### Connection

- **Platform**: MongoDB Atlas
- **Cluster**: Madoku
- **Database**: amanoba
- **ODM**: Mongoose 8.18.0

### Collections (32 Models)

**Core:**
- Players, Games, GameSessions
- Courses, Lessons, CourseProgress, LessonProgress
- QuizQuestions, Certificates

**Gamification:**
- Points, Achievements, Challenges, Quests, Streaks
- Leaderboard, Referrals

**Content:**
- BlogPosts, News, Surveys, Bookmarks

**Admin:**
- Migrations, Analytics

### Security

- Least-privilege DB user
- Network access restrictions
- Automated backups enabled
- Connection string stored in `MONGODB_URI`

---

## 14. Key Known Issues & Solutions

### 1. CORS/Access Control Errors

**Status**: Root cause unknown

**Working version (f20c34a)**: No special CORS handling

**Rule**: DO NOT add CORS wrappers to NextAuth route handler

### 2. SSO Nonce Errors

**Status**: Fixed in SSO server (not Amanoba code)

**Solution**: Clear browser cache if occurs

### 3. Service Worker

**Version**: 2.0.0

**Status**: Works correctly with networkFirstStrategy

**Rule**: DO NOT disable fetch interception

### 4. Build Must Be

- ✅ Warning-free
- ✅ Error-free
- ✅ Deprecated-free
- ✅ Minimal dependencies

---

## 15. Quality Standards

### Code Quality

1. **Error-free, warning-free, deprecated-free**
2. **Production-grade**
3. **Fully documented, traceable, maintainable**
4. **Secure, future-proof, dependency-safe**
5. **Commented in plain English** (when non-obvious intent)

### Commenting Rules

**DO NOT add comments that just narrate code:**
- ❌ "// Import the module"
- ❌ "// Define the function"
- ❌ "// Increment the counter"
- ❌ "// Return the result"
- ❌ "// Handle the error"

**DO add comments for:**
- ✅ Non-obvious intent, trade-offs, or constraints
- ✅ Complex business logic
- ✅ Security considerations
- ✅ Performance optimizations

### Rollback Plan (Non-Negotiable)

**For every development activity**, include a Safety Rollback Plan:
1. Identify current stable baseline (commit, tag, verified state)
2. Provide exact rollback steps (commands or actions)
3. Include verification steps to confirm rollback worked

---

## 16. AI & Automation

### Local AI Course Automation

**Location**: `app/lib/ai/` and `scripts/course-ai-autopilot.ts`

**Creation flow:**
1. Local AI drafts import-ready package
2. Existing importer finalizes course
3. Question-generation scripts complete

**Maintenance flow:**
1. Local AI produces plan from live course snapshot
2. Low-risk fixes applied with existing tools (resync, duration sync, question generation)

**Weekly content-fix flow:**
- Script: `scripts/course-content-fix-autopilot.ts`
- Audits oldest modified course
- Writes local preview bundle (dry-run)
- Turns findings into `mvp-factory-control` issues
- Moves issues to Project 12 `CONTENT fix`

### Quiz Authority

**Rule**: Learner lesson-quiz behavior resolved from `Course.lessonQuizPolicy`

**AI role**: Suggests and drafts; does NOT replace quality gates

---

## 17. Security & Rate Limiting

### Security Measures

- **Input validation**: Zod schemas with XSS protection (xss 1.0.15)
- **Rate limiting**: rate-limiter-flexible 8.0.1 on all endpoints
- **PII redaction**: Pino logger with PII redaction
- **Admin guards**: Verified on all admin API endpoints
- **Anti-cheat**: Anti-cheat measures on game endpoints

### Secrets Management

**Never commit:**
- `.env.local`
- Private keys/tokens/secrets
- Connection strings with credentials

**Rotate on schedule or incident:**
- `AUTH_SECRET`
- `SSO_CLIENT_SECRET`
- DB credentials
- Email/payment secrets

---

## 18. Current Status

### Version

**v2.9.49** (as of 2026-05-28)

### Recent Completions

- Doc SSOT + GDS Closure program (#890–#903)
- Practice Hub MVP (contract/UI/telemetry)
- Saved Lessons MVP
- Daily learning streak MVP
- Friend Streaks MVP
- Quiz answer explanation pilot
- Certificate pass rules and template assignment
- Lesson quiz governance consolidation
- Multi-enrolment email/scheduler respect

### Active Work

**No active NOW/NEXT**: Pick next card from [Project 12](https://github.com/users/moldovancsaba/projects/12/views/1)

### Production Status

- **Status**: Stable
- **Last verification**: 2026-05-29
- **Baseline routes verified**: /, /robots.txt, /sitemap.xml, /en/auth/signin
- **Smoke test**: 14/14 HTML routes OK; 9/9 API auth checks OK

---

## 19. Learning Resources

### Essential Reading (In Order)

1. `READMEDEV.md` — Developer brain boost
2. `docs/HANDOVER.md` — Runtime behavior and process changes
3. `docs/core/agent_working_loop_canonical_operating_document.md` — Agent operating rules
4. `docs/status/PRODUCTION_STATUS.md` — Production status

### When Touching Specific Areas

- **Content/courses/quizzes**: Read `docs/architecture/layout_grammar.md` first
- **UI/design**: Check https://github.com/sovereignsquad/general-design-system
- **Project board**: Read `docs/handoff/HANDOFF_MVP_FACTORY_CONTROL.md`
- **Environment**: Read `docs/core/ENVIRONMENT_SETUP.md`
- **Deployment**: Read `docs/deployment/DEPLOYMENT.md`

### Course Quality (Mandatory SSOT Set)

When working on courses, lessons, quizzes, or localization:

1. `docs/architecture/layout_grammar.md` — Layout and structure grammar
2. `amanoba_courses:process_them/docs/2026_course_creator_prompts.md` — Recursive prompts
3. `amanoba_courses:process_them/docs/2026_course_quality_prompt.md` — Quality control SSOT
4. `amanoba_courses:process_them/docs/reference/QUIZ_QUALITY_PIPELINE_HANDOVER.md` — Operational handover
5. `amanoba_courses:process_them/docs/reference/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` — Workflow playbook
6. `amanoba_courses:process_them/docs/COURSE_BUILDING_RULES.md` — Creation rules

---

## 20. Quick Reference Commands

### Daily Workflow

```bash
# Start session
git fetch origin && git status -sb
gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10

# Develop
npm run dev
npm run lint
npm run type-check
npm test

# Before commit
npm run docs:check
npm run ui:check:foundation

# Commit & push
git add -A
git commit -m "descriptive message"
git push origin <branch-name>
```

### Emergency Rollback

```bash
# Identify last good commit
git log --oneline | head -10

# Rollback
git reset --hard <commit-sha>
git push origin <branch-name> --force-with-lease

# Verify
npm run build
npm run type-check
```

### Production Verification

```bash
# After deploy
npm run audit:production-smoke

# Check specific routes
curl -I https://www.amanoba.com/
curl -I https://www.amanoba.com/robots.txt
curl -I https://www.amanoba.com/sitemap.xml
```

---

## 21. Troubleshooting

### Build Fails Locally

1. Check Node version: `node -v` (should be >= 20.0.0, < 25.0.0)
2. Clear cache: `rm -rf .next node_modules package-lock.json`
3. Reinstall: `npm install`
4. Retry: `npm run build`

### Build Passes Locally, Fails in Production

1. Check Node runtime alignment in Vercel (20.x/22.x)
2. Confirm all env vars set in Vercel Project Settings
3. Re-check callback URLs and domain vars (`NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`)

### SSO Login Fails

1. Verify issuer/JWKS/token/auth URLs in `.env.local`
2. Verify `SSO_SCOPES` includes required scopes
3. Verify callback URL exact match in SSO provider config
4. Check SSO provider is reachable

### Email Sending Fails

1. Confirm `EMAIL_PROVIDER` matches credentials set
2. Validate sender identity/domain in provider console
3. For Gmail: verify `GMAIL_REFRESH_TOKEN` and sender authorization

### TypeScript Errors

```bash
npm run type-check
```

### Lint Errors

```bash
npm run lint
```

### Test Failures

```bash
npm test
```

---

## 22. Contact & Support

### Project Owner

**Sultan** (Product Owner, Decision maker)

### Development Team

- **Chappie**: Architect
- **Katja**: Content Creator, Developer
- **Tribeca**: Developer

### Repositories

- **Product repo**: https://github.com/moldovancsaba/amanoba
- **Project board**: https://github.com/users/moldovancsaba/projects/12/views/1
- **Issues repo**: https://github.com/moldovancsaba/mvp-factory-control
- **Design system**: https://github.com/sovereignsquad/general-design-system

---

**Status**: Current knowledge baseline
**Last Updated**: 2026-08-05
**Document Status**: Active learning baseline

---

## End of Learning Summary

This document provides a comprehensive foundation for understanding and working with the Amanoba platform. For the most current information, always refer to the documentation in the repository and the MVP Factory Board.
