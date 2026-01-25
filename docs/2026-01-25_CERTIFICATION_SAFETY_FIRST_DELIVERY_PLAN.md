# Certification System - Safety-First Delivery Plan

**Date Created**: 2026-01-25  
**Status**: 🟢 READY TO EXECUTE  
**Approach**: Ultra-Safe Incremental with Mandatory Checkpoints  
**Safety Checkpoint**: `v2.9.3-stable-profile-fix` (commit `a2a8785`)

---

## 🎯 Mission Statement

Complete the certification system user-facing features (verification, rendering, profile integration) using a **fail-safe, checkpoint-based approach** that prevents cascading failures and allows immediate rollback at any sign of trouble.

---

## 🛡️ Core Safety Principles

1. **One Change Per Commit**: Never bundle multiple changes
2. **Test After Every Change**: Build + browser test before proceeding
3. **Checkpoint Before Major Steps**: Tag commits before risky operations
4. **Stop on Any Red Flag**: Rollback immediately, don't try to fix
5. **New Files Only**: Zero modifications to existing working code
6. **Translations First**: Always add translations before using them

---

## 📋 Implementation Phases

### Phase 0: Pre-Flight Safety Check ✅ COMPLETE
- ✅ Current stable checkpoint: `v2.9.3-stable-profile-fix`
- ✅ All failures documented
- ✅ Lessons learned captured
- ✅ System verified working

---

### Phase 1: Translations Foundation (CRITICAL - DO FIRST)

**Goal**: Add certificate translations to all 11 languages BEFORE any pages use them

**Why First**: Missing translations broke entire site last time

**Checkpoint**: After translations added and verified

#### Step 1.1: Add English Translations
- [ ] Add `certificates` namespace to `messages/en.json`
- [ ] Verify JSON syntax valid
- [ ] Build: `npm run build` (must pass)
- [ ] Commit: `feat: Add certificate translations - English`

#### Step 1.2: Add Hungarian Translations
- [ ] Add `certificates` namespace to `messages/hu.json`
- [ ] Verify JSON syntax valid
- [ ] Build: `npm run build` (must pass)
- [ ] Commit: `feat: Add certificate translations - Hungarian`

#### Step 1.3: Add Remaining 9 Languages
- [ ] Add to: pl, ru, tr, bg, pt, hi, vi, id, ar
- [ ] Verify JSON syntax in ALL files
- [ ] Build: `npm run build` (must pass)
- [ ] Commit: `feat: Add certificate translations - All languages`

#### Step 1.4: Verification & Checkpoint
- [ ] Test: Verify translations load in browser
- [ ] Test: Check all 11 languages
- [ ] Build: Final verification
- [ ] **CHECKPOINT**: Tag as `certification-phase1-translations-complete`
- [ ] Commit: `docs: Phase 1 complete - Translations verified`

**Rollback Point**: If ANY step fails, rollback to `v2.9.3-stable-profile-fix`

---

### Phase 2: Certificate Verification API (Isolated Route)

**Goal**: Create public certificate verification API route (NEW FILE ONLY)

**Checkpoint**: After API route created and tested

#### Step 2.1: Create Verification API Route
- [ ] Create `app/api/certificates/[slug]/route.ts` (NEW FILE ONLY)
- [ ] Implement GET handler (fetch by verification slug)
- [ ] Implement privacy check (public/private logic)
- [ ] Implement PATCH handler (privacy toggle - owner only)
- [ ] Build: `npm run build` (must pass)
- [ ] Commit: `feat: Phase 2.1 - Certificate verification API route`

#### Step 2.2: Test Verification API
- [ ] Test: GET with valid public slug
- [ ] Test: GET with invalid slug (404)
- [ ] Test: GET with private slug (non-owner - 404)
- [ ] Test: GET with private slug (owner - success)
- [ ] Test: PATCH privacy toggle (owner)
- [ ] Test: PATCH privacy toggle (non-owner - 403)
- [ ] **CHECKPOINT**: Tag as `certification-phase2-api-complete`
- [ ] Commit: `docs: Phase 2.1 complete - API tested`

**Rollback Point**: If API fails, rollback to `certification-phase1-translations-complete`

---

### Phase 3: Certificate Render API (Image Generation)

**Goal**: Create certificate image generation API (NEW FILE - CRITICAL REQUIREMENTS)

**Checkpoint**: After render API created and tested

#### Step 3.1: Create Render API Route
- [ ] Create `app/api/certificates/[certificateId]/render/route.tsx` (NEW FILE - .tsx extension)
- [ ] **CRITICAL**: Add `export const runtime = 'nodejs'`
- [ ] **CRITICAL**: Add `export const dynamic = 'force-dynamic'`
- [ ] Import `ImageResponse` from `next/og`
- [ ] Implement GET handler with JSX template
- [ ] Support variants: `share_1200x627`, `print_a4`
- [ ] Build: `npm run build` (must pass)
- [ ] Commit: `feat: Phase 3.1 - Certificate render API route`

