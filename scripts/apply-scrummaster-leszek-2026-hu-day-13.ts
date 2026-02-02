/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 13 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-13.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-13.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_13';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Retrospective: valódi javulás vs panaszkör';

const content = `<h1>Retrospective: valódi javulás vs panaszkör</h1>
<p><em>A Retrospective akkor működik, ha nem „kibeszélés”, hanem <strong>tanulási ciklus</strong>: adat → belátás → kísérlet. A Scrum Master feladata a biztonság, a fókusz és az, hogy a végén legyen 1–2 konkrét változtatás, amit tényleg végre is hajt a csapat.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeraksz egy <strong>60 perces retro forgatókönyvet</strong> (5 lépés + timeboxok).</li>
  <li>Megtanulod megakadályozni a <strong>panaszkört</strong> és a bűnbakkeresést.</li>
  <li>Elviszel egy egyszerű szabályt: <strong>1–2 kísérlet</strong>, ownerrel, határidővel, siker kritériummal.</li>
</ul>

<hr />

<h2>Mi a Retrospective célja?</h2>
<ul>
  <li><strong>Inspect</strong>: hogyan dolgoztunk? mi segített? mi akadályozott?</li>
  <li><strong>Adapt</strong>: mit változtatunk a következő időszakban?</li>
  <li><strong>Tanulás</strong>: nem hibást keresünk, hanem rendszerszintű okokat és kipróbálható javítást.</li>
</ul>

<hr />

<h2>A „Prime Directive” (a biztonság alapja)</h2>
<p><strong>Feltételezzük, hogy mindenki a legjobb tudása és körülményei szerint cselekedett.</strong></p>
<p>Ez nem felmentés. Ez arra való, hogy a csapat merjen őszinte lenni és tanulni.</p>

<hr />

<h2>60 perces retro — egyszerű, kezdőbarát folyamat</h2>
<ol>
  <li><strong>Set the stage (5 perc)</strong>: cél, szabályok, rövid check-in.</li>
  <li><strong>Gather data (15 perc)</strong>: tények és megfigyelések (pl. timeline, események, számok).</li>
  <li><strong>Generate insights (15 perc)</strong>: miért történt? minták, ok-okozat (pl. 5 Why, csoportosítás).</li>
  <li><strong>Decide what to do (20 perc)</strong>: 1–2 kísérlet kiválasztása, owner, mérés.</li>
  <li><strong>Close (5 perc)</strong>: mit viszünk el, mikor nézzük meg újra?</li>
</ol>

<hr />

<h2>Hogyan lesz panaszkör helyett javulás?</h2>
<h3>1) Ténytől indulsz, nem véleménytől</h3>
<ul>
  <li><strong>Tény:</strong> „A Sprintben 7 feladatból 2 lett kész.”</li>
  <li><strong>Megfigyelés:</strong> „Sok a megszakítás, sok a félkész munka.”</li>
  <li><strong>Csak utána</strong>: okok és megoldási ötletek.</li>
</ul>

<h3>2) Blame helyett rendszer</h3>
<ul>
  <li>Keretezés: „Melyik szabály, folyamat vagy függőség tolta ebbe a helyzetbe a csapatot?”</li>
  <li>Ha személyeskedés indul: „Térjünk vissza a megfigyelhető hatásokhoz és a következő lépéshez.”</li>
</ul>

<h3>3) Kevés, de befejezett akció</h3>
<ul>
  <li>1–2 kísérlet elég. A sok akciólista gyakran = semmi sem történik.</li>
  <li>Minden kísérlethez legyen:
    <ul>
      <li><strong>Owner</strong></li>
      <li><strong>Határidő</strong></li>
      <li><strong>Siker kritérium</strong> (miből látszik, hogy jobb?)</li>
    </ul>
  </li>
</ul>

<hr />

<h2>Hasznos retro formátumok (válassz 1-et)</h2>
<ul>
  <li><strong>Start / Stop / Continue</strong> — gyors, konkrét változtatásokhoz.</li>
  <li><strong>4L (Liked, Learned, Lacked, Longed for)</strong> — tanulás + hiányok.</li>
  <li><strong>Timeline</strong> — ha sok esemény volt és kell a közös kép.</li>
</ul>

<hr />

<h2>Akció (30 perc) — 2 kísérlet tervezése</h2>
<p>Helyzet: „Sok a megszakítás, nő a félkész munka, a csapat frusztrált.” Készíts 2 kísérletet:</p>
<ol>
  <li><strong>WIP védelem</strong>: pl. 1 munka/fő + finish-first. (Owner + mérés: „félkész elemek száma”, cycle time.)</li>
  <li><strong>Fókusz idősáv</strong>: pl. napi 2×60 perc meeting-mentes blokk. (Owner + mérés: megszakítások száma / nap.)</li>
</ol>
<p>Írd le, mikor nézitek meg az eredményt (pl. 1 hét múlva), és mi a „stop/continue” döntési szabály.</p>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok tényekből indulni és keretet adni az okok kereséséhez.</li>
  <li>✅ Tudom kezelni a személyeskedést és a panaszkört.</li>
  <li>✅ A végén van 1–2 kísérlet ownerrel és mérhető sikerrel.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Agile Retrospectives (klasszikus retro minták).</li>
  <li>Safety check („Mennyire biztonságos őszintének lenni?”) — ha a csapat bezár.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 13. nap: Retrospective (tanulás → kísérlet)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma egy 60 perces retro folyamatot kapsz, ami panaszkör helyett konkrét kísérleteket hoz.</p>
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

  console.log('✅ Day 13 applied');
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

