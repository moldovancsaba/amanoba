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
    title: 'Miért vizuális nyelv, nem „stílus”',
    content: `<h1>Miért vizuális nyelv, nem „stílus”</h1>
<p><em>A stílus ízlés, a vizuális nyelv szabályrendszer. Az egyik személyfüggő, a másik skálázható.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>1 mondatban el tudod mondani a különbséget stílus és vizuális nyelv között.</li>
  <li>Fel tudsz sorolni 3 következményt, ha nincs vizuális nyelv.</li>
  <li>Írsz egy „vizuális szándék” mondatot a saját termékedhez.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Stílus = vélemény; vizuális nyelv = szabály, ezért skálázható.</li>
  <li>Csapatban csak dokumentált, átadható döntések működnek.</li>
  <li>A vizuális káosz hitelt rombol és support költséget emel.</li>
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
<p><strong>Jó:</strong> „Primary CTA: #111827 szöveg #FAB908 háttéren, 12x16 px padding, enyhe shadow. Más CTA nem használhat sárgát.” – szabály, nem ízlés.</p>
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
  <li>Van 1 mondatos vizuális szándék mondat.</li>
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
</ul>
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
  {
    day: 4,
    title: 'Trend vagy alapelv? Így fordítsd rendszerbe',
    content: `<h1>Trend vagy alapelv? Így fordítsd rendszerbe</h1>
<p><em>Megkülönbözteted, mi a múló trend, mi az időtálló alapelv, és mindegyiket konkrét szabállyá fordítod.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>3 szempont alapján el tudod dönteni, mi trend és mi alapelv.</li>
  <li>Minden trendhez ki tudod vezetni az alapelvet és a rendszer-szabályt.</li>
  <li>Készítesz egy „Trend intake” sablont a csapatnak.</li>
  <li>Kijelölsz 1-2 trendet, amit rendszer-szinten beépítesz, és 1-2-t, amit elengedsz.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Trend chasing széttöri a koherenciát.</li>
  <li>Az alapelv időtálló, a trend csak felszín.</li>
  <li>Rendszer nélkül a trend csak dekoráció, nem szabály.</li>
  <li>Egy jó rendszer „megemészti” a trendet anélkül, hogy szétesne.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Trend</h3>
<ul>
  <li>Rövid életű, vizuális felszín (pl. glassmorphism, soft shadow).</li>
  <li>Gyakran ütközik hozzáférhetőséggel vagy branddel.</li>
  <li>Nem mindig hordoz funkcionális jelentést.</li>
</ul>
<h3>Alapelv</h3>
<ul>
  <li>Humán percepciós igazság (kontraszt, hierarchia, affordance, olvashatóság).</li>
  <li>Időtálló: 10 év múlva is releváns.</li>
  <li>Minden trend mögött felfedezhető egy alapelv.</li>
</ul>
<h3>Rendszer</h3>
<ul>
  <li>Implementált szabály és minta, ami skálázható.</li>
  <li>Tokenekkel, komponensekkel, dokumentációval él.</li>
  <li>Az alapelvet fordítja le döntésekre.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Trend:</strong> Glassmorphism</p>
<p><strong>Alapelv:</strong> Rétegzettség, mélység, kontraszt.</p>
<p><strong>Rendszer-szabály:</strong> „Másodlagos kártyán 85% blur + 6% átlátszóság, min. 4.5:1 kontraszt.”</p>
<p><strong>Trend:</strong> Brutalista neon CTA</p>
<p><strong>Alapelv:</strong> Egyértelmű kiemelés, erős affordance.</p>
<p><strong>Rendszer-szabály:</strong> „Primary CTA: #FAB908 háttér, #111827 szöveg, 12x16 px, döntött shadow; máshol sárga tilos.”</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj le 3 aktuális trendet, amit látsz a piacodon.</li>
  <li>Mindegyikhez írd mellé az alapelvet (mit szolgál?) és a kockázatot (pl. kontraszt, zaj, brand-fit).</li>
  <li>Fogalmazz meg rendszer-szabályt 1 trendre (token, komponens, használati korlát).</li>
  <li>Hozz létre „Trend-értékelő lapot”: trend neve, alapelv, szabály, hol használható, tiltások, mérés.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Válassz 1 trendet, építsd be egy komponens állapotába, és dokumentáld a korlátokat (hol nem használható).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Legalább 1 trendet lefordítottál alapelvre és rendszerre.</li>
  <li>Van „Trend intake” sablonod.</li>
  <li>Van tiltási szabály (hol nem használható).</li>
  <li>Az alkalmazott trend megfelel a hozzáférhetőségi szabályoknak.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Nielsen Norman Group – Design Trends: <a href="https://www.nngroup.com/articles/design-trends/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/design-trends/</a></li>
  <li>WCAG kontraszt kalkulátor: <a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noreferrer">https://webaim.org/resources/contrastchecker/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 4. nap: Trend vagy alapelv?',
    emailBody: `<h1>Playbook 2026 – 4. nap</h1>
<p>Trendből alapelvet, alapelvből rendszert csinálsz, és kapsz egy „Trend intake” sablont.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a különbség trend és alapelv között?',
          options: [
            'Trend időtálló, alapelv rövid életű',
            'Trend felszín, alapelv percepciós igazság, ami 10 év múlva is áll',
            'Trend kötelező, alapelv opcionális',
            'Nincs különbség',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért veszélyes trendet rendszer nélkül beemelni?',
          options: [
            'Mert olcsó',
            'Mert koherenciát törhet és hozzáférhetőséget ronthat',
            'Mert gyorsítja a fejlesztést',
            'Mert mindig jobb',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a „Trend intake” sablon szerepe?',
          options: [
            'Képek gyűjtése',
            'Trend → alapelv → szabály → hol használható → tiltások → mérés',
            'Marketing szlogen',
            'Árlista készítése',
          ],
          correctIndex: 1,
        },
        {
          question: 'Melyik jó rendszer-szabály egy trendhez?',
          options: [
            '„Tedd mindenhová.”',
            '„Csak másodlagos kártyán blur 85% + 6% átlátszóság, min. 4.5:1 kontraszt.”',
            '„Legyen szép.”',
            '„Amikor kedvünk van.”',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 5,
    title: 'Vizuális szándék (VIS) megfogalmazása',
    content: `<h1>Vizuális szándék (VIS) megfogalmazása</h1>
<p><em>Írsz egy egymondatos, mérhető vizuális szándékot, ami minden döntésnek irányt ad.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Megírsz egy tömör Visual Intent Statementet (hang, tonalitás, sűrűség, merészség, mozgás).</li>
  <li>Felállítasz 3-5 tengelyt (pl. melegség ↔ technikai, játékos ↔ komoly).</li>
  <li>Készítesz vizuális példákat (jó/rossz) a szándékhoz.</li>
  <li>Összekötöd a szándékot a tokenekkel (pl. színtartomány, tipó súlyok, mozgás-idők).</li>
  <li>Beépíted a Playbook elejére.</li>
  <li>Biztosítod, hogy minden döntésnél alkalmazod a szándékot.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Egységes irányt ad, csökkenti a vita-időt.</li>
  <li>Segít, hogy minden komponens ugyanazt az élményt közvetítse.</li>
  <li>Segít dönteni, mikor utasíts el egy trendet.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Visual Intent Statement (VIS)</h3>
<ul>
  <li>1 mondat: „A termékünk vizuális nyelve <strong>[hangulat]</strong>, miközben <strong>[üzleti cél]</strong>; a <strong>[sűrűség]</strong>, <strong>[merészség]</strong>, <strong>[mozgás]</strong> skálán itt helyezkedik el.”</li>
  <li>Legyen mérhető (pl. „CTA kontraszt min. 7:1”, „animáció 150–250 ms ease-in-out”).</li>
</ul>
<h3>Tengelyek</h3>
<ul>
  <li>Melegség ↔ Technikai</li>
  <li>Barátságos ↔ Formális</li>
  <li>Sűrű ↔ Levegős</li>
  <li>Statikus ↔ Mozgékony</li>
  <li>Merész ↔ Visszafogott</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Jó:</strong> „Visual Intent: barátságos-tech, levegős, visszafogott mozgás. CTA #FAB908, szöveg #111827, tipó Inter 600, spacing 8-12-16, animáció 180 ms ease.”</p>
<p><strong>Rossz:</strong> „Legyen menő, startupos.” – nem mérhető, nem irány.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írd meg a VIS-t az 5 tengellyel, 1 mondatban.</li>
  <li>Kapcsold össze tokenekkel: fő színpár, tipó súlyok, spacing skála, animáció időzítés.</li>
  <li>Adj 2 vizuális példát (jó/rossz) és rövid magyarázatot.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Mutasd meg egy fejlesztőnek a VIS-t, kérd, hogy értelmezze 1 komponensre (pl. kártya), és finomítsátok.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van 1 mondatos VIS.</li>
  <li>A VIS összekötve tokenekkel és komponensekkel.</li>
  <li>Van jó/rossz példa, ami illusztrálja.</li>
  <li>A VIS a Playbook elején szerepel.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>IDEO – Design Language: <a href="https://www.ideo.com/blog/design-language-systems" target="_blank" rel="noreferrer">https://www.ideo.com/blog/design-language-systems</a></li>
  <li>Atlassian Voice & Tone: <a href="https://atlassian.design/foundations/voice-and-tone" target="_blank" rel="noreferrer">https://atlassian.design/foundations/voice-and-tone</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 5. nap: Visual Intent Statement',
    emailBody: `<h1>Playbook 2026 – 5. nap</h1>
<p>Megírod az 1 mondatos Visual Intent Statementet, tengelyekkel és tokenekkel összekötve.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mitől jó a Visual Intent Statement?',
          options: [
            'Hosszú és homályos',
            '1 mondat, tengelyekkel, mérhető elemekkel, tokenekhez kötve',
            'Csak egy hangulatkép',
            'Csak betűtípus neve',
          ],
          correctIndex: 1,
        },
        {
          question: 'Melyik jó tengely-pár?',
          options: [
            'Sűrű ↔ Levegős',
            'Logó ↔ Ár',
            'Fotó ↔ Ikon',
            'Szöveg ↔ Video',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            '„Legyen menő, startupos.”',
            '„Barátságos-tech, levegős, visszafogott mozgás, CTA sárga #FAB908, animáció 180ms.”',
            '„Kontraszt min. 7:1.”',
            '„Tipó Inter/600, spacing 8-12-16.”',
          ],
          correctIndex: 0,
        },
        {
          question: 'Miért kell a VIS-t tokenekhez kötni?',
          options: [
            'Hogy dekoratív legyen',
            'Hogy a szándék mérhető és implementálható legyen komponensekben',
            'Hogy marketing anyagot készítsünk',
            'Hogy hosszabb legyen a dokumentum',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 6,
    title: 'Szín mint jelentés, nem dekoráció',
    content: `<h1>Szín mint jelentés, nem dekoráció</h1>
