# Amanoba Learnings

**Version**: 1.0.0  
**Last Updated**: 2025-10-10T11:04:06.000Z

---

This document captures actual issues faced, solutions implemented, and best practices discovered during the development of Amanoba. Entries are categorized to facilitate knowledge sharing and prevent repeated mistakes.

---

## 🏗️ Architecture & Design

### Merge Strategy: Centralized Reusability Over Brand Silos

**Context**: Merging PlayMass (v4.11.2) and Madoku (v1.5.0) into a unified platform.

**Learning**: Instead of maintaining separate codebases per brand, we established a centralized architecture with:
- Single Next.js App Router application
- Brand configuration stored in MongoDB (`Brand` model)
- Game-specific configs linked via `GameBrandConfig` model
- Shared UI components with brand theming via CSS variables
- Single deployment with runtime brand detection (subdomain or path-based)

**Why It Matters**: This approach prevents code duplication, simplifies maintenance, and enables rapid addition of new brands without forking the codebase.

**Applied In**: ARCHITECTURE.md Section 3, Brand and GameBrandConfig models.

---

### Progressive Disclosure: Gating Premium Features

**Context**: Madoku has premium-only features that need to be accessible only after player engagement.

**Learning**: Implemented progressive disclosure with a clear threshold:
- Free players must complete at least **3 games** before premium features are revealed
- Threshold stored in `GameBrandConfig.premiumGatingConfig.minGamesBeforeShow`
- UI components check `PlayerProgression.totalGamesPlayed` before rendering premium CTAs

**Why It Matters**: Prevents overwhelming new players and increases premium conversion by building habit first.

**Applied In**: Phase 3.5, PlayerProgression model, frontend game launcher logic.

---

## 💾 Backend & Database

### MongoDB Connection Pooling in Next.js

**Context**: Next.js App Router hot-reloads during development, causing multiple MongoDB connection attempts.

**Learning**: Use a global singleton pattern with cached connection:
```typescript
// Prevents "MongoClient already connected" errors
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
```

**Why It Matters**: Avoids connection exhaustion and development errors.

**Applied In**: `app/lib/mongodb.ts`

---

### Mongoose Schema Design: Strict Validation

**Context**: Preventing data corruption and ensuring type safety in MongoDB.

**Learning**: Always use:
- `strict: true` mode to reject undefined fields
- Comprehensive Zod schemas for runtime validation
- Mongoose validators for database-level constraints
- Indexes on all frequently queried fields
- TTL indexes for temporary data (e.g., sessions with `expiresAt`)

**Why It Matters**: Catches bugs early, prevents invalid data states, improves query performance.

**Applied In**: All 17 Mongoose models in Phase 2.2.

---

### Event-Sourcing for Analytics

**Context**: Need to track player behavior and system events for analytics without blocking game logic.

**Learning**: Implemented event-sourcing pattern:
- All significant events logged to `EventLog` model
- Fire-and-forget logging (no blocking)
- Daily cron aggregates events into `AnalyticsSnapshot`
- Enables historical analysis without affecting real-time performance

**Why It Matters**: Decouples analytics from core features, enables flexible querying, provides audit trail.

**Applied In**: Phase 6.1, EventLog model, analytics aggregation pipeline.

---

## 🎨 Frontend & UI

### Tailwind CSS: Custom Animation Classes

**Context**: Need consistent gamification animations across all UI components.

**Learning**: Defined reusable utility classes in `globals.css`:
- `.animate-points` - points earned visual feedback
- `.animate-achievement` - achievement unlock celebration
- `.animate-level-up` - level up burst effect
- `.animate-streak` - streak maintenance indicator

**Why It Matters**: Ensures consistent visual language, reduces code duplication, easy to update globally.

**Applied In**: `app/globals.css`, all gamification UI components.

---

### Radix UI Primitives: Accessibility by Default

**Context**: Need WCAG AA compliant UI without reinventing the wheel.

**Learning**: Radix UI provides unstyled, accessible primitives (Dialog, Dropdown, Tooltip, etc.) that:
- Handle keyboard navigation automatically
- Manage focus trapping and screen reader announcements
- Work correctly with Tailwind CSS styling

**Why It Matters**: Saves development time, ensures accessibility compliance, provides robust foundation.

**Applied In**: All modal dialogs, dropdowns, tooltips throughout UI.

