/**
 * Refine Productivity 2026 HI Lessons (language integrity + quality)
 *
 * Purpose:
 * - Remove Latin/English leakage from Hindi lessons/emails.
 * - Raise lesson quality so strict quiz generation can succeed (0 recall, >=7 valid, >=5 application).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/PRODUCTIVITY_2026_HI/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-hi-lessons.ts --from-day 1 --to-day 30
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-hi-lessons.ts --from-day 1 --to-day 30 --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course') || 'PRODUCTIVITY_2026_HI';
const FROM_DAY = Number(getArgValue('--from-day') || '1');
const TO_DAY = Number(getArgValue('--to-day') || '30');
const APPLY = process.argv.includes('--apply');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const BACKUP_DIR = getArgValue('--backup-dir') || join(process.cwd(), 'scripts', 'lesson-backups');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function stripHtml(input: string) {
  return String(input || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

type CCSLesson = {
  dayNumber: number;
  canonicalTitle: string;
  intent: string;
  goals: string[];
  requiredConcepts?: string[];
  requiredProcedures?: string[];
};

type CCSProcedure = {
  id: string;
  name: string;
  steps: string[];
};

function loadProductivityCCS(): { lessons: CCSLesson[]; procedures: CCSProcedure[] } {
  const p = join(process.cwd(), 'docs', 'canonical', 'PRODUCTIVITY_2026', 'PRODUCTIVITY_2026.canonical.json');
  const raw = readFileSync(p, 'utf8');
  const parsed = JSON.parse(raw);
  return { lessons: parsed.lessons || [], procedures: parsed.procedures || [] };
}

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ul(items: string[]) {
  return `<ul>\n${items.map(i => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ul>`;
}

function ol(items: string[]) {
  return `<ol>\n${items.map(i => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ol>`;
}

function sanitizeTitleHi(title: string) {
  let t = String(title || '').trim();
  if (!t) return t;
  t = t.replace(/\bthroughput\b/gi, 'थ्रूपुट');
  t = t.replace(/\bcarryover\b/gi, 'कैरीओवर');
  t = t.replace(/\bdeep work\b/gi, 'डीप वर्क');
  t = t.replace(/\bgoals\b/gi, 'लक्ष्य');
  // Remove long Latin segments (hard gate for Hindi).
  t = t.replace(/[A-Za-z]{10,}/g, '');
  t = t.replace(/\(\s*,\s*/g, '(').replace(/\s*,\s*\)/g, ')');
  t = t.replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').trim();
  return t;
}

