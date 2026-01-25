/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_18 = {
  day: 18,
  title: 'Prices, offers, reviews safely',
  content: `<h1>Prices, offers, reviews safely</h1>
<p><em>Today you'll show prices/discounts/reviews without misleading AI or users.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll standardize price/discount display so it's consistent everywhere.</li>
<li>You'll clean the review block and remove weak/fake items.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI is sensitive to fake or outdated price. Misleading reviews are risky (policy/trust). Without accurate pricing and authentic reviews, AI may not safely quote your store.</p>
<hr />
<h2>Price and discount display: what to include</h2>
<h3>Price display</h3>
<p>Use compare-at-price field, not hand-written text:</p>
<ul>
<li>Regular price – in compare-at-price field</li>
<li>Sale price – in price field</li>
<li>Discount percentage – automatically calculated</li>
</ul>
<h3>Discount information</h3>
<p>If there's a discount, show:</p>
<ul>
<li>Reason (e.g., "end of season", "Black Friday")</li>
<li>Duration (e.g., "until January 31, 2026")</li>
<li>Validity (date disclaimers)</li>
</ul>
<h3>Reviews</h3>
<p>Review block cleaning:</p>
<ul>
<li>Show only real reviews – not fake ones</li>
<li>Do not manipulate counts</li>
<li>Do not hide negative reviews</li>
<li>Note source if possible</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good price/offer/review display</h3>
<p>$X (orig $Y), reason "end of season", reviews 4.6/5 from 128 real ratings.</p>
<h3>❌ Poor price/offer/review display</h3>
<p>"Free now!" fake price, fake 5/5, manipulated reviews.</p>
<hr />
<h2>Practice: standardize your prices and reviews (10-15 min)</h2>
<p>Now you'll standardize price/discount display and clean review blocks. Here are the steps:</p>
<ol>
<li>Pick 5 products: check price/compare-at and discount message.</li>
<li>Review the review block: remove dubious content, note source.</li>
</ol>
<h2>Independent practice: create a policy line (5-10 min)</h2>
<p>Now write a short policy line for PDPs: "Review source, update date".</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Price and offer fields consistent</li>
<li>✅ Discount reason/deadline given if applicable</li>
<li>✅ Review block real, source noted</li>
<li>✅ Policy link live</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Google Merchant Center price/discount rules: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
<li>Google review guidelines: <a href="https://developers.google.com/search/docs/appearance/structured-data/review-snippet" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/appearance/structured-data/review-snippet</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 18: Prices and reviews',
  emailBody: `<h1>GEO Shopify – Day 18</h1>
<h2>Prices, offers, reviews safely</h2>
<p>Today you'll show prices/discounts/reviews without misleading AI or users.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson18() {
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

    const lessonId = `${COURSE_ID}_DAY_18`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_18.day,
          language: 'en', title: UPDATED_LESSON_18.title, content: UPDATED_LESSON_18.content,
          emailSubject: UPDATED_LESSON_18.emailSubject, emailBody: UPDATED_LESSON_18.emailBody, isActive: true,
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

updateLesson18();
