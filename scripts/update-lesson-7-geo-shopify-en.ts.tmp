/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_7 = {
  day: 2,
  title: 'Shopify product data audit: title, description, variants',
  content: `<h1>Shopify product data audit: title, description, variants</h1>
<p><em>Today you'll find gaps in titles, descriptions, variants, and identifiers.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll create an audit template for 10–20 products that you can use right away.</li>
<li>You'll assess title/subtitle, description, variants, and IDs to find what's missing.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI prefers clear, unambiguous data. Messy variants lead to wrong recommendations. Without clean data, AI can't accurately quote your products.</p>
<hr />
<h2>What to check: product data elements</h2>
<h3>Title/subtitle</h3>
<p>Check that titles are:</p>
<ul>
<li>Concise with key attributes</li>
<li>Include product type, key features</li>
<li>Clear and descriptive</li>
</ul>
<h3>Description</h3>
<p>Check that descriptions are:</p>
<ul>
<li>Short and focused</li>
<li>Key specs up top</li>
<li>Policy links included</li>
</ul>
<h3>Variants</h3>
<p>Check that variants are:</p>
<ul>
<li>Size/color clear</li>
<li>No mixing of attributes</li>
<li>Each variant clearly labeled</li>
</ul>
<h3>IDs</h3>
<p>Check that identifiers are:</p>
<ul>
<li>SKU filled for each variant</li>
<li>GTIN filled where available</li>
<li>Brand name included</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good product data</h3>
<p>"Runner Pro, men, blue, GTIN…, SKU…, subtitle: stability, cushioning, shipping 3–5 days."</p>
<h3>❌ Poor product data</h3>
<p>"Pro shoe" – missing variant info, no ID, no clear attributes.</p>
<hr />
<h2>Practice: create your audit template (10-15 min)</h2>
<p>Now you'll create an audit template and review 10 products. Here are the steps:</p>
<ol>
<li>Create an audit sheet with these columns:
   <ul>
   <li>Product</li>
   <li>Title</li>
   <li>Description</li>
   <li>Variant label</li>
   <li>SKU</li>
   <li>GTIN</li>
   <li>Brand</li>
   <li>Notes</li>
   </ul>
</li>
<li>Fill for 10 products.</li>
</ol>
<h2>Independent practice: log issues (5-10 min)</h2>
<p>Now log 5 issues (e.g., missing SKU/GTIN, messy variant) and mark for fix.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Audit template done</li>
<li>✅ 10 products reviewed</li>
<li>✅ 5 issues recorded</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Shopify product data: <a href="https://help.shopify.com/en/manual/products/products" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/products</a></li>
<li>Google Merchant Center product data: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 7: Product data audit',
  emailBody: `<h1>GEO Shopify – Day 7</h1>
<h2>Shopify product data audit: title, description, variants</h2>
<p>Today you'll find gaps in titles, descriptions, variants, and identifiers.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson7() {
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

    const lessonId = `${COURSE_ID}_DAY_7`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_7.day,
          language: 'en', title: UPDATED_LESSON_7.title, content: UPDATED_LESSON_7.content,
          emailSubject: UPDATED_LESSON_7.emailSubject, emailBody: UPDATED_LESSON_7.emailBody, isActive: true,
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

updateLesson7();
