/**
 * Update Lesson 7 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_7 = {
  day: 7,
  title: 'Shopify product data audit: title, description, variants',
  content: `<h1>Shopify product data audit: title, description, variants</h1>
<p><em>Today you’ll find (and fix) gaps in titles, descriptions, variants, and identifiers so AI systems can accurately understand and recommend your products.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll create an audit template for 10–20 products that you can use right away.</li>
<li>You'll assess title/subtitle, description, variants, and IDs to find what's missing.</li>
</ul>
<hr />
<h2>Definitions (so this is measurable)</h2>
<ul>
<li><strong>Title</strong>: the primary product name shown in search and listings.</li>
<li><strong>Subtitle / key attributes</strong>: short qualifiers that prevent ambiguity (material, size range, compatibility, use-case).</li>
<li><strong>Variant</strong>: a purchasable option that changes what the customer receives (size, color, pack size).</li>
<li><strong>SKU</strong>: internal identifier that should be unique per variant for operations and tracking.</li>
<li><strong>GTIN</strong>: standardized product identifier (when available) used across commerce systems.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI prefers clear, unambiguous data. Messy variants lead to wrong recommendations. Without clean data, AI can't accurately quote your products.</p>
<hr />
<h2>Success criteria (metrics)</h2>
<ul>
<li><strong>ID coverage</strong>: % of variants with SKU present (and GTIN where applicable).</li>
<li><strong>Variant clarity</strong>: variants use one consistent attribute per option (e.g., Size and Color are separate options, not mixed labels).</li>
<li><strong>Title clarity</strong>: titles include product type + the minimum distinguishing attributes (so two products don’t look identical).</li>
<li><strong>Description usefulness</strong>: first 3–5 lines contain the key specs and decision info customers need.</li>
</ul>
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
<h2>Common pitfalls (what to avoid)</h2>
<ul>
<li>Using vague titles that omit the distinguishing attribute (customers and AI can’t tell products apart).</li>
<li>Putting key specs only at the bottom of a long description (important details get ignored).</li>
<li>Mixing attributes in variant labels (e.g., “Blue / Size M / Pack of 2” as one value) instead of separate options.</li>
<li>Leaving SKU blank “for now” (breaks tracking and makes duplicates likely).</li>
</ul>
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
<li>Compute quick metrics:
  <ul>
    <li>SKU coverage = variants with SKU / total variants</li>
    <li>GTIN coverage (if applicable) = variants with GTIN / total variants</li>
    <li>Count ambiguous titles (could be confused with another product)</li>
  </ul>
</li>
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
<li>✅ You can state your SKU coverage %</li>
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
<p>Today you’ll find (and fix) gaps in titles, descriptions, variants, and identifiers.</p>
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

    const backupDir = join(process.cwd(), 'scripts', 'lesson-backups', COURSE_ID);
    mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Canonical lessonId format for day numbers is DAY_XX (zero-padded).
    // Also: historically we may have duplicates like DAY_7 and DAY_07; the audit keeps the oldest per dayNumber.
    const canonicalLessonId = `${COURSE_ID}_DAY_07`;

    const existingDay7 = await Lesson.find({ courseId: course._id, dayNumber: 7 }).lean();
    for (const l of existingDay7) {
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
          dayNumber: UPDATED_LESSON_7.day,
          language: 'en', title: UPDATED_LESSON_7.title, content: UPDATED_LESSON_7.content,
          emailSubject: UPDATED_LESSON_7.emailSubject, emailBody: UPDATED_LESSON_7.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Deactivate any other duplicates for day 7 so the audit + runtime don’t pick the wrong one.
    await Lesson.updateMany(
      { courseId: course._id, dayNumber: 7, lessonId: { $ne: canonicalLessonId }, isActive: true },
      { $set: { isActive: false } }
    );

    console.log(`✅ Lesson 7 updated successfully`);
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

updateLesson7();
