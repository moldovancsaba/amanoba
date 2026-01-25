/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_16 = {
  day: 16,
  title: 'Collection page as guide, not just grid',
  content: `<h1>Collection page as guide, not just grid</h1>
<p><em>Today you'll turn a collection into a guide so AI can cite it and shoppers decide faster.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll restructure 1 collection page into a guide style that you can use right away.</li>
<li>You'll add 3 blocks: who it's for, how to choose, top picks.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI cites well-structured guidance content. Shoppers decide faster, fewer returns. A guide-style collection helps AI accurately recommend your products and helps customers make better decisions.</p>
<hr />
<h2>Collection guide structure: what to include</h2>
<p>A good guide-style collection page includes these blocks:</p>
<ol>
<li><strong>Hero</strong>: who, which scenario – short, clear introduction</li>
<li><strong>Decision criteria</strong> (3–5 bullets) – what to consider when choosing</li>
<li><strong>Top 3 picks</strong> with PDP links – best product recommendations</li>
<li><strong>Policy short + link</strong> – shipping, returns</li>
<li><strong>Product grid</strong> – the product listing</li>
</ol>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good guide-style collection</h3>
<p>"Running shoes collection: beginner/advanced guide, top 3 models, sizing tips."</p>
<h3>❌ Poor collection</h3>
<p>Product grid only, no guidance, no recommendations, no structure.</p>
<hr />
<h2>Practice: restructure your collection (10-15 min)</h2>
<p>Now you'll restructure 1 collection page into a guide style. Here are the steps:</p>
<ol>
<li>Pick 1 collection: add guide blocks (hero + criteria + top 3).</li>
<li>Link PDPs consistently.</li>
</ol>
<h2>Independent practice: create a template (5-10 min)</h2>
<p>Now document the sections as a template to reuse on other collections.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Hero block present with who/what</li>
<li>✅ Decision criteria listed</li>
<li>✅ Top 3 picks linked</li>
<li>✅ Policy short block</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Shopify collection customization: <a href="https://help.shopify.com/en/manual/online-store/themes/customizing-themes/add-content/change-collection-page" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/themes/customizing-themes/add-content/change-collection-page</a></li>
<li>Content marketing best practices: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 16: Collection as guide',
  emailBody: `<h1>GEO Shopify – Day 16</h1>
<h2>Collection page as guide, not just grid</h2>
<p>Today you'll turn a collection into a guide so AI can cite it and shoppers decide faster.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson16() {
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

    const lessonId = `${COURSE_ID}_DAY_16`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_16.day,
          language: 'en', title: UPDATED_LESSON_16.title, content: UPDATED_LESSON_16.content,
          emailSubject: UPDATED_LESSON_16.emailSubject, emailBody: UPDATED_LESSON_16.emailBody, isActive: true,
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

updateLesson16();
