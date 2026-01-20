/**
 * Seed "The Playbook 2026 – Masterclass for Designers" (English, first 3 lessons)
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

const COURSE_ID = 'PLAYBOOK_2026_30_EN';
const COURSE_NAME = 'The Playbook 2026 – Masterclass for Designers';
const COURSE_DESCRIPTION =
  '30-day, production-grade design playbook build. Visual language, semantics, layout, tokens, components, governance, capstone playbook. 20–30 min per day with tangible artifacts.';

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
    title: 'Why Visual Language Beats Style',
    content: `<h1>Why Visual Language Beats Style</h1>
<p><em>See why “style” doesn’t scale and a visual language gives a decision system.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>State the difference between style and visual language in one sentence.</li>
  <li>Name 3 consequences of not having a visual language.</li>
  <li>Write a one-line Visual Intent Statement for your product.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Style is opinion; visual language is rule-based and scalable.</li>
  <li>Teams need documented, transferable decisions.</li>
  <li>Visual chaos erodes credibility and increases support cost.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Style</h3>
<ul>
  <li>Subjective, person-dependent.</li>
  <li>Undocumented, not measurable.</li>
  <li>Breaks when new people join.</li>
</ul>
<h3>Visual Language</h3>
<ul>
  <li>Rules: color, type, shape, motion, rhythm.</li>
  <li>Intent: what the product should convey (tone, weight, density).</li>
  <li>Decision system: same problem → same answer.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “Make it more modern, add more gradients.” – opinion only.</p>
<p><strong>Good:</strong> “Primary CTA: text #111827 on #FAB908, 12x16 padding, no other CTA may use yellow.” – rule, not taste.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write: “Our visual language exists to …” (1 sentence).</li>
  <li>List 3 decisions your team makes (CTA, card, empty state) and mark: rule or taste?</li>
  <li>Draft a Visual Intent Statement (voice, tone, density, boldness, contrast).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Pick one screen, mark 3 elements driven by taste today, rewrite each as a rule.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>I can explain style vs visual language.</li>
  <li>I have a one-line Visual Intent Statement.</li>
  <li>I rewrote at least 3 decisions as rules.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Airbnb Design Language: <a href="https://airbnb.design/building-a-visual-language/" target="_blank" rel="noreferrer">https://airbnb.design/building-a-visual-language/</a></li>
  <li>Design Tokens W3C draft: <a href="https://design-tokens.github.io/community-group/format/" target="_blank" rel="noreferrer">https://design-tokens.github.io/community-group/format/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 1: Visual language > style',
    emailBody: `<h1>Playbook 2026 – Day 1</h1>
<p>Learn why style doesn’t scale and write your Visual Intent Statement.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What’s the key difference between style and visual language?',
          options: [
            'Style is rule-based, visual language is opinion',
            'Style is subjective; visual language is rule-based and transferable',
            'They are the same',
            'Visual language is only about colors',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why doesn’t style scale?',
          options: [
            'It is always documented',
            'It is person-dependent and not measurable',
            'It is too cheap',
            'It is always coded',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is a good visual language rule?',
          options: [
            '“Make it pretty.”',
            '“CTA: #FAB908 background, #111827 text, 12x16 padding, no other CTA uses yellow.”',
            '“Use more gradients.”',
            '“Use a modern font.”',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is a Visual Intent Statement for?',
          options: [
            'A decorative slogan',
            'Tone/voice/density in one sentence',
            'An ad copy',
            'A price list',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 2,
    title: 'From Taste to System: Scaling Decisions',
    content: `<h1>From Taste to System: Scaling Decisions</h1>
<p><em>Turn subjective calls into explicit rules: Rule → Pattern → Doc.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Write 3 design decisions as rules.</li>
  <li>Apply the Rule → Pattern → Doc chain.</li>
  <li>Create a Playbook outline for your product.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Undocumented decisions get replayed.</li>
  <li>Systematic decisions speed dev and reduce defects.</li>
  <li>Without a playbook, quality variance explodes.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Rule → Pattern → Doc</h3>
<ul>
  <li>Rule: one-line decision (e.g., “Primary CTA: #FAB908 bg, #111827 text, 12x16 padding, no other CTA uses yellow.”).</li>
  <li>Pattern: visual example (good/bad, states).</li>
  <li>Doc: where it lives (Figma library, Notion page, repo).</li>
</ul>
<h3>Playbook Outline v1</h3>
<ul>
  <li>Intent & Voice</li>
  <li>Semantics (color, type, shape, motion, feedback)</li>
  <li>Layout & Space</li>
  <li>Components & Tokens</li>
  <li>Governance (change, review, versioning)</li>
  <li>Capstone & Examples</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “If it looks nice, ship it.”</p>
<p><strong>Good:</strong> “Primary CTA: rule + pattern + doc link; no other CTA uses yellow.”</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write 3 Rules for your product (CTA, card, form).</li>
  <li>Attach Pattern notes (good/bad, states).</li>
  <li>Add Doc location (Figma/Notion/repo) for each.</li>
  <li>Draft your Playbook outline with the 6 sections.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Document one Rule in your real system (Figma/Notion), share with one developer, and ask for feedback.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>3 decisions rewritten as Rule → Pattern → Doc.</li>
  <li>Playbook outline exists.</li>
  <li>One rule published to the team.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Polaris (Shopify): <a href="https://polaris.shopify.com" target="_blank" rel="noreferrer">https://polaris.shopify.com</a></li>
  <li>Atlassian Design System: <a href="https://atlassian.design" target="_blank" rel="noreferrer">https://atlassian.design</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 2: From taste to system',
    emailBody: `<h1>Playbook 2026 – Day 2</h1>
<p>Turn three decisions into Rule → Pattern → Doc and outline your Playbook.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is Rule → Pattern → Doc?',
          options: [
            'Opinion → picture → nothing',
            'Rule → visual example → where it lives',
            'Only collecting images',
            'Marketing slogans',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why document rules?',
          options: [
            'For decoration',
            'To make them transferable, repeatable, measurable',
            'To hide them',
            'To prolong projects',
          ],
          correctIndex: 1,
        },
        {
          question: 'What goes into the Playbook outline?',
          options: [
            'Only logos',
            'Intent, semantics, layout, components/tokens, governance, examples',
            'Only price list',
            'Only moodboard',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is the bad example?',
          options: [
            '“If it looks nice, ship it.”',
            '“Primary CTA: rule + pattern + doc link.”',
            '“CTA yellow, 12x16 padding, linked to Figma component.”',
            '“No other CTA uses yellow.”',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 3,
    title: 'Anatomy of the Design Playbook',
    content: `<h1>Anatomy of the Design Playbook</h1>
<p><em>Map the required sections so every decision has a home.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Know the 6 core sections of the Playbook.</li>
  <li>Assign owners and update cadence.</li>
  <li>Create a table of contents for your Playbook.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Without structure, rules get lost.</li>
  <li>Without cadence, the system rots.</li>
  <li>Without ownership, no accountability.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>6 Core Sections</h3>
<ul>
  <li>Intent & Voice</li>
  <li>Semantics (color, type, shape, motion, feedback)</li>
  <li>Layout & Space (grid, spacing, density, responsiveness)</li>
  <li>Components & Tokens (architecture, states, cross-platform)</li>
  <li>Governance (change, review workflow, versioning)</li>
  <li>Capstone & Examples (good/bad, case studies)</li>
</ul>
<h3>Cadence</h3>
<ul>
  <li>Weekly/biweekly review for components.</li>
  <li>Quarterly audit for semantic maps.</li>
  <li>Release notes for every change.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Rules scattered in Slack and Figma comments.</p>
<p><strong>Good:</strong> TOC + owner + cadence + doc link.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Build a Playbook TOC with the 6 sections.</li>
  <li>Assign an owner and cadence per section.</li>
  <li>Set a versioning rule (v0.1, v0.2...).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Create a Release Notes template (change, date, owner, impact).</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>TOC with 6 sections exists.</li>
  <li>Owner and cadence assigned per section.</li>
  <li>Versioning scheme exists.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Lightning Design System: <a href="https://www.lightningdesignsystem.com" target="_blank" rel="noreferrer">https://www.lightningdesignsystem.com</a></li>
  <li>Material 3 guidance: <a href="https://m3.material.io" target="_blank" rel="noreferrer">https://m3.material.io</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 3: Playbook anatomy',
    emailBody: `<h1>Playbook 2026 – Day 3</h1>
<p>Assemble the Playbook sections, assign owners, and set update cadence.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why set an update cadence?',
          options: [
            'Decoration',
            'Prevent rot and assign ownership',
            'Make docs longer',
            'Avoid usage',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is part of the 6 core sections?',
          options: [
            'Capstone & Examples',
            'Marketing campaigns',
            'HR handbook',
            'Sales funnel',
          ],
          correctIndex: 0,
        },
        {
          question: 'What is a good example?',
          options: [
            'Rules scattered in Slack',
            'TOC + owner + cadence + doc link',
            'Only pictures on a board',
            'Only a price list',
          ],
          correctIndex: 1,
        },
        {
          question: 'What should a Release Notes template include?',
          options: [
            'Change, date, owner, impact',
            'Only logos',
            'Only date',
            'Only author name',
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
        category: 'design',
        difficulty: 'intermediate',
        tags: ['design', 'system', 'playbook', 'tokens'],
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
  console.log('Seeded The Playbook 2026 (EN) with first 3 lessons.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
