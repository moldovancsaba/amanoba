/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 24 lesson content (backup-first).
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_24';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}
function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
const APPLY = hasFlag('--apply');

const title = 'Minőség és technikai gyakorlatok kóstoló: mit kérdezz Scrum Masterként?';

const content = `<h1>Minőség és technikai gyakorlatok kóstoló: mit kérdezz Scrum Masterként?</h1>
<p><em>Scrum Masterként nem kell fejlesztőnek lenned, de <strong>tudnod kell a minőséget láthatóvá tenni</strong> és a csapatot olyan működés felé terelni, ahol a „kész” tényleg kész. Ma kapsz egy „kóstolót”: alap fogalmakat és egy kérdéslistát, amit bármely Dev csapatnál fel tudsz tenni anélkül, hogy technikai vitába fulladna.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Tudsz megkülönböztetni <strong>sebességet</strong> és <strong>stabil szállítást</strong> (flow + minőség együtt).</li>
  <li>Van egy rövid, használható kérdéslistád a minőség és technikai kockázatok feltárására.</li>
  <li>Képes vagy 1 konkrét javító kísérletet javasolni (2 hétre), ami csökkenti a hibákat és a reworköt.</li>
</ul>

<hr />

<h2>Minőség „kóstoló” — 5 alapfogalom, amit érdemes érteni</h2>
<ul>
  <li><strong>Definition of Done</strong>: tartalmazza a tesztet, review-t, dokumentálást, és azt, hogy mi számít „élesre késznek”.</li>
  <li><strong>Automatizált ellenőrzések</strong>: minél gyorsabban derül ki a hiba, annál olcsóbb kijavítani.</li>
  <li><strong>Build/CI állapot</strong>: ha gyakran „piros” a rendszer, az a flow ellensége.</li>
  <li><strong>Code review</strong>: minőség és tudásmegosztás, de ha bottleneck, akkor flow-probléma.</li>
  <li><strong>Technikai adósság</strong>: ha mindig halasztjuk, később sokszoros áron fizetjük meg (lassulás, hibák).</li>
</ul>

<hr />

<h2>10 kérdés, amit Scrum Masterként feltehetsz (és miért jó)</h2>
<ol>
  <li><strong>„Mitől kész egy munka?”</strong> — ha nem tiszta, folyamatos a félkészség és a visszanyitás.</li>
  <li><strong>„Mi a leggyakoribb hiba ok?”</strong> — fókusz a gyökérokra, nem a tünetre.</li>
  <li><strong>„Mikor derül ki a hiba?”</strong> — cél: minél korábban (olcsóbb javítás).</li>
  <li><strong>„Mennyire stabil a build/CI?”</strong> — a piros rendszer „rejtett WIP”.</li>
  <li><strong>„Mi blokkolja a release-t?”</strong> — rejtett jóváhagyás, manuális lépések, hiányzó teszt.</li>
  <li><strong>„Hol van review bottleneck?”</strong> — flow javítás, párosítás, limit, szabály.</li>
  <li><strong>„Mi az a minőségi kapu, amit nem engedünk el?”</strong> — pl. kritikus bug, biztonság, adatvesztés.</li>
  <li><strong>„Milyen mérőjel mutatja, hogy javulunk?”</strong> — pl. kevesebb visszanyitás, rövidebb átfutás.</li>
  <li><strong>„Mi a legnagyobb technikai kockázat a következő 2 hétben?”</strong> — fókusz a közeljövőre.</li>
  <li><strong>„Mi az 1 kísérlet, amit vállalunk?”</strong> — kicsi, mérhető, időkeretes adaptáció.</li>
</ol>

<hr />

<h2>Akció (25–35 perc) — Minőség kísérlet megtervezése</h2>
<p>Válassz egy valós fájdalmat (pl. sok bug, sok visszanyitás, lassú review, instabil build).</p>
<ol>
  <li>Fogalmazd meg: mi a cél 2 hét alatt? (pl. „visszanyitások száma -30%”).</li>
  <li>Válassz 1 beavatkozást: DoD frissítés / review szabály / automatizált ellenőrzés / WIP limit.</li>
  <li>Dönts mérőjelről: mit fogtok nézni minden nap?</li>
  <li>Állapodjatok meg: mikor értékelitek ki (következő retro vagy review)?</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Van 10 kérdésem, amivel a minőséget láthatóvá tudom tenni.</li>
  <li>✅ Tudok 2 hetes minőségi kísérletet javasolni mérőjellel.</li>
  <li>✅ Tudom, hogy a „gyorsabb” csak akkor jó, ha a minőség nem romlik.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 24. nap: Minőség kóstoló + kérdéslista (Scrum Master szemmel)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma egy minőség „kóstolót” kapsz és 10 kérdést, amivel technikai viták nélkül is előre tudsz vinni egy csapatot.</p>
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
  console.log('✅ Day 24 applied');
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

