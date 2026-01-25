/**
 * Update Lesson 23 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_23 = {
  day: 23,
  title: 'Összehasonlító oldalak: őszinte tradeoff',
  content: `<h1>Összehasonlító oldalak: őszinte tradeoff</h1>
<p><em>Ma őszinte összehasonlítást készítesz, hogy az AI ne torzítson.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Készítesz 1 összehasonlító táblát 2-3 termékről.</li>
<li>Feltünteted a kinek jó/nem jó pontokat, hogy őszinte legyen az összehasonlítás.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI gyakran kér "X vs Y" típusú kérdésekre választ. Fontos, hogy valós adatokat adj. Az őszinteség csökkenti a visszaküldést és növeli a bizalmat.</p>
<hr />
<h2>Összehasonlító táblázat: mi kell bele?</h2>
<p>Egy jó összehasonlító táblázat tartalmazza:</p>
<ul>
<li><strong>Fő jellemzők</strong> – minden termék fő jellemzői</li>
<li><strong>Ár</strong> – pontos ár minden terméknél</li>
<li><strong>Policy</strong> – szállítás, visszaküldés</li>
<li><strong>Kinek való</strong> – célközönség</li>
<li><strong>Kinek nem való</strong> – kiknek nem ajánlott</li>
<li><strong>Link a PDP-re</strong> – minden termékhez link</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó összehasonlító oldal</h3>
<p>Táblázat fő jellemzőkkel, árral, policy-vel, kinek való/nem való, PDP linkekkel.</p>
<h3>❌ Rossz összehasonlító oldal</h3>
<p>Falnyi szöveg, nincs táblázat, nincs link, nincs őszinteség.</p>
<hr />
<h2>Gyakorlat: készítsd el az összehasonlító oldalt (10-15 perc)</h2>
<p>Most készítesz 1 összehasonlító táblát 2-3 termékről. Íme a lépések:</p>
<ol>
<li>Válassz ki 2-3 hasonló terméket a boltodban.</li>
<li>Készíts egy összehasonlító táblázatot ezekkel az oszlopokkal:
   <ul>
   <li>Termék neve</li>
   <li>Fő jellemzők</li>
   <li>Ár</li>
   <li>Policy</li>
   <li>Kinek való</li>
   <li>Kinek nem való</li>
   <li>PDP link</li>
   </ul>
</li>
<li>Feltünteted a kinek jó/nem jó pontokat őszintén.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további termékekre (5-10 perc)</h2>
<p>Most bővítsd az összehasonlító oldalakat további termékpárokra is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 1 összehasonlító táblázat kész 2-3 termékről</li>
<li>✅ Kinek jó/nem jó pontok feltüntetve</li>
<li>✅ PDP linkek minden termékhez</li>
<li>✅ Őszinte összehasonlítás</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Comparison page best practices: <a href="https://www.shopify.com/blog/product-comparison-pages" target="_blank" rel="noreferrer">https://www.shopify.com/blog/product-comparison-pages</a></li>
<li>Content marketing: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 23. nap: Összehasonlító oldalak',
  emailBody: `<h1>GEO Shopify – 23. nap</h1>
<h2>Összehasonlító oldalak: őszinte tradeoff</h2>
<p>Ma őszinte összehasonlítást készítesz, hogy az AI ne torzítson.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
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

    const lessonId = `${COURSE_ID}_DAY_23`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_23.day,
          language: 'hu', title: UPDATED_LESSON_23.title, content: UPDATED_LESSON_23.content,
          emailSubject: UPDATED_LESSON_23.emailSubject, emailBody: UPDATED_LESSON_23.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 23 updated successfully`);
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
