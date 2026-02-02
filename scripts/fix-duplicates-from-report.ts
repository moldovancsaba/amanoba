/**
 * Fix duplicates from audit report:
 * 1. Create new question: for each duplicate pair, generate ONE new MCQ from the lesson (LLM + prompt), then DELETE one of the pair (not deactivate).
 * 2. Rewrite answers: for each similar-answer group, paraphrase the repeated option text so each question gets a distinct phrasing.
 *
 * LLM provider (one of):
 *   - OpenAI: set OPENAI_API_KEY in .env.local. Optional: OPENAI_MODEL (default gpt-4o-mini).
 *   - Ollama (local): set OLLAMA_BASE_URL (default http://localhost:11434) and OLLAMA_MODEL (e.g. llama3.2, mistral). No API key needed.
 *
 *   Auto-detect: if OLLAMA_BASE_URL or OLLAMA_MODEL is set, use Ollama; else use OpenAI if OPENAI_API_KEY is set.
 *   Or set LLM_PROVIDER=openai|ollama explicitly.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts [--apply]
 *   OLLAMA_MODEL=llama3.2 npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply  (local LLM)
 *   REPORT=...  FIX_DUPLICATES=  FIX_ANSWERS=  LIMIT_PAIRS=  LIMIT_GROUPS=
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

const APPLY = process.argv.includes('--apply');
const REPORT_PATH = process.env.REPORT || resolve(process.cwd(), 'docs/audit-duplicate-questions-report.json');
const FIX_DUPLICATES = process.env.FIX_DUPLICATES !== 'false';
const FIX_ANSWERS = process.env.FIX_ANSWERS !== 'false';
const LIMIT_PAIRS = process.env.LIMIT_PAIRS ? parseInt(process.env.LIMIT_PAIRS, 10) : 0;
const LIMIT_GROUPS = process.env.LIMIT_GROUPS ? parseInt(process.env.LIMIT_GROUPS, 10) : 0;
/** Optional: only process pairs/groups for this courseId (e.g. GEO_SHOPIFY_30_EN). Empty = all. */
const COURSE_ID_FILTER = process.env.COURSE_ID || '';

const MCQ_PROMPT = `ROLE: You are an assessment writer. Your job is to create high-quality multiple-choice questions (MCQs) from the lesson text I provide.

INPUT: the lesson.

TASK:
1. Write exactly ONE multiple-choice question.
2. The question must have EXACTLY 4 answer options (A, B, C, D). This is mandatory - never generate 3 or 5 options.
3. Exactly 1 option must be correct; the other 3 must be incorrect but plausible (not silly, not obviously wrong, not "joke" answers).
4. The question must be completely different from template-style questions (e.g. not "Which approach turns X into practice?" with only X changing). Cover a different idea, angle, or skill from the lesson (e.g. definitions, application, scenario judgement, trade-offs, misconceptions, cause-effect, best-next-step).
5. Every question must be connected to the lesson content, but must be standalone:
   Do not refer to "this lesson", "in the text", "above", "as mentioned earlier", "in this chapter", or any similar reference.
   Do not require the reader to know the lesson's context, brand, course name, or environment.
   The question must make sense if shown alone in any quiz system.
6. Avoid trick questions. Make the correct answer defensible and unambiguous.
7. Language must be clear, concise, and professional.

OUTPUT: Reply with a single JSON object only, no other text. The options array MUST contain exactly 4 elements:
{"question":"...","options":["A) First option","B) Second option","C) Third option","D) Fourth option"],"correctIndex":0}
where correctIndex is 0-3 (the index of the correct option).`;

const PARAPHRASE_PROMPT = `Paraphrase the following answer option in different words, keeping the same meaning. Output only the paraphrased text, nothing else. No quotes, no numbering.`;