#### Step 3.2: Test Render API
- [ ] Test: GET with valid certificateId (returns PNG)
- [ ] Test: GET with variant=share_1200x627 (LinkedIn size)
- [ ] Test: GET with variant=print_a4 (A4 size)
- [ ] Test: GET with invalid certificateId (404)
- [ ] Verify image dimensions correct
- [ ] **CHECKPOINT**: Tag as `certification-phase3-render-complete`
- [ ] Commit: `docs: Phase 3.1 complete - Render API tested`

**Rollback Point**: If render API fails, rollback to `certification-phase2-api-complete`

---

### Phase 4: Certificate Verification Page (Frontend)

**Goal**: Create public certificate verification page (NEW FILE ONLY)

**Checkpoint**: After page created and tested

#### Step 4.1: Create Verification Page
- [ ] Create `app/[locale]/certificate/[slug]/page.tsx` (NEW FILE ONLY)
- [ ] Use `useTranslations('certificates')` (translations exist from Phase 1)
- [ ] Implement params unwrapping (async/await pattern)
- [ ] Implement data fetching with `useQuery`
- [ ] Implement loading states
- [ ] Implement error states
- [ ] Build: `npm run build` (must pass)
- [ ] Commit: `feat: Phase 4.1 - Certificate verification page`

#### Step 4.2: Add Page Features
- [ ] Add certificate display (title, recipient, score, date)
- [ ] Add status badges (verified/revoked)
- [ ] Add privacy toggle (owner only)
- [ ] Add copy link functionality
- [ ] Add download image functionality
- [ ] Build: `npm run build` (must pass)
- [ ] Commit: `feat: Phase 4.2 - Certificate page features`

#### Step 4.3: Test Verification Page
- [ ] Test: Navigate to valid public certificate
- [ ] Test: Navigate to invalid slug (error page)
- [ ] Test: Navigate to private certificate (non-owner - error)
- [ ] Test: Navigate to private certificate (owner - success)
- [ ] Test: Privacy toggle works
- [ ] Test: Copy link works
- [ ] Test: Download image works
- [ ] **CHECKPOINT**: Tag as `certification-phase4-page-complete`
- [ ] Commit: `docs: Phase 4 complete - Verification page tested`

**Rollback Point**: If page fails, rollback to `certification-phase3-render-complete`

---

### Phase 5: Profile Certificates API (Isolated Route)

**Goal**: Create API to fetch certificates for profile display (NEW FILE ONLY)

**Checkpoint**: After API created and tested

#### Step 5.1: Create Profile Certificates API
- [ ] Create `app/api/profile/[playerId]/certificates/route.ts` (NEW FILE ONLY)
- [ ] Implement GET handler (list certificates for player)
- [ ] Sort by issue date (newest first)
- [ ] Enrich with course info
- [ ] Build: `npm run build` (must pass)
- [ ] Commit: `feat: Phase 5.1 - Profile certificates API route`

#### Step 5.2: Test Profile Certificates API
- [ ] Test: GET with valid playerId (returns certificates)
- [ ] Test: GET with invalid playerId (empty array or error)
- [ ] Test: Verify sorting (newest first)
- [ ] Test: Verify course enrichment
- [ ] **CHECKPOINT**: Tag as `certification-phase5-api-complete`
- [ ] Commit: `docs: Phase 5 complete - Profile API tested`

**Rollback Point**: If API fails, rollback to `certification-phase4-page-complete`

---

### Phase 6: Profile Certificates Tab (Integration)

**Goal**: Add certificates tab to profile page (MODIFIES EXISTING FILE - HIGH RISK)

**Checkpoint**: Before and after each change

#### Step 6.1: Pre-Integration Checkpoint
- [ ] **CHECKPOINT**: Tag current state as `certification-before-profile-integration`
- [ ] Verify profile page works correctly
- [ ] Test all existing profile tabs
- [ ] Commit: `docs: Pre-integration checkpoint - Profile page verified`

#### Step 6.2: Add Certificates Tab Button
- [ ] Add "Certificates" tab to tab navigation
- [ ] Add tab icon (Trophy or Award)
- [ ] Add tab state management
- [ ] Build: `npm run build` (must pass)
- [ ] Test: Tab button appears and works
- [ ] Commit: `feat: Phase 6.2 - Add certificates tab button`

#### Step 6.3: Add Certificates API Call
- [ ] Add `useEffect` to fetch certificates
- [ ] Add loading state
- [ ] Add error handling
- [ ] **CRITICAL**: Define all variables BEFORE useEffect
- [ ] Build: `npm run build` (must pass)
- [ ] Test: API call works
- [ ] Commit: `feat: Phase 6.3 - Add certificates API call`

