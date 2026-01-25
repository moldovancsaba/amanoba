/**
 * Update Lesson 7 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_7 = {
  day: 7,
  title: 'Shopify termékadat audit: cím, leírás, variánsok',
  content: `<h1>Shopify termékadat audit: cím, leírás, variánsok</h1>
<p><em>Ma feltárod a termékadataid hiányosságait: title, description, variánsok, azonosítók.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Audit sablont készítesz 10–20 termékre, amit azonnal használhatsz.</li>
<li>Felméred: cím/alcím, leírás, variánsok, azonosítók állapotát.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI csak tiszta, egyértelmű adatot idéz szívesen. A rossz variánsjelölés félreértett ajánláshoz vezethet, ami káros lehet a boltod számára.</p>
<hr />
<h2>Mit ellenőrizz a termékadataidban?</h2>
<h3>Cím és alcím</h3>
<ul>
<li>Rövid, egyértelmű cím</li>
<li>Kulcs jellemzők az alcímben</li>
<li>Nincs felesleges szöveg</li>
</ul>
<h3>Leírás</h3>
<ul>
<li>Tömör, fontos jellemzők előre</li>
<li>Policy linkek a leírásban</li>
<li>Strukturált, könnyen olvasható</li>
</ul>
<h3>Variánsok</h3>
<ul>
<li>Méret/szín/széria tiszta jelölése</li>
<li>Nincs keveredés a variánsok között</li>
<li>Minden variáns egyértelműen azonosítható</li>
</ul>
<h3>Azonosítók</h3>
<ul>
<li>SKU minden variánsnál kitöltve</li>
<li>GTIN ahol elérhető</li>
<li>Brand mező kitöltve</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó termékadat</h3>
<p>„Futócipő Pro, férfi, kék, GTIN: …, SKU: …, alcím: stabilitás, párnázás, 3-5 nap szállítás."</p>
<h3>❌ Rossz termékadat</h3>
<p>„Pro cipő" – hiányzó variáns információ, nincs azonosító, homályos leírás.</p>
<hr />
<h2>Gyakorlat: készítsd el az audit sablonodat (10-15 perc)</h2>
<p>Most készíts egy audit táblát és töltsd ki 10 termékkel. Íme a lépések:</p>
<ol>
<li>Készíts egy audit táblát ezekkel az oszlopokkal: Termék | Cím | Leírás | Variáns jelölés | SKU | GTIN | Brand | Jegyzet.</li>
<li>Töltsd ki 10 termékkel.</li>
<li>Jelöld meg, mi van rendben és mi hiányzik minden terméknél.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd az auditot (5-10 perc)</h2>
<p>Most bővítsd az auditot 10–20 termékre, és rangsorold a prioritásokat (A/B/C).</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Megvan az audit sablon</li>
<li>✅ 10–20 termék auditálva</li>
<li>✅ Prioritások rangsorolva (A/B/C)</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Shopify termékadat API (2026 januárjában aktuális): <a href="https://shopify.dev/docs/api/liquid/objects/product" target="_blank" rel="noreferrer">https://shopify.dev/docs/api/liquid/objects/product</a></li>
<li>Google Merchant Center – Termékadat követelmények: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 7. nap: Termékadat audit',
  emailBody: `<h1>GEO Shopify – 7. nap</h1>
<h2>Shopify termékadat audit</h2>
<p>Ma feltárod a termékadataid hiányosságait, és készítesz egy audit sablont.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson7() {
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

    const lessonId = `${COURSE_ID}_DAY_07`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_7.day,
          language: 'hu', title: UPDATED_LESSON_7.title, content: UPDATED_LESSON_7.content,
          emailSubject: UPDATED_LESSON_7.emailSubject, emailBody: UPDATED_LESSON_7.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 7 updated successfully`);
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

updateLesson7();
