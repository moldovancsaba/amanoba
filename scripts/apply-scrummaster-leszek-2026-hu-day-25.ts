/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 25 lesson content (backup-first).
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_25';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}
function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
const APPLY = hasFlag('--apply');

const title = 'Eszközök és workflow higiénia: board, ami a valóságot mutatja';

const content = `<h1>Eszközök és workflow higiénia: board, ami a valóságot mutatja</h1>
<p><em>Egy jó board (Jira/Linear/Trello) nem „admin”, hanem <strong>valóság-térkép</strong>: megmutatja, hol áll a munka, mi blokkol, és hol képződik torlódás. Ha a board kozmetika (státuszok nem jelentenek semmit), akkor a csapat elveszíti az empirikus működés egyik legfontosabb eszközét. Ma kapsz egy egyszerű, kezdő-barát „board hygiene” szabályrendszert és egy 30 perces átalakító gyakorlatot.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Van egy 8 pontos <strong>board hygiene</strong> szabálylistád.</li>
  <li>Képes vagy úgy felépíteni státuszokat, hogy azok <strong>folyamat-lépéseket</strong> jelentsenek, ne hangulatot.</li>
  <li>Átalakítasz egy boardot: oszlopok + WIP + „Done” definíció.</li>
</ul>

<hr />

<h2>A board 3 célja (ha ez nincs meg, csak admin)</h2>
<ol>
  <li><strong>Transzparencia</strong>: mindenki ugyanazt látja (SSOT).</li>
  <li><strong>Flow</strong>: látszik a torlódás, a WIP és a várakozás.</li>
  <li><strong>Döntés</strong>: könnyebb priorizálni, befejezni, és blokkolót kezelni.</li>
</ol>

<hr />

<h2>Board hygiene — 8 szabály, amitől működni fog</h2>
<ol>
  <li><strong>SSOT</strong>: ami nincs a boardon, az nem munka (csatornák: jelzés, nem prioritás).</li>
  <li><strong>Státusz = folyamat-lépés</strong>: „In Progress” helyett konkrét lépés (pl. „Implementálás”, „Review”, „Teszt”).</li>
  <li><strong>WIP limit</strong>: oszloponként vagy csapat-szinten; ha tele, akkor befejezés előnyben.</li>
  <li><strong>Blocked policy</strong>: mi számít blokkolónak, hogyan jelöljük, mikor eszkaláljuk.</li>
  <li><strong>Definition of Done</strong>: a „Done” nem „majdnem kész” (teszt/review/dokumentáció/átadás).</li>
  <li><strong>Kis szeletek</strong>: a kártya mérete legyen befejezhető időn belül; különben örök „folyamatban”.</li>
  <li><strong>Rövid leírás + elfogadási jel</strong>: 1–2 mondat + „mitől kész” jel (ne legyen homályos).</li>
  <li><strong>Rendszeres rendrakás</strong>: heti 10 perc „board cleanup” (duplikáció, elavult, hiányzó infó).</li>
</ol>

<hr />

<h2>Akció (30–40 perc) — Board átalakítás WIP és DoD szerint</h2>
<p>Válassz egy valós boardot (vagy képzeld el a csapatodét).</p>
<ol>
  <li>Írd le a mostani oszlopokat. Melyik jelent <em>valódi lépést</em>, és melyik csak „státusz-szó”?</li>
  <li>Tervezd újra 4–6 oszlopra: <strong>To do → Doing → Review → Test/Validate → Done</strong> (vagy a csapat valós lépései szerint).</li>
  <li>Állíts be egy egyszerű WIP limitet (pl. Doing=3, Review=2, Test=2).</li>
  <li>Írj 1 mondatos „Done” definíciót (mi nélkül nem kerülhet Done-ba).</li>
  <li>Írj egy „Blocked” szabályt: mikor jelölhető blokkoltnak és mi a következő lépés.</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ A board a valóságot mutatja, nem kozmetika.</li>
  <li>✅ A státuszok folyamat-lépések, és van WIP limit.</li>
  <li>✅ A Done definíció megvédi a csapatot a félkész munkától.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 25. nap: Board hygiene (Jira/Linear/Trello) — a board, ami a valóságot mutatja';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma egy 8 pontos board hygiene szabálylistát kapsz, és átalakítod a boardot WIP + DoD szerint.</p>
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
  console.log('✅ Day 25 applied');
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

