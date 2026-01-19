/**
 * Seed AI 30-Day Course (English, first 5 lessons)
 *
 * Creates/updates the AI_30_DAY_EN course with lessons 1–5.
 * Lessons follow the standard structure: goal, why, explanation,
 * examples, guided/independent exercises, self-check, optional links.
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
  QuestionDifficulty
} from '../app/lib/models';

const COURSE_ID = 'AI_30_DAY_EN';
const COURSE_NAME = '30-Day AI Catch-Up Program (EN)';
const COURSE_DESCRIPTION =
  '30-day practical AI program for beginners and late adopters: short, focused lessons with concrete examples, guided and independent exercises, and QA habits to make AI useful and safe in everyday work.';

type LessonEntry = {
  day: number;
  title: string;
  content: string;
  emailSubject?: string;
  emailBody?: string;
};

const lessonPlan: LessonEntry[] = [
  {
    day: 1,
    title: 'What AI is (and what it is not)',
    content: `<h1>What AI is (and what it is not)</h1>
<p><em>Tool, not magic</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>See AI as a tool that needs clear input and QA.</li>
<li>Spot risky use cases.</li>
<li>Draft your AI use map.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI doesn’t know your intent; it reads text only.</li>
<li>You own decisions and QA; AI does not accept liability.</li>
<li>Good input → better output; iteration is normal.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>AI suggests; you review.</li>
<li>No company context unless you provide it.</li>
<li>Guardrails: anonymize sensitive data; avoid critical decisions without human review.</li>
</ul>
<hr />
<h2>Where it helps / where it doesn’t</h2>
<ul>
<li><strong>Helps</strong>: outlines, summaries, ideas, first drafts.</li>
<li><strong>Does not replace</strong>: legal/medical advice, password handling, confidential data processing.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min) — AI use map</h2>
<ol>
<li>List 3 tasks to accelerate with AI.</li>
<li>For each: what you expect, what risk you see.</li>
<li>Note if sensitive data appears; plan to anonymize.</li>
</ol>
<h2>Independent exercise (5–10 min) — Do-not-use list</h2>
<p>List 5 tasks you won’t give to AI (passwords, critical decisions, sensitive clients) and what you’ll do instead (human review, manual step).</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>AI use map written.</li>
<li>Do-not-use list created.</li>
<li>You can explain why QA is mandatory.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>OpenAI Usage Policies: <a href="https://openai.com/policies/usage-policies" target="_blank" rel="noreferrer">https://openai.com/policies/usage-policies</a></li>
<li>One Useful Thing (Ethan Mollick): <a href="https://www.oneusefulthing.org" target="_blank" rel="noreferrer">https://www.oneusefulthing.org</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 1: What AI is (and is not)',
    emailBody: `<h1>AI 30-Day – Day 1</h1>
<h2>What AI is (and is not)</h2>
<p>Today you map safe AI uses and create a do-not-use list.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 2,
    title: 'The 4 parts of a good prompt',
    content: `<h1>The 4 parts of a good prompt</h1>
<p><em>Direct the output with clarity</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Use the 4-part structure.</li>
<li>Write 2 prompts that are clear and cite-ready.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Ambiguity = random answers.</li>
<li>Structure makes AI responses usable and consistent.</li>
</ul>
<hr />
<h2>Explanation: 4 parts</h2>
<ol>
<li>Goal — what you want.</li>
<li>Context — background needed.</li>
<li>Format — bullet/table/short paragraph.</li>
<li>Style — tone (formal, friendly, technical).</li>
</ol>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Weak</strong>: “Write an email.”</li>
<li><strong>Good</strong>: “Write a short, polite email to a customer who complained yesterday. Tone: empathetic, professional. Max 4 sentences.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Write 2 prompts with all 4 parts.</li>
<li>Generate outputs; check if they match intent.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Refine one prompt to be more specific (add data, format, constraints).</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Both prompts include goal, context, format, style.</li>
<li>Outputs match your intent.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>OpenAI Prompt Guide: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 2: The 4 parts of a prompt',
    emailBody: `<h1>AI 30-Day – Day 2</h1>
<h2>The 4 parts of a prompt</h2>
<p>Today you’ll write 2 structured prompts and test them.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 3,
    title: 'Iterate: from draft to great output',
    content: `<h1>Iterate: from draft to great output</h1>
<p><em>Feedback makes the model improve</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Practice structured feedback to the model.</li>
<li>Get from v1 to v3 with clear improvements.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>First answers are drafts; iteration delivers quality.</li>
<li>Specific feedback beats “try again”.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Point out what’s wrong (missing detail, wrong tone).</li>
<li>Request changes (add data, shorten, give bullets, cite sources).</li>
<li>Compare versions to ensure improvement.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Weak feedback</strong>: “Rewrite better.”</li>
<li><strong>Good feedback</strong>: “Keep bullets, add 2 risks, shorten to 120 words, use neutral tone.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Take a v1 answer (from Day 2).</li>
<li>Give specific feedback and generate v2.</li>
<li>Repeat once to get v3; note improvements.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Apply the same loop to another prompt of your choice.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Feedback is specific (what to add/remove/change).</li>
<li>v3 is measurably better than v1.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>One Useful Thing – iteration examples: <a href="https://www.oneusefulthing.org" target="_blank" rel="noreferrer">https://www.oneusefulthing.org</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 3: Iteration',
    emailBody: `<h1>AI 30-Day – Day 3</h1>
<h2>Iterate: from draft to great output</h2>
<p>Today you’ll improve outputs through targeted feedback.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 4,
    title: 'Break down tasks: workflow thinking',
    content: `<h1>Break down tasks: workflow thinking</h1>
<p><em>Guide the model step by step</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Split complex tasks into phases.</li>
<li>Use stepwise prompts to reduce errors.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>One-shot prompts for complex tasks often fail.</li>
<li>Phases improve control and quality.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Decompose: input → process → output → review.</li>
<li>Ask for outline first, then details.</li>
<li>Insert QA checks (assumptions, missing data, risks).</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>One-shot (weak)</strong>: “Write a full campaign plan.”</li>
<li><strong>Phased (good)</strong>: “Step 1: give a 5-bullet outline. Step 2: expand each bullet to 80 words. Step 3: add risks and metrics.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Choose a complex task (e.g., campaign, report, SOP).</li>
<li>Write a 3-step prompt (outline → expand → QA).</li>
<li>Run it and note improvements vs one-shot.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Apply the pattern to a different task (e.g., meeting summary → action plan).</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Task split into steps.</li>
<li>QA step included.</li>
<li>Output quality better than one-shot.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Prompt chaining examples: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 4: Workflow thinking',
    emailBody: `<h1>AI 30-Day – Day 4</h1>
<h2>Workflow thinking</h2>
<p>Today you decompose a complex task into steps and guide the model through them.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 5,
    title: 'Quality and safety: QA and guardrails',
    content: `<h1>Quality and safety: QA and guardrails</h1>
<p><em>Build a simple QA habit for every AI output</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create a 5-point QA checklist.</li>
<li>Apply it to two AI outputs.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Even good prompts can produce errors or bias.</li>
<li>QA reduces risk before sharing.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Check facts, numbers, dates.</li>
<li>Check tone and audience fit.</li>
<li>Ask for sources/disclaimers when needed.</li>
<li>Spot sensitive data; redact if required.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>QA prompt</strong>: “Review the draft for accuracy; list uncertainties; suggest fixes.”</li>
<li><strong>Guardrail</strong>: “Do not fabricate data; if unsure, say what’s missing.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Write a 5-point QA checklist (facts, tone, sources, risks, sensitive data).</li>
<li>Apply it to one output from Day 4.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Apply the checklist to a second output; add a guardrail instruction and compare results.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>QA checklist exists.</li>
<li>Two outputs reviewed and improved.</li>
<li>Guardrail instruction tested.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>OpenAI Safety Best Practices: <a href="https://platform.openai.com/docs/guides/safety-best-practices" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/safety-best-practices</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 5: QA & guardrails',
    emailBody: `<h1>AI 30-Day – Day 5</h1>
<h2>QA & guardrails</h2>
<p>Today you build a 5-point QA checklist and apply it to two outputs.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  }
];

function buildLessonContent(entry: LessonEntry) {
  return entry.content;
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  const { default: connectDB } = await import('../app/lib/mongodb');
  await connectDB();
  console.log('✅ Connected to MongoDB');

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

  const course = await Course.findOneAndUpdate(
    { courseId: COURSE_ID },
    {
      $set: {
        courseId: COURSE_ID,
        name: COURSE_NAME,
        description: COURSE_DESCRIPTION,
        language: 'en',
        durationDays: 30,
        isActive: true,
        requiresPremium: false,
        brandId: brand._id,
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
          category: 'education',
          difficulty: 'beginner',
          estimatedHours: 10,
          tags: ['ai', 'productivity', 'prompting'],
          instructor: 'Amanoba'
        }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`✅ Course ${COURSE_ID} created/updated`);

  for (const entry of lessonPlan) {
    const lessonId = `${COURSE_ID}_DAY_${String(entry.day).padStart(2, '0')}`;
    const content = buildLessonContent(entry);

    const emailSubject = entry.emailSubject || `{{courseName}} – Day {{dayNumber}}: {{lessonTitle}}`;
    let emailBody = entry.emailBody;
    if (!emailBody) {
      emailBody = [
        `<h1>{{courseName}}</h1>`,
        `<h2>Day {{dayNumber}}: {{lessonTitle}}</h2>`,
        '<div>{{lessonContent}}</div>',
        `<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
      ].join('');
    }
    emailBody = emailBody
      .replace(/\{\{APP_URL\}\}/g, appUrl)
      .replace(/\{\{COURSE_ID\}\}/g, COURSE_ID);

    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
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
            questionCount: 5,
            poolSize: 5,
            shuffleQuestions: true,
            shuffleOptions: true
          },
          metadata: {
            estimatedMinutes: 20,
            xpReward: 25,
            pointsReward: 50,
            difficulty: 'beginner'
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const quizzes: Array<{
      question: string;
      options: string[];
      correctIndex: number;
      difficulty: QuestionDifficulty;
      category: string;
    }> = [];

    if (entry.day === 1) {
      quizzes.push(
        {
          question: 'What is AI in this course context?',
          options: [
            'A tool that needs clear input and QA',
            'Magic that makes decisions for you',
            'A password manager',
            'A legal/medical advisor you can rely on blindly'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you avoid sharing with AI?',
          options: [
            'Passwords and sensitive personal data',
            'Public product descriptions',
            'Generic scenarios',
            'Non-sensitive drafts'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why is QA your responsibility?',
          options: [
            'AI does not assume liability; you decide and verify',
            'Because AI never makes mistakes',
            'Because QA is optional',
            'Because prompts are perfect'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a good first action?',
          options: [
            'Write your AI use map and do-not-use list',
            'Let AI handle payroll',
            'Paste confidential contracts',
            'Skip mapping and improvise'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why is “good input → better output” true?',
          options: [
            'Models rely on the text you provide; clarity guides results',
            'AI reads your mind',
            'Output is random',
            'Input does not matter'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 2) {
      quizzes.push(
        {
          question: 'Which is NOT one of the 4 parts?',
          options: [
            'Random emoji',
            'Goal',
            'Context',
            'Style'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why add context?',
          options: [
            'So the model knows background and constraints',
            'For decoration only',
            'To slow the response',
            'It is unnecessary'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which prompt is better?',
          options: [
            'Short, polite email to a customer who complained yesterday; tone empathetic, professional; max 4 sentences',
            'Write an email',
            'Send something',
            'Hi'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What does “format” specify?',
          options: [
            'Bullet/table/short paragraph etc.',
            'Only the language',
            'Only the audience',
            'Only the temperature'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you do after generation?',
          options: [
            'Check if output matches all 4 parts',
            'Assume it is perfect',
            'Share without reading',
            'Delete immediately'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 3) {
      quizzes.push(
        {
          question: 'Why is iteration needed?',
          options: [
            'First outputs are drafts; feedback improves quality',
            'AI is always perfect',
            'Feedback makes it worse',
            'It wastes time'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Which feedback is better?',
          options: [
            '“Keep bullets, add 2 risks, shorten to 120 words, neutral tone.”',
            '“Rewrite.”',
            '“Try again.”',
            'No feedback'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you compare between versions?',
          options: [
            'Clarity, completeness, alignment to prompt',
            'Only the font',
            'Only the length',
            'Only the color'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a good loop?',
          options: [
            'v1 → specific feedback → v2 → refine → v3',
            'v1 and publish immediately',
            'Random retries',
            'Delete v1'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What if tone is wrong?',
          options: [
            'State desired tone and constraints explicitly',
            'Hope it fixes itself',
            'Ignore tone',
            'Stop using prompts'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 4) {
      quizzes.push(
        {
          question: 'Why break tasks into steps?',
          options: [
            'Complex tasks fail in one shot; steps improve control',
            'Because AI is slow',
            'Because prompts must be long',
            'No benefit'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which phased approach is better?',
          options: [
            'Outline → expand → add risks/metrics',
            '“Write everything now”',
            'Send empty prompt',
            'Ask for a joke'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What is a QA step example?',
          options: [
            '“List assumptions and missing data before finalizing.”',
            'No QA needed',
            'Ignore risks',
            'Change only the font'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What do you do after outline?',
          options: [
            'Expand each bullet with constraints',
            'Publish outline as final',
            'Delete it',
            'Ask for memes'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why compare to one-shot?',
          options: [
            'To confirm phased approach improves quality',
            'No reason',
            'Only for SEO',
            'Only for design'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 5) {
      quizzes.push(
        {
          question: 'Why use a QA checklist?',
          options: [
            'Catch errors/bias before sharing',
            'AI never makes mistakes',
            'It is optional decoration',
            'It slows you for no reason'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which is a QA item?',
          options: [
            'Check facts/numbers/dates',
            'Check font size only',
            'Ignore tone',
            'Skip sources'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What is a guardrail instruction?',
          options: [
            '“Do not fabricate data; if unsure, say what’s missing.”',
            '“Ignore all constraints.”',
            '“Be random.”',
            '“Always agree.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why check tone/audience?',
          options: [
            'To ensure output fits the reader',
            'No need',
            'Only for style points',
            'Only for SEO'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you do with sensitive data?',
          options: [
            'Redact or anonymize before prompting',
            'Paste it as is',
            'Trust the model to delete it',
            'Ignore risk'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    }

    await QuizQuestion.deleteMany({ lessonId });
    await QuizQuestion.insertMany(
      quizzes.map((q, index) => ({
        ...q,
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
    console.log(`✅ Lesson ${lessonId} upserted with ${quizzes.length} questions`);
  }

  console.log('🎉 AI 30-Day EN course seeded (days 1-5).');
  await mongoose.disconnect();
  console.log('✅ Disconnected');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
