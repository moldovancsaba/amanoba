/**
 * Update Lesson 26 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_26 = {
  day: 26,
  title: 'Anti-spam és minőség: AI-asszisztált tartalom',
  content: `<h1>Anti-spam és minőség: AI-asszisztált tartalom</h1>
<p><em>Ma megtanulod, hogyan írj AI-val minőségi tartalmat spam nélkül.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Összeállítasz egy minőség/anti-spam checklistet, amit azonnal használhatsz.</li>
<li>Alkalmazod 1 guide-on, és javítod a hibákat.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Spam jellegű AI tartalom káros és kizárást hozhat. Minőség = idézhetőség + bizalom. Fontos, hogy minden tartalom minőségi legyen és ne tartalmazzon spam elemeket.</p>
<hr />
<h2>Anti-spam és minőség: mi kell bele?</h2>
<h3>Kerülendő elemek</h3>
<p>Ezek a gyakorlatok spam jellegűek és károsak:</p>
<ul>
<li>Kulcsszóhalmozás – túl sok kulcsszó</li>
<li>Hamis állítás – bizonyíték nélküli állítások</li>
<li>Forrás nélküli adat – nem ellenőrizhető információk</li>
</ul>
<h3>Használandó elemek</h3>
<p>Ezek a gyakorlatok minőségi tartalmat hoznak:</p>
<ul>
<li>Forrás megjelölés – minden állításhoz forrás</li>
<li>Rövid blokkok – tömör, érthető szöveg</li>
<li>Valós adatok – ellenőrizhető információk</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó AI-asszisztált tartalom</h3>
<p>Rövid, forrásolt állítások, valós adatok, ellenőrizhető információk.</p>
<h3>❌ Rossz AI-asszisztált tartalom</h3>
<p>"Legjobb a világon" bizonyíték nélkül, kulcsszóhalmozás, hamis állítások.</p>
<hr />
<h2>Gyakorlat: készítsd el a checklistet (10-15 perc)</h2>
<p>Most összeállítasz egy minőség/anti-spam checklistet és alkalmazod egy guide-on. Íme a lépések:</p>
<ol>
<li>Készíts egy minőség/anti-spam checklistet 10 ponttal:
   <ul>
   <li>Kerülendő elemek (kulcsszóhalmozás, hamis állítás, forrás nélküli adat)</li>
   <li>Használandó elemek (forrás megjelölés, rövid blokkok, valós adatok)</li>
   </ul>
</li>
<li>Alkalmazd egy meglévő guide-on és jelöld a javítandókat.</li>
</ol>
<h2>Önálló gyakorlat: javítsd a tartalmat (5-10 perc)</h2>
<p>Most frissíts 1 szakaszt a checklist alapján.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Checklist kész (10 pont)</li>
<li>✅ Guide felülvizsgálva</li>
<li>✅ Legalább 1 szakasz javítva</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Google helpful content guidelines: <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/creating-helpful-content</a></li>
<li>Google spam policies: <a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/essentials/spam-policies</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 26. nap: Anti-spam és minőség',
  emailBody: `<h1>GEO Shopify – 26. nap</h1>
<h2>Anti-spam és minőség: AI-asszisztált tartalom</h2>
<p>Ma megtanulod, hogyan írj AI-val minőségi tartalmat spam nélkül.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson26() {
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
          name: 'GEO Shopify – 30 napos kurzus',
          description: '30 napos, gyakorlati GEO-kurzus Shopify kereskedőknek: napi 20-30 percben építed fel a termék- és tartalom alapokat, hogy generatív rendszerek biztonságosan megtalálják, értelmezzék és idézzék a boltodat.',
          language: 'hu', durationDays: 30, isActive: true, requiresPremium: false,
          brandId: brand._id,
          pointsConfig: { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 },
          xpConfig: { completionXP: 500, lessonXP: 26 },
          metadata: { category: 'education', difficulty: 'intermediate', estimatedHours: 10, tags: ['geo', 'shopify', 'ecommerce'], instructor: 'Amanoba' }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Course ${COURSE_ID} found/created: ${course.name}`);

    const lessonId = `${COURSE_ID}_DAY_26`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_26.day,
          language: 'hu', title: UPDATED_LESSON_26.title, content: UPDATED_LESSON_26.content,
          emailSubject: UPDATED_LESSON_26.emailSubject, emailBody: UPDATED_LESSON_26.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 26 updated successfully`);
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

updateLesson26();