---

## 🔐 Security

### Environment Variable Validation

**Context**: Missing or malformed environment variables cause runtime crashes.

**Learning**: Use Zod schemas to validate all environment variables at startup:
```typescript
const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  ADMIN_PASSWORD: z.string().min(8),
  // ... all required vars
});

const env = envSchema.parse(process.env);
```

**Why It Matters**: Fails fast during deployment, prevents runtime errors in production.

**Applied In**: `docs/ENVIRONMENT_SETUP.md`, startup validation script (Phase 2.1).

---

### Rate Limiting: Per-IP and Per-User

**Context**: Need to prevent abuse of APIs (especially points-earning endpoints).

**Learning**: Implemented dual rate limiting strategy:
- **Per-IP**: 100 requests per 15 minutes (global)
- **Per-User**: 10 game sessions per hour (prevents botting)
- Uses `rate-limiter-flexible` with Redis (production) or in-memory (dev)

**Why It Matters**: Prevents abuse while allowing legitimate high-activity users.

**Applied In**: API route middleware, Phase 10.1 security hardening.

---

## 🚀 DevOps & Process

### Versioning Protocol: Semantic and Strict

**Context**: Need clear version tracking across codebase, database, and documentation.

**Learning**: Enforce strict versioning rules:
- **PATCH** (+0.0.1): Before every `npm run dev`
- **MINOR** (+0.1.0): Before every commit to GitHub
- **MAJOR** (+1.0.0): Only on explicit major release instruction

Version must be synchronized across:
- `package.json`
- All documentation files (README, ARCHITECTURE, etc.)
- UI footer display
- Database `SystemVersion` model

**Why It Matters**: Ensures traceability, simplifies rollback, prevents version drift.

**Applied In**: Versioning AI Rule (bPbp5By0QzqF3gGu93bVjt), all documentation, versioning scripts.

---

### Documentation: Living and Mandatory

**Context**: Documentation often becomes outdated in fast-paced development.

**Learning**: Make documentation updates **non-negotiable** via AI rules:
- All code changes must be reflected in relevant docs
- TASKLIST.md tracks active work
- RELEASE_NOTES.md logs completed work
- LEARNINGS.md captures insights
- ROADMAP.md shows forward plans only

**Why It Matters**: Maintains project continuity, enables onboarding, prevents knowledge loss.

**Applied In**: Documentation AI Rules (EBsm5NR9tLWo6eFQnCBImg, Ctx324ExgkgcnYH9l9dLq9), Definition of Done.

---

## 🎮 Game Integration

### Unified Session API

**Context**: QUIZZZ, WHACKPOP, and Madoku have different session management approaches.

**Learning**: Created unified session API pattern:
1. Start session: `POST /api/games/{gameId}/session` → Returns sessionId
2. Log events: `POST /api/games/{gameId}/session/{sessionId}/events`
3. End session: `POST /api/games/{gameId}/session/{sessionId}/end` → Awards points, checks achievements

**Why It Matters**: Standardizes integration, simplifies analytics, enables consistent gamification.

**Applied In**: Phase 4.3, ARCHITECTURE.md Section 5.

---

### Game State: Client vs Server

**Context**: Need to prevent cheating while maintaining smooth gameplay.

**Learning**: Hybrid approach:
- **Client-side**: Real-time game state for responsiveness
- **Server-side**: Validation of final scores using replay verification or heuristics
- **Anti-cheat**: Check score/time ratios, detect impossible achievements

**Why It Matters**: Balances UX and security without over-engineering.

**Applied In**: Game session end API validation logic (Phase 4.3).

---

## 📊 Analytics

### Pre-Aggregation vs On-Demand Queries

**Context**: Analytics dashboard needs to be fast even with millions of events.

**Learning**: Use pre-aggregation strategy:
- Daily cron job aggregates `EventLog` into `AnalyticsSnapshot`
- Dashboard queries snapshots (fast) instead of raw events (slow)
- Raw events kept for 90 days for detailed drill-down

**Why It Matters**: Keeps dashboard responsive, reduces database load, enables historical trending.

**Applied In**: Phase 6.2, AnalyticsSnapshot model, daily cron job.

---

## 🐛 Debugging & Testing

### Pino Logger: Structured Logging

