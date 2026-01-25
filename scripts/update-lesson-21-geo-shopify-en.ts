/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_21 = {
  day: 21,
  title: 'Prompt intent map: best / vs / alternatives / policy',
  content: `<h1>Prompt intent map: best / vs / alternatives / policy</h1>
<p><em>Today you'll group the questions AI will answer and map them to target pages.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll list 30–40 prompts by intent that you can use for testing.</li>
<li>You'll map each prompt to a target page so you know where to send customers.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI answers typical shopper questions; you must know where to send them. Without intents, content and measurement are random. Understanding intent helps you optimize for the questions customers actually ask.</p>
<hr />
<h2>Prompt intent categories: what to include</h2>
<h3>Best (Best choice)</h3>
<p>Questions that seek the best option:</p>
<ul>
<li>"best [product category] 2025 in [country]"</li>
<li>Example: "best running shoes 2025 in USA"</li>
</ul>
<h3>Vs (Comparison)</h3>
<p>Questions that ask for comparison:</p>
<ul>
<li>"[X] vs [Y], which is better?"</li>
<li>Example: "Nike vs Adidas running shoes, which is better?"</li>
</ul>
<h3>Alternatives</h3>
<p>Questions that seek alternatives:</p>
<ul>
<li>"What to buy instead of [X]?"</li>
<li>Example: "What to buy instead of expensive running shoes?"</li>
</ul>
<h3>Policy/Fit</h3>
<p>Questions about policy or fit:</p>
<ul>
<li>Sizing questions: "Which size should I choose?"</li>
<li>Shipping questions: "How long is shipping?"</li>
<li>Returns questions: "Is there free returns?"</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good intent map</h3>
<p>Intent → page/capsule → measurement, 30+ prompts with target pages, priorities set.</p>
<h3>❌ Poor intent map</h3>
<p>Random prompts with no target page, no categorization, no measurement.</p>
<hr />
<h2>Practice: create your intent map (10-15 min)</h2>
<p>Now you'll create an intent map with 30–40 prompts. Here are the steps:</p>
<ol>
<li>Create a table with these columns:
   <ul>
   <li>Intent</li>
   <li>Prompt</li>
   <li>Target (PDP/collection/guide)</li>
   <li>Notes</li>
   </ul>
</li>
<li>Fill 20 prompts (mix best/vs/alternatives/policy).</li>
</ol>
<h2>Independent practice: expand and prioritize (5-10 min)</h2>
<p>Now expand to 30–40 prompts and prioritize A/B/C.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Intent map with 30+ prompts</li>
<li>✅ Each prompt has a target page</li>
<li>✅ Priorities set</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Search intent types: <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/seo-starter-guide</a></li>
<li>Content strategy: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 21: Intent map',
  emailBody: `<h1>GEO Shopify – Day 21</h1>
<h2>Prompt intent map: best / vs / alternatives / policy</h2>
<p>Today you'll group the questions AI will answer and map them to target pages.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson21() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not set');
    const { default: connectDB } = await import('../app/lib/mongodb');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    let brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      brand = await Brand.create({
        name: 'Amanoba', slug: 'amanoba', displayName: 'Amanoba',
        description: 'Unified Learning Platform', logo: '/AMANOBA.png',
        themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
        allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
        supportedLanguages: ['hu', 'en'], defaultLanguage: 'hu', isActive: true
      });
      console.log('✅ Brand created');
    }

    const course = await Course.findOneAndUpdate(
      { courseId: COURSE_ID },
      {
        $set: {
          courseId: COURSE_ID,
          name: 'GEO Shopify – 30-day course',
          description: '30 days of practical GEO training for Shopify merchants: in 20–30 minutes a day you build product and content foundations so generative systems can safely find, parse, and cite your store.',
          language: 'en', durationDays: 30, isActive: true, requiresPremium: false,
          brandId: brand._id,
          pointsConfig: { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 },
          xpConfig: { completionXP: 500, lessonXP: 25 },
          metadata: { category: 'education', difficulty: 'intermediate', estimatedHours: 10, tags: ['geo', 'shopify', 'ecommerce'], instructor: 'Amanoba' }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Course ${COURSE_ID} found/created: ${course.name}`);

    const lessonId = `${COURSE_ID}_DAY_21`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_21.day,
          language: 'en', title: UPDATED_LESSON_21.title, content: UPDATED_LESSON_21.content,
          emailSubject: UPDATED_LESSON_21.emailSubject, emailBody: UPDATED_LESSON_21.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 2 updated successfully`);
    console.log(`   Lesson ID: ${lesson.lessonId}`);
    console.log(`   Title: ${lesson.title}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateLesson21();
