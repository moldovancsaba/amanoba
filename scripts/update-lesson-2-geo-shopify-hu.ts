/**
 * Update Lesson 2 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_2 = {
  day: 2,
  title: 'GEO vs SEO Shopify-n: mire figyelj?',
  content: `<h1>GEO vs SEO Shopify-n: mire figyelj?</h1>
<p><em>Ma megtanulod, mely elemek számítanak a generatív felületekben, és hogyan egészítik ki ezek az SEO-t.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Pontosan megérted, mi az SEO-first és mi a GEO-first elemek közötti különbség.</li>
<li>Készítesz egy 10 pontos ellenőrzőlistát Shopify-hoz GEO szempontból, amit azonnal használhatsz.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI válaszok gyakran összefoglalják a fő termékadatokat. Ha ezek hiányosak, kimaradsz a válaszokból. A GEO nem csak rangsorolásról szól: a cél a világos, idézhető tartalom, amit az AI biztonságosan használhat.</p>
<hr />
<h2>SEO-first vs GEO-first: mi a különbség?</h2>
<h3>SEO-first elemek (a hagyományos kereséshez)</h3>
<p>Ezek az elemek a keresőmotor rangsorolásához segítenek:</p>
<ul>
<li>Meta title és description</li>
<li>Belső linkek</li>
<li>Canonical URL-ek</li>
<li>Page speed optimalizálás</li>
<li>Backlinkek</li>
<li>Strukturált tartalom hosszabb formában</li>
</ul>
<h3>GEO-first elemek (az AI-válaszokhoz)</h3>
<p>Ezek az elemek segítenek, hogy az AI válaszokban szerepelj:</p>
<ul>
<li>Pontos termékadatok (ár, készlet, azonosítók) egyértelműen olvasható formában</li>
<li>Visszaigazolható policy-k (szállítás, visszaküldés)</li>
<li>Stabil URL-ek, amelyek nem változnak</li>
<li>Tiszta, rövid válaszképes blokkok (answer capsule) a termékoldal tetején</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó GEO-alap</h3>
<ul>
<li>Termékoldal tetején tömör összegzés</li>
<li>Jól strukturált ár és készlet információ</li>
<li>GTIN és SKU minden terméknél feltüntetve</li>
<li>Világos policy linkek</li>
</ul>
<h3>❌ Rossz GEO-alap</h3>
<ul>
<li>Hosszú, rendezetlen leírás</li>
<li>Hiányzó azonosítók (GTIN, SKU)</li>
<li>Összemosott variánsadatok</li>
<li>Nehezen megtalálható policy információk</li>
</ul>
<hr />
<h2>Gyakorlat: készítsd el a GEO checklistedet (10-15 perc)</h2>
<p>Most készíts egy 10 pontos GEO checklistet Shopify-hoz. Íme a lépések:</p>
<ol>
<li>Készíts egy checklistet ezekkel a pontokkal: ár, készlet, GTIN/SKU, policy, answer capsule, stabil URL, alt text, structured data, belső link, reviews szabály.</li>
<li>Válassz ki egy minta termékoldalt (PDP) a boltodban.</li>
<li>Jelöld meg a checklisten, mi van rendben és mi hiányzik ezen az oldalon.</li>
</ol>
<h2>Önálló gyakorlat: alkalmazd a checklistet (5-10 perc)</h2>
<p>Most alkalmazd a checklistet egy másik termékoldalra is. Írd fel 3 hiányosságot, amit javítanod kell.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Megvan a 10 pontos GEO checklisted</li>
<li>✅ Egy PDP-n kipipáltad, mi van rendben és mi hiányzik</li>
<li>✅ Felírtál 3 javítandó elemet egy másik PDP-n</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Google Search Central – GenAI content: <a href="https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/using-gen-ai-content</a></li>
<li>Shopify termékadat API (2026 januárjában aktuális): <a href="https://shopify.dev/docs/api/liquid/objects/product" target="_blank" rel="noreferrer">https://shopify.dev/docs/api/liquid/objects/product</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 2. nap: GEO vs SEO Shopify-n',
  emailBody: `<h1>GEO Shopify – 2. nap</h1>
<h2>GEO vs SEO Shopify-n</h2>
<p>Ma összeállítod a 10 pontos GEO checklistet, és két termékoldalon alkalmazod.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson2() {
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

    const lessonId = `${COURSE_ID}_DAY_02`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_2.day,
          language: 'hu', title: UPDATED_LESSON_2.title, content: UPDATED_LESSON_2.content,
          emailSubject: UPDATED_LESSON_2.emailSubject, emailBody: UPDATED_LESSON_2.emailBody, isActive: true,
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

updateLesson2();
