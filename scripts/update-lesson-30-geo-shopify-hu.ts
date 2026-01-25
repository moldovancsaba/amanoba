/**
 * Update Lesson 30 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_30 = {
  day: 30,
  title: 'Capstone sprint: 1 kollekció teljes GEO ciklus',
  content: `<h1>Capstone sprint: 1 kollekció teljes GEO ciklus</h1>
<p><em>Ma végigviszel egy 10 termékes kollekción egy teljes GEO sprintet.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Kiválasztasz 1 kollekciót (10 termék).</li>
<li>Elvégzed a blueprint + capsule + feed + mérés lépéseit.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Bizonyítod, hogy a folyamat működik. Megteremted a skálázás alapját. Fontos, hogy egy teljes ciklust végigmenj, hogy lássd, minden lépés működik.</p>
<hr />
<h2>Teljes GEO ciklus: mi kell bele?</h2>
<p>Egy teljes GEO sprint ezeket a lépéseket tartalmazza:</p>
<ol>
<li><strong>Data fix</strong>: azonosító, ár/készlet, policy – alapadatok ellenőrzése és javítása</li>
<li><strong>PDP blueprint + capsule + képek</strong> – termékoldal optimalizálása</li>
<li><strong>Kollekció guide + linkek</strong> – kollekció oldal guide stílusra alakítása</li>
<li><strong>Feed ellenőrzés + mérés</strong> a prompt setből – feed validálása és mérés</li>
</ol>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó capstone sprint</h3>
<p>Minden termék ugyanazon standard szerint, mérés dokumentálva, backlog kész.</p>
<h3>❌ Rossz capstone sprint</h3>
<p>Ad hoc javítások, mérés nélkül, nincs dokumentáció.</p>
<hr />
<h2>Gyakorlat: végigviszed a teljes ciklust (10-15 perc)</h2>
<p>Most végigviszel egy teljes GEO sprintet egy kollekción. Íme a lépések:</p>
<ol>
<li>Válassz kollekciót, írd fel a 10 terméket.</li>
<li>Alkalmazd a blueprintet és a kapszulát mind a 10 termékre.</li>
<li>Futtasd a feed/mérés ellenőrzést.</li>
</ol>
<h2>Önálló gyakorlat: dokumentáld az eredményeket (5-10 perc)</h2>
<p>Most írj egy 1 oldalas before/after jegyzetet és a következő sprint backlogját.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 10 termék átment a standardon</li>
<li>✅ Mérés futott, eredmények rögzítve</li>
<li>✅ Backlog a következő 30 napra kész</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>GEO best practices: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
<li>E-commerce optimization: <a href="https://www.shopify.com/blog/ecommerce-optimization" target="_blank" rel="noreferrer">https://www.shopify.com/blog/ecommerce-optimization</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 30. nap: Capstone sprint',
  emailBody: `<h1>GEO Shopify – 30. nap</h1>
<h2>Capstone sprint: 1 kollekció teljes GEO ciklus</h2>
<p>Ma végigviszel egy 10 termékes kollekción egy teljes GEO sprintet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson30() {
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
          xpConfig: { completionXP: 500, lessonXP: 30 },
          metadata: { category: 'education', difficulty: 'intermediate', estimatedHours: 10, tags: ['geo', 'shopify', 'ecommerce'], instructor: 'Amanoba' }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Course ${COURSE_ID} found/created: ${course.name}`);

    const lessonId = `${COURSE_ID}_DAY_30`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_30.day,
          language: 'hu', title: UPDATED_LESSON_30.title, content: UPDATED_LESSON_30.content,
          emailSubject: UPDATED_LESSON_30.emailSubject, emailBody: UPDATED_LESSON_30.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 30 updated successfully`);
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

updateLesson30();
