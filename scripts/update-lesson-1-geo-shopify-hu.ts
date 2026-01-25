/**
 * Update Lesson 1 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_1 = {
  day: 1,
  title: 'Mi a GEO, és mi nem az (Shopify kontextusban)',
  content: `<h1>Mi a GEO, és mi nem az (Shopify)</h1>
<p><em>Ma megtanulod, hogy a GEO hogyan különbözik az SEO-tól, és mit jelent, amikor a boltod az AI-válaszokban megjelenik.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a három dolgot fogod elérni:</p>
<ul>
<li>Tisztán megérted a GEO és az SEO különbségét.</li>
<li>Pontosan tudod, mit várhatsz a GEO-tól: idézést, bevonást és következetességet.</li>
<li>Készítesz 5 saját GEO promptot a boltodra, amit azonnal használhatsz.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI-válaszokban a boltod csak akkor jelenik meg, ha az információ könnyen előhívható és biztonságosan idézhető. A GEO növeli az esélyt, hogy megjelenj, de nem garantálja a tranzakciót. A jó GEO-alap csökkenti a kockázatot, hogy félreértett ajánlásokban szerepelj (téves ár, készlet vagy szállítási információk).</p>
<hr />
<h2>GEO vs SEO: mi a különbség?</h2>
<h3>SEO: a hagyományos keresés</h3>
<p>Az SEO a keresőmotor rangsorolása a 10 kék linkben. Célod, hogy a keresési találatok között minél feljebb jelenj meg.</p>
<h3>GEO: az AI-válaszokban való szereplés</h3>
<p>A GEO azt jelenti, hogy a generatív motor válaszaiban szerepelsz és idézhető vagy. Nem a keresési listán vagy, hanem közvetlenül az AI válaszban.</p>
<h3>Mit várhatsz a GEO-tól?</h3>
<ul>
<li><strong>Inklúzió</strong>: bekerül-e a termék vagy a márkád az AI válaszba</li>
<li><strong>Idézés</strong>: hivatkozik-e a domainre, amikor a boltodat említi</li>
<li><strong>Konzisztencia</strong>: ismétlődik-e a megjelenés több futtatásban is</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó GEO-alap</h3>
<ul>
<li>Egyértelmű termékadatok: GTIN, ár, készlet minden terméknél</li>
<li>Világos szállítási és visszaküldési információk</li>
<li>Tiszta HTML struktúra</li>
<li>Stabil URL-ek, amelyek nem változnak</li>
</ul>
<h3>❌ Rossz GEO-alap</h3>
<ul>
<li>Hiányzó azonosítók (GTIN, SKU)</li>
<li>Félrevezető vagy hiányzó ár</li>
<li>Dinamikus vagy duplikált URL-ek</li>
<li>Átláthatatlan szállítási információk</li>
</ul>
<hr />
<h2>Gyakorlat: írd meg az első GEO promptjaidat (10-15 perc)</h2>
<p>Most készíts 5 GEO promptot a boltodra. Íme a lépések:</p>
<ol>
<li>Írj 5 GEO promptot a boltodra. Példa: „Legjobb [termékkategória] 2026-ban [ország]".</li>
<li>Minden promptnál jegyezd fel, mit vársz: inklúziót, idézést vagy konzisztenciát?</li>
<li>Mentsd el egy táblázatba ezekkel az oszlopokkal: Prompt, Várt kimenet, Jegyzet.</li>
</ol>
<h2>Önálló gyakorlat: teszteld a promptjaidat (5-10 perc)</h2>
<p>Most futtasd le a 5 promptot kézzel a ChatGPT, Copilot vagy Google AI felületén. Jegyezd fel:</p>
<ul>
<li>Megjelenik-e a boltod a válaszokban?</li>
<li>Hivatkozik-e rád a rendszer?</li>
<li>Milyen információt használ az AI a boltodról?</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Megvan 5 saját GEO promptod</li>
<li>✅ Érted a különbséget a GEO és az SEO között</li>
<li>✅ Felírtad, mit vársz a GEO-tól (inklúzió, idézés, konzisztencia)</li>
<li>✅ Elvégzed az első manuális futtatást és jegyzetelsz</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>arXiv: GEO (Generative Engine Optimization): <a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noreferrer">https://arxiv.org/abs/2311.09735</a></li>
<li>Search Engine Land – What is GEO: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 1. nap: Mi a GEO, és mi nem az',
  emailBody: `<h1>GEO Shopify – 1. nap</h1>
<h2>Mi a GEO, és mi nem az</h2>
<p>Ma megtanulod a GEO és az SEO különbségét, és készítesz 5 saját GEO promptot a boltodra.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson1() {
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

    const lessonId = `${COURSE_ID}_DAY_01`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_1.day,
          language: 'hu', title: UPDATED_LESSON_1.title, content: UPDATED_LESSON_1.content,
          emailSubject: UPDATED_LESSON_1.emailSubject, emailBody: UPDATED_LESSON_1.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 1 updated successfully`);
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

updateLesson1();
