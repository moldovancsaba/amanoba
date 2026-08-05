# Content Creator Repository Knowledge

**Repository:** https://github.com/moldovancsaba/amanoba_courses  
**Purpose:** Local-first course quality control center and sovereign course creator for Amanoba platform  
**Current Version:** Amanoba v0.2.0  
**Last Updated:** 2026-08-05

---

## Executive Summary

The `amanoba_courses` repository is a **local-first control center** that provides:

1. **Quality Control (QC) System:** Automated lesson and quiz quality improvement for the live Amanoba MongoDB database
2. **Sovereign Course Creator:** Complete pipeline for creating 30-day courses from topic to live publish
3. **Trinity Architecture:** Three-role AI pipeline (Drafter → Writer → Judge) for structured content generation
4. **Local Runtime:** MacOS-based continuous daemon with resident MLX models and Ollama fallback

This system operates **outside** the main Amanoba platform repository but **reads and writes** to the live production database through a bridge. It is designed for continuous, unattended operation on Mac hardware with local AI models.

---

## 1. Repository Structure and Key Files

### 1.1 Core Configuration

- **`course_quality_daemon.json`**: Active runtime configuration
  - Power modes: `gentle`, `balanced`, `fast`
  - Provider configuration: MLX primary, Ollama fallback
  - Resident creator roles configuration (Drafter, Writer, Judge)
  - Scan intervals, retry limits, timeouts

- **`course_quality_daemon.example.json`**: Template configuration

### 1.2 Key Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Quick start, launch commands, service installation |
| `docs/current-ssot.md` | Single source of truth for runtime behavior |
| `docs/create-a-course-handover.md` | Complete course creation workflow (Idea → Live) |
| `docs/amanoba-course-content-standard-v1-0.md` | Lesson structure standard (5W1H, outcome-first) |
| `docs/course-package-format.md` | Course import/export format (v2 JSON) |
| `docs/local-course-quality-daemon.md` | QC daemon operational guide |
| `docs/system-versioning.md` | Version registry and SSOT references |
| `trinity_flow_agent.md` | Three-role pipeline scientific paper |
| `soul.md` | Agent identity and operating principles |
| `MEMORY.md` | Long-term learnings (Hungarian + English patterns) |
| `user.md` | User context for course creation |

### 1.3 Reference Documentation

Located in `docs/reference/`:

- `sovereign-course-creator-compatibility-contract.md`: Creator-to-platform contract
- `course-creation-qa-playbook.md`: QA procedures for course creation
- `quiz-quality-pipeline-handover.md`: Quiz QC handover
- `quiz-quality-pipeline-playbook.md`: Quiz QC playbook

### 1.4 Course Directories

Each course has its own directory structure:

```
generative-ai-2026-build-ai-apps-and-agents/
├── generative-ai-2026-build-ai-apps-and-agents.canonical.json
├── generative-ai-2026-build-ai-apps-and-agents-ccs.md
├── generative-ai-2026-build-ai-apps-and-agents-course-outline.md
├── generative-ai-apps-agents-2026-en-export-2026-02-06-recreated.json
├── lesson-01-orientation-and-outcomes.md
├── lesson-01-orientation-and-outcomes-quiz.md
├── lesson-02-problem-selection-and-niche.md
├── lesson-02-problem-selection-and-niche-quiz.md
├── ...
├── lesson-30-maintenance-and-iteration-plan.md
├── lesson-30-maintenance-and-iteration-plan-quiz.md
├── localization/
└── ready-to-import-report.md
```

---

## 2. Trinity Architecture

The **{trinity}** pipeline is the core AI generation architecture:

### 2.1 Three-Role Separation

1. **Drafter** (Gemma 3 270M @ 8080)
   - Breaks raw input into atomic information units
   - Removes duplication
   - Identifies key claims, facts, subtopics

