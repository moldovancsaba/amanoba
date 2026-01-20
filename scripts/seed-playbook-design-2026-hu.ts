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
    title: 'Trendek vs alapelvek vs rendszerek',
    content: `<h1>Trendek vs alapelvek vs rendszerek</h1>
<p><em>Megkülönbözteted, mi a múló trend, mi az időtálló alapelv, és hogyan lesz belőle rendszer.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
  <li>3 szempont alapján el tudod dönteni, mi trend és mi alapelv.</li>
  <li>Minden trendhez ki tudod vezetni az alapelvet és a rendszer-szabályt.</li>
  <li>Készítesz egy „Trend intake” sablont a csapatnak.</li>
  <li>Kijelölsz 1-2 trendet, amit beépítesz – rendszer-szinten.</li>
  <li>Kijelölsz 1-2 trendet, amit elengedsz.</li>
  <li>Megérted, miként építed bele a trendet hogy illeszkedjen a rendszerbe.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Trend chasing széttöri a koherenciát.</li>
  <li>Az alapelv időtálló, a trend csak felszín.</li>
  <li>Rendszer nélkül a trend csak dekoráció, nem szabály.</li>
  <li>Egy jó rendszer képes trendet emészteni anélkül, hogy szétesne.</li>
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
<p><strong>Rendszer-szabály:</strong> „Háttéren 85% blur + 6% átlátszóság csak másodlagos kártyáknál, min. 4.5:1 kontraszt a szövegnél.”</p>
<p><strong>Trend:</strong> Brutalista neon CTA</p>
<p><strong>Alapelv:</strong> Egyértelmű affordance, kiemelés.</p>
<p><strong>Rendszer-szabály:</strong> „Primary CTA csak #FAB908 sárga, 12x16 padding, fekete szöveg, shadow tiltva – máshol sárga tilos.”</p>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
  <li>Írj le 3 aktuális trendet, amit látsz a piacodon.</li>
  <li>Mindegyikhez írd mellé az alapelvet (mit szolgál?) és a kockázatot (pl. kontraszt, zaj, brand-fit).</li>
  <li>Fogalmazz meg rendszer-szabályt 1 trendre (token, komponens, használati korlát).</li>
  <li>Hozz létre „Trend intake” sablont: trend neve, alapelv, szabály, ahol használható, tiltások, mérés.</li>
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
    title: 'Vizuális szándék meghatározása',
    content: `<h1>Vizuális szándék meghatározása</h1>
<p><em>Egymondatos, mérhető Visual Intent Statementet készítesz, ami irányt ad minden döntésnek.</em></p>
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
  <li>1 mondat: „A termékünk vizuális nyelve <strong>[hangulat]</strong>, miközben <strong>[üzleti cél]</strong>, <strong>[sűrűség]</strong>, <strong>[merészség]</strong>, <strong>[mozgás]</strong> tengelyeken itt helyezkedik el.”</li>
  <li>Legyen mérhető (pl. „CTA kontraszt min. 7:1”, „mozgas 150–250ms ease-in-out”).</li>
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
<p><strong>Jó:</strong> „Visual Intent: Barátságos-tech, levegős, visszafogott mozgással. CTA sárga #FAB908, tipó Inter/600, spacing 8-12-16 rendszerrel, animáció 180ms ease.”</p>
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
    title: 'Tipográfia mint hierarchia és hang',
    content: `<h1>Tipográfia mint hierarchia és hang</h1>
<p><em>Felépíted a tipó-rendszert: szerepek, méretek, súlyok, sorhossz, ritmus, hang.</em></p>
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
    title: 'Forma, ritmus, érzelmi jelzések',
    content: `<h1>Forma, ritmus, érzelmi jelzések</h1>
<p><em>Megtanulod, hogyan közvetít jelentést a forma (kerek vs szögletes), a ritmus (ismétlődés), és hogyan kerülöd a vizuális zajt.</em></p>
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
<p><strong>Rossz:</strong> Minden kártya más radius, random shadow.</p>
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
            'Minden komponens random radius',
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
<p><em>Időzítésekkel, görbékkel, állapotokkal szabályozod a mozgást, hogy támogassa az értelmet, ne zavarjon.</em></p>
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
  <li>Micro-interaction: 150–200ms, ease-out.</li>
  <li>Modal/overlay: 200–250ms, ease-in-out.</li>
  <li>Page/route: 250–300ms, ease-in-out.</li>
</ul>
<h3>Állapotok</h3>
<ul>
  <li>Hover: finom fény/scale max 1.02.</li>
  <li>Focus: látható kontúr, kontrasztos.</li>
  <li>Active: enyhe süllyesztés.</li>
  <li>Success/Error: szín + ikon + rövid mozgás (pl. fade/slide).</li>
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
    title: 'Hozzáférhetőség mint tervezési kényszer',
    content: `<h1>Hozzáférhetőség mint tervezési kényszer</h1>
<p><em>Alap WCAG-követelményeket beépítesz a rendszerbe (kontraszt, fókusz, mozgás, olvashatóság).</em></p>
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
  console.log('Seeded The Playbook 2026 (HU) with first 10 lessons.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
