# Contributing to Amanoba

**Version**: 1.0.0  
**Last Updated**: 2025-10-10T11:06:39.000Z

---

Welcome to the Amanoba project! This document outlines the development workflow, coding standards, and contribution guidelines for the team.

---

## 🎯 Project Overview

**Amanoba** is a unified gamification platform merging PlayMass and Madoku into a single, maintainable codebase. The project follows a strict development protocol to ensure consistency, quality, and traceability.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **Git**: Latest stable version
- **MongoDB Atlas**: Access to madoku-cluster (provided by admin)
- **Code Editor**: VS Code recommended with TypeScript and ESLint extensions

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/moldovancsaba/amanoba.git
   cd amanoba
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with actual credentials (ask team lead)
   ```

4. **Verify setup**:
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

---

## 📋 Development Workflow

### 1. Version Bumping (MANDATORY)

**Before ANY development work**, you MUST bump the version according to these rules:

#### Before `npm run dev`
- Increment **PATCH** version by +1
- Example: `1.0.0` → `1.0.1`
- Command: `npm run bump:patch` (once scripts are set up)

#### Before Committing to GitHub
- Increment **MINOR** version by +1, reset PATCH to 0
- Example: `1.0.5` → `1.1.0`
- Command: `npm run bump:minor` (once scripts are set up)

#### Major Releases (Explicit Instruction Only)
- Increment **MAJOR** version by +1, reset MINOR and PATCH to 0
- Example: `1.5.12` → `2.0.0`
- Command: `npm run bump:major` (once scripts are set up)

**Version must be synchronized in**:
- `package.json`
- `README.md`
- `ARCHITECTURE.md`
- `TASKLIST.md`
- `ROADMAP.md`
- `RELEASE_NOTES.md`
- `LEARNINGS.md`
- `NAMING_GUIDE.md`
- `CONTRIBUTING.md`
- `WARP.md`

---

### 2. Branching Strategy

**Branch Naming**: `type/short-description`

**Types**:
- `feature/` - New feature implementation
- `fix/` - Bug fixes
- `refactor/` - Code improvements without functional changes
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks (dependencies, config, etc.)

**Examples**:
```bash
git checkout -b feature/achievement-system
git checkout -b fix/points-calculation-error
git checkout -b docs/update-api-reference
```

**Main Branch**: `main` - Always deployable, protected

---

### 3. Making Changes

#### Code Quality Checklist

Before committing, ensure:

- ✅ **TypeScript**: No type errors (`npm run build` passes)
- ✅ **Naming Conventions**: Follow NAMING_GUIDE.md
- ✅ **Comments**: All code has "What" and "Why" comments
- ✅ **Reusability**: Searched for existing solutions before creating new code; same feature in 2+ places → one model/API/component with discriminator (see **docs/VOTING_AND_REUSE_PATTERN.md**)
- ✅ **Documentation**: Updated relevant docs (ARCHITECTURE.md, TASKLIST.md, etc.)
- ✅ **Functionality**: Tested manually in dev environment
- ✅ **Version**: Bumped correctly per versioning rules

---

### 4. Commit Messages

**Format**: Semantic commit messages

```
type(scope): Short imperative description

[Optional longer explanation of the change]

[Optional footer with references]
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code formatting (no functional change)
- `refactor` - Code restructuring
- `perf` - Performance improvements
- `chore` - Maintenance tasks

**Examples**:

```bash
git commit -m "feat(gamification): Add XP and leveling system

Implemented PlayerProgression model with XP tracking,
level calculation, and player title assignment.

Resolves tasks 3.3 from TASKLIST.md"
```

```bash
git commit -m "fix(api): Correct points calculation for WHACKPOP

Score multiplier was inverted causing incorrect point awards.
Updated calculation logic in game-session-end API."
```

```bash
git commit -m "docs(architecture): Update database schema section

Added details for new ReferralTracking model and updated
indexes documentation."
```

---

### 5. Push and Pull Request

#### Before Pushing

1. **Bump version to MINOR** (if not already done)
2. **Update documentation**:
   - `TASKLIST.md` - Mark tasks as done
   - `RELEASE_NOTES.md` - Add completed features/fixes
   - `LEARNINGS.md` - Add any insights or issues encountered
3. **Build verification**:
   ```bash
   npm run build
   ```