2. **Writer** (Granite 4.0 H 350M @ 8081)
   - Rewrites atomic units for clarity and usefulness
   - Enriches content for target audience
   - Max tokens: 384 (configurable by mode)

3. **Judge** (Qwen 2.5 0.5B @ 8082)
   - Validates structure, language, quality gates
   - Produces explicit scores and confidence metrics
   - Makes final accept/reject/retry decision

### 2.2 Design Principles

- **Specialization**: Each role does one task well
- **Structured handoff**: Parseable payloads between roles
- **Explicit scores**: Confidence and impact metrics
- **Transparent fusion**: Clear quality computation rules
- **Auditability**: Full provenance for every transformation
- **Bounded retries**: Max 5 attempts per task (configurable)
- **Local-first execution**: MLX models on Mac hardware

### 2.3 Provider Hierarchy

1. **MLX** (primary): Local inference via MLX framework
   - Dedicated Python environment: `.venv-mlx/bin/python`
   - Resident servers on ports 8080-8082
   - Automatically warmed and monitored by watchdog

2. **Ollama** (fallback): Local model serving
   - Used when MLX unavailable or cooled after failures
   - Low-power profile: temp 0.1, 384 tokens, 2048 context, 2 threads

3. **OpenAI** (optional fallback): Cloud API
   - Requires `OPENAI_API_KEY` in `.env.local`
   - Not used in default local operation

---

## 3. Quality Control (QC) System

### 3.1 Purpose

The QC daemon continuously:

1. Reads the live Amanoba MongoDB database
2. Detects weak lessons and invalid quiz questions
3. Queues repair tasks
4. Processes one task at a time
5. Writes improved content back to the database
6. Maintains local state and backup history

### 3.2 Queue States

Tasks flow through these states:

- **Coming Up (Queued)**: Waiting to be processed
- **Running**: Currently being improved
- **Done (Completed)**: Successfully improved and saved
- **Problem (Failed)**: Errors, quality gate failures
- **Quarantined**: Repeated failures, needs human review
- **Archived**: Completed tasks moved to history

### 3.3 Quality Gates

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
- Standalone comprehensibility (no "in this lesson", "Day X", etc.)
- Exactly 1 correct answer
- 3 plausible distractors
- Language integrity (no English in non-English quizzes)

### 3.4 Power Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `gentle` | Low-capacity background | Always-on minimal impact |
| `balanced` | Normal continuous operation | Default unattended mode |
| `fast` | Higher throughput | Active work sessions |

### 3.5 Dashboard

Local web UI at `http://127.0.0.1:8765` with:

- **Quality Control** page: Kanban view (Coming Up, Running, Done, Problem, Archive)
- **Course Creator** page: Sovereign course creation pipeline
- **Model Roster**: Compact view of all providers and health
- **Power Mode Switcher**: Change operational intensity
- **Scan Trigger**: Force immediate queue scan
- **Task Details Modal**: Before/after content inspection
- **Challenge Action**: Send completed task back to queue with feedback

---

## 4. Sovereign Course Creator

### 4.1 Complete Pipeline (Topic → Live)

The creator workflow has 7 stages:

1. **Topic Intake**: Define topic, language, research mode
2. **Research**: Collect sources, curate with preferred/neutral/rejected
3. **Blueprint**: Generate 30-day course outline
4. **Lesson Generation**: Create 30 lessons from blueprint
5. **Quiz Generation**: Create 210 quiz questions (7 per lesson)
6. **QC Review**: Inject drafts into local QC queue, wait for completion
7. **Draft To Live**: Export → Import → Publish to Amanoba

### 4.2 Stage-Focused UX

Each stage shows only what needs review:

- **Research**: Source pack with CRUD operations
- **Blueprint**: One day at a time (navigation)
- **Lesson Generation**: One lesson at a time (navigation)
- **Quiz Generation**: One question at a time (navigation)
- **QC Review**: Progress dashboard until all tasks completed
- **Draft To Live**: Release controls and lifecycle checklist

