# Amanoba Learnings

**Version**: 2.7.0  
**Last Updated**: 2025-01-20T12:00:00.000Z

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

### Leaderboard Entries: Always Include Foreign Keys

**Context**: Leaderboards showed empty even after playing games and earning points.

**Root Cause**: Missing `gameId` field in leaderboard entries:
- Leaderboard calculator created entries with `playerId`, `metric`, `period` but **not** `gameId`
- Leaderboard API queried: `{ gameId, period, metric }` expecting entries to have `gameId`
- Result: Query returned 0 results because entries had `null` gameId

**Problem Code**:
```typescript
// ❌ Wrong: Missing gameId in filter and upsert
const bulkOps = rankings.map((entry, index) => ({
  updateOne: {
    filter: {
      playerId: entry.playerId,
      metric: type,
      period,
      // gameId missing!
    },
    update: { $set: { value: entry.value, rank: index + 1 } },
    upsert: true,
  },
}));
```

**Solution**:
```typescript
// ✅ Correct: Include gameId in both filter and $setOnInsert
const bulkOps = rankings.map((entry, index) => ({
  updateOne: {
    filter: {
      playerId: entry.playerId,
      metric: type,
      period,
      ...(gameId && { gameId }), // NEW
    },
    update: {
      $set: {
        value: entry.value,
        rank: index + 1,
        'metadata.lastCalculated': new Date(),
      },
      $setOnInsert: {
        playerId: entry.playerId,
        ...(gameId && { gameId }), // NEW
        metric: type,
        period,
        'metadata.createdAt': new Date(),
      },
    },
    upsert: true,
  },
}));
```

**Learning**: When creating leaderboard or ranking systems:
1. **Always include all foreign keys** (gameId, brandId, etc.) in both filter and insert
2. Use `$setOnInsert` for immutable fields that should only be set on creation
3. Test queries match the exact filter structure used in upserts
4. Verify data exists with proper fields before assuming API logic is broken

**Why It Matters**: Missing foreign keys cause silent failures - queries return empty arrays with no errors, making users think the feature doesn't work.

**Applied In**: 
- `app/lib/gamification/leaderboard-calculator.ts` (lines 49-143)
- `app/lib/gamification/session-manager.ts` (lines 583-599)

---

### Anonymous Login: Seed Data Dependencies

**Context**: Users couldn't log in anonymously despite "Continue Without Registration" button being visible.

**Root Cause**: `GuestUsername` collection was empty:
- Anonymous login calls `getRandomGuestUsername()` which queries `GuestUsername` collection
- When count is 0, function throws error: "No guest usernames available"
- Error was caught but not displayed to user - login silently failed
- No player was created, no session started, no games could be played

**Solution**:
```bash
npm run seed:guest-usernames
```

This populates 104 random 3-word usernames like "London Snake Africa".

