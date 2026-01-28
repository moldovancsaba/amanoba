/**
 * Refine Productivity 2026 AR Lessons (language integrity + quality)
 *
 * Purpose:
 * - Remove Latin/English leakage from Arabic lessons/emails.
 * - Raise lesson quality so strict quiz generation can succeed (0 recall, >=7 valid, >=5 application).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/PRODUCTIVITY_2026_AR/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-ar-lessons.ts --from-day 1 --to-day 30
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-ar-lessons.ts --from-day 1 --to-day 30 --apply
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

const COURSE_ID = getArgValue('--course') || 'PRODUCTIVITY_2026_AR';
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

function sanitizeTitleAr(title: string) {
  let t = String(title || '').trim();
  if (!t) return t;
  // Replace common Latin leak tokens that appear in titles.
  t = t.replace(/\bthroughput\b/gi, 'معدل الإنجاز');
  t = t.replace(/\bcarryover\b/gi, 'المهام المُرحّلة');
  t = t.replace(/\bdeep work\b/gi, 'العمل العميق');
  t = t.replace(/\bgoals\b/gi, 'الأهداف');
  // Remove long Latin segments (hard gate for Arabic).
  t = t.replace(/[A-Za-z]{10,}/g, '');
  t = t.replace(/\(\s*,\s*/g, '(').replace(/\s*,\s*\)/g, ')');
  t = t.replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').trim();
  return t;
}

function translateProcedureStepAr(step: string) {
  const s = String(step || '').trim();
  const exact: Record<string, string> = {
    // P1_PERSONAL_PRODUCTIVITY_DEFINITION
    'List your recurring outputs (activities).': 'اكتب مخرجاتك المتكررة (الأنشطة التي تنتجها باستمرار).',
    'Convert each output into a desired outcome (result).': 'حوّل كل مخرج إلى نتيجة مطلوبة (أثر/مكسب ملموس).',
    'List your constraints (time, energy, attention, resources).': 'اكتب قيودك (الوقت، الطاقة، الانتباه، الموارد).',
    'Write a 2–3 sentence definition of productivity for yourself using outcome/constraints.':
      'اكتب تعريفًا شخصيًا للإنتاجية من 2–3 جمل يربط النتيجة بالقيود.',
    'Pick one improvement lever for the week (reduce constraint waste or increase outcome quality).':
      'اختر رافعة تحسين واحدة لهذا الأسبوع: تقليل هدر القيود أو رفع جودة النتيجة.',

    // P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER
    'Count throughput: completed important outcomes.': 'احسب معدل الإنجاز: عدد النتائج المهمة المكتملة.',
    'Count focus blocks: uninterrupted deep work blocks completed.':
      'احسب كتل التركيز: كتل عمل عميق مكتملة بدون انقطاع.',
    'Count carryover: tasks rolled from last week.': 'احسب المهام المُرحّلة من الأسبوع الماضي.',
    'Write 2 insights: what worked / what broke.': 'اكتب ملاحظتين: ما الذي نجح؟ وما الذي تعطل؟',
    'Make 1 rule change for next week and schedule it.': 'قم بتغيير قاعدة واحدة للأسبوع القادم وحددها في الجدول.',

    // P3_DEEP_WORK_DAY_DESIGN
    'Audit your context switches for one day.': 'قم بتدقيق تبديل السياق لمدة يوم واحد.',
    'Batch similar tasks into fixed windows (e.g., email twice daily).':
      'اجمع المهام المتشابهة في نوافذ ثابتة (مثلًا: البريد مرتين يوميًا).',
    'Schedule 1–3 deep work blocks (90–120 min) with explicit rules.':
      'جدول 1–3 كتل عمل عميق (90–120 دقيقة) مع قواعد واضحة.',
    'Add buffer time and defend it from meetings/messages.': 'أضف وقتًا احتياطيًا واحمه من الاجتماعات/الرسائل.',
    'Track adherence for one week and adjust.': 'تابع الالتزام لمدة أسبوع ثم قم بالتعديل.',

    // P4_TASK_AUDIT_DELEGATE_ELIMINATE
    'List all tasks performed in a week.': 'اكتب كل المهام التي نفذتها خلال أسبوع.',
    'Mark low-value tasks (time cost, low outcome).': 'حدد المهام منخفضة القيمة (تكلفة وقت عالية/نتيجة ضعيفة).',
    'For each low-value task: decide delegate vs eliminate vs keep.':
      'لكل مهمة منخفضة القيمة: قرر التفويض أو الحذف أو الإبقاء.',
    'Write delegation briefs (expected output, due date, success criteria, check-ins).':
      'اكتب ملخص تفويض (المخرج المتوقع، الموعد النهائي، معايير النجاح، نقاط متابعة).',
    'Execute: eliminate 1 and delegate 1 this week; review impact.':
      'نفّذ: احذف شيئًا واحدًا وفوّض مهمة واحدة هذا الأسبوع؛ ثم راجع الأثر.',

    // P5_DECISION_MATRIX_AND_CATEGORIES
    'Define decision category (small/medium/large) based on reversibility and impact.':
      'حدد فئة القرار (صغير/متوسط/كبير) بناءً على قابلية الرجوع والتأثير.',
    'For medium/large: list options and criteria; weight criteria; score options.':
      'للقرارات المتوسطة/الكبيرة: اكتب الخيارات والمعايير؛ أعطِ أوزانًا؛ ثم قيّم الخيارات.',
    'Set an information boundary (time limit / minimum data).': 'ضع حدًا للمعلومات (مهلة زمنية/حد أدنى من البيانات).',
    'Make the 80% decision and implement.': 'اتخذ قرار الـ 80% ثم نفّذه.',
    'Review outcomes and update your decision rules.': 'راجع النتائج وحدّث قواعد اتخاذ القرار لديك.',
  };
  if (exact[s]) return exact[s];
  // Fallback: block English from leaking.
  return 'راجع هذه الخطوة يدويًا (تعذر ترجمة الخطوة تلقائيًا بدون تسريب لغة).';
}

