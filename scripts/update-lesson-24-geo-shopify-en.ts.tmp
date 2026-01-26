/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_24 = {
  day: 24,
  title: 'Use-case landing: gift, season, sport, budget',
  content: `<h1>Use-case landing: gift, season, sport, budget</h1>
<p><em>Today you'll build a use-case page so AI can quote context-specific recommendations.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll draft one use-case landing (e.g., gift or season) that you can use right away.</li>
<li>You'll link 3–5 products with reasons so the guide points to specific products.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI often gets contextual questions ("gift for mom", "winter running"). Use-case pages increase citability. Without use-case pages, AI can't provide context-specific recommendations for your products.</p>
<hr />
<h2>Use-case landing structure: what to include</h2>
<p>A good use-case landing page includes these sections:</p>
<ol>
<li><strong>Hero</strong>: who/when – short, clear introduction</li>
<li><strong>Decision criteria</strong> (3–5 bullets) – what to consider</li>
<li><strong>Product list</strong> with reasons – product recommendations</li>
<li><strong>Policy/fit short</strong> – shipping, returns, sizing</li>
</ol>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good use-case landing</h3>
<p>"Winter running: insulation, grip, visibility; top 3 models linked."</p>
<h3>❌ Poor use-case landing</h3>
<p>Grid without context, no guidance, no recommendations.</p>
<hr />
<h2>Practice: create your use-case landing (10-15 min)</h2>
<p>Now you'll choose a use-case and write the blocks. Here are the steps:</p>
<ol>
<li>Choose a use-case (e.g., gift, season, sport, budget), write the blocks.</li>
<li>Add 3–5 products with short reasons.</li>
</ol>
<h2>Independent practice: draft another use-case (5-10 min)</h2>
<p>Now draft a second use-case outline.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Use-case hero present</li>
<li>✅ Criteria and product list with reasons</li>
<li>✅ Policy/fit noted</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Generative content guidance: <a href="https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/using-gen-ai-content</a></li>
<li>Content marketing: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 24: Use-case landing',
  emailBody: `<h1>GEO Shopify – Day 24</h1>
<h2>Use-case landing: gift, season, sport, budget</h2>
<p>Today you'll build a use-case page so AI can quote context-specific recommendations.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson24() {
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

    const lessonId = `${COURSE_ID}_DAY_24`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_24.day,
          language: 'en', title: UPDATED_LESSON_24.title, content: UPDATED_LESSON_24.content,
          emailSubject: UPDATED_LESSON_24.emailSubject, emailBody: UPDATED_LESSON_24.emailBody, isActive: true,
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

updateLesson24();
