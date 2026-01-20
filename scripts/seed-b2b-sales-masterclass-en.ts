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