function procedureNameAr(id: string, fallback: string) {
  const map: Record<string, string> = {
    P1_PERSONAL_PRODUCTIVITY_DEFINITION: 'تعريف شخصي للإنتاجية (مخرج → نتيجة → قيود)',
    P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER: 'مراجعة أسبوعية (الإنجاز / كتل التركيز / المهام المُرحّلة)',
    P3_DEEP_WORK_DAY_DESIGN: 'تصميم يوم عمل عميق (كتل + حماية + وقت احتياطي)',
    P4_TASK_AUDIT_DELEGATE_ELIMINATE: 'تدقيق المهام (تفويض مقابل حذف)',
    P5_DECISION_MATRIX_AND_CATEGORIES: 'مصفوفة القرار + فئات القرارات',
  };
  return map[id] || fallback;
}

function buildIntentAr(requiredProcedureIds: string[]) {
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    return 'اليوم تصمم يومك لتقليل تبديل السياق وحماية كتل تركيز عميقة، بحيث يتحول الوقت إلى نتيجة قابلة للقياس.';
  }
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    return 'اليوم تبني حلقة تغذية راجعة أسبوعية: تقيس الإنجاز وكتل التركيز والمهام المُرحّلة ثم تعدّل قاعدة واحدة.';
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    return 'اليوم تقلل الحمل عبر تدقيق المهام: ما الذي تفوضه؟ ما الذي تحذفه؟ وما الذي تبقيه وفق القيود.';
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    return 'اليوم تقلل بطء القرارات عبر مصفوفة قرار وحدود معلومات واضحة، ثم تتخذ قرار 80% وتنفذه.';
  }
  return 'اليوم تربط النشاط بنتائج قابلة للقياس عبر تعريف “مكتمل”، ومعيار، وعتبة نجاح.';
}

function buildGoalsAr(requiredProcedureIds: string[]) {
  const goals: string[] = [];
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    goals.push('قِس 3 أرقام: معدل الإنجاز، كتل التركيز، والمهام المُرحّلة.');
    goals.push('اكتب ملاحظتين: ما الذي نجح؟ وما الذي تعطل؟');
    goals.push('اختر قاعدة واحدة للأسبوع القادم وضعها في الجدول.');
  }
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    goals.push('حدد 1–3 كتل عمل عميق مع قواعد واضحة (منع إشعارات/رسائل).');
    goals.push('اجمع المهام المتشابهة في نوافذ ثابتة بدلًا من التشتت طوال اليوم.');
    goals.push('أضف 20–30% وقتًا احتياطيًا لمنع انهيار الخطة عند المقاطعات.');
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    goals.push('صنّف المهام منخفضة القيمة إلى: تفويض / حذف / إبقاء.');
    goals.push('اكتب ملخص تفويض لمهمة واحدة (مخرج/موعد/معايير/متابعة).');
    goals.push('نفّذ: احذف شيئًا واحدًا وفوّض مهمة واحدة هذا الأسبوع.');
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    goals.push('حدد فئة قرار واحدة اليوم (صغير/متوسط/كبير) وحدد معايير النجاح.');
    goals.push('ضع حدًا للمعلومات: مهلة زمنية أو حد أدنى من البيانات.');
    goals.push('اتخذ قرار 80% ثم نفّذه وحدد موعد مراجعة.');
  }
  if (goals.length < 4) {
    goals.push('اكتب تعريفًا واضحًا لـ “مكتمل” قبل أن تبدأ التنفيذ.');
    goals.push('حدد معيارًا وعتبة نجاح، ثم قارن قبل/بعد.');
  }
  return goals.slice(0, 6);
}

