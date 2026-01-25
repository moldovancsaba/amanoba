/**
 * Update Lesson 19 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_19 = {
  day: 19,
  title: 'Képek és videó GEO: alt, fájlnév, variáns vizuál',
  content: `<h1>Képek és videó GEO: alt, fájlnév, variáns vizuál</h1>
<p><em>Ma optimalizálod a vizuális anyagokat, hogy érthetők legyenek a modelleknek.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>10 kép alt/fájlnév/variáns hozzárendelés javítása.</li>
<li>1 rövid videó cím + leírás egységesítése.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI a képcímkéket is felhasználhatja összegzéshez. Variáns vizuál hiánya félreértett szín/méret ajánláshoz vezethet, ami káros lehet a boltod számára.</p>
<hr />
<h2>Kép optimalizálás: mi kell bele?</h2>
<h3>Alt szöveg</h3>
<p>Minden képhez írj egyértelmű alt szöveget, ami tartalmazza:</p>
<ul>
<li>Termék neve</li>
<li>Variáns (méret, szín, stb.)</li>
<li>Fő jellemzők</li>
</ul>
<p>Példa: "Futócipő Pro, kék, 42 méret, férfi, párnázott talp"</p>
<h3>Fájlnév</h3>
<p>Fájlnév optimalizálás:</p>
<ul>
<li>Rövid, kötőjelekkel elválasztva</li>
<li>Variáns jelöléssel</li>
<li>Leíró, nem generikus (ne "IMG_1234.jpg")</li>
</ul>
<p>Példa: "futo-cipo-pro-kek-42-ferfi.jpg"</p>
<h3>Variáns vizuál</h3>
<p>Variáns szinten képek:</p>
<ul>
<li>Minden variánshoz saját kép</li>
<li>Kép egyértelműen mutatja a variánst</li>
<li>Nincs keveredés</li>
</ul>
<h3>Videó cím és leírás</h3>
<p>Videók esetén:</p>
<ul>
<li>Leíró cím</li>
<li>Rövid leírás a videó tartalmáról</li>
<li>Egységes formátum</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó kép/videó optimalizálás</h3>
<p>Alt szöveg: "Futócipő Pro, kék, 42 méret", fájlnév: "futo-cipo-pro-kek-42.jpg", variáns kép hozzárendelve.</p>
<h3>❌ Rossz kép/videó optimalizálás</h3>
<p>Alt: "kép", fájlnév: "IMG_1234.jpg", nincs variáns kép, videó cím: "videó".</p>
<hr />
<h2>Gyakorlat: javítsd a képeket és videókat (10-15 perc)</h2>
<p>Most javítod 10 kép alt/fájlnév/variáns hozzárendelését és 1 videó címét/leírását. Íme a lépések:</p>
<ol>
<li>Válassz ki 10 képet különböző termékekből.</li>
<li>Minden képhez:
   <ul>
   <li>Írj egyértelmű alt szöveget</li>
   <li>Nevezd át a fájlt leíró névre</li>
   <li>Hozzárendeld a variánshoz, ha van</li>
   </ul>
</li>
<li>Válassz ki 1 videót.</li>
<li>Írj leíró címet és rövid leírást.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további termékekre (5-10 perc)</h2>
<p>Most bővítsd a kép/videó optimalizálást további 5-10 termékre is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 10 kép alt/fájlnév/variáns hozzárendelés javítva</li>
<li>✅ 1 videó cím + leírás egységesítve</li>
<li>✅ Minden kép egyértelmű alt szöveggel</li>
<li>✅ Fájlnevek leíróak</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Shopify image optimization: <a href="https://help.shopify.com/en/manual/products/product-images" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/product-images</a></li>
<li>Google image SEO: <a href="https://developers.google.com/search/docs/appearance/google-images" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/appearance/google-images</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 19. nap: Kép/videó GEO',
  emailBody: `<h1>GEO Shopify – 19. nap</h1>
<h2>Képek és videó GEO: alt, fájlnév, variáns vizuál</h2>
<p>Ma optimalizálod a vizuális anyagokat, hogy érthetők legyenek a modelleknek.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
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

    const lessonId = `${COURSE_ID}_DAY_19`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_19.day,
          language: 'hu', title: UPDATED_LESSON_19.title, content: UPDATED_LESSON_19.content,
          emailSubject: UPDATED_LESSON_19.emailSubject, emailBody: UPDATED_LESSON_19.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 19 updated successfully`);
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
