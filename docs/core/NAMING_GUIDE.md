# Amanoba Naming Guide

**Version**: 1.0.0  
**Last Updated**: 2025-10-10T11:05:18.000Z

---

This document establishes comprehensive naming conventions for all code, files, and structures in the Amanoba codebase. Consistency in naming improves readability, maintainability, and onboarding.

---

## 📂 File & Directory Naming

### General Rules
- Use **kebab-case** for all file and directory names
- Use lowercase only
- Be descriptive but concise
- Avoid abbreviations unless universally understood

### Examples

**✅ Good**
- `player-progression.ts`
- `game-session-api.ts`
- `achievement-unlock-dialog.tsx`
- `docs/core/ENVIRONMENT_SETUP.md`

**❌ Bad**
- `PlayerProgression.ts` (PascalCase for files)
- `gameSessionAPI.ts` (camelCase for files)
- `AchievementDlg.tsx` (abbreviation)
- `docs/core/ENVIRONMENT_SETUP.md` (snake_case)

---

## 🔤 TypeScript/JavaScript Naming

### Variables & Functions

**Variables**: camelCase
```typescript
const playerName = "Alice";
const totalScore = 1000;
let isGameActive = false;
```

**Functions**: camelCase, verb-first
```typescript
function calculatePoints(score: number): number { }
async function fetchPlayerData(id: string): Promise<Player> { }
const handleGameEnd = () => { };
```

**Boolean Variables**: Use `is`, `has`, `should` prefix
```typescript
const isLoggedIn = true;
const hasCompletedTutorial = false;
const shouldShowPremium = checkPremiumVisibility();
```

---

### Classes & Types

**Classes**: PascalCase
```typescript
class PlayerProgressionManager { }
class AchievementUnlockService { }
class GameSessionController { }
```

**Interfaces**: PascalCase with descriptive noun
```typescript
interface PlayerData { }
interface GameConfig { }
interface AchievementCriteria { }
```

**Type Aliases**: PascalCase
```typescript
type GameType = 'QUIZZZ' | 'WHACKPOP' | 'MADOKU';
type PointsTransactionType = 'EARNED' | 'SPENT' | 'REFUNDED';
```

**Enums**: PascalCase for name, UPPER_SNAKE_CASE for values
```typescript
enum GameStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}
```

---

### Constants

**Global Constants**: UPPER_SNAKE_CASE
```typescript
const MAX_DAILY_CHALLENGES = 1;
const PROGRESSIVE_DISCLOSURE_THRESHOLD = 3;
const API_RATE_LIMIT = 100;
const SESSION_TIMEOUT_MS = 3600000;
```

**Immutable Config Objects**: UPPER_SNAKE_CASE for name, camelCase for properties
```typescript
const GAME_POINTS = {
  quizzz: { win: 10, participation: 5 },
  whackpop: { win: 15, participation: 7 },
  madoku: { win: 20, participation: 10 }
};
```

---

### React Components

**Component Files**: PascalCase with `.tsx` extension
```
components/PlayerProfileCard.tsx
components/AchievementUnlockDialog.tsx
components/GameLauncherGrid.tsx
```

**Component Functions**: PascalCase matching filename
```typescript
export function PlayerProfileCard({ playerId }: Props) { }
export function AchievementUnlockDialog({ achievement }: Props) { }
```

**Props Interfaces**: ComponentName + "Props"
```typescript
interface PlayerProfileCardProps {
  playerId: string;
  variant?: 'compact' | 'full';
}
```

**Hook Files**: camelCase starting with `use`
```
hooks/usePlayerData.ts
hooks/useGameSession.ts
hooks/useAchievements.ts
```

---

## 🗄️ Database Naming

### MongoDB Collections

