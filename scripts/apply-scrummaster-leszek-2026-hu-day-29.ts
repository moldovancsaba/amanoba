/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 29 lesson content (backup-first).
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_29';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}
function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
const APPLY = hasFlag('--apply');

const title = 'Final exam felkészítés: tipikus szituáció minták';

const content = `<h1>Final exam felkészítés: tipikus szituáció minták</h1>
<p><em>A vizsga nem definíciókról szól, hanem arról, hogy egy helyzetben felismered-e a mintázatot és a <strong>legjobb következő beavatkozást</strong>. Ma kapsz 12 gyakori vizsga-szituációt (mintázat + jó lépés), és egy rövid gondolkodási keretet, amivel gyorsan tudsz választani.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Ismersz 12 tipikus „vizsga-szituációt” és a jó beavatkozási irányt.</li>
  <li>Használsz egy 5 lépéses döntési keretet (helyzet → cél → korlát → opció → következő lépés).</li>
  <li>3 szituációra készítesz saját megoldási vázlatot.</li>
</ul>

<hr />

<h2>Gyors döntési keret (vizsga-stílus)</h2>
<ol>
  <li><strong>Mi a valódi cél?</strong> (érték / Sprint cél / empirikus működés)</li>
  <li><strong>Mi a probléma típusa?</strong> (flow / minőség / szerepek / stakeholder / kultúra)</li>
  <li><strong>Mi a legkisebb következő lépés?</strong> (kísérlet, tisztázás, policy, facilitáció)</li>
  <li><strong>Milyen tradeoff van?</strong> (scope vs idő vs minőség vs fenntarthatóság)</li>
  <li><strong>Mi lesz a mérhető jel?</strong> (mi alapján látjuk, hogy jobb lett?)</li>
</ol>

<hr />

<h2>12 tipikus vizsga-szituáció (mintázat + jó beavatkozás)</h2>
<ol>
  <li><strong>Daily státusz meeting</strong> → cél újra, parkoló, Sprint célhoz igazított kérdések.</li>
  <li><strong>Sprint cél nincs</strong> → planningben cél tisztázás, tradeoffok láthatóvá tétele.</li>
  <li><strong>WIP túl magas</strong> → limit, befejezés előnyben, torlódás megszüntetés.</li>
  <li><strong>Refinement kimarad</strong> → rövid, rendszeres refinement, slicing és kockázat tisztázás.</li>
  <li><strong>DoD laza</strong> → kész-kritériumok erősítése, rework láthatóvá tétele.</li>
  <li><strong>Review csak demo</strong> → stakeholder feedback cél, döntések és következő lépések.</li>
  <li><strong>Retro panaszkör</strong> → 1 kísérlet + mérőjel, felelős és határidő.</li>
  <li><strong>Stakeholder scope nyomás</strong> → opciók: csere, szeletelés, későbbre tolás; közös döntés.</li>
  <li><strong>Blokk külső jóváhagyás</strong> → owner + SLA + eszkaláció, policy a rendszerben.</li>
  <li><strong>PO/Dev konfliktus</strong> → közös cél, döntési szabály, transzparens tradeoff.</li>
  <li><strong>Minőség romlik</strong> → stop-the-line, DoD, automatizált ellenőrzés/kísérlet.</li>
  <li><strong>Scrum Master „rendőr”</strong> → coaching és facilitation, elvek védelme partnerként.</li>
</ol>

<hr />

<h2>Akció (30–45 perc) — 3 szituáció megoldási vázlat</h2>
<p>Válassz 3-at a listából, és írd meg:</p>
<ul>
  <li><strong>Probléma</strong>: …</li>
  <li><strong>Cél</strong>: …</li>
  <li><strong>Következő lépés</strong>: … (konkrét beavatkozás)</li>
  <li><strong>Mérőjel</strong>: …</li>
  <li><strong>Kommunikációs mondat</strong>: … (stakeholder/ csapat felé)</li>
</ul>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Szituációból felismerem a mintázatot.</li>
  <li>✅ Tudok legkisebb következő lépést választani.</li>
  <li>✅ Tudok mérőjelet és tradeoffot mondani.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 29. nap: Final exam felkészítés (12 tipikus szituáció + jó lépések)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma 12 tipikus vizsga-szituációt kapsz és egy döntési keretet, amivel gyorsan tudsz jó beavatkozást választani.</p>
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
  console.log('✅ Day 29 applied');
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

