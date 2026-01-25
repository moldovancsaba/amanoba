/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_11 = {
  day: 11,
  title: 'Trust signals: identity, support, proof',
  content: `<h1>Trust signals: identity, support, proof</h1>
<p><em>Today you'll add the core trust block so AI and users see who you are and how you help.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll build a trust block (identity/support/proof) and place it on key pages.</li>
<li>You'll verify reviews/guarantees are real and safe to cite.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI prefers reliable, citeable sources. Users need quick proof: who you are, how to reach you, why they should trust you. Without trust signals, AI may not safely quote your store.</p>
<hr />
<h2>Trust elements: what to include</h2>
<h3>Identity</h3>
<p>Include company/brand information:</p>
<ul>
<li>Company name</li>
<li>Brand name</li>
<li>Contact information (email, phone)</li>
</ul>
<h3>Support</h3>
<p>Include support information:</p>
<ul>
<li>Support channels (email, chat, phone)</li>
<li>Response time (e.g., "24–48h")</li>
<li>Availability</li>
</ul>
<h3>Proof</h3>
<p>Include proof elements:</p>
<ul>
<li>Real reviews (not fake)</li>
<li>Guarantee/warranty information</li>
<li>Awards or certifications (if any)</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good trust block</h3>
<p>"Company: XY Inc, email/phone, support 24–48h, 1-year warranty, real reviews link."</p>
<h3>❌ Poor trust block</h3>
<p>No contact, fake reviews, empty about page, no support information.</p>
<hr />
<h2>Practice: build your trust block (10-15 min)</h2>
<p>Now you'll create a trust block and place it on key pages. Here are the steps:</p>
<ol>
<li>Create a trust block (identity/support/proof) with:
   <ul>
   <li>Identity: company/brand, contact</li>
   <li>Support: channels + response time</li>
   <li>Proof: real reviews, guarantee, awards</li>
   </ul>
</li>
<li>Place it on 3 pages (PDP/collection/about).</li>
<li>Verify review authenticity and warranty text accuracy.</li>
</ol>
<h2>Independent practice: update your feed (5-10 min)</h2>
<p>Now mirror brand/guarantee fields in the feed if supported.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Trust block live on 3 pages</li>
<li>✅ Reviews verified as real</li>
<li>✅ Warranty text accurate</li>
<li>✅ Feed updated if supported</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Shopify trust badges: <a href="https://help.shopify.com/en/manual/checkout-settings/trust-badges" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/checkout-settings/trust-badges</a></li>
<li>Google Merchant Center – Trust signals: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 11: Trust signals',
  emailBody: `<h1>GEO Shopify – Day 11</h1>
<h2>Trust signals: identity, support, proof</h2>
<p>Today you'll add the core trust block so AI and users see who you are and how you help.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson11() {
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

    const lessonId = `${COURSE_ID}_DAY_11`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_11.day,
          language: 'en', title: UPDATED_LESSON_11.title, content: UPDATED_LESSON_11.content,
          emailSubject: UPDATED_LESSON_11.emailSubject, emailBody: UPDATED_LESSON_11.emailBody, isActive: true,
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

updateLesson11();
