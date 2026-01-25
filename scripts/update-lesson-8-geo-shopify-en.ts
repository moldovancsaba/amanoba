/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_8 = {
  day: 8,
  title: 'Why feeds matter: "offer truth"',
  content: `<h1>Why feeds matter: "offer truth"</h1>
<p><em>Today you'll ensure feed and PDP match on price, stock, shipping, returns, identifiers.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll list the offer truth elements (price, stock, shipping, returns, IDs).</li>
<li>You'll check feed vs PDP gaps on 5 products to find discrepancies.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI and merchant programs rely on both feed and PDP. Conflicting price/stock/policy → exclusion or bad recommendations. Ensuring consistency helps AI accurately quote your products.</p>
<hr />
<h2>Offer truth: what must match</h2>
<p>These elements must match between feed and PDP:</p>
<ul>
<li><strong>Price</strong> – accurate, discounts handled correctly</li>
<li><strong>Stock</strong> – current, variant-level accuracy</li>
<li><strong>Shipping/returns</strong> – clear, linked policies</li>
<li><strong>IDs</strong> – consistent (GTIN/SKU/brand)</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good offer truth</h3>
<p>Feed and PDP show same price/stock/policy, consistent IDs, matching information.</p>
<h3>❌ Poor offer truth</h3>
<p>Mismatched price, missing policy, no IDs, conflicting information.</p>
<hr />
<h2>Practice: check feed vs PDP (10-15 min)</h2>
<p>Now you'll compare feed and PDP for 5 products. Here are the steps:</p>
<ol>
<li>Pick 5 products: compare feed export vs PDP for price/stock/policy.</li>
<li>Note discrepancies and fixes needed.</li>
</ol>
<h2>Independent practice: fix one discrepancy (5-10 min)</h2>
<p>Now fix one discrepancy you found (e.g., update feed price to match PDP).</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ 5 products compared</li>
<li>✅ Discrepancies noted</li>
<li>✅ At least one fix applied</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Google Merchant Center feed requirements: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
<li>Shopify feed optimization: <a href="https://help.shopify.com/en/manual/products/import-export" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/import-export</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 8: Feed truth',
  emailBody: `<h1>GEO Shopify – Day 8</h1>
<h2>Why feeds matter: "offer truth"</h2>
<p>Today you'll ensure feed and PDP match on price, stock, shipping, returns, identifiers.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson8() {
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

    const lessonId = `${COURSE_ID}_DAY_8`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_8.day,
          language: 'en', title: UPDATED_LESSON_8.title, content: UPDATED_LESSON_8.content,
          emailSubject: UPDATED_LESSON_8.emailSubject, emailBody: UPDATED_LESSON_8.emailBody, isActive: true,
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

updateLesson8();
