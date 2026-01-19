/**
 * Seed GEO for Shopify 30-day course (English, first 20 lessons)
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
  },
  {
    day: 6,
    title: 'Define success: GEO prompt set + KPIs',
    content: `<h1>Define success: GEO prompt set + KPIs</h1>
<p><em>Assemble your 30–50 question GEO test set and the baseline KPI sheet.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create a 30–50 prompt GEO set.</li>
<li>Build a GEO + commercial KPI baseline sheet.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>No measurement, no progress: inclusion, citation, coverage, consistency.</li>
<li>Commercial impact: AI referral traffic, conversion, returns.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Prompt set</h3>
<ul>
<li>Best, vs, alternatives, policy, sizing/shipping questions.</li>
<li>30–50 questions per your categories.</li>
</ul>
<h3>KPIs</h3>
<ul>
<li>GEO: inclusion, citation, coverage, consistency (weekly).</li>
<li>Commercial: AI referral traffic, conversion, add-to-cart, returns.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: 40 prompts by category (best/vs/policy) in a table with measurement columns.</li>
<li><strong>Poor</strong>: 5 generic questions, no metrics.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Create a table: Prompt | Type (best/vs/policy) | Expected inclusion/citation | Notes.</li>
<li>Fill 20 questions (mix best, vs, policy).</li>
<li>Create a KPI sheet: GEO (inclusion, citation, consistency), commercial (AI referral, conversion, returns).</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Expand to 30–50 and add priorities (A/B/C).</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>30–50 prompt list ready.</li>
<li>KPI baseline sheet ready.</li>
<li>Prompts prioritized.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Measurement tools: <a href="https://developers.google.com/webmaster-tools/search-console-api-original" target="_blank" rel="noreferrer">Search Console API</a>, <a href="https://clarity.microsoft.com/" target="_blank" rel="noreferrer">Microsoft Clarity</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 6: Prompt set + KPIs',
    emailBody: `<h1>GEO Shopify – Day 6</h1>
<h2>Prompt set + KPIs</h2>
<p>Today you’ll assemble the 30–50 question prompt list and the KPI baseline sheet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 7,
    title: 'Shopify product data audit: title, description, variants',
    content: `<h1>Shopify product data audit: title, description, variants</h1>
<p><em>Find gaps in titles, descriptions, variants, and identifiers.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create an audit template for 10–20 products.</li>
<li>Assess title/subtitle, description, variants, IDs.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI prefers clear, unambiguous data.</li>
<li>Messy variants lead to wrong recommendations.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Check</h3>
<ul>
<li>Title/subtitle: concise with key attributes.</li>
<li>Description: short, key specs up top, policy links.</li>
<li>Variants: size/color clear, no mixing.</li>
<li>IDs: SKU/GTIN/brand filled.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “Runner Pro, men, blue, GTIN…, SKU…, subtitle: stability, cushioning, shipping 3–5 days.”</li>
<li><strong>Poor</strong>: “Pro shoe” — missing variant info, no ID.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Create an audit sheet: Product | Title | Description | Variant label | SKU | GTIN | Brand | Notes.</li>
<li>Fill for 10 products.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Log 5 issues (e.g., missing SKU/GTIN, messy variant) and mark for fix.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Audit template done.</li>
<li>10 products reviewed.</li>
<li>5 issues recorded.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Shopify product data: <a href="https://shopify.dev/docs/apps/selling-strategies/product-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/apps/selling-strategies/product-data</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 7: Product data audit',
    emailBody: `<h1>GEO Shopify – Day 7</h1>
<h2>Product data audit</h2>
<p>Today you audit 10 products for title/description/variant/ID gaps.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 8,
    title: 'Why feeds matter: “offer truth”',
    content: `<h1>Why feeds matter: “offer truth”</h1>
<p><em>Ensure feed and PDP match on price, stock, shipping, returns, identifiers.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>List the offer truth elements (price, stock, shipping, returns, IDs).</li>
<li>Check feed vs PDP gaps on 5 products.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI and merchant programs rely on both feed and PDP.</li>
<li>Conflicting price/stock/policy → exclusion or bad recommendations.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Offer truth</h3>
<ul>
<li>Price accurate, discounts handled.</li>
<li>Stock current, variant-level.</li>
<li>Shipping/returns clear, linked.</li>
<li>IDs consistent (GTIN/SKU/brand).</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: feed and PDP show same price/stock/policy.</li>
<li><strong>Poor</strong>: mismatched price, missing policy, no IDs.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick 5 products: compare feed export vs PDP for price/stock/policy.</li>
<li>Note discrepancies and fixes.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Write 3 fixes (price sync, stock sync, unified policy block).</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Offer truth list done.</li>
<li>5 products checked feed vs PDP.</li>
<li>3 fixes logged.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>GMC product data spec: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 8: Offer truth',
    emailBody: `<h1>GEO Shopify – Day 8</h1>
<h2>Offer truth</h2>
<p>Today you compare feed vs PDP for 5 products and log fixes.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 9,
    title: 'Identifiers clean: SKU, GTIN, brand, variants',
    content: `<h1>Identifiers clean: SKU, GTIN, brand, variants</h1>
<p><em>Clean up product identifiers so AI and feeds don’t confuse items.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Audit 10 products/variants for SKU/GTIN/brand/variant naming.</li>
<li>List missing/incorrect IDs.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI and feeds disambiguate with IDs; bad IDs → wrong recos.</li>
<li>Brand/variant clarity reduces mis-match.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Check</h3>
<ul>
<li>SKU unique per variant.</li>
<li>GTIN (if present) correct, not duplicated.</li>
<li>Brand populated, consistent.</li>
<li>Variant name clear: size/color, no mixing.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “SKU: RUNPRO-BLU-42, GTIN: 123…, Brand: RunPro, Variant: men, blue, 42”.</li>
<li><strong>Poor</strong>: missing GTIN, duplicate SKU, variant “42 blue or black?”.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Audit sheet: Product | Variant | SKU | GTIN | Brand | Notes.</li>
<li>Fill for 10 products/variants.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Write 5 fixes (duplicate SKU, GTIN missing, variant name cleanup).</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Audit sheet filled.</li>
<li>10 products/variants reviewed.</li>
<li>5 fixes listed.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>GTIN guide (GS1): <a href="https://www.gs1.org/standards/id-keys/gtin" target="_blank" rel="noreferrer">https://www.gs1.org/standards/id-keys/gtin</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 9: Identifiers',
    emailBody: `<h1>GEO Shopify – Day 9</h1>
<h2>Identifiers clean</h2>
<p>Today you audit SKU/GTIN/brand/variants and log fixes.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 10,
    title: 'Shipping and returns: clarity',
    content: `<h1>Shipping and returns: clarity</h1>
<p><em>Clarify shipping and returns so AI doesn’t promise the wrong thing.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Update/check the shipping/returns block on PDPs.</li>
<li>Unify policy links.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Misunderstood shipping/returns hurts conversion and support.</li>
<li>AI may quote the policy: make it accurate and easy to find.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Do</h3>
<ul>
<li>Add a short block: ship time/cost, return deadline/cost.</li>
<li>Link the full policy (stable URL).</li>
<li>Mirror in the feed where supported.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “3–5 days, $X; free returns 30 days; details: /policies/shipping”.</li>
<li><strong>Poor</strong>: “Fast” with no link.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick 5 products: check ship/returns block and policy link.</li>
<li>Align feed info if supported.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Write a short policy line template for PDPs: “Shipping X, returns Y, details: /policy”.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Policy block present and clear.</li>
<li>Links stable.</li>
<li>Feed (if any) matches.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Google Merchant Center policy rules: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 10: Shipping & returns',
    emailBody: `<h1>GEO Shopify – Day 10</h1>
<h2>Shipping & returns</h2>
<p>Today you unify the shipping/returns block and links across PDPs.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 11,
    title: 'Trust signals: identity, support, proof',
    content: `<h1>Trust signals: identity, support, proof</h1>
<p><em>Add the core trust block so AI and users see who you are and how you help.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Build a trust block (identity/support/proof) and place it on key pages.</li>
<li>Verify reviews/guarantees are real and safe to cite.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI prefers reliable, citeable sources.</li>
<li>Users need quick proof: who you are, how to reach you, why they should trust you.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Trust elements</h3>
<ul>
<li>Identity: company/brand, contact.</li>
<li>Support: channels + response time.</li>
<li>Proof: real reviews, guarantee, awards.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “Company: XY Inc, email/phone, support 24–48h, 1-year warranty, real reviews link.”</li>
<li><strong>Poor</strong>: no contact, fake reviews, empty about page.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Create a trust block (identity/support/proof) and place it on 3 pages (PDP/collection/about).</li>
<li>Verify review authenticity and warranty text accuracy.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Mirror brand/guarantee fields in the feed if supported.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Trust block live on 3 pages.</li>
<li>Real, verified proof only.</li>
<li>Support contact + response time shown.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Google spam policies (reviews): <a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/essentials/spam-policies</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 11: Trust signals',
    emailBody: `<h1>GEO Shopify – Day 11</h1>
<h2>Trust signals</h2>
<p>Today you build the trust block (identity/support/proof) and place it on key pages.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 12,
    title: 'Merchant readiness checklist: top 10 fixes',
    content: `<h1>Merchant readiness checklist: top 10 fixes</h1>
<p><em>Summarize critical fixes and schedule the top 10 with owners and dates.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Create a merchant readiness checklist.</li>
<li>Schedule the top 10 fixes with owner/date.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>You focus on the highest-impact gaps.</li>
<li>Team sees what’s GEO-ready and what’s not.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Checklist elements (sample)</h3>
<ul>
<li>Price/stock/policy alignment.</li>
<li>SKU/GTIN/brand filled.</li>
<li>Shipping/returns block consistent.</li>
<li>Answer capsule at top of PDP.</li>
<li>Trust block (identity/support/proof).</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: checklist done, top 10 fixes with owner + due date.</li>
<li><strong>Poor</strong>: long list, no priority, no owner.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Build the readiness checklist (20–30 items).</li>
<li>Select top 10, assign owner and deadline.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Share with the team and set weekly follow-up.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Checklist completed.</li>
<li>Top 10 fixes assigned with dates.</li>
<li>Shared with team.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>GEO overview: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 12: Readiness checklist',
    emailBody: `<h1>GEO Shopify – Day 12</h1>
<h2>Readiness checklist</h2>
<p>Today you finalize the checklist and schedule the top 10 fixes.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 13,
    title: 'Citable PDP blueprint',
    content: `<h1>Citable PDP blueprint</h1>
<p><em>Structure your PDP so AI can safely cite it.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Lay out the “GEO-ready” PDP block order.</li>
<li>Refactor 1 PDP to the blueprint.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Models read top blocks first.</li>
<li>Clear structure reduces misread price/policy/variants.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Recommended order</h3>
<ul>
<li>Answer capsule (who for/not for, price/stock, policy short).</li>
<li>Main image + variant visual.</li>
<li>Price, stock, key USPs, CTA.</li>
<li>Policy block (shipping/returns link).</li>
<li>Detailed description, specs.</li>
<li>Trust: reviews, warranty, support.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: short capsule, clear price/stock, policy link, spec table.</li>
<li><strong>Poor</strong>: long paragraph, no price, scattered policy, missing CTA.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Take one PDP: reorder blocks per blueprint.</li>
<li>Add capsule and policy block.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Repeat on another PDP; note what you had to add.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Capsule present.</li>
<li>Price/stock/CTA visible.</li>
<li>Policy link stable.</li>
<li>Specs in a table.</li>
<li>Trust above the fold.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Shopify PDP content: <a href="https://shopify.dev/docs/apps/selling-strategies/product-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/apps/selling-strategies/product-data</a></li>
<li>GEO overview: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 13: Citable PDP blueprint',
    emailBody: `<h1>GEO Shopify – Day 13</h1>
<h2>Citable PDP blueprint</h2>
<p>Today you lay out the GEO-ready PDP order and refactor 2 pages.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 14,
    title: 'Answer capsule: 5-line top summary',
    content: `<h1>Answer capsule: 5-line top summary</h1>
<p><em>Write the short block AI can safely quote.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Write 2 answer capsules.</li>
<li>Place them at the top of PDPs.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Models seek concise facts above the fold.</li>
<li>Reduces misread: who for/not for, price/policy clear.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>5-line template</h3>
<ol>
<li>Who and what for?</li>
<li>Who not for?</li>
<li>Main benefit (1–2 bullets).</li>
<li>Price + stock status.</li>
<li>Shipping/returns short + link.</li>
</ol>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “Running shoe for daily training. Not for wide feet. Benefits: stability, cushioning. Price $X, in stock. Shipping 3–5 days, free returns 30 days: /policies/shipping.”</li>
<li><strong>Poor</strong>: “Great shoe, buy it!” no price/policy.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Write 2 capsules for your top PDPs using the 5 lines.</li>
<li>Place them above the fold (rich text/metafield).</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Write 1 more capsule for another category and save as a template.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Who/not for included.</li>
<li>Price/stock/policy present.</li>
<li>Link stable.</li>
<li>Block above the fold.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>OpenAI shopping help: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 14: Answer capsule',
    emailBody: `<h1>GEO Shopify – Day 14</h1>
<h2>Answer capsule</h2>
<p>Today you write and place answer capsules at the top of your PDPs.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 15,
    title: 'Variant clarity: no mix-ups',
    content: `<h1>Variant clarity: no mix-ups</h1>
<p><em>Make variant data unambiguous for AI and feeds.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Review 10 variants and standardize naming.</li>
<li>Pair images at variant level.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Mixed variants cause wrong recommendations.</li>
<li>AI cites clear variant data more reliably.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Labeling</h3>
<ul>
<li>Variant title includes size/color clearly.</li>
<li>Images paired per variant.</li>
<li>SKU/GTIN variant-specific.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “Men, blue, 42” + blue image + unique SKU/GTIN.</li>
<li><strong>Poor</strong>: “42 blue/black” one image, shared SKU.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick 5 products: set variant names (size, color fields), pair images per variant.</li>
<li>Check SKU/GTIN per variant.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Repeat on 5 more products; note common errors.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Every variant has a unique SKU.</li>
<li>GTIN (if present) per variant.</li>
<li>Variant name clear, no mixing.</li>
<li>Variant images paired.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Shopify variants: <a href="https://help.shopify.com/en/manual/products/variants" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/variants</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 15: Variant clarity',
    emailBody: `<h1>GEO Shopify – Day 15</h1>
<h2>Variant clarity</h2>
<p>Today you standardize variant names and image pairing.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 16,
    title: 'Collection page as guide, not just grid',
    content: `<h1>Collection page as guide, not just grid</h1>
<p><em>Turn a collection into a guide so AI can cite it and shoppers decide faster.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Restructure 1 collection page into a guide style.</li>
<li>Add 3 blocks: who it’s for, how to choose, top picks.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI cites well-structured guidance content.</li>
<li>Shoppers decide faster, fewer returns.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Structure</h3>
<ul>
<li>Hero: who, which scenario.</li>
<li>Decision criteria (3–5 bullets).</li>
<li>Top 3 picks with PDP links.</li>
<li>Policy short + link.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: “Running shoes collection: beginner/advanced guide, top 3 models, sizing tips.”</li>
<li><strong>Poor</strong>: Product grid only, no guidance.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick 1 collection: add guide blocks (hero + criteria + top 3).</li>
<li>Link PDPs consistently.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Document the sections as a template to reuse on other collections.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Hero block present with who/what.</li>
<li>Decision criteria listed.</li>
<li>Top 3 picks linked.</li>
<li>Policy short block.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Shopify collection customization: <a href="https://help.shopify.com/en/manual/online-store/themes/customizing-themes/add-content/change-collection-page" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/themes/customizing-themes/add-content/change-collection-page</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 16: Collection as guide',
    emailBody: `<h1>GEO Shopify – Day 16</h1>
<h2>Collection as guide</h2>
<p>Today you convert a collection into a guide with who/criteria/top picks.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 17,
    title: 'Structured data check (schema)',
    content: `<h1>Structured data check (schema)</h1>
<p><em>Validate product/offer schema so AI reads price/availability/IDs correctly.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Validate product/offer schema on 3 pages.</li>
<li>List errors/missing fields.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Models rely on structured data.</li>
<li>Bad schema → wrong price/stock/ID.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Check</h3>
<ul>
<li>@type Product + Offer; price, priceCurrency, availability.</li>
<li>sku, gtin, brand, image, url, review (if real).</li>
<li>Do not include fake reviews.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: Valid JSON-LD, price/stock match PDP.</li>
<li><strong>Poor</strong>: Missing availability, wrong price, fake review.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Run Rich Results Test on 3 PDPs.</li>
<li>Note errors (missing field, invalid value).</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Fix 1 error (e.g., availability or price) and retest.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>3 pages validated.</li>
<li>Errors listed.</li>
<li>At least 1 error fixed.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Shopify structured data: <a href="https://shopify.dev/docs/themes/metadata/structured-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/themes/metadata/structured-data</a></li>
<li>Rich Results Test: <a href="https://search.google.com/test/rich-results" target="_blank" rel="noreferrer">https://search.google.com/test/rich-results</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 17: Schema check',
    emailBody: `<h1>GEO Shopify – Day 17</h1>
<h2>Schema check</h2>
<p>Today you validate product/offer schema and fix one error.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 18,
    title: 'Prices, offers, reviews safely',
    content: `<h1>Prices, offers, reviews safely</h1>
<p><em>Show prices/discounts/reviews without misleading AI or users.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Standardize price/discount display.</li>
<li>Clean the review block; remove weak/fake items.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI is sensitive to fake or outdated price.</li>
<li>Misleading reviews are risky (policy/trust).</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Price/discount</h3>
<ul>
<li>Use compare-at-price, not hand-written text.</li>
<li>Show reason/duration if discounted.</li>
</ul>
<h3>Reviews</h3>
<ul>
<li>Show only real reviews.</li>
<li>Do not manipulate counts; do not hide negatives.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: $X (orig $Y), reason “end of season”, reviews 4.6/5 from 128 real ratings.</li>
<li><strong>Poor</strong>: “Free now!” fake price, fake 5/5.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Pick 5 products: check price/compare-at and discount message.</li>
<li>Review the review block: remove dubious content, note source.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Add a short policy line on PDP: “Review source, last updated”.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Price/discount fields consistent.</li>
<li>Reason/duration given if any.</li>
<li>Review block real, source cited.</li>
<li>Policy link live.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Google Merchant Center price/promo rules: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 18: Prices and reviews',
    emailBody: `<h1>GEO Shopify – Day 18</h1>
<h2>Prices and reviews</h2>
<p>Today you standardize price/discount display and clean the review block.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 19,
    title: 'Image and video GEO: alt, filename, variant visuals',
    content: `<h1>Image and video GEO: alt, filename, variant visuals</h1>
<p><em>Optimize visuals so models understand them.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Fix alt/filename/variant pairing on 10 images.</li>
<li>Standardize 1 short video title + description.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>AI can use image labels in summaries.</li>
<li>Missing variant visuals → wrong color/size recos.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Alt: product, variant, key attribute (e.g., “black leather wallet with RFID”).</li>
<li>Filename: short, hyphenated, variant noted.</li>
<li>Video: title + short description, who/what for.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: <code>runner-blue-42.jpg</code>, alt: “blue men’s running shoe size 42 with stable sole”.</li>
<li><strong>Poor</strong>: <code>IMG_1234.JPG</code>, alt: “image”.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Fix 10 images: filename + alt + variant pairing.</li>
<li>Add title/description to 1 product video.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Create an alt template (product + variant + key USP) and apply to new images.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>10 images fixed.</li>
<li>Video title + description set.</li>
<li>Template saved.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Shopify alt text: <a href="https://help.shopify.com/en/manual/online-store/images/add-alt-text" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/images/add-alt-text</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 19: Image/video GEO',
    emailBody: `<h1>GEO Shopify – Day 19</h1>
<h2>Image/video GEO</h2>
<p>Today you fix alt/filename/variant pairing on images and update a video description.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
  },
  {
    day: 20,
    title: 'Minimum content: no “thin” PDP',
    content: `<h1>Minimum content: no “thin” PDP</h1>
<p><em>Eliminate low-content product pages.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Define the minimum content standard.</li>
<li>Fix 3 thin pages.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Low content is harder to cite and leads to bad recommendations.</li>
<li>Returns rise if users lack info.</li>
</ul>
<hr />
<h2>Explanation</h2>
<ul>
<li>Minimum: capsule, price/stock, policy, 3 USPs, specs, 2 images with variants.</li>
<li>If missing: fill from template, add specs table.</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
<li><strong>Good</strong>: Capsule + 3 USPs + specs + 4 images.</li>
<li><strong>Poor</strong>: One-line description, one image, no policy.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
<li>Build a minimum standard checklist.</li>
<li>Pick 3 thin PDPs and fill missing blocks.</li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Document the standard for new products.</p>
<hr />
<h2>Self-check</h2>
<ul>
<li>Minimum list ready.</li>
<li>3 PDPs enriched.</li>
<li>Specs table present.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Helpful content guidance: <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/creating-helpful-content</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – Day 20: Minimum content',
    emailBody: `<h1>GEO Shopify – Day 20</h1>
<h2>Minimum content</h2>
<p>Today you set a minimum standard and fix 3 thin PDPs.</p>
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
    } else if (entry.day === 6) {
      quizzes.push(
        {
          question: 'How many prompts should the GEO set contain?',
          options: [
            '30–50 tailored to your categories',
            '5 generic prompts',
            '1 prompt only',
            '200 random prompts'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Which question types belong in the set?',
          options: [
            'best/vs/alternatives/policy/sizing/shipping',
            'Only brand slogan',
            'Only meta title',
            'Only backlinks'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which GEO KPIs matter?',
          options: [
            'Inclusion, citation, coverage, consistency',
            'Only bounce rate',
            'Only page speed',
            'Only meta title length'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which commercial KPIs relate to AI referrals?',
          options: [
            'AI referral traffic, conversion, add-to-cart, returns',
            'Only social likes',
            'Only backlink count',
            'Only meta description length'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why prioritize prompts A/B/C?',
          options: [
            'To focus on the most important test questions',
            'Only for color-coding',
            'No need to prioritize',
            'Just decoration'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 7) {
      quizzes.push(
        {
          question: 'What should you check in the product data audit?',
          options: [
            'Title/subtitle, description, variant labeling, SKU/GTIN/brand',
            'Only meta title',
            'Only backlinks',
            'Only page speed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why does variant clarity matter?',
          options: [
            'So AI doesn’t mix size/color recommendations',
            'Only for design',
            'It does not matter',
            'Only for SEO keywords'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What belongs in the audit sheet?',
          options: [
            'Product, variant, SKU, GTIN, brand, notes',
            'Only product name',
            'Only price',
            'Only images'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor example?',
          options: [
            'Short title, missing variant info, no IDs',
            'All IDs filled',
            'Clear variant labels',
            'Consistent SKU/GTIN'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should the audit produce?',
          options: [
            'A list of gaps with fixes',
            'Just a slogan',
            'Only a screenshot',
            'Nothing'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 8) {
      quizzes.push(
        {
          question: 'What is “offer truth”?',
          options: [
            'Price/stock/policy match between feed and PDP',
            'Only meta title',
            'Only backlinks',
            'Only design'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What is the risk of mismatched feed vs PDP price?',
          options: [
            'Exclusion or misleading AI recommendations',
            'No risk',
            'Only page speed change',
            'Only SEO penalty'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you compare on 5 products?',
          options: [
            'Price, stock, policy alignment between feed and PDP',
            'Only image ALT',
            'Only meta description length',
            'Only page speed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which fix is relevant?',
          options: [
            'Price sync, stock sync, unified policy block',
            'Buy backlinks',
            'Keyword stuffing',
            'Design swap only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Why must IDs match in the feed too?',
          options: [
            'So AI and merchant programs identify the product correctly',
            'It does not matter',
            'Only for SEO',
            'Only for marketing copy'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 9) {
      quizzes.push(
        {
          question: 'What to check in the ID audit?',
          options: [
            'SKU unique, GTIN correct/not duplicated, brand filled, variant name clear',
            'Only price',
            'Only images',
            'Only meta title'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why does variant naming clarity matter?',
          options: [
            'So AI doesn’t mix size/color variants',
            'Only for design',
            'Not important',
            'Only for SEO'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor example for IDs?',
          options: [
            'Missing GTIN, duplicate SKU, confusing variant name',
            'All filled',
            'Unique SKU',
            'Clear variant label'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What belongs in the fix list?',
          options: [
            'Fix duplicate SKU, add GTIN, clean variant naming',
            'Only meta title length',
            'Only backlink',
            'Nothing'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why be consistent with brand?',
          options: [
            'AI and feeds identify the manufacturer/brand clearly',
            'Does not matter',
            'Only design',
            'Only SEO keyword'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 10) {
      quizzes.push(
        {
          question: 'What should the shipping/returns block include?',
          options: [
            'Ship time/cost, return window/cost, policy link',
            'Just “fast”',
            'Nothing',
            'Only a backlink'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What is the risk of vague policy?',
          options: [
            'AI promises wrong terms → bad experience, support load',
            'No risk',
            'Only design issue',
            'Only SEO penalty'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good example?',
          options: [
            '“3–5 days, $X; free returns 30 days; details: /policies/shipping”',
            '“Fast” only',
            'No link',
            'Just an emoji'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What to check in the feed?',
          options: [
            'Policy URL/info match, if supported',
            'Only meta title',
            'Only images',
            'Nothing'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why use a stable policy link?',
          options: [
            'So AI and users land on the same URL reliably',
            'Not important',
            'Only design',
            'Only SEO'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 11) {
      quizzes.push(
        {
          question: 'What are the three trust elements?',
          options: [
            'Identity, support, proof',
            'Only meta title',
            'Only images',
            'Only price'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why must proof be real?',
          options: [
            'AI and users must trust it; fake proof is risky',
            'It does not matter',
            'Only for design',
            'Only for SEO keywords'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Where should you place the trust block?',
          options: [
            'PDP/collection/about pages',
            'Hidden in footer only',
            'Nowhere',
            'Blog only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why show support response time?',
          options: [
            'Transparency and quotability',
            'Not needed',
            'Only for ads',
            'Only for speed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor trust example?',
          options: [
            'No contact, fake reviews, empty about',
            'Contact shown, real reviews',
            'Warranty listed',
            'Support channels visible'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 12) {
      quizzes.push(
        {
          question: 'What is the readiness checklist for?',
          options: [
            'Clear list of key gaps/fixes',
            'Just decoration',
            'Not needed',
            'Only a slogan'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What must the top 10 fixes include?',
          options: [
            'Owner and due date',
            'No owner',
            'No deadline',
            'Only a guess'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Which is a good checklist item?',
          options: [
            'Price/stock/policy align; SKU/GTIN/brand; capsule; trust block',
            'Only images',
            'Only speed',
            'Only meta description length'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor checklist example?',
          options: [
            'Long list with no priority or owner',
            'Prioritized list',
            'Owner assigned',
            'Deadline set'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why share the list with the team?',
          options: [
            'For visibility and follow-up',
            'Keep it secret',
            'Only for marketing',
            'No need'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 13) {
      quizzes.push(
        {
          question: 'What is the first block in the GEO-ready PDP?',
          options: [
            'Answer capsule above the fold',
            'Footer links',
            'Blog feed',
            'Random order'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why place policy block high?',
          options: [
            'AI and users quickly see shipping/returns',
            'Only design',
            'Not needed',
            'Only SEO keyword'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What follows the capsule in order?',
          options: [
            'Main image + variant visual, then price/stock/CTA',
            'Footer',
            'Blog posts',
            'Random'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good blueprint example?',
          options: [
            'Capsule + price/stock + policy + spec table',
            'One sentence, no price',
            'No CTA',
            'Images only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why keep trust elements above the fold?',
          options: [
            'Increases trust and citation likelihood',
            'Just aesthetics',
            'Does not matter',
            'Footer only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 14) {
      quizzes.push(
        {
          question: 'Which line is required in the capsule?',
          options: [
            'Who it is not for',
            'Random slogan',
            'Only product name',
            'Emoji only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Where should the capsule be placed?',
          options: [
            'Above the fold on the PDP',
            'Footer',
            'Blog only',
            'Hidden'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why link policy in the capsule?',
          options: [
            'Stable URL for AI and users',
            'Just decoration',
            'Not needed',
            'Only SEO'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a poor capsule?',
          options: [
            '“Great product, buy now” with no price/policy',
            'Who/not for + price + stock + policy',
            'Short, clear summary',
            'Linked policy'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why save a capsule template?',
          options: [
            'Reuse for new products consistently',
            'Never reuse',
            'Hide it',
            'Use random text'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 15) {
      quizzes.push(
        {
          question: 'Why unique SKU per variant?',
          options: [
            'So AI/feed identify each variant correctly',
            'Only design',
            'Not important',
            'Only SEO'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What is a clear variant name example?',
          options: [
            '“Men, blue, 42”',
            '“42 blue/black?”',
            '“Product variant”',
            'No name'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why pair images per variant?',
          options: [
            'Avoid color/size misrecommendation',
            'Only aesthetics',
            'Not needed',
            'Only alt text'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a bad variant practice?',
          options: [
            'Shared SKU/GTIN, mixed naming',
            'Unique SKU',
            'Clear name',
            'Paired image'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you log from common errors?',
          options: [
            'Collect and template fixes',
            'Do not log',
            'Hide issues',
            'Write random slogans'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 16) {
      quizzes.push(
        {
          question: 'What is a core block of a guide-style collection?',
          options: [
            'Decision criteria (3–5 bullets)',
            'Only product grid',
            'Footer links',
            'Cookie banner'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why is a guide better than a plain grid?',
          options: [
            'Faster decisions and more citable content',
            'Only looks nicer',
            'Not better',
            'Only SEO keywords'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What belongs in the hero block?',
          options: [
            'Who it is for and scenario',
            'Only an image',
            'Only prices',
            'Only a CTA'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good top pick element?',
          options: [
            'Short reason + link to PDP',
            'Only product name',
            'No link',
            'Random order'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why document the section template?',
          options: [
            'To reuse across collections',
            'No need to document',
            'Only for marketing',
            'Only for design swaps'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 17) {
      quizzes.push(
        {
          question: 'Which fields are required in product/offer schema?',
          options: [
            'price, priceCurrency, availability, sku/gtin, brand',
            'Only title',
            'Only description',
            'Only image'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is the risk of wrong availability?',
          options: [
            'Wrong recommendation with no stock',
            'No risk',
            'Only design',
            'Only SEO length'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is good practice for reviews in schema?',
          options: [
            'Include only real reviews',
            'Include fake reviews',
            'Omit source',
            'Use random numbers'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Which tool should you use to validate?',
          options: [
            'Rich Results Test',
            'Only manual read',
            'No validation',
            'Backlink checker'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What to do when you find an error?',
          options: [
            'Fix the field and retest',
            'Ignore it',
            'Remove schema entirely',
            'Change only colors'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 18) {
      quizzes.push(
        {
          question: 'How should you display a discount?',
          options: [
            'Using compare-at-price with reason/duration',
            'Handwritten “sale” text',
            'Fake discount',
            'Conflicting prices feed vs PDP'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why are fake reviews dangerous?',
          options: [
            'Trust and policy risk',
            'Not dangerous',
            'Only SEO penalty',
            'Only design issue'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'What should you show in the review block?',
          options: [
            'Source and last updated, if possible',
            'Nothing',
            'Only positive reviews',
            'Only an icon'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good price display example?',
          options: [
            '$X (orig $Y), reason “end of season”',
            '“Free now!” fake price',
            'Only “on sale”',
            'No price'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What should you avoid in reviews?',
          options: [
            'Manipulated numbers or fake reviews',
            'Real reviews',
            'Source noted',
            'Clear rating'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 19) {
      quizzes.push(
        {
          question: 'What belongs in alt text?',
          options: [
            'Product + variant + key attribute',
            'Just “image”',
            'Emojis only',
            'Leave blank'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'What is a good filename?',
          options: [
            'runner-blue-42.jpg',
            'IMG_1234.JPG',
            'photo_final_final.png',
            'random.jpeg'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why pair images per variant?',
          options: [
            'Avoid color/size confusion',
            'Only aesthetics',
            'Not needed',
            'Only for alt text'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What should you add to a video?',
          options: [
            'Title + short description, who/what for',
            'Nothing',
            'Only a link',
            'Random text without source'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Why create an alt template?',
          options: [
            'Ensure consistency on new images',
            'No need',
            'Only for design',
            'Only for SEO'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 20) {
      quizzes.push(
        {
          question: 'What is part of the minimum content?',
          options: [
            'Capsule, price/stock, policy, 3 USPs, specs, 2 images with variants',
            'One sentence only',
            'No images',
            'Only meta title'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is the risk of a “thin” PDP?',
          options: [
            'Lower citability and bad recommendations',
            'No risk',
            'Only design',
            'Only length concern'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What to do if specs are missing?',
          options: [
            'Fill a specs table using a template',
            'Leave empty',
            'Write marketing fluff',
            'Insert random data'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Why document the minimum standard?',
          options: [
            'Make it mandatory for new products',
            'No need',
            'Only for marketing',
            'Single-use only'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'What is a good step for thin pages?',
          options: [
            'Pick 3 pages and enrich per standard',
            'Do nothing',
            'Just enlarge images',
            'Only edit meta description'
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

  console.log('🎉 GEO Shopify EN course seeded (lessons updated).');
  await mongoose.disconnect();
  console.log('✅ Disconnected');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
