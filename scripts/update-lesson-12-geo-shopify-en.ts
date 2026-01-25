/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_12 = {
  day: 12,
  title: 'Merchant readiness checklist: top 10 fixes',
  content: `<h1>Merchant readiness checklist: top 10 fixes</h1>
<p><em>Today you'll summarize critical fixes and schedule the top 10 with owners and dates.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll create a merchant readiness checklist that you can use right away.</li>
<li>You'll schedule the top 10 fixes with owner and date to track progress.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>You focus on the highest-impact gaps. Team sees what's GEO-ready and what's not. Without prioritization, you'll waste time on low-impact fixes.</p>
<hr />
<h2>Checklist elements: what to include</h2>
<p>A good merchant readiness checklist includes:</p>
<ul>
<li>Price/stock/policy alignment – feed and PDP match</li>
<li>SKU/GTIN/brand filled – all identifiers present</li>
<li>Shipping/returns block consistent – same on all pages</li>
<li>Answer capsule at top of PDP – short summary</li>
<li>Trust block (identity/support/proof) – trust signals present</li>
<li>Stable URLs – don't change</li>
<li>Structured data – schema markup</li>
<li>Policy links – stable and consistent</li>
<li>Product data – accurate and fresh</li>
<li>Feed and PDP consistency – match between feed and site</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good readiness checklist</h3>
<p>Checklist done, top 10 fixes with owner + due date, regular status tracking.</p>
<h3>❌ Poor readiness checklist</h3>
<p>Long list, no priority, no owner, no deadlines, no tracking.</p>
<hr />
<h2>Practice: create your checklist (10-15 min)</h2>
<p>Now you'll build the readiness checklist and prioritize fixes. Here are the steps:</p>
<ol>
<li>Build the readiness checklist (20–30 items) with all GEO requirements.</li>
<li>Select top 10, assign owner and deadline.</li>
</ol>
<h2>Independent practice: share with team (5-10 min)</h2>
<p>Now share the list with your team and set up weekly status tracking.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Checklist done (20–30 items)</li>
<li>✅ Top 10 fixes selected</li>
<li>✅ Owners and deadlines assigned</li>
<li>✅ Status tracking set up</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Google Merchant Center – Quality guidelines: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
<li>Shopify store optimization: <a href="https://help.shopify.com/en/manual/online-store/themes/theme-structure" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/themes/theme-structure</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 12: Readiness checklist',
  emailBody: `<h1>GEO Shopify – Day 12</h1>
<h2>Merchant readiness checklist: top 10 fixes</h2>
<p>Today you'll summarize critical fixes and schedule the top 10 with owners and dates.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson12() {
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

    const lessonId = `${COURSE_ID}_DAY_12`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_12.day,
          language: 'en', title: UPDATED_LESSON_12.title, content: UPDATED_LESSON_12.content,
          emailSubject: UPDATED_LESSON_12.emailSubject, emailBody: UPDATED_LESSON_12.emailBody, isActive: true,
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

updateLesson12();
