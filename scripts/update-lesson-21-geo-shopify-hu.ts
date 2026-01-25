/**
 * Update Lesson 21 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_21 = {
  day: 21,
  title: 'Prompt intent térkép: best / vs / alternatives / policy',
  content: `<h1>Prompt intent térkép: best / vs / alternatives / policy</h1>
<p><em>Ma összerakod a kérdéskategóriákat, amelyekre az AI válaszolni fog.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Összeírsz 30–40 promptot intent szerint, amit azonnal használhatsz.</li>
<li>Hozzárendeled a releváns kollekciót vagy PDP-t minden prompt-hoz.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI a tipikus vásárlói kérdésekre válaszol. Neked kell tudni, hova irányítson. Intent-ek nélkül véletlen lesz a tartalom és a mérés. Fontos, hogy minden prompt-hoz legyen megfelelő tartalom.</p>
<hr />
<h2>Prompt intent kategóriák: mi kell bele?</h2>
<h3>Best (Legjobb)</h3>
<p>Kérdések, amelyek a legjobb választást keresik:</p>
<ul>
<li>"Legjobb [termékkategória] [ország/cél]"</li>
<li>Példa: "Legjobb futócipő kezdőknek Magyarországon"</li>
</ul>
<h3>Vs (Összehasonlítás)</h3>
<p>Kérdések, amelyek összehasonlítást kérnek:</p>
<ul>
<li>"[X] vs [Y], melyik jobb?"</li>
<li>Példa: "Nike vs Adidas futócipő, melyik jobb?"</li>
</ul>
<h3>Alternatives (Alternatívák)</h3>
<p>Kérdések, amelyek alternatívát keresnek:</p>
<ul>
<li>"[X] helyett mit vegyek?"</li>
<li>Példa: "Drága futócipő helyett mit vegyek?"</li>
</ul>
<h3>Policy/Fit (Szabályzat/Illeszkedés)</h3>
<p>Kérdések, amelyek policy vagy fit információt kérnek:</p>
<ul>
<li>Méret kérdések: "Melyik méretet válasszam?"</li>
<li>Szállítás kérdések: "Mennyi a szállítási idő?"</li>
<li>Visszaküldés kérdések: "Van-e ingyenes visszaküldés?"</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó intent térkép</h3>
<p>30–40 prompt intent szerint kategorizálva, minden prompt-hoz releváns kollekció vagy PDP hozzárendelve.</p>
<h3>❌ Rossz intent térkép</h3>
<p>5 általános prompt, nincs kategorizálás, nincs hozzárendelés.</p>
<hr />
<h2>Gyakorlat: készítsd el az intent térképet (10-15 perc)</h2>
<p>Most összeírsz 30–40 promptot intent szerint és hozzárendeled a releváns tartalmat. Íme a lépések:</p>
<ol>
<li>Készíts egy táblázatot ezekkel az oszlopokkal: Prompt | Intent (best/vs/alternatives/policy) | Releváns kollekció/PDP | Jegyzet.</li>
<li>Írj 30–40 promptot, intent szerint kategorizálva:
   <ul>
   <li>Best kérdések</li>
   <li>Vs kérdések</li>
   <li>Alternatives kérdések</li>
   <li>Policy/Fit kérdések</li>
   </ul>
</li>
<li>Minden prompt-hoz rendelj hozzá releváns kollekciót vagy PDP-t.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további kategóriákra (5-10 perc)</h2>
<p>Most bővítsd az intent térképet további kategóriákra vagy termékekre is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 30–40 prompt intent szerint kategorizálva</li>
<li>✅ Minden prompt-hoz releváns kollekció vagy PDP hozzárendelve</li>
<li>✅ Intent térkép kész és használható</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Search intent types: <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/seo-starter-guide</a></li>
<li>Content strategy: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 21. nap: Intent térkép',
  emailBody: `<h1>GEO Shopify – 21. nap</h1>
<h2>Prompt intent térkép: best / vs / alternatives / policy</h2>
<p>Ma összerakod a kérdéskategóriákat, amelyekre az AI válaszolni fog.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson21() {
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

    const lessonId = `${COURSE_ID}_DAY_21`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_21.day,
          language: 'hu', title: UPDATED_LESSON_21.title, content: UPDATED_LESSON_21.content,
          emailSubject: UPDATED_LESSON_21.emailSubject, emailBody: UPDATED_LESSON_21.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 21 updated successfully`);
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

updateLesson21();