<p><em>Felépíted a szemantikus színrendszert (brand + funkcionális), kontraszt-kész és dokumentált.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Létrehozol egy szemantikus színkészletet (brand + funkcionális státuszok).</li>
  <li>Kontraszt-értékeket rendelsz (WCAG 4.5:1 / 7:1).</li>
  <li>Tokenizálod: background, surface, text, border, state szintek.</li>
  <li>Definiálsz tiltásokat (hol nem használható a brand szín).</li>
  <li>Dokumentálod jó/rossz példákkal.</li>
  <li>Összekötöd a Visual Intent Statementtel.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A szín jelentést hordoz (affordance, állapot), nem dísz.</li>
  <li>Kontraszt nélkül bukik a használhatóság.</li>
  <li>Tokenizálás nélkül nem skálázódik a rendszer.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Szemantikus tér</h3>
<ul>
  <li>Brand: primary, secondary, accent (ritkán).</li>
  <li>Funkcionális: success, warning, danger, info, neutral.</li>
  <li>Felületek: background, surface, overlay.</li>
  <li>Szöveg: default, muted, inverse.</li>
</ul>
<h3>Token példa</h3>
<ul>
  <li><code>color.brand.primary</code> = #FAB908</li>
  <li><code>color.text.primary</code> = #111827</li>
  <li><code>color.semantic.success.bg</code> = #DCFCE7</li>
  <li><code>color.semantic.success.text</code> = #166534</li>
  <li><code>color.border.muted</code> = rgba(0,0,0,0.08)</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Brand sárga minden státuszra → elveszik a jelentés, nincs kontraszt.</p>
<p><strong>Jó:</strong> Brand sárga csak primary CTA; success zöld, warning borostyán, danger piros, mind kontraszt ellenőrizve.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Rajzold fel a szemantikus színteret: brand, funkcionális státuszok, surface, text.</li>
  <li>Adj hex értékeket és kontraszt-ellenőrzést a text/surface párokra (min. 4.5:1, body; 7:1, small text).</li>
  <li>Készíts tiltáslistát: hol nem használható a brand szín (pl. hibaállapot, passzív elem).</li>
  <li>Dokumentáld jó/rossz példával (screenshot vagy leírás).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Alkalmazd a színrendszert 1 komponensre (pl. kártya): háttér, szöveg, border, hover/focus, állapot-változatok.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Megvan a szemantikus színkészlet (brand + funkcionális).</li>
  <li>Kontraszt-értékek dokumentálva.</li>
  <li>Token névlista kész.</li>
  <li>Tilalmi lista létezik.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>WCAG 2.2 kontraszt: <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html</a></li>
  <li>Material 3 Color System: <a href="https://m3.material.io/styles/color/overview" target="_blank" rel="noreferrer">https://m3.material.io/styles/color/overview</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 6. nap: Színrendszer',
    emailBody: `<h1>Playbook 2026 – 6. nap</h1>
<p>Felépíted a szemantikus színrendszert (brand + funkcionális), kontrasztoltan és dokumentálva.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért nem elég a brand szín mindenre?',
          options: [
            'Mert túl szép lenne',
            'Mert elveszíti a jelentést és kontraszt-problémát okozhat',
            'Mert drága',
            'Mert csak sötét módban működik',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit jelent a szemantikus színtér?',
          options: [
            'Dekoratív paletta',
            'Brand + funkcionális státuszok + felület + szöveg szerepek',
            'Csak háttérszín',
            'Csak logó színei',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a minimum kontraszt ajánlás szövegre?',
          options: [
            '1:1',
            '4.5:1 normál szövegre (7:1 kicsi szövegre)',
            '2:1 mindenre',
            'Nincs szabály',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó példa tiltásra?',
          options: [
            'Brand sárga hiba állapotban',
            'Brand sárga csak primary CTA, hiba piros, warning borostyán',
            'Minden gomb szivárvány',
            'Semmire nincs tiltás',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 7,
    title: 'Tipográfia: hierarchia és hang magyarul',
    content: `<h1>Tipográfia: hierarchia és hang</h1>
<p><em>Felépíted a tipórendszert: szerepek, méretek, súlyok, sorhossz (karakterszám), ritmus, hang.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Definiálsz tipó szerepeket (display, h1–h6, body, caption, code).</li>
  <li>Beállítod a ritmust (line-height, spacing, max sorhossz).</li>
  <li>Összekötöd a Visual Intenttel (hang, formalitás, sűrűség).</li>
  <li>Dokumentálsz jó/rossz példákat.</li>
  <li>Alkalmazod egy képernyőre.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A tipó teremti meg a hierarchiát.</li>
  <li>Hangot és bizalmat közvetít.</li>
  <li>Sorhossz és ritmus hat a használhatóságra.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Szerepek</h3>
<ul>
  <li>Display/Hero (kiemelés, ritkábban).</li>
  <li>H1–H6 (struktúra, 1.2–1.4 line-height).</li>
  <li>Body (14–16px, 1.5–1.7 line-height, 60–75 karakter sorhossz).</li>
  <li>Caption/Label (12–13px, kontraszt erősebb).</li>
  <li>Code/Mono (fix-szélesség, kisebb sorhossz).</li>
</ul>
<h3>Hang</h3>
<ul>
  <li>Súly: mennyire merész?</li>
  <li>Kerek vs szögletes betűforma.</li>
  <li>Spacing: mennyire levegős?</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Ugyanaz a méret mindenhol, nincs kontraszt.</p>
<p><strong>Jó:</strong> H1 32/40, H2 24/32, body 16/24, caption 12/16, max 70 karakter, konzisztens margin-top/bottom.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Hozd létre a tipó-mátrixot: szerep, méret, sor-köz, súly, letter-spacing.</li>
  <li>Állíts be max sorhosszt (60–75 karakter) és title spacinget.</li>
  <li>Kapcsold össze a VIS-sel (pl. formális → kisebb spacing, nagyobb súly).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Alkalmazd egy képernyőre (landing szekció), készíts jó/rossz összevetést.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Tipó szerepek definiálva.</li>
  <li>Sorhossz, line-height rögzítve.</li>
  <li>Hang kötve a VIS-hez.</li>
  <li>Jó/rossz példa dokumentálva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Better Web Type: <a href="https://betterwebtype.com/articles/" target="_blank" rel="noreferrer">https://betterwebtype.com/articles/</a></li>
  <li>Material 3 Type roles: <a href="https://m3.material.io/styles/typography/overview" target="_blank" rel="noreferrer">https://m3.material.io/styles/typography/overview</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 7. nap: Tipográfia mint rendszer',
    emailBody: `<h1>Playbook 2026 – 7. nap</h1>
<p>Felépíted a tipó-rendszert: szerepek, ritmus, hang, kontraszt.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a jó sorhossz body szövegre?',
          options: ['20–30 karakter', '60–75 karakter', '120+ karakter', 'Nincs szabály'],
          correctIndex: 1,
        },
        {
          question: 'Miért fontos a tipó szerepek definiálása?',
          options: [
            'Dekoráció miatt',
            'Hierarchiát és hangot ad, konzisztens döntést biztosít',
            'Csak marketing miatt',
            'Csak nyomtatásnál számít',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Minden szöveg azonos méretben, line-height nélkül',
            'Body 16/24, H1 32/40, max 70 karakter',
            'H2 24/32, caption 12/16',
            'Konzisztens spacing',
          ],
          correctIndex: 0,
        },
        {
          question: 'Melyik tengely befolyásolja a tipó hangját?',
          options: ['Melegség/formalitás', 'Árlista', 'Backend nyelv', 'CI/CD'],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 8,
    title: 'Forma és ritmus: milyen érzetet kelt?',
    content: `<h1>Forma és ritmus: milyen érzetet kelt?</h1>
<p><em>Megtanulod, hogyan közvetít jelentést a forma (kerek vs. szögletes), a ritmus (ismétlődés), és hogyan kerüld a vizuális zajt.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Formákhoz jelentést rendelsz (bizalom, technikai, játékos).</li>
  <li>Ritmust építesz: ismétlődés, mintázat, modul.</li>
  <li>Definiálsz állapot- és affordance-jelzéseket (shadow, border, radius).</li>
  <li>Elkerülöd a zajt: következetes kerekítések, moduláris grid.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Forma érzelmet közvetít.</li>
  <li>Ritmus segít a navigációban.</li>
  <li>Következetlen radius vagy shadow bizalomvesztést okoz.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Forma-jelentés</h3>
<ul>
  <li>Kerek: barátságos, safe.</li>
  <li>Szögletes: technikai, határozott.</li>
  <li>Radius skála: xs, sm, md, lg, full – használati szabályokkal.</li>
</ul>
<h3>Ritmus</h3>
<ul>
  <li>Ismétlődő modul (pl. 8px alap), következetes gap-ek.</li>
  <li>Shadow és border csak akkor, ha affordance-t jelez.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Minden kártya más radius, véletlenszerű shadow.</p>