**Learning**: For features that depend on seed data:
1. **Check seed data exists** before enabling feature in production
2. **Document seed requirements** in deployment checklist
3. **Show helpful error messages** when seed data is missing (don't fail silently)
4. **Create diagnostic scripts** to verify all required collections have data
5. Consider **auto-seeding** critical data on first deployment

**Prevention**:
- Created diagnostic scripts: `check-guest-usernames.ts`, `check-brand.ts`, `check-player-data.ts`
- These scripts can be run to verify database state before deployment

**Why It Matters**: Missing seed data breaks core user flows with no visible errors, making it impossible to debug without direct database access.

**Applied In**: 
- Anonymous login flow (`app/api/auth/anonymous/route.ts`)
- Guest username utility (`app/lib/utils/anonymous-auth.ts`)
- Seed script (`scripts/seed-guest-usernames.ts`)

---

### Daily Challenge Progress: UTC Timezone Consistency

**Context**: Challenge progress wasn't updating after games were completed, showing 0/2 despite games played.

**Root Cause**: Timezone mismatch between challenge creation and progress tracking:
- Challenge API (`/api/challenges`) correctly uses UTC for date ranges
- Daily challenge tracker used **local timezone** (e.g. `new Date(now.getFullYear(), now.getMonth(), now.getDate())`)
- Result: Challenges created with UTC dates weren't matched by local date queries

**Problem Code**:
```typescript
// ❌ Wrong: Uses local timezone
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const endOfDay = new Date(startOfDay);
endOfDay.setDate(endOfDay.getDate() + 1);
```

**Solution**:
```typescript
// ✅ Correct: Uses UTC to match challenge creation
const startOfDay = new Date();
startOfDay.setUTCHours(0, 0, 0, 0);
const endOfDay = new Date(startOfDay);
endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
```

**Learning**: When working with date-based queries across multiple modules:
1. **Choose one timezone** for all date logic (preferably UTC)
2. Document the timezone choice in comments
3. Use `.setUTCHours()` not `.setHours()` for UTC consistency
4. Test with users in different timezones
5. Add logging with `.toISOString()` to verify actual UTC values being compared

**Why It Matters**: Date mismatches silently fail - queries return empty results with no errors, making debugging difficult.

**Applied In**: `app/lib/gamification/daily-challenge-tracker.ts` (lines 71-75), enhanced logging throughout challenge tracking.

---

### Game Completion Flow: Silent Schema Validation Failures

**Context**: All five games (QUIZZZ, SUDOKU, MEMORY, WHACKPOP, MADOKU) were completing but NOT recording statistics, XP, points, daily challenges, or leaderboard rankings. Players reported "playing but nothing updates."

**Timestamp**: 2025-10-18T08:30:00.000Z  
**Severity**: CRITICAL - Complete gamification system failure  
**Fixed In**: v2.2.0

**Root Causes Identified**:

#### 1. EventLog Missing Required `metadata.version` Field

**Problem**: 5 EventLog.create() calls in session-manager.ts were missing the **required** `metadata.version` field:
- Game completion event (line 648)
- Points earned event (line 672)
- Level up event (line 692)
- Achievement unlock event (line 712)
- Streak milestone event (line 732)
- Challenge completion event in daily-challenge-tracker.ts (line 349)

**Result**: MongoDB validation silently failed, EventLog records were never created, but transaction continued as if successful. No analytics, no audit trail.

**Problem Code**:
```typescript
// ❌ Wrong: Missing required metadata.version
await EventLog.create({
  playerId: session.playerId,
  brandId: session.brandId,
  eventType: 'game_played',
  eventData: { /* ... */ },
  timestamp: new Date(),
  metadata: {
    isPremium: player.isPremium, // metadata object exists BUT missing version!
    brandId: session.brandId.toString(),
    pointsEarned: pointsResult.totalPoints,
  },
});
```

**Solution**:
```typescript
// ✅ Correct: Include required metadata.version and createdAt
await EventLog.create({
  playerId: session.playerId,
  brandId: session.brandId,
  eventType: 'game_played',
  eventData: { /* ... */ },
  timestamp: new Date(),
  metadata: {
    createdAt: new Date(), // Required
    version: '2.2.0',      // Required
    isPremium: player.isPremium,
    brandId: session.brandId.toString(),
    pointsEarned: pointsResult.totalPoints,
  },
});
```

#### 2. LeaderboardEntry Metric Enum Mismatch

**Problem**: LeaderboardEntry schema enum values did NOT match the metric types used by leaderboard-calculator.ts:

**Schema allowed**:
```typescript
enum: ['score', 'wins', 'points', 'xp', 'streak', 'accuracy']
```

**Code actually used**:
```typescript
'points_balance', 'points_lifetime', 'xp_total', 'level', 'win_streak',
'daily_streak', 'games_won', 'win_rate', 'elo'
```

**Result**: Every leaderboard update silently failed validation. LeaderboardEntry.bulkWrite() succeeded with 0 records written. Leaderboards stayed empty despite games being played.

**Solution**: Updated LeaderboardEntry schema to include ALL actual metric types:
```typescript
metric: {
  type: String,
  enum: {
    values: [
      'score', 'wins', 'points', 'xp', 'streak', 'accuracy', // Legacy
      'points_balance', 'points_lifetime', 'xp_total', 'level', // Current wallet/progression
      'win_streak', 'daily_streak', 'games_won', 'win_rate', 'elo' // Competitive
    ],
  },
},
```

#### 3. EventLog Missing Event Types

**Problem**: EventLog schema enum was missing 'streak_milestone' and 'challenge_completed' event types that were being used in code.

**Solution**: Expanded EventLog.eventType enum to include both missing types.

---

**Key Learnings**:

1. **Schema-Code Alignment is Critical**:
   - When schema enums are defined, code MUST use exactly matching values
   - Schema validation failures are often **silent** - operations succeed but write 0 records
   - Always validate enum additions in both schema AND implementation files

2. **Required Fields Must Always Be Present**:
   - Mongoose schema with `required: [true, 'message']` will fail silently in some contexts
   - Always include ALL required fields, even in nested objects like `metadata`
   - Version tracking should use a constant imported from package.json, not hardcoded strings

3. **Transaction Boundaries Don't Catch Validation Errors**:
   - MongoDB transactions commit successfully even if some operations fail validation
   - Use comprehensive logging AFTER transactions to verify records were created
   - Add debug endpoints to verify expected records exist after operations

4. **Testing Must Include Database Verification**:
   - Don't trust API 200 responses - verify MongoDB records were actually created
   - Check EventLog, LeaderboardEntry, PointsTransaction, PlayerProgression after every game
   - Use MongoDB Compass or database scripts to inspect actual data

5. **Progressive Failure Detection**:
   - Users first notice: "points aren't updating"
   - Then: "leaderboards are empty"
   - Then: "challenges don't progress"
   - **All symptoms trace to same root cause**: schema validation failures

**Prevention Checklist** (to avoid similar issues):

- [ ] When adding new enum values to schemas, grep entire codebase for usages
- [ ] When creating model instances, use TypeScript interfaces to enforce field presence
- [ ] Add post-transaction verification queries in critical flows
- [ ] Enable MongoDB query logging in development to see actual write results
- [ ] Create diagnostic endpoints that verify data integrity: `/api/debug/verify-game-completion`
- [ ] Add comprehensive test coverage including database state verification
- [ ] Use schema validation error handlers to log failures prominently

**Files Modified**:
- `app/lib/models/leaderboard-entry.ts` (expanded metric enum)
- `app/lib/models/event-log.ts` (expanded eventType enum)
- `app/lib/gamification/session-manager.ts` (added metadata.version to 5 EventLog.create calls)
- `app/lib/gamification/daily-challenge-tracker.ts` (added metadata.version to 1 EventLog.create call)

**Verification Steps** (manual testing checklist):
1. Play QUIZZZ - verify PlayerSession created, points/XP awarded, stats updated
2. Play SUDOKU - verify same
3. Play MEMORY - verify same
4. Play WHACKPOP - verify same
5. Play MADOKU - verify same + ELO rating updated
6. Complete daily challenge - verify progress increments and rewards awarded
7. Check leaderboards - verify entries exist and rankings are accurate
8. Query EventLog - verify all game events are logged with version='2.2.0'
9. Query PointsTransaction - verify audit trail exists for all earnings
10. Check PlayerProgression - verify XP, level, totalGamesPlayed, wins/losses increment

**Impact**: This fix restores the entire gamification loop. Before fix: games playable but meaningless (no progression). After fix: complete engagement loop with points, XP, challenges, leaderboards, achievements.

---

### Question Repetition: Aggressive Cache Busting Required

**Context**: QUIZZZ game showing same 10 questions repeatedly despite 200 questions in database.

**Root Cause**: Browser and Next.js were caching API responses:
- Frontend fetch had no `cache: 'no-store'` directive
- No timestamp parameter to bust URL-based caching
- API responses had no `Cache-Control` headers
- Next.js default behavior caches fetch responses

**Problem Code**:
```typescript
// ❌ Wrong: Gets cached by browser and Next.js
const response = await fetch(
  `/api/games/quizzz/questions?difficulty=${diff}&count=${count}`
);
```

**Solution**:
```typescript
// ✅ Correct: Triple cache-busting strategy
// 1. Timestamp in URL (browser cache)
const response = await fetch(
  `/api/games/quizzz/questions?difficulty=${diff}&count=${count}&t=${Date.now()}`,
  {
    cache: 'no-store', // 2. Next.js cache directive
  }
);

// 3. Server-side headers in API response
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
  },
});
```

**Learning**: For dynamic game content that must be fresh every time:
1. **URL-based cache busting**: Add `&t=${Date.now()}` to query string
2. **Next.js cache control**: Set `cache: 'no-store'` in fetch options
3. **HTTP cache headers**: Set aggressive `Cache-Control` in API responses
4. **All three are needed** - relying on just one isn't enough

**Why It Matters**: 
- Cached responses completely break content rotation logic
- `showCount` increments in DB but user never sees new questions
- No error messages - silently returns stale data
- Affects user experience dramatically (same questions every game)

**Applied In**: 
- `app/games/quizzz/page.tsx` (lines 120-124, 142-146)
- `app/api/games/quizzz/questions/route.ts` (lines 209-213)
- `app/api/games/quizzz/questions/answers/route.ts` (lines 78-82)

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

### Pino Logger Worker Threads in Next.js

**Context**: Pino logger with `pino-pretty` transport was causing "worker thread exited" errors in Next.js development server.

**Problem**: Pino's pretty printing uses worker threads by default, which conflicts with Next.js hot reload and Edge runtime environments, causing:
- "Error: Cannot find module .../worker.js"
- "Error: the worker thread exited"
- 500 errors in API routes during development

**Learning**: For Next.js applications, avoid Pino's transport system entirely:
- Created custom logger wrapper with same interface as Pino
- Uses simple console methods with structured formatting
- Maintains JSON output in production, pretty printing in development
- No worker threads, no async logging complexity
- Supports child loggers for context

```typescript
// Simple logger implementation
const logger = {
  info: (msg: string) => console.log(`[${timestamp}] INFO: ${msg}`),
  error: (msg: string) => console.error(`[${timestamp}] ERROR: ${msg}`),
  child: (context) => createSimpleLogger(context),
};
```

**Why It Matters**: Prevents runtime crashes, enables reliable logging in all Next.js runtime environments (Node.js, Edge, development).

**Applied In**: `app/lib/logger.ts` - Complete rewrite to avoid worker threads while maintaining API compatibility.

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

### PlayerProgression Schema: Keep Initialization Code Synchronized

**Context**: Facebook OAuth and anonymous login both create PlayerProgression records for new players.

**Problem**: After updating PlayerProgression schema with additional required fields, the initialization code in `auth.ts` (Facebook OAuth) became outdated, causing "Server Configuration Error" on login:
- Missing `currentXP`, `totalXP` fields
- Old field names (`gamesPlayed` instead of `statistics.totalGamesPlayed`)
- Missing nested structures (`achievements`, `milestones`, `gameSpecificStats`)
- Wrong Streak type values (`'win'` instead of `'WIN_STREAK'`)

**Learning**: When updating Mongoose models with new required fields:
1. Search codebase for all places that create documents of that model
2. Update ALL creation points simultaneously
3. Common places to check:
   - Auth callbacks (`auth.ts` signIn callback)
   - Anonymous login utilities (`anonymous-auth.ts`)
   - Seed scripts
   - API route handlers
4. Use TypeScript interfaces to catch mismatches early
5. Test both auth flows after schema changes

**Why It Matters**: Prevents production login failures, ensures data consistency, catches issues before deployment.

**Applied In**: `auth.ts` (Facebook OAuth signIn callback), `app/lib/utils/anonymous-auth.ts` (guest login).

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

### Game Content Database Migration: Intelligent Selection Algorithm

**Context**: Migrating hardcoded QUIZZZ questions and WHACKPOP emojis to MongoDB to enable dynamic content management and usage tracking.

**Problem Solved**: 
1. **Content Fatigue**: Players seeing same questions repeatedly
2. **No Analytics**: Unable to track which questions are easy/hard
3. **No Scalability**: Can't add content without deploying code
4. **No Adaptive Difficulty**: Same questions for all skill levels

**Learning**: Implemented 3-tier intelligent selection algorithm:
```typescript
// Priority 1: Least shown questions (ensure variety)
showCount ASC
// Priority 2: Harder questions (lower success rate)
correctCount ASC
// Priority 3: Alphabetical (deterministic tiebreaker)
question ASC
```

**Key Decisions**:

1. **Separate Answers API**:
   - Questions API excludes `correctIndex` for security
   - Separate `/answers` endpoint provides correct indexes
   - **Trade-off**: Extra API call vs. preventing client-side cheating
   - **MVP Decision**: Acceptable for current scope, can encrypt later

2. **SessionStorage Caching**:
   - Questions: 5 minute TTL (balance freshness vs. API load)
   - Emojis: 1 hour TTL (rarely change, reduce unnecessary calls)
   - **Why**: Reduce MongoDB queries while maintaining reasonable freshness

3. **Atomic Updates**:
   - `showCount` incremented atomically during question fetch
   - `correctCount` updated via `bulkWrite` after game completion
   - **Why**: Prevents race conditions from concurrent games

4. **Compound Index Design**:
   ```typescript
   { difficulty: 1, isActive: 1, showCount: 1, correctCount: 1, question: 1 }
   ```
   - **Why**: Supports entire query + sort in single index scan
   - **Result**: O(log n) query time regardless of question pool size

**Challenges Faced**:

1. **TypeScript Interface Mismatch**:
   - **Problem**: `Question` interface (no correctIndex) vs. `QuestionWithAnswer` (with correctIndex)
   - **Solution**: Created separate interfaces, fetched answers separately
   - **Lesson**: Design API responses first, then derive TypeScript types

2. **Hardcoded Array Removal**:
   - **Problem**: Stray question literals remaining after comment-only replacement
   - **Solution**: Complete removal of array declarations, not just commenting
   - **Lesson**: Use search tools to verify no hardcoded content remains

3. **Logger Format Errors**:
   - **Problem**: Pino format changed: `logger.error('msg', error)` ❌
   - **Solution**: Correct format: `logger.error({ error }, 'msg')` ✅
   - **Lesson**: Always check library docs for proper usage patterns

**Performance Insights**:
- **Before**: ~40 questions, all loaded on component mount (~2KB)
- **After**: 120 questions, only 10-15 loaded per game (~1.5KB per fetch)
- **Caching**: 5-minute cache reduces API calls by ~80% during active play
- **Database**: Compound index makes query time consistent at ~10-15ms

**Future-Proofing Enabled**:
- ✅ Admin UI for question management (no code deploy needed)
- ✅ A/B testing different question sets
- ✅ User-submitted questions with moderation workflow
- ✅ Multi-language support (add `language` field)
- ✅ Seasonal/event-based questions (add `availableFrom/Until` fields)
- ✅ Difficulty auto-adjustment based on player performance

**Why It Matters**: This migration transforms static content into a dynamic, data-driven system that enables continuous content improvement without code changes.

**Applied In**: v2.1.0 - QuizQuestion model, WhackPopEmoji model, 4 API endpoints, 2 game components, 2 seed scripts.

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

### Stats Recording System: Critical Architecture Failure

**Context**: After fixing schema validation issues (v2.2.0), games recorded to `PlayerSession` but stats still not appearing in leaderboards, challenges, or achievements.

**Timestamp**: 2025-10-19T10:16:00.000Z  
**Severity**: CRITICAL - Complete gamification feedback loop broken  
**Status**: Root cause identified, refactor plan created

#### Root Cause Analysis

**Problem**: Games ARE recording to database, but gamification systems (leaderboards, achievements, challenges) are NOT using that data.

**Symptoms Reported**:
1. Games complete successfully with 200 OK response
2. `PlayerSession` documents created with correct data
3. `PlayerProgression.statistics` updated (games played, wins, losses)
4. `PointsWallet` balance increased correctly
5. `PointsTransaction` audit trail exists
6. **BUT**: Leaderboards show empty, challenges show 0 progress, achievements never unlock

#### Specific Issues Identified

##### 1. Leaderboard Fire-and-Forget Pattern

**Location**: `app/lib/gamification/session-manager.ts` (lines 577-645)

**Problem**: Leaderboard updates wrapped in Promise.all().catch() that silently swallows failures:

```typescript
// ❌ WRONG: Fire-and-forget with silent failure
Promise.all([
  calculateLeaderboard({ type: 'points_balance', period: 'all_time', gameId, limit: 100 })
    .catch(err => logger.error({ err }, 'Failed to update leaderboard')),
  calculateLeaderboard({ type: 'xp_total', period: 'all_time', gameId, limit: 100 })
    .catch(err => logger.error({ err }, 'Failed to update leaderboard')),
  // ... 5 more leaderboards
]).catch(err => {
  logger.error({ err }, 'Error updating leaderboards');
});
```

**Why It Fails**:
- `.catch()` prevents errors from propagating
- Session completion returns success to client even if ALL leaderboards fail
- No retry mechanism - failed updates lost forever
- Logs show errors but user sees "success" with no leaderboard update

**Impact**: Leaderboards never update, players don't see competitive rankings

##### 2. Achievement System Missing Prerequisites

**Location**: `app/lib/gamification/achievement-engine.ts` (lines 58-134)

**Problem**: Achievement unlock logic assumes achievements exist in database:

```typescript
const achievements = await Achievement.find({ 'metadata.isActive': true }).lean();
// If collection is empty, achievements.length === 0
// checkAndUnlockAchievements() returns empty array
// Session completes "successfully" with 0 achievements
```

**Why It Fails**:
- No seed data for `Achievement` collection
- No default achievements created on initialization
- Empty collection = no achievements to check = appears to work but does nothing

**Impact**: Players never unlock achievements regardless of progress

##### 3. Daily Challenges May Not Exist

**Location**: `app/lib/gamification/daily-challenge-tracker.ts` (lines 79-114)

**Problem**: Challenges created on-demand during first access of the day:

```typescript
let activeChallenges = await DailyChallenge.find({
  'availability.startTime': { $lte: now },
  'availability.endTime': { $gte: now },
  'availability.isActive': true,
});

if (activeChallenges.length === 0) {
  // Only creates challenges if missing
  const ensured = await ensureDailyChallengesForToday();
  activeChallenges = ensured.challenges;
}
```

**Why It Fails**:
- If `ensureDailyChallengesForToday()` fails (DB timeout, transaction conflict), no challenges exist
- Challenge progress update silently skips with return []
- Session completion succeeds but challenges don't update
- Race condition: Multiple concurrent sessions may all try to create challenges

**Impact**: Daily challenges show 0 progress despite games played

##### 4. MongoDB Transaction All-or-Nothing Rollback

**Location**: `app/lib/gamification/session-manager.ts` (lines 219-903)

**Problem**: Entire session completion wrapped in single MongoDB transaction:

```typescript
const sessionDb = await mongoose.startSession();
sessionDb.startTransaction();

try {
  // CRITICAL: Save PlayerSession, points, progression ✓
  // OPTIONAL: Check achievements (may fail) ❌
  // OPTIONAL: Update challenges (may fail) ❌
  // OPTIONAL: Update leaderboards (async, may fail) ❌
  
  await sessionDb.commitTransaction(); // If ANY fails, ROLLBACK ALL
} catch (error) {
  await sessionDb.abortTransaction(); // Loses ALL data including critical session
  throw error;
}
```

**Why It Fails**:
- Achievement check fails → entire transaction rolls back → PlayerSession NOT saved
- Challenge update fails → entire transaction rolls back → Points NOT awarded
- One optional feature failure destroys all game results
- Client shows "success" but database has NOTHING

**Impact**: Games appear to complete but NO DATA persisted anywhere

##### 5. No Background Job Queue

**Problem**: All gamification updates attempted synchronously during session completion.

**Why It Fails**:
- Network latency to MongoDB (100-200ms per operation)
- Achievement checks query entire Achievement collection
- Leaderboard calculations aggregate over all PlayerProgression documents
- Challenge updates query and update multiple collections
- **Total time**: 500-1000ms blocking the API response
- If any operation times out (>30s), entire request fails

**Impact**: Slow API responses, high failure rate, no retry mechanism

##### 6. Silent Failures with Success Response

**Location**: `app/api/game-sessions/complete/route.ts` (lines 145-180)

**Problem**: API returns 200 OK even if gamification systems fail:

```typescript
const result = await completeGameSession({ sessionId, score, isWin });

// Result includes fields that may be empty due to failures
return NextResponse.json({
  success: true, // ❌ ALWAYS returns success
  rewards: result.rewards, // May be 0 if transaction rolled back
  achievements: result.achievements, // May be empty if no achievements exist
  streak: result.streak, // May be 0 if streak update failed
}, { status: 200 });
```

**Why It Fails**:
- Client believes game completed successfully
- Frontend shows rewards screen with 0 points, 0 XP
- User thinks system is broken, not that it failed silently
- No way for client to detect and retry

**Impact**: Poor UX, players lose trust in system reliability

#### Architecture Flaws Summary

| Component | Current Behavior | Failure Mode | Impact |
|-----------|-----------------|--------------|--------|
| **PlayerSession** | Saved in transaction | Transaction rollback if any optional update fails | All game data lost |
| **Leaderboards** | Async fire-and-forget | Errors caught and logged, no retry | Never updates |
| **Achievements** | Checked during transaction | Empty collection = no unlocks | Never unlocks |
| **Challenges** | Updated during transaction | Missing challenges = skip update | Progress not tracked |
| **API Response** | Always returns 200 OK | Client can't detect failures | Silent failures |

#### Why This Design Pattern Fails

**Critical Data + Optional Updates in Same Transaction = Fragile System**

1. **Tight Coupling**: PlayerSession (critical) coupled to achievements (optional)
2. **No Separation of Concerns**: Core game data treated same as leaderboard rankings
3. **No Fault Tolerance**: One failure cascades to complete data loss
4. **No Retry Logic**: Transient failures (network, timeout) are permanent
5. **No Observability**: Clients see "success" but can't verify data persisted

#### Correct Architecture Pattern: Two-Phase Commit

**Phase 1 - CRITICAL (Must Succeed)**:
```typescript
// Start MongoDB transaction
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Only critical, non-optional operations
  await PlayerSession.create(sessionData, { session });
  await PlayerProgression.updateOne(query, update, { session });
  await PointsWallet.updateOne(query, update, { session });
  await PointsTransaction.create(transactionData, { session });
  await Streak.updateOne(query, update, { session });
  await EventLog.create(eventData, { session });
  
  await session.commitTransaction(); // ONLY commit critical data
  
  return { success: true, sessionId, points, xp }; // Return immediately
} catch (error) {
  await session.abortTransaction();
  throw error; // Fail fast, client knows to retry
}
```

**Phase 2 - BEST EFFORT (Async, with Retry)**:
```typescript
// After Phase 1 succeeds, queue optional updates
const jobs = [
  { type: 'achievement', playerId, sessionId, payload: { progression } },
  { type: 'leaderboard', playerId, sessionId, payload: { gameId, score } },
  { type: 'challenge', playerId, sessionId, payload: { outcome, points } },
];

for (const job of jobs) {
  await JobQueue.create({
    ...job,
    status: 'pending',
    attempts: 0,
    maxAttempts: 5,
    nextRetryAt: new Date(),
  });
}

// Background worker processes jobs with exponential backoff
// Failed jobs retry: 1min → 5min → 15min → 1hr → 24hr
```

**Benefits**:
1. **Critical data always persists** - Game results never lost
2. **Optional updates retry automatically** - Transient failures recovered
3. **Fast API response** - Client not blocked by slow aggregations
4. **Better error handling** - Phase 1 failure = clear error, Phase 2 failure = retry
5. **Observable** - Job queue status visible to admins

#### Files Requiring Refactor

**Critical Priority**:
1. `app/lib/gamification/session-manager.ts` - Split into two phases
2. `app/lib/queue/job-queue.ts` - Create job queue system (NEW)
3. `app/lib/queue/workers/` - Create worker processors (NEW)
4. `app/api/game-sessions/complete/route.ts` - Update response handling
5. `scripts/repair-stats.ts` - Create repair script for existing data (NEW)

**High Priority**:
6. `app/lib/gamification/leaderboard-calculator.ts` - Remove fire-and-forget, use queue
7. `app/lib/gamification/daily-challenge-tracker.ts` - Make async with queue
8. `app/lib/gamification/achievement-engine.ts` - Make async with queue
9. `scripts/seed-achievements.ts` - Create default achievements
10. `app/lib/startup/initialization.ts` - Pre-create challenges (NEW)

**Supporting**:
11. `app/api/admin/stats/verify/route.ts` - Health check endpoint (NEW)
12. `app/api/admin/stats/repair/route.ts` - Manual repair trigger (NEW)
13. `app/lib/models/job-queue.ts` - Job queue model (NEW)
14. `app/lib/models/player-session.ts` - Add tracking fields
15. `app/lib/models/leaderboard-entry.ts` - Add staleness fields

#### Data Repair Strategy

**Problem**: Existing games played but not reflected in leaderboards/challenges/achievements.

**Solution**: Rebuild from source of truth (PlayerSession):

```typescript
// For each player
const sessions = await PlayerSession.find({ playerId, status: 'completed' });

// Aggregate totals
const stats = {
  gamesPlayed: sessions.length,
  wins: sessions.filter(s => s.gameData.outcome === 'win').length,
  totalPoints: sessions.reduce((sum, s) => sum + s.rewards.pointsEarned, 0),
  totalXP: sessions.reduce((sum, s) => sum + s.rewards.xpEarned, 0),
};

// Update PlayerProgression
await PlayerProgression.updateOne({ playerId }, { $set: { statistics: stats } });

// Recalculate leaderboards
await calculateLeaderboard({ type: 'points_balance', period: 'all_time' });

// Backfill challenge progress
for (const challenge of todaysChallenges) {
  const relevantSessions = filterSessionsForChallenge(sessions, challenge);
  await updateChallengeProgress(playerId, challenge, relevantSessions);
}
```

**CLI Script**: `npm run repair:stats -- --players all`

#### Prevention Checklist

**To prevent similar architecture issues**:

- [ ] **Separate critical from optional** - Core data persistence isolated from gamification
- [ ] **Use background jobs** for non-blocking operations
- [ ] **Implement retry logic** - Exponential backoff for transient failures
- [ ] **Create health checks** - Verify system integrity regularly
- [ ] **Add repair scripts** - Rebuild stats from source of truth
- [ ] **Seed required data** - Achievements, challenges created on init
- [ ] **Monitor job queue** - Alert on high failure rate
- [ ] **Log comprehensively** - Make failures visible, not silent
- [ ] **Test failure scenarios** - Simulate DB timeouts, network issues
- [ ] **Verify in database** - Don't trust API 200 responses

#### Implementation Plan

**14-phase refactor plan created** in TODO list with:
- Root cause analysis documentation ✓ (this entry)
- Health check endpoint creation
- Two-phase commit refactor
- Background job queue system
- Stats repair script
- Leaderboard reliability fixes
- Challenge guarantee system
- Achievement seeding
- Comprehensive logging
- Model field additions for sync tracking
- API error handling improvements
- Testing & verification
- Documentation updates
- Commit & deploy

**Estimated Timeline**: 2-3 days full refactor + testing

**Risk**: High - Core gamification system overhaul  
**Priority**: CRITICAL - Must fix before user adoption  
**Version**: Will increment to 3.0.0 (breaking change in architecture)

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

## 🌐 Internationalization (i18n)

### next-intl Locale Configuration: getRequestConfig Parameter Handling

**Context**: Production error "Application error: a server-side exception has occurred" with digest 1377699040. The error was "No locale was returned from `getRequestConfig`".

**Timestamp**: 2025-01-17T17:15:00.000Z  
**Severity**: CRITICAL - Complete application failure in production  
**Fixed In**: v2.7.0

**Root Cause**: The `getRequestConfig` function in `i18n.ts` was not handling the locale parameter correctly. When `locale` was undefined or not properly extracted from the URL, the function would fail silently or throw an error, causing the entire application to crash.

**Problem Code**:
```typescript
// ❌ Wrong: No fallback if locale is missing
export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

**Issues Identified**:
1. **No locale fallback**: If `locale` is undefined, the function would fail
2. **Silent failures**: `notFound()` was called but error wasn't properly handled
3. **Missing locale in response**: next-intl requires locale to be returned explicitly
4. **Middleware routing confusion**: With `localePrefix: 'always'`, locale extraction needed verification

**Solution**:
```typescript
// ✅ Correct: Safe fallback with explicit locale return
export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is always defined - fallback to defaultLocale if missing
  const resolvedLocale = (locale && locales.includes(locale as Locale)) 
    ? locale 
    : defaultLocale;

  // Validate that the locale is valid
  if (!resolvedLocale || !locales.includes(resolvedLocale as Locale)) {
    // This should never happen, but provide a safe fallback
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default,
    };
  }

  return {
    locale: resolvedLocale,  // NEW: Explicitly return locale
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  };
});
```

**Additional Fixes**:
1. **Layout component**: Pass locale explicitly to `getMessages({ locale })` to ensure it's available
2. **Middleware configuration**: Changed `localePrefix` from `'as-needed'` to `'always'` for consistent routing
3. **Root route handling**: Removed conflicting `app/page.tsx` to prevent redirect loops
4. **Static file exclusion**: Added explicit exclusion in middleware for `manifest.json` and other static assets

**Learning**: When using next-intl with Next.js 15 App Router:
1. **Always provide locale fallback**: Never assume locale will be present
2. **Explicitly return locale**: next-intl requires locale in the response object
3. **Validate before use**: Check locale validity before importing messages
4. **Test with undefined locale**: Ensure graceful handling when locale extraction fails
5. **Use consistent localePrefix**: `'always'` is more predictable than `'as-needed'` for production
6. **Pass locale explicitly**: When calling `getMessages()`, pass locale explicitly: `getMessages({ locale })`

**Why It Matters**: Locale configuration errors cause complete application failure in production. Without proper fallbacks, a single routing issue can crash the entire site.

**Applied In**:
- `i18n.ts` (getRequestConfig function)
- `app/[locale]/layout.tsx` (getMessages call)
- `middleware.ts` (localePrefix configuration)
- `app/[locale]/page.tsx` (root route redirect)

**Prevention Checklist**:
- [ ] Always provide defaultLocale fallback in getRequestConfig
- [ ] Explicitly return locale in getRequestConfig response
- [ ] Test with undefined/missing locale scenarios
- [ ] Use consistent localePrefix strategy (prefer 'always')
- [ ] Pass locale explicitly to getMessages() in layouts
- [ ] Verify middleware routing doesn't conflict with locale extraction
- [ ] Test production builds, not just dev server

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

### Background Job Queue for Reliability

**Context**: Leaderboard updates and achievement checks were failing silently with fire-and-forget async calls.

**Timestamp**: 2025-10-18T12:00:00.000Z  
**Fixed In**: Phase 6, v2.7.0

**Problem**: Fire-and-forget pattern with `.catch()` that only logs errors:
```typescript
// ❌ Wrong: Silent failure, no retry
calculateLeaderboard({ type: 'points', period: 'all_time' })
  .catch(err => logger.warn({ err }, 'Leaderboard update failed'));