function translateProcedureStepHi(step: string) {
  const s = String(step || '').trim();
  const exact: Record<string, string> = {
    // P1_PERSONAL_PRODUCTIVITY_DEFINITION
    'List your recurring outputs (activities).': 'अपने बार-बार होने वाले आउटपुट (गतिविधियाँ) लिखें।',
    'Convert each output into a desired outcome (result).': 'हर आउटपुट को इच्छित परिणाम (आउटकम) में बदलें।',
    'List your constraints (time, energy, attention, resources).': 'अपने सीमित संसाधन/सीमाएँ लिखें (समय, ऊर्जा, ध्यान, संसाधन)।',
    'Write a 2–3 sentence definition of productivity for yourself using outcome/constraints.':
      'आउटकम/सीमाओं के आधार पर 2–3 वाक्यों में अपनी उत्पादकता की परिभाषा लिखें।',
    'Pick one improvement lever for the week (reduce constraint waste or increase outcome quality).':
      'इस सप्ताह के लिए 1 सुधार-लीवर चुनें: सीमाओं की बर्बादी घटाएँ या परिणाम की गुणवत्ता बढ़ाएँ।',

    // P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER
    'Count throughput: completed important outcomes.': 'थ्रूपुट गिनें: पूरे हुए महत्वपूर्ण परिणाम।',
    'Count focus blocks: uninterrupted deep work blocks completed.':
      'फोकस ब्लॉक गिनें: बिना बाधा के पूरे हुए डीप वर्क ब्लॉक।',
    'Count carryover: tasks rolled from last week.': 'कैरीओवर गिनें: पिछले सप्ताह से चली आईं कार्य-सूचियाँ।',
    'Write 2 insights: what worked / what broke.': '2 निष्कर्ष लिखें: क्या काम किया / क्या टूट गया।',
    'Make 1 rule change for next week and schedule it.': 'अगले सप्ताह के लिए 1 नियम बदलें और उसे शेड्यूल करें।',

    // P3_DEEP_WORK_DAY_DESIGN
    'Audit your context switches for one day.': 'एक दिन के लिए कॉन्टेक्स्ट स्विच का ऑडिट करें।',
    'Batch similar tasks into fixed windows (e.g., email twice daily).':
      'मिलती-जुलती कार्यों को तय समय-खिड़कियों में बैच करें (जैसे: ईमेल दिन में 2 बार)।',
    'Schedule 1–3 deep work blocks (90–120 min) with explicit rules.':
      '1–3 डीप वर्क ब्लॉक (90–120 मिनट) स्पष्ट नियमों के साथ शेड्यूल करें।',
    'Add buffer time and defend it from meetings/messages.': 'बफर समय जोड़ें और मीटिंग/मैसेज से उसकी रक्षा करें।',
    'Track adherence for one week and adjust.': 'एक सप्ताह तक पालन ट्रैक करें और फिर समायोजन करें।',

    // P4_TASK_AUDIT_DELEGATE_ELIMINATE
    'List all tasks performed in a week.': 'एक सप्ताह में किए गए सभी कार्यों की सूची बनाएं।',
    'Mark low-value tasks (time cost, low outcome).': 'कम-मूल्य वाले कार्य चिन्हित करें (समय लागत अधिक, परिणाम कम)।',
    'For each low-value task: decide delegate vs eliminate vs keep.':
      'हर कम-मूल्य कार्य के लिए तय करें: डेलीगेट / हटाएँ / रखें।',
    'Write delegation briefs (expected output, due date, success criteria, check-ins).':
      'डेलीगेशन ब्रीफ लिखें (अपेक्षित आउटपुट, ड्यू डेट, सफलता-मानदंड, चेक-इन)।',
    'Execute: eliminate 1 and delegate 1 this week; review impact.':
      'करके दिखाएँ: इस सप्ताह 1 चीज़ हटाएँ और 1 कार्य डेलीगेट करें; फिर प्रभाव की समीक्षा करें।',

    // P5_DECISION_MATRIX_AND_CATEGORIES
    'Define decision category (small/medium/large) based on reversibility and impact.':
      'रिवर्सिबिलिटी और प्रभाव के आधार पर निर्णय श्रेणी तय करें (छोटा/मध्यम/बड़ा)।',
    'For medium/large: list options and criteria; weight criteria; score options.':
      'मध्यम/बड़े निर्णय के लिए: विकल्प और मानदंड लिखें; वज़न दें; विकल्पों को स्कोर करें।',
    'Set an information boundary (time limit / minimum data).': 'जानकारी की सीमा तय करें (समय सीमा / न्यूनतम डेटा)।',
    'Make the 80% decision and implement.': '80% निर्णय लें और उसे लागू करें।',
    'Review outcomes and update your decision rules.': 'परिणामों की समीक्षा करें और अपने निर्णय नियम अपडेट करें।',
  };
  if (exact[s]) return exact[s];
  return 'इस चरण को मैन्युअली समीक्षा करें (स्वचालित अनुवाद उपलब्ध नहीं)।';
}

function procedureNameHi(id: string, fallback: string) {
  const map: Record<string, string> = {
    P1_PERSONAL_PRODUCTIVITY_DEFINITION: 'व्यक्तिगत उत्पादकता परिभाषा (आउटपुट → परिणाम → सीमाएँ)',
    P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER: 'साप्ताहिक समीक्षा (थ्रूपुट / फोकस ब्लॉक / कैरीओवर)',
    P3_DEEP_WORK_DAY_DESIGN: 'डीप वर्क दिन डिजाइन (ब्लॉक + सुरक्षा + बफर)',
    P4_TASK_AUDIT_DELEGATE_ELIMINATE: 'कार्य ऑडिट (डेलीगेट बनाम हटाएँ)',
    P5_DECISION_MATRIX_AND_CATEGORIES: 'निर्णय मैट्रिक्स + निर्णय श्रेणियाँ',
  };
  return map[id] || fallback;
}

