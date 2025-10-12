# Amanoba Architecture

**Version**: 1.0.0  
**Last Updated**: 2025-10-10T11:02:31.000Z  
**Status**: Active

---

## System Overview

Amanoba is a unified game platform built on Next.js 15.5.2 (App Router) that combines PlayMass's multi-game infrastructure with Madoku's comprehensive gamification system. The architecture follows a monolithic serverless design optimized for Vercel deployment with MongoDB Atlas for data persistence.

### Core Principles

1. **Centralized & Reusable**: All components are designed for reuse across games and features
2. **Progressive Disclosure**: Gamification UI hidden until player completes 3 games (configurable)
3. **Event-Driven**: All player actions emit events for analytics and gamification triggers
4. **Type-Safe**: Full TypeScript coverage with strict mode enabled
5. **Security-First**: Rate limiting, input validation, XSS protection, and anti-cheat on all endpoints

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.11 with custom animations
- **UI Components**: Radix UI primitives
- **Animation**: Framer Motion 10.18.0
- **State Management**: TanStack React Query 5.56.2
- **Forms**: React Hook Form 7.53.0 with Zod validation
- **Charts**: Recharts 3.2.1
- **Icons**: Lucide React 0.462.0
- **Utilities**: clsx, tailwind-merge, class-variance-authority

### Backend
- **Runtime**: Node.js >= 20.0.0
- **API**: Next.js API Routes (App Router)
- **Database**: MongoDB Atlas 6.18.0
- **ODM**: Mongoose 8.18.0
- **Validation**: Zod 4.1.11 with XSS protection (xss 1.0.15)
- **Logging**: Pino 9.13.0 with PII redaction
- **Rate Limiting**: rate-limiter-flexible 8.0.1
- **Push Notifications**: web-push 3.6.7

