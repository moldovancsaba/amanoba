# Multi-Language Course Adoption POC - Issue Decomposition

**Created:** 2026-08-09  
**Status:** Issues Created, Ready for Execution  
**Milestone:** Multi-Language Course Adoption POC  
**Target Completion:** 2026-09-30

---

## Executive Summary

Successfully decomposed the multi-language course adoption plan into **3 production-grade engineering issues** following the canonical issue format from [GDS Issue #81](https://github.com/sovereignsquad/general-design-system/issues/81).

**Total Scope:** Proof of concept for translating 2 courses into Spanish with professional quality, validating the Tier 2 approach (AI + human review) before scaling to 16 languages.

---

## Issues Created

### Issue #909: Translation Infrastructure Foundation
**URL:** https://github.com/moldovancsaba/mvp-factory-control/issues/909  
**Type:** Infrastructure  
**Priority:** P0 (Blocking)  
**Estimated Effort:** 3-5 days

**Scope:**
- AI/ML terminology glossary (100+ terms × 17 languages)
- Content extraction pipeline (Course → JSON)
- Quality validation pipeline (STRICT enforcement + language leakage detection)
- Course variant generation scripts
- MongoDB indexes for language variants

**Key Deliverables:**
- `translation_glossary` MongoDB collection
- `npm run translate:extract` - Extract English course content
- `npm run translate:validate` - Validate translated content
- `npm run translate:generate` - Create course variant
- `docs/translation/TRANSLATION_INFRASTRUCTURE.md`

**Acceptance Criteria:** 10 AC including idempotent scripts, STRICT validation passing, glossary seeded

**Dependencies:** None (foundation work)

---

### Issue #910: Spanish Translation Pilot (POC)
**URL:** https://github.com/moldovancsaba/mvp-factory-control/issues/910  
**Type:** Translation Workflow  
**Priority:** P1 (High)  
**Estimated Effort:** 1-2 days (AI) + 2-4 hours (human review)

**Scope:**
- Translate Stage 1 (AI for Dummies) into Spanish using GPT-4
- Native speaker expert review and refinement
- Quality validation (STRICT standards)
- Deploy Spanish course variant to production

**Key Deliverables:**
- `AI_DUMMIES_1DAY_ES` course in production MongoDB
- Validated Spanish translations (≥70 lesson score, ≥75 quiz scores)
- Zero English leakage
- Pilot report with cost/time/quality metrics

**Acceptance Criteria:** 10 AC including native speaker ≥4.5/5 rating, ≤4 hours total time, ≤$250 cost

**Dependencies:** **Blocks on Issue #909** (infrastructure must be complete first)

---

### Issue #911: Multi-Language Course Discovery UI (GDS)
**URL:** https://github.com/moldovancsaba/mvp-factory-control/issues/911  
**Type:** UI/UX  
**Priority:** P1 (High)  
**Estimated Effort:** 2-3 days

**Scope:**
- Language filter on course catalog (GDS SegmentedControl)
- Language badges on course cards (GDS Badge)
- "Also available in" indicators (GDS components)
- Browser language auto-detection
- Keyboard navigation + screen reader support

**Key Deliverables:**
- Language filter component (GDS only)
- Language badge component (GDS only)
- Language variants indicator (GDS only)
- URL-based filter state (`?lang=es`)
- Accessibility compliance (WCAG 2.1 AA)

**Acceptance Criteria:** 10 AC including GDS-only components, accessibility tests passing, Lighthouse ≥95

**Dependencies:** Can be developed in parallel with #910 (use mock data for testing)

---

## Execution Order

```
Timeline View:
─────────────────────────────────────────────────────────────────

Week 1-2: Issue #909 (Infrastructure)
├─ Glossary seeding
├─ Extraction scripts
├─ Validation pipeline
└─ Generation scripts
        ↓
Week 2-3: Issue #910 (Spanish Pilot) ← BLOCKS on #909
├─ AI translation (GPT-4)
├─ Human review
├─ Validation
└─ Deployment
        ↓
Week 2-3: Issue #911 (UI) ← Can run parallel with #910
├─ Language filter (GDS)
├─ Language badges (GDS)
├─ Accessibility tests
└─ Mobile responsive

Total Duration: ~3-4 weeks
```

### Parallel Execution Opportunities
- **Issue #911** (UI) can start during Week 2 while #910 is in progress
- Use mock Spanish course data for UI development
- Merge UI before or after Spanish pilot completes

---

## Issue Quality Standards Met

All issues follow the canonical format from [GDS Issue #81](https://github.com/sovereignsquad/general-design-system/issues/81):

### ✅ Required Sections (All Issues)
1. **Executive Summary** - Clear, concise capability description
2. **Business / Product Context** - Real-world problem, opportunity, constraints
3. **Current State** - Exact architecture, flows, limitations
4. **Problem Statement** - Measurable, operational, architectural
5. **Goals** - Functional, Technical, UX (separated)
6. **Non-Goals** - Explicit scope boundaries
7. **Mandatory Technical Constraints** - GDS requirement (for UI), operational constraints
8. **Architecture** - System diagrams, runtime flows, storage interactions
9. **API / Contracts** - TypeScript interfaces, schemas, data structures
10. **Pseudo-code / Key Logic** - Implementation guidance
11. **Acceptance Criteria** - 10+ measurable AC per issue
12. **Testing Strategy** - Unit, integration, manual tests with code examples
13. **Operational Behavior** - Retries, timeouts, rollback, error handling
14. **Edge Cases** - 4+ edge cases with mitigation strategies
15. **Dependencies** - Blocking and non-blocking dependencies clearly stated
16. **Documentation Requirements** - Specific docs to create/update
17. **Success Metrics** - Measurable business and technical metrics
18. **Definition of Done** - Comprehensive checklist

### ✅ Quality Characteristics Achieved
- **Minimal ambiguity** - All implementation details specified
- **Architectural clarity** - Diagrams, flows, component trees provided
- **Measurable criteria** - Concrete numbers, percentages, thresholds
- **Operational handover** - Monitoring, error handling, rollback documented
- **GDS constraints** - Explicit requirement for UI work (Issue #911)
- **Accessibility mandatory** - WCAG 2.1 AA compliance required
- **Independent execution** - Each issue can be picked up and executed without clarification
- **Production safety** - Rollback strategies, idempotency, transaction wrapping

---

## Cost & Effort Summary

### Issue #909: Infrastructure
- **Developer Time:** 3-5 days
- **Cost:** $0 (internal development)
- **Complexity:** Medium-High (foundation work, many moving parts)

### Issue #910: Spanish Pilot
- **AI Translation:** ~$0.50 (GPT-4 API)
- **Human Review:** $60-200 (2-4 hours @ $30-50/hr)
- **Developer Time:** 1-2 days (tooling, deployment)
- **Total Cost:** ~$125-250 per course
- **Complexity:** Medium (workflow validation)

### Issue #911: UI
- **Developer Time:** 2-3 days
- **Cost:** $0 (internal development)
- **Complexity:** Medium (GDS integration, accessibility)

### **Total POC Cost: ~$125-250** (Spanish translation only)
### **Total POC Duration: ~3-4 weeks** (with parallel execution)

---

## Risk Mitigation

### Risk 1: Infrastructure Takes Longer Than Expected
**Impact:** Delays Spanish pilot  
**Mitigation:** Issue #909 has clear acceptance criteria and testing strategy. Can be developed iteratively.

### Risk 2: Spanish Translation Quality Below Target
**Impact:** POC fails, need to pivot Tier 2 approach  
**Mitigation:** Clear quality gates (≥4.5/5 rating, STRICT validation). If fails, can increase human review time or adjust prompts.

### Risk 3: UI Accessibility Issues
**Impact:** Cannot deploy multi-language discovery  
**Mitigation:** GDS components are pre-tested for accessibility. Axe tests and screen reader testing built into DoD.

### Risk 4: GDS Components Not Sufficient
**Impact:** Need to request new GDS components, delays UI  
**Mitigation:** Issue #911 specifies exact GDS components needed (all exist: Badge, SegmentedControl, Select, Group, Stack). Pre-verified availability.

---

## Success Criteria (POC Level)

### Must Have (P0)
- [ ] All 3 issues completed and merged to `main`
- [ ] Spanish course live in production (`AI_DUMMIES_1DAY_ES`)
- [ ] Translation quality ≥4.5/5 by native speaker
- [ ] Students can discover and enroll in Spanish course via UI
- [ ] Zero critical bugs in multi-language experience

### Should Have (P1)
- [ ] POC completed within 4 weeks
- [ ] Cost ≤$250 for Spanish translation
- [ ] UI passes accessibility tests (Lighthouse ≥95)
- [ ] Workflow documented and repeatable

### Nice to Have (P2)
- [ ] Automation opportunities identified for scale phase
- [ ] Performance benchmarks documented
- [ ] Student feedback collected (early adopters)

---

## Next Steps After POC

If POC successful:
1. **Issue #912** (future): Chinese translation pilot
2. **Issue #913** (future): Hindi translation pilot
3. **Issue #914** (future): Scale to remaining 13 languages (batch processing)
4. **Issue #915** (future): Stage 2 translation (3-day course) for all languages
5. **Issue #916** (future): Certificate generation multi-language support
6. **Issue #917** (future): Email templates multi-language support

If POC fails:
- Analyze failure modes (cost, time, quality)
- Pivot to Tier 3 (AI-only with validation) or fully manual (Tier 1)
- Re-estimate and re-plan before scaling

---

## Repository Artifacts

### Issues Created
- ✅ https://github.com/moldovancsaba/mvp-factory-control/issues/909
- ✅ https://github.com/moldovancsaba/mvp-factory-control/issues/910
- ✅ https://github.com/moldovancsaba/mvp-factory-control/issues/911

### Documentation Created
- ✅ `docs/product/MULTI_LANGUAGE_COURSE_ADOPTION_PLAN.md` (comprehensive strategy)
- ✅ `docs/product/MULTI_LANGUAGE_POC_ISSUES.md` (this document)

### Future Documentation (created during execution)
- `docs/translation/TRANSLATION_INFRASTRUCTURE.md` (Issue #909)
- `docs/translation/SPANISH_PILOT_REPORT.md` (Issue #910)
- `components/courses/README.md` (Issue #911)

---

## Optimizations for Independent Execution

Each issue is optimized for:
- **Predictable delivery** - Clear AC, testing strategy, edge cases defined
- **Low clarification overhead** - All implementation details in issue body
- **Independent execution** - Developer can pick up and deliver without PO input
- **Production safety** - Rollback, error handling, idempotency documented
- **Operational clarity** - Monitoring, observability, retries specified

No vague tickets. No umbrella tasks. Every issue is a shippable unit of work.

---

## Conclusion

✅ **POC scope decomposed into 3 production-grade engineering issues**  
✅ **All issues follow canonical GDS Issue #81 format**  
✅ **Dependencies clearly defined with execution order**  
✅ **Cost estimated at ~$125-250 for Spanish translation**  
✅ **Timeline estimated at 3-4 weeks with parallel execution**  
✅ **All UI work constrained to GDS (no custom components)**  
✅ **Accessibility mandatory (WCAG 2.1 AA, Lighthouse ≥95)**  

**Ready for execution. Issues available at:**
- https://github.com/moldovancsaba/mvp-factory-control/issues/909
- https://github.com/moldovancsaba/mvp-factory-control/issues/910
- https://github.com/moldovancsaba/mvp-factory-control/issues/911