function buildIntentHi(requiredProcedureIds: string[]) {
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    return 'आज आप अपना दिन इस तरह डिजाइन करेंगे कि कॉन्टेक्स्ट स्विच घटे और डीप वर्क के फोकस ब्लॉक सुरक्षित रहें।';
  }
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    return 'आज आप साप्ताहिक फीडबैक लूप बनाते हैं: थ्रूपुट, फोकस ब्लॉक और कैरीओवर मापकर 1 नियम सुधारते हैं।';
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    return 'आज आप कार्य-ऑडिट करके बोझ घटाते हैं: क्या डेलीगेट करना है, क्या हटाना है, और क्या रखना है।';
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    return 'आज आप निर्णय-देरी घटाते हैं: श्रेणियाँ तय करते हैं, मानदंड/सीमा सेट करते हैं, और 80% निर्णय लागू करते हैं।';
  }
  return 'आज आप गतिविधि को परिणाम से जोड़ते हैं: “Done” मानदंड, मेट्रिक और सीमा तय करके छोटा परीक्षण करते हैं।';
}

function buildGoalsHi(requiredProcedureIds: string[]) {
  const goals: string[] = [];
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    goals.push('3 माप निकालें: थ्रूपुट, फोकस ब्लॉक, और कैरीओवर।');
    goals.push('2 निष्कर्ष लिखें: क्या काम किया / क्या टूट गया।');
    goals.push('अगले सप्ताह के लिए 1 नियम बदलें और उसे शेड्यूल करें।');
  }
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    goals.push('1–3 डीप वर्क ब्लॉक स्पष्ट नियमों के साथ शेड्यूल करें।');
    goals.push('समान कार्यों को बैच करके 2 निश्चित विंडो बनाएं (जैसे ईमेल)।');
    goals.push('20–30% बफर जोड़ें ताकि बाधाएँ योजना न तोड़ें।');
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    goals.push('कम-मूल्य कार्यों को डेलीगेट/हटाएँ/रखें में वर्गीकृत करें।');
    goals.push('1 डेलीगेशन ब्रीफ लिखें (आउटपुट, ड्यू डेट, मानदंड, चेक-इन)।');
    goals.push('इस सप्ताह 1 चीज़ हटाएँ और 1 कार्य डेलीगेट करें।');
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    goals.push('आज 1 निर्णय चुनें और उसकी श्रेणी + सफलता-मानदंड तय करें।');
    goals.push('जानकारी की सीमा तय करें (समय सीमा/न्यूनतम डेटा)।');
    goals.push('80% निर्णय लें और लागू करें; समीक्षा समय तय करें।');
  }
  if (goals.length < 4) {
    goals.push('काम शुरू करने से पहले “Done” का स्पष्ट मानदंड लिखें।');
    goals.push('1 मेट्रिक और 1 सीमा (मानदंड/सीमा) तय करें, फिर पहले/बाद तुलना करें।');
  }
  return goals.slice(0, 6);
}

function buildMetricsHi() {
  return [
    'मेट्रिक: पूरे हुए महत्वपूर्ण परिणामों की संख्या।',
    'मेट्रिक: बिना बाधा के पूरे हुए फोकस ब्लॉकों की संख्या।',
    'मेट्रिक: कैरीओवर कार्यों की संख्या/अनुपात (क्यों कैरीओवर हुआ?).',
    'मानदंड: “Done” की परिभाषा पहले से लिखी और जांच योग्य हो।',
    'सीमा: सफलता के लिए न्यूनतम सीमा/थ्रेशहोल्ड पहले से तय हो।',
  ];
}

