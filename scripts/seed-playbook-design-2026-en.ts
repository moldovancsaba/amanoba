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
  {
    day: 4,
    title: 'Trends vs Principles vs Systems',
    content: `<h1>Trends vs Principles vs Systems</h1>
<p><em>Separate what is temporary (trend), what is timeless (principle), and how to turn it into system rules.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Use 3 signals to decide if something is a trend or a principle.</li>
  <li>Translate any trend into a principle and a system rule.</li>
  <li>Create a “Trend intake” template for the team.</li>
  <li>Select 1–2 trends to adopt with rules, and 1–2 to decline.</li>
  <li>Keep coherence while experimenting.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Trend chasing breaks coherence.</li>
  <li>Principles are timeless; trends are surface-level.</li>
  <li>Without a system, a trend is decoration, not meaning.</li>
  <li>A good system digests a trend without breaking.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Trend</h3>
<ul>
  <li>Short-lived surface (glassmorphism, soft shadows).</li>
  <li>May conflict with accessibility or brand.</li>
  <li>Often lacks functional meaning.</li>
</ul>
<h3>Principle</h3>
<ul>
  <li>Human/perceptual truth (contrast, hierarchy, affordance, readability).</li>
  <li>Holds 10 years from now.</li>
  <li>Every trend hides a principle.</li>
</ul>
<h3>System</h3>
<ul>
  <li>Implemented rule + pattern + doc, tokenized and reusable.</li>
  <li>Turns the principle into decisions.</li>
  <li>Lives in tokens, components, documentation.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Trend:</strong> Glassmorphism</p>
<p><strong>Principle:</strong> Depth, layering, contrast.</p>
<p><strong>System rule:</strong> “Secondary cards only: 85% blur + 6% transparency, min 4.5:1 text contrast.”</p>
<p><strong>Trend:</strong> Brutalist neon CTA</p>
<p><strong>Principle:</strong> Clear affordance, emphasis.</p>
<p><strong>System rule:</strong> “Primary CTA only: #FAB908 bg, #111827 text, 12x16 padding, tilt shadow, no other CTA may use yellow.”</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>List 3 current trends you see in your market.</li>
  <li>For each, write the underlying principle and the risk (contrast, noise, brand-fit).</li>
  <li>Write a system rule for 1 trend (token, component, usage boundaries).</li>
  <li>Create a “Trend intake” template: trend, principle, rule, allowed surfaces, bans, measurement.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Pick 1 trend, apply it to a component state, and document where it is forbidden.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>At least 1 trend translated into principle + system rule.</li>
  <li>Trend intake template exists.</li>
  <li>Forbidden list exists.</li>
  <li>Applied trend passes accessibility checks.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Nielsen Norman Group – Design Trends: <a href="https://www.nngroup.com/articles/design-trends/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/design-trends/</a></li>
  <li>WCAG contrast checker: <a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noreferrer">https://webaim.org/resources/contrastchecker/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 4: Trend or principle?',
    emailBody: `<h1>Playbook 2026 – Day 4</h1>
<p>Turn trends into principles and system rules with a “Trend intake” template.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'How do you distinguish a trend from a principle?',
          options: [
            'Trend is timeless, principle is temporary',
            'Trend is surface-level; principle is a perceptual truth that stays valid',
            'Trend is mandatory, principle optional',
            'No difference',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why is adopting a trend without system riskier?',
          options: [
            'Because it is cheap',
            'Because it can break coherence and accessibility',
            'Because it speeds up dev',
            'Because it is always better',
          ],
          correctIndex: 1,
        },
        {
          question: 'What belongs in a Trend intake template?',
          options: [
            'Just pictures',
            'Trend → principle → rule → where allowed → bans → measurement',
            'Marketing slogans',
            'Price list',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is a good system rule for a trend?',
          options: [
            '“Use everywhere.”',
            '“Secondary cards only: 85% blur + 6% transparency, min 4.5:1 contrast.”',
            '“Make it pretty.”',
            '“Whenever we feel like it.”',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 5,
    title: 'Define Your Visual Intent',
    content: `<h1>Define Your Visual Intent</h1>
<p><em>Create a one-line, measurable Visual Intent Statement that guides every decision.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Write a concise Visual Intent Statement (tone, density, boldness, motion).</li>
  <li>Set 3–5 axes (warm ↔ technical, playful ↔ formal, dense ↔ airy, static ↔ lively, bold ↔ restrained).</li>
  <li>Create good/bad visual examples for the intent.</li>
  <li>Bind the intent to tokens (colors, type weights, spacing, motion timings).</li>
  <li>Place it at the front of the Playbook.</li>
  <li>Ensure every decision checks against the intent.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Gives unified direction, reduces debate.</li>
  <li>Makes every component communicate the same experience.</li>
  <li>Helps decide when to reject a trend.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Visual Intent Statement (VIS)</h3>
<ul>
  <li>1 sentence: “Our visual language is <strong>[mood]</strong> while supporting <strong>[business goal]</strong>; on <strong>[density]</strong>, <strong>[boldness]</strong>, <strong>[motion]</strong> axes we sit here.”</li>
  <li>Make it measurable (e.g., “CTA contrast min 7:1”, “animation 150–250ms ease-in-out”).</li>
</ul>
<h3>Axes</h3>
<ul>
  <li>Warm ↔ Technical</li>
  <li>Friendly ↔ Formal</li>
  <li>Dense ↔ Airy</li>
  <li>Static ↔ Lively</li>
  <li>Bold ↔ Restrained</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Good:</strong> “Visual Intent: Friendly-tech, airy, restrained motion. CTA #FAB908, type Inter/600, spacing 8-12-16, animation 180ms ease.”</p>
<p><strong>Bad:</strong> “Make it cool and startup-ish.” – not measurable.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Write your VIS with 5 axes in one sentence.</li>
  <li>Bind to tokens: primary color pair, type weights, spacing scale, animation timing.</li>
  <li>Add 2 visual examples (good/bad) with short rationale.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Share the VIS with a developer, ask them to apply it to one component (e.g., card) and refine together.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>VIS exists in one sentence.</li>
  <li>VIS tied to tokens and components.</li>
  <li>Good/bad examples exist.</li>
  <li>VIS sits at the front of the Playbook.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>IDEO – Design Language Systems: <a href="https://www.ideo.com/blog/design-language-systems" target="_blank" rel="noreferrer">https://www.ideo.com/blog/design-language-systems</a></li>
  <li>Atlassian Voice & Tone: <a href="https://atlassian.design/foundations/voice-and-tone" target="_blank" rel="noreferrer">https://atlassian.design/foundations/voice-and-tone</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 5: Visual Intent Statement',
    emailBody: `<h1>Playbook 2026 – Day 5</h1>
<p>Write the one-line Visual Intent Statement and tie it to tokens and components.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What makes a good Visual Intent Statement?',
          options: [
            'Long and vague',
            'One sentence with axes, measurable elements, tied to tokens',
            'Only a mood board',
            'Only a font name',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is a valid axis pair?',
          options: [
            'Dense ↔ Airy',
            'Logo ↔ Price',
            'Photo ↔ Icon',
            'Text ↔ Video',
          ],
          correctIndex: 0,
        },
        {
          question: 'Which is the bad example?',
          options: [
            '“Make it cool and startup-ish.”',
            '“Friendly-tech, airy, restrained motion, CTA #FAB908, animation 180ms.”',
            '“Contrast min 7:1.”',
            '“Type Inter/600, spacing 8-12-16.”',
          ],
          correctIndex: 0,
        },
        {
          question: 'Why bind the VIS to tokens?',
          options: [
            'For decoration',
            'To make intent measurable and implementable in components',
            'For marketing copy',
            'To make the doc longer',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 6,
    title: 'Color as Meaning, Not Decoration',
    content: `<h1>Color as Meaning, Not Decoration</h1>
<p><em>Build a semantic color system (brand + functional) with documented contrast and tokens.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Create a semantic color set (brand + functional states).</li>
  <li>Assign contrast values (WCAG 4.5:1 / 7:1).</li>
  <li>Tokenize backgrounds, surfaces, text, borders, states.</li>
  <li>Define bans (where brand color cannot be used).</li>
  <li>Document good/bad examples.</li>
  <li>Tie it to the Visual Intent Statement.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Color carries meaning (affordance, state), not decoration.</li>
  <li>Without contrast, usability fails.</li>
  <li>Without tokens, the system won’t scale.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Semantic space</h3>
<ul>
  <li>Brand: primary, secondary, accent (rare).</li>
  <li>Functional: success, warning, danger, info, neutral.</li>
  <li>Surfaces: background, surface, overlay.</li>
  <li>Text: default, muted, inverse.</li>
</ul>
<h3>Token examples</h3>
<ul>
  <li><code>color.brand.primary</code> = #FAB908</li>
  <li><code>color.text.primary</code> = #111827</li>
  <li><code>color.semantic.success.bg</code> = #DCFCE7</li>
  <li><code>color.semantic.success.text</code> = #166534</li>
  <li><code>color.border.muted</code> = rgba(0,0,0,0.08)</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Brand yellow used for every state → meaning lost, contrast issues.</p>
<p><strong>Good:</strong> Brand yellow only for primary CTA; success green, warning amber, danger red, all contrast-checked.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Map the semantic color space: brand, functional states, surfaces, text.</li>
  <li>Add hex values and contrast checks for text/surface pairs (min 4.5:1 body; 7:1 small text).</li>
  <li>Create a ban list: where brand color is forbidden (e.g., error, disabled, neutral chips).</li>
  <li>Document with good/bad examples.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Apply the color system to one component (e.g., card): background, text, border, hover/focus, state variants.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Semantic set (brand + functional) exists.</li>
  <li>Contrast values documented.</li>
  <li>Token name list exists.</li>
  <li>Ban list exists.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>WCAG 2.2 contrast: <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html</a></li>
  <li>Material 3 Color System: <a href="https://m3.material.io/styles/color/overview" target="_blank" rel="noreferrer">https://m3.material.io/styles/color/overview</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 6: Color system',
    emailBody: `<h1>Playbook 2026 – Day 6</h1>
<p>Build the semantic color system (brand + functional) with contrast and documentation.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why can’t brand color be used everywhere?',
          options: [
            'Because it would look too nice',
            'Because it loses meaning and may fail contrast',
            'Because it is expensive',
            'Because it only works in dark mode',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is the semantic color space?',
          options: [
            'Decorative palette',
            'Brand + functional states + surfaces + text roles',
            'Only background color',
            'Only logo colors',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is the minimum contrast guidance for text?',
          options: [
            '1:1',
            '4.5:1 for normal text (7:1 for small text)',
            '2:1 for everything',
            'No rule',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is a good ban example?',
          options: [
            'Brand yellow for error states',
            'Brand yellow only for primary CTA; error uses red, warning uses amber',
            'Rainbow for every button',
            'No bans at all',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 7,
    title: 'Typography as Hierarchy and Voice',
    content: `<h1>Typography as Hierarchy and Voice</h1>
<p><em>Build the type system: roles, sizes, weights, line-height, line length, rhythm, voice.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Define type roles (display, h1–h6, body, caption, code).</li>
  <li>Set rhythm (line-height, spacing, max line length).</li>
  <li>Tie it to the Visual Intent (tone, formality, density).</li>
  <li>Document good/bad examples.</li>
  <li>Apply it to a screen.</li>
  <li>Make sure all lessons are consistent with this hierarchy.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Type builds hierarchy.</li>
  <li>It conveys voice and trust.</li>
  <li>Line length and rhythm drive readability.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Roles</h3>
<ul>
  <li>Display/Hero (sparingly).</li>
  <li>H1–H6 (structure, 1.2–1.4 line-height).</li>
  <li>Body (14–16px, 1.5–1.7 line-height, 60–75 chars line length).</li>
  <li>Caption/Label (12–13px, stronger contrast).</li>
  <li>Code/Mono (fixed width, shorter line length).</li>
</ul>
<h3>Voice</h3>
<ul>
  <li>Weight: how bold?</li>
  <li>Shape: rounded vs angular.</li>
  <li>Spacing: airy vs dense.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Same size everywhere, no contrast.</p>
<p><strong>Good:</strong> H1 32/40, H2 24/32, body 16/24, caption 12/16, max 70 chars, consistent margins.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Build the type matrix: role, size, line-height, weight, letter-spacing.</li>
  <li>Set max line length (60–75 chars) and heading spacing.</li>
  <li>Bind to the VIS (formal → tighter spacing/heavier weight; friendly → lighter/airier).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Apply to one screen (e.g., hero section), document good/bad comparison.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Roles defined.</li>
  <li>Line length and line-height set.</li>
  <li>Voice tied to VIS.</li>
  <li>Good/bad examples documented.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Better Web Type: <a href="https://betterwebtype.com/articles/" target="_blank" rel="noreferrer">https://betterwebtype.com/articles/</a></li>
  <li>Material 3 Type roles: <a href="https://m3.material.io/styles/typography/overview" target="_blank" rel="noreferrer">https://m3.material.io/styles/typography/overview</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 7: Typography as a system',
    emailBody: `<h1>Playbook 2026 – Day 7</h1>
<p>Build the type system: roles, rhythm, voice, contrast.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is a good line length for body text?',
          options: ['20–30 chars', '60–75 chars', '120+ chars', 'No guidance'],
          correctIndex: 1,
        },
        {
          question: 'Why define type roles?',
          options: [
            'Decoration only',
            'They create hierarchy/voice and consistent decisions',
            'Only for marketing',
            'Only matters in print',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is the bad example?',
          options: [
            'Same size everywhere, no line-height',
            'Body 16/24, H1 32/40, max 70 chars',
            'H2 24/32, caption 12/16',
            'Consistent spacing',
          ],
          correctIndex: 0,
        },
        {
          question: 'Which axis affects type voice?',
          options: ['Warmth/formality', 'Price list', 'Backend language', 'CI/CD'],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 8,
    title: 'Shape, Rhythm, Emotional Cues',
    content: `<h1>Shape, Rhythm, Emotional Cues</h1>
<p><em>Map how shape (round vs angular) and rhythm (repeat/spacing) convey meaning, and avoid visual noise.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Assign meaning to shapes (trust, technical, playful).</li>
  <li>Create rhythm: repetition, modules, consistent gaps.</li>
  <li>Define affordance signals (shadow, border, radius).</li>
  <li>Avoid noise: consistent radii, modular grid.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Shape carries emotion.</li>
  <li>Rhythm guides navigation.</li>
  <li>Inconsistent radius/shadow erodes trust.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Shape meaning</h3>
<ul>
  <li>Round: friendly, safe.</li>
  <li>Angular: technical, assertive.</li>
  <li>Radius scale: xs, sm, md, lg, full — with usage rules.</li>
</ul>
<h3>Rhythm</h3>
<ul>
  <li>Modular unit (e.g., 8px), consistent gaps.</li>
  <li>Shadow/border only when signaling affordance.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Every card with a different radius, random shadows.</p>
<p><strong>Good:</strong> Radius scale: cards md, buttons lg, chips full; shadow only on interactive elements.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Define the radius scale (xs/sm/md/lg/full) and map to components.</li>
  <li>Set rules for when to use shadow/border (affordance rule).</li>
  <li>Create a meaning table: round ↔ friendly, angular ↔ tech.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Apply to a card grid: radius, shadow, gaps, modular rhythm.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Radius scale exists and is mapped to components.</li>
  <li>Shadow/border rules documented.</li>
  <li>Meaning table exists.</li>
  <li>Good/bad examples documented.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>IBM Carbon Shape: <a href="https://carbondesignsystem.com/elements/shape" target="_blank" rel="noreferrer">https://carbondesignsystem.com/elements/shape</a></li>
  <li>Affordance basics: <a href="https://www.nngroup.com/articles/affordances-heuristics/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/affordances-heuristics/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 8: Shape and rhythm',
    emailBody: `<h1>Playbook 2026 – Day 8</h1>
<p>Create shape/rhythm rules with radius/affordance mapping.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is a consistent radius scale?',
          options: [
            'Random radii',
            'Predefined xs–full values mapped to components',
            'Only round buttons',
            'No importance',
          ],
          correctIndex: 1,
        },
        {
          question: 'When to use shadows?',
          options: [
            'Always, for beauty',
            'Only to signal affordance (clickable/elevated)',
            'Never',
            'Only on mobile',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is the wrong pairing?',
          options: [
            'Round ↔ friendly',
            'Angular ↔ technical',
            'Round ↔ cold/hostile',
            'Radius scale ↔ governed usage',
          ],
          correctIndex: 2,
        },
        {
          question: 'What is rhythm based on?',
          options: [
            'Random gaps',
            'Modular unit (e.g., 8px), consistent spacing',
            'Only colors',
            'Only typography',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 9,
    title: 'Motion and Feedback Language',
    content: `<h1>Motion and Feedback Language</h1>
<p><em>Set durations, curves, and state rules so motion supports meaning, not noise.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Define base durations (150–300ms) and easing curves.</li>
  <li>Write state rules (hover, focus, active, success, error).</li>
  <li>Tie motion to the VIS (restrained vs playful).</li>
  <li>Avoid motion noise; prefer meaningful cues.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Without feedback, users feel unsure.</li>
  <li>Too much motion is tiring and risky for accessibility.</li>
  <li>Consistent motion speeds understanding.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Durations</h3>
<ul>
  <li>Micro-interaction: 150–200ms, ease-out.</li>
  <li>Modal/overlay: 200–250ms, ease-in-out.</li>
  <li>Page/route: 250–300ms, ease-in-out.</li>
</ul>
<h3>States</h3>
<ul>
  <li>Hover: subtle light/scale up to 1.02.</li>
  <li>Focus: visible, high-contrast outline.</li>
  <li>Active: slight depression.</li>
  <li>Success/Error: color + icon + short motion (fade/slide).</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> 600ms bounce on every button.</p>
<p><strong>Good:</strong> CTA hover 150ms ease-out, focus ring 3px, active -2px translateY.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Create motion tokens: duration.xs/sm/md, easing.standard/enter/exit.</li>
  <li>Define state rules for CTA (hover/focus/active) and card.</li>
  <li>Add success/error feedback example (icon + color + motion).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Implement one component (CTA) with these rules; record a short clip/gif.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Duration and easing table exists.</li>
  <li>State rules documented.</li>
  <li>Good/bad example exists.</li>
  <li>Accessibility (prefers-reduced-motion) handled.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Material Motion: <a href="https://m3.material.io/styles/motion/overview" target="_blank" rel="noreferrer">https://m3.material.io/styles/motion/overview</a></li>
  <li>Prefers-reduced-motion: <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion" target="_blank" rel="noreferrer">https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 9: Motion and feedback',
    emailBody: `<h1>Playbook 2026 – Day 9</h1>
<p>Write timing/state rules so motion supports meaning.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Typical micro-interaction timing?',
          options: ['50ms', '150–200ms', '600ms', '1s+'],
          correctIndex: 1,
        },
        {
          question: 'Why is excess motion bad?',
          options: [
            'Because it is cheap',
            'It distracts, tires, and may violate accessibility',
            'Because it speeds things up',
            'No effect',
          ],
          correctIndex: 1,
        },
        {
          question: 'Proper focus indication?',
          options: [
            'Invisible',
            'Visible, high-contrast ring (e.g., 3px), consistent rule',
            '600ms bounce',
            'Only hover',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good CTA state rule?',
          options: [
            'Hover 150ms ease-out, active -2px translateY, focus ring',
            'Hover 800ms bounce, active 3x scale',
            'No states',
            'Random timing',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 10,
    title: 'Accessibility as a Design Constraint',
    content: `<h1>Accessibility as a Design Constraint</h1>
<p><em>Embed WCAG basics into the system: contrast, focus, keyboard, motion, alt/labels.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>WCAG basics: contrast, focus, keyboard nav, ARIA.</li>
  <li>Respect prefers-reduced-motion.</li>
  <li>Require alt text and form labels.</li>
  <li>Create a Playbook accessibility checklist.</li>
  <li>Ensure all lessons adhere to these constraints.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Legal, reputational, inclusive.</li>
  <li>Better usability for everyone.</li>
  <li>The system cannot be “pretty but unusable.”</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Contrast: text 4.5:1 (small text 7:1).</li>
  <li>Focus: visible, keyboard reachable.</li>
  <li>Keyboard: tab order, skip link.</li>
  <li>Motion: prefers-reduced-motion.</li>
  <li>ARIA: role, label, describedby basics.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Invisible focus, 2:1 contrast, autoplay animation.</p>
<p><strong>Good:</strong> 4.5:1 contrast, focus ring, tab order, reduce-motion fallback.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Create an A11Y checklist: contrast, focus, tab order, aria-label, alt text.</li>
  <li>Tie it to color/type systems (contrast table).</li>
  <li>Set prefers-reduced-motion fallback.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Audit one screen with the checklist, file issues for gaps.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Checklist ready.</li>
  <li>Contrast and focus rules documented.</li>
  <li>Reduce-motion set.</li>
  <li>Alt/labels mandatory.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>WCAG 2.2 overview: <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noreferrer">https://www.w3.org/WAI/standards-guidelines/wcag/</a></li>
  <li>Deque contrast tools: <a href="https://www.deque.com/blog/color-contrast-accessibility-tools/" target="_blank" rel="noreferrer">https://www.deque.com/blog/color-contrast-accessibility-tools/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 10: Accessibility',
    emailBody: `<h1>Playbook 2026 – Day 10</h1>
<p>Embed WCAG basics: contrast, focus, keyboard, reduce-motion, alt/labels.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Minimum contrast for normal text?',
          options: ['2:1', '4.5:1', '7:1 for everything', 'No rule'],
          correctIndex: 1,
        },
        {
          question: 'Focus rule?',
          options: [
            'Invisible',
            'Visible ring, reachable by tab, consistent',
            'Mouse-only',
            'Mobile-only',
          ],
          correctIndex: 1,
        },
        {
          question: 'Prefers-reduced-motion means?',
          options: [
            'User wants more motion',
            'User wants reduced/none motion; provide a calmer variant',
            'Does not exist',
            'Font setting',
          ],
          correctIndex: 1,
        },
        {
          question: 'What belongs in the A11Y checklist?',
          options: [
            'Contrast, focus, tab order, aria/alt, reduce-motion',
            'Only colors',
            'Only pricing',
            'Only logo',
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
  console.log('Seeded The Playbook 2026 (EN) with first 10 lessons.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
