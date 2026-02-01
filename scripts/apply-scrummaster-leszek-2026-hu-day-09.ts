/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 09 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-09.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-09.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_09';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Daily Scrum: rövid, hasznos, nem státusz-meeting';

const content = `<h1>Daily Scrum: rövid, hasznos, nem státusz-meeting</h1>
<p><em>Ma megvédjük a Daily-t attól, hogy státuszkör legyen. A Daily célja nem az, hogy mindenki beszámoljon, hanem hogy a fejlesztők összehangolják a napi munkát a Sprint Goal felé.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeraksz egy <strong>10 perces Daily keretet</strong> (timebox + kimenet + döntési szabály).</li>
  <li>Megtanulsz egy <strong>akadály-first</strong> struktúrát, hogy a csapat gyorsan reagáljon.</li>
  <li>Kapsz 2 rövid <strong>scriptet</strong> tipikus helyzetekre (vezető státuszt kér / Daily szétesik).</li>
</ul>

<hr />

<h2>Mi a Daily kimenete?</h2>
<p><strong>Kimenet</strong> = a mai koordináció: ki kivel dolgozik, mi változik a sorrenden, mi az akadály, és mi a következő konkrét lépés.</p>
<p>Ha a Daily végén nincs változás a tervben vagy nincs akadály-kezelés, akkor a Daily valószínűleg státusz.</p>

<hr />

<h2>10 perces Daily keret (v0.1)</h2>
<ol>
  <li><strong>0–2 perc — Sprint Goal fókusz</strong>
    <ul>
      <li>Mi az a mai legfontosabb lépés, ami a Sprint Goal felé visz?</li>
    </ul>
  </li>
  <li><strong>2–7 perc — akadály-first</strong>
    <ul>
      <li>Mi blokkol? (ha semmi, akkor mi a legnagyobb kockázat ma?)</li>
      <li>Kinek kell kivel összeülni azonnal (Daily után 5–10 percre)?</li>
    </ul>
  </li>
  <li><strong>7–10 perc — 1–3 döntés</strong>
    <ul>
      <li>Mit változtatunk ma a sorrenden?</li>
      <li>Melyik munka áll meg, amíg az akadály nincs kezelve?</li>
    </ul>
  </li>
</ol>

<hr />

<h2>Döntési szabályok (hogy ne csússzon szét)</h2>
<ul>
  <li><strong>Timebox</strong>: 10 perc. Ha vita van, „parking lot”, és külön 10 perc a megfelelő emberekkel.</li>
  <li><strong>Nem státusz</strong>: nem „mit csináltam tegnap”, hanem „mi a mai koordináció”.</li>
  <li><strong>Akadály = akció</strong>: ha akadály van, legyen owner és következő lépés.</li>
</ul>

<hr />

<h2>2 script (kezdő Scrum Masternek)</h2>
<ul>
  <li><strong>Vezető státuszt kér:</strong> „A Daily nem státusz-meeting. Ha státuszt szeretnél, csináljunk külön 10 perc összefoglalót. A Daily-t megvédem a csapat koordinációja miatt.”</li>
  <li><strong>Daily szétesik vitába:</strong> „Megállítom: ez fontos, de nem fér bele a timeboxba. Parkoljuk, és a Daily után az érintettek 10 percben döntsenek. Most zárjuk le 1 mai koordinációs döntéssel.”</li>
</ul>

<hr />

<h2>Példák (jó vs rossz)</h2>

<h3>Példa 1: 25 perces státuszkör</h3>
<p><strong>Rossz:</strong> mindenki beszámol, de semmi nem változik.</p>
<p><strong>Jó:</strong> 10 perc, akadály-first, a végén 2 döntés (sorrend + együttműködés), vita külön.</p>

<h3>Példa 2: „Nincs akadály” kultúra</h3>
<p><strong>Rossz:</strong> senki nem meri felhozni a kockázatot.</p>
<p><strong>Jó:</strong> ha nincs akadály, mindenki mond 1 kockázatot vagy függőséget, hogy látható legyen a valóság.</p>

<hr />

<h2>Mérőpont (hogy lásd, jobb lett-e)</h2>
<ul>
  <li><strong>Időtartam</strong>: tartjátok-e a 10 percet?</li>
  <li><strong>Döntés arány</strong>: hány Daily végződik 1–3 konkrét döntéssel?</li>
  <li><strong>Megszakítások</strong>: csökken-e nap közben a random koordináció (mert a Daily megoldja)?</li>
</ul>

<hr />

<h2>Akció (20 perc)</h2>
<ol>
  <li>Írd le a 10 perces keretet a saját szavaiddal (3 blokk + 1 kimenet).</li>
  <li>Írd át a két scriptedet úgy, hogy természetesen hangozzon a stílusodban.</li>
  <li>Válassz 1 mérőpontot (időtartam / döntés arány / megszakítás), és döntsd el, hogyan rögzíted 1 hétig.</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudom, mi a Daily kimenete (mai koordináció).</li>
  <li>✅ Van 10 perces keretem és döntési szabályom.</li>
  <li>✅ Van 2 beavatkozási mondatom tipikus helyzetre.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Scrum Guide: Daily Scrum célja.</li>
  <li>Facilitáció: timebox + parking lot + döntési kérdés.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 9. nap: Daily Scrum (10 perc, döntésekkel)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma kapsz egy 10 perces Daily keretet: akadály-first, 1–3 döntés a végén, és két script tipikus helyzetekre.</p>
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

  console.log('✅ Day 09 applied');
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

