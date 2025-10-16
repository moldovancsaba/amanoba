# Amanoba Development Planning Log

**Project**: Amanoba — Unified Game Platform  
**Version**: 1.0.0 (in progress)  
**Repository**: https://github.com/moldovancsaba/amanoba.git

---

## 2025-10-10T09:14:06.000Z — Project Initialization Planning Session

### Context

User initiated the merge of two mature Next.js game platform projects into a new unified platform called "Amanoba":

**Source Projects:**
1. **PlayMass** (v4.11.2)
   - Next.js 15.5.2 (App Router)
   - Games: QUIZZZ, WHACKPOP
   - MongoDB + Mongoose ODM
   - Referral system, PWA, security features
   - Location: `/Users/moldovancsaba/Library/Mobile Documents/com~apple~CloudDocs/Projects/playmass`

2. **Madoku** (v1.5.0)
   - Next.js 15 (Pages Router)
   - Sudoku game with AI opponents
   - Comprehensive gamification system
   - Advanced analytics (6 chart types)
   - MongoDB (native driver)
   - Location: `/Users/moldovancsaba/Library/Mobile Documents/com~apple~CloudDocs/Projects/madoku`

### Strategic Decisions Confirmed

1. **Initial Version**: Start at v1.0.0
2. **Timeline**: Full 10-week implementation (70 days)
3. **Data Strategy**: Fresh start with correct data structures, no migration from existing databases
4. **Architecture**: Fully centralized, reusable elements, easy to maintain
5. **Git Strategy**: Fresh repository at https://github.com/moldovancsaba/amanoba.git
   - PlayMass and Madoku remain as reference but won't change anymore
   - Clean history starting from Amanoba v1.0.0

### Technology Stack Lock-In

Based on merge plan analysis and AI rules compliance:

**Core Framework:**
- Next.js 15.5.2 (App Router) — from PlayMass
- TypeScript 5
- Node.js >= 20.0.0 (from PlayMass engines spec)

**Database:**
- MongoDB Atlas 6.18.0+ (from PlayMass)
- Mongoose 8.18.0 ODM (migrate Madoku from native driver)

**UI/Styling:**
- Tailwind CSS 3.4.1
- Radix UI primitives (from Madoku)
- Framer Motion 10.18.0 (from PlayMass)
- lucide-react (icons from Madoku)
- class-variance-authority, clsx, tailwind-merge (from Madoku)

**State Management:**
- TanStack React Query (from Madoku for server state)

**Data Visualization:**
- Recharts 3.2.1 (from Madoku)
- date-fns (from Madoku)

