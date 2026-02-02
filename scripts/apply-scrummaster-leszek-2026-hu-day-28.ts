/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 28 lesson content (backup-first).
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_28';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}
function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
const APPLY = hasFlag('--apply');

const title = 'Etika és határok: mikor mondasz nemet?';

const content = `<h1>Etika és határok: mikor mondasz nemet?</h1>
<p><em>Scrum Masterként nem a „kedvenc kolléga” a célod, hanem a <strong>fenntartható, tiszta működés</strong>. Ehhez néha nemet kell mondani – úgy, hogy közben partneri maradsz. Ma kapsz egy egyszerű határ-rendszert, 3 használható mondatot, és egy gyakorlati szituációt.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Felismersz 5 tipikus „határsértő” kérést (amibe kezdők belecsúsznak).</li>
  <li>Van 3 kész mondatod a „nem”-hez (partneri, nem agresszív).</li>
  <li>Le tudsz vezetni egy helyzetet: kérés → kockázat → alternatíva → döntés.</li>
</ul>

<hr />

<h2>Mikor kell nemet mondani? (5 tipikus jel)</h2>
<ol>
  <li><strong>Etikátlan</strong>: hazugság, adatok elhallgatása, „hamis kész” jelölés.</li>
  <li><strong>Fenntarthatatlan</strong>: túlóra kötelezővé tétele, állandó tűzoltás normalizálása.</li>
  <li><strong>Empirizmus ellen</strong>: transzparencia lekapcsolása („ne írjuk ki a blokkokat”).</li>
  <li><strong>Szerep összemosás</strong>: Scrum Master mint „parancsnok” vagy „admin kapuőr”.</li>
  <li><strong>Bizalom rombolása</strong>: blaming kultúra, bűnbakkeresés ösztönzése.</li>
</ol>

<hr />

<h2>3 mondat, amivel nemet tudsz mondani (partneri módon)</h2>
<ol>
  <li><strong>„Ezt így nem vállalom, mert kockázatot hoz. Viszont ezt a két opciót javaslom…”</strong></li>
  <li><strong>„Megértem a célt. Ha ezt választjuk, ezek lesznek a tradeoffok. Melyik opciót választjuk tudatosan?”</strong></li>
  <li><strong>„A csapat védelme és a transzparencia része a munkám. Mutassuk meg a valóságot, és oldjuk meg együtt.”</strong></li>
</ol>

<hr />

<h2>Akció (25–35 perc) — 1 vezetői kérés kezelése</h2>
<p>Válassz egy helyzetet (példák):</p>
<ul>
  <li>„A Daily-n mindenki adjon státuszt nekem.”</li>
  <li>„Tegyétek kötelezővé a túlórát, mert csúszunk.”</li>
  <li>„Jelöljétek Done-nak, majd később javítjuk.”</li>
</ul>
<p>Vázlat:</p>
<ol>
  <li><strong>Kérés</strong>: mit kérnek pontosan?</li>
  <li><strong>Kockázat</strong>: mi romlik (minőség, bizalom, fenntarthatóság, transzparencia)?</li>
  <li><strong>Alternatíva</strong>: 2 opció, ami eléri a célt kisebb kárral.</li>
  <li><strong>Döntés</strong>: mit vállalsz és mit nem, és mi lesz a következő lépés?</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok nemet mondani úgy, hogy partneri maradok.</li>
  <li>✅ A nemet tradeoffokkal és alternatívákkal támasztom alá.</li>
  <li>✅ A transzparenciát és a csapat egészségét védeni tudom.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 28. nap: Etika és határok (hogyan mondj nemet partnerként)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma határ-rendszert kapsz és 3 kész mondatot a „nem”-hez, plusz egy gyakorlatot vezetői kérések kezelésére.</p>
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
  console.log('✅ Day 28 applied');
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

