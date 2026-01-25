/**
 * Update Lesson 12 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_12 = {
  day: 12,
  title: 'Merchant readiness checklist: top 10 javítás',
  content: `<h1>Merchant readiness checklist: top 10 javítás</h1>
<p><em>Ma összefoglalod a legfontosabb javítandókat, és ütemezed a top 10-et.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Kész merchant readiness checklist, amit azonnal használhatsz.</li>
<li>Top 10 javítás ütemezve felelőssel és időponttal.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Prioritást adsz a legnagyobb hatású hibák javításának. Átlátható lesz, mi kész GEO szempontból, és mi még hiányzik.</p>
<hr />
<h2>Checklist elemek: mi kell bele?</h2>
<p>Egy jó merchant readiness checklist tartalmazza:</p>
<ul>
<li>Ár/készlet/policy egyezés a feed és a PDP között</li>
<li>SKU/GTIN/brand kitöltve minden terméknél</li>
<li>Shipping/returns blokk egységes minden oldalon</li>
<li>Answer capsule a termékoldal (PDP) elején</li>
<li>Trust blokk (identity/support/proof) a kulcsoldalakon</li>
<li>Stabil URL-ek, amelyek nem változnak</li>
<li>Strukturált adatok (schema markup)</li>
<li>Policy linkek stabil és egységes</li>
<li>Termékadatok pontos és friss</li>
<li>Feed és PDP konzisztens</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó readiness checklist</h3>
<p>Checklist kész, top 10 javítás felelőssel és határidővel, rendszeres státusz követés.</p>
<h3>❌ Rossz readiness checklist</h3>
<p>Hosszú lista, nincs prioritás, nincs felelős, nincs határidő.</p>
<hr />
<h2>Gyakorlat: készítsd el a checklistet (10-15 perc)</h2>
<p>Most készíts egy readiness checklistet és ütemezd a top 10 javítást. Íme a lépések:</p>
<ol>
<li>Készíts egy readiness checklistet (20–30 elem), ami tartalmazza az összes GEO követelményt.</li>
<li>Válaszd ki a top 10 legfontosabb javítandó elemet.</li>
<li>Minden javításhoz rendelj felelőst és határidőt.</li>
</ol>
<h2>Önálló gyakorlat: oszd meg a listát (5-10 perc)</h2>
<p>Most oszd meg a listát a csapattal, és állíts be heti státusz követést.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Kész a readiness checklist (20–30 elem)</li>
<li>✅ Top 10 javítás kiválasztva</li>
<li>✅ Felelősök és határidők hozzárendelve</li>
<li>✅ Státusz követés beállítva</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Google Merchant Center – Quality guidelines: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
<li>Shopify store optimization: <a href="https://help.shopify.com/en/manual/online-store/themes/theme-structure" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/themes/theme-structure</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 12. nap: Readiness checklist',
  emailBody: `<h1>GEO Shopify – 12. nap</h1>
<h2>Merchant readiness checklist: top 10 javítás</h2>
<p>Ma összefoglalod a legfontosabb javítandókat, és ütemezed a top 10-et.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson12() {
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

    const lessonId = `${COURSE_ID}_DAY_12`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_12.day,
          language: 'hu', title: UPDATED_LESSON_12.title, content: UPDATED_LESSON_12.content,
          emailSubject: UPDATED_LESSON_12.emailSubject, emailBody: UPDATED_LESSON_12.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 12 updated successfully`);
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

updateLesson12();