<p><strong>Jó:</strong> Radius skála: kártya md, gomb lg, chip full; shadow csak kattintható elemen.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Határozd meg a radius skálát (xs/sm/md/lg/full) és rendeld hozzá komponensekhez.</li>
  <li>Definiáld, mikor használhatsz shadowt/bordert (affordance-szabály).</li>
  <li>Írj rövid jelentés-táblát: kerek ↔ barátságos, szögletes ↔ tech.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Alkalmazd egy kártyarácsra: radius, shadow, gap, modul-ritmus.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Radius skála létezik, komponensekhez rendelve.</li>
  <li>Shadow/border szabályok dokumentálva.</li>
  <li>Jelentés-tábla készen van.</li>
  <li>Jó/rossz példák dokumentálva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>IBM Carbon Radius tokens: <a href="https://carbondesignsystem.com/elements/shape" target="_blank" rel="noreferrer">https://carbondesignsystem.com/elements/shape</a></li>
  <li>Design affordance alapok: <a href="https://www.nngroup.com/articles/affordances-heuristics/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/affordances-heuristics/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 8. nap: Forma és ritmus',
    emailBody: `<h1>Playbook 2026 – 8. nap</h1>
<p>Forma- és ritmus-szabályokat hozol létre, radius/affordance táblával.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mit jelent a következetes radius skála?',
          options: [
            'Minden komponens eltérő, következetlen radius',
            'Előre definiált xs–full értékek, komponenshez rendelve',
            'Csak kerek gombok',
            'Nincs jelentősége',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mikor használjunk shadowt?',
          options: [
            'Mindig, mert szép',
            'Csak affordance jelzésre (kattintható/kiugró elem)',
            'Soha',
            'Csak mobilon',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a forma-jelentés rossz párosítása?',
          options: [
            'Kerek ↔ barátságos',
            'Szögletes ↔ technikai',
            'Kerek ↔ rideg, elutasító',
            'Radius skála ↔ szabályozott használat',
          ],
          correctIndex: 2,
        },
        {
          question: 'Mi a ritmus alapja?',
          options: [
            'Véletlenszerű gap-ek',
            'Moduláris ismétlődés (pl. 8px alap), konzisztens gap',
            'Csak színek',
            'Csak tipográfia',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 9,
    title: 'Mozgás és visszajelzés nyelve',
    content: `<h1>Mozgás és visszajelzés nyelve</h1>
<p><em>Időzítésekkel, görbékkel, állapotokkal szabályozod a mozgást: támogasson, ne zavarjon.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Definiálsz alap időzítéseket (150–300ms) és easing görbéket.</li>
  <li>Állapotokra szabályt írsz (hover, focus, active, success, error).</li>
  <li>Hanghoz igazítod (pl. visszafogott vs játékos).</li>
  <li>Elkerülöd a mozgás-zajt, preferálod a jelentést.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Visszajelzés nélkül bizonytalan a felhasználó.</li>
  <li>Túl sok mozgás fárasztó, akadálymentességi kockázat.</li>
  <li>Következetes mozgás → gyorsabb értés.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Időzítések</h3>
<ul>
  <li>Mikrointerakció: 150–200 ms, ease-out.</li>
  <li>Modal/overlay: 200–250 ms, ease-in-out.</li>
  <li>Oldal/útvonal: 250–300 ms, ease-in-out.</li>
</ul>
<h3>Állapotok</h3>
<ul>
  <li>Hover: finom fény vagy max 1.02-es skála.</li>
  <li>Fókusz: látható, kontrasztos kontúr.</li>
  <li>Aktív: enyhe süllyesztés.</li>
  <li>Siker/Hiba: szín + ikon + rövid mozgás (pl. halványítás/csúsztatás).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> 600ms bounce animáció minden gombon.</p>
<p><strong>Jó:</strong> CTA hover 150ms ease-out, focus kontúr 3px, active -2px translateY.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj mozgás-tokeneket: duration.xs/sm/md, easing.standard, easing.entrance, easing.exit.</li>
  <li>Definiáld állapot-szabályokat CTA-ra (hover/focus/active) és kártyára.</li>
  <li>Adj példát success/error visszajelzésre (ikon + szín + mozgás).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Implementálj egy komponenst (pl. CTA) a szabályokkal, rögzítsd videón vagy gifben.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Időzítés- és easing-táblázat megvan.</li>
  <li>Állapot-szabályok dokumentálva.</li>
  <li>Jó/rossz példa létezik.</li>
  <li>Akadálymentességi szempont (prefers-reduced-motion) figyelembe véve.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Material Motion: <a href="https://m3.material.io/styles/motion/overview" target="_blank" rel="noreferrer">https://m3.material.io/styles/motion/overview</a></li>
  <li>Prefers-reduced-motion: <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion" target="_blank" rel="noreferrer">https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 9. nap: Mozgás és feedback',
    emailBody: `<h1>Playbook 2026 – 9. nap</h1>
<p>Időzítés- és állapotszabályokat írsz, hogy a mozgás támogassa az értelmet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a tipikus micro-interaction időzítés?',
          options: ['50ms', '150–200ms', '600ms', '1s felett'],
          correctIndex: 1,
        },
        {
          question: 'Miért rossz a túl sok mozgás?',
          options: [
            'Mert olcsó',
            'Zavar, fáraszt, akadálymentességi probléma lehet',
            'Mert gyorsít',
            'Nincs hatása',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a helyes fókusz jelzés?',
          options: [
            'Láthatatlan',
            'Látható, kontrasztos kontúr (pl. 3px), egységes szabály',
            'Bounce animáció 600ms',
            'Csak hover',
          ],
          correctIndex: 1,
        },
        {
          question: 'Melyik állapot-szabály jó CTA-ra?',
          options: [
            'Hover 150ms ease-out, active -2px translateY, focus kontúr',
            'Hover 800ms bounce, active 3x scale',
            'Nincs állapot',
            'Random időzítés',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 10,
    title: 'Hozzáférhetőség tervezési alapszabály',
    content: `<h1>Hozzáférhetőség tervezési alapszabály</h1>
<p><em>WCAG-alapokat építesz a rendszerbe: kontraszt, fókusz, billentyűkezelés, mozgás, olvashatóság.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>WCAG alapok: kontraszt, fókusz, billentyű-navigáció, ARIA.</li>
  <li>Prefers-reduced-motion figyelembevétele.</li>
  <li>Alt szövegek, űrlap label kötelező szabályai.</li>
  <li>Checklistet készítesz a Playbookhoz.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Jogszabály, reputáció, inkluzivitás.</li>
  <li>Jobb használhatóság mindenkinek.</li>
  <li>A rendszer nem lehet „szép, de használhatatlan”.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Kontraszt: szöveg 4.5:1 (kis szöveg 7:1).</li>
  <li>Fókusz: látható, billentyűvel elérhető.</li>
  <li>Billentyű-navigáció: tab sorrend, skip link.</li>
  <li>MoZGÁS: prefers-reduced-motion media query.</li>
  <li>ARIA: role, label, describedby alapok.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Láthatatlan fókusz, 2:1 kontraszt, autoplay animáció.</p>
<p><strong>Jó:</strong> 4.5:1 kontraszt, fókusz-gyűrű, tab sorrend, reduce-motion fallback.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj A11Y checklistet: kontraszt, fókusz, tab sorrend, aria-label, alt text.</li>
  <li>Kapcsold a szín- és tipó-rendszerhez (kontraszt táblázat).</li>
  <li>Állítsd be a prefers-reduced-motion fallbackot.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Ellenőrizd egy képernyődet a checklist ellen, készíts hibajegyet a hiányokról.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Checklist készen van.</li>
  <li>Kontraszt és fókusz szabály dokumentálva.</li>
  <li>Reduce-motion beállítva.</li>
  <li>Alt/label kötelező.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>WCAG 2.2 összefoglaló: <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noreferrer">https://www.w3.org/WAI/standards-guidelines/wcag/</a></li>
  <li>Deque contrast guide: <a href="https://www.deque.com/blog/color-contrast-accessibility-tools/" target="_blank" rel="noreferrer">https://www.deque.com/blog/color-contrast-accessibility-tools/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 10. nap: Hozzáférhetőség',
    emailBody: `<h1>Playbook 2026 – 10. nap</h1>
<p>Beépíted a WCAG-alapokat a rendszerbe: kontraszt, fókusz, tab, reduce-motion, alt/label.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a minimum kontraszt normál szövegre?',
          options: ['2:1', '4.5:1', '7:1 mindenre', 'Nincs szabály'],
          correctIndex: 1,
        },
        {
          question: 'Mi a fókusz szabály lényege?',
          options: [
            'Láthatatlan legyen',
            'Látható kontúr, tab-bal elérhető, konzisztens',
            'Csak egérrel működjön',
            'Csak mobilon legyen',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit jelent a prefers-reduced-motion?',
          options: [
            'Több animációt kér a felhasználó',
            'Kevesebb/none animációt, ezért csökkentett mozgást kell adni',
            'Nem létezik',
            'Betűtípus beállítás',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi tartozik az A11Y checklistbe?',
          options: [
            'Kontraszt, fókusz, tab sorrend, aria-label/alt, reduce-motion',
            'Csak színek',
            'Csak árlista',
            'Csak logó',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 11,
    title: 'Grid, ami skálázódik',
    content: `<h1>Grid, ami skálázódik</h1>
<p><em>Fix + fluid gridet építesz, ami bírja a különböző tartalomhosszakat és nézetméreteket.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Definiálsz grid típust (12 oszlop, 8/12/16 modul, container max-width).</li>
  <li>Kezelsz töréspontokat (xs–xl) konzisztens szabályokkal.</li>
  <li>Készítesz layout tokeneket (gap, gutter, margin).</li>
  <li>Dokumentálsz példákat (kártyarács, form, dashboard).</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Grid hiányában szétesik a vizuális ritmus.</li>
  <li>Skálázhatóság: új modulok, új töréspontok kezelésével.</li>
  <li>Fejlesztői sebesség: ismert konténer- és gap-szabályok.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Container: 1200–1440 px max szélesség, középre igazítva, 24 px belső margó.</li>
  <li>Oszlopok: 12 oszlop, gutter 16–24 px.</li>
  <li>Töréspontok: xs 360, sm 640, md 768, lg 1024, xl 1280, 2xl 1440.</li>
  <li>Gap tokenek: gap.xs=8, sm=12, md=16, lg=24.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Minden oldal más max-widthtel és össze-vissza gapekkel.</p>
