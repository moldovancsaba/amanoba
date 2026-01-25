/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_9 = {
  day: 9,
  title: 'Identifiers clean: SKU, GTIN, brand, variants',
  content: `<h1>Identifiers clean: SKU, GTIN, brand, variants</h1>
<p><em>Today you'll clean up product identifiers so AI and feeds don't confuse items.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll audit 10 products/variants for SKU/GTIN/brand/variant naming.</li>
<li>You'll list missing/incorrect IDs that need fixing.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI and feeds disambiguate with IDs; bad IDs → wrong recommendations. Brand/variant clarity reduces mis-match. Without clean identifiers, AI can't accurately distinguish between products.</p>
<hr />
<h2>What to check: identifier elements</h2>
<h3>SKU</h3>
<p>Check that SKUs are:</p>
<ul>
<li>Unique per variant</li>
<li>Consistent format</li>
<li>No duplicates</li>
</ul>
<h3>GTIN</h3>
<p>Check that GTINs are:</p>
<ul>
<li>Correct if present</li>
<li>Not duplicated</li>
<li>Valid format</li>
</ul>
<h3>Brand</h3>
<p>Check that brand is:</p>
<ul>
<li>Populated for all products</li>
<li>Consistent across products</li>
<li>Clear and recognizable</li>
</ul>
<h3>Variant name</h3>
<p>Check that variant names are:</p>
<ul>
<li>Clear: size/color</li>
<li>No mixing of attributes</li>
<li>Consistent format</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good identifiers</h3>
<p>"SKU: RUNPRO-BLU-42, GTIN: 123…, Brand: RunPro, Variant: men, blue, 42".</p>
<h3>❌ Poor identifiers</h3>
<p>Missing GTIN, duplicate SKU, variant "42 blue or black?" – unclear and confusing.</p>
<hr />
<h2>Practice: audit your identifiers (10-15 min)</h2>
<p>Now you'll audit 10 products/variants for identifiers. Here are the steps:</p>
<ol>
<li>Create an audit sheet with these columns:
   <ul>
   <li>Product</li>
   <li>Variant</li>
   <li>SKU</li>
   <li>GTIN</li>
   <li>Brand</li>
   <li>Notes</li>
   </ul>
</li>
<li>Fill for 10 products/variants.</li>
</ol>
<h2>Independent practice: list fixes (5-10 min)</h2>
<p>Now write 5 fixes (duplicate SKU, GTIN missing, variant name cleanup).</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Audit sheet filled</li>
<li>✅ 10 products/variants reviewed</li>
<li>✅ 5 fixes listed</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>GTIN guide (GS1): <a href="https://www.gs1.org/standards/id-keys/gtin" target="_blank" rel="noreferrer">https://www.gs1.org/standards/id-keys/gtin</a></li>
<li>Shopify product identifiers: <a href="https://help.shopify.com/en/manual/products/products/product-variants" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/products/product-variants</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 9: Identifiers',
  emailBody: `<h1>GEO Shopify – Day 9</h1>
<h2>Identifiers clean: SKU, GTIN, brand, variants</h2>
<p>Today you'll clean up product identifiers so AI and feeds don't confuse items.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson9() {
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

    const lessonId = `${COURSE_ID}_DAY_9`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_9.day,
          language: 'en', title: UPDATED_LESSON_9.title, content: UPDATED_LESSON_9.content,
          emailSubject: UPDATED_LESSON_9.emailSubject, emailBody: UPDATED_LESSON_9.emailBody, isActive: true,
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

updateLesson9();
