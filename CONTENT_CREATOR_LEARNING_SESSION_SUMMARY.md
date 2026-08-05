# Content Creator Learning Session Summary

**Date:** 2026-08-05  
**Repository Studied:** https://github.com/moldovancsaba/amanoba_courses  
**Purpose:** Understand the existing content creation infrastructure to inform the progressive course generation strategy

---

## Executive Summary

Successfully acquired comprehensive knowledge of the `amanoba_courses` repository, which provides:

1. **Trinity Architecture**: Three-role AI pipeline for structured content generation
2. **Quality Control System**: Automated continuous improvement of lessons and quizzes
3. **Sovereign Course Creator**: Complete pipeline from topic idea to live published course
4. **Local-First Runtime**: MacOS-based system with MLX models and Ollama fallback
5. **Proven Standards**: 5W1H lesson structure, outcome-first approach, Markdown-first format

This infrastructure directly supports the automated, progressive course generation strategy by providing battle-tested patterns, quality gates, and automation workflows.

---

## Key Findings

### 1. Trinity Architecture (Proven AI Pipeline)

The {trinity} three-role pipeline separates content generation into specialized roles:

- **Drafter** (Gemma 3 270M @ port 8080)
  - Breaks raw input into atomic information units
  - Removes duplication
  - Identifies key claims and subtopics

- **Writer** (Granite 4.0 H 350M @ port 8081)
  - Rewrites atomic units for clarity and usefulness
  - Enriches content for target audience
  - Configurable token budget (384 default)

- **Judge** (Qwen 2.5 0.5B @ port 8082)
  - Validates structure, language, quality gates
  - Produces explicit scores and confidence metrics
  - Makes accept/reject/retry decisions

**Design Principles:**
- Specialization (each role does one task well)
- Structured handoffs (parseable payloads)
- Explicit scores (confidence and impact metrics)
- Transparent fusion (clear quality rules)
- Auditability (full provenance chain)
- Bounded retries (max 5 attempts)

### 2. Quality Control System

**Continuous Daemon Workflow:**
1. Reads live Amanoba MongoDB database via bridge
2. Detects weak lessons and invalid quiz questions
3. Queues repair tasks (one at a time)
4. Processes with Trinity pipeline
5. Writes improved content back to database
6. Maintains local state and backup history

**Queue States:**
- Coming Up (Queued)
- Running (in progress)
- Done (completed successfully)
- Problem (failed with errors)
- Quarantined (repeated failures, needs human review)
- Archived (historical completed tasks)

**Quality Gates:**

Lessons must have:
- 5W1H completeness (Who, What, Where, When, Why, How)
- Named deliverable and success criteria
- Guided exercise, Independent exercise, Self-check
- Bibliography with URLs
- 20-30 minute time estimate

Quizzes must have:
- ≥7 valid questions per lesson
- ≥5 application/critical-thinking questions
- 0 recall-only questions
- Standalone comprehensibility (no "in this lesson" references)
- Exactly 1 correct answer + 3 plausible distractors
- Language integrity (no English in non-English quizzes)

**Power Modes:**
- `gentle`: Low-capacity background operation
- `balanced`: Normal continuous operation (default)
- `fast`: Higher throughput for active work

**Dashboard:** Local web UI at `http://127.0.0.1:8765`

### 3. Sovereign Course Creator

**7-Stage Pipeline:**

1. **Topic Intake**: Define topic, target language, research mode
2. **Research**: Collect sources, curate with preferred/neutral/rejected states
3. **Blueprint**: Generate 30-day course outline
4. **Lesson Generation**: Create 30 lessons from blueprint
5. **Quiz Generation**: Create 210 quiz questions (7 per lesson)
6. **QC Review**: Inject drafts into local QC queue, wait for completion
7. **Draft To Live**: Export → Import → Publish to Amanoba

**Stage-Focused UX:**
- Shows only current stage content needing review
- Minimal user actions: Accept, Modify, Delete
- Accept moves forward and starts next AI step automatically
- Modify moves back one stage with user note for rework
- Delete moves run to trash

**Downstream Handoff (Draft To Live):**
1. Export v2 course package (JSON)
2. Import into Amanoba as draft/inactive
3. Publish draft to active (explicit user action)
4. Rollback support (active → draft)
5. Delete support (remove from Amanoba entirely)
6. Block final acceptance until all steps completed

### 4. Course Content Standards