### Deployment
- **Platform**: Vercel (Serverless)
- **Database**: MongoDB Atlas (Madoku cluster)
- **CDN**: Vercel Edge Network
- **DNS**: Vercel DNS
- **SSL**: Automatic via Vercel

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   PWA App    │  │ Service      │  │  IndexedDB   │  │
│  │   (React)    │  │  Worker      │  │   (Cache)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Edge Network (CDN)                   │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                Next.js Application (Vercel)              │
│  ┌──────────────────────────────────────────────────┐  │
│  │              App Router (Pages)                   │  │
│  │  • Home • Games • Profile • Leaderboard • Admin  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │                  API Routes                       │  │
│  │  • Games • Gamification • Analytics • Admin      │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                 │  │
│  │  • Gamification • Game Engines • Analytics       │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Data Access Layer                    │  │
│  │         Mongoose ODM (17 Models)                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│           MongoDB Atlas (Madoku Cluster)                 │
│  Database: amanoba                                       │
│  • 17 Collections • Indexes • Aggregations              │
└─────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
amanoba/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts and metadata
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles and animations
│   │
│   ├── admin/                   # Admin dashboard (auth protected)
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── page.tsx             # Admin home with stats
│   │   ├── analytics/           # Analytics dashboards
│   │   ├── games/               # Game management CRUD
│   │   ├── gamification/        # Achievement/challenge management
│   │   ├── participants/        # Player management
│   │   ├── premium/             # Premium access management
│   │   ├── referrals/           # Referral system analytics
│   │   └── settings/            # System configuration
│   │
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin-only endpoints
│   │   │   ├── analytics/       # Analytics data APIs
│   │   │   ├── premium/         # Grant/revoke premium access
│   │   │   └── migrations/      # Database migration runner
│   │   ├── auth/                # Authentication endpoints
│   │   │   └── facebook/        # Facebook OAuth
│   │   ├── games/               # Game session management
│   │   │   └── [gameKey]/       # Dynamic game routes
│   │   │       └── session/     # Start/complete sessions
│   │   ├── gamification/        # Gamification APIs
│   │   │   ├── points/          # Points wallet operations
│   │   │   ├── achievements/    # Achievement checks and unlocks
│   │   │   ├── challenges/      # Daily challenges
│   │   │   ├── quests/          # Multi-step quests
│   │   │   ├── streaks/         # Streak tracking
│   │   │   └── profile/         # Player progression data
│   │   ├── leaderboard/         # Leaderboard queries
│   │   ├── push/                # Push notification management
│   │   ├── referrals/           # Referral tracking and rewards
│   │   └── health/              # Health check endpoint
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI primitives (11 components)
│   │   ├── gamification/        # Gamification UI
│   │   │   ├── ProgressiveGate.tsx
│   │   │   ├── AchievementToast.tsx
│   │   │   ├── AchievementGallery.tsx
│   │   │   ├── XPBar.tsx
│   │   │   ├── LevelBadge.tsx
│   │   │   ├── StreakBadge.tsx
│   │   │   ├── LeaderboardWidget.tsx
│   │   │   └── DailyChallengeCard.tsx
│   │   ├── games/               # Game-specific components
│   │   │   ├── QuizzzGame.tsx
│   │   │   ├── WhackPopGame.tsx
│   │   │   └── MadokuGame.tsx
│   │   ├── charts/              # Analytics charts (6 types)
│   │   ├── profile/             # Player profile components
│   │   ├── admin/               # Admin dashboard components
│   │   ├── game/                # Game launcher components
│   │   ├── referral/            # Referral widgets
│   │   └── pwa/                 # PWA install and push components
│   │
│   ├── games/                   # Game gallery and play pages
│   │   ├── page.tsx             # Games list
│   │   └── [gameKey]/           # Dynamic game routes
│   │       ├── page.tsx         # Game detail
│   │       └── play/            # Game play interface
│   │
│   ├── profile/                 # Player profile pages
│   │   ├── page.tsx             # Own profile
│   │   └── [playerId]/          # Public player profiles
│   │
│   ├── leaderboard/             # Leaderboard pages
│   │   └── page.tsx
│   │
│   └── lib/                     # Utility libraries
│       ├── mongodb.ts           # MongoDB connection with pooling
│       ├── logger.ts            # Pino structured logger
│       ├── rateLimit.ts         # Rate limiting utilities
│       ├── validation.ts        # Zod schemas
│       ├── anti-cheat.ts        # Anti-cheat validation
│       ├── design-tokens.ts     # Centralized design system
│       ├── animations.ts        # Framer Motion variants
│       │
│       ├── models/              # Mongoose schemas (17 models)
│       │   ├── Brand.ts
│       │   ├── Game.ts
│       │   ├── GameBrandConfig.ts
│       │   ├── Player.ts
│       │   ├── PlayerSession.ts
│       │   ├── PlayerProgression.ts
│       │   ├── PointsWallet.ts
│       │   ├── PointsTransaction.ts
│       │   ├── Achievement.ts
│       │   ├── AchievementUnlock.ts
│       │   ├── LeaderboardEntry.ts
│       │   ├── Streak.ts
│       │   ├── Reward.ts
│       │   ├── RewardRedemption.ts
│       │   ├── EventLog.ts
│       │   ├── AnalyticsSnapshot.ts
│       │   ├── SystemVersion.ts
│       │   ├── ReferralTracking.ts
│       │   └── index.ts         # Barrel export
│       │
│       ├── gamification/        # Gamification logic
│       │   ├── points.ts        # Points economy
│       │   ├── achievements.ts  # Achievement validation
│       │   ├── xp.ts            # XP and leveling
│       │   ├── titles.ts        # Title progression
│       │   ├── streaks.ts       # Streak tracking
│       │   ├── challenges.ts    # Daily challenges
│       │   ├── quests.ts        # Quest system
│       │   ├── leaderboards.ts  # Leaderboard calculations
│       │   ├── elo.ts           # ELO ranking system
│       │   └── progressive-disclosure.ts
│       │
│       ├── madoku/              # Madoku Sudoku engine
│       │   ├── generateSudoku.ts
│       │   ├── computerPlayer.ts
│       │   └── ghost.ts
│       │
│       ├── game-engines/        # Other game engines
│       │   ├── quizzz.ts
│       │   └── whackpop.ts
│       │
│       ├── analytics/           # Analytics utilities
│       │   ├── event-logger.ts  # Event emission
│       │   ├── aggregations.ts  # Data aggregation
│       │   └── snapshots.ts     # Snapshot generation
│       │
│       └── game-session-handler.ts  # Unified session logic
│
├── public/                      # Static assets
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service worker
│   ├── icons/                   # App icons
│   └── images/                  # Static images
│
├── scripts/                     # Utility scripts
│   ├── versioning/              # Version bump scripts
│   │   ├── bump-version.mjs
│   │   └── get-version.mjs
│   ├── cron/                    # Scheduled jobs
│   │   ├── update-leaderboards.mjs
│   │   └── aggregate-analytics.mjs
│   ├── migrations/              # Database migrations
│   │   ├── run.mjs
│   │   └── verify.mjs
│   ├── seed-database.mjs        # Database seeding
│   ├── seed-achievements.mjs    # Achievement seeding
│   ├── init-db-indexes.mjs      # Index creation
│   ├── backup-database.mjs      # Backup utility
│   └── restore-database.mjs     # Restore utility
│
├── docs/                        # Documentation
│   ├── ENVIRONMENT_SETUP.md     # Environment configuration
│   ├── DESIGN_SYSTEM.md         # Design guidelines
│   ├── DEPLOYMENT_GUIDE.md      # Deployment instructions
│   ├── QA_TEST_PLAN.md          # Manual QA plan
│   ├── MONITORING.md            # Monitoring setup
│   └── ROLLBACK_PLAN.md         # Rollback procedures
│
├── .gitignore                   # Git ignore rules
├── .env.local.example           # Environment template
├── .env.local                   # Local environment (not committed)
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind configuration
├── next.config.ts               # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
│
├── README.md                    # Project overview
├── ARCHITECTURE.md              # This file
├── ROADMAP.md                   # Future plans
├── TASKLIST.md                  # Active tasks
├── RELEASE_NOTES.md             # Version changelog
├── LEARNINGS.md                 # Implementation insights
├── TECH_STACK.md                # Technology details
├── NAMING_GUIDE.md              # Naming conventions
├── CONTRIBUTING.md              # Contribution guidelines
├── WARP.md                      # AI operational guidance
└── WARP.DEV_AI_CONVERSATION.md  # Development log
```

---

## Data Models (17 Collections)

### Player & Identity
1. **Player**: Core player identity, premium status, referral tracking
2. **PlayerProgression**: Level, XP, title, achievement count, streaks
3. **PlayerSession**: Individual game play sessions with outcome and metadata

### Gamification Economy
4. **PointsWallet**: Current points balance (fast queries)
5. **PointsTransaction**: Complete audit trail of points operations
6. **Achievement**: Achievement definitions with criteria
7. **AchievementUnlock**: Player achievement unlocks with timestamps
8. **Streak**: Win and login streak tracking with milestones

### Rewards
9. **Reward**: Reward definitions (points, coupons, prizes)
10. **RewardRedemption**: Reward claim and redemption lifecycle
11. **ReferralTracking**: Referral events and conversion tracking

### Content & Configuration
12. **Brand**: Multi-brand white-labeling support
13. **Game**: Game type definitions (QUIZZZ, WHACKPOP, MADOKU)
14. **GameBrandConfig**: Per-brand game configuration and theming

### Analytics & Leaderboards
15. **EventLog**: Event-sourcing for all player actions
16. **AnalyticsSnapshot**: Pre-aggregated daily/weekly/monthly metrics
17. **LeaderboardEntry**: Calculated leaderboard rankings

### System
18. **SystemVersion**: Database migration tracking

---

## Key Features

### 1. Gamification System

**Progressive Disclosure**
- Gamification UI hidden until player completes threshold (default: 3 games)
- Configurable per brand via `GameBrandConfig.progressiveThreshold`
- Smooth reveal animation with teaser messages

**Points Economy**
- Atomic wallet operations using Mongoose transactions
- Complete audit trail in `PointsTransaction`
- Anti-cheat: 500 points/day maximum per player
- Points awarded for: game completion, achievements, referrals, streaks

**Achievements (18 Total)**
- 4 categories: Milestone, Streak, Skill, Consistency
- Server-side validation of unlock criteria
- Automatic point awards on unlock
- Toast notifications with animations
- Progress tracking for incremental achievements

**XP & Leveling (50 Levels)**
- Exponential curve: `XP = Math.floor(100 * Math.pow(level, 1.5))`
- 10 title tiers: Beginner → Legend
- 2 hidden titles unlocked by specific achievements
- Level-up modal with celebratory animations

**Streaks**
- Win streaks: Consecutive game wins
- Login streaks: Consecutive daily logins
- Milestones: 3, 7, 14, 30, 50, 100 days
- Bonus points on milestone achievements

**Daily Challenges**
- 3 challenges per day (Easy/Medium/Hard)
- Deterministic generation based on date
- Expires at 23:59:59.999Z UTC daily
- Unique rewards per difficulty

**Quests**
- 5 multi-step quests with progress tracking
- Unique rewards on completion
- Quest chains with dependencies

**Leaderboards**
- Global, weekly, monthly, brand-specific, game-specific
- Daily cron at 00:00 UTC for rank calculation
- Tie handling with consistent ordering
- Player rank always included in response

### 2. Games

**QUIZZZ (Board Quiz)**
- Hexagonal or square grid maps
- Multiple questions with validation
- Customizable styling from database
- Session tracking with outcomes

**WHACKPOP (Whack-a-Mole)**
- Grid-based action game
- Progressive difficulty
- Combo scoring system
- Multiple themes and effects

**MADOKU (Premium Sudoku)**
- Valid Sudoku board generation
- 3 AI difficulty levels (Easy, Medium, Hard)
- ELO ranking system
- Ghost Mode for top 60% players
- Premium gating (Player.premium required)
- Turn-based scoring duel

### 3. Analytics

**Event Logging**
- All player actions emit events to `EventLog`
- Event types: session.start, session.complete, points.earn, achievement.unlock, etc.
- Timestamp, playerId, brandId, gameId, sessionId captured
- Payload for event-specific data

**Aggregations**
- Daily cron at 01:00 UTC aggregates prior day
- Metrics: sessions, uniquePlayers, avgSessionDuration, retention (D1/D7/D30), pointsEarned, achievementsUnlocked
- Stored in `AnalyticsSnapshot` for fast queries
- Weekly and monthly rollups

**Charts (6 Types)**
- Win Rate Chart: Time-series win/loss trends
- ELO Progression: Skill rating over time
- Activity Heatmap: GitHub-style 365-day activity
- Score Trend: Performance patterns
- Difficulty Breakdown: Mastery by level
- Time of Day: Performance by hour

### 4. Security

**Authentication**
- Facebook OAuth for players
- Session-based admin authentication
- HttpOnly cookies with secure flags
- 7-day expiration

**Input Validation**
- Zod schemas on all API endpoints
- XSS sanitization via xss library
- Type-safe request/response validation

**Rate Limiting**
- 100 requests/minute per IP (configurable)
- Separate limits for auth endpoints (5 attempts/minute)
- Redis-compatible in-memory store

**Anti-Cheat**
- Server-side game result validation
- IP tracking and device fingerprinting
- Suspicious activity flags
- Maximum points per day limit
- Session timing validation

**Logging**
- Pino structured logging
- PII redaction for sensitive fields
- JSON output in production
- Pretty printing in development
- ISO 8601 timestamps with milliseconds

### 5. PWA Features

**Offline Support**
- Service worker with cache-first strategy for assets
- Network-first for API calls
- IndexedDB for offline data
- Graceful degradation

**Push Notifications**
- VAPID-based web push
- Multi-device support
- Notifications for: achievements, daily challenges, level-ups, streak milestones
- Subscription management

**Install Prompts**
- Smart install prompt after 3 interactions
- Custom install UI
- iOS add to home screen instructions

### 6. Admin Dashboard

**Game Management**
- CRUD for all game types
- Map creator for QUIZZZ (hex/square)
- Game configuration and theming
- Enable/disable games per brand

**Player Management**
- Search and filter players
- View full player profiles
- Grant/revoke premium access
- Manual point adjustments
- Session history

**Analytics**
- Overview dashboard with KPIs
- Time-series charts
- Cohort retention analysis
- Funnel visualization
- Export to CSV/JSON

**Gamification Management**
- Achievement definitions CRUD
- Daily challenge configuration
- Quest management
- Premium access control

---

## API Design

### Response Format

All APIs return consistent structure:

```typescript
interface ApiResponse<T = any> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}
```

### Authentication

**Player Authentication**
- Facebook OAuth token passed in header or cookie
- Session cookie set on successful auth
- Cookie: `user-session`, HttpOnly, 7-day expiration

**Admin Authentication**
- Password-based authentication
- Session cookie set on successful login
- Cookie: `admin-session`, HttpOnly, 7-day expiration

### Rate Limiting

Headers returned:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696000000
```

