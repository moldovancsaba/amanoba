/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 12 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-12.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-12.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_12';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Sprint Review: érték bemutatása és visszacsatolás kezelése';

const content = `<h1>Sprint Review: érték bemutatása és visszacsatolás kezelése</h1>
<p><em>A Sprint Review lényege nem „státusz”, és nem „vizsga”. A cél: <strong>megmutatni az elkészült inkrementumot</strong>, visszajelzést gyűjteni, és <strong>adaptálni</strong> a Product Backlogot. Ma kapsz egy egyszerű mintát, amivel a Review tényleg érték-alapú lesz.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeraksz egy <strong>Sprint Review forgatókönyvet</strong> (agenda + demo + kérdések + döntésnapló).</li>
  <li>Megtanulod, hogyan kezeld a <strong>negatív</strong> és a <strong>szétszórt</strong> stakeholder visszajelzést.</li>
  <li>Kapsz egy egyszerű eszközt a backlog adaptálására: <strong>feedback → döntés → backlog</strong>.</li>
</ul>

<hr />

<h2>Mi a Sprint Review célja?</h2>
<ul>
  <li><strong>Inspect</strong>: a csapat és a stakeholder(ek) megnézik, mi készült el ténylegesen.</li>
  <li><strong>Adapt</strong>: a visszajelzések alapján a Product Backlog változik (prioritás, scope, következő lépések).</li>
  <li><strong>Érték fókusz</strong>: nem „mennyi munka”, hanem „mit nyertünk vele?”</li>
</ul>

<hr />

<h2>Review ≠ Demo show</h2>
<p>A demo önmagában kevés. A jó Review-n van:</p>
<ul>
  <li><strong>Kontekstus</strong> (mi volt a Sprint Goal / üzleti cél),</li>
  <li><strong>Bemutatás</strong> (mi készült el és hogyan működik),</li>
  <li><strong>Visszajelzés</strong> (mit látnak a felhasználói/üzleti szemmel),</li>
  <li><strong>Döntések</strong> (mit csinálunk ez alapján),</li>
  <li><strong>Következő lépés</strong> (backlog frissítés, owner, idő).</li>
</ul>

<hr />

<h2>Egyszerű Review agenda (45 perc példa)</h2>
<ol>
  <li><strong>5 perc</strong> — Kontextus: Sprint Goal + miért számít.</li>
  <li><strong>20 perc</strong> — Bemutató: 2–3 „érték-szelet” (nem minden apróság).</li>
  <li><strong>10 perc</strong> — Visszajelzés gyűjtése: „Keep / Change / Questions”.</li>
  <li><strong>7 perc</strong> — Döntések: mi kerül be a backlogba, mi változik, mi a következő.</li>
  <li><strong>3 perc</strong> — Lezárás: owner + határidő + mikor lesz következő visszacsatolás.</li>
</ol>

<hr />

<h2>Visszajelzés kezelése (különösen, ha nehéz)</h2>
<h3>1) Negatív feedback</h3>
<ul>
  <li><strong>Köszönd meg</strong> (a feedback ajándék).</li>
  <li><strong>Tedd konkréttá</strong>: „Mi hiányzik pontosan? Példát tudsz mondani?”</li>
  <li><strong>Rögzítsd</strong> láthatóan (board / jegyzet), hogy ne legyen személyeskedés.</li>
  <li><strong>Döntés</strong>: most döntünk (ha kicsi) vagy backlogba kerül és owner viszi.</li>
</ul>

<h3>2) Szétszórt igények</h3>
<ul>
  <li>Használj <strong>kategóriákat</strong>: „érték”, „kockázat”, „UX”, „teljesítmény”.</li>
  <li>Állíts fel <strong>timeboxot</strong>, majd döntés: mi a top 1–2 dolog a következő Sprintre?</li>
</ul>

<h3>3) „Státuszt akarunk” jellegű elvárás</h3>
<ul>
  <li>Keretezd át: a status helyett <strong>inkrementum + döntések</strong>.</li>
  <li>Mutass értéket: „Ezzel a változtatással X folyamat Y percet rövidül / kevesebb hibát okoz.”</li>
</ul>

<hr />

<h2>Döntésnapló (Decision Log)</h2>
<p>Ha a Review után nincs döntésnapló, a feedback elvész.</p>
<ul>
  <li><strong>Döntés:</strong> mit változtatunk?</li>
  <li><strong>Indok:</strong> melyik feedback / adat alapján?</li>
  <li><strong>Backlog hatás:</strong> melyik item változik / új item?</li>
  <li><strong>Owner + határidő</strong></li>
</ul>

<hr />

<h2>Akció (30 perc) — Review forgatókönyv</h2>
<p>Válassz egy fiktív termékhelyzetet: „Új onboarding lépés bevezetése a regisztrációban”. Készíts:</p>
<ol>
  <li>45 perces agenda (timeboxokkal).</li>
  <li>3 demo-szeletet, mindegyikhez 1 érték-mondatot („miért számít”).</li>
  <li>3 kérdést stakeholdernek (pl. „Mi akadályozná a használatot?”).</li>
  <li>Egy Decision Log sablont (döntés + owner + backlog hatás).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok Review-t vezetni érték-alapon, nem státuszként.</li>
  <li>✅ Tudok feedbacket rögzíteni és döntésnaplóba vinni.</li>
  <li>✅ Tudom átkötni a feedbacket backlog döntésekké.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Scrum Guide: Sprint Review — inspect + adapt szemlélet.</li>
  <li>Impact mapping / outcome fókusz (stakeholder beszélgetésekhez).</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 12. nap: Sprint Review (érték + feedback + döntések)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma azt gyakorlod, hogyan lesz a Sprint Review-ból valódi érték bemutatás és backlog-adaptálás.</p>
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

  console.log('✅ Day 12 applied');
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

