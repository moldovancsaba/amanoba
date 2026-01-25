/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_2 = {
  day: 2,
  title: 'GEO vs SEO on Shopify: what to watch',
  content: `<h1>GEO vs SEO on Shopify: what to watch</h1>
<p><em>Today you'll see which elements matter for generative surfaces and how they complement SEO.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll list what is SEO-first vs GEO-first, so you know what to prioritize.</li>
<li>You'll build a 10-point GEO checklist for Shopify that you can use right away.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI answers summarize core product data: if it's missing, you're excluded. GEO is not ranking; it's about clarity and quotability. Understanding the difference helps you focus on what actually matters for AI-powered search.</p>
<hr />
<h2>SEO-first vs GEO-first: what's the difference?</h2>
<h3>SEO-first elements</h3>
<p>These elements matter most for traditional search:</p>
<ul>
<li>Meta title/description – search result snippets</li>
<li>Internal links – site structure and navigation</li>
<li>Canonical tags – duplicate content handling</li>
<li>Page speed – loading performance</li>
<li>Backlinks – external authority signals</li>
<li>Long-form structured content – comprehensive articles</li>
</ul>
<h3>GEO-first elements</h3>
<p>These elements matter most for generative AI:</p>
<ul>
<li>Accurate product facts (price, stock, identifiers) plainly rendered</li>
<li>Verifiable policies (shipping/returns) clearly stated</li>
<li>Stable URLs that don't change</li>
<li>Short answer-ready blocks (answer capsule) at the top</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good GEO foundation</h3>
<p>Top-of-page summary, clear price/stock, GTIN + SKU visible, stable URLs, answer capsule.</p>
<h3>❌ Poor GEO foundation</h3>
<p>Long messy copy, missing IDs, mixed variant data, dynamic URLs, no answer capsule.</p>
<hr />
<h2>Practice: build your GEO checklist (10-15 min)</h2>
<p>Now you'll create a 10-point GEO checklist and apply it to your product pages. Here are the steps:</p>
<ol>
<li>Create a 10-point GEO checklist with these items:
   <ul>
   <li>Price – clearly displayed</li>
   <li>Stock – availability status</li>
   <li>GTIN/SKU – product identifiers</li>
   <li>Policy – shipping/returns information</li>
   <li>Answer capsule – short summary at top</li>
   <li>Stable URL – doesn't change</li>
   <li>Alt text – image descriptions</li>
   <li>Structured data – schema markup</li>
   <li>Internal link – navigation structure</li>
   <li>Review rules – authentic reviews only</li>
   </ul>
</li>
<li>Apply it to one product page (PDP) and mark what's OK vs missing.</li>
</ol>
<h2>Independent practice: audit another page (5-10 min)</h2>
<p>Now apply the checklist to another PDP and note 3 gaps that need fixing.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Checklist done (10 points)</li>
<li>✅ One PDP audited</li>
<li>✅ 3 fixes noted on another PDP</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Shopify SEO guide: <a href="https://help.shopify.com/en/manual/online-store/themes/theme-structure/seo" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/themes/theme-structure/seo</a></li>
<li>GEO best practices: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 2: GEO vs SEO',
  emailBody: `<h1>GEO Shopify – Day 2</h1>
<h2>GEO vs SEO on Shopify: what to watch</h2>
<p>Today you'll see which elements matter for generative surfaces and how they complement SEO.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson2() {
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

    const lessonId = `${COURSE_ID}_DAY_2`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_2.day,
          language: 'en', title: UPDATED_LESSON_2.title, content: UPDATED_LESSON_2.content,
          emailSubject: UPDATED_LESSON_2.emailSubject, emailBody: UPDATED_LESSON_2.emailBody, isActive: true,
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

updateLesson2();
