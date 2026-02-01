/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 02 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-02.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-02.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_02';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Scrum kóstoló: események, artefaktok, empirizmus';

const content = `<h1>Scrum kóstoló: események, artefaktok, empirizmus</h1>
<p><em>Ma kapsz egy „Scrum-térképet”: hogyan áll össze a ritmus (Sprint → események), mi a kézzelfogható kimenet (artefaktok), és mit jelent a gyakorlatban az empirizmus: átláthatóság → ellenőrzés → alkalmazkodás.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy 1 oldalas <strong>Scrum-térképet</strong> (szerepek + események + artefaktok + 3 alap szabály).</li>
  <li>Megtanulod, hogyan néz ki egy <strong>jó Sprint Goal</strong>, és hogyan védi a fókuszt.</li>
  <li>Megérted, hogy a Scrum értelme nem a meetingek „letudása”, hanem a <strong>gyors tanulás és jobb döntések</strong> bizonytalanságban.</li>
</ul>

<hr />

<h2>Fogalmak 2 percben (gyakorlatias)</h2>
<ul>
  <li><strong>Empirizmus</strong>: a döntéseket a valóság alapján hozod. Ehhez kell:
    <ul>
      <li><strong>Átláthatóság</strong> (mindenki ugyanazt a valóságot látja)</li>
      <li><strong>Ellenőrzés</strong> (megnézzük, mi történt ténylegesen)</li>
      <li><strong>Alkalmazkodás</strong> (változtatunk: terven, fókuszon, munkán, szokáson)</li>
    </ul>
  </li>
  <li><strong>Artefakt</strong>: olyan kimenet, ami segít „láthatóvá tenni” a munkát és a döntéseket (nem dekoráció).</li>
  <li><strong>Időkeret (timebox)</strong>: védelem a végtelen viták ellen. A cél: döntés és következő lépés.</li>
</ul>

<hr />

<h2>A Scrum 3 artefaktja (amit érdemes képként látni)</h2>
<ol>
  <li><strong>Product Backlog</strong>: a munka opciók listája + prioritás + tisztázottság szintje.</li>
  <li><strong>Sprint Backlog</strong>: mit vállalunk most + hogyan fogunk haladni (látható terv a csapatnak).</li>
  <li><strong>Increment</strong>: a kész, használható eredmény (kész definíció szerint).</li>
</ol>

<h3>Minimális minőségi szabály (kezdő-barát)</h3>
<ul>
  <li>Ha nem tudod 1 mondatban megfogalmazni, mi az Increment, akkor a Review csak „bemutató” lesz döntés nélkül.</li>
  <li>Ha nincs közös „kész” definíció (Definition of Done), akkor az átláthatóság hamis: mindenki mást ért kész alatt.</li>
</ul>

<hr />

<h2>A Scrum 5 eseménye (mi a cél és mi a kimenet)</h2>
<ol>
  <li><strong>Sprint</strong> (keret): cél, hogy legyen egy kézzelfogható eredmény és tanulás.</li>
  <li><strong>Sprint Planning</strong>: kimenet = <strong>Sprint Goal + első verzió Sprint Backlog</strong>.</li>
  <li><strong>Daily Scrum</strong>: kimenet = <strong>mai koordináció</strong> (akadályok, sorrend, együttműködés).</li>
  <li><strong>Sprint Review</strong>: kimenet = <strong>döntések</strong> (mi megy tovább, mi változik, mi a következő érték).</li>
  <li><strong>Retrospective</strong>: kimenet = <strong>1–2 kísérlet</strong> (pici változás, mérhető hatás, felelős, határidő).</li>
</ol>

<hr />

<h2>Eljárás: hogyan építs „empirikus” Sprint ritmust 30 percben</h2>
<ol>
  <li><strong>Átláthatóság</strong>: legyen egy tábla, ami a valós állapotot mutatja (WIP szabály, kész definíció).</li>
  <li><strong>Ellenőrzés</strong>: a Review-n legyen 2 dolog kötelező:
    <ul>
      <li>mi készült el ténylegesen (Increment)</li>
      <li>milyen tanulságot hozott (felhasználói jelzés, mérés, kockázat)</li>
    </ul>
  </li>
  <li><strong>Alkalmazkodás</strong>: a Retro végén legyen 1 kísérlet:
    <ul>
      <li>mit változtatunk pontosan</li>
      <li>hogyan mérjük 1 Sprint alatt</li>
      <li>mikor nézzük meg az eredményt</li>
    </ul>
  </li>
</ol>

<hr />

<h2>Jó vs rossz (gyors kontraszt)</h2>

<h3>Daily Scrum</h3>
<p><strong>Rossz:</strong> státusz kör (mindenki beszámol, de nem dől el semmi).</p>
<p><strong>Jó:</strong> koordináció (mi a mai cél, ki kivel dolgozik együtt, mi az akadály, mi változik a sorrenden).</p>

<h3>Sprint Review</h3>
<p><strong>Rossz:</strong> demó, aminek a végén nincs döntés.</p>
<p><strong>Jó:</strong> döntés meeting (mi a következő érték, mit hagyunk el, mit kell tisztázni, milyen kockázat nőtt/csökkent).</p>

<h3>Retrospective</h3>
<p><strong>Rossz:</strong> panaszkör és „majd egyszer jobb lesz”.</p>
<p><strong>Jó:</strong> 1 kísérlet 1 metrikával (pl. Daily 10 perces timebox + 2 perc akadály-blokk; cél: kevesebb megszakítás nap közben).</p>

<hr />

<h2>Példák (2 gyors szituáció)</h2>

<h3>Példa 1: Sprint Goal fókusz</h3>
<p><strong>Helyzet:</strong> a csapat egyszerre akar „mindent kicsit” javítani. A Sprint végén sok a rész-feladat, de nincs kézzelfogható érték.</p>
<p><strong>Jobb megoldás:</strong> 1 érték-alapú cél + 2–3 kulcs backlog elem, ami ezt támogatja. Kimenet: egy mondatos cél + lista + „kész” kritérium.</p>

<h3>Példa 2: Review mint döntés</h3>
<p><strong>Helyzet:</strong> a stakeholder-ek kedvesen bólogatnak, de nem derül ki, mi változik.</p>
<p><strong>Jobb megoldás:</strong> 3 kérdés (érték/hiány/kockázat) + 1–2 rögzített döntés a következő backlog lépésekről.</p>

<hr />

<h2>Akció (20–25 perc): Scrum-térkép + Sprint Goal</h2>
<ol>
  <li>Rajzold le 1 oldalon:
    <ul>
      <li>Artefaktok (Product Backlog / Sprint Backlog / Increment)</li>
      <li>Események (Planning / Daily / Review / Retro)</li>
      <li>Hová tartozik az átláthatóság, ellenőrzés, alkalmazkodás</li>
    </ul>
  </li>
  <li>Írj 1 Sprint Goal példát egy tetszőleges témára (munka/iskola/saját projekt):
    <ul>
      <li><strong>Jó minta:</strong> „A felhasználó 3 perc alatt végig tud menni a rendelésen hiba nélkül.”</li>
      <li><strong>Rossz minta:</strong> „Megcsináljuk a feladatokat a backlogból.”</li>
    </ul>
  </li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudom, mi a három artefakt, és mitől „valódi” kimenet.</li>
  <li>✅ Tudok mondani 1 mondatot: mi a Daily kimenete.</li>
  <li>✅ Tudok írni 1 Sprint Goal-t, ami fókuszt ad.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Scrum Guide: artefaktok és események rész (olvasd úgy, hogy kimeneteket keresel).</li>
  <li>Retrospective facilitation: 1 kísérlet, 1 mérés, 1 Sprint — egyszerűen.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 2. nap: Scrum kóstoló (ritmus + kimenetek)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma kapsz egy „Scrum-térképet”: események, artefaktok, és hogyan lesz az egészből tanulás és jobb döntés.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/SCRUMMASTER_LESZEK_2026_HU/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`;