4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat(phase-2): Complete database layer implementation"
   git push origin feature/database-layer
   ```

#### Pull Request Guidelines

**Title**: Clear, imperative description  
**Example**: "Add achievement system with unlock tracking"

**Description Template**:
```markdown
## Summary
Brief description of changes

## Changes Made
- Added Achievement and AchievementUnlock models
- Created achievement-checker utility
- Implemented unlock API endpoint
- Added achievement display UI components

## Testing
- [ ] Builds successfully
- [ ] Tested locally in dev environment
- [ ] Documentation updated (ARCHITECTURE.md, TASKLIST.md)
- [ ] Version bumped correctly

## Related Tasks
- Completes task 3.2 in TASKLIST.md

## Screenshots (if applicable)
[Add screenshots or video if UI changes]
```

---

## 📚 Coding Standards

### Reuse via discriminator

When the same feature is needed in 2+ places (e.g. voting on courses, lessons, discussion posts), use **one model**, **one API**, and **one UI component** with a discriminator (e.g. `targetType`, `targetId`) to select context. Do not duplicate schemas, routes, or components. To add a new surface, extend the discriminator allow-list and reuse the same component. See **docs/VOTING_AND_REUSE_PATTERN.md** and **docs/layout_grammar.md** (§9).

### TypeScript

- **Strict Mode**: Enabled in `tsconfig.json`
- **Type Safety**: Avoid `any`, use proper types or `unknown`
- **Interfaces**: Prefer interfaces for object shapes
- **Enums**: Use for fixed sets of constants

### React Components

- **Functional Components**: Always use function syntax
- **Hooks**: Follow rules of hooks (no conditional calls)
- **Props**: Define explicit interface for all props
- **File Structure**: One component per file, matching filename

### API Routes

- **Runtime**: Specify `export const runtime = 'nodejs'` for MongoDB routes
- **Error Handling**: Always wrap in try-catch, return structured errors
- **Validation**: Use Zod schemas for request validation
- **Logging**: Use Pino logger, not console.log

### Database

- **Mongoose Models**: Define strict schemas with validation
- **Indexes**: Add indexes for all frequently queried fields
- **Transactions**: Use sessions for multi-document updates
- **Timestamps**: Always include `createdAt` and `updatedAt`

---

## 📖 Documentation Standards

### Only Related Items (Rule)

Each core document contains **only content that belongs there**. No unrelated items.
- **ROADMAP.md** — Future vision and client benefits only. No delivered items, no task-list items.
- **TASKLIST.md** — Open/actionable tasks only. No completed work (→ RELEASE_NOTES), no vision (→ ROADMAP).
- **RELEASE_NOTES.md** — Completed work only. No open tasks, no roadmap vision.
When editing any of these, remove or move content that does not belong.

### When to Update Docs

**Always update** when:
- Adding new features or components
- Changing database schema
- Modifying API endpoints
- Completing tasks
- Discovering insights or issues

### Which Docs to Update

| Change Type | Update These Docs |
|-------------|-------------------|
| New feature | ARCHITECTURE.md, TASKLIST.md, RELEASE_NOTES.md |
| Bug fix | RELEASE_NOTES.md, LEARNINGS.md |
| Database schema | ARCHITECTURE.md |
| API changes | ARCHITECTURE.md (Section 5) |
| New insight | LEARNINGS.md |
| Task completion | TASKLIST.md, RELEASE_NOTES.md |
| Version bump | ALL documentation files |

---

## 🚫 What NOT to Do

### Prohibited Actions

❌ **Do NOT create test files** - Tests are prohibited per AI rule (MVP Factory model)  
❌ **Do NOT use breadcrumb navigation** - Explicitly prohibited by design policy  
❌ **Do NOT hardcode configuration** - Use MongoDB Brand/GameBrandConfig models  
❌ **Do NOT skip version bumping** - Required before dev and commit  
❌ **Do NOT commit without documentation updates** - Part of Definition of Done  
❌ **Do NOT use inconsistent timestamp formats** - ISO 8601 with milliseconds only  
❌ **Do NOT expose secrets in code** - Use environment variables  

### Common Mistakes to Avoid

❌ Forgetting to update package.json version  
❌ Not testing build before pushing  
❌ Missing "Why" comments in code  
❌ Creating duplicate logic without checking existing code  
❌ Pushing without updating TASKLIST.md  
❌ Using `console.log` instead of Pino logger  

---

## ✅ Definition of Done

A task is considered **fully complete** only when:

1. ✅ **Functionality**: Manually verified in dev environment
2. ✅ **Version**: Bumped according to versioning protocol
3. ✅ **Documentation**: All relevant docs updated (ARCHITECTURE.md, TASKLIST.md, LEARNINGS.md, README.md, RELEASE_NOTES.md, ROADMAP.md)
4. ✅ **Build**: `npm run build` passes without errors
5. ✅ **Code Quality**: TypeScript strict mode satisfied, properly commented
6. ✅ **Git**: Committed with semantic message and pushed to GitHub

**No partial completion accepted.**

---

## 🔄 Continuous Integration

### Build Checks

Before every commit:
```bash
npm run build
```

This validates:
- TypeScript compilation
- Next.js build process
- Environment variable usage
- Import/export correctness

### Manual QA

No automated tests per project policy. Instead:
- Test all functionality manually in dev environment
- Verify UI rendering and responsiveness
- Check API endpoints with sample data
- Validate database operations in MongoDB Atlas

---

## 🆘 Getting Help

### Resources

- **ARCHITECTURE.md** - System design and data models
- **TECH_STACK.md** - Technology versions and tools
- **NAMING_GUIDE.md** - Naming conventions
- **LEARNINGS.md** - Common issues and solutions
- **docs/ENVIRONMENT_SETUP.md** - Setup troubleshooting

### Team Communication

- **Project Lead**: Csaba Moldovan (csaba@doneisbetter.com)
- **GitHub Issues**: Use for bug reports and feature requests
- **Pull Requests**: Use for code review and discussion

---

## 📅 Release Process

### Regular Releases (Minor Versions)

1. Complete all tasks for a phase (e.g., Phase 2)
2. Bump to next MINOR version (e.g., 1.0.5 → 1.1.0)
3. Update ALL documentation with new version
4. Run `npm run build` and verify
5. Commit with version message: `chore(release): Bump to v1.1.0`
6. Push to GitHub
7. Tag release: `git tag v1.1.0 && git push --tags`
8. Update RELEASE_NOTES.md with completed features

### Major Releases (e.g., v2.0.0)

Requires explicit instruction. Includes:
1. Complete documentation review
2. Security audit
3. Performance optimization
4. Production deployment preparation
5. LEARNINGS.md reflection

---

## 🎨 UI/UX Guidelines

### Design System

- **Colors**: Use Tailwind theme colors (indigo/pink/purple)
- **Typography**: Noto Sans (primary), Inter (secondary)
- **Spacing**: Use Tailwind spacing scale (4px base unit)
- **Components**: Radix UI primitives for accessibility
- **Animations**: Use predefined classes (`.animate-points`, `.animate-achievement`, etc.)

### Accessibility

- **WCAG AA**: Minimum standard
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: Minimum 4.5:1 for text

### Responsive Design

- **Mobile First**: Design for small screens, enhance for larger
- **Breakpoints**: Use Tailwind defaults (sm, md, lg, xl, 2xl)
- **Touch Targets**: Minimum 44x44px for interactive elements

---

## 🔐 Security Guidelines

### Environment Variables

- Never commit `.env.local`
- Use `NEXT_PUBLIC_` prefix only for client-safe variables
- Validate all environment variables at startup

### API Security

- Rate limiting on all public endpoints
- Input validation with Zod schemas
- Sanitize user-generated content
- Use HTTPS in production

### Database Security

- Never expose MongoDB URI in client code
- Use Mongoose validation for data integrity
- Implement proper access control in API routes

---

## 📊 Performance Guidelines

### Targets

- **API Response (p95)**: < 300ms
- **Error Rate**: < 0.5%
- **Lighthouse Score**: > 90 (all metrics)
- **Uptime**: 99.9%

### Optimization Strategies

- **Database**: Proper indexes, aggregation pipelines
- **Images**: Next.js Image component with optimization
- **Code Splitting**: Dynamic imports for large components
- **Caching**: React Query for data fetching
- **Bundle Size**: Monitor with `npm run build`

---

## 🧹 Maintenance

### Dependency Updates

- Check for updates monthly
- Test thoroughly before updating
- Lock versions (no `^` or `~` in package.json)
- Document breaking changes in LEARNINGS.md

### Database Maintenance

- Monitor collection sizes
- Review and optimize indexes quarterly
- Archive old EventLog entries (>90 days)
- Backup strategy documented in Phase 10.5

---

**Thank you for contributing to Amanoba!**

**Maintained By**: Narimato  
**Review Cycle**: Updated with process improvements or policy changes
