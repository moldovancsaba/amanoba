/**
 * Seed AI 30-Day Course (English, first 30 lessons)
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
  },
  {
    day: 6,
    title: 'Template library: reusable prompts',
    content: `<h1>Template library: reusable prompts</h1>
<p><em>Save time by standardizing your best prompts</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create 5 reusable prompt templates.</li>
<li>Version and store them in one place.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Reusable templates prevent retyping and reduce errors.</li>
<li>Consistency makes outputs predictable and faster.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Identify recurring tasks (email, summary, outline, QA, rewrite).</li>
<li>Parameterize: placeholders for audience, length, style, source.</li>
<li>Version: v1, v2 with improvements noted.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Template</strong>: “Write a <em>{length}</em>, <em>{tone}</em> email to <em>{audience}</em> about <em>{topic}</em>. Include 3 bullets and a clear CTA.”</li>
<li><strong>Weak</strong>: “Write an email.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>List 5 repetitive tasks you do weekly.</li>
<li>Draft a template for each with placeholders.</li>
<li>Label and save them (folder/doc/notes).</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Run one template on a real task and tweak it; save as v2.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>5 templates created.</li>
<li>Placeholders identified (audience/tone/length/etc.).</li>
<li>Stored in one accessible place.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Template management tips: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 6: Template library',
    emailBody: `<h1>AI 30-Day – Day 6</h1>
<h2>Template library</h2>
<p>Today you’ll build 5 reusable prompts and save them with versions.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 7,
    title: 'Role prompts and constraints',
    content: `<h1>Role prompts and constraints</h1>
<p><em>Get better answers by assigning roles and boundaries</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Use roles to guide style and depth.</li>
<li>Add constraints to control scope.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Role prompts produce domain-appropriate language.</li>
<li>Constraints prevent overlong or off-topic answers.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Role examples: “You are a tech writer / teacher / reviewer.”</li>
<li>Constraints: word count, bullet count, audience, exclusions.</li>
<li>Safety: “If unsure, ask for missing info; do not fabricate data.”</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “Act as a senior UX writer. Rewrite this microcopy for beginners. Limit to 3 bullets, plain language.”</li>
<li><strong>Poor</strong>: “Rewrite this.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick a task: add a role and 2 constraints.</li>
<li>Generate output; refine constraints if too long/off-topic.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Apply a different role (e.g., teacher vs reviewer) to the same task; compare outputs.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Role stated clearly.</li>
<li>Constraints include length/audience/exclusions.</li>
<li>Safety clause included.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Role prompting ideas: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 7: Role prompts',
    emailBody: `<h1>AI 30-Day – Day 7</h1>
<h2>Role prompts</h2>
<p>Today you’ll add roles and constraints to tighten outputs.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 8,
    title: 'Fact-checking and source requests',
    content: `<h1>Fact-checking and source requests</h1>
<p><em>Reduce hallucinations with verification prompts</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Use prompts that ask for sources/uncertainties.</li>
<li>Apply a quick fact-check routine.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Models can hallucinate; you must verify claims.</li>
<li>Sources and uncertainty flags guide your review.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Add: “Cite sources or say if unknown.”</li>
<li>Ask for “3 risks or missing info.”</li>
<li>Cross-check numbers/dates with a trusted source.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Summarize X in 120 words. List sources or say ‘no source’. Add 2 risks.”</li>
<li><strong>QA</strong>: “Check dates vs official site; flag mismatches.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick a factual topic; ask for summary + sources + risks.</li>
<li>Manually verify 2 claims; note discrepancies.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Rewrite your QA checklist to include “sources/uncertainty” for future prompts.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Sources requested in the prompt.</li>
<li>Uncertainties/risks listed.</li>
<li>At least 2 claims verified manually.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Safety best practices: <a href="https://platform.openai.com/docs/guides/safety-best-practices" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/safety-best-practices</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 8: Fact-checking',
    emailBody: `<h1>AI 30-Day – Day 8</h1>
<h2>Fact-checking</h2>
<p>Today you’ll request sources and verify key claims.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 9,
    title: 'Summaries that keep the signal',
    content: `<h1>Summaries that keep the signal</h1>
<p><em>Get concise outputs without losing essentials</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create a summary template.</li>
<li>Summarize a meeting or article with bullets + actions.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Summaries must retain decisions, actions, and blockers.</li>
<li>Structure avoids fluff.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Ask for: 5 bullets + 3 action items + 2 risks/questions.</li>
<li>Include “Who / What / When” in actions.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Template</strong>: “Summarize the transcript in 5 bullets; list 3 actions (who/what/when); list 2 risks.”</li>
<li><strong>Weak</strong>: “Summarize.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Take a meeting note/article; run the summary template.</li>
<li>Add missing who/when details manually if absent.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Refine the template for your team (channels, owners, deadlines).</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>5 bullets present.</li>
<li>3 actions with who/what/when.</li>
<li>Risks/questions listed.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Meeting prompt examples: <a href="https://www.oneusefulthing.org" target="_blank" rel="noreferrer">https://www.oneusefulthing.org</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 9: Summaries with signal',
    emailBody: `<h1>AI 30-Day – Day 9</h1>
<h2>Summaries with signal</h2>
<p>Today you’ll build a summary template that keeps actions and risks.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 10,
    title: 'Rewrite and tone shift',
    content: `<h1>Rewrite and tone shift</h1>
<p><em>Edit drafts into different voices and lengths</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Rewrite one text into three tones.</li>
<li>Control length and clarity.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Adapting tone for audience increases adoption.</li>
<li>Concise rewrites reduce noise.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Specify tone (formal, friendly, technical, executive brief).</li>
<li>Set length (words/sentences) and format (bullets/paragraph).</li>
<li>Ask to preserve key facts; remove fluff.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Rewrite this for executives in 120 words, neutral tone, 3 bullets, keep the metrics.”</li>
<li><strong>Weak</strong>: “Rewrite nicely.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick a rough draft; rewrite in 3 tones (formal/friendly/executive).</li>
<li>Check facts survived; trim fluff.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Create a reusable “tone shift” template for future rewrites.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>3 tone variants created.</li>
<li>Facts preserved.</li>
<li>Length/format constraints followed.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Editing prompts ideas: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 10: Rewrite & tone shift',
    emailBody: `<h1>AI 30-Day – Day 10</h1>
<h2>Rewrite & tone shift</h2>
<p>Today you’ll rewrite a draft into three tones and enforce length/format.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 11,
    title: 'Planning with AI: outlines and storyboards',
    content: `<h1>Planning with AI: outlines and storyboards</h1>
<p><em>Use the model to structure work before writing</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create a 2-level outline for a deliverable.</li>
<li>Turn it into a simple storyboard or section plan.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Planning reduces rewrites and missing sections.</li>
<li>Storyboards clarify flow before drafting.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Prompt for outline with constraints: audience, purpose, length, sections.</li>
<li>Add “check for gaps/assumptions” before accepting.</li>
<li>Storyboard: title + purpose + bullet notes per section.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Outline a 5-section guide for beginners on X. Include 3 bullets per section, flag missing data.”</li>
<li><strong>Weak</strong>: “Make an outline.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick a deliverable (guide/report/presentation).</li>
<li>Generate a 2-level outline with gaps noted.</li>
<li>Add a short storyboard note per section (purpose + key points).</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Ask the model to suggest missing data/sources for your outline and note them.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Outline has sections and bullets.</li>
<li>Gaps/assumptions listed.</li>
<li>Storyboard notes per section.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Planning prompts: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 11: Planning with AI',
    emailBody: `<h1>AI 30-Day – Day 11</h1>
<h2>Planning with AI</h2>
<p>Today you’ll generate an outline + storyboard and capture gaps.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 12,
    title: 'Research helper: questions, not answers',
    content: `<h1>Research helper: questions, not answers</h1>
<p><em>Use AI to frame research, not to accept facts blindly</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create research questions and angles.</li>
<li>Generate a reading/verification list.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI can suggest what to investigate; you must verify.</li>
<li>Good questions prevent shallow research.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Prompt: “Give 5 questions to investigate X, with suggested sources/formats.”</li>
<li>Ask for counterpoints and pitfalls.</li>
<li>Build a to-check list (sources/people/data).</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “List 5 angles to evaluate tool X for small teams; suggest data to collect; list 3 risks.”</li>
<li><strong>Poor</strong>: “Tell me everything about X” (no scope).</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick a topic; ask for 5 research questions + sources + pitfalls.</li>
<li>Create a checklist of what you will verify manually.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Run a quick source scan on 2 items and jot findings/uncertainties.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Questions/angles listed.</li>
<li>Sources/pitfalls captured.</li>
<li>Manual verification plan noted.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Safety best practices: <a href="https://platform.openai.com/docs/guides/safety-best-practices" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/safety-best-practices</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 12: Research helper',
    emailBody: `<h1>AI 30-Day – Day 12</h1>
<h2>Research helper</h2>
<p>Today you’ll generate research questions, sources, and pitfalls for your topic.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 13,
    title: 'Drafting long-form with sections',
    content: `<h1>Drafting long-form with sections</h1>
<p><em>Generate longer content safely, section by section</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Draft 2 sections from your outline.</li>
<li>Apply QA and tone constraints per section.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Section-by-section control keeps quality and consistency.</li>
<li>Reduces drift and hallucination.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Use outline from Day 11; generate per section.</li>
<li>Include tone/length/format per section.</li>
<li>Add QA: “List assumptions/uncertainties.”</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Write Section 2 (120 words, neutral tone, 3 bullets). Keep metrics; list uncertainties.”</li>
<li><strong>Weak</strong>: “Write everything at once.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick 2 sections; generate them with constraints.</li>
<li>QA each: check facts/tone/length; note assumptions.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Draft one more section; update your outline if something is missing.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Sections respect tone/length/format.</li>
<li>Assumptions/uncertainties listed.</li>
<li>Facts reviewed.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Long-form prompting tips: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 13: Long-form drafting',
    emailBody: `<h1>AI 30-Day – Day 13</h1>
<h2>Long-form drafting</h2>
<p>Today you’ll draft sections with constraints and QA checks.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 14,
    title: 'Transforming formats: table, bullets, narrative',
    content: `<h1>Transforming formats: table, bullets, narrative</h1>
<p><em>Convert content across formats to fit the audience</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Convert one piece of content into table, bullets, and short narrative.</li>
<li>Preserve facts across formats.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Different audiences prefer different formats.</li>
<li>Format shifts reveal missing or inconsistent data.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Prompt: “Turn this into a 3-column table (item/detail/action).”</li>
<li>Then: “Convert to 5 bullets” and “Convert to 120-word narrative.”</li>
<li>Check that numbers/claims stay consistent.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: Table with clear columns; bullets concise; narrative keeps facts.</li>
<li><strong>Poor</strong>: Format changes but loses data.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick content from Day 13; transform to table, bullets, narrative.</li>
<li>Compare for fact consistency.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Create a reusable “format switch” prompt for future use.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>All formats preserve key facts.</li>
<li>Audience needs matched.</li>
<li>Format switch prompt saved.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Formatting prompts: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 14: Transform formats',
    emailBody: `<h1>AI 30-Day – Day 14</h1>
<h2>Transform formats</h2>
<p>Today you’ll convert the same content into table, bullets, and narrative while keeping facts.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 15,
    title: 'Automation prep: prompts as pseudo-steps',
    content: `<h1>Automation prep: prompts as pseudo-steps</h1>
<p><em>Design prompts that could be automated later</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Write 3 prompt “steps” that could map to a workflow.</li>
<li>Add inputs/outputs and guardrails per step.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Structured steps ease future automation.</li>
<li>Clarifies data needed and risks at each step.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Define: input, instruction, expected output, guardrail per step.</li>
<li>Keep steps small (summarize → rewrite → QA).</li>
<li>Add “If missing data, ask” to avoid silent failures.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Step</strong>: “Input: transcript. Do: 5-bullet summary with actions. Output: bullets + actions. Guardrail: no invented decisions; list unknowns.”</li>
<li><strong>Weak</strong>: “Automate meeting handling.”</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick a task (e.g., meeting to recap). Break into 3 prompt steps with input/output/guardrail.</li>
<li>Run the steps manually with the model; note gaps.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Document the steps in a checklist so you can reuse or automate later.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>3 steps written with input/output/guardrail.</li>
<li>Gaps noted.</li>
<li>Checklist saved.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Prompt chaining ideas: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 15: Automation prep',
    emailBody: `<h1>AI 30-Day – Day 15</h1>
<h2>Automation prep</h2>
<p>Today you’ll write prompt steps with inputs/outputs/guardrails for a future workflow.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 16,
    title: 'Brainstorming and idea expansion (without rambling)',
    content: `<h1>Brainstorming and idea expansion (without rambling)</h1>
<p><em>Generate options, then converge with filters</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Run an expand → cluster → select loop.</li>
<li>Produce 5–10 ideas and narrow to 3.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Unstructured brainstorming produces noise.</li>
<li>Filters keep only feasible ideas.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Prompt 1 (expand): “List 10 ideas for X; keep them specific.”</li>
<li>Prompt 2 (cluster): “Group by theme; label each cluster.”</li>
<li>Prompt 3 (select): “Pick top 3 based on criteria A/B/C; explain why.”</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: 10 ideas → 3 clusters → 3 picks with reasons.</li>
<li><strong>Poor</strong>: endless list, no selection.</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Run expand/cluster/select for a real topic.</li>
<li>Write the selection criteria (budget/time/impact).</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Ask for 2 risks/assumptions for each selected idea.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>10 ideas generated.</li>
<li>Cluster labels present.</li>
<li>Top 3 chosen with reasons and risks.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Brainstorm prompts: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 16: Brainstorm & select',
    emailBody: `<h1>AI 30-Day – Day 16</h1>
<h2>Brainstorm & select</h2>
<p>Today you’ll expand ideas, cluster them, and select top 3 with criteria.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 17,
    title: 'Pros/cons and decision support',
    content: `<h1>Pros/cons and decision support</h1>
<p><em>Use structured pros/cons to inform choices</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create a pros/cons table with decision criteria.</li>
<li>Write a short recommendation with caveats.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Balanced pros/cons reduce biased decisions.</li>
<li>Caveats keep stakeholders aware of risks.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Ask for 3 pros/3 cons per option.</li>
<li>Add decision criteria: cost/time/impact/risk.</li>
<li>Request a 100-word recommendation + caveats.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Compare Option A vs B: 3 pros/cons each, criteria score (1–5) for cost/time/impact/risk). Recommend with caveats.”</li>
<li><strong>Weak</strong>: “Which is best?”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick two options; generate pros/cons table + scores.</li>
<li>Ask for a short recommendation and note caveats.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Adjust criteria weights and rerun; see if choice changes.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Pros/cons balanced.</li>
<li>Scores present for criteria.</li>
<li>Caveats explicitly listed.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Decision prompts: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 17: Pros/cons',
    emailBody: `<h1>AI 30-Day – Day 17</h1>
<h2>Pros/cons</h2>
<p>Today you’ll build a pros/cons table, score criteria, and write a recommendation with caveats.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 18,
    title: 'Data summarization: tables and simple calcs',
    content: `<h1>Data summarization: tables and simple calcs</h1>
<p><em>Turn structured data into insights safely</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Summarize a small dataset into a table with totals/percentages.</li>
<li>Add a short insight paragraph with caveats.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Structured summaries beat raw dumps.</li>
<li>Caveats prevent over-trust in derived numbers.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Provide data inline (small) or describe columns.</li>
<li>Ask for: table with totals/percentages, 3 insights, 2 caveats.</li>
<li>Forbid invented data.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Here is data (rows). Create a table with totals/% per category. Then 3 insights + 2 caveats. Do not invent missing values.”</li>
<li><strong>Weak</strong>: “Analyze this.”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Paste a small CSV-like snippet or describe 2–3 columns.</li>
<li>Request table + insights + caveats.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Add a formatting constraint (markdown table) and rerun; check math.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Table present with totals/%.</li>
<li>3 insights stated.</li>
<li>2 caveats stated; no invented data.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Data prompt tips: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 18: Data summarization',
    emailBody: `<h1>AI 30-Day – Day 18</h1>
<h2>Data summarization</h2>
<p>Today you’ll create a table with totals/% and write insights + caveats.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 19,
    title: 'Adapting to personas and audiences',
    content: `<h1>Adapting to personas and audiences</h1>
<p><em>Change output for different readers</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create persona cards and adapt one text to two personas.</li>
<li>Check for clarity and relevance per audience.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Persona-aware writing improves adoption.</li>
<li>Wrong tone/detail loses readers.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Define persona: role, goals, pain points, preferred style.</li>
<li>Prompt: “Rewrite for persona X; keep facts; adjust tone/detail.”</li>
<li>Ask for a short checklist: “Does this address goals/pains?”</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: Exec brief vs. frontline guide; facts intact, tone differs.</li>
<li><strong>Poor</strong>: Same text for all.</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Create 2 persona cards.</li>
<li>Rewrite one draft for each persona; keep facts; change tone/detail.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Ask AI to list 2 gaps for each persona and fix them.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Persona cards defined.</li>
<li>Two rewrites completed.</li>
<li>Facts preserved; tone/detail adapted.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Persona prompting: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 19: Personas',
    emailBody: `<h1>AI 30-Day – Day 19</h1>
<h2>Personas</h2>
<p>Today you’ll build persona cards and adapt one draft to each persona.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 20,
    title: 'Team feedback loop: sharing and revising',
    content: `<h1>Team feedback loop: sharing and revising</h1>
<p><em>Close the loop with human feedback</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Set a simple review checklist for peers.</li>
<li>Incorporate human feedback into AI drafts.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Human review catches context the model misses.</li>
<li>A repeatable loop speeds future drafts.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Share v1 + prompt + constraints with a teammate.</li>
<li>Ask for: clarity, correctness, tone fit, missing context.</li>
<li>Re-prompt with their feedback; produce v2.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Checklist</strong>: “What’s unclear? Any factual issues? Tone fit? Missing stakeholder needs?”</li>
<li><strong>Weak</strong>: “Thoughts?”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick a draft from earlier days; share with a peer or imagine peer notes.</li>
<li>Summarize feedback into 3 bullets; re-run the model with that feedback.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Create a reusable “peer review” prompt to attach to drafts.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Peer feedback captured.</li>
<li>v2 incorporates the feedback.</li>
<li>Review prompt saved.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Feedback prompts: <a href="https://www.oneusefulthing.org" target="_blank" rel="noreferrer">https://www.oneusefulthing.org</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 20: Team feedback',
    emailBody: `<h1>AI 30-Day – Day 20</h1>
<h2>Team feedback</h2>
<p>Today you’ll set a feedback checklist and re-run the model with human notes.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 21,
    title: 'Building FAQs and knowledge bases',
    content: `<h1>Building FAQs and knowledge bases</h1>
<p><em>Turn scattered questions into a structured, reusable FAQ</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Collect top questions and draft concise answers.</li>
<li>Organize FAQs by category and audience.</li>
<li>Add guardrails to avoid wrong claims.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Good FAQs speed support and improve consistent answers.</li>
<li>Structure helps AI retrieve accurate snippets.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Gather 10–15 real questions from email/chat/support.</li>
<li>Prompt: “Answer in 2–3 sentences, cite policy if relevant; if unknown, state unknown.”</li>
<li>Group by topic; add tags (billing, product, policy).</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: Short answer + link to policy, tags added.</li>
<li><strong>Poor</strong>: Long, speculative text with no source.</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>List 10 frequent questions.</li>
<li>Generate answers with the policy guardrail.</li>
<li>Tag by category and add source links.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Create a “don’t know? escalate” line for unknown questions.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>10 FAQs written.</li>
<li>Sources/links included where needed.</li>
<li>Categories/tags applied.</li>
<li>Unknown path defined.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Knowledge base structuring tips: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 21: FAQs',
    emailBody: `<h1>AI 30-Day – Day 21</h1>
<h2>Build FAQs</h2>
<p>Today you’ll draft FAQs with sources and categories.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 22,
    title: 'Prompt A/B testing and evaluation',
    content: `<h1>Prompt A/B testing and evaluation</h1>
<p><em>Compare prompts and pick the best performer</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create two prompt variants (A/B).</li>
<li>Define 3–4 evaluation criteria.</li>
<li>Select the better prompt with evidence.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Small changes in prompts can change quality.</li>
<li>Criteria-driven eval reduces guesswork.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Make variants: change format, constraints, role.</li>
<li>Criteria: accuracy, clarity, brevity, actionability.</li>
<li>Ask the model to self-score then you verify.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Evaluate A vs B on accuracy/clarity/brevity/actionability; score 1–5; explain.”</li>
<li><strong>Weak</strong>: “Which is better?”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick a task; write prompt A and B.</li>
<li>Generate outputs; score with criteria; pick winner.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Tweak the weaker prompt and retest.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>A/B outputs generated.</li>
<li>Scores per criterion.</li>
<li>Winner chosen with reason.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Evaluation prompting: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 22: Prompt A/B',
    emailBody: `<h1>AI 30-Day – Day 22</h1>
<h2>Prompt A/B testing</h2>
<p>Today you’ll compare two prompts using clear criteria.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 23,
    title: 'Rubrics and scoring AI outputs',
    content: `<h1>Rubrics and scoring AI outputs</h1>
<p><em>Judge outputs with a checklist and weights</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Build a rubric with 4–5 criteria and weights.</li>
<li>Score one AI output with it.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Rubrics make evaluation repeatable.</li>
<li>Weights reflect what matters most.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Criteria examples: correctness, completeness, clarity, tone, actionability.</li>
<li>Weights add up to 100%.</li>
<li>Ask model to self-score and justify; you confirm.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Use this rubric (criteria + weights) to score the output; give per-criterion notes.”</li>
<li><strong>Weak</strong>: “Is this good?”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Create a rubric (5 items, weights total 100%).</li>
<li>Apply it to one AI output; record scores and notes.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Adjust weights to match your team’s priorities and rescore.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Rubric created with weights.</li>
<li>Output scored with notes.</li>
<li>Weights reflect priorities.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Evaluation templates: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 23: Rubrics',
    emailBody: `<h1>AI 30-Day – Day 23</h1>
<h2>Rubrics</h2>
<p>Today you’ll build a rubric and score an AI output.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 24,
    title: 'Handling refusals and hallucinations',
    content: `<h1>Handling refusals and hallucinations</h1>
<p><em>Add guardrails for safety and fallback answers</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Write prompts that allow “I don’t know” and cite uncertainty.</li>
<li>Add checks for risky content.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Refusals are safer than confident errors.</li>
<li>Uncertainty flags guide human QA.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Include: “If unsure, say ‘Not sure, need X data’.”</li>
<li>Forbid: “Do not fabricate data or sources.”</li>
<li>Ask for an “uncertainty” line in outputs.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Answer in 3 bullets; if unknown, state unknown and what data is needed; do not invent.”</li>
<li><strong>Weak</strong>: “Answer everything confidently.”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Take a factual prompt; add refusal/uncertainty clauses.</li>
<li>Generate output; confirm it flags unknowns.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Add a short “risk check” line to your QA checklist.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Prompt allows “unknown”.</li>
<li>No fabricated data.</li>
<li>Uncertainty/risk noted.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Safety prompts: <a href="https://platform.openai.com/docs/guides/safety-best-practices" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/safety-best-practices</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 24: Refusals & safety',
    emailBody: `<h1>AI 30-Day – Day 24</h1>
<h2>Refusals & safety</h2>
<p>Today you’ll add uncertainty/“don’t know” handling and forbid fabrication.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 25,
    title: 'Privacy and compliance guardrails',
    content: `<h1>Privacy and compliance guardrails</h1>
<p><em>Keep sensitive data out and comply with policy</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Write a 5-point privacy checklist for prompts.</li>
<li>Add compliance reminders to templates.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Protects personal/confidential data.</li>
<li>Reduces accidental policy violations.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Checklist: no PII, no secrets, no client IDs, anonymize where possible.</li>
<li>Add “Do not include sensitive data; redact names/IDs.”</li>
<li>Log “data used” for high-risk tasks.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: Prompt includes “Redact names; no PII; if needed, ask for sanitized data.”</li>
<li><strong>Poor</strong>: Paste full customer records.</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Create a 5-point privacy guardrail snippet.</li>
<li>Insert it into 2 templates you use.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Draft a “data used” note to append when sharing outputs.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Guardrail snippet ready.</li>
<li>Templates updated.</li>
<li>Data note drafted.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Usage policies: <a href="https://openai.com/policies/usage-policies" target="_blank" rel="noreferrer">https://openai.com/policies/usage-policies</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 25: Privacy guardrails',
    emailBody: `<h1>AI 30-Day – Day 25</h1>
<h2>Privacy guardrails</h2>
<p>Today you’ll add privacy/compliance guardrails to your templates.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 26,
    title: 'Working with tables and CSVs (small-scale)',
    content: `<h1>Working with tables and CSVs (small-scale)</h1>
<p><em>Safely transform small datasets with clear instructions</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Give column-aware instructions to reshape data.</li>
<li>Ask for validation steps and highlight missing values.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Specific column/format instructions avoid broken tables.</li>
<li>Highlighting missing values prevents silent errors.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Specify columns, expected output format (markdown table), and operations (filter/sort/add column).</li>
<li>Forbid adding rows; ask to flag missing/invalid data.</li>
<li>Request a short “checks” line: counts, missing fields.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “You have columns A,B,C. Filter where status=Active, sort by date, add total=price*qty. Return markdown table; flag missing values; do not invent rows.”</li>
<li><strong>Weak</strong>: “Fix this CSV.”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Provide 5–10 rows of sample data.</li>
<li>Ask for a filtered/sorted/derived-column table with checks.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Add a “validation” line: row count before/after, missing field list.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Output table matches requested columns/ops.</li>
<li>No invented data.</li>
<li>Validation line present.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Data prompts: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 26: Tables/CSVs',
    emailBody: `<h1>AI 30-Day – Day 26</h1>
<h2>Tables/CSVs</h2>
<p>Today you’ll transform a small dataset with clear column instructions and checks.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 27,
    title: 'Email and outreach sequences with personalization',
    content: `<h1>Email and outreach sequences with personalization</h1>
<p><em>Design short sequences that adapt per recipient</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Write a 3-step sequence with variants.</li>
<li>Add personalization slots and guardrails.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Sequenced outreach is more effective than one-off blasts.</li>
<li>Personalization increases response, but must stay accurate.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Steps: intro, follow-up, final nudge.</li>
<li>Slots: {{name}}, {{company}}, {{pain}}, {{offer}}; forbid making up facts.</li>
<li>Ask for subject + body + CTA per step, under word limits.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “Create 3 emails (intro/follow-up/final). Max 90/80/60 words. Include subject + CTA. Use placeholders; do not invent details.”</li>
<li><strong>Weak</strong>: “Write an email.”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Define the offer and audience.</li>
<li>Generate the 3-step sequence with placeholders.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Fill placeholders for one real contact; verify accuracy.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>3 emails with subjects and CTAs.</li>
<li>Placeholders present; no fabricated claims.</li>
<li>Word limits respected.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Outreach prompt ideas: <a href="https://www.oneusefulthing.org" target="_blank" rel="noreferrer">https://www.oneusefulthing.org</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 27: Outreach sequences',
    emailBody: `<h1>AI 30-Day – Day 27</h1>
<h2>Outreach sequences</h2>
<p>Today you’ll design a 3-step sequence with safe placeholders.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 28,
    title: 'Slides/briefs: from outline to draft',
    content: `<h1>Slides/briefs: from outline to draft</h1>
<p><em>Generate slide/brief content from an outline</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Turn an outline into slide-ready bullets.</li>
<li>Add speaker notes or summary for each slide.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Slide-ready text saves time and keeps structure.</li>
<li>Notes clarify intent and next steps.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Provide outline sections; ask for Title + 3 bullets + 1 note each.</li>
<li>Set limits (bullet length, no images, no fake data).</li>
<li>Ask for a closing slide with CTA.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Prompt</strong>: “For each outline item, give slide title + 3 bullets (max 12 words) + 1 note. No fake stats. Add closing slide with CTA.”</li>
<li><strong>Weak</strong>: “Make slides.”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Use your Day 11 outline; generate slide bullets + notes.</li>
<li>Check for length/clarity and remove fluff.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Add a CTA slide tailored to your audience.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Slide bullets concise.</li>
<li>Notes present.</li>
<li>No fabricated data.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Slide prompting tips: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 28: Slides/briefs',
    emailBody: `<h1>AI 30-Day – Day 28</h1>
<h2>Slides/briefs</h2>
<p>Today you’ll turn your outline into slide-ready bullets with notes.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 29,
    title: 'Personal daily workflow with AI',
    content: `<h1>Personal daily workflow with AI</h1>
<p><em>Use AI to plan, prioritize, and recap your day</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create a morning plan prompt and an end-of-day recap prompt.</li>
<li>Include priorities, blockers, and next actions.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Consistent planning improves focus.</li>
<li>Recaps capture learnings and follow-ups.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Morning: “List top 3 priorities, key meetings, prep tasks, risks.”</li>
<li>Evening: “Summarize wins, blockers, decisions, next steps with owners.”</li>
<li>Add: “If missing info, ask.”</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Morning prompt</strong>: “Given my calendar/tasks, list 3 priorities, prep steps, risks; keep under 120 words.”</li>
<li><strong>Evening prompt</strong>: “Summarize today: wins, blockers, decisions, next actions (who/when).”</li>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Write your morning and evening prompts.</li>
<li>Test both; adjust for brevity and clarity.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Add a weekly review prompt (what to start/stop/continue).</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Morning prompt ready.</li>
<li>Evening prompt ready.</li>
<li>Next actions clear with owners.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Productivity prompts: <a href="https://www.oneusefulthing.org" target="_blank" rel="noreferrer">https://www.oneusefulthing.org</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 29: Daily workflow',
    emailBody: `<h1>AI 30-Day – Day 29</h1>
<h2>Daily workflow</h2>
<p>Today you’ll build morning and evening prompts for your day.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Open the lesson →</a></p>`
  },
  {
    day: 30,
    title: 'Capstone: your end-to-end AI workflow',
    content: `<h1>Capstone: your end-to-end AI workflow</h1>
<p><em>Apply everything to one real workflow</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Select one real process and map prompts to each step.</li>
<li>Run it end-to-end and document results.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Proves your AI workflow works in practice.</li>
<li>Creates a reusable playbook.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Pick a process (report, campaign, support flow).</li>
<li>Use prompts from days 6–29 (templates, QA, roles, data, personas, safety).</li>
<li>Document inputs/outputs/guardrails and lessons learned.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Choose the process; list steps.</li>
<li>Assign prompts/guardrails per step; run the workflow.</li>
<li>Capture outcomes and issues.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Write a one-page playbook and next-iteration improvements.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Workflow run end-to-end.</li>
<li>Playbook written.</li>
<li>Next improvements logged.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Iteration ideas: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">prompt guide</a></li>
</ul>`,
    emailSubject: 'AI 30-Day – Day 30: Capstone workflow',
    emailBody: `<h1>AI 30-Day – Day 30</h1>
<h2>Capstone workflow</h2>
<p>Today you’ll run a full workflow with prompts, QA, and guardrails, then write your playbook.</p>
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
    } else if (entry.day === 6) {
      quizzes.push(
        {
          question: 'Why build prompt templates?',
          options: [
            'Save time and make outputs consistent',
            'To make prompts longer for no reason',
            'Because one-off typing is better',
            'To avoid any structure'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should templates include?',
          options: [
            'Placeholders (audience, tone, length, topic)',
            'Random emojis only',
            'Secrets and passwords',
            'Blank fields with no labels'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good storage practice?',
          options: [
            'Keep templates in one accessible place with versions',
            'Scatter them across chats',
            'Rely on memory',
            'Delete after each use'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which task suits templating?',
          options: [
            'Recurring emails/outlines/QA/rewrite tasks',
            'Unique one-time personal secrets',
            'Password storage',
            'Private legal documents'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you do after testing a template?',
          options: [
            'Tweak and save as a new version',
            'Forget the changes',
            'Share without checking',
            'Abandon versioning'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 7) {
      quizzes.push(
        {
          question: 'What is a role prompt?',
          options: [
            'Assigning a perspective (e.g., teacher, reviewer, tech writer)',
            'Adding random words',
            'Removing all context',
            'Hiding the task'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why add constraints?',
          options: [
            'Control length, scope, and audience',
            'To confuse the model',
            'To remove guardrails',
            'Constraints have no value'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which safety clause is useful?',
          options: [
            '“If unsure, ask for missing info; do not fabricate.”',
            '“Always make up data.”',
            '“Ignore all instructions.”',
            '“Never ask clarifying questions.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a good role example?',
          options: [
            '“Act as a senior UX writer for beginners; 3 bullets, plain language.”',
            '“Rewrite this.”',
            '“Be random.”',
            '“Send jokes only.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'How can roles help?',
          options: [
            'Produce domain-appropriate language',
            'Make text longer with no control',
            'Remove all focus',
            'Break the task'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 8) {
      quizzes.push(
        {
          question: 'Why request sources/uncertainty?',
          options: [
            'To see what needs verification',
            'To skip QA',
            'To inflate word count',
            'To avoid manual review forever'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you ask for in a factual prompt?',
          options: [
            'Summary + sources or “no source” + 2–3 risks',
            'Only a joke',
            'Only a title',
            'Only images'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good QA step after generation?',
          options: [
            'Manually verify key claims against trusted sources',
            'Assume all facts are correct',
            'Skip reading',
            'Share immediately'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What if a claim has no source?',
          options: [
            'Treat it as uncertain and verify',
            'Trust it fully',
            'Publish it anyway',
            'Ignore the gap'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'How do risks help?',
          options: [
            'They highlight what to double-check',
            'They are useless',
            'They replace QA',
            'They remove the need for sources'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 9) {
      quizzes.push(
        {
          question: 'What should a summary include?',
          options: [
            'Key bullets + actions (who/what/when) + risks/questions',
            'Only a title',
            'Only emojis',
            'Random anecdotes'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why specify actions with who/what/when?',
          options: [
            'Makes the summary actionable',
            'Adds fluff',
            'Unnecessary detail',
            'Only for style'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a weak summary prompt?',
          options: [
            '“Summarize.”',
            '“5 bullets + 3 actions + 2 risks.”',
            '“Include who/when.”',
            '“List blockers.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you do if actions lack owners?',
          options: [
            'Add owners manually or rerun with owner field',
            'Ignore it',
            'Delete the actions',
            'Replace with jokes'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why include risks/questions?',
          options: [
            'To surface uncertainties that need follow-up',
            'To pad length only',
            'No reason',
            'To remove actions'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 10) {
      quizzes.push(
        {
          question: 'Why shift tone?',
          options: [
            'Audience needs different voice/length',
            'No reason',
            'Only to add fluff',
            'To hide facts'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you preserve when rewriting?',
          options: [
            'Key facts/metrics',
            'Nothing from the original',
            'Only style',
            'Only emojis'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which prompt is better for executives?',
          options: [
            '“Rewrite for execs: 120 words, neutral tone, 3 bullets, keep metrics.”',
            '“Rewrite nicely.”',
            '“Make it long and flowery.”',
            '“Ignore constraints.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you do after rewriting?',
          options: [
            'Check length/format and confirm facts intact',
            'Assume it’s fine',
            'Delete the original',
            'Share blindly'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why create a tone-shift template?',
          options: [
            'Reuse for future drafts consistently',
            'Never reuse prompts',
            'To make outputs random',
            'To avoid constraints'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 11) {
      quizzes.push(
        {
          question: 'Why outline before drafting?',
          options: [
            'Reduces rewrites and missing sections',
            'No benefit',
            'Only adds fluff',
            'Makes text longer for no reason'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should an outline prompt include?',
          options: [
            'Audience, purpose, length, sections, gaps/assumptions',
            'Only “make an outline”',
            'Random jokes',
            'Secret data'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a storyboard note?',
          options: [
            'Section purpose + key points',
            'Only a title',
            'Only emojis',
            'A full draft'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you capture after outlining?',
          options: [
            'Gaps/assumptions to fill with sources/data',
            'Nothing',
            'Only fonts',
            'Only colors'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor outline prompt?',
          options: [
            '“Make an outline.” with no constraints',
            '“Outline 5 sections, 3 bullets each, flag missing data.”',
            '“List assumptions.”',
            '“Add gaps.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 12) {
      quizzes.push(
        {
          question: 'What should AI provide in research mode?',
          options: [
            'Questions, angles, sources, pitfalls',
            'Final facts to trust blindly',
            'Confidential data',
            'Passwords'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why list counterpoints/pitfalls?',
          options: [
            'To avoid shallow or biased research',
            'For decoration',
            'To skip verification',
            'To increase word count only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good research prompt element?',
          options: [
            '“Suggest 5 questions and sources to evaluate X; list 3 risks.”',
            '“Tell me everything about X.”',
            '“Give me secrets.”',
            '“Write a poem.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What must follow AI research suggestions?',
          options: [
            'Manual verification of claims/sources',
            'Immediate publishing',
            'Skip QA',
            'Sharing without reading'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why build a to-check list?',
          options: [
            'To plan manual verification steps',
            'No reason',
            'Only to add fluff',
            'To avoid checking'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 13) {
      quizzes.push(
        {
          question: 'Why draft section by section?',
          options: [
            'Keep control over tone/length and reduce drift',
            'No benefit',
            'To make it slower only',
            'To avoid constraints'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should each section prompt include?',
          options: [
            'Tone, length, format, keep metrics, list uncertainties',
            'Only “write it”',
            'Random jokes',
            'Passwords'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What QA step is recommended?',
          options: [
            'Check facts/tone/length and note assumptions',
            'Skip QA',
            'Only change font',
            'Ignore uncertainties'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a weak approach?',
          options: [
            '“Write everything at once.”',
            'Section prompts with constraints',
            'Listing assumptions',
            'QA per section'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you do if a section exposes missing data?',
          options: [
            'Update outline and note the gap',
            'Ignore it',
            'Delete the section',
            'Publish anyway'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 14) {
      quizzes.push(
        {
          question: 'Why convert across formats?',
          options: [
            'Different audiences need different views; reveals inconsistencies',
            'For fun only',
            'No value',
            'To lose data'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What must stay consistent across formats?',
          options: [
            'Facts/metrics',
            'Only emojis',
            'Nothing',
            'Random additions'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Which is a good format switch prompt?',
          options: [
            '“Turn this into a 3-column table (item/detail/action).”',
            '“Make it fun.”',
            '“Change colors.”',
            '“Do something.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you check after converting?',
          options: [
            'Facts preserved in table/bullets/narrative',
            'Only layout',
            'Ignore content',
            'Delete sources'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why save a format-switch prompt?',
          options: [
            'Reuse to keep consistency later',
            'Never reuse',
            'Make outputs random',
            'Avoid structure'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 15) {
      quizzes.push(
        {
          question: 'Why define prompt steps with inputs/outputs?',
          options: [
            'Prepares for future automation and clarifies data needs',
            'No reason',
            'To confuse the model',
            'To remove guardrails'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should each step include?',
          options: [
            'Input, instruction, expected output, guardrail',
            'Only a title',
            'Only jokes',
            'Only color scheme'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What guardrail helps avoid silent failure?',
          options: [
            '“If missing data, ask; do not invent.”',
            '“Always invent data.”',
            '“Ignore missing info.”',
            '“Skip questions.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a weak step definition?',
          options: [
            '“Automate meeting handling.” (no details)',
            'Input/output/guardrail defined',
            'Explicit instruction',
            'QA clause'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you do after running the steps manually?',
          options: [
            'Note gaps and save a checklist/template',
            'Ignore results',
            'Delete everything',
            'Skip documentation'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 16) {
      quizzes.push(
        {
          question: 'Why cluster after brainstorming?',
          options: [
            'To reduce noise and see themes',
            'Only to add words',
            'No benefit',
            'To hide ideas'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What belongs in a selection step?',
          options: [
            'Criteria (budget/time/impact) and reasons',
            'Random choice',
            'Only length',
            'Only colors'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why list risks/assumptions for chosen ideas?',
          options: [
            'To know what could fail or is unknown',
            'No reason',
            'To pad text only',
            'To ignore feasibility'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor brainstorming flow?',
          options: [
            'Endless ideas, no grouping or selection',
            'Expand → cluster → select',
            'Add criteria',
            'Add risks'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why cap to top 3 ideas?',
          options: [
            'Focus execution on feasible options',
            'To delete good ideas',
            'To make it random',
            'To avoid criteria'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 17) {
      quizzes.push(
        {
          question: 'What must a pros/cons prompt include?',
          options: [
            'Pros/cons per option and decision criteria',
            'Only pros',
            'Only cons',
            'No criteria'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why add caveats to recommendations?',
          options: [
            'Highlight risks and conditions',
            'To weaken the advice unnecessarily',
            'No reason',
            'To add fluff'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good scoring approach?',
          options: [
            'Score criteria (cost/time/impact/risk) 1–5 per option',
            'No scores',
            'Random numbers',
            'Only colors'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a weak decision prompt?',
          options: [
            '“Which is best?” with no criteria',
            '“Compare with pros/cons and scores.”',
            '“Add caveats.”',
            '“Use cost/time/impact.”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why test different weights?',
          options: [
            'See if the recommendation changes with priorities',
            'No reason',
            'To confuse',
            'To ignore scoring'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 18) {
      quizzes.push(
        {
          question: 'What should the data prompt forbid?',
          options: [
            'Inventing missing values',
            'Listing caveats',
            'Adding totals',
            'Formatting as table'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should the output include?',
          options: [
            'Table with totals/% + 3 insights + 2 caveats',
            'Only a story',
            'Only a chart',
            'Only raw data'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why add caveats?',
          options: [
            'Remind what’s missing/uncertain',
            'To pad length',
            'No reason',
            'To avoid checking math'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What should you check after generation?',
          options: [
            'Math and that no data was invented',
            'Nothing',
            'Only colors',
            'Only word count'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What formatting can help?',
          options: [
            'Markdown table for clarity',
            'Random emojis',
            'Plain wall of text',
            'Invisible text'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 19) {
      quizzes.push(
        {
          question: 'What goes into a persona card?',
          options: [
            'Role, goals, pains, preferred style',
            'Random facts',
            'Only name',
            'Only age'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What must stay constant when adapting?',
          options: [
            'Facts/metrics',
            'Tone only',
            'Nothing',
            'Only length'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why ask “does this address goals/pains?”',
          options: [
            'To check relevance to each persona',
            'For decoration',
            'No reason',
            'To add fluff'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a weak persona rewrite?',
          options: [
            'Same text for everyone',
            'Tone and detail adapted',
            'Facts preserved',
            'Goals addressed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you capture after rewrite?',
          options: [
            '2 gaps per persona and fix them',
            'Nothing',
            'Only emojis',
            'Delete the draft'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 20) {
      quizzes.push(
        {
          question: 'Why include human feedback?',
          options: [
            'Humans add context AI misses',
            'No need; AI is perfect',
            'To slow work only',
            'To remove QA'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you share with peers?',
          options: [
            'Draft, prompt/constraints, and questions for review',
            'Only the final version',
            'Nothing',
            'Only a title'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What to ask in the feedback checklist?',
          options: [
            'Clarity, correctness, tone fit, missing context',
            'Favorite color',
            'Lunch choice',
            'Random jokes'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you do with feedback?',
          options: [
            'Summarize and re-prompt to produce v2',
            'Ignore it',
            'Delete the draft',
            'Postpone forever'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why save a peer-review prompt?',
          options: [
            'Reuse for faster future reviews',
            'Never review again',
            'Avoid structure',
            'Remove constraints'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 21) {
      quizzes.push(
        {
          question: 'Why structure FAQs with sources?',
          options: [
            'Consistent, citeable answers and safer retrieval',
            'To make them longer',
            'No benefit',
            'To hide policy links'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you do if the answer is unknown?',
          options: [
            'State unknown and what data is needed',
            'Invent an answer',
            'Ignore the question',
            'Add random text'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why tag FAQs by category?',
          options: [
            'Helps retrieval and routing',
            'Only for decoration',
            'No purpose',
            'To increase file size'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should answers include when policy applies?',
          options: [
            'Short answer plus policy link',
            'Speculation without sources',
            'Only a long story',
            'Hidden policy'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor FAQ practice?',
          options: [
            'Long speculative text with no source',
            'Concise answer with link',
            'Unknown path defined',
            'Tagged categories'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 22) {
      quizzes.push(
        {
          question: 'Why run prompt A/B tests?',
          options: [
            'Different prompts can yield different quality; testing finds a better one',
            'It is pointless',
            'Only to waste time',
            'To avoid criteria'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Which criteria are useful for evaluation?',
          options: [
            'Accuracy, clarity, brevity, actionability',
            'Favorite color',
            'Font choice',
            'Randomness'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a weak evaluation prompt?',
          options: [
            '"Which is better?" with no criteria',
            '"Score A/B on accuracy/clarity/brevity/actionability"',
            '"Explain scores"',
            '"List strengths/weaknesses"'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why verify model self-scores?',
          options: [
            'To catch mistakes or bias in self-eval',
            'No need',
            'Because scores are always perfect',
            'To ignore outputs'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What should you do with the weaker prompt?',
          options: [
            'Tweak constraints/format and retest',
            'Delete criteria',
            'Keep it unchanged',
            'Ignore results'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 23) {
      quizzes.push(
        {
          question: 'Why use a rubric with weights?',
          options: [
            'Makes evaluation repeatable and reflects priorities',
            'No reason',
            'Only to add math',
            'To avoid judging outputs'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should weights sum to?',
          options: [
            '100%',
            '50%',
            'Any random number',
            'They are unnecessary'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which is a good rubric criterion set?',
          options: [
            'Correctness, completeness, clarity, tone, actionability',
            'Font size, color, emoji count',
            'Randomness, length only',
            'Word rarity'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should accompany scores?',
          options: [
            'Per-criterion notes/justifications',
            'Nothing',
            'Only colors',
            'Only totals'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why adjust weights later?',
          options: [
            'To align with team priorities',
            'No reason',
            'To randomize results',
            'To remove criteria'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 24) {
      quizzes.push(
        {
          question: 'What should a refusal/uncertainty clause do?',
          options: [
            'Allow “not sure” and request missing data',
            'Force confident answers',
            'Hide unknowns',
            'Add fake sources'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What must you forbid explicitly?',
          options: [
            'Fabricating data or sources',
            'Listing risks',
            'Using bullets',
            'Keeping answers short'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why ask for uncertainty in outputs?',
          options: [
            'Helps QA focus on weak spots',
            'No need',
            'To pad length',
            'To skip checking'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a weak safety prompt?',
          options: [
            '"Answer everything confidently."',
            '"If unsure, say unknown; do not invent."',
            '"List risks."',
            '"Keep to 3 bullets."'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should QA include after adding safety?',
          options: [
            'Check no fabrication and unknowns are flagged',
            'Ignore output',
            'Remove bullets',
            'Hide risks'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 25) {
      quizzes.push(
        {
          question: 'What should privacy guardrails forbid?',
          options: [
            'PII, secrets, client IDs without redaction',
            'Short answers',
            'Bullets',
            'Concise tone'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Where should you add the guardrail snippet?',
          options: [
            'Into templates you reuse',
            'Nowhere',
            'Only in one-off ad hoc prompts',
            'Hidden in comments only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why include “ask for sanitized data”?',
          options: [
            'Prevents model from accepting sensitive input silently',
            'No reason',
            'To lengthen the prompt only',
            'To encourage data leaks'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a good data note to append?',
          options: [
            '"Data used: sanitized summary, no PII."',
            '"Full customer details included."',
            '"We guessed the names."',
            '"No idea what data was used."'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a bad practice?',
          options: [
            'Pasting full customer records into prompts',
            'Redacting IDs',
            'Linking to policy',
            'Logging data use'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 26) {
      quizzes.push(
        {
          question: 'What must you specify for table transforms?',
          options: [
            'Columns, operations, and output format',
            'Only say “fix CSV”',
            'Nothing',
            'Random emojis'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why forbid adding rows?',
          options: [
            'Prevents invented data',
            'No reason',
            'To make outputs shorter',
            'Because tables are optional'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should the validation line include?',
          options: [
            'Row count before/after and missing fields',
            'Only a joke',
            'Only colors',
            'Only word count'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a good operation set?',
          options: [
            'Filter by status, sort by date, add derived column',
            'Shuffle randomly',
            'Add fake rows',
            'Delete all data'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why use markdown tables?',
          options: [
            'Readable output for small data',
            'To increase hallucination',
            'No benefit',
            'Because CSV cannot be read'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 27) {
      quizzes.push(
        {
          question: 'What should an outreach sequence include?',
          options: [
            'Subject, body, CTA for intro/follow-up/final',
            'Only one long email',
            'Only emojis',
            'No CTA'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why use placeholders ({{name}}, {{company}})?',
          options: [
            'Enable safe personalization without inventing facts',
            'To add fluff',
            'No reason',
            'To leak data'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you forbid in outreach prompts?',
          options: [
            'Inventing details about the recipient',
            'Using CTAs',
            'Keeping it short',
            'Structuring steps'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a good word-limit approach?',
          options: [
            'Shorter per step (e.g., 90/80/60 words)',
            'No limits',
            'All emails 500 words',
            'Random lengths'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you do before sending?',
          options: [
            'Fill placeholders with verified info and check accuracy',
            'Send with placeholders empty',
            'Assume AI fabricated correctly',
            'Skip review'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 28) {
      quizzes.push(
        {
          question: 'What should slide prompts include?',
          options: [
            'Title + 3 short bullets + one note per slide',
            'Only a title',
            'Only images',
            'Only a CTA'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why set bullet length limits?',
          options: [
            'Keeps slides concise and readable',
            'No reason',
            'To add fluff',
            'To force long text'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you forbid in slide drafts?',
          options: [
            'Fake statistics',
            'Short bullets',
            'Notes',
            'CTA slide'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What should a closing slide contain?',
          options: [
            'Clear CTA aligned to audience',
            'Random facts',
            'No CTA',
            'Only contact info without CTA'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What to check after generation?',
          options: [
            'Length, clarity, factual accuracy, no fake data',
            'Only colors',
            'Only font',
            'Nothing'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 29) {
      quizzes.push(
        {
          question: 'What should the morning prompt produce?',
          options: [
            'Top priorities, meetings, prep steps, risks',
            'Only jokes',
            'Random tasks',
            'No actions'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should the evening recap include?',
          options: [
            'Wins, blockers, decisions, next steps with owners',
            'Only a quote',
            'Only calendar events',
            'Nothing actionable'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why add “ask if missing info”?',
          options: [
            'Prevents gaps in the plan/recap',
            'No reason',
            'To add length',
            'To hide blockers'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a good weekly review prompt element?',
          options: [
            'Start/stop/continue plus next-week priorities',
            'Only jokes',
            'Only random facts',
            'Only timesheets'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What must actions include?',
          options: [
            'Who/what/when',
            'Only what',
            'Only when',
            'Only who'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 30) {
      quizzes.push(
        {
          question: 'What is the capstone objective?',
          options: [
            'Run a real workflow end-to-end with prompts/QA/guardrails',
            'Write a poem',
            'Change only colors',
            'Skip all steps'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should the playbook include?',
          options: [
            'Steps, prompts, inputs/outputs, guardrails, lessons learned',
            'Only a title',
            'Only colors',
            'Only a quote'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why document lessons learned?',
          options: [
            'To improve next iteration',
            'No reason',
            'To pad text',
            'To remove steps'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What should you log after the run?',
          options: [
            'Outcomes, issues, next improvements',
            'Nothing',
            'Only emojis',
            'Only dates'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor capstone approach?',
          options: [
            'Ad hoc steps with no QA or documentation',
            'Guardrails applied',
            'QA performed',
            'Playbook written'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
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

  console.log('🎉 AI 30-Day EN course seeded (lessons updated).');
  await mongoose.disconnect();
  console.log('✅ Disconnected');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