User actions are minimal:

- **Accept**: Move to next stage, start next AI step automatically
- **Modify**: Move back one stage, start rework with user note
- **Delete**: Move run to trash

### 4.3 Downstream Handoff

The **Draft To Live** stage enforces:

1. Export v2 course package (JSON)
2. Import into Amanoba as draft/inactive
3. Publish draft to active (explicit user action)
4. Rollback support (active → draft)
5. Delete support (remove from Amanoba entirely)
6. Block final acceptance until all steps completed

### 4.4 Lifecycle Checklist

Before publish, verify:

- [ ] All 30 lessons generated
- [ ] All 210 quiz questions generated
- [ ] QC handoff created (30 lesson tasks, 210 question tasks)
- [ ] All QC tasks completed (zero failed/quarantined)
- [ ] Package exported
- [ ] Draft imported into Amanoba
- [ ] Draft published to active
- [ ] Ready for enrollment

---

## 5. Course Content Standards

### 5.1 Canonical Format

- **Markdown-first**: All lessons and email bodies stored as Markdown
- **Not HTML-first**: Legacy HTML tolerated but not canonical
- **Rendering**: `contentToHtml` for display and email

### 5.2 Lesson Structure (Required Elements)

Every lesson must have, in this exact order:

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

### 5.3 Outcome-First Rules

1. Every lesson must produce a named **Deliverable** (artifact)
2. Every lesson must define **Success criteria** (observable checks)
3. Every lesson must produce a **Baseline metric** when possible
4. Every lesson must include action sections (Guided, Independent, Self-check)

### 5.4 Quiz Question Rules

1. **Standalone**: Fully understandable without lesson context
2. **Forbidden phrases**: "in this lesson", "today", "Day X", "as mentioned", "in the course", "module", "yesterday/tomorrow"
3. **One correct answer**: Exactly 1 correct option
4. **Three distractors**: Plausible wrong answers (not silly)
5. **Avoid**: "all of the above", "none of the above", double negatives, trick wording
6. **Language integrity**: No English leakage in non-English quizzes

### 5.5 Question Types

Target distribution:

- **Application**: ≥5 per lesson (practical use)
- **Critical-thinking**: ≥2 per lesson (analysis, evaluation)
- **Definition/Concept**: Allowed (understanding)
- **Best practice**: Allowed (professional judgment)
- **Diagnostic/Metric**: Allowed (measurement)
- **Recall**: 0 (forbidden — no pure memorization)

### 5.6 Difficulty Levels

- **EASY**: Basic recognition and understanding
- **MEDIUM**: Application and scenario-based
- **HARD**: Complex scenarios, trade-offs
- **EXPERT**: Multi-step reasoning, edge cases

---

## 6. Course Package Format (v2)

### 6.1 Top-Level Structure

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

### 6.2 Course Object

Key fields:

- `courseId` (required): Unique identifier
- `name`, `description`, `language`
- `durationDays`: Always 30 for standard courses
- `isActive`: `true` for live, `false` for draft
- `requiresPremium`: `false` for free courses
- `pointsConfig`: Gamification rewards
- `xpConfig`: Experience points
- `certification`: Certification configuration
- `quizMaxWrongAllowed`: Lesson quiz tolerance (0-10)
- `prerequisiteCourseIds`: Dependencies
- `ccsId`: Course family identifier

Do **not** include: `_id`, `createdAt`, `updatedAt`, `brandId`, `createdBy`, `assignedEditors`, `parentCourseId`, `selectedLessonIds`, `isDraft`, `syncStatus`, `lastSyncedAt`

### 6.3 Lesson Object

Key fields:

- `lessonId` (required): Unique per course
- `dayNumber`: 1-30
- `title`, `content` (Markdown), `emailSubject`, `emailBody` (Markdown)
- `quizConfig`: `{ enabled, successThreshold, questionCount, poolSize, required }`
- `pointsReward`, `xpReward`
- `isActive`: `true` for available lessons
- `quizQuestions`: Array of quiz items