---

## Deployment Architecture

### Vercel Serverless

**Edge Functions**
- Global CDN distribution
- Automatic scaling
- Zero config SSL
- Automatic deployments on git push

**Environment**
- Production: `main` branch
- Preview: All other branches
- Environment variables per deployment

### MongoDB Atlas

**Cluster Configuration**
- Cluster: madoku-cluster.kqamwf8.mongodb.net
- Database: amanoba
- Region: Auto-selected closest to Vercel
- Network Access: 0.0.0.0/0 (serverless)
- Backups: Daily automated

**Connection Pooling**
- Min: 10 connections
- Max: 100 connections
- Reuse across serverless invocations

### Monitoring

**Vercel Analytics**
- Real User Monitoring (RUM)
- Core Web Vitals
- Error tracking
- API latency

**MongoDB Atlas**
- Query performance
- Index usage
- Connection pool metrics
- Slow query log

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API P95 Latency | < 300ms | TBD |
| Page Load (LCP) | < 2s | TBD |
| Error Rate | < 0.5% | TBD |
| Lighthouse Score | > 90 | TBD |
| PWA Installability | 100% | TBD |

---

## Security Measures

1. **HTTPS Everywhere**: All traffic encrypted
2. **CSP Headers**: Content Security Policy configured
3. **CORS**: Restricted to known origins
4. **Rate Limiting**: DDoS protection
5. **Input Validation**: All inputs validated and sanitized
6. **Secret Management**: Secrets in environment variables only
7. **Database Security**: Connection string encrypted, access restricted
8. **Session Security**: HttpOnly cookies, secure flag in production
9. **Anti-Cheat**: Server-side validation of all game results
10. **Audit Trail**: Complete transaction history for points and achievements

