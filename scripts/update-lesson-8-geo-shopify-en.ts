/**
 * Update Lesson 8 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 *
 * Fixes:
 * - Ensure canonical lessonId format: GEO_SHOPIFY_30_EN_DAY_08
 * - Backup any existing Day 8 lesson records before updates
 * - Deactivate duplicate Day 8 lesson records so audits/runtime pick the intended one
 * - Upgrade content quality to meet >=70 (adds measurable criteria/metrics)
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_8 = {
  day: 8,
  title: 'Why feeds matter: “offer truth”',
  content: `<h1>Why feeds matter: “offer truth”</h1>
<p><em>Today you’ll ensure your product feed and product pages tell the same “truth” about price, stock, policies, and identifiers.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Define the “offer truth” fields that must match across feed and PDP.</li>
  <li>Audit 5 products and quantify your mismatch rate.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Shopping surfaces rely on both the feed and the PDP; conflicts reduce quotability and can break eligibility.</li>
  <li>Wrong price/stock/policy creates support tickets and failed checkouts.</li>
</ul>
<hr />
<h2>Definitions</h2>
<ul>
  <li><strong>Feed</strong>: your exported product/offer data (often used by merchant programs).</li>
  <li><strong>PDP</strong>: Product Detail Page on your Shopify storefront.</li>
  <li><strong>Offer truth</strong>: the set of offer facts that must be consistent across surfaces.</li>
</ul>
<hr />
<h2>Offer truth: what must match</h2>
<ul>
  <li><strong>Price</strong>: base price, sale price rules, currency, and price range behavior for variants.</li>
  <li><strong>Stock</strong>: in-stock/out-of-stock and availability at the variant level (not just the parent product).</li>
  <li><strong>Policies</strong>: shipping timeframe/conditions, returns window/conditions, warranty (if applicable) with stable links.</li>
  <li><strong>Identifiers</strong>: consistent brand + SKU per variant; GTIN where available and correct.</li>
</ul>
<hr />
<h2>Success criteria (metrics)</h2>
<ul>
  <li><strong>Mismatch rate</strong>: (# mismatched fields across your sample) / (# products × fields checked).</li>
  <li><strong>Critical mismatch count</strong>: price mismatches + stock mismatches + broken policy links.</li>
  <li><strong>Fix throughput</strong>: how many mismatches you can eliminate per week (track to prevent regression).</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
  <li><strong>Good</strong>: same price/stock/policy on feed and PDP; SKU/GTIN consistent; policy links work and are specific.</li>
  <li><strong>Poor</strong>: conflicting prices, stock shown on one surface but not the other, missing or vague policies, identifiers missing or duplicated.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min): audit feed vs PDP</h2>
<ol>
  <li>Pick 5 products (include at least 2 with variants).</li>
  <li>For each product, compare feed vs PDP for:
    <ul>
      <li>Price (and sale price if relevant)</li>
      <li>Stock / availability</li>
      <li>Shipping + returns links (do they exist and do they match?)</li>
      <li>SKU per variant; GTIN where applicable</li>
    </ul>
  </li>
  <li>Compute mismatch rate:
    <ul>
      <li>Fields checked = products × 4</li>
      <li>Mismatch rate = mismatches / fields checked</li>
    </ul>
  </li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Fix one critical mismatch (price, stock, or a broken policy link), then re-check that the feed and PDP now agree.</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>✅ 5 products audited</li>
  <li>✅ Mismatch rate computed</li>
  <li>✅ At least one critical mismatch fixed and verified</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
  <li>Google Merchant Center feed requirements: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
  <li>Shopify import/export: <a href="https://help.shopify.com/en/manual/products/import-export" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/import-export</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 8: Offer truth (feed vs PDP)',
  emailBody: `<h1>GEO Shopify – Day 8</h1>
<h2>Why feeds matter: “offer truth”</h2>
<p>Today you’ll ensure your feed and product pages match on price, stock, policies, and identifiers.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
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
        name: 'Amanoba',
        slug: 'amanoba',
        displayName: 'Amanoba',
        description: 'Unified Learning Platform',
        logo: '/AMANOBA.png',
        themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
        allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
        supportedLanguages: ['hu', 'en'],
        defaultLanguage: 'hu',
        isActive: true,
      });
      console.log('✅ Brand created');
    }

    const course = await Course.findOneAndUpdate(
      { courseId: COURSE_ID },
      {
        $set: {
          courseId: COURSE_ID,
          name: 'GEO Shopify – 30-day course',
          description:
            '30 days of practical GEO training for Shopify merchants: in 20–30 minutes a day you build product and content foundations so generative systems can safely find, parse, and cite your store.',
          language: 'en',
          durationDays: 30,
          isActive: true,
          requiresPremium: false,
          brandId: brand._id,
          pointsConfig: { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 },
          xpConfig: { completionXP: 500, lessonXP: 25 },
          metadata: {
            category: 'education',
            difficulty: 'intermediate',
            estimatedHours: 10,
            tags: ['geo', 'shopify', 'ecommerce'],
            instructor: 'Amanoba',
          },
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Course ${COURSE_ID} found/created: ${course.name}`);

    const backupDir = join(process.cwd(), 'scripts', 'lesson-backups', COURSE_ID);
    mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');

    const canonicalLessonId = `${COURSE_ID}_DAY_08`;

    const existingDay8 = await Lesson.find({ courseId: course._id, dayNumber: 8 }).lean();
    for (const l of existingDay8) {
      const p = join(backupDir, `${l.lessonId}__${stamp}.json`);
      writeFileSync(
        p,
        JSON.stringify(
          {
            backedUpAt: new Date().toISOString(),
            course: { courseId: COURSE_ID, name: course.name, language: course.language },
            lesson: {
              lessonId: l.lessonId,
              dayNumber: l.dayNumber,
              title: l.title,
              language: l.language,
              isActive: l.isActive,
              createdAt: l.createdAt,
            },
            content: l.content,
            emailSubject: (l as any).emailSubject || null,
            emailBody: (l as any).emailBody || null,
          },
          null,
          2
        )
      );
    }

    const lesson = await Lesson.findOneAndUpdate(
      { lessonId: canonicalLessonId },
      {
        $set: {
          lessonId: canonicalLessonId,
          courseId: course._id,
          dayNumber: UPDATED_LESSON_8.day,
          language: 'en',
          title: UPDATED_LESSON_8.title,
          content: UPDATED_LESSON_8.content,
          emailSubject: UPDATED_LESSON_8.emailSubject,
          emailBody: UPDATED_LESSON_8.emailBody,
          isActive: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Lesson.updateMany(
      { courseId: course._id, dayNumber: 8, lessonId: { $ne: canonicalLessonId }, isActive: true },
      { $set: { isActive: false } }
    );

    console.log('✅ Lesson 8 updated successfully');
    console.log(`   Lesson ID: ${lesson.lessonId}`);
    console.log(`   Title: ${lesson.title}`);
    console.log(`   Backups: ${backupDir}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateLesson8();

