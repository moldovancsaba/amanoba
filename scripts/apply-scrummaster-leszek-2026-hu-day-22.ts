/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 22 lesson content (backup-first).
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_22';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}
function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
const APPLY = hasFlag('--apply');

const title = 'IT vs non-IT Scrum: mi változik, mi marad ugyanaz?';

const content = `<h1>IT vs non-IT Scrum: mi változik, mi marad ugyanaz?</h1>
<p><em>Scrumot gyakran IT-hez kötik, pedig a Scrum lényege nem a technológia, hanem a <strong>komplex problémamegoldás</strong> és az empirikus működés. Non-IT környezetben (marketing, HR, sales, operations) mások az artefaktok és a „kész” definíció, de az alapelvek ugyanazok. Ma kapsz egy egyszerű térképet és egy gyakorlatot: egy non-IT folyamat backlogosítása.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeírsz <strong>5 különbséget</strong> és <strong>5 azonos alapelvet</strong> IT vs non-IT Scrum között.</li>
  <li>Megtanulod, hogyan definiáld a <strong>„kész”</strong>-t non-IT kimenetekre (dokumentum, kampány, folyamat).</li>
  <li>Backlogosítasz egy non-IT folyamatot: érték-szeletek, mérés, feedback.</li>
</ul>

<hr />

<h2>Mi marad ugyanaz? (5 alapelv)</h2>
<ul>
  <li><strong>Empirizmus</strong>: átláthatóság → inspect → adapt.</li>
  <li><strong>Érték</strong>: kimenet helyett outcome/hatás.</li>
  <li><strong>Kis szeletek</strong>: gyakori visszajelzés (nem „félévente nagy átadás”).</li>
  <li><strong>Fókusz</strong>: WIP csökkentés, befejezés előnyben.</li>
  <li><strong>Definíciók</strong>: DoR/DoD jellegű tisztázások, hogy mi számít késznek.</li>
</ul>

<hr />

<h2>Mi változik? (5 tipikus különbség)</h2>
<ul>
  <li><strong>Kimenet típusa</strong>: szoftver helyett dokumentum, kampány, oktatás, folyamat.</li>
  <li><strong>Mérés</strong>: „hiba” helyett pl. átfutási idő, elégedettség, konverzió, csökkenő hibaarány a folyamatban.</li>
  <li><strong>Integráció</strong>: nem kód merge, hanem jóváhagyás, jogi/compliance, több érintett.</li>
  <li><strong>Stakeholder mintázat</strong>: gyakran több jóváhagyó és több „láthatatlan” érdek.</li>
  <li><strong>Definition of Done</strong>: gyakran tartalmaz review/jóváhagyás/kommunikációs lépéseket.</li>
</ul>

<hr />

<h2>Non-IT „kész” (DoD) példa</h2>
<p>Egy kampány „kész”, ha:</p>
<ul>
  <li>van jóváhagyott üzenet és kreatív,</li>
  <li>van célcsoport és mérés (pl. CTR, konverzió),</li>
  <li>van publikálási terv és felelős,</li>
  <li>van visszajelzés-csatorna (hol nézzük az eredményt).</li>
</ul>

<hr />

<h2>Akció (35 perc) — Non-IT folyamat backlogosítása</h2>
<p>Válassz egy folyamatot: onboarding, kampányindítás, belső tréning, új policy bevezetése.</p>
<ol>
  <li>Írd le az értéket: kinek és mitől lesz jobb?</li>
  <li>Bontsd 5–8 érték-szeletre (kisméretű, befejezhető).</li>
  <li>Minden szelethez adj „kész” kritériumot (DoD jelleg).</li>
  <li>Válassz 1 mérőjelet (outcome) és 1 visszajelzés pontot (mikori review).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudom, mi ugyanaz és mi változik IT vs non-IT környezetben.</li>
  <li>✅ Tudok non-IT kimenetre „kész” definíciót írni.</li>
  <li>✅ Tudok folyamatot backlogosítani és mérni.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 22. nap: IT vs non-IT Scrum (különbségek + alapelvek)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma azt gyakorlod, hogyan működik a Scrum non-IT környezetben: DoD, szeletelés, mérés.</p>
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
  console.log('✅ Day 22 applied');
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

