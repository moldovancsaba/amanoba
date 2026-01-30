/**
 * Seed Sales Productivity 30 (HU) — add missing Day 12–30 lessons.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - Default behavior: create missing lessons only (do not overwrite existing lessons).
 * - Quizzes are not modified by this script.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-hu.ts
 *   npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-hu.ts --apply
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'SALES_PRODUCTIVITY_30_HU';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

const APPLY = hasFlag('--apply');
const ONLY_MISSING_LESSONS = !hasFlag('--update-existing-lessons');

type LessonEntry = {
  day: number;
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
};

const LESSONS_12_30: LessonEntry[] = [
  {
    day: 12,
    title: 'Kifogáskezelés – A “nem” adat, nem támadás',
    content: `<h1>Kifogáskezelés – A “nem” adat, nem támadás</h1>
<p><em>A kifogás információ. A cél: tisztázni, számszerűsíteni és kockázatot csökkenteni.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>A kifogásokat 4 csoportba sorolod: érték, időzítés, bizalom, illeszkedés.</li>
  <li>Használsz egy egyszerű folyamatot: Meghallgatás → Elismerés → Feltárás → Válasz.</li>
  <li>Készítesz “kifogástérképet” a top 5 kifogásodra.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>A legtöbb deal azért bukik, mert a kockázat kimondatlan marad.</li>
  <li>Ha vitatkozol, ellenállást kapsz; ha feltársz, tisztánlátást.</li>
  <li>Ismételhető folyamat = jobb konverzió és kevesebb érzelmi döntés.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>1) A 4 kifogástípus</h3>
<ul>
  <li><strong>Érték</strong>: “Nem segít.”</li>
  <li><strong>Időzítés</strong>: “Most nem aktuális.”</li>
  <li><strong>Bizalom</strong>: “Nem vagyunk biztosak, hogy működni fog.”</li>
  <li><strong>Illeszkedés</strong>: “Nem ránk való.”</li>
</ul>
<h3>2) Meghallgatás → Elismerés → Feltárás → Válasz</h3>
<ol>
  <li><strong>Meghallgatás</strong>: hagyd végigmondani, írd le pontosan.</li>
  <li><strong>Elismerés</strong>: “Teljesen érthető.”</li>
  <li><strong>Feltárás</strong>: kérj kontextust, számokat, döntési kritériumokat.</li>
  <li><strong>Válasz</strong>: bizonyíték + opció + következő lépés.</li>
</ol>
<hr />
<h2>Példa</h2>
<p><strong>Kifogás:</strong> “Túl drága.”</p>
<ul>
  <li><strong>Feltárás</strong>: “Mihez képest drága? Mekkora kerettel számoltál a probléma megoldására?”</li>
  <li><strong>Válasz</strong>: “Ha a legnagyobb hatású use case-re szűkítünk, működne egy kisebb kezdő csomag?”</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10–15 perc) — Kifogástérkép</h2>
<ol>
  <li>Írd le a top 5 kifogásodat (szó szerint).</li>
  <li>Sorold be őket a 4 csoport egyikébe.</li>
  <li>Minden kifogáshoz írj 2 feltáró kérdést és 1 bizonyítékot (eset, adat, pilot).</li>
</ol>
<h2>Gyakorlat (önálló, 5–10 perc) — “Előbb feltárás” párbeszéd</h2>
<p>Válassz 1 kifogást, és írj 6 soros párbeszédet, ahol előbb kérdezel, és csak utána válaszolsz.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Gyorsan be tudom sorolni a kifogásokat.</li>
  <li>Van kifogástérképem feltáró kérdésekkel.</li>
  <li>Nem védekezek, hanem tisztázok.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 12. nap: Kifogáskezelés',
    emailBody: `<h1>Sales Productivity 30 – 12. nap</h1>
<p>Alakítsd a kifogásokat adatokká, és csökkentsd a döntési kockázatot.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 13,
    title: 'Discovery hívás – Diagnózis a “recept” előtt',
    content: `<h1>Discovery hívás – Diagnózis a “recept” előtt</h1>
<p><em>A jó discovery tisztázza: probléma, hatás, korlátok, döntési folyamat.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Végigviszel egy 25 perces discovery struktúrát egyértelmű kerettel.</li>
  <li>Számszerűsíted a hatást (idő, pénz, kockázat).</li>
  <li>Elkötelezett következő lépéssel zársz.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
  <li>Gyenge discovery = gyenge ajánlat és “eltűnés”.</li>
  <li>A hatás teszi sürgőssé a döntést.</li>
  <li>A döntési folyamat tisztázása megelőzi a késői meglepetéseket.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Discovery agenda (25 perc)</h3>
<ol>
  <li><strong>Keret (3 perc)</strong>: cél + agenda + idő.</li>
  <li><strong>Jelenlegi helyzet (7 perc)</strong>: folyamat, eszközök, szereplők.</li>
  <li><strong>Problémák + hatás (10 perc)</strong>: hol törik és mibe kerül.</li>
  <li><strong>Döntési folyamat (3 perc)</strong>: ki dönt, kritériumok, idővonal.</li>
  <li><strong>Következő lépés (2 perc)</strong>: időpont, felelős, deliverable.</li>
</ol>
<hr />
<h2>Gyakorlat (vezetett, 10–15 perc) — Kérdéssor v1</h2>
<ol>
  <li>Írj 5 “jelenlegi helyzet” kérdést.</li>
  <li>Írj 5 “hatás” kérdést (számokra kérdezz rá).</li>
  <li>Írj 3 “döntési folyamat” kérdést.</li>
</ol>
<h2>Gyakorlat (önálló, 5–10 perc) — Jegyzet sablon</h2>
<p>Készíts sablont: probléma, hatás, korlátok, szereplők, kritériumok, idővonal, következő lépés.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Tisztán le tudok vezetni egy discovery agendát.</li>
  <li>Tudok hatást számszerűsíteni.</li>
  <li>Mindig konkrét következő lépéssel zárok.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 13. nap: Discovery hívás',
    emailBody: `<h1>Sales Productivity 30 – 13. nap</h1>
<p>Diagnosztizálj: tisztázd a problémát, a hatást és a döntési folyamatot.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 14,
    title: 'Ajánlatírás – Tedd könnyűvé a következő lépést',
    content: `<h1>Ajánlatírás – Tedd könnyűvé a következő lépést</h1>
<p><em>A jó ajánlat döntéstámogató dokumentum: kimenet, terv, bizonyíték, kockázatkezelés.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Összeraksz egy újrahasznosítható 1 oldalas ajánlat sablont.</li>
  <li>A scope-ot a siker-kritériumokhoz és idővonalhoz kötöd.</li>
  <li>Opciókkal és feltételezésekkel csökkented a kockázatot.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>1 oldalas ajánlat sablon</h3>
<ol>
  <li>Probléma + hatás</li>
  <li>Elérendő kimenet (mérhető)</li>
  <li>Megközelítés (lépések + felelősségek)</li>
  <li>Idővonal (mérföldkövek)</li>
  <li>Bizonyíték (eset, referencia, pilot)</li>
  <li>Kockázatok + feltételezések</li>
  <li>Árazás + feltételek</li>
  <li>Következő lépés (döntési dátum)</li>
</ol>
<hr />
<h2>Gyakorlat (vezetett, 10–15 perc)</h2>
<ol>
  <li>Válassz egy aktív opportunity-t.</li>
  <li>Töltsd ki a sablont bullet pontokkal.</li>
  <li>Adj 2 opciót (Kezdő / Standard) anélkül, hogy feladnád a fő kimenetet.</li>
</ol>
<h2>Önellenőrzés</h2>
<ul>
  <li>Az ajánlat döntést segít, nem “brosúra”.</li>
  <li>A scope a sikerhez van kötve.</li>
  <li>A következő lépés konkrét.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 14. nap: Ajánlat',
    emailBody: `<h1>Sales Productivity 30 – 14. nap</h1>
<p>Írj 1 oldalas ajánlatot, ami gyors döntést tesz lehetővé.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 15,
    title: 'Tárgyalás – Cserélj, ne adj',
    content: `<h1>Tárgyalás – Cserélj, ne adj</h1>
<p><em>A tárgyalás scope-ról, kockázatról és feltételekről szól. Értéket védesz: cserébe kérsz.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Készítesz engedménytervet: mit adhatsz és mit kérsz cserébe.</li>
  <li>Objektív kritériumokkal támasztod alá az árat.</li>
  <li>A deal-t a kimenethez és kockázatcsökkentéshez kötöd.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Engedményterv</h3>
<ul>
  <li><strong>Adható</strong>: indulás dátuma, fizetési ütem, scope szűkítés, pilot.</li>
  <li><strong>Kérj cserébe</strong>: gyorsabb döntés, referencia, hosszabb elköteleződés, access a döntéshöz.</li>
  <li><strong>Ne add</strong>: a fő értéket ellenszolgáltatás nélkül.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10–15 perc) — Csere táblázat</h2>
<ol>
  <li>Írj 6 “Mit adhatok” és 6 “Mit kérek cserébe” elemet.</li>
  <li>Válaszd ki a top 3 cserédet.</li>
  <li>Írj 3 mondatot, ami az árat a kimenethez és kockázathoz köti.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van engedménytervem.</li>
  <li>Cserébe kérek elköteleződést.</li>
  <li>Nem “árversenyben” tárgyalok.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 15. nap: Tárgyalás',
    emailBody: `<h1>Sales Productivity 30 – 15. nap</h1>
<p>Védd az értéket: engedményt csak cserébe adj.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 16,
    title: 'Zárás – Vezesd le a döntési folyamatot',
    content: `<h1>Zárás – Vezesd le a döntési folyamatot</h1>
<p><em>A zárás nem nyomás, hanem egyértelmű döntési útvonal.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Készítesz Mutual Action Plan-t (közös akcióterv) egy aktív dealhez.</li>
  <li>Meghatározod a végső stage kilépési feltételeit.</li>
  <li>Megállítod a “talán” kimenetet konkrét lépésekkel.</li>
</ul>
<hr />
<h2>Mutual Action Plan (MAP)</h2>
<ol>
  <li>Ki dönt és ki ír alá</li>
  <li>Döntési kritériumok</li>
  <li>Bizonyíték lépések (pilot, referencia, security)</li>
  <li>Commercial lépések (terms, procurement)</li>
  <li>Dátum + felelős minden lépéshez</li>
</ol>
<hr />
<h2>Gyakorlat (vezetett, 10–15 perc)</h2>
<ol>
  <li>Válassz egy késői stage deal-t.</li>
  <li>Írj 6 lépést dátummal és felelőssel.</li>
  <li>Küldd el a MAP-et táblázatként a következő follow-upban.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van MAP-em.</li>
  <li>Van stage kilépési feltétel.</li>
  <li>Döntést ütemezek, nem “check-in”-t.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 16. nap: Zárás',
    emailBody: `<h1>Sales Productivity 30 – 16. nap</h1>
<p>Zárj tisztán: Mutual Action Plan és konkrét döntési lépések.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 17,
    title: 'Átadás és onboarding – Azt szállítsd, amit eladtál',
    content: `<h1>Átadás és onboarding – Azt szállítsd, amit eladtál</h1>
<p><em>A jó átadás megelőzi a korai lemorzsolódást. Sikerkritérium, scope és felelősségek tisztázása.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Készítesz átadási checklistet sales → delivery.</li>
  <li>Rögzíted a siker mérőszámait és az első mérföldkövet.</li>
  <li>Dokumentálod a feltételezéseket, hogy ne legyen scope drift.</li>
</ul>
<hr />
<h2>Átadási checklist</h2>
<ul>
  <li>Üzleti cél + hatás</li>
  <li>Szereplők + döntéshozó + “champion”</li>
  <li>In-scope / out-of-scope use case-ek</li>
  <li>Idővonal + első mérföldkő</li>
  <li>Kockázatok + mitigáció</li>
  <li>Siker mérőszámok</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10–15 perc)</h2>
<ol>
  <li>Készíts 1 oldalas átadási sablont.</li>
  <li>Töltsd ki egy friss “closed won” deal-re.</li>
  <li>Küldd el belsőleg kickoff előtt.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van átadási sablonom.</li>
  <li>A siker mérhető és explicit.</li>
  <li>A scope határok le vannak írva.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 17. nap: Átadás & onboarding',
    emailBody: `<h1>Sales Productivity 30 – 17. nap</h1>
<p>Előzd meg a lemorzsolódást jó átadással: kontextus, siker-kritériumok, scope.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 18,
    title: 'Account menedzsment – Tedd láthatóvá az értéket',
    content: `<h1>Account menedzsment – Tedd láthatóvá az értéket</h1>
<p><em>A retention folyamat. Mérd az eredményt és tarts rendszeres érték review-t.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Készítesz egyszerű “account health” pontszámot.</li>
  <li>Havi érték review-t vezetsz (QBR-lite).</li>
  <li>Figyeled az adoptációt és a blokkoló tényezőket.</li>
</ul>
<hr />
<h2>Account health (0–10)</h2>
<ul>
  <li>Adoptáció (0–3)</li>
  <li>Üzleti kimenet (0–3)</li>
  <li>Stakeholder aktivitás (0–2)</li>
  <li>Support / kockázati jelzések (0–2)</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10–15 perc)</h2>
<ol>
  <li>Definiáld a 4 kategóriát és pontozást.</li>
  <li>Pontozz 3 accountot.</li>
  <li>Válassz 1 akciót az “at risk” accountokra.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Gyorsan tudok health-et pontozni.</li>
  <li>Van havi érték review rutinom.</li>
  <li>Proaktív vagyok, nem reaktív.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 18. nap: Account menedzsment',
    emailBody: `<h1>Sales Productivity 30 – 18. nap</h1>
<p>Tartsd láthatóvá az értéket: health score és havi érték review.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 19,
    title: 'Bővítés (upsell) – Bizonyítékból, nem nyomásból',
    content: `<h1>Bővítés (upsell) – Bizonyítékból, nem nyomásból</h1>
<p><em>A bővítés a következő problémát oldja meg. Trigger + bizonyíték + kis kockázatú next step.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Azonosítod a bővítési triggereket és szereplőket.</li>
  <li>Megfogalmazol egy bővítési hipotézist (probléma → érték → bizonyíték).</li>
  <li>Kis kockázatú validációs lépést javasolsz.</li>
</ul>
<hr />
<h2>Triggerek</h2>
<ul>
  <li>Új csapat / régió / termékvonal</li>
  <li>Új KPI kezdeményezés</li>
  <li>Compliance/security igény</li>
  <li>Magas adoptáció egy csapatban → terjesztés</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10–15 perc)</h2>
<ol>
  <li>Válassz 1 “jó adoptációjú” accountot.</li>
  <li>Írd le: “Ha kiterjesztjük X-re, elérjük Y-t, mert Z bizonyíték.”</li>
  <li>Határozd meg a legkisebb következő lépést (pilot, workshop, add-on).</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Trigger alapján dolgozom.</li>
  <li>Bizonyítékra építek.</li>
  <li>Kis lépéssel validálok.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 19. nap: Bővítés (upsell)',
    emailBody: `<h1>Sales Productivity 30 – 19. nap</h1>
<p>Növekedj accounton belül: trigger + bizonyíték + kis kockázatú következő lépés.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 20,
    title: 'Megújítás és megtartás – Készíts mentő tervet',
    content: `<h1>Megújítás és megtartás – Készíts mentő tervet</h1>
<p><em>A megújítás hónapokkal korábban dől el. Figyeld a kockázati jeleket és javíts proaktívan.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Meghatározod a korai churn jelzéseket.</li>
  <li>Felépítesz 90/60/30 napos megújítási idővonalat.</li>
  <li>Megírsz egy “save plan” sablont.</li>
</ul>
<hr />
<h2>Kockázati jelek</h2>
<ul>
  <li>Adoptáció csökken</li>
  <li>A champion eltűnik</li>
  <li>Support ticketek nőnek</li>
  <li>Nincs friss érték review</li>
  <li>Procurement korán “spórolós” nyelvet használ</li>
</ul>
<hr />
<h2>Mentő terv sablon</h2>
<ul>
  <li>Jelzés</li>
  <li>Ok hipotézis</li>
  <li>Fix akciók (felelős + dátum)</li>
  <li>Visszaállás bizonyítéka (mérőszám)</li>
  <li>Megújítás next step</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van megújítási idővonalam.</li>
  <li>Tudom a korai jeleket.</li>
  <li>Tudok save plan-t írni.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 20. nap: Megújítás és megtartás',
    emailBody: `<h1>Sales Productivity 30 – 20. nap</h1>
<p>Proaktív megújítás: kockázati jelek, idővonal, mentő terv.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 21,
    title: 'Outbound e-mail – Személyre szabás időpazarlás nélkül',
    content: `<h1>Outbound e-mail – Személyre szabás időpazarlás nélkül</h1>
<p><em>Jó outbound: rövid, specifikus és a vevő valóságára épít (trigger).</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Megírsz egy 3 részes outbound e-mail sablont.</li>
  <li>Összeraksz egy 5 érintéses szekvenciát.</li>
  <li>Triggerrel növeled a relevanciát.</li>
</ul>
<hr />
<h2>3 részes sablon</h2>
<ol>
  <li><strong>Trigger</strong>: miért most írsz</li>
  <li><strong>Hipotézis</strong>: mit sejtesz problémának</li>
  <li><strong>Következő lépés</strong>: alacsony súrlódású akció (15 perc)</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Trigger alapú vagyok.</li>
  <li>Rövid és specifikus a szöveg.</li>
  <li>Konkrét CTA van.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 21. nap: Outbound e-mail',
    emailBody: `<h1>Sales Productivity 30 – 21. nap</h1>
<p>Trigger alapú outbound és 5 érintéses szekvencia.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 22,
    title: 'Cold call – Szerezz engedélyt gyorsan',
    content: `<h1>Cold call – Szerezz engedélyt gyorsan</h1>
<p><em>Cold call akkor működik, ha tiszteled az időt és diagnosztizálsz, nem pitch-elsz.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Használsz 20 másodperces nyitást, ami engedélyt kér.</li>
  <li>Felteszel 3 diagnosztikai kérdést pitch nélkül.</li>
  <li>Konkrét kimenettel zársz: meeting vagy tiszta “nem”.</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>20 mp alatt nyitok.</li>
  <li>Diagnosztizálok.</li>
  <li>Van tiszta next step.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 22. nap: Cold call',
    emailBody: `<h1>Sales Productivity 30 – 22. nap</h1>
<p>Gyors nyitás + diagnosztikai kérdések = több releváns meeting.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 23,
    title: 'Follow-up – A beszélgetésből elköteleződés',
    content: `<h1>Follow-up – A beszélgetésből elköteleződés</h1>
<p><em>A follow-up recap + döntési útvonal. Ne küldj “csak ránéznék” üzenetet.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Megírsz egy recap e-mail struktúrát, ami next stepet hoz.</li>
  <li>Rögzíted: döntések, felelősök, dátumok.</li>
  <li>Választási lehetőséget adsz (A/B/lezárás).</li>
</ul>
<hr />
<h2>Recap sablon</h2>
<ol>
  <li>Rövid összefoglaló (2–3 bullet)</li>
  <li>Döntések</li>
  <li>Nyitott kérdések</li>
  <li>Következő lépések (felelős + dátum)</li>
  <li>Javasolt időpontok</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Név + dátum minden next stephez.</li>
  <li>Nincs üres “check-in”.</li>
  <li>Konkrét döntési útvonal van.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 23. nap: Follow-up',
    emailBody: `<h1>Sales Productivity 30 – 23. nap</h1>
<p>Küldj recap-et, ami döntést és elköteleződést hoz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 24,
    title: 'Pipeline higiénia – Tartsd valósnak a CRM-et',
    content: `<h1>Pipeline higiénia – Tartsd valósnak a CRM-et</h1>
<p><em>A pipeline döntéstámogató rendszer. Rossz adat = rossz döntés.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Stage kilépési feltételeket írsz.</li>
  <li>Heti pipeline review checklistet futtatsz.</li>
  <li>Minimum mezőket kényszerítesz ki (next step + dátum, döntési dátum, kockázatok).</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Minden dealhez van next step dátummal.</li>
  <li>A stage-eknek van exit criteria-ja.</li>
  <li>Az előrejelzés valóság-alapú.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 24. nap: Pipeline higiénia',
    emailBody: `<h1>Sales Productivity 30 – 24. nap</h1>
<p>Minimum mezők + exit criteria + heti review.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 25,
    title: 'Időmenedzsment salesben – Védd a fókuszt',
    content: `<h1>Időmenedzsment salesben – Védd a fókuszt</h1>
<p><em>Termelékenység = fókusz blokkok + admin batching + pipeline prioritás.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Heti sablont készítesz 3 fókusz blokkal.</li>
  <li>Admin munkát batch-elsz.</li>
  <li>“Mai lista” a pipeline hatás alapján.</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Vannak védett fókusz blokkok.</li>
  <li>Batch-elem az admin feladatokat.</li>
  <li>Tudom, mi a legfontosabb ma.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 25. nap: Időmenedzsment',
    emailBody: `<h1>Sales Productivity 30 – 25. nap</h1>
<p>Fókusz blokkok, admin batching, és pipeline hatás szerinti priorizálás.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 26,
    title: 'AI használata salesben – Gyorsítás QA-val',
    content: `<h1>AI használata salesben – Gyorsítás QA-val</h1>
<p><em>Az AI gyorsítja a research-et és az írást, de csak szigorú QA-val.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>AI-val készítesz research összefoglalót és e-mail draftot.</li>
  <li>QA checklistet használsz (tény, tónus, adatbiztonság).</li>
  <li>3 újrahasznosítható prompt sablont készítesz.</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van 3 prompt sablonom.</li>
  <li>Ellenőrzöm a tényeket küldés előtt.</li>
  <li>Nem szivárog ki érzékeny adat.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 26. nap: AI salesben',
    emailBody: `<h1>Sales Productivity 30 – 26. nap</h1>
<p>Research és írás gyorsítása AI-val, szigorú QA-val.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 27,
    title: 'Mérőszámok – Vezető indikátorok, amiket irányítasz',
    content: `<h1>Mérőszámok – Vezető indikátorok, amiket irányítasz</h1>
<p><em>Ne csak az eredményt mérd. Vezető indikátorokból lesz konzisztens teljesítmény.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Definiálsz 5 vezető indikátort heti célértékkel.</li>
  <li>Egyszerű dashboardot készítesz.</li>
  <li>Heti review + 1 kísérlet (experiment).</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Egyszerű és következetes a dashboard.</li>
  <li>Hetente review-zok.</li>
  <li>Van egy konkrét kísérletem.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 27. nap: Mérőszámok',
    emailBody: `<h1>Sales Productivity 30 – 27. nap</h1>
<p>Vezető indikátorok, heti review és kísérletek.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 28,
    title: 'Értékesítési kézikönyv – Tedd átadhatóvá a folyamatot',
    content: `<h1>Értékesítési kézikönyv – Tedd átadhatóvá a folyamatot</h1>
<p><em>A kézikönyv csökkenti a véletlent. Dokumentált minimum standardok és sablonok.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Dokumentálod az ICP-t, stage-eket és sablonokat.</li>
  <li>Összeraksz egy “minimum kézikönyvet”.</li>
  <li>Leírod a nem-alkuképes minőségi szabályokat.</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van playbook vázam.</li>
  <li>Újrahasznosítható sablonjaim vannak.</li>
  <li>Explicit minőségi standardok vannak.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 28. nap: Kézikönyv',
    emailBody: `<h1>Sales Productivity 30 – 28. nap</h1>
<p>Dokumentáld a folyamatot, hogy skálázható és átadható legyen.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 29,
    title: 'Záró projekt – Futtasd a rendszert 7 napig',
    content: `<h1>Záró projekt – Futtasd a rendszert 7 napig</h1>
<p><em>Végrehajtási hét: fókusz blokkok, pipeline higiénia, follow-up és mérés.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>7 napos végrehajtási tervet készítesz a playbookból.</li>
  <li>Napi 2 vezető indikátort mérsz.</li>
  <li>Azonosítasz 1 szűk keresztmetszetet és javítod.</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van 7 napos tervem.</li>
  <li>Napi mérés van.</li>
  <li>Van 1 fókuszált kísérletem.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 29. nap: Záró projekt',
    emailBody: `<h1>Sales Productivity 30 – 29. nap</h1>
<p>Futtasd a rendszert egy héten át: fókusz, higiénia, follow-up, mérés.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
  {
    day: 30,
    title: 'Folyamatos fejlődés – Havi áttekintő rutin',
    content: `<h1>Folyamatos fejlődés – Havi áttekintő rutin</h1>
<p><em>A sales termelékenység kumulatív. Áttekintés → tanulság → kézikönyv frissítés.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
  <li>Havi áttekintő sablont készítesz.</li>
  <li>Megfogalmazod: stop / start / continue.</li>
  <li>Havonta 1 kézikönyv-fejlesztést beépítesz.</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<ul>
  <li>Van havi review sablonom.</li>
  <li>Vezető indikátorokat követek.</li>
  <li>Rendszeresen frissítem a playbookot.</li>
</ul>`,
    emailSubject: 'Sales Productivity 30 – 30. nap: Havi áttekintés',
    emailBody: `<h1>Sales Productivity 30 – 30. nap</h1>
<p>Építs havi áttekintő rutint, és fejleszd folyamatosan a sales rendszered.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Nyisd meg →</a></p>`,
  },
];

function lessonIdForDay(day: number) {
  return `${COURSE_ID}_DAY_${String(day).padStart(2, '0')}`;
}

async function main() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';
  if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI');

  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID }).select('_id courseId language durationDays').lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);

  console.log(`✅ Course ${COURSE_ID} loaded (${APPLY ? 'APPLY' : 'DRY-RUN'})`);
  console.log(`- onlyMissingLessons: ${ONLY_MISSING_LESSONS}`);

  for (const entry of LESSONS_12_30) {
    const lessonId = lessonIdForDay(entry.day);
    const existing = await Lesson.findOne({ lessonId }).select('_id').lean();
    if (existing && ONLY_MISSING_LESSONS) continue;

    const emailBody = entry.emailBody.replace(/\{\{APP_URL\}\}/g, appUrl);

    if (APPLY) {
      await Lesson.findOneAndUpdate(
        { lessonId },
        {
          $set: {
            lessonId,
            courseId: course._id,
            dayNumber: entry.day,
            language: 'hu',
            isActive: true,
            title: entry.title,
            content: entry.content,
            emailSubject: entry.emailSubject,
            emailBody,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ Lesson ${lessonId} upserted`);
    } else {
      console.log(`📝 Would upsert lesson ${lessonId}${existing ? ' (update)' : ' (create)'}`);
    }
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