<p><strong>Jó:</strong> 12 oszlopos grid, egységes gutter, konzisztens breakpoint-szabályok.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Állítsd be a container és grid paramétereket (oszlop, gutter, margin).</li>
  <li>Definiáld a töréspontokat és a gap tokeneket.</li>
  <li>Készíts két példát: kártyarács + form layout a gridre.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Dokumentáld a gridet a Playbookban, linkkel Figma/Storybook példákra.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Container, oszlop, gutter, breakpoint definiálva.</li>
  <li>Gap tokenek listázva.</li>
  <li>Példák dokumentálva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Bootstrap grid history: <a href="https://getbootstrap.com/docs/5.3/layout/grid/" target="_blank" rel="noreferrer">https://getbootstrap.com/docs/5.3/layout/grid/</a></li>
  <li>Utopia responsive fluid type/grid: <a href="https://utopia.fyi" target="_blank" rel="noreferrer">https://utopia.fyi</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 11. nap: Grid, ami skálázódik',
    emailBody: `<h1>Playbook 2026 – 11. nap</h1>
<p>12 oszlopos, töréspontokra hangolt gridet építesz, gap tokenekkel.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a tipikus max-width egy desktop containerre?',
          options: ['600px', '1200–1440px', '320px', 'Nincs szükség max-widthre'],
          correctIndex: 1,
        },
        {
          question: 'Miért kell egységes gutter?',
          options: [
            'Dekoráció',
            'Konzisztens ritmus és fejlesztői sebesség',
            'Csak mobilon számít',
            'Nem számít',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit tartalmazzon a grid dokumentáció?',
          options: [
            'Csak logókat',
            'Oszlop/gutter/margin értékeket, breakpoints, példákat',
            'Árlistát',
            'Csak szöveget',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó példa?',
          options: [
            'Random gap értékek',
            '12 oszlop, 16–24px gutter, fix breakpoints',
            'Nincs breakpoint',
            'Csak inline grid',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 12,
    title: 'Spacing mint nyelvtan',
    content: `<h1>Spacing mint nyelvtan</h1>
<p><em>Spacing scale-t hozol létre, ami ritmust és konzisztenciát ad minden komponenshez.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Spacing skála (4/8/12/16/24/32) és használati szabályok.</li>
  <li>Vertikális ritmus (margin-top/bottom) egységesítése.</li>
  <li>Komponensekhez token hozzárendelés (pl. kártya padding md, szekció lg).</li>
  <li>„Ne használj véletlen px-értékeket” szabály bevezetése.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Spacing adja a vizuális nyugalmat vagy sűrűséget.</li>
  <li>Következetlenség = vizuális zaj.</li>
  <li>Gyorsabb build: ismert padding/gap tokenek.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Alap egység: 4 vagy 8.</li>
  <li>Tokenek: space.xs=4, sm=8, md=12/16, lg=24, xl=32.</li>
  <li>Vertikális ritmus: heading utáni margin-top/bottom fix értékek.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> 5, 7, 11 px-ek vegyesen.</p>
<p><strong>Jó:</strong> Csak tokenből választott spacing, komponens-dokumentációval.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Hozd létre a spacing tokeneket és írd mellé a használatot (pl. section padding xl, kártya padding md).</li>
  <li>Állíts be heading utáni margin szabályokat.</li>
  <li>Alkalmazd egy layoutra, és jelöld a forrás tokeneket.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Auditálj egy meglévő oldalt, cseréld tokenre az elszórt értékeket.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Spacing skála létezik.</li>
  <li>Vertikális ritmus dokumentálva.</li>
  <li>Random px-ek felszámolva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>8pt Grid: <a href="https://builttoadapt.io/intro-to-the-8-point-grid-system-d2573cde8632" target="_blank" rel="noreferrer">https://builttoadapt.io/intro-to-the-8-point-grid-system-d2573cde8632</a></li>
  <li>Spacing tokens példa: <a href="https://atlassian.design/foundations/spacing" target="_blank" rel="noreferrer">https://atlassian.design/foundations/spacing</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 12. nap: Spacing nyelvtan',
    emailBody: `<h1>Playbook 2026 – 12. nap</h1>
<p>Spacing skálát hozol létre és minden komponensre alkalmazod.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a spacing skála lényege?',
          options: [
            'Random számok',
            'Előre definiált értékek (pl. 4/8/12/16/24/32) és szabályok',
            'Csak margin-top',
            'Csak desktopon használjuk',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért rossz a 5/7/11 px keverése?',
          options: [
            'Mert csúnya',
            'Mert konzisztenciát bont és nehezebb fejleszteni',
            'Mert olcsó',
            'Mert mobilon nem látszik',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit tartalmazzon a spacing dokumentum?',
          options: [
            'Csak egy számot',
            'Tokenek + használati szabályok + példák',
            'Csak képek',
            'Csak árlista',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a vertikális ritmus?',
          options: [
            'Random margók',
            'Következetes heading utáni margók és vonalritmus',
            'Csak szín',
            'Nincs ilyen',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 13,
    title: 'Sűrűségmódok és reszponzivitás',
    content: `<h1>Sűrűségmódok és reszponzivitás</h1>
<p><em>Levegős / kényelmes / tömör módokat definiálsz, és töréspontonként szabályozod a térközt és a tipót.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>3 sűrűségmód: levegős / kényelmes / tömör.</li>
  <li>Token-alapú váltás (gap, padding, tipó méret) breakpointra vagy user settingre.</li>
  <li>Reszponzív tipó és spacing táblázat.</li>
  <li>Dokumentált példák: táblázat, kártyarács, form.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>B2B és dashboard: gyakran dense mód kell.</li>
  <li>Mobilon levegős, desktopon hatékonyabb sűrűség.</li>
  <li>Következetlen sűrűség = káosz.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Mód váltás: space token vált, tipó méret vált.</li>
  <li>Airy: space.lg, tipó +1; Dense: space.sm/md, tipó -1.</li>
  <li>Alkalmazási szabály: nagy adatsűrűség → dense, marketing → airy.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Ugyanaz a spacing mindenhol, táblázat túl levegős.</p>
<p><strong>Jó:</strong> Dashboard dense mód: kisebb padding, kisebb gap, tipó -1; marketing airy.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Hozz létre sűrűség táblát: airy/comfort/dense → spacing/tipó értékek.</li>
  <li>Állíts be példákat: táblázat dense, kártya comfort, hero airy.</li>
  <li>Dokumentáld a váltási szabályt (hol melyik mód).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Implementálj egy komponenst két sűrűségi módban, screenshotold összevetve.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Sűrűség táblázat létezik.</li>
  <li>Példák dokumentálva.</li>
  <li>Váltási szabály megvan.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Fluent density: <a href="https://fluent2.microsoft.design/styles/layout#density" target="_blank" rel="noreferrer">https://fluent2.microsoft.design/styles/layout#density</a></li>
  <li>Material responsive guidance: <a href="https://m3.material.io/foundations/layout/overview" target="_blank" rel="noreferrer">https://m3.material.io/foundations/layout/overview</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 13. nap: Sűrűség és reszponzivitás',
    emailBody: `<h1>Playbook 2026 – 13. nap</h1>
<p>Airy/comfort/dense módokat definiálsz, responsive táblázattal.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell több sűrűségi mód?',
          options: [
            'Dekoráció',
            'Különböző kontextusok (dashboard vs marketing) eltérő sűrűséget igényelnek',
            'Csak mobil miatt',
            'Nem kell',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a dense mód jellemzője?',
          options: [
            'Nagy gap, nagy tipó',
            'Kisebb padding/gap, kisebb tipó',
            'Random értékek',
            'Csak színváltás',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mit tartalmazzon a sűrűség táblázat?',
          options: [
            'Árakat',
            'space/tipó értékeket airy/comfort/dense módra',
            'Csak logókat',
            'Csak képeket',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó példa?',
          options: [
            'Táblázat airy módban',
            'Dashboard dense: kisebb padding, gap, tipó -1',
            'Minden komponens ugyanaz',
            'Nincs váltás',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 14,
    title: 'Vizuális hierarchia nyomás alatt',
    content: `<h1>Vizuális hierarchia nyomás alatt</h1>
<p><em>Megtanulod, hogyan tartsd meg a hierarchiát sok információnál (dashboard, lista, kártya).</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Hierarchia eszközei: méret, súly, kontraszt, spacing, szín, ikon.</li>
  <li>Lista és kártya hierarchia sablon.</li>
  <li>Overload esetén redukciós szabályok (truncate, progressive disclosure).</li>
  <li>Dokumentált jó/rossz példák.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Sok adat → könnyen szétesik a figyelem.</li>
  <li>Hierarchia segít gyorsan találni a lényeget.</li>
  <li>Rosszul kezelt lista/kártya bizalomvesztést okoz.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Eszközök: tipó (súly/méret), szín (csak kiemelésre), spacing, ikon, background.</li>
  <li>Progressive disclosure: mutass kevesebbet, a részleteket kattintásra.</li>
  <li>Truncate + tooltip: hosszú tartalom rövidítése magyarázattal.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Minden szöveg azonos súly/méret, össze-vissza színek.</p>