```

This approach caused:
- Leaderboard rankings becoming stale
- No notification when updates fail
- No automatic retry mechanism
- Lost data integrity between game sessions and leaderboards

**Solution**: Implemented MongoDB-backed job queue system:

1. **Job Queue Model** (`app/lib/models/job-queue.ts`):
   - Stores queued, processing, completed, and failed jobs
   - Supports exponential backoff retry (max 5 attempts)
   - TTL indexes for automatic cleanup (7 days completed, 30 days failed)
   - Dead letter queue for permanently failed jobs

2. **Leaderboard Worker** (`app/lib/queue/workers/leaderboard-worker.ts`):
   - Processes leaderboard calculation jobs asynchronously
   - Automatic retry with exponential backoff
   - Configurable concurrency and poll interval
   - Detailed structured logging for observability

3. **Session Manager Integration**:
   - Replaced fire-and-forget calls with `enqueueLeaderboardUpdate()`
   - Session completion succeeds even if leaderboard enqueue fails
   - Leaderboard updates processed independently with retry

4. **Admin Endpoints** (`app/api/admin/leaderboards/recalculate/route.ts`):
   - GET: Check leaderboard staleness
   - POST: Manually trigger recalculation (immediate or queued)
   - Supports bulk recalculation of all leaderboards

5. **Background Worker Process** (`scripts/start-workers.ts`):
   - Runs achievement and leaderboard workers in parallel
   - Graceful shutdown on SIGTERM/SIGINT
   - Environment-configurable concurrency and polling

**Learning**: For non-critical async operations that must eventually succeed:
1. **Never use fire-and-forget** - Always queue for retry
2. **Separate critical from optional** - Transaction for critical data, queue for optional
3. **Make failures visible** - Admin endpoints to detect and repair stale data
4. **Implement idempotent workers** - Jobs can be retried safely
5. **Use structured logging** - Track job lifecycle and performance
6. **Provide manual controls** - Admins can force recalculation if needed

**Architecture Pattern**:
```typescript
// Session completion flow (two-phase commit)
Phase 1: Critical transactional updates (session, points, XP, progression)
  ↓ (must succeed, uses MongoDB transaction)