### 6.4 Quiz Question Object

Key fields:

- `uuid` (optional but recommended): Stable ID for merge
- `question`, `options` (array), `correctIndex`
- `difficulty`: EASY | MEDIUM | HARD | EXPERT
- `category`: Topic/domain tag
- `questionType`: recall | application | critical-thinking | definition | concept | best_practice | diagnostic | metric
- `hashtags`: Optional tags
- `isActive`: `true` for available questions

### 6.5 Import Behavior

- **New course**: Create Course, Lessons, QuizQuestions
- **Update (overwrite=true)**: Merge only (no deletions)
  - Update course fields
  - Upsert lessons by `lessonId`
  - Upsert questions by `lessonId + uuid` or question text
  - Preserve: CourseProgress, ContentVote, Certificate, Entitlement, Payments, child courses

---

## 7. Canonical Course Spec (CCS)

### 7.1 Definition

A **CCS** is a course family that can have multiple language variants:

- **DB CCS entity**: Stored in `app/lib/models/ccs.ts` (admin "course families")
  - Holds `idea` (markdown), `outline` (markdown)
- **Repo canonical CCS**: `docs/canonical/<CCS_ID>/`
  - Contains canonical JSON, outline, and quality blueprints

### 7.2 Example CCS

- **CCS ID**: `GENERATIVE_AI_APPS_AGENTS_2026`
- **Course ID variants**:
  - `GENERATIVE_AI_APPS_AGENTS_2026_EN` (English)
  - `GENERATIVE_AI_APPS_AGENTS_2026_ID` (Indonesian)
  - `GENERATIVE_AI_APPS_AGENTS_2026_SW` (Swahili)

### 7.3 Canonical JSON Schema

```json
{
  "schemaVersion": "1.0",
  "courseIdBase": "GENERATIVE_AI_APPS_AGENTS_2026",
  "courseName": "Generative AI 2026: Build AI Apps and Agents",
  "version": "2026-02-06",
  "language": "en",
  "metadata": {
    "regionalFocus": ["Global"],
    "motions": ["B2C", "B2B"],
    "distribution": ["Direct", "Self-serve"],
    "publish": {
      "tagline": "...",
      "publicDescription": "...",
      "whoItsFor": [...],
      "prerequisites": [...],
      "whatYouShip": [...]
    }
  },
  "intent": {
    "oneSentence": "...",
    "outcomes": [...],
    "nonGoals": [...]
  },
  "qualityGates": {
    "lessonLengthMinutes": [20, 30],
    "quizQuestions": 7,
    "applicationMinimum": 5,
    "criticalMinimum": 2,
    "recallAllowed": false
  },
  "concepts": [...],
  "procedures": [...],
  "assessmentBlueprint": {
    "midCourse": {...},
    "final": {...}
  },
  "lessons": [...]
}
```

---

## 8. Operational Rules and SSOT

### 8.1 SSOT Hierarchy (When Conflicts Occur)

1. **Runtime code and behavior** (always wins)
2. **`docs/current-ssot.md`** (operational truth)
3. **Referenced SSOT documents** (specific areas)
4. **Supporting documentation** (context only)

### 8.2 SSOT Document Set

Must-read for course creation:

- `docs/core/agent_working_loop_canonical_operating_document.md`
- `docs/architecture/layout_grammar.md`
- `docs/course-building-rules.md` (if exists)
- `docs/reference/sovereign-course-creator-compatibility-contract.md`
- `docs/reference/course-creation-qa-playbook.md`
- `docs/reference/quiz-quality-pipeline-handover.md`
- `docs/reference/quiz-quality-pipeline-playbook.md`
- `2026-course-creator-prompts.md` (if exists)
- `2026-course-quality-prompt.md` (if exists)

### 8.3 GitHub Planning SSOT

**Critical**: Issue planning does NOT live in `amanoba_courses` repo.

