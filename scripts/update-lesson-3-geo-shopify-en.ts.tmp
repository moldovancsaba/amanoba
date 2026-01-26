/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_3 = {
  day: 2,
  title: 'How AI reshapes the buying journey',
  content: `<h1>How AI reshapes the buying journey</h1>
<p><em>Today you'll understand how the journey changed from "search list" to "answer + recommendation" and what it means for your store.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll map today's journey and AI touchpoints, so you understand where customers interact with AI.</li>
<li>You'll create 5 AI touchpoints for your store that you can optimize right away.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI answers often precede the classic list; missing means lost attention. Short answers magnify wrong price/stock/policy. Understanding the new journey helps you optimize for where customers actually interact with AI.</p>
<hr />
<h2>Old vs new buying journey: what changed?</h2>
<h3>Old journey</h3>
<p>The traditional buying journey:</p>
<ul>
<li>Search → list → click</li>
<li>User browses search results</li>
<li>User clicks on a result</li>
</ul>
<h3>New journey</h3>
<p>The AI-powered buying journey:</p>
<ul>
<li>Question → AI summary + recommendation → click/chat continue</li>
<li>User asks a question</li>
<li>AI provides summary and recommendation</li>
<li>User clicks or continues chatting</li>
</ul>
<h3>Impact on Shopify</h3>
<p>This means you need:</p>
<ul>
<li>An answer capsule at the top (who it's for, pros/cons, price/stock, policy)</li>
<li>Clear, quotable information</li>
<li>Users arrive "later" with clearer intent</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good AI-ready product page</h3>
<p>Top capsule: who for, who not, price/stock, shipping link, clear structure.</p>
<h3>❌ Poor AI-ready product page</h3>
<p>Long unstructured copy, missing policy links, no answer capsule.</p>
<hr />
<h2>Practice: map your AI touchpoints (10-15 min)</h2>
<p>Now you'll map today's journey and create AI touchpoints for your store. Here are the steps:</p>
<ol>
<li>Map today's customer journey: where do customers interact with AI?</li>
<li>Create 5 AI touchpoints for your store:
   <ul>
   <li>Product discovery</li>
   <li>Product comparison</li>
   <li>Policy questions</li>
   <li>Price/stock inquiries</li>
   <li>Recommendation requests</li>
   </ul>
</li>
</ol>
<h2>Independent practice: optimize one touchpoint (5-10 min)</h2>
<p>Now optimize one AI touchpoint on your store (e.g., add an answer capsule to a product page).</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Journey mapped with AI touchpoints</li>
<li>✅ 5 AI touchpoints created for your store</li>
<li>✅ One touchpoint optimized</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Google Search Central – GenAI content: <a href="https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/using-gen-ai-content</a></li>
<li>Shopify product data: <a href="https://shopify.dev/docs/api/liquid/objects/product" target="_blank" rel="noreferrer">https://shopify.dev/docs/api/liquid/objects/product</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 3: How AI reshapes the buying journey',
  emailBody: `<h1>GEO Shopify – Day 3</h1>
<h2>How AI reshapes the buying journey</h2>
<p>Today you'll understand how the journey changed from "search list" to "answer + recommendation" and what it means for your store.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson3() {
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

    const lessonId = `${COURSE_ID}_DAY_3`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_3.day,
          language: 'en', title: UPDATED_LESSON_3.title, content: UPDATED_LESSON_3.content,
          emailSubject: UPDATED_LESSON_3.emailSubject, emailBody: UPDATED_LESSON_3.emailBody, isActive: true,
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

updateLesson3();