Phase 2: Optional async updates (achievements, leaderboards, challenges)
  ↓ (enqueue jobs, don't block on success)
Background Workers: Process queued jobs with retry
  ↓ (exponential backoff, dead letter queue for permanent failures)
```

**Why It Matters**: Ensures eventual consistency for gamification features without blocking critical game session completion. Players' game data is always saved, and leaderboards/achievements update reliably in the background.

**Applied In**:
- Phase 6: Leaderboard reliability refactor
- `app/lib/models/job-queue.ts`
- `app/lib/queue/workers/leaderboard-worker.ts`
- `app/lib/queue/workers/achievement-worker.ts`
- `app/lib/gamification/session-manager.ts` (lines 692-792)
- `app/api/admin/leaderboards/recalculate/route.ts`
- `scripts/start-workers.ts`
- npm script: `npm run workers`

**Usage**:
```bash
# Start background workers (run in separate terminal or as daemon)
npm run workers

# Check leaderboard staleness
curl http://localhost:3000/api/admin/leaderboards/recalculate

# Manually recalculate all leaderboards (queued)
curl -X POST http://localhost:3000/api/admin/leaderboards/recalculate \
  -H "Content-Type: application/json" \
  -d '{"calculateAll": true}'

# Manually recalculate specific leaderboard (immediate)
curl -X POST http://localhost:3000/api/admin/leaderboards/recalculate \
  -H "Content-Type: application/json" \
  -d '{"type": "points_balance", "period": "all_time", "immediate": true}'
```

---

## 🎓 Course System & Quiz Assessments

### Course Export/Import: Safe Map-to-Object Conversion

**Context**: Course export API was failing with "Failed to export course" error when exporting courses with translations.

**Root Cause**: Mongoose `.lean()` queries return Maps for translation fields, but `Object.fromEntries()` fails if the value is not actually a Map or is already an object.

**Problem Code**:
```typescript
// ❌ Wrong: Assumes translations is always a Map
translations: course.translations ? Object.fromEntries(course.translations) : {},
```

**Solution**:
```typescript
// ✅ Correct: Safe conversion with type checking
const mapToObject = (map: any): Record<string, any> => {
  if (!map) return {};
  if (map instanceof Map) {
    return Object.fromEntries(map);
  }
  if (typeof map === 'object') {
    return map;
  }
  return {};
};

translations: mapToObject(course.translations),
```

**Learning**: When working with Mongoose `.lean()` queries:
1. **Never assume data types** - Maps, objects, and undefined all possible
2. **Create helper functions** for safe conversions
3. **Handle all edge cases** - null, undefined, Map, plain object
4. **Provide default values** for all fields to prevent undefined errors
5. **Improve error messages** - Include details in error responses for debugging

**Why It Matters**: Export/import functionality is critical for course backup and migration. Silent failures make it impossible to debug without detailed error messages.

**Applied In**: 
- `app/api/admin/courses/[courseId]/export/route.ts` (mapToObject helper)
- `app/api/admin/courses/import/route.ts` (validation and error handling)
- `app/[locale]/admin/courses/[courseId]/page.tsx` (frontend error display)

---

### Quiz Assessment System: Two-Step Deletion Pattern

**Context**: Admin needs to be able to remove quiz questions, but permanent deletion should be a separate action to prevent accidental data loss.

**Solution**: Implemented two-step deletion pattern:
1. **Soft Delete (Deactivate)**: Set `isActive: false` - question no longer appears in quizzes but can be reactivated
2. **Permanent Delete**: Only available for inactive questions - permanently removes from database

**Implementation**:
```typescript
// Soft delete endpoint
DELETE /api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]
// Sets isActive: false