Use:

- **Issue repository**: `moldovancsaba/mvp-factory-control`
- **Project board**: https://github.com/users/moldovancsaba/projects/1

Rules:

- Search existing issues in `mvp-factory-control`
- Create new issues in `mvp-factory-control`
- Use project board as shared planning surface
- Do NOT split backlog between repos

### 8.4 Non-Negotiable Process Rules

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

## 9. Runtime and Services

### 9.1 Launch Commands

Primary launcher:

```bash
cd "$HOME/Projects/amanoba_courses"
./start_amanoba.command
```

Opens dashboard at: `http://127.0.0.1:8765`

### 9.2 MacOS Background Services

Installed via:

```bash
bash scripts/install-course-quality-launchagents.sh
```

Services (all auto-start and keep-alive):

- `com.amanoba.coursequality.worker` (QC daemon)
- `com.amanoba.coursequality.dashboard` (Web UI)
- `com.amanoba.coursequality.watchdog` (Supervisor, RCA, recovery)
- `com.amanoba.coursequality.caffeinate` (Keep Mac awake)
- `com.amanoba.coursequality.ollama` (Ollama server)
- `com.amanoba.coursequality.role.drafter` (Gemma 3 270M @ 8080)
- `com.amanoba.coursequality.role.writer` (Granite 4.0 H 350M @ 8081)
- `com.amanoba.coursequality.role.judge` (Qwen 2.5 0.5B @ 8082)

### 9.3 Watchdog Behavior

The watchdog:

- Runs at login and on a repeating schedule
- Repairs stale locks and stuck tasks
- Kills frozen worker runs
- Enforces MLX as primary writer
- Kickstarts worker/dashboard/Ollama when health checks fail
- Creates RCA records for timeouts
- Quarantines cards after repeated failures
- Rewarms resident roles when memory pressure rises

### 9.4 Worker Cadence

Current continuous daemon intervals (seconds):

- Scan: 60
- Queue check: 60
- Idle sleep: 60
- Post-task sleep: 60

### 9.5 Fresh Machine Bootstrap

For `amanoba` live app (required for bridge):

```bash
cd "$HOME/Projects/amanoba"
vercel login
vercel link --yes --scope narimato --project amanoba
vercel env ls
vercel env pull .env.local --yes
npm install
```

Required `.env.local` values:

- `MONGODB_URI` (Atlas connection string)
- `DB_NAME="amanoba"`
- `OPENAI_API_KEY` (optional, for fallback)

If `MONGODB_URI` missing, worker reports `waiting-dependency`.

---

## 10. Menubar App

### 10.1 Installation

```bash
cd "$HOME/Projects/amanoba_courses"
bash tools/macos/AmanobaMenubar/install_AmanobaMenubar.sh
```

Run:

```bash
open ~/Applications/AmanobaMenubar.app
```

Or install and run in one step:

```bash
bash tools/macos/AmanobaMenubar/run_AmanobaMenubar.sh
```

### 10.2 Features

- Quick access to dashboard
- Service status monitoring
- Power mode switching
- Model roster visibility
- Launch-agent management

### 10.3 Documentation

- User guide: `docs/menubar-user-guide.md`
- User manual: `docs/user-manual.md`
- Mac mini handoff: `docs/mac-mini-install-handoff.md`
- Resource check: `bash tools/macos/AmanobaMenubar/check_AmanobaMenubar_resources.sh`

---

## 11. Integration with Main Amanoba Platform

### 11.1 Bridge Architecture

The `amanoba_courses` repo:

- **Does NOT** contain the Amanoba web application code
- **Reads** from the live MongoDB database via bridge scripts in `$HOME/Projects/amanoba`
- **Writes** back to the live database after QC improvements
- **Exports** v2 course packages for import into the live platform

### 11.2 Data Flow

