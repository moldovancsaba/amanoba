/**
 * Seed GEO for Shopify 30-day course (Hungarian)
 *
 * Creates/updates the GEO_SHOPIFY_30 course with the first 3 lessons.
 * Lessons follow the mandatory structure: goal, why, explanation, examples,
 * guided/independent exercises, self-check (binary), optional deepening links.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import {
  Brand,
  Course,
  Lesson,
  QuizQuestion,
  QuestionDifficulty
} from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';
const COURSE_NAME = 'GEO Shopify – 30 napos kurzus';
const COURSE_DESCRIPTION =
  '30 napos, gyakorlati GEO-kurzus Shopify kereskedőknek: napi 20-30 percben építed fel a termék- és tartalom alapokat, hogy generatív rendszerek biztonságosan megtalálják, értelmezzék és idézzék a boltodat.';

type LessonEntry = {
  day: number;
  title: string;
  content: string;
  emailSubject?: string;
  emailBody?: string;
};

const lessonPlan: LessonEntry[] = [
  {
    day: 1,
    title: 'Mi a GEO, és mi nem az (Shopify kontextusban)',
    content: `<h1>Mi a GEO, és mi nem az (Shopify)</h1>
<p><em>Megérted, hogy a GEO hogyan különbözik az SEO-tól, és mit jelent az AI-válaszokban való megjelenés.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Tisztán különválasztod a GEO és az SEO fogalmát.</li>
<li>Azonosítod, milyen eredményt vársz GEO-tól (idézet, bevonás, következetesség).</li>
<li>Készítesz 5 próba promptot a saját boltodra.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI-válaszokban a boltok csak akkor jelennek meg, ha az információ könnyen előhívható és biztonságosan idézhető.</li>
<li>A GEO növeli az esélyt a megjelenésre; nem garantálja a tranzakciót.</li>
<li>A jó GEO-alap csökkenti a félreértett ajánlások kockázatát (téves ár, készlet, szállítás).</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>GEO vs SEO</h3>
<ul>
<li><strong>SEO</strong>: keresőmotor rangsor a 10 kék linkben.</li>
<li><strong>GEO</strong>: generatív motor válaszaiban való szereplés, idézhetőség.</li>
</ul>
<h3>Mit várhatsz GEO-tól?</h3>
<ul>
<li>Inklúzió: bekerül-e a termék/brand az AI válaszba.</li>
<li>Idézés: hivatkozik-e a domainre.</li>
<li>Konzisztencia: ismétlődik-e több futtatásban.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Egyértelmű termékadatok (GTIN, ár, készlet), világos szállítás/retour, tiszta HTML, stabil URL.</li>
<li><strong>Rossz</strong>: Hiányzó azonosítók, félrevezető ár, dinamikus vagy duplikált URL-ek, átláthatatlan szállítás.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Írj 5 GEO promptot a boltodra (pl. „Legjobb [termékkategória] 2025-ben [ország]”).</li>
<li>Jegyezd fel, mit vársz: inklúzió, idézés, konzisztencia.</li>
<li>Mentés egy táblázatba (Prompt, Várt kimenet, Jegyzet).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Futtasd kézzel a 5 promptot ChatGPT/Copilot/Google AI felületen, jegyezd: megjelenik-e a boltod, hivatkozik-e rád.</p>
<hr />
<h2>Önellenőrzés (igen/nem)</h2>
<ul>
<li>Megvan 5 saját GEO prompt.</li>
<li>Érted a különbséget GEO és SEO között.</li>
<li>Felírtad, mit vársz a GEO-tól (inklúzió, idézés, konzisztencia).</li>
<li>Elvégezted az első manuális futtatást és jegyzeteltél.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>arXiv: GEO (Generative Engine Optimization): <a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noreferrer">https://arxiv.org/abs/2311.09735</a></li>
<li>Search Engine Land – What is GEO: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 1. nap: Mi a GEO, és mi nem az',
    emailBody: `<h1>GEO Shopify – 1. nap</h1>
<h2>Mi a GEO, és mi nem az</h2>
<p>Ma megérted a GEO és az SEO különbségét, és 5 saját GEO promptot írsz a boltodra.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 2,
    title: 'GEO vs SEO Shopify-n: mire figyelj?',
    content: `<h1>GEO vs SEO Shopify-n: mire figyelj?</h1>
<p><em>Rávilágítunk, mely elemek számítanak a generatív felületekben, és hogyan egészítik ki az SEO-t.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Listázod, mi SEO-first és mi GEO-first.</li>
<li>Készítesz egy 10 pontos ellenőrzőlistát Shopify-hoz GEO szempontból.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI válaszok gyakran összefoglalják a fő termékadatokat: ha hiányos, kimaradsz.</li>
<li>A GEO nem csak rangsor: a világos, idézhető tartalom a cél.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>SEO-first elemek</h3>
<ul>
<li>Meta title/description, belső linkek, canonical, page speed.</li>
<li>Backlinkek, strukturált tartalom hosszabb formában.</li>
</ul>
<h3>GEO-first elemek</h3>
<ul>
<li>Pontos termékadatok (ár, készlet, azonosítók) egyértelműen olvashatóan.</li>
<li>Visszaigazolható policy-k (szállítás, visszaküldés), stabil URL-ek.</li>
<li>Tiszta, rövid válaszképes blokkok (answer capsule).</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Termékoldal tetején tömör összegzés, jól strukturált ár/stock, GTIN és SKU feltüntetve.</li>
<li><strong>Rossz</strong>: Hosszú, rendezetlen leírás, hiányzó azonosítók, összemosott variánsadatok.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Készíts 10 pontos GEO checklistet Shopify-hoz (ár, készlet, GTIN/SKU, policy, answer capsule, stabil URL, alt text, structured data, belső link, reviews szabály).</li>
<li>Jelöld, mi van rendben, mi hiányzik egy minta PDP-n.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Alkalmazd a checklistet 1 további termékoldalra, és írd fel 3 hiányosságot.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Megvan a 10 pontos GEO checklist.</li>
<li>Egy PDP-n kipipáltad, mi van rendben/hiányzik.</li>
<li>Felírtál 3 javítandó elemet egy másik PDP-n.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Google Search Central – GenAI content: <a href="https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/using-gen-ai-content</a></li>
<li>Shopify termékadat: <a href="https://shopify.dev/docs/apps/selling-strategies/product-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/apps/selling-strategies/product-data</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 2. nap: GEO vs SEO Shopify-n',
    emailBody: `<h1>GEO Shopify – 2. nap</h1>
<h2>GEO vs SEO Shopify-n</h2>
<p>Ma összeállítod a 10 pontos GEO checklistet, és két termékoldalon alkalmazod.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 3,
    title: 'Hogyan változtatja meg az AI a vásárlói utat?',
    content: `<h1>Hogyan változtatja meg az AI a vásárlói utat?</h1>
<p><em>A keresőlistáról az „answer + ajánlás” élményre váltunk – mit jelent ez a boltodnak.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Feltérképezed a jelenlegi vásárlói utat és az AI-hatást.</li>
<li>Készítesz 5 fő „AI touchpoint”-ot a boltodra.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI válasz gyakran előzi a hagyományos listát: ha nem vagy benne, lemaradsz.</li>
<li>A válasz tömör: félreértett adatok károsak (ár/stock/policy).</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Régi vs új út</h3>
<ul>
<li><strong>Régi</strong>: keresés → listanézet → kattintás.</li>
<li><strong>Új</strong>: kérdés → AI összegzés + ajánlás → kattintás vagy chat-folytatás.</li>
</ul>
<h3>Hatások Shopify-ra</h3>
<ul>
<li>Rövid, biztonságosan idézhető blokk kell a PDP tetején (answer capsule).</li>
<li>Felhasználó gyakran „később” érkezik a site-ra, célzott szándékkal.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: PDP elején rövid összegzés „Kinek, mire jó, mire nem, ár/stock” tisztán.</li>
<li><strong>Rossz</strong>: Hosszú, strukturálatlan leírás, hiányzó policy linkek.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Rajzold fel a jelenlegi vásárlói utat 5 lépésben.</li>
<li>Jelöld be, hol találkozhat AI válasszal (előtte: keresés/chat; közben: ajánlás; utána: visszakérés).</li>
<li>Írj 5 AI touchpointot (pl. „Legjobb [X]”, „Melyik méretet válasszam?”, „Van-e ingyenes visszaküldés?”).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Egy termékoldalon készíts egy 3-5 soros answer capsule-t, ami választ ad a fő touchpointokra.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Megvan a vásárlói út 5 lépésben.</li>
<li>Felírtál 5 AI touchpointot.</li>
<li>Készítettél egy rövid answer capsule-t egy PDP tetejére.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI Shopping help: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
<li>Copilot Merchant Program: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 3. nap: AI és a vásárlói út',
    emailBody: `<h1>GEO Shopify – 3. nap</h1>
<h2>AI és a vásárlói út</h2>
<p>Ma feltérképezed az AI touchpointokat, és írsz egy rövid answer capsule-t egy PDP-re.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  }
];

function buildLessonContent(entry: LessonEntry) {
  return entry.content;
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  const { default: connectDB } = await import('../app/lib/mongodb');
  await connectDB();
  console.log('✅ Connected to MongoDB');

  let brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    brand = await Brand.create({
      name: 'Amanoba',
      slug: 'amanoba',
      displayName: 'Amanoba',
      description: 'Unified Learning Platform',
      logo: '/AMANOBA.png',
      themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
      allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
      supportedLanguages: ['hu', 'en'],
      defaultLanguage: 'hu',
      isActive: true
    });
    console.log('✅ Brand created');
  }

  const course = await Course.findOneAndUpdate(
    { courseId: COURSE_ID },
    {
      $set: {
        courseId: COURSE_ID,
        name: COURSE_NAME,
        description: COURSE_DESCRIPTION,
        language: 'hu',
        durationDays: 30,
        isActive: true,
        requiresPremium: false,
        brandId: brand._id,
        pointsConfig: {
          completionPoints: 1000,
          lessonPoints: 50,
          perfectCourseBonus: 500
        },
        xpConfig: {
          completionXP: 500,
          lessonXP: 25
        },
        metadata: {
          category: 'education',
          difficulty: 'intermediate',
          estimatedHours: 10,
          tags: ['geo', 'shopify', 'ecommerce'],
          instructor: 'Amanoba'
        }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`✅ Course ${COURSE_ID} created/updated`);

  for (const entry of lessonPlan) {
    const lessonId = `${COURSE_ID}_DAY_${String(entry.day).padStart(2, '0')}`;
    const content = buildLessonContent(entry);

    const emailSubject = entry.emailSubject || `{{courseName}} – {{dayNumber}}. nap: {{lessonTitle}}`;
    let emailBody = entry.emailBody;
    if (!emailBody) {
      emailBody = [
        `<h1>{{courseName}}</h1>`,
        `<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>`,
        '<div>{{lessonContent}}</div>',
        `<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Megnyitom a leckét →</a></p>`
      ].join('');
    }
    emailBody = emailBody
      .replace(/\{\{APP_URL\}\}/g, appUrl)
      .replace(/\{\{COURSE_ID\}\}/g, COURSE_ID);

    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: entry.day,
          language: 'hu',
          title: entry.title,
          content,
          emailSubject,
          emailBody,
          pointsReward: course.pointsConfig.lessonPoints,
          xpReward: course.xpConfig.lessonXP,
          isActive: true,
          displayOrder: entry.day,
          unlockConditions: {
            requirePreviousLesson: entry.day > 1,
            requireCourseStart: true
          },
          quizConfig: {
            enabled: true,
            successThreshold: 100,
            questionCount: 5,
            poolSize: 5,
            required: true
          },
          metadata: {
            estimatedMinutes: 20,
            difficulty: 'intermediate' as const,
            tags: ['geo', 'shopify']
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Build quizzes (5 per lesson, content-aligned)
    const quizzes: Array<{
      question: string;
      options: string[];
      correctIndex: number;
      difficulty: QuestionDifficulty;
      category: string;
    }> = [];

    if (entry.day === 1) {
      quizzes.push(
        {
          question: 'Mi a GEO fő célja Shopify bolt esetén?',
          options: [
            'Az AI válaszokban való megjelenés és idézhetőség',
            'Csak a Google rangsor növelése',
            'Csak a page speed javítása',
            'Csak a backlink gyűjtés'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi a három fő GEO-kimenet, amit nézni kell?',
          options: [
            'Inklúzió, idézés, konzisztencia',
            'Bounce rate, bármilyen link, social like',
            'Meta title, meta description, H1',
            'Csak átkattintási arány'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi különbözteti meg a GEO-t az SEO-tól?',
          options: [
            'GEO az AI válaszokra, SEO a 10 kék link rangsorra fókuszál',
            'GEO csak a backlinkről szól',
            'SEO csak AI-ra vonatkozik',
            'Nincs különbség'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért kritikus a pontos termékadat GEO-ban?',
          options: [
            'Az AI csak biztonságos, tiszta adatot idéz szívesen',
            'Csak a design számít',
            'Mert a készlet nem fontos',
            'Az árak mindegy, hogy pontosak-e'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mit tartalmazzon az első prompt lista?',
          options: [
            'Legalább 5 saját boltra szabott GEO promptot',
            'Csak egy általános promptot',
            'Csak meta title ötleteket',
            'Csak képeket'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 2) {
      quizzes.push(
        {
          question: 'Mi GEO-first elem a Shopify PDP-n?',
          options: [
            'Ár/készlet/azonosítók tiszta megjelenítése',
            'Csak hosszú meta description',
            'Csak backlink',
            'Csak page speed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért kell answer capsule a GEO-ban?',
          options: [
            'Tömör, idézhető blokkot ad a modellnek a PDP tetején',
            'Csak design elem',
            'Nem szükséges',
            'Csak SEO kulcsszavak miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Melyik jó tétel egy 10 pontos GEO checklisthez?',
          options: [
            'GTIN/SKU megadva és olvasható',
            'Rejtett ár',
            'Nincs készlet jelzés',
            'Duplikált URL-ek'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi az SEO-first példa a listából?',
          options: [
            'Meta title/description finomhangolás',
            'Készletjelzés kiírása',
            'Visszaküldési policy feltüntetése',
            'Answer capsule írása'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért fontos a tiszta variánsadat GEO-ban?',
          options: [
            'Az AI ne keverje össze a méretet/színt összegzéskor',
            'Csak kényelmi okból',
            'Nem számít',
            'Csak SEO kulcsszó miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 3) {
      quizzes.push(
        {
          question: 'Mi az AI által befolyásolt új vásárlói út egyik jellemzője?',
          options: [
            'Válasz + ajánlás érkezik a listanézet előtt',
            'Mindig csak 10 kék linket lát a user',
            'Nincs hatása az útra',
            'Csak page speed számít'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi az answer capsule célja a PDP tetején?',
          options: [
            'Kinek, mire jó, mire nem, ár/stock röviden, idézhetően',
            'Csak hosszabb leírás másolása',
            'Dekoráció',
            'SEO kulcsszó halmozás'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Miért készíts AI touchpoint listát?',
          options: [
            'Hogy tudd, milyen kérdésekre kell választ adnod a PDP-n',
            'Csak marketing okból',
            'Nem szükséges',
            'Csak belső használatra, de nem befolyásol semmit'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Melyik lépés része a vezetett gyakorlatnak?',
          options: [
            'Rajzold fel a jelenlegi vásárlói utat és jelöld az AI érintési pontokat',
            'Csak meta title írása',
            'Csak backlink keresés',
            'Semmit nem kell tenni'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi a legnagyobb kockázat, ha nincs tiszta policy a PDP-n?',
          options: [
            'Az AI félrevezetheti a vásárlót ár/stock/policy tekintetében',
            'Semmi kockázat',
            'Csak SEO büntetés',
            'Csak design gond'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    }

    await QuizQuestion.deleteMany({ lessonId });
    await QuizQuestion.insertMany(
      quizzes.map((q, index) => ({
        ...q,
        lessonId,
        courseId: course._id,
        language: 'hu',
        isActive: true,
        displayOrder: index + 1,
        showCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        averageResponseTime: 0
      }))
    );
    console.log(`✅ Lesson ${lessonId} upserted with ${quizzes.length} questions`);
  }

  console.log('🎉 GEO Shopify course seeded (days 1-3).');
  await mongoose.disconnect();
  console.log('✅ Disconnected');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
