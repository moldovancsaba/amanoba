/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_14 = {
  day: 14,
  title: 'Answer capsule: 5-line top summary',
  content: `<h1>Answer capsule: 5-line top summary</h1>
<p><em>Today you'll write the short block AI can safely quote.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll write 2 answer capsules that you can use right away.</li>
<li>You'll place them at the top of product pages (PDPs).</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Models seek concise facts above the fold. Reduces misread: who for/not for, price/policy clear. An answer capsule helps AI quickly understand and accurately quote your products.</p>
<hr />
<h2>5-line answer capsule template</h2>
<p>A good answer capsule includes these 5 lines:</p>
<ol>
<li><strong>Who and what for?</strong> – target audience and use case</li>
<li><strong>Who not for?</strong> – who shouldn't buy this</li>
<li><strong>Main benefit</strong> (1–2 bullets) – key advantages</li>
<li><strong>Price + stock status</strong> – current price and availability</li>
<li><strong>Shipping/returns short + link</strong> – brief policy info and link</li>
</ol>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good answer capsule</h3>
<p>"Running shoe for daily training. Not for wide feet. Benefits: stability, cushioning. Price $X, in stock. Shipping 3–5 days, free returns 30 days: /policies/shipping."</p>
<h3>❌ Poor answer capsule</h3>
<p>"Great shoe, buy it!" – no price/policy, no clear value proposition.</p>
<hr />
<h2>Practice: write your answer capsules (10-15 min)</h2>
<p>Now you'll write 2 answer capsules and place them on your product pages. Here are the steps:</p>
<ol>
<li>Write 2 capsules for your top PDPs using the 5-line template.</li>
<li>Place them above the fold (rich text/metafield).</li>
</ol>
<h2>Independent practice: create a template (5-10 min)</h2>
<p>Now write 1 more capsule for another category and save as a template.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Who/not for included</li>
<li>✅ Price/stock/policy present</li>
<li>✅ Link stable</li>
<li>✅ Block above the fold</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>OpenAI shopping help: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
<li>Content optimization: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 14: Answer capsule',
  emailBody: `<h1>GEO Shopify – Day 14</h1>
<h2>Answer capsule: 5-line top summary</h2>
<p>Today you'll write the short block AI can safely quote.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson14() {
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

    const lessonId = `${COURSE_ID}_DAY_14`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_14.day,
          language: 'en', title: UPDATED_LESSON_14.title, content: UPDATED_LESSON_14.content,
          emailSubject: UPDATED_LESSON_14.emailSubject, emailBody: UPDATED_LESSON_14.emailBody, isActive: true,
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

updateLesson14();