```
amanoba_courses (local)
  └─ reads MongoDB via bridge ──> detects weak content
  └─ queues repair tasks ──> processes with Trinity pipeline
  └─ writes improved content ──> back to MongoDB
  └─ exports course packages ──> imports into Amanoba platform
```

### 11.3 Course Publishing Workflow

1. **Create** in `amanoba_courses` (sovereign creator)
2. **Improve** in local QC queue (Trinity pipeline)
3. **Export** as v2 JSON package
4. **Import** into Amanoba as draft/inactive (API endpoint)
5. **Publish** to active (explicit user action in creator UI)
6. **Enroll** users in live Amanoba platform

### 11.4 API Endpoints (in Amanoba platform)

- `GET /api/admin/courses/[courseId]/export` → v2 package
- `POST /api/admin/courses/import` → create/update from package

---

## 12. Key Learnings and Patterns

### 12.1 Quiz Quality Patterns (from MEMORY.md)

Hungarian lessons (apply to all languages):

- **Standalone comprehensibility**: Quiz must be understandable without lesson reference
- **No administrative labels**: Avoid "The goal...", "The main risk..."
- **Preferred format**: Short real situation + concrete goal + concrete decision question
- **Learner experience first**: Natural language > template speed
- **Language integrity**: No English in non-English quizzes
- **Strict clarity**: No vague pronouns/deixis; explicit element names in same sentence

### 12.2 Content Quality Principles

- **Outcome-first**: Every lesson produces a named artifact
- **Measurable success**: Binary checks, baseline metrics
- **Action-driven**: Guided + Independent exercises + Self-check
- **Bibliography hygiene**: All sources with URLs
- **Markdown-first**: Not HTML-first (legacy tolerated)

### 12.3 Trinity Pipeline Benefits

- **Decomposition**: Raw text → atomic pieces
- **Enrichment**: Atomic pieces → clear, useful text
- **Judgment**: Explicit quality evaluation
- **Bounded learning**: Feedback with retry limits
- **Auditability**: Full provenance chain

---

## 13. Critical Constraints and Gotchas

### 13.1 Environment Constraints

- **MacOS only**: Services designed for MacOS launch agents
- **Local hardware**: MLX requires Apple Silicon or AMD for optimal performance
- **MongoDB Atlas required**: No local MongoDB fallback
- **Vercel project linked**: Bridge requires live app `.env.local`

### 13.2 State Management

- **Run logs**: Narrative + Process State in `docs/course_runs/`
- **Tasklists**: Executable checklist in `docs/archive/tasklists/`
- **Both required**: Every run must have both, linked to each other
- **Resume safety**: Always check for `Status: **RUNNING**` before starting new work

### 13.3 Quality Gate Enforcement

- **No exceptions**: Premium/free doesn't change quality standards
- **Quiz gates**: ≥7 valid, ≥5 application, 0 recall
- **Lesson gates**: 5W1H, deliverable, exercises, bibliography
- **Language integrity**: No English leakage in non-English content

### 13.4 GitHub Planning Split

- **Code repo**: `moldovancsaba/amanoba_courses`
- **Issue repo**: `moldovancsaba/mvp-factory-control`
- **Project board**: https://github.com/users/moldovancsaba/projects/1
- **Never mix**: Do not create parallel planning in code repo

---

## 14. Connection to Progressive Course Strategy

The knowledge from this content creator repository is **directly applicable** to the automated, progressive course generation strategy outlined in:

- `/workspace/docs/product/PROGRESSIVE_COURSE_STRATEGY.md`
- `/workspace/docs/product/PROGRESSIVE_COURSE_IMPLEMENTATION_ROADMAP.md`
- `/workspace/PROGRESSIVE_COURSE_GENERATION_EXECUTIVE_SUMMARY.md`

### 14.1 Alignment Points

