/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 23 lesson content (backup-first).
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_23';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}
function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
const APPLY = hasFlag('--apply');

const title = 'Kockázat és bizonytalanság: spike, discovery, prototípus';

const content = `<h1>Kockázat és bizonytalanság: spike, discovery, prototípus</h1>
<p><em>Scrum Masterként gyakran nem az a kérdés, hogy „mit csináljunk?”, hanem hogy <strong>mit tudunk biztosan</strong>, mi csak <strong>feltételezés</strong>, és hogyan csökkentsük a bizonytalanságot a lehető legolcsóbban. Ma egy egyszerű, kezdő-barát eszközt kapsz: <strong>kísérletek</strong> (discovery / feltárás), <strong>időkeretes feltáró munka</strong> (spike), és <strong>prototípus</strong> – és hogy mikor melyik a jó választás.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Tudsz dönteni: discovery vs spike vs prototípus vs „rendes” fejlesztés.</li>
  <li>Képes vagy megfogalmazni egy <strong>hipotézist</strong>, egy <strong>mérhető jelet</strong> és egy <strong>döntést</strong> (folytatjuk / módosítjuk / leállítjuk).</li>
  <li>Elkészítesz egy <strong>30 perces discovery tervet</strong> a csapattal egy bizonytalan backlog elemre.</li>
</ul>

<hr />

<h2>Gyors térkép: kockázat vs bizonytalanság</h2>
<ul>
  <li><strong>Kockázat</strong>: tudjuk, mi történhet, de nem biztos, hogy megtörténik (pl. jóváhagyás csúszik).</li>
  <li><strong>Bizonytalanság</strong>: nem tudjuk, mi fog kiderülni (pl. ismeretlen technológia / nem tiszta igény).</li>
  <li>Scrumban a cél: <strong>gyakori tanulás</strong> + <strong>kicsi tétek</strong> + <strong>korai visszajelzés</strong>.</li>
</ul>

<hr />

<h2>Mikor melyiket?</h2>
<ul>
  <li><strong>Discovery (feltárás)</strong>: amikor a „mit”/„miért” a bizonytalan (valóban ez kell-e? kinek? hogyan mérjük?).</li>
  <li><strong>Spike (időkeretes feltáró munka)</strong>: amikor a „hogyan” a bizonytalan (megoldható-e? mennyi a kockázat? milyen opciók vannak?).</li>
  <li><strong>Prototípus</strong>: amikor gyorsan kell <em>kézzelfogható</em> dolog, hogy visszajelzést kapjunk (UX/folyamat/koncept).</li>
  <li><strong>Rendes fejlesztés</strong>: amikor már elég tiszta az érték, és a kockázat kezelhető.</li>
</ul>

<hr />

<h2>Három aranyszabály</h2>
<ol>
  <li><strong>Időkeret</strong>: a feltárásnak legyen plafonja (különben „végtelen kutatás” lesz).</li>
  <li><strong>Tanulási kérdés</strong>: mit akarunk megtudni? (1–3 konkrét kérdés.)</li>
  <li><strong>Döntés</strong>: mi lesz a kimenet? (pl. „opció A/B”, „folytatjuk / módosítjuk / leállítjuk”.)</li>
</ol>

<hr />

<h2>Akció (30–40 perc) — Discovery terv egy bizonytalan backlog elemre</h2>
<p>Válassz egy bizonytalan elemet (bármi lehet: funkció, folyamat, kampány, integráció).</p>
<ol>
  <li><strong>Hipotézis (1 mondat)</strong>: „Ha X-et csináljuk, akkor Y javul, mert Z.”</li>
  <li><strong>Mérhető jel</strong>: mi a legkisebb jel, ami visszaigazolja vagy cáfolja? (pl. idő, hibaszám, konverzió, elégedettség).</li>
  <li><strong>Legolcsóbb teszt</strong>: discovery beszélgetés / prototípus / spike? Miért?</li>
  <li><strong>Időkeret</strong>: mennyi időt adtok rá (pl. 2 óra / 1 nap)?</li>
  <li><strong>Kimenet</strong>: milyen döntést hoztok a végén?</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok választani: discovery / spike / prototípus / fejlesztés.</li>
  <li>✅ Tudok hipotézist, mérőjelet és döntést megfogalmazni.</li>
  <li>✅ Tudom időkeretbe tenni a tanulást, hogy ne csússzunk el.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 23. nap: Kockázat és bizonytalanság (spike + discovery + prototípus)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma azt gyakorlod, hogyan csökkents bizonytalanságot gyorsan és olcsón: discovery, spike, prototípus.</p>
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
  console.log('✅ Day 23 applied');
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