**Collections**: PascalCase, singular noun
```typescript
// Mongoose model names (also collection names)
export const Brand = model('Brand', BrandSchema);
export const Player = model('Player', PlayerSchema);
export const GameBrandConfig = model('GameBrandConfig', GameBrandConfigSchema);
export const PointsTransaction = model('PointsTransaction', PointsTransactionSchema);
```

**Why Singular?** Mongoose automatically pluralizes when creating collections in MongoDB.

---

### Mongoose Schema Fields

**Fields**: camelCase
```typescript
const PlayerSchema = new Schema({
  facebookId: String,
  displayName: String,
  email: String,
  isPremium: Boolean,
  premiumExpiresAt: Date,
  createdAt: Date,
  updatedAt: Date
});
```

**Nested Objects**: camelCase for parent and children
```typescript
const GameBrandConfigSchema = new Schema({
  premiumGatingConfig: {
    isEnabled: Boolean,
    minGamesBeforeShow: Number,
    unlockMessage: String
  }
});
```

**Arrays**: Plural camelCase
```typescript
const BrandSchema = new Schema({
  themeColors: [String],
  allowedDomains: [String],
  supportedLanguages: [String]
});
```

---

### Database Indexes

**Index Names**: Descriptive with underscores
```typescript
PlayerSchema.index({ facebookId: 1 }, { name: 'player_facebook_id' });
PlayerSchema.index({ email: 1 }, { name: 'player_email_unique', unique: true });
PointsTransactionSchema.index({ playerId: 1, createdAt: -1 }, { name: 'transactions_by_player_date' });
```

---

## 🌐 API Naming

### Route Structure

**RESTful Conventions**: Use standard HTTP verbs and noun-based paths
```
GET    /api/players/:id               - Fetch single player
GET    /api/players                   - List players
POST   /api/players                   - Create player
PATCH  /api/players/:id               - Update player
DELETE /api/players/:id               - Delete player

POST   /api/games/:gameId/session     - Start game session
POST   /api/games/:gameId/session/:sessionId/end  - End game session

GET    /api/achievements              - List achievements
POST   /api/achievements/:id/unlock   - Unlock achievement
```

**Why REST?** Standard, predictable, easy to document and consume.

---

### Query Parameters

**Query Params**: camelCase
```
GET /api/leaderboards?gameType=QUIZZZ&period=weekly&limit=100
GET /api/players?isPremium=true&sortBy=level&order=desc
GET /api/analytics?startDate=2025-01-01&endDate=2025-01-31&granularity=day
```

---

### Request/Response Bodies

**JSON Fields**: camelCase
```json
{
  "playerId": "507f1f77bcf86cd799439011",
  "gameType": "QUIZZZ",
  "finalScore": 850,
  "pointsEarned": 15,
  "achievementsUnlocked": ["first_win", "speed_demon"]
}
```

---

## 🎨 CSS & Styling

### Tailwind Classes

**Component Classes**: Use Tailwind utilities, avoid custom classes unless necessary

**Custom Classes**: kebab-case with semantic naming
```css
.btn-primary { }
.card-elevated { }
.text-brand-gradient { }
.animate-points { }
```

---

### CSS Variables (Brand Theming)

**CSS Variables**: kebab-case with `--brand-` prefix
```css
:root {
  --brand-primary: #6366f1;
  --brand-secondary: #ec4899;
  --brand-accent: #a855f7;
  --brand-bg: #ffffff;
  --brand-text: #1f2937;
}
```

---

## 📝 Environment Variables

**Format**: UPPER_SNAKE_CASE
```
MONGODB_URI
DB_NAME
ADMIN_PASSWORD
NEXT_PUBLIC_FACEBOOK_APP_ID
FACEBOOK_APP_SECRET
VAPID_PUBLIC_KEY
```

**Prefixes**:
- `NEXT_PUBLIC_` - Exposed to client-side code
- No prefix - Server-side only

---

## 📄 Documentation Files

