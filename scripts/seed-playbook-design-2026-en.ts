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
  {
    day: 11,
    title: 'Grids That Survive Scale',
    content: `<h1>Grids That Survive Scale</h1>
<p><em>Build a fixed + fluid grid that survives varied content and breakpoints.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Define grid type (12 columns, 8/12/16 modules, container max-width).</li>
  <li>Handle breakpoints (xs–xl) with consistent rules.</li>
  <li>Create layout tokens (gap, gutter, margin).</li>
  <li>Document examples (card grid, form, dashboard).</li>
  <li>Apply to all courses consistently.</li>
  <li>Ensure quizzes keep the same layout logic.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Without grid, rhythm breaks.</li>
  <li>Scalability: new modules and breakpoints stay predictable.</li>
  <li>Dev speed: known container/gap rules.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Container: 1200–1440px max width, centered, 24px padding.</li>
  <li>Columns: 12 cols, gutter 16–24px.</li>
  <li>Breakpoints: xs 360, sm 640, md 768, lg 1024, xl 1280, 2xl 1440.</li>
  <li>Gap tokens: gap.xs=8, sm=12, md=16, lg=24.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Every page with different max-width and random gaps.</p>
<p><strong>Good:</strong> 12-col grid, unified gutters, consistent breakpoints.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Set container/grid params (columns, gutter, margin).</li>
  <li>Define breakpoints and gap tokens.</li>
  <li>Create two examples: card grid + form on this grid.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Document the grid in the Playbook with links to Figma/Storybook examples.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Container, columns, gutter, breakpoints defined.</li>
  <li>Gap tokens listed.</li>
  <li>Examples documented.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Bootstrap grid: <a href="https://getbootstrap.com/docs/5.3/layout/grid/" target="_blank" rel="noreferrer">https://getbootstrap.com/docs/5.3/layout/grid/</a></li>
  <li>Utopia fluid layouts: <a href="https://utopia.fyi" target="_blank" rel="noreferrer">https://utopia.fyi</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 11: Grid that scales',
    emailBody: `<h1>Playbook 2026 – Day 11</h1>
<p>Build a 12-col, breakpoint-aware grid with gap tokens.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Typical max-width for a desktop container?',
          options: ['600px', '1200–1440px', '320px', 'No max-width'],
          correctIndex: 1,
        },
        {
          question: 'Why unify gutter values?',
          options: [
            'Decoration only',
            'Consistent rhythm and dev speed',
            'Only matters on mobile',
            'Doesn’t matter',
          ],
          correctIndex: 1,
        },
        {
          question: 'What should grid docs include?',
          options: [
            'Only logos',
            'Columns/gutters/margins, breakpoints, examples',
            'Price list',
            'Only text',
          ],
          correctIndex: 1,
        },
        {
          question: 'Which is the good example?',
          options: [
            'Random gap values',
            '12 columns, 16–24px gutter, fixed breakpoints',
            'No breakpoints',
            'Inline grid only',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 12,
    title: 'Spacing as Grammar',
    content: `<h1>Spacing as Grammar</h1>
<p><em>Create a spacing scale that provides rhythm and consistency for every component.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Spacing scale (4/8/12/16/24/32) with rules.</li>
  <li>Vertical rhythm (heading margins) unified.</li>
  <li>Map tokens to components (card padding md, section lg).</li>
  <li>Ban random px values.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Spacing creates calm or density.</li>
  <li>Inconsistency = visual noise.</li>
  <li>Faster build: known padding/gap tokens.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Base unit: 4 or 8.</li>
  <li>Tokens: space.xs=4, sm=8, md=12/16, lg=24, xl=32.</li>
  <li>Vertical rhythm: fixed margins after headings.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> 5, 7, 11 px mixed.</p>
<p><strong>Good:</strong> Only token-based spacing, documented per component.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Create spacing tokens and usage (section padding xl, card padding md).</li>
  <li>Set heading margin rules.</li>
  <li>Apply to a layout and label source tokens.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Audit a page and replace random values with tokens.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Spacing scale exists.</li>
  <li>Vertical rhythm documented.</li>
  <li>Random px removed.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>8pt Grid: <a href="https://builttoadapt.io/intro-to-the-8-point-grid-system-d2573cde8632" target="_blank" rel="noreferrer">https://builttoadapt.io/intro-to-the-8-point-grid-system-d2573cde8632</a></li>
  <li>Atlassian spacing: <a href="https://atlassian.design/foundations/spacing" target="_blank" rel="noreferrer">https://atlassian.design/foundations/spacing</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 12: Spacing grammar',
    emailBody: `<h1>Playbook 2026 – Day 12</h1>
<p>Create a spacing scale and apply it everywhere.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is the point of a spacing scale?',
          options: [
            'Random numbers',
            'Defined values (4/8/12/16/24/32) with rules',
            'Only margin-top',
            'Desktop-only',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why are 5/7/11 px mixes bad?',
          options: [
            'They look ugly',
            'They break consistency and slow dev',
            'They are cheap',
            'They don’t show on mobile',
          ],
          correctIndex: 1,
        },
        {
          question: 'What should spacing docs include?',
          options: [
            'One number',
            'Tokens + usage rules + examples',
            'Only pictures',
            'Only price list',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is vertical rhythm?',
          options: [
            'Random margins',
            'Consistent heading margins and line rhythm',
            'Only color',
            'Not a thing',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 13,
    title: 'Density Modes and Responsiveness',
    content: `<h1>Density Modes and Responsiveness</h1>
<p><em>Define airy/comfort/dense modes and adjust spacing/type per breakpoint or user setting.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>3 density modes: airy/comfort/dense.</li>
  <li>Token-based switching (gap, padding, type size) per breakpoint or user pref.</li>
  <li>Responsive type/spacing table.</li>
  <li>Document examples: table, card grid, form.</li>
  <li>Apply to all courses consistently.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>B2B/dashboard often needs dense mode.</li>
  <li>Mobile airy, desktop efficient.</li>
  <li>Inconsistent density = chaos.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Mode switch: space tokens and type sizes change.</li>
  <li>Airy: space.lg, type +1; Dense: space.sm/md, type -1.</li>
  <li>Usage: data-heavy → dense; marketing → airy.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Same spacing everywhere; tables too airy.</p>
<p><strong>Good:</strong> Dashboard dense: smaller padding/gaps, type -1; marketing airy.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Create a density table: airy/comfort/dense → spacing/type values.</li>
  <li>Set examples: table dense, card comfort, hero airy.</li>
  <li>Document switch rules (where to use each mode).</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Implement one component in two density modes; capture before/after.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Density table exists.</li>
  <li>Examples documented.</li>
  <li>Switch rules defined.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Fluent density: <a href="https://fluent2.microsoft.design/styles/layout#density" target="_blank" rel="noreferrer">https://fluent2.microsoft.design/styles/layout#density</a></li>
  <li>Material responsive layout: <a href="https://m3.material.io/foundations/layout/overview" target="_blank" rel="noreferrer">https://m3.material.io/foundations/layout/overview</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 13: Density & responsiveness',
    emailBody: `<h1>Playbook 2026 – Day 13</h1>
<p>Define airy/comfort/dense modes with a responsive table.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why multiple density modes?',
          options: [
            'Decoration',
            'Different contexts (dashboard vs marketing) need different density',
            'Only mobile',
            'No need',
          ],
          correctIndex: 1,
        },
        {
          question: 'Dense mode traits?',
          options: [
            'Large gaps and type',
            'Smaller padding/gap, smaller type',
            'Random values',
            'Color-only change',
          ],
          correctIndex: 1,
        },
        {
          question: 'What should the density table contain?',
          options: [
            'Prices',
            'Spacing/type values for airy/comfort/dense',
            'Only logos',
            'Only images',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good example?',
          options: [
            'Table in airy mode',
            'Dashboard dense: smaller padding/gap, type -1',
            'Every component identical',
            'No switching',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 14,
    title: 'Visual Hierarchy Under Pressure',
    content: `<h1>Visual Hierarchy Under Pressure</h1>
<p><em>Keep hierarchy when information is dense (dashboards, lists, cards).</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Hierarchy tools: size, weight, contrast, spacing, color, icon.</li>
  <li>List/card hierarchy template.</li>
  <li>Overload reduction rules (truncate, progressive disclosure).</li>
  <li>Document good/bad examples.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Heavy data → attention breaks.</li>
  <li>Hierarchy guides to the signal.</li>
  <li>Poor lists/cards erode trust.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Use type (size/weight), color sparingly, spacing, icon, background.</li>
  <li>Progressive disclosure: show less, reveal more on action.</li>
  <li>Truncate + tooltip for long content.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Same size/weight, random colors.</p>
<p><strong>Good:</strong> Title 16/20 bold, meta 12/16 muted, spacing tokens, status icon only where needed.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Create list/card hierarchy template (title, meta, badge, action).</li>
  <li>Write rules: when to truncate vs multi-line.</li>
  <li>Document good/bad example.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Apply to a dashboard widget; capture before/after.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Hierarchy template exists.</li>
  <li>Truncate/progressive rules set.</li>
  <li>Good/bad examples documented.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>NNG list design: <a href="https://www.nngroup.com/articles/lists/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/lists/</a></li>
  <li>Progressive disclosure: <a href="https://www.nngroup.com/articles/progressive-disclosure/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/progressive-disclosure/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 14: Hierarchy under pressure',
    emailBody: `<h1>Playbook 2026 – Day 14</h1>
<p>Build list/card hierarchy templates and reduction rules.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Hierarchy tools?',
          options: [
            'Color only',
            'Type size/weight, spacing, restrained color, icon, background',
            'Random italics',
            'Icons only',
          ],
          correctIndex: 1,
        },
        {
          question: 'Progressive disclosure is…',
          options: [
            'Show everything at once',
            'Show less, reveal more on action',
            'Hide everything',
            'Desktop-only',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            'Same size/weight everywhere',
            'Title 16/20 bold, meta 12/16 muted',
            'Spacing tokens applied',
            'Status icon only where needed',
          ],
          correctIndex: 0,
        },
        {
          question: 'When to truncate?',
          options: [
            'When content is long and space is limited; tooltip or “more”',
            'Never',
            'Always',
            'Only on mobile',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 15,
    title: 'Designing for Unknown Content',
    content: `<h1>Designing for Unknown Content</h1>
<p><em>Keep structure when content length varies or is unknown.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Placeholder and empty-state rules.</li>
  <li>Variable title length, multilingual handling (wrap/truncate).</li>
  <li>Loading states: skeleton vs spinner.</li>
  <li>Documented patterns for cards, lists, tables.</li>
  <li>Apply the same rules across all courses/lessons.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Real data differs from mocks.</li>
  <li>Layouts shouldn’t break while loading.</li>
  <li>Multilingual text can expand.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Text handling: wrap up to 2 lines, then truncate + tooltip/link.</li>
  <li>Empty state: icon + short message + CTA.</li>
  <li>Skeleton: stable dimensions, avoid layout shifts.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Long title overflows, layout breaks.</p>
<p><strong>Good:</strong> Max 2 lines then ellipsis; empty state defined.</p>
<hr />
<h2>Guided Exercise (10–15 minutes)</h2>
<ol>
  <li>Create text-handling rules (wrap/truncate) for cards and lists.</li>
  <li>Define empty-state component (icon, text, CTA).</li>
  <li>Write skeleton usage rules.</li>
</ol>
<h2>Independent Exercise (5–10 minutes)</h2>
<p>Apply to multilingual content (e.g., German/English) and capture outcomes.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Wrap/truncate rules exist.</li>
  <li>Empty state documented.</li>
  <li>Skeleton rules set.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Empty states: <a href="https://www.nngroup.com/articles/empty-state/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/empty-state/</a></li>
  <li>Skeletons vs spinners: <a href="https://uxdesign.cc/skeleton-screens-what-to-use-instead-of-the-loading-spinner-2fd0f5f4bd2e" target="_blank" rel="noreferrer">https://uxdesign.cc/skeleton-screens-what-to-use-instead-of-the-loading-spinner-2fd0f5f4bd2e</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 15: Unknown content',
    emailBody: `<h1>Playbook 2026 – Day 15</h1>
<p>Handle unknown/variable content: wrap/truncate, empty state, skeleton.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'How to handle long titles?',
          options: [
            'Let them overflow',
            'Max 1–2 lines, then truncate + tooltip',
            'Force one line always',
            'No rule',
          ],
          correctIndex: 1,
        },
        {
          question: 'What’s a good empty state?',
          options: [
            'Blank screen',
            'Icon + short message + CTA',
            'Advertisement',
            'Random text',
          ],
          correctIndex: 1,
        },
        {
          question: 'When to use skeleton instead of spinner?',
          options: [
            'When you want stable layout during load',
            'Never',
            'Always spinner',
            'Mobile-only',
          ],
          correctIndex: 0,
        },
        {
          question: 'Bad example?',
          options: [
            'Long title breaks layout',
            'Ellipsis after 2 lines with tooltip',
            'Empty state with CTA',
            'Skeleton with fixed size',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 16,
    title: 'Think in Components, Not Pages',
    content: `<h1>Think in Components, Not Pages</h1>
<p><em>Design in component APIs—states, boundaries, usage rules—instead of one-off pages.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Define component API: required/optional props, events, states.</li>
  <li>Set responsibility boundaries: what it does and does not do.</li>
  <li>Usage rules: where it must not be used.</li>
  <li>Document good/bad examples.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Page-centric work creates duplication.</li>
  <li>Components give reuse and consistency.</li>
  <li>Clear API keeps the system stable.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>API: props, events, states.</li>
  <li>Responsibility: what it never does (e.g., Card does not fetch data).</li>
  <li>Docs: examples + “don’t use here”.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Every page builds a unique card.</p>
<p><strong>Good:</strong> Card with API, states, documented limits.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Pick a UI element (card, input group); write its API.</li>
  <li>List states (hover, focus, error, loading).</li>
  <li>Write prohibitions (where not allowed).</li>
</ol>
<h2>Independent Exercise</h2>
<p>Document the component API in the Playbook with Figma/Storybook links.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>API written.</li>
  <li>States mapped.</li>
  <li>Ban list exists.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Atomic design: <a href="https://bradfrost.com/blog/post/atomic-web-design/" target="_blank" rel="noreferrer">https://bradfrost.com/blog/post/atomic-web-design/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 16: Component thinking',
    emailBody: `<h1>Playbook 2026 – Day 16</h1>
<p>Think in component APIs instead of pages.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is a component API?',
          options: [
            'Random props',
            'Defined props/events/states',
            'Only CSS',
            'Only images',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why is page thinking insufficient?',
          options: [
            'Slower builds',
            'Creates duplication and inconsistency',
            'Costs more',
            'Doesn’t work on mobile',
          ],
          correctIndex: 1,
        },
        {
          question: 'What is a responsibility boundary?',
          options: [
            'What the component does not do',
            'Price list',
            'CI/CD',
            'Nothing',
          ],
          correctIndex: 0,
        },
        {
          question: 'What should you document?',
          options: [
            'API + states + bans + examples',
            'Only colors',
            'Only type',
            'Only price',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 17,
    title: 'Token Architecture',
    content: `<h1>Token Architecture</h1>
<p><em>Introduce token layers: base → semantic → component; multi-platform outputs.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Token layers: base (primitive), semantic, component.</li>
  <li>Naming: color.brand.primary, space.md, radius.sm.</li>
  <li>Export to web/ios/android (e.g., Style Dictionary).</li>
  <li>Document pipeline and bans (UI should not use base directly).</li>
  <li>Apply consistently across courses.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Tokens are the single source of truth.</li>
  <li>Cross-platform consistency.</li>
  <li>Fast change: one token update propagates.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Base: raw value (#FAB908, 8px).</li>
  <li>Semantic: role (color.semantic.success.bg).</li>
  <li>Component: usage (button.primary.bg).</li>
  <li>Pipeline: JSON → build → platform outputs.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Hard-coded hex in CSS.</p>
<p><strong>Good:</strong> color.brand.primary token referenced everywhere.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Write token naming schema (base/semantic/component).</li>
  <li>Create 10 sample tokens (color, space, radius, motion, z-index).</li>
  <li>Define the ban: UI uses semantic/component only.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Replace hard-coded values with tokens on one screen.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Layers defined.</li>
  <li>Naming set.</li>
  <li>Base → semantic → component chain works.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Style Dictionary: <a href="https://amzn.github.io/style-dictionary/#/" target="_blank" rel="noreferrer">https://amzn.github.io/style-dictionary/#/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 17: Token architecture',
    emailBody: `<h1>Playbook 2026 – Day 17</h1>
<p>Build base/semantic/component token layers.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Three token layers?',
          options: ['Base, semantic, component', 'CSS, HTML, JS', 'Dev, QA, Prod', 'None'],
          correctIndex: 0,
        },
        {
          question: 'Why avoid base tokens directly in UI?',
          options: [
            'Slow',
            'Semantic/component provide roles and safe switching',
            'Expensive',
            'Unsupported',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good naming example?',
          options: ['color1', 'color.brand.primary', 'random_hex', 'anything'],
          correctIndex: 1,
        },
        {
          question: 'Pipeline purpose?',
          options: [
            'Export tokens to platforms',
            'Marketing',
            'Log collection',
            'Build without CI',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 18,
    title: 'Variants and State Logic',
    content: `<h1>Variants and State Logic</h1>
<p><em>Define component variants and states in a matrix: size, type, state.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Variant matrix: size (sm/md/lg), type (primary/secondary/ghost), state (default/hover/focus/active/disabled/loading).</li>
  <li>State rules: what changes (color, border, shadow, icon).</li>
  <li>Disable/Loading: block interaction, consider skeleton.</li>
  <li>Document examples and bans.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Variance without rules breaks systems.</li>
  <li>State logic = affordance.</li>
  <li>Dev can build from a table.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Matrix: rows = states, cols = variants.</li>
  <li>Rule: what does NOT change (radius fixed, type consistent).</li>
  <li>Disabled: lower contrast, default cursor, no shadow.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Hover sometimes darkens, sometimes lightens.</p>
<p><strong>Good:</strong> Table with fixed colors/shadows per state.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Build a button variant-state table.</li>
  <li>List changes per state.</li>
  <li>Document bans (e.g., ghost+disabled contrast rule).</li>
</ol>
<h2>Independent Exercise</h2>
<p>Implement a component from the table; capture each state.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Matrix done.</li>
  <li>Rules consistent.</li>
  <li>Docs linked.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>ARIA states: <a href="https://www.w3.org/TR/wai-aria-1.2/#states_and_properties" target="_blank" rel="noreferrer">https://www.w3.org/TR/wai-aria-1.2/#states_and_properties</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 18: Variants & states',
    emailBody: `<h1>Playbook 2026 – Day 18</h1>
<p>Build a variant-state matrix with consistent rules.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is a variant-state matrix?',
          options: [
            'Random table',
            'Variants x states with rules',
            'Price list',
            'Nothing',
          ],
          correctIndex: 1,
        },
        {
          question: 'What should NOT change?',
          options: [
            'Radius and type remain consistent',
            'Everything random',
            'Component name',
            'Only border',
          ],
          correctIndex: 0,
        },
        {
          question: 'Disabled rule?',
          options: [
            'No rule',
            'Lower contrast, default cursor, shadow off, interaction blocked',
            'Stronger hover',
            'Random',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why document?',
          options: [
            'No need',
            'Dev can build from table; keeps consistency',
            'Marketing only',
            'Just for design review',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 19,
    title: 'Cross-Platform Consistency',
    content: `<h1>Cross-Platform Consistency</h1>
<p><em>Align tokens, components, and patterns across web/iOS/Android.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Platform mapping: what is shared, what is native-specific.</li>
  <li>Token export to web/ios/android.</li>
  <li>Component divergence rules: when allowed (e.g., date picker).</li>
  <li>Document examples and bans.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Users expect native patterns but same brand.</li>
  <li>Single source reduces maintenance.</li>
  <li>Diverge only with rationale.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Shared: color, type, icons, tone.</li>
  <li>Different: navigation patterns, native inputs.</li>
  <li>Rule: documented divergence + reason + tracking.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Web and mobile use different brand palettes.</p>
<p><strong>Good:</strong> Same brand tokens; native navigation allowed.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Create platform mapping table: shared elements, divergent patterns.</li>
  <li>Define divergence approval process.</li>
  <li>Document token export pipeline.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Pick a component (modal) and note platform differences.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Platform mapping exists.</li>
  <li>Divergences documented and justified.</li>
  <li>Token export known.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Apple HIG: <a href="https://developer.apple.com/design/human-interface-guidelines/" target="_blank" rel="noreferrer">https://developer.apple.com/design/human-interface-guidelines/</a></li>
  <li>Material (Android): <a href="https://m3.material.io" target="_blank" rel="noreferrer">https://m3.material.io</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 19: Cross-platform consistency',
    emailBody: `<h1>Playbook 2026 – Day 19</h1>
<p>Keep brand tokens consistent while respecting native patterns.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What is shared across platforms?',
          options: [
            'Brand color, type, icons, tone',
            'Nothing',
            'Only price list',
            'Only logo',
          ],
          correctIndex: 0,
        },
        {
          question: 'When can you diverge?',
          options: [
            'If documented, justified, approved',
            'Any time',
            'Never',
            'Web-only',
          ],
          correctIndex: 0,
        },
        {
          question: 'Purpose of mapping table?',
          options: [
            'Decoration',
            'Record shared/divergent elements for decisions',
            'Price list',
            'Nothing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            'Different brand palettes per platform',
            'Same brand tokens, native nav allowed',
            'Token export everywhere',
            'Documented divergence',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 20,
    title: 'Naming and System Hygiene',
    content: `<h1>Naming and System Hygiene</h1>
<p><em>Set naming conventions, versioning, and cleanup cadence for the design system.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Naming for components/tokens (kebab/camel, prefixes).</li>
  <li>Versioning (semver-like) and changelog rule.</li>
  <li>Deprecation: mark, deadline, replacement.</li>
  <li>Monthly hygiene checklist.</li>
  <li>Apply across all Playbook assets.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Without hygiene the system rots.</li>
  <li>Newcomers ramp faster.</li>
  <li>Deprecation prevents cruft.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Naming: component.button.primary, token color.brand.primary.</li>
  <li>Versioning: semver-ish, release note required.</li>
  <li>Deprecation: flag + replacement link + timeline.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “New Button Final FINAL”.</p>
<p><strong>Good:</strong> button/primary/v1.2 + changelog + deprecated button/legacy/primary.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Create naming table (component, token, file).</li>
  <li>Write a changelog template.</li>
  <li>Define deprecation process.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Run a hygiene audit on one component family; mark deprecated items.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Naming exists.</li>
  <li>Changelog template ready.</li>
  <li>Deprecation documented.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Semver: <a href="https://semver.org" target="_blank" rel="noreferrer">https://semver.org</a></li>
  <li>Design system maintenance: <a href="https://uxdesign.cc/maintaining-design-systems-7d3c34c3f0c3" target="_blank" rel="noreferrer">https://uxdesign.cc/maintaining-design-systems-7d3c34c3f0c3</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 20: Naming & hygiene',
    emailBody: `<h1>Playbook 2026 – Day 20</h1>
<p>Set naming, versioning, and deprecation rules.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why naming conventions?',
          options: [
            'Decoration',
            'Searchability, consistency, onboarding',
            'Marketing only',
            'Not needed',
          ],
          correctIndex: 1,
        },
        {
          question: 'Deprecation process?',
          options: [
            'Delete immediately',
            'Mark deprecated, set deadline, provide replacement',
            'Leave it',
            'Only ping Slack',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad naming example?',
          options: [
            'New Button Final FINAL',
            'button/primary/v1.2',
            'color.brand.primary',
            'space.md',
          ],
          correctIndex: 0,
        },
        {
          question: 'What belongs in a changelog?',
          options: [
            'Change, date, version, impact',
            'Only date',
            'Only author',
            'Nothing',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 21,
    title: 'Managing Design Debt and Entropy',
    content: `<h1>Managing Design Debt and Entropy</h1>
<p><em>Detect, measure, and reduce design debt with a repeatable cadence.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Define design debt and signals.</li>
  <li>Metrics: duplicated components, token anomalies, missing states.</li>
  <li>Impact × effort matrix.</li>
  <li>Debt backlog and monthly reduction ritual.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Debt raises cost and risk.</li>
  <li>Measurement unlocks resourcing.</li>
  <li>Reduced debt → faster releases, better UX.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Signals: duplicate button variants, inconsistent colors, undocumented states.</li>
  <li>Metrics: “divergences per 100 screens”, “non-tokenized values count”.</li>
  <li>Process: audit → backlog → fix X tickets per sprint.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “Feels messy” with no list.</p>
<p><strong>Good:</strong> Debt table, quantified, monthly quota.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Create a debt audit template (item, issue type, impact, estimate).</li>
  <li>Audit 5 screens and fill the table.</li>
  <li>Set a monthly quota (e.g., 3 debt tickets per sprint).</li>
</ol>
<h2>Independent Exercise</h2>
<p>Present the numbers to the team and get commitment to the quota.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Debt table exists.</li>
  <li>Impact × effort prioritization set.</li>
  <li>Monthly quota defined.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>NNG design debt: <a href="https://www.nngroup.com/articles/design-debt/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/design-debt/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 21: Design debt',
    emailBody: `<h1>Playbook 2026 – Day 21</h1>
<p>Audit and reduce design debt with a monthly quota.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Design debt signals?',
          options: [
            'Documented components',
            'Duplicate variants, inconsistent colors, missing states',
            'Fast releases',
            'Good contrast',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why measure debt?',
          options: [
            'No need',
            'For resourcing and prioritization',
            'Decoration',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good process?',
          options: [
            'Fix by gut feel',
            'Audit → backlog → monthly quota',
            'Never fix',
            'Only meetings',
          ],
          correctIndex: 1,
        },
        {
          question: 'Example metric?',
          options: [
            'Revenue only',
            'Divergences/100 screens, non-tokenized values',
            'Weather',
            'None',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 22,
    title: 'Change Management for the Design System',
    content: `<h1>Change Management for the Design System</h1>
<p><em>Run releases with RFC, review, QA, and communication.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Change flow: RFC → review → QA → release.</li>
  <li>Owners: design, engineering, QA.</li>
  <li>Changelog and versioning are mandatory.</li>
  <li>Communication: release notes + enablement.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Uncontrolled changes break the system.</li>
  <li>Transparency builds trust.</li>
  <li>Helps adoption.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>RFC: problem, proposal, impact.</li>
  <li>Review: design + dev + a11y.</li>
  <li>QA: visual + functional + a11y.</li>
  <li>Release: version, changelog, rollout plan.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Button changed from a Slack ping.</p>
<p><strong>Good:</strong> RFC → review → QA → changelog → comms.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Create an RFC template.</li>
  <li>Write a release note sample.</li>
  <li>Define owner roles.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Run an upcoming change through the RFC flow.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>RFC template exists.</li>
  <li>Release note sample exists.</li>
  <li>Owners are clear.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Design system governance: <a href="https://www.designsystems.com/governance" target="_blank" rel="noreferrer">https://www.designsystems.com/governance</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 22: Change management',
    emailBody: `<h1>Playbook 2026 – Day 22</h1>
<p>Enforce RFC → review → QA → release with comms.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'RFC should include?',
          options: [
            'Only date',
            'Problem, proposal, impact',
            'Price list',
            'Nothing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why changelog?',
          options: [
            'Not needed',
            'Traceability, comms, audit',
            'Decoration',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            'Slack ping → change',
            'RFC → review → QA → release note',
            'Owner assignment',
            'A11y test',
          ],
          correctIndex: 0,
        },
        {
          question: 'Who are owners?',
          options: [
            'Design + dev + QA roles defined',
            'Anyone random',
            'Marketing only',
            'Nobody',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 23,
    title: 'Review and Approval Workflow',
    content: `<h1>Review and Approval Workflow</h1>
<p><em>Set up design/dev reviews with checklists and statuses.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Review types: visual, UX, a11y, technical.</li>
  <li>Checklists and statuses (draft, review, approved, released).</li>
  <li>Blocking vs non-blocking comments.</li>
  <li>Process SLAs.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Quality requires reviews.</li>
  <li>No SLA → review delays.</li>
  <li>Checklists reduce mistakes.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Status: draft → review → approved → released.</li>
  <li>Checklist: contrast, states, token use, i18n, performance.</li>
  <li>Blocking = must fix; non-blocking = suggestion.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “No time for review, ship it.”</p>
<p><strong>Good:</strong> Checklist, status, SLA, blocking labels.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Create a review checklist.</li>
  <li>Define the status workflow.</li>
  <li>Set an SLA (e.g., 48h feedback).</li>
</ol>
<h2>Independent Exercise</h2>
<p>Run an active ticket through the workflow and document learning.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Checklist ready.</li>
  <li>Workflow documented.</li>
  <li>SLA defined.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Design critique: <a href="https://uxdesign.cc/a-practical-guide-to-design-critiques-e462f48f7083" target="_blank" rel="noreferrer">https://uxdesign.cc/a-practical-guide-to-design-critiques-e462f48f7083</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 23: Review workflow',
    emailBody: `<h1>Playbook 2026 – Day 23</h1>
<p>Run reviews with checklists, statuses, and SLAs.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why SLA for reviews?',
          options: [
            'Decoration',
            'Sets a feedback deadline, avoids delays',
            'Marketing',
            'Not needed',
          ],
          correctIndex: 1,
        },
        {
          question: 'Blocking comment?',
          options: [
            'Optional',
            'Stops release until fixed',
            'Only praise',
            'Marketing copy',
          ],
          correctIndex: 1,
        },
        {
          question: 'Checklist items?',
          options: [
            'Contrast, states, tokens, i18n, performance',
            'Only colors',
            'Only price',
            'None',
          ],
          correctIndex: 0,
        },
        {
          question: 'Good workflow order?',
          options: [
            'Draft → Review → Approved → Released',
            'Approved → Draft → Released',
            'Released → Review',
            'No order',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 24,
    title: 'Teaching the System to the Team',
    content: `<h1>Teaching the System to the Team</h1>
<p><em>Enablement plan: training, office hours, docs, examples.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Enablement pack (guide, video, examples).</li>
  <li>Office hours and support channel.</li>
  <li>Use-case walkthroughs.</li>
  <li>Metrics: adoption, tickets, reuse rate.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>A system lives only if adopted.</li>
  <li>Without training, chaos returns.</li>
  <li>Without metrics, you can’t see impact.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Enablement: short video + PDF + Figma links.</li>
  <li>Office hours: weekly 1–2h for questions.</li>
  <li>Metrics: reuse %, support ticket trend.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “Here’s a link, good luck.”</p>
<p><strong>Good:</strong> Kickoff, video, examples, office hours, Q&A.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Create an enablement checklist.</li>
  <li>Schedule office hours.</li>
  <li>Define metrics.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Run a 20-minute walkthrough for a new component; collect feedback.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Enablement pack ready.</li>
  <li>Office hours communicated.</li>
  <li>Metrics in place.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>DesignOps enablement: <a href="https://designops.community" target="_blank" rel="noreferrer">https://designops.community</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 24: Teaching the system',
    emailBody: `<h1>Playbook 2026 – Day 24</h1>
<p>Enablement pack, office hours, and metrics for adoption.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why enablement?',
          options: [
            'Not needed',
            'Without adoption the system dies',
            'Decoration',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'What goes in the pack?',
          options: [
            'Short guide, video, examples, links',
            'Only a logo',
            'Only prices',
            'Nothing',
          ],
          correctIndex: 0,
        },
        {
          question: 'What to measure?',
          options: [
            'Reuse %, ticket trend',
            'Revenue only',
            'Weather',
            'Nothing',
          ],
          correctIndex: 0,
        },
        {
          question: 'Bad example?',
          options: [
            'Kickoff + video + office hours',
            '“Here’s a link, good luck”',
            'Measured adoption',
            'Q&A session',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 25,
    title: 'Measuring Visual Quality',
    content: `<h1>Measuring Visual Quality</h1>
<p><em>Create a scorecard and recurring audits for visual quality.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Scorecard: contrast, hierarchy, states, token compliance, a11y.</li>
  <li>Sampling: random screen audits.</li>
  <li>Trend tracking: monthly averages.</li>
  <li>Publishing: share results with the team.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>What gets measured improves.</li>
  <li>Transparency drives discipline.</li>
  <li>Shows value to stakeholders.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
  <li>Score 1–5 per criterion.</li>
  <li>Sample: 5 random screens weekly.</li>
  <li>Publish: dashboard or monthly note.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “Looks fine to me.”</p>
<p><strong>Good:</strong> Scorecard, trend chart, actions.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Create a scorecard with 5 criteria.</li>
  <li>Audit 5 screens and compute average.</li>
  <li>Publish a short report.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Schedule a monthly audit and add an automatic reminder.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Scorecard exists.</li>
  <li>Sample audit done.</li>
  <li>Results published.</li>
</ul>
<hr />
<h2>Optional Deepening</h2>
<ul>
  <li>Design QA: <a href="https://www.nngroup.com/articles/design-quality-assurance/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/design-quality-assurance/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 25: Measuring quality',
    emailBody: `<h1>Playbook 2026 – Day 25</h1>
<p>Set a scorecard and recurring audits for visual quality.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why measure visual quality?',
          options: [
            'Decoration',
            'Measured → improves; transparency → discipline',
            'Marketing only',
            'No need',
          ],
          correctIndex: 1,
        },
        {
          question: 'What goes on the scorecard?',
          options: [
            'Contrast, hierarchy, states, token compliance, a11y',
            'Only logo',
            'Only price',
            'Nothing',
          ],
          correctIndex: 0,
        },
        {
          question: 'Good sampling?',
          options: [
            'One screen forever',
            '5 random screens weekly',
            'Never audit',
            'Once after launch only',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            '“Looks fine to me.”',
            'Scorecard + trend + actions',
            'Published results',
            'Scheduled audit',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 26,
    title: 'Selecting the Capstone Product',
    content: `<h1>Selecting the Capstone Product</h1>
<p><em>Pick a live product to apply the Playbook for real.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Selection criteria: availability, business priority, stakeholder support.</li>
  <li>Define scope (screens, platforms).</li>
  <li>Set owners and timeline.</li>
  <li>Fix the criteria and be prepared to apply.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Without a real product the Playbook stays theory.</li>
  <li>Priority gives focus and buy-in.</li>
  <li>Scope controls risk.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “We’ll see.”</p>
<p><strong>Good:</strong> Dashboard + mobile web, 6 key screens, 4 weeks, PM/Dev/Design owners.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>List 3 candidate products and score them.</li>
  <li>Pick one, define scope (screen list).</li>
  <li>Set timeline and owners.</li>
  <li>Get stakeholder sign-off.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Record the decision in the Playbook intro and share with the team.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Product + scope chosen.</li>
  <li>Owners and timeline set.</li>
  <li>Stakeholder buy-in secured.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 26: Capstone product',
    emailBody: `<h1>Playbook 2026 – Day 26</h1>
<p>Pick a live product, scope, owners, and timeline.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Good selection criteria?',
          options: [
            '“Looks cool”',
            'Availability + business priority + stakeholder support',
            'Design-only view',
            'Dev-only view',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why scope?',
          options: [
            'No need',
            'Controls risk and focus',
            'Decoration',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Bad example?',
          options: [
            '“We’ll see.”',
            '6 key screens, 4 weeks, owners',
            'Stakeholder buy-in',
            'Scoped list',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 27,
    title: 'Mapping the Current Visual Chaos',
    content: `<h1>Mapping the Current Visual Chaos</h1>
<p><em>Create a UI inventory: components, colors, type, states, divergences.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>UI inventory (color, type, radius, shadow, icon, state).</li>
  <li>Divergence list vs Playbook.</li>
  <li>Must/Should/Nice categorization.</li>
  <li>Quantify issue types.</li>
  <li>Capture unified criteria.</li>
  <li>Be ready to capture and define visual inventories</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>You can’t fix what you don’t see.</li>
  <li>Numbers drive prioritization.</li>
  <li>Data builds trust.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> “Lots of random colors.”</p>
<p><strong>Good:</strong> 27 unique blues, 5 radius variants; must/should/nice split.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Export 10 screens; build an inventory table.</li>
  <li>Mark divergences vs Playbook.</li>
  <li>Bucket into must/should/nice.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Share a short report with the counts.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Inventory exists.</li>
  <li>Divergences quantified.</li>
  <li>Prior buckets ready.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 27: Map the chaos',
    emailBody: `<h1>Playbook 2026 – Day 27</h1>
<p>Build a UI inventory and quantify divergences.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Inventory goal?',
          options: [
            'Decoration',
            'See and quantify divergences',
            'Marketing',
            'Nothing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good example?',
          options: [
            '“Random colors.”',
            '“27 blues, 5 radius variants, must/should/nice.”',
            'No data',
            'Only feelings',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why categorize?',
          options: [
            'No need',
            'To prioritize and plan effort',
            'Decoration',
            'Marketing',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 28,
    title: 'Extracting and Normalizing the System',
    content: `<h1>Extracting and Normalizing the System</h1>
<p><em>Resolve divergences: choose final tokens, component variants, and states.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Select final token set (color, type, spacing, radius, shadow).</li>
  <li>Reduce component variants to the essentials.</li>
  <li>Unify states.</li>
  <li>Deprecation list and migration plan.</li>
  <li>Dev-aligned implementation plan.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Extra variants cost to maintain.</li>
  <li>Unification speeds delivery and improves quality.</li>
  <li>Without deprecation chaos returns.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Keep 5 CTA styles “just in case.”</p>
<p><strong>Good:</strong> 2 CTA variants, documented bans, deprecation plan.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Pick final token values from inventory.</li>
  <li>Reduce component variants; make a matrix.</li>
  <li>Write deprecation and comms plan.</li>
</ol>
<h2>Independent Exercise</h2>
<p align="justify">Align with a developer on migration order.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Final token list ready.</li>
  <li>Variant reduction documented.</li>
  <li>Deprecation plan exists.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 28: Normalize',
    emailBody: `<h1>Playbook 2026 – Day 28</h1>
<p>Reduce variants, finalize tokens, deprecate old ones.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why reduce variants?',
          options: [
            'No need',
            'Cost, quality, speed',
            'Decoration',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good example?',
          options: [
            'Keep 5 CTA variants',
            '2 CTA variants + bans + deprecation plan',
            'No docs',
            'Only feelings',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why deprecation plan?',
          options: [
            'No need',
            'Retire old variants safely',
            'Decoration',
            'Marketing',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 29,
    title: 'Assembling the Playbook',
    content: `<h1>Assembling the Playbook</h1>
<p><em>Compile the final Playbook: structure, links, examples, changelog.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Finalize TOC.</li>
  <li>Link Figma/Storybook, token exports, examples.</li>
  <li>Set changelog and version.</li>
  <li>Publish channels (Notion/Confluence/repo).</li>
  <li>Document format: Markdown + live links.</li>
  <li>Prepare for publishing the course.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>One place, easy to use.</li>
  <li>Versioning prevents rot.</li>
  <li>Links keep sources accessible.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Scattered files, no version.</p>
<p><strong>Good:</strong> Markdown TOC, live links, changelog, v1.0 tag.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Build the TOC with final sections.</li>
  <li>Link sources (Figma, Storybook, token JSON).</li>
  <li>Write v1.0 changelog entry.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Publish the Playbook and request final review.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>TOC ready.</li>
  <li>Links live.</li>
  <li>Changelog written.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 29: Assemble',
    emailBody: `<h1>Playbook 2026 – Day 29</h1>
<p>Assemble the final Playbook with links and version.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Why version number?',
          options: [
            'Decoration',
            'Traceability and update control',
            'Marketing',
            'No need',
          ],
          correctIndex: 1,
        },
        {
          question: 'What belongs in the Playbook?',
          options: [
            'TOC, links, changelog, version',
            'Only pictures',
            'Only price',
            'Nothing',
          ],
          correctIndex: 0,
        },
        {
          question: 'Bad example?',
          options: [
            'Scattered files, no version',
            'Markdown + live links',
            'Changelog v1.0',
            'Published doc',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 30,
    title: 'Final Presentation and Rollout',
    content: `<h1>Final Presentation and Rollout</h1>
<p><em>Present the Playbook with rollout plan and metrics.</em></p>
<hr />
<h2>Learning Goal</h2>
<ul>
  <li>Deck: problem → solution → benefits.</li>
  <li>Rollout plan: timeline, milestones, owners.</li>
  <li>Success metrics: adoption, defect drop, reuse rate.</li>
  <li>Feedback channels.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
  <li>Without buy-in and rollout, the system stays on a shelf.</li>
  <li>Metrics show impact.</li>
  <li>Feedback drives v1.1.</li>
</ul>
<hr />
<h2>Examples</h2>
<p><strong>Bad:</strong> Emailing a PDF, no follow-up.</p>
<p><strong>Good:</strong> 20-min demo, rollout schedule, metrics, feedback loop.</p>
<hr />
<h2>Guided Exercise</h2>
<ol>
  <li>Create a 10–15 slide deck.</li>
  <li>Write a rollout schedule (weekly milestones).</li>
  <li>Define metrics and a dashboard.</li>
</ol>
<h2>Independent Exercise</h2>
<p>Run a demo, collect feedback, plan v1.1 fixes.</p>
<hr />
<h2>Self-Check</h2>
<ul>
  <li>Deck ready.</li>
  <li>Rollout plan ready.</li>
  <li>Metrics and feedback channels set.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – Day 30: Rollout',
    emailBody: `<h1>Playbook 2026 – Day 30</h1>
<p>Present the Playbook, rollout plan, and metrics.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'What should the final deck cover?',
          options: [
            'Logo only',
            'Problem, solution, benefits, metrics',
            'Only price',
            'Nothing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Why rollout plan?',
          options: [
            'No need',
            'Ensure the system is actually adopted',
            'Decoration',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Good metric?',
          options: [
            'Adoption, defect drop, reuse rate',
            'Revenue only',
            'Weather',
            'None',
          ],
          correctIndex: 0,
        },
        {
          question: 'Bad example?',
          options: [
            'Emailed PDF, no follow-up',
            'Demo + rollout + metrics',
            'Feedback loop',
            'v1.1 backlog',
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
  console.log('Seeded The Playbook 2026 (EN) with all 30 lessons.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
