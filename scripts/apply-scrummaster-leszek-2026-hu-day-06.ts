/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 06 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-06.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-06.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_06';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Product Backlog alapok: érték, kockázat, bizonytalanság';

const content = `<h1>Product Backlog alapok: érték, kockázat, bizonytalanság</h1>
<p><em>Ma azt tanulod meg, hogyan lesz a backlogból döntés-támogató eszköz: mit érdemes előre venni, mit kell tisztázni, és mikor érdemes kísérletet futtatni ahelyett, hogy „megépítenéd a bizonytalanságot”.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy <strong>backlog item minimális kártyát</strong> (érték + kockázat + bizonytalanság + elfogadás).</li>
  <li>Megtanulsz egy egyszerű <strong>prioritási döntési keretet</strong>: érték vs kockázat vs bizonytalanság.</li>
  <li>Beállítasz egy <strong>tisztázási kaput</strong>: mikor „kész” egy item arra, hogy Sprintbe kerüljön.</li>
</ul>

<hr />

<h2>Mi a Product Backlog a gyakorlatban?</h2>
<ul>
  <li>A Product Backlog <strong>nem feladatlista</strong>, hanem döntések listája: „melyik munka opciót választjuk most, és miért?”.</li>
  <li>Egy jó backlog láthatóvá teszi:
    <ul>
      <li><strong>Érték</strong> (mit nyer a felhasználó / üzlet?)</li>
      <li><strong>Kockázat</strong> (mi romolhat el? mennyi a tét?)</li>
      <li><strong>Bizonytalanság</strong> (mit nem tudunk még?)</li>
    </ul>
  </li>
</ul>

<hr />

<h2>A 3 dimenzió röviden</h2>
<ul>
  <li><strong>Érték</strong>: outcome, nem aktivitás. Példa: „a felhasználó 2 perc alatt végig tud menni a folyamaton”.</li>
  <li><strong>Kockázat</strong>: ha rosszul csináljuk, mennyi a kár? (pénz, hírnév, jogi, biztonság, elégedettség)</li>
  <li><strong>Bizonytalanság</strong>: mennyi a „nem tudjuk” rész? Ha nagy, előbb tanulni kell.</li>
</ul>

<hr />

<h2>Eljárás: backlog item „minimális kártya” (v0.1)</h2>
<ol>
  <li><strong>Mi a célérték?</strong> (1 mondat outcome)</li>
  <li><strong>Mi a felhasználói jelzés?</strong> (miből derül ki, hogy jobb lett?)</li>
  <li><strong>Kockázat</strong> (1–2 fő kockázat)</li>
  <li><strong>Bizonytalanság</strong> (1–2 nyitott kérdés)</li>
  <li><strong>Elfogadás</strong> (2–4 konkrét feltétel)</li>
</ol>

<hr />

<h2>Prioritás-keret: „előbb tanulj, aztán építs”</h2>
<p>Ha a bizonytalanság magas, a legjobb első lépés gyakran <strong>kicsi kísérlet</strong> vagy tisztázás (pl. prototípus, mérés, stakeholder interjú) — nem a teljes megvalósítás.</p>

<h3>Gyors döntési szabály</h3>
<ul>
  <li><strong>Magas érték + magas bizonytalanság</strong> → először tanulás (spike/kísérlet), majd újrapriorizálás.</li>
  <li><strong>Magas érték + alacsony bizonytalanság</strong> → mehet előre, ha a kockázat kezelve van.</li>
  <li><strong>Alacsony érték</strong> → csak akkor érdemes, ha nagyon olcsó vagy nagy kockázatot csökkent.</li>
</ul>

<hr />

<h2>Példák (jó vs rossz backlog)</h2>

<h3>Példa 1: túl homályos item</h3>
<p><strong>Rossz:</strong> „Legyen jobb a keresés.”</p>
<p><strong>Jó:</strong> „A felhasználó 3 kattintásból találjon releváns találatot. Jelzés: keresésből indított konverzió + 0 találat arány. Kockázat: relevancia romlik. Bizonytalanság: mi a top 3 keresési szándék?”</p>

<h3>Példa 2: magas bizonytalanság</h3>
<p><strong>Rossz:</strong> azonnal nagy fejlesztés, mérés nélkül.</p>
<p><strong>Jó:</strong> 1 hetes kísérlet: prototípus + mérés + döntés, hogy egyáltalán megéri-e.</p>

<hr />

<h2>Tisztázási kapu (hogy Sprintben ne legyen találgatás)</h2>
<ul>
  <li>Van outcome mondat + legalább 2 elfogadási feltétel.</li>
  <li>Van 1 fő kockázat megnevezve és egy egyszerű védelem (teszt/ellenőrzés/limit).</li>
  <li>A nyitott kérdések száma nem „végtelen”; ha magas, előbb tanulási item kell.</li>
</ul>

<hr />

<h2>Akció (25 perc)</h2>
<ol>
  <li>Válassz egy homályos igényt (munka/iskola/saját projekt), és írd át a „minimális kártya” szerint.</li>
  <li>Jelölj ki 1 kockázatot és 1 bizonytalanságot, majd döntsd el: építés vagy kísérlet az első lépés.</li>
  <li>Írj 2 elfogadási feltételt úgy, hogy tesztelhető legyen.</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Van 1 backlog itemem outcome + jelzés + kockázat + bizonytalanság + elfogadás formában.</li>
  <li>✅ Tudok dönteni: előbb tanulás vagy előbb építés.</li>
  <li>✅ Tudok 2 tesztelhető elfogadási feltételt írni.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Empirizmus: mihez kell átláthatóság + ellenőrzés + alkalmazkodás.</li>
  <li>Stakeholder interjú és prototípus mint gyors tanulás.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 6. nap: Product Backlog (érték + kockázat + bizonytalanság)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma backlog item „minimális kártyát” készítesz: érték, kockázat, bizonytalanság, elfogadás — hogy a prioritás döntés legyen, ne találgatás.</p>
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

  console.log('✅ Day 06 applied');
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

