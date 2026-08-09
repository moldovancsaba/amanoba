# Agent Issue Execution Checklist Template

**Purpose:** Copy this template for each issue to track autonomous agent progress.

---

## Issue: #{ISSUE_NUMBER} - {ISSUE_TITLE}

**Agent ID:** {YOUR_AGENT_ID}  
**Started:** {YYYY-MM-DD HH:MM UTC}  
**Status:** 🟡 In Progress | 🟢 Complete | 🔴 Blocked

---

## Pre-Execution Checks

- [ ] **Dependencies verified:** All blocking issues complete?
- [ ] **Repository cloned:** Latest `main` branch pulled?
- [ ] **Environment ready:** Node.js, MongoDB, dependencies installed?
- [ ] **Issue read:** All 18 sections understood?
- [ ] **Feature branch created:** `agent/{agent-id}/issue-{number}`

---

## Execution Phase: Research & Planning

- [ ] **Requirements gathered:** What needs to be built/translated/validated?
- [ ] **Architecture reviewed:** Component tree, data flow, API contracts understood?
- [ ] **Success criteria clarified:** All 10+ acceptance criteria clear?
- [ ] **Test strategy noted:** Unit, integration, manual tests identified?
- [ ] **Edge cases considered:** 4+ edge cases reviewed with mitigation plans?

**Research Notes:**
```
{Document key findings, sources, design decisions}
```

---

## Execution Phase: Implementation

### Core Deliverables

- [ ] **Deliverable 1:** {Name} - {Brief description}
  - [ ] Code written
  - [ ] Self-tested (manual verification)
  - [ ] Committed to feature branch
  
- [ ] **Deliverable 2:** {Name} - {Brief description}
  - [ ] Code written
  - [ ] Self-tested
  - [ ] Committed
  
- [ ] **Deliverable 3:** {Name} - {Brief description}
  - [ ] Code written
  - [ ] Self-tested
  - [ ] Committed

**Implementation Notes:**
```
{Document approach, challenges, workarounds}
```

---

## Execution Phase: Automated Testing

### Quality Gates

- [ ] **Linting:** `npm run lint` → Exit code 0
  ```
  Result: {PASS/FAIL}
  Errors (if any): {List errors}
  ```

- [ ] **Type Checking:** `npm run type-check` → Exit code 0
  ```
  Result: {PASS/FAIL}
  Errors (if any): {List errors}
  ```

- [ ] **Unit Tests:** `npm test` → Exit code 0
  ```
  Result: {PASS/FAIL}
  Coverage: {X}%
  Failed tests (if any): {List failed tests}
  ```

- [ ] **Integration Tests:** `npm run test:integration` → Exit code 0
  ```
  Result: {PASS/FAIL}
  Failed tests (if any): {List failed tests}
  ```

- [ ] **Accessibility (UI only):** Lighthouse score ≥95
  ```
  Score: {X}/100
  Issues (if any): {List issues}
  ```

### Issue-Specific Tests

- [ ] **Custom Test 1:** {Test description}
  ```bash
  Command: {test command}
  Expected: {expected result}
  Actual: {actual result}
  Status: {PASS/FAIL}
  ```

- [ ] **Custom Test 2:** {Test description}
  ```bash
  Command: {test command}
  Expected: {expected result}
  Actual: {actual result}
  Status: {PASS/FAIL}
  ```

**Testing Notes:**
```
{Document test failures, fixes applied, retries}
```

---

## Execution Phase: Acceptance Criteria Verification

### AC Checklist (from issue specification)

- [ ] **AC1:** {Acceptance criterion 1}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

- [ ] **AC2:** {Acceptance criterion 2}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

- [ ] **AC3:** {Acceptance criterion 3}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

- [ ] **AC4:** {Acceptance criterion 4}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

- [ ] **AC5:** {Acceptance criterion 5}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

- [ ] **AC6:** {Acceptance criterion 6}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

- [ ] **AC7:** {Acceptance criterion 7}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

- [ ] **AC8:** {Acceptance criterion 8}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

- [ ] **AC9:** {Acceptance criterion 9}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

- [ ] **AC10:** {Acceptance criterion 10}
  - Verification method: {How verified}
  - Result: {PASS/FAIL}

**AC Summary:**
```
Total: {X}/10 passed
Failed: {List failed ACs}
```

---

## Execution Phase: Documentation

- [ ] **Architecture documentation:** Created/updated
  - File: {path/to/doc}
  - Includes: Diagrams, component lists, data flows

- [ ] **API/Script reference:** Created/updated
  - File: {path/to/doc}
  - Includes: Usage examples, parameters, return values

- [ ] **Troubleshooting guide:** Created/updated
  - File: {path/to/doc}
  - Includes: Common errors, solutions, debugging tips

- [ ] **Testing guide:** Created/updated
  - File: {path/to/doc}
  - Includes: How to run tests, interpret results

- [ ] **HANDOVER.md updated:** Entry appended
  - Summary: {Brief summary of changes}

**Documentation Notes:**
```
{Document doc structure, completeness, readability}
```

---

## Execution Phase: Edge Case Handling

### Edge Cases Tested

- [ ] **Edge Case 1:** {Description}
  - Scenario: {What happens}
  - Mitigation: {How handled}
  - Test result: {PASS/FAIL}

- [ ] **Edge Case 2:** {Description}
  - Scenario: {What happens}
  - Mitigation: {How handled}
  - Test result: {PASS/FAIL}