<p><strong>Jó:</strong> Cím 16/20 bold, meta 12/16 muted, spacing tokenek, ikon csak statusra.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Készíts lista/kártya hierarchia sablont (title, meta, badge, action).</li>
  <li>Írj szabályt: mikor truncates, mikor multi-line.</li>
  <li>Dokumentálj jó/rossz példát.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Alkalmazd egy dashboard widgetre, screenshotold a before/after állapotot.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Hierarchia sablon kész.</li>
  <li>Truncate/progressive disclosure szabály megvan.</li>
  <li>Jó/rossz példák dokumentálva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>List design: <a href="https://www.nngroup.com/articles/lists/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/lists/</a></li>
  <li>Progressive disclosure: <a href="https://www.nngroup.com/articles/progressive-disclosure/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/progressive-disclosure/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 14. nap: Hierarchia nyomás alatt',
    emailBody: `<h1>Playbook 2026 – 14. nap</h1>
<p>Lista/kártya hierarchia sablont építesz, overload esetén redukálsz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Milyen eszközökkel építesz hierarchiát?',
          options: [
            'Csak szín',
            'Tipó méret/súly, spacing, szín limitált, ikon, background',
            'Random italics',
            'Csak ikonok',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a progressive disclosure lényege?',
          options: [
            'Több információt azonnal',
            'Kevesebbet mutatni, több részlet kattintásra',
            'Mindent elrejteni',
            'Csak desktopon működik',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Minden szöveg azonos súly/méret',
            'Cím 16/20 bold, meta 12/16 muted',
            'Spacing token használat',
            'Status ikon csak ott, ahol kell',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mikor truncatesz?',
          options: [
            'Ha hosszú a tartalom és nincs hely, tooltip vagy „tovább”',
            'Soha',
            'Mindig',
            'Csak mobilon',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 15,
    title: 'Ismeretlen tartalomra tervezés',
    content: `<h1>Ismeretlen tartalomra tervezés</h1>
<p><em>Megtanulod, hogyan tartsd meg a struktúrát ismeretlen vagy változó tartalomhossz mellett.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Placeholder és üres állapot szabályok.</li>
  <li>Változó címhossz, többnyelvűség kezelése (wrap/truncate).</li>
  <li>Folyamatos terhelés: skeleton vs spinner.</li>
  <li>Dokumentált minták kártyára, listára, táblázatra.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Valódi adat eltér a mocktól.</li>
  <li>Folyamatosság: betöltéskor se törjön a layout.</li>
  <li>Többnyelvű szöveg nyúlhat.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Szövegkezelés: wrap 2 sorig, utána truncate + tooltip/link.</li>
  <li>Üres állapot: ikon + rövid üzenet + CTA.</li>
  <li>Skeleton: stabil méret, ne ugráljon.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Hosszú cím kilóg, törik az elrendezés.</p>
<p><strong>Jó:</strong> Max. 2 sor, utána ellipszis + tooltip; üres állapot definiálva.</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Készíts szövegkezelési szabályt (wrap/truncate) kártyára és listára.</li>
  <li>Definiáld az üres állapot komponensét (ikon, szöveg, CTA).</li>
  <li>Írj szabályt skeleton használatra.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Alkalmazd egy többnyelvű tartalomra (pl. hosszabb német/angol), screenshotold.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Wrap/truncate szabályok léteznek.</li>
  <li>Üres állapot komponens dokumentálva.</li>
  <li>Skeleton szabály megvan.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Empty states: <a href="https://www.nngroup.com/articles/empty-state/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/empty-state/</a></li>
  <li>Skeleton best practices: <a href="https://uxdesign.cc/skeleton-screens-what-to-use-instead-of-the-loading-spinner-2fd0f5f4bd2e" target="_blank" rel="noreferrer">https://uxdesign.cc/skeleton-screens-what-to-use-instead-of-the-loading-spinner-2fd0f5f4bd2e</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 15. nap: Ismeretlen tartalom',
    emailBody: `<h1>Playbook 2026 – 15. nap</h1>
<p>Ismeretlen tartalomra tervezel: wrap/truncate, üres állapot, skeleton.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Hogyan kezeled a hosszú címet?',
          options: [
            'Hagyom kilógni',
            'Max 1-2 sor, utána truncate + tooltip',
            'Mindig egy sorban tartom bárhogy',
            'Nincs szabály',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi az üres állapot alapja?',
          options: [
            'Csak üres képernyő',
            'Ikon + rövid üzenet + CTA',
            'Reklám',
            'Random szöveg',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mikor használj skeletont spinner helyett?',
          options: [
            'Ha stabil elrendezést akarsz betöltés közben',
            'Soha',
            'Mindig spinnert',
            'Csak mobilon',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Hosszú cím törik a layoutot',
            'Ellipszis 2 sor után, tooltip',
            'Üres állapot CTA-val',
            'Skeleton fix mérettel',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 16,
    title: 'Komponensben gondolkodj, ne oldalban',
    content: `<h1>Komponensben gondolkodj, ne oldalban</h1>
<p><em>Oldalak helyett komponens-API-ban gondolkodsz: állapotok, felelősségi határ, használati korlát.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Komponens API: props, állapot, események.</li>
  <li>Felelősségi határ: mit tud és mit nem.</li>
  <li>Használati szabály: hol tilos használni.</li>
  <li>Dokumentálsz jó/rossz példát.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Oldal-fókuszú munka duplikációhoz vezet.</li>
  <li>Komponens = újrahasznosítás + konzisztencia.</li>
  <li>Világos API nélkül instabil lesz a rendszer.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>API: kötelező/opcionális propok, események, állapotok.</li>
  <li>Felelősség: mit nem csinál (pl. a kártya nem fetch-el adatot).</li>
  <li>Dokumentáció: használati példák + tiltások.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Minden oldal egyedi kártyát épít.</p>
<p><strong>Jó:</strong> Kártya komponens API-val, állapotokkal, dokumentált korlátokkal.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Válassz egy UI-t (kártya, input-csoport), írd le az API-t.</li>
  <li>Listázd az állapotokat (hover, focus, error, loading).</li>
  <li>Írd le a tiltásokat (hol nem használható).</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Dokumentáld a komponens API-t a Playbookban, linkkel Figma/Storybookra.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>API leírva.</li>
  <li>Állapotok feltérképezve.</li>
  <li>Tiltási lista megvan.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Atomic design: <a href="https://bradfrost.com/blog/post/atomic-web-design/" target="_blank" rel="noreferrer">https://bradfrost.com/blog/post/atomic-web-design/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 16. nap: Komponens gondolkodás',
    emailBody: `<h1>Playbook 2026 – 16. nap</h1>
<p>Oldalak helyett komponens API-kban gondolkodsz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a komponens API?',
          options: [
            'Véletlen propok',
            'Kötelező/opcionális propok, események, állapotok',
            'Csak CSS',
            'Csak képek',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért nem elég oldalban gondolkodni?',
          options: [
            'Mert lassú a build',
            'Duplikáció és inkonzisztencia lesz',
            'Mert drága',
            'Mert mobilon nem működik',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a felelősségi határ?',
          options: [
            'Mit nem csinál a komponens',
            'Árlista',
            'CI/CD',
            'Semmi',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mit dokumentálj?',
          options: [
            'API + állapotok + tiltások + példák',
            'Csak színek',
            'Csak tipó',
            'Csak ár',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 17,
    title: 'Token architektúra',
    content: `<h1>Token architektúra</h1>
