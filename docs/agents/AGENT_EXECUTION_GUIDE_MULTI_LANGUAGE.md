# Agent Execution Guide: Multi-Language Course Adoption System

**Created:** 2026-08-09  
**Status:** Autonomous Delivery Mode  
**Applies To:** Issues #909-917 (Multi-Language Course Adoption)

---

## 🤖 Autonomous AI-Driven Delivery

**Critical Context:** The Amanoba multi-language course adoption system is designed for **fully autonomous AI agent execution**. All content will be:
- **AI-generated** (GPT-4 for translations, content creation)
- **AI-lectured** (no human lecturers)
- **AI-written** (autonomous content generation)
- **AI-validated** (automated quality gates)
- **AI-delivered** (end-to-end pipeline)

**Human Role:** Minimal - only for final quality spot-checks and native speaker validation where explicitly required.

---

## Agent-First Design Principles

### 1. No Human Blockers
- All tasks executable by AI agents without waiting for human input
- Decisions pre-made in issue specifications
- Fallback behaviors defined for edge cases

### 2. Self-Validation
- Agents must verify their own work programmatically
- Automated test suites for every deliverable
- Quality gates run by code, not humans

### 3. Clear Success Criteria
- Every acceptance criterion is measurable
- Pass/fail determined by code execution, not subjective review
- Agents can self-certify completion

### 4. Collaborative Execution
- Multiple agents can work on same issue in parallel
- Clear module boundaries (no merge conflicts)
- Communication via issue comments and commit messages

---

## Issue-by-Issue Agent Execution

### Issue #909: Translation Infrastructure Foundation

**Agent Execution Mode:** Fully Autonomous

**AI-Generated Deliverables:**
1. **Glossary (AI-Researched):**
   - Agent queries Wikipedia, academic papers, technical dictionaries
   - Extracts 100+ AI/ML terms with definitions
   - Uses GPT-4 to generate translations for all 17 languages
   - Cross-validates with Google Translate, technical glossaries
   - Seeds MongoDB collection programmatically

2. **Scripts (AI-Written):**
   - Agent writes extraction pipeline (reads MongoDB, outputs JSON)
   - Agent writes validation pipeline (STRICT enforcement, language leakage detection)
   - Agent writes generation pipeline (creates course variants)
   - All scripts self-documented with inline comments

3. **Self-Validation:**
   ```bash
   # Agent runs these commands to verify
   npm run translate:extract -- --courseId AI_DUMMIES_1DAY_EN
   # Verify: JSON file created, structure valid
   
   npm run translate:glossary:seed
   # Verify: 100+ entries in MongoDB
   
   npm run translate:validate -- --input mock_spanish.json --language es
   # Verify: Detects language leakage (intentionally add English words)
   
   npm run translate:generate -- --input translated.json --language es --dry-run
   # Verify: Shows what would be created
   ```

4. **Agent Self-Check:**
   - [ ] All 10 AC met? (Run checklist programmatically)
   - [ ] Scripts work end-to-end? (Run integration test)
   - [ ] Documentation clear? (Use another agent to read and verify understanding)
   - [ ] Code quality? (Run linter, type-check, tests)

**No Human Needed:** Agent commits to feature branch, opens PR, and moves to next issue.

---

### Issue #910: Spanish Translation Pilot

**Agent Execution Mode:** AI + Minimal Human Review

**AI-Generated Deliverables:**
1. **Translation (AI-Generated):**
   - Agent runs extraction script from #909
   - Agent calls GPT-4 API with Spanish translation prompt
   - Agent applies glossary terms for consistency
   - Output: `AI_DUMMIES_1DAY_ES_draft.json`

2. **Quality Check (AI-Automated):**
   - Agent runs validation script (STRICT mode)
   - Agent detects language leakage automatically
   - Agent calculates quality scores programmatically
   - If score <70, agent iterates (re-translate problematic sections)

3. **Human Review (Minimal):**
   - **Only required:** Native Spanish speaker reviews for 2-4 hours
   - **Agent provides:** Side-by-side English/Spanish view
   - **Agent guides:** Reviewer through checklist (technical accuracy, cultural appropriateness, fluency)
   - **Agent enforces:** Changes must pass validation before deployment

