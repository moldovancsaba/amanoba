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
          question: 'Melyik elem nem része a probléma-alapú ICP-nek?',
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
  {
    day: 4,
    title: 'Buyer persona és döntési egység',
    content: `<h1>Buyer persona és döntési egység</h1>
<p><em>Feltérképezed, ki a felhasználó, ki fizet, ki blokkol, és ki dönt – hogy ne egy emberhez beszélj.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Azonosítod a döntési egység szerepeit (felhasználó, gazda, pénzügy, beszerzés, jog/IT).</li>
  <li>Készítesz 1 döntési egység térképet egy ICP-re.</li>
  <li>Összeírsz 5 kockázatot (ki blokkolhat és mivel).</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A döntés ritkán egy emberé – ha csak a „championra” fókuszálsz, megakadsz.</li>
  <li>A blokkolók előre azonosítva gyorsítják a tárgyalást.</li>
  <li>A persona tisztázása segít a releváns üzenetben és a következő lépésben.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Szerepek</h3>
<ul>
  <li><strong>Felhasználó</strong>: napi használó, fájdalomtulajdonos.</li>
  <li><strong>Gazda/champion</strong>: üzleti szponzor, belső vezető.</li>
  <li><strong>Pénzügy/beszerzés</strong>: költség, szerződés, ROI.</li>
  <li><strong>Jog/IT/security</strong>: compliance, adat, hozzáférés.</li>
</ul>
<h3>Blokkolók és jelzések</h3>
<ul>
  <li>Nincs fájdalomtulajdonos → „kíváncsiság” projekt.</li>
  <li>Security/IT nem bevont → késői stop.</li>
  <li>Jog nem lát DPA/SLA mintát → slip.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Csak a felhasználóval beszélsz, nem tudod, ki ír alá, security nincs bevonva.</p>
<p><strong>Jó:</strong> Champion + felhasználó + IT/security + pénzügy listázva, mindegyiknek 1-1 kockázat/jegyzék.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Válassz egy ICP-t, rajzold fel a döntési egységet (szerep + név ha van).</li>
  <li>Minden szerephez írj 1-2 fő kockázatot és információigényt.</li>
  <li>Írj 3 kérdést, amivel kideríted, ki dönt és ki blokkolhat.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Egy aktív dealen egészítsd ki a térképet: melyik szerep hiányzik, hogyan vonod be?</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a döntési egység térkép.</li>
  <li>Minden szerephez van kockázatlista.</li>
  <li>Van 3 feltáró kérdésed a szereplők azonosítására.</li>
  <li>Alkalmaztad egy élő dealre.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Gartner Buying Committee: <a href="https://www.gartner.com/en/insights/sales" target="_blank" rel="noreferrer">https://www.gartner.com/en/insights/sales</a></li>
  <li>Challenger Customer összefoglaló: <a href="https://www.challengerinc.com/resources/" target="_blank" rel="noreferrer">https://www.challengerinc.com/resources/</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 4. nap: Döntési egység',
    emailBody: `<h1>B2B Értékesítés 2026 – 4. nap</h1>
<p>Feltérképezed a döntési egységet: ki használ, ki dönt, ki blokkol. Írj kockázatlistát és feltáró kérdéseket.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért veszélyes csak a championra támaszkodni?',
          options: [
            'Mert túl sok időt vesz igénybe',
            'Mert a döntés több szereplős, a blokkolók későn derülnek ki',
            'Mert a champion mindig nemet mond',
            'Mert így nem kell CRM',
          ],
          correctIndex: 1,
        },
        {
          question: 'Melyik szerep jellemzően a költség/ROI fókuszú?',
          options: [
            'Felhasználó',
            'Pénzügy/beszerzés',
            'Jog',
            'IT/security',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a blokkolók korai azonosításának előnye?',
          options: [
            'Kevesebb meeting',
            'Gyorsabb tárgyalás és kisebb slip kockázat',
            'Nagyobb ár',
            'Kevesebb dokumentum',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi hiányzik egy „rossz” megközelítésből?',
          options: [
            'Pitch deck',
            'Döntési egység térkép és szerepek',
            'Email sablon',
            'Marketing lista',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 5,
    title: 'Value proposition: mérhető, ellenőrizhető állítások',
    content: `<h1>Value proposition: mérhető, ellenőrizhető állítások</h1>
<p><em>A „szép állítás” helyett 3 mondatos value és 5 proof pont, amit a vevő ellenőrizni tud.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Megírsz egy 3 mondatos value statementet.</li>
  <li>Összeírsz 5 proof pontot (mérhető/ellenőrizhető).</li>
  <li>Összekötöd az ICP fájdalommal.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A vevő döntést hoz: bizonyítékot és relevanciát keres.</li>
  <li>A mérhető állítás csökkenti a kockázatot és gyorsítja a discoveryt.</li>
  <li>Proof nélkül a value csak marketing szöveg.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>3 mondatos value</h3>
<ol>
  <li>Kinek (ICP + szerep).</li>
  <li>Milyen problémára/fájdalomra.</li>
  <li>Milyen eredménnyel/mit kockáztat, ha nem lép.</li>
</ol>
<h3>Proof pontok</h3>
<ul>
  <li>Számok: % javulás, időmegtakarítás, bevételhatás.</li>
  <li>Példák: esettanulmány, benchmark.</li>
  <li>Forrás: link/anyag, amit a vevő ellenőrizhet.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Segítünk növekedni AI-val.” – nincs ICP, nincs probléma, nincs proof.</p>
<p><strong>Jó:</strong> „15-80 fős B2B SaaS csapatoknak, ahol a churn 15-30%, 90+ napos cycle mellett: 12 hét alatt a qualified pipeline +25%-át célozzuk, benchmark szerint 2-3x gyorsabb qualification. Proof: esettanulmány, mérőlap, referencia.”</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írd meg a 3 mondatos value statementet (kinek, milyen fájdalom, milyen eredmény/kockázat).</li>
  <li>Írj 5 proof pontot (szám/benchmark/link).</li>
  <li>Kösd az ICP fájdalomhoz: minden proof melyik fájdalomra reagál?</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Revízd az utolsó 3 outbound üzenetedet: illeszd be a value + 1 proof pontot.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a 3 mondatos value.</li>
  <li>Megvan 5 proof pont.</li>
  <li>Minden proof kötve van egy ICP fájdalomhoz.</li>
  <li>Legalább 1 outbound üzenetben alkalmaztad.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Value prop design (Strategyzer): <a href="https://www.strategyzer.com/books/value-proposition-design" target="_blank" rel="noreferrer">https://www.strategyzer.com/books/value-proposition-design</a></li>
  <li>Social proof és referencia: <a href="https://www.apollo.io/blog/social-proof-for-sales" target="_blank" rel="noreferrer">https://www.apollo.io/blog/social-proof-for-sales</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 5. nap: Value + proof',
    emailBody: `<h1>B2B Értékesítés 2026 – 5. nap</h1>
<p>3 mondatos value statementet és 5 proof pontot írsz, mindet ICP fájdalomhoz kötve.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kevés a „Segítünk növekedni AI-val” állítás?',
          options: [
            'Mert túl hosszú',
            'Mert nincs ICP, probléma és proof',
            'Mert túl drága',
            'Mert nem említ CRM-et',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a 3 mondatos value egyik kötelező eleme?',
          options: [
            'Egy marketing szlogen',
            'ICP + probléma + eredmény/kockázat',
            'Csak a termék feature lista',
            'Egy árkedvezmény',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a proof pont lényege?',
          options: [
            'Hogy hosszú legyen',
            'Hogy a vevő ellenőrizhesse (szám/forrás/benchmark)',
            'Hogy marketingnek tűnjön',
            'Hogy elkerüljük az ICP-t',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit kell tenned a proof pontokkal?',
          options: [
            'Önálló listába tenni ICP nélkül',
            'Összekötni őket az ICP fájdalmakkal',
            'Csak a honlapra kitenni',
            'Csak a sales deckben használni',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 6,
    title: 'Ideális sales folyamat és heti metrikák',
    content: `<h1>Ideális sales folyamat és heti metrikák</h1>
<p><em>Definiálod a lead/SQL/qualified discovery fogalmakat, és felállítod a heti mérőlapot.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Definiálod: mi a lead, mi az SQL, mi a qualified discovery.</li>
  <li>Összeállítasz egy heti mérőlapot (stage konverzió, cycle time, win rate, pipeline coverage).</li>
  <li>Kijelölsz 3 fejlesztendő metrikát.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Mérés nélkül a pipeline vélemény marad.</li>
  <li>Heti ritmus = gyors visszajelzés a fókuszra és a minőségre.</li>
  <li>Azonosítod a szűk keresztmetszetet (stage vagy minőség).</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Definíciók</h3>
<ul>
  <li><strong>Lead</strong>: minimális adat + releváns kontextus.</li>
  <li><strong>SQL</strong>: ICP + probléma + döntéshozó elérhető + trigger.</li>
  <li><strong>Qualified discovery</strong>: fájdalom, hatás, döntési folyamat, next step rögzítve.</li>
</ul>
<h3>Mérés</h3>
<ul>
  <li>Stage konverzió: Lead→SQL, SQL→Discovery, Discovery→Proposal, Proposal→Close.</li>
  <li>Cycle time stagenként.</li>
  <li>Win rate, pipeline coverage (3-4x).</li>
  <li>Lost okok kódolva (top 5).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> csak a call számot méred; nem tudod, hol esik szét a pipeline.</p>
<p><strong>Jó:</strong> heti dashboard: stage konverziók, cycle idők, win rate, lost okok; 1 szűk keresztmetszet kijelölve.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írd le a 3 definíciót (lead, SQL, qualified discovery) a csapat nyelvén.</li>
  <li>Készíts heti mérőlapot: stage konverziók, cycle idők, win rate, pipeline coverage, lost ok top 5.</li>
  <li>Jelöld ki a legnagyobb szűk keresztmetszetet.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Válassz egy metrikát, és írj akciót a javítására (pl. SQL definíció szigorítás, discovery kérdések bővítése).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van definíció a lead/SQL/discovery fogalmakra.</li>
  <li>Megvan a heti mérőlap.</li>
  <li>Azonosítottad a szűk keresztmetszetet.</li>
  <li>Készült akció a javításra.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Stage alapú riport minta (HubSpot): <a href="https://knowledge.hubspot.com/reporting/create-reports" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/reporting/create-reports</a></li>
  <li>Win rate és coverage: <a href="https://pipedrive.readme.io/docs/deals-reporting" target="_blank" rel="noreferrer">https://pipedrive.readme.io/docs/deals-reporting</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 6. nap: Metrikák',
    emailBody: `<h1>B2B Értékesítés 2026 – 6. nap</h1>
<p>Definiálod a lead/SQL/discovery fogalmakat, felállítod a heti mérőlapot, és kijelölöd a szűk keresztmetszetet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a qualified discovery egyik kötelező eleme?',
          options: [
            'Egy demó videó',
            'Fájdalom, hatás és next step rögzítve',
            'Egy árlista',
            'Egy LinkedIn poszt',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit jelent a pipeline coverage 3-4x szabály?',
          options: [
            'Háromszor-négyszer annyi meeting',
            'A célbevétel 3-4x-ének megfelelő pipeline érték',
            'Háromszor-négyszer annyi email',
            'Háromszor-négyszer annyi demo',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell a lost okokat kódolni?',
          options: [
            'Dekorra',
            'Hogy javítható trendeket láss (top 5 ok)',
            'Mert kötelező jogilag',
            'Hogy több emailt küldj',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a mai legfontosabb kimenet?',
          options: [
            'Egy marketing kampány',
            'Heti mérőlap + definíciók + kijelölt szűk keresztmetszet',
            'Egy új landing page',
            'Egy új CRM',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 7,
    title: 'Lead forrás térkép 2026',
    content: `<h1>Lead forrás térkép 2026</h1>
<p><em>3 fókuszcsatornát választasz (outbound, inbound, partner/event/community), hogy mérhető kísérletet építs.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Kiválasztasz 3 elsődleges csatornát az ICP-hez illesztve.</li>
  <li>Készítesz egy „channel brief”-et: erőforrás, mérés, 2 hetes kísérlet.</li>
  <li>Definiálsz egy minimális pipeline célt csatornánként.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Szétszórt csatornázás = zaj + elfolyó idő.</li>
  <li>Fókusz + kísérlet = gyors tanulás, gyors cutoff a rossz csatornákra.</li>
  <li>ICP-alapú csatornaválasztás növeli a válaszarányt.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Fő csatornák</h3>
<ul>
  <li><strong>Outbound</strong>: lista + üzenet + követés.</li>
  <li><strong>Inbound</strong>: tartalom, lead magnet, SEO/SEM.</li>
  <li><strong>Partner/event/community</strong>: közös webinár, meetup, szakmai csoport.</li>
</ul>
<h3>Channel brief</h3>
<ul>
  <li>ICP illeszkedés, erőforrás (idő/pénz), ütemezés.</li>
  <li>Metrika: válasz, meeting, SQL konverzió.</li>
  <li>Cutoff szabály: mikor állítod le.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> 6 csatorna párhuzamosan, nincs metrika, nincs cutoff.</p>
<p><strong>Jó:</strong> 3 csatorna, mindhez 2 hetes teszt, cél: 15 válasz/5 meeting/2 SQL.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj channel briefet 3 csatornára (outbound, inbound, partner/event/community).</li>
  <li>Állíts be célt: válasz, meeting, SQL csatornánként 2 hétre.</li>
  <li>Határozd meg a cutoff szabályt (mikor állítasz le vagy módosítasz).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Válassz egy csatornát, írj 3 konkrét teendőt a következő 48 órára.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a 3 csatorna.</li>
  <li>Channel brief + cél + cutoff kész.</li>
  <li>Van 3 azonnali teendőd egy csatornára.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Outbound best practices: <a href="https://www.apollo.io/blog/outbound-sales" target="_blank" rel="noreferrer">https://www.apollo.io/blog/outbound-sales</a></li>
  <li>Community-led growth: <a href="https://www.gainsight.com/guides/community-led-growth" target="_blank" rel="noreferrer">https://www.gainsight.com/guides/community-led-growth</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 7. nap: Lead forrás térkép',
    emailBody: `<h1>B2B Értékesítés 2026 – 7. nap</h1>
<p>Válassz 3 fókuszcsatornát, készíts channel briefet, és állíts célokat.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell limitálni a csatornák számát?',
          options: [
            'Kevesebb emailt kell írni',
            'Fókusz és mérhető kísérlet nélkül szétesik a tanulás',
            'Mert jogi okokból kötelező',
            'Mert így nincs szükség ICP-re',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi legyen egy channel briefben?',
          options: [
            'Csak egy szlogen',
            'ICP illeszkedés, erőforrás, metrika, cutoff',
            'Csak a költségkeret',
            'Csak a pitch deck',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó 2 hetes kísérleti metrika példa?',
          options: [
            'Weboldal látogatók száma',
            'Válasz, meeting, SQL konverzió csatornánként',
            'Facebook lájkok száma',
            'LinkedIn követők',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mikor állítasz le egy csatornát?',
          options: [
            'Soha',
            'Ha a cutoff szabály szerint nem hoz elég meeting/SQL',
            'Ha elfogy a pitch deck',
            'Ha nincs új marketing kampány',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 8,
    title: 'LinkedIn és Sales Navigator alap folyamat',
    content: `<h1>LinkedIn és Sales Navigator alap folyamat</h1>
<p><em>Megtanulod a keresés, mentés, listaépítés és mentés ritmusát, hogy ne ad hoc vadássz.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Összeállítasz egy target company és target persona listát.</li>
  <li>Készítesz egy mentett keresést (NAV) vagy sima LinkedIn keresést mentve.</li>
  <li>Beállítod a heti ritmust (frissítés, review).</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Ad hoc keresés = inkoherens lista, gyenge válaszarány.</li>
  <li>Mentett keresés + lista → ismételhető, skálázható sourcing.</li>
  <li>ICP-hez illesztett szűrés csökkenti a rossz leadeket.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Keresési logika</h3>
<ul>
  <li>Ipar/size + kulcsszó (fájdalom/környezet) + geó.</li>
  <li>Persona: szerep, szenioritás, funkció.</li>
</ul>
<h3>Mentés és ritmus</h3>
<ul>
  <li>Mentett keresés heti review.</li>
  <li>Új kontaktok: napi/ heti limit (pl. 15-20).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> ICP alapján szűrt company lista + persona lista, heti frissítéssel.</p>
<p><strong>Rossz:</strong> Kulcsszó nélküli böngészés, 200 kontakt mentése terv nélkül.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Állíts be 1-2 mentett keresést (company + persona) az ICP alapján.</li>
  <li>Exportáld/mentsd 20 céget és 20 kontaktot (NAV vagy manuálisan).</li>
  <li>Írj heti ritmust: hány új kontakt, mikor frissítesz listát.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Válassz 5 céget a listából, írd mellé, miért ICP-fit (fájdalom/trigger).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van mentett keresésed.</li>
  <li>Megvan a 20 company + 20 persona lista v1.</li>
  <li>Megvan a heti ritmus.</li>
  <li>5 cégnél beírtad, miért fit.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Sales Navigator tippek: <a href="https://www.linkedin.com/help/sales-navigator" target="_blank" rel="noreferrer">https://www.linkedin.com/help/sales-navigator</a></li>
  <li>ICP-alapú keresési operátorok: <a href="https://www.linkedin.com/help/linkedin/answer/a507663" target="_blank" rel="noreferrer">https://www.linkedin.com/help/linkedin/answer/a507663</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 8. nap: LinkedIn/NAV folyamat',
    emailBody: `<h1>B2B Értékesítés 2026 – 8. nap</h1>
<p>Mentett keresésekkel építesz target company/persona listát és heti ritmust.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a mentett keresés fő előnye?',
          options: [
            'Dekoráció',
            'Ismételhető, ICP-alapú lista frissítéssel',
            'Kevesebb üzenet',
            'Nincs szükség ICP-re',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi legyen a heti ritmus része?',
          options: [
            'Random mennyiségű új kontakt',
            'Új kontakt limit + frissítés időpontja',
            'Csak pitch deck frissítés',
            'Csak marketing kampány',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért rossz a kulcsszó nélküli böngészés?',
          options: [
            'Mert lassú',
            'Mert ICP-fit nélküli lista lesz, gyenge válaszaránnyal',
            'Mert drága',
            'Mert nem lehet exportálni',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért jelölsz ICP-fit okot 5 cégnél?',
          options: [
            'Dekoráció',
            'Hogy validáld a lista minőségét és megtaláld a fájdalom/trigger jelet',
            'Hogy több emailt küldj',
            'Hogy elkerüld a ritmust',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 9,
    title: 'Enrichment és adatellenőrzés',
    content: `<h1>Enrichment és adatellenőrzés</h1>
<p><em>Minimum adatkészletet határozol meg, és kiszűröd a zajt, hogy pontosabb legyen a személyre szabás.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Összeállítasz egy minimális adatmező listát (leadhez és accounthoz).</li>
  <li>Készítesz egy enrichment/QA checklistet.</li>
  <li>Auditálsz 15 leadet, és javítod a hibákat.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Zajos adat = rossz personalization, rossz konverzió.</li>
  <li>Enrichment nélkül nincs kontextus a kockázathoz/triggerhez.</li>
  <li>QA nélkül a lista gyorsan használhatatlanná válik.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Minimum mezők</h3>
<ul>
  <li>Account: iparág/probléma trigger, méret, ország, technológia.</li>
  <li>Lead: szerep, szenioritás, email/LinkedIn, releváns jel (poszt/projekt).</li>
</ul>
<h3>QA checklist</h3>
<ul>
  <li>Duplikáció, hiányzó kulcsmező, hibás domain.</li>
  <li>Releváns jel van-e (trigger).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> Account + lead mezők kitöltve, releváns trigger, nincs duplikátum.</p>
<p><strong>Rossz:</strong> Csak email cím, nincs szerep, nincs trigger, duplikált kontakt.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj minimum mező listát (account + lead).</li>
  <li>Készíts QA checklistet (duplikáció, domain, trigger).</li>
  <li>Végezzen 15 ledes auditot, javítsd a hibákat.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Írj 3 szabályt: mit nem küldesz ki (pl. nincs szerep, nincs trigger, bouncy domain).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a minimum mező lista.</li>
  <li>Megvan a QA checklist.</li>
  <li>15 lead auditálva és javítva.</li>
  <li>3 kizárási szabály leírva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Data quality guide: <a href="https://www.hubspot.com/data-quality" target="_blank" rel="noreferrer">https://www.hubspot.com/data-quality</a></li>
  <li>Enrichment eszköz példa: <a href="https://clearbit.com" target="_blank" rel="noreferrer">https://clearbit.com</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 9. nap: Enrichment',
    emailBody: `<h1>B2B Értékesítés 2026 – 9. nap</h1>
<p>Minimum adatmezőket határozol meg, QA checklistet készítesz, 15 leadet auditálsz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kritikus a minimum adatmező lista?',
          options: [
            'Dekoráció',
            'Personalization és relevancia alapja; nélküle zajos az outreach',
            'Jogilag kötelező',
            'Kevesebb email kell',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi tartozik a QA checklistbe?',
          options: [
            'Csak a pitch deck',
            'Duplikáció, hibás domain, hiányzó szerep/trigger',
            'Csak a weboldal látogatók',
            'Csak a marketing kampányok',
          ],
          correctIndex: 1,
        },
        {
          question: 'Melyik a rossz példa?',
          options: [
            'Account + lead mezők kitöltve, releváns trigger',
            'Csak email, nincs szerep, nincs trigger, duplikált kontakt',
            'Van trigger jel',
            'Van szenioritás mező',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi legyen egy kizárási szabály?',
          options: [
            'Ha nincs szerep vagy trigger, nem küldök ki üzenetet',
            'Ha túl sok adat van',
            'Ha van LinkedIn profil',
            'Ha van ICP illeszkedés',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 10,
    title: 'AI-alapú kutatás: cég, szerep, trigger',
    content: `<h1>AI-alapú kutatás: cég, szerep, trigger</h1>
<p><em>Felépítesz egy kutatási prompt csomagot és egy rövid „account brief” sablont, hogy minden outreach előtt legyen 3 tény + 1 releváns trigger.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Létrehozol egy AI prompt csomagot (cég, persona, trigger).</li>
  <li>Készítesz egy 1 oldalas account brief sablont.</li>
  <li>Kitöltesz 2 account briefet a target listádról.</li>
< /ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>AI gyorsítja a háttérkutatást, de struktúra kell a pontossághoz.</li>
  <li>3 tény + 1 trigger = releváns, rövid outreach.</li>
  <li>Brief nélkül a csapat duplikál és hibázik.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Prompt csomag elemei</h3>
<ul>
  <li>Cégprofil: termék, piac, növekedés, hírek.</li>
  <li>Persona: szerep, felelősség, KPI, tipikus fájdalom.</li>
  <li>Trigger: új termék, funding, hiring, árazás/váltás.</li>
</ul>
<h3>Account brief</h3>
<ul>
  <li>1 oldal: cég röviden, 3 tény, 1 trigger, releváns fájdalom, ajánlott next step.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> Brief: 3 tény (termék, funding, új piac), 1 trigger (hiring revops), ajánlott következő lépés.</p>
<p><strong>Rossz:</strong> Csak weboldal bemásolva, nincs trigger, nincs next step.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 3 promptot (cég, persona, trigger) és teszteld 1 targeten.</li>
  <li>Készíts account brief sablont (1 oldal, 3 tény + 1 trigger + fájdalom + next step).</li>
  <li>Tölts ki 2 briefet a listádból.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Írj 1 ajánlott outreach nyitást a 2 brief alapján (1-2 mondat, tény + trigger).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a 3 kutatási prompt.</li>
  <li>Megvan az account brief sablon.</li>
  <li>2 brief kitöltve.</li>
  <li>1 outreach nyitás megírva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>OpenAI prompt guide: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
  <li>Company research checklist: <a href="https://www.alexbirkett.com/account-research" target="_blank" rel="noreferrer">https://www.alexbirkett.com/account-research</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 10. nap: AI kutatás',
    emailBody: `<h1>B2B Értékesítés 2026 – 10. nap</h1>
<p>AI prompt csomagot és account brief sablont készítesz, 2 accounton kipróbálod.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a 3 tény + 1 trigger célja?',
          options: [
            'Dekoráció',
            'Releváns, rövid outreach alapja',
            'Hosszabb email',
            'Jogilag kötelező',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi tartozik az account briefbe?',
          options: [
            'Csak a weboldal linkje',
            'Cég röviden, 3 tény, 1 trigger, fájdalom, next step',
            'Csak a pitch deck',
            'Csak az árlista',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell külön persona prompt?',
          options: [
            'Mert hosszabb lesz a válasz',
            'Mert szerep/KPI/fájdalom specifikus relevanciát ad',
            'Mert jogilag kell',
            'Mert így nem kell ICP',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz megközelítés?',
          options: [
            'Brief 3 tény + triggerrel',
            'Weboldal bemásolva trigger és next step nélkül',
            'Ajánlott next step megírása',
            'Persona szerepének felírása',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 11,
    title: 'Outbound üzenet: személyre szabás nélkül nincs válasz',
    content: `<h1>Outbound üzenet: személyre szabás nélkül nincs válasz</h1>
<p><em>Megtanulod a 3 részes struktúrát: relevancia, probléma, next step. Készítesz 2 sablont és 2 jó/2 rossz példát.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Megírsz 2 outbound sablont (jó/rossz példa is).</li>
  <li>Minden üzenetben van relevancia jel + probléma + következő lépés.</li>
  <li>Összekötöd a briefből származó tényt/trigger jelzést az üzenettel.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A személyre szabás nélküli üzenet alacsony választ kap.</li>
  <li>Rövid, konkrét next step gyorsítja a döntést.</li>
  <li>A relevancia jel bizonyíték a figyelemre.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>3 elem</h3>
<ul>
  <li><strong>Relevancia jel</strong>: 1 tény/trigger a briefből.</li>
  <li><strong>Probléma</strong>: ICP fájdalom röviden.</li>
  <li><strong>Next step</strong>: 1 konkrét lépés (15 perc, audit, checklist).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Segítünk növekedni AI-val, beszéljünk.”</p>
<p><strong>Jó:</strong> „Láttam, hogy hiringolsz revopsot és 90+ nap a cycle. 2 helyen szokott kifolyni: qualification és bizonytalan next step. 15 perc alatt megmutatom a stage definícióknál, hol folyik el. Jó jövő hét kedd 10:00?”</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 2 sablont (A/B) a 3 elemre.</li>
  <li>Írj 2 jó és 2 rossz példát a saját piacodra.</li>
  <li>Kösd össze a briefből vett tény/trigger jelzéssel.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Küldj ki 3 üzenetet a listádról, jegyezd a válaszokat.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van 2 sablonod (A/B).</li>
  <li>Van 2 jó/2 rossz példa.</li>
  <li>Minden üzenetben van relevancia jel + probléma + next step.</li>
  <li>3 üzenetet kiküldtél és jegyzeteltél.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Cold email best practices: <a href="https://beccahanderson.substack.com/p/cold-email-guide" target="_blank" rel="noreferrer">https://beccahanderson.substack.com/p/cold-email-guide</a></li>
  <li>Personalization példák: <a href="https://www.gong.io/blog/personalized-outreach" target="_blank" rel="noreferrer">https://www.gong.io/blog/personalized-outreach</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 11. nap: Outbound üzenet',
    emailBody: `<h1>B2B Értékesítés 2026 – 11. nap</h1>
<p>2 outbound sablont írsz, 2 jó és 2 rossz példával, relevancia jel + probléma + next step szerkezetben.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a jó outbound üzenet 3 eleme?',
          options: [
            'Hosszú bemutatkozás, ár, link',
            'Relevancia jel, probléma, konkrét next step',
            'Marketing szlogen, CTA, logó',
            'Feature lista, CTA, ár',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a relevancia jel szerepe?',
          options: [
            'Dekoráció',
            'Bizonyítja, hogy figyeltél (tény/trigger)',
            'Növeli a szócountot',
            'Kiváltja az ICP-t',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Relevancia jel + probléma + konkrét 15 perces lépés',
            '„Segítünk növekedni AI-val, beszéljünk.”',
            'Trigger említése',
            'Stage definíciók említése',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell next step?',
          options: [
            'Hogy hosszabb legyen az email',
            'Hogy a döntés gyorsuljon és konkrét legyen az elköteleződés',
            'Hogy több marketing anyagot küldj',
            'Hogy ne kelljen ICP',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 12,
    title: 'Lista tisztítás és lead hygiene',
    content: `<h1>Lista tisztítás és lead hygiene</h1>
<p><em>Beállítod a duplikáció, státusz és forrás kezelését, hogy a pipeline a valóságot tükrözze.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Lead státuszok és források egységesítése.</li>
  <li>Duplikáció és „do not contact” szabályok beállítása.</li>
  <li>Lista QA: 50 lead átnézése, javítása.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Koszos lista = rossz mérés és rossz élmény.</li>
  <li>Státusz egységesítése gyorsítja a reportot és az automatizmust.</li>
  <li>DNC és duplikáció nélkül slip + spam kockázat.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Státuszok (példa)</h3>
<ul>
  <li>New, Working, Nurture, Qualified, Disqualified, DNC.</li>
</ul>
<h3>Szabályok</h3>
<ul>
  <li>Dedupe: email/domain + név.</li>
  <li>DNC: bounce/spam/jogi kérés.</li>
  <li>Forrás kód: outbound, inbound, partner, event, referral.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> Státusz egységes, duplikátum jelölve, DNC lista vezetve.</p>
<p><strong>Rossz:</strong> Duplikált leadek, vegyes státusznevek, nincs DNC.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Definiáld a lead státuszokat és forrás kódokat.</li>
  <li>Írj dedupe és DNC szabályt.</li>
  <li>Nézd át 50 leadet, javítsd duplikációt/státuszt.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Állíts be egy automatizmust vagy checklistet a jövőbeni QA-hoz (heti/2 heti).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a státusz + forrás definíció.</li>
  <li>Megvan a dedupe + DNC szabály.</li>
  <li>50 lead QA-zva.</li>
  <li>QA ritmus beállítva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>CRM hygiene guide: <a href="https://www.hubspot.com/crm-data-cleanup" target="_blank" rel="noreferrer">https://www.hubspot.com/crm-data-cleanup</a></li>
  <li>Duplicate management tippek: <a href="https://www.pipedrive.com/en/blog/crm-data-cleaning" target="_blank" rel="noreferrer">https://www.pipedrive.com/en/blog/crm-data-cleaning</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 12. nap: Lead hygiene',
    emailBody: `<h1>B2B Értékesítés 2026 – 12. nap</h1>
<p>Egységesíted a státuszokat/forrásokat, dedupe + DNC szabályt állítasz be, 50 leadet QA-zel.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a lead hygiene egyik fő célja?',
          options: [
            'Több marketing email',
            'Valós pipeline és pontos mérés',
            'Kevesebb státusz',
            'Nagyobb spam arány',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi legyen a dedupe szabály alapja?',
          options: [
            'Random',
            'Email/domain + név kombináció',
            'Csak keresztnév',
            'Csak iparág',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell DNC lista?',
          options: [
            'Dekoráció',
            'Bounce/spam/jogi kérés kezelése, kockázatcsökkentés',
            'Kevesebb kampány',
            'Drágább szoftver',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Státusz egységes, duplikátum jelölve',
            'Duplikált leadek, vegyes státusznevek, nincs DNC',
            'DNC lista vezetve',
            'QA ritmus beállítva',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 13,
    title: 'MQL vs SQL és a qualification döntési pont',
    content: `<h1>MQL vs SQL és a qualification döntési pont</h1>
<p><em>Felismered, mikor kell nemet mondani és mikor érdemes discoveryt nyitni.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Világos határt húzol MQL és SQL között.</li>
  <li>Írsz egy 5 kérdéses qualification döntési pontot.</li>
  <li>Megfogalmazol 3 gyors „nem” sablont.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Rossz leadek elégetik az időt és rontják a win rate-et.</li>
  <li>Gyors „nem” növeli a fókuszt és a pipeline minőségét.</li>
  <li>A döntési pont nélkül a csapat vélemény alapján dolgozik.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>MQL</h3>
<ul>
  <li>Marketing jel: letöltés, feliratkozás, esemény.</li>
  <li>Nem biztos, hogy ICP-fit vagy probléma van.</li>
</ul>
<h3>SQL</h3>
<ul>
  <li>ICP + probléma + döntéshozó/kapuőr elérhető.</li>
  <li>Van trigger vagy fájdalom, amit validáltál.</li>
</ul>
<h3>Döntési pont</h3>
<ul>
  <li>5 kérdés: ICP? probléma? döntéshozó? trigger? időkeret?</li>
  <li>Igen = discovery; Nem = gyors lezárás vagy nurture.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Minden feliratkozót discoveryre hívsz.</p>
<p><strong>Jó:</strong> Csak ICP + probléma + döntéshozó esetén mész discoveryre.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 5 qualification kérdést a döntési ponthoz.</li>
  <li>Írj 3 gyors „nem” sablont (udvarias, értéket adó).</li>
  <li>Jelöld, mely MQL-eket küldesz nurture-be.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Fogj 10 leadet, alkalmazd a döntési pontot, jegyezd: hány lett SQL.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan az MQL/SQL definíció.</li>
  <li>Megvan az 5 kérdéses döntési pont.</li>
  <li>Van 3 „nem” sablon.</li>
  <li>10 leaden alkalmaztad és jegyezted az eredményt.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>MQL vs SQL vita: <a href="https://www.gartner.com/en/insights/sales" target="_blank" rel="noreferrer">https://www.gartner.com/en/insights/sales</a></li>
  <li>Lead scoring minta: <a href="https://knowledge.hubspot.com/contacts/create-scoring-properties" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/contacts/create-scoring-properties</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 13. nap: MQL vs SQL',
    emailBody: `<h1>B2B Értékesítés 2026 – 13. nap</h1>
<p>Határt húzol MQL és SQL között, 5 kérdéses döntési pontot írsz, és 3 gyors „nem” sablont készítesz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi az SQL egyik kulcseleme?',
          options: [
            'Csak egy letöltés',
            'ICP + probléma + döntéshozó/kapuőr elérhető',
            'Csak egy event részvétel',
            'Csak web traffic',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell gyors „nem”?',
          options: [
            'Kevesebb munka',
            'Fókusz, jobb pipeline minőség, időmegtakarítás',
            'Nagyobb lista',
            'Kötelező jogilag',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Minden feliratkozót discoveryre hívsz',
            'ICP + probléma + döntéshozó esetén discovery',
            '„Nem” sablon használata',
            'Trigger keresése',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mit tartalmazzon a döntési pont?',
          options: [
            'Árlista',
            'ICP, probléma, döntéshozó, trigger, időkeret',
            'Pitch deck',
            'Marketing kampány',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 14,
    title: 'Qualification keretrendszer: MEDDPICC (egyszerűsítve)',
    content: `<h1>Qualification keretrendszer: MEDDPICC (egyszerűsítve)</h1>
<p><em>Gyakorlati kérdéslistát kapsz a kockázat korai felismerésére.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Összeállítasz egy 8-10 kérdéses MEDDPICC-alapú listát.</li>
  <li>Jelölöd a hiányzó elemeket 3 futó dealben.</li>
  <li>Prioritást adsz a következő lépésekhez a hiányok alapján.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A hiányzó gazdasági vevő/metric/next step csúszást okoz.</li>
  <li>Korai kockázatazonosítás = rövidebb cycle.</li>
  <li>Egyértelmű next step a kvalifikáció végén.</li>
</ul>
<hr />
<h2>Magyarázat (egyszerűsített MEDDPICC)</h2>
<ul>
  <li>Metrics: mi számít sikernek?</li>
  <li>Economic buyer: ki ír alá?</li>
  <li>Decision criteria/process: hogyan döntenek?</li>
  <li>Paper process: jog/beszerzés útja.</li>
  <li>Identify pain: fájdalom, trigger.</li>
  <li>Champion: ki a belső gazda?</li>
  <li>Competition/status quo: kivel hasonlítanak?</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> 8 kérdés, minden dealen jelölve, mi hiányzik; next step listázva.</p>
<p><strong>Rossz:</strong> Nincs kérdéslista, csak „érzésre” mész tovább.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 8-10 kérdést a fenti elemekre.</li>
  <li>3 élő dealnél jelöld: mi hiányzik?</li>
  <li>Írj next stepet minden hiányra (pl. economic buyer bevonása, paper process kérdése).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Frissítsd a CRM jegyzetet a hiányzó elemekkel és a következő lépésekkel.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a 8-10 kérdéses lista.</li>
  <li>3 dealen bejelölted a hiányzó elemeket.</li>
  <li>Minden hiányra van next step.</li>
  <li>CRM-ben rögzítetted.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>MEDDPICC részletesen: <a href="https://meddicc.com/meddpicc-sales-methodology-and-process" target="_blank" rel="noreferrer">https://meddicc.com/meddpicc-sales-methodology-and-process</a></li>
  <li>Decision criteria tippek: <a href="https://www.gong.io/blog/meddpicc" target="_blank" rel="noreferrer">https://www.gong.io/blog/meddpicc</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 14. nap: MEDDPICC',
    emailBody: `<h1>B2B Értékesítés 2026 – 14. nap</h1>
<p>Összeállítasz egy MEDDPICC-alapú kérdéslistát, 3 dealen jelölöd a hiányokat, és next stepet rendelsz hozzájuk.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a MEDDPICC egyik fő eleme?',
          options: [
            'Marketing budget',
            'Economic buyer (ki ír alá)',
            'LinkedIn követők',
            'CSR program',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell kérdéslista?',
          options: [
            'Hosszabb meeting',
            'Kockázatok korai felismerése, következő lépés kijelölése',
            'Dekoráció',
            'Kevesebb jegyzet',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Hiányzó economic buyer jelölve',
            'Nincs lista, érzésre mész',
            'Paper process rögzítve',
            'Next step leírva',
          ],
          correctIndex: 1,
        },
        {
          question: 'Melyik kérdés tartozik a Metrics-hez?',
          options: [
            'Ki ír alá?',
            'Mi számít sikernek?',
            'Mi a jogi folyamat?',
            'Ki a champion?',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 15,
    title: 'Discovery hívás felépítése (5 blokk)',
    content: `<h1>Discovery hívás felépítése (5 blokk)</h1>
<p><em>30 perces scriptet készítesz, tiltott kérdésekkel és kötelező next steppel.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Összeállítasz egy 5 blokkból álló discovery scriptet (30 perc).</li>
  <li>Listázod a tiltott kérdéseket (időrablók).</li>
  <li>Minden discovery végén next stepet rögzítesz.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Struktúra nélkül a hívás szétesik, nincs döntési alap.</li>
  <li>A tiltott kérdések időt visznek, nem adnak döntési információt.</li>
  <li>Next step nélkül a pipeline megakad.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>5 blokk</h3>
<ol>
  <li>Nyitás + agenda + időkeret.</li>
  <li>Probléma/fájdalom + hatás.</li>
  <li>Döntési folyamat + szereplők.</li>
  <li>Paper/security/legal kockázat.</li>
  <li>Összefoglalás + next step (idő, felelős).</li>
</ol>
<h3>Tiltott kérdések</h3>
<ul>
  <li>„Mennyi a büdzsé?” (korán, kontextus nélkül).</li>
  <li>„Mikor akartok dönteni?” (ha nincs fájdalom tisztázva).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> Agenda upfront, fájdalom és hatás, döntési folyamat, security kérdések, next step időponttal.</p>
<p><strong>Rossz:</strong> Small talk, pitch, nincs problémafeltárás, nincs next step.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 30 perces discovery scriptet az 5 blokkra.</li>
  <li>Listázd a tiltott kérdéseket, és írd mellé a helyes alternatívát.</li>
  <li>Írj egy záró mondatot next steppel (idő + felelős).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Frissíts egy közelgő discovery meghívót az agendával és a várt kimenettel.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan az 5 blokkos script.</li>
  <li>Megvannak a tiltott kérdések és alternatíváik.</li>
  <li>Minden script végén van next step.</li>
  <li>Discovery meghívó frissítve agendával.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Discovery best practices: <a href="https://www.gong.io/blog/discovery-call-questions" target="_blank" rel="noreferrer">https://www.gong.io/blog/discovery-call-questions</a></li>
  <li>Next step minták: <a href="https://www.saleshacker.com/discovery-call-templates" target="_blank" rel="noreferrer">https://www.saleshacker.com/discovery-call-templates</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 15. nap: Discovery hívás',
    emailBody: `<h1>B2B Értékesítés 2026 – 15. nap</h1>
<p>30 perces discovery scriptet írsz, tiltott kérdésekkel és kötelező next steppel.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi tartozik az 5 blokk egyikébe?',
          options: [
            'Small talk és pitch',
            'Probléma/fájdalom + hatás',
            'Csak áralku',
            'Csak marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a tiltott kérdések baja?',
          options: [
            'Rövidek',
            'Időt visznek, nem adnak döntési infót',
            'Túl drágák',
            'Nem magyarul vannak',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell next step a végén?',
          options: [
            'Hogy hosszabb legyen a hívás',
            'Hogy ne akadjon meg a pipeline és legyen felelős/időpont',
            'Hogy legyen több email',
            'Hogy legyen több small talk',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Agenda upfront, next step',
            'Small talk + pitch, nincs probléma, nincs next step',
            'Security kérdés feltevése',
            'Hatás feltárása',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 16,
    title: 'AI meeting előkészítés és jegyzetelés',
    content: `<h1>AI meeting előkészítés és jegyzetelés</h1>
<p><em>Létrehozol egy „meeting prep” és egy „meeting summary” promptot, hogy konzisztensen dokumentálj és jelölj next stepet.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Megírsz egy meeting prep promptot (előtte).</li>
  <li>Megírsz egy meeting summary promptot (utána).</li>
  <li>Kitöltesz 1-1 sablont egy közelgő és egy lezárt hívásra.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Konzisztens jegyzet = gyors visszakeresés, jobb next step.</li>
  <li>AI gyorsítja az összefoglalót, de kell struktúra a pontossághoz.</li>
  <li>Meeting utáni követés időt nyer és csökkenti a slip kockázatot.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Meeting prep prompt</h3>
<ul>
  <li>Bemenet: account brief, cél, résztvevők.</li>
  <li>Kimenet: 3 hipotézis/pain, 3 kérdés, 1 ajánlott next step.</li>
</ul>
<h3>Meeting summary prompt</h3>
<ul>
  <li>Bemenet: nyers jegyzet.</li>
  <li>Kimenet: döntési pontok, kockázatok, next step (idő, felelős).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> AI összefoglaló: fájdalom, hatás, döntési folyamat, kockázat, következő lépés dátummal.</p>
<p><strong>Rossz:</strong> Hosszú transcript másolása, nincs next step.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj meeting prep és summary promptot.</li>
  <li>Prep: töltsd ki egy közelgő hívásra.</li>
  <li>Summary: töltsd ki egy lezárt hívásra; írd be a next stepet.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Illeszd be a summaryt a CRM-be, és állíts be emlékeztetőt a next stepre.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a két prompt.</li>
  <li>1 közelgő hívásra kitöltött prep.</li>
  <li>1 lezárt hívásra kitöltött summary.</li>
  <li>Next step beírva a CRM-be.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Meeting note best practices: <a href="https://www.gong.io/blog/sales-call-notes/" target="_blank" rel="noreferrer">https://www.gong.io/blog/sales-call-notes/</a></li>
  <li>OpenAI prompt guide: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 16. nap: Meeting prep + summary',
    emailBody: `<h1>B2B Értékesítés 2026 – 16. nap</h1>
<p>Írj meeting prep és summary promptot, töltsd ki egy közelgő és egy lezárt hívásra, és rögzítsd a next stepet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a meeting prep prompt kimenete?',
          options: [
            'Hosszú transcript',
            '3 hipotézis/pain, 3 kérdés, 1 ajánlott next step',
            'Csak árlista',
            'Csak pitch deck',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a summary prompt egyik célja?',
          options: [
            'Transcript másolása',
            'Döntési pontok, kockázat, next step rögzítése',
            'Hosszabb email',
            'Marketing kampány',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Next step dátummal a summaryban',
            'Transcript bemásolása next step nélkül',
            'Kockázatok jelölése',
            'Fájdalom és hatás összefoglalása',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit teszel a summary után?',
          options: [
            'Semmit',
            'CRM-be írod és emlékeztetőt állítasz a next stepre',
            'Email listára teszed',
            'Törlöd',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 17,
    title: 'Következő lépés és kötelezettség kérése',
    content: `<h1>Következő lépés és kötelezettség kérése</h1>
<p><em>Megtanulod kis, konkrét elköteleződést kérni minden meeting végén.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Írsz 5 next step sablont (idő, felelős, deliverable).</li>
  <li>Készítesz egy „kötelezettség” checklistet.</li>
  <li>Alkalmazod a legközelebbi meeting végén.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Elköteleződés nélkül a deal megakad.</li>
  <li>Kis lépések (pl. anyag megosztás, 2. meeting egyeztetés) jelzik a szándékot.</li>
  <li>Csökkenti a „majd jelentkezünk” állapotot.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Kötelezettség típusok</h3>
<ul>
  <li>Idő: következő meeting dátuma.</li>
  <li>Anyag: adat/teszt/hozzáférés megosztása.</li>
  <li>Belső bevonás: döntéshozó/IT bevonása.</li>
</ul>
<h3>Sablon</h3>
<p>„A következő lépés: [X], határidő: [dátum], felelős: [személy]. Megerősíted?”</p>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> „Küldesz 3 lost ok listát péntekig, hétfőn 10:00 review, én hozom a pipeline javítási javaslatot.”</p>
<p><strong>Rossz:</strong> „Majd beszéljünk valamikor.”</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 5 next step sablont különböző elköteleződésekre.</li>
  <li>Írj egy checklistet: van-e idő, felelős, deliverable?</li>
  <li>Készülj fel a legközelebbi meeting zárására a sablonnal.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Használd a sablont a következő meeting végén, és jegyezd a választ.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>5 sablon megvan.</li>
  <li>Checklist megvan.</li>
  <li>Használtad 1 meeting végén.</li>
  <li>Jegyezted a választ.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Commitment techniques: <a href="https://www.saleshacker.com/sales-closing-techniques/" target="_blank" rel="noreferrer">https://www.saleshacker.com/sales-closing-techniques/</a></li>
  <li>Micro-commitments: <a href="https://www.gong.io/blog/closing-sales-techniques/" target="_blank" rel="noreferrer">https://www.gong.io/blog/closing-sales-techniques/</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 17. nap: Kötelezettség kérése',
    emailBody: `<h1>B2B Értékesítés 2026 – 17. nap</h1>
<p>5 next step sablont írsz, checklistet készítesz, és a következő meeting végén alkalmazod.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell kis elköteleződést kérni?',
          options: [
            'Hogy hosszabb legyen a meeting',
            'Szándék jelzése, deal megakadásának megelőzése',
            'Több email küldése',
            'Marketing okból',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó next step sablon eleme?',
          options: [
            'Általános „majd beszéljünk”',
            'Konkrét feladat, határidő, felelős',
            'Csak small talk',
            'Csak ár',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            '„Majd beszéljünk valamikor.”',
            '„Küldesz 3 lost ok listát péntekig….”',
            'Időpont egyeztetése',
            'Felelős kijelölése',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mit ellenőriz a checklist?',
          options: [
            'Van-e logó',
            'Idő, felelős, deliverable megvan-e',
            'Hossz-e az email',
            'Van-e emoji',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 18,
    title: 'Nurture és visszahozás',
    content: `<h1>Nurture és visszahozás</h1>
<p><em>Egyszerű 3 lépcsős nurture flow-t építesz a nemet mondott vagy „most nem” leadekre.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Megírsz egy 3 lépcsős nurture flow-t (érték, proof, ajánlat).</li>
  <li>Szegmentálsz: „nem fit”, „most nem”, „később”.</li>
  <li>Beállítasz mérőpontot (reply, meeting, SQL).</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Hosszú ciklusokban a „nem most” leadek visszahozhatók.</li>
  <li>Érték + proof + ajánlat = bizalomépítés.</li>
  <li>Mérés nélkül nincs tanulás a nurture hatásáról.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>3 lépcső</h3>
<ol>
  <li>Érték: 1 hasznos anyag/esettanulmány.</li>
  <li>Proof: szám/benchmark/eredmény.</li>
  <li>Ajánlat: rövid call vagy audit.</li>
</ol>
<h3>Szegmentálás</h3>
<ul>
  <li>Nem fit: lezár, nincs nurture.</li>
  <li>Most nem: nurture 3 lépcső.</li>
  <li>Később: emlékeztető 60-90 nap.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> 3 email: esettanulmány + benchmark + rövid audit ajánlat.</p>
<p><strong>Rossz:</strong> Havonta egy általános „még mindig itt vagyunk” email.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 3 nurture üzenetet (érték, proof, ajánlat).</li>
  <li>Szegmentáld 15 leadet a három kategóriába.</li>
  <li>Állíts be mérőpontot: reply/meeting/SQL.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Időzítsd a 3 üzenetet (pl. heti/2 heti) és jelöld a CRM-ben.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a 3 üzenet.</li>
  <li>15 lead szegmentálva.</li>
  <li>Mérőpont beállítva.</li>
  <li>Ütemezés kész.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Nurture best practices: <a href="https://www.activecampaign.com/blog/lead-nurturing" target="_blank" rel="noreferrer">https://www.activecampaign.com/blog/lead-nurturing</a></li>
  <li>Follow-up statisztikák: <a href="https://www.gong.io/blog/sales-follow-up" target="_blank" rel="noreferrer">https://www.gong.io/blog/sales-follow-up</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 18. nap: Nurture',
    emailBody: `<h1>B2B Értékesítés 2026 – 18. nap</h1>
<p>3 lépcsős nurture flow-t írsz, szegmentálsz, mérőpontot állítasz, és ütemezed az üzeneteket.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a 3 lépcső sorrendje?',
          options: [
            'Ajánlat, proof, érték',
            'Érték, proof, ajánlat',
            'Proof, ajánlat, érték',
            'Csak ajánlat',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mikor nem érdemes nurture-t küldeni?',
          options: [
            'Nem fit leadnél',
            'Most nem kategóriánál',
            'Később kategóriánál',
            'Soha',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a jó példa?',
          options: [
            'Havonta egy általános email',
            '3 üzenet: esettanulmány + benchmark + audit ajánlat',
            'Csak egy marketing hírlevél',
            'Csak egy árlista',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit mérj nurture-ben?',
          options: [
            'Csak megnyitást',
            'Reply/meeting/SQL konverziót',
            'Csak web trafficot',
            'Csak like-okat',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 19,
    title: 'Miért kell CRM és miért nem elég az Excel',
    content: `<h1>Miért kell CRM és miért nem elég az Excel</h1>
<p><em>Felméred, mikor borul fel az Excel, és mi az a minimum CRM beállítás, ami valós pipeline-t ad.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Azonosítod a „váltási jeleket” (Excel → CRM).</li>
  <li>Összeírsz minimum mezőket (deal, kontakt, aktivitás).</li>
  <li>Eldöntöd, mi kerül át és mi marad háttérben.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Excelben nincs aktivitás-, idő- és felelős-követés.</li>
  <li>Státusz és stage riport nélkül a forecast vélemény marad.</li>
  <li>CRM higiénia = valós pipeline, jobb döntés.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Excel borulás jelei</h3>
<ul>
  <li>Duplikáció, verziókáosz.</li>
  <li>Nincs aktivitás idősor, nincs felelős.</li>
  <li>Nincs stage konverzió / cycle time kép.</li>
</ul>
<h3>CRM minimum</h3>
<ul>
  <li>Deal: érték, stage, forrás, valószínűség (opcionális), következő lépés.</li>
  <li>Kontakt: szerep, email/telefon/LinkedIn, döntéshozó-e.</li>
  <li>Aktivitás: dátum, típus, jegyzet, next step.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> CRM-ben minden dealhez next step + felelős + dátum.</p>
<p><strong>Rossz:</strong> Excel: több verzió, nincs aktivitás, nincs felelős.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írd le 5 váltási jelet (mikor lépsz CRM-re).</li>
  <li>Írd meg a minimum mezőlistát (deal/kontakt/aktivitás).</li>
  <li>Döntsd el: mit migrálsz, mit hagysz meg háttérben (pl. régi jegyzetek PDF-ben).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Válassz 10 élő dealt, vidd át a minimum mezőkkel egy CRM sandboxba vagy táblába (CRM-szerű struktúrában).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan 5 váltási jel.</li>
  <li>Megvan a minimum mezőlista.</li>
  <li>10 deal átkerült a CRM-struktúrába.</li>
  <li>Minden dealhez van next step + felelős.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>CRM higiénia: <a href="https://www.pipedrive.com/en/blog/crm-data-cleaning" target="_blank" rel="noreferrer">https://www.pipedrive.com/en/blog/crm-data-cleaning</a></li>
  <li>Stage riport alapok: <a href="https://knowledge.hubspot.com/reporting/create-reports" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/reporting/create-reports</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 19. nap: Miért CRM',
    emailBody: `<h1>B2B Értékesítés 2026 – 19. nap</h1>
<p>Azonosítod, mikor kell CRM-re váltani, minimum mezőlistát írsz, és 10 dealt átviszel CRM-struktúrába.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért bukik el az Excel hosszabb távon?',
          options: [
            'Túl színes',
            'Nincs aktivitás/idő/felelős követés, verziókáosz',
            'Drága',
            'Nem lehet számolni benne',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi tartozik a minimum deal mezők közé?',
          options: [
            'Csak név és ár',
            'Érték, stage, forrás, next step, felelős',
            'Csak e-mail',
            'Csak jegyzet',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó példa?',
          options: [
            'Excel több verzióban, felelős nélkül',
            'CRM-ben next step + felelős minden dealhez',
            'Csak call szám mérése',
            'Csak marketing lista',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a váltási jel?',
          options: [
            'Ha 1 deal van',
            'Duplikáció, nincs felelős, nincs stage riport',
            'Ha nincs e-mail',
            'Ha túl sok ikon van',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 20,
    title: 'Pipeline design: stagenkénti definíciók',
    content: `<h1>Pipeline design: stagenkénti definíciók</h1>
<p><em>Minden stage-hez belépési/kilépési feltételeket és kötelező mezőket írsz, hogy a pipeline ne vélemény legyen.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Stage lista és definíció (belépés/kilépés) elkészítése.</li>
  <li>Minimum kötelező mezők stage-enként.</li>
  <li>1 oldalas pipeline checklist.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Definíció nélkül a stage jelentése emberfüggő.</li>
  <li>Mezők nélkül nincs riport vagy automatizálás.</li>
  <li>Egységes forecast és gyorsabb kockázatjelzés.</li>
< /ul>
<hr />
<h2>Magyarázat</h2>
<h3>Belépés/kilépés</h3>
<ul>
  <li>Belépés: mi kell ahhoz, hogy ide kerüljön (pl. ICP + probléma + döntéshozó).</li>
  <li>Kilépés: mi bizonyítja a továbblépést (pl. döntési folyamat ismert, paper process elindítva).</li>
</ul>
<h3>Kötelező mezők</h3>
<ul>
  <li>Next step + dátum + felelős.</li>
  <li>Forrás, érték, valószínűség (opcionális), lost ok (ha kiesik).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> Stage-hez tartozó belépési/kilépési feltétel + kötelező mezők.</p>
<p><strong>Rossz:</strong> „Call után ide rakom, ha úgy érzem”.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írd le a stage-eket (pl. Lead, SQL, Discovery, Proposal, Negotiation, Close).</li>
  <li>Írj belépési/kilépési feltételt mindegyikhez.</li>
  <li>Írd mellé a kötelező mezőket.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Töltsd ki 5 élő dealen a kötelező mezőket, javítsd, ami hiányzik.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Stage definíciók készen.</li>
  <li>Belépés/kilépés meghatározva.</li>
  <li>Kötelező mezők listázva.</li>
  <li>5 dealen alkalmaztad.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Pipeline design tippek: <a href="https://www.gong.io/blog/sales-pipeline-stages/" target="_blank" rel="noreferrer">https://www.gong.io/blog/sales-pipeline-stages/</a></li>
  <li>Stage konverzió riport: <a href="https://knowledge.hubspot.com/reporting/create-reports" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/reporting/create-reports</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 20. nap: Pipeline design',
    emailBody: `<h1>B2B Értékesítés 2026 – 20. nap</h1>
<p>Stage definíciókat, belépés/kilépés feltételeket és kötelező mezőket írsz, és 5 dealen alkalmazod.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell belépési/kilépési feltétel?',
          options: [
            'Dekoráció',
            'Hogy a stage jelentése egységes és mérhető legyen',
            'Hosszabb legyen a CRM',
            'Több e-mailt küldjünk',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a kötelező mezők célja?',
          options: [
            'Design',
            'Riport és automatizálás alapja',
            'Marketing',
            'Nincs cél',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            '„Call után ide rakom, ha úgy érzem”',
            'Belépés: ICP+probléma; Kilépés: döntési folyamat ismert',
            'Next step és felelős rögzítve',
            'Forrás mező kitöltve',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi legyen minden dealen?',
          options: [
            'Emotikon',
            'Next step + dátum + felelős',
            'Csak érték',
            'Csak jegyzet',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 21,
    title: 'Pipedrive: erősségek, mikor jó választás',
    content: `<h1>Pipedrive: erősségek, mikor jó választás</h1>
<p><em>Megérted, mire jó igazán a Pipedrive, mikor válaszd, és hogyan állítsd be minimálisan.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Megnevezed a Pipedrive erősségeit és korlátait.</li>
  <li>Beállítasz egy minimál pipeline-t és kötelező mezőket.</li>
  <li>Írsz döntési kritériumot: mikor Pipedrive, mikor más.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A rossz eszköz választás pénzt és időt visz.</li>
  <li>Pipedrive gyors pipeline-ra és aktivitásra jó; nem erős marketing automatizmusban.</li>
  <li>Minimál beállítás gyorsítja az indulást.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Erősségek</h3>
<ul>
  <li>Gyors pipeline és aktivitás kezelés.</li>
  <li>Egyszerű automatizmusok, könnyű bevezetés.</li>
  <li>Áttekinthető UI, mobil app.</li>
</ul>
<h3>Korlátok</h3>
<ul>
  <li>Marketing automatizmus korlátozott.</li>
  <li>Összetett multi-object riport kevésbé erős.</li>
</ul>
<h3>Minimál setup</h3>
<ul>
  <li>Pipeline stage-ek + kötelező mezők (forrás, next step, érték).</li>
  <li>Aktivitás típusok, emlékeztetők.</li>
  <li>Alap automatizmus: új deal → next step emlékeztető.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> Stage + kötelező mezők beállítva, aktivitás és emlékeztető fut, egyszerű riport.</p>
<p><strong>Rossz:</strong> Pipedrive-ot választasz, miközben komplex marketing automatizmust akarsz.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj döntési kritériumot: mikor Pipedrive, mikor HubSpot/alternatíva.</li>
  <li>Állíts be egy pipeline-t 5-6 stage-dzsel és kötelező mezőkkel.</li>
  <li>Hozz létre egy alap automatizmust (új deal → next step emlékeztető).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Vidd át 5 dealt Pipedrive sandboxba, töltsd a mezőket, állíts be emlékeztetőt.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a döntési kritérium.</li>
  <li>Pipeline + kötelező mezők beállítva.</li>
  <li>Alap automatizmus fut.</li>
  <li>5 deal feltöltve.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Pipedrive gyors start: <a href="https://support.pipedrive.com/en/article/how-to-set-up-pipelines" target="_blank" rel="noreferrer">https://support.pipedrive.com/en/article/how-to-set-up-pipelines</a></li>
  <li>Automations: <a href="https://support.pipedrive.com/en/article/workflow-automation" target="_blank" rel="noreferrer">https://support.pipedrive.com/en/article/workflow-automation</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 21. nap: Pipedrive',
    emailBody: `<h1>B2B Értékesítés 2026 – 21. nap</h1>
<p>Megérted, mikor válaszd a Pipedrive-ot, beállítasz egy minimál pipeline-t és kötelező mezőket.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miben erős a Pipedrive?',
          options: [
            'Komplex marketing automatizmus',
            'Gyors pipeline és aktivitás kezelés',
            'ERP',
            'HR rendszer',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a minimál setup része?',
          options: [
            'Pipeline stage + kötelező mezők + aktivitás emlékeztető',
            'Csak logó',
            'Csak árlista',
            'Csak e-mail sablon',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mikor nem ideális Pipedrive?',
          options: [
            'Ha gyors pipeline-t akarsz',
            'Ha komplex marketing automatizmust és lifecycle-t akarsz',
            'Ha mobil app kell',
            'Ha aktivitás emlékeztetőt akarsz',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó példa?',
          options: [
            'Döntési kritérium leírva, pipeline beállítva, 5 deal feltöltve',
            'Eszközválasztás kritérium nélkül',
            'Nincs emlékeztető',
            'Nincs kötelező mező',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 22,
    title: 'HubSpot: erősségek, mikor jó választás',
    content: `<h1>HubSpot: erősségek, mikor jó választás</h1>
<p><em>Megérted, mikor éri meg a HubSpot a Pipedrive helyett, és milyen minimál beállítással indulj.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Megnevezed a HubSpot erősségeit és korlátait.</li>
  <li>Írsz döntési kritériumot: mikor HubSpot, mikor Pipedrive/alternatíva.</li>
  <li>Beállítasz egy minimál lifecycle + deal pipeline + kötelező mezők csomagot.</li>
  <li>Készítesz 1 egyszerű workflow-t (pl. form → contact → deal létrehozás).</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Drága eszközt választani feleslegesen pénzégetés.</li>
  <li>HubSpot akkor erős, ha marketing + sales + ügyfélút egy helyen van.</li>
  <li>Minimál setup nélkül a komplexitás elviszi a fókuszt.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Erősségek</h3>
<ul>
  <li>Marketing + sales + service egyben (lifecycle státuszok).</li>
  <li>Workflow-k és automatizmusok (form, email, deal update).</li>
  <li>Reporting több objektumra (contact, company, deal, activity).</li>
</ul>
<h3>Korlátok</h3>
<ul>
  <li>Licenc költség nő userrel és csomaggal.</li>
  <li>Túl sok kötelező mező lassíthatja a csapatot.</li>
</ul>
<h3>Minimál setup</h3>
<ul>
  <li>Lifecycle: subscriber → lead → MQL/SQL → opportunity → customer.</li>
  <li>Deal pipeline: stage + kötelező mezők (forrás, érték, next step, tulajdonos).</li>
  <li>Workflow példa: form kitöltés → contact + company enrich → deal létrehozás → owner assign.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> HubSpotot választasz, mert marketing automatizmus kell és több objektumra akarsz riportálni; minimál kötelező mezőkkel indulsz.</p>
<p><strong>Rossz:</strong> HubSpotot veszel csak azért, hogy legyen pipeline, miközben nem használod a marketing és workflow részt.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj döntési kritérium listát: mikor HubSpot, mikor Pipedrive.</li>
  <li>Állíts be egy deal pipeline-t kötelező mezőkkel (forrás, érték, next step, tulajdonos).</li>
  <li>Állíts be egy workflow-t: form → contact + company → deal → owner assign.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Hozz létre 3 teszt contactot és 3 dealt, töltsd a mezőket, futtasd a workflow-t, ellenőrizd a riportban.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a döntési kritérium.</li>
  <li>Pipeline + kötelező mezők beállítva.</li>
  <li>Workflow fut.</li>
  <li>3 teszt deal adata rendben.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>HubSpot pipeline beállítás: <a href="https://knowledge.hubspot.com/deals/create-deal-pipelines-and-stages" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/deals/create-deal-pipelines-and-stages</a></li>
  <li>Workflow alapok: <a href="https://knowledge.hubspot.com/workflows/create-workflows" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/workflows/create-workflows</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 22. nap: HubSpot döntés',
    emailBody: `<h1>B2B Értékesítés 2026 – 22. nap</h1>
<p>Megérted, mikor válaszd a HubSpotot, beállítasz minimál pipeline-t és egy workflow-t.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mikor érdemes HubSpotot választani?',
          options: [
            'Ha csak alap pipeline kell marketing nélkül',
            'Ha marketing + sales + automatizmus egy helyen kell',
            'Ha ERP-t keresel',
            'Ha HR rendszert keresel',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a minimál setup része?',
          options: [
            'Lifecycle státuszok + deal pipeline + kötelező mezők + workflow',
            'Csak logó',
            'Csak landing page',
            'Csak prezentáció',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a HubSpot egyik korlátja?',
          options: [
            'Nincs mobil app',
            'Licenc költség nő és komplexebb, mint Pipedrive',
            'Nincs pipeline funkció',
            'Nem tud emailt küldeni',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó workflow példa?',
          options: [
            'Form → contact + company → deal → owner assign',
            'Random emailek küldése',
            'Csak manuális export',
            'Csak Slack üzenet',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 23,
    title: 'Integrációk és adatáramlás alapok',
    content: `<h1>Integrációk és adatáramlás alapok</h1>
<p><em>Feltérképezed, honnan jön az adat (form, email, naptár), hova megy (CRM), és hogyan biztosítod a minőséget.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Megrajzolod az adatáramlást: források → feldolgozás → CRM → riport.</li>
  <li>Definiálsz kötelező mezőket és deduplikációs szabályt.</li>
  <li>Kiválasztasz 1 enrichment vagy validáció lépést.</li>
  <li>Beállítasz egy alap webhook/sync folyamatot.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Adatminőség nélkül a pipeline hibás lesz.</li>
  <li>Manuális export/import időt és adatot veszít.</li>
  <li>Egységes mezők nélkül a riport félrevezető.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Források</h3>
<ul>
  <li>Űrlapok (web, landing).</li>
  <li>Email és naptár (meetingek).</li>
  <li>Enrichment (Clearbit/Clay/ZoomInfo).</li>
  <li>Support/CSM jegyek.</li>
</ul>
<h3>Feldolgozás</h3>
<ul>
  <li>Deduplikáció: email + domain + név.</li>
  <li>Normalizálás: ország, iparág, cégméret.</li>
  <li>Kötelező mezők: forrás, státusz, tulajdonos.</li>
</ul>
<h3>Sink</h3>
<ul>
  <li>CRM: contact/company/deal.</li>
  <li>Activity log: meeting, call, email.</li>
  <li>Riport: dashboard stage konverzióra.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> Form → webhook → enrichment → dedup → CRM contact+company+deal, owner assign, activity log.</p>
<p><strong>Rossz:</strong> CSV export-import hetente, kötelező mezők nélkül, duplázott contactok.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Rajzold fel az adatáramlást (forrás → feldolgozás → sink).</li>
  <li>Írd le a deduplikációs szabályt (email + domain).</li>
  <li>Állíts be kötelező mezőket (forrás, tulajdonos, next step).</li>
  <li>Válassz egy enrichment lépést (pl. iparág automatikus kitöltés).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Hozz létre 1 webhook/sync-et (pl. form → CRM), és ellenőrizd, hogy a mezők és a dedup működik.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan az adatáramlás térkép.</li>
  <li>Van deduplikációs szabály.</li>
  <li>Beállítottad a kötelező mezőket.</li>
  <li>Fut 1 webhook/sync és ellenőrizted.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>HubSpot integrations: <a href="https://knowledge.hubspot.com/integrations" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/integrations</a></li>
  <li>Pipedrive data import: <a href="https://support.pipedrive.com/en/article/how-can-i-import-data-into-pipedrive" target="_blank" rel="noreferrer">https://support.pipedrive.com/en/article/how-can-i-import-data-into-pipedrive</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 23. nap: Integrációk és adat',
    emailBody: `<h1>B2B Értékesítés 2026 – 23. nap</h1>
<p>Megrajzolod az adatáramlást, beállítod a kötelező mezőket, deduplikációt és egy webhookot.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért fontos a deduplikáció?',
          options: [
            'Mert szebb a CRM',
            'Hogy ne legyen duplikált contact és hibás riport',
            'Mert olcsóbb a licenc',
            'Mert így több email megy ki',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó adatút példa?',
          options: [
            'Form → webhook → enrichment → dedup → CRM + activity log',
            'CSV export → email → manuális import',
            'Slack üzenet → semmi',
            'Random táblázat → semmi',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a kötelező mező tipikus listája?',
          options: [
            'Forrás, tulajdonos, next step',
            'Emoji, fotó, hangulat',
            'Csak név',
            'Csak telefonszám',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi az enrichment célja?',
          options: [
            'Díszítés',
            'Adatminőség javítása (iparág, cégméret, domain)',
            'Szórakoztatás',
            'Ár emelése',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 24,
    title: 'CRM higiénia és napi routine',
    content: `<h1>CRM higiénia és napi routine</h1>
<p><em>Bevezeted a napi 10 perces karbantartást és a heti riportot, hogy a pipeline valós maradjon.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Összeállítasz egy napi 10 perces checklistet.</li>
  <li>Beállítasz heti riport nézetet (stage konverzió, cycle time, win rate).</li>
  <li>Bekapcsolsz emlékeztetőt a lejárt next step-ekre.</li>
  <li>Megjelölöd a stale deal szabályt (pl. 14 nap activity nélkül = review).</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Higiénia nélkül a forecast félrevezet.</li>
  <li>Rövid napi routine olcsóbb, mint havi nagy takarítás.</li>
  <li>Stale deal szabály jelzi a kockázatot.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Napi routine (10 perc)</h3>
<ul>
  <li>Lejárt next step-ek frissítése.</li>
  <li>Új activity logolása (call, meeting, email).</li>
  <li>Stage váltás, ha szükséges.</li>
</ul>
<h3>Heti rutin</h3>
<ul>
  <li>Stage konverziók áttekintése.</li>
  <li>Cycle time és bottleneck.</li>
  <li>Lost ok top 5 frissítés.</li>
</ul>
<h3>Automatizmusok</h3>
<ul>
  <li>Lejárt next step értesítés.</li>
  <li>Stale deal report (14 nap activity nélkül).</li>
  <li>Daily digest az elmaradásokról.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> Minden reggel 10 perc: next step frissítés, stage váltás, activity log; heti review riporttal.</p>
<p><strong>Rossz:</strong> Havi egyszer takarítasz, addig a pipeline tele duplikáttal és lejárt taskkal.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj napi checklistet (max 5 pont).</li>
  <li>Állíts be emlékeztetőt a lejárt next step-ekre.</li>
  <li>Készíts heti riport nézetet (stage konverzió, cycle time, win rate).</li>
  <li>Állíts be stale szabályt (pl. 14 nap activity nélkül).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Alkalmazd a checklistet 5 dealen, frissítsd a next step-et és a stage-et.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a napi checklist.</li>
  <li>Fut az emlékeztető.</li>
  <li>Megvan a heti riport nézet.</li>
  <li>Stale szabály beállítva és tesztelve.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>CRM hygiene best practices: <a href="https://www.gong.io/blog/crm-data-cleanup/" target="_blank" rel="noreferrer">https://www.gong.io/blog/crm-data-cleanup/</a></li>
  <li>HubSpot automation példák: <a href="https://knowledge.hubspot.com/workflows/use-workflows-to-manage-crm-data" target="_blank" rel="noreferrer">https://knowledge.hubspot.com/workflows/use-workflows-to-manage-crm-data</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 24. nap: CRM higiénia',
    emailBody: `<h1>B2B Értékesítés 2026 – 24. nap</h1>
<p>Bevezeted a napi 10 perces higiéniai rutint, heti riportot és stale szabályt, hogy a pipeline valós maradjon.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a napi 10 perc rutin célja?',
          options: [
            'Dekoráció',
            'Pipeline valóságának fenntartása',
            'Marketing kampány indítása',
            'HR feladat',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a stale deal szabály tipikus küszöbe?',
          options: [
            '14 nap activity nélkül review',
            '1 nap activity nélkül azonnali zárás',
            '6 hónap activity nélkül',
            'Nincs ilyen',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi tartozik a heti riportba?',
          options: [
            'Stage konverzió, cycle time, win rate',
            'Csapat ebéd menüje',
            'Irodai növények száma',
            'Csak emailek száma',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Havi egyszer takarítasz, addig minden lejár',
            'Minden nap frissíted a next step-et',
            'Be van állítva emlékeztető',
            'Van stale szabály',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 25,
    title: 'Ajánlat struktúra: dönthető proposal',
    content: `<h1>Ajánlat struktúra: dönthető proposal</h1>
<p><em>Olyan ajánlatot írsz, ami döntést támogat: cél, scope, idő, kockázat, bizonyíték, következő lépés.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>1 oldalas ajánlat vázat írsz (cél, scope, idő, kockázatkezelés, proof, next step).</li>
  <li>Beállítasz 3 kötelező mezőt a CRM-ben az ajánlat stage-hez.</li>
  <li>Előkészítesz 1 „decision email” sablont.</li>
  <li>Hozz létre egy „red flag” listát (mi miatt csúszik el az ajánlat).</li>
  <li>AI-t használsz proof és összegzés automatikus beillesztésére.</li>
  <li>Definiálsz egy „review és signoff” folyamatot.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Az ajánlat nem PDF letét, hanem döntési dokumentum.</li>
  <li>Kockázatot és következő lépést kell csökkentenie, nem csak árat mutatni.</li>
  <li>Gyenge proposal = slip + tárgyalási idő nő.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Ajánlat alap blokkjai</h3>
<ul>
  <li>Cél és elvárt hatás.</li>
  <li>Scope (mi benne, mi nincs).</li>
  <li>Idő és mérföldkövek.</li>
  <li>Árazás + diszkont szabály (ha van).</li>
  <li>Kockázatkezelés (kizárások, feltételek).</li>
  <li>Proof (számok, esettanulmány rövid).</li>
  <li>Következő lépés (decision email sablon).</li>
</ul>
<h3>Red flag lista</h3>
<ul>
  <li>Nincs döntéshozó bevonva.</li>
  <li>Nincs kockázat/eltérés kezelve.</li>
  <li>Nincs világos következő lépés és határidő.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Itt az ár, várom a választ.” – nincs cél, kockázat, következő lépés.</p>
<p><strong>Jó:</strong> 1 oldalas döntési dokumentum, ROI/proof pontokkal, világos scope és következő lépés dátummal.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 1 oldalas ajánlat vázat a fenti blokkokkal.</li>
  <li>Írj decision email sablont (kinek, mikor dönt).</li>
  <li>Állíts be 3 kötelező mezőt a CRM ajánlat stage-hez (scope, döntési dátum, next step).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Töltsd ki 1 élő dealhez az új vázat, küldd el decision emaillel.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van 1 oldalas ajánlat váz.</li>
  <li>Van decision email sablon.</li>
  <li>CRM mezők beállítva.</li>
  <li>Alkalmaztad 1 dealre.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Proposal best practices: <a href="https://www.gong.io/blog/sales-proposal/" target="_blank" rel="noreferrer">https://www.gong.io/blog/sales-proposal/</a></li>
  <li>Value-based proposals: <a href="https://www.alexhormozi.com" target="_blank" rel="noreferrer">https://www.alexhormozi.com</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 25. nap: Ajánlat',
    emailBody: `<h1>B2B Értékesítés 2026 – 25. nap</h1>
<p>Írj dönthető, 1 oldalas ajánlatot proof és következő lépés blokkal.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a dönthető ajánlat célja?',
          options: [
            'Csak árlistát adni',
            'Döntést támogatni: cél, scope, kockázat, proof, next step',
            'Szórakoztatni',
            'Hosszú dokumentumot gyártani',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a red flag?',
          options: [
            'Nincs döntési határidő és következő lépés',
            'Van döntési email',
            'Van proof pont',
            'Van scope',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a kötelező blokk?',
          options: [
            'CTA nélküli ár',
            'Cél, scope, idő, kockázat, proof, next step',
            'Csak színes grafika',
            'Csak NDA',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó CRM mező az ajánlat stage-hez?',
          options: [
            'Decision dátum',
            'Profilkép',
            'Emoji',
            'Kedvenc étel',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 26,
    title: 'Árazás 2026-ban: csomagolás és érték',
    content: `<h1>Árazás 2026-ban: csomagolás és érték</h1>
<p><em>Értékalapú árlogikát építesz: minimum csomag, kiegészítők, diszkont szabályok.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Összeállítasz 3 csomagot (good/better/best) vagy 1 minimum + add-on modellt.</li>
  <li>Írsz diszkont szabályt (ki, mikor, mennyi, jóváhagyás).</li>
  <li>Árazási kalkulátort készítesz (alap + opciók + idő).</li>
  <li>Proof-ot kapcsolsz az árhoz (idő/megtakarítás).</li>
  <li>AI-t használod árazási indoklás és összegzés generálásához.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Ár-improvizáció csökkenti a bizalmat és növeli a diszkontot.</li>
  <li>Csomagolás gyorsítja a döntést.</li>
  <li>Diszkont szabály védi a margin-t.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Ár modell</h3>
<ul>
  <li>Minimum csomag: elég a sikerhez, nincs alulméretezve.</li>
  <li>Opciók: kiegészítők (support, integráció, onboarding plusz).</li>
  <li>Idő: éves/kvartális keret, kedvezmény szabállyal.</li>
</ul>
<h3>Diszkont szabály</h3>
<ul>
  <li>Ki adhat, meddig, milyen feltétellel (pl. éves előfizetés, gyors döntés).</li>
  <li>Engedélyezés: sales lead vagy vezetői jóváhagyás.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Ad-hoc ár minden ügyfélnek, nincs szabály.</p>
<p><strong>Jó:</strong> 3 csomag, világos opciók, diszkont szabály dokumentálva.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 3 csomagot vagy minimum + add-on modellt.</li>
  <li>Írj diszkont szabályt és jóváhagyási folyamatot.</li>
  <li>Készíts ár kalkulátort (sheet vagy CRM formula).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Alkalmazd 1 élő dealre az új árazást, kommunikáld a szabályt.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a csomagolás.</li>
  <li>Megvan a diszkont szabály.</li>
  <li>Van kalkulátor.</li>
  <li>Alkalmaztad 1 dealre.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Value-based pricing: <a href="https://www.priceintelligently.com" target="_blank" rel="noreferrer">https://www.priceintelligently.com</a></li>
  <li>Discount guardrails: <a href="https://www.gong.io/blog/discounting/" target="_blank" rel="noreferrer">https://www.gong.io/blog/discounting/</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 26. nap: Árazás',
    emailBody: `<h1>B2B Értékesítés 2026 – 26. nap</h1>
<p>Írj csomagolást, diszkont szabályt, és készíts kalkulátort értékalapon.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell diszkont szabály?',
          options: [
            'Színesebb legyen az árlista',
            'Margin védelme és következetesség',
            'Marketing célból',
            'HR okból',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a minimum csomag elve?',
          options: [
            'A lehető legkisebb ár mindenáron',
            'Elég a sikerhez, nincs alulméretezve',
            'Mindig ingyen',
            'Csak enterprise',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó opció példa?',
          options: [
            'Support szint, integráció, onboarding plusz',
            'Emoji csomag',
            'Toll ajándék',
            'Nincs opció',
          ],
          correctIndex: 0,
        },
        {
          question: 'Ki adhat diszkontot?',
          options: [
            'Bárki bármikor',
            'Szabály szerint kijelölt jóváhagyó',
            'Csak marketing',
            'Csak ügyfélszolgálat',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 27,
    title: 'Beszerzés, jog és biztonság kérdések',
    content: `<h1>Beszerzés, jog és biztonság kérdések</h1>
<p><em>Összeállítasz egy „procurement pack” minimum listát, hogy a deal ne az utolsó héten akadjon el.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Összeírod a procurement pack elemeit (security, DPA, SLA, billing, signing).</li>
  <li>Előkészítesz 1 oldalas security/DPA összefoglalót.</li>
  <li>Készítesz egy „legal/biztonság checklistet” meetinghez.</li>
  <li>Írsz egy sablont: hogyan vonod be a jog/IT-t korán.</li>
  <li>Jelölöd a tipikus red flag-eket (adatút, hozzáférés, compliance).</li>
  <li>AI-t használod a policy összefoglalókra.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Jog/IT késői bevonása slipet okoz.</li>
  <li>Átlátható security anyag csökkenti a kockázatérzetet.</li>
  <li>Előre kész csomag gyorsítja a tárgyalást.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Procurement pack minimum</h3>
<ul>
  <li>Security one-pager (adatkezelés, hosting, hozzáférés, audit).</li>
  <li>DPA/SLA minta.</li>
  <li>Árazási és számlázási feltételek.</li>
  <li>Aláírás folyamata (e-sign, jogi kapcsolattartó).</li>
</ul>
<h3>Bevonás menete</h3>
<ul>
  <li>Discovery során jelzed a jog/IT igényt.</li>
  <li>Küldesz security one-pagert előre.</li>
  <li>Egyezteted a következő lépést (review dátum).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Az ajánlat után derül ki, hogy DPA-t és securityt kell átbeszélni.</p>
<p><strong>Jó:</strong> Discovery után küldesz security one-pagert, egyeztetsz jog/IT review-t.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írd össze a procurement pack listáját és töltsd, amid megvan.</li>
  <li>Írj 1 oldalas security összefoglalót.</li>
  <li>Írj bevonási sablont jog/IT számára.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Küldd ki 1 aktuális dealnél a security one-pagert, egyeztess review dátumot.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a procurement pack listád.</li>
  <li>Van security one-pager.</li>
  <li>Van bevonási sablon.</li>
  <li>Alkalmaztad 1 dealben.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Security one-pager minta: <a href="https://www.notion.so/InfoSec-One-Pager-Template" target="_blank" rel="noreferrer">https://www.notion.so/InfoSec-One-Pager-Template</a></li>
  <li>DPA alapok: <a href="https://gdpr.eu/data-processing-agreement/" target="_blank" rel="noreferrer">https://gdpr.eu/data-processing-agreement/</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 27. nap: Procurement pack',
    emailBody: `<h1>B2B Értékesítés 2026 – 27. nap</h1>
<p>Állíts össze procurement csomagot és vond be korán a jog/IT-t, hogy ne csússzon a deal.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a procurement pack célja?',
          options: [
            'Dekoráció',
            'Gyorsítani a jog/IT döntést és csökkenteni a kockázatérzetet',
            'Marketing kampány',
            'HR dokumentum',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit küldesz előre?',
          options: [
            'Security one-pager + DPA/SLA minta',
            'Csak árat',
            'Csak logót',
            'Csak NDA-t',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Ajánlat után derül ki a DPA igény',
            'Discovery után küldesz anyagot',
            'Review dátumot egyeztetsz',
            'Checklistet küldesz',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mit tartalmaz a one-pager?',
          options: [
            'Adatkezelés, hosting, hozzáférés, audit',
            'Csak színek',
            'Marketing fotó',
            'HR szabályzat',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 28,
    title: 'Objection handling: minták és visszakérdezés',
    content: `<h1>Objection handling: minták és visszakérdezés</h1>
<p><em>3 lépéses kifogáskezelést gyakorolsz: tisztázás, ok feltárás, bizonyíték vagy csereajánlat.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Írsz 5 gyakori kifogást és 3 lépéses válaszát.</li>
  <li>Készítesz visszakérdezés sablont („Mi az aggodalom pontosan?”).</li>
  <li>Összegyűjtöd a proof pontokat kifogásonként.</li>
  <li>AI-t használod alternatív ajánlatok gyors generálására.</li>
  <li>Rögzítesz lost ok kódokat a CRM-ben.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A kifogás gyakran kérés több információra.</li>
  <li>Strukturált válasz gyorsítja a döntést.</li>
  <li>Kódolt lost okból tanulsz.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>3 lépés</h3>
<ul>
  <li>Tisztázás: „Pontosan mi aggaszt?”</li>
  <li>Ok: költség, idő, kockázat, prioritás?</li>
  <li>Válasz: proof vagy csere (scope/idő/ár), vagy ellenjavaslat.</li>
</ul>
<h3>Tipikus kifogások</h3>
<ul>
  <li>Drága → érték + proof + csere (kisebb scope).</li>
  <li>Idő → roadmap + pilot.</li>
  <li>Biztonság → security pack.</li>
  <li>Prioritás → impact/proof, következő lépés időzítése.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Oké, adunk 20% kedvezményt.” – tisztázás nélkül.</p>
<p><strong>Jó:</strong> Tisztázás → ok → proof vagy kisebb scope ajánlat.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj 5 kifogást és a 3 lépéses választ.</li>
  <li>Írj visszakérdezést mindenre.</li>
  <li>Kapcsold proof pontokhoz.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Válaszolj 2 valós kifogásra a sablonnal, rögzítsd a CRM-ben a lost okot ha elveszted.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>5 kifogás + válasz megvan.</li>
  <li>Van visszakérdezés sablon.</li>
  <li>Proof pontok kapcsolva.</li>
  <li>Lost ok kódolva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Objection handling: <a href="https://www.gong.io/blog/objection-handling/" target="_blank" rel="noreferrer">https://www.gong.io/blog/objection-handling/</a></li>
  <li>Challenger: <a href="https://www.challengerinc.com/resources/" target="_blank" rel="noreferrer">https://www.challengerinc.com/resources/</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 28. nap: Kifogáskezelés',
    emailBody: `<h1>B2B Értékesítés 2026 – 28. nap</h1>
<p>Gyakorold a 3 lépéses kifogáskezelést, proof-fal és csereajánlattal.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a 3 lépés első eleme?',
          options: [
            'Azonnali kedvezmény',
            'Tisztázás: mi aggaszt pontosan?',
            'Árvita',
            'NDA aláírása',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Kedvezmény ok nélkül',
            'Tisztázás → ok → proof/csere',
            'Lost ok rögzítése',
            'Proof használata',
          ],
          correctIndex: 0,
        },
        {
          question: 'Miért kódolod a lost okot?',
          options: [
            'Dekoráció',
            'Hogy tanulj a trendekből',
            'HR ok',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a tipikus válasz „drága” kifogásra?',
          options: [
            'Proof + kisebb scope vagy feltételhez kötött kedvezmény',
            'Azonnali nagy kedvezmény',
            'Nincs válasz',
            'Téma váltás',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 29,
    title: 'Closing: döntés és következő lépés',
    content: `<h1>Closing: döntés és következő lépés</h1>
<p><em>Close checklistet és „decision email” sablont készítesz, hogy a döntési folyamat tiszta legyen.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Írsz close checklistet (döntéshozó, kockázat, next step, aláírás folyamata).</li>
  <li>Megírsz 1 decision email sablont.</li>
  <li>Beállítasz aláírás folyamatot (e-sign, felelősök).</li>
  <li>Jelölöd a „go/no-go” kritériumot.</li>
  <li>AI-t használod a deal összefoglalóhoz a döntés előtt.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A closing nem áralku, hanem döntésvezetés.</li>
  <li>Tiszta következő lépés nélkül slip.</li>
  <li>Összefoglaló + döntési email gyorsít.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Close checklist</h3>
<ul>
  <li>Döntéshozó megerősítve.</li>
  <li>Procurement pack átadva és elfogadva.</li>
  <li>Kockázatok kezelve (biztonság, scope).</li>
  <li>Aláírás folyamata, dátum, felelős.</li>
  <li>Next step (kickoff dátum).</li>
</ul>
<h3>Decision email sablon</h3>
<ul>
  <li>Összefoglaló: cél, scope, ár, idő.</li>
  <li>Kockázatkezelés röviden.</li>
  <li>Next step és döntési határidő.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Küldtem ajánlatot, várom a választ.”</p>
<p><strong>Jó:</strong> Összefoglaló + decision email + aláírás folyamat + kickoff dátum egyeztetve.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj close checklistet és döntési email sablont.</li>
  <li>Állíts be aláírás folyamatot (e-sign eszköz, felelősök).</li>
  <li>Alkalmazd 1 aktív dealre.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Küldj decision emailt, egyeztess aláírás dátumot, jelöld a CRM-ben.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van close checklist.</li>
  <li>Van decision email sablon.</li>
  <li>Aláírás folyamat tiszta.</li>
  <li>Alkalmaztad 1 dealre.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Closing technikák: <a href="https://www.gong.io/blog/closing-sales-techniques/" target="_blank" rel="noreferrer">https://www.gong.io/blog/closing-sales-techniques/</a></li>
  <li>Decision email példa: <a href="https://www.gong.io/blog/sales-follow-up-email/" target="_blank" rel="noreferrer">https://www.gong.io/blog/sales-follow-up-email/</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 29. nap: Closing',
    emailBody: `<h1>B2B Értékesítés 2026 – 29. nap</h1>
<p>Close checklistet és decision emailt készítesz, tisztázod az aláírás folyamatát.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a closing fókusza?',
          options: [
            'Árcsökkentés mindenáron',
            'Döntésvezetés, kockázatkezelés, következő lépés',
            'Marketing kampány',
            'HR feladat',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a decision email lényege?',
          options: [
            'Összefoglaló + kockázat + next step + döntési határidő',
            'Csak ár',
            'Csak logó',
            'Csak NDA',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            '„Küldtem ajánlatot, várom a választ.”',
            'Összefoglaló és határidő',
            'Kickoff dátum egyeztetése',
            'Aláírás folyamat tisztázása',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mit tartalmaz a close checklist?',
          options: [
            'Döntéshozó, kockázatkezelés, aláírás folyamata, next step',
            'Csak emoji',
            'Csak ár',
            'Csak marketing',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 30,
    title: 'Capstone sprint: teljes B2B sales kör',
    content: `<h1>Capstone sprint: teljes B2B sales kör</h1>
<p><em>Valós accounton lefuttatod a teljes folyamatot: kutatás, outreach, qualification, discovery, next step, CRM update, ajánlat váz.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Válassz 10 SMB vagy 3 enterprise accountot.</li>
  <li>Futtasd végig a folyamatot 1 accounton teljesen.</li>
  <li>Készíts capstone riportot (cél, mi történt, következő lépés).</li>
  <li>Dokumentáld: account brief, outreach log, discovery notes, qualification döntés, ajánlat váz, 14 napos backlog.</li>
  <li>Mérd: reply, meeting, stage konverzió, next step.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A rendszer értéke a valós futtatás.</li>
  <li>A capstone mutatja, hol a szűk keresztmetszet.</li>
  <li>Előkészíti a következő 2 hét fejlesztését.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Kötelező lépések</h3>
<ul>
  <li>Kutatás + ICP illeszkedés rögzítése.</li>
  <li>Outreach sorozat és log.</li>
  <li>Qualification döntés (igen/nem, miért).</li>
  <li>Discovery jegyzet + next step.</li>
  <li>Pipeline update, kockázat jelölés.</li>
  <li>Ajánlat váz, ha releváns.</li>
</ul>
<h3>Capstone riport</h3>
<ul>
  <li>Cél, lépések, eredmény.</li>
  <li>Hol akadt el, miért.</li>
  <li>Mit változtatsz jövő héten.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> 1 account végigfuttatva, riport és backlog készen.</p>
<p><strong>Rossz:</strong> Csak olvasás, nincs futtatás.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Válassz account listát és jelöld ICP illeszkedést.</li>
  <li>Írd meg az outreachet és logold.</li>
  <li>Futtasd le 1 teljes folyamatot, dokumentálj mindent.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Írj capstone riportot és 14 napos backlogot a fejlesztésekhez.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>1 teljes folyamat végigfuttatva.</li>
  <li>Riport és backlog kész.</li>
  <li>Pipeline és jegyzet frissítve.</li>
  <li>Következő 2 hét terve megvan.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Sales retro minta: <a href="https://www.gong.io/blog/sales-retrospective/" target="_blank" rel="noreferrer">https://www.gong.io/blog/sales-retrospective/</a></li>
  <li>Outreach log tippek: <a href="https://www.saleshacker.com/sales-cadence/" target="_blank" rel="noreferrer">https://www.saleshacker.com/sales-cadence/</a></li>
</ul>`,
    emailSubject: 'B2B Értékesítés 2026 – 30. nap: Capstone',
    emailBody: `<h1>B2B Értékesítés 2026 – 30. nap</h1>
<p>Végigfuttatsz 1 valós accountot, riportot és backlogot készítesz a következő 2 hétre.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a capstone fő célja?',
          options: [
            'Olvasás',
            'Valós folyamat lefuttatása és dokumentálása',
            'Marketing anyag készítése',
            'HR interjú',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi kötelező elem?',
          options: [
            'Account brief, outreach log, discovery notes, qualification döntés',
            'Csak logó',
            'Csak NDA',
            'Csak ár',
          ],
          correctIndex: 0,
        },
        {
          question: 'Miért kell riport?',
          options: [
            'Dekoráció',
            'Tanulság és következő lépés kijelölése',
            'HR',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Nem futtatod le a folyamatot, csak olvasol',
            'Dokumentálsz és futtatsz',
            'Backlogot írsz',
            'Kockázatot jelölsz',
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
  console.log('Seeded B2B Értékesítés 2026 Masterclass (HU) with first 30 lessons.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