<p><em>Bevezeted a token rétegeket: forrás → alias → komponens; platformközi felhasználás.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Token rétegek: base (primitive), semantic, component.</li>
  <li>Névkonvenció: color.brand.primary, space.md, radius.sm.</li>
  <li>Export: web/ios/android (pl. Style Dictionary).</li>
  <li>Dokumentálsz pipeline-t és tiltásokat (pl. ne használj base-t közvetlenül UI-ban).</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Tokenek adják a single source of truth-ot.</li>
  <li>Platformközi konzisztencia.</li>
  <li>Gyors változás: 1 token módosítás = globális update.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Base: nyers érték (#FAB908, 8px).</li>
  <li>Semantic: szerep (color.semantic.success.bg).</li>
  <li>Component: konkrét használat (button.primary.bg).</li>
  <li>Build folyamat: JSON → generált platform kimenet (web/iOS/Android).</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Közvetlen hex a CSS-ben.</p>
<p><strong>Jó:</strong> Mindenütt color.brand.primary tokenre hivatkozol.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Írj token név-sémát (base/semantic/component).</li>
  <li>Készíts 10 minta tokent (szín, space, radius, motion, z-index).</li>
  <li>Definiáld a tiltást: UI csak semantic/componentet használhat.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Válts ki egy képernyőn minden hardcode-olt értéket tokenre.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Token rétegek definiálva.</li>
  <li>Név-séma megvan.</li>
  <li>Base → semantic → component lánc működik.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Style Dictionary: <a href="https://amzn.github.io/style-dictionary/#/" target="_blank" rel="noreferrer">https://amzn.github.io/style-dictionary/#/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 17. nap: Token architektúra',
    emailBody: `<h1>Playbook 2026 – 17. nap</h1>
<p>Felépíted a base/semantic/component token rétegeket.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a token három rétege?',
          options: [
            'Base, semantic, component',
            'CSS, HTML, JS',
            'Dev, QA, Prod',
            'Nincs réteg',
          ],
          correctIndex: 0,
        },
        {
          question: 'Miért ne használj base tokent közvetlenül UI-ban?',
          options: [
            'Mert lassú',
            'Mert semantic/component biztosít szerepet és váltást',
            'Mert drága',
            'Mert nem támogatott',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó név konvenció?',
          options: [
            'color1',
            'color.brand.primary',
            'össze-vissza hex kód',
            'bármilyen',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a pipeline célja?',
          options: [
            'Tokenek exportja platformokra',
            'Marketing',
            'Loggyűjtés',
            'CI/CD nélküli build',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 18,
    title: 'Variánsok és állapotlogika',
    content: `<h1>Variánsok és állapotlogika</h1>
<p><em>Definiálod a komponens variánsait és állapotát: méret, típus, állapot mátrix.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Variáns-mátrix: méret (sm/md/lg), típus (primary/secondary/ghost), állapot (default/hover/focus/active/disabled/loading).</li>
  <li>Állapot-szabályok: mi változik (szín, keret, árnyék, ikon).</li>
  <li>Disable/Loading: interakció tiltása, skeleton vagy semleges stílus.</li>
  <li>Dokumentált példák + tiltások.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Variancia nélkül a design rendszer törékeny.</li>
  <li>Állapotlogika adja az affordance-t.</li>
  <li>Könnyebb fejlesztés: táblázatból dolgoznak.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Mátrix: sorok = állapotok, oszlopok = variánsok.</li>
  <li>Szabály: mi NEM változik (pl. radius fix).</li>
  <li>Disabled: kontraszt csökkent, kurzor default, shadow off.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Hover néha sötétít, néha világosít, nincs szabály.</p>
<p><strong>Jó:</strong> Táblázatban rögzített színek/árnyékok minden állapotra.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Készíts egy gomb variáns-állapot táblát.</li>
  <li>Írd le: mit változtatsz hover/focus/active/disabled/loading állapotban.</li>
  <li>Dokumentáld tiltásokat (pl. ghost + disabled kontrasztkövetelmény).</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Implementálj egy komponenst a táblázat alapján, screenshotold állapotonként.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Variáns-állapot mátrix elkészült.</li>
  <li>Szabályok következetesek.</li>
  <li>Dokumentáció linkelve.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>ARIA állapotok: <a href="https://www.w3.org/TR/wai-aria-1.2/#states_and_properties" target="_blank" rel="noreferrer">https://www.w3.org/TR/wai-aria-1.2/#states_and_properties</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 18. nap: Variánsok és állapotok',
    emailBody: `<h1>Playbook 2026 – 18. nap</h1>
<p>Variáns- és állapotmátrixot építesz, következetes szabályokkal.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a variáns-állapot mátrix?',
          options: [
            'Színes táblázat véletlen adatokkal',
            'Variánsok x állapotok táblázata szabályokkal',
            'Árlista',
            'Nincs ilyen',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi nem változik jó esetben?',
          options: [
            'Radius és tipó konszisztens marad',
            'Minden össze-vissza változik',
            'Komponens neve',
            'Csak a border',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a disabled szabály?',
          options: [
            'Nincs szabály',
            'Kontraszt csökkent, kurzor default, shadow off, interakció tiltva',
            'Hover animáció erősítése',
            'Véletlen',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell dokumentálni?',
          options: [
            'Nem kell',
            'Fejlesztő táblázatból tud dolgozni, egységes marad',
            'Marketing okból',
            'Csak design review miatt',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 19,
    title: 'Platformközi konzisztencia',
    content: `<h1>Platformközi konzisztencia</h1>
<p><em>Web, iOS, Android között összehangolod a tokeneket, komponenseket, mintákat.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Platform mapping: mi közös, mi natív-specifikus.</li>
  <li>Token export (web/ios/android) és korlátok.</li>
  <li>Komponens divergencia szabály: mikor térhet el (pl. date picker).</li>
  <li>Dokumentálsz példákat és tiltásokat.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Felhasználó platformonként mást vár, de brand ugyanaz.</li>
  <li>Költség: ugyanaz a forrás → kevesebb fenntartás.</li>
  <li>Eltérés csak indokolt esetben.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Közös: szín, tipó, ikonok, hang.</li>
  <li>Eltérő: navigációs minták, natív inputok.</li>
  <li>Szabály: dokumentált eltérés + ok + követés.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Web és mobil teljesen más színskála.</p>
<p><strong>Jó:</strong> Ugyanaz a brand szín/token, natív navigation pattern engedélyezett.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Készíts platform mapping táblát: közös elemek, eltérő minták.</li>
  <li>Definiáld az eltérés jóváhagyási folyamatát.</li>
  <li>Token export pipeline rövid leírása.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Válassz egy komponenst (pl. modal) és írd le a platform-különbségeket.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Platform mapping táblázat létezik.</li>
  <li>Eltérések dokumentálva, indokoltan.</li>
  <li>Token export folyamat ismert.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Human Interface Guidelines (iOS): <a href="https://developer.apple.com/design/human-interface-guidelines/" target="_blank" rel="noreferrer">https://developer.apple.com/design/human-interface-guidelines/</a></li>
  <li>Material (Android): <a href="https://m3.material.io" target="_blank" rel="noreferrer">https://m3.material.io</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 19. nap: Platformközi konzisztencia',
    emailBody: `<h1>Playbook 2026 – 19. nap</h1>
<p>Token és komponens szintű konzisztenciát teremtesz web/iOS/Android között.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi közös platformok között?',
          options: [
            'Brand szín, tipó, ikonok, hang',
            'Semmi',
            'Csak árlista',
            'Csak logó',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mikor térhetsz el komponensben?',
          options: [
            'Ha dokumentált, indokolt és jóváhagyott',
            'Bármikor',
            'Soha',
            'Csak weben',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a mapping tábla célja?',
          options: [
            'Dekoráció',
            'Közös/eltérő elemek rögzítése, döntési keret',
            'Árlista',
            'Semmi',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Web és mobil más brand színnel',
            'Ugyanaz a brand szín, natív navigáció elfogadott',
            'Token export mindhárom platformra',
            'Dokumentált eltérés',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 20,
    title: 'Elnevezés és rendszer-higiénia',
    content: `<h1>Elnevezés és rendszer-higiénia</h1>
<p><em>Névkonvenciót, verziózást és takarítási ritmust vezetsz be a design rendszerben.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Névkonvenció komponensekre/tokénekre (kebab/camel, prefixek).</li>
  <li>Verziózás (v0.1 → v1.0), changelog szabály.</li>
  <li>Deprecation folyamat: jelölés, határidő, helyettesítő.</li>
  <li>Havi higiénia checklist.</li>
  <li>Alkalmazd a Playbook összes elemére.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Káosz nélkül nem skálázódik.</li>
  <li>Újak gyorsabban tanulják.</li>
  <li>Deprecation nélkül felhalmozódik a szemét.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Név: component.button.primary, token: color.brand.primary.</li>
  <li>Verzió: semver-szerű, release note kötelező.</li>
  <li>Deprecation: jelöld deprecated flaggel + helyettesítő link.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „New Button Final FINAL”.</p>
<p><strong>Jó:</strong> button/primary/v1.2, changelog, deprecated: button/legacy/primary.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Hozz létre névkonvenció táblát (komponens, token, fájl).</li>
  <li>Írj changelog sablont.</li>
  <li>Definiáld a deprecation folyamatot.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Végezz higiénia-auditot 1 komponenscsaládon, jelöld a deprecated elemeket.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Névkonvenció létezik.</li>
  <li>Changelog sablon kész.</li>
  <li>Deprecation folyamat dokumentálva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Semver: <a href="https://semver.org" target="_blank" rel="noreferrer">https://semver.org</a></li>
  <li>Design system maintenance: <a href="https://uxdesign.cc/maintaining-design-systems-7d3c34c3f0c3" target="_blank" rel="noreferrer">https://uxdesign.cc/maintaining-design-systems-7d3c34c3f0c3</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 20. nap: Névkonvenció és higiénia',
    emailBody: `<h1>Playbook 2026 – 20. nap</h1>
<p>Névkonvenciót, verziózást és deprecation folyamatot állítasz fel.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell névkonvenció?',
          options: [
            'Dekoráció',
            'Kereshetőség, konzisztencia, onboarding',
            'Csak marketing',
            'Nem kell',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a deprecation folyamat lényege?',
          options: [
            'Töröld azonnal',
            'Jelöld deprecated, adj határidőt és helyettesítőt',
            'Hagyd úgy',
            'Csak szólj Slackben',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa elnevezésre?',
          options: [
            'New Button Final FINAL',
            'button/primary/v1.2',
            'color.brand.primary',
            'space.md',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi tartozzon a changelogba?',
          options: [
            'Változás, dátum, verzió, hatás',
            'Csak dátum',
            'Csak szerző',
            'Semmi',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 21,
    title: 'Design adósság kezelése',
    content: `<h1>Design adósság kezelése</h1>
<p><em>Felismered és számszerűsíted a design adósságot, majd tervet készítesz a csökkentésére.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Design adósság definíció és jelek.</li>
  <li>Mérőszámok: duplikált komponens, token-anomáliák, eltérő állapotok.</li>
  <li>Prioritási mátrix (hatás × erőfeszítés).</li>
  <li>Debt backlog és havi redukciós rituálé.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Az adósság növeli a hibák és költségek kockázatát.</li>
  <li>Átlátható mérés nélkül nincs erőforrás.</li>
  <li>Kezelt adósság → gyorsabb release, jobb UX.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Jelek: duplikált gombvariánsok, inkoherens színek, nem dokumentált állapotok.</li>
  <li>Mérés: „eltérés / 100 képernyő”, „nem tokenizált értékek száma”.</li>
  <li>Művelet: audit → backlog → fix sprintenként X ticket.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Nincs lista, csak érzés alapján „sok a káosz”.</p>
<p><strong>Jó:</strong> Debt táblázat, számszerűsítés, havi fix kvóta.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Készíts debt audit sablont: elem, hiba típusa, hatás, javítási becslés.</li>
  <li>Auditálj 5 képernyőt, töltsd a táblába.</li>
  <li>Állíts fel havi kvótát (pl. sprintenként 3 debt ticket).</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Mutasd be a csapatnak a debt számokat és kérj commitmentet a kvótára.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Debt táblázat létezik.</li>
  <li>Van hatás × effort priorizálás.</li>
  <li>Van havi kvóta.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Design debt guide: <a href="https://www.nngroup.com/articles/design-debt/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/design-debt/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 21. nap: Design debt',
    emailBody: `<h1>Playbook 2026 – 21. nap</h1>
<p>Felméred és ütemezve csökkented a design adósságot.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a design debt jele?',
          options: [
            'Dokumentált komponensek',
            'Duplikált variánsok, inkonzisztens színek, hiányzó állapotok',
            'Gyors release',
            'Jó kontraszt',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell mérni?',
          options: [
            'Nem kell',
            'Erőforrás-kéréshez és priorizáláshoz',
            'Dekoráció',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó folyamat?',
          options: [
            'Érzésre javítgatás',
            'Audit → backlog → havi kvóta',
            'Soha nem javítjuk',
            'Csak meeting',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi tartozhat a metrikák közé?',
          options: [
            'Eltérés / 100 képernyő, nem tokenizált értékek száma',
            'Csak árbevétel',
            'Csak NPS',
            'Semmi',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 22,
    title: 'Változáskezelés a design rendszerben',
    content: `<h1>Változáskezelés a design rendszerben</h1>
<p><em>Release, review, jóváhagyás és kommunikáció folyamata a design rendszerben.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Change request flow: RFC → review → QA → release.</li>
  <li>Owner szerepek: design, fejlesztés, QA.</li>
  <li>Changelog és verziózás kötelező.</li>
  <li>Kommunikáció: release note + enablement.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Kontroll nélkül a rendszer törik.</li>
  <li>Átlátható folyamat = bizalom.</li>
  <li>Segíti a csapatot az adoptálásban.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>RFC: probléma, javaslat, hatás.</li>
  <li>Review: design + dev + a11y.</li>
  <li>QA: vizuális + funkcionális + a11y teszt.</li>
  <li>Release: verzió, changelog, rollout terv.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Slack üzenet alapján módosított gomb.</p>
<p><strong>Jó:</strong> RFC → review → QA → changelog → kommunikáció.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Készíts RFC sablont.</li>
  <li>Írj release note mintát.</li>
  <li>Definiáld az owner szerepeket.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Végy egy közelgő változtatást, vezesd át az RFC folyamaton.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>RFC sablon kész.</li>
  <li>Release note minta kész.</li>
  <li>Owner szerepek tiszták.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Design system governance: <a href="https://www.designsystems.com/governance" target="_blank" rel="noreferrer">https://www.designsystems.com/governance</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 22. nap: Változáskezelés',
    emailBody: `<h1>Playbook 2026 – 22. nap</h1>
<p>Bevezetsz RFC → review → QA → release folyamatot.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi az RFC tartalma?',
          options: [
            'Csak dátum',
            'Probléma, javaslat, hatás',
            'Árlista',
            'Semmi',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell changelog?',
          options: [
            'Nem kell',
            'Követhetőség, kommunikáció, audit',
            'Dekoráció',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Slack üzenet alapján módosított gomb',
            'RFC → review → QA → release note',
            'Tulajdonos kijelölése',
            'A11y teszt',
          ],
          correctIndex: 0,
        },
        {
          question: 'Ki legyen owner?',
          options: [
            'Design + dev + QA szerep tisztázva',
            'Bárki, definiálatlan szerepben',
            'Csak marketing',
            'Senki',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 23,
    title: 'Review és jóváhagyási folyamat',
    content: `<h1>Review és jóváhagyási folyamat</h1>
<p><em>Felépíted a design/dev review folyamatot checklistákkal és státuszokkal.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Review típusok: vizuális, UX, a11y, technikai.</li>
  <li>Checklisták és státuszok (draft, review, approved, released).</li>
  <li>Blokkoló vs nem blokkoló megjegyzések.</li>
  <li>Folyamatszintű SLA-k.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Minőség csak review-val tartható.</li>
  <li>SLA nélkül a review csúszik.</li>
  <li>Checklist csökkenti a hibákat.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Státuszok: draft → review → approved → released.</li>
  <li>Checklist: kontraszt, állapotok, token-használat, i18n, performance.</li>
  <li>Blokkoló = nem mehet tovább, nem blokkoló = ajánlás.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Nincs idő review-ra, toljuk ki”.</p>
<p><strong>Jó:</strong> Checklist, státusz, SLA, blokkoló jelölés.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Készíts review checklistet.</li>
  <li>Definiáld a státusz workflow-t.</li>
  <li>Állíts be SLA-t (pl. 48 óra visszajelzés).</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Vezess le egy aktuális ticketet a workflow-n, dokumentáld a tanulságot.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Checklist kész.</li>
  <li>Workflow dokumentálva.</li>
  <li>SLA definiálva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Design critique best practices: <a href="https://uxdesign.cc/a-practical-guide-to-design-critiques-e462f48f7083" target="_blank" rel="noreferrer">https://uxdesign.cc/a-practical-guide-to-design-critiques-e462f48f7083</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 23. nap: Review workflow',
    emailBody: `<h1>Playbook 2026 – 23. nap</h1>
<p>Checklistákkal és SLA-val szabályozod a review-t.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a review SLA célja?',
          options: [
            'Dekoráció',
            'Határidőt ad a visszajelzésre, elkerüli a csúszást',
            'Marketing',
            'Nincs szükség rá',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a blokkoló komment?',
          options: [
            'Nem kötelező',
            'Megállítja a release-t, amíg nincs javítva',
            'Csak dicséret',
            'Marketing szöveg',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi legyen a checklisten?',
          options: [
            'Kontraszt, állapotok, token-használat, i18n, performance',
            'Csak színek',
            'Csak ár',
            'Semmi',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a jó workflow sorrend?',
          options: [
            'Draft → Review → Approved → Released',
            'Approved → Draft → Released',
            'Released → Review',
            'Nincs sorrend',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 24,
    title: 'A rendszer tanítása a csapatnak',
    content: `<h1>A rendszer tanítása a csapatnak</h1>
<p><em>Bevezetési terv: tréning, nyitott konzultáció, dokumentáció, példák.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Enablement csomag (guide, videó, példák).</li>
  <li>Office hours és support csatorna.</li>
  <li>Use-case alapú walkthrough-k.</li>
  <li>Mérés: adoption, ticket szám, reuse arány.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Rendszer csak akkor él, ha használják.</li>
  <li>Oktatás nélkül visszatér a káosz.</li>
  <li>Mérés nélkül nem látod a hatást.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Enablement: rövid videó + pdf + Figma link.</li>
  <li>Office hours: heti 1–2 óra kérdésekre.</li>
  <li>Metrics: reuse %, support ticket trend.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Küldtünk egy linket, oldjátok meg.</p>
<p><strong>Jó:</strong> Kickoff, videó, példák, office hours, Q&A.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Készíts enablement checklistet.</li>
  <li>Állíts be office hours menetrendet.</li>
  <li>Definiáld a mérőszámokat.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Tarts egy 20 perces walkthrough-t egy új komponensről, kérj feedbacket.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Enablement csomag kész.</li>
  <li>Office hours kommunikálva.</li>
  <li>Mérések beállítva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>DesignOps enablement: <a href="https://designops.community" target="_blank" rel="noreferrer">https://designops.community</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 24. nap: Rendszer tanítása',
    emailBody: `<h1>Playbook 2026 – 24. nap</h1>
<p>Enablement csomaggal tanítod a csapatot, mérsz és támogatást adsz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell enablement?',
          options: [
            'Nem kell',
            'Használat nélkül a rendszer halott',
            'Dekoráció',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi legyen a csomagban?',
          options: [
            'Rövid guide, videó, példák, linkek',
            'Csak egy logó',
            'Csak árlista',
            'Semmi',
          ],
          correctIndex: 0,
        },
        {
          question: 'Milyen metrikát érdemes mérni?',
          options: [
            'Reuse %, ticket trend',
            'Csak bevétel',
            'Csak időjárás',
            'Semmit',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Kickoff + videó + office hours',
            '„Küldtünk egy linket, oldjátok meg”',
            'Mért adoption',
            'Q&A session',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 25,
    title: 'Vizuális minőség mérése',
    content: `<h1>Vizuális minőség mérése</h1>
<p><em>Metrikákat és pontozási rendszert állítasz fel a vizuális minőségre.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Scorecard: kontraszt, hierarchia, állapotok, token compliance, a11y.</li>
  <li>Mintavétel: képernyők véletlen auditja.</li>
  <li>Trendkövetés: havi score átlag.</li>
  <li>Publicálás: csapat lássa az eredményeket.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Ami mérve van, az javul.</li>
  <li>Transzparens minőség → jobb fegyelem.</li>
  <li>Mutatható a menedzsmentnek.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
  <li>Score 1–5 skálán, kritériumonként.</li>
  <li>Mintavétel: heti 5 véletlenszerű képernyő.</li>
  <li>Publikálás: dashboard vagy havi jelentés.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Szerintem szép”.</p>
<p><strong>Jó:</strong> Scorecard, trendgrafikon, action items.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Készíts scorecard táblát 5 kritériummal.</li>
  <li>Auditálj 5 képernyőt, számold az átlagot.</li>
  <li>Publikáld egy rövid jelentésben.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Állíts be havi ismétlődő auditot, készíts automatikus emlékeztetőt.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Scorecard létezik.</li>
  <li>Audit minta lefutott.</li>
  <li>Eredmények publikálva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
  <li>Design QA: <a href="https://www.nngroup.com/articles/design-quality-assurance/" target="_blank" rel="noreferrer">https://www.nngroup.com/articles/design-quality-assurance/</a></li>
</ul>`,
    emailSubject: 'Playbook 2026 – 25. nap: Vizuális minőség mérése',
    emailBody: `<h1>Playbook 2026 – 25. nap</h1>
<p>Scorecarddal méred a vizuális minőséget, rendszeresen auditálsz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért mérjük a vizuális minőséget?',
          options: [
            'Dekoráció',
            'Ami mérve van, javul; transzparencia és fegyelem',
            'Marketing',
            'Nem kell mérni',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi legyen a scorecardon?',
          options: [
            'Kontraszt, hierarchia, állapotok, token compliance, a11y',
            'Csak logó',
            'Csak ár',
            'Semmi',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a jó mintavétel?',
          options: [
            'Csak egy képernyő örökre',
            'Heti 5 véletlenszerű képernyő',
            'Soha nem auditálunk',
            'Csak release után egyszer',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            '„Szerintem szép.”',
            'Scorecard + trend + action',
            'Publikált eredmények',
            'Audit ütemezés',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 26,
    title: 'Záróprojekt: valódi termék választása',
    content: `<h1>Záróprojekt: valódi termék választása</h1>
<p><em>Kiválasztasz egy élő terméket, amelyre a Playbookot ténylegesen alkalmazod.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Választási kritériumok: elérhetőség, üzleti prioritás, stakeholder támogatás.</li>
  <li>Scope meghatározása (képernyők, platformok).</li>
  <li>Érintettek és timeline rögzítése.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Valódi termék nélkül a Playbook elmélet marad.</li>
  <li>Prioritás adja a fókuszt és a buy-in-t.</li>
  <li>Scope kontrollálja a kockázatot.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Nézzük meg, mi lesz.”</p>
<p><strong>Jó:</strong> Dashboard + mobil web, 6 kulcs képernyő, 4 hét, kijelölt PM/Dev/Design owner.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Írj 3 jelölt terméket, értékeld a kritériumok mentén.</li>
  <li>Válassz egyet, határozd meg a scope-ot (képernyőlista).</li>
  <li>Állíts fel timeline-t és owner-eket.</li>
  <li>Fogadd el stakeholderrel.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Rögzítsd a döntést a Playbook elején, és osszd meg a csapattal.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Kijelölt termék és scope.</li>
  <li>Owner-ek és timeline rögzítve.</li>
  <li>Stakeholder buy-in megvan.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – 26. nap: Capstone termék',
    emailBody: `<h1>Playbook 2026 – 26. nap</h1>
<p>Kiválasztasz egy élő terméket, scope-pal, owner-ekkel.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi a jó kiválasztási kritérium?',
          options: [
            '„Menőnek tűnik”',
            'Elérhetőség + üzleti prioritás + stakeholder támogatás',
            'Csak design szempont',
            'Csak fejlesztés szempont',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell scope?',
          options: [
            'Nem kell',
            'Kockázat és fókusz kontrollja miatt',
            'Dekoráció',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            '„Nézzük meg, mi lesz.”',
            '6 kulcsképernyő, 4 hét, owner-ek',
            'Stakeholder buy-in',
            'Scope lista',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 27,
    title: 'Aktuális vizuális káosz feltérképezése',
    content: `<h1>Aktuális vizuális káosz feltérképezése</h1>
<p><em>Részletes leltárt készítesz: komponensek, színek, tipó, állapotok, eltérések.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>UI inventory (szín, tipó, radius, shadow, ikon, állapot).</li>
  <li>Eltéréslista a Playbookhoz képest.</li>
  <li>Kategorizálás: must fix / should fix / nice to have.</li>
  <li>Hibatípusok számszerűsítése.</li>
  <li>Egységes kritériumok meghatározása.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Nem tudsz javítani, amit nem látsz.</li>
  <li>Számszerű eltérés → priorizálható backlog.</li>
  <li>Bizalom az adatok miatt.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> „Sok a következetlen szín”.</p>
<p><strong>Jó:</strong> 27 egyedi kék árnyalat, 5 radius variáns; must/should/nice bontás.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Exportálj 10 képernyőt, készíts inventory táblát.</li>
  <li>Jelöld az eltéréseket a Playbookhoz képest.</li>
  <li>Besorolás must/should/nice kategóriába.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Készíts rövid jelentést a számokról és oszd meg a csapattal.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Inventory táblázat kész.</li>
  <li>Eltérések számszerűsítve.</li>
  <li>Prior kategóriák megvannak.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – 27. nap: Káosz feltérképezése',
    emailBody: `<h1>Playbook 2026 – 27. nap</h1>
<p>Inventoryt készítesz és számszerűsíted az eltéréseket.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi az inventory célja?',
          options: [
            'Dekoráció',
            'Látni és számszerűsíteni az eltéréseket',
            'Marketing',
            'Semmi',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó példa?',
          options: [
            '„Random színek vannak.”',
            '„27 kék árnyalat, 5 radius variáns, must/should/nice bontás”',
            'Semmi adat',
            'Csak érzés',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell kategorizálni?',
          options: [
            'Nem kell',
            'Prioritás és erőforrás tervezés miatt',
            'Dekoráció',
            'Marketing',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 28,
    title: 'Rendszer kivonatolása és normalizálása',
    content: `<h1>Rendszer kivonatolása és normalizálása</h1>
<p><em>Összefésülöd az eltéréseket: döntesz a végleges tokenekről és komponens-állapotokról.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Végleges token set kiválasztása (szín, tipó, spacing, radius, shadow).</li>
  <li>Komponens variánsok redukciója (kevesebb, szabályozott).</li>
  <li>Állapotok egységesítése.</li>
  <li>Deprecation lista és migrációs terv.</li>
  <li>Fejlesztőkkel egyeztetett implementációs terv.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Felesleges variánsok fenntartási költséget jelentenek.</li>
  <li>Egységesítés gyorsít és javítja a minőséget.</li>
  <li>Deprecation nélkül visszajön a káosz.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Meghagyunk 5 CTA stílust „hadd legyen”.</p>
<p><strong>Jó:</strong> 2 CTA variáns, dokumentált tiltás, deprecation terv.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Válaszd ki a végleges token értékeket az inventory alapján.</li>
  <li>Redukáld a komponens variánsokat, készíts táblázatot.</li>
  <li>Írj deprecation tervet és kommunikációs lépéseket.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Egyeztess egy fejlesztővel a migrációs sorrendről.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Végleges token lista kész.</li>
  <li>Variáns redukció dokumentálva.</li>
  <li>Deprecation terv megvan.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – 28. nap: Normalizálás',
    emailBody: `<h1>Playbook 2026 – 28. nap</h1>
<p>Redukálod a variánsokat, véglegesíted a tokeneket, deprecation tervvel.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell variánst csökkenteni?',
          options: [
            'Nem kell',
            'Költségcsökkentés, minőség, sebesség miatt',
            'Dekoráció',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó példa?',
          options: [
            '5 CTA variáns meghagyása',
            '2 CTA variáns, tiltások, deprecation terv',
            'Nincs dokumentáció',
            'Csak érzés',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell deprecation terv?',
          options: [
            'Nem kell',
            'Hogy eltüntesd a régi variánsokat kontrolláltan',
            'Dekoráció',
            'Marketing',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    day: 29,
    title: 'Playbook összeállítása',
    content: `<h1>Playbook összeállítása</h1>
<p><em>Összerakod a végleges Playbookot: struktúra, linkek, példák, changelog.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>TOC véglegesítése.</li>
  <li>Linkek: Figma/Storybook, token export, példák.</li>
  <li>Changelog és verziószám beállítása.</li>
  <li>Publikációs csatornák (Notion, Confluence, repo).</li>
  <li>Dokumentum formátum: Markdown + élő linkek.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Könnyen használható, egy helyen elérhető.</li>
  <li>Verziózás nélkül gyorsan elavul.</li>
  <li>Linkek biztosítják a forráshoz való hozzáférést.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Szétszórt fájlok, nincs verziószám.</p>
<p><strong>Jó:</strong> Markdown TOC, élő linkek, changelog, v1.0 tag.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Állítsd össze a TOC-t a végleges szekciókkal.</li>
  <li>Linkeld a forrásokat (Figma, Storybook, token JSON).</li>
  <li>Írj changelog bejegyzést a v1.0-hoz.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Publikáld a Playbookot és kérj végső review-t.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>TOC kész.</li>
  <li>Linkek élnek.</li>
  <li>Changelog bejegyzés megvan.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – 29. nap: Összeállítás',
    emailBody: `<h1>Playbook 2026 – 29. nap</h1>
<p>Összeállítod a végleges Playbookot, linkekkel és verzióval.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Miért kell verziószám?',
          options: [
            'Dekoráció',
            'Követhetőség, update kontroll',
            'Marketing',
            'Nem kell',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi legyen a Playbookban?',
          options: [
            'TOC, linkek, changelog, verzió',
            'Csak képek',
            'Csak ár',
            'Semmi',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Szétszórt fájlok, verzió nélkül',
            'Markdown + élő linkek',
            'Changelog v1.0',
            'Publikált dokumentum',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    day: 30,
    title: 'Záróprezentáció és bevezetés',
    content: `<h1>Záróprezentáció és bevezetés</h1>
<p><em>Bemutatod a Playbookot, bevezetési ütemtervvel és mérőszámokkal.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>Prezentáció: probléma → megoldás → előnyök.</li>
  <li>Rollout terv: időzítés, mérföldkövek, felelősök.</li>
  <li>Success metrikák: adoption, hibacsökkenés, reuse arány.</li>
  <li>Feedback csatornák.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Buy-in és használat nélkül nincs értelme.</li>
  <li>Rollout nélkül a rendszer a fiókban marad.</li>
  <li>Metrikák mutatják a hatást.</li>
</ul>
<hr />
<h2>Példák</h2>
<p><strong>Rossz:</strong> Emailben elküldött PDF, nincs további lépés.</p>
<p><strong>Jó:</strong> 20 perces demo, rollout ütemterv, metrikák, feedback loop.</p>
<hr />
<h2>Gyakorlat (vezetett)</h2>
<ol>
  <li>Készíts 10-15 slide-os prezentációt.</li>
  <li>Írj rollout ütemtervet (hetekre bontva).</li>
  <li>Definiálj metrikákat és dashboardot.</li>
</ol>
<h2>Gyakorlat (önálló)</h2>
<p>Tarts egy demo sessiont, gyűjts feedbacket, tervezd be a v1.1 javításokat.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Prezentáció kész.</li>
  <li>Rollout terv megvan.</li>
  <li>Metrikák és feedback csatorna beállítva.</li>
</ul>`,
    emailSubject: 'Playbook 2026 – 30. nap: Rollout',
    emailBody: `<h1>Playbook 2026 – 30. nap</h1>
<p>Bemutatod a Playbookot, rollout tervvel és metrikákkal.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`,
    quiz: {
      questions: [
        {
          question: 'Mi legyen a final deckben?',
          options: [
            'Csak logó',
            'Probléma, megoldás, előnyök, metrikák',
            'Csak ár',
            'Semmi',
          ],
          correctIndex: 1,
        },
        {
          question: 'Miért kell rollout terv?',
          options: [
            'Nem kell',
            'Hogy a rendszer tényleg bevezetésre kerüljön',
            'Dekoráció',
            'Marketing',
          ],
          correctIndex: 1,
        },
        {
          question: 'Mi a jó metrika?',
          options: [
            'Adoption, hibacsökkenés, reuse arány',
            'Csak bevétel',
            'Csak időjárás',
            'Semmi',
          ],
          correctIndex: 0,
        },
        {
          question: 'Mi a rossz példa?',
          options: [
            'Emailben küldött PDF, nincs lépés',
            'Demo + rollout + metrikák',
            'Feedback csatorna',
            'v1.1 backlog',
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
   
  console.log('Seeded The Playbook 2026 (HU) with all 30 lessons.');
}

main().catch((err) => {
   
  console.error(err);
  process.exit(1);
});
