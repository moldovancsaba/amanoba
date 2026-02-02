/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 17 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-17.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-17.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_17';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Coaching mindset: kérdések, nem megoldások';

const content = `<h1>Coaching mindset: kérdések, nem megoldások</h1>
<p><em>Sok kezdő Scrum Master ott rontja el, hogy „megjavítja” a csapatot: ő mondja meg a választ, ő oldja meg a problémát. Ettől rövid távon gyorsnak tűnik, de a csapat nem tanul. A coaching mindset lényege: <strong>kérdésekkel</strong> segíteni a csapatot gondolkodni, dönteni és felelősséget vállalni.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Kapsz egy <strong>10 kérdésből álló „coaching kártyát”</strong> tipikus helyzetekre.</li>
  <li>Megtanulod a <strong>GROW</strong> mini-keretet (Goal, Reality, Options, Way forward).</li>
  <li>Tudni fogod, mikor coacholj és mikor <strong>facilitálj</strong> vagy <strong>taníts</strong>.</li>
</ul>

<hr />

<h2>Mi a coaching mindset?</h2>
<ul>
  <li><strong>Nem megoldás-szállítás</strong>, hanem gondolkodás indítása.</li>
  <li><strong>Felelősség visszaadása</strong>: a csapaté a döntés és a kivitelezés.</li>
  <li><strong>Biztonság + tisztaság</strong>: segítesz tisztázni a célt, a tényeket és a következő lépést.</li>
</ul>

<hr />

<h2>Mikor NEM coaching a jó válasz?</h2>
<ul>
  <li><strong>Vészhelyzet</strong>: biztonság, incidens, kritikus ügyfélkár — ilyenkor gyors döntés kell.</li>
  <li><strong>Hiányzó alap tudás</strong>: ha valaki nem ismeri a fogalmat/szabályt, rövid tanítás segíthet.</li>
  <li><strong>Folyamat káosz</strong>: ha a beszélgetés szétesett, előbb facilitáció (keretek), utána coaching.</li>
</ul>

<hr />

<h2>GROW (mini)</h2>
<ol>
  <li><strong>Goal</strong>: mi a cél, mit akartok elérni?</li>
  <li><strong>Reality</strong>: mi a tény, hol tartunk most?</li>
  <li><strong>Options</strong>: milyen 2–3 opció van?</li>
  <li><strong>Way forward</strong>: mi a következő lépés, ki viszi, mikorra?</li>
</ol>

<hr />

<h2>10 erős kérdés (coaching kártya)</h2>
<ul>
  <li>„Mit akarsz elérni a következő 1 hétben, ami látható?”</li>
  <li>„Mi a tény, és mi a feltételezés?”</li>
  <li>„Mi a legkisebb következő lépés?”</li>
  <li>„Mi a kockázat, és hogyan védjük ki?”</li>
  <li>„Miért fontos ez most?”</li>
  <li>„Melyik döntés visszafordítható?”</li>
  <li>„Mit próbáltatok eddig, és mi lett az eredménye?”</li>
  <li>„Mi az 1 dolog, amit abbahagytok, hogy ez menjen?”</li>
  <li>„Ha ezt választjátok, mi csúszik emiatt?”</li>
  <li>„Honnan fogjátok tudni, hogy működik?”</li>
</ul>

<hr />

<h2>Akció (25 perc) — Coaching beszélgetés váz</h2>
<p>Helyzet: egy csapattag azt mondja: „Nem lehet időben befejezni, túl sok a megszakítás.”</p>
<ol>
  <li>Írj 1 Goal kérdést (mi a cél a következő 1 hétre?).</li>
  <li>Írj 2 Reality kérdést (mi a tény?).</li>
  <li>Írj 3 Options kérdést (milyen opciók vannak?).</li>
  <li>Írj 1 Way forward zárást (következő lépés + owner + mérés).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok kérdésekkel tisztázni célt, tényt és opciókat.</li>
  <li>✅ Tudom, mikor kell coaching és mikor kell gyors döntés vagy tanítás.</li>
  <li>✅ A beszélgetés végén van következő lépés ownerrel és határidővel.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 17. nap: Coaching mindset (kérdések, nem megoldások)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma olyan kérdéseket kapsz, amikkel a csapat maga találja meg a megoldást — és ettől erősebb lesz.</p>
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

  console.log('✅ Day 17 applied');
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