function buildMetricsAr() {
  return [
    'مؤشر: عدد النتائج المهمة المكتملة هذا الأسبوع.',
    'مؤشر: عدد كتل التركيز المكتملة بدون انقطاع.',
    'مؤشر: عدد/نسبة المهام المُرحّلة (لماذا رُحّلت؟).',
    'معيار: تعريف “مكتمل” قابل للتحقق قبل البدء.',
    'عتبة: حد أدنى محدد مسبقًا للنجاح.',
  ];
}

function buildArLessonHtml(params: {
  day: number;
  title: string;
  intent: string;
  goals: string[];
  requiredProcedures: CCSProcedure[];
}) {
  const { day, title, intent, goals, requiredProcedures } = params;

  const procedureBlocks = requiredProcedures
    .map((p) => {
      const stepsAr = (p.steps || []).map(translateProcedureStepAr);
      return (
        `<h3>${escapeHtml(procedureNameAr(p.id, p.name || p.id))}</h3>\n` +
        `<p><em>الهدف:</em> إنتاج مخرج قابل للقياس وربطه بنتيجة (معيار + عتبة).</p>\n` +
        ol(stepsAr)
      );
    })
    .join('\n');

  const exampleText =
    'مثال:\n' +
    '✅ جيد: كتلتان تركيز + مخرج واحد مكتمل + أثر واضح.\n' +
    '❌ سيئ: نشاط كثير (اجتماعات/رسائل) بدون نتيجة قابلة للقياس.';

  const pitfalls = [
    '❌ خطأ: تنفيذ بدون تعريف “مكتمل”. ✅ تصحيح: اكتب معيارًا واضحًا قبل البدء.',
    '❌ خطأ: تغيير كل شيء دفعة واحدة. ✅ تصحيح: قاعدة واحدة + مؤشر واحد + مراجعة أسبوعية.',
    '❌ خطأ: مقاطعات طوال اليوم. ✅ تصحيح: نوافذ ثابتة للرسائل + كتل عمل عميق محمية.',
  ];

  return (
    `<h1>${escapeHtml(`الإنتاجية 2026 — اليوم ${day}`)}</h1>\n` +
    `<h2>${escapeHtml(title)}</h2>\n` +
    `<p><strong>لماذا يهم اليوم؟</strong> ${escapeHtml(intent)}</p>\n` +
    `<h2>أهداف اليوم (نتائج)</h2>\n` +
    ul(goals) +
    `<h2>خطوات قابلة للتنفيذ</h2>\n` +
    (procedureBlocks || `<p>اليوم: قاعدة واحدة + مؤشر واحد + تجربة صغيرة ثم مراجعة.</p>`) +
    `<h2>مثال (جيد vs سيئ)</h2>\n` +
    `<pre>${escapeHtml(exampleText)}</pre>\n` +
    `<h2>أخطاء شائعة وتصحيحات</h2>\n` +
    ul(pitfalls) +
    `<h2>مقاييس ومعايير وعتبات</h2>\n` +
    ul(buildMetricsAr())
  );
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'ar') {
    throw new Error(`Course language is not AR for ${COURSE_ID} (found: ${course.language})`);
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
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'ar' });
    const oldIntegrity = validateLessonRecordLanguageIntegrity({
      language: 'ar',
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

    const nextTitle = sanitizeTitleAr(oldTitle) || oldTitle;
    const nextContent = buildArLessonHtml({
      day,
      title: nextTitle || `الإنتاجية 2026 — اليوم ${day}`,
      intent: buildIntentAr(requiredProcedureIds),
      goals: buildGoalsAr(requiredProcedureIds),
      requiredProcedures,
    });
    const nextScore = assessLessonQuality({ title: nextTitle, content: nextContent, language: 'ar' });

    const emailSubject = `الإنتاجية 2026 – اليوم ${day}: ${nextTitle}`;
    const emailBody =
      `<h1>الإنتاجية 2026 – اليوم ${day}</h1>\n` +
      `<h2>${escapeHtml(nextTitle)}</h2>\n` +
      `<p>${escapeHtml(buildIntentAr(requiredProcedureIds))}</p>\n` +
      `<p><a href=\"${appUrl}/ar/courses/${COURSE_ID}/day/${day}\">افتح الدرس →</a></p>`;

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'ar',
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
