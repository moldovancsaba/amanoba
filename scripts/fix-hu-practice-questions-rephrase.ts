/**
 * Rephrase HU practice-intro questions and options to native Hungarian.
 *
 * Why: Simple replace (visszacsatolást → visszajelzést) does not fix the problem;
 * questions and answers must be rephrased properly for clarity and native tone.
 *
 * What this does:
 * - Stem: "Egy új gyakorlatot vezetsz be: …" → "Bevezetsz egy új gyakorlatot: …"
 *   and "mérhető kimenetet és gyors visszacsatolást" → "mérhető kimenetelt és gyors visszajelzést".
 * - Stem variant: "A „…” témában új gyakorlatot próbálsz ki" → "A „…” témában bevezetsz egy új gyakorlatot".
 * - Options: Replace "visszacsatolás" with "visszajelzés"; rephrase the recurring
 *   scope distractor to native Hungarian.
 *
 * Safety: Dry-run by default. With --apply: backup to scripts/question-backups/ then update.
 *
 * Usage: npx tsx --env-file=.env.local scripts/fix-hu-practice-questions-rephrase.ts [--apply]
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { QuizQuestion } from '../app/lib/models';

const APPLY = process.argv.includes('--apply');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/** Rephrase question stem to native Hungarian. */
function rephraseStem(q: string): string {
  let s = String(q || '');
  // "Egy új gyakorlatot vezetsz be: „X". Melyik bevezetési terv biztosít mérhető kimenetet és gyors visszacsatolást?"
  // Quoted part may contain inner "; use non-greedy .*? up to ". Melyik
  s = s.replace(
    /Egy új gyakorlatot vezetsz be:\s*„(.*?)"\.\s*Melyik bevezetési terv biztosít mérhető kimenetet és gyors visszacsatolást\?/gs,
    'Bevezetsz egy új gyakorlatot: „$1". Melyik bevezetési terv biztosít mérhető kimenetelt és gyors visszajelzést?'
  );
  // "A „Y" témában új gyakorlatot próbálsz ki: „X". Melyik bevezetési terv teszi..."
  s = s.replace(
    /A „(.*?)" témában új gyakorlatot próbálsz ki:\s*„(.*?)"\.\s*Melyik bevezetési terv teszi a hatást ellenőrizhetővé \(előtte\/utána\)\?/gs,
    'A „$1" témában bevezetsz egy új gyakorlatot: „$2". Melyik bevezetési terv teszi a hatást ellenőrizhetővé (előtte/utána)?'
  );
  // "Egy csapatban szabályként vezeted be: „X". Melyik terv ad mérhető kimenetet és gyors iterációt?"
  s = s.replace(
    /Egy csapatban szabályként vezeted be:\s*„(.*?)"\.\s*Melyik terv ad mérhető kimenetet és gyors iterációt\?/gs,
    'Egy csapatban bevezeted szabályként: „$1". Melyik terv ad mérhető kimenetelt és gyors iterációt?'
  );
  // Fallback: any remaining visszacsatolást / wrong accusative in this pattern
  s = s.replace(/\bmérhető kimenetet és gyors visszacsatolást\b/g, 'mérhető kimenetelt és gyors visszajelzést');
  s = s.replace(/\bgyors visszacsatolást\b/g, 'gyors visszajelzést');
  s = s.replace(/\bEgy új gyakorlatot vezetsz be\b/g, 'Bevezetsz egy új gyakorlatot');
  s = s.replace(/\búj gyakorlatot próbálsz ki\b/g, 'bevezetsz egy új gyakorlatot');
  return s;
}

/** Rephrase a single option to native Hungarian (visszacsatolás → visszajelzés, scope distractor). */
function rephraseOption(opt: string): string {
  let s = String(opt || '');
  // Recurring distractor: proper rephrase (scope-pal → natural "teret adok", visszacsatolás → visszajelzés)
  if (/Túl nagy scope-pal indulok.*nincs gyors visszacsatolás.*nem látszik, mi okozza az eredményt/.test(s)) {
    return 'Túl nagy teret adok a gyakorlatnak egyszerre (minden csapat részt vesz), ezért nincs gyors visszajelzés, és nem derül ki, mi okozza az eredményt.';
  }
  // Any remaining visszacsatolás in options
  s = s.replace(/\bvisszacsatolást\b/g, 'visszajelzést');
  s = s.replace(/\bvisszacsatolás\b/g, 'visszajelzés');
  return s;
}

async function main() {
  await connectDB();

  const questions = await (QuizQuestion as any).find({
    isActive: true,
    isCourseSpecific: true,
    lessonId: { $regex: /_HU_/i },
    $or: [
      { question: /visszacsatolás/i },
      { options: { $elemMatch: { $regex: /visszacsatolás/i } } },
    ],
  })
    .select({ _id: 1, question: 1, options: 1, lessonId: 1 })
    .lean();

  if (questions.length === 0) {
    console.log('No HU questions with visszacsatolás found.');
    process.exit(0);
    return;
  }

  const backupDir = join(process.cwd(), 'scripts', 'question-backups');
  const stamp = isoStamp();
  const backupPath = join(backupDir, `HU_REPHRASE_${stamp}.json`);

  const updates: Array<{ _id: string; question: string; options: string[]; before: { question: string; options: string[] } }> = [];

  for (const doc of questions) {
    const id = (doc as { _id: { toString: () => string } })._id?.toString();
    const beforeQ = (doc as { question: string }).question || '';
    const beforeOpts = ((doc as { options: string[] }).options || []).map(String);
    const afterQ = rephraseStem(beforeQ);
    const afterOpts = beforeOpts.map(rephraseOption);
    const changed = afterQ !== beforeQ || afterOpts.some((o, i) => o !== beforeOpts[i]);
    if (changed) {
      updates.push({
        _id: id,
        question: afterQ,
        options: afterOpts,
        before: { question: beforeQ, options: beforeOpts },
      });
    }
  }

  console.log(`\nRephrase HU practice questions (dry-run: ${!APPLY})\n`);
  console.log(`Matched: ${questions.length}, to update: ${updates.length}\n`);

  if (updates.length === 0) {
    process.exit(0);
    return;
  }

  if (APPLY) {
    mkdirSync(backupDir, { recursive: true });
    const backupPayload = updates.map((u) => ({
      _id: u._id,
      before: u.before,
      after: { question: u.question, options: u.options },
    }));
    writeFileSync(backupPath, JSON.stringify(backupPayload, null, 2), 'utf8');
    console.log(`Backup written: ${backupPath}\n`);

    for (const u of updates) {
      await (QuizQuestion as any).updateOne(
        { _id: u._id },
        { $set: { question: u.question, options: u.options } }
      );
    }
    console.log(`Updated ${updates.length} questions in DB.\n`);
  } else {
    console.log('Sample (first 2):');
    updates.slice(0, 2).forEach((u) => {
      console.log(`ID: ${u._id}`);
      console.log(`Before Q: ${u.before.question.slice(0, 100)}…`);
      console.log(`After  Q: ${u.question.slice(0, 100)}…`);
      console.log('');
    });
    console.log('Run with --apply to write backup and update DB.');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
