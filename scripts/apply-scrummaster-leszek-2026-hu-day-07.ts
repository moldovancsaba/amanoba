/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 07 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-07.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-07.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_07';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Refinement kóstoló: 30 perces agenda + kérdéslista';

const content = `<h1>Refinement kóstoló: 30 perces agenda + kérdéslista</h1>
<p><em>Ma azt tanulod meg, hogyan előzd meg a Sprint Planning káoszt. A refinement nem extra meeting a semmiért: ez az a hely, ahol a bizonytalanság olcsón csökken. A cél: kevesebb találgatás, jobb döntések, stabilabb vállalás.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeraksz egy <strong>30 perces refinement agendát</strong> (időkeret + kimenetek).</li>
  <li>Készítesz egy <strong>kérdéslistát</strong> (érték / kockázat / bizonytalanság / elfogadás) a backlog elemekhez.</li>
  <li>Gyakorolsz egy <strong>feldarabolási lépést</strong> egy túl nagy itemen.</li>
</ul>

<hr />

<h2>Mi a refinement célja?</h2>
<ul>
  <li><strong>Nem</strong> az, hogy „mindent tökéletesre írjunk”.</li>
  <li><strong>Igen</strong>: csökkenteni a bizonytalanságot annyira, hogy a csapat tudjon dönteni a következő Sprint vállalásáról.</li>
  <li><strong>Kimenet</strong>: tisztább itemek + tisztább kockázatok + tesztelhető elfogadás + döntés, kell-e kísérlet.</li>
</ul>

<hr />

<h2>A 30 perces refinement agenda (v0.1)</h2>
<ol>
  <li><strong>0–5 perc — cél és kiválasztás</strong>
    <ul>
      <li>Válasszatok 1–3 backlog elemet, amik valószínűleg közel vannak a következő Sprinthez.</li>
      <li>Gyors check: mi a várható érték és mi a fő kockázat?</li>
    </ul>
  </li>
  <li><strong>5–20 perc — tisztázás + kockázat + elfogadás</strong>
    <ul>
      <li>Outcome mondat (1 mondat)</li>
      <li>2–4 elfogadási feltétel</li>
      <li>1–2 nyitott kérdés</li>
      <li>1 fő kockázat + 1 védelem (teszt/review/limit)</li>
    </ul>
  </li>
  <li><strong>20–28 perc — darabolás / következő lépés</strong>
    <ul>
      <li>Ha túl nagy: vágjátok 2–3 szeletre (érték szerint).</li>
      <li>Ha túl bizonytalan: döntsetek 1 kísérleti lépésről (spike/prototípus/mérés).</li>
    </ul>
  </li>
  <li><strong>28–30 perc — lezárás</strong>
    <ul>
      <li>Mi lett „kész a Sprinthez”?</li>
      <li>Mi a következő tisztázási akció (owner + határidő)?</li>
    </ul>
  </li>
</ol>

<hr />

<h2>Kérdéslista (amit mindig felteszel)</h2>
<ul>
  <li><strong>Érték:</strong> Ki nyer vele és miben? Mi a „jobb” jelzése?</li>
  <li><strong>Kockázat:</strong> Mi romolhat el? Mi a legrosszabb életszerű kimenet?</li>
  <li><strong>Bizonytalanság:</strong> Mit nem tudunk még? Mi a legfontosabb nyitott kérdés?</li>
  <li><strong>Elfogadás:</strong> Miből derül ki, hogy működik? Mik a minimum feltételek?</li>
  <li><strong>Határok:</strong> Mi nincs benne (scope boundary)?</li>
</ul>

<hr />

<h2>Darabolás: 3 gyors minta (kezdőknek)</h2>
<ul>
  <li><strong>Vékony szelet érték szerint:</strong> előbb a legkisebb használható verzió (MVP szelet), utána extra.</li>
  <li><strong>Felhasználói út szerint:</strong> előbb 1 lépés a folyamatból végig „zöld”, utána a többi.</li>
  <li><strong>Kockázat szerint:</strong> előbb a legnagyobb kockázatot csökkentő szelet (mérés / prototípus), utána a teljes megoldás.</li>
</ul>

<hr />

<h2>Példák (jó vs rossz refinement)</h2>

<h3>Példa 1: Planning káosz megelőzése</h3>
<p><strong>Rossz:</strong> a csapat Sprint Planningen találkozik először az itemmel, és 40 percet vitázik definíciókon.</p>
<p><strong>Jó:</strong> refinementen 2 elfogadási feltételt rögzítenek és 1 nyitott kérdést külön akcióként kiosztanak.</p>

<h3>Példa 2: túl nagy item</h3>
<p><strong>Rossz:</strong> „Készítsünk új onboardingot” (minden egyszerre).</p>
<p><strong>Jó:</strong> 3 szelet: (1) alap regisztráció (2) első siker élmény (3) személyre szabás.</p>

<hr />

<h2>Mérőpont (hogy lásd, segít-e)</h2>
<ul>
  <li><strong>Planning vita-idő</strong>: mennyi idő megy el definíció vitára? Cél: csökkenő trend.</li>
  <li><strong>„Nem készen” arány</strong>: hány item kerül be úgy, hogy nincs elfogadás? Cél: közel 0.</li>
  <li><strong>Visszagörgetett itemek</strong>: mennyi item csúszik ki tisztázatlanság miatt?</li>
</ul>

<hr />

<h2>Akció (25 perc)</h2>
<ol>
  <li>Válassz 1 túl nagy itemet, és vágd 3 szeletre (érték vagy user flow szerint).</li>
  <li>Írj hozzá 2–4 elfogadási feltételt és 1 kockázat + védelem párost.</li>
  <li>Írd le a 30 perces agendát a saját szavaiddal (hogy holnap tényleg tudd vezetni).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Van 30 perces agenda + kimenet.</li>
  <li>✅ Van kérdéslistám érték/kockázat/bizonytalanság/elfogadás témában.</li>
  <li>✅ Tudok 1 itemet 3 szeletre darabolni.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Backlog refinement mint „bizonytalanság csökkentés”.</li>
  <li>Feldarabolási minták: thin slice, user journey, risk-first.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 7. nap: Refinement (30 perc) + kérdéslista';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma egy 30 perces refinement agendát és kérdéslistát kapsz, hogy a Sprint Planning ne találgatás legyen.</p>
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

  console.log('✅ Day 07 applied');
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

