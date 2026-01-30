/**
 * Refine AI 30-Day EN Lessons (quality lift to >=70, strict-quiz ready)
 *
 * Notes:
 * - There is currently no canonical JSON for this course family under docs/canonical/.
 * - This refiner uses a per-day topic plan to ensure lessons have:
 *   definitions, procedures/steps, good-vs-bad examples, checklist, and metrics/criteria.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/AI_30_DAY_EN/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/refine-ai-30-day-en-lessons.ts --from-day 1 --to-day 30
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-ai-30-day-en-lessons.ts --from-day 1 --to-day 30 --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course') || 'AI_30_DAY_EN';
const FROM_DAY = Number(getArgValue('--from-day') || '1');
const TO_DAY = Number(getArgValue('--to-day') || '30');
const APPLY = process.argv.includes('--apply');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const BACKUP_DIR = getArgValue('--backup-dir') || join(process.cwd(), 'scripts', 'lesson-backups');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function stripHtml(input: string) {
  return String(input || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ul(items: string[]) {
  return `<ul>\n${items.map((i) => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ul>\n`;
}

function ol(items: string[]) {
  return `<ol>\n${items.map((i) => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ol>\n`;
}

type TopicPlan = {
  why: string;
  goals: string[];
  definitions: Array<{ term: string; def: string }>;
  steps: string[];
  good: string;
  bad: string;
  checklist: string[];
  metrics: string[];
  pitfalls: Array<{ pitfall: string; fix: string }>;
  prompts?: string[];
};

function baseMetrics() {
  return [
    'Measurable: You can say whether the output is correct/complete (pass/fail or a score).',
    'Effort: You can produce the result in 15–30 minutes using the workflow.',
    'Clarity: Another person can run your prompt and get a similar outcome.',
  ];
}

function basePitfalls() {
  return [
    { pitfall: 'Vague instructions.', fix: 'Add constraints, examples, and a success checklist.' },
    { pitfall: 'One-shot prompting.', fix: 'Iterate: draft → critique → revise → verify.' },
    { pitfall: 'No validation.', fix: 'Add QA steps, tests, and explicit “what counts as done”.' },
  ];
}

const DAY_PLAN: Record<number, TopicPlan> = {
  1: {
    why: 'You’ll get better results when you treat AI as a tool you direct, not a magic oracle.',
    goals: [
      'Explain what modern AI can and cannot do well.',
      'Identify 2 tasks you should not delegate to AI (without safeguards).',
      'Set a simple “use AI / don’t use AI” rule for your work.',
    ],
    definitions: [
      { term: 'Model', def: 'A system that predicts outputs from patterns in data; it can sound confident and still be wrong.' },
      { term: 'Hallucination', def: 'A plausible-sounding answer that is not supported by facts or sources.' },
      { term: 'Guardrail', def: 'A rule or constraint that prevents unsafe/incorrect outputs from shipping.' },
      { term: 'Verification', def: 'A check that compares output to reality (sources, calculations, tests, policy).' },
    ],
    steps: [
      'Pick one recurring task (email, summary, outline, FAQ).',
      'Define what “good” means (criteria + examples).',
      'Decide what must be verified by you (facts, claims, numbers, compliance).',
      'Write a baseline prompt with constraints and a checklist.',
      'Run once, then iterate using critique + revision.',
    ],
    good: 'You use AI to draft a summary, then you verify key claims against the source and keep only supported points.',
    bad: 'You copy-paste an AI-generated answer into a customer email without checking facts, tone, or policy.',
    checklist: [
      'I can describe the expected output format and constraints.',
      'I know what I must verify (facts, numbers, citations, policy).',
      'I have a fallback plan if the model refuses or is uncertain.',
    ],
    metrics: [...baseMetrics(), 'Risk: High-risk outputs are reviewed by a human before sending/publishing.'],
    pitfalls: basePitfalls(),
    prompts: ['Draft a response, then list what must be verified and what sources would support it.'],
  },
  2: {
    why: 'A structured prompt reduces ambiguity and makes outputs repeatable.',
    goals: ['Name the 4 parts of a good prompt.', 'Rewrite a weak prompt into a strong one.', 'Add criteria so output is testable.'],
    definitions: [
      { term: 'Context', def: 'Relevant background so the model knows the situation and constraints.' },
      { term: 'Task', def: 'What you want produced (draft, summary, table, plan) in clear terms.' },
      { term: 'Constraints', def: 'Rules: format, length, tone, excluded items, do/don’t, must-include.' },
      { term: 'Success criteria', def: 'How you judge quality (checklist, rubric, examples of good/bad).' },
    ],
    steps: [
      'Write one sentence of context (who, what, why).',
      'Write the task as an output request (deliverable + format).',
      'Add 3–7 constraints (tone, length, must include/exclude, structure).',
      'Add success criteria (checklist + 1 good / 1 bad example).',
      'Ask for clarification questions when missing inputs.',
    ],
    good: 'Prompt includes context + task + constraints + checklist; the output is structured and easy to verify.',
    bad: 'Prompt says “Write something about X” with no audience, constraints, or success definition.',
    checklist: ['Context is 1–3 sentences.', 'Task specifies output format.', 'Constraints include must-include and must-not.', 'Success criteria is explicit.'],
    metrics: [...baseMetrics(), 'Repeatability: 2 runs produce outputs that meet the same checklist.'],
    pitfalls: [
      { pitfall: 'Constraints missing or conflicting.', fix: 'Keep constraints short; remove contradictions; add a priority order.' },
      { pitfall: 'No examples.', fix: 'Add a small “good vs bad” snippet to anchor style and structure.' },
      ...basePitfalls(),
    ],
  },
  3: {
    why: 'Iteration turns “okay” outputs into high-quality deliverables with less effort than starting over.',
    goals: ['Use a 4-step iterate loop.', 'Generate critiques that are actionable.', 'Stop when the output passes criteria.'],
    definitions: [
      { term: 'Draft', def: 'A first version meant to be improved, not shipped.' },
      { term: 'Critique', def: 'A structured quality review against criteria (not vibes).' },
      { term: 'Revision', def: 'Changes that address the critique with minimal extra complexity.' },
      { term: 'Verification', def: 'Checks for correctness, consistency, and compliance.' },
    ],
    steps: [
      'Draft: ask for a first version in the target format.',
      'Critique: ask for issues vs your checklist + what’s missing.',
      'Revise: ask for an updated version that fixes the critique.',
      'Verify: ask for a self-check against the checklist and any uncertain claims.',
    ],
    good: 'You iterate until the output passes a checklist and has no unsupported claims.',
    bad: 'You keep rewriting prompts randomly without a consistent rubric or stopping rule.',
    checklist: ['I have a written checklist.', 'Critique is tied to checklist items.', 'Revisions address specific failures.', 'I stop when criteria is met.'],
    metrics: ['Cycles: <= 3 iteration cycles for most tasks.', ...baseMetrics()],
    pitfalls: [
      { pitfall: 'Asking “make it better” with no rubric.', fix: 'Provide criteria and ask for a point-by-point critique.' },
      { pitfall: 'Infinite iteration.', fix: 'Define a stopping rule (score threshold or checklist pass).' },
      ...basePitfalls(),
    ],
  },
  4: {
    why: 'Breaking work into steps makes AI outputs controllable and reduces errors.',
    goals: ['Decompose a task into a workflow.', 'Write prompts per step.', 'Add a QA step at the end.'],
    definitions: [
      { term: 'Workflow', def: 'A sequence of steps that turns inputs into outputs with checks.' },
      { term: 'Input contract', def: 'What information must be provided (fields, constraints, examples).' },
      { term: 'Output contract', def: 'Exact format and criteria the output must satisfy.' },
      { term: 'QA step', def: 'A final check that tests for correctness and completeness.' },
    ],
    steps: [
      'Define the final deliverable (format + audience).',
      'List 3–6 steps: gather inputs → draft → refine → format → QA.',
      'Write one prompt per step (include input/output contracts).',
      'Add a QA prompt that checks against criteria and flags uncertainties.',
      'Run the workflow end-to-end once and refine the weakest step.',
    ],
    good: 'A multi-step workflow produces consistent outputs and catches errors before shipping.',
    bad: 'A single mega-prompt tries to do everything and fails unpredictably.',
    checklist: ['Steps are numbered.', 'Each step has clear inputs/outputs.', 'QA checks facts + formatting.', 'Workflow is reusable.'],
    metrics: ['Error rate drops over time as you refine the weakest step.', ...baseMetrics()],
    pitfalls: [
      { pitfall: 'Too many steps.', fix: 'Start with 3–5 steps; add only when necessary.' },
      { pitfall: 'No QA step.', fix: 'Always include a verification prompt before shipping.' },
      ...basePitfalls(),
    ],
  },
  5: {
    why: 'Quality and safety are what separate “AI experiments” from reliable systems.',
    goals: ['Define QA checks for your outputs.', 'Add guardrails for sensitive content.', 'Create a rollback/review rule.'],
    definitions: [
      { term: 'QA (quality assurance)', def: 'A repeatable set of checks that catches mistakes before release.' },
      { term: 'Guardrail', def: 'A constraint that prevents unsafe or policy-violating outputs.' },
      { term: 'Red flag', def: 'A signal that requires human review (legal/medical claims, sensitive data, uncertainty).' },
      { term: 'Escalation', def: 'A rule for what happens when the model is uncertain or refuses.' },
    ],
    steps: [
      'List “never ship without review” categories for your work.',
      'Create a QA checklist (facts, numbers, tone, compliance, formatting).',
      'Add guardrails to the prompt (no invented facts; ask for sources; flag uncertainty).',
      'Add an escalation step: when unsure, ask clarifying questions or stop.',
      'Run a “bad case” test: intentionally ambiguous inputs and see what fails.',
    ],
    good: 'You ship only after passing QA, and you have a clear path when the model is uncertain.',
    bad: 'You rely on the model to self-police without explicit rules or review.',
    checklist: ['QA checklist exists and is used.', 'Red flags trigger human review.', 'Prompt bans fabrication.', 'There is an escalation path.'],
    metrics: ['Incidents: 0 policy violations shipped.', 'QA pass rate increases as prompts improve.', ...baseMetrics()],
    pitfalls: [
      { pitfall: 'Assuming “it sounds right” is true.', fix: 'Require sources, checks, or tests.' },
      { pitfall: 'No red-flag rules.', fix: 'Write explicit “stop and ask” or “human review” conditions.' },
      ...basePitfalls(),
    ],
  },
  6: {
    why: 'A template library saves time and makes quality repeatable.',
    goals: ['Create 3 reusable prompt templates.', 'Define when to use each template.', 'Add a minimal QA block to each template.'],
    definitions: [
      { term: 'Template', def: 'A reusable prompt structure with placeholders and rules.' },
      { term: 'Placeholder', def: 'A variable you fill in (audience, constraints, examples, source text).' },
      { term: 'Default', def: 'The safe baseline behavior when inputs are missing.' },
    ],
    steps: [
      'Pick 3 recurring tasks (summary, rewrite, outline, FAQ, email).',
      'For each task, write a template: context → task → constraints → checklist → QA.',
      'Add placeholders: {audience}, {tone}, {length}, {source}, {constraints}.',
      'Add a QA mini-step: “list uncertainties + what to verify”.',
      'Store templates in one place and use them for 7 days.',
    ],
    good: 'Templates reduce rework because they encode constraints and QA by default.',
    bad: 'You re-invent prompts each time and forget critical constraints.',
    checklist: ['Templates have placeholders.', 'Templates include QA.', 'Templates are named and searchable.', 'Templates are tested on real tasks.'],
    metrics: ['Time saved: fewer edits per output.', 'Consistency: outputs follow the same structure.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Templates too long to use.', fix: 'Keep a short “core” plus optional advanced blocks.' }, ...basePitfalls()],
  },
  7: {
    why: 'Role prompts help the model prioritize and keep the output aligned to a purpose.',
    goals: ['Write a role prompt with constraints.', 'Add a “refuse to guess” rule.', 'Create one specialized role for your job.'],
    definitions: [
      { term: 'Role prompt', def: 'A set of instructions that define perspective, priorities, and boundaries.' },
      { term: 'Constraint', def: 'A rule the model must follow (format, exclusions, evidence requirements).' },
      { term: 'Boundary', def: 'Where the model must stop and ask for clarification.' },
    ],
    steps: [
      'Define the role: who you want the model to act as (editor, analyst, PM).',
      'Define priorities: accuracy, brevity, tone, safety.',
      'Define constraints: output format, allowed sources, banned behaviors.',
      'Add boundaries: “If missing info, ask questions.”',
      'Test the role on 2 tasks and refine.',
    ],
    good: 'The role prompt produces consistent outputs with predictable limits.',
    bad: 'The role prompt is vague (“be helpful”) with no boundaries or constraints.',
    checklist: ['Role is specific.', 'Priorities are ordered.', 'Boundaries are explicit.', 'The prompt discourages guessing.'],
    metrics: [...baseMetrics(), 'Boundary compliance: model asks questions when inputs are missing.'],
    pitfalls: [{ pitfall: 'Role conflicts with task.', fix: 'Put task-specific constraints after the role and make them higher priority.' }, ...basePitfalls()],
  },
  8: {
    why: 'Fact-checking keeps you from shipping confident nonsense.',
    goals: ['Request sources and uncertainty.', 'Separate facts from assumptions.', 'Build a verification checklist.'],
    definitions: [
      { term: 'Claim', def: 'A statement that could be true or false and should be supported.' },
      { term: 'Source', def: 'Evidence you can inspect (document, link, dataset, quote).' },
      { term: 'Uncertainty', def: 'Where the model should say “I’m not sure” and ask for more data.' },
    ],
    steps: [
      'Ask the model to list claims separately from recommendations.',
      'For each claim, ask for a supporting source or mark it uncertain.',
      'Replace unsupported claims with questions or remove them.',
      'Add a “verification required” section to outputs.',
      'For critical outputs, verify against primary sources.',
    ],
    good: 'Outputs include a list of claims to verify and do not invent citations.',
    bad: 'Outputs contain precise numbers, names, or policies with no source or warning.',
    checklist: ['Claims separated from opinions.', 'Uncertain items flagged.', 'No invented citations.', 'Verification steps documented.'],
    metrics: ['Unsupported-claim rate decreases over time.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Treating citations as proof.', fix: 'Check the source actually says the claim.' }, ...basePitfalls()],
  },
  9: {
    why: 'Good summaries preserve what matters and are easy to act on.',
    goals: ['Summarize by purpose (not by length).', 'Preserve key constraints, decisions, and risks.', 'Produce an action list.'],
    definitions: [
      { term: 'Signal', def: 'The core meaning: decisions, constraints, reasons, and actions.' },
      { term: 'Noise', def: 'Details that do not change decisions or actions.' },
      { term: 'Compression', def: 'Reducing length while preserving signal.' },
    ],
    steps: [
      'Choose a summary purpose: brief, decision memo, action plan, update.',
      'Extract: decisions, constraints, numbers, risks, and open questions.',
      'Write a 5–10 bullet “signal” summary.',
      'Add a “what’s missing” section (unknowns).',
      'Add actions with owners and dates (when applicable).',
    ],
    good: 'A summary that includes decisions + risks + next actions.',
    bad: 'A summary that rewrites the text with fewer words but no structure or actions.',
    checklist: ['Purpose stated.', 'Decisions/constraints preserved.', 'Actions included.', 'Unknowns flagged.'],
    metrics: ['Read time < 2 minutes; action list usable.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Summarizing without purpose.', fix: 'Define audience + decision context first.' }, ...basePitfalls()],
  },
  10: {
    why: 'Rewrites should change meaning only when you intend to, and tone should match audience.',
    goals: ['Perform a tone shift without changing meaning.', 'Preserve facts and constraints.', 'Use a checklist for style.'],
    definitions: [
      { term: 'Tone', def: 'Voice/style (formal, friendly, direct) that affects how content is received.' },
      { term: 'Semantics', def: 'Meaning: facts, claims, commitments, and constraints.' },
      { term: 'Style guide', def: 'Rules for words, sentence length, and formatting.' },
    ],
    steps: [
      'Extract key facts/commitments (do not change these).',
      'Define target tone + audience.',
      'Rewrite with the tone constraints.',
      'Run a “meaning diff”: list what changed in content (should be none unless requested).',
      'Run QA: check facts, numbers, and policy statements.',
    ],
    good: 'A rewrite that changes tone while keeping the same commitments and facts.',
    bad: 'A rewrite that adds new claims or changes commitments accidentally.',
    checklist: ['Facts preserved.', 'Tone matches audience.', 'Meaning diff checked.', 'No new claims introduced.'],
    metrics: [...baseMetrics(), 'Meaning drift: 0 unintended changes.'],
    pitfalls: [{ pitfall: 'Accidental meaning drift.', fix: 'Extract facts first and re-check after rewrite.' }, ...basePitfalls()],
  },
  11: {
    why: 'Planning outputs reduce blank-page time and keep writing structured.',
    goals: ['Generate an outline with sections.', 'Write a storyboard for a doc or slide deck.', 'Add acceptance criteria.'],
    definitions: [
      { term: 'Outline', def: 'A structured plan of headings and bullet points.' },
      { term: 'Storyboard', def: 'A sequence of sections/slides with key messages and supporting points.' },
      { term: 'Acceptance criteria', def: 'What the final deliverable must include to be “done”.' },
    ],
    steps: [
      'State deliverable type (doc, memo, slides) + audience.',
      'List 3–7 required sections (problem, approach, risks, next steps).',
      'Generate a section-by-section outline with key bullets.',
      'Add 1 example per section (what would go there).',
      'Define acceptance criteria and run QA.',
    ],
    good: 'An outline that guides drafting and includes criteria and examples.',
    bad: 'A list of vague headings with no content guidance.',
    checklist: ['Audience specified.', 'Sections include purpose.', 'Examples included.', 'Acceptance criteria defined.'],
    metrics: ['Drafting time reduced; fewer structural rewrites.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Outline too detailed or too vague.', fix: 'Aim for 6–10 bullets per section maximum.' }, ...basePitfalls()],
  },
  12: {
    why: 'Using AI as a research helper is safer when it asks questions and frames uncertainty.',
    goals: ['Generate clarifying questions.', 'Form a research plan.', 'Avoid fabricated facts.'],
    definitions: [
      { term: 'Clarifying question', def: 'A question that, if answered, changes what you should do.' },
      { term: 'Research plan', def: 'A list of questions, sources, and steps to validate claims.' },
      { term: 'Assumption', def: 'A belief you are using without proof; must be tested or labeled.' },
    ],
    steps: [
      'State the decision you need to make.',
      'Ask the model for 10 clarifying questions.',
      'Answer the top 3, then ask for a refined plan.',
      'Ask for likely assumptions and how to test them.',
      'Only then ask for a draft output with explicit uncertainty labels.',
    ],
    good: 'AI helps you structure inquiry and lists what must be verified.',
    bad: 'AI gives a confident answer with made-up facts and no research steps.',
    checklist: ['Questions come before answers.', 'Assumptions labeled.', 'Sources and verification steps listed.'],
    metrics: ['Verification time decreases; fewer wrong facts slip through.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Letting AI “answer” uncertain questions.', fix: 'Force a questions-first workflow.' }, ...basePitfalls()],
  },
  13: {
    why: 'Long-form drafting works best when you draft section-by-section with constraints.',
    goals: ['Draft with sections.', 'Add examples and transitions.', 'Run a final QA checklist.'],
    definitions: [
      { term: 'Section contract', def: 'What a section must include: purpose, key points, examples, length.' },
      { term: 'Transition', def: 'A sentence that connects sections and preserves logic.' },
    ],
    steps: [
      'Create a section outline with purpose per section.',
      'Draft each section independently with a section contract.',
      'Add one example per section (scenario or data point).',
      'Add transitions and remove redundancy.',
      'Run QA: clarity, correctness, and completeness.',
    ],
    good: 'A structured draft that reads coherently and includes examples and criteria.',
    bad: 'A long draft that rambles with repeated points and no examples.',
    checklist: ['Sections have purpose.', 'Examples included.', 'Transitions added.', 'Final QA run.'],
    metrics: [...baseMetrics(), 'Structure: sections map to outline with no missing parts.'],
    pitfalls: [{ pitfall: 'Drafting everything at once.', fix: 'Draft section-by-section with constraints.' }, ...basePitfalls()],
  },
  14: {
    why: 'Format transforms change how information is consumed without changing meaning.',
    goals: ['Convert formats reliably.', 'Preserve meaning and constraints.', 'Choose the right format for the audience.'],
    definitions: [
      { term: 'Format transform', def: 'Changing representation (bullets ↔ table ↔ narrative) while preserving meaning.' },
      { term: 'Lossy transform', def: 'A transform that drops information; should be intentional.' },
    ],
    steps: [
      'Define the target format and why it’s needed.',
      'Extract key facts/constraints (must be preserved).',
      'Convert to the target format with consistent structure.',
      'Run a “meaning diff”: list what got dropped/added.',
      'Polish for readability (labels, headings, ordering).',
    ],
    good: 'A table that preserves all key constraints and decisions.',
    bad: 'A transform that loses critical details or changes meaning.',
    checklist: ['Target format stated.', 'Meaning diff checked.', 'No key facts lost.', 'Output readable.'],
    metrics: ['Meaning drift 0; readability improved.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Accidental omission.', fix: 'Extract must-keep facts before transforming.' }, ...basePitfalls()],
  },
  15: {
    why: 'Automation works when prompts become explicit pseudo-steps with inputs and outputs.',
    goals: ['Write prompts as pseudo-steps.', 'Define inputs/outputs per step.', 'Add error handling rules.'],
    definitions: [
      { term: 'Pseudo-steps', def: 'A sequence of instructions that a human or system can execute repeatedly.' },
      { term: 'Input validation', def: 'Rules that ensure required fields exist and are in the right shape.' },
      { term: 'Error handling', def: 'What to do when the model is uncertain or output fails QA.' },
    ],
    steps: [
      'Write the workflow as numbered steps with input/output contracts.',
      'Add required fields and defaults.',
      'Add failure rules (ask questions, stop, or escalate).',
      'Add a QA step that checks criteria.',
      'Test with 2 real inputs, including one messy input.',
    ],
    good: 'A prompt that can be automated because steps and contracts are explicit.',
    bad: 'A vague prompt that depends on hidden context and breaks in automation.',
    checklist: ['Inputs defined.', 'Outputs structured.', 'Failure rules exist.', 'QA step exists.'],
    metrics: ['Automation readiness: step-by-step, no missing inputs.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Automating an unstable prompt.', fix: 'Stabilize with a checklist and tests first.' }, ...basePitfalls()],
  },
  16: {
    why: 'Brainstorming is useful when it expands options without increasing noise.',
    goals: ['Generate options with constraints.', 'Avoid rambling.', 'Select top options with criteria.'],
    definitions: [
      { term: 'Divergence', def: 'Generating many options.' },
      { term: 'Convergence', def: 'Filtering options using criteria.' },
      { term: 'Constraints', def: 'Rules that keep brainstorming relevant.' },
    ],
    steps: [
      'Define the decision/problem in one sentence.',
      'Add constraints (budget, time, audience, tools).',
      'Generate 10 options with short descriptions.',
      'Score options with 3 criteria (impact, effort, risk).',
      'Pick top 2 and write next steps.',
    ],
    good: 'You produce many options, then filter to 1–2 actionable next steps.',
    bad: 'You generate a long list with no criteria or next actions.',
    checklist: ['Problem stated.', 'Constraints set.', 'Options scored.', 'Next steps defined.'],
    metrics: ['Options count >=10; selected options have next actions.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Idea sprawl.', fix: 'Limit each option to 2 sentences and add criteria scoring.' }, ...basePitfalls()],
  },
  17: {
    why: 'Decision support should reveal tradeoffs and assumptions, not just list pros/cons.',
    goals: ['Write a decision table.', 'Surface assumptions and risks.', 'Pick a recommendation with conditions.'],
    definitions: [
      { term: 'Tradeoff', def: 'A gain in one dimension that costs you in another.' },
      { term: 'Assumption', def: 'A belief that must be tested for the decision to hold.' },
      { term: 'Recommendation', def: 'A choice plus the conditions under which it’s valid.' },
    ],
    steps: [
      'List options (2–4).',
      'List criteria (3–6) and define what “good” means per criterion.',
      'Write pros/cons tied to criteria (not generic).',
      'List assumptions and risks per option.',
      'Recommend one option and state conditions + next test.',
    ],
    good: 'A recommendation that includes conditions, risks, and a next test.',
    bad: 'A generic pros/cons list with no criteria or decision.',
    checklist: ['Criteria defined.', 'Tradeoffs explicit.', 'Assumptions listed.', 'Recommendation includes conditions.'],
    metrics: ['Decision made within timebox; next test scheduled.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Pretending all criteria are equal.', fix: 'Weight criteria or define a priority order.' }, ...basePitfalls()],
  },
  18: {
    why: 'Small data work is safer when you keep calculations transparent and testable.',
    goals: ['Summarize a small table correctly.', 'Do simple calculations with checks.', 'Explain assumptions.'],
    definitions: [
      { term: 'Aggregation', def: 'Summarizing data (sum, average, count) by category.' },
      { term: 'Sanity check', def: 'A quick test to catch obvious errors (totals, ranges, units).' },
      { term: 'Assumption', def: 'A choice you make when data is missing or ambiguous.' },
    ],
    steps: [
      'Define the question you’re answering (one sentence).',
      'Describe the data columns and units.',
      'Compute totals/averages with clear formulas.',
      'Run sanity checks (ranges, totals, duplicates).',
      'Summarize findings + recommended action.',
    ],
    good: 'A table summary that includes calculations and sanity checks.',
    bad: 'A summary that guesses trends without showing numbers or checks.',
    checklist: ['Units stated.', 'Formulas shown.', 'Sanity checks included.', 'Assumptions labeled.'],
    metrics: ['Calculation correctness verified; no unit confusion.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Hidden math.', fix: 'Show formulas and intermediate totals.' }, ...basePitfalls()],
  },
  19: {
    why: 'Persona adaptation increases relevance without changing core meaning.',
    goals: ['Define 2 personas.', 'Adapt tone/format per persona.', 'Keep facts consistent.'],
    definitions: [
      { term: 'Persona', def: 'A target reader with needs, context, and constraints.' },
      { term: 'Audience constraint', def: 'A limitation like attention span, expertise, or role.' },
      { term: 'Core meaning', def: 'Facts, decisions, and commitments that must not change.' },
    ],
    steps: [
      'Define persona A and persona B (role, goals, fears).',
      'Define the same core message (facts/commitments).',
      'Rewrite for each persona (tone + format + examples).',
      'Run a meaning diff to confirm no drift.',
      'Ask for a final QA against style and meaning.',
    ],
    good: 'Two versions that keep facts consistent but feel tailored.',
    bad: 'Persona versions that change claims or add invented details.',
    checklist: ['Personas defined.', 'Core meaning extracted.', 'Meaning diff checked.', 'Tone matches persona.'],
    metrics: ['Meaning drift 0; engagement improves.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Over-personalization that changes meaning.', fix: 'Lock facts/commitments before rewriting.' }, ...basePitfalls()],
  },
  20: {
    why: 'Team workflows improve when feedback is structured and revisions are tracked.',
    goals: ['Share drafts with a rubric.', 'Collect feedback as actionable items.', 'Revise and record changes.'],
    definitions: [
      { term: 'Rubric', def: 'A scoring guide with criteria (clarity, correctness, tone, completeness).' },
      { term: 'Change log', def: 'A record of what changed and why.' },
      { term: 'Reviewer question', def: 'A question that targets a specific risk or gap.' },
    ],
    steps: [
      'Attach a rubric to the draft.',
      'Ask reviewers for 3 issues and 3 improvements tied to rubric criteria.',
      'Convert feedback into a prioritized task list.',
      'Revise and create a short change log.',
      'Re-run QA and ship.',
    ],
    good: 'Feedback becomes tasks; revisions are traceable; QA happens before shipping.',
    bad: 'Feedback is vague (“looks good”) and problems appear after shipping.',
    checklist: ['Rubric included.', 'Feedback is actionable.', 'Changes logged.', 'QA rerun before ship.'],
    metrics: ['Revision cycles decrease; fewer post-ship issues.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Unstructured feedback.', fix: 'Require rubric-based comments and examples.' }, ...basePitfalls()],
  },
  21: {
    why: 'FAQs and knowledge bases work when questions are real and answers are consistent and scoped.',
    goals: ['Generate real FAQs.', 'Write scoped answers with examples.', 'Add escalation rules.'],
    definitions: [
      { term: 'FAQ', def: 'A frequently asked question with a clear, scoped answer.' },
      { term: 'Scope', def: 'What the answer covers and what it explicitly does not cover.' },
      { term: 'Escalation', def: 'When to route to a human or a different system.' },
    ],
    steps: [
      'Collect real questions (support logs, team notes, sales calls).',
      'Cluster questions into 5–10 themes.',
      'Write answers with scope + steps + example.',
      'Add “when to escalate” rules.',
      'QA: consistency, tone, and policy.',
    ],
    good: 'FAQ answers are consistent, scoped, and include examples and escalation rules.',
    bad: 'FAQ answers are vague, contradictory, or overpromise.',
    checklist: ['Questions are real.', 'Answers are scoped.', 'Examples included.', 'Escalation rules included.'],
    metrics: ['Self-serve success rate improves; fewer repeat questions.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Inventing FAQs.', fix: 'Use real logs or interviews.' }, ...basePitfalls()],
  },
  22: {
    why: 'A/B testing prompts reveals which changes improve quality reliably.',
    goals: ['Define evaluation criteria.', 'Run a small A/B test.', 'Pick a winner with evidence.'],
    definitions: [
      { term: 'Variant', def: 'A version of a prompt with one intentional change.' },
      { term: 'Evaluation set', def: 'A set of inputs used to compare variants fairly.' },
      { term: 'Metric', def: 'A measurable signal of quality (rubric score, error rate, time to edit).' },
    ],
    steps: [
      'Define 1–3 metrics (rubric score, factual accuracy, edit time).',
      'Create an evaluation set (5–10 representative inputs).',
      'Write variant A and variant B with one change.',
      'Run both on the same set and score with a rubric.',
      'Adopt the winner and document the change.',
    ],
    good: 'You compare prompts using the same inputs and a rubric, then adopt the winner.',
    bad: 'You pick a prompt based on a single run and vibes.',
    checklist: ['One change per variant.', 'Same inputs used.', 'Rubric scoring used.', 'Winner documented.'],
    metrics: ['Rubric score improves; edit time decreases.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Changing multiple variables at once.', fix: 'Only change one thing per variant.' }, ...basePitfalls()],
  },
  23: {
    why: 'Rubrics turn subjective “good” into a consistent scoring system.',
    goals: ['Write a rubric with criteria.', 'Score outputs reliably.', 'Use the rubric to guide revisions.'],
    definitions: [
      { term: 'Rubric', def: 'A scoring guide with criteria and levels (e.g., 1–5).' },
      { term: 'Criterion', def: 'One dimension of quality (accuracy, clarity, completeness, tone).' },
      { term: 'Anchor example', def: 'A small example that represents a score level.' },
    ],
    steps: [
      'Pick 4–6 criteria and define them.',
      'Create 3 score levels (poor/okay/great) with anchors.',
      'Score 3 outputs and discuss discrepancies.',
      'Revise prompts to target the lowest-scoring criterion.',
      'Re-run scoring to verify improvement.',
    ],
    good: 'You can score outputs consistently and improve prompts based on rubric feedback.',
    bad: 'Quality depends on who reviews it and what mood they’re in.',
    checklist: ['Criteria defined.', 'Anchors exist.', 'Scores are repeatable.', 'Rubric informs revisions.'],
    metrics: ['Inter-rater agreement improves; rubric scores trend up.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Rubric too vague.', fix: 'Add concrete anchors and examples per level.' }, ...basePitfalls()],
  },
  24: {
    why: 'Refusals and hallucinations are manageable if you handle uncertainty and scope correctly.',
    goals: ['Recognize refusal vs uncertainty vs hallucination.', 'Ask follow-ups safely.', 'Remove unsupported claims.'],
    definitions: [
      { term: 'Refusal', def: 'The model declines due to policy or missing info.' },
      { term: 'Uncertainty', def: 'The model indicates it may be wrong or needs more data.' },
      { term: 'Hallucination', def: 'A confident but unsupported claim.' },
    ],
    steps: [
      'If refused: reframe the request to a safe alternative (general guidance, template, questions).',
      'If uncertain: ask clarifying questions or request sources.',
      'If hallucinating: remove the claim; ask for evidence or mark as unknown.',
      'Add a “do not fabricate” guardrail to prompts.',
      'Use a verification checklist for any factual output.',
    ],
    good: 'You handle refusals by reframing and handle uncertainty by asking for inputs/sources.',
    bad: 'You push for an answer and accept invented details.',
    checklist: ['Refusal path exists.', 'Uncertainty triggers questions.', 'Unsupported claims removed.', 'Verification applied.'],
    metrics: ['Unsupported claims shipped: 0.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Arguing with refusals.', fix: 'Reframe to safe requests: templates, questions, general guidance.' }, ...basePitfalls()],
  },
  25: {
    why: 'Privacy guardrails prevent accidental data leaks and compliance issues.',
    goals: ['Define what data is sensitive.', 'Write redaction rules.', 'Add a do-not-store rule.'],
    definitions: [
      { term: 'PII', def: 'Personally identifiable information (name, email, address, IDs) depending on context.' },
      { term: 'Sensitive data', def: 'Anything that could harm a person or company if leaked (contracts, secrets, health, finance).' },
      { term: 'Redaction', def: 'Removing or masking sensitive fields before processing.' },
      { term: 'Data minimization', def: 'Using only the minimum data needed to do the task.' },
    ],
    steps: [
      'List data categories that must never be pasted into prompts.',
      'Create a redaction checklist (replace names/emails with placeholders).',
      'Add a prompt guardrail: do not request or store sensitive data.',
      'Define escalation: if sensitive context is needed, use a secure workflow.',
      'Test with a sample containing fake PII and ensure redaction works.',
    ],
    good: 'You redact data before using AI and you have clear escalation rules.',
    bad: 'You paste customer data into a prompt without redaction or policy.',
    checklist: ['Sensitive categories defined.', 'Redaction checklist exists.', 'Guardrail added.', 'Escalation path exists.'],
    metrics: ['Sensitive data incidents: 0.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Over-sharing data “just in case”.', fix: 'Minimize inputs and use placeholders.' }, ...basePitfalls()],
  },
  26: {
    why: 'Working with tables/CSVs is safe when you keep assumptions explicit and outputs structured.',
    goals: ['Define schema/columns.', 'Ask for calculations with checks.', 'Output a clean summary table.'],
    definitions: [
      { term: 'Schema', def: 'Column names, types, and meanings.' },
      { term: 'Row', def: 'One record/observation.' },
      { term: 'Derived field', def: 'A value computed from other columns.' },
    ],
    steps: [
      'Describe the schema (columns + units).',
      'Define the question and the desired output table.',
      'Compute derived fields with formulas.',
      'Check for missing values and outliers.',
      'Summarize and propose actions.',
    ],
    good: 'A structured output with formulas and checks.',
    bad: 'A narrative summary with guessed numbers and no checks.',
    checklist: ['Schema stated.', 'Formulas shown.', 'Checks included.', 'Output table is clean.'],
    metrics: ['No silent assumptions; calculations verified.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Ambiguous columns.', fix: 'Ask for definitions and units before calculating.' }, ...basePitfalls()],
  },
  27: {
    why: 'Personalization works when it is grounded in real signals and bounded by compliance rules.',
    goals: ['Generate a sequence with variations.', 'Personalize using safe fields.', 'Track response and iterate.'],
    definitions: [
      { term: 'Sequence', def: 'A planned series of messages with different intents.' },
      { term: 'Personalization field', def: 'A safe, factual variable like role, company, pain point from public info.' },
      { term: 'Compliance rule', def: 'A constraint that prevents spam, deception, or policy violations.' },
    ],
    steps: [
      'Define the sequence goal (reply, meeting, follow-up).',
      'Define allowed personalization fields (no private data).',
      'Write 3–5 emails with different angles.',
      'Add a QA checklist: truthfulness, tone, compliance, length.',
      'A/B test subject lines and track outcomes.',
    ],
    good: 'A sequence with safe personalization and clear QA and metrics.',
    bad: 'Over-personalized emails that invent facts or violate policy.',
    checklist: ['Allowed fields defined.', 'No invented facts.', 'QA checklist applied.', 'Metrics tracked.'],
    metrics: ['Reply rate tracked; edits per email decreases.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Inventing personalization.', fix: 'Use only verified fields; otherwise ask for inputs.' }, ...basePitfalls()],
  },
  28: {
    why: 'Slides and briefs require strong structure and crisp wording.',
    goals: ['Create a slide storyboard.', 'Draft speaker notes or brief text.', 'Run a clarity check.'],
    definitions: [
      { term: 'Storyboard', def: 'Slide-by-slide plan with key message per slide.' },
      { term: 'Key message', def: 'The single point the slide must communicate.' },
      { term: 'Supporting points', def: 'Bullets/data that support the key message.' },
    ],
    steps: [
      'Define audience and decision context.',
      'Create a 8–12 slide storyboard with key message per slide.',
      'Draft bullets and one proof point per slide.',
      'Draft speaker notes (optional) and tighten wording.',
      'QA for clarity: each slide has one message.',
    ],
    good: 'A storyboard where each slide has one message and proof points.',
    bad: 'Slides with many ideas and no structure.',
    checklist: ['One message per slide.', 'Proof points included.', 'Wording tightened.', 'Decision context clear.'],
    metrics: ['Time to present reduced; clarity improved.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Slides that are documents.', fix: 'Put detail in notes; keep slides crisp.' }, ...basePitfalls()],
  },
  29: {
    why: 'A personal workflow is valuable only if it is repeatable, measurable, and reviewed.',
    goals: ['Design a daily workflow with AI.', 'Define inputs/outputs per step.', 'Schedule a review cadence.'],
    definitions: [
      { term: 'Daily workflow', def: 'A repeatable set of steps you run each day.' },
      { term: 'Review cadence', def: 'A scheduled time to reflect, adjust, and update templates.' },
      { term: 'Success criteria', def: 'A checklist/rubric that defines “good enough”.' },
    ],
    steps: [
      'Pick 3 daily tasks (plan, write, reply, summarize).',
      'Define a workflow step for each task (draft → critique → revise → QA).',
      'Create templates with placeholders.',
      'Define metrics (time saved, edit count, error rate).',
      'Schedule a weekly review to update templates.',
    ],
    good: 'A workflow you can run daily with templates and review cadence.',
    bad: 'Random prompting that produces inconsistent results and no learning loop.',
    checklist: ['Daily tasks listed.', 'Templates exist.', 'Metrics tracked.', 'Weekly review scheduled.'],
    metrics: ['Consistency improves week over week.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'No review cadence.', fix: 'Schedule a weekly review and log improvements.' }, ...basePitfalls()],
  },
  30: {
    why: 'A capstone forces an end-to-end workflow and exposes where your system breaks.',
    goals: ['Build an end-to-end workflow.', 'Add QA and guardrails.', 'Ship a final output you can reuse.'],
    definitions: [
      { term: 'End-to-end', def: 'From raw input to shipped output with checks and documentation.' },
      { term: 'System', def: 'Templates + workflow + QA + review cadence.' },
      { term: 'Evidence', def: 'Proof that the output meets criteria (tests, sources, checks).' },
    ],
    steps: [
      'Pick one real deliverable (brief, FAQ, outreach sequence, summary).',
      'Write the workflow: inputs → draft → critique → revise → QA → ship.',
      'Add a rubric and red-flag rules.',
      'Run the workflow and record what failed.',
      'Update templates so next run is faster and safer.',
    ],
    good: 'A capstone deliverable with a reusable workflow and QA evidence.',
    bad: 'A capstone output with no QA, no rubric, and no plan to reuse it.',
    checklist: ['Workflow documented.', 'Rubric exists.', 'QA performed.', 'Templates updated.', 'Next review scheduled.'],
    metrics: ['Reusability: you can run the workflow again next week.', ...baseMetrics()],
    pitfalls: [{ pitfall: 'Treating capstone as one-off.', fix: 'Capture templates and a review cadence so it becomes a system.' }, ...basePitfalls()],
  },
};

function buildLessonHtml(params: { day: number; title: string; plan: TopicPlan }) {
  const { day, title, plan } = params;
  const defs = plan.definitions.map((d) => `${d.term}: ${d.def}`);
  const pitfalls = plan.pitfalls.map((p) => `Pitfall: ${p.pitfall} Fix: ${p.fix}`);

  return (
    `<h1>${escapeHtml(`AI 30-Day — Day ${day}`)}</h1>\n` +
    `<h2>${escapeHtml(title)}</h2>\n` +
    `<p><strong>Why it matters:</strong> ${escapeHtml(plan.why)}</p>\n` +
    `<h2>Goals</h2>\n` +
    ul(plan.goals) +
    `<h2>Key definitions</h2>\n` +
    ul(defs) +
    `<h2>Workflow (step-by-step)</h2>\n` +
    ol(plan.steps) +
    `<h2>Example (good vs bad)</h2>\n` +
    `<p><strong>✅ Good:</strong> ${escapeHtml(plan.good)}</p>\n` +
    `<p><strong>❌ Bad:</strong> ${escapeHtml(plan.bad)}</p>\n` +
    `<h2>Checklist</h2>\n` +
    ul(plan.checklist) +
    `<h2>Metrics / criteria</h2>\n` +
    ul(plan.metrics) +
    `<h2>Common mistakes + fixes</h2>\n` +
    ul(pitfalls) +
    (plan.prompts?.length ? `<h2>Practice prompts</h2>\n${ul(plan.prompts)}` : '')
  );
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'en') {
    throw new Error(`Course language is not EN for ${COURSE_ID} (found: ${course.language})`);
  }

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .select({ _id: 1, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
    .lean();

  // Deduplicate by dayNumber (keep oldest record per day)
  const byDay = new Map<number, any>();
  for (const lesson of lessons) {
    const existing = byDay.get(lesson.dayNumber);
    if (!existing) {
      byDay.set(lesson.dayNumber, lesson);
      continue;
    }
    const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
    const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
    if (b < a) byDay.set(lesson.dayNumber, lesson);
  }

  const stamp = isoStamp();
  mkdirSync(OUT_DIR, { recursive: true });

  const planRows: any[] = [];
  const applyResults: any[] = [];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  for (let day = FROM_DAY; day <= TO_DAY; day++) {
    const lesson = byDay.get(day);
    if (!lesson) {
      planRows.push({ day, action: 'SKIP_NO_LESSON', reason: 'Missing lesson in DB for that day' });
      continue;
    }

    const plan = DAY_PLAN[day];
    if (!plan) {
      planRows.push({ day, lessonId: lesson.lessonId, action: 'SKIP_NO_PLAN', reason: 'Missing day plan in refiner' });
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldTitle = String(lesson.title || '');
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'en' });
    const oldIntegrity = validateLessonRecordLanguageIntegrity({
      language: 'en',
      content: oldContent,
      emailSubject: lesson.emailSubject || null,
      emailBody: lesson.emailBody || null,
    });

    if (oldScore.score >= 70 && oldIntegrity.ok) {
      planRows.push({
        day,
        lessonId: lesson.lessonId,
        title: oldTitle,
        action: 'SKIP_ALREADY_OK',
        quality: { old: oldScore, next: oldScore },
        lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(oldContent).length },
        applyEligible: true,
      });
      continue;
    }

    const nextTitle = String(oldTitle || `AI 30-Day — Day ${day}`).trim();
    const nextContent = buildLessonHtml({ day, title: nextTitle, plan });
    const nextScore = assessLessonQuality({ title: nextTitle, content: nextContent, language: 'en' });

    const emailSubject = `AI 30-Day – Day ${day}: ${nextTitle}`;
    const emailBody =
      `<h1>AI 30-Day – Day ${day}</h1>\n` +
      `<h2>${escapeHtml(nextTitle)}</h2>\n` +
      `<p>${escapeHtml(plan.why)}</p>\n` +
      `<p><a href=\"${appUrl}/en/courses/${COURSE_ID}/day/${day}\">Open lesson →</a></p>`;

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'en',
      content: nextContent,
      emailSubject,
      emailBody,
    });

    planRows.push({
      day,
      lessonId: lesson.lessonId,
      title: nextTitle,
      action: 'REFINE',
      quality: { old: oldScore, next: nextScore },
      lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(nextContent).length },
      applyEligible: nextScore.score >= 70 && integrity.ok,
      languageIntegrity: integrity,
    });

    if (!APPLY) continue;
    if (!integrity.ok) {
      throw new Error(
        `Language integrity failed for ${COURSE_ID} day ${day} (${lesson.lessonId}): ${integrity.errors[0] || 'unknown'}`
      );
    }
    if (nextScore.score < 70) {
      throw new Error(`Refined lesson score is still below 70 for ${COURSE_ID} day ${day} (${lesson.lessonId})`);
    }

    const courseFolder = join(BACKUP_DIR, COURSE_ID);
    mkdirSync(courseFolder, { recursive: true });
    const backupPath = join(courseFolder, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          courseId: COURSE_ID,
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          title: oldTitle,
          content: oldContent,
          emailSubject: lesson.emailSubject || null,
          emailBody: lesson.emailBody || null,
        },
        null,
        2
      )
    );

    const update = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          title: nextTitle,
          content: nextContent,
          emailSubject,
          emailBody,
          'metadata.updatedAt': new Date(),
        },
      }
    );

    applyResults.push({
      day,
      lessonId: lesson.lessonId,
      backupPath,
      matched: update.matchedCount,
      modified: update.modifiedCount,
      newScore: nextScore.score,
    });
  }

  const reportPath = join(OUT_DIR, `lesson-refine-preview__${COURSE_ID}__${stamp}.json`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseId: COURSE_ID,
        fromDay: FROM_DAY,
        toDay: TO_DAY,
        apply: APPLY,
        totals: {
          considered: planRows.length,
          eligible70: planRows.filter((r) => r.applyEligible).length,
          below70: planRows.filter((r) => !r.applyEligible).length,
          applied: applyResults.length,
        },
        planRows,
        applyResults,
      },
      null,
      2
    )
  );

  console.log('✅ Lesson refinement preview complete');
  console.log(`- Apply mode: ${APPLY ? 'YES (DB writes + backups)' : 'NO (dry-run only)'}`);
  console.log(`- Report: ${reportPath}`);
  if (APPLY) console.log(`- Backups: ${join(BACKUP_DIR, COURSE_ID)}`);
  if (APPLY) console.log(`- Applied lessons: ${applyResults.length}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