// Permanent delete endpoint (only for inactive questions)
DELETE /api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]/permanent
// Validates isActive === false before deletion
```

**UI Pattern**:
- Active questions: Show "Deactivate" button
- Inactive questions: Show "Reactivate" and "Permanently Delete" buttons
- Confirmation dialogs for both actions
- Separate sections for active/inactive questions

**Learning**: For content management systems:
1. **Always implement soft delete first** - Allows recovery from mistakes
2. **Separate permanent deletion** - Requires explicit action on inactive items
3. **Visual distinction** - Clear UI separation between active and inactive items
4. **Confirmation dialogs** - Prevent accidental deletions
5. **Validation** - Server-side validation ensures only inactive items can be permanently deleted

**Why It Matters**: Prevents accidental data loss while allowing content cleanup. Admins can safely deactivate questions and permanently delete them later after verification.

**Applied In**:
- `app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]/route.ts` (soft delete)
- `app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]/permanent/route.ts` (permanent delete)
- `app/[locale]/admin/courses/[courseId]/page.tsx` (UI with active/inactive sections)

---

### Course Deletion: Cascading Deletes Pattern

**Context**: When deleting a course, all related data (lessons, progress, quiz questions, assessment results) must also be deleted to maintain data integrity.

**Solution**: Implemented cascading deletes using `Promise.all()` for parallel deletion:

```typescript
const deletePromises = [
  Lesson.deleteMany({ courseId: course._id }),
  CourseProgress.deleteMany({ courseId: course._id }),
  QuizQuestion.deleteMany({ courseId: course._id, isCourseSpecific: true }),
  AssessmentResult.deleteMany({ courseId: course._id }),
];

