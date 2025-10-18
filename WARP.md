# Amanoba – AI Assistant Guide (WARP.md)

**Version**: 2.4.0  
**Last Updated**: 2025-10-18T09:16:20.000Z

---

This document provides essential context for AI assistants working on the Amanoba project. It serves as a quick reference for project structure, conventions, and critical information.

---

## 🎯 Project Summary

**Amanoba** is a unified gamification platform created by merging PlayMass (v4.11.2) and Madoku (v1.5.0) into a single, centralized Next.js application.

**Key Facts**:
- **Current Version**: 2.4.0
- **Tech Stack**: Next.js 15.5.2, TypeScript, MongoDB Atlas, Mongoose 8.18.0
- **Repository**: https://github.com/moldovancsaba/amanoba
- **Database**: madoku-cluster.kqamwf8.mongodb.net/amanoba
- **Primary Contact**: Csaba Moldovan (csaba@doneisbetter.com)
- **Project Phase**: Phase 1 (Foundation) - Day 1-7 of 70-day plan

---

## 📁 Project Structure

```
/Users/moldovancsaba/Projects/amanoba/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with fonts, metadata
│   ├── page.tsx               # Homepage
│   ├── globals.css            # Global styles with gamification animations
│   ├── api/                   # API routes (to be created)
│   ├── lib/                   # Core utilities and models
│   │   ├── mongodb.ts         # MongoDB connection singleton
│   │   ├── logger.ts          # Pino structured logger
│   │   ├── models/            # 17 Mongoose models
│   │   └── utils/             # Helper functions
│   └── components/            # React components (to be created)
├── docs/                      # Supporting documentation
│   └── ENVIRONMENT_SETUP.md   # Environment configuration guide
├── public/                    # Static assets
├── scripts/                   # Utility scripts (versioning, seeds)
├── ARCHITECTURE.md            # Complete system architecture (706 lines)
├── TECH_STACK.md             # Technology versions
├── ROADMAP.md                # Forward-looking development plans
├── TASKLIST.md               # Active tasks and status
├── RELEASE_NOTES.md          # Completed work changelog
├── LEARNINGS.md              # Development insights and best practices
├── NAMING_GUIDE.md           # Comprehensive naming conventions
├── CONTRIBUTING.md           # Development workflow and guidelines
├── README.md                 # Project overview
├── WARP.DEV_AI_CONVERSATION.md  # Planning session documentation
├── package.json              # Dependencies and scripts (v1.0.0)
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript strict configuration
├── tailwind.config.ts        # Tailwind with Amanoba branding
├── .env.local.example        # Environment variable template
└── .env.local                # Actual credentials (not in git)
```

---

## 🔑 Critical Information

### Versioning Protocol (MANDATORY)

**Before `npm run dev`**: Increment **PATCH** (+0.0.1)  
**Before commit**: Increment **MINOR** (+0.1.0, reset PATCH to 0)  
**Major release**: Increment **MAJOR** (+1.0.0, reset MINOR and PATCH to 0) - only on explicit instruction

**Version must be synchronized in**:
- package.json
- All documentation files (README, ARCHITECTURE, TASKLIST, ROADMAP, RELEASE_NOTES, LEARNINGS, NAMING_GUIDE, CONTRIBUTING, WARP.md)

---

### Timestamp Format (MANDATORY)

**Always use**: ISO 8601 with milliseconds in UTC  
**Format**: `YYYY-MM-DDTHH:MM:SS.sssZ`  
**Example**: `2025-04-13T12:34:56.789Z`

**Applied everywhere**: Logs, documentation, database fields, UI displays

---

### Tests Policy

**Tests are PROHIBITED** per AI rule (ksglxIDdoNUOAOmXqrhl9h).  
**Reason**: MVP Factory model prioritizes speed over test coverage.  
**Alternative**: Manual QA, TypeScript strict mode, frequent builds.

---

### Documentation Updates (MANDATORY)

**Always update** after changes:
- `TASKLIST.md` - Task status and details
- `RELEASE_NOTES.md` - Completed features/fixes
- `LEARNINGS.md` - Insights and issues
- `ARCHITECTURE.md` - System design changes
- `ROADMAP.md` - Future plan adjustments

---

## 🗄️ Database Schema Overview

