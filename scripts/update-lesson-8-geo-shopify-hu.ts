/**
 * Update Lesson 8 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_8 = {
  day: 8,
  title: 'Miért fontos a feed és az „offer truth"',
  content: `<h1>Miért fontos a feed és az „offer truth"</h1>
<p><em>Ma megtanulod, miért kell a feednek egyeznie a valós ajánlattal (ár, készlet, szállítás).</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Listázod az offer truth elemeit (ár, készlet, szállítás, visszaküldés, azonosítók).</li>
<li>Felméred a feed és a PDP közti eltéréseket 5 terméken.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI és a merchant programok a feedre és a PDP-re támaszkodnak. Ha ellentmondó az ár, készlet vagy policy információ, ez kizáráshoz vagy rossz ajánláshoz vezethet.</p>
<hr />
<h2>Offer truth: mi kell bele?</h2>
<h3>Ár</h3>
<ul>
<li>Pontos ár minden terméknél</li>
<li>Kedvezmény kezelése – ha van akció, az is pontosan</li>
<li>Feed és PDP ugyanazt az árat mutatja</li>
</ul>
<h3>Készlet</h3>
<ul>
<li>Aktuális készlet információ</li>
<li>Variáns szinten pontos készlet</li>
<li>Feed és PDP ugyanazt a készletet mutatja</li>
</ul>
<h3>Szállítás és visszaküldés</h3>
<ul>
<li>Világos szállítási információk</li>
<li>Visszaküldési policy linkelve</li>
<li>Feed és PDP ugyanazt a policy-t mutatja</li>
</ul>
<h3>Azonosítók</h3>
<ul>
<li>GTIN/SKU/brand konzisztens</li>
<li>Feed és PDP ugyanazokat az azonosítókat használja</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó offer truth</h3>
<p>Feed és PDP ugyanazt az árat/készletet mutatja, policy link ugyanaz, azonosítók konzisztensek.</p>
<h3>❌ Rossz offer truth</h3>
<p>Feed más árat mutat, mint a PDP, készlet információ ellentmond, policy linkek eltérnek.</p>
<hr />
<h2>Gyakorlat: mérj fel eltéréseket (10-15 perc)</h2>
<p>Most mérj fel eltéréseket a feed és a PDP között. Íme a lépések:</p>
<ol>
<li>Listázd az offer truth elemeit: ár, készlet, szállítás, visszaküldés, azonosítók.</li>
<li>Válassz ki 5 terméket.</li>
<li>Összehasonlítod a feed és a PDP adatait minden terméknél.</li>
<li>Jegyezd fel az eltéréseket.</li>
</ol>
<h2>Önálló gyakorlat: javítsd az eltéréseket (5-10 perc)</h2>
<p>Most javítsd az eltéréseket: frissítsd a feed-et vagy a PDP-t, hogy egyezzenek.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Megvan az offer truth elemek listája</li>
<li>✅ 5 terméken felmérted a feed és PDP eltéréseit</li>
<li>✅ Javítottad az eltéréseket</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Google Merchant Center – Feed követelmények: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
<li>Shopify Product Feed: <a href="https://help.shopify.com/en/manual/products/feeds" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/feeds</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 8. nap: Feed és offer truth',
  emailBody: `<h1>GEO Shopify – 8. nap</h1>
<h2>Miért fontos a feed és az „offer truth"</h2>
<p>Ma megtanulod, miért kell a feednek egyeznie a valós ajánlattal, és felméred az eltéréseket.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson8() {
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

    const lessonId = `${COURSE_ID}_DAY_08`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_8.day,
          language: 'hu', title: UPDATED_LESSON_8.title, content: UPDATED_LESSON_8.content,
          emailSubject: UPDATED_LESSON_8.emailSubject, emailBody: UPDATED_LESSON_8.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 8 updated successfully`);
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

updateLesson8();
