/**
 * Seed "The Playbook 2026 - Mesterkurzus Designereknek" (Hungarian, first 3 lessons)
 *
 * Creates/updates the course with the initial 3 lessons and lesson-specific quizzes.
 * Lessons follow the required structure: goal, why, explanation, examples, guided/independent exercises, self-check, optional deepening links.
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
  QuestionDifficulty,
} from '../app/lib/models';

const COURSE_ID = 'PLAYBOOK_2026_30';
const COURSE_NAME = 'The Playbook 2026 – Mesterkurzus Designereknek';
const COURSE_DESCRIPTION =
  '30 napos, produkciós design playbook építés. Vizuális nyelv, szemantika, layout, tokenek, komponensek, governance, capstone playbook. Napi 20–30 perc, kézzelfogható artefaktumokkal.';

type LessonEntry = {
  day: number;
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
  quiz?: {
    questions: Array<{
      question: string;
      options: [string, string, string, string];
      correctIndex: number;
    }>;
  };
};

const lessons: LessonEntry[] = [
  {
    day: 1,
    title: 'Miért vizuális nyelv, nem stílus',
    content: `<h1>Miért vizuális nyelv, nem stílus</h1>
<p><em>Megérted, hogy a „stílus” nem skálázódik, a vizuális nyelv viszont döntési rendszert ad.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>1 mondatban el tudod mondani a különbséget stílus és vizuális nyelv között.</li>
  <li>Fel tudsz sorolni 3 következményt, ha nincs vizuális nyelv.</li>
  <li>Megfogalmazol egy „Visual Intent” mondatot a saját termékedhez.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Stílus = vélemény; vizuális nyelv = szabály, ezért skálázható.</li>
  <li>Csapatban csak dokumentált, átadható döntések működnek.</li>
  <li>Vizuális káosz hitelt rombol, support költséget növel.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Stílus</h3>
<ul>
  <li>Szubjektív, személyhez kötött.</li>
  <li>Nem dokumentált, nem mérhető.</li>
  <li>Törik, ha új ember csatlakozik.</li>
</ul>
<h3>Vizuális nyelv</h3>
<ul>
  <li>Szabályok: színek, tipó, forma, mozgás, ritmus.</li>
  <li>Szándék: mit akar közvetíteni a termék (hang, tónus, súly).</li>
  <li>Döntési rendszer: ugyanarra a problémára ugyanaz a válasz.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Legyen modernebb, tegyünk még gradientet.” – nincs szabály, csak ízlés.</p>
<p><strong>Jó:</strong> „Primary CTA: #111827 szöveg #FAB908 háttéren, 12px/16px padding, shadow tiltva. Más CTA nem használhat sárgát.” – szabály, nem ízlés.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írd le: „A mi vizuális nyelvünk célja, hogy …” (1 mondat).</li>
  <li>Sorolj fel 3 helyzetet, ahol a csapat vizuális döntést hoz (CTA, kártya, üres állapot), és írd mellé: ma ez szabály vagy ízlés?</li>
  <li>Készíts egy rövid „Visual Intent Statement”-et (hang, tonalitás, sűrűség, bátorság, kontraszt).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Válassz egy meglévő képernyőt, jelöld meg 3 elemet, ahol ma ízlés dönt, és írd mellé a kívánt szabályt.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>El tudom mondani a különbséget stílus vs vizuális nyelv.</li>
  <li>Van 1 mondatos Visual Intent Statement.</li>
  <li>Legalább 3 szabályra átírtam „ízlés” helyett konkrét döntést.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Airbnb Design Language: <a href="https://airbnb.design/building-a-visual-language/" target="_blank" rel="noreferrer">https://airbnb.design/building-a-visual-language/</a></li>
  <li>Design Tokens W3C draft: <a href="https://design-tokens.github.io/community-group/format/" target="_blank" rel="noreferrer">https://design-tokens.github.io/community-group/format/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 1. nap: Vizuális nyelv > stílus',
    emailBody: `<h1>Playbook 2026 – 1. nap</h1>
<p>Megérted, miért nem elég a stílus, és írsz egy Visual Intent Statementet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a fő különbség a stílus és a vizuális nyelv között?',
          options: [
            'A stílus szabály, a vizuális nyelv ízlés',
            'A stílus szubjektív, a vizuális nyelv szabály-alapú és átadható',
            'Nincs különbség',
            'A vizuális nyelv csak színeket jelent',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért nem skálázódik a stílus?',
          options: [
            'Mert mindig dokumentált',
            'Mert személyfüggő és nem mérhető',
            'Mert túl olcsó',
            'Mert mindig kódolt',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó példa vizuális nyelvi szabályra?',
          options: [
            '„Legyen szép”',
            '„CTA háttere #FAB908, szöveg #111827, padding 12x16, más CTA nem használ sárgát.”',
            '„Több gradient”',
            '„Használjunk modern betűtípust”',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a Visual Intent Statement lényege?',
          options: [
            'Dekoratív mottó',
            'A termék hangja, tonalitása, sűrűsége 1 mondatban',
            'Egy reklámszlogen',
            'Egy árlista',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 2,
    title: 'Ízlésből rendszerbe: hogyan skálázod a döntést',
    content: `<h1>Ízlésből rendszerbe: hogyan skálázod a döntést</h1>
<p><em>Megtanulod, hogyan fordítasz szubjektív döntéseket explicitté: szabály, minta, dokumentáció.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Fel tudsz írni 3 design döntést szabályként.</li>
  <li>Ismered a „Rule → Pattern → Doc” láncot.</li>
  <li>Létrehozol egy Playbook vázat (szekciók) a saját termékedre.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A nem dokumentált döntés újrajátszást okoz.</li>
  <li>A rendszeresség gyorsítja a fejlesztést és csökkenti a hibát.</li>
  <li>Playbook nélkül a design quality szór.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Rule → Pattern → Doc</h3>
<ul>
  <li>Rule: egy mondatos döntés (pl. „CTA csak sárga alapon fekete, 12x16 padding”).</li>
  <li>Pattern: vizuális példa (jó/rossz, állapotok).</li>
  <li>Doc: hol található (Figma könyvtár, Confluence oldal, repo).</li>
</ul>
<h3>Playbook szerkezet v1</h3>
<ul>
  <li>Intent és hang</li>
  <li>Semantika (szín, tipó, forma, mozgás)</li>
  <li>Layout és tér</li>
  <li>Komponensek és tokenek</li>
  <li>Governance (változáskezelés, review)</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Ha jól néz ki, oké.” – nincs lánc.</p>
<p><strong>Jó:</strong> „Primary CTA: szabály + minta + Doc link. Más CTA nem használhat sárgát.”</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 3 Rule-t a saját termékedre (CTA, kártya, űrlap).</li>
  <li>Mindháromhoz készíts Pattern leírást (jó/rossz, állapotok).</li>
  <li>Írd mellé, hova dokumentálod (Doc link vagy mappa).</li>
  <li>Állítsd össze a Playbook vázát a fenti 5 szekcióval.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Dokumentáld 1 Rule-t a tényleges rendszeredben (Figma/Notion), oszd meg 1 fejlesztővel és kérj visszajelzést.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>3 döntés átírva Rule → Pattern → Doc láncba.</li>
  <li>Playbook váz elkészült.</li>
  <li>1 szabályt publikáltál a csapatnak.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Polaris (Shopify) rendszer: <a href="https://polaris.shopify.com" target="_blank" rel="noreferrer">https://polaris.shopify.com</a></li>
  <li>Atlassian Design System: <a href="https://atlassian.design" target="_blank" rel="noreferrer">https://atlassian.design</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 2. nap: Ízlésből rendszer',
    emailBody: `<h1>Playbook 2026 – 2. nap</h1>
<p>Három döntést szabállyá, mintává, dokumentummá alakítasz, és felvázolod a Playbookot.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a Rule → Pattern → Doc lánc lényege?',
          options: [
            'Vélemény → minta → semmi',
            'Szabály → vizuális példa → dokumentáció helye',
            'Csak képek gyűjtése',
            'Marketing szlogenek',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell dokumentálni a szabályt?',
          options: [
            'Hogy szebb legyen',
            'Hogy átadható, ismételhető, mérhető legyen',
            'Hogy titok maradjon',
            'Hogy hosszabb legyen a projekt',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi tartozik a Playbook vázába?',
          options: [
            'Csak logók',
            'Intent, szemantika, layout, komponensek/tokenek, governance',
            'Csak árlista',
            'Csak moodboard',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            '„Ha jól néz ki, oké.”',
            '„Primary CTA: szabály + minta + Doc link.”',
            '„CTA sárga, 12x16 padding, linkelve a Figma komponenshez.”',
            '„A CTA nem használható más célra.”',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 3,
    title: 'A Design Playbook anatómiája',
    content: `<h1>A Design Playbook anatómiája</h1>
<p><em>Felrajzolod a Playbook kötelező részeit, hogy minden döntésnek meglegyen a helye.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Ismered a Playbook 6 fő fejezetét.</li>
  <li>Hozzárendelsz felelősöket és frissítési ritmust.</li>
  <li>Készítesz tartalomjegyzéket saját Playbookodhoz.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A struktúra nélkül a szabályok elvesznek.</li>
  <li>Frissítési ritmus nélkül elavul a rendszer.</li>
  <li>Felelős nélkül nincs tulajdonjog.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>6 fő fejezet</h3>
<ul>
  <li>Intent & Hang (tone, voice, sűrűség)</li>
  <li>Szemantika (szín, tipó, forma, mozgás, feedback)</li>
  <li>Layout & Tér (grid, spacing, density, responsivitás)</li>
  <li>Komponensek & Tokenek (architektúra, állapotok, platformköziség)</li>
  <li>Governance (változáskezelés, review workflow, verziózás)</li>
  <li>Capstone & Példatár (jó/rossz példák, esettanulmányok)</li>
></ul>
<h3>Frissítési ritmus</h3>
<ul>
  <li>Heti/biweekly review a komponensekre.</li>
  <li>Negyedéves audit a szemantikai térképre.</li>
  <li>Release note minden változtatáshoz.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Szabályok szétszórva Slackben és Figma kommentben.</p>
<p><strong>Jó:</strong> Tartalomjegyzék + felelős + frissítési gyakoriság + Doc link.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Hozz létre Playbook tartalomjegyzéket a 6 fejezet alapján.</li>
  <li>Minden fejezethez rendelj felelőst és frissítési ritmust.</li>
  <li>Jelölj ki egy verziózási szabályt (pl. v0.1, v0.2...).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Készíts egy „Release Notes” sablont (változás leírása, dátum, felelős, hatás).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a tartalomjegyzék a 6 fejezettel.</li>
  <li>Felelős és ritmus fejezetenként kijelölve.</li>
  <li>Verziózási séma létezik.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Lightning Design System: <a href="https://www.lightningdesignsystem.com" target="_blank" rel="noreferrer">https://www.lightningdesignsystem.com</a></li>
  <li>Material 3 guidance: <a href="https://m3.material.io" target="_blank" rel="noreferrer">https://m3.material.io</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 3. nap: Playbook anatómiája',
    emailBody: `<h1>Playbook 2026 – 3. nap</h1>
<p>Összerakod a Playbook fő fejezeteit, felelősöket és frissítési ritmust rendelsz hozzájuk.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell frissítési ritmus a Playbookhoz?',
          options: [
            'Dekoráció miatt',
            'Hogy ne avuljon el, legyen tulajdonosa a változásnak',
            'Hogy hosszabb legyen a dokumentum',
            'Hogy ne kelljen használni',
          ],
          correctIndex: 1,
        },
        {
          question: 'Melyik tartozik a 6 fő fejezet közé?',
          options: [
            'Capstone & Példatár',
            'Marketing kampányok',
            'HR kézikönyv',
            'Sales funnel',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a jó példa?',
          options: [
            'Szabályok Slackben szétszórva',
            'Tartalomjegyzék + felelős + ritmus + Doc link',
            'Csak képek Figma boardon',
            'Csak árlista',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit tartalmazzon a Release Notes sablon?',
          options: [
            'Változás leírása, dátum, felelős, hatás',
            'Csak logók',
            'Csak dátum',
            'Csak szerző neve',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
];

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || 'amanoba',
  });

  const brand =
    (await Brand.findOne({ slug: 'amanoba' })) ||
    (await Brand.findOne().sort({ createdAt: 1 }));
  if (!brand) throw new Error('No brand found');

  const course = await Course.findOneAndUpdate(
    { courseId: COURSE_ID },
    {
      courseId: COURSE_ID,
      name: COURSE_NAME,
      description: COURSE_DESCRIPTION,
      language: 'hu',
      durationDays: 30,
      isActive: true,
      requiresPremium: false,
      pointsConfig: {
        completionPoints: 500,
        lessonPoints: 25,
        perfectCourseBonus: 300,
      },
      xpConfig: {
        completionXP: 500,
        lessonXP: 25,
      },
      metadata: {
        category: 'design',
        difficulty: 'intermediate',
        tags: ['design', 'system', 'playbook', 'tokens'],
      },
      brandId: brand._id,
    },
    { upsert: true, new: true }
  );

  for (const entry of lessons) {
    const lessonId = `${COURSE_ID}_DAY_${entry.day}`;
    const lessonDoc = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        lessonId,
        courseId: course._id,
        dayNumber: entry.day,
        language: 'hu',
        title: entry.title,
        content: entry.content,
        emailSubject: entry.emailSubject,
        emailBody: entry.emailBody,
        quizConfig: {
          enabled: true,
          successThreshold: 80,
          questionCount: entry.quiz?.questions.length || 4,
          poolSize: entry.quiz?.questions.length || 4,
          required: true,
        },
        pointsReward: 25,
        xpReward: 25,
        isActive: true,
        displayOrder: entry.day,
      },
      { upsert: true, new: true }
    );

    if (entry.quiz) {
      await QuizQuestion.deleteMany({ lessonId });
      await QuizQuestion.insertMany(
        entry.quiz.questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific',
          lessonId,
          courseId: course._id,
          isCourseSpecific: true,
          showCount: 0,
          correctCount: 0,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }))
      );
    }
  }

  await mongoose.disconnect();
  // eslint-disable-next-line no-console
  console.log('Seeded The Playbook 2026 (HU) with first 3 lessons.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
