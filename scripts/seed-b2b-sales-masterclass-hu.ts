/**
 * Seed B2B Értékesítés 2026 Masterclass (Hungarian, first 3 lessons)
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

const COURSE_ID = 'B2B_SALES_2026_30';
const COURSE_NAME = 'B2B Értékesítés 2026 Masterclass';
const COURSE_DESCRIPTION =
  '30 napos, rendszerszintű B2B sales tréning: ICP-től a qualificationen, discovery-n és pipeline tervezésen át a pricing és closing lépésekig. Napi 20-30 perc, AI-támogatással és mérhető deliverable-ökkel.';

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
    title: 'Mi a modern B2B értékesítés 2026-ban',
    content: `<h1>Mi a modern B2B értékesítés 2026-ban</h1>
<p><em>Megérted, hogy a sales feladata nem a pitch, hanem a döntés támogatása és a kockázatcsökkentés.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>1 mondatban le tudod írni a modern B2B sales célját.</li>
  <li>Felismered 3 tipikus tévedést és a helyes csereelvet.</li>
  <li>Készítesz egy mini mérőlapot a heti követéshez.</li>
  <li>Létrehozod a „Sales Reality Card” jegyzeted v1-jét.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Ha rossz modellben gondolkodsz, rossz aktivitást fogsz mérni és rossz következtetést vonsz le.</li>
  <li>A vevő a gyorsabb, biztonságosabb döntést keresi – nem a terméklistát.</li>
  <li>A skálázhatóság alapja a kutatás, dokumentálás és következő lépés fegyelme.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>A) Mi változott 2026-ra?</h3>
<ul>
  <li>Többszereplős döntések (gazda, szakmai értékelő, pénzügy, jog, IT/security).</li>
  <li>A sales feladata: döntéstámogatás, kockázat csökkentése, következő lépés vezetése.</li>
</ul>
<h3>B) Rendszer vs. taktika</h3>
<ul>
  <li><strong>Rendszer</strong>: definíciók, minimum adatmezők, előre rögzített lépések, heti mérés.</li>
  <li><strong>Taktika</strong>: egy-két ügyes mondat vagy trükk – deal-t nyerhet, rendszert nem épít.</li>
</ul>
<h3>C) 3 tipikus tévedés és csereelv</h3>
<ol>
  <li><strong>Több aktivitás = több eredmény.</strong><br/>Csere: jobb target lista + gyors qualification.</li>
  <li><strong>Pitch-elni kell.</strong><br/>Csere: discovery + döntési kockázat kezelése.</li>
  <li><strong>CRM adminisztráció.</strong><br/>Csere: CRM a valóság térképe; nélküle nincs konverzió- és cycle-time kép.</li>
</ol>
<h3>D) Mentális modell</h3>
<ul>
  <li>Jó account kiválasztása.</li>
  <li>Gyors „igen vagy nem” minősítés.</li>
  <li>Discovery után egyetlen következő lépés rögzítése.</li>
  <li>Pipeline valós állapotának fenntartása.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz (taktika):</strong> „Szia, segítünk növelni a bevételedet, beszéljünk 15 percet.”<br/>Miért rossz: nincs ICP jel, nincs konkrét probléma, nincs döntéshez kötött next step.</p>
<p><strong>Jó (rendszer):</strong> „A legtöbb <em>[iparág]</em> csapatnál 2 helyen áll meg a pipeline: rossz minősítés és bizonytalan next step. Ha 15 percben megnézzük a stage definíciókat és a top 3 lost okot, meg tudom mondani, hol folyik el a legtöbb idő. Jó a jövő héten kedden 10:00?”</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Nyiss egy „Sales Reality Card” jegyzetet.</li>
  <li>Írd le 1 mondatban: „A B2B sales célja az, hogy …”.</li>
  <li>Írd le a 3 tévedést és a 3 csereelvet a saját szavaiddal.</li>
  <li>Készíts mini mérőlapot: SQL, discovery, pipeline value, win rate (heti).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Válassz 1 lezárt deal-t (won/lost), és írd le: mi volt a döntési kockázat, hol állt meg, mi lett volna a tisztább next step.</p>
<hr />
<h2>Önellenőrzés (igen/nem)</h2>
<ul>
  <li>1 mondatban le tudom írni a modern B2B sales célját.</li>
  <li>Meg tudok nevezni 3 tévedést és mindegyikhez csereelvet.</li>
  <li>Van heti mini mérőlapom.</li>
  <li>Leírtam 1 múltbeli deal tanulságát.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>MEDDPICC módszertan: <a href="https://meddicc.com/meddpicc-sales-methodology-and-process" target="_blank" rel="noreferrer">https://meddicc.com/meddpicc-sales-methodology-and-process</a></li>
  <li>Gartner B2B buying: <a href="https://www.gartner.com/en/insights/sales" target="_blank" rel="noreferrer">https://www.gartner.com/en/insights/sales</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 1. nap: Modern sales célja',
    emailBody: `<h1>B2B Értékesítés 2026 – 1. nap</h1>
<p>Megérted, hogy a sales feladata döntést támogatni és kockázatot csökkenteni. Készítsd el a Sales Reality Cardodat.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a modern B2B sales elsődleges célja a kurzus szerint?',
          options: [
            'Minél több hívás és pitch',
            'Döntéstámogatás és kockázatcsökkentés, tiszta következő lépéssel',
            'Csak az ár lealkudása',
            'CRM kitöltése adminból',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi különbözteti meg a rendszert a taktikától?',
          options: [
            'A rendszer 1 jó mondat, a taktika 1 pipeline',
            'A rendszer definíciók, lépések és mérés, a taktika rövid trükk',
            'Nincs különbség',
            'A taktika mindig jobb',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a „több aktivitás = több eredmény” tévedés fő gondja?',
          options: [
            'ICP és qualification nélkül a több aktivitás csak zajt termel',
            'Mindig növeli a win rate-et',
            'Csökkenti a cycle time-ot automatikusan',
            'Jobb, mint a target lista építés',
          ],
          correctIndex: 0,
        },
        {
          question: 'Miért nem elég a pitch?',
          options: [
            'Mert a vevő döntést és kockázatcsökkentést akar, nem termékleírást',
            'Mert a pitch mindig hosszú',
            'Mert a pitch csak marketing',
            'Mert a pitch nem említi az árat',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 2,
    title: 'A B2B sales rendszer térképe',
    content: `<h1>A B2B sales rendszer térképe</h1>
<p><em>Felrajzolod a teljes folyamatot sourcingtól a close-ig, és közös nyelvet adsz a csapatnak.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Felrajzolod a folyamatot: sourcing → qualification → discovery → proposal → negotiation → close → expansion.</li>
  <li>Megnevezed a stage-ek belépési/kilépési feltételeit.</li>
  <li>Készítesz egy 1 oldalas „Sales System Map”-et.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A közös nyelv csökkenti a félreértést (mi a lead, mi az SQL, mi a qualified discovery).</li>
  <li>Stage definíció nélkül a pipeline vélemény alapú.</li>
  <li>A rendszer minden későbbi mérés és automatizálás alapja.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Fő blokkok</h3>
<ul>
  <li><strong>Sourcing</strong>: listák, inbound, partner, event.</li>
  <li><strong>Qualification</strong>: gyors „igen/nem”, MEDDPICC-szerű kérdések.</li>
  <li><strong>Discovery</strong>: probléma, hatás, döntési folyamat, kockázat.</li>
  <li><strong>Proposal/Negotiation</strong>: dönthető ajánlat, árazási keret, kifogáskezelés.</li>
  <li><strong>Close/Expansion</strong>: döntés, onboarding, cross/upsell.</li>
</ul>
<h3>Definíciók</h3>
<ul>
  <li><strong>Lead</strong>: beérkező vagy listára került kontakt, minimális adatmezőkkel.</li>
  <li><strong>SQL</strong>: megfelel ICP-nek + van releváns probléma + döntéshozó/kapuőr elérhető.</li>
  <li><strong>Qualified discovery</strong>: van üzleti fájdalom, költség/hatás, következő lépés rögzítve.</li>
</ul>
<h3>Mérés</h3>
<ul>
  <li>Stage konverzió és cycle time stagenként.</li>
  <li>Win rate, pipeline coverage, lost ok kódolva.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Lead → Call → Proposal → Close” – nincs definíció, nincs kilépési feltétel.</p>
<p><strong>Jó:</strong> „Lead (min. adat) → SQL (ICP + probléma + döntéshozó) → Discovery (fájdalom, hatás, next step) → Proposal (scope, ár, kockázat) → Negotiation (kifogáskezelés, procurement lista) → Close/Expansion.”</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Rajzold fel a 7 blokkot (sourcing → expansion).</li>
  <li>Minden blokkhoz írj 2-3 belépési és kilépési feltételt.</li>
  <li>Készíts 1 oldalas „Sales System Map”-et (szöveg + bullet).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Válassz egy futó opportunity-t, és jelöld, melyik stagen ragadt meg és mi hiányzik a továbblépéshez.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a 7 blokk.</li>
  <li>Minden blokkhoz van belépési/kilépési feltétel.</li>
  <li>Elkészült a Sales System Map (1 oldal).</li>
  <li>Egy élő dealen beazonosítottad a hiányzó feltételt.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>HubSpot lifecycle vs pipeline: <a href="https://knowledge.hubspot.com/crm-setup/set-up-lifecycle-stages" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/crm-setup/set-up-lifecycle-stages</a></li>
  <li>Pipedrive pipeline alapok: <a href="https://support.pipedrive.com/en/article/how-to-set-up-pipelines" target="_blank" rel="noreferrer">https://support.pipedrive.com/en/article/how-to-set-up-pipelines</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 2. nap: Sales rendszer térképe',
    emailBody: `<h1>B2B Értékesítés 2026 – 2. nap</h1>
<p>Felrajzolod a teljes sales folyamatot és a stage definíciókat. Készítsd el a Sales System Map-et.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a Sales System Map elsődleges célja?',
          options: [
            'Dekoráció a csapatfalra',
            'Közös nyelv és definíció a folyamat minden lépésére',
            'Csak a KPI-k listázása',
            'CRM nélküli működés',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi az SQL definíció egyik kulcseleme?',
          options: [
            'Csak az, hogy van email cím',
            'Megfelel az ICP-nek és van releváns probléma',
            'Van LinkedIn profil',
            'Van backlog task',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért veszélyes a „Lead → Call → Proposal → Close” négyes önmagában?',
          options: [
            'Mert túl hosszú',
            'Mert nincs belépési/kilépési definíció, ezért véleményalapú a pipeline',
            'Mert túl sok mérés van benne',
            'Mert nincs benne marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit kell mérni stagenként?',
          options: [
            'Csak a win rate-et',
            'Stage konverziót és cycle time-ot',
            'Csak a call számot',
            'Csak a bevételt',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 3,
    title: 'ICP 2026: probléma, nem iparág',
    content: `<h1>ICP 2026: probléma, nem iparág</h1>
<p><em>Az ideális ügyfelet problématér alapján definiálod, nem csak iparág vagy cégméret szerint.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Készítesz egy ICP v1-et probléma-alapon (nem csak iparág/cégméret).</li>
  <li>Azonosítasz 3-5 „rossz illeszkedés” jelet.</li>
  <li>Írsz egy rövid, tesztelhető ICP definíciót.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Rossz ICP mellett a több aktivitás csak több rossz beszélgetés.</li>
  <li>Probléma-alapú ICP jobban kapcsolható fájdalomhoz és döntéshez.</li>
  <li>Gyorsabb qualification: tudod, mikor mondj nemet.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Probléma-alapú ICP elemei</h3>
<ul>
  <li>Fájdalom: milyen konkrét működési vagy bevételi probléma.</li>
  <li>Trigger: mi váltja ki a keresést (pl. növekedési cél, churn, új piac).</li>
  <li>Érettség: milyen eszközök/folyamatok vannak már.</li>
  <li>Stakes: mi a kockázat, ha nem oldják meg.</li>
</ul>
<h3>Rossz illeszkedés jelei</h3>
<ul>
  <li>Nincs fájdalom tulajdonos.</li>
  <li>Nincs költségkeret vagy döntéshozó.</li>
  <li>„Kíváncsiság” motiváció, nincs konkrét trigger.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz ICP (iparág-alapú):</strong> „Középvállalati SaaS cégek.”</p>
<p><strong>Jó ICP (probléma-alapú):</strong> „15-80 fős B2B SaaS csapat, 15-30% churn-nel, GTM csapat 3-6 fő, 90 napos sales cycle felett, keresik a kvalifikált pipeline növelését.”</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Készíts ICP v1-et a 4 elemre támaszkodva (fájdalom, trigger, érettség, stakes).</li>
  <li>Írj 5 ICP tesztkérdést qualification-höz (pl. „Mi váltotta ki a projektet?”, „Ki viszi a fájdalmat?”).</li>
  <li>Jelöld 3-5 „rossz illeszkedés” jelet.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Fogj egy futó leadet, és értékeld a tesztkérdések alapján: passzolsz-e? Ha nem, írd le, hogyan mondasz gyors nemet.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan az ICP v1 probléma-alapon.</li>
  <li>Megvannak a qualification tesztkérdések.</li>
  <li>Megvannak a rossz illeszkedés jelei.</li>
  <li>Egy leadre alkalmaztad a szűrőt.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Gartner ICP guide: <a href="https://www.gartner.com/en/insights/sales" target="_blank" rel="noreferrer">https://www.gartner.com/en/insights/sales</a></li>
  <li>OpenView ICP példa: <a href="https://openviewpartners.com/blog/ideal-customer-profile" target="_blank" rel="noreferrer">https://openviewpartners.com/blog/ideal-customer-profile</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 3. nap: ICP 2026',
    emailBody: `<h1>B2B Értékesítés 2026 – 3. nap</h1>
<p>Probléma-alapú ICP-t írsz, jelölöd a rossz illeszkedés jeleit, és tesztkérdéseket készítesz qualificationhöz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért veszélyes az iparág-alapú ICP önmagában?',
          options: [
            'Mert túl hosszú',
            'Mert nem kötődik konkrét problémához, így rossz fókuszú lesz az outreach',
            'Mert túl drága',
            'Mert nincs benne marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Melyik elem <em>nem</em része a probléma-alapú ICP-nek?',
          options: [
            'Fájdalom/probléma',
            'Trigger',
            'Érettség',
            'LinkedIn posztok száma',
          ],
          correctIndex: 3,
        },
        {
          question: 'Mi a „rossz illeszkedés” egyik jele?',
          options: [
            'Van fájdalom tulajdonos',
            'Nincs döntéshozó vagy költségkeret',
            'Van GTM csapat',
            'Van trigger esemény',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a legfontosabb kimenet a mai nap végére?',
          options: [
            'Egy iparáglista',
            'Egy probléma-alapú ICP definíció és 5 tesztkérdés',
            'Egy pitch deck',
            'Egy marketing kampányterv',
          ],
          correctIndex: 1,
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
        category: 'B2B Sales',
        difficulty: 'intermediate',
        tags: ['b2b', 'sales', 'pipeline', 'ai'],
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
  console.log('Seeded B2B Értékesítés 2026 Masterclass (HU) with first 3 lessons.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
