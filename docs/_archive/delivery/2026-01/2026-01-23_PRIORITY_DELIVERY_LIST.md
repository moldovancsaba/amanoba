# Priority Delivery List - Features from f20c34a Documentation

**Date**: 2026-01-23  
**Baseline**: Working version f20c34a  
**Strategy**: Redevelop features one by one, testing after each

---

## 🎯 Priority Order

### P0 - CRITICAL: Admin UI Improvements (Current Work)

**Status**: ⏳ IN PROGRESS  
**Estimated**: 1 day  
**Priority**: P0 (Quick wins, improves UX immediately)

**Tasks**:
1. Remove deprecated admin docs menu item
2. Add logout button to sidebar
3. Rename "Players" to "Users"
4. Show actual user name in top right

**Why First**: Quick, low-risk improvements that improve daily UX. No system changes required.

**Documentation**: `docs/_archive/delivery/2026-01/2026-01-23_ADMIN_UI_IMPROVEMENTS.md`

---

### P1 - HIGH: Certification System with Final Exam

**Status**: ⏳ PENDING  
**Estimated**: 5-7 days  
**Priority**: P1 (Major feature, business value)

**Why Second**: Complete, well-documented feature that adds significant value. Fully specified with implementation details.

**Phases**:
1. **Database Models** (Day 1-2) - Foundation
2. **Entitlement System** (Day 2-3) - Purchase/redeem flow
3. **Final Exam Flow** (Day 3-5) - Core functionality
4. **Certificate Management** (Day 5-6) - Verification and sharing
5. **Admin Interface** (Day 6-7) - Management tools

**Critical Rules**:
- Test after each phase
- DO NOT modify core auth files
- Keep NextAuth route handler simple
- Use MongoDB $sample for randomization

**Documentation**: 
- `docs/_archive/delivery/2026-01/2026-01-23_CERTIFICATION_SYSTEM.md`
- `docs/FEATURES_SINCE_F20C34A_COMPLETE_DOCUMENTATION copy.md` (Section 1)

**Dependencies**: None (can start immediately after admin UI)

---

### P2 - MEDIUM: Rate Limiting Integration

**Status**: ⏳ PENDING  
**Estimated**: 1-2 days  
**Priority**: P2 (Security improvement)

**Why Third**: Security enhancement. Rate limiting code exists but needs integration into all endpoints.

**Tasks**:
- Wire rate limiting into auth endpoints (5 req/15min)
- Wire rate limiting into API endpoints (100 req/15min)
- Wire rate limiting into admin endpoints (50 req/15min)
- Test rate limiting works correctly

**Documentation**: `docs/FEATURES_SINCE_F20C34A_COMPLETE_DOCUMENTATION copy.md` (mentioned in REDEVELOPMENT_PLAN.md)

**Dependencies**: None

---

### P3 - MEDIUM: SSO Role Management Enhancements

**Status**: ⏳ PENDING  
**Estimated**: 2-3 days  
**Priority**: P3 (Enhancement, not critical)

**Why Fourth**: Enhancement to existing SSO system. Role extraction from 15+ claim locations, UserInfo fallback.

**Tasks**:
- Enhanced role extraction from SSO tokens
- UserInfo endpoint fallback implementation
- Comprehensive logging
- Debug tools

**Documentation**: `docs/FEATURES_SINCE_F20C34A_COMPLETE_DOCUMENTATION copy.md` (Section 3.2)

**Dependencies**: None (SSO already works in f20c34a)

---

### P4 - LOW: Short Children Courses Feature

**Status**: ⏳ PENDING  
**Estimated**: 7-10 days  
**Priority**: P4 (Nice-to-have, complex)

**Why Last**: Complex feature, partially implemented. Can be done later when needed.

**Phases**:
1. Database schema (parentCourseId, courseVariant, etc.)
2. Forking UI
3. Lesson delivery logic
4. Quiz strategies
5. (Optional) Auto-sync

**Documentation**: 
- `docs/_archive/delivery/2026-01/2026-01-23_SHORT_COURSES_FEATURE.md`
- `docs/FEATURES_SINCE_F20C34A_COMPLETE_DOCUMENTATION copy.md` (Section 2)

**Dependencies**: Certification system (uses poolCourseId concept)

---

## 📋 Delivery Checklist

### Before Starting Any Feature

- [ ] Read feature documentation completely
- [ ] Understand business rules
- [ ] Review implementation checklist
- [ ] Check dependencies
- [ ] Verify working baseline (f20c34a) still works

### During Development

- [ ] Update feature document as you work
- [ ] Test after each phase/task
- [ ] DO NOT modify core auth files
- [ ] Keep NextAuth route handler simple
- [ ] Update TASKLIST.md with progress

### After Completion

- [ ] All tests pass
- [ ] Feature document updated
- [ ] TASKLIST.md updated
- [ ] RELEASE_NOTES.md updated
- [ ] ARCHITECTURE.md updated (if needed)
- [ ] Code reviewed

---

## 🚫 What NOT to Re-implement

**DO NOT re-implement these** (they broke the system):
- ❌ CORS wrapping on NextAuth route handler
- ❌ Excluding API routes from next.config.ts headers
- ❌ Disabling service worker fetch interception
- ❌ Simplifying JWT callback
- ❌ Adding props to SessionProvider
- ❌ Adding cache control to courses fetch

**Keep it simple** - the working version (f20c34a) is simple and works.

---

## 📊 Estimated Timeline

- **Week 1**: Admin UI Improvements (1 day) + Certification Phase 1-2 (2 days) = 3 days
- **Week 2**: Certification Phase 3-5 (4 days) = 4 days
- **Week 3**: Rate Limiting (1-2 days) + SSO Enhancements (2-3 days) = 3-5 days
- **Week 4+**: Short Courses (if needed) = 7-10 days

**Total**: ~11-18 days for P0-P3 features

---

## 🎯 Success Criteria

Each feature is considered complete when:
1. ✅ All tasks in feature document completed
2. ✅ All tests pass
3. ✅ No breaking changes to existing functionality
4. ✅ Documentation updated
5. ✅ Code reviewed and committed

---

**Last Updated**: 2026-01-23  
**Next Work**: Admin UI Improvements (P0)
