/**
 * Update Lesson 25 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_25 = {
  day: 25,
  title: 'Off-site GEO: mikor segít, mikor árt',
  content: `<h1>Off-site GEO: mikor segít, mikor árt</h1>
<p><em>Ma felkutatod, mely külső hivatkozások támogatják az idézhetőséget.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Listázod a hasznos off-site forrásokat (review, média, partnerség).</li>
<li>Elkerülöd a spam/junk említéseket, hogy ne ártsanak a boltodnak.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI nézheti a külső említéseket is. Spam jellegű linkek árthatnak, és kizáráshoz vezethetnek. Fontos, hogy csak hiteles, releváns forrásokat használj.</p>
<hr />
<h2>Off-site források: mi segít, mi árt?</h2>
<h3>Hasznos források</h3>
<p>Ezek a források támogatják az idézhetőséget:</p>
<ul>
<li>Hiteles review oldal – valós értékelések</li>
<li>Releváns média – cikkek, tesztelések</li>
<li>Partner blog – releváns partner tartalom</li>
</ul>
<h3>Káros források</h3>
<p>Ezek a források árthatnak:</p>
<ul>
<li>Linkfarm – spam linkek</li>
<li>Fizetett spam – fizetett, minősítetlen linkek</li>
<li>Irreleváns katalógus – nem releváns katalógusok</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó off-site forrás</h3>
<p>Valós tesztcikk linkje, partner Q&A, hiteles review oldal.</p>
<h3>❌ Rossz off-site forrás</h3>
<p>Linkfarm, kulcsszóhalmozott cikk, fizetett spam.</p>
<hr />
<h2>Gyakorlat: készítsd el a forrás listát (10-15 perc)</h2>
<p>Most készítesz egy listát a hasznos és kerülendő forrásokról. Íme a lépések:</p>
<ol>
<li>Készíts egy listát két oszlopban: hasznos források vs kerülendő források.</li>
<li>Válassz ki 2 hiteles forrást, és tervezd meg az elhelyezésüket.</li>
</ol>
<h2>Önálló gyakorlat: outreach váz (5-10 perc)</h2>
<p>Most írj egy outreach vázat egy partnercikkhez vagy Q&A-hoz.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Hasznos/kerülendő lista kész</li>
<li>✅ 2 hiteles forrás kijelölve</li>
<li>✅ Outreach váz megvan</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Google spam policies: <a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/essentials/spam-policies</a></li>
<li>Link building best practices: <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/seo-starter-guide</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 25. nap: Off-site GEO',
  emailBody: `<h1>GEO Shopify – 25. nap</h1>
<h2>Off-site GEO: mikor segít, mikor árt</h2>
<p>Ma felkutatod, mely külső hivatkozások támogatják az idézhetőséget.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson25() {
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

    const lessonId = `${COURSE_ID}_DAY_25`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_25.day,
          language: 'hu', title: UPDATED_LESSON_25.title, content: UPDATED_LESSON_25.content,
          emailSubject: UPDATED_LESSON_25.emailSubject, emailBody: UPDATED_LESSON_25.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 25 updated successfully`);
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

updateLesson25();