**Context**: Console.log insufficient for production debugging.

**Learning**: Use Pino structured logger:
- JSON output for machine parsing
- Automatic request ID correlation
- Child loggers for component-specific context
- Log levels: trace, debug, info, warn, error, fatal

**Why It Matters**: Enables efficient log analysis, supports monitoring tools, provides audit trail.

**Applied In**: `app/lib/logger.ts`, used throughout API routes and server components.

---

### Manual QA Over Automated Tests

**Context**: MVP Factory model prioritizes speed over test coverage.

**Learning**: For MVP projects:
- Skip unit/integration tests (prohibited by AI rule ksglxIDdoNUOAOmXqrhl9h)
- Focus on manual QA checklists
- Build frequently to catch compilation errors
- Use TypeScript strict mode as first line of defense

**Why It Matters**: Faster iteration, acceptable for MVP with manual oversight.

**Applied In**: Phase 10.3, no test files generated.

---

## 🌐 Deployment

### Vercel Edge Functions: Limitations

**Context**: Not all code can run on Vercel Edge Runtime.

**Learning**: MongoDB connections require Node.js runtime, not Edge:
- Use `export const runtime = 'nodejs'` in API routes that use Mongoose
- Use Edge runtime only for lightweight, stateless APIs (e.g., health check)

**Why It Matters**: Prevents deployment failures, ensures database connectivity.

**Applied In**: All API routes with MongoDB queries, Phase 10.8.

---

## 💡 Product & UX

### Gamification Thresholds

**Context**: Need to balance engagement without overwhelming users.

**Learning**: Established conservative thresholds:
- **Progressive Disclosure**: 3 games before showing premium
- **Achievement Difficulty**: Varied (5%, 20%, 50%, 80% attainment rates)
- **Daily Challenge**: 1 per day maximum (prevents fatigue)
- **Leaderboard Reset**: Weekly for engagement, all-time for prestige

**Why It Matters**: Keeps players motivated without burnout.

**Applied In**: Phase 3, Achievement design, daily challenge system.

---

## 📦 Dependencies

### Version Locking Strategy

**Context**: Dependency updates can break builds unexpectedly.

**Learning**: Lock all versions in package.json (no `^` or `~`):
- Enables predictable builds
- Prevents surprise breakages
- Manual updates only after testing

**Why It Matters**: Stability over freshness for production systems.

**Applied In**: `package.json`, all 589 dependencies locked.

---

## 🔄 Process Improvements

### Automated Version Bumping

**Context**: Manual version updates across multiple files error-prone.

**Learning**: Create `scripts/bump-version.mjs` that:
- Updates `package.json`
- Updates all documentation files
- Commits with semantic message
- Tags git commit

**Why It Matters**: Reduces human error, enforces version protocol.

**Applied In**: Phase 0 (versioning scripts), to be implemented before Phase 2.

---

## ⚠️ What to Avoid

### ❌ Breadcrumb Navigation

**Reason**: Adds visual clutter, often redundant with clear top-level nav.  
**Policy**: Explicitly prohibited by AI Rule QsC5EWsJVUi9ENlUdDdT0E.  
**Alternative**: Use clear titles, back buttons, and intuitive navigation structure.

---

### ❌ Hardcoding Configuration

**Reason**: Reduces reusability, makes changes require code deploys.  
**Policy**: All brand/game configuration in MongoDB, not in code.  
**Alternative**: Use `Brand` and `GameBrandConfig` models for runtime configuration.

---

### ❌ Uncategorized Markdown URLs

**Reason**: Warp terminal interprets `**` at end of URL as markdown formatting.  
**Policy**: Always add space after URLs or use plain text format.  
**Example**: Use `http://localhost:3000` not `http://localhost:3000**`  
**Rule**: AI Rule ivx8eJFEka2RwjImIV9xcW

---

### ❌ Timestamp Format Inconsistency

**Reason**: Makes sorting, parsing, and comparisons difficult.  
**Policy**: ISO 8601 with milliseconds UTC only: `YYYY-MM-DDTHH:MM:SS.sssZ`  
**Applied**: Everywhere - logs, docs, database, UI.  
**Rule**: AI Rule GgQpzJaJFBHgeBzRXQr8GG

---

**Maintained By**: Narimato  
**Review Cycle**: Updated with every significant insight or issue resolution
