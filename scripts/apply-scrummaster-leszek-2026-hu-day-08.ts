/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 08 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-08.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-08.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_08';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Sprint Planning: cél, forecast, kockázat (kezdetektől jól)';

const content = `<h1>Sprint Planning: cél, forecast, kockázat (kezdetektől jól)</h1>
<p><em>Ma azt tanulod meg, hogyan lesz a Sprint Planningből valódi fókusz és vállalható terv. Kezdőknek a leggyakoribb hiba: „igen-t mondunk mindenre”, Sprint Goal nélkül. Eredmény: csúszás, frusztráció, rejtett kockázatok.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeraksz egy <strong>Sprint Planning menetrendet</strong> (30–60 perc, kimenetekkel).</li>
  <li>Megírsz 1 <strong>Sprint Goal</strong> mondatot, ami fókuszt ad.</li>
  <li>Készítesz egy <strong>Definition of Ready (DoR) v0.1</strong> listát (mi kell, hogy egy item vállalható legyen).</li>
</ul>

<hr />

<h2>Fogalmak (gyors és praktikus)</h2>
<ul>
  <li><strong>Sprint Goal</strong>: egy mondatos fókusz, ami megmondja, mi az a közös érték, amiért a Sprintben dolgoztok.</li>
  <li><strong>Forecast</strong>: vállalható előrejelzés, nem ígéret. A csapat a saját kapacitásával és kockázataival számol.</li>
  <li><strong>DoR</strong>: belépési kapu a Sprintbe. Ha a „készen áll” nincs meg, a Sprintben találgatás lesz.</li>
</ul>

<hr />

<h2>A Sprint Planning 3 kimenete (amit mindig ellenőrzöl)</h2>
<ol>
  <li><strong>Sprint Goal</strong> (1 mondat)</li>
  <li><strong>Sprint Backlog v0</strong> (mit vállal a csapat + milyen lépésekben halad)</li>
  <li><strong>Kockázatlista</strong> (1–3 fő kockázat + egyszerű védelem)</li>
</ol>

<hr />

<h2>Menetrend: Sprint Planning 45 percben (v0.1)</h2>
<ol>
  <li><strong>0–10 perc — cél tisztázás</strong>
    <ul>
      <li>Mi a legfontosabb érték most? (nem feladatlista)</li>
      <li>Megfogalmaztok 1 Sprint Goal mondatot.</li>
    </ul>
  </li>
  <li><strong>10–30 perc — kiválasztás (forecast)</strong>
    <ul>
      <li>Csak olyan item jöhet be, ami átmegy a DoR kapun.</li>
      <li>Kapacitás check (szabadság, meetingek, support): mi a reális?</li>
    </ul>
  </li>
  <li><strong>30–40 perc — kockázatok</strong>
    <ul>
      <li>Mi romolhat el? Mi bizonytalan?</li>
      <li>Védelem: teszt / spike / limit / review / rollback.</li>
    </ul>
  </li>
  <li><strong>40–45 perc — lezárás</strong>
    <ul>
      <li>Mi az első 1–2 lépés holnap reggel?</li>
      <li>Mi az a jel, ami azt mutatja: jó irányban vagytok?</li>
    </ul>
  </li>
</ol>

<hr />

<h2>Definition of Ready (DoR) v0.1 (kezdő, tartható)</h2>
<p>Válassz 6–8 pontot. A cél: ne kerüljön be „ködös” item.</p>
<ol>
  <li>Outcome mondat megvan (mitől lesz jobb).</li>
  <li>2–4 elfogadási feltétel megvan (tesztelhető).</li>
  <li>Legalább 1 kockázat meg van nevezve (és van egyszerű védelem).</li>
  <li>Nyitott kérdések száma alacsony (ha magas: előbb tisztázás/kísérlet).</li>
  <li>Függőségek láthatók (ha van: hogyan kezeljük?).</li>
  <li>Vágás/szeletelés megtörtént (ne legyen „minden egyszerre”).</li>
</ol>

<hr />

<h2>Példák (jó vs rossz)</h2>

<h3>Példa 1: Sprint Goal</h3>
<p><strong>Rossz:</strong> „Megcsináljuk a backlogot.”</p>
<p><strong>Jó:</strong> „A felhasználó a folyamaton hiba nélkül végig tud menni 3 perc alatt.”</p>

<h3>Példa 2: PO túl sokat akar</h3>
<p><strong>Rossz:</strong> a csapat mindenre igent mond, és a kockázatot „majd meglátjuk”.</p>
<p><strong>Jó:</strong> Sprint Goal-hoz kötött kiválasztás + kapacitás check + 1–2 item kivétele, amíg vállalható.</p>

<h3>Példa 3: magas bizonytalanság</h3>
<p><strong>Rossz:</strong> a Sprintbe kerül egy item, amiről senki nem tudja, mit jelent késznek.</p>
<p><strong>Jó:</strong> előbb 1 spike/kísérlet, és csak utána teljes vállalás.</p>

<hr />

<h2>Mérőpont (hogy lásd, javul-e)</h2>
<ul>
  <li><strong>Csúszás okai</strong>: hányszor csúszik item azért, mert nem volt tiszta elfogadás / túl nagy volt / bizonytalan volt?</li>
  <li><strong>Sprint Goal fókusz</strong>: a Sprint közepén még mindenki tudja-e 1 mondatban a célt?</li>
  <li><strong>Rework</strong>: csökken-e a visszagörgetés és a javítás?</li>
</ul>

<hr />

<h2>Akció (25–30 perc)</h2>
<ol>
  <li>Írj 1 Sprint Goal mondatot egy saját példára.</li>
  <li>Írj DoR v0.1-et 6–8 ponttal.</li>
  <li>Válassz 1 kockázatot, és írd le a védelmet (pl. teszt / spike / rollback).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok 1 Sprint Goal-t írni, ami fókuszt ad.</li>
  <li>✅ Van DoR v0.1-em, ami megfogja a ködös itemeket.</li>
  <li>✅ Tudok 1 kockázatot és 1 védelmet megnevezni.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Scrum Guide: Sprint Goal + Planning.</li>
  <li>Flow szemlélet: kevesebb párhuzamosság, több befejezés.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 8. nap: Sprint Planning (cél + forecast + kockázat)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma Sprint Planning menetrendet és DoR v0.1-et készítesz, hogy ne „igen mindenre” legyen, hanem fókusz és vállalható terv.</p>
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

  console.log('✅ Day 08 applied');
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