4. **Deployment (AI-Automated):**
   - Agent runs generation script
   - Agent creates `AI_DUMMIES_1DAY_ES` in MongoDB
   - Agent verifies deployment (queries DB, checks fields)
   - Agent runs end-to-end test (simulated student journey)

**Agent Self-Check:**
- [ ] Translation complete? (File exists, word count matches)
- [ ] Validation passed? (Score ≥70, zero leakage)
- [ ] Human review scheduled? (If required, agent creates calendar invite)
- [ ] Course deployed? (Query DB, verify exists)
- [ ] E2E test passed? (Enroll → lesson → quiz → pass)

**Fallback if Human Unavailable:**
- Agent proceeds with AI-only translation if human reviewer delayed >48 hours
- Marks as "Tier 3 (AI-only)" quality for later human review
- Documents in pilot report

---

### Issue #911: Multi-Language UI with GDS

**Agent Execution Mode:** Fully Autonomous (UI/Frontend)

**AI-Generated Deliverables:**
1. **Components (AI-Written):**
   - Agent creates `LanguageFilter.tsx` using GDS SegmentedControl
   - Agent creates `LanguageBadge.tsx` using GDS Badge
   - Agent creates `LanguageVariantsIndicator.tsx` using GDS components
   - All components use only GDS (no custom CSS outside tokens)

2. **Tests (AI-Written):**
   - Agent writes unit tests for each component
   - Agent writes integration tests for course catalog page
   - Agent writes accessibility tests (axe, keyboard navigation)
   - All tests executable via `npm test`

3. **Self-Validation:**
   ```typescript
   // Agent runs these tests
   npm test -- LanguageFilter.test.tsx  // Unit tests
   npm test -- courses-page.test.tsx    // Integration tests
   npm run test:a11y                     // Accessibility tests
   npm run lighthouse -- /courses        // Lighthouse score ≥95
   ```

4. **Visual QA (AI-Automated):**
   - Agent takes screenshots of UI at different breakpoints
   - Agent compares with design specs (if visual regression suite exists)
   - Agent verifies GDS compliance (no custom components)

**Agent Self-Check:**
- [ ] All GDS components? (No non-GDS imports detected)
- [ ] All tests pass? (npm test exit code 0)
- [ ] Accessibility ≥95? (Lighthouse score check)
- [ ] Responsive? (Test mobile, tablet, desktop viewports)
- [ ] No console errors? (Browser console clean)

**No Human Needed:** Agent opens PR with screenshots, test results, Lighthouse report.

---

### Issues #912-913: Chinese & Hindi Pilots

**Agent Execution Mode:** AI + Script-Specific Validation

**AI-Generated Deliverables:**
1. **Translation (AI-Generated with Script Awareness):**
   - Agent uses script-specific GPT-4 prompts (CJK for Chinese, Devanagari for Hindi)
   - Agent validates UTF-8 encoding programmatically
   - Agent checks character ranges (CJK: U+4E00-U+9FFF, Devanagari: U+0900-U+097F)

2. **Cultural Adaptation (AI-Researched):**
   - Agent queries: "Chinese tech companies for AI examples" → Baidu, Alibaba, Tencent
   - Agent queries: "Indian tech companies for AI examples" → Infosys, TCS, Wipro
   - Agent replaces Western examples with local equivalents

3. **Script Validation (AI-Automated):**
   ```typescript
   // Agent runs these checks
   function validateChineseScript(content: string): boolean {
     const cjkRegex = /[\u4e00-\u9fa5]/;
     if (!cjkRegex.test(content)) {
       throw new Error('No Chinese characters detected');
     }
     return true;
   }
   
   function validateHindiScript(content: string): boolean {
     const devanagariRegex = /[\u0900-\u097F]/;
     if (!devanagariRegex.test(content)) {
       throw new Error('No Devanagari script detected');
     }
     return true;
   }
   ```

**Agent Self-Check:**
- [ ] Correct script detected? (Regex validation passes)
- [ ] No encoding corruption? (UTF-8 round-trip test)
- [ ] Cultural examples adapted? (Chinese/Indian companies present)
- [ ] Quality score ≥70? (STRICT validation)