**17 Mongoose Models** (to be implemented in Phase 2.2):

1. **Brand** - Multi-brand white-labeling configuration
2. **Game** - Game type definitions (QUIZZZ, WHACKPOP, MADOKU)
3. **GameBrandConfig** - Per-brand game customization
4. **Player** - Core player identity, premium status
5. **PlayerSession** - Individual game play sessions
6. **PlayerProgression** - Level, XP, titles, achievements, streaks
7. **PointsWallet** - Current points balance per player
8. **PointsTransaction** - Complete audit trail for points
9. **Achievement** - Achievement definitions with unlock criteria
10. **AchievementUnlock** - Player achievement unlock records
11. **LeaderboardEntry** - Calculated rankings for games
12. **Streak** - Win streak and login streak tracking
13. **Reward** - Reward definitions (redeemable with points)
14. **RewardRedemption** - Reward claim lifecycle tracking
15. **EventLog** - Event-sourcing for analytics
16. **AnalyticsSnapshot** - Pre-aggregated metrics (daily cron)
17. **SystemVersion** - Database migration tracking
18. **ReferralTracking** - Referral events (bonus from PlayMass)

**Connection Details**:
- Host: madoku-cluster.kqamwf8.mongodb.net
- Database: amanoba
- Connection: Via Mongoose singleton pattern (app/lib/mongodb.ts)

---

## 🎨 Branding