const [lessonsResult, progressResult, quizQuestionsResult, assessmentResults] = 
  await Promise.all(deletePromises);
```

**Learning**: For relational data in MongoDB:
1. **Always delete related data** - Prevents orphaned records
2. **Use Promise.all()** - Parallel deletion improves performance
3. **Log deletion counts** - Helps verify all data was removed
4. **Confirmation dialogs** - List all data to be deleted before confirmation
5. **Transaction consideration** - For critical operations, consider MongoDB transactions

**Why It Matters**: Ensures data integrity and prevents database bloat from orphaned records. Clear confirmation dialogs help admins understand the scope of deletion.

**Applied In**:
- `app/api/admin/courses/[courseId]/route.ts` (DELETE endpoint)
- `app/[locale]/admin/courses/page.tsx` (confirmation dialog with data list)

---

### Quiz Configuration: Flexible Assessment System

**Context**: Each lesson needs configurable quiz assessments with different thresholds, question counts, and pool sizes.

**Solution**: Implemented `quizConfig` object in Lesson model:

```typescript
quizConfig: {
  enabled: boolean,           // Enable/disable quiz for this lesson
  successThreshold: number,   // Percentage required to pass (0-100)
  questionCount: number,      // Number of questions shown to student
  poolSize: number,           // Total questions in pool (system randomly selects)
  required: boolean,          // Must pass quiz to complete lesson
}
```

**Learning**: For configurable systems:
1. **Use structured config objects** - Easier to validate and extend
2. **Provide sensible defaults** - 100% threshold, 5 questions, 15 pool size
3. **Validate ranges** - Ensure thresholds are 0-100, counts are positive
4. **Document configuration** - Clear admin UI with tooltips explaining each field
5. **Test edge cases** - Empty pools, 0% threshold, 100% threshold

**Why It Matters**: Flexibility allows different courses to have different assessment strategies while maintaining consistency in the data model.

**Applied In**:
- `app/lib/models/lesson.ts` (quizConfig schema)
- `app/[locale]/admin/courses/[courseId]/page.tsx` (quiz config editor)
- `app/components/LessonQuiz.tsx` (quiz rendering with config)

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
