/**
 * Update Lesson 9 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_9 = {
  day: 9,
  title: 'Azonosítók rendben: SKU, GTIN, brand, variáns',
  content: `<h1>Azonosítók rendben: SKU, GTIN, brand, variáns</h1>
<p><em>Ma rendbe teszed a termékazonosítókat, hogy az AI és a feedek ne keverjék össze a termékeket.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Auditálod 10 termék SKU/GTIN/brand/variáns adatait.</li>
<li>Listázod a hiányzó vagy hibás azonosítókat, és javítod őket.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI és a feed azonosítóval különbözteti meg a termékeket. Ha hibás az ID, rossz ajánláshoz vezethet. A brand és variáns tisztaság csökkenti a félreértést (méret, szín).</p>
<hr />
<h2>Mit ellenőrizz az azonosítóknál?</h2>
<h3>SKU (Stock Keeping Unit)</h3>
<ul>
<li>Minden variánsnál egyedi SKU</li>
<li>Nincs duplikáció</li>
<li>Konzisztens formátum</li>
</ul>
<h3>GTIN (Global Trade Item Number)</h3>
<ul>
<li>Ha van GTIN, az helyes</li>
<li>Nem duplikált</li>
<li>Helyes formátum (EAN-13, UPC stb.)</li>
</ul>
<h3>Brand</h3>
<ul>
<li>Brand mező kitöltve minden terméknél</li>
<li>Konzisztens brand név (nincs változatosság)</li>
</ul>
<h3>Variáns azonosítás</h3>
<ul>
<li>Méret/szín/széria tiszta jelölése</li>
<li>Nincs keveredés a variánsok között</li>
<li>Minden variáns egyértelműen azonosítható</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó azonosítók</h3>
<p>SKU: PROD-001-BLUE-L, GTIN: 1234567890123, Brand: Acme, Variáns: Kék, L méret</p>
<h3>❌ Rossz azonosítók</h3>
<p>SKU hiányzik, GTIN duplikált, Brand változó formátumok, Variáns keveredik</p>
<hr />
<h2>Gyakorlat: auditáld az azonosítókat (10-15 perc)</h2>
<p>Most auditáld 10 termék azonosítóit. Íme a lépések:</p>
<ol>
<li>Készíts egy táblázatot: Termék | SKU | GTIN | Brand | Variáns jelölés | Jegyzet.</li>
<li>Töltsd ki 10 termékkel.</li>
<li>Jelöld meg, mi van rendben és mi hiányzik vagy hibás.</li>
</ol>
<h2>Önálló gyakorlat: javítsd a hiányosságokat (5-10 perc)</h2>
<p>Most javítsd a hiányzó vagy hibás azonosítókat a Shopify adminban.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 10 termék auditálva</li>
<li>✅ Hiányzó vagy hibás azonosítók listázva</li>
<li>✅ Azonosítók javítva a Shopify adminban</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>GTIN információk: <a href="https://www.gs1.org/standards/id-keys/gtin" target="_blank" rel="noreferrer">https://www.gs1.org/standards/id-keys/gtin</a></li>
<li>Shopify termékazonosítók: <a href="https://help.shopify.com/en/manual/products/products/product-variants" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/products/product-variants</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 9. nap: Azonosítók',
  emailBody: `<h1>GEO Shopify – 9. nap</h1>
<h2>Azonosítók rendben: SKU, GTIN, brand, variáns</h2>
<p>Ma rendbe teszed a termékazonosítókat, hogy az AI és a feedek ne keverjék össze a termékeket.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson9() {
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

    const lessonId = `${COURSE_ID}_DAY_09`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_9.day,
          language: 'hu', title: UPDATED_LESSON_9.title, content: UPDATED_LESSON_9.content,
          emailSubject: UPDATED_LESSON_9.emailSubject, emailBody: UPDATED_LESSON_9.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 9 updated successfully`);
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

updateLesson9();