function buildHiLessonHtml(params: {
  day: number;
  title: string;
  intent: string;
  goals: string[];
  requiredProcedures: CCSProcedure[];
}) {
  const { day, title, intent, goals, requiredProcedures } = params;

  const procedureBlocks = requiredProcedures
    .map((p) => {
      const stepsHi = (p.steps || []).map(translateProcedureStepHi);
      return (
        `<h3>${escapeHtml(procedureNameHi(p.id, p.name || p.id))}</h3>\n` +
        `<p><em>उद्देश्य:</em> मापने योग्य आउटपुट बनाएं और उसे परिणाम से जोड़ें (मानदंड + सीमा)।</p>\n` +
        ol(stepsHi)
      );
    })
    .join('\n');

  const exampleText =
    'उदाहरण:\n' +
    '✅ अच्छा: 2 फोकस ब्लॉक + 1 आउटपुट “Done” + स्पष्ट परिणाम/मेट्रिक।\n' +
    '❌ खराब: बहुत गतिविधि (मीटिंग/मैसेज) लेकिन कोई मापने योग्य परिणाम नहीं।';

  const pitfalls = [
    '❌ गलती: “Done” मानदंड के बिना शुरू करना। ✅ सुधार: पहले मानदंड लिखें।',
    '❌ गलती: एक साथ सब बदलना। ✅ सुधार: 1 नियम + 1 मेट्रिक + साप्ताहिक समीक्षा।',
    '❌ गलती: पूरे दिन बाधाएँ। ✅ सुधार: मैसेजिंग के लिए निश्चित विंडो + फोकस ब्लॉक।',
  ];

  return (
    `<h1>${escapeHtml(`उत्पादकता 2026 — दिन ${day}`)}</h1>\n` +
    `<h2>${escapeHtml(title)}</h2>\n` +
    `<p><strong>आज क्यों?</strong> ${escapeHtml(intent)}</p>\n` +
    `<h2>आज के लक्ष्य (परिणाम)</h2>\n` +
    ul(goals) +
    `<h2>कार्रवाई के चरण</h2>\n` +
    (procedureBlocks || `<p>आज: 1 नियम + 1 मेट्रिक + छोटा पायलट, फिर समीक्षा।</p>`) +
    `<h2>उदाहरण (अच्छा vs खराब)</h2>\n` +
    `<pre>${escapeHtml(exampleText)}</pre>\n` +
    `<h2>सामान्य गलतियाँ और सुधार</h2>\n` +
    ul(pitfalls) +
    `<h2>मेट्रिक्स, मानदंड, सीमा</h2>\n` +
    ul(buildMetricsHi())
  );
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'hi') {
    throw new Error(`Course language is not HI for ${COURSE_ID} (found: ${course.language})`);
  }

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .select({ _id: 1, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
    .lean();

  const byDay = new Map<number, any>();
  for (const lesson of lessons) {
    const existing = byDay.get(lesson.dayNumber);
    if (!existing) {
      byDay.set(lesson.dayNumber, lesson);
      continue;
    }
    const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
    const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
    if (b < a) byDay.set(lesson.dayNumber, lesson);
  }

  const ccs = loadProductivityCCS();
  const ccsByDay = new Map<number, CCSLesson>();
  for (const l of ccs.lessons) ccsByDay.set(l.dayNumber, l);
  const procById = new Map<string, CCSProcedure>();
  for (const p of ccs.procedures) procById.set(p.id, p);

  const stamp = isoStamp();
  mkdirSync(OUT_DIR, { recursive: true });

  const planRows: any[] = [];
  const applyResults: any[] = [];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  for (let day = FROM_DAY; day <= TO_DAY; day++) {
    const lesson = byDay.get(day);
    if (!lesson) {
      planRows.push({ day, action: 'SKIP_NO_LESSON', reason: 'Missing lesson in DB for that day' });
      continue;
    }

    const ccsLesson = ccsByDay.get(day);
    if (!ccsLesson) {
      planRows.push({ day, lessonId: lesson.lessonId, action: 'SKIP_NO_CCS', reason: 'Missing CCS entry' });
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldTitle = String(lesson.title || '');
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'hi' });
    const oldIntegrity = validateLessonRecordLanguageIntegrity({
      language: 'hi',
      content: oldContent,
      emailSubject: lesson.emailSubject || null,
      emailBody: lesson.emailBody || null,
    });

    const forceRefineForLanguage = /[A-Za-z]{10,}/.test(stripHtml(oldContent)) || !oldIntegrity.ok;
    if (oldScore.score >= 70 && !forceRefineForLanguage) {
      planRows.push({ day, lessonId: lesson.lessonId, title: oldTitle, action: 'SKIP_ALREADY_OK', applyEligible: true });
      continue;
    }

    const requiredProcedures = (ccsLesson.requiredProcedures || [])
      .filter(Boolean)
      .map((id) => procById.get(id))
      .filter(Boolean) as CCSProcedure[];
    const requiredProcedureIds = (ccsLesson.requiredProcedures || []).filter(Boolean);

    const nextTitle = sanitizeTitleHi(oldTitle) || oldTitle;
    const nextContent = buildHiLessonHtml({
      day,
      title: nextTitle || `उत्पादकता 2026 — दिन ${day}`,
      intent: buildIntentHi(requiredProcedureIds),
      goals: buildGoalsHi(requiredProcedureIds),
      requiredProcedures,
    });
    const nextScore = assessLessonQuality({ title: nextTitle, content: nextContent, language: 'hi' });

    const emailSubject = `उत्पादकता 2026 – दिन ${day}: ${nextTitle}`;
    const emailBody =
      `<h1>उत्पादकता 2026 – दिन ${day}</h1>\n` +
      `<h2>${escapeHtml(nextTitle)}</h2>\n` +
      `<p>${escapeHtml(buildIntentHi(requiredProcedureIds))}</p>\n` +
      `<p><a href=\"${appUrl}/hi/courses/${COURSE_ID}/day/${day}\">पाठ खोलें →</a></p>`;

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'hi',
      content: nextContent,
      emailSubject,
      emailBody,
    });

    planRows.push({
      day,
      lessonId: lesson.lessonId,
      title: nextTitle,
      action: 'REFINE',
      quality: { old: oldScore, next: nextScore },
      lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(nextContent).length },
      applyEligible: nextScore.score >= 70 && integrity.ok,
      languageIntegrity: integrity,
    });

    if (!APPLY) continue;
    if (!integrity.ok) {
      throw new Error(
        `Language integrity failed for ${COURSE_ID} day ${day} (${lesson.lessonId}): ${integrity.errors[0] || 'unknown'}`
      );
    }

    const courseFolder = join(BACKUP_DIR, COURSE_ID);
    mkdirSync(courseFolder, { recursive: true });
    const backupPath = join(courseFolder, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          courseId: COURSE_ID,
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          title: oldTitle,
          content: oldContent,
          emailSubject: lesson.emailSubject || null,
          emailBody: lesson.emailBody || null,
        },
        null,
        2
      )
    );

    const update = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          title: nextTitle,
          content: nextContent,
          emailSubject,
          emailBody,
          'metadata.updatedAt': new Date(),
        },
      }
    );

    applyResults.push({
      day,
      lessonId: lesson.lessonId,
      backupPath,
      matched: update.matchedCount,
      modified: update.modifiedCount,
      newScore: nextScore.score,
    });
  }

  const reportPath = join(OUT_DIR, `lesson-refine-preview__${COURSE_ID}__${stamp}.json`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseId: COURSE_ID,
        fromDay: FROM_DAY,
        toDay: TO_DAY,
        apply: APPLY,
        totals: {
          considered: planRows.length,
          eligible70: planRows.filter((r) => r.applyEligible).length,
          below70: planRows.filter((r) => !r.applyEligible).length,
          applied: applyResults.length,
        },
        planRows,
        applyResults,
      },
      null,
      2
    )
  );

  console.log('✅ Lesson refinement preview complete');
  console.log(`- Apply mode: ${APPLY ? 'YES (DB writes + backups)' : 'NO (dry-run only)'}`);
  console.log(`- Report: ${reportPath}`);
  if (APPLY) console.log(`- Backups: ${join(BACKUP_DIR, COURSE_ID)}`);
  if (APPLY) console.log(`- Applied lessons: ${applyResults.length}`);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
