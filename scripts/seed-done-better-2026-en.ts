/**
 * Seed Done is better - Build What Matters (DONE_BETTER_2026_EN)
 *
 * Creates/updates the 30-day course with lessons and quizzes.
 * CCS: docs/canonical/DONE_BETTER_2026/
 * Quiz gates: 0 RECALL, ≥7 questions/lesson, ≥5 APPLICATION, ≥2 CRITICAL_THINKING.
 *
 * Usage:
 *   npx ts-node scripts/seed-done-better-2026-en.ts [--apply] [--update-existing-lessons] [--include-quizzes]
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import {
  Brand,
  CCS,
  Course,
  Lesson,
  QuizQuestion,
  QuestionDifficulty,
  QuizQuestionType
} from '../app/lib/models';

const CCS_ID = 'DONE_BETTER_2026';
const COURSE_ID = 'DONE_BETTER_2026_EN';
const COURSE_NAME = 'Done is better - Build What Matters';
const COURSE_DESCRIPTION =
  'This course trains you to think like a problem-solver, not a task-doer. You will learn how to break any complex situation into elemental parts, choose the right move, ship small, test fast, and speak the truth without distortion. Built on Pólya\'s thinking framework and modern delivery culture, this is a 30-day mental reset for founders, leaders, and builders who are tired of being busy and want to become effective. You will not "consume content." You will think, decide, and deliver.';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

const APPLY = hasFlag('--apply');
const ONLY_MISSING_LESSONS = !hasFlag('--update-existing-lessons');
const INCLUDE_QUIZZES = hasFlag('--include-quizzes');

type LessonEntry = {
  day: number;
  title: string;
  oneLiner: string;
  goals: string[];
  whyItMatters: string[];
  keyIdea: string;
  procedure?: string;
  example?: string;
  commonMistakes: string[];
  todaysMove: string;
  emailSubject?: string;
  emailBody?: string;
};

function buildContent(entry: LessonEntry): string {
  let html = `<h1>${entry.title}</h1>\n<p><em>${entry.oneLiner}</em></p>\n<hr />\n<h2>Learning goal</h2>\n<ul>\n${entry.goals.map((g) => `<li>${g}</li>`).join('\n')}\n</ul>\n<hr />\n<h2>Why it matters</h2>\n<ul>\n${entry.whyItMatters.map((w) => `<li>${w}</li>`).join('\n')}\n</ul>\n<hr />\n<h2>Key idea</h2>\n<p>${entry.keyIdea}</p>`;
  if (entry.procedure) html += `\n<hr />\n<h2>Procedure</h2>\n${entry.procedure}`;
  if (entry.example) html += `\n<hr />\n<h2>Example</h2>\n${entry.example}`;
  html += `\n<hr />\n<h2>Common mistakes</h2>\n<ul>\n${entry.commonMistakes.map((m) => `<li>${m}</li>`).join('\n')}\n</ul>\n<hr />\n<h2>Today's move</h2>\n<p>${entry.todaysMove}</p>\n<hr />\n<h2>Self-check</h2>\n<ul>\n<li>You can explain the key idea in one sentence.</li>\n<li>You have one concrete move to do today.</li>\n</ul>`;
  return html;
}

const lessonPlan: LessonEntry[] = [
  {
    day: 1,
    title: 'Welcome to Real Thinking',
    oneLiner: 'This is not about being smart. It is about being effective.',
    goals: [
      'Distinguish being effective from being busy or smart.',
      'Commit to think, decide, and deliver as a loop.',
      'See the course as a system, not motivation.'
    ],
    whyItMatters: [
      'Activity is not progress.',
      'Motivation fades; systems persist.',
      'Operational thinking beats inspiration for delivery.'
    ],
    keyIdea:
      'Effectiveness means outcomes over activity. You will build a repeatable loop: understand, decide, deliver, then reflect and adjust.',
    commonMistakes: [
      'Confusing activity with progress.',
      'Waiting for motivation instead of using a system.',
      'Treating the course as inspiration only.'
    ],
    todaysMove:
      "Write one sentence: What does being effective mean for you this month? Commit to one small loop you will run daily (e.g. 5 min: what did I learn, what do I do next)."
  },
  {
    day: 2,
    title: 'What Is a Problem, Really?',
    oneLiner: 'Learn to separate symptoms from the real challenge.',
    goals: [
      'Define problem vs symptom.',
      'Identify the real challenge behind observable signs.',
      'Apply the separation in one real situation.'
    ],
    whyItMatters: [
      'Treating symptoms wastes effort and leaves the cause intact.',
      'The first thing you see is often not the root cause.',
      'Action on the wrong target creates noise, not progress.'
    ],
    keyIdea:
      'A problem is a gap between current state and desired state. A symptom is what you observe. Find what would have to be true for the symptom to exist; that points to the real problem.',
    procedure: `<ol>
<li>List what you observe (symptoms).</li>
<li>Ask: what would have to be true for this to happen?</li>
<li>Identify the gap between current and desired state.</li>
<li>State the problem in one sentence.</li>
<li>Check: is this actionable?</li>
</ol>`,
    example: `<p><strong>Scenario:</strong> A team keeps missing deadlines.</p>
<p><strong>Diagnosis:</strong> Missing deadlines is a symptom; the problem might be unclear scope, no buffer, or wrong capacity.</p>
<p><strong>Better approach:</strong> Ask what would have to be true for deadlines to be missed; find the gap (e.g. scope creep); state the problem as an actionable gap.</p>`,
    commonMistakes: [
      'Treating the first observable sign as the problem.',
      'Solving symptoms repeatedly without finding the cause.',
      'Stating the problem in vague or non-actionable terms.'
    ],
    todaysMove: 'Pick one situation where something keeps going wrong. List symptoms, then write one sentence: what is the real problem (the gap)?'
  },
  {
    day: 3,
    title: 'Understand Before You Move',
    oneLiner: 'If you do not understand the problem, every action is noise.',
    goals: [
      'Clarify understanding before acting.',
      'List what you know and what you do not know.',
      'Avoid action as a substitute for understanding.'
    ],
    whyItMatters: [
      'Acting without understanding multiplies rework.',
      'Checking understanding is cheaper than fixing wrong execution.',
      'Unknowns are data; name them.'
    ],
    keyIdea:
      'Understanding means clarity about what is really going on. List knowns and unknowns. Do not use activity to avoid the cost of thinking.',
    commonMistakes: [
      'Acting first and thinking later.',
      'Assuming understanding without checking.',
      'Ignoring unknowns.'
    ],
    todaysMove: 'Before your next big action: write 3 things you know for sure and 3 things you do not know yet. Decide one small step to reduce the most important unknown.'
  },
  {
    day: 4,
    title: 'Unknowns Are Assets',
    oneLiner: 'What you do not know is not weakness. It is your map.',
    goals: [
      'List unknowns explicitly.',
      'Use unknowns to guide inquiry and next steps.',
      'Reduce the cost of not knowing by naming it.'
    ],
    whyItMatters: [
      'Hidden unknowns cause surprises and rework.',
      'Naming unknowns turns them into a checklist.',
      'Saying "I don\'t know yet" is leadership.'
    ],
    keyIdea:
      'Unknowns are what you do not yet know. Treat them as assets: they tell you what to learn or validate next. Communicate them so others can align.',
    commonMistakes: [
      'Hiding or avoiding unknowns.',
      'Treating not knowing as failure.',
      'Making decisions as if unknowns do not exist.'
    ],
    todaysMove: 'For one current project, write a short "unknowns list": what you do not know yet and when or how you will find out. Share it with one stakeholder.'
  },
  {
    day: 5,
    title: 'Rewriting the Problem',
    oneLiner: 'If you cannot restate it clearly, you do not own it.',
    goals: [
      'Restate the problem in your own words.',
      'Make it clear enough to explain in 30 seconds.',
      'Lock the restatement as the working problem.'
    ],
    whyItMatters: [
      'Jargon and inherited wording hide fuzzy thinking.',
      'Restatement forces ownership.',
      'Clear problem statements lead to better solutions.'
    ],
    keyIdea:
      'Rewrite the problem in plain language. If you cannot explain it to someone else in 30 seconds, simplify again. The restatement is the problem you will solve.',
    procedure: `<ol>
<li>Write the problem as given.</li>
<li>Rewrite it in your own words (no jargon).</li>
<li>Ask: what would solving this look like?</li>
<li>If you cannot explain it in 30 seconds, simplify again.</li>
<li>Lock the restatement as the working problem.</li>
</ol>`,
    commonMistakes: [
      'Using jargon or someone else\'s wording without internalizing.',
      'Keeping the problem fuzzy.',
      'Skipping restatement and going straight to solutions.'
    ],
    todaysMove: 'Take the problem from Day 2. Rewrite it in three sentences or less so a colleague could understand it without context. Use that as your working problem.'
  }
];

// Append lessons 6–30 with the same structure (compact entries)
const restOfLessons: Omit<LessonEntry, 'day'>[] = [
  {
    title: 'Decompose Everything',
    oneLiner: 'Big problems dissolve when cut into elemental parts.',
    goals: ['Break the problem into sub-problems or components.', 'Identify which parts can be tested or solved independently.', 'Choose the first slice to work on.'],
    whyItMatters: ['One big blob is paralyzing.', 'Small parts can be completed and tested.', 'Decomposition reveals leverage points.'],
    keyIdea: 'Decomposition is breaking a big problem into smaller, elemental parts. Big problems dissolve when cut into parts. Then pick the first slice or the leverage point.',
    procedure: '<ol><li>List sub-problems or components.</li><li>For each: can it be solved or tested independently?</li><li>Identify which component, if fixed, would ease the rest (leverage point).</li><li>Pick the first move on the leverage point or the smallest testable slice.</li></ol>',
    commonMistakes: ['Trying to solve the whole thing at once.', 'Decomposing into too many tiny pieces with no prioritization.', 'Ignoring dependencies between parts.'],
    todaysMove: 'Decompose your working problem into 3–5 sub-parts. Mark which one is the leverage point or the smallest testable slice. Choose the first move on that.'
  },
  {
    title: 'Find the Leverage Point',
    oneLiner: 'Not every piece matters equally. Learn to spot the hinge.',
    goals: ['Identify where a small change would have large effect.', 'Prioritize moves that address the leverage point.', 'Avoid spreading effort evenly everywhere.'],
    whyItMatters: ['Equal effort everywhere is inefficient.', 'Leverage multiplies impact.', 'Spotting the hinge is a skill.'],
    keyIdea: 'A leverage point is a part of the system where a small change produces a large effect. Not every piece matters equally; learn to spot the hinge.',
    commonMistakes: ['Treating all parts as equally important.', 'Working on what is easy instead of what matters most.', 'Confusing activity at the leverage point with busywork elsewhere.'],
    todaysMove: 'For your decomposed problem, name the single highest-leverage component. Commit one concrete move on that component this week.'
  },
  {
    title: 'Plans Are Hypotheses',
    oneLiner: 'A plan is not truth. It is a bet.',
    goals: ['Frame plans as hypotheses to be tested.', 'Define what would confirm or disprove the plan.', 'Update the plan when evidence contradicts it.'],
    whyItMatters: ['Plans are guesses about the future.', 'Evidence should update the plan.', 'Defending a failed plan wastes resources.'],
    keyIdea: 'A plan is a bet: if we do X, we expect Y. Define the smallest test of that bet. When evidence says otherwise, update the hypothesis; do not defend the plan.',
    procedure: '<ol><li>Write the plan as a bet: if we do X, we expect Y.</li><li>Define the smallest test of that bet (one move).</li><li>Set a time or signal to evaluate: did Y happen?</li><li>If not, update the hypothesis; do not defend the plan.</li></ol>',
    commonMistakes: ['Treating the plan as fixed and defending it.', 'No clear criterion for success or failure.', 'Confusing planning with execution.'],
    todaysMove: 'Turn one current plan into a hypothesis: "If we [do X], we expect [Y]." Define one test you can run this week to check it.'
  },
  {
    title: 'Think in Moves, Not Projects',
    oneLiner: 'Replace "big delivery" with "next testable step."',
    goals: ['Define a move: one testable step.', 'Choose the next move from the current state.', 'Avoid project theater: long plans with no small wins.'],
    whyItMatters: ['Big deliverables delay feedback.', 'Moves create momentum and learning.', 'Testable steps reduce risk.'],
    keyIdea: 'A move is a single, testable next step that advances toward an outcome. Replace big delivery with next testable step. No move = no progress.',
    procedure: '<ol><li>State the outcome you want.</li><li>What is the smallest step that could be done and verified today or this week?</li><li>Define done for that step (testable).</li><li>Do it; then decide the next step from evidence.</li></ol>',
    commonMistakes: ['Defining deliverables that are too big to test soon.', 'Confusing motion (lots of activity) with moves (testable steps).', 'No clear done for the current step.'],
    todaysMove: 'For your current goal, write the next move in one sentence. Make it testable: you can say "done" when X is true.'
  },
  {
    title: 'Analogy as a Weapon',
    oneLiner: 'Borrow patterns from other domains to unlock new paths.',
    goals: ['Find a similar problem in another domain.', 'Extract the structure (not the content).', 'Apply the structure to your problem.'],
    whyItMatters: ['Other domains have solved similar structures.', 'Structure transfers; content does not.', 'Analogies unlock creativity.'],
    keyIdea: 'Use patterns from other domains to unlock new paths. Borrow structure, not literal copy. Extract the mechanism and apply it to your context.',
    commonMistakes: ['Copying solutions literally without adapting.', 'Dismissing analogies as irrelevant.', 'Using analogy to avoid doing the work of understanding.'],
    todaysMove: 'Pick your current problem. Find one analogy from another field (sport, nature, another industry). Write how the structure maps; then one move inspired by it.'
  },
  {
    title: 'Working Backwards',
    oneLiner: 'Start from the result and reverse-engineer the path.',
    goals: ['Describe the end state concretely.', 'Work backwards step by step to today.', 'Use the first backwards step as the first move.'],
    whyItMatters: ['Starting from today often drifts.', 'End state clarifies what done looks like.', 'Backwards planning reduces waste.'],
    keyIdea: 'Working backwards means starting from the desired result and reverse-engineering the path. Describe the end state in concrete terms; then what must be true the step before; repeat until you reach today.',
    procedure: '<ol><li>Describe the end state in concrete terms.</li><li>What must be true the step before that?</li><li>Repeat until you reach today.</li><li>First move = the step that gets you one notch toward the end state.</li></ol>',
    commonMistakes: ['Vague end state (e.g. "we will be better").', 'Skipping steps in the backwards chain.', 'Starting from today and hoping to reach the goal.'],
    todaysMove: 'Define the end state for one goal in concrete terms. Work backwards 3 steps. Your first move is the step that gets you one notch toward that end.'
  },
  {
    title: 'Simplify Until It Breaks',
    oneLiner: 'Remove everything that does not prove the core.',
    goals: ['Strip the problem or solution to the minimum.', 'Find the point where it breaks (too simple).', 'Add back only what is necessary.'],
    whyItMatters: ['Extra complexity hides the core.', 'Minimum viable reveals what really matters.', 'Simplify until it breaks; then you know the minimum.'],
    keyIdea: 'Simplification is removing everything that does not prove the core. Strip to the minimum; find where it breaks; add back only what is necessary.',
    commonMistakes: ['Adding features or steps before proving the core.', 'Equating simple with trivial.', 'Not testing the simplified version.'],
    todaysMove: 'Take one process or plan. Remove one element. Can you still achieve the goal? If yes, leave it out. If no, you found essential; add it back and try removing something else.'
  },
  {
    title: 'Multiple Paths Thinking',
    oneLiner: 'One plan is hope. Three plans is control.',
    goals: ['Generate at least three different paths to the goal.', 'Assess risk and cost for each.', 'Choose one to execute; keep a backup.'],
    whyItMatters: ['Single plan = single point of failure.', 'Alternatives reduce anxiety and increase options.', 'Revisiting plans when evidence changes is control.'],
    keyIdea: 'Multiple paths means having more than one plan so that failure of one does not mean failure of the goal. One plan is hope; three plans is control.',
    procedure: '<ol><li>Define the goal.</li><li>List at least three different ways to get there.</li><li>For each: main risk and cost.</li><li>Choose one to execute first; keep one as backup; park the third.</li><li>Revisit when you have new evidence.</li></ol>',
    commonMistakes: ['Betting everything on one plan.', 'Treating backup plans as lack of commitment.', 'Never revisiting plans when evidence changes.'],
    todaysMove: 'For one important goal, list 3 different paths. Pick one to run first and one as backup. Write down the trigger that would make you switch.'
  },
  {
    title: 'Choose with Intent',
    oneLiner: 'Decision is a skill. You will stop drifting.',
    goals: ['Use criteria and boundaries to decide.', 'Make the decision explicit (what we chose and why).', 'Avoid drift: defaulting without choosing.'],
    whyItMatters: ['Implicit decisions cause misalignment.', 'Explicit choices create accountability.', 'Decision is a skill you can practice.'],
    keyIdea: 'Decision as skill means choosing with intent using criteria and boundaries, not drift. Make the decision explicit: what we chose and why. You stop drifting when you practice it.',
    commonMistakes: ['Delaying decision by asking for more data indefinitely.', 'Implicit decisions that no one wrote down.', 'Confusing consensus with a clear decision.'],
    todaysMove: 'Make one decision today that you would have left vague. Write it down: what we chose, why, and what we are not doing.'
  },
  {
    title: 'Done Means Testable',
    oneLiner: 'If it cannot be tested, it does not exist.',
    goals: ['Define done as a testable condition.', 'Refuse vague done (e.g. when it feels right).', 'Use testability to scope the next move.'],
    whyItMatters: ['Vague done leads to endless scope creep.', 'Testable done enables feedback.', 'If it cannot be tested, it does not exist as done.'],
    keyIdea: 'Done means the outcome can be verified or tested. Refuse vague done. Use testability to scope the next move and to know when to stop.',
    commonMistakes: ['Accepting done without a clear test.', 'Moving on before the test is run.', 'Defining tests that are too expensive to run.'],
    todaysMove: 'For your current next move, write the test: "We are done when [observable condition]." If you cannot write it, the move is too vague; narrow it.'
  },
  {
    title: 'Ship the Skeleton',
    oneLiner: 'Build the bones before you paint the skin.',
    goals: ['Identify the minimal structure that could work.', 'Ship or test that first.', 'Add detail only after the skeleton is validated.'],
    whyItMatters: ['Polish before proof wastes time.', 'Skeleton first reduces risk.', 'Detail after validation is efficient.'],
    keyIdea: 'Skeleton first means building the minimal structure before adding detail. Build the bones before you paint the skin. Add detail only after the skeleton is validated.',
    commonMistakes: ['Polishing before proving.', 'Confusing skeleton with incomplete or shoddy work.', 'Never shipping the skeleton because it is not perfect.'],
    todaysMove: 'Identify one deliverable you are working on. Strip it to the skeleton: the minimum that could be tested. Ship or test that this week.'
  },
  {
    title: 'Fast Feedback Loops',
    oneLiner: 'Reality is your best mentor.',
    goals: ['Shorten the time between action and signal.', 'Use feedback to adjust the next move.', 'Avoid long cycles with no learning.'],
    whyItMatters: ['Long cycles delay learning.', 'Reality corrects plans.', 'Fast loops reduce cost of being wrong.'],
    keyIdea: 'A feedback loop is getting real-world signal quickly to adjust the next move. Reality is your best mentor. Shorten the time between action and signal.',
    commonMistakes: ['Waiting too long before checking reality.', 'Ignoring feedback that contradicts the plan.', 'Measuring only what confirms the plan.'],
    todaysMove: 'For one active initiative, define the next feedback moment: when and how you will get signal. Move it earlier if possible.'
  },
  {
    title: 'Kill Beautiful Ideas Early',
    oneLiner: 'The earlier it dies, the cheaper it is.',
    goals: ['Define a test or signal that would kill the idea.', 'Run the test as soon as possible.', 'Stop investing when the idea fails the test.'],
    whyItMatters: ['Sunk cost grows over time.', 'Early kill saves resources.', 'Killing an idea is not personal failure.'],
    keyIdea: 'Kill early means stopping bad or wrong ideas as soon as evidence shows they do not work. Define the kill criterion; run the test; stop investing when it fails.',
    commonMistakes: ['Sunk cost: continuing because we already invested.', 'No clear kill criterion.', 'Treating killing an idea as personal failure.'],
    todaysMove: 'For one idea or project, write the kill criterion: "We stop if [observable condition]." Decide when you will check it.'
  },
  {
    title: 'Measure What Matters',
    oneLiner: 'Opinion ends where data begins.',
    goals: ['Identify metrics that reflect the goal.', 'Avoid vanity metrics.', 'Use data to decide, not to justify after the fact.'],
    whyItMatters: ['Vanity metrics mislead.', 'Data enables better decisions.', 'Opinion ends where data begins.'],
    keyIdea: 'Measure what matters means tracking outcomes that affect the goal, not vanity metrics. Use data to decide; do not use data only to justify after the fact.',
    commonMistakes: ['Measuring what is easy instead of what matters.', 'Opinion over data when both are available.', 'No baseline or target for the metric.'],
    todaysMove: 'For one goal, name one metric that directly reflects success. Define how you will get the data and how often you will check it.'
  },
  {
    title: 'Pivot Without Drama',
    oneLiner: 'Changing direction is strength, not failure.',
    goals: ['Recognize when evidence says to change direction.', 'Pivot without blame or drama.', 'Update the plan and the next move; do not hide the pivot.'],
    whyItMatters: ['Sticking to a wrong plan is failure.', 'Pivoting is learning.', 'Transparency about pivot builds trust.'],
    keyIdea: 'Pivot means changing direction based on evidence without treating it as failure. Update the plan and the next move; do not hide the pivot. Changing direction is strength.',
    commonMistakes: ['Treating pivot as failure.', 'Sticking to the plan when it is clearly wrong.', 'Pivoting without learning (same mistake in new direction).'],
    todaysMove: 'If you have evidence that one plan is wrong, state it in one sentence. Propose the pivot and the new next move. Share with one stakeholder.'
  },
  {
    title: 'Momentum Over Comfort',
    oneLiner: 'Progress beats certainty.',
    goals: ['Prefer a small step with uncertainty over waiting for certainty.', 'Use momentum to learn, not to avoid thinking.', 'Balance: move when you have enough to test, not when you have zero risk.'],
    whyItMatters: ['Certainty rarely arrives.', 'Momentum creates learning.', 'Progress beats certainty.'],
    keyIdea: 'Momentum is progress over time; prefer it over waiting for certainty. Move when you have enough to test, not when you have zero risk. Use momentum to learn.',
    commonMistakes: ['Waiting for perfect information before acting.', 'Confusing momentum with recklessness.', 'No learning from the moves you make.'],
    todaysMove: 'Identify one decision you have been delaying for "more information." Define the smallest test you could run with what you have. Schedule it.'
  },
  {
    title: 'Truth Is a Tool',
    oneLiner: 'Accuracy beats politeness.',
    goals: ['State facts and assessments clearly.', 'Separate truth from tone (you can be direct and respectful).', 'Use truth to fix problems, not to blame.'],
    whyItMatters: ['Softening the message often hides the fix.', 'Accuracy enables correction.', 'Truth is a tool, not a weapon.'],
    keyIdea: 'Truth as a tool means using accuracy and candor as operating principles. Accuracy beats politeness in the long run. Be direct and respectful; use truth to fix, not to blame.',
    commonMistakes: ['Softening the message until it is unclear.', 'Using truth as a weapon rather than a tool.', 'Avoiding hard truths to keep peace short-term.'],
    todaysMove: 'Identify one message you have been softening. Rewrite it in one sentence: clear, accurate, and respectful. Deliver it.'
  },
  {
    title: 'No Surprises Culture',
    oneLiner: 'Trust is built before problems appear.',
    goals: ['Share status early: on track, at risk, blocked.', 'Surface bad news with options or a proposed fix.', 'Never hide a miss until the last moment.'],
    whyItMatters: ['Surprises destroy trust.', 'Early signal allows help and adjustment.', 'No surprises is a culture, not a one-off.'],
    keyIdea: 'No surprises means surfacing risks and bad news early so trust is built before problems blow up. Share status early; escalate with a proposed fix; never hide a miss until the last moment.',
    procedure: '<ol><li>Share status early: on track / at risk / blocked.</li><li>Communicate unknowns: what you do not know, when you will know it.</li><li>Escalate bad news with a proposed fix or options.</li><li>Never hide a miss until the last moment.</li></ol>',
    commonMistakes: ['Hoping the problem will go away.', 'Surprising stakeholders at the deadline.', 'No clear escalation path.'],
    todaysMove: 'For one project, send a one-line status: on track / at risk / blocked. If at risk or blocked, add one sentence on what you need or what you propose.'
  },
  {
    title: 'Communicate Unknowns',
    oneLiner: 'Saying "I don\'t know yet" is leadership.',
    goals: ['Name what you do not know.', 'Say when you will know it (or how you will find out).', 'Reduce anxiety by making unknowns explicit.'],
    whyItMatters: ['Hidden unknowns create anxiety.', 'Naming unknowns builds trust.', 'Leadership includes saying "I don\'t know yet."'],
    keyIdea: 'Communicate unknowns means explicitly stating what you do not know yet and when you will know it. Saying "I don\'t know yet" is leadership. Reduce anxiety by making unknowns explicit.',
    commonMistakes: ['Faking certainty when you do not know.', 'Hiding unknowns to look in control.', 'Never updating when you do learn.'],
    todaysMove: 'In your next meeting or update, name one thing you do not know yet and when or how you will find out. Say it out loud.'
  },
  {
    title: 'From Client to Partner',
    oneLiner: 'Transparency turns transactions into alliances.',
    goals: ['Share constraints, timelines, and trade-offs with clients or partners.', 'Invite them into the problem, not just the deliverable.', 'Build trust through transparency, not through overpromising.'],
    whyItMatters: ['Transactions stay fragile.', 'Partners align on reality.', 'Transparency builds long-term trust.'],
    keyIdea: 'Transparency means sharing status, constraints, and unknowns so others can align. Transparency turns transactions into alliances. Invite clients into the problem, not just the deliverable.',
    commonMistakes: ['Hiding problems to preserve the relationship short-term.', 'Treating the client as someone to please rather than to align with.', 'No clear communication cadence.'],
    todaysMove: 'With one client or partner, share one constraint or trade-off you have not mentioned before. Propose how you will handle it together.'
  },
  {
    title: 'Reflect Like a Pro',
    oneLiner: 'Every outcome teaches. Only reflection turns it into skill.',
    goals: ['Run a short reflection: what happened, what we learned, what we change.', 'Extract one rule or checklist item.', 'Do it regularly, not only after failure.'],
    whyItMatters: ['Without reflection, experience stays anecdotal.', 'Reflection turns outcomes into reusable skill.', 'Do it after wins and losses.'],
    keyIdea: 'Reflection is extracting lessons from outcomes so experience becomes skill. Every outcome teaches; only reflection turns it into skill. Run it regularly; extract one rule or checklist item.',
    procedure: '<ol><li>What happened? (facts)</li><li>What did we learn? (insight)</li><li>What do we change next time? (rule or behavior)</li><li>Update your playbook or checklist with one change.</li></ol>',
    commonMistakes: ['Skipping reflection when things go well.', 'Blaming instead of learning.', 'No concrete change (only insights, no new behavior).'],
    todaysMove: 'Run a 5-minute reflection on one recent outcome. Write: what happened, one lesson, one thing you will do differently next time.'
  },
  {
    title: 'Build Your Thinking Loop',
    oneLiner: 'You will design your own repeatable problem engine.',
    goals: ['Define your loop: understand, plan, move, test, reflect, adjust.', 'Document it in a checklist or playbook.', 'Use it on the next problem.'],
    whyItMatters: ['Ad hoc problem-solving is inconsistent.', 'A loop is repeatable and improvable.', 'You leave with a system, not motivation.'],
    keyIdea: 'A thinking loop is a repeatable process: understand, plan, move, test, reflect, adjust. You design your own repeatable problem engine. Document it and use it on the next problem.',
    commonMistakes: ['No written loop (only in your head).', 'One-size-fits-all for every problem type.', 'Never updating the loop after use.'],
    todaysMove: 'Write your loop in 6 steps or fewer. Run it on one small problem this week. Note one change to the loop after you use it.'
  },
  {
    title: 'From Chaos to Clarity',
    oneLiner: 'Learn to enter any mess and create order.',
    goals: ['Apply the full loop to a messy situation.', 'Create order through structure (decompose, leverage, moves).', 'Leave the situation clearer than you found it.'],
    whyItMatters: ['Chaos is costly.', 'Structure creates clarity.', 'Leaving things clearer is leadership.'],
    keyIdea: 'Chaos to clarity means entering a messy situation and creating order through structure and priorities. Use decompose, leverage, moves. Leave the situation clearer than you found it.',
    commonMistakes: ['Trying to fix everything at once.', 'Adding process for its own sake.', 'Leaving without a clear next owner or next step.'],
    todaysMove: 'Pick one messy area (inbox, project, relationship). Apply: decompose, find leverage, name the next move. Write the new structure in 5 bullets or fewer.'
  },
  {
    title: 'Your Personal Playbook',
    oneLiner: 'Codify how you think, decide, and deliver.',
    goals: ['Write your playbook: principles, checklists, and rules.', 'Include problem separation, restatement, moves, feedback, reflection.', 'Commit to one improvement in the playbook from this course.'],
    whyItMatters: ['A playbook makes your system portable.', 'You can improve what you document.', 'Codify how you think, decide, and deliver.'],
    keyIdea: 'A personal playbook is your codified way of thinking, deciding, and delivering. Include problem separation, restatement, moves, feedback, reflection. Commit to one improvement from this course.',
    commonMistakes: ['Playbook that is too generic to use.', 'Writing it once and never using or updating it.', 'No connection between playbook and daily decisions.'],
    todaysMove: 'Draft one page: your principles and one checklist from this course. Add one rule you will follow for the next 90 days.'
  },
  {
    title: 'The Mind That Handles Anything',
    oneLiner: 'You leave with a system, not motivation.',
    goals: ['Summarize your system: think, decide, deliver.', 'Commit to the next 90 days using the playbook.', 'Define one accountability or review cadence.'],
    whyItMatters: ['Motivation fades; systems persist.', '90 days creates habit.', 'Accountability keeps the system alive.'],
    keyIdea: 'You leave with a system, not motivation. Summarize: think, decide, deliver. Commit to the next 90 days using the playbook. Define one accountability or review cadence.',
    commonMistakes: ['Relying on motivation to sustain the system.', 'No review cadence.', 'Treating the course as a one-time event rather than the start of a practice.'],
    todaysMove: 'Write your system in three lines: think (how you understand and plan), decide (how you choose), deliver (how you move, test, reflect). Schedule one review in 30 days.'
  }
];

for (let i = 0; i < restOfLessons.length; i++) {
  lessonPlan.push({ day: 6 + i, ...restOfLessons[i] } as LessonEntry);
}

// Quiz helper: per-lesson ≥7 questions, ≥5 APPLICATION, ≥2 CRITICAL_THINKING, 0 RECALL
type QuizItem = {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuizQuestionType;
};

function getQuizzesForDay(day: number): QuizItem[] {
  const cat = 'Course Specific';
  const quizzes: QuizItem[] = [];
  // Day 1: effectiveness, system, loop
  if (day === 1) {
    quizzes.push(
      { question: 'A structured program trains you to think, decide, and deliver rather than just consume content. What is its primary goal?', options: ['To be more effective, not just smart or busy', 'To become more intelligent without changing behavior', 'To do more tasks regardless of outcomes', 'To feel more motivated in the short term only'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A manager wants to keep improving after a busy quarter. They are choosing between relying on feeling motivated each morning and setting a daily 5-minute reflection: what did I learn, what do I do next. Which approach is more likely to sustain progress?', options: ['The daily reflection loop; systems persist when motivation fades', 'Relying on feeling motivated each morning; motivation is more powerful', 'Doing more activities without tracking what they learned or what to do next', 'Setting only a yearly goal with no daily structure or reflection'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team is busy every day but deliverables slip and priorities keep changing. An advisor says they lack a clear loop that separates understanding the problem, making explicit choices, and then executing and reflecting. Which option best matches that loop?', options: ['Think (understand and plan), decide (choose with intent), deliver (move, test, reflect)', 'Plan everything upfront, execute without adjustment, forget what you learned', 'Work continuously, rest only when exhausted, repeat without reflection or learning', 'Hope for the best, try without structure, give up when it gets hard'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Which mistake is most likely to block effectiveness?', options: ['Confusing activity with progress', 'Taking too many breaks between focused work', 'Asking for help when you are stuck', 'Writing things down for later review'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'A leader says: "We did 50 meetings this month." What is missing for effectiveness?', options: ['A link to outcomes or results, not just activity', 'More meetings to align the team', 'Fewer notes so people can focus', 'Longer meetings to cover everything'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'A new manager wants to build sustainable effectiveness habits. They are deciding between a daily reflection loop and waiting for quarterly reviews. What should they choose?', options: ['One small daily loop that captures what they learned and what they will do next', 'A yearly goal only with no daily structure or reflection', 'No structure and rely on ad hoc decisions when problems arise', 'Only motivation and positive thinking without any systematic approach'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team lead has been relying on motivation to drive results. After six months, motivation drops and output falls. What should they have built instead?', options: ['A repeatable system (e.g. daily reflection, clear done criteria) that persists when motivation fades', 'More motivational talks and incentives to boost energy and commitment', 'Stricter deadlines so people work harder regardless of motivation', 'A single annual goal with no daily or weekly structure or checkpoints'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING }
    );
  }
  // Day 2: problem vs symptom
  else if (day === 2) {
    quizzes.push(
      { question: 'A team keeps missing deadlines. What is the first step to find the real problem?', options: ['List what you observe (symptoms) and ask what would have to be true for this to happen', 'Schedule more meetings to discuss deadlines', 'Blame the team for poor execution', 'Ignore the pattern and hope it improves'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team reports "frequent conflicts between departments" during project reviews. In problem-solving terms, what does this represent?', options: ['An observable sign of something wrong that may point to a deeper root cause', 'The actual problem that needs to be solved directly', 'A type of project management initiative', 'A meeting agenda item or checklist item'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Why is separating symptom from problem important?', options: ['Treating symptoms wastes effort and leaves the cause intact', 'Symptoms are always wrong and misleading', 'Problems are easy to see without analysis', 'It is not important for delivery'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'You see "low morale" in a team. What should you do next?', options: ['Treat it as a symptom; ask what would have to be true for morale to be low', 'Assume it is the root cause and address it directly', 'Ignore it and focus on deliverables only', 'Only measure satisfaction scores and report them'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'What is the risk of solving only symptoms?', options: ['The real problem remains and symptoms return or multiply', 'You solve everything and the team is happy', 'Team gets bored with too much analysis', 'You waste effort on the visible sign while the cause stays untouched'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'After identifying that "team conflicts" are a symptom, you dig deeper and find departments lack shared goals. How should you state the real problem?', options: ['As an actionable gap: departments operate without aligned objectives, causing friction', 'As a long list of all symptoms and observations from the past month', 'As a blame statement identifying which department failed to communicate', 'As a wish or vague desired outcome like "better collaboration"'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Which is a symptom rather than a problem?', options: ['Customers are churning, which is an observable sign that points to a deeper issue', 'We have no retention strategy aligned to value', 'We do not know why they leave', 'We need more marketing to grow revenue'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING }
    );
  }
  // Day 3: understand before move
  else if (day === 3) {
    quizzes.push(
      { question: 'A project manager gets a vague client request and immediately starts building a solution. Two weeks later, the client says it is not what they wanted. What should the manager have done first?', options: ['List what they know for sure and what they do not know yet; get clarity before committing to a solution', 'Build a minimal version first and then adjust based on client reaction', 'Ask the client to write a long specification before any work begins', 'Delegate the requirement gathering to someone else and focus only on execution'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Before acting on a complex situation, what should you list to avoid acting blindly?', options: ['What you know for sure and what you do not know yet', 'Only what you know and skip unknowns to avoid analysis paralysis', 'Only opinions from stakeholders without validating facts', 'Nothing; act first and learn later without preparation'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'What is a common mistake when facing uncertainty?', options: ['Using action as a substitute for understanding', 'Asking too many questions before acting', 'Writing things down for clarity', 'Taking a break to reflect'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team lists their unknowns before starting a project. How do these unknowns help them make better decisions?', options: ['They guide what to learn or validate next before committing resources', 'They are useless and should be ignored to avoid analysis paralysis', 'They should be hidden from stakeholders to maintain confidence', 'They replace the need to act or decide on the project'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'A stakeholder wants "fast action." What is the best response?', options: ['One small step to reduce the most important unknown, then decide next', 'Do everything at once to show progress', 'Refuse to act until everything is clear', 'Act without any check or validation'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'A project manager faces a complex client request with unclear requirements. Before proposing a solution, what should they establish?', options: ['Clarity about what is really going on: what they know for sure and what they do not know yet', 'Agreement with everyone on a detailed plan before any action', 'A full report documenting all possible details and scenarios', 'Intuition only without explicit checks or validation'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Which behavior creates noise rather than progress?', options: ['Acting first and thinking later on an unclear problem', 'Listing unknowns to prioritize learning', 'Restating the problem in plain language', 'Asking what would have to be true for the symptom'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION }
    );
  }
  // Day 4: unknowns as assets
  else if (day === 4) {
    quizzes.push(
      { question: 'A team faces several unknowns before starting a project. How should they treat these unknowns?', options: ['As assets that guide inquiry and next steps to validate before committing', 'As weaknesses to hide from others to maintain confidence', 'As reasons not to act until certainty and complete information', 'As irrelevant to the decision at hand and should be ignored'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A project lead explicitly states: "We do not know yet if the API can handle this load." Why is naming unknowns like this important?', options: ['It reduces the cost of not knowing and aligns others on what needs validation', 'It makes you look smart and in control of all project details', 'It is required by law or policy in most organizations', 'Others assume you know and make plans that depend on that false certainty'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A stakeholder asks about project risks. What is a good way to communicate unknowns?', options: ['What you do not know yet, and when or how you will find out', 'Only what you know and skip the rest to avoid appearing uncertain', 'Vague statements to avoid commitment or specific timelines', 'Nothing; keep them to yourself to maintain confidence'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Saying "I don\'t know yet" in a project context is best described as:', options: ['Leadership: it builds trust and sets expectations', 'Weakness that undermines authority', 'Rude or unprofessional behavior', 'Unnecessary if you have a plan'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'What is the risk of making decisions as if unknowns do not exist?', options: ['Surprises and rework when reality diverges from assumptions', 'Others commit to dates or plans that your assumptions made look certain', 'You skip naming what you do not know and never reduce the gap', 'Stakeholders make plans on false certainty and are surprised later'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'A product team lists unknowns: "We do not know if users will pay for this feature" and "We do not know the technical complexity." How should they use these unknowns?', options: ['As a map showing what to learn or validate next before committing resources', 'As a physical map of the project timeline and dependencies', 'As a replacement for the need for a formal project plan', 'They should ignore unknowns as they are irrelevant to decision-making'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team lead hides project uncertainties from stakeholders to appear confident. Which behavior undermines trust?', options: ['Hiding unknowns to look in control, which creates surprises later and erodes trust', 'Listing what you don\'t know yet and when you will find out', 'Setting a date to revisit the question and communicate updates', 'Asking for input from stakeholders about constraints and trade-offs'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION }
    );
  }
  // Day 5: rewriting the problem
  else if (day === 5) {
    quizzes.push(
      { question: 'A problem is given to you in technical jargon. Why should you restate it in your own words?', options: ['If you cannot restate it clearly, you do not own it and may solve the wrong problem', 'To use more jargon and sound expert to stakeholders', 'To please others who prefer complexity and detailed language', 'It is optional when time is limited and can be skipped for faster delivery'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'What is a good test for whether you own the problem?', options: ['You can explain it to someone else in 30 seconds without jargon', 'You have a long document describing it', 'You have consensus from the team', 'You have a budget approved for it'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'What should you do with the restatement once it is clear and you own it?', options: ['Lock it as the working problem you will solve', 'Forget it and move to solutions', 'Add more jargon for precision', 'Delegate it only and do not use it'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A problem is stated in technical jargon. What is the next step?', options: ['Rewrite it in plain language so anyone could understand', 'Keep the jargon for accuracy', 'Shorten it only without changing words', 'Skip restatement and start solving'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'What is the risk of skipping restatement and going straight to solutions?', options: ['Solving the wrong problem or a fuzzy one', 'You deliver something that does not address the real gap', 'Different people solve different versions of the problem', 'The solution looks good but the problem was never agreed'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'Which is a restatement that shows ownership?', options: ['A one-sentence gap between current and desired state in plain language', 'A copy of the original brief unchanged', 'A list of symptoms only without a gap', 'A solution disguised as a problem statement'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Why avoid jargon in the restatement?', options: ['Jargon often hides fuzzy thinking; plain language forces clarity', 'Jargon is always wrong in business', 'Plain language is shorter and faster', 'There is no strong reason to avoid it'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION }
    );
  }
  // Day 6: Decompose — scenario-based, standalone, no lesson references
  else if (day === 6) {
    quizzes.push(
      { question: 'A product team is stuck on "launch the new platform." What is the best next step?', options: ['Break it into sub-problems (e.g. onboarding, core flow, billing) and identify which can be tested independently', 'Schedule a long planning meeting', 'Assign the whole thing to one person', 'Wait until the scope is fully clear'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'You have a big goal with many parts. How do you choose where to start?', options: ['Identify the leverage point or smallest testable slice and pick the first move on that', 'Start with the easiest part regardless of impact', 'Work on all parts in parallel', 'Defer until you have a complete breakdown'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Which approach is most likely to leave a big problem unsolved?', options: ['Trying to solve the whole thing at once without decomposing', 'Listing 3–5 sub-parts and marking the leverage point', 'Checking which parts can be tested independently', 'Picking the first move on the smallest testable slice'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A project has been decomposed into 12 tiny tasks with no prioritization. What is the risk?', options: ['Too many pieces with no leverage point; effort spreads evenly and impact is diluted', 'The project will finish too fast', 'Team will be bored with small tasks', 'Effort spreads across all tasks and the real bottleneck is never addressed'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'Two components depend on each other. How should you use decomposition?', options: ['Acknowledge the dependency; find the slice that unblocks both or the one that can be tested with a stub', 'Ignore dependencies and work in isolation', 'Merge them into one big component', 'Abandon decomposition for this project'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'A team breaks down a big project into parts. They identify one part they can test with users this week. What does this represent?', options: ['A first slice: one part you can complete or test soon to get signal and then decide the next step', 'The first item on a long list regardless of impact or testability', 'The smallest task by size or effort without considering value or learning', 'Whatever the client asked for first without evaluating if it is testable or valuable'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'After decomposing a problem into sub-parts, what should you do next?', options: ['For each part ask: can it be solved or tested independently? Then pick the first move on leverage or smallest testable slice', 'Delegate each part to a different person', 'Document everything and wait for approval', 'Start with the most impressive-sounding part'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION }
    );
  }
  // Day 7: Leverage point
  else if (day === 7) {
    quizzes.push(
      { question: 'A team is spreading effort evenly across five initiatives. How should they prioritize?', options: ['Identify where a small change would have the largest effect and prioritize that component', 'Keep spreading evenly to be fair', 'Pick the initiative the CEO mentioned last', 'Drop all but one at random'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team identifies five components in their system. One component, if improved, would unlock progress on three others. What does this represent?', options: ['A leverage point: a part where a small change produces a large effect', 'The part that is easiest to change regardless of actual impact', 'The part with the biggest budget or most resources allocated', 'The part that takes the longest to complete regardless of importance'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'You have a decomposed problem. What is the next step?', options: ['Name the single highest-leverage component and commit one concrete move on it', 'Work on the component that is most fun', 'Assign equal time to every component', 'Wait for someone to tell you the priority'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A manager focuses on "what is easy" instead of "what matters most." What is the likely outcome?', options: ['Lots of activity with diluted impact; the real bottleneck remains', 'You finish many tasks while the goal stays out of reach', 'The team feels busy but the leverage point is never tackled', 'Easy tasks get done first and the hard one is left for last'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'How do you tell leverage-point work from busywork?', options: ['Leverage-point work changes something that, if fixed, eases the rest; busywork is activity that does not move that hinge', 'Busywork is faster to complete', 'Leverage work is always technical in nature', 'You cannot tell without expert analysis'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'Treating all parts of a system as equally important tends to lead to:', options: ['Inefficient use of effort; the hinge may never get the focus it needs', 'Perfect balance across all initiatives', 'Fewer arguments about priorities', 'Faster consensus on what to do next'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'After identifying the leverage point, what should you do?', options: ['Commit one concrete move on that component and execute it', 'Document it and add it to the backlog', 'Discuss it in the next quarterly review', 'Look for a second leverage point before acting'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION }
    );
  }
  // Day 8: Plans are hypotheses
  else if (day === 8) {
    quizzes.push(
      { question: 'A team has a detailed plan for the next quarter. How should they treat it?', options: ['As a hypothesis: if we do X we expect Y; define a test and update when evidence contradicts', 'As a fixed commitment that must be defended', 'As a rough draft no one will follow', 'As confidential and not to be shared'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team has a plan but wants to test it before committing fully. What is the smallest test they could run?', options: ['One move whose outcome you can observe to confirm or disprove the bet', 'A full pilot of the whole plan before launch to validate everything', 'A stakeholder sign-off on the document without any actual testing', 'A Gantt chart showing all milestones without executing any work'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Evidence shows the plan is wrong. What should you do?', options: ['Update the hypothesis; do not defend the plan', 'Double down and work harder despite evidence', 'Hide the evidence to avoid admitting the plan failed', 'Blame external factors only without learning from the evidence'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'Why is "no clear criterion for success or failure" dangerous?', options: ['You never know when to update the plan; you drift or defend indefinitely', 'Plans become shorter and easier to follow without clear criteria', 'Teams prefer vague goals so they can interpret them freely', 'Stakeholders will assume success means finishing on time regardless of outcome'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'A leader says: "We will stick to the plan no matter what." What is the risk?', options: ['Investing in a wrong direction while evidence says to change; resources and trust erode', 'Team will feel secure and aligned', 'Reality is ignored until the plan fails in a big way', 'Stakeholders lose trust when the plan and evidence diverge'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'How do you turn a plan into a testable hypothesis?', options: ['Write it as a bet: if we do X we expect Y; then define one test you can run to check', 'Add more detail to the plan', 'Get more people to approve it', 'Set a longer timeline'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'In an approach where plans are treated as hypotheses to be tested, what is the difference between planning and execution?', options: ['Planning produces a hypothesis; execution is the experiment that confirms or disproves it', 'Planning is strategic; execution is tactical only', 'There is no meaningful difference between them', 'Execution should ignore the plan and improvise'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION }
    );
  }
  // Day 9: Moves not projects
  else if (day === 9) {
    quizzes.push(
      { question: 'A goal is "double revenue in 12 months." What is a good next move?', options: ['Define the smallest step that could be done and verified soon (e.g. one experiment or one segment test)', 'Create a 12-month project plan with no intermediate tests', 'Wait until you have a full strategy', 'Set a milestone for month 6 only'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team lists several tasks. One task has a clear test: "We are done when 10 users complete onboarding in under 2 minutes." What makes this a "move" rather than just activity?', options: ['It is testable: you can say "done" when an observable condition is true', 'It is on the project plan regardless of whether it can be verified', 'It takes at least a week to complete regardless of testability', 'It is assigned to someone else without defining how to verify completion'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team completes one testable step and gets feedback. What should they do next?', options: ['Decide the next step from the evidence you got; do not just continue the old plan blindly', 'Immediately start the next task on the list without considering the feedback', 'Report and wait for approval before taking any action based on results', 'Take a break before the next phase without learning from the test'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'What is "project theater"?', options: ['Long plans and deliverables that are too big to test soon; lots of motion, little learning', 'A formal kickoff meeting', 'Using project management software', 'Having a project manager'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'Why is "no clear done for the current step" a problem?', options: ['You cannot get signal or decide the next move; scope creeps and feedback is delayed', 'It makes the step cheaper to execute without a defined end point', 'It gives the team more freedom to interpret the step broadly', 'Stakeholders will assume the step is done when the deadline passes'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'A team lists several activities. Some have clear tests for "done," others are just ongoing work. How do you distinguish motion from moves?', options: ['Motion is activity; moves are testable steps with a clear done condition', 'Motion is faster to complete than moves regardless of testability', 'Moves are always smaller than motion without considering value', 'There is no meaningful difference between them in practice'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A leader has an outcome they want to achieve. What question should they ask next to find the first move?', options: ['What is the smallest step that could be done and verified today or this week?', 'What is the full list of tasks needed to complete the entire project?', 'Who else should be involved in the project before starting?', 'What is the budget available for this initiative?'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION }
    );
  }
  // Day 10: Analogy
  else if (day === 10) {
    quizzes.push(
      { question: 'You are stuck on a product problem. What can help unlock new paths?', options: ['Find a similar problem in another domain and extract the structure (not the content)', 'Copy the solution from a competitor without adapting it', 'Brainstorm more ideas in the same domain only without cross-domain learning', 'Wait for inspiration to arrive without actively seeking new approaches'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team studies how a restaurant manages reservations and wants to apply it to their booking system. What should they transfer from the restaurant example?', options: ['The structure or mechanism of how reservations work, then adapt it to their context', 'The exact solution word for word without changes or adaptation', 'The vocabulary only and skip the underlying logic or structure', 'The budget and timeline from that project without understanding the mechanism'], correctIndex: 0, difficulty: QuestionDifficulty.EASY, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'A team says "that analogy does not apply to our industry." What is a better approach?', options: ['Ask what structure maps: often the mechanism transfers even if the content differs', 'Dismiss the analogy without exploring whether the underlying structure could apply', 'Force the analogy literally without adapting it to your context', 'Look only within the industry without considering cross-domain patterns'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'What is the risk of copying a solution literally from another domain?', options: ['It may not fit your context; you skip the work of understanding and adapting', 'It will work perfectly in your context', 'You implement the form without the conditions that made it work elsewhere', 'The solution looks right but fails when your context differs'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'Using analogy to avoid doing the work of understanding your own problem leads to:', options: ['Superficial solutions that do not address the real structure', 'Faster decisions', 'More creativity', 'Better buy-in'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: cat, questionType: QuizQuestionType.CRITICAL_THINKING },
      { question: 'A team is stuck on a problem. Where can they find useful analogies to unlock new approaches?', options: ['Other fields: sport, nature, another industry, history—any domain with a similar structure', 'Only in your direct competitors who face the same challenges', 'Only in academic papers without practical application', 'Only in the same product category without cross-domain learning'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION },
      { question: 'After finding an analogy, what is the next step?', options: ['Write how the structure maps to your problem; then one move inspired by it', 'Present the analogy and stop there', 'Implement the other domain\'s solution as-is without adapting', 'File it for later when you have more time'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: cat, questionType: QuizQuestionType.APPLICATION }
    );
  }
  // Days 11–30: day-specific scenario quizzes (continued below)
  else if (day >= 11 && day <= 30) {
    const day11to30 = getDay11to30Quizzes(day, cat);
    quizzes.push(...day11to30);
  }
  return quizzes;
}

// Day 11–30: standalone scenario-based questions (no "today's lesson" or title crutches)
function getDay11to30Quizzes(day: number, cat: string): QuizItem[] {
  const E = QuestionDifficulty.EASY;
  const M = QuestionDifficulty.MEDIUM;
  const H = QuestionDifficulty.HARD;
  const A = QuizQuestionType.APPLICATION;
  const C = QuizQuestionType.CRITICAL_THINKING;
  const q = (question: string, options: string[], correctIndex: number, difficulty: QuestionDifficulty, questionType: QuizQuestionType): QuizItem =>
    ({ question, options, correctIndex, difficulty, category: cat, questionType });

  const byDay: Record<number, QuizItem[]> = {
    11: [
      q('You have a goal but keep drifting between different approaches. What is a good first step to get focused?', ['Describe the end state in concrete, observable terms, then work backwards to identify today\'s first move', 'Start with whatever is urgent or feels most pressing', 'List all possible actions without prioritization or filtering', 'Set a distant deadline and hope motivation arrives'], 0, M, A),
      q('A product team wants to launch a new feature in 6 months. They start by describing what success looks like on launch day, then work backwards to today. What is this approach called?', ['Working backwards: starting from the desired result and reverse-engineering the path step by step', 'Planning from today forward only without considering the end state or desired outcome', 'Reviewing past projects only without forward planning or goal-setting', 'Asking the client what they want last without planning ahead or defining success'], 0, E, A),
      q('After working backwards from your goal, you have identified several possible first steps. Which one should you choose?', ['The step that gets you one notch toward the end state and can be tested soon', 'The most impressive-sounding action regardless of actual impact or testability', 'Whatever is already in the backlog without prioritization or evaluation', 'The cheapest option regardless of effectiveness or alignment with the goal'], 0, M, A),
      q('Why is a vague end state (e.g. "we will be better") a problem?', ['You cannot work backwards reliably; the path and first move stay fuzzy', 'It motivates people more', 'It is easier to communicate', 'Everyone interprets it differently and first steps stay unaligned'], 0, H, C),
      q('Skipping steps in the backwards chain tends to result in:', ['Missing dependencies or an unrealistic first move', 'Starting a step that cannot be completed because a prerequisite was skipped', 'The first move not actually moving toward the end state', 'Replanning later when the gap between today and the goal becomes obvious'], 0, H, C),
      q('A team\'s goal is "improve customer satisfaction." How should they make this end state concrete before planning the path?', ['Define what "done" looks like in observable terms: e.g. "80% of customers rate us 4+ stars"', 'Write a vision statement only without measurable criteria or testable outcomes', 'Copy another company\'s goal without adapting to their context or situation', 'Let the team interpret freely without alignment or shared understanding of success'], 0, M, A),
      q('A team has worked backwards from their goal and identified three steps. What should they do next?', ['Use the step that reaches from today toward that end as the first move and execute it', 'Document the full chain and wait for approval before taking any action', 'Start from the end and hope the team catches up without clear guidance or structure', 'Revise the end state again without testing whether the path actually works'], 0, M, A),
    ],
    12: [
      q('A process has 15 steps. How do you find what is essential?', ['Strip to the minimum; find where it breaks; add back only what is necessary to achieve the goal', 'Remove the last 5 steps without understanding their purpose or impact', 'Survey users on their favorite steps regardless of whether they are essential', 'Keep all steps but do them faster without removing unnecessary complexity'], 0, M, A),
      q('A team has a 15-step onboarding process. They remove steps one by one until new users cannot complete onboarding. What does this approach demonstrate?', ['Simplify until it breaks: the break point shows the minimum needed to prove the core', 'Making the product worse on purpose to test limits without learning', 'Cutting the budget in half and seeing what survives without analysis', 'Using fewer words in documentation only without changing functionality'], 0, E, A),
      q('A team has stripped their product to the minimal version: just the core feature with no extras. What should they do next?', ['Test it with real users; if it achieves the goal, leave elements out; if it breaks, add back only what is necessary', 'Add more features before testing to make it more complete', 'Ship it without testing to save time and resources', 'Archive it and start over with a different approach'], 0, M, A),
      q('Why is adding features before proving the core risky?', ['You invest in complexity before validating that the core works', 'Features are always good and improve the product regardless of validation', 'It pleases more stakeholders by showing visible progress', 'You build the wrong thing well because the core was never validated'], 0, H, C),
      q('Equating "simple" with "trivial" can lead to:', ['Dismissing simplification and keeping unnecessary complexity that slows progress', 'Faster delivery through maintaining all existing features and steps', 'Higher quality by including every possible feature and option', 'Better design through adding more elements and complexity'], 0, H, C),
      q('A team simplifies their process until it breaks. What is the purpose of finding this break point?', ['To know the minimum needed to achieve the goal; then add back only what is necessary', 'To prove the idea is bad and should be abandoned', 'To save money by cutting as much as possible', 'To reduce scope arbitrarily without understanding what matters'], 0, M, A),
      q('A team strips one element from their plan. How should they decide whether to keep it out permanently?', ['Test if they can still achieve the goal without it; if yes, leave it out; if no, add it back', 'Ask the team to vote on whether they like it or not', 'Leave it out to save time regardless of impact', 'Always add it back because it was in the original plan'], 0, M, A),
    ],
    13: [
      q('You have one plan for an important goal. What should you do?', ['Generate at least two more paths; assess risk and cost; choose one to run and one as backup', 'Commit fully to the one plan without considering alternatives or risks', 'Abandon the goal because having only one plan is too risky', 'Wait until the plan fails before developing alternatives'], 0, M, A),
      q('A startup has one plan to reach profitability: increase prices by 20%. After two months, customer churn spikes. What is the problem with having only one plan?', ['Single point of failure; when evidence changes you have no alternative path', 'One plan is easier to communicate but less robust when evidence contradicts it', 'Backup plans reduce commitment to the primary plan unnecessarily and waste resources', 'It is not a problem in most business situations and single plans always work'], 0, E, A),
      q('A company is launching a critical product feature. The team has one plan. How many alternative paths should they develop?', ['At least three paths; choose one to execute, keep one backup, park the third', 'Exactly one path to maintain focus and avoid confusion', 'As many as the team can imagine without filtering or evaluation', 'One per stakeholder to ensure buy-in from all parties'], 0, M, A),
      q('Betting everything on one plan is risky because:', ['When the plan fails or evidence contradicts, you have no pivot path', 'Plans always succeed without needing alternatives', 'Backup plans are expensive and unnecessary', 'It is not risky in most business contexts'], 0, H, C),
      q('Treating backup plans as "lack of commitment" can lead to:', ['Avoiding alternatives and then having no option when the main plan fails', 'Stronger execution', 'Faster decisions', 'Better morale'], 0, H, C),
      q('When should you revisit your chosen path and backup?', ['When you have new evidence (e.g. a test result or market signal)', 'Only at quarterly reviews', 'Never; stick to the choice', 'When someone complains'], 0, M, A),
      q('For each path you list, what should you assess?', ['Main risk and cost; then choose one to run first and one as backup', 'Only cost and not risk or timeline', 'Only timeline and not risk or cost', 'Only who will do it and not criteria'], 0, M, A),
    ],
    14: [
      q('A decision has been discussed but not written down. What is the risk?', ['Implicit decisions cause misalignment; write what we chose and why to prevent drift', 'None; everyone was in the room so they will remember it correctly', 'It will be forgotten but that is not a significant problem', 'Writing takes too long and slows down decision-making unnecessarily'], 0, M, A),
      q('A team is choosing between three marketing strategies. They write down: "We chose Option A because it targets our core segment and fits our budget. We are not doing B or C." What does this demonstrate?', ['Choosing with intent: using criteria and boundaries to make the decision explicit', 'Letting the loudest person decide for the team without structure', 'Voting on everything and following the majority without criteria', 'Delegating all decisions to someone else without involvement'], 0, E, A),
      q('A team keeps revisiting the same decision without making progress. How do you avoid drift on decisions?', ['Make the decision explicit: what we chose, why, and what we are not doing', 'Meet more often to discuss the decision repeatedly without making a final choice', 'Assign a single decider to avoid discussion and alignment with the team', 'Avoid hard choices by deferring decisions indefinitely until someone else decides'], 0, M, A),
      q('Delaying decision by asking for more data indefinitely leads to:', ['Drift; the default option or inaction wins without intent', 'Better decisions with more complete information', 'More alignment through extended discussion', 'Lower risk through thorough analysis'], 0, H, C),
      q('Confusing consensus with a clear decision can result in:', ['No one owns the outcome; "everyone agreed" but no one wrote what was chosen', 'Revisiting the same choice in the next meeting because nothing was recorded', 'Different people remembering different outcomes and acting on that', 'The default option or inaction winning without anyone explicitly choosing it'], 0, H, C),
      q('What should you write down when you make a decision?', ['What we chose, why, and what we are not doing to prevent future confusion', 'Only the outcome and not the rationale or reasoning behind it', 'Only the date and not the rationale or what was decided', 'Only who was present at the meeting without recording the decision'], 0, M, A),
      q('A team keeps revisiting the same choice. What is likely missing?', ['An explicit decision with criteria and boundaries that prevents revisiting', 'More data to make the decision clearer and more certain', 'A different leader who can make the decision without discussion', 'A longer meeting to discuss the choice more thoroughly'], 0, M, A),
    ],
    15: [
      q('A stakeholder says a task is "done when it feels right." What should you do?', ['Define done as a testable, observable condition; refuse vague done criteria', 'Accept their definition even though it cannot be verified or tested', 'Set an arbitrary deadline without defining what done actually means', 'Leave it undefined and hope everyone agrees on when it is complete'], 0, M, A),
      q('A developer says a feature is "done" but cannot describe how to verify it works. According to this approach, what is the problem?', ['Done means testable: if you cannot verify or test it, it does not exist as done', 'Done means the deadline passed regardless of quality or outcomes', 'Done means the person in charge says so without verification', 'Done means no one is complaining about it at the moment'], 0, E, A),
      q('Your next move is "improve the onboarding flow." How do you make it testable?', ['Write: we are done when [observable condition], e.g. user completes steps 1–3 in under 2 minutes', 'Leave it as is and do not define done criteria or testability', 'Set a due date only without other criteria or observable conditions', 'Assign it to a team and do not define done or how to verify completion'], 0, M, A),
      q('Why is vague done dangerous?', ['Scope creep and no feedback; you never know when to stop or what to test', 'It is faster to avoid defining clear criteria or testable conditions', 'It is more flexible and allows for creative interpretation', 'Scope stays fuzzy and "done" is never agreed; rework and conflict follow'], 0, H, C),
      q('Moving on before the test is run can lead to:', ['False confidence; the move may not be done or may not produce the expected result', 'Counting the move as done while the actual outcome is still unknown', 'Scope creep because "done" was never defined in testable terms', 'The next move being based on assumption instead of evidence'], 0, H, C),
      q('If you cannot write an observable condition for "done," what should you do?', ['Narrow the move until you can define a testable condition that can be verified', 'Proceed anyway without a testable condition and hope it works out', 'Skip the move and do something else that is easier to define', 'Ask someone else to define it for you without understanding it yourself'], 0, M, A),
      q('A leader wants to scope their next move. What is the role of testability in scoping the next move?', ['It defines the boundary of the move and when you can get signal', 'It is only for QA and not for planning or scoping decisions', 'It increases scope and flexibility without clear boundaries or limits', 'It has no role in scoping or delivery and can be ignored'], 0, M, A),
    ],
    16: [
      q('A team is polishing a feature before any user has seen it. What is the risk?', ['Polish before proof wastes time; ship or test the minimal structure first', 'Users will love the polish when they see it', 'Building the wrong thing well because you never validated the core', 'Stakeholders expecting more because the surface looks finished'], 0, M, A),
      q('A team wants to build a new dashboard. They create a version with just the core chart and one filter, ship it to 10 users, then add features based on feedback. What is this approach called?', ['Shipping the skeleton: building the minimal structure that could work, then adding detail after validation', 'Shipping only wireframes and nothing else without functionality or user testing', 'Shipping incomplete work without testing or validation to save development time', 'Shipping without testing or validation to save time and avoid user feedback'], 0, E, A),
      q('How do you identify the skeleton of a deliverable?', ['Ask: what is the minimum structure that could be tested or used to prove the core?', 'Remove the last 50% of features without understanding what is essential', 'Copy a competitor\'s MVP without adapting it to your specific context', 'Ask the client to choose without understanding what is actually necessary'], 0, M, A),
      q('Confusing skeleton with "incomplete or shoddy work" can lead to:', ['Never shipping the skeleton and delaying learning from real user feedback', 'Faster delivery through skipping the skeleton and building everything at once', 'Higher quality by polishing before testing with actual users', 'Better design through adding all features before validating the core'], 0, H, C),
      q('Why add detail only after the skeleton is validated?', ['Detail after validation is efficient; detail before proof is waste', 'Detail is always bad', 'Skeleton is enough forever', 'You waste effort on details that users never need or value'], 0, H, C),
      q('After shipping the skeleton, what should you do?', ['Get signal from users; add detail only based on evidence of what they actually need', 'Add all planned features immediately without waiting for user feedback or validation', 'Freeze the product and do not make any changes regardless of feedback or evidence', 'Move to the next project without learning from the skeleton launch or user response'], 0, M, A),
      q('What is the first step for a deliverable you are working on?', ['Strip it to the skeleton: the minimum that could be tested; ship or test that first', 'Finish the full specification before testing anything with users or gathering feedback', 'Get sign-off on the complete design before building anything or validating assumptions', 'Assign all tasks to the team without identifying what is essential or testable'], 0, M, A),
    ],
    17: [
      q('A team runs a long cycle with no check until the end. What is the risk?', ['Learning is delayed; reality corrects plans too late when changes are expensive', 'They will work harder and produce better results without feedback or validation', 'Costs pile up before anyone sees that the direction is wrong', 'Stakeholders get one big surprise at the end instead of early options to adjust'], 0, M, A),
      q('A team launches a feature, waits 3 months, then checks if users like it. What is missing compared to a proper feedback loop?', ['A feedback loop gets real-world signal quickly to adjust the next move, not after months', 'Sending a survey at the end without interim checks or adjustments', 'Asking for approval without testing actual outcomes or usage', 'Reporting status only without gathering signal from real users'], 0, E, A),
      q('How do you shorten the time between action and signal?', ['Define the next feedback moment: when and how you will get signal; move it earlier if possible', 'Work faster to complete everything sooner without interim checks', 'Send more emails to stakeholders without gathering actual user feedback', 'Meet more often to discuss progress without testing with real users'], 0, M, A),
      q('Ignoring feedback that contradicts the plan can lead to:', ['Investing in a wrong direction while evidence says otherwise', 'Measuring only what confirms the plan and dismissing the rest', 'Extending the timeline so the plan can "still work"', 'Stakeholders losing trust when reality catches up with the plan'], 0, H, C),
      q('Measuring only what confirms the plan is risky because:', ['You miss disconfirming signal and update too late', 'You save time by avoiding difficult feedback or contradictory data', 'You please stakeholders by showing only positive results', 'You only see good news and miss the signal that would have triggered a pivot'], 0, H, C),
      q('For one active initiative, what should you define?', ['The next feedback moment: when and how you will get signal to adjust course', 'The final deadline only without interim checkpoints or feedback loops', 'The full list of tasks without identifying when to check progress or gather signal', 'Who is responsible only without defining how to measure success or get feedback'], 0, M, A),
      q('A team runs a long cycle with no check until the end. What is the main risk?', ['Reality corrects plans too late when changes are expensive; fast loops reduce the cost of being wrong', 'They will work harder and produce better results without interim feedback or validation', 'Costs pile up before anyone sees that the direction is wrong', 'Stakeholders get one big surprise at the end instead of early options to adjust'], 0, M, A),
    ],
    18: [
      q('You have an idea you have invested in. How should you treat it?', ['Define a kill criterion: we stop if [observable condition]; run the test; stop investing when it fails', 'Double down and invest more regardless of evidence or test results that show it is failing', 'Hide the results if they are negative to avoid admitting failure or making changes', 'Extend the timeline indefinitely until the idea eventually succeeds without validation'], 0, M, A),
      q('A team tests a new feature with 100 users. After two weeks, only 2% use it. They decide to stop investing and move resources elsewhere. What does this demonstrate?', ['Killing early: stopping bad or wrong ideas as soon as evidence shows they do not work', 'Cancelling all projects regardless of evidence or outcomes or learning', 'Firing people early in the project without proper evaluation or feedback', 'Cutting budget only and not scope or deliverables or learning from the test'], 0, E, A),
      q('Why define a kill criterion before running the test?', ['So you know when to stop investing; otherwise sunk cost takes over and wastes resources', 'To please stakeholders by appearing thorough and well-planned', 'To look rigorous and professional without actually using it', 'It is optional and not necessary for making good decisions'], 0, M, A),
      q('Sunk cost (continuing because we already invested) leads to:', ['More waste; you keep investing in an idea that evidence says is wrong', 'Extending the deadline again so the idea can "prove itself"', 'Adding more scope to justify the investment already made', 'Moving the kill criterion so the idea is never declared dead'], 0, H, C),
      q('Treating killing an idea as personal failure can result in:', ['Keeping bad ideas alive and wasting resources', 'Reframing failure as "not enough time" or "wrong conditions"', 'Avoiding kill criteria so you never have to stop', 'Doubling down to prove the idea was right all along'], 0, H, C),
      q('When should you check the kill criterion?', ['At a set time or signal; decide when you will check before you start the work', 'Only at the end when all resources have been invested and it is too late to pivot', 'When someone asks about progress or results without a predetermined schedule', 'Never; kill criteria are not meant to be actually used or enforced'], 0, M, A),
      q('For one idea or project, what should you write down?', ['The kill criterion: we stop if [observable condition]; and when you will check it', 'Only the success criteria without defining when to stop if it fails or shows no progress', 'Only the budget without criteria for when to stop investing if evidence contradicts', 'Only the deadline without conditions for killing the project if it is not working'], 0, M, A),
    ],
    19: [
      q('A team tracks "page views" for a goal that is "increase conversions." What is wrong?', ['Page views may be a vanity metric; use a metric that directly reflects the goal', 'Nothing; page views are fine and accurately measure conversion success and outcomes', 'They need more metrics to track everything regardless of relevance or alignment', 'They need fewer metrics to simplify their measurement approach without considering accuracy'], 0, M, A),
      q('A team tracks "page views" for a goal of increasing sales. After three months, page views are up 50% but sales are flat. What is the problem?', ['They are measuring vanity metrics instead of outcomes that affect the goal', 'They are measuring everything they can track regardless of relevance', 'They are measuring only cost and not outcomes or effectiveness', 'They are measuring only once at the end without interim checks'], 0, E, A),
      q('A team wants to measure progress toward their goal. How do they choose the right metric?', ['Identify one metric that directly reflects success; define how you will get the data and how often you will check it', 'Pick the easiest to collect regardless of whether it reflects the goal or outcomes', 'Pick what the board wants even if it does not measure actual success or value', 'Pick the most impressive number to show progress regardless of relevance or accuracy'], 0, M, A),
      q('Using data only to justify after the fact (not to decide) leads to:', ['Decisions driven by bias; data becomes theater', 'Picking metrics that make the preferred option look good', 'Faster decisions because you skip the analysis step', 'The same wrong choice repeated with a new justification'], 0, H, C),
      q('Opinion over data when both are available can result in:', ['Decisions that ignore evidence and repeat past mistakes', 'Choosing the option that "feels right" and dismissing contradicting numbers', 'Faster execution by skipping data collection', 'Stakeholders trusting your judgment until the outcome proves otherwise'], 0, H, C),
      q('What should you define for a metric besides the number?', ['How you will get the data and how often you will check it; baseline and target if possible', 'Only the target number without defining how to measure or track it', 'Only who owns it without defining how to collect or verify the data', 'Nothing else; the number alone is sufficient for decision-making'], 0, M, A),
      q('Why avoid vanity metrics?', ['They mislead; they do not reflect the goal and can lead to wrong decisions', 'They are expensive to collect and track compared to useful metrics', 'They are hard to get and require significant effort to measure', 'There is no reason; vanity metrics are as useful as any other metric'], 0, M, A),
    ],
    20: [
      q('Evidence shows the current plan is wrong and will not achieve the goal. What should you do?', ['State it in one sentence; propose the pivot and the new next move; share with stakeholders', 'Hide the evidence to avoid admitting the plan was wrong or failed', 'Double down and invest more in the failing plan despite evidence', 'Blame the plan itself rather than adapting based on evidence or learning'], 0, M, A),
      q('A team planned to launch in the US market, but early tests show stronger demand in Europe. They update their plan, shift resources, and communicate the change transparently. What does this demonstrate?', ['Pivoting without drama: changing direction based on evidence without treating it as failure', 'Cancelling the project and moving on without learning or adaptation', 'Firing people and restructuring without proper analysis', 'Starting over with no learning from the past experience'], 0, E, A),
      q('How do you pivot in a way that builds trust?', ['Update the plan and the next move; do not hide the pivot; be transparent about the change', 'Pivot quietly without communicating the change to avoid questions', 'Blame external factors for the need to pivot without taking responsibility', 'Delay the announcement until the new direction is fully proven'], 0, M, A),
      q('Treating pivot as failure can lead to:', ['Sticking to a wrong plan to avoid "failure" and wasting resources', 'Hiding the pivot from stakeholders to avoid looking inconsistent', 'Doubling down on the original plan to prove it was right', 'The team feeling that changing direction is a sign of weakness'], 0, H, C),
      q('Pivoting without learning (same mistake in new direction) results in:', ['Repeating the same error in a new context', 'Changing the goal but keeping the same flawed approach', 'Faster execution because you skip the reflection step', 'The same bottleneck appearing in the new plan'], 0, H, C),
      q('A team\'s plan shows early signs of failure, but the deadline is still months away. When should they change direction?', ['When evidence says the plan is wrong; then pivot and update the next move', 'Only at quarterly reviews regardless of what evidence shows in between those reviews', 'Never; stick to the plan regardless of evidence or outcomes or learning', 'When the budget runs out and there are no more resources to continue the project'], 0, M, A),
      q('What should you share when you pivot?', ['The evidence that led to the pivot, the new direction, and the new next move', 'Only the new direction without explaining why or what changed', 'Nothing until the new direction is proven to work', 'Only that the old plan was wrong without proposing an alternative'], 0, M, A),
    ],
    21: [
      q('A leader is waiting for "more information" before deciding. What is the risk?', ['Certainty rarely arrives; define the smallest test you could run with what you have', 'They will make a better decision with complete information', 'Competitors or others move while the leader keeps gathering data', 'The decision gets made by default or by someone else while they wait'], 0, M, A),
      q('A leader delays a decision for three months waiting for "more data." Meanwhile, competitors launch similar products. What principle did they violate?', ['Momentum over comfort: prefer a small step with uncertainty over waiting for certainty', 'Moving recklessly without any check or validation', 'Ignoring risk and acting immediately without planning', 'Always acting fast regardless of evidence or outcomes'], 0, E, A),
      q('A leader faces a decision with some uncertainty. How do they balance momentum and risk?', ['Move when you have enough to test, not when you have zero risk', 'Wait until risk is zero before taking any action or making progress', 'Ignore risk and move forward regardless of potential problems or consequences', 'Take the biggest step possible to maximize progress regardless of risk or testability'], 0, M, A),
      q('Waiting for perfect information before acting often leads to:', ['Delay and missed learning; you never get perfect information', 'Better decisions once all data is in', 'The opportunity window closing before you act', 'Others making the decision with less information and learning from results'], 0, H, C),
      q('Confusing momentum with recklessness can result in:', ['Acting without any check and repeating avoidable mistakes', 'Skipping the smallest test and betting everything on one big move', 'Moving fast without defining what signal would make you adjust', 'Treating any pause for feedback as "waiting for certainty"'], 0, H, C),
      q('A leader has been delaying a decision for "more information" for weeks. What should they do?', ['Define the smallest test you could run with what you have; schedule it', 'Keep waiting until you have perfect information and complete certainty', 'Make the decision without testing or validation to move forward quickly', 'Delegate it to someone else who can make the decision without information or context'], 0, M, A),
      q('Why use momentum to learn?', ['Small steps with feedback create learning; waiting for certainty does not produce learning', 'Momentum is always good regardless of direction or outcomes', 'Learning is optional and not necessary for successful delivery', 'Waiting feels safer but the opportunity or context can change while you wait'], 0, M, A),
    ],
    22: [
      q('You have a message that might upset someone. What is the best approach?', ['Rewrite it: clear, accurate, and respectful; deliver it directly', 'Soften it until it is unclear and the real message is lost and cannot be acted upon', 'Avoid delivering it to prevent conflict or discomfort or difficult conversations', 'Delegate delivery to someone else to avoid responsibility or direct communication'], 0, M, A),
      q('A manager notices a team member\'s work quality declining. They schedule a meeting and say: "I noticed X, Y, and Z. Let\'s figure out what\'s happening and fix it together." What does this demonstrate?', ['Using truth as a tool: accuracy and candor to fix problems, not to blame', 'Saying whatever you think without filter or consideration for impact', 'Treating truth as optional when it is hard or uncomfortable', 'Using truth as a weapon to win arguments and prove points'], 0, E, A),
      q('A manager needs to deliver difficult feedback. How do they separate truth from tone?', ['You can be direct and respectful; state facts clearly without softening until the message is lost', 'Be polite only and avoid stating difficult facts directly to avoid discomfort or conflict', 'Be blunt only without considering how the message is received or its impact on trust', 'Avoid hard truths entirely to maintain relationships and avoid conflict or change or growth'], 0, M, A),
      q('Softening the message until it is unclear can lead to:', ['The fix never happens; the recipient does not know what to change', 'The recipient feeling supported but still repeating the same mistake', 'Fewer conflicts in the moment and the same problem in the next review', 'The recipient guessing what you meant and fixing the wrong thing'], 0, H, C),
      q('Using truth as a weapon rather than a tool tends to:', ['Damage trust and make future candor harder', 'Winning the argument while the other person stops sharing problems', 'People sharing only good news and hiding issues from you', 'Short-term compliance and long-term avoidance of hard conversations'], 0, H, C),
      q('A manager is choosing between being accurate but direct, or polite but vague. Why does accuracy beat politeness in the long run?', ['Accuracy enables correction; unclear messages preserve peace short-term but leave problems intact', 'Politeness is always wrong and should never be used in professional communication', 'Accuracy is always right regardless of context or relationship dynamics', 'It does not; politeness is always more important than accuracy'], 0, M, A),
      q('What should you do with a message you have been softening?', ['Identify it; rewrite in one sentence: clear, accurate, respectful; deliver it', 'Keep softening until it is so vague that it cannot cause any reaction', 'Never deliver it to avoid potential conflict or negative reactions', 'Send it anonymously to avoid taking responsibility for the message'], 0, M, A),
    ],
    23: [
      q('A project is at risk but the stakeholder will find out only at the deadline. What is wrong?', ['Surprises destroy trust; share status early: on track, at risk, or blocked', 'Nothing; avoid worrying them by keeping problems hidden until the end or deadline', 'They should have asked earlier if they wanted to know about problems or risks', 'It is too late to do anything so there is no point in sharing status or asking for help'], 0, M, A),
      q('A project is behind schedule. Instead of waiting until the deadline, the team lead emails stakeholders: "We are at risk. Here\'s why and here are three options to address it." What does this demonstrate?', ['No surprises culture: sharing status early and surfacing bad news with options', 'Never sharing bad news with anyone to avoid worry or conflict', 'Only sharing good news and hiding risks or problems', 'Sharing everything daily regardless of relevance or impact'], 0, E, A),
      q('A team member is blocked on a critical task. What should they do?', ['Share status (at risk/blocked) and add one sentence on what you need or what you propose', 'Wait until you are unblocked before communicating anything to avoid bothering others', 'Blame others for the blockage without proposing solutions or alternatives', 'Work longer hours to try to overcome the blockage yourself without asking for help'], 0, M, A),
      q('Hoping the problem will go away often leads to:', ['Surprising stakeholders at the deadline and losing trust', 'The problem resolving on its own in a few cases', 'You working longer hours to fix it before anyone notices', 'Status reports staying green until the last week when you escalate'], 0, H, C),
      q('Surprising stakeholders at the deadline can result in:', ['Loss of trust; they could have helped or adjusted if they had known earlier', 'Stakeholders feeling they were kept in the dark on purpose', 'No time to re-scope or get help; only crisis mode remains', 'Future updates being discounted because "last time we were surprised"'], 0, H, C),
      q('A stakeholder asks for a project update. What should you send as a minimum?', ['A one-line status: on track / at risk / blocked; if at risk or blocked, add what you need or propose', 'A full report with all details regardless of relevance or urgency', 'Nothing until the end when the project is complete or has failed', 'Only good news to avoid worrying stakeholders with problems or risks'], 0, M, A),
      q('Why escalate bad news with a proposed fix?', ['So the recipient can act or align; options reduce anxiety and build trust', 'To shift blame to others and avoid responsibility for the problem', 'To look competent by having solutions ready even if they are not good', 'It is optional and not necessary for effective communication'], 0, M, A),
    ],
    24: [
      q('You do not know yet when a deliverable will be ready. What should you do?', ['Name what you do not know and when or how you will find out; say it out loud', 'Give a fake date to avoid appearing uncertain or unprepared or lacking control', 'Stay silent and hope no one asks about the timeline or deliverables', 'Blame others for the uncertainty without taking responsibility or proposing solutions'], 0, M, A),
      q('A client asks when a feature will be ready. The team lead says: "I do not know yet. We are testing X this week and will know by Friday." What does this demonstrate?', ['Communicating unknowns: explicitly stating what you do not know yet and when you will know it', 'Never admitting you do not know to stakeholders to maintain control', 'Only sharing certainties and hiding gaps or uncertainties', 'Sharing everything including speculation without clarity'], 0, E, A),
      q('In your next meeting or update, what could you do?', ['Name one thing you do not know yet and when or how you will find out', 'Avoid the topic entirely to prevent questions about uncertainties or gaps', 'Give a vague answer that does not commit to finding out or providing clarity', 'Promise to know soon without a specific date or method for gathering information'], 0, M, A),
      q('Faking certainty when you do not know can lead to:', ['Lost trust when reality diverges; others make plans on false assumptions', 'Others committing to dates or scope that your uncertainty could have corrected', 'You looking decisive until the real date slips and no one was prepared', 'Stakeholders making plans that depend on your guess as if it were fact'], 0, H, C),
      q('Hiding unknowns to look in control tends to:', ['Create surprises and erode trust when the unknown becomes visible', 'The team feeling reassured until the gap appears and was not planned for', 'Fewer questions in the short term and more blame when things slip', 'Others filling in the gaps with their own assumptions'], 0, H, C),
      q('A client asks when a feature will be ready. The team lead says: "I don\'t know yet. We are testing X this week and will know by Friday." What does this demonstrate?', ['Communicating unknowns: setting expectations and aligning others on when they will know', 'Avoiding commitment to appear in control without giving a real timeline', 'Sharing only certainties and hiding gaps or uncertainties', 'Sharing speculation without clarity on when or how they will find out'], 0, M, A),
      q('When you learn something new about an unknown, what should you do?', ['Update and communicate; do not leave people with stale "I don\'t know" information', 'Only update your own plan without communicating the change to others', 'Wait until you know everything before sharing any updates', 'No need to update; the original "I don\'t know" is still accurate'], 0, M, A),
    ],
    25: [
      q('A client expects a delivery date you are not sure you can meet. What should you do?', ['Share the constraint or trade-off you have not mentioned; propose how you will handle it together', 'Promise the date to avoid difficult conversations about constraints or trade-offs', 'Stay vague and hope the client does not press for specifics or commitments', 'Blame internal factors only without proposing solutions or alternatives or collaboration'], 0, M, A),
      q('A client requests a feature in two weeks. Instead of promising it, the team lead says: "We can do that, but it means delaying Y. Here are three options." What does this demonstrate?', ['Moving from client to partner: sharing constraints and trade-offs, inviting them into the problem', 'Giving the client everything they ask for without pushback or discussion', 'Treating the client as the enemy to manage and control', 'Only sharing deliverables and hiding constraints or trade-offs'], 0, E, A),
      q('How do you build trust through transparency with a client?', ['Share one constraint or trade-off you have not mentioned; propose how you will handle it together', 'Hide problems to maintain a positive relationship and avoid difficult conversations', 'Overpromise to please the client and deal with problems later', 'Only report status without sharing constraints, trade-offs, or unknowns'], 0, M, A),
      q('Hiding problems to preserve the relationship short-term can lead to:', ['Surprises later and broken trust when the problem surfaces', 'The client trusting you more until the missed commitment appears', 'Faster agreement on scope without discussing constraints', 'Saying yes to every request and overloading the team'], 0, H, C),
      q('Treating the client as someone to please rather than to align with tends to:', ['Overpromising and underdelivering; no real partnership or alignment', 'Saying yes to deadlines you cannot meet to avoid pushback', 'Keeping constraints to yourself and surprising them at delivery', 'The client feeling heard while the real trade-offs stay undiscussed'], 0, H, C),
      q('What should you share with a client or partner?', ['Constraints, timelines, trade-offs, and unknowns so they can align and help', 'Only good news to maintain a positive relationship and avoid worry', 'Only the deliverable without sharing any constraints or challenges', 'Only when asked directly, otherwise keep information to yourself'], 0, M, A),
      q('A client relationship needs more transparency. What is the next step with one client or partner?', ['Share one constraint or trade-off you have not mentioned before; propose how you will handle it together', 'Wait for them to ask about constraints before sharing anything proactively', 'Send a generic update without specific constraints or trade-offs or transparency', 'Schedule more meetings to discuss without actually sharing constraints or unknowns'], 0, M, A),
    ],
    26: [
      q('A project just ended. What should you do next?', ['Run a short reflection: what happened, what we learned, what we change; extract one rule or checklist item', 'Celebrate only without reflecting on what worked or what to improve for next time', 'Move to the next project immediately without learning from this one or extracting lessons', 'Write a long report documenting everything without extracting actionable lessons or changes'], 0, M, A),
      q('After a project ends, a team spends 10 minutes answering: "What happened? What did we learn? What will we change?" They extract one rule for next time. What does this demonstrate?', ['Reflecting like a pro: extracting concrete rules from experience, done regularly', 'Thinking about the project once at the end without structure', 'Blaming and praising without extracting actionable rules', 'Only documenting facts without lessons or changes'], 0, E, A),
      q('A project just completed successfully. When should the team run reflection on what they learned?', ['After wins and losses; regularly, not only after failure', 'Only after failure when something goes wrong', 'Only at year-end as part of annual planning', 'Never; reflection is not necessary for successful delivery'], 0, M, A),
      q('Skipping reflection when things go well can lead to:', ['Missing lessons; experience stays anecdotal', 'Repeating the same approach without naming what made it work', 'Only reflecting when something fails, so wins stay unexplained', 'Writing a long report without one rule to change for next time'], 0, H, C),
      q('Blaming instead of learning tends to:', ['No concrete change; the same mistake repeats', 'One person taking the blame while the process stays broken', 'Faster closure of the incident without extracting a rule', 'The team avoiding hard conversations and skipping reflection'], 0, H, C),
      q('A team runs a reflection after a project. What should reflection produce?', ['One concrete change: a rule or behavior for next time, not only insights', 'Only insights without translating them into actionable changes or improvements', 'Only a report documenting what happened without lessons or actionable takeaways', 'Only praise for what went well without identifying improvements or changes needed'], 0, M, A),
      q('A team wants to run a reflection but is unsure about the format. How long can a useful reflection be?', ['Short: e.g. 5 minutes; what happened, one lesson, one thing you will do differently', 'At least an hour to thoroughly analyze every detail of what happened before acting', 'Only written in a formal document without discussion or action or changes', 'Only in a meeting with all stakeholders present regardless of length or efficiency'], 0, M, A),
    ],
    27: [
      q('A leader solves problems ad hoc each time without a consistent approach. What would help?', ['Define your loop: understand, plan, move, test, reflect, adjust; document it and use it on the next problem', 'Solve harder problems to develop better problem-solving skills naturally without structure', 'Get more training without developing your own systematic approach or repeatable process', 'Wait for a template or framework from someone else without creating your own method'], 0, M, A),
      q('What is a "thinking loop"?', ['A repeatable process: understand, plan, move, test, reflect, adjust', 'A single plan that you follow once without iteration or learning from outcomes', 'A daily checklist only without reflection or adjustment based on what you learn', 'A meeting agenda for discussing problems without solving them or taking action'], 0, E, A),
      q('After defining your loop, what should you do?', ['Run it on one small problem; note one change to the loop after you use it', 'File it and refer to it later without actually using it or testing its effectiveness', 'Share it only with others without testing it yourself or learning from experience', 'Use it only for big problems and continue ad hoc for small ones without consistency'], 0, M, A),
      q('Never updating the loop after use can lead to:', ['A loop that never improves; you repeat the same gaps', 'Using the same steps for every problem without checking fit', 'Dropping the loop when it feels slow and reverting to ad hoc', 'Sharing the loop with others but not applying it yourself'], 0, H, C),
      q('One-size-fits-all for every problem type tends to:', ['Miss nuance; some problems need different steps or emphasis', 'Applying the same checklist to crises and to routine decisions alike', 'Skipping steps when time is short and only doing the "important" ones', 'Documenting the loop but never running it on a real problem'], 0, H, C),
      q('A leader wants to document their thinking loop. How do you document your loop?', ['Write it in 6 steps or fewer; e.g. understand, plan, move, test, reflect, adjust', 'Write a long manual with extensive detail and examples without focusing on usability', 'Keep it in your head without writing it down or making it repeatable or shareable', 'Copy someone else\'s loop without adapting it to your context or testing it'], 0, M, A),
      q('What should you do with the loop after using it?', ['Note one change to the loop based on what you learned from using it', 'Never change it to maintain consistency regardless of what you learn or discover', 'Only share it with others without improving it based on your own experience', 'Archive it and move on to a different approach without learning from what worked'], 0, M, A),
    ],
    28: [
      q('You are handed a messy situation (inbox, project, relationship). What is the first step?', ['Apply: decompose, find leverage, name the next move; write the new structure in 5 bullets or fewer', 'Fix everything at once without understanding what matters most or prioritizing', 'Add more process and structure without identifying the core issues or leverage points', 'Leave it as is and hope it resolves itself over time without intervention'], 0, M, A),
      q('A manager inherits a chaotic project with 50 open tasks, no priorities, and unclear ownership. They decompose it into 5 areas, identify the leverage point, and name the next move. What does this demonstrate?', ['Moving from chaos to clarity: creating order through structure and priorities', 'Cleaning up only without changing the underlying structure or priorities', 'Reorganizing only without naming next steps or ownership or accountability', 'Delegating and leaving without documenting or clarifying or creating structure'], 0, E, A),
      q('You inherit a chaotic project with unclear priorities and no structure. How do you create order?', ['Decompose, find leverage, name the next move; write the new structure briefly', 'Add more steps and process without understanding what is essential or testable', 'Hold more meetings to discuss the mess without taking action or creating structure', 'Assign everything to others without creating structure or priorities or next steps'], 0, M, A),
      q('Trying to fix everything at once in a messy situation often leads to:', ['Overwhelm and no clear progress; focus on structure and one next move', 'Finishing one area while others stay stuck and priorities unclear', 'More meetings to coordinate everything without a single next move', 'Delegating the mess to others without leaving a clear structure'], 0, H, C),
      q('Adding process for its own sake can result in:', ['More chaos; structure should serve clarity and the next move', 'More forms and checklists that nobody uses when deciding', 'Faster execution because everything is now documented', 'The team following the process instead of achieving the goal'], 0, H, C),
      q('What should you leave behind when you exit a messy situation?', ['A clear next owner or next step; the situation clearer than you found it', 'A long report documenting everything without clear next steps or actionable items', 'Nothing; move on without leaving any structure or guidance for the next person', 'Only recommendations without identifying who will act on them or what comes next'], 0, M, A),
      q('Pick one messy area. What should you produce?', ['Decompose, find leverage, name the next move; write the new structure in 5 bullets or fewer', 'A full plan with all details before taking any action or testing assumptions', 'A list of problems without identifying solutions or priorities or next steps', 'A meeting invite to discuss the mess without creating structure or clarity'], 0, M, A),
    ],
    29: [
      q('A leader wants to codify how they work and make it repeatable. What should they create?', ['A playbook: principles, checklists, and rules; include problem separation, restatement, moves, feedback, reflection', 'A long document with extensive detail but no actionable principles or practices', 'A vision statement only without concrete practices or rules you can actually follow', 'A list of goals only without methods for achieving them or systematic approaches'], 0, M, A),
      q('What is a "personal playbook"?', ['Your codified way of thinking, deciding, and delivering that you can repeat', 'A daily to-do list of tasks without underlying principles or methods or repeatability', 'A project plan for one specific initiative without general applicability or transferability', 'A job description of your role without personal practices or approaches or methods'], 0, E, A),
      q('A leader wants their written playbook to reflect how they solve problems and deliver. What should the playbook include?', ['Problem separation, restatement, moves, feedback, reflection; plus one improvement they will follow', 'Only motivational quotes to inspire action without methods or systematic approaches', 'Only definitions of concepts without practical application or actionable steps', 'Only examples from others without extracting principles or creating their own rules'], 0, M, A),
      q('A playbook that is too generic to use can lead to:', ['It never influences daily decisions; make it concrete enough to apply', 'Using it only for big decisions and ad hoc for everything else', 'Copying someone else\'s playbook without adapting it to your context', 'Updating it constantly and never settling on a repeatable habit'], 0, H, C),
      q('A leader has a one-page document with their principles and a decision checklist. They never open it when making tough calls and do not update it after projects. What is the likely result?', ['No connection between the playbook and decisions; it becomes shelf-ware', 'Decisions still align with the playbook by chance', 'The playbook gets shared widely but not applied personally', 'The leader remembers the principles without needing the document'], 0, H, C),
      q('Someone has just written a one-page playbook of principles and a checklist. What should they add for the next 90 days to make it stick?', ['One rule they will follow from the playbook to build the habit and test its effectiveness', 'Everything they learned without focusing on specific practices or actionable changes', 'Nothing; the playbook is complete and does not need action or implementation or testing', 'Only goals without methods or rules for achieving them or systematic approaches or practices'], 0, M, A),
      q('A leader wants to codify how they work in a written playbook. How long should a first draft be?', ['One page: principles and one checklist that they can actually use and follow', 'As long as possible to include every detail and example regardless of usability', 'Only bullet points without explanations or context or actionable guidance', 'Only one sentence summarizing everything without actionable steps or practices'], 0, M, A),
    ],
    30: [
      q('A leader has just finished a structured program and wants to sustain progress. How should they sustain progress?', ['Summarize their system (think, decide, deliver); commit to 90 days using their playbook; define one review cadence', 'Rely on motivation to continue applying what they learned without systematic structure', 'Set a yearly goal only without daily or weekly practices or review mechanisms', 'Wait for the next program to continue learning without applying current knowledge or building habits'], 0, M, A),
      q('A leader relies on motivation to drive team performance. After six months, motivation drops and performance declines. What should they have built instead?', ['A repeatable system that persists when motivation fades', 'More motivation and inspiration to keep the team going', 'Systems are boring compared to motivation and should be avoided', 'This only applies during training, not in real work situations'], 0, E, A),
      q('A leader has committed to using their playbook for 90 days. What should they schedule in 30 days?', ['One review: how is the system working? what do you change?', 'Nothing; the system will work automatically without review or adjustment', 'A full replan of everything without evaluating what is working or what to keep', 'Only a celebration of progress without reflecting on improvements or needed changes'], 0, M, A),
      q('Relying on motivation to sustain the system often leads to:', ['The system fades when motivation drops; build review and accountability', 'People burn out from constant motivational pressure', 'Rituals get skipped first when busy; then the whole system slips', 'The system stays only in documents and is never used when deciding'], 0, H, C),
      q('No review cadence can result in:', ['The system drifting; schedule at least one review to keep it alive', 'More flexibility in when to apply the playbook', 'Short-term time savings that lead to forgotten practices', 'The playbook staying "correct" on paper while behavior reverts'], 0, H, C),
      q('How do you write your system in three lines?', ['Think (how you understand and plan), decide (how you choose), deliver (how you move, test, reflect)', 'Goals, tasks, deadlines without underlying methods or principles or systematic approaches', 'Mission, vision, values without concrete practices or approaches or actionable steps', 'Past, present, future without actionable steps or processes or repeatable methods'], 0, M, A),
      q('A leader has completed a structured program and wants to maintain progress. What should they commit to for the next 90 days?', ['Using their written playbook and one accountability or review cadence to maintain progress', 'Only the playbook without any review or accountability mechanisms or checkpoints', 'Only the review without actually using the playbook in practice or building habits', 'Nothing specific; let progress happen naturally without structure or systematic approach'], 0, M, A),
    ],
  };

  if (byDay[day]) return byDay[day];

  // Fallback only for invalid day (should not happen for 11–30)
  const fallback: QuizItem[] = [
    q('What is the best next step when facing a complex goal?', ['Break it into testable steps and do the smallest one first', 'Plan the whole project in detail', 'Wait for perfect information', 'Delegate everything'], 0, M, A),
    q('A team launches a feature and waits three months before checking if users like it. What is missing compared to a proper feedback loop?', ['Reality corrects plans; short cycles reduce the cost of being wrong and enable early adjustment', 'Sending a survey at the end without interim checks or adjustments', 'Asking for approval without testing actual outcomes or usage', 'Reporting status only without gathering signal from real users'], 0, M, A),
    q('How should you treat a plan when evidence contradicts it?', ['Update the plan; do not defend it', 'Double down', 'Hide the evidence', 'Blame others'], 0, M, A),
    q('What is the risk of waiting too long before checking reality?', ['You invest in a wrong direction and learn late', 'You save time by avoiding interim checks', 'Costs and commitment grow before you see that the direction is wrong', 'Stakeholders get one big surprise instead of early options to adjust'], 0, H, C),
    q('Which outcome indicates you are making progress?', ['You have a testable step done and evidence to decide the next move', 'You have a long plan', 'You had many meetings', 'You avoided failure'], 0, H, C),
    q('A team wants to launch a new product. Instead of building everything, they ship a minimal version to 100 users, gather feedback, then add features. What is this approach called?', ['Shipping small: testing the minimal structure first, then adding based on evidence', 'Shipping only tiny features and nothing else regardless of value', 'Shipping rarely to avoid mistakes and maintain quality', 'Shipping without testing or validation to save time'], 0, M, A),
    q('A project is at risk of missing its deadline. When should you escalate this bad news to stakeholders?', ['Early, with a proposed fix or options before the deadline arrives', 'At the deadline when it is too late to help or adjust', 'When asked directly about the project status', 'Never; bad news should be hidden to avoid worry'], 0, M, A),
  ];
  return fallback;
}

async function seed() {
  const appUrl = process.env.APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || 'amanoba',
  });
  let brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    brand = await Brand.create({
      name: 'Amanoba',
      slug: 'amanoba',
      displayName: 'Amanoba',
      description: 'Unified Learning Platform',
      logo: '/AMANOBA.png',
      themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
      allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
      supportedLanguages: ['hu', 'en'],
      defaultLanguage: 'hu',
      isActive: true
    });
    console.log('✅ Brand created');
  }

  // Register CCS so it appears in admin "Course families" (CCS) view
  const ccsUpdate = {
    ccsId: CCS_ID,
    name: COURSE_NAME,
    idea: 'Train learners to think like problem-solvers: break complex situations into parts, choose the right move, ship small, test fast, speak the truth. Built on Pólya\'s framework and delivery-first mindset. Operational, not inspirational.',
    outline: '30-day outline: Day 1–7 (problem, symptom, understand, unknowns, restate, decompose, leverage); Day 8–14 (plans as hypotheses, moves, analogy, working backwards, simplify, multiple paths, choose); Day 15–21 (done=testable, skeleton, feedback, kill early, measure, pivot, momentum); Day 22–30 (truth, no surprises, unknowns, partner, reflect, thinking loop, chaos→clarity, playbook, system not motivation).',
  };
  if (APPLY) {
    await CCS.findOneAndUpdate(
      { ccsId: CCS_ID },
      { $set: ccsUpdate },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ CCS ${CCS_ID} ${APPLY ? 'created/updated' : '(dry-run: not written)'}`);

  const courseUpdate = {
    courseId: COURSE_ID,
    name: COURSE_NAME,
    description: COURSE_DESCRIPTION,
    language: 'en',
    durationDays: 30,
    isActive: true,
    requiresPremium: false,
    brandId: brand._id,
    ccsId: CCS_ID,
    pointsConfig: {
      completionPoints: 1000,
      lessonPoints: 50,
      perfectCourseBonus: 500
    },
    xpConfig: {
      completionXP: 500,
      lessonXP: 25
    },
    metadata: {
      category: 'business',
      difficulty: 'intermediate',
      estimatedHours: 15,
      tags: ['decision-making', 'problem-solving', 'delivery', 'Pólya', 'done-is-better'],
      instructor: 'Amanoba'
    }
  };

  const course =
    APPLY
      ? await Course.findOneAndUpdate(
          { courseId: COURSE_ID },
          { $set: courseUpdate },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      : await Course.findOne({ courseId: COURSE_ID });

  if (!course) {
    throw new Error(`Course ${COURSE_ID} not found (dry-run). Re-run with --apply to create it.`);
  }

  console.log(`✅ Course ${COURSE_ID} ${APPLY ? 'created/updated' : 'loaded (dry-run)'}`);
  console.log(`- Mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
  console.log(`- onlyMissingLessons: ${ONLY_MISSING_LESSONS}`);
  console.log(`- includeQuizzes: ${INCLUDE_QUIZZES}`);

  for (const entry of lessonPlan) {
    const lessonId = `${COURSE_ID}_DAY_${String(entry.day).padStart(2, '0')}`;
    const existing = await Lesson.findOne({ lessonId }).select('_id').lean();
    if (existing && ONLY_MISSING_LESSONS) continue;
    const content = buildContent(entry);

    const emailSubject = entry.emailSubject || `Done is better – Day {{dayNumber}}: {{lessonTitle}}`;
    let emailBody = entry.emailBody;
    if (!emailBody) {
      emailBody = [
        `<h1>${COURSE_NAME}</h1>`,
        `<h2>Day {{dayNumber}}: {{lessonTitle}}</h2>`,
        '<p>{{lessonContent}}</p>',
        `<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
      ].join('');
    }
    emailBody = emailBody.replace(/\{\{APP_URL\}\}/g, appUrl).replace(/\{\{COURSE_ID\}\}/g, COURSE_ID);

    const lessonUpdate = {
      lessonId,
      courseId: course._id,
      dayNumber: entry.day,
      language: 'en',
      isActive: true,
      title: entry.title,
      content,
      emailSubject,
      emailBody,
      quizConfig: {
        enabled: true,
        successThreshold: 70,
        questionCount: 7,
        poolSize: 10,
        required: true
      },
      pointsReward: 50,
      xpReward: 25,
      metadata: {
        estimatedMinutes: 15,
        difficulty: 'medium' as const,
        tags: ['done-is-better', 'decision-making']
      }
    };

    if (APPLY) {
      await Lesson.findOneAndUpdate(
        { lessonId },
        { $set: lessonUpdate },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const quizzes = getQuizzesForDay(entry.day);
    if (INCLUDE_QUIZZES) {
      if (APPLY) {
        await QuizQuestion.deleteMany({ lessonId });
        await QuizQuestion.insertMany(
          quizzes.map((q, index) => ({
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            difficulty: q.difficulty,
            category: q.category,
            questionType: q.questionType,
            lessonId,
            courseId: course._id,
            language: 'en',
            isActive: true,
            isCourseSpecific: true,
            displayOrder: index + 1,
            showCount: 0,
            correctCount: 0,
            incorrectCount: 0,
            averageResponseTime: 0
          }))
        );
      }
      console.log(`${APPLY ? '✅' : '📝'} Quiz ${lessonId} (${quizzes.length} questions)`);
    }

    if (APPLY) {
      console.log(`✅ Lesson ${lessonId} upserted`);
    } else {
      console.log(`📝 Would upsert ${lessonId}${existing ? ' (update)' : ' (create)'}`);
    }
  }

  console.log(`🎉 ${COURSE_ID} processed (${APPLY ? 'APPLY' : 'DRY-RUN'}).`);
  await mongoose.disconnect();
  console.log('✅ Disconnected');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
