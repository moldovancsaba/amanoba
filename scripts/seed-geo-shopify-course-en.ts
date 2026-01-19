/**
 * Seed GEO for Shopify 30-day course (English, first 5 lessons)
 *
 * Creates/updates the GEO_SHOPIFY_30_EN course with lessons 1–5.
 * Lessons follow the mandatory structure: goal, why, explanation,
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

const COURSE_ID = 'GEO_SHOPIFY_30_EN';
const COURSE_NAME = 'GEO Shopify – 30-day course';
const COURSE_DESCRIPTION =
  '30 days of practical GEO training for Shopify merchants: in 20–30 minutes a day you build product and content foundations so generative systems can safely find, parse, and cite your store.';

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
    title: 'What GEO is (and is not) for Shopify',
    content: `<h1>What GEO is (and is not) for Shopify</h1>
<p><em>Understand how GEO differs from SEO and what “showing up in AI answers” really means.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Separate GEO from SEO clearly.</li>
<li>List the outcome you expect from GEO (inclusion, citation, consistency).</li>
<li>Write 5 GEO prompts for your store.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI answers list stores only if information is easy to fetch and safe to quote.</li>
<li>GEO increases the chance of being mentioned; it does not guarantee a sale.</li>
<li>Clean data reduces misquoted price/stock/shipping.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>GEO vs SEO</h3>
<ul>
<li><strong>SEO</strong>: ranking in the 10 blue links.</li>
<li><strong>GEO</strong>: appearing and being cited in generative answers.</li>
</ul>
<h3>What to expect</h3>
<ul>
<li>Inclusion: does your brand/product show up?</li>
<li>Citation: does the answer link to your domain?</li>
<li>Consistency: does it repeat across runs?</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: clear product data (GTIN, price, stock), transparent shipping/returns, clean HTML, stable URLs.</li>
<li><strong>Poor</strong>: missing identifiers, misleading price, dynamic/duplicate URLs, hidden shipping.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Write 5 GEO prompts for your store (e.g., “Best [category] 2025 in [country]”).</li>
<li>Note what you expect: inclusion, citation, consistency.</li>
<li>Save in a table (Prompt, Expected outcome, Notes).</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Run the 5 prompts in ChatGPT/Copilot/Google AI; note if your store appears and is cited.</p>
<hr />
<h2>Self-check (yes/no)</h2>
<ul>
<li>You have 5 prompts.</li>
<li>You can state GEO vs SEO differences.</li>
<li>You wrote expected outcomes.</li>
<li>You ran the first manual test and took notes.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>arXiv: GEO (Generative Engine Optimization): <a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noreferrer">https://arxiv.org/abs/2311.09735</a></li>
<li>Search Engine Land – What is GEO: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 1: What GEO is (and is not)',
    emailBody: `<h1>GEO Shopify – Day 1</h1>
<h2>What GEO is (and is not) for Shopify</h2>
<p>Today you’ll write 5 GEO prompts for your store and clarify GEO vs SEO.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 2,
    title: 'GEO vs SEO on Shopify: what to watch',
    content: `<h1>GEO vs SEO on Shopify: what to watch</h1>
<p><em>See which elements matter for generative surfaces and how they complement SEO.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>List what is SEO-first vs GEO-first.</li>
<li>Build a 10-point GEO checklist for Shopify.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI answers summarize core product data: if it’s missing, you’re excluded.</li>
<li>GEO is not ranking; it’s about clarity and quotability.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>SEO-first</h3>
<ul>
<li>Meta title/description, internal links, canonical, page speed.</li>
<li>Backlinks, long-form structured content.</li>
</ul>
<h3>GEO-first</h3>
<ul>
<li>Accurate product facts (price, stock, identifiers) plainly rendered.</li>
<li>Verifiable policies (shipping/returns), stable URLs.</li>
<li>Short answer-ready blocks (answer capsule).</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: top-of-page summary, clear price/stock, GTIN + SKU visible.</li>
<li><strong>Poor</strong>: long messy copy, missing IDs, mixed variant data.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Create a 10-point GEO checklist (price, stock, GTIN/SKU, policy, answer capsule, stable URL, alt text, structured data, internal link, review rules).</li>
<li>Apply it to one PDP and mark what’s OK vs missing.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Apply the checklist to another PDP; note 3 gaps.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Checklist done.</li>
<li>One PDP audited.</li>
<li>3 fixes noted on another PDP.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Google Search Central – GenAI content: <a href="https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/using-gen-ai-content</a></li>
<li>Shopify product data: <a href="https://shopify.dev/docs/apps/selling-strategies/product-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/apps/selling-strategies/product-data</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 2: GEO vs SEO',
    emailBody: `<h1>GEO Shopify – Day 2</h1>
<h2>GEO vs SEO on Shopify</h2>
<p>Today you’ll build a 10-point GEO checklist and apply it on two PDPs.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 3,
    title: 'How AI reshapes the buying journey',
    content: `<h1>How AI reshapes the buying journey</h1>
<p><em>From “search list” to “answer + recommendation” — what it means for your store.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Map today’s journey and AI touchpoints.</li>
<li>Create 5 AI touchpoints for your store.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI answers often precede the classic list; missing means lost attention.</li>
<li>Short answers magnify wrong price/stock/policy.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Old vs new</h3>
<ul>
<li><strong>Old</strong>: search → list → click.</li>
<li><strong>New</strong>: question → AI summary + recommendation → click/chat continue.</li>
</ul>
<h3>Impact on Shopify</h3>
<ul>
<li>Need an answer capsule at the top (who it’s for, pros/cons, price/stock, policy).</li>
<li>Users arrive “later” with clearer intent.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: top capsule: who for, who not, price/stock, shipping link.</li>
<li><strong>Poor</strong>: long unstructured copy, missing policy links.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Sketch your current journey in 5 steps.</li>
<li>Mark AI touchpoints (before: search/chat; during: recommendation; after: follow-up).</li>
<li>List 5 touchpoint questions (best, sizing, shipping, returns, alternatives).</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Draft a 3–5 line answer capsule for one PDP that answers those touchpoints.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Journey mapped.</li>
<li>5 touchpoints listed.</li>
<li>One capsule drafted.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>OpenAI Shopping help: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
<li>Copilot Merchant Program: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 3: AI and the journey',
    emailBody: `<h1>GEO Shopify – Day 3</h1>
<h2>AI and the buying journey</h2>
<p>Today you’ll map AI touchpoints and write a short answer capsule for a PDP.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 4,
    title: 'Sell in chat: influence vs transaction',
    content: `<h1>Sell in chat: influence vs transaction</h1>
<p><em>See why GEO is about influencing in AI answers, not collecting payment there.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Distinguish influence vs checkout.</li>
<li>Write 5 critical statements/policies the AI must quote correctly.</li>
<li>Draft a short “sell in chat” snippet.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>ChatGPT/Copilot answers sway choice, but checkout happens on your site.</li>
<li>Wrong price/stock/shipping in the answer hurts conversion and support.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Influence</h3>
<ul>
<li>Recommendation, summary, comparison in the AI surface.</li>
<li>Needs clear value, who for/who not, evidence.</li>
</ul>
<h3>Transaction</h3>
<ul>
<li>Checkout on your storefront; requires accurate price/stock/policy.</li>
<li>Merchant programs depend on region/eligibility.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “Ideal for [who], not for [who not]; price [x], in stock; shipping 3–5 days; free returns 30 days.”</li>
<li><strong>Poor</strong>: “Best product!” with no price/stock/policy.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Write 5 statements/policies the AI must know (price, stock, shipping, returns, warranty).</li>
<li>Write a 3–4 line chat snippet for one product (who, what for, not for, price/stock, policy).</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Place this snippet in your PDP answer capsule or note where it will live.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>5 statements written.</li>
<li>Chat snippet drafted.</li>
<li>Placement decided/noted.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>OpenAI merchants: <a href="https://chatgpt.com/merchants" target="_blank" rel="noreferrer">https://chatgpt.com/merchants</a></li>
<li>Copilot Merchant Program: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 4: Sell in chat',
    emailBody: `<h1>GEO Shopify – Day 4</h1>
<h2>Sell in chat: influence vs transaction</h2>
<p>Today you’ll write the chat snippet and the 5 critical policy statements.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 5,
    title: 'Platform map: ChatGPT, Copilot, Google AI',
    content: `<h1>Platform map: ChatGPT, Copilot, Google AI</h1>
<p><em>Review the main AI shopping surfaces, differences, and constraints.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Name the 3 platforms and their constraints.</li>
<li>Create a 1-page “where can I show up?” summary.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Merchant programs and regions differ.</li>
<li>Content expectations differ (structured data, policy, identifiers).</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>ChatGPT</h3>
<ul>
<li>Shopping answers, merchant program; keys: accurate data, quotability.</li>
</ul>
<h3>Copilot</h3>
<ul>
<li>Merchant Program, regional rules; keys: feed quality, policy clarity.</li>
</ul>
<h3>Google AI</h3>
<ul>
<li>AI overview + classic SEO/merchant feed; keys: product data, schema, policy.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: uniform price/stock/policy everywhere, stable feed, clean schema.</li>
<li><strong>Poor</strong>: conflicting prices, missing policy, unstructured feed.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Create a 1-pager: ChatGPT/Copilot/Google AI — requirement, region/program, actions (data/policy/URL).</li>
<li>Mark for your store: which platform you’re closest to, what’s missing.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>For one platform, write 3 tasks (e.g., GTIN check, policy block refresh, add answer capsule).</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Requirements known for all 3.</li>
<li>1-pager completed.</li>
<li>3 tasks noted for one platform.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>OpenAI merchants: <a href="https://chatgpt.com/merchants" target="_blank" rel="noreferrer">https://chatgpt.com/merchants</a></li>
<li>Google Merchant Center spec: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 5: Platform map',
    emailBody: `<h1>GEO Shopify – Day 5</h1>
<h2>Platform map</h2>
<p>Today you’ll summarize platform differences and write 3 concrete tasks.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
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
          difficulty: 'intermediate',
          estimatedHours: 10,
          tags: ['geo', 'shopify', 'ecommerce'],
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
            estimatedMinutes: 25,
            xpReward: 25,
            pointsReward: 50,
            difficulty: 'intermediate'
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Build quizzes (5 per lesson, content-aligned)
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
          question: 'What is a realistic GEO outcome?',
          options: [
            'Inclusion, citation, and consistency in AI answers',
            'Guaranteed checkout inside the chatbot',
            'Higher Google Ads Quality Score',
            'Instant #1 SEO ranking'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What distinguishes GEO from SEO?',
          options: [
            'GEO is about being cited in generative answers; SEO is about ranking links',
            'They are the same',
            'GEO is only backlink building',
            'SEO is only about price and stock'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should a GEO prompt set capture?',
          options: [
            'Your store’s key categories and target geos',
            'Only your brand slogan',
            'Only technical logs',
            'Only page speed scores'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why do clean URLs matter?',
          options: [
            'Stability improves retrieval and citation',
            'They look nicer only',
            'They boost ads CPC',
            'They change page speed only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which is a good first action?',
          options: [
            'Write 5 GEO prompts and note expected inclusion/citation',
            'Buy backlinks',
            'Disable canonical tags',
            'Hide shipping info'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 2) {
      quizzes.push(
        {
          question: 'Which element is GEO-first?',
          options: [
            'Clear price/stock/identifiers rendered on the page',
            'Only meta description length',
            'Only backlink count',
            'Only page speed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What belongs in a GEO checklist?',
          options: [
            'Price, stock, GTIN/SKU, policy, answer capsule, stable URL, alt, schema, internal links, review rules',
            'Only hero image',
            'Only a blog link',
            'Only meta title'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why does structured data matter for GEO?',
          options: [
            'It helps models parse price/availability/identifiers safely',
            'It is only for breadcrumbs',
            'It replaces on-page text',
            'It is only for speed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which is a poor example?',
          options: [
            'Messy copy, missing IDs, mixed variants',
            'Top summary with clear price/stock',
            'Policy link visible',
            'GTIN and SKU present'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you do on a second PDP audit?',
          options: [
            'Identify at least 3 gaps and log them',
            'Ignore findings',
            'Only change the font',
            'Delete the page'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 3) {
      quizzes.push(
        {
          question: 'What is the new AI-driven journey pattern?',
          options: [
            'Question → AI summary/reco → click/chat continue',
            'Search → list only',
            'Only social ads',
            'Only email marketing'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why place an answer capsule at the top?',
          options: [
            'Models read the top first and need concise facts',
            'For decoration',
            'To slow the page',
            'It is an SEO trick only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which touchpoint is valid?',
          options: [
            '“Which size should I pick?”',
            '“What is SEO?”',
            '“Tell me a joke”',
            '“How to write HTML?”'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What belongs in a good capsule?',
          options: [
            'Who for/who not, price/stock, shipping link',
            'Only a slogan',
            'Hidden price',
            'No policy'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why note AI touchpoints?',
          options: [
            'They guide which questions you must answer upfront',
            'It is optional trivia',
            'Only for branding',
            'Only for ads copy'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 4) {
      quizzes.push(
        {
          question: 'What is “influence” in chat?',
          options: [
            'Recommendation/summary in AI answers',
            'Payment capture in chat',
            'Only SEO ranking',
            'Only ad bidding'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why list price/stock/policy in the snippet?',
          options: [
            'To avoid wrong promises in the AI answer',
            'Only for design',
            'Not needed',
            'Only for page speed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which is a good snippet element?',
          options: [
            'Who it is for / who not for',
            'Only emojis',
            'Random claims',
            'No price'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should the 5 statements cover?',
          options: [
            'Price, stock, shipping, returns, warranty',
            'Only brand story',
            'Only meta title',
            'Only backlinks'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why is checkout off-chat?',
          options: [
            'Policies and payments live on your site; AI surfaces are influence layers',
            'Because SEO says so',
            'It is impossible technically',
            'There is no reason'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 5) {
      quizzes.push(
        {
          question: 'What differs by platform?',
          options: [
            'Programs, regions, data/policy expectations',
            'All identical',
            'Only fonts',
            'Only button color'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good 1-pager element?',
          options: [
            'Platform, requirement, region/program, actions, status',
            'Only logo',
            'Only meta keywords',
            'Only a hero image'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why unify price/stock/policy across platforms?',
          options: [
            'To avoid conflicting data and exclusion',
            'Only for looks',
            'Not needed',
            'Only for ads'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which task fits Copilot/ChatGPT/Google differences?',
          options: [
            'GTIN check, policy block refresh, add answer capsule',
            'Buy backlinks',
            'Delete schema',
            'Hide price'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor example?',
          options: [
            'Conflicting prices, missing policy, messy feed',
            'Stable feed and schema',
            'Clear policy links',
            'Consistent IDs'
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

  console.log('🎉 GEO Shopify EN course seeded (days 1-5).');
  await mongoose.disconnect();
  console.log('✅ Disconnected');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
