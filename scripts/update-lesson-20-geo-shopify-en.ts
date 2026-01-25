/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_20 = {
  day: 20,
  title: 'Minimum content: no "thin" PDP',
  content: `<h1>Minimum content: no "thin" PDP</h1>
<p><em>Today you'll eliminate low-content product pages.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll define the minimum content standard that you can use right away.</li>
<li>You'll fix 3 thin pages so they meet the standard.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Low content is harder to cite and leads to bad recommendations. Returns rise if users lack info. Without minimum content, AI can't accurately understand and quote your products.</p>
<hr />
<h2>Minimum content elements: what to include</h2>
<p>A good product page (PDP) includes these elements minimum:</p>
<ul>
<li><strong>Answer capsule</strong> – short summary at the top</li>
<li><strong>Price/stock</strong> – accurate price and stock information</li>
<li><strong>Policy</strong> – shipping and returns information</li>
<li><strong>3 USPs</strong> – 3 key benefits (Unique Selling Propositions)</li>
<li><strong>Specs</strong> – product specifications in a table</li>
<li><strong>2 images with variants</strong> – at least 2 images, variant assigned</li>
</ul>
<h3>If missing</h3>
<p>If something is missing:</p>
<ul>
<li>Fill from template – use pre-made templates</li>
<li>Add specs table – create a specifications table</li>
<li>Add images – include at least 2 images</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good content-rich PDP</h3>
<p>Capsule + 3 USPs + specs + 4 images, all minimum elements present.</p>
<h3>❌ "Thin" PDP (low content)</h3>
<p>One-line description, one image, no policy, no specs, no structure.</p>
<hr />
<h2>Practice: fix your thin pages (10-15 min)</h2>
<p>Now you'll build a minimum standard checklist and fix 3 thin pages. Here are the steps:</p>
<ol>
<li>Build a minimum standard checklist with all required elements.</li>
<li>Pick 3 thin PDPs and fill missing blocks.</li>
</ol>
<h2>Independent practice: document the standard (5-10 min)</h2>
<p>Now document the standard for new products so it's required going forward.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Minimum list ready</li>
<li>✅ 3 PDPs enriched</li>
<li>✅ Specs table present</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Helpful content guidance: <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/creating-helpful-content</a></li>
<li>Shopify product page optimization: <a href="https://help.shopify.com/en/manual/online-store/themes/customizing-themes" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/themes/customizing-themes</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 20: Minimum content',
  emailBody: `<h1>GEO Shopify – Day 20</h1>
<h2>Minimum content: no "thin" PDP</h2>
<p>Today you'll eliminate low-content product pages.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson20() {
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

    const lessonId = `${COURSE_ID}_DAY_20`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_20.day,
          language: 'en', title: UPDATED_LESSON_20.title, content: UPDATED_LESSON_20.content,
          emailSubject: UPDATED_LESSON_20.emailSubject, emailBody: UPDATED_LESSON_20.emailBody, isActive: true,
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

updateLesson20();