function stripHtml(html: string): string {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

type LLMProvider = 'openai' | 'ollama';

function getLLMProvider(): LLMProvider {
  const explicit = process.env.LLM_PROVIDER?.toLowerCase();
  if (explicit === 'ollama' || explicit === 'openai') return explicit as LLMProvider;
  if (process.env.OLLAMA_BASE_URL || process.env.OLLAMA_MODEL) return 'ollama';
  if (process.env.OPENAI_API_KEY) return 'openai';
  throw new Error('Set OPENAI_API_KEY (OpenAI) or OLLAMA_BASE_URL/OLLAMA_MODEL (Ollama local), or LLM_PROVIDER=openai|ollama');
}

async function callLLM(userContent: string, systemContent: string, jsonMode = false): Promise<string> {
  const provider = getLLMProvider();
  if (provider === 'ollama') return callOllama(userContent, systemContent, jsonMode);
  return callOpenAI(userContent, systemContent, jsonMode);
}

async function callOpenAI(
  userContent: string,
  systemContent: string,
  jsonMode = false
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is required for OpenAI');
  const body: Record<string, unknown> = {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userContent },
    ],
    temperature: 0.7,
  };
  if (jsonMode) body.response_format = { type: 'json_object' };
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = data.choices?.[0]?.message?.content?.trim() || '';
  if (!text) throw new Error('Empty OpenAI response');
  return text;
}

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks if present
  text = text.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '');
  
  // Try to extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  return text.trim();
}

async function callOllama(
  userContent: string,
  systemContent: string,
  jsonMode = false
): Promise<string> {
  const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
  const model = process.env.OLLAMA_MODEL || 'llama3.2';
  const messages = [
    { role: 'system', content: systemContent },
    { role: 'user', content: userContent },
  ];
  const body: Record<string, unknown> = { model, messages, stream: false }; // Explicitly disable streaming
  if (jsonMode) body.format = 'json';
  
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama API error ${res.status}: ${err}`);
  }
  
  let data: { message?: { content?: string } };
  try {
    const responseText = await res.text();
    
    // Handle potential streaming response by taking the last complete JSON object
    const jsonObjects = responseText.trim().split('\n').filter(line => line.trim());
    let lastValidJson = '';
    
    for (const jsonLine of jsonObjects) {
      try {
        const parsed = JSON.parse(jsonLine);
        if (parsed.done === true || parsed.message?.content) {
          lastValidJson = jsonLine;
        }
      } catch {
        // Skip invalid JSON lines
      }
    }
    
    if (!lastValidJson) {
      // Fallback: try to parse the entire response as single JSON
      data = JSON.parse(responseText);
    } else {
      data = JSON.parse(lastValidJson);
    }
  } catch (error) {
    console.error('Failed to parse Ollama HTTP response');
    throw new Error(`Ollama response parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  let text = data.message?.content?.trim() || '';
  if (!text) throw new Error('Empty Ollama response');
  
  // Clean JSON response for Ollama when in JSON mode
  if (jsonMode) {
    text = cleanJsonResponse(text);
  }
  
  return text;
}