- [ ] **Edge Case 3:** {Description}
  - Scenario: {What happens}
  - Mitigation: {How handled}
  - Test result: {PASS/FAIL}

- [ ] **Edge Case 4:** {Description}
  - Scenario: {What happens}
  - Mitigation: {How handled}
  - Test result: {PASS/FAIL}

---

## Execution Phase: Code Review (Self)

- [ ] **Code style:** Follows project conventions?
- [ ] **Comments:** Complex logic documented?
- [ ] **Error handling:** All edge cases covered?
- [ ] **Performance:** No obvious bottlenecks?
- [ ] **Security:** No vulnerabilities (SQL injection, XSS, etc.)?
- [ ] **Maintainability:** Code readable by other agents/humans?

**Self-Review Notes:**
```
{Document code quality observations, improvements made}
```

---

## Execution Phase: Operational Behavior

- [ ] **Retries implemented:** For transient failures (API, network)
- [ ] **Timeouts set:** Reasonable limits (no infinite waits)
- [ ] **Rollback strategy:** Can undo changes if deployment fails?
- [ ] **Error logging:** Clear, actionable error messages?
- [ ] **Observability:** Metrics/logs for monitoring production?

**Operational Notes:**
```
{Document retry configs, timeout values, rollback procedures}
```

---

## Final Checks

- [ ] **All tests passing:** Green build on CI/CD?
- [ ] **All ACs met:** 10/10 acceptance criteria verified?
- [ ] **Documentation complete:** All required docs created/updated?
- [ ] **Code committed:** All changes pushed to feature branch?
- [ ] **PR opened:** Pull request created with description?
- [ ] **No blockers:** Ready for merge to `main`?

---

## Completion Summary

**Total Time:** {X hours}  
**Total Cost:** ${X} (if applicable, e.g., API costs)  
**Commits:** {X commits}  
**Files Changed:** {X files}  
**Tests Added:** {X tests}  
**Documentation:** {X pages}

**Key Achievements:**
1. {Achievement 1}
2. {Achievement 2}
3. {Achievement 3}

**Challenges Overcome:**
1. {Challenge 1} → {Solution}
2. {Challenge 2} → {Solution}

**Lessons Learned:**
```
{Document insights for future agents working on similar tasks}
```

---

## Pull Request Details

**PR Title:** `[Issue #{NUMBER}] {Brief description}`

**PR Description:**
```markdown
## Summary
{1-2 sentence summary of changes}

## Related Issue
Closes #{ISSUE_NUMBER}

## Changes Made
- {Change 1}
- {Change 2}
- {Change 3}

## Testing
- [x] All unit tests pass
- [x] All integration tests pass
- [x] Manual testing completed
- [x] Accessibility tested (if UI)

## Acceptance Criteria
- [x] AC1: {Brief description}
- [x] AC2: {Brief description}
- [x] AC3: {Brief description}
... (all 10)

## Documentation
- [x] Architecture docs updated
- [x] API reference created
- [x] Troubleshooting guide added
- [x] HANDOVER.md updated

## Screenshots (if UI)
{Attach screenshots of UI changes}

## Agent Certification
I, Agent {AGENT_ID}, certify that:
- All acceptance criteria are met
- All tests pass
- Documentation is complete
- Code is production-ready

**Ready for merge:** ✅ Yes | ❌ No (if No, explain why)
```

---

## Escalation (If Needed)

**Escalation Required:** 🟢 No | 🔴 Yes

**If Yes, complete below:**

**Blocker Type:**
- [ ] Technical (infrastructure failure, API issue)
- [ ] Quality (cannot meet quality threshold)
- [ ] Ambiguity (issue specification unclear)
- [ ] Dependency (blocked by another agent/issue)

**Blocker Details:**
```
{Detailed description of blocker}
```

**Attempted Solutions:**
1. {Solution 1} → {Result}
2. {Solution 2} → {Result}
3. {Solution 3} → {Result}

**Escalation Issue Created:**
- Issue URL: {GitHub issue URL}
- Tagged with: `needs-human-review`
- Assigned to: {Human reviewer if known}

**Workaround Plan:**
```
{How agent will proceed while waiting for escalation resolution}
```

---

## Agent Sign-Off

**Agent ID:** {YOUR_AGENT_ID}  
**Completed:** {YYYY-MM-DD HH:MM UTC}  
**Status:** 🟢 Complete | 🔴 Blocked

**Final Statement:**
```
{Final summary: "Issue #{NUMBER} complete. All 10 ACs met. Ready for production deployment."}
```

**Next Issue:** #{NEXT_ISSUE_NUMBER} - {NEXT_ISSUE_TITLE} (if applicable)

---

## Template Usage Instructions

1. **Copy this template** for each issue you work on
2. **Fill in {PLACEHOLDERS}** with actual values
3. **Check boxes** as you complete tasks
4. **Document everything** - future agents will read this
5. **Be honest** - if something fails, document it (don't hide failures)
6. **Iterate rapidly** - if blocked, try alternative approaches
7. **Escalate early** - don't wait days if truly blocked
8. **Certify completion** - only mark complete when ALL ACs met

**Checklist Location:**
Save as: `docs/agents/checklists/issue-{NUMBER}-checklist.md`

**Example:**
`docs/agents/checklists/issue-909-checklist.md`