1. **Trinity Architecture**: The three-role pipeline (Drafter → Writer → Judge) is the foundation for automated content generation
2. **Quality Gates**: Existing SSOT standards will govern all generated content
3. **Local-First**: MLX models demonstrate feasibility of local, cost-effective generation
4. **Sovereign Creator**: The existing 7-stage pipeline is the baseline for automation
5. **QC Integration**: The quality control daemon provides the continuous improvement layer

### 14.2 Automation Opportunities

The existing infrastructure provides:

- **Proven content generation patterns** (Trinity pipeline)
- **Quality validation framework** (QC daemon + watchdog)
- **Package format standardization** (v2 JSON with merge support)
- **Lifecycle management** (Draft → QC → Publish)
- **Rollback and recovery patterns** (quarantine, RCA, manual intervention)

### 14.3 Data-Driven Triggers

The progressive course strategy requires:

- **Enrollment metrics**: Already tracked in `CourseProgress` model
- **Completion metrics**: Already tracked in `CourseProgress` model
- **Quality signals**: QC daemon provides continuous monitoring
- **Performance baselines**: Trinity pipeline produces explicit scores

---

## 15. Next Steps for AI-Driven Course Strategy

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

## 16. References and Resources

### 16.1 Internal Documents

- All documentation in `docs/` directory
- Run logs in `docs/course_runs/`
- Tasklists in `docs/archive/tasklists/`
- Canonical CCS in `docs/canonical/`

### 16.2 External Links

- **GitHub Repository**: https://github.com/moldovancsaba/amanoba_courses
- **Issue Tracking**: https://github.com/moldovancsaba/mvp-factory-control
- **Project Board**: https://github.com/users/moldovancsaba/projects/1
- **Live Amanoba Platform**: https://amanoba.com

### 16.3 Related Repositories

- **Main Platform**: `moldovancsaba/amanoba` (Next.js app, not public)
- **Issue Control**: `moldovancsaba/mvp-factory-control` (planning SSOT)

---

## 17. Quick Reference

### 17.1 Essential Commands

```bash
# Start everything
cd "$HOME/Projects/amanoba_courses"
./start_amanoba.command

# Install background services
bash scripts/install-course-quality-launchagents.sh

# Check service status
bash scripts/status-course-quality-launchagents.sh

# Open dashboard
open http://127.0.0.1:8765

# Check health
curl http://127.0.0.1:8765/api/health

# View feed
curl http://127.0.0.1:8765/api/feed?limit=10
```

### 17.2 Essential URLs

- Dashboard: `http://127.0.0.1:8765`
- Health: `http://127.0.0.1:8765/api/health`
- Feed: `http://127.0.0.1:8765/api/feed?limit=10`
- Drafter: `http://127.0.0.1:8080`
- Writer: `http://127.0.0.1:8081`
- Judge: `http://127.0.0.1:8082`

### 17.3 Essential Files

- Config: `course_quality_daemon.json`
- State: `.course-quality/state.sqlite3`
- Backups: `.course-quality/backups/`
- Health: `.course-quality/reports/health.json`
- Feed: `.course-quality/reports/feed.json`
- Watchdog: `.course-quality/reports/watchdog.json`

---

## Conclusion

The `amanoba_courses` repository is a sophisticated, production-ready system for:

1. **Automated content quality control** of the live Amanoba platform
2. **Sovereign course creation** from idea to published course
3. **Local-first AI generation** using Trinity architecture
4. **Continuous unattended operation** with watchdog and recovery

This infrastructure provides the **proven foundation** for implementing the progressive, automated course generation strategy. The existing patterns, quality gates, and automation workflows can be extended to support data-driven, multi-stage course progression from 1-day rapid intros to 30-day mastery programs.

**Key Success Factors**:
- Strict SSOT adherence
- Trinity pipeline for structured generation
- Quality gate enforcement at every stage
- Local-first operation with cloud fallback
- Comprehensive state management and recovery
- Clear separation of concerns (creation vs. improvement vs. publishing)

This system is ready for production use and ready for extension to support the next generation of AI-driven, adaptive learning experiences.
