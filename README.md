# Amanoba

**Current Version**: Restored to working baseline f20c34a — Unified 30-Day Learning Platform

**Current Version**: 2.8.0  
**Last Updated**: 2025-01-20T23:00:00.000Z  
**Status**: Production Stable — Stripe Integration Complete — Premium Course Pricing Enabled

## 🎓 Overview

Amanoba is transforming into a **unified 30-day learning platform** that combines structured education with gamified engagement. Built on Next.js 15 with full TypeScript support, Amanoba delivers daily lessons via email, uses interactive games as student assessments, and maintains a comprehensive gamification system with achievements, leaderboards, and rewards.

### Core Features

- **30-Day Course System**: Structured learning with daily lessons delivered via email
- **Quiz Assessment System**: Course-specific quizzes with configurable thresholds and question pools
- **Course Export/Import**: Export complete courses (lessons + quizzes) to JSON and import with overwrite support
- **Stripe Payment Integration**: Complete payment system for premium courses
  - Stripe Checkout for secure payments
  - Automatic premium activation on successful payment
  - Payment history tracking
  - Multi-currency support (USD, EUR, HUF, GBP)
  - Payment confirmation emails
- **Premium Course Pricing**: Admin interface to set custom pricing per course
  - Set price amount and currency per course
  - Stripe minimum amount validation
  - Real-time validation in admin UI
- **First Course Available**: "AI 30 Nap" (AI 30 Days) - Complete 30-day AI learning course in Hungarian
- **Interactive Assessments**: Games (QUIZZZ, WHACKPOP, Madoku) repurposed as student assessment tools
- **Email-First Learning**: Daily lessons sent to students' email with in-platform access
- **Course Builder**: Admin interface to create and manage 30-day courses with rich text editor
- **Student Dashboard**: Browse courses, enroll, track progress, view daily lessons
- **Feature Flags**: Admin-controlled feature toggles for courses, games, leaderboards, etc.
- **Comprehensive Gamification** (Retained):
  - 18+ achievements across 4 categories (including course-specific)
  - 50-level XP system with titles
  - Daily challenges and quests
  - Win and login streaks with milestones
  - Points economy with rewards
- **Progressive Disclosure**: Gamification unlocks after 3 activities (configurable)
- **Advanced Analytics**: 6 chart types, activity heatmaps, course progress tracking
- **Student Dashboard**: Track course progress, view lessons, see assessment results
- **PWA Support**: Offline access, push notifications, installable
- **Security**: Rate limiting, XSS protection, structured logging

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Database**: MongoDB Atlas with Mongoose 8.18.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1 (with custom brand colors)
- **Email**: Resend API for lesson delivery (daily automated emails)
- **Rich Text Editor**: TipTap for course content creation
- **i18n**: next-intl for multi-language support (Hungarian default, English)
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
├── [locale]/          # Locale-based pages (hu, en)
│   ├── admin/         # Admin dashboard (i18n)
│   ├── auth/          # Authentication pages (i18n)
│   ├── dashboard/     # Student dashboard (i18n)
│   ├── games/         # Game gallery (i18n)
│   └── ...            # All other pages (i18n)
├── api/               # API routes (no locale needed)
├── components/        # React components
│   ├── gamification/  # Achievement, XP, streak components
│   ├── games/         # Game-specific components
│   ├── charts/        # Analytics chart components
│   └── ui/            # Reusable UI primitives
├── lib/               # Utilities, models, and business logic
│   ├── models/        # 27 Mongoose schemas (4 new course models)
│   ├── email/         # Email service (Resend)
│   ├── courses/       # Course management (email scheduler)
│   ├── gamification/  # Points, achievements, XP, streaks
│   ├── madoku/        # Sudoku engine and AI
│   └── analytics/     # Event logging and aggregations
messages/              # Translation files (hu.json, en.json)
public/                # Static assets (logo, etc.)
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

Admin dashboard available at `/{locale}/admin` with session-based authentication.

Set `ADMIN_PASSWORD` in your environment configuration.

Features:
- **Course Management**: Create, edit, delete, and manage 30-day courses with cascading deletes
- **Lesson Builder**: Rich text editor for daily lesson content with email templates
- **Quiz Management**: Create and manage course-specific quiz questions with two-step deletion
- **Course Export/Import**: Export courses to JSON for backup/sharing, import with overwrite support
- **Game Management**: Configure games and assessment settings
- **Player Management**: View players, manage premium access
- **Analytics Dashboard**: Real-time stats and advanced charts
- **Feature Flags**: Enable/disable features (courses, games, leaderboards, etc.)
- **Referral System**: Monitor referral tracking
- **Gamification Content**: Manage achievements, rewards, challenges

## 📚 Available Courses

### AI 30 Nap (AI 30 Days)
- **Course ID**: `AI_30_NAP`
- **Language**: Hungarian (hu)
- **Duration**: 30 days
- **Status**: Active and ready for enrollment
- **Content**: Complete 30-day AI learning journey covering:
  - Days 1-5: Basics & mindset
  - Days 6-10: Daily work facilitation
  - Days 11-15: System building
  - Days 16-20: Role-specific usage
  - Days 21-25: AI for revenue
  - Days 26-30: Closing & next level

**Seed Scripts**: 
- `npm run seed:ai-course` - Create the AI 30 Nap course
- `npm run seed:course-creation` - Create the "Kurzus a kurzus készítésre" course (course creation guide)

**Course Export/Import**: 
- Export any course to JSON via admin interface (includes all lessons and quiz questions)
- Import courses from JSON with overwrite support
- Perfect for course backup, sharing, and migration

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