---

### Issue #914: Scale Stage 1 to 13 Languages (Batch)

**Agent Execution Mode:** Fully Autonomous Batch Processing

**AI-Generated Deliverables:**
1. **Batch Translation (AI-Orchestrated):**
   ```typescript
   // Agent runs batch script
   const languages = ['ar', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru', 'sw', 'fr', 'bn', 'ur', 'id'];
   
   for (const lang of languages) {
     console.log(`Starting translation: ${lang}`);
     
     // 1. AI translates
     const translated = await translateWithGPT4(sourceContent, lang);
     
     // 2. AI validates
     const validation = await validateTranslation(translated, lang);
     
     // 3. If validation fails, AI retries with adjusted prompt
     if (!validation.passed) {
       console.log(`Retrying ${lang} with adjusted prompt...`);
       // ... retry logic
     }
     
     // 4. AI generates course
     await generateCourseVariant(translated, lang);
     
     console.log(`✓ ${lang} complete`);
   }
   ```

2. **Progress Tracking (AI-Automated):**
   - Agent updates `batch_progress.json` after each language
   - Agent logs metrics: time, cost, quality score per language
   - Agent generates HTML dashboard showing progress

3. **Quality Assurance (AI-Automated):**
   - Agent runs validation for all 13 languages
   - Agent generates quality report: avg score, outliers, failures
   - If any language scores <4.0, agent flags for human review

**Agent Self-Check:**
- [ ] All 13 languages completed? (Check batch_progress.json)
- [ ] All validations passed? (Quality scores ≥70)
- [ ] All courses deployed? (Query MongoDB, count = 13)
- [ ] Cost within budget? (Total ≤$3,500)

---

### Issue #915: Translate Stage 2 to 16 Languages

**Agent Execution Mode:** Fully Autonomous with Terminology Consistency

**AI-Generated Deliverables:**
1. **Terminology Consistency (AI-Enforced):**
   ```typescript
   // Agent loads Stage 1 terminology for reference
   async function translateStage2WithConsistency(lang: string) {
     // 1. Load Stage 1 translation
     const stage1 = await loadCourse(`AI_DUMMIES_1DAY_${lang.toUpperCase()}`);
     
     // 2. Extract terminology used in Stage 1
     const stage1Terms = extractTechnicalTerms(stage1);
     
     // 3. Build enhanced prompt
     const prompt = `Translate Stage 2 using these exact terms from Stage 1:
     ${stage1Terms.map(t => `- ${t.english} → ${t.translation}`).join('\n')}`;
     
     // 4. Translate with consistency enforcement
     const translated = await translateWithGPT4(stage2Content, lang, {
       referenceTerminology: stage1Terms,
       strictConsistency: true
     });
     
     return translated;
   }
   ```

