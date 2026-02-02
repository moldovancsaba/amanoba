/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 26 lesson content (backup-first).
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_26';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}
function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
const APPLY = hasFlag('--apply');

const title = 'Karrier térkép: junior → mid → senior Scrum Master';

const content = `<h1>Karrier térkép: junior → mid → senior Scrum Master</h1>
<p><em>Sokan azt hiszik, a Scrum Master karrier „meetingek szervezése”. A valóság: a szintlépés a <strong>hatásban</strong> mérhető. Ma kapsz egy egyszerű karrier térképet és egy 90 napos kezdő tervet: milyen kompetenciákat építs, mit mérj, és hogyan kommunikáld az eredményt.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Megkülönbözteted: junior vs mid vs senior Scrum Master fókusz.</li>
  <li>Elkészítesz egy <strong>90 napos fejlődési tervet</strong> (3 kompetencia + mérőjelek).</li>
  <li>Megtanulsz 1 egyszerű „eredmény sztorit” elmondani (helyzet → beavatkozás → hatás).</li>
</ul>

<hr />

<h2>Mit jelent a szint? (nem cím, hanem hatás)</h2>
<h3>Junior</h3>
<ul>
  <li>Fókusz: alap Scrum események működtetése + átláthatóság + alap facilitáció.</li>
  <li>Jellemző hatás: kevesebb káosz, tisztább backlog/board, stabilabb ritmus.</li>
</ul>

<h3>Mid</h3>
<ul>
  <li>Fókusz: flow és együttműködés javítása, konfliktusok kezelése, rendszer-szintű akadályok feltárása.</li>
  <li>Jellemző hatás: rövidebb átfutás, kevesebb félkész munka, jobb stakeholder feedback.</li>
</ul>

<h3>Senior</h3>
<ul>
  <li>Fókusz: szervezeti működés és stratégia támogatása, több csapat, coaching, vezetői partneri kapcsolat.</li>
  <li>Jellemző hatás: fenntartható szállítás, mérhető outcomes, kultúra és döntési rendszer javul.</li>
</ul>

<hr />

<h2>3 kompetencia, ami kezdőként a legtöbbet hozza</h2>
<ol>
  <li><strong>Facilitáció</strong>: outcome, timebox, döntési szabályok.</li>
  <li><strong>Flow gondolkodás</strong>: WIP, torlódás, befejezés előnyben.</li>
  <li><strong>Stakeholder kommunikáció</strong>: elvárások, feedback, „miért így dolgozunk?”.</li>
</ol>

<hr />

<h2>Akció (35–45 perc) — 90 napos junior SM terv</h2>
<p>Válassz 3 kompetenciát (fentről vagy sajátot), és mindegyikhez írj 1–2 mérőjelet.</p>
<ol>
  <li><strong>1–30. nap</strong>: alap működés stabilizálás (board hygiene, DoD, események).</li>
  <li><strong>31–60. nap</strong>: flow javítás (WIP, torlódások, blokk policy, slicing).</li>
  <li><strong>61–90. nap</strong>: stakeholder rendszer (review minőség, visszajelzés kezelés, transzparencia).</li>
</ol>
<p><strong>Példa mérőjelek</strong>: visszanyitások csökkenése, blokk ideje, átfutási idő trend, meetingek hasznossága (1–5), review feedback ciklus ideje.</p>

<hr />

<h2>„Eredmény sztori” sablon (interjúhoz is jó)</h2>
<ul>
  <li><strong>Helyzet</strong>: mi volt a fájdalom?</li>
  <li><strong>Beavatkozás</strong>: mit változtattál meg és miért?</li>
  <li><strong>Hatás</strong>: mi javult mérhetően?</li>
  <li><strong>Tanulság</strong>: mit csinálnál másképp legközelebb?</li>
</ul>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudom, hogy a szintlépés hatásban mérhető.</li>
  <li>✅ Van 90 napos tervem mérőjelekkel.</li>
  <li>✅ Tudok eredményt kommunikálni röviden és hitelesen.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 26. nap: Karrier térkép + 90 napos fejlődési terv';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma kapsz egy karrier térképet (junior → mid → senior) és elkészíted a 90 napos fejlődési tervedet.</p>
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
  console.log('✅ Day 26 applied');
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

