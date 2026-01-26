/**
 * Update Lesson 24 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_24 = {
  day: 24,
  title: 'Use-case landing: ajándék, szezon, sport, budget',
  content: `<h1>Use-case landing: ajándék, szezon, sport, budget</h1>
<p><em>Ma use-case alapú oldalt építesz, hogy az AI célzottan idézzen.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Készítesz 1 use-case landing vázat (pl. ajándék vagy szezon).</li>
<li>Linkelsz 3-5 terméket indoklással, hogy a guide konkrét termékekre mutasson.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI gyakran kap kontextusos kérdést ("ajándék anyának", "téli futás"). Use-case oldalak növelik az idézhetőséget. Fontos, hogy minden use-case-hez legyen megfelelő tartalom.</p>
<hr />
<h2>Use-case landing struktúra: mi kell bele?</h2>
<p>Egy jó use-case landing oldal ezeket a szekciókat tartalmazza:</p>
<ol>
<li><strong>Hero blokk</strong>: kinek/mikor – rövid, egyértelmű bemutatás</li>
<li><strong>Választási szempontok</strong> (3-5 bullet) – mire figyelj a választásnál</li>
<li><strong>Terméklista</strong> rövid indoklással – legjobb termékek ajánlása</li>
<li><strong>Policy/fit</strong> röviden + link – szállítás, visszaküldés, méret</li>
</ol>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó use-case landing</h3>
<p>"Téli futás: szigetelés, tapadás, láthatóság; top 3 modell linkkel."</p>
<h3>❌ Rossz use-case landing</h3>
<p>Termékgrid kontextus nélkül, nincs útmutatás, nincs ajánlás.</p>
<hr />
<h2>Gyakorlat: készítsd el a use-case landing oldalt (10-15 perc)</h2>
<p>Most készítesz 1 use-case landing vázat és linkelsz 3-5 terméket. Íme a lépések:</p>
<ol>
<li>Válassz egy use-case-et (pl. ajándék, szezon, sport, budget).</li>
<li>Írd meg a blokkokat:
   <ul>
   <li>Hero blokk (kinek/mikor)</li>
   <li>Választási szempontok</li>
   <li>Terméklista rövid indoklással</li>
   <li>Policy/fit röviden</li>
   </ul>
</li>
<li>Adj 3-5 terméket rövid indoklással és linkkel.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további use-case-ekre (5-10 perc)</h2>
<p>Most bővítsd a use-case landing oldalakat további 2-3 use-case-re is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 1 use-case landing váz kész</li>
<li>✅ 3-5 termék linkelve indoklással</li>
<li>✅ Minden szekció a helyén van</li>
<li>✅ Use-case landing AI-barát struktúrával</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Search generatív példák: <a href="https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/using-gen-ai-content</a></li>
<li>Content marketing: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 24. nap: Use-case landing',
  emailBody: `<h1>GEO Shopify – 24. nap</h1>
<h2>Use-case landing: ajándék, szezon, sport, budget</h2>
<p>Ma use-case alapú oldalt építesz, hogy az AI célzottan idézzen.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
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
          name: 'GEO Shopify – 30 napos kurzus',
          description: '30 napos, gyakorlati GEO-kurzus Shopify kereskedőknek: napi 20-30 percben építed fel a termék- és tartalom alapokat, hogy generatív rendszerek biztonságosan megtalálják, értelmezzék és idézzék a boltodat.',
          language: 'hu', durationDays: 30, isActive: true, requiresPremium: false,
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
          language: 'hu', title: UPDATED_LESSON_24.title, content: UPDATED_LESSON_24.content,
          emailSubject: UPDATED_LESSON_24.emailSubject, emailBody: UPDATED_LESSON_24.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 24 updated successfully`);
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
