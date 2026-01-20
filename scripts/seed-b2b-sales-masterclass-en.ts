/**
 * Seed B2B Sales 2026 Masterclass (English, first 3 lessons)
 *
 * Creates/updates the course with the initial 3 lessons and lesson-specific quizzes.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import {
  Brand,
  Course,
  Lesson,
  QuizQuestion,
  QuestionDifficulty,
} from '../app/lib/models';

const COURSE_ID = 'B2B_SALES_2026_30_EN';
const COURSE_NAME = 'B2B Sales 2026 Masterclass';
const COURSE_DESCRIPTION =
  '30-day, systems-first B2B sales training: from ICP and qualification through discovery, pipeline design, pricing and closing. 20–30 minutes per day with AI support and measurable deliverables.';

type LessonEntry = {
  day: number;
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
  quiz?: {
    questions: Array<{
      question: string;
      options: [string, string, string, string];
      correctIndex: number;
    }>;
  };
};

const lessons: LessonEntry[] = [
  {
    day: 1,
    title: 'What Modern B2B Sales Means in 2026',
    content: `<h1>What Modern B2B Sales Means in 2026</h1>
<p><em>Sales is decision support and risk reduction, not pitching. You’ll set the mindset for the rest of the course.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>State the modern B2B sales goal in one sentence.</li>
  <li>Spot 3 common myths and the replacement principles.</li>
  <li>Create a weekly mini-metrics sheet.</li>
  <li>Start your “Sales Reality Card”.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Wrong mental model = wrong activity = wrong conclusions.</li>
  <li>Buyers want faster, safer decisions—not a product list.</li>
  <li>Scale comes from disciplined research, documentation, and next-step control.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>A) What changed for 2026?</h3>
<ul>
  <li>Multi-threaded decisions: business owner, evaluator, finance, procurement, legal, IT/security.</li>
  <li>Sales must enable decisions, reduce risk, and lead next steps.</li>
</ul>
<h3>B) System vs. tactic</h3>
<ul>
  <li><strong>System</strong>: definitions, minimum fields, predefined steps, weekly measurement.</li>
  <li><strong>Tactic</strong>: a clever line or trick—can win a deal, but won’t scale.</li>
</ul>
<h3>C) 3 common myths & swaps</h3>
<ol>
  <li><strong>“More activity = more results.”</strong><br/>Swap: better targeting + fast qualification.</li>
  <li><strong>“We must pitch.”</strong><br/>Swap: discovery + decision-risk handling.</li>
  <li><strong>“CRM is admin.”</strong><br/>Swap: CRM is the map of reality; without it you can’t see conversion or cycle time.</li>
</ol>
<h3>D) Mental model</h3>
<ul>
  <li>Pick the right accounts.</li>
  <li>Do a fast yes/no qualification.</li>
  <li>After discovery, commit to a single next step.</li>
  <li>Keep the pipeline real.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad (tactic):</strong> “Hi, we grow your revenue—let’s talk 15 minutes.”<br/>Why bad: no ICP signal, no specific problem, no decision-linked next step.</p>
<p><strong>Good (system):</strong> “Most <em>[industry]</em> teams stall in two spots: weak qualification and fuzzy next steps. In 15 minutes, if we review your stage definitions and top 3 lost reasons, I can tell you where time leaks. Is next Tuesday 10:00 ok?”</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Create your “Sales Reality Card”.</li>
  <li>Write one sentence: “The goal of B2B sales is to …”.</li>
  <li>Write the 3 myths and the 3 swaps in your own words.</li>
  <li>Create a mini-metrics sheet: SQL, discovery, pipeline value, win rate (weekly).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Pick one closed deal (won/lost) and note: decision risk, where it stalled, what a clearer next step would have been.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>I can state the modern B2B sales goal in one sentence.</li>
  <li>I can name 3 myths and the swaps.</li>
  <li>I have a weekly mini-metrics sheet.</li>
  <li>I captured one lesson from a past deal.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>MEDDPICC: <a href="https://meddicc.com/meddpicc-sales-methodology-and-process" target="_blank" rel="noreferrer">https://meddicc.com/meddpicc-sales-methodology-and-process</a></li>
  <li>Gartner B2B buying: <a href="https://www.gartner.com/en/insights/sales" target="_blank" rel="noreferrer">https://www.gartner.com/en/insights/sales</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 1: Modern sales goal',
    emailBody: `<h1>B2B Sales 2026 – Day 1</h1>
<p>Sales is decision support and risk reduction. Create your Sales Reality Card and mini-metrics.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is the primary goal of modern B2B sales in this course?',
          options: [
            'Make as many calls and pitches as possible',
            'Support decisions and reduce risk with a clear next step',
            'Only negotiate price',
            'Fill the CRM as admin work',
          ],
          correctIndex: 1,
        },
        {
          question: 'What separates a system from a tactic?',
          options: [
            'A system is one good line; a tactic is a pipeline',
            'A system is definitions, steps, and measurement; a tactic is a short trick',
            'There is no difference',
            'A tactic is always better',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why is “more activity = more results” risky?',
          options: [
            'Because activity is expensive',
            'Because without ICP and qualification, more activity just creates noise',
            'Because activity lowers win rate by default',
            'Because activity ignores marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why isn’t pitching enough?',
          options: [
            'Pitches are too long',
            'Buyers want risk reduction and a clear next step, not product monologues',
            'Pitching is only for marketing',
            'Pitching hides price',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 2,
    title: 'The B2B Sales System Map',
    content: `<h1>The B2B Sales System Map</h1>
<p><em>Draw the end-to-end flow from sourcing to expansion and set shared stage definitions.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Map sourcing → qualification → discovery → proposal → negotiation → close → expansion.</li>
  <li>Define entry/exit criteria per stage.</li>
  <li>Create a one-page “Sales System Map”.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Shared language prevents confusion (lead, SQL, qualified discovery).</li>
  <li>Without definitions, the pipeline is opinion-based.</li>
  <li>This map is the base for measurement and automation.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Main blocks</h3>
<ul>
  <li><strong>Sourcing</strong>: lists, inbound, partners, events.</li>
  <li><strong>Qualification</strong>: fast yes/no, MEDDPICC-style questions.</li>
  <li><strong>Discovery</strong>: problem, impact, decision process, risk.</li>
  <li><strong>Proposal/Negotiation</strong>: decidable offer, pricing frame, objection handling.</li>
  <li><strong>Close/Expansion</strong>: decision, onboarding, cross/upsell.</li>
</ul>
<h3>Definitions</h3>
<ul>
  <li><strong>Lead</strong>: inbound or list contact with minimum data.</li>
  <li><strong>SQL</strong>: fits ICP + relevant problem + decision maker/gatekeeper reachable.</li>
  <li><strong>Qualified discovery</strong>: business pain, cost/impact, next step captured.</li>
</ul>
<h3>Measurement</h3>
<ul>
  <li>Stage conversion and stage-level cycle time.</li>
  <li>Win rate, pipeline coverage, coded lost reasons.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “Lead → Call → Proposal → Close” — no definitions, no exit criteria.</p>
<p><strong>Good:</strong> “Lead (min data) → SQL (ICP + pain + decision maker) → Discovery (pain, impact, next step) → Proposal (scope, price, risk) → Negotiation (objections, procurement list) → Close/Expansion.”</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Draw the 7 blocks (sourcing → expansion).</li>
  <li>Write 2–3 entry/exit criteria per block.</li>
  <li>Create a one-page Sales System Map (text + bullets).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Pick an active opportunity and mark which stage it’s stuck in and what is missing to move.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>7 blocks mapped.</li>
  <li>Entry/exit criteria per block.</li>
  <li>Sales System Map (one page) completed.</li>
  <li>One live deal diagnosed for missing criteria.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>HubSpot lifecycle vs pipeline: <a href="https://knowledge.hubspot.com/crm-setup/set-up-lifecycle-stages" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/crm-setup/set-up-lifecycle-stages</a></li>
  <li>Pipedrive pipeline basics: <a href="https://support.pipedrive.com/en/article/how-to-set-up-pipelines" target="_blank" rel="noreferrer">https://support.pipedrive.com/en/article/how-to-set-up-pipelines</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 2: Sales System Map',
    emailBody: `<h1>B2B Sales 2026 – Day 2</h1>
<p>Draw the end-to-end flow and stage definitions. Ship your one-page Sales System Map.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is the main purpose of the Sales System Map?',
          options: [
            'Decoration on the team wall',
            'Shared language and definitions for every step',
            'Just listing KPIs',
            'Operating without a CRM',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is a core element of the SQL definition?',
          options: [
            'Only having an email',
            'Fits ICP and has a relevant problem',
            'Has a LinkedIn profile',
            'Has a backlog task',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why is “Lead → Call → Proposal → Close” risky alone?',
          options: [
            'It is too long',
            'No entry/exit definitions, so the pipeline is opinion-based',
            'It has too many metrics',
            'It excludes marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'What should you measure per stage?',
          options: [
            'Only win rate',
            'Stage conversion and stage-level cycle time',
            'Only call count',
            'Only revenue',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 3,
    title: 'ICP 2026: Problem-First, Not Industry-First',
    content: `<h1>ICP 2026: Problem-First, Not Industry-First</h1>
<p><em>Define your ICP by problem space, not just industry or company size.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Create a problem-first ICP v1.</li>
  <li>List 3–5 “bad fit” signals.</li>
  <li>Write a short, testable ICP definition.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Wrong ICP = more activity, worse conversations.</li>
  <li>Problem-first ICP connects to pain and decision-making.</li>
  <li>Speeds qualification: you know when to say no.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Problem-first ICP elements</h3>
<ul>
  <li>Pain: the concrete operational or revenue problem.</li>
  <li>Trigger: what sparked the search (growth goal, churn, new market).</li>
  <li>Maturity: tools/processes already in place.</li>
  <li>Stakes: risk of not fixing it.</li>
</ul>
<h3>Bad-fit signals</h3>
<ul>
  <li>No pain owner.</li>
  <li>No budget or decision maker.</li>
  <li>“Curious” motivation with no clear trigger.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad ICP (industry-first):</strong> “Mid-market SaaS companies.”</p>
<p><strong>Good ICP (problem-first):</strong> “15–80 person B2B SaaS team, 15–30% churn, GTM team 3–6 people, sales cycle >90 days, seeking qualified pipeline growth.”</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Draft ICP v1 using the 4 elements (pain, trigger, maturity, stakes).</li>
  <li>Write 5 ICP test questions for qualification (e.g., “What triggered this project?”, “Who owns the pain?”).</li>
  <li>List 3–5 bad-fit signals.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Take one active lead and score it with your test questions: do you fit? If not, write how you will say “no” fast.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>ICP v1 (problem-first) done.</li>
  <li>Qualification test questions ready.</li>
  <li>Bad-fit signals listed.</li>
  <li>Applied the filter to one lead.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Gartner ICP guide: <a href="https://www.gartner.com/en/insights/sales" target="_blank" rel="noreferrer">https://www.gartner.com/en/insights/sales</a></li>
  <li>OpenView ICP example: <a href="https://openviewpartners.com/blog/ideal-customer-profile" target="_blank" rel="noreferrer">https://openviewpartners.com/blog/ideal-customer-profile</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 3: ICP 2026',
    emailBody: `<h1>B2B Sales 2026 – Day 3</h1>
<p>Write a problem-first ICP, list bad-fit signals, and create qualification test questions.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why is an industry-first ICP risky on its own?',
          options: [
            'It is too long',
            'It is not tied to a concrete problem, so outreach focus is poor',
            'It is too expensive',
            'It has no marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which item is NOT part of a problem-first ICP?',
          options: [
            'Pain/problem',
            'Trigger',
            'Maturity',
            'Number of LinkedIn posts',
          ],
          correctIndex: 3,
        },
        {
          question: 'Which is a bad-fit signal?',
          options: [
            'There is a pain owner',
            'No decision maker or budget',
            'There is a GTM team',
            'There is a trigger event',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is the key deliverable for today?',
          options: [
            'An industry list',
            'A problem-first ICP definition and 5 test questions',
            'A pitch deck',
            'A marketing campaign plan',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 4,
    title: 'Buyer Persona and the Decision Unit',
    content: `<h1>Buyer Persona and the Decision Unit</h1>
<p><em>Map who uses, who pays, who blocks, and who decides—so you don’t sell to a single person.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Identify the roles in the decision unit (user, champion, finance, procurement, legal/IT).</li>
  <li>Create one decision-unit map for an ICP.</li>
  <li>List 5 risks (who can block and how).</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Decisions are multi-threaded—if you rely on one champion, you stall.</li>
  <li>Early blocker mapping speeds negotiation.</li>
  <li>Persona clarity drives relevant messaging and next steps.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Roles</h3>
<ul>
  <li><strong>User</strong>: daily user, pain owner.</li>
  <li><strong>Champion</strong>: business sponsor.</li>
  <li><strong>Finance/Procurement</strong>: cost, contract, ROI.</li>
  <li><strong>Legal/IT/Security</strong>: compliance, data, access.</li>
</ul>
<h3>Blockers & signals</h3>
<ul>
  <li>No pain owner → “curiosity” project.</li>
  <li>Security/IT not involved → late-stage stop.</li>
  <li>Legal can’t see DPA/SLA → slip.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Only talking to the user; don’t know who signs; security ignored.</p>
<p><strong>Good:</strong> Champion + user + IT/security + finance listed, each with a risk note.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Pick an ICP and draw the decision unit (role + name if known).</li>
  <li>For each role, note 1–2 risks/info needs.</li>
  <li>Write 3 discovery questions to reveal who decides and who can block.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>On a live deal, fill the missing roles: who’s absent, how will you engage them?</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>Decision-unit map done.</li>
  <li>Risks per role listed.</li>
  <li>3 discovery questions ready.</li>
  <li>Applied to a live deal.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Gartner Buying Committee: <a href="https://www.gartner.com/en/insights/sales" target="_blank" rel="noreferrer">https://www.gartner.com/en/insights/sales</a></li>
  <li>Challenger Customer summary: <a href="https://www.challengerinc.com/resources/" target="_blank" rel="noreferrer">https://www.challengerinc.com/resources/</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 4: Decision Unit',
    emailBody: `<h1>B2B Sales 2026 – Day 4</h1>
<p>Map the decision unit: who uses, who decides, who blocks. Capture risks and discovery questions.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why is relying only on a champion risky?',
          options: [
            'Takes too long',
            'Decisions are multi-threaded; blockers surface late',
            'Champions always say no',
            'It removes the need for a CRM',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which role is cost/ROI focused?',
          options: ['User', 'Finance/Procurement', 'Legal', 'IT/Security'],
          correctIndex: 1,
        },
        {
          question: 'Benefit of early blocker mapping?',
          options: [
            'Fewer meetings',
            'Faster negotiation and less slip risk',
            'Higher price automatically',
            'No documentation',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is missing in a “bad” approach?',
          options: [
            'Pitch deck',
            'Decision-unit map and roles',
            'Email template',
            'Marketing list',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 5,
    title: 'Value Proposition: Measurable, Verifiable Claims',
    content: `<h1>Value Proposition: Measurable, Verifiable Claims</h1>
<p><em>Replace vague promises with a 3-sentence value and 5 proof points your buyer can verify.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Write a 3-sentence value statement.</li>
  <li>List 5 proof points (measurable/verifiable).</li>
  <li>Tie each to ICP pain.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Buyers decide on relevance and evidence.</li>
  <li>Measurable claims reduce risk and speed discovery.</li>
  <li>Without proof, value is just marketing copy.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>3-sentence value</h3>
<ol>
  <li>Who (ICP + role).</li>
  <li>Which pain/problem.</li>
  <li>What outcome/what’s at risk if they don’t act.</li>
</ol>
<h3>Proof points</h3>
<ul>
  <li>Numbers: % improvement, time saved, revenue impact.</li>
  <li>Examples: case study, benchmark.</li>
  <li>Source: link/doc the buyer can verify.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “We help you grow with AI.” — no ICP, no problem, no proof.</p>
<p><strong>Good:</strong> “For 15–80 person B2B SaaS teams with 15–30% churn and >90-day cycles, we target +25% qualified pipeline in 12 weeks; benchmark shows 2–3x faster qualification. Proof: case study, scorecard, reference.”</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write your 3-sentence value (who, pain, outcome/risk).</li>
  <li>Write 5 proof points (number/benchmark/link).</li>
  <li>Map each proof to an ICP pain.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Revise your last 3 outbound messages: add the value + 1 proof point.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>3-sentence value done.</li>
  <li>5 proof points done.</li>
  <li>Each proof tied to an ICP pain.</li>
  <li>Used in at least one outbound message.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Value proposition design: <a href="https://www.strategyzer.com/books/value-proposition-design" target="_blank" rel="noreferrer">https://www.strategyzer.com/books/value-proposition-design</a></li>
  <li>Social proof for sales: <a href="https://www.apollo.io/blog/social-proof-for-sales" target="_blank" rel="noreferrer">https://www.apollo.io/blog/social-proof-for-sales</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 5: Value + proof',
    emailBody: `<h1>B2B Sales 2026 – Day 5</h1>
<p>Write a 3-sentence value and 5 proof points, each tied to ICP pain.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why is “We help you grow with AI” weak?',
          options: [
            'Too long',
            'No ICP, no problem, no proof',
            'Too expensive',
            'Does not mention CRM',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is a required element of the 3-sentence value?',
          options: [
            'A slogan',
            'ICP + pain + outcome/risk',
            'A feature list',
            'A discount',
          ],
          correctIndex: 1,
        },
        {
          question: 'What makes a proof point credible?',
          options: [
            'Length',
            'Buyer can verify it (number/source/benchmark)',
            'Marketing tone',
            'Avoiding ICP',
          ],
          correctIndex: 1,
        },
        {
          question: 'What should you do with proof points?',
          options: [
            'Keep them separate from ICP',
            'Tie them to ICP pains',
            'Only put them on the website',
            'Use them only in the sales deck',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 6,
    title: 'Ideal Sales Process and Weekly Metrics',
    content: `<h1>Ideal Sales Process and Weekly Metrics</h1>
<p><em>Define lead/SQL/qualified discovery, set a weekly measurement sheet, and pick the bottleneck.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Define: lead, SQL, qualified discovery.</li>
  <li>Build a weekly sheet (stage conversion, cycle time, win rate, pipeline coverage).</li>
  <li>Select 3 metrics to improve.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Without measurement, the pipeline stays opinion-based.</li>
  <li>Weekly rhythm gives fast feedback on focus and quality.</li>
  <li>You surface the bottleneck (stage or quality).</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Definitions</h3>
<ul>
  <li><strong>Lead</strong>: minimum data + relevant context.</li>
  <li><strong>SQL</strong>: ICP + pain + reachable decision maker + trigger.</li>
  <li><strong>Qualified discovery</strong>: pain, impact, decision process, next step captured.</li>
</ul>
<h3>Measurement</h3>
<ul>
  <li>Stage conversion: Lead→SQL, SQL→Discovery, Discovery→Proposal, Proposal→Close.</li>
  <li>Stage cycle time.</li>
  <li>Win rate, pipeline coverage (3–4x).</li>
  <li>Lost reasons coded (top 5).</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Only counting calls; you can’t see where the pipeline breaks.</p>
<p><strong>Good:</strong> Weekly dashboard: stage conversions, cycle times, win rate, lost reasons; one bottleneck selected.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write the 3 definitions (lead, SQL, qualified discovery) in team language.</li>
  <li>Create a weekly sheet: stage conversions, cycle times, win rate, pipeline coverage, top 5 lost reasons.</li>
  <li>Pick the biggest bottleneck.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Pick one metric and write an action to improve it (e.g., tighten SQL definition, expand discovery questions).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>Lead/SQL/discovery definitions are written.</li>
  <li>Weekly measurement sheet exists.</li>
  <li>Bottleneck identified.</li>
  <li>An action to improve is written.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Stage-based reporting (HubSpot): <a href="https://knowledge.hubspot.com/reporting/create-reports" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/reporting/create-reports</a></li>
  <li>Win rate and coverage: <a href="https://pipedrive.readme.io/docs/deals-reporting" target="_blank" rel="noreferrer">https://pipedrive.readme.io/docs/deals-reporting</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 6: Metrics',
    emailBody: `<h1>B2B Sales 2026 – Day 6</h1>
<p>Define lead/SQL/discovery, build the weekly sheet, and pick your bottleneck.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is a required element of a qualified discovery?',
          options: [
            'A demo video',
            'Pain, impact, and next step captured',
            'A price list',
            'A LinkedIn post',
          ],
          correctIndex: 1,
        },
        {
          question: 'What does pipeline coverage 3–4x mean?',
          options: [
            '3–4x more meetings',
            'Pipeline value is 3–4x the revenue target',
            '3–4x more emails',
            '3–4x more demos',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why code lost reasons?',
          options: [
            'Decoration',
            'To see improvable trends (top 5)',
            'Legal requirement',
            'To send more emails',
          ],
          correctIndex: 1,
        },
        {
          question: 'Key output today?',
          options: [
            'Marketing campaign',
            'Weekly sheet + definitions + bottleneck',
            'New landing page',
            'New CRM',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 7,
    title: 'Lead Source Map for 2026',
    content: `<h1>Lead Source Map for 2026</h1>
<p><em>Pick 3 focus channels (outbound, inbound, partner/event/community) and run measurable experiments.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Select 3 primary channels aligned to your ICP.</li>
  <li>Create a channel brief: resourcing, metrics, 2-week test.</li>
  <li>Set a minimal pipeline goal per channel.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Scattered channels = noise and wasted time.</li>
  <li>Focus + experiment = fast learning and cutoff for weak channels.</li>
  <li>ICP-fit channel choice improves response rate.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Main channels</h3>
<ul>
  <li><strong>Outbound</strong>: list + message + follow-up.</li>
  <li><strong>Inbound</strong>: content, lead magnet, SEO/SEM.</li>
  <li><strong>Partner/event/community</strong>: co-webinar, meetup, professional group.</li>
</ul>
<h3>Channel brief</h3>
<ul>
  <li>ICP fit, resource (time/budget), cadence.</li>
  <li>Metrics: replies, meetings, SQL conversion.</li>
  <li>Cutoff rule: when you stop/adjust.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> 6 channels at once, no metrics, no cutoff.</p>
<p><strong>Good:</strong> 3 channels, each with a 2-week test, target: 15 replies / 5 meetings / 2 SQL.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write channel briefs for 3 channels (outbound, inbound, partner/event/community).</li>
  <li>Set 2-week goals: replies, meetings, SQL per channel.</li>
  <li>Define the cutoff rule (when you stop or change).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Pick one channel and write 3 concrete actions for the next 48 hours.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>3 channels selected.</li>
  <li>Channel brief + goal + cutoff ready.</li>
  <li>3 immediate actions for one channel.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Outbound best practices: <a href="https://www.apollo.io/blog/outbound-sales" target="_blank" rel="noreferrer">https://www.apollo.io/blog/outbound-sales</a></li>
  <li>Community-led growth: <a href="https://www.gainsight.com/guides/community-led-growth" target="_blank" rel="noreferrer">https://www.gainsight.com/guides/community-led-growth</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 7: Lead source map',
    emailBody: `<h1>B2B Sales 2026 – Day 7</h1>
<p>Select 3 focus channels, create briefs, set goals.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why limit the number of channels?',
          options: [
            'Fewer emails',
            'Without focus/experiments, learning collapses into noise',
            'Legal requirement',
            'No need for ICP',
          ],
          correctIndex: 1,
        },
        {
          question: 'What belongs in a channel brief?',
          options: [
            'Only a slogan',
            'ICP fit, resources, metrics, cutoff',
            'Only budget',
            'Only a pitch deck',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good 2-week test metric set?',
          options: [
            'Website visits',
            'Replies, meetings, SQL per channel',
            'Facebook likes',
            'LinkedIn followers',
          ],
          correctIndex: 1,
        },
        {
          question: 'When do you stop a channel?',
          options: [
            'Never',
            'When cutoff says it misses reply/meeting/SQL goals',
            'When pitch deck runs out',
            'When no new marketing campaign exists',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 8,
    title: 'LinkedIn and Sales Navigator Core Flow',
    content: `<h1>LinkedIn and Sales Navigator Core Flow</h1>
<p><em>Build saved searches and target lists with a weekly cadence instead of ad-hoc hunting.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Assemble a target company and persona list.</li>
  <li>Create one saved search (NAV or standard LinkedIn) and set a weekly review.</li>
  <li>Define the weekly cadence (refresh, add contacts).</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Ad-hoc browsing = incoherent lists, weak response.</li>
  <li>Saved search + list = repeatable, scalable sourcing.</li>
  <li>ICP-aligned filters cut bad leads.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Search logic</h3>
<ul>
  <li>Industry/size + keyword (pain/context) + geo.</li>
  <li>Persona: role, seniority, function.</li>
</ul>
<h3>Saving and cadence</h3>
<ul>
  <li>Saved search reviewed weekly.</li>
  <li>New contacts: daily/weekly limit (e.g., 15–20).</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> ICP-filtered company + persona list, refreshed weekly.</p>
<p><strong>Bad:</strong> Keyword-free browsing, dumping 200 contacts with no plan.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Set 1–2 saved searches (company + persona) based on ICP.</li>
  <li>Export/save 20 companies and 20 contacts (NAV or manual).</li>
  <li>Write your weekly cadence: how many new contacts, when to refresh.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Pick 5 companies from the list and note why they fit ICP (pain/trigger).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>Saved search created.</li>
  <li>20 company + 20 persona list v1 ready.</li>
  <li>Weekly cadence defined.</li>
  <li>5 ICP-fit notes captured.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Sales Navigator tips: <a href="https://www.linkedin.com/help/sales-navigator" target="_blank" rel="noreferrer">https://www.linkedin.com/help/sales-navigator</a></li>
  <li>Search operators: <a href="https://www.linkedin.com/help/linkedin/answer/a507663" target="_blank" rel="noreferrer">https://www.linkedin.com/help/linkedin/answer/a507663</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 8: LinkedIn/NAV flow',
    emailBody: `<h1>B2B Sales 2026 – Day 8</h1>
<p>Use saved searches to build target company/persona lists and set a weekly cadence.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Main benefit of a saved search?',
          options: [
            'Decoration',
            'Repeatable ICP-based list with refresh',
            'Fewer messages',
            'No need for ICP',
          ],
          correctIndex: 1,
        },
        {
          question: 'What should be in the weekly cadence?',
          options: [
            'Random contact count',
            'New contact limit + refresh timing',
            'Only pitch deck updates',
            'Only marketing campaigns',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why is keyword-free browsing bad?',
          options: [
            'It is slow',
            'It creates non-ICP lists with weak response',
            'It is expensive',
            'It cannot be exported',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why note ICP-fit for 5 companies?',
          options: [
            'Decoration',
            'Validate list quality and find pain/trigger signals',
            'Send more emails',
            'Avoid cadence',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 9,
    title: 'Enrichment and Data QA',
    content: `<h1>Enrichment and Data QA</h1>
<p><em>Define minimum data, cut noise, and improve personalization quality.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>List minimum fields (lead + account).</li>
  <li>Create an enrichment/QA checklist.</li>
  <li>Audit 15 leads and fix errors.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Noisy data = poor personalization and conversion.</li>
  <li>Enrichment gives context (risk/trigger).</li>
  <li>QA keeps lists usable.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Minimum fields</h3>
<ul>
  <li>Account: industry/problem trigger, size, country, tech.</li>
  <li>Lead: role, seniority, email/LinkedIn, relevant signal (post/project).</li>
</ul>
<h3>QA checklist</h3>
<ul>
  <li>Duplicates, missing key fields, bad domain.</li>
  <li>Relevant signal present (trigger)?</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> Account + lead fields filled, trigger noted, no duplicates.</p>
<p><strong>Bad:</strong> Only email, no role, no trigger, duplicate contact.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write the minimum field list (account + lead).</li>
  <li>Create the QA checklist (dupes, domain, trigger).</li>
  <li>Audit 15 leads and fix errors.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Write 3 rules for what you will not send (e.g., no role, no trigger, bouncy domain).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>Minimum fields defined.</li>
  <li>QA checklist ready.</li>
  <li>15 leads audited and fixed.</li>
  <li>3 exclusion rules written.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Data quality: <a href="https://www.hubspot.com/data-quality" target="_blank" rel="noreferrer">https://www.hubspot.com/data-quality</a></li>
  <li>Enrichment example: <a href="https://clearbit.com" target="_blank" rel="noreferrer">https://clearbit.com</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 9: Enrichment',
    emailBody: `<h1>B2B Sales 2026 – Day 9</h1>
<p>Define minimum data, create QA checklist, audit 15 leads.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why is a minimum field list critical?',
          options: [
            'Decoration',
            'It underpins personalization and relevance; without it outreach is noisy',
            'Legal requirement',
            'Fewer emails needed',
          ],
          correctIndex: 1,
        },
        {
          question: 'What belongs in the QA checklist?',
          options: [
            'Only the pitch deck',
            'Duplicates, bad domain, missing role/trigger',
            'Only web traffic',
            'Only marketing campaigns',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is the bad example?',
          options: [
            'Account + lead fields filled, trigger noted',
            'Only email, no role, no trigger, duplicate contact',
            'Trigger noted',
            'Seniority field captured',
          ],
          correctIndex: 1,
        },
        {
          question: 'Example exclusion rule?',
          options: [
            'If no role or trigger, do not send',
            'If too much data',
            'If a LinkedIn profile exists',
            'If ICP fit exists',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 10,
    title: 'AI-Powered Research: Company, Persona, Trigger',
    content: `<h1>AI-Powered Research: Company, Persona, Trigger</h1>
<p><em>Build a research prompt pack and a one-page account brief so every outreach has 3 facts + 1 trigger.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Create AI prompts (company, persona, trigger).</li>
  <li>Create a one-page account brief template.</li>
  <li>Fill 2 account briefs from your target list.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>AI speeds research, but structure drives accuracy.</li>
  <li>3 facts + 1 trigger = relevant, concise outreach.</li>
  <li>Briefs prevent duplication and errors across the team.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Prompt pack</h3>
<ul>
  <li>Company: product, market, growth, news.</li>
  <li>Persona: role, responsibilities, KPIs, pains.</li>
  <li>Trigger: funding, hiring, pricing change, new product/market.</li>
</ul>
<h3>Account brief</h3>
<ul>
  <li>One page: short company summary, 3 facts, 1 trigger, relevant pain, recommended next step.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> Brief with 3 facts (product, funding, new market), 1 trigger (hiring revops), recommended next step.</p>
<p><strong>Bad:</strong> Just paste the website, no trigger, no next step.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write 3 prompts (company, persona, trigger) and test on 1 target.</li>
  <li>Build the account brief template (1 page, 3 facts + 1 trigger + pain + next step).</li>
  <li>Fill 2 briefs from your list.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Draft one outreach opener from the 2 briefs (1–2 sentences, fact + trigger).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>3 research prompts ready.</li>
  <li>Account brief template ready.</li>
  <li>2 briefs filled.</li>
  <li>1 outreach opener written.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>OpenAI prompt guide: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
  <li>Account research checklist: <a href="https://www.alexbirkett.com/account-research" target="_blank" rel="noreferrer">https://www.alexbirkett.com/account-research</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 10: AI research',
    emailBody: `<h1>B2B Sales 2026 – Day 10</h1>
<p>Create AI prompts and an account brief template; test on two accounts.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why 3 facts + 1 trigger?',
          options: [
            'Decoration',
            'It’s the base for relevant, concise outreach',
            'To write longer emails',
            'Legal requirement',
          ],
          correctIndex: 1,
        },
        {
          question: 'What belongs in the account brief?',
          options: [
            'Only the website link',
            'Company short, 3 facts, 1 trigger, pain, next step',
            'Only the pitch deck',
            'Only the price list',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why a persona prompt?',
          options: [
            'To make the response longer',
            'To get role/KPI/pain relevance',
            'Legal necessity',
            'To avoid ICP',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is the bad approach?',
          options: [
            'Brief with 3 facts + trigger',
            'Website pasted without trigger or next step',
            'Recommending a next step',
            'Noting the persona role',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 11,
    title: 'Outbound Message: No Personalization, No Reply',
    content: `<h1>Outbound Message: No Personalization, No Reply</h1>
<p><em>Use the 3-part structure: relevance, problem, next step. Build 2 templates and 2 good/2 bad examples.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Write 2 outbound templates (and 2 good/2 bad examples).</li>
  <li>Each message has a relevance cue + problem + next step.</li>
  <li>Tie facts/triggers from the brief into the message.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>No personalization = low reply rate.</li>
  <li>A short, specific next step speeds decision.</li>
  <li>A relevance cue proves you paid attention.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>3 parts</h3>
<ul>
  <li><strong>Relevance cue</strong>: 1 fact/trigger from the brief.</li>
  <li><strong>Problem</strong>: ICP pain in one line.</li>
  <li><strong>Next step</strong>: one concrete step (15-min call, audit, checklist).</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “We help you grow with AI, let’s talk.”</p>
<p><strong>Good:</strong> “Noticed you’re hiring RevOps and cycles are 90+ days. Two leaks show up: weak qualification and fuzzy next steps. In 15 minutes I can show where stage definitions usually slip. Is next Tue 10:00 ok?”</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write 2 templates (A/B) using the 3 parts.</li>
  <li>Write 2 good and 2 bad examples for your market.</li>
  <li>Tie each to a fact/trigger from the brief.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Send 3 messages to your list; track replies.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>2 templates (A/B) written.</li>
  <li>2 good/2 bad examples ready.</li>
  <li>Every message has relevance + problem + next step.</li>
  <li>3 messages sent and noted.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Cold email best practices: <a href="https://beccahanderson.substack.com/p/cold-email-guide" target="_blank" rel="noreferrer">https://beccahanderson.substack.com/p/cold-email-guide</a></li>
  <li>Personalization examples: <a href="https://www.gong.io/blog/personalized-outreach" target="_blank" rel="noreferrer">https://www.gong.io/blog/personalized-outreach</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 11: Outbound message',
    emailBody: `<h1>B2B Sales 2026 – Day 11</h1>
<p>Write 2 outbound templates, with 2 good/2 bad examples, using relevance + problem + next step.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What are the 3 parts of a good outbound message?',
          options: [
            'Long intro, price, link',
            'Relevance cue, problem, concrete next step',
            'Marketing slogan, CTA, logo',
            'Feature list, CTA, price',
          ],
          correctIndex: 1,
        },
        {
          question: 'Purpose of the relevance cue?',
          options: [
            'Decoration',
            'Shows you paid attention (fact/trigger)',
            'Increase word count',
            'Replace ICP',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is the bad example?',
          options: [
            'Relevance cue + problem + 15-min specific step',
            '“We help you grow with AI, let’s talk.”',
            'Trigger mention',
            'Mentioning stage definitions',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why add a next step?',
          options: [
            'To make the email longer',
            'To speed decisions and make commitment clear',
            'To send more marketing',
            'To avoid ICP',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 12,
    title: 'List Cleaning and Lead Hygiene',
    content: `<h1>List Cleaning and Lead Hygiene</h1>
<p><em>Standardize statuses/sources, dedupe, and set DNC rules so the pipeline reflects reality.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Standardize lead statuses and sources.</li>
  <li>Set dedupe and do-not-contact rules.</li>
  <li>QA 50 leads and fix issues.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Dirty lists = bad reporting and bad experience.</li>
  <li>Unified statuses speed reporting and automation.</li>
  <li>DNC + dedupe reduces slip and spam risk.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Status example</h3>
<ul>
  <li>New, Working, Nurture, Qualified, Disqualified, DNC.</li>
</ul>
<h3>Rules</h3>
<ul>
  <li>Dedupe: email/domain + name.</li>
  <li>DNC: bounce/spam/legal request.</li>
  <li>Source codes: outbound, inbound, partner, event, referral.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> Status unified, duplicates flagged, DNC list maintained.</p>
<p><strong>Bad:</strong> Duplicates, mixed status names, no DNC.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Define lead statuses and source codes.</li>
  <li>Write dedupe and DNC rules.</li>
  <li>Review 50 leads; fix duplicates/status.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Set an automation or checklist for ongoing QA (weekly/biweekly).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>Status + source definitions done.</li>
  <li>Dedupe + DNC rules done.</li>
  <li>50 leads QA’d.</li>
  <li>QA cadence set.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>CRM hygiene guide: <a href="https://www.hubspot.com/crm-data-cleanup" target="_blank" rel="noreferrer">https://www.hubspot.com/crm-data-cleanup</a></li>
  <li>Duplicate management tips: <a href="https://www.pipedrive.com/en/blog/crm-data-cleaning" target="_blank" rel="noreferrer">https://www.pipedrive.com/en/blog/crm-data-cleaning</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 12: Lead hygiene',
    emailBody: `<h1>B2B Sales 2026 – Day 12</h1>
<p>Standardize statuses/sources, set dedupe + DNC rules, QA 50 leads.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Core goal of lead hygiene?',
          options: [
            'More marketing emails',
            'A real pipeline and accurate reporting',
            'Fewer statuses',
            'Higher spam rate',
          ],
          correctIndex: 1,
        },
        {
          question: 'Dedupe rule base?',
          options: [
            'Random',
            'Email/domain + name combo',
            'First name only',
            'Industry only',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why keep a DNC list?',
          options: [
            'Decoration',
            'Handle bounce/spam/legal requests; reduce risk',
            'Fewer campaigns',
            'More expensive software',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            'Unified status, duplicates flagged',
            'Duplicates, mixed status names, no DNC',
            'DNC list maintained',
            'QA cadence set',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 13,
    title: 'MQL vs SQL and the Qualification Gate',
    content: `<h1>MQL vs SQL and the Qualification Gate</h1>
<p><em>Decide fast: when to say no and when to open discovery.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Draw a clear line between MQL and SQL.</li>
  <li>Write a 5-question qualification gate.</li>
  <li>Create 3 fast “no” templates.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Bad leads waste time and hurt win rate.</li>
  <li>Fast “no” boosts focus and pipeline quality.</li>
  <li>Without a gate, the team works on opinion.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>MQL</h3>
<ul>
  <li>Marketing signal: download, signup, event.</li>
  <li>Not yet validated for ICP/problem.</li>
</ul>
<h3>SQL</h3>
<ul>
  <li>ICP + problem + reachable decision maker/gatekeeper.</li>
  <li>Trigger or pain validated.</li>
</ul>
<h3>Gate</h3>
<ul>
  <li>5 questions: ICP? pain? decision maker? trigger? timing?</li>
  <li>Yes = discovery; No = quick close or nurture.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Every signup is invited to discovery.</p>
<p><strong>Good:</strong> Only ICP + problem + decision maker → discovery.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write 5 gate questions.</li>
  <li>Write 3 polite, value-adding “no” templates.</li>
  <li>Mark which MQLs go to nurture.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Take 10 leads, apply the gate, note how many become SQL.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>MQL/SQL definitions set.</li>
  <li>5-question gate written.</li>
  <li>3 “no” templates ready.</li>
  <li>Applied to 10 leads and logged results.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>MQL vs SQL discussion: <a href="https://www.gartner.com/en/insights/sales" target="_blank" rel="noreferrer">https://www.gartner.com/en/insights/sales</a></li>
  <li>Lead scoring: <a href="https://knowledge.hubspot.com/contacts/create-scoring-properties" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/contacts/create-scoring-properties</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 13: MQL vs SQL',
    emailBody: `<h1>B2B Sales 2026 – Day 13</h1>
<p>Set the MQL/SQL line, write a 5-question gate, and 3 fast “no” templates.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Key element of an SQL?',
          options: [
            'Just a download',
            'ICP + problem + reachable decision maker/gatekeeper',
            'Only an event attendance',
            'Only web traffic',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why a fast “no”?',
          options: [
            'Less work',
            'Focus, better pipeline quality, time saved',
            'Bigger list',
            'Legal requirement',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            'Every signup gets discovery',
            'Only ICP + pain + decision maker goes to discovery',
            'Using “no” templates',
            'Looking for triggers',
          ],
          correctIndex: 0,
        },
        {
          question: 'What should the gate include?',
          options: [
            'Price list',
            'ICP, pain, decision maker, trigger, timing',
            'Pitch deck',
            'Marketing campaign',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 14,
    title: 'Qualification Framework: MEDDPICC (Simplified)',
    content: `<h1>Qualification Framework: MEDDPICC (Simplified)</h1>
<p><em>Create a practical question set to surface risk early.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Build an 8–10 question MEDDPICC-based list.</li>
  <li>Mark missing elements in 3 live deals.</li>
  <li>Prioritize next steps based on the gaps.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Missing economic buyer/metrics/next step causes slip.</li>
  <li>Early risk spotting shortens cycle.</li>
  <li>Every qualification ends with a next step.</li>
</ul>
<hr />
<h2>Explanation (simplified MEDDPICC)</h2>
<ul>
  <li>Metrics: what defines success?</li>
  <li>Economic buyer: who signs?</li>
  <li>Decision criteria/process: how they decide?</li>
  <li>Paper process: legal/procurement path.</li>
  <li>Identify pain: pain, trigger.</li>
  <li>Champion: internal owner.</li>
  <li>Competition/status quo: who/what you are compared to.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> 8 questions, gaps marked on each deal; next steps listed.</p>
<p><strong>Bad:</strong> No list, moving on “gut feel”.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write 8–10 questions for the elements above.</li>
  <li>On 3 live deals, mark what is missing.</li>
  <li>Write next steps for each gap (e.g., involve economic buyer, ask paper process).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Update CRM notes with missing elements and next steps.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>8–10 question list ready.</li>
  <li>Gaps marked on 3 deals.</li>
  <li>Next steps for each gap.</li>
  <li>Recorded in CRM.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>MEDDPICC details: <a href="https://meddicc.com/meddpicc-sales-methodology-and-process" target="_blank" rel="noreferrer">https://meddicc.com/meddpicc-sales-methodology-and-process</a></li>
  <li>Decision criteria tips: <a href="https://www.gong.io/blog/meddpicc" target="_blank" rel="noreferrer">https://www.gong.io/blog/meddpicc</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 14: MEDDPICC',
    emailBody: `<h1>B2B Sales 2026 – Day 14</h1>
<p>Create a MEDDPICC-based question list, mark gaps on 3 deals, assign next steps.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'One core MEDDPICC element?',
          options: [
            'Marketing budget',
            'Economic buyer (who signs)',
            'LinkedIn followers',
            'CSR program',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why a question list?',
          options: [
            'Longer meetings',
            'Early risk detection, clear next steps',
            'Decoration',
            'Fewer notes',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            'Gap marked for economic buyer',
            'No list, moving on gut feel',
            'Paper process logged',
            'Next step written',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which belongs to Metrics?',
          options: [
            'Who signs?',
            'What counts as success?',
            'What is the legal process?',
            'Who is the champion?',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 15,
    title: 'Discovery Call Structure (5 Blocks)',
    content: `<h1>Discovery Call Structure (5 Blocks)</h1>
<p><em>Write a 30-minute script with “no-go” questions and a mandatory next step.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Create a 5-block discovery script (30 minutes).</li>
  <li>List no-go questions (time-wasters) and alternatives.</li>
  <li>Lock a next step at every discovery end.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Without structure, discovery drifts and yields no decision input.</li>
  <li>No-go questions consume time and add little.</li>
  <li>No next step = stalled pipeline.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>5 blocks</h3>
<ol>
  <li>Intro + agenda + timebox.</li>
  <li>Pain/impact.</li>
  <li>Decision process + roles.</li>
  <li>Paper/security/legal risk.</li>
  <li>Summary + next step (time, owner).</li>
</ol>
<h3>No-go questions</h3>
<ul>
  <li>“What’s your budget?” (too early, no context).</li>
  <li>“When will you decide?” (if pain is unclear).</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> Agenda upfront, pain/impact, decision process, security questions, next step with time/owner.</p>
<p><strong>Bad:</strong> Small talk + pitch, no pain, no next step.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write a 30-minute discovery script with the 5 blocks.</li>
  <li>List no-go questions and better alternatives.</li>
  <li>Write a closing line with a next step (time + owner).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Update an upcoming discovery invite with agenda and expected outcome.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>5-block script ready.</li>
  <li>No-go questions + alternatives ready.</li>
  <li>Every script ends with a next step.</li>
  <li>Discovery invite updated with agenda.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Discovery best practices: <a href="https://www.gong.io/blog/discovery-call-questions" target="_blank" rel="noreferrer">https://www.gong.io/blog/discovery-call-questions</a></li>
  <li>Next step examples: <a href="https://www.saleshacker.com/discovery-call-templates" target="_blank" rel="noreferrer">https://www.saleshacker.com/discovery-call-templates</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 15: Discovery call',
    emailBody: `<h1>B2B Sales 2026 – Day 15</h1>
<p>Write a 30-minute discovery script, list no-go questions, and enforce next steps.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'One of the 5 blocks?',
          options: [
            'Small talk + pitch',
            'Pain/impact',
            'Only pricing',
            'Only marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why are no-go questions bad?',
          options: [
            'They are short',
            'They waste time and add no decision info',
            'They are expensive',
            'They are in another language',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why end with a next step?',
          options: [
            'Make the call longer',
            'Prevent stalls; set owner/time',
            'Send more emails',
            'Add small talk',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            'Agenda upfront, next step',
            'Small talk + pitch, no pain, no next step',
            'Security question asked',
            'Impact explored',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 16,
    title: 'AI Meeting Prep and Notes',
    content: `<h1>AI Meeting Prep and Notes</h1>
<p><em>Create a “meeting prep” and “meeting summary” prompt so you document consistently and capture next steps.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Write a meeting prep prompt (before).</li>
  <li>Write a meeting summary prompt (after).</li>
  <li>Fill one of each for an upcoming and a completed call.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Consistent notes = fast recall and better next steps.</li>
  <li>AI speeds summarizing but needs structure for accuracy.</li>
  <li>Post-call follow-up reduces slip risk.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Meeting prep prompt</h3>
<ul>
  <li>Input: account brief, goal, attendees.</li>
  <li>Output: 3 hypotheses/pains, 3 questions, 1 recommended next step.</li>
</ul>
<h3>Meeting summary prompt</h3>
<ul>
  <li>Input: raw notes.</li>
  <li>Output: decisions, risks, next step (time, owner).</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> AI summary with pain, impact, decision process, risks, and next step with date.</p>
<p><strong>Bad:</strong> Dumping the transcript with no next step.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write prep and summary prompts.</li>
  <li>Prep: fill for an upcoming call.</li>
  <li>Summary: fill for a completed call; include next step.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Paste the summary into CRM and set a reminder for the next step.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>Both prompts ready.</li>
  <li>Prep filled for one upcoming call.</li>
  <li>Summary filled for one completed call.</li>
  <li>Next step logged in CRM.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Meeting notes best practices: <a href="https://www.gong.io/blog/sales-call-notes/" target="_blank" rel="noreferrer">https://www.gong.io/blog/sales-call-notes/</a></li>
  <li>OpenAI prompt guide: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 16: Meeting prep + summary',
    emailBody: `<h1>B2B Sales 2026 – Day 16</h1>
<p>Write prep and summary prompts; fill them for one upcoming and one completed call; log the next step.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Prep prompt output?',
          options: [
            'Long transcript',
            '3 hypotheses/pains, 3 questions, 1 recommended next step',
            'Just a price list',
            'Just a pitch deck',
          ],
          correctIndex: 1,
        },
        {
          question: 'Goal of the summary prompt?',
          options: [
            'Copy transcript',
            'Capture decisions, risks, next step',
            'Make email longer',
            'Launch a marketing campaign',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            'Summary with next step and date',
            'Transcript pasted, no next step',
            'Risks listed',
            'Pain/impact summarized',
          ],
          correctIndex: 1,
        },
        {
          question: 'What do you do after the summary?',
          options: [
            'Nothing',
            'Put it in CRM and set a reminder for the next step',
            'Add to email list',
            'Delete it',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 17,
    title: 'Next Step and Commitment',
    content: `<h1>Next Step and Commitment</h1>
<p><em>Learn to request small, concrete commitments at every meeting end.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Write 5 next-step templates (time, owner, deliverable).</li>
  <li>Create a “commitment” checklist.</li>
  <li>Use it at your next meeting end.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Without commitment, deals stall.</li>
  <li>Small steps (share data, schedule follow-up) signal intent.</li>
  <li>Reduces “we’ll get back to you”.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Commitment types</h3>
<ul>
  <li>Time: next meeting date.</li>
  <li>Asset: data/test/access.</li>
  <li>Internal: bring decision maker/IT.</li>
</ul>
<h3>Template</h3>
<p>“Next step: [X], due: [date], owner: [person]. Can you confirm?”</p>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> “You’ll send 3 lost reasons by Friday; Monday 10:00 review; I’ll bring pipeline fixes.”</p>
<p><strong>Bad:</strong> “Let’s talk sometime.”</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write 5 next-step templates for different commitments.</li>
  <li>Create a checklist: time, owner, deliverable?</li>
  <li>Prepare to close your next meeting with a template.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Use the template at your next meeting end; log the response.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>5 templates ready.</li>
  <li>Checklist ready.</li>
  <li>Used once.</li>
  <li>Response logged.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Commitment techniques: <a href="https://www.saleshacker.com/sales-closing-techniques/" target="_blank" rel="noreferrer">https://www.saleshacker.com/sales-closing-techniques/</a></li>
  <li>Micro-commitments: <a href="https://www.gong.io/blog/closing-sales-techniques/" target="_blank" rel="noreferrer">https://www.gong.io/blog/closing-sales-techniques/</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 17: Commitment',
    emailBody: `<h1>B2B Sales 2026 – Day 17</h1>
<p>Write 5 next-step templates, a checklist, and use it at your next meeting end.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why ask for a small commitment?',
          options: [
            'Make the meeting longer',
            'Signal intent and prevent stalls',
            'Send more emails',
            'Marketing reasons',
          ],
          correctIndex: 1,
        },
        {
          question: 'Key element of a next-step template?',
          options: [
            'Vague “let’s talk sometime”',
            'Concrete task, due date, owner',
            'Only small talk',
            'Only price',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            '“Let’s talk sometime.”',
            '“You’ll send 3 lost reasons by Friday...”',
            'Scheduling a time',
            'Assigning an owner',
          ],
          correctIndex: 0,
        },
        {
          question: 'What does the checklist verify?',
          options: [
            'Logo present',
            'Time, owner, deliverable present',
            'Email length',
            'Emoji present',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 18,
    title: 'Nurture and Re-Engage',
    content: `<h1>Nurture and Re-Engage</h1>
<p><em>Build a simple 3-step nurture flow for “not now” leads.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Write a 3-step nurture flow (value, proof, offer).</li>
  <li>Segment: “not fit”, “not now”, “later”.</li>
  <li>Set a metric (reply, meeting, SQL).</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Long cycles: “not now” leads can come back.</li>
  <li>Value + proof + offer builds trust.</li>
  <li>Without measurement, you don’t learn nurture impact.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>3 steps</h3>
<ol>
  <li>Value: 1 useful asset/case study.</li>
  <li>Proof: number/benchmark/result.</li>
  <li>Offer: short call or audit.</li>
</ol>
<h3>Segmentation</h3>
<ul>
  <li>Not fit: close, no nurture.</li>
  <li>Not now: 3-step nurture.</li>
  <li>Later: reminder in 60–90 days.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> 3 emails: case study + benchmark + short audit offer.</p>
<p><strong>Bad:</strong> Monthly generic “we’re still here” email.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write 3 nurture messages (value, proof, offer).</li>
  <li>Segment 15 leads into the three buckets.</li>
  <li>Set a metric: reply/meeting/SQL.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Schedule the 3 messages (weekly/biweekly) and log in CRM.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>3 messages ready.</li>
  <li>15 leads segmented.</li>
  <li>Metric set.</li>
  <li>Cadence scheduled.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Nurture best practices: <a href="https://www.activecampaign.com/blog/lead-nurturing" target="_blank" rel="noreferrer">https://www.activecampaign.com/blog/lead-nurturing</a></li>
  <li>Follow-up stats: <a href="https://www.gong.io/blog/sales-follow-up" target="_blank" rel="noreferrer">https://www.gong.io/blog/sales-follow-up</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 18: Nurture',
    emailBody: `<h1>B2B Sales 2026 – Day 18</h1>
<p>Write a 3-step nurture flow, segment leads, set a metric, and schedule messages.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Correct order of the 3 steps?',
          options: [
            'Offer, proof, value',
            'Value, proof, offer',
            'Proof, offer, value',
            'Only offer',
          ],
          correctIndex: 1,
        },
        {
          question: 'When to skip nurture?',
          options: [
            'Not fit leads',
            'Not now leads',
            'Later leads',
            'Never',
          ],
          correctIndex: 0,
        },
        {
          question: 'Good example?',
          options: [
            'Monthly generic email',
            '3 emails: case study + benchmark + audit offer',
            'Only a marketing newsletter',
            'Only a price list',
          ],
          correctIndex: 1,
        },
        {
          question: 'What to measure in nurture?',
          options: [
            'Opens only',
            'Reply/meeting/SQL conversion',
            'Web traffic only',
            'Likes only',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 19,
    title: 'Why You Need a CRM (Excel Is Not Enough)',
    content: `<h1>Why You Need a CRM (Excel Is Not Enough)</h1>
<p><em>Spot the “switch signals” from spreadsheets to CRM, and define the minimum CRM setup for a real pipeline.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>List the switch signals (Excel → CRM).</li>
  <li>Define minimum fields (deal, contact, activity).</li>
  <li>Decide what to migrate vs. archive.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Excel has no activity/time/owner tracking.</li>
  <li>No stage or cycle reporting = opinion-based forecast.</li>
  <li>CRM hygiene → real pipeline, better decisions.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Excel failure signals</h3>
<ul>
  <li>Duplicates, version chaos.</li>
  <li>No activity timeline, no owner.</li>
  <li>No stage conversion or cycle-time view.</li>
</ul>
<h3>CRM minimum</h3>
<ul>
  <li>Deal: value, stage, source, probability (optional), next step, owner.</li>
  <li>Contact: role, email/phone/LinkedIn, decision maker?</li>
  <li>Activity: date, type, note, next step.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> Every deal in CRM has next step + owner + date.</p>
<p><strong>Bad:</strong> Multiple Excel versions, no activities, no owner.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write 5 switch signals (when you move to CRM).</li>
  <li>Write the minimum field list (deal/contact/activity).</li>
  <li>Decide what to migrate and what to archive.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Take 10 live deals; move them into a CRM-like table with the minimum fields.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>5 switch signals ready.</li>
  <li>Minimum fields defined.</li>
  <li>10 deals moved into CRM structure.</li>
  <li>Each deal has next step + owner.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>CRM hygiene: <a href="https://www.pipedrive.com/en/blog/crm-data-cleaning" target="_blank" rel="noreferrer">https://www.pipedrive.com/en/blog/crm-data-cleaning</a></li>
  <li>Stage reporting basics: <a href="https://knowledge.hubspot.com/reporting/create-reports" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/reporting/create-reports</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 19: Why CRM',
    emailBody: `<h1>B2B Sales 2026 – Day 19</h1>
<p>List your switch signals, define minimum fields, and move 10 deals into a CRM structure.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why does Excel break at scale?',
          options: [
            'Too colorful',
            'No activity/time/owner tracking; version chaos',
            'Too expensive',
            'Cannot calculate',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is part of the minimum deal fields?',
          options: [
            'Only name and price',
            'Value, stage, source, next step, owner',
            'Only email',
            'Only notes',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good example?',
          options: [
            'Excel with multiple versions, no owner',
            'CRM with next step + owner per deal',
            'Only counting calls',
            'Just a marketing list',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is a switch signal?',
          options: [
            'Only 1 deal exists',
            'Duplicates, no owner, no stage reporting',
            'No email',
            'Too many icons',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 20,
    title: 'Pipeline Design: Stage Definitions',
    content: `<h1>Pipeline Design: Stage Definitions</h1>
<p><em>Write entry/exit criteria and required fields per stage so your pipeline is not opinion-based.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Create stage list with entry/exit criteria.</li>
  <li>Define required fields per stage.</li>
  <li>Publish a one-page pipeline checklist.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Without definitions, stage meaning is person-dependent.</li>
  <li>Without fields, no reporting/automation.</li>
  <li>Unified forecast and faster risk signaling.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Entry/exit</h3>
<ul>
  <li>Entry: what must be true to enter (e.g., ICP + pain + decision maker).</li>
  <li>Exit: proof of progression (e.g., decision process known, paper process started).</li>
</ul>
<h3>Required fields</h3>
<ul>
  <li>Next step + date + owner.</li>
  <li>Source, value, probability (optional), lost reason (if dropped).</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> Each stage has entry/exit criteria + required fields.</p>
<p><strong>Bad:</strong> “I put it here after a call if I feel like it.”</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>List stages (Lead, SQL, Discovery, Proposal, Negotiation, Close).</li>
  <li>Write entry/exit for each.</li>
  <li>List required fields.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Fill required fields on 5 live deals; fix gaps.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>Stage definitions done.</li>
  <li>Entry/exit defined.</li>
  <li>Required fields listed.</li>
  <li>Applied to 5 deals.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Pipeline design tips: <a href="https://www.gong.io/blog/sales-pipeline-stages/" target="_blank" rel="noreferrer">https://www.gong.io/blog/sales-pipeline-stages/</a></li>
  <li>Stage conversion reporting: <a href="https://knowledge.hubspot.com/reporting/create-reports" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/reporting/create-reports</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 20: Pipeline design',
    emailBody: `<h1>B2B Sales 2026 – Day 20</h1>
<p>Define entry/exit criteria and required fields per stage; apply to 5 deals.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why have entry/exit criteria?',
          options: [
            'Decoration',
            'Make stage meaning consistent and measurable',
            'Lengthen the CRM',
            'Send more emails',
          ],
          correctIndex: 1,
        },
        {
          question: 'Purpose of required fields?',
          options: [
            'Design',
            'Foundation for reporting and automation',
            'Marketing',
            'No purpose',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            '“After a call I put it here if I feel like it.”',
            'Entry: ICP+pain; Exit: decision process known',
            'Next step and owner captured',
            'Source filled',
          ],
          correctIndex: 0,
        },
        {
          question: 'What should every deal have?',
          options: [
            'Emoji',
            'Next step + date + owner',
            'Only value',
            'Only notes',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 21,
    title: 'Pipedrive: Strengths and When to Choose It',
    content: `<h1>Pipedrive: Strengths and When to Choose It</h1>
<p><em>Know when Pipedrive is the right choice and how to set up a minimal pipeline.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>List Pipedrive strengths and limits.</li>
  <li>Set up a minimal pipeline and required fields.</li>
  <li>Write a decision criterion: when Pipedrive vs. alternatives.</li>
</ul>
<hr />
<h2>Why It Matters</h2>
<ul>
  <li>Wrong tool wastes time and money.</li>
  <li>Pipedrive excels at fast pipeline/activity; weaker at deep marketing automation.</li>
  <li>Minimal setup accelerates launch.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Strengths</h3>
<ul>
  <li>Fast pipeline + activity handling.</li>
  <li>Simple automations, easy onboarding.</li>
  <li>Clear UI, good mobile app.</li>
</ul>
<h3>Limits</h3>
<ul>
  <li>Marketing automation is limited.</li>
  <li>Complex multi-object reporting is weaker.</li>
</ul>
<h3>Minimal setup</h3>
<ul>
  <li>Pipeline stages + required fields (source, next step, value).</li>
  <li>Activity types, reminders.</li>
  <li>Basic automation: new deal → next-step reminder.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> Stages + required fields set, activities/reminders running, simple report.</p>
<p><strong>Bad:</strong> Choosing Pipedrive while needing complex marketing automation.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write decision criteria: when Pipedrive, when HubSpot/other.</li>
  <li>Set a pipeline with 5–6 stages + required fields.</li>
  <li>Create a basic automation (new deal → next-step reminder).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Move 5 deals into a Pipedrive sandbox; fill fields; set reminders.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>Decision criteria ready.</li>
  <li>Pipeline + required fields set.</li>
  <li>Basic automation running.</li>
  <li>5 deals populated.</li>
</ul>
<hr />
<h2>Optional Deep Dive</h2>
<ul>
  <li>Pipedrive quick start: <a href="https://support.pipedrive.com/en/article/how-to-set-up-pipelines" target="_blank" rel="noreferrer">https://support.pipedrive.com/en/article/how-to-set-up-pipelines</a></li>
  <li>Automations: <a href="https://support.pipedrive.com/en/article/workflow-automation" target="_blank" rel="noreferrer">https://support.pipedrive.com/en/article/workflow-automation</a></li>
</ul>`,
    emailSubject: 'B2B Sales 2026 – Day 21: Pipedrive',
    emailBody: `<h1>B2B Sales 2026 – Day 21</h1>
<p>Decide when to use Pipedrive, set a minimal pipeline and required fields.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is Pipedrive strong at?',
          options: [
            'Complex marketing automation',
            'Fast pipeline and activity handling',
            'ERP',
            'HR',
          ],
          correctIndex: 1,
        },
        {
          question: 'Minimal setup includes:',
          options: [
            'Logo only',
            'Pipeline stages + required fields + activity reminder',
            'Only price list',
            'Only email template',
          ],
          correctIndex: 1,
        },
        {
          question: 'When is Pipedrive not ideal?',
          options: [
            'When you want fast pipeline tracking',
            'When you need complex marketing automation/lifecycle',
            'When you need a mobile app',
            'When you want activity reminders',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good example?',
          options: [
            'Decision criteria written, pipeline set, 5 deals populated',
            'Choosing a tool with no criteria',
            'No reminders set',
            'No required fields',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
];

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || 'amanoba',
  });

  const brand =
    (await Brand.findOne({ slug: 'amanoba' })) ||
    (await Brand.findOne().sort({ createdAt: 1 }));
  if (!brand) throw new Error('No brand found');

  const course = await Course.findOneAndUpdate(
    { courseId: COURSE_ID },
    {
      courseId: COURSE_ID,
      name: COURSE_NAME,
      description: COURSE_DESCRIPTION,
      language: 'en',
      durationDays: 30,
      isActive: true,
      requiresPremium: false,
      pointsConfig: {
        completionPoints: 500,
        lessonPoints: 25,
        perfectCourseBonus: 300,
      },
      xpConfig: {
        completionXP: 500,
        lessonXP: 25,
      },
      metadata: {
        category: 'B2B Sales',
        difficulty: 'intermediate',
        tags: ['b2b', 'sales', 'pipeline', 'ai'],
      },
      brandId: brand._id,
    },
    { upsert: true, new: true }
  );

  for (const entry of lessons) {
    const lessonId = `${COURSE_ID}_DAY_${entry.day}`;
    const lessonDoc = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        lessonId,
        courseId: course._id,
        dayNumber: entry.day,
        language: 'en',
        title: entry.title,
        content: entry.content,
        emailSubject: entry.emailSubject,
        emailBody: entry.emailBody,
        quizConfig: {
          enabled: true,
          successThreshold: 80,
          questionCount: entry.quiz?.questions.length || 4,
          poolSize: entry.quiz?.questions.length || 4,
          required: true,
        },
        pointsReward: 25,
        xpReward: 25,
        isActive: true,
        displayOrder: entry.day,
      },
      { upsert: true, new: true }
    );

    if (entry.quiz) {
      await QuizQuestion.deleteMany({ lessonId });
      await QuizQuestion.insertMany(
        entry.quiz.questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific',
          lessonId,
          courseId: course._id,
          isCourseSpecific: true,
          showCount: 0,
          correctCount: 0,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }))
      );
    }
  }

  await mongoose.disconnect();
  // eslint-disable-next-line no-console
  console.log('Seeded B2B Sales 2026 Masterclass (EN) with first 3 lessons.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
