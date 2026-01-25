/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_4 = {
  day: 2,
  title: 'Sell in chat: influence vs transaction',
  content: `<h1>Sell in chat: influence vs transaction</h1>
<p><em>Today you'll see why GEO is about influencing in AI answers, not collecting payment there.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these three things:</p>
<ul>
<li>You'll distinguish influence vs checkout, so you understand where GEO matters.</li>
<li>You'll write 5 critical statements/policies the AI must quote correctly.</li>
<li>You'll draft a short "sell in chat" snippet that you can use right away.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>ChatGPT/Copilot answers sway choice, but checkout happens on your site. Wrong price/stock/shipping in the answer hurts conversion and support. Understanding the difference helps you focus on what actually influences customers in AI answers.</p>
<hr />
<h2>Influence vs transaction: what's the difference?</h2>
<h3>Influence</h3>
<p>GEO is about influencing in AI answers:</p>
<ul>
<li>Recommendation, summary, comparison in the AI surface</li>
<li>Needs clear value, who for/who not, evidence</li>
<li>Happens in the AI answer, before the user visits your site</li>
</ul>
<h3>Transaction</h3>
<p>Checkout happens on your storefront:</p>
<ul>
<li>Requires accurate price/stock/policy</li>
<li>Merchant programs depend on region/eligibility</li>
<li>Happens on your site, after the user clicks through</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good "sell in chat" snippet</h3>
<p>"Ideal for [who], not for [who not]; price [x], in stock; shipping 3–5 days; free returns 30 days."</p>
<h3>❌ Poor "sell in chat" snippet</h3>
<p>"Best product!" with no price/stock/policy, no clear value proposition.</p>
<hr />
<h2>Practice: write your critical statements (10-15 min)</h2>
<p>Now you'll write 5 critical statements/policies and draft a chat snippet. Here are the steps:</p>
<ol>
<li>Write 5 statements/policies the AI must know:
   <ul>
   <li>Price – accurate pricing information</li>
   <li>Stock – availability status</li>
   <li>Shipping – delivery time and cost</li>
   <li>Returns – return policy and timeframe</li>
   <li>Warranty – warranty information</li>
   </ul>
</li>
<li>Write a 3–4 line chat snippet for one product:
   <ul>
   <li>Who it's for</li>
   <li>What it's for</li>
   <li>Who it's not for</li>
   <li>Price/stock</li>
   <li>Policy</li>
   </ul>
</li>
</ol>
<h2>Independent practice: place your snippet (5-10 min)</h2>
<p>Now place this snippet in your PDP answer capsule or note where it will live.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ 5 statements written</li>
<li>✅ Chat snippet drafted</li>
<li>✅ Placement decided/noted</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>OpenAI merchants: <a href="https://chatgpt.com/merchants" target="_blank" rel="noreferrer">https://chatgpt.com/merchants</a></li>
<li>Copilot Merchant Program: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 4: Sell in chat',
  emailBody: `<h1>GEO Shopify – Day 4</h1>
<h2>Sell in chat: influence vs transaction</h2>
<p>Today you'll see why GEO is about influencing in AI answers, not collecting payment there.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson4() {
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

    const lessonId = `${COURSE_ID}_DAY_4`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_4.day,
          language: 'en', title: UPDATED_LESSON_4.title, content: UPDATED_LESSON_4.content,
          emailSubject: UPDATED_LESSON_4.emailSubject, emailBody: UPDATED_LESSON_4.emailBody, isActive: true,
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

updateLesson4();
