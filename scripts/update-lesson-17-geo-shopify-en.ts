/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_17 = {
  day: 17,
  title: 'Structured data check (schema)',
  content: `<h1>Structured data check (schema)</h1>
<p><em>Today you'll validate product/offer schema so AI reads price/availability/IDs correctly.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll validate product/offer schema on 3 pages.</li>
<li>You'll list errors/missing fields that need fixing.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Models rely on structured data. Bad schema → wrong price/stock/ID. Without correct schema, AI can't accurately parse your product information.</p>
<hr />
<h2>What to check in schema</h2>
<h3>Product and Offer types</h3>
<p>Check that schema includes:</p>
<ul>
<li>@type Product + Offer</li>
<li>price – accurate price</li>
<li>priceCurrency – currency (e.g., "USD", "EUR")</li>
<li>availability – stock status (e.g., "InStock", "OutOfStock")</li>
</ul>
<h3>Identifiers and information</h3>
<p>Important fields:</p>
<ul>
<li>sku – Stock Keeping Unit</li>
<li>gtin – Global Trade Item Number (if available)</li>
<li>brand – brand name</li>
<li>image – product image URL</li>
<li>url – product page URL</li>
<li>review – real reviews (if any)</li>
</ul>
<p><strong>Important</strong>: Do not include fake reviews, as this can lead to exclusion.</p>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good schema</h3>
<p>Valid JSON-LD, price/stock match PDP, Product + Offer types, accurate identifiers.</p>
<h3>❌ Poor schema</h3>
<p>Missing availability, wrong price, fake review, missing identifiers.</p>
<hr />
<h2>Practice: validate your schema (10-15 min)</h2>
<p>Now you'll validate product/offer schema on 3 pages. Here are the steps:</p>
<ol>
<li>Run Rich Results Test on 3 PDPs.</li>
<li>Note errors (missing field, invalid value).</li>
</ol>
<h2>Independent practice: fix one error (5-10 min)</h2>
<p>Now fix 1 error (e.g., availability or price) and retest.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ 3 pages validated</li>
<li>✅ Errors listed</li>
<li>✅ At least 1 error fixed</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Shopify structured data: <a href="https://shopify.dev/docs/themes/metadata/structured-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/themes/metadata/structured-data</a></li>
<li>Rich Results Test: <a href="https://search.google.com/test/rich-results" target="_blank" rel="noreferrer">https://search.google.com/test/rich-results</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 17: Schema check',
  emailBody: `<h1>GEO Shopify – Day 17</h1>
<h2>Structured data check (schema)</h2>
<p>Today you'll validate product/offer schema so AI reads price/availability/IDs correctly.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson17() {
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

    const lessonId = `${COURSE_ID}_DAY_17`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_17.day,
          language: 'en', title: UPDATED_LESSON_17.title, content: UPDATED_LESSON_17.content,
          emailSubject: UPDATED_LESSON_17.emailSubject, emailBody: UPDATED_LESSON_17.emailBody, isActive: true,
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

updateLesson17();
