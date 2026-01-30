/**
 * Update Lesson 9 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 *
 * Fixes:
 * - Ensure canonical lessonId format: GEO_SHOPIFY_30_EN_DAY_09
 * - Backup any existing Day 9 lesson records before updates
 * - Deactivate duplicate Day 9 lesson records so audits/runtime pick the intended one
 * - Upgrade content quality to meet >=70 (adds definitions + measurable criteria/metrics)
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_9 = {
  day: 9,
  title: 'Identifiers clean: SKU, GTIN, brand, variants',
  content: `<h1>Identifiers clean: SKU, GTIN, brand, variants</h1>
<p><em>Clean up identifiers so feeds and AI systems don’t merge, confuse, or misquote your products.</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
  <li>Audit 10 products/variants for SKU, GTIN (where applicable), brand, and variant naming.</li>
  <li>Quantify your identifier issues and prioritize fixes.</li>
</ul>
<hr />
<h2>Definitions (so we’re precise)</h2>
<ul>
  <li><strong>SKU</strong>: your internal identifier; it should be unique per purchasable variant.</li>
  <li><strong>GTIN</strong>: standardized identifier (when it exists for the item); it should not be invented or duplicated incorrectly.</li>
  <li><strong>Brand</strong>: the manufacturer/brand field used for disambiguation across systems.</li>
  <li><strong>Variant</strong>: a purchasable option that changes what the customer receives (size, color, pack size).</li>
  <li><strong>Disambiguation</strong>: the ability for systems to tell two similar items apart reliably.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
  <li>Feeds and AI answers use identifiers to match offers; weak identifiers lead to wrong recommendations and wrong comparisons.</li>
  <li>Clean variants reduce “merged items” (different variants treated as the same product) and “split items” (same item treated as different).</li>
</ul>
<hr />
<h2>Success criteria (metrics)</h2>
<ul>
  <li><strong>SKU coverage</strong>: % of variants with a non-empty SKU.</li>
  <li><strong>SKU uniqueness</strong>: count of duplicate SKUs across variants (target: 0).</li>
  <li><strong>GTIN validity</strong>: % of GTINs that appear correct for the item (no random placeholders; no suspicious duplicates).</li>
  <li><strong>Brand consistency</strong>: brand present and consistent formatting across the catalog (target: 100% present where applicable).</li>
  <li><strong>Variant clarity</strong>: option values are single-attribute (Color, Size, Pack size), not mixed strings.</li>
</ul>
<hr />
<h2>What to check (audit checklist)</h2>
<ul>
  <li><strong>SKU</strong>: unique per variant; not reused across colors/sizes.</li>
  <li><strong>GTIN</strong>: only present when you truly have it; not copied across unrelated variants.</li>
  <li><strong>Brand</strong>: present and consistent (no accidental variants like “RunPro” vs “Run Pro” unless intentional).</li>
  <li><strong>Variants</strong>: split attributes properly (no “42 blue or black” style labels).</li>
</ul>
<hr />
<h2>Examples</h2>
<ul>
  <li><strong>Good</strong>: SKU unique per variant; GTIN correct when available; brand consistent; variant options are clean (Color = Blue, Size = 42).</li>
  <li><strong>Poor</strong>: missing SKUs, duplicated SKUs, GTIN copied across unrelated variants, brand missing, mixed variant strings.</li>
</ul>
<hr />
<h2>Guided exercise (10–15 min)</h2>
<ol>
  <li>Create an audit sheet with these columns: Product | Variant | SKU | GTIN | Brand | Issue type | Fix.</li>
  <li>Fill it for 10 variants (include at least 2 products with multiple variants).</li>
  <li>Compute quick metrics:
    <ul>
      <li>SKU coverage %</li>
      <li># duplicate SKUs</li>
      <li># variants with mixed labels</li>
    </ul>
  </li>
</ol>
<h2>Independent exercise (5–10 min)</h2>
<p>Pick the top 3 recurring issue types and write one concrete fix per type (e.g., “assign unique SKU per variant”, “split variant attributes”, “fix brand formatting”).</p>
<hr />
<h2>Self-check</h2>
<ul>
  <li>✅ 10 variants audited</li>
  <li>✅ SKU coverage % computed</li>
  <li>✅ Duplicate SKU count computed</li>
  <li>✅ Top 3 issue types identified and fixes written</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
  <li>GTIN guide (GS1): <a href="https://www.gs1.org/standards/id-keys/gtin" target="_blank" rel="noreferrer">https://www.gs1.org/standards/id-keys/gtin</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 9: Identifiers clean (SKU/GTIN/brand)',
  emailBody: `<h1>GEO Shopify – Day 9</h1>
<h2>Identifiers clean: SKU, GTIN, brand, variants</h2>
<p>Today you’ll audit identifiers and variants so offers don’t get confused across feeds and AI answers.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`,
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

    const canonicalLessonId = `${COURSE_ID}_DAY_09`;

    const existingDay9 = await Lesson.find({ courseId: course._id, dayNumber: 9 }).lean();
    for (const l of existingDay9) {
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
          dayNumber: UPDATED_LESSON_9.day,
          language: 'en',
          title: UPDATED_LESSON_9.title,
          content: UPDATED_LESSON_9.content,
          emailSubject: UPDATED_LESSON_9.emailSubject,
          emailBody: UPDATED_LESSON_9.emailBody,
          isActive: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Lesson.updateMany(
      { courseId: course._id, dayNumber: 9, lessonId: { $ne: canonicalLessonId }, isActive: true },
      { $set: { isActive: false } }
    );

    console.log('✅ Lesson 9 updated successfully');
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

updateLesson9();