**Markdown Files**: UPPER_SNAKE_CASE for core docs, kebab-case for supporting docs
```
README.md
ARCHITECTURE.md
TASKLIST.md
ROADMAP.md
RELEASE_NOTES.md
LEARNINGS.md
NAMING_GUIDE.md
CONTRIBUTING.md
docs/core/ENVIRONMENT_SETUP.md
docs/architecture/ARCHITECTURE.md
```

---

## 🚀 Git Naming

### Branch Names

**Format**: `type/short-description`

**Types**:
- `feature/` - New feature
- `fix/` - Bug fix
- `refactor/` - Code refactoring
- `docs/` - Documentation changes
- `chore/` - Maintenance tasks

**Examples**:
```
feature/achievement-system
fix/points-calculation-bug
refactor/mongoose-models
docs/update-architecture
chore/bump-dependencies
```

---

### Commit Messages

**Format**: Semantic commit messages
```
type(scope): Short description

[Optional longer description]

[Optional footer with issue references]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Examples**:
```
feat(gamification): Add XP and leveling system
fix(api): Correct points calculation for QUIZZZ
docs(readme): Update installation instructions
refactor(models): Consolidate player progression logic
chore(deps): Bump next from 15.5.1 to 15.5.2
```

---

### Git Tags

**Format**: `vMAJOR.MINOR.PATCH` (semantic versioning)
```
v1.0.0
v1.1.0
v1.1.1
v2.0.0
```

---

## 🔧 Utility Functions

### File Organization

**Utils Directory**: Group by domain
```
app/lib/utils/
  ├── points-calculator.ts
  ├── achievement-checker.ts
  ├── date-formatter.ts
  ├── validation-helpers.ts
  └── game-session-helpers.ts
```

**Function Naming**: Verb-first, descriptive
```typescript
export function calculatePointsForGame(gameType: GameType, score: number): number { }
export function formatTimestamp(date: Date): string { }
export function validateGameSession(session: GameSession): boolean { }
export async function checkAchievementUnlock(playerId: string, criteria: AchievementCriteria): Promise<boolean> { }
```

---

## 📊 Test Naming (Informational)

**Note**: Tests are prohibited by AI rule (ksglxIDdoNUOAOmXqrhl9h). This section is for reference only if policy changes.

**Test Files**: `*.test.ts` or `*.spec.ts` matching source file
```
player-progression.ts
player-progression.test.ts
```

**Test Descriptions**: Behavior-driven
```typescript
describe('PlayerProgressionManager', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => { });
    it('should return level 2 for 100 XP', () => { });
    it('should cap at level 100 for max XP', () => { });
  });
});
```

---

## 🌍 Localization (Future)

**Translation Keys**: dot-separated, lowercase
```json
{
  "game.quizzz.title": "QUIZZZ",
  "achievement.first_win.name": "First Victory",
  "error.session.not_found": "Game session not found",
  "ui.button.play_now": "Play Now"
}
```

---

## 📌 Quick Reference

| Context | Convention | Example |
|---------|-----------|---------|
| Files/Directories | kebab-case | `player-progression.ts` |
| Variables/Functions | camelCase | `const playerName` |
| Classes/Interfaces | PascalCase | `class PlayerManager` |
| Constants | UPPER_SNAKE_CASE | `MAX_LEVEL = 100` |
| React Components | PascalCase | `PlayerCard.tsx` |
| MongoDB Collections | PascalCase Singular | `Player` |
| Schema Fields | camelCase | `displayName` |
| API Routes | kebab-case | `/api/players` |
| JSON Fields | camelCase | `playerId` |
| CSS Classes | kebab-case | `.btn-primary` |
| Environment Variables | UPPER_SNAKE_CASE | `MONGODB_URI` |
| Git Branches | type/kebab-case | `feature/achievements` |
| Git Tags | Semantic Version | `v1.2.3` |

---

**Maintained By**: Narimato  
**Review Cycle**: Updated when new naming patterns are established  
**Enforcement**: Enforced via code review and linting where applicable
