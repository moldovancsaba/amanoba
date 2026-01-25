/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_13 = {
  day: 13,
  title: 'Citable PDP blueprint',
  content: `<h1>Citable PDP blueprint</h1>
<p><em>Today you'll structure your PDP so AI can safely cite it.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll lay out the "GEO-ready" PDP block order that you can use right away.</li>
<li>You'll refactor 1 PDP to the blueprint to see it in action.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Models read top blocks first. Clear structure reduces misread price/policy/variants. A well-structured PDP increases the chance that AI will accurately quote your products.</p>
<hr />
<h2>Recommended PDP block order</h2>
<p>A GEO-ready product page should have blocks in this order:</p>
<ol>
<li><strong>Answer capsule</strong> (who for/not for, price/stock, policy short) – most important at the top</li>
<li><strong>Main image + variant visual</strong> – product images, variant selector</li>
<li><strong>Price, stock, key USPs, CTA</strong> – purchase-driving information</li>
<li><strong>Policy block</strong> (shipping/returns link) – clear policy information</li>
<li><strong>Detailed description, specs</strong> – comprehensive product information</li>
<li><strong>Trust</strong>: reviews, warranty, support – trust elements</li>
</ol>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good GEO-ready PDP</h3>
<p>Short capsule, clear price/stock, policy link, spec table, trust elements above the fold.</p>
<h3>❌ Poor GEO-ready PDP</h3>
<p>Long paragraph, no price, scattered policy, missing CTA, no structure.</p>
<hr />
<h2>Practice: refactor your PDP (10-15 min)</h2>
<p>Now you'll take one PDP and reorder it according to the blueprint. Here are the steps:</p>
<ol>
<li>Take one PDP: reorder blocks per blueprint.</li>
<li>Add capsule and policy block if missing.</li>
</ol>
<h2>Independent practice: apply to another PDP (5-10 min)</h2>
<p>Now repeat on another PDP and note what you had to add.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Capsule present</li>
<li>✅ Price/stock/CTA visible</li>
<li>✅ Policy link stable</li>
<li>✅ Specs in a table</li>
<li>✅ Trust above the fold</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Shopify PDP content: <a href="https://shopify.dev/docs/api/liquid/objects/product" target="_blank" rel="noreferrer">https://shopify.dev/docs/api/liquid/objects/product</a></li>
<li>GEO overview: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 13: Citable PDP blueprint',
  emailBody: `<h1>GEO Shopify – Day 13</h1>
<h2>Citable PDP blueprint</h2>
<p>Today you'll structure your PDP so AI can safely cite it.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson13() {
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

    const lessonId = `${COURSE_ID}_DAY_13`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_13.day,
          language: 'en', title: UPDATED_LESSON_13.title, content: UPDATED_LESSON_13.content,
          emailSubject: UPDATED_LESSON_13.emailSubject, emailBody: UPDATED_LESSON_13.emailBody, isActive: true,
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

updateLesson13();
