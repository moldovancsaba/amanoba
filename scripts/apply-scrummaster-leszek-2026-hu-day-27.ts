/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 27 lesson content (backup-first).
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_27';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}
function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
const APPLY = hasFlag('--apply');

const title = 'Interjú kóstoló: kérdésminták és jó válasz struktúra';

const content = `<h1>Interjú kóstoló: kérdésminták és jó válasz struktúra</h1>
<p><em>Scrum Master interjún a legtöbb jelölt elbukik azon, hogy vagy túl elméleti („a Scrum szerint…”), vagy túl általános („én jó facilitator vagyok”). A jó válasz <strong>konkrét beavatkozás</strong> + <strong>mérhető hatás</strong> + <strong>tanulság</strong>. Ma kapsz 10 tipikus kérdést és egy rövid válasz-sablont, amit bármely helyzetre rá tudsz húzni.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Van 10 tipikus Scrum Master interjúkérdésed.</li>
  <li>Használod a „<strong>Helyzet → Beavatkozás → Hatás → Tanulság</strong>” sablont.</li>
  <li>2 kérdésre készítesz konkrét válasz vázlatot.</li>
</ul>

<hr />

<h2>Válasz-sablon (1–2 perc)</h2>
<ol>
  <li><strong>Helyzet</strong>: Mi volt a probléma? (1 mondat)</li>
  <li><strong>Beavatkozás</strong>: Mit tettél konkrétan? (2–3 lépés)</li>
  <li><strong>Hatás</strong>: Mi javult? (mérőjel vagy konkrét jel)</li>
  <li><strong>Tanulság</strong>: Mit vinnél tovább / mit csinálnál másképp?</li>
</ol>

<hr />

<h2>10 tipikus Scrum Master kérdés (kóstoló)</h2>
<ol>
  <li>„Mesélj egy konfliktusról a csapatban. Mit tettél?”</li>
  <li>„Mit csinálsz, ha a Daily státusz meetinggé válik?”</li>
  <li>„Hogyan kezelsz egy blokkot, ami nem a csapaton múlik?”</li>
  <li>„Mit csinálsz, ha a PO túl sokat hoz a Sprintbe?”</li>
  <li>„Hogyan teszed láthatóvá a minőségi problémát?”</li>
  <li>„Mesélj olyanról, amikor a csapat ellenállt.”</li>
  <li>„Hogyan kezeled a stakeholder nyomást a scope-ra?”</li>
  <li>„Mi a szereped a retrospektív után?”</li>
  <li>„Milyen mérőket nézel és miért?”</li>
  <li>„Mit csinálsz az első hetedben egy új csapatnál?”</li>
</ol>

<hr />

<h2>Akció (25–35 perc) — 2 válasz vázlat</h2>
<p>Válassz 2 kérdést a listából, és írd meg a sablonnal:</p>
<ul>
  <li><strong>Helyzet</strong>: …</li>
  <li><strong>Beavatkozás</strong>: 1) … 2) … 3) …</li>
  <li><strong>Hatás</strong>: … (mérőjel vagy jel)</li>
  <li><strong>Tanulság</strong>: …</li>
</ul>

<hr />

<h2>Gyakori hibák (amit kerülj)</h2>
<ul>
  <li><strong>Blaming</strong>: „A csapat volt a hibás” → helyette rendszer és folyamat.</li>
  <li><strong>Elmélet</strong>: definíciók helyett konkrét beavatkozás.</li>
  <li><strong>Nincs hatás</strong>: „jó lett” helyett mérőjel vagy megfigyelhető változás.</li>
</ul>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok 1–2 perces választ adni konkrét példával.</li>
  <li>✅ A válaszban van beavatkozás és hatás.</li>
  <li>✅ A tanulság hitelessé tesz.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 27. nap: Interjú kóstoló (kérdések + jó válasz struktúra)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma 10 tipikus interjúkérdést kapsz és egy válasz-sablont, amit bármely helyzetre használhatsz.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/SCRUMMASTER_LESZEK_2026_HU/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`;

async function main() {
  await connectDB();
  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).lean();
  if (!lesson) throw new Error(`Lesson not found: ${LESSON_ID}`);

  const current = {
    title: String((lesson as any).title ?? ''),
    content: String((lesson as any).content ?? ''),
    emailSubject: String((lesson as any).emailSubject ?? ''),
    emailBody: String((lesson as any).emailBody ?? ''),
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
      `- current.contentPreview: ${JSON.stringify(current.content.length > 200 ? `${current.content.slice(0, 200)}…` : current.content)}`
    );
    console.log(`- would backup to: ${backupFile}`);
    console.log(`- would set title/content/email fields (keeping isActive as-is)`);
    await mongoose.disconnect();
    return;
  }

  mkdirSync(backupDir, { recursive: true });
  writeFileSync(backupFile, JSON.stringify(backupPayload, null, 2));
  const update = await Lesson.updateOne({ lessonId: LESSON_ID }, { $set: { title, content, emailSubject, emailBody } });
  console.log('✅ Day 27 applied');
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