---

## Scalability Considerations

### Horizontal Scaling
- Vercel serverless functions scale automatically
- MongoDB Atlas auto-scales with load
- CDN for static assets reduces origin load

### Database Optimization
- Indexes on all query fields
- Aggregation pipelines for complex queries
- Pre-aggregated snapshots for analytics
- Lean queries (`.lean()`) for read-only operations

### Caching Strategy
- Static assets: CDN cached
- API responses: Cache-Control headers where appropriate
- Service worker: Cache-first for assets, network-first for APIs
- MongoDB query results: Application-level caching for leaderboards

### Future Considerations
- Redis for session storage and caching
- Separate read replicas for analytics queries
- Message queue for async processing (achievements, notifications)
- Microservices extraction for heavy computations

---

## Maintenance & Operations

### Version Management
- Semantic versioning: MAJOR.MINOR.PATCH
- PATCH: Before every `npm run dev`
- MINOR: Before every commit
- MAJOR: On explicit major release

### Database Migrations
- Idempotent migration scripts in `scripts/migrations/`
- `SystemVersion` collection tracks applied migrations
- Always test migrations in staging first
- Backup before production migrations

### Backup & Recovery
- Daily automated backups in MongoDB Atlas
- Manual backup script: `npm run db:backup`
- Restore script: `npm run db:restore`
- Point-in-time recovery available in Atlas

### Monitoring & Alerts
- Vercel error notifications
- MongoDB Atlas performance alerts
- Custom health check endpoint: `/api/health`
- Admin monitoring dashboard

---

## Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Implement feature with full documentation
   - Test locally with `npm run dev`
   - Update all relevant documentation

2. **Code Review**
   - Ensure all AI rules followed
   - Verify comments (what + why)
   - Check type safety
   - Validate security measures

3. **Deployment**
   - Bump version per protocol
   - Update RELEASE_NOTES.md
   - Commit with semantic message
   - Push to GitHub (automatic Vercel deployment)

4. **Post-Deployment**
   - Monitor error rates
   - Check performance metrics
   - Verify feature functionality
   - Update LEARNINGS.md if issues found

---

## Future Enhancements

See [ROADMAP.md](./ROADMAP.md) for planned features and improvements.

---

**Document Version**: 1.0.0  
**Maintained By**: Narimato  
**Review Cycle**: Monthly or on major architectural changes
