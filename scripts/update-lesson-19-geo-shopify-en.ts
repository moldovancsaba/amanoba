/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_19 = {
  day: 19,
  title: 'Image and video GEO: alt, filename, variant visuals',
  content: `<h1>Image and video GEO: alt, filename, variant visuals</h1>
<p><em>Today you'll optimize visuals so models understand them.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll fix alt/filename/variant pairing on 10 images.</li>
<li>You'll standardize 1 short video title + description.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI can use image labels in summaries. Missing variant visuals → wrong color/size recommendations. Without optimized visuals, AI can't accurately understand and quote your products.</p>
<hr />
<h2>Image optimization: what to include</h2>
<h3>Alt text</h3>
<p>Write clear alt text for every image that includes:</p>
<ul>
<li>Product name</li>
<li>Variant (size, color, etc.)</li>
<li>Key attributes</li>
</ul>
<p>Example: "blue men's running shoe size 42 with stable sole"</p>
<h3>Filename</h3>
<p>Optimize filenames:</p>
<ul>
<li>Short, hyphenated</li>
<li>Variant noted</li>
<li>Descriptive, not generic (not "IMG_1234.jpg")</li>
</ul>
<p>Example: <code>runner-blue-42.jpg</code></p>
<h3>Variant visuals</h3>
<p>Pair images at variant level:</p>
<ul>
<li>Each variant has its own image</li>
<li>Image clearly shows the variant</li>
<li>No mixing</li>
</ul>
<h3>Video title and description</h3>
<p>For videos:</p>
<ul>
<li>Descriptive title</li>
<li>Short description of video content</li>
<li>Consistent format</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good image/video optimization</h3>
<p>Filename: <code>runner-blue-42.jpg</code>, alt: "blue men's running shoe size 42 with stable sole", variant image paired.</p>
<h3>❌ Poor image/video optimization</h3>
<p>Filename: <code>IMG_1234.JPG</code>, alt: "image", no variant image, no description.</p>
<hr />
<h2>Practice: fix your images and videos (10-15 min)</h2>
<p>Now you'll fix 10 images and 1 video. Here are the steps:</p>
<ol>
<li>Fix 10 images: filename + alt + variant pairing.</li>
<li>Add title/description to 1 product video.</li>
</ol>
<h2>Independent practice: create a template (5-10 min)</h2>
<p>Now create an alt template (product + variant + key USP) and apply to new images.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ 10 images fixed</li>
<li>✅ Video title + description set</li>
<li>✅ Template saved</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Shopify alt text: <a href="https://help.shopify.com/en/manual/online-store/images/add-alt-text" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/images/add-alt-text</a></li>
<li>Google image SEO: <a href="https://developers.google.com/search/docs/appearance/google-images" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/appearance/google-images</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 19: Image/video GEO',
  emailBody: `<h1>GEO Shopify – Day 19</h1>
<h2>Image and video GEO: alt, filename, variant visuals</h2>
<p>Today you'll optimize visuals so models understand them.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson19() {
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

    const lessonId = `${COURSE_ID}_DAY_19`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_19.day,
          language: 'en', title: UPDATED_LESSON_19.title, content: UPDATED_LESSON_19.content,
          emailSubject: UPDATED_LESSON_19.emailSubject, emailBody: UPDATED_LESSON_19.emailBody, isActive: true,
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

updateLesson19();
