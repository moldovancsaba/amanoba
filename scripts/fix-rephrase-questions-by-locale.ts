/**
 * Rephrase quiz questions and options by locale (HU, RU, PL).
 *
 * Purpose: Single entry point for rephrase-at-scale; applies per-locale rules
 * (see docs/REPHRASE_RULES_HU.md, REPHRASE_RULES_RU.md, REPHRASE_RULES_PL.md).
 *
 * HU: Full stem + option rephrases (practice-intro pattern + visszajelzés, scope distractor).
 * RU: Simple replace list (extend when bad terms are documented).
 * PL: Simple replace list (e.g. feedback loop → pętla informacji zwrotnej).
 *
 * Usage: LANGUAGE=hu|ru|pl|bg|tr|vi|id|pt|hi|ar npx tsx --env-file=.env.local scripts/fix-rephrase-questions-by-locale.ts [--apply]
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { QuizQuestion } from '../app/lib/models';

const APPLY = process.argv.includes('--apply');
const LOCALE = (process.env.LANGUAGE || 'hu').toLowerCase();

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

// ---- HU rephrase (same logic as fix-hu-practice-questions-rephrase) ----
function rephraseStemHu(q: string): string {
  let s = String(q || '');
  s = s.replace(
    /Egy új gyakorlatot vezetsz be:\s*„(.*?)"\.\s*Melyik bevezetési terv biztosít mérhető kimenetet és gyors visszacsatolást\?/gs,
    'Bevezetsz egy új gyakorlatot: „$1". Melyik bevezetési terv biztosít mérhető kimenetelt és gyors visszajelzést?'
  );
  s = s.replace(
    /A „(.*?)" témában új gyakorlatot próbálsz ki:\s*„(.*?)"\.\s*Melyik bevezetési terv teszi a hatást ellenőrizhetővé \(előtte\/utána\)\?/gs,
    'A „$1" témában bevezetsz egy új gyakorlatot: „$2". Melyik bevezetési terv teszi a hatást ellenőrizhetővé (előtte/utána)?'
  );
  s = s.replace(
    /Egy csapatban szabályként vezeted be:\s*„(.*?)"\.\s*Melyik terv ad mérhető kimenetet és gyors iterációt\?/gs,
    'Egy csapatban bevezeted szabályként: „$1". Melyik terv ad mérhető kimenetelt és gyors iterációt?'
  );
  s = s.replace(/\bmérhető kimenetet és gyors visszacsatolást\b/g, 'mérhető kimenetelt és gyors visszajelzést');
  s = s.replace(/\bgyors visszacsatolást\b/g, 'gyors visszajelzést');
  s = s.replace(/\bEgy új gyakorlatot vezetsz be\b/g, 'Bevezetsz egy új gyakorlatot');
  s = s.replace(/\búj gyakorlatot próbálsz ki\b/g, 'bevezetsz egy új gyakorlatot');
  return s;
}

function rephraseOptionHu(opt: string): string {
  let s = String(opt || '');
  if (/Túl nagy scope-pal indulok.*nincs gyors visszacsatolás.*nem látszik, mi okozza az eredményt/.test(s)) {
    return 'Túl nagy teret adok a gyakorlatnak egyszerre (minden csapat részt vesz), ezért nincs gyors visszajelzés, és nem derül ki, mi okozza az eredményt.';
  }
  s = s.replace(/\bvisszacsatolást\b/g, 'visszajelzést');
  s = s.replace(/\bvisszacsatolás\b/g, 'visszajelzés');
  return s;
}

// ---- PL / RU / VI / others: simple replace list (from REPHRASE_RULES_*.md) ----
const REPLACE_PAIRS_PL: Array<[RegExp | string, string]> = [
  [/\bfeedback\s+loop\b/gi, 'pętlę informacji zwrotnej'],
];
const REPLACE_PAIRS_RU: Array<[RegExp | string, string]> = [];
const REPLACE_PAIRS_VI: Array<[RegExp | string, string]> = [
  [/\bfeedback\s+loop\b/gi, 'vòng phản hồi'],
];
const REPLACE_PAIRS_OTHER: Array<[RegExp | string, string]> = []; // bg, tr, id, pt, hi, ar: extend when found

function applyReplaceList(text: string, pairs: Array<[RegExp | string, string]>): string {
  let s = String(text || '');
  for (const [from, to] of pairs) {
    s = typeof from === 'string' ? s.split(from).join(to) : s.replace(from, to);
  }
  return s;
}

function getReplacePairs(locale: string): Array<[RegExp | string, string]> {
  if (locale === 'pl') return REPLACE_PAIRS_PL;
  if (locale === 'ru') return REPLACE_PAIRS_RU;
  if (locale === 'vi') return REPLACE_PAIRS_VI;
  return REPLACE_PAIRS_OTHER;
}

function rephraseQuestion(locale: string, q: string): string {
  if (locale === 'hu') return rephraseStemHu(q);
  return applyReplaceList(q, getReplacePairs(locale));
}

function rephraseOptions(locale: string, options: string[]): string[] {
  if (locale === 'hu') return options.map(rephraseOptionHu);
  return options.map((o) => applyReplaceList(o, getReplacePairs(locale)));
}

const SUPPORTED_LOCALES = ['hu', 'ru', 'pl', 'bg', 'tr', 'vi', 'id', 'pt', 'hi', 'ar'] as const;
const LESSON_ID_REGEX: Record<string, RegExp> = {
  hu: /_HU_/i,
  ru: /_RU_/i,
  pl: /_PL_/i,
  bg: /_BG_/i,
  tr: /_TR_/i,
  vi: /_VI_/i,
  id: /_ID_/i,
  pt: /_PT_/i,
  hi: /_HI_/i,
  ar: /_AR_/i,
};

async function main() {
  const regex = LESSON_ID_REGEX[LOCALE];
  if (!regex) {
    console.error(`Unsupported LANGUAGE=${LOCALE}. Use: ${SUPPORTED_LOCALES.join(', ')}.`);
    process.exit(1);
  }

  await connectDB();

  const query =
    LOCALE === 'hu'
      ? {
          isActive: true,
          isCourseSpecific: true,
          lessonId: { $regex: regex },
          $or: [
            { question: /visszacsatolás/i },
            { options: { $elemMatch: { $regex: /visszacsatolás/i } } },
          ],
        }
      : {
          isActive: true,
          isCourseSpecific: true,
          lessonId: { $regex: regex },
        };

  const questions = await (QuizQuestion as any).find(query)
    .select({ _id: 1, question: 1, options: 1, lessonId: 1 })
    .lean();

  const backupDir = join(process.cwd(), 'scripts', 'question-backups');
  const stamp = isoStamp();
  const backupPath = join(backupDir, `REPHRASE_${LOCALE.toUpperCase()}_${stamp}.json`);

  const updates: Array<{ _id: string; question: string; options: string[]; before: { question: string; options: string[] } }> = [];

  for (const doc of questions) {
    const id = (doc as { _id: { toString: () => string } })._id?.toString();
    const beforeQ = (doc as { question: string }).question || '';
    const beforeOpts = ((doc as { options: string[] }).options || []).map(String);
    const afterQ = rephraseQuestion(LOCALE, beforeQ);
    const afterOpts = rephraseOptions(LOCALE, beforeOpts);
    const changed = afterQ !== beforeQ || afterOpts.some((o, i) => o !== beforeOpts[i]);
    if (changed) {
      updates.push({ _id: id, question: afterQ, options: afterOpts, before: { question: beforeQ, options: beforeOpts } });
    }
  }

  console.log(`\nRephrase by locale (LANGUAGE=${LOCALE}, dry-run: ${!APPLY})\n`);
  console.log(`Matched: ${questions.length}, to update: ${updates.length}\n`);

  if (updates.length === 0) {
    process.exit(0);
    return;
  }

  if (APPLY) {
    mkdirSync(backupDir, { recursive: true });
    const backupPayload = updates.map((u) => ({ _id: u._id, before: u.before, after: { question: u.question, options: u.options } }));
    writeFileSync(backupPath, JSON.stringify(backupPayload, null, 2), 'utf8');
    console.log(`Backup written: ${backupPath}\n`);
    for (const u of updates) {
      await (QuizQuestion as any).updateOne({ _id: u._id }, { $set: { question: u.question, options: u.options } });
    }
    console.log(`Updated ${updates.length} questions in DB.\n`);
  } else {
    console.log('Sample (first 2):');
    updates.slice(0, 2).forEach((u) => {
      console.log(`ID: ${u._id}`);
      console.log(`Before Q: ${u.before.question.slice(0, 80)}…`);
      console.log(`After  Q: ${u.question.slice(0, 80)}…`);
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