**Canonical Format:**
- **Markdown-first**: All lessons and email bodies stored as Markdown
- **Not HTML-first**: Legacy HTML tolerated but not canonical
- **Rendering**: `contentToHtml` for display and email

**Lesson Structure (Required Elements in Exact Order):**

1. Header (One-liner, Time, Deliverable, Prerequisite)
2. Learning goal (observable, measurable)
3. Who (Primary persona, Secondary, Stakeholders)
4. What (What it is, What it is not, 2-minute theory, Key terms)
5. Where (Applies in, Does not apply in, Touchpoints)
6. When (Use it when, Frequency, Late signals)
7. Why it matters (Practical benefits, Risks of ignoring, Expectations)
8. How (Step-by-step method, Do and don't, Common mistakes)
9. Guided exercise (Direct instructions)
10. Independent exercise (Unguided task)
11. Self-check (Observable checklist)
12. Bibliography (Sources used, with URLs)
13. Read more (Optional deepening)

**Outcome-First Rules:**
1. Every lesson must produce a named **Deliverable** (artifact)
2. Every lesson must define **Success criteria** (observable checks)
3. Every lesson must produce a **Baseline metric** when possible
4. Every lesson must include action sections (Guided, Independent, Self-check)

**Quiz Question Rules:**
1. **Standalone**: Fully understandable without lesson context
2. **Forbidden phrases**: "in this lesson", "today", "Day X", "as mentioned", "in the course", "module", "yesterday/tomorrow"
3. **One correct answer**: Exactly 1 correct option
4. **Three distractors**: Plausible wrong answers (not silly)
5. **Avoid**: "all of the above", "none of the above", double negatives, trick wording
6. **Language integrity**: No English leakage in non-English quizzes

**Question Types (Target Distribution):**
- Application: ≥5 per lesson (practical use)
- Critical-thinking: ≥2 per lesson (analysis, evaluation)
- Definition/Concept: Allowed (understanding)
- Best practice: Allowed (professional judgment)
- Diagnostic/Metric: Allowed (measurement)
- Recall: 0 (forbidden — no pure memorization)

### 5. Course Package Format (v2)

**Top-Level Structure:**
```json
{
  "packageVersion": "2.0",
  "exportedAt": "ISO8601",
  "exportedBy": "string",
  "course": { ... },
  "lessons": [ ... ],
  "canonicalSpec": null | { "json": { ... }, "ccsMd": "string" },
  "courseIdea": null | "string"
}
```

**Import Behavior:**
- **New course**: Create Course, Lessons, QuizQuestions
- **Update (overwrite=true)**: Merge only (no deletions)
  - Update course fields
  - Upsert lessons by `lessonId`
  - Upsert questions by `lessonId + uuid` or question text
  - Preserve: CourseProgress, ContentVote, Certificate, Entitlement, Payments, child courses

**API Endpoints (in Amanoba platform):**
- `GET /api/admin/courses/[courseId]/export` → v2 package
- `POST /api/admin/courses/import` → create/update from package

### 6. SSOT Hierarchy

**When Conflicts Occur:**
1. **Runtime code and behavior** (always wins)
2. **`docs/current-ssot.md`** (operational truth)
3. **Referenced SSOT documents** (specific areas)
4. **Supporting documentation** (context only)

**Must-Read SSOT Documents:**
- `docs/core/agent_working_loop_canonical_operating_document.md`
- `docs/architecture/layout_grammar.md`
- `docs/course-building-rules.md`
- `docs/reference/sovereign-course-creator-compatibility-contract.md`
- `docs/reference/course-creation-qa-playbook.md`
- `docs/reference/quiz-quality-pipeline-handover.md`
- `docs/reference/quiz-quality-pipeline-playbook.md`

**GitHub Planning SSOT (Critical):**
- **Issue repository**: `moldovancsaba/mvp-factory-control`
- **Project board**: https://github.com/users/moldovancsaba/projects/1
- **Rule**: Do NOT split backlog between repos

### 7. Runtime and Services

**Primary Launcher:**
```bash
cd "$HOME/Projects/amanoba_courses"
./start_amanoba.command
```

**Dashboard:** `http://127.0.0.1:8765`

**MacOS Background Services (auto-start, keep-alive):**
- `com.amanoba.coursequality.worker` (QC daemon)
- `com.amanoba.coursequality.dashboard` (Web UI)
- `com.amanoba.coursequality.watchdog` (Supervisor, RCA, recovery)
- `com.amanoba.coursequality.caffeinate` (Keep Mac awake)
- `com.amanoba.coursequality.ollama` (Ollama server)
- `com.amanoba.coursequality.role.drafter` (Gemma 3 270M @ 8080)
- `com.amanoba.coursequality.role.writer` (Granite 4.0 H 350M @ 8081)
- `com.amanoba.coursequality.role.judge` (Qwen 2.5 0.5B @ 8082)

**Watchdog Behavior:**
- Repairs stale locks and stuck tasks
- Kills frozen worker runs
- Enforces MLX as primary writer
- Kickstarts worker/dashboard/Ollama when health checks fail
- Creates RCA records for timeouts
- Quarantines cards after repeated failures
- Rewarms resident roles when memory pressure rises

**Worker Cadence (seconds):**
- Scan: 60
- Queue check: 60
- Idle sleep: 60
- Post-task sleep: 60

### 8. Provider Hierarchy

1. **MLX (primary)**: Local inference via MLX framework
   - Dedicated Python environment: `.venv-mlx/bin/python`
   - Resident servers on ports 8080-8082
   - Automatically warmed and monitored by watchdog

2. **Ollama (fallback)**: Local model serving
   - Used when MLX unavailable or cooled after failures
   - Low-power profile: temp 0.1, 384 tokens, 2048 context, 2 threads

3. **OpenAI (optional fallback)**: Cloud API
   - Requires `OPENAI_API_KEY` in `.env.local`
   - Not used in default local operation

### 9. Key Learnings and Patterns

**Quiz Quality Patterns (from MEMORY.md):**

Hungarian lessons (apply to all languages):
- **Standalone comprehensibility**: Quiz must be understandable without lesson reference
- **No administrative labels**: Avoid "The goal...", "The main risk..."
- **Preferred format**: Short real situation + concrete goal + concrete decision question
- **Learner experience first**: Natural language > template speed
- **Language integrity**: No English in non-English quizzes
- **Strict clarity**: No vague pronouns/deixis; explicit element names in same sentence

**Content Quality Principles:**
- **Outcome-first**: Every lesson produces a named artifact
- **Measurable success**: Binary checks, baseline metrics
- **Action-driven**: Guided + Independent exercises + Self-check
- **Bibliography hygiene**: All sources with URLs
- **Markdown-first**: Not HTML-first (legacy tolerated)

**Trinity Pipeline Benefits:**
- **Decomposition**: Raw text → atomic pieces
- **Enrichment**: Atomic pieces → clear, useful text
- **Judgment**: Explicit quality evaluation
- **Bounded learning**: Feedback with retry limits
- **Auditability**: Full provenance chain

### 10. Non-Negotiable Process Rules

1. **No autonomous assumptions**: Stop and ask when scope unclear
2. **Documentation = code**: Update docs with every behavior change
3. **Dry-run first**: Summarize outputs before DB writes
4. **Rollback plan required**: Ensure backups and restore commands exist
5. **No quality exceptions**: Premium/free doesn't change standards
6. **EN-first for multi-language**: Author English, then localize
7. **Stateful execution**:
   - Maintain one run log and one tasklist
   - Record exact next command
   - Stop at phase boundaries, require explicit continue
8. **Platform defaults**:
   - Environment: Production (MongoDB Atlas `amanoba`)
   - Course structure: 30-day parent course first
   - Commercial: Free (`requiresPremium=false`)
   - Assessment: Quizzes required, SSOT gates enforced
   - Certification: Enabled for proof-of-completion courses

---

## Integration with Progressive Course Strategy

The knowledge from this content creator repository is **directly applicable** to the automated, progressive course generation strategy outlined in:

- `/workspace/docs/product/PROGRESSIVE_COURSE_STRATEGY.md`
- `/workspace/docs/product/PROGRESSIVE_COURSE_IMPLEMENTATION_ROADMAP.md`
- `/workspace/PROGRESSIVE_COURSE_GENERATION_EXECUTIVE_SUMMARY.md`

### Alignment Points

1. **Trinity Architecture**: The three-role pipeline (Drafter → Writer → Judge) is the foundation for automated content generation
2. **Quality Gates**: Existing SSOT standards will govern all generated content
3. **Local-First**: MLX models demonstrate feasibility of local, cost-effective generation
4. **Sovereign Creator**: The existing 7-stage pipeline is the baseline for automation
5. **QC Integration**: The quality control daemon provides the continuous improvement layer

### Automation Opportunities

The existing infrastructure provides:

- **Proven content generation patterns** (Trinity pipeline)
- **Quality validation framework** (QC daemon + watchdog)
- **Package format standardization** (v2 JSON with merge support)
- **Lifecycle management** (Draft → QC → Publish)
- **Rollback and recovery patterns** (quarantine, RCA, manual intervention)

### Data-Driven Triggers

The progressive course strategy requires:

- **Enrollment metrics**: Already tracked in `CourseProgress` model
- **Completion metrics**: Already tracked in `CourseProgress` model
- **Quality signals**: QC daemon provides continuous monitoring
- **Performance baselines**: Trinity pipeline produces explicit scores

### Next Steps for Implementation

To implement the progressive course generation strategy using this infrastructure:

1. **Extend Creator Pipeline**:
   - Add "1-day rapid" course template
   - Implement CCS-to-short-course transformation
   - Configure Trinity for shorter content formats

2. **Add Trigger Logic**:
   - Hook into `CourseProgress` completion events
   - Implement threshold checks (e.g., "X users completed")
   - Trigger next-stage course generation automatically

3. **Quality Assurance**:
   - Extend QC daemon for multi-stage validation
   - Add comparative quality checks (1-day vs 30-day)
   - Implement automated A/B testing framework

4. **Revenue Integration**:
   - Extend certification config for tiered pricing
   - Add entitlement rules for progressive stages
   - Implement dynamic pricing based on completion metrics

5. **Monitoring and Analytics**:
   - Dashboard enhancements for stage-wise metrics
   - Automated reporting for generation triggers
   - Quality trend visualization

---

## Files Created/Updated

### Created:
1. **`CONTENT_CREATOR_REPOSITORY_KNOWLEDGE.md`** (903 lines)
   - Comprehensive 17-section knowledge document
   - Trinity Architecture
   - Quality Control System
   - Sovereign Course Creator
   - Course Standards
   - Package Format
   - SSOT Hierarchy
   - Operational Rules
   - Integration Points

### Updated:
1. **`START_HERE.md`**
   - Added "Content Creator Infrastructure" section
   - Referenced new knowledge document

2. **`docs/HANDOVER.md`**
   - Added "2026-08-05: Content Creator Repository Knowledge Acquisition" entry
   - Documented key learnings, impact, and next steps

---

## References

### Repositories:
- **Content Creator**: https://github.com/moldovancsaba/amanoba_courses
- **Main Platform**: https://github.com/moldovancsaba/amanoba (private)
- **Issue Tracking**: https://github.com/moldovancsaba/mvp-factory-control
- **Project Board**: https://github.com/users/moldovancsaba/projects/1
- **Design System**: https://github.com/sovereignsquad/general-design-system

### Key Documents Studied:
- `README.md` (326 lines)
- `course_quality_daemon.json` (167 lines)
- `docs/current-ssot.md` (171 lines)
- `docs/create-a-course-handover.md` (436 lines)
- `docs/amanoba-course-content-standard-v1-0.md` (434 lines)
- `docs/course-package-format.md` (143 lines)
- `docs/local-course-quality-daemon.md` (414 lines)
- `docs/system-versioning.md` (99 lines)
- `trinity_flow_agent.md` (873 lines)
- `soul.md` (18 lines)
- `MEMORY.md` (12 lines)
- `user.md` (7 lines)

### Sample Course Examined:
- `generative-ai-2026-build-ai-apps-and-agents/` (30 lessons + 30 quizzes)
- Canonical JSON structure
- CCS (Canonical Course Spec) format
- Lesson and quiz markdown examples

---

## Conclusion

Successfully acquired comprehensive knowledge of the `amanoba_courses` repository infrastructure. This knowledge provides:

1. **Proven Patterns**: Trinity pipeline, QC daemon, and course creator are battle-tested
2. **Quality Framework**: SSOT standards and gates are well-defined and enforced
3. **Automation Foundation**: Existing tools demonstrate effective local AI orchestration
4. **Integration Readiness**: Clear APIs, package formats, and lifecycle management
5. **Strategic Alignment**: Direct support for progressive course generation strategy

**Status**: ✅ Learning complete, knowledge documented, ready for progressive strategy implementation

**Commits**:
1. `15c84352` - docs: add comprehensive content creator repository knowledge
2. `64afd7c1` - docs: update HANDOVER with content creator learning session

**Branch**: `main`  
**Pushed to**: `origin/main`  
**Date**: 2026-08-05