**Colors**:
- Primary: Indigo (#6366f1)
- Secondary: Pink (#ec4899)
- Accent: Purple (#a855f7)

**Typography**:
- Primary: Noto Sans
- Secondary: Inter

**Identity**:
- Logo: 🎮
- Tagline: "Play. Compete. Achieve."

---

## 🚀 Tech Stack Quick Reference

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 15.5.2 |
| Language | TypeScript | 5.3.3 |
| Database | MongoDB Atlas | 6.18.0 |
| ODM | Mongoose | 8.18.0 |
| Styling | Tailwind CSS | 3.4.11 |
| UI Components | Radix UI | Various |
| Animation | Framer Motion | 10.18.0 |
| Data Fetching | TanStack Query | 5.56.2 |
| Validation | Zod | 4.1.11 |
| Logging | Pino | 9.13.0 |
| Charts | Recharts | 3.2.1 |
| Auth | NextAuth.js | 4.24.5 |
| Rate Limiting | rate-limiter-flexible | 8.0.1 |
| Push Notifications | web-push | 3.6.7 |

---

## 📋 Current Development Status

**Active Phase**: Phase 1.4 - Core Documentation (In Progress)  
**Next Phase**: Phase 2.1 - MongoDB connection and logger setup  
**Expected Completion**: Phase 1 by Day 7, all 10 phases by Day 70

**Completed Tasks** (Phase 1):
- ✅ 1.1 - Repository initialization
- ✅ 1.2 - Next.js structure
- ✅ 1.3 - Environment configuration
- 🔄 1.4 - Core documentation (completing now)

**Pending Tasks**: 39 tasks across Phases 2-10 (see TASKLIST.md)

---

## 🚫 Prohibited Actions

❌ **No test files** - Tests prohibited per MVP Factory model  
❌ **No breadcrumbs** - Use clear top-level navigation instead  
❌ **No hardcoded config** - Use MongoDB Brand/GameBrandConfig models  
❌ **No version skipping** - Must bump before dev and commit  
❌ **No undocumented changes** - Update docs with every change  
❌ **No inconsistent timestamps** - ISO 8601 with milliseconds only  
❌ **No exposed secrets** - Use environment variables  
❌ **No `console.log`** - Use Pino logger  

---

## 📚 Key Conventions

### File Naming
- **kebab-case** for all files and directories
- `player-progression.ts`, `achievement-unlock-dialog.tsx`

### Code Naming
- **Variables/Functions**: camelCase (`calculatePoints`, `playerName`)
- **Classes/Interfaces**: PascalCase (`PlayerManager`, `GameConfig`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_LEVEL`, `API_RATE_LIMIT`)
- **React Components**: PascalCase files and functions (`PlayerCard.tsx`)
- **MongoDB Collections**: PascalCase singular (`Player`, `Achievement`)
- **Schema Fields**: camelCase (`displayName`, `createdAt`)

### Git Conventions
- **Branches**: `type/description` (`feature/achievements`, `fix/points-bug`)
- **Commits**: Semantic messages (`feat(scope): Description`)
- **Tags**: `vMAJOR.MINOR.PATCH` (`v1.0.0`, `v1.1.0`)

---

## ✅ Definition of Done

A task is **complete** only when:
1. ✅ Functionality verified in dev environment
2. ✅ Version bumped correctly
3. ✅ All relevant documentation updated
4. ✅ `npm run build` passes
5. ✅ Code properly commented (What + Why)
6. ✅ Committed and pushed to GitHub

---

## 🔧 Common Commands

```bash
# Development
npm run dev                    # Start dev server (after version bump)
npm run build                  # Build for production (validation)
npm run start                  # Start production server

# Version Management (scripts to be created)
npm run bump:patch             # Increment PATCH version
npm run bump:minor             # Increment MINOR version
npm run bump:major             # Increment MAJOR version

# Git
git status                     # Check current state
git add .                      # Stage all changes
git commit -m "msg"            # Commit with message
git push origin branch-name    # Push to remote
git tag v1.0.0                # Tag release
git push --tags               # Push tags
```

---

## 🎯 Active Development Plan

**10 Phases, 70 Days, 43 Tasks**:

1. **Phase 1** (Days 1-7): Foundation - Repository, Next.js, Environment, Documentation
2. **Phase 2** (Days 8-14): Database - MongoDB connection, 17 models, seed scripts
3. **Phase 3** (Days 15-21): Gamification - Points, achievements, XP, streaks, progressive disclosure
4. **Phase 4** (Days 22-28): Games - Port QUIZZZ, WHACKPOP, Madoku, unified session API
5. **Phase 5** (Days 29-35): Advanced - Leaderboards, daily challenges, quests
6. **Phase 6** (Days 36-42): Analytics - Event logging, aggregation, admin dashboard
7. **Phase 7** (Days 43-49): Social - Player profiles, referral system
8. **Phase 8** (Days 50-56): Admin - Dashboard, game management, gamification tools
9. **Phase 9** (Days 57-63): Polish - Design system, animations, responsive, PWA, a11y
10. **Phase 10** (Days 64-70): Launch - Security, QA, performance, deployment, monitoring

---

## 🆘 Quick Help

**Find specific info**:
- System architecture → `ARCHITECTURE.md`
- Technology versions → `TECH_STACK.md`
- Naming conventions → `NAMING_GUIDE.md`
- Development workflow → `CONTRIBUTING.md`
- Active tasks → `TASKLIST.md`
- Completed work → `RELEASE_NOTES.md`
- Best practices → `LEARNINGS.md`
- Future plans → `ROADMAP.md`
- Environment setup → `docs/ENVIRONMENT_SETUP.md`

**Common issues**:
- MongoDB connection errors → Check `.env.local`, see LEARNINGS.md "MongoDB Connection Pooling"
- Build failures → Run `npm run build`, check TypeScript errors
- Version conflicts → Verify all documentation files have same version
- Import errors → Check path aliases in `tsconfig.json`

---

## 📞 Contact & Resources

**Project Lead**: Csaba Moldovan  
**Email**: csaba@doneisbetter.com  
**Repository**: https://github.com/moldovancsaba/amanoba  
**MongoDB Atlas**: madoku-cluster.kqamwf8.mongodb.net  

---

## 💡 AI Assistant Guidelines

When working on this project:

1. **Always check current version** in package.json before starting work
2. **Read relevant documentation** (ARCHITECTURE.md, TASKLIST.md) before implementing
3. **Search for existing code** before creating new files (Reuse Before Creation rule)
4. **Comment all code** with What and Why explanations
5. **Update documentation** immediately after code changes
6. **Use proper naming** conventions from NAMING_GUIDE.md
7. **Validate with build** before committing (`npm run build`)
8. **Follow versioning protocol** strictly
9. **Use ISO 8601 timestamps** with milliseconds everywhere
10. **Never create test files** per project policy

**Remember**: Quality and delivery matter more than speed. Take time to do it right, update docs thoroughly, and ensure build passes.

---

**Maintained By**: Narimato  
**Review Cycle**: Updated with project structure or policy changes
