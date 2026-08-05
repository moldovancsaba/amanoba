# 🚀 What's Next — Development Ready

**Date**: 2026-08-05  
**Status**: Environment fully prepared, ready for feature work  
**Last Commit**: b7c4d533

---

## ✅ Everything Is Ready

Your Amanoba development environment is **100% ready**. Here's what's been completed:

### 1. Environment Setup ✅
- Vercel CLI authenticated and project linked
- Environment variables pulled from Vercel (all production secrets)
- Development server running successfully
- Database connected (MongoDB Atlas)
- Authentication configured (SSO via sso.doneisbetter.com)
- Email provider configured
- All 17 locales available

### 2. Knowledge Baseline ✅
- Complete platform understanding documented (1,200+ lines)
- Course system deep dive completed (1,025 lines)
- Customer journey mapped (discovery → certification → sharing)
- Database schema analyzed (8 core models)
- API endpoints documented (30+ routes)
- Business rules captured (access control, gamification, privacy)

### 3. Workflow Defined ✅
- Git branching strategy (`sentinel-squad/` prefix)
- Testing workflow (Vercel preview deployments, no localhost)
- Quality gate sequence (lint → type-check → test → docs:check)
- Deployment flow (preview → production)

### 4. Documentation Complete ✅
- 8 new comprehensive documents created
- Handover updated with all changes
- Quick reference guides available
- Navigation index in START_HERE.md

---

## 🎯 What You Should Do Next

### Option 1: Start Working on a Specific Task

**Check for assigned work**:

```bash
gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10
```

**Then create a feature branch and start coding**:

```bash
git checkout -b sentinel-squad/<feature-name>
# Make your changes
npm run lint && npm run type-check && npm test
git add -A && git commit -m "feat: descriptive message"
git push origin sentinel-squad/<feature-name>
# Test on Vercel preview URL
```

### Option 2: Explore and Understand More

**Deep dive into specific areas**:

- **Course authoring**: Read `docs/canonical/` for Canonical Course Specs (CCS)
- **UI components**: Explore `app/components/` and GDS patterns
- **API design**: Review `app/api/` routes and business logic
- **Database models**: Study `app/lib/models/` for data structure
- **Background workers**: Check `app/lib/workers/` for email and jobs

### Option 3: Address Technical Debt or Improvements

**Areas that could use attention** (if no specific task assigned):

- Documentation gaps (if any)
- Test coverage improvements
- Type safety enhancements
- UI/UX refinements
- Performance optimizations

---

## 📋 Quick Action Guide

### I Want to Build a New Course

1. Read `docs/architecture/layout_grammar.md` (layout rules)
2. Read `COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md` (course structure)
3. Check `docs/canonical/<COURSE_FAMILY>/` for CCS (if related family exists)
4. Follow course creation flow in `COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md` Section 8
5. Ensure language integrity (email fields must be in-language)
6. Test via Vercel preview deployment

### I Want to Fix a Bug

1. Read `READMEDEV.md` for context
2. Check `docs/HANDOVER.md` for recent changes
3. Create feature branch: `git checkout -b sentinel-squad/fix-<issue>`
4. Make fix and add test
5. Run quality gates: `npm run lint && npm run type-check && npm test`
6. Push and test on Vercel preview
7. Merge to main

### I Want to Add a New Feature

1. Read `docs/product/TASKLIST.md` for priority
2. Read relevant architecture docs (layout_grammar.md if touching UI/content)
3. Plan rollback strategy (required!)
4. Create feature branch
5. Implement feature with tests
6. Update documentation (HANDOVER.md if runtime behavior changes)
7. Run quality gates
8. Push and test on Vercel preview
9. Merge to main

### I Want to Improve Documentation

1. Read `docs/core/agent_working_loop_canonical_operating_document.md` (doc rules)
2. Identify gaps or outdated content
3. Make updates (no TBD or placeholders!)
4. Run `npm run docs:check` and `npm run docs:links:check`
5. Push to main

---

## 🔑 Critical Reminders

### Before Every Change

- [ ] **Rollback plan required** (current baseline SHA + exact rollback steps)
- [ ] **Documentation = code** (update docs with every change)
- [ ] **Testing via preview** (no localhost access in Cloud Agent environment)
- [ ] **Quality gates pass** (lint, type-check, test, docs:check)

### When Working on Courses

- [ ] **Quiz authority**: Use `course.lessonQuizPolicy` (NOT `lesson.quizConfig`)
- [ ] **Language integrity**: Email fields must be in-language
- [ ] **CCS alignment**: Follow Canonical Course Specs in `docs/canonical/`
- [ ] **Layout grammar**: Read `docs/architecture/layout_grammar.md` first