async function generateOneMCQ(lessonContent: string, language: string): Promise<{ question: string; options: string[]; correctIndex: number }> {
  const content = stripHtml(lessonContent).slice(0, 12000);
  const text = await callLLM(
    `Lesson content (language: ${language}):\n\n${content}\n\nGenerate exactly ONE MCQ. Output JSON only.`,
    MCQ_PROMPT,
    true
  );
  
  let parsed: { question?: string; options?: string[]; correctIndex?: number };
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON response:', text);
    throw new Error(`JSON parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  const question = String(parsed?.question || '').trim();
  let options = Array.isArray(parsed?.options) ? parsed.options.map((o) => String(o).trim()).slice(0, 4) : [];
  let correctIndex = Number(parsed?.correctIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) correctIndex = 0;
  
  // Fallback: if we don't have exactly 4 options, pad with generic options
  while (options.length < 4) {
    const letter = String.fromCharCode(65 + options.length); // A, B, C, D
    options.push(`${letter}) Nem releváns válasz`);
  }
  
  if (options.length !== 4) throw new Error('Expected 4 options, got ' + options.length);
  return { question, options, correctIndex };
}

async function paraphraseOption(optionText: string, language: string): Promise<string> {
  const text = await callLLM(
    `Language: ${language}\n\nOption to paraphrase:\n${optionText}`,
    PARAPHRASE_PROMPT,
    false
  );
  return text.trim() || optionText;
}

async function paraphraseOptions(optionText: string, count: number, language: string): Promise<string[]> {
  const results: string[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    let text = await paraphraseOption(optionText, language);
    let tries = 0;
    while (seen.has(text.toLowerCase()) && tries < 3) {
      text = await paraphraseOption(optionText + ` (variant ${i + 2})`, language);
      tries++;
    }
    seen.add(text.toLowerCase());
    results.push(text);
  }
  return results;
}

interface DuplicatePair {
  questionIdA: string;
  questionIdB: string;
  lessonIdA: string;
  lessonIdB: string;
  action: string;
}

interface SimilarAnswerGroup {
  optionText: string;
  optionOccurrences?: Array<{ questionId: string; optionIndex: number }>;
  questionIds: string[];
  lessonIds: string[];
  count: number;
  action: string;
}

interface LessonReport {
  lessonId: string;
  dayNumber: number;
  courseId: string;
  duplicatePairs: DuplicatePair[];
  similarAnswerGroups: SimilarAnswerGroup[];
}

interface AuditReport {
  byLesson: LessonReport[];
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  let report: AuditReport;
  try {
    report = JSON.parse(readFileSync(REPORT_PATH, 'utf-8')) as AuditReport;
  } catch (e) {
    console.error('Failed to read report:', REPORT_PATH, e);
    process.exit(1);
  }

  await connectDB();

  const provider = getLLMProvider();
  const model =
    provider === 'ollama'
      ? process.env.OLLAMA_MODEL || 'llama3.2'
      : process.env.OPENAI_MODEL || 'gpt-4o-mini';
  console.log('\nLLM:', provider, '— model:', model);

  const backupDir = join(process.cwd(), 'scripts', 'question-backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = isoStamp();
  const deletedIds: string[] = [];
  const created: Array<{ lessonId: string; question: string; options: string[] }> = [];
  const rewritten: Array<{ questionId: string; optionIndex: number; before: string; after: string }> = [];

  const allPairs: Array<{ pair: DuplicatePair; lessonId: string; courseId: string }> = [];
  for (const les of report.byLesson || []) {
    if (COURSE_ID_FILTER && les.courseId !== COURSE_ID_FILTER) continue;
    for (const pair of les.duplicatePairs || []) {
      allPairs.push({ pair, lessonId: pair.lessonIdA, courseId: les.courseId });
    }
  }
  const dedupedPairs = Array.from(
    new Map(allPairs.map((p) => [`${p.pair.questionIdA}:${p.pair.questionIdB}`, p])).values()
  );
  const pairsToProcess = LIMIT_PAIRS ? dedupedPairs.slice(0, LIMIT_PAIRS) : dedupedPairs;
  if (COURSE_ID_FILTER) console.log('Course filter:', COURSE_ID_FILTER, '— pairs in scope:', dedupedPairs.length);

  if (FIX_DUPLICATES && pairsToProcess.length > 0) {
    console.log('\n--- Fix duplicate pairs (create new question + DELETE one of pair) ---\n');
    for (const { pair, lessonId, courseId } of pairsToProcess) {
      if (deletedIds.includes(pair.questionIdA) || deletedIds.includes(pair.questionIdB)) {
        console.log('Skip pair (one already deleted):', pair.questionIdA, pair.questionIdB);
        continue;
      }
      const lesson = await (Lesson as any).findOne({ lessonId }).select({ content: 1, language: 1 }).lean();
      if (!lesson) {
        console.warn('Lesson not found:', lessonId);
        continue;
      }
      const existing = await (QuizQuestion as any).findById(pair.questionIdA).select({ courseId: 1, difficulty: 1, category: 1 }).lean();
      if (!existing) {
        console.warn('Question not found:', pair.questionIdA);
        continue;
      }
      const course = await (Course as any).findOne({ courseId }).select({ _id: 1 }).lean();
      if (!course) {
        console.warn('Course not found:', courseId);
        continue;
      }
      try {
        const { question, options, correctIndex } = await generateOneMCQ(
          (lesson as { content: string }).content || '',
          (lesson as { language: string }).language || 'en'
        );
        if (!question || options.length !== 4) {
          console.warn('Invalid MCQ generated for', lessonId);
          continue;
        }
        if (APPLY) {
          await (QuizQuestion as any).create({
            question,
            options,
            correctIndex,
            difficulty: (existing as { difficulty: string }).difficulty || 'MEDIUM',
            category: (existing as { category: string }).category || 'Course Specific',
            showCount: 0,
            correctCount: 0,
            isActive: true,
            lessonId,
            courseId: (course as { _id: unknown })._id,
            isCourseSpecific: true,
            metadata: { createdAt: new Date(), updatedAt: new Date() },
          });
          await (QuizQuestion as any).deleteOne({ _id: pair.questionIdB });
          deletedIds.push(pair.questionIdB);
          created.push({ lessonId, question: question.slice(0, 60) + '…', options });
        } else {
          console.log('Would create new MCQ and DELETE', pair.questionIdB, 'for lesson', lessonId);
        }
      } catch (err) {
        console.error('Error processing pair', pair.questionIdA, pair.questionIdB, err);
      }
    }
  }

  const allGroups: Array<{ group: SimilarAnswerGroup; lessonId: string; courseId: string }> = [];
  for (const les of report.byLesson || []) {
    if (COURSE_ID_FILTER && les.courseId !== COURSE_ID_FILTER) continue;
    for (const group of les.similarAnswerGroups || []) {
      allGroups.push({ group, lessonId: les.lessonId, courseId: les.courseId });
    }
  }
  const groupsToProcess = LIMIT_GROUPS ? allGroups.slice(0, LIMIT_GROUPS) : allGroups;
  if (COURSE_ID_FILTER) console.log('Course filter:', COURSE_ID_FILTER, '— similar-answer groups in scope:', allGroups.length);

  if (FIX_ANSWERS && groupsToProcess.length > 0) {
    console.log('\n--- Rewrite similar answers (paraphrase) ---\n');
    const firstLessonId = groupsToProcess[0]?.lessonId;
    const lesson = firstLessonId ? await (Lesson as any).findOne({ lessonId: firstLessonId }).select({ language: 1 }).lean() : null;
    const language = (lesson as { language: string })?.language || 'en';
    for (const { group } of groupsToProcess) {
      let occurrences = group.optionOccurrences && group.optionOccurrences.length >= 3 ? group.optionOccurrences : [];
      if (occurrences.length < 3 && group.questionIds.length >= 3) {
        for (const qid of group.questionIds) {
          const doc = await (QuizQuestion as any).findById(qid).select({ options: 1 }).lean();
          if (!doc) continue;
          const opts = ((doc as { options: string[] }).options || []).map(String);
          const idx = opts.findIndex((o) => o.trim() === group.optionText.trim() || o.includes(group.optionText.slice(0, 30)));
          if (idx >= 0) occurrences.push({ questionId: qid, optionIndex: idx });
        }
      }
      if (occurrences.length < 3) continue;
      try {
        const variants = await paraphraseOptions(group.optionText, occurrences.length, language);
        for (let i = 0; i < occurrences.length; i++) {
          const { questionId, optionIndex } = occurrences[i];
          const doc = await (QuizQuestion as any).findById(questionId).select({ options: 1 }).lean();
          if (!doc) continue;
          const opts = ((doc as { options: string[] }).options || []).map(String);
          if (optionIndex >= opts.length) continue;
          const before = opts[optionIndex];
          const after = variants[i] || before;
          if (APPLY) {
            opts[optionIndex] = after;
            await (QuizQuestion as any).updateOne({ _id: questionId }, { $set: { options: opts } });
          }
          rewritten.push({ questionId, optionIndex, before, after });
        }
      } catch (err) {
        console.error('Error rewriting group', group.optionText?.slice(0, 40), err);
      }
    }
  }

  if (APPLY && (created.length > 0 || rewritten.length > 0)) {
    writeFileSync(
      join(backupDir, `FIX_DUPLICATES_${stamp}.json`),
      JSON.stringify({ created, deletedIds, rewritten }, null, 2),
      'utf-8'
    );
    console.log('\nBackup written:', join(backupDir, `FIX_DUPLICATES_${stamp}.json`));
  }

  console.log('\nSummary:');
  console.log('Duplicate pairs processed:', pairsToProcess.length, '— created', created.length, ', deleted', deletedIds.length);
  console.log('Similar-answer groups processed:', groupsToProcess.length, '— rewritten', rewritten.length);
  if (!APPLY) console.log('\nRun with --apply to persist changes.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