**Validation & Security:**
- Zod 4.1.11 (XSS protection from PlayMass; note version difference with Madoku's 3.23.8 — use PlayMass version)
- rate-limiter-flexible 8.0.1 (from PlayMass)
- Pino 9.13.0 (structured logging from PlayMass)
- xss 1.0.15 (from PlayMass)

**PWA & Push:**
- web-push 3.6.7 (from PlayMass)

### AI Rules Compliance

All development must follow these mandatory rules:

1. **Versioning Protocol** (Rule: bPbp5By0QzqF3gGu93bVjt)
   - PATCH +1 before every `npm run dev`
   - MINOR +1, PATCH reset to 0 before every GitHub commit
   - MAJOR +1 only on explicit major release instruction
   - Version reflected in package.json, all docs, SystemVersion collection, UI footer

2. **Timestamp Format** (Rule: GgQpzJaJFBHgeBzRXQr8GG)
   - Mandatory ISO 8601 with milliseconds UTC: `YYYY-MM-DDTHH:MM:SS.sssZ`
   - Example: `2025-10-10T09:14:06.000Z`
   - Apply everywhere: UI, logs, DB, documentation

3. **Documentation Standards** (Rule: EBsm5NR9tLWo6eFQnCBImg)
   - README.md — overview, links to all docs
   - ROADMAP.md — forward-looking only, no historical entries
   - TASKLIST.md — priority-sorted, owner + delivery date required
   - RELEASE_NOTES.md — versioned changelog format: `## [vX.Y.Z] — YYYY-MM-DD`
   - ARCHITECTURE.md — current system only, no deprecated elements
   - LEARNINGS.md — categorized issues and resolutions
   - All docs must be updated before commits

4. **Roadmap and Task Tracking** (Rule: Ctx324ExgkgcnYH9l9dLq9)
   - Immediately reflect plan changes in ROADMAP.md
   - Add all tasks to TASKLIST.md with clear definitions
   - Update task status on completion and confirmation
   - Move completed tasks to RELEASE_NOTES.md when versioning

5. **Reuse Before Creation** (Rule: Hkmx62Un3DiLYc5SQB40XQ)
   - Search existing codebase before creating new elements
   - Evaluate reuse or extension vs duplication
   - Respect existing naming conventions and architecture
   - Document why new creation if reuse not viable

6. **Code Commenting Standard** (Rule: KoQ93rKBdmt5VlnCCXPc6L)
   - All code must have comments explaining WHAT and WHY
   - Functional Explanation — what does this accomplish?
   - Strategic Justification — why this approach in context?

7. **Major Update Recording Protocol** (Rule: O2O7wZ16NZ5qzak43sP41E)
   - Increment major version per semantic versioning
   - Comprehensive documentation update
   - Document learnings in LEARNINGS.md
   - Verify dev environment stability
   - Commit and push to GitHub

8. **Full-Scale Professional Refactor** (Rule: PVvTzjqo6IHxaDIk5FThCO)
   - Strict adherence to all AI rules
   - Robust refactoring for reliability
   - Exhaustive documentation update with precise locations
   - Mandatory code comments (what + why)
   - Enforced versioning consistency across all layers
   - Automation of mandatory tasks where viable

9. **Navigation Design Policy** (Rule: QsC5EWsJVUi9ENlUdDdT0E)
   - Breadcrumb navigation is explicitly prohibited
   - Use clear top-level navigation
   - Context-aware headers and titles
   - Self-explanatory screens

10. **Task Delivery Logging** (Rule: TPQmUfuBjLHeecjG6WB2Zu)
    - Plans written in WARP.DEV_AI_CONVERSATION.md
    - Record in TASKLIST.md with timestamps
    - Link to ROADMAP.md for strategic implications
    - Recording is mandatory precondition for execution

11. **Technology Stack Compliance** (Rule: bMX66jBs78MhwnoA19SPKK)
    - Validate against established tech stack before development
    - Maintain alignment with existing patterns
    - Document and approve deviations before implementation
    - Record stack decisions in governance files

12. **Definition of Done** (Rule: xoGiE39qvud5f26J984HBF)
    - Manual verification in dev environment
    - Version incremented and reflected everywhere
    - All documentation fully updated (ARCHITECTURE, TASKLIST, LEARNINGS, README, RELEASE_NOTES, ROADMAP)
    - Code committed and pushed to main
    - Reminder: Commit only after build passes and dev approved

13. **No Tests Policy** (Rule: ksglxIDdoNUOAOmXqrhl9h)
    - Tests are prohibited in MVP Factory
    - Manual QA only

14. **URL Markdown Policy** (Rule: ivx8eJFEka2RwjImIV9xcW)
    - Never write URLs with asterisks at end
    - Avoid markdown formatting for URLs without spaces

### Implementation Plan Overview

Created comprehensive 43-task execution plan covering 10 phases over 70 days:

**Phase 1 (Days 1-7): Foundation**
- Repository initialization ✅
- Base Next.js structure from PlayMass
- Environment configuration
- Core documentation setup

**Phase 2 (Days 8-14): Database Layer**
- MongoDB connection and logger
- 17 Mongoose models with strict schemas
- Database seed scripts

**Phase 3 (Days 15-21): Gamification Core**
- Points system with atomic operations
- Achievement system with unlocks
- XP and leveling (50 levels)
- Streak tracking
- Progressive disclosure gating

**Phase 4 (Days 22-28): Games Integration**
- Port QUIZZZ and WHACKPOP from PlayMass
- Port Madoku Sudoku engine with AI
- Unified game session API
- Game launcher and navigation

**Phase 5 (Days 29-35): Advanced Features**
- Leaderboards with daily cron
- Daily challenges system
- Quest system

**Phase 6 (Days 36-42): Analytics**
- Event logging system
- Aggregation pipeline
- Admin analytics dashboard with 6 chart types

**Phase 7 (Days 43-49): Profile & Social**
- Player profile pages
- Referral system integration from PlayMass

**Phase 8 (Days 50-56): Admin Tools**
- Admin dashboard and layout
- Game management tools from PlayMass
- Gamification admin and premium management

**Phase 9 (Days 57-63): Polish**
- Design system and UI primitives
- Animations and transitions
- Responsive design
- PWA configuration
- Accessibility improvements (WCAG AA)

**Phase 10 (Days 64-70): Launch Preparation**
- Security hardening
- Production environment setup
- Manual QA execution
- Performance optimization
- Database backup scripts
- Documentation sync
- Version control and tagging
- Vercel deployment
- Monitoring setup
- Rollback plan

### Success Criteria

- All 17 Mongoose models with indexes and validation
- QUIZZZ, WHACKPOP ported and integrated with gamification
- Madoku Sudoku as premium game with AI (3 levels) and ELO
- Progressive disclosure working (default threshold: 3 games)
- API p95 latency < 300ms, error rate < 0.5%
- PWA installable and offline-capable
- Documentation fully compliant and synchronized
- Accessibility WCAG AA compliance
- Lighthouse score > 90

### Next Steps

1. Complete Phase 1.1 ✅ (Repository initialization completed)
2. Proceed with Phase 1.2 (Copy base Next.js structure from PlayMass)
3. Continue systematic execution through all 43 tasks
4. Maintain strict version control per protocol
5. Update this log at each major milestone

---

## Task Execution Log

### 2025-10-10T09:14:06.000Z — Phase 1.1 Complete

**Task**: Initialize fresh repository and base files

**Actions Completed**:
1. ✅ Initialized Git repository at `/Users/moldovancsaba/Projects/amanoba`
2. ✅ Connected remote origin: `https://github.com/moldovancsaba/amanoba.git`
3. ✅ Created comprehensive `.gitignore`
4. ✅ Created initial `README.md` with project overview

**Status**: Phase 1.1 COMPLETE

**Next**: Phase 1.3 — Environment configuration and documentation

---

### 2025-10-10T09:50:00.000Z — Phase 1.2 Complete

**Task**: Copy and configure base Next.js structure from PlayMass

**Actions Completed**:
1. ✅ Created `package.json` (85 lines) with merged dependencies from PlayMass and Madoku
   - Version set to 1.0.0
   - All PlayMass dependencies retained (Next.js 15.5.2, MongoDB 6.18.0, Mongoose 8.18.0, etc.)
   - Added Madoku features: @radix-ui primitives, recharts, date-fns, lucide-react, class-variance-authority, clsx, tailwind-merge, @tanstack/react-query
   - Included versioning scripts and database scripts
2. ✅ Created `next.config.ts` (43 lines) with security headers and configuration
3. ✅ Created `tsconfig.json` (40 lines) with strict type checking and path aliases
4. ✅ Created `tailwind.config.ts` (101 lines) with extended theme including:
   - Amanoba brand colors (indigo primary, pink secondary)
   - Custom animations: bounce-in, fade-in, slide-up, slide-down, scale-in
   - Font configuration for Noto Sans and Inter
   - Dark mode support
5. ✅ Created `postcss.config.mjs` (9 lines) with Tailwind and Autoprefixer
6. ✅ Created `app/layout.tsx` (72 lines) with:
   - Font loading (Noto Sans, Inter)
   - Comprehensive metadata for SEO
   - PWA manifest reference
   - Responsive viewport configuration
7. ✅ Created `app/page.tsx` (178 lines) with:
   - Hero section with Amanoba branding
   - Features grid showcasing 6 key features
   - System status badge with version 1.0.0
   - Complete footer with links
8. ✅ Created `app/globals.css` (123 lines) with:
   - Tailwind imports
   - CSS custom properties for theming
   - Dark mode support
   - Custom scrollbar styling
   - Gamification animations (achievement-pop, level-up, points-counter)
   - Accessibility utilities
9. ✅ Created `public/` directory structure
10. ✅ Ran `npm install` — 589 packages installed successfully with 0 vulnerabilities

**Deliverables**:
- All configuration files created and adapted to Amanoba
- App structure with layout and home page
- Dependencies installed with clean lockfile

**Status**: Phase 1.2 COMPLETE

**Technical Notes**:
- Using TypeScript for all config files (.ts, .mjs) per modern Next.js conventions
- Merged dependencies carefully to avoid conflicts (Zod 4.1.11 from PlayMass used instead of Madoku's 3.23.8)
- All code includes "What" and "Why" comments per AI rules
- Amanoba branding (indigo/pink gradient) applied consistently

**Next**: Phase 1.3 — Environment configuration and documentation

---

## 2025-10-16T11:41:41.000Z — Game Content Database Migration Planning

### Context

User requested migration of hardcoded game content to MongoDB Atlas with intelligent usage tracking:

**Current State**:
1. **QUIZZZ Game** (`app/games/quizzz/page.tsx`)
   - ~40 questions hardcoded as const array
   - 4 difficulty levels: EASY, MEDIUM, HARD, EXPERT
   - No tracking of question usage or difficulty

2. **WHACKPOP Game** (`app/games/whackpop/page.tsx`)
   - 8 emojis hardcoded as const array
   - No rotation or tracking

**User Requirements**:
1. Move 40 existing QUIZZZ questions to MongoDB
2. Create 80 NEW questions (total 120 questions)
3. Implement intelligent question selection:
   - **Priority 1**: Show questions with lowest `showCount`
   - **Priority 2** (tie-breaker): Show questions with lowest `correctCount` 
   - **Priority 3** (tie-breaker): Alphabetical order by question text
4. Track usage stats:
   - `showCount`: How many times question appeared in games
   - `correctCount`: How many times answered correctly
5. Move 8 WHACKPOP emojis to MongoDB
6. Create APIs for content fetching and tracking

### Implementation Plan (12 Tasks)

**Data Models**:
1. **QuizQuestion Model** (`app/lib/models/quiz-question.ts`)
   - question: string
   - options: string[4]
   - correctIndex: number (0-3)
   - difficulty: enum ['EASY', 'MEDIUM', 'HARD', 'EXPERT']
   - category: string
   - showCount: number (default 0)
   - correctCount: number (default 0)
   - isActive: boolean (default true)
   - Indexes: `{ difficulty, isActive, showCount, correctCount, question }`

2. **WhackPopEmoji Model** (`app/lib/models/whackpop-emoji.ts`)
   - emoji: string (unique)
   - name: string
   - category: string
   - isActive: boolean
   - weight: number
   - Indexes: `{ emoji }` (unique), `{ isActive }`

**API Endpoints**:
1. `GET /api/games/quizzz/questions?difficulty=MEDIUM&count=10`
   - Intelligent selection algorithm with triple-tier sorting
   - Atomically increments `showCount` for selected questions
   - Returns questions without `correctIndex` (security)

2. `POST /api/games/quizzz/questions/track`
   - Tracks correct answers
   - Bulk updates `correctCount` for answered questions

3. `GET /api/games/whackpop/emojis`
   - Returns all active emojis
   - Cached for 1 hour

**Seed Scripts**:
1. `scripts/seed-quiz-questions.ts`
   - Migrates 40 existing questions
   - Adds 80 NEW questions across 8 categories:
     - Science (20), History (20), Geography (15)
     - Math (15), Technology (15), Arts & Literature (10)
     - Sports (10), General Knowledge (15)
   - Difficulty distribution: 30 EASY, 30 MEDIUM, 30 HARD, 30 EXPERT

2. `scripts/seed-whackpop-emojis.ts`
   - Migrates 8 existing emojis with metadata

**Game Component Updates**:
1. `app/games/quizzz/page.tsx`
   - Remove hardcoded `ALL_QUESTIONS` array
   - Fetch questions from API on game start
   - Track correct answers during gameplay
   - Send tracking data on game completion

2. `app/games/whackpop/page.tsx`
   - Remove hardcoded `TARGET_EMOJIS` array
   - Fetch emojis from API on mount
   - Cache in sessionStorage

### Task Breakdown

| ID | Task | Expected Delivery |
|----|------|------------------|
| 1 | Audit current game content storage | 2025-10-16 |
| 2 | Design MongoDB schemas for game content | 2025-10-16 |
| 3 | Create seed script for QUIZZZ questions (120 total) | 2025-10-16 |
| 4 | Create seed script for WHACKPOP emojis | 2025-10-16 |
| 5 | Implement intelligent question selection API | 2025-10-16 |
| 6 | Implement question tracking API | 2025-10-16 |
| 7 | Implement WHACKPOP emojis API | 2025-10-16 |
| 8 | Update QUIZZZ game component | 2025-10-16 |
| 9 | Update WHACKPOP game component | 2025-10-16 |
| 10 | Run seed scripts and verify database | 2025-10-16 |
| 11 | Manual QA testing | 2025-10-16 |
| 12 | Update documentation and commit | 2025-10-16 |

### Technical Decisions

**Selection Algorithm Optimization**:
- Use MongoDB aggregation pipeline for multi-tier sorting
- Compound index: `{ difficulty: 1, isActive: 1, showCount: 1, correctCount: 1, question: 1 }`
- Atomic `$inc` operations to prevent race conditions

**Security Considerations**:
- Never return `correctIndex` to client until answer submitted
- Rate limiting on all endpoints (100 req/min)
- Input validation with Zod schemas

**Performance Optimizations**:
- Cache WHACKPOP emojis for 1 hour (rarely change)
- SessionStorage fallback for offline support
- Bulk writes for tracking updates

**Content Quality Standards**:
- All 80 new questions must be:
  - Factually accurate and verifiable
  - Unambiguous with one clear correct answer
  - Well-distributed across categories and difficulties
  - Appropriate for target audience

### Success Criteria

- ✅ 120 QUIZZZ questions in database (40 migrated + 80 new)
- ✅ 8 WHACKPOP emojis in database
- ✅ 3 API endpoints functional and tested
- ✅ Games work with database content (no hardcoding)
- ✅ Intelligent selection algorithm working correctly
- ✅ Usage tracking updating correctly
- ✅ All documentation updated
- ✅ Version bumped to 2.1.0

### Next Steps

1. Begin with task #1: Audit current game content
2. Create Mongoose models (task #2)
3. Create comprehensive seed scripts (tasks #3-4)
4. Implement API layer (tasks #5-7)
5. Update game components (tasks #8-9)
6. QA and documentation (tasks #10-12)

---

*This log will be updated throughout the development lifecycle. All timestamps use ISO 8601 format with milliseconds in UTC.*
