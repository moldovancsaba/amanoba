/**
 * Seed Sales Productivity 30 (EN) — add missing Day 12–30 lessons.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - Default behavior: create missing lessons only (do not overwrite existing lessons).
 * - Quizzes are not modified by this script.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-en.ts
 *   npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-en.ts --apply
 *   npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-en.ts --update-existing-lessons --apply
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'SALES_PRODUCTIVITY_30_EN';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

const APPLY = hasFlag('--apply');
const ONLY_MISSING_LESSONS = !hasFlag('--update-existing-lessons');

type LessonEntry = {
  day: number;
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
};

const LESSONS_12_30: LessonEntry[] = [
  {
    day: 12,
    title: 'Objection Handling – Turn “No” Into Data',
    content: `<h1>Objection Handling – Turn “No” Into Data</h1>
<p><em>Objections are information. Your job is to clarify, quantify, and reduce risk.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Classify objections into 4 buckets: value, timing, trust, and fit.</li>
  <li>Use a simple LAER flow (Listen, Acknowledge, Explore, Respond).</li>
  <li>Create an “objection map” for your top 5 objections.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Most deals are lost because risk stays implicit and unaddressed.</li>
  <li>If you fight objections, you create resistance. If you explore, you create clarity.</li>
  <li>A repeatable flow improves conversion and reduces emotional selling.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>1) The 4 objection buckets</h3>
<ul>
  <li><strong>Value</strong>: “This won’t help us.”</li>
  <li><strong>Timing</strong>: “Not now.”</li>
  <li><strong>Trust</strong>: “We’re not sure you can deliver.”</li>
  <li><strong>Fit</strong>: “We’re not the right customer.”</li>
</ul>
<h3>2) LAER in practice</h3>
<ol>
  <li><strong>Listen</strong>: let them finish; capture the exact wording.</li>
  <li><strong>Acknowledge</strong>: confirm the concern is reasonable.</li>
  <li><strong>Explore</strong>: ask for context, numbers, and decision criteria.</li>
  <li><strong>Respond</strong>: address with proof, options, and a next step.</li>
</ol>
<hr />
<h2>Examples</h2>
<p><strong>Objection:</strong> “It’s too expensive.”</p>
<ul>
  <li><strong>Explore</strong>: “Expensive compared to what? What budget range did you plan for solving this?”</li>
  <li><strong>Respond</strong>: “If we reduce scope to focus on the highest-impact use case first, would a smaller starting package work?”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Objection map</h2>
<ol>
  <li>Write your top 5 objections (exact phrasing).</li>
  <li>Assign each to a bucket (value/timing/trust/fit).</li>
  <li>For each, write 2 explore questions and 1 proof/asset you can use.</li>
</ol>
<h2>Independent exercise (5–10 min) — “Explore-first” role play</h2>
<p>Pick one objection and write a 6-line dialogue where you explore before responding.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I can classify objections quickly.</li>
  <li>I have an objection map with explore questions.</li>
  <li>I can respond without defensiveness.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 12: Objection handling',
    emailBody: `<h1>Sales Productivity 30 — Day 12</h1>
<p>Turn objections into data and reduce decision risk with a simple flow.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 13,
    title: 'Discovery Calls – Diagnose Before You Prescribe',
    content: `<h1>Discovery Calls – Diagnose Before You Prescribe</h1>
<p><em>Great discovery creates clarity: problem, impact, constraints, and decision process.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Run a 25-minute discovery structure with a clear agenda.</li>
  <li>Capture problem impact with numbers (time, money, risk).</li>
  <li>End with a committed next step.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Weak discovery produces weak proposals and “ghosting”.</li>
  <li>Impact converts interest into urgency.</li>
  <li>Decision-process clarity prevents late-stage surprises.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Discovery agenda (25 minutes)</h3>
<ol>
  <li><strong>Set the frame (3 min)</strong>: goal + agenda + timing.</li>
  <li><strong>Current state (7 min)</strong>: process, tools, stakeholders.</li>
  <li><strong>Problems + impact (10 min)</strong>: where it breaks and what it costs.</li>
  <li><strong>Decision process (3 min)</strong>: who decides, criteria, timeline.</li>
  <li><strong>Next step (2 min)</strong>: schedule, owner, deliverable.</li>
</ol>
<hr />
<h2>Examples</h2>
<p><strong>Impact question</strong>: “If this stays the same for 90 days, what breaks? What’s the cost?”</p>
<p><strong>Decision process question</strong>: “Who needs to say yes, and what do they need to see?”</p>
<hr />
<h2>Guided exercise (10–15 min) — Discovery script v1</h2>
<ol>
  <li>Write 5 current-state questions.</li>
  <li>Write 5 impact questions (push for numbers).</li>
  <li>Write 3 decision-process questions.</li>
</ol>
<h2>Independent exercise (5–10 min) — Call note template</h2>
<p>Create a template with fields: problem, impact, constraints, stakeholders, criteria, timeline, next step.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I can run a clear discovery agenda.</li>
  <li>I can quantify impact.</li>
  <li>I always end with a next step.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 13: Discovery calls',
    emailBody: `<h1>Sales Productivity 30 — Day 13</h1>
<p>Diagnose the real problem, quantify impact, and clarify the decision process.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 14,
    title: 'Proposal Writing – Make the Next Step Easy',
    content: `<h1>Proposal Writing – Make the Next Step Easy</h1>
<p><em>A strong proposal is a decision document: outcomes, plan, proof, and risk control.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Write a 1-page proposal structure you can reuse.</li>
  <li>Align scope to success criteria and timeline.</li>
  <li>Reduce risk with options and assumptions.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Proposals fail when they are product brochures, not decision support.</li>
  <li>Clarity reduces back-and-forth and accelerates closing.</li>
  <li>Options give control without discounting.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>1-page proposal template</h3>
<ol>
  <li><strong>Problem + impact</strong> (from discovery)</li>
  <li><strong>Outcome</strong> (what changes, measurable)</li>
  <li><strong>Approach</strong> (steps + responsibilities)</li>
  <li><strong>Timeline</strong> (milestones)</li>
  <li><strong>Proof</strong> (case, reference, pilot plan)</li>
  <li><strong>Risks + assumptions</strong> (what could block success)</li>
  <li><strong>Commercials</strong> (price + terms)</li>
  <li><strong>Next step</strong> (meeting + decision date)</li>
</ol>
<hr />
<h2>Guided exercise (10–15 min) — Write a proposal skeleton</h2>
<ol>
  <li>Pick one active opportunity.</li>
  <li>Fill the 1-page template with bullet points.</li>
  <li>Add 2 options (Starter vs Standard) without changing core outcome.</li>
</ol>
<h2>Independent exercise (5–10 min) — Risk line</h2>
<p>Write 3 “risk + mitigation” bullets (e.g., stakeholder availability → weekly check-in).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>My proposal reads like a decision document.</li>
  <li>Scope is tied to success criteria.</li>
  <li>Next step is explicit and scheduled.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 14: Proposals',
    emailBody: `<h1>Sales Productivity 30 — Day 14</h1>
<p>Turn discovery into a 1-page proposal that supports a fast decision.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 15,
    title: 'Negotiation – Trade, Don’t Give',
    content: `<h1>Negotiation – Trade, Don’t Give</h1>
<p><em>Negotiation is scope, risk, and terms. Protect value by trading concessions.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Prepare a concession plan (what you can trade and for what).</li>
  <li>Use objective criteria to anchor pricing.</li>
  <li>Keep the deal tied to outcomes and risk reduction.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Unplanned discounting trains buyers to push harder.</li>
  <li>Trading preserves value and increases commitment.</li>
  <li>Good negotiation improves retention (the buyer feels safe, not “sold”).</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Concession plan</h3>
<ul>
  <li><strong>Can trade</strong>: term length, start date, payment schedule, scope reduction, pilot.</li>
  <li><strong>Must receive</strong>: faster decision, reference, multi-year, case study, paid pilot, access to stakeholders.</li>
  <li><strong>Never give</strong>: core value without compensation.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Your trade table</h2>
<ol>
  <li>Create a 2-column table: “I can offer” vs “I need in return”.</li>
  <li>Add 6 items per column.</li>
  <li>Pick your top 3 “go-to trades”.</li>
</ol>
<h2>Independent exercise (5–10 min) — Reframe price</h2>
<p>Write 3 sentences that link price to risk reduction and outcome (not features).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I have a concession plan.</li>
  <li>I trade for commitment, not discounts.</li>
  <li>I keep negotiation outcome-focused.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 15: Negotiation',
    emailBody: `<h1>Sales Productivity 30 — Day 15</h1>
<p>Protect value: plan concessions and trade for commitment.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 16,
    title: 'Closing – Run a Clear Decision Process',
    content: `<h1>Closing – Run a Clear Decision Process</h1>
<p><em>Closing is not pressure. It is making the decision path explicit and easy.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Create a Mutual Action Plan (MAP) for an active deal.</li>
  <li>Define exit criteria for your final stage.</li>
  <li>Prevent “maybe” outcomes by scheduling decision steps.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Deals slip when next steps are vague.</li>
  <li>A MAP aligns stakeholders and reduces internal confusion.</li>
  <li>Clear closing reduces follow-up time and improves forecasting accuracy.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Mutual Action Plan (MAP)</h3>
<ol>
  <li>Who decides + who signs</li>
  <li>Decision criteria (what must be true)</li>
  <li>Proof steps (pilot, reference call, security review)</li>
  <li>Commercial steps (terms, procurement)</li>
  <li>Dates + owners for each step</li>
</ol>
<hr />
<h2>Guided exercise (10–15 min) — Build a MAP</h2>
<ol>
  <li>Pick one deal in late stage.</li>
  <li>Write 6 steps with owner + date.</li>
  <li>Send it as a simple table in your next follow-up.</li>
</ol>
<h2>Independent exercise (5–10 min) — Exit criteria</h2>
<p>Write the 3 conditions required to mark a deal “Closed Won” and “Closed Lost”.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I have a MAP.</li>
  <li>My pipeline stage has exit criteria.</li>
  <li>I schedule decisions, not “check-ins”.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 16: Closing',
    emailBody: `<h1>Sales Productivity 30 — Day 16</h1>
<p>Close by running a clear decision process (Mutual Action Plan).</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 17,
    title: 'Handoff & Onboarding – Deliver What You Sold',
    content: `<h1>Handoff & Onboarding – Deliver What You Sold</h1>
<p><em>A strong handoff prevents churn. Align expectations, success criteria, and responsibilities.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Create a handoff checklist for sales → delivery.</li>
  <li>Define success metrics and first milestone.</li>
  <li>Prevent “scope drift” by documenting assumptions.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Bad onboarding is the #1 cause of early churn.</li>
  <li>Delivery teams need context and constraints, not just a contract.</li>
  <li>Clear success criteria improves upsell later.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Handoff checklist</h3>
<ul>
  <li>Business goal + impact</li>
  <li>Stakeholders + decision maker + champion</li>
  <li>Use cases in-scope / out-of-scope</li>
  <li>Timeline + first milestone</li>
  <li>Risks + mitigations</li>
  <li>Success metrics (adoption, time saved, revenue, risk reduced)</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Your handoff doc v1</h2>
<ol>
  <li>Create a 1-page handoff template with the checklist fields.</li>
  <li>Fill it for your most recent closed-won deal.</li>
  <li>Send it internally before kickoff.</li>
</ol>
<h2>Independent exercise (5–10 min) — Kickoff agenda</h2>
<p>Write a kickoff agenda with 5 bullets: goal, success metrics, responsibilities, timeline, next milestone.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I have a handoff template.</li>
  <li>Success metrics are explicit.</li>
  <li>Scope boundaries are documented.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 17: Handoff & onboarding',
    emailBody: `<h1>Sales Productivity 30 — Day 17</h1>
<p>Prevent churn by handing off context, success criteria, and scope boundaries.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 18,
    title: 'Account Management – Keep Value Visible',
    content: `<h1>Account Management – Keep Value Visible</h1>
<p><em>Retention is a process. Make outcomes measurable and reviewed.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Build a simple account health score.</li>
  <li>Run a monthly value review (QBR-lite).</li>
  <li>Track adoption and blockers.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Renewals are won months before the renewal date.</li>
  <li>Value must be visible to stakeholders who weren’t in the purchase.</li>
  <li>Health scoring helps you prioritize proactive work.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Account health score (0–10)</h3>
<ul>
  <li>Adoption (0–3)</li>
  <li>Business outcomes (0–3)</li>
  <li>Stakeholder engagement (0–2)</li>
  <li>Support / risk signals (0–2)</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Health score template</h2>
<ol>
  <li>Define the 4 categories and how you score them.</li>
  <li>Score 3 accounts.</li>
  <li>Pick 1 action per “at risk” account.</li>
</ol>
<h2>Independent exercise (5–10 min) — Value review email</h2>
<p>Draft a monthly value review email with: outcome achieved, metrics, next improvement, upcoming milestone.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I can score account health quickly.</li>
  <li>I run regular value reviews.</li>
  <li>I act before renewal risk becomes visible.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 18: Account management',
    emailBody: `<h1>Sales Productivity 30 — Day 18</h1>
<p>Keep outcomes visible with a health score and monthly value reviews.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 19,
    title: 'Expansion – Upsell Without Being Pushy',
    content: `<h1>Expansion – Upsell Without Being Pushy</h1>
<p><em>Expansion is solving the next problem. Use triggers and evidence, not pressure.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Identify expansion triggers and stakeholders.</li>
  <li>Write an expansion hypothesis (problem → value → proof).</li>
  <li>Propose a low-risk next step (pilot, workshop, add-on).</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Growth in B2B often comes more from expansion than new logos.</li>
  <li>Expansion is easier when value is already proven.</li>
  <li>Triggers keep expansion relevant and timely.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Common expansion triggers</h3>
<ul>
  <li>New team, new region, new product line</li>
  <li>New KPI initiative</li>
  <li>New compliance/security requirement</li>
  <li>High adoption in one team → replicate</li>
  <li>Frequent requests for “one more feature/use case”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Expansion hypothesis</h2>
<ol>
  <li>Pick one account with proven adoption.</li>
  <li>Write: “If we extend to X, we can achieve Y, because Z proof.”</li>
  <li>Define the smallest next step to validate it.</li>
</ol>
<h2>Independent exercise (5–10 min) — Two-sentence pitch</h2>
<p>Write a 2-sentence expansion pitch anchored in outcomes and proof.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I look for triggers.</li>
  <li>I propose low-risk validation steps.</li>
  <li>I anchor expansion in proof and outcomes.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 19: Expansion',
    emailBody: `<h1>Sales Productivity 30 — Day 19</h1>
<p>Grow accounts by solving the next problem using triggers and proof.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 20,
    title: 'Renewals & Retention – Build a Save Plan',
    content: `<h1>Renewals & Retention – Build a Save Plan</h1>
<p><em>Retention is proactive. Create a process that detects risk early and fixes it.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Define early churn risk signals.</li>
  <li>Create a renewal timeline (90/60/30 days).</li>
  <li>Write a simple “save plan” template.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Renewals fail when you discover issues too late.</li>
  <li>Decision-makers change; your value story must stay current.</li>
  <li>A save plan reduces panic and random discounting.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Risk signals</h3>
<ul>
  <li>Adoption drops</li>
  <li>Champion disengages</li>
  <li>Support tickets spike</li>
  <li>Unclear outcomes / no recent value review</li>
  <li>Procurement starts early “cost cutting” language</li>
</ul>
<h3>Save plan template</h3>
<ul>
  <li>Risk signal</li>
  <li>Root cause hypothesis</li>
  <li>Fix actions (owner + date)</li>
  <li>Proof of recovery (metric)</li>
  <li>Renewal next step</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Renewal timeline</h2>
<ol>
  <li>Write what you do at 90/60/30 days before renewal.</li>
  <li>Add a value review meeting and stakeholder mapping.</li>
  <li>Pick one account and schedule the 90-day step now.</li>
</ol>
<h2>Independent exercise (5–10 min) — Save plan v1</h2>
<p>Write a save plan for one risky account using the template.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I know early risk signals.</li>
  <li>I have a renewal timeline.</li>
  <li>I can write a clear save plan.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 20: Renewals & retention',
    emailBody: `<h1>Sales Productivity 30 — Day 20</h1>
<p>Detect churn risk early and run a structured renewal + save plan.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 21,
    title: 'Outbound Emails – Personalize Without Wasting Time',
    content: `<h1>Outbound Emails – Personalize Without Wasting Time</h1>
<p><em>Good outbound is short, specific, and about the buyer’s reality.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Write a 3-part outbound email template.</li>
  <li>Create a 5-touch sequence outline.</li>
  <li>Improve reply rate by targeting one trigger.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Generic outbound gets ignored.</li>
  <li>Specific triggers create relevance.</li>
  <li>Sequences create volume without sacrificing quality.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>3-part email</h3>
<ol>
  <li><strong>Trigger</strong>: why you’re reaching out now</li>
  <li><strong>Hypothesis</strong>: the problem you suspect</li>
  <li><strong>Next step</strong>: a low-friction action (15 min review)</li>
</ol>
<hr />
<h2>Guided exercise (10–15 min) — Sequence v1</h2>
<ol>
  <li>Pick a persona + industry.</li>
  <li>Write the 3-part email.</li>
  <li>Outline 5 touches (email/call/linkedin) with a single goal: book a discovery.</li>
</ol>
<h2>Independent exercise (5–10 min) — Subject line list</h2>
<p>Write 10 subject lines that reference the trigger (not your product).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>My email is trigger-based.</li>
  <li>It’s short and specific.</li>
  <li>It asks for a clear next step.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 21: Outbound emails',
    emailBody: `<h1>Sales Productivity 30 — Day 21</h1>
<p>Write trigger-based outbound emails and a 5-touch sequence.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 22,
    title: 'Cold Calls – Earn Permission Fast',
    content: `<h1>Cold Calls – Earn Permission Fast</h1>
<p><em>Cold calling works when you respect time and focus on a specific hypothesis.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Use a 20-second opener that earns permission.</li>
  <li>Ask 3 diagnostic questions without pitching.</li>
  <li>End with a booked next step or a clean “no”.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Rambling openers create instant resistance.</li>
  <li>Diagnosis creates relevance and credibility.</li>
  <li>A clean “no” saves time and improves focus.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Opener template</h3>
<p>“Hi <em>Name</em>, this is <em>You</em>. Quick one — I’ll be brief. I noticed <em>trigger</em>. Are you open to 30 seconds on why I called?”</p>
<h3>Diagnostic questions</h3>
<ul>
  <li>“How are you handling X today?”</li>
  <li>“What breaks most often?”</li>
  <li>“If you could fix one part this quarter, what would it be?”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Write your script</h2>
<ol>
  <li>Write one opener.</li>
  <li>Write 5 diagnostic questions.</li>
  <li>Write 2 exit lines: “book meeting” and “not a fit”.</li>
</ol>
<h2>Independent exercise (5–10 min) — Objection line</h2>
<p>Write one LAER-style response to “We’re not interested.”</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I can open in 20 seconds.</li>
  <li>I diagnose before pitching.</li>
  <li>I end with a clear outcome.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 22: Cold calls',
    emailBody: `<h1>Sales Productivity 30 — Day 22</h1>
<p>Earn permission fast with a short opener and diagnostic questions.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 23,
    title: 'Follow-up – Turn Conversations Into Commitments',
    content: `<h1>Follow-up – Turn Conversations Into Commitments</h1>
<p><em>Follow-up is a recap + decision path. Never send “Just checking in”.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Write a recap email structure that drives a next step.</li>
  <li>Capture decisions, owners, and dates.</li>
  <li>Reduce ghosting by making choices explicit.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Most deals die in follow-up chaos.</li>
  <li>Recaps become internal documentation for the buyer.</li>
  <li>Clear choices make it easy to say yes or no.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Recap email template</h3>
<ol>
  <li><strong>Summary</strong>: 2–3 bullets</li>
  <li><strong>Key decisions</strong>: what we agreed</li>
  <li><strong>Open questions</strong>: what’s still unknown</li>
  <li><strong>Next steps</strong>: owner + date</li>
  <li><strong>Proposed meeting</strong>: 2 time options</li>
</ol>
<hr />
<h2>Guided exercise (10–15 min) — Recap v1</h2>
<ol>
  <li>Take your last meeting notes.</li>
  <li>Write the recap in the template.</li>
  <li>Add 2 proposed times for the next step.</li>
</ol>
<h2>Independent exercise (5–10 min) — Choice framing</h2>
<p>Write 3 follow-up lines that offer a choice: “Option A / Option B / close the file”.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>My follow-ups include owners and dates.</li>
  <li>I never send vague check-ins.</li>
  <li>I always propose a clear next step.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 23: Follow-up',
    emailBody: `<h1>Sales Productivity 30 — Day 23</h1>
<p>Send recap emails that create commitment, not confusion.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 24,
    title: 'Pipeline Hygiene – Keep Your CRM Real',
    content: `<h1>Pipeline Hygiene – Keep Your CRM Real</h1>
<p><em>Your pipeline is a decision system. Garbage data creates bad decisions.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Define stage exit criteria.</li>
  <li>Run a weekly pipeline review checklist.</li>
  <li>Reduce forecast bias by enforcing data minimums.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Leaky pipelines waste time and break trust in forecasts.</li>
  <li>Clear exit criteria improves team alignment.</li>
  <li>Hygiene frees time for selling instead of chasing.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Minimum fields per deal</h3>
<ul>
  <li>Stage + next step + next step date</li>
  <li>Primary stakeholder + champion</li>
  <li>Use case + success metric</li>
  <li>Decision date</li>
  <li>Top 2 risks</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Weekly review</h2>
<ol>
  <li>Pick 10 deals.</li>
  <li>For each, verify minimum fields and next step date.</li>
  <li>Close or downgrade deals with no progress path.</li>
</ol>
<h2>Independent exercise (5–10 min) — Stage criteria</h2>
<p>Write exit criteria for one stage (e.g., “Qualified” → “Proposal”).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>My deals have next steps with dates.</li>
  <li>Stages have exit criteria.</li>
  <li>Forecast is based on reality, not hope.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 24: Pipeline hygiene',
    emailBody: `<h1>Sales Productivity 30 — Day 24</h1>
<p>Keep your CRM real with minimum fields, exit criteria, and weekly reviews.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 25,
    title: 'Time Management for Sales – Protect Deep Work',
    content: `<h1>Time Management for Sales – Protect Deep Work</h1>
<p><em>Sales productivity comes from focus: research blocks, outreach blocks, admin batching.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Design a weekly schedule with 3 focused blocks.</li>
  <li>Batch admin work to reduce context switching.</li>
  <li>Use a simple “today list” aligned to pipeline impact.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Reactive calendars kill outbound consistency.</li>
  <li>Context switching increases mistakes and reduces quality.</li>
  <li>Focused work improves conversion and deal velocity.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>3 blocks</h3>
<ul>
  <li><strong>Prospecting block</strong>: outbound + follow-ups</li>
  <li><strong>Research block</strong>: account + stakeholder mapping</li>
  <li><strong>Pipeline block</strong>: CRM hygiene + next steps</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Weekly template</h2>
<ol>
  <li>Pick 3 recurring blocks (same days/times).</li>
  <li>List what is allowed in each block and what is banned.</li>
  <li>Schedule 1 admin batch slot per day.</li>
</ol>
<h2>Independent exercise (5–10 min) — Today list</h2>
<p>Write a 5-item “today list” tied to pipeline impact (book meeting, move stage, close risk).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I have protected focus blocks.</li>
  <li>I batch admin work.</li>
  <li>I can name the 1–2 actions that matter today.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 25: Time management',
    emailBody: `<h1>Sales Productivity 30 — Day 25</h1>
<p>Protect deep work with structured blocks and admin batching.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 26,
    title: 'Using AI in Sales – Speed With QA',
    content: `<h1>Using AI in Sales – Speed With QA</h1>
<p><em>AI can accelerate research and writing, but only with a QA habit.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Use AI to draft outbound and call recaps safely.</li>
  <li>Apply a QA checklist to avoid hallucinations and tone issues.</li>
  <li>Create 3 reusable AI prompt templates for sales tasks.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>AI saves time on first drafts and summaries.</li>
  <li>Without QA, errors damage trust.</li>
  <li>Templates keep quality consistent across the team.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>High-impact AI use cases</h3>
<ul>
  <li>Account research summary (with sources)</li>
  <li>Personalized email draft</li>
  <li>Meeting recap + next steps</li>
  <li>Objection-response brainstorm (then validate)</li>
</ul>
<h3>QA checklist (minimum)</h3>
<ul>
  <li>Facts/numbers verified</li>
  <li>Tone matches persona</li>
  <li>No confidential data leaked</li>
  <li>Clear CTA and next step</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — 3 prompt templates</h2>
<ol>
  <li>Create a research prompt (ask for sources + uncertainty).</li>
  <li>Create an outbound prompt (trigger + hypothesis + CTA).</li>
  <li>Create a recap prompt (summary + decisions + next steps).</li>
</ol>
<h2>Independent exercise (5–10 min) — QA routine</h2>
<p>Write your QA checklist as a one-minute routine you do before sending anything.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I have 3 reusable prompts.</li>
  <li>I verify AI drafts before sending.</li>
  <li>I protect customer/company data.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 26: AI in sales',
    emailBody: `<h1>Sales Productivity 30 — Day 26</h1>
<p>Use AI to accelerate research and writing, with a strict QA habit.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 27,
    title: 'Metrics – Leading Indicators That You Control',
    content: `<h1>Metrics – Leading Indicators That You Control</h1>
<p><em>Good metrics drive behavior. Focus on leading indicators, not vanity numbers.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Define 5 leading indicators you can control weekly.</li>
  <li>Build a simple dashboard (spreadsheet is fine).</li>
  <li>Run a weekly review and choose one experiment.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Lagging metrics tell you what happened; leading metrics guide what to do.</li>
  <li>Consistency beats intensity in sales.</li>
  <li>Experimenting prevents stagnation and improves conversion over time.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Examples of leading indicators</h3>
<ul>
  <li>New targeted accounts researched</li>
  <li>New discovery meetings booked</li>
  <li>Qualified opportunities created</li>
  <li>Deals with next step date set</li>
  <li>Follow-up recaps sent within 24 hours</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Dashboard v1</h2>
<ol>
  <li>Pick 5 indicators.</li>
  <li>Set a weekly target for each.</li>
  <li>Define one “if we miss” response (what changes next week).</li>
</ol>
<h2>Independent exercise (5–10 min) — One experiment</h2>
<p>Choose one experiment (new trigger, new opener, new sequence) and define success criteria.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>My dashboard is simple and consistent.</li>
  <li>I review weekly.</li>
  <li>I run experiments with clear criteria.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 27: Metrics',
    emailBody: `<h1>Sales Productivity 30 — Day 27</h1>
<p>Track leading indicators and run weekly experiments to improve results.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 28,
    title: 'Sales Playbook – Make Your Process Transferable',
    content: `<h1>Sales Playbook – Make Your Process Transferable</h1>
<p><em>A playbook reduces randomness. It’s a system others can follow.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Document your ICP, stages, and templates.</li>
  <li>Create a “minimum viable playbook” in one hour.</li>
  <li>Standardize what good looks like for discovery and follow-up.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Teams scale with documented decisions and minimum standards.</li>
  <li>A playbook improves onboarding and performance consistency.</li>
  <li>Documentation reveals gaps and enables iteration.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Minimum playbook sections</h3>
<ul>
  <li>ICP + disqualifiers</li>
  <li>Stage definitions + exit criteria</li>
  <li>Discovery agenda + note template</li>
  <li>Outbound email templates + sequence</li>
  <li>Objection map</li>
  <li>Proposal template</li>
  <li>MAP (Mutual Action Plan) template</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Playbook skeleton</h2>
<ol>
  <li>Create the section list above in a doc.</li>
  <li>Paste your best current templates (even if imperfect).</li>
  <li>Mark the 3 biggest gaps to improve next week.</li>
</ol>
<h2>Independent exercise (5–10 min) — Standard of quality</h2>
<p>Write 5 “non-negotiables” (e.g., every deal has next step date; every follow-up has owners and dates).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I have a playbook skeleton.</li>
  <li>Templates are reusable.</li>
  <li>Quality standards are explicit.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 28: Playbook',
    emailBody: `<h1>Sales Productivity 30 — Day 28</h1>
<p>Document your process so it becomes transferable and scalable.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 29,
    title: 'Capstone – Run the System for 7 Days',
    content: `<h1>Capstone – Run the System for 7 Days</h1>
<p><em>Execution week: focus blocks, pipeline hygiene, discovery, follow-up, and metrics.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Create a 7-day execution plan from your playbook.</li>
  <li>Measure leading indicators daily.</li>
  <li>Identify one bottleneck and fix it.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Systems work when executed consistently.</li>
  <li>Daily measurement prevents drift.</li>
  <li>Bottleneck fixes compound over time.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — 7-day plan</h2>
<ol>
  <li>Schedule 3 focus blocks for the week.</li>
  <li>Set daily targets for 2 leading indicators.</li>
  <li>Pick one deal to run a full MAP on.</li>
</ol>
<h2>Independent exercise (5–10 min) — Bottleneck log</h2>
<p>Write your biggest bottleneck (e.g., low discovery booking rate) and one experiment to address it.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I have a 7-day plan.</li>
  <li>I measure daily.</li>
  <li>I run one focused experiment.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 29: Capstone',
    emailBody: `<h1>Sales Productivity 30 — Day 29</h1>
<p>Run the system for a week: focus blocks, hygiene, follow-up, and metrics.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
  {
    day: 30,
    title: 'Continuous Improvement – Your Monthly Review',
    content: `<h1>Continuous Improvement – Your Monthly Review</h1>
<p><em>Sales productivity is compounding. Review, learn, and update your playbook.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Create a monthly review template.</li>
  <li>Identify what to stop, start, and continue.</li>
  <li>Update your playbook with one improvement per month.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>What gets reviewed improves; what gets ignored decays.</li>
  <li>Small monthly changes create major yearly gains.</li>
  <li>A playbook must evolve with your market and ICP.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Monthly review questions</h3>
<ul>
  <li>What worked best and why?</li>
  <li>Where did deals stall most often?</li>
  <li>Which stage leaked the most?</li>
  <li>Which template/script needs improvement?</li>
  <li>What will you change next month?</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — Review template</h2>
<ol>
  <li>Create a doc with the questions above.</li>
  <li>Add your 5 leading indicators and actual results.</li>
  <li>Write 3 actions for next month.</li>
</ol>
<h2>Independent exercise (5–10 min) — Playbook update</h2>
<p>Update one section of your playbook (outbound email, discovery agenda, objection map) based on what you learned.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I have a monthly review template.</li>
  <li>I track leading indicators.</li>
  <li>I update my playbook consistently.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 — Day 30: Monthly review',
    emailBody: `<h1>Sales Productivity 30 — Day 30</h1>
<p>Build a monthly review habit and keep improving your sales system.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`,
  },
];

function lessonIdForDay(day: number) {
  return `${COURSE_ID}_DAY_${String(day).padStart(2, '0')}`;
}

async function main() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';
  if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI');

  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID }).select('_id courseId language durationDays').lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);

  console.log(`✅ Course ${COURSE_ID} loaded (${APPLY ? 'APPLY' : 'DRY-RUN'})`);
  console.log(`- onlyMissingLessons: ${ONLY_MISSING_LESSONS}`);

  for (const entry of LESSONS_12_30) {
    const lessonId = lessonIdForDay(entry.day);
    const existing = await Lesson.findOne({ lessonId }).select('_id').lean();
    if (existing && ONLY_MISSING_LESSONS) continue;

    const emailBody = entry.emailBody.replace(/\{\{APP_URL\}\}/g, appUrl);

    if (APPLY) {
      await Lesson.findOneAndUpdate(
        { lessonId },
        {
          $set: {
            lessonId,
            courseId: course._id,
            dayNumber: entry.day,
            language: 'en',
            isActive: true,
            title: entry.title,
            content: entry.content,
            emailSubject: entry.emailSubject,
            emailBody,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ Lesson ${lessonId} upserted`);
    } else {
      console.log(`📝 Would upsert lesson ${lessonId}${existing ? ' (update)' : ' (create)'}`);
    }
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

