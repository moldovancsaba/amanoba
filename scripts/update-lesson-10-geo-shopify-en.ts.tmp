/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_10 = {
  day: 10,
  title: 'Shipping and returns: clarity',
  content: `<h1>Shipping and returns: clarity</h1>
<p><em>Today you'll clarify shipping and returns so AI doesn't promise the wrong thing.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll update/check the shipping/returns block on product pages (PDPs).</li>
<li>You'll unify policy links so they're consistent everywhere.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Misunderstood shipping/returns hurts conversion and support. AI may quote the policy: make it accurate and easy to find. Clear policies help AI accurately recommend your products.</p>
<hr />
<h2>Shipping and returns: what to include</h2>
<h3>Short block on PDP</h3>
<p>Add a short block that includes:</p>
<ul>
<li>Ship time – delivery timeframe (e.g., "3–5 days")</li>
<li>Ship cost – shipping price (e.g., "$X" or "Free")</li>
<li>Return deadline – return timeframe (e.g., "30 days")</li>
<li>Return cost – return price (e.g., "Free" or "$X")</li>
</ul>
<h3>Policy link</h3>
<p>Link the full policy:</p>
<ul>
<li>Stable URL that doesn't change</li>
<li>Same link on all product pages</li>
<li>Easy to find</li>
</ul>
<h3>Feed consistency</h3>
<p>If the feed supports it, mirror the same information in the feed so feed and PDP match.</p>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good shipping/returns block</h3>
<p>"3–5 days, $X; free returns 30 days; details: /policies/shipping".</p>
<h3>❌ Poor shipping/returns block</h3>
<p>"Fast" with no link, no timeframe, no cost information.</p>
<hr />
<h2>Practice: update your shipping/returns blocks (10-15 min)</h2>
<p>Now you'll check and update shipping/returns blocks on your product pages. Here are the steps:</p>
<ol>
<li>Pick 5 products: check ship/returns block and policy link.</li>
<li>Align feed info if supported.</li>
</ol>
<h2>Independent practice: create a template (5-10 min)</h2>
<p>Now write a short policy line template for PDPs: "Shipping X, returns Y, details: /policy".</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Policy block present and clear</li>
<li>✅ Links stable</li>
<li>✅ Feed (if any) matches</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Google Merchant Center policy rules: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
<li>Shopify shipping settings: <a href="https://help.shopify.com/en/manual/checkout-settings/refund-returns" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/checkout-settings/refund-returns</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 10: Shipping and returns',
  emailBody: `<h1>GEO Shopify – Day 10</h1>
<h2>Shipping and returns: clarity</h2>
<p>Today you'll clarify shipping and returns so AI doesn't promise the wrong thing.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson10() {
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

    const lessonId = `${COURSE_ID}_DAY_10`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_10.day,
          language: 'en', title: UPDATED_LESSON_10.title, content: UPDATED_LESSON_10.content,
          emailSubject: UPDATED_LESSON_10.emailSubject, emailBody: UPDATED_LESSON_10.emailBody, isActive: true,
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

updateLesson10();
