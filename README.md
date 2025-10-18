# Amanoba — Unified Game Platform

**Current Version**: 2.4.0  
**Last Updated**: 2025-10-18T09:16:20.000Z  
**Status**: In Development

## 🎮 Overview

Amanoba is a unified multi-game platform that combines the best of PlayMass infrastructure and Madoku's comprehensive gamification system. Built on Next.js 15 with full TypeScript support, Amanoba provides an engaging game experience with progressive disclosure, achievement systems, leaderboards, and premium content.

### Core Features

- **Multi-Game Platform**: QUIZZZ, WHACKPOP, and premium Madoku Sudoku
- **Comprehensive Gamification**:
  - 18 achievements across 4 categories
  - 50-level XP system with titles
  - Daily challenges and quests
  - Win and login streaks with milestones
  - Points economy with rewards
- **Progressive Disclosure**: Gamification unlocks after 3 games (configurable)
- **Advanced Analytics**: 6 chart types, activity heatmaps, ELO rankings
- **Premium Features**: Madoku Sudoku with AI opponents and Ghost Mode
- **Referral System**: Viral growth with points rewards
- **PWA Support**: Offline play, push notifications, installable
- **Security**: Rate limiting, XSS protection, anti-cheat, structured logging

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Database**: MongoDB Atlas with Mongoose 8.18.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **Animation**: Framer Motion 10.18.0
- **UI Components**: Radix UI primitives
- **Charts**: Recharts 3.2.1
- **State Management**: TanStack React Query
- **Validation**: Zod (XSS protection)
- **Logging**: Pino (structured logging with PII sanitization)
- **Rate Limiting**: rate-limiter-flexible 8.0.1

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- MongoDB Atlas account

### Installation

```bash
# Clone the repository
git clone https://github.com/moldovancsaba/amanoba.git
cd amanoba

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Environment Variables

See `.env.local.example` for required configuration including:
- MongoDB connection string
- Admin password
- Facebook App credentials
- VAPID keys for push notifications
- Optional analytics ID

## 📁 Project Structure

```
app/
├── admin/              # Admin dashboard and management tools
├── api/                # API routes (games, gamification, analytics)
├── components/         # React components
│   ├── gamification/  # Achievement, XP, streak components
│   ├── games/         # Game-specific components
│   ├── charts/        # Analytics chart components
│   └── ui/            # Reusable UI primitives
├── games/             # Game gallery and play pages
├── lib/               # Utilities, models, and business logic
│   ├── models/       # 17 Mongoose schemas
│   ├── gamification/ # Points, achievements, XP, streaks
│   ├── madoku/       # Sudoku engine and AI
│   └── analytics/    # Event logging and aggregations
├── profile/           # Player profile pages
└── leaderboard/       # Leaderboard pages
```

## 📊 Game Types

### QUIZZZ (Board Quiz)
Board-based quiz game on hexagonal or square grid maps with multiple questions and customizable styling.

### WHACKPOP (Whack-a-Mole)
Grid-based fast-paced action game with progressive difficulty, combo scoring, and multiple themes.

### MADOKU (Premium)
Math duel on a Sudoku board with AI opponents (3 difficulty levels), ELO rankings, and Ghost Mode for top players.

## 🏆 Gamification System

- **Progressive Disclosure**: Gamification UI hidden until player completes 3 games
- **Points Economy**: Earn points through gameplay, spend on rewards
- **18 Achievements**: Milestone, streak, skill, and consistency categories
- **50 Levels**: Exponential XP curve with 10 title tiers
- **Streaks**: Win streaks and login streaks with milestone bonuses
- **Daily Challenges**: 3 challenges per day across difficulty levels
- **Quests**: 5 multi-step challenges with unique rewards
- **Leaderboards**: Global, weekly, monthly, brand-specific, game-specific

## 📖 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System architecture and components
- [TECH_STACK.md](./TECH_STACK.md) — Complete technology stack details
- [ROADMAP.md](./ROADMAP.md) — Strategic milestones and future plans
- [TASKLIST.md](./TASKLIST.md) — Active development tasks
- [RELEASE_NOTES.md](./RELEASE_NOTES.md) — Version changelog
- [LEARNINGS.md](./LEARNINGS.md) — Implementation insights
- [WARP.md](./WARP.md) — AI operational guidance
- [NAMING_GUIDE.md](./NAMING_GUIDE.md) — Naming conventions
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guidelines

## 🔐 Admin Access

Admin dashboard available at `/admin` with session-based authentication.

Set `ADMIN_PASSWORD` in your environment configuration.

Features:
- Game management and configuration
- Player management and premium access
- Analytics dashboard with advanced charts
- Referral system monitoring
- Gamification content management

## 🔄 Versioning

Amanoba follows semantic versioning (MAJOR.MINOR.PATCH):
- **PATCH**: Before every `npm run dev` (auto-incremented)
- **MINOR**: Before every commit to GitHub
- **MAJOR**: On significant releases (manual)

Version reflected in:
- `package.json`
- All documentation
- `SystemVersion` collection in MongoDB
- UI footer (if applicable)

## 🤝 Merge Sources

Amanoba is a merge of two mature projects:
- **PlayMass** (v4.11.2) — Multi-game platform infrastructure
- **Madoku** (v1.5.0) — Gamification and analytics systems

Both source projects remain available as reference but are not actively developed.

## 📝 License

Copyright © 2025 Narimato. All rights reserved.

## 🙏 Acknowledgments

Built with careful attention to:
- Reuse-before-creation principle
- Comprehensive commenting (what + why)
- ISO 8601 timestamps with milliseconds
- Security best practices
- Accessibility (WCAG AA compliance)
- Progressive disclosure UX patterns

---

For questions or support, please refer to the documentation index above or contact the development team.
