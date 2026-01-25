/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_6 = {
  day: 2,
  title: 'Define success: GEO prompt set + KPIs',
  content: `<h1>Define success: GEO prompt set + KPIs</h1>
<p><em>Today you'll assemble your 30–50 question GEO test set and the baseline KPI sheet.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll create a 30–50 prompt GEO set that you can use for testing.</li>
<li>You'll build a GEO + commercial KPI baseline sheet to track your progress.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>No measurement, no progress: inclusion, citation, coverage, consistency. Commercial impact: AI referral traffic, conversion, returns. Without tracking, you can't see if your GEO efforts are working.</p>
<hr />
<h2>Prompt set: what to include</h2>
<h3>Question types</h3>
<p>Your prompt set should include:</p>
<ul>
<li>Best questions – "best [category] for [use case]"</li>
<li>Vs questions – "[product A] vs [product B]"</li>
<li>Alternatives questions – "alternatives to [product]"</li>
<li>Policy questions – shipping, returns, sizing</li>
<li>Sizing/shipping questions – specific product inquiries</li>
</ul>
<h3>Quantity</h3>
<p>Create 30–50 questions per your categories to get meaningful data.</p>
<h2>KPIs: what to track</h2>
<h3>GEO KPIs (weekly)</h3>
<p>Track these GEO metrics:</p>
<ul>
<li>Inclusion – does your brand/product show up?</li>
<li>Citation – does the answer link to your domain?</li>
<li>Coverage – how many prompts include you?</li>
<li>Consistency – does it repeat across runs?</li>
</ul>
<h3>Commercial KPIs</h3>
<p>Track these business metrics:</p>
<ul>
<li>AI referral traffic – visitors from AI sources</li>
<li>Conversion – sales from AI referrals</li>
<li>Add-to-cart – engagement from AI traffic</li>
<li>Returns – return rate from AI referrals</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good prompt set and KPIs</h3>
<p>40 prompts by category (best/vs/policy) in a table with measurement columns, KPI sheet with baseline data.</p>
<h3>❌ Poor prompt set and KPIs</h3>
<p>5 generic questions, no metrics, no tracking, no baseline.</p>
<hr />
<h2>Practice: create your prompt set and KPIs (10-15 min)</h2>
<p>Now you'll create your prompt set and KPI sheet. Here are the steps:</p>
<ol>
<li>Create a table with these columns:
   <ul>
   <li>Prompt</li>
   <li>Type (best/vs/policy)</li>
   <li>Expected inclusion/citation</li>
   <li>Notes</li>
   </ul>
</li>
<li>Fill 20 questions (mix best, vs, policy).</li>
<li>Create a KPI sheet with:
   <ul>
   <li>GEO metrics (inclusion, citation, consistency)</li>
   <li>Commercial metrics (AI referral, conversion, returns)</li>
   </ul>
</li>
</ol>
<h2>Independent practice: expand your set (5-10 min)</h2>
<p>Now expand to 30–50 prompts and add priorities (A/B/C).</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ 30–50 prompt list ready</li>
<li>✅ KPI baseline sheet ready</li>
<li>✅ Prompts prioritized</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Measurement tools: <a href="https://developers.google.com/webmaster-tools/search-console-api-original" target="_blank" rel="noreferrer">Search Console API</a>, <a href="https://clarity.microsoft.com/" target="_blank" rel="noreferrer">Microsoft Clarity</a></li>
<li>Analytics best practices: <a href="https://www.shopify.com/blog/ecommerce-analytics" target="_blank" rel="noreferrer">https://www.shopify.com/blog/ecommerce-analytics</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 6: Prompt set + KPIs',
  emailBody: `<h1>GEO Shopify – Day 6</h1>
<h2>Define success: GEO prompt set + KPIs</h2>
<p>Today you'll assemble your 30–50 question GEO test set and the baseline KPI sheet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson6() {
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

    const lessonId = `${COURSE_ID}_DAY_6`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_6.day,
          language: 'en', title: UPDATED_LESSON_6.title, content: UPDATED_LESSON_6.content,
          emailSubject: UPDATED_LESSON_6.emailSubject, emailBody: UPDATED_LESSON_6.emailBody, isActive: true,
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

updateLesson6();