async function main() {
  await connectDB();

  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).lean();
  if (!lesson) throw new Error(`Lesson not found: ${LESSON_ID}`);

  const current = {
    title: String((lesson as { title?: unknown }).title ?? ''),
    content: String((lesson as { content?: unknown }).content ?? ''),
    emailSubject: String((lesson as { emailSubject?: unknown }).emailSubject ?? ''),
    emailBody: String((lesson as { emailBody?: unknown }).emailBody ?? ''),
  };

  const backupPayload = {
    generatedAt: new Date().toISOString(),
    courseId: COURSE_ID,
    lessonId: LESSON_ID,
    title: current.title,
    content: current.content,
    emailSubject: current.emailSubject,
    emailBody: current.emailBody,
  };

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'lesson-backups', COURSE_ID);
  const backupFile = join(backupDir, `${LESSON_ID}__${stamp}.json`);

  if (!APPLY) {
    console.log('DRY RUN (no DB writes).');
    console.log(`- lessonId: ${LESSON_ID}`);
    console.log(`- current.title: ${JSON.stringify(current.title)}`);
    console.log(`- current.emailSubject: ${JSON.stringify(current.emailSubject)}`);
    console.log(
      `- current.contentPreview: ${JSON.stringify(
        current.content.length > 200 ? `${current.content.slice(0, 200)}…` : current.content
      )}`
    );
    console.log(`- would backup to: ${backupFile}`);
    console.log(`- would set title/content/email fields (keeping isActive as-is)`);
    await mongoose.disconnect();
    return;
  }

  mkdirSync(backupDir, { recursive: true });
  writeFileSync(backupFile, JSON.stringify(backupPayload, null, 2));

  const update = await Lesson.updateOne(
    { lessonId: LESSON_ID },
    {
      $set: {
        title,
        content,
        emailSubject,
        emailBody,
      },
    }
  );

  console.log('✅ Day 02 applied');
  console.log(`- lessonId: ${LESSON_ID}`);
  console.log(`- matched: ${update.matchedCount}`);
  console.log(`- modified: ${update.modifiedCount}`);
  console.log(`- backup: ${backupFile}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
