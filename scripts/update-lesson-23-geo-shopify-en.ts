/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_23 = {
  day: 23,
  title: 'Comparison pages: honest tradeoffs',
  content: `<h1>Comparison pages: honest tradeoffs</h1>
<p><em>Today you'll create comparisons that AI can quote without distortion.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll build one comparison table for 2–3 products.</li>
<li>You'll include who it's for / not for so the comparison is honest.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI often gets "X vs Y" questions: provide real data. Honesty lowers returns. Without honest comparisons, AI may misquote your products and customers may be disappointed.</p>
<hr />
<h2>Comparison table: what to include</h2>
<p>A good comparison table includes:</p>
<ul>
<li><strong>Key features</strong> – main features of each product</li>
<li><strong>Price</strong> – accurate price for each</li>
<li><strong>Policy</strong> – shipping, returns</li>
<li><strong>Who for</strong> – target audience</li>
<li><strong>Who not for</strong> – who shouldn't buy this</li>
<li><strong>PDP link</strong> – link to each product page</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good comparison</h3>
<p>"X stable, Y lighter; X pricier; Y less warranty." – honest tradeoffs with real data.</p>
<h3>❌ Poor comparison</h3>
<p>"Both are awesome!" with no data, no tradeoffs, no honesty.</p>
<hr />
<h2>Practice: create your comparison table (10-15 min)</h2>
<p>Now you'll create a comparison table for 2–3 products. Here are the steps:</p>
<ol>
<li>Create a table for 2–3 products with these columns:
   <ul>
   <li>Product name</li>
   <li>Key features</li>
   <li>Price</li>
   <li>Policy</li>
   <li>Who for</li>
   <li>Who not for</li>
   <li>PDP link</li>
   </ul>
</li>
<li>Include honest tradeoffs for each product.</li>
</ol>
<h2>Independent practice: create another comparison (5-10 min)</h2>
<p>Now create another comparison for a different product pair.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Table created with links</li>
<li>✅ Who for/not for included</li>
<li>✅ Policy/price real</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Copilot merchant blog: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
<li>Comparison page best practices: <a href="https://www.shopify.com/blog/product-comparison-pages" target="_blank" rel="noreferrer">https://www.shopify.com/blog/product-comparison-pages</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 23: Comparison pages',
  emailBody: `<h1>GEO Shopify – Day 23</h1>
<h2>Comparison pages: honest tradeoffs</h2>
<p>Today you'll create comparisons that AI can quote without distortion.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson23() {
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

    const lessonId = `${COURSE_ID}_DAY_23`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_23.day,
          language: 'en', title: UPDATED_LESSON_23.title, content: UPDATED_LESSON_23.content,
          emailSubject: UPDATED_LESSON_23.emailSubject, emailBody: UPDATED_LESSON_23.emailBody, isActive: true,
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

updateLesson23();