#### Step 6.4: Add Certificates Display
- [ ] Add certificates list display
- [ ] Add certificate cards (course, score, date)
- [ ] Add "View Certificate" links
- [ ] Add empty state (no certificates)
- [ ] Build: `npm run build` (must pass)
- [ ] Test: Certificates display correctly
- [ ] Commit: `feat: Phase 6.4 - Add certificates display`

#### Step 6.5: Final Integration Test
- [ ] Test: Profile page loads correctly
- [ ] Test: All tabs work (Overview, Achievements, Activity, Payments, Certificates)
- [ ] Test: Certificates tab shows certificates
- [ ] Test: Certificates tab shows empty state
- [ ] Test: "View Certificate" links work
- [ ] **CHECKPOINT**: Tag as `certification-phase6-integration-complete`
- [ ] Commit: `docs: Phase 6 complete - Profile integration tested`

**Rollback Point**: If ANY step fails, rollback to `certification-before-profile-integration`

---

## 🚨 Red Flags - Stop Immediately

If ANY of these occur, **STOP IMMEDIATELY** and rollback:

1. ❌ Build fails (any errors or warnings)
2. ❌ Linter fails (any errors)
3. ❌ Dashboard breaks
4. ❌ Admin pages break
5. ❌ Profile page breaks (existing tabs)
6. ❌ Any page shows sign-in instead of content
7. ❌ Translation errors in console
8. ❌ React Hook errors
9. ❌ Runtime errors in browser console
10. ❌ API routes return 500 errors

**Response**: Rollback to last checkpoint, document issue, wait for approval before proceeding.

---

## 📊 Progress Tracking

### Phase Completion Status

- [ ] Phase 0: Pre-Flight Safety Check ✅ COMPLETE
- [ ] Phase 1: Translations Foundation (4 steps)
- [ ] Phase 2: Certificate Verification API (2 steps)
- [ ] Phase 3: Certificate Render API (2 steps)
- [ ] Phase 4: Certificate Verification Page (3 steps)
- [ ] Phase 5: Profile Certificates API (2 steps)
- [ ] Phase 6: Profile Certificates Tab (5 steps)

**Total Steps**: 18 steps across 6 phases

---

## 🔄 Rollback Commands

### Rollback to Safety Checkpoint
```bash
git reset --hard v2.9.3-stable-profile-fix
git push --force
```

### Rollback to Phase Checkpoint
```bash
# Phase 1
git reset --hard certification-phase1-translations-complete

# Phase 2
git reset --hard certification-phase2-api-complete

# Phase 3
git reset --hard certification-phase3-render-complete

# Phase 4
git reset --hard certification-phase4-page-complete

# Phase 5
git reset --hard certification-phase5-api-complete

# Phase 6 (before integration)
git reset --hard certification-before-profile-integration
```

---

## ✅ Success Criteria

**Phase Complete When**:
1. ✅ All steps in phase completed
2. ✅ Build passes (0 errors, 0 warnings)
3. ✅ Linter passes
4. ✅ Manual testing passes
5. ✅ No regressions in existing features
6. ✅ Checkpoint tag created
7. ✅ Documentation updated

**Project Complete When**:
1. ✅ All 6 phases complete
2. ✅ All features tested
3. ✅ No regressions
4. ✅ Final checkpoint created
5. ✅ Documentation complete

---

## 📝 Testing Protocol

### After Every Commit
1. Run `npm run build` - must pass
2. Run linter check - must pass
3. Test in browser - must work
4. Verify no regressions

### After Every Phase
1. Comprehensive testing
2. Verify all features work
3. Verify no regressions
4. Create checkpoint tag
5. Update documentation

---

## 🎯 Execution Rules

1. **One Step at a Time**: Complete one step, test, commit, then proceed
2. **No Skipping**: Don't skip steps or combine changes
3. **Test First**: Always test before committing
4. **Stop on Error**: Rollback immediately on any error
5. **Document Everything**: Update docs after each phase
6. **User Approval**: Wait for user confirmation after each phase

---

## 📚 Reference Documents

- **Failures**: `docs/2026-01-25_CRITICAL_FAILURES_AND_LEARNINGS.md`
- **Status**: `docs/2026-01-25_CERTIFICATION_SYSTEM_STATUS.md`
- **Plan**: `docs/certification_final_exam_plan_v5.md`
- **Operating Rules**: `agent_working_loop_canonical_operating_document.md`

---

**Plan Status**: ✅ READY TO EXECUTE  
**Risk Level**: LOW (with checkpoints and rollback safety)  
**Estimated Time**: 2-3 days (with proper testing)

---

**Created**: 2026-01-25  
**Last Updated**: 2026-01-25  
**Following**: `agent_working_loop_canonical_operating_document.md`