### When Working on Certification

- [ ] **Entitlement flow**: Eligibility → Purchase → Exam → Issue
- [ ] **Certificate privacy**: Respect `isPublic` flag
- [ ] **Verification slug**: Unique, immutable, public URL

### When Working on Profiles

- [ ] **Two-level privacy**: Profile + section-level controls
- [ ] **OpenGraph tags**: For LinkedIn/social media sharing
- [ ] **Owner-only edits**: Privacy settings changeable only by owner

---

## 📚 Documentation Quick Reference

| Need to... | Read This |
|-----------|----------|
| Get started quickly | `START_HERE.md` |
| Understand platform | `AMANOBA_LEARNING_SUMMARY.md` |
| Work on courses | `COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md` |
| Daily brain boost | `READMEDEV.md` |
| Check runtime changes | `docs/HANDOVER.md` |
| Test features | `CLOUD_AGENT_DEPLOYMENT_WORKFLOW.md` |
| Verify environment | `ENVIRONMENT_READY_CHECKLIST.md` |
| Follow layout rules | `docs/architecture/layout_grammar.md` |
| Understand architecture | `docs/architecture/ARCHITECTURE.md` |
| See open tasks | `docs/product/TASKLIST.md` |

---

## 🚀 Example Development Flow

### Scenario: Add a new course feature

```bash
# 1. Brain boost
git fetch origin && git status -sb
cat READMEDEV.md
tail -100 docs/HANDOVER.md

# 2. Read relevant docs
cat COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md  # Course system
cat docs/architecture/layout_grammar.md    # Layout rules

# 3. Create branch
git checkout -b sentinel-squad/add-course-feature

# 4. Implement feature
# ... edit files ...

# 5. Run quality gates
npm run lint
npm run type-check
npm test
npm run docs:check

# 6. Update documentation
# ... edit docs/HANDOVER.md if runtime behavior changed ...

# 7. Commit and push
git add -A
git commit -m "feat: add course feature with tests and docs"
git push origin sentinel-squad/add-course-feature

# 8. Test on preview
# Visit: https://amanoba-sentinel-squad-add-course-feature-moldovan.vercel.app
# Or: Get URL from Vercel CLI: npx vercel ls

# 9. Merge to main (after preview testing)
git checkout main
git pull origin main
git merge sentinel-squad/add-course-feature
git push origin main

# 10. Production auto-deploys
# Monitor: https://www.amanoba.com
```

---

## 🎯 Suggested First Tasks

If no specific work assigned, consider these options:

### 1. Code Quality Improvements

- Run `npm run lint` and fix any warnings
- Run `npm run type-check` and address any type issues
- Run `npm test` and ensure 100% passing
- Run `npm run docs:links:check` and fix broken links

### 2. Documentation Enhancements

- Review `docs/product/TASKLIST.md` for completeness
- Check `docs/HANDOVER.md` for consistency
- Validate `COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md` against live code
- Update `docs/status/PRODUCTION_STATUS.md` if needed

### 3. Environment Verification

- Build the project: `npm run build`
- Run UI checks: `npm run ui:check:foundation`
- Run GDS checks: `npm run ui:gds:check`
- Verify all quality gates pass

### 4. Feature Work

- Check MVP Factory Board for assigned issues
- Review `docs/product/ROADMAP.md` for vision alignment
- Implement high-priority items from `docs/product/TASKLIST.md`

---

## 🎉 You're All Set!

**Environment**: ✅ Fully ready  
**Knowledge**: ✅ Complete  
**Workflow**: ✅ Defined  
**Documentation**: ✅ Comprehensive  

**Next step**: Choose a task and start coding! 🚀

---

**Questions or Clarifications?**

If you need clarification on:
- How a specific system works → Read relevant section in `AMANOBA_LEARNING_SUMMARY.md` or `COURSE_SYSTEM_AND_CUSTOMER_JOURNEY.md`
- How to test changes → Read `CLOUD_AGENT_DEPLOYMENT_WORKFLOW.md`
- What tasks are open → Check `docs/product/TASKLIST.md` or MVP Factory Board
- Recent changes → Read `docs/HANDOVER.md`
- Environment status → Read `ENVIRONMENT_READY_CHECKLIST.md`

All documentation is in the repository and ready to reference.

---

**Last Updated**: 2026-08-05T10:15:00Z  
**Commit**: b7c4d533  
**Status**: 🚀 READY TO START FEATURE WORK
