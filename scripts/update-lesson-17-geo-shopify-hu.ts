/**
 * Update Lesson 17 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_17 = {
  day: 17,
  title: 'Strukturált adatok ellenőrzése (schema)',
  content: `<h1>Strukturált adatok ellenőrzése (schema)</h1>
<p><em>Ma ellenőrzöd a product/offer schema-t, hogy az AI helyesen értelmezze.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Validálod a product/offer schema-t 3 oldalon.</li>
<li>Listázod a hibákat vagy hiányosságokat, és javítod őket.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>A generatív motorok gyakran támaszkodnak a strukturált adatra. Ha hibás a schema, ez téves ár/készlet/azonosító információhoz vezethet, ami káros lehet a boltod számára.</p>
<hr />
<h2>Mit nézz a schema-ban?</h2>
<h3>Product és Offer típusok</h3>
<p>Ellenőrizd, hogy a schema tartalmazza:</p>
<ul>
<li>@type Product + Offer</li>
<li>price – pontos ár</li>
<li>priceCurrency – pénznem (pl. "HUF", "EUR")</li>
<li>availability – készlet állapot (pl. "InStock", "OutOfStock")</li>
</ul>
<h3>Azonosítók és információk</h3>
<p>Fontos mezők:</p>
<ul>
<li>sku – Stock Keeping Unit</li>
<li>gtin – Global Trade Item Number (ha elérhető)</li>
<li>brand – márka neve</li>
<li>image – termék kép URL</li>
<li>url – termékoldal URL</li>
<li>review – valós review-k (ha vannak)</li>
</ul>
<p><strong>Fontos</strong>: Ne tüntess fel hamis review-t, mert ez kizáráshoz vezethet.</p>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó schema</h3>
<p>Product + Offer típusok, pontos ár, készlet, SKU/GTIN, brand, valós review-k.</p>
<h3>❌ Rossz schema</h3>
<p>Hiányzó mezők, hibás ár, hamis review-k, hiányzó azonosítók.</p>
<hr />
<h2>Gyakorlat: validáld a schema-t (10-15 perc)</h2>
<p>Most validálod a product/offer schema-t 3 oldalon. Íme a lépések:</p>
<ol>
<li>Válassz ki 3 termékoldalt a boltodban.</li>
<li>Ellenőrizd minden oldalon a schema-t:
   <ul>
   <li>Product + Offer típusok</li>
   <li>Ár, pénznem, készlet</li>
   <li>SKU, GTIN, brand</li>
   <li>Kép, URL</li>
   <li>Review-k (ha vannak)</li>
   </ul>
</li>
<li>Listázd a hibákat vagy hiányosságokat.</li>
<li>Javítsd a hibákat.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további oldalakra (5-10 perc)</h2>
<p>Most bővítsd a schema ellenőrzést további 5-10 termékoldalra is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 3 oldalon validálva a schema</li>
<li>✅ Hibák vagy hiányosságok listázva</li>
<li>✅ Hibák javítva</li>
<li>✅ Schema helyes minden oldalon</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Schema.org Product: <a href="https://schema.org/Product" target="_blank" rel="noreferrer">https://schema.org/Product</a></li>
<li>Google Rich Results Test: <a href="https://search.google.com/test/rich-results" target="_blank" rel="noreferrer">https://search.google.com/test/rich-results</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 17. nap: Schema ellenőrzés',
  emailBody: `<h1>GEO Shopify – 17. nap</h1>
<h2>Strukturált adatok ellenőrzése (schema)</h2>
<p>Ma ellenőrzöd a product/offer schema-t, hogy az AI helyesen értelmezze.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson17() {
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

    const lessonId = `${COURSE_ID}_DAY_17`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_17.day,
          language: 'hu', title: UPDATED_LESSON_17.title, content: UPDATED_LESSON_17.content,
          emailSubject: UPDATED_LESSON_17.emailSubject, emailBody: UPDATED_LESSON_17.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 17 updated successfully`);
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

updateLesson17();