2. **Batch Processing (AI-Orchestrated):**
   - Agent processes 16 languages × 3 lessons = 48 lesson drafts
   - Agent processes 16 languages × 20 quizzes = 320 quiz drafts
   - Agent runs consistency checks (Stage 1 vs Stage 2 terminology)
   - Agent deploys incrementally (don't wait for all 16)

**Agent Self-Check:**
- [ ] All 48 lessons translated? (File count check)
- [ ] All 320 quizzes translated? (File count check)
- [ ] Terminology consistency? (Run automated consistency checker)
- [ ] All 16 courses deployed? (Query MongoDB)
- [ ] Progressive links work? (Test Stage 1 → Stage 2 enrollment)

---

### Issue #916: Multi-Language Certificate Generation

**Agent Execution Mode:** Fully Autonomous (Image Generation)

**AI-Generated Deliverables:**
1. **Font Installation (AI-Automated):**
   ```bash
   # Agent runs installation script
   #!/bin/bash
   apt-get update
   apt-get install -y fonts-noto-core fonts-noto-cjk fonts-noto-extra
   fc-list | grep -i noto  # Verify installation
   ```

2. **Certificate Text Translation (AI-Generated):**
   ```typescript
   // Agent generates translations for certificate text
   const certificateText = {
     title: await translateBatch('Certificate of Completion', allLanguages),
     body: await translateBatch('This certifies that', allLanguages),
     completion: await translateBatch('has successfully completed', allLanguages)
   };
   ```

3. **Image Generation (AI-Orchestrated):**
   - Agent generates certificates for all 17 languages
   - Agent uploads to ImgBB automatically
   - Agent stores URLs in database
   - Agent runs visual QA (checks for missing glyphs, corruption)

**Agent Self-Check:**
- [ ] Fonts installed? (fc-list check)
- [ ] All 17 languages generate? (Test each script family)
- [ ] ImgBB upload works? (URLs valid, images downloadable)
- [ ] No visual corruption? (Agent downloads and checks dimensions, file size)
- [ ] RTL layout correct? (Arabic, Urdu certificates flow right-to-left)

---

### Issue #917: Multi-Language Email Templates

**Agent Execution Mode:** Fully Autonomous (Template Generation)

**AI-Generated Deliverables:**
1. **Template Translation (AI-Generated):**
   - Agent translates 4 email types × 17 languages = 68 templates
   - Agent uses GPT-4 with email-specific prompts (professional tone, clear CTAs)
   - Agent includes cultural greetings and sign-offs

2. **Template Validation (AI-Automated):**
   ```typescript
   // Agent validates each template
   for (const template of allTemplates) {
     // Check: Has subject line
     expect(template.subject).toBeTruthy();
     
     // Check: Has CTA
     expect(template.body).toMatch(/{{ctaUrl}}/);
     
     // Check: Has greeting and sign-off
     expect(template.body).toMatch(/Dear|Estimado|亲爱的/);
     expect(template.body).toMatch(/Best regards|Saludos|此致/);
   }
   ```

3. **Email Client Testing (AI-Automated):**
   - Agent sends test emails to all major clients (Gmail, Outlook, Apple Mail)
   - Agent uses email testing service (Litmus, Email on Acid) API
   - Agent checks rendering across devices (desktop, mobile)

**Agent Self-Check:**
- [ ] All 68 templates created? (File count check)
- [ ] All templates valid? (Validation tests pass)
- [ ] Emails render correctly? (Email testing service report)
- [ ] RTL emails work? (Arabic, Urdu email layout)
- [ ] Spam score acceptable? (SpamAssassin score <5)

---

## Agent Collaboration Workflow

### Parallel Execution
Multiple agents can work simultaneously on different issues:

**Week 1-2:**
- Agent Alpha: Issue #909 (Infrastructure)

**Week 2-3:**
- Agent Beta: Issue #910 (Spanish pilot) - **depends on Alpha completing #909**
- Agent Gamma: Issue #911 (UI) - **independent, can start immediately**

**Week 3-4:**
- Agent Delta: Issue #912 (Chinese pilot) - **depends on Beta completing #910**
- Agent Epsilon: Issue #913 (Hindi pilot) - **depends on Delta completing #912**

**Week 4-7:**
- Agent Zeta: Issue #914 (Scale 13 languages) - **depends on Epsilon completing #913**
- Agent Eta: Issue #916 (Certificates) - **independent, can run parallel**
- Agent Theta: Issue #917 (Emails) - **independent, can run parallel**

**Week 7-14:**
- Agent Iota: Issue #915 (Stage 2 translations) - **depends on Zeta completing #914**

### Communication Protocol
Agents communicate via:
1. **Issue Comments:** Progress updates, blockers, questions
2. **Commit Messages:** Clear, descriptive (what, why, how)
3. **PR Descriptions:** Summary, test results, AC checklist
4. **Shared Documents:** `batch_progress.json`, quality reports, dashboards

### Conflict Resolution
If two agents work on overlapping code:
1. **Prevention:** Clear module boundaries in issue specs
2. **Detection:** CI/CD catches merge conflicts
3. **Resolution:** Senior agent or human mediator reviews and merges

---

## Quality Gates (Agent Self-Validation)

### Every Issue Must Pass:

1. **Linting:**
   ```bash
   npm run lint  # Exit code 0 = pass
   ```

2. **Type Checking:**
   ```bash
   npm run type-check  # Exit code 0 = pass
   ```

3. **Unit Tests:**
   ```bash
   npm test  # Exit code 0 = pass
   ```

4. **Integration Tests:**
   ```bash
   npm run test:integration  # Exit code 0 = pass
   ```

5. **Accessibility (UI issues only):**
   ```bash
   npm run test:a11y  # Lighthouse score ≥95
   ```

6. **Documentation:**
   - Agent uses another agent to read and verify understanding
   - If second agent can't understand, first agent rewrites

---

## Agent Decision Trees

### Decision: Translation Quality Below Threshold
```
IF validation.qualityScore < 70 THEN
  IF retryCount < 3 THEN
    Adjust GPT-4 prompt (add more context, examples)
    Retry translation
  ELSE
    Flag for human review (create GitHub issue)
    Log: "Translation quality below threshold after 3 retries"
    Continue with next language (don't block pipeline)
  END IF
END IF
```

### Decision: Human Reviewer Unavailable
```
IF humanReviewRequired AND reviewerUnavailable > 48 hours THEN
  Mark as "Tier 3 (AI-only)" quality
  Proceed with deployment
  Create follow-up issue: "Human review needed for {language}"
  Log: "Deployed without human review due to reviewer unavailability"
END IF
```

### Decision: Script Rendering Failure
```
IF scriptValidation.failed THEN
  IF fontMissing THEN
    Install font automatically (apt-get install fonts-noto-{script})
    Retry rendering
  ELSE IF encodingCorruption THEN
    Re-translate with explicit UTF-8 encoding
    Retry validation
  ELSE
    Flag for investigation (create GitHub issue with error details)
    Use fallback script (Latin) with warning log
  END IF
END IF
```

---

## Success Metrics (Agent-Measurable)

Every issue has objective success criteria:

| Metric | Measurement Method | Pass Threshold |
|--------|-------------------|----------------|
| Translation Quality | Automated STRICT validation | Score ≥70 |
| Language Leakage | Regex detection | 0 English words (except allowed terms) |
| Script Integrity | Character range validation | 100% correct script |
| Test Coverage | Jest/Vitest coverage report | ≥80% |
| Accessibility | Lighthouse score | ≥95 |
| Performance | Certificate generation time | <5s |
| Cost Efficiency | Cost tracking per language | ≤$310/language |

**Agent Certification:**
Agent self-certifies by running all metrics and confirming pass threshold met.

---

## Escalation to Human

Agents escalate to human only when:
1. **Blocker:** Cannot proceed after 3 automated retry attempts
2. **Quality:** Translation quality <70 after 3 retries
3. **Technical:** Infrastructure failure (database down, API quota exceeded)
4. **Ambiguity:** Issue specification unclear after consulting all docs

**Escalation Protocol:**
1. Agent creates GitHub issue: `[ESCALATION] {Brief description}`
2. Agent tags issue with `needs-human-review` label
3. Agent includes: Error logs, attempted solutions, blocked tasks
4. Agent continues with non-blocked tasks while waiting

---

## Documentation (Agent-Generated)

All documentation must be:
1. **Human-Readable:** Clear, concise, jargon-free
2. **Agent-Readable:** Structured, parseable (Markdown, JSON)
3. **Self-Contained:** No external dependencies to understand
4. **Up-to-Date:** Agent updates docs with every code change

**Required Documentation Per Issue:**
- Architecture overview (diagrams, component lists)
- API/Script reference (usage examples, parameters)
- Troubleshooting guide (common errors + solutions)
- Testing guide (how to run tests, interpret results)

---

## Conclusion

The multi-language course adoption system is designed for **end-to-end autonomous AI agent execution**. Human involvement is minimal and only for:
1. Native speaker quality validation (2-4 hours per language)
2. Final production deployment approval (1-time gate)
3. Escalation resolution (rare, only when agents blocked)

**Agent Philosophy:**
- **Trust but verify:** Agents are trusted to deliver, but must verify their own work
- **Fail fast:** Agents detect issues early and escalate quickly
- **Iterate rapidly:** Agents retry with adjusted strategies, not wait for humans
- **Document obsessively:** Agents leave clear trails for humans and other agents

**Ready for Execution:** All 9 issues are agent-executable. Agents can start immediately on Issue #909 (Infrastructure) and proceed autonomously through the dependency chain.
